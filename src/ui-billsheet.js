/* SAMVAAD POS — the bill sheet: the shop's own ledger, printed.
   Opened from an order, the line items are inherited. Products are never
   re-keyed; only discount, payment and customer details are editable. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  let working = null;

  const DELIVERY = { delivery: 'Delivery', pickup: 'Pickup' };

  function itemRows(bill) {
    const e = SV.esc;
    return bill.lines
      .map((l) =>
        '<tr>' +
          '<td><span class="cell-2"><span class="nm"><b>' + e(l.name) + '</b></span>' +
            '<small>' + e(l.pack || '—') + (l.gst ? ' · GST ' + l.gst + '%' : ' · no GST') + '</small></span></td>' +
          '<td class="num">' + SV.qty(l.qty) + '</td>' +
          '<td class="num">' + e(SV.money(l.unitPrice)) + '</td>' +
          '<td class="num">' + (l.discount ? e(SV.money(l.discount)) : '—') + '</td>' +
          '<td class="num">' + e(SV.money(l.cgst + l.sgst)) + '</td>' +
          '<td class="num">' + e(SV.money(l.net)) + '</td>' +
        '</tr>'
      )
      .join('');
  }

  function counterPicker() {
    const groups = SV.products.options()
      .map((g) => '<optgroup label="' + SV.esc(g.cat) + '">' + g.items
        .map((p) => '<option value="' + SV.esc(p.id) + '">' + SV.esc(p.name) + ' — ' + SV.esc(SV.money(p.price)) + '</option>')
        .join('') + '</optgroup>')
      .join('');
    return (
      '<div class="edit-row">' +
        '<div class="field" style="grid-column:span 3">' +
          '<label class="field-l" for="counter-pick">Add to this bill</label>' +
          '<select class="input" id="counter-pick"><option value="">Choose a product…</option>' + groups + '</select>' +
        '</div>' +
        '<div class="field"><label class="field-l" for="counter-qty">Qty</label>' +
          '<input class="input" id="counter-qty" type="number" min="1" value="1" inputmode="numeric"></div>' +
        '<div class="field" style="justify-content:end">' +
          '<button class="btn btn-ink btn-block" data-counter-add>Add line</button></div>' +
      '</div>'
    );
  }

  function render(bill) {
    const e = SV.esc;
    const s = SV.store.state;
    const t = bill.totals;
    const order = bill.orderId ? SV.orders.byId(bill.orderId) : null;

    const totalsRows =
      '<div class="ledger-totals">' +
        '<div><span class="lab">Subtotal</span><span class="val">' + e(SV.money(t.subtotal)) + '</span></div>' +
        (t.lineDiscount ? '<div><span class="lab">Item discount</span><span class="val">−' + e(SV.money(t.lineDiscount)) + '</span></div>' : '') +
        (t.discount ? '<div><span class="lab">Bill discount</span><span class="val">−' + e(SV.money(t.discount)) + '</span></div>' : '') +
        '<div><span class="lab">CGST</span><span class="val">' + e(SV.money(t.cgst)) + '</span></div>' +
        '<div><span class="lab">SGST</span><span class="val">' + e(SV.money(t.sgst)) + '</span></div>' +
        (t.delivery ? '<div><span class="lab">Delivery charge</span><span class="val">' + e(SV.money(t.delivery)) + '</span></div>' : '') +
        '<div class="ledger-grand"><span class="lab">Grand total</span><span class="val">' + e(SV.money(t.grand)) + '</span></div>' +
      '</div>';

    const picker = bill.orderId ? '' : counterPicker();

    SV.$('#billsheet').innerHTML =
      '<div class="billsheet-bar">' +
        '<h2>' + e(bill.billNo) + '</h2>' +
        '<span class="tag tag-demo">Demo data</span>' +
        (bill.orderId ? '<span class="mono" style="font-size:.6875rem;opacity:.7">from ' + e(bill.orderId) + '</span>' : '') +
        '<button class="btn btn-ghost btn-sm" data-bill-close>Close</button>' +
        '<button class="btn btn-seal btn-sm" data-bill-print>' +
          '<span class="icon-print" aria-hidden="true"></span>Print bill</button>' +
      '</div>' +
      '<div class="billsheet-scroll">' +
        '<div class="ledger-head">' +
          '<div class="ledger-shop">' +
            '<b id="bill-shop">' + e(s.shop.name) + '</b>' +
            '<p>' + e(s.shop.line2) + '</p>' +
            '<p class="mono">' + e(s.shop.phone) + ' · GSTIN ' + e(s.shop.gstin) + ' · UPI ' + e(s.shop.upi) + '</p>' +
          '</div>' +
          '<div class="ledger-nos">' +
            '<div><span>Bill</span><b>' + e(bill.billNo) + '</b></div>' +
            '<div><span>Date</span><b>' + e(SV.clock(bill.createdAt)) + '</b></div>' +
            '<div><span>' + e(SV.dayLabel(bill.createdAt)) + '</span></div>' +
            (bill.orderId ? '<div><span>Order</span><b>' + e(bill.orderId) + '</b></div>' : '<div><span>Type</span><b>Counter sale</b></div>') +
          '</div>' +
        '</div>' +

        '<div class="ledger-grid">' +
          '<div class="ledger-box"><h4>Customer</h4>' +
            '<div class="rows">' +
              '<div><span class="lab">Name</span><span><input class="input" data-bill-field="name" value="' + e(bill.customer.name) + '" aria-label="Customer name"></span></div>' +
              '<div><span class="lab">Phone</span><span><input class="input mono" data-bill-field="phone" value="' + e(bill.customer.phone) + '" aria-label="Customer phone"></span></div>' +
              '<div><span class="lab">Address</span><span><input class="input" data-bill-field="address" value="' + e(bill.customer.address) + '" aria-label="Customer address"></span></div>' +
            '</div>' +
          '</div>' +
          '<div class="ledger-box"><h4>Order</h4>' +
            '<div class="rows">' +
              '<div><span class="lab">Fulfilment</span><span>' + e(DELIVERY[bill.delivery || 'pickup']) + '</span></div>' +
              '<div><span class="lab">Source</span><span>' + (bill.source === 'whatsapp' ? 'WhatsApp' : 'Counter') + '</span></div>' +
              '<div><span class="lab">Lines</span><span>' + bill.lines.length + '</span></div>' +
              (order && order.notes ? '<div><span class="lab">Note</span><span>' + e(order.notes) + '</span></div>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +

        '<table class="ledger-items">' +
          '<thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Rate</th>' +
          '<th class="num">Disc</th><th class="num">GST amt</th><th class="num">Total</th></tr></thead>' +
          '<tbody>' + (bill.lines.length ? itemRows(bill) : '<tr><td colspan="6" style="color:var(--ink-faint)">No items yet. Add a line below.</td></tr>') + '</tbody>' +
        '</table>' +

        totalsRows +

        picker +

        '<div class="ledger-foot">' +
          '<span>Printer mode: <b>' + e(SV.printer.modeLabel()) + '</b> · tray ' + e(String(SV.store.state.ui.paper)) + '</span>' +
          '<span>' + e(s.shop.filingNote) + '</span>' +
          '<span class="stamp">' + e(bill.billNo) + '</span>' +
        '</div>' +
      '</div>' +
      /* The sheet's money controls live in a bar of their own: a shopkeeper
         changing a discount must never have to scroll to reach Save. */
      '<footer class="billsheet-foot">' +
        '<div class="field"><label class="field-l" for="bill-discount">Discount ₹</label>' +
          '<input class="input" id="bill-discount" type="number" min="0" step="1" inputmode="numeric" data-bill-field="discount" value="' + (t.discount / 100) + '"></div>' +
        '<div class="field"><label class="field-l" for="bill-delivery">Delivery ₹</label>' +
          '<input class="input" id="bill-delivery" type="number" min="0" step="1" inputmode="numeric" data-bill-field="delivery" value="' + (t.delivery / 100) + '"></div>' +
        '<div class="field"><label class="field-l" for="bill-payment">Payment</label>' +
          '<select class="input" id="bill-payment" data-bill-field="payment">' +
            SV.data.payments.map((p) => '<option' + (p === bill.payment ? ' selected' : '') + '>' + e(p) + '</option>').join('') +
          '</select></div>' +
        '<button class="btn btn-ink" data-bill-save>Save bill</button>' +
      '</footer>';
  }

  SV.billsheet = {
    get working() { return working; },

    open(orderId) {
      const order = SV.orders.byId(orderId);
      if (!order) return;
      SV.drawer.close();
      working = SV.bills.fromOrder(order, { createdAt: order.createdAt });
      working.delivery = order.delivery;
      SV.billsheet.show();
    },

    openBill(billNo) {
      const saved = SV.bills.byNo(billNo);
      if (!saved) return;
      SV.drawer.close();
      working = JSON.parse(JSON.stringify(saved));
      working.lines = SV.bills.linesOf(working.items);
      SV.billsheet.show();
    },

    /* A walk-in customer has no WhatsApp order behind them. Same sheet, no
       inherited lines, one picker instead of a re-keyed basket. */
    newCounterBill() {
      const draft = {
        id: null,
        source: 'counter',
        customerId: null,
        customerName: 'Walk-in customer',
        phone: '',
        address: '',
        items: [],
        payment: 'Cash',
        delivery: 'pickup',
        notes: '',
        status: 'new',
        createdAt: Date.now()
      };
      working = SV.bills.fromOrder(draft);
      working.delivery = 'pickup';
      SV.billsheet.show();
    },

    show() {
      SV.$('#billsheet').hidden = false;
      SV.$('#bill-scrim').hidden = false;
      render(working);
      const first = SV.$('#billsheet input');
      if (first) first.focus();
    },

    close() {
      working = null;
      SV.$('#billsheet').hidden = true;
      SV.$('#bill-scrim').hidden = true;
    },

    refresh() { if (working) render(working); },

    /* Field edits recompute on the spot; nothing here touches the order. */
    onField(target) {
      const key = target.dataset.billField;
      if (!key || !working) return;
      if (key === 'discount' || key === 'delivery') {
        const rupees = Math.max(0, Number(target.value) || 0);
        const total = SV.bills.totalsOf(SV.bills.linesOf(working.items), {
          discount: key === 'discount' ? Math.round(rupees * 100) : working.totals.discount,
          delivery: key === 'delivery' ? Math.round(rupees * 100) : working.totals.delivery
        });
        working.totals = total;
        return SV.billsheet.refresh();
      }
      if (key === 'payment') { working.payment = target.value; return; }
      working.customer[key] = target.value;
    },

    addLine(productId, qty) {
      const p = SV.products.byId(productId);
      if (!p || !working) return;
      const found = working.items.find((l) => l.productId === p.id);
      if (found) found.qty += qty;
      else working.items.push(SV.products.line(p, qty));
      working.lines = SV.bills.linesOf(working.items);
      working.totals = SV.bills.totalsOf(working.lines, {
        discount: working.totals.discount,
        delivery: working.totals.delivery
      });
      SV.billsheet.refresh();
    },

    save() {
      if (!working) return null;
      if (!working.lines.length) {
        SV.notifications.say('Add at least one item before saving the bill.', 'bad');
        return null;
      }
      const bill = SV.bills.save({
        billNo: working.billNo,
        orderId: working.orderId,
        source: working.source,
        customerId: working.customerId,
        customer: working.customer,
        delivery: working.delivery,
        items: working.items,
        lines: working.lines,
        totals: working.totals,
        payment: working.payment,
        createdAt: working.createdAt
      });
      SV.notifications.say('Bill ' + bill.billNo + ' saved · ' + SV.money(bill.totals.grand));
      return bill;
    }
  };

})(window.SV);