/* SAMVAAD POS — self-check for the money and the order lifecycle.
   Plain script: open tests/index.html in a browser, or run node tests/run.js. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const results = [];
  function ok(name, cond, detail) {
    results.push({ name, pass: !!cond, detail: detail || '' });
  }
  function eq(name, got, want) {
    ok(name, got === want, 'got ' + got + ', want ' + want);
  }

  /* A two-line order built directly, so the checks do not depend on the seed. */
  function freshState() {
    return {
      schema: 1,
      shop: SV.data.shop,
      products: SV.data.products,
      customers: [],
      orders: [],
      bills: [],
      seq: 5000,
      billSeq: 0,
      ui: { sound: false, demo: false, demoGap: 25, paper: '80', connectorOn: false, focus: null },
      conn: { online: true, lastSync: Date.now(), queue: [] }
    };
  }

  function payload(over) {
    return Object.assign({
      order_id: 'SAM-TEST-1',
      source: 'whatsapp',
      customer: { name: 'Rahul Sharma', phone: '+919876543210' },
      items: [
        { product_id: 'MILK001', name: 'Amul Taaza Milk', quantity: 2, unit_price: 30, gst: 5 },
        { product_id: 'BREAD001', name: 'Britannia Bread', quantity: 1, unit_price: 40, gst: 5 },
        { product_id: 'BIS001', name: 'Parle-G Biscuits', quantity: 3, unit_price: 10, gst: 5 }
      ],
      payment_method: 'UPI',
      delivery_type: 'delivery',
      notes: 'Please send fresh items.'
    }, over || {});
  }

  function run() {
    const root = window.__svTestRoot || window;
    root.SV.store.init(freshState);
    SV.store.state.products.forEach((p) => {
      /* Cloud prices arrive per line; the catalogue supplies the GST slab. */
      if (p.id === 'BREAD001') p.gst = 18;
      if (p.id === 'BIS001') p.gst = 18;
    });

    /* ── tax halves ─────────────────────────────────────────────────── */
    eq('pct splits a slab in half', SV.pct(10000, 5), 250);
    eq('pct rounds half up', SV.pct(301, 18), 27);

    /* ── the canonical WhatsApp order prices to a real bill ─────────── */
    const order = SV.orders.receiveNewOrder(payload());
    ok('order arrived', !!order);
    eq('lot number kept', order.id, 'SAM-TEST-1');
    eq('customer resolved by phone', order.customerName, 'Rahul Sharma');
    eq('every line resolved to a product',
      order.items.filter((l) => !l.unmatched).length, 3);

    const bill = SV.bills.fromOrder(order);
    eq('subtotal is the basket', bill.totals.subtotal, 13000);
    eq('CGST across mixed slabs', bill.totals.cgst, 780);
    eq('SGST mirrors CGST', bill.totals.sgst, 780);
    eq('delivery on a delivery order', bill.totals.delivery, 2000);
    eq('grand total', bill.totals.grand, 16560);
    eq('bill inherits the order lines untouched', bill.items.length, order.items.length);
    eq('bill keeps the WhatsApp lot reference', bill.orderId, 'SAM-TEST-1');
    eq('bill never re-keys prices',
      bill.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0), bill.totals.subtotal);

    /* A pickup carries no delivery charge. */
    const pickup = SV.bills.fromOrder(SV.orders.receiveNewOrder(payload({ order_id: 'SAM-TEST-2', delivery_type: 'pickup' })));
    eq('pickup has no delivery charge', pickup.totals.delivery, 0);
    eq('pickup grand total', pickup.totals.grand, 14560);

    /* ── discount ───────────────────────────────────────────────────── */
    const cut = SV.bills.recalc(bill, { discount: 1300 });
    eq('bill discount is taken off the total', cut.totals.grand, 15260);
    eq('discount cannot exceed the basket',
      SV.bills.recalc(bill, { discount: 999999 }).totals.discount, 13000);
    eq('a discount of zero changes nothing',
      SV.bills.recalc(bill, { discount: 0 }).totals.grand, bill.totals.grand);

    /* ── lifecycle ──────────────────────────────────────────────────── */
    const o2 = SV.orders.byId('SAM-TEST-1');
    eq('starts new', o2.status, 'new');
    eq('a new ticket cannot be billed', SV.orders.canBill(o2), false);
    eq('new ticket says accept order', SV.orders.nextAction(o2).label, 'Accept order');

    const expected = ['accepted', 'preparing', 'ready', 'completed'];
    const seen = expected.map(() => {
      SV.orders.advance('SAM-TEST-1');
      return SV.orders.byId('SAM-TEST-1').status;
    });
    eq('lifecycle walks the full path', seen.join('>'), expected.join('>'));
    eq('a completed ticket has no next action', SV.orders.nextAction(SV.orders.byId('SAM-TEST-1')), null);
    eq('every transition is on the trail', SV.orders.byId('SAM-TEST-1').history.length, 5);
    eq('an accepted ticket can be billed',
      SV.orders.canBill(SV.orders.byId('SAM-TEST-1')), true);

    /* ── product matching ───────────────────────────────────────────── */
    const matched = SV.products.resolve({ product_id: 'NOPE1', name: 'Amul Taaza Milk', quantity: 1, unit_price: 30, gst: 5 });
    ok('unknown id falls back to the name', matched.productId === 'MILK001');
    eq('and prices from the catalogue', matched.unitPrice, 3000);

    const missed = SV.products.resolve({ product_id: 'NOPE2', name: 'Amul ghee', quantity: 1, unit_price: 0, gst: 0 });
    eq('an unresolvable line stays unmatched', missed.unmatched, true);
    eq('an unmatched line keeps the WhatsApp wording', missed.suggested, 'Amul ghee');

    SV.products.adopt('SAM-TEST-1', 0, 'MILK002');
    const fixed = SV.orders.byId('SAM-TEST-1').items[0];
    eq('adopting a product clears the flag', fixed.unmatched, false);
    eq('adopting re-prices from the catalogue', fixed.unitPrice, 6200);
    eq('adopting takes the catalogue slab', fixed.gst, 5);

    /* ── intake is idempotent ───────────────────────────────────────── */
    const before = SV.store.state.orders.length;
    SV.orders.receiveNewOrder(payload());
    eq('the same lot number is not taken twice', SV.store.state.orders.length, before);

    /* ── nothing is lost offline ────────────────────────────────────── */
    SV.connector.setOnline(false);
    SV.orders.receiveNewOrder(payload({ order_id: 'SAM-TEST-OFFLINE' }));
    eq('an offline order is held, not dropped', SV.orders.byId('SAM-TEST-OFFLINE').id, 'SAM-TEST-OFFLINE');
    eq('and it queues for sync', SV.connector.queueCount(), 1);
    eq('and it is visible immediately', SV.orders.waitingCount() > 0, true);
    const released = SV.connector.setOnline(true);
    eq('reconnecting releases the queue', released.length, 1);
    eq('and empties it', SV.connector.queueCount(), 0);

    /* ── the honest-hardware rules ──────────────────────────────────── */
    eq('no local connector means browser print', SV.printer.modeLabel(), 'Browser print');
    SV.store.state.ui.connectorOn = true;
    eq('switching the demo connector on changes the label', SV.printer.modeLabel(), 'Local connector');
    SV.store.state.ui.connectorOn = false;

    /* ── the receipt carries the order, not a re-keyed one ──────────── */
    const receipt = SV.printer.previewHTML(SV.bills.fromOrder(SV.orders.receiveNewOrder(payload({ order_id: 'SAM-TEST-3' }))));
    ok('receipt names the lot', receipt.indexOf('SAM-TEST-3') > -1);
    ok('receipt marks the WhatsApp source', /ORDERED ON WHATSAPP/.test(receipt));
    ok('receipt carries every line', /Amul Taaza Milk/.test(receipt) && /Britannia Good Day Bread/.test(receipt) && /Parle-G/.test(receipt));
    ok('receipt prints tax as slabs', /CGST @ 5%/.test(receipt) && /CGST @ 18%/.test(receipt));
    ok('receipt prints the grand total', /TOTAL/.test(receipt));

    return results;
  }

  SV.selfCheck = { run };

  if (typeof module !== 'undefined' && module.exports) module.exports = { run };
  window.__svReady = true;
})(window.SV);