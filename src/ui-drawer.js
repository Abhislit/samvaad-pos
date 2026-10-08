/* SAMVAAD POS — the order, opened.
   The one place the whole order is laid out. Everything here is read-only:
   it arrived priced from WhatsApp and printing it is the only thing to do. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const e = SV.esc;
  const WARN = '<span class="warn-glyph" aria-hidden="true"></span>';
  let currentId = null;

  function itemRows(lines) {
    return lines.map((l) =>
      '<tr' + (l.unmatched ? ' class="is-unmatched"' : '') + '>' +
        '<td><span class="cell-2"><b>' + (l.unmatched ? WARN : '') + e(l.name) + '</b>' +
          '<small>' + e(l.pack || '—') + (l.gst ? ' · GST ' + l.gst + '%' : ' · no GST') + '</small>' +
          (l.unmatched ? '<small class="cell-warn">Not priced — SAMVAAD could not match this line</small>' : '') +
        '</span></td>' +
        '<td class="num">' + SV.qty(l.qty) + '</td>' +
        '<td class="num">' + e(SV.money(l.unitPrice)) + '</td>' +
        '<td class="num">' + e(SV.money(l.cgst + l.sgst)) + '</td>' +
        '<td class="num">' + e(SV.money(l.net)) + '</td>' +
      '</tr>'
    ).join('');
  }

  function body(order) {
    const { lines, totals } = SV.orders.money(order);
    const units = order.items.reduce((s, l) => s + l.qty, 0);

    return '<header class="drawer-head">' +
        '<div>' +
          '<h2 id="drawer-title">' + e(order.id) + '</h2>' +
          '<p class="src"><i class="src-dot"></i>' +
            (order.source === 'whatsapp' ? 'Ordered on WhatsApp' : 'Counter sale') + ' · ' +
            e(SV.clock(order.createdAt)) + '</p>' +
        '</div>' +
        '<button class="btn btn-ghost btn-sm close" data-close aria-label="Close order">Close</button>' +
      '</header>' +
      '<div class="drawer-body">' +
        '<div class="cust-strip">' +
          '<b>' + e(order.customerName) + '</b>' +
          (order.phone ? '<span class="stat mono">' + e(order.phone) + '</span>' : '') +
        '</div>' +

        '<dl class="fact">' +
          '<dt>Received</dt><dd>' + e(SV.clock(order.createdAt)) + ', ' + e(SV.dayLabel(order.createdAt)) + '</dd>' +
          '<dt>Fulfilment</dt><dd>' + (order.delivery === 'delivery' ? 'Delivery' : 'Pickup') + '</dd>' +
          (order.address && order.delivery === 'delivery'
            ? '<dt>Address</dt><dd>' + e(order.address) + '</dd>' : '') +
          '<dt>Payment</dt><dd>' + e(order.payment) + '</dd>' +
          '<dt>Bill</dt><dd>' + (order.printedAt
            ? e(order.billNo) + ', printed ' + e(SV.clock(order.printedAt))
            : 'Not printed yet') + '</dd>' +
        '</dl>' +

        (order.notes ? '<p class="flag flag-note"><b>From WhatsApp:</b> ' + e(order.notes) + '</p>' : '') +

        '<div class="sheet-card"><div class="sheet-scroll"><table class="ledger-table">' +
          '<thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Rate</th>' +
          '<th class="num">GST</th><th class="num">Total</th></tr></thead>' +
          '<tbody>' + itemRows(lines) + '</tbody>' +
        '</table></div>' +
        '<div class="ledger-totals">' +
          '<div><span class="lab">Subtotal</span><span class="val">' + e(SV.money(totals.subtotal)) + '</span></div>' +
          '<div><span class="lab">CGST</span><span class="val">' + e(SV.money(totals.cgst)) + '</span></div>' +
          '<div><span class="lab">SGST</span><span class="val">' + e(SV.money(totals.sgst)) + '</span></div>' +
          (totals.delivery ? '<div><span class="lab">Delivery</span><span class="val">' + e(SV.money(totals.delivery)) + '</span></div>' : '') +
          '<div class="ledger-grand"><span class="lab">Total</span><span class="val">' + e(SV.money(totals.grand)) + '</span></div>' +
        '</div></div>' +

        '<p class="note-strip is-calm"><span>' + units + ' item' + (units === 1 ? '' : 's') +
          ' arrived priced from WhatsApp. Printing bills these same lines — nothing is re-typed.</span></p>' +
      '</div>' +
      '<footer class="drawer-foot">' +
        (order.printedAt
          ? '<button class="btn btn-ghost btn-block" disabled>Printed ' + e(SV.clock(order.printedAt)) + '</button>'
          : '<button class="btn btn-seal btn-block" data-print="' + e(order.id) + '">' +
            'Print bill<span class="chev" aria-hidden="true"></span></button>') +
      '</footer>';
  }

  SV.drawer = {
    get currentId() { return currentId; },

    open(id) {
      const order = SV.orders.byId(id);
      if (!order) return;
      currentId = id;
      SV.$('#drawer').innerHTML = body(order);
      SV.$('#drawer').hidden = false;
      const close = SV.$('#drawer .close');
      if (close) close.focus();
    },

    close() {
      currentId = null;
      SV.$('#drawer').hidden = true;
      SV.$('#drawer').innerHTML = '';
    },

    /* The drawer only needs redrawing when the thing it shows changed. */
    refresh() {
      if (!currentId) return;
      const order = SV.orders.byId(currentId);
      if (!order) return SV.drawer.close();
      SV.$('#drawer').innerHTML = body(order);
    }
  };
})(window.SV);