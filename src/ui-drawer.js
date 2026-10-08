/* SAMVAAD POS — the ticket unfolded: full order detail, and the only place a
   not-found product can be put right by hand. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  let currentId = null;

  /* Every mark in this world is drawn, not typed. */
  const WARN = '<span class="warn-glyph" aria-hidden="true"></span>';

  function itemRows(order) {
    const lines = SV.bills.linesOf(order.items);
    return lines
      .map((l, i) => {
        const tax = l.gst ? l.gst + '%' : '—';
        const row =
          '<tr>' +
            '<td><span class="cell-2"><b>' + SV.esc(l.name) + '</b>' +
              (l.pack ? '<small>' + SV.esc(l.pack) + '</small>' : '') +
              (l.claimed != null && l.claimed !== l.unitPrice
                ? '<small>WhatsApp said ' + SV.esc(SV.money(l.claimed)) + '</small>' : '') +
            '</span></td>' +
            '<td class="num">' + SV.qty(l.qty) + '</td>' +
            '<td class="num">' + SV.esc(SV.money(l.unitPrice)) + '</td>' +
            '<td class="num">' + (l.discount ? SV.esc(SV.money(l.discount)) : '—') + '</td>' +
            '<td class="num">' + tax + '</td>' +
            '<td class="num">' + SV.esc(SV.money(l.net)) + '</td>' +
          '</tr>';
        if (!l.unmatched) return row;

        const groups = SV.products.options()
          .map((g) => '<optgroup label="' + SV.esc(g.cat) + '">' + g.items
            .map((p) => '<option value="' + SV.esc(p.id) + '">' + SV.esc(p.name) + ' — ' + SV.esc(SV.money(p.price)) + '</option>')
            .join('') + '</optgroup>')
          .join('');
        return row +
          '<tr><td colspan="6" style="padding-top:0">' +
            '<div class="resolve">' +
              '<span class="flag-bad">' + WARN + ' Product not found</span>' +
              '<span class="msg">' + SV.esc(l.suggested || l.name) + ' could not be priced.</span>' +
              '<select class="input" data-resolve="' + i + '" aria-label="Match this item to a product">' +
                '<option value="">Choose the right product…</option>' + groups +
              '</select>' +
            '</div>' +
          '</td></tr>';
      })
      .join('');
  }

  function trail(order) {
    return SV.orders.FLOW.concat(['cancelled'])
      .map((k) => {
        const hit = order.history.find((h) => h.status === k);
        const done = !!hit;
        const isNow = order.status === k;
        return '<span class="step' + (isNow ? ' is-now' : done ? ' is-done' : '') + '">' +
          SV.esc(SV.orders.LABEL[k]) + (hit ? ' · ' + SV.clock(hit.at) : '') + '</span>';
      })
      .join('<span class="step-arrow" aria-hidden="true"></span>');
  }

  SV.drawer = {
    get currentId() { return currentId; },

    open(orderId) {
      const order = SV.orders.byId(orderId);
      if (!order) return;
      currentId = orderId;
      SV.drawer.drawerHTML(order);
      SV.$('#drawer').hidden = false;
      SV.$('#drawer-scrim').hidden = false;
      const first = SV.$('#drawer .close');
      if (first) first.focus();
    },

    close() {
      currentId = null;
      SV.$('#drawer').hidden = true;
      SV.$('#drawer-scrim').hidden = true;
    },

    refresh() {
      if (!currentId) return;
      const order = SV.orders.byId(currentId);
      if (!order) return SV.drawer.close();
      SV.drawer.drawerHTML(order);
    },

    drawerHTML(order) {
      const e = SV.esc;
      const lines = SV.bills.linesOf(order.items);
      const totals = SV.bills.totalsOf(lines, { delivery: order.delivery === 'delivery' ? 2000 : 0 });
      const units = order.items.reduce((s, l) => s + l.qty, 0);
      const next = SV.orders.nextAction(order);
      const hist = order.customerId ? SV.customers.history(order.customerId) : null;
      const spec = SV.orders.SPEC[order.status];

      const foot = [];
      if (order.status !== 'cancelled' && order.status !== 'completed') {
        foot.push('<button class="btn btn-danger" data-drawer-cancel>Reject order</button>');
      }
      if (!order.billNo && SV.orders.canBill(order)) {
        foot.push('<button class="btn btn-ink" data-bill-open="' + e(order.id) + '">Generate bill</button>');
      }
      if (order.billNo) {
        foot.push('<button class="btn btn-ghost" data-bill-reopen="' + e(order.billNo) + '">Open bill ' + e(order.billNo) + '</button>');
      }
      if (next) {
        foot.push('<button class="btn btn-seal" data-ticket-advance="' + e(order.id) + '">' +
          e(next.label) + '<span class="chev" aria-hidden="true"></span></button>');
      }

      SV.$('#drawer').innerHTML =
        '<header class="drawer-head">' +
          '<div>' +
            '<h2 id="drawer-title">' + e(order.id) + '</h2>' +
            '<p class="src" data-src="' + e(order.source) + '"><i class="src-dot"></i>' +
              (order.source === 'whatsapp' ? 'WhatsApp order' : 'Counter sale') + ' · ' + e(SV.clock(order.createdAt)) + '</p>' +
          '</div>' +
          '<span class="plate" data-ink="' + spec.plate + '">' + e(spec.label) + '</span>' +
          '<button class="btn btn-ghost btn-sm close" data-drawer-close aria-label="Close order">Close</button>' +
        '</header>' +
        '<div class="drawer-body">' +
          '<div class="cust-strip">' +
            '<b>' + e(order.customerName) + '</b>' +
            '<span class="stat mono">' + e(order.phone) + '</span>' +
            (hist && hist.bills
              ? '<span class="stat">' + hist.orders + ' orders on file</span><span class="stat">' +
                SV.money(hist.spend) + ' lifetime</span>'
              : '<span class="stat">First order on this number</span>') +
          '</div>' +

          '<dl class="fact">' +
            '<dt>Received</dt><dd>' + e(SV.clock(order.createdAt)) + ', ' + e(SV.dayLabel(order.createdAt)) + '</dd>' +
            '<dt>Fulfilment</dt><dd>' + (order.delivery === 'delivery' ? 'Delivery' : 'Pickup') + '</dd>' +
            (order.delivery === 'delivery' && order.address
              ? '<dt>Address</dt><dd>' + e(order.address) + '</dd>' : '') +
            '<dt>Payment</dt><dd>' + e(order.payment) + '</dd>' +
            '<dt>Bill</dt><dd>' + (order.billNo ? e(order.billNo) : 'Not generated yet') + '</dd>' +
          '</dl>' +

          (order.notes
            ? '<p class="flag flag-note"><b>From WhatsApp:</b> ' + e(order.notes) + '</p>'
            : '') +

          '<div class="sheet-card"><div class="sheet-scroll"><table class="ledger-table">' +
            '<thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Rate</th>' +
            '<th class="num">Disc</th><th class="num">GST</th><th class="num">Total</th></tr></thead>' +
            '<tbody>' + itemRows(order) + '</tbody>' +
          '</table></div>' +
          '<div class="ledger-totals">' +
            '<div><span class="lab">Subtotal</span><span class="val">' + e(SV.money(totals.subtotal)) + '</span></div>' +
            '<div><span class="lab">CGST</span><span class="val">' + e(SV.money(totals.cgst)) + '</span></div>' +
            '<div><span class="lab">SGST</span><span class="val">' + e(SV.money(totals.sgst)) + '</span></div>' +
            (totals.delivery ? '<div><span class="lab">Delivery</span><span class="val">' + e(SV.money(totals.delivery)) + '</span></div>' : '') +
            '<div class="ledger-grand"><span class="lab">Total</span><span class="val">' + e(SV.money(totals.grand)) + '</span></div>' +
          '</div></div>' +

          '<div class="sheet-card"><header><h3>Order trail</h3></header>' +
            '<div style="padding:0.7rem 0.8rem;display:flex;flex-wrap:wrap;gap:0.25rem 0.15rem;align-items:center">' +
              trail(order) +
            '</div>' +
          '</div>' +

          '<p class="note-strip is-calm"><span>' + units + ' item' + (units === 1 ? '' : 's') +
            ' arrived priced from WhatsApp. Generating the bill re-uses these lines — nothing is re-typed.</span></p>' +
        '</div>' +
        (foot.length ? '<footer class="drawer-foot">' + foot.join('') + '</footer>' : '');
    }
  };

})(window.SV);
