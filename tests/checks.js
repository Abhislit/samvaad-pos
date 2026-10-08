/* SAMVAAD POS — self-check.
   The whole product is one path: an order arrives priced, and it prints. These
   are the checks on that path. Plain script: node tests/run.js, or open this
   through tests/index.html in a browser. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const results = [];
  const ok = (name, cond, detail) => results.push({ name, pass: !!cond, detail: detail || '' });
  const eq = (name, got, want) => ok(name, got === want, 'got ' + got + ', want ' + want);

  function freshState() {
    return {
      schema: 1,
      shop: SV.data.shop,
      products: SV.data.products,
      orders: [],
      seq: 5000,
      billSeq: 0,
      ui: { sound: false, demo: false, demoGap: 25, paper: '80', connectorOn: false },
      conn: { online: true, lastSync: Date.now() }
    };
  }

  /* The exact payload SAMVAAD cloud hands the local POS. */
  function payload(over) {
    return Object.assign({
      order_id: 'SAM-TEST-1',
      source: 'whatsapp',
      customer: { name: 'Rahul Sharma', phone: '+919876543210' },
      items: [
        { product_id: 'MILK001', name: 'Amul Taaza Milk', quantity: 2, unit_price: 30, gst: 0 },
        { product_id: 'BREAD001', name: 'Britannia Bread', quantity: 1, unit_price: 40, gst: 0 },
        { product_id: 'BIS001', name: 'Parle-G Biscuits', quantity: 3, unit_price: 10, gst: 0 }
      ],
      payment_method: 'UPI',
      delivery_type: 'delivery',
      address: 'Flat 302, FC Road',
      notes: 'Please send fresh items.'
    }, over || {});
  }

  function run() {
    SV.store.init(freshState);

    /* ── tax halves ─────────────────────────────────────────────────── */
    eq('pct splits a slab in half', SV.pct(10000, 5), 250);
    eq('pct rounds half up', SV.pct(301, 18), 27);

    /* ── the order arrives priced, from the cloud's product IDs ─────── */
    const order = SV.orders.receiveNewOrder(payload());
    ok('order arrived', !!order);
    eq('lot number kept', order.id, 'SAM-TEST-1');
    eq('customer name kept', order.customerName, 'Rahul Sharma');
    eq('phone read back the way a bill prints it', order.phone, '+91 98765 43210');
    eq('every line matched a product', order.items.filter((l) => !l.unmatched).length, 3);
    eq('nothing is printed until it is', order.printedAt, null);

    /* ── the money on the receipt ───────────────────────────────────── */
    const { lines, totals } = SV.orders.money(order);
    eq('subtotal is the basket', totals.subtotal, 13000);
    eq('CGST across mixed slabs', totals.cgst, 780);
    eq('SGST mirrors CGST', totals.sgst, 780);
    eq('delivery on a delivery order', totals.delivery, 2000);
    eq('grand total', totals.grand, 16560);
    eq('three lines billed', lines.length, 3);

    const pickup = SV.orders.money(
      SV.orders.receiveNewOrder(payload({ order_id: 'SAM-TEST-2', delivery_type: 'pickup' }))
    ).totals;
    eq('pickup carries no delivery charge', pickup.delivery, 0);
    eq('pickup grand total', pickup.grand, 14560);

    /* ── tax prints by slab, not per item ───────────────────────────── */
    const slabs = SV.bills.slabs(lines);
    eq('one row per distinct slab', slabs.length, 2);
    eq('5% slab', slabs[0].rate, 5);
    eq('18% slab', slabs[1].rate, 18);

    /* ── printing ends the ticket ───────────────────────────────────── */
    const printed = SV.orders.markPrinted('SAM-TEST-1');
    ok('markPrinted returns the order', !!printed);
    ok('printed at a time', !!SV.orders.byId('SAM-TEST-1').printedAt);
    ok('bill number assigned', /^B-\d{5}$/.test(SV.orders.byId('SAM-TEST-1').billNo));
    eq('the same ticket will not print twice', SV.orders.markPrinted('SAM-TEST-1'), null);
    eq('the same bill number is kept', SV.orders.byId('SAM-TEST-1').billNo, SV.orders.byId('SAM-TEST-1').billNo);

    /* ── intake is idempotent ───────────────────────────────────────── */
    const before = SV.store.state.orders.length;
    SV.orders.receiveNewOrder(payload());
    eq('a repeated lot number is not taken twice', SV.store.state.orders.length, before);

    /* ── product matching ───────────────────────────────────────────── */
    const byName = SV.products.resolve({ product_id: 'NOPE1', name: 'Amul Taaza Milk', quantity: 1, unit_price: 30, gst: 0 });
    ok('an unknown id falls back to the name', byName.productId === 'MILK001');
    eq('and prices from the catalogue, not the cloud', byName.unitPrice, 3000);

    const missed = SV.products.resolve({ product_id: 'NOPE2', name: 'Amul ghee', quantity: 1, unit_price: 0, gst: 0 });
    eq('an unresolvable line stays unmatched', missed.unmatched, true);
    eq('an unmatched line keeps the WhatsApp wording', missed.suggested, 'Amul ghee');
    eq('an unmatched line is not silently free', SV.bills.linesOf([missed])[0].net, 0);

    /* ── the receipt carries the order, not a re-keyed one ──────────── */
    const receipt = SV.printer.receiptFor
      ? SV.printer.receiptFor(order)
      : '';
    ok('receipt names the lot', receipt.indexOf('SAM-TEST-1') > -1);
    ok('receipt marks the WhatsApp source', /ORDERED ON WHATSAPP/.test(receipt));
    ok('receipt carries every line',
      /Amul Taaza Milk/.test(receipt) && /Britannia Good Day Bread/.test(receipt) && /Parle-G/.test(receipt));
    ok('receipt prints tax by slab', /CGST @ 5%/.test(receipt) && /CGST @ 18%/.test(receipt));
    ok('receipt prints the grand total', /TOTAL/.test(receipt) && /165\.60/.test(receipt));
    ok('receipt prints the bill number', /B-00001/.test(receipt));

    /* ── the hardware stays honest ──────────────────────────────────── */
    eq('no local connector means browser print', SV.printer.modeLabel(), 'Browser print');
    SV.store.state.ui.connectorOn = true;
    eq('switching the demo connector on changes the label', SV.printer.modeLabel(), 'Local connector');
    SV.store.state.ui.connectorOn = false;
    eq('default tray is 80 mm', SV.printer.paperLabel(), '80 mm');

    /* ── the counter's number exists in one place ───────────────────── */
    SV.store.state.orders.length = 0;
    SV.orders.receiveNewOrder(payload({ order_id: 'SAM-A' }));
    SV.orders.receiveNewOrder(payload({ order_id: 'SAM-B' }));
    eq('two waiting', SV.orders.tally().waiting, 2);
    SV.orders.markPrinted('SAM-A');
    eq('printing drops it out of waiting', SV.orders.tally().waiting, 1);
    eq('and counts as printed today', SV.orders.tally().printedToday, 1);
    ok('and the day total is real arithmetic', SV.orders.tally().sales === 16560);

    return results;
  }

  SV.selfCheck = { run };
})(window.SV);