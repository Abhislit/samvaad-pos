/* SAMVAAD POS — the list.
   One list of orders: what has arrived from WhatsApp and is waiting to print,
   then what has gone out. No lanes, no lifecycle, nothing to keep in step. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const e = SV.esc;

  /* Every mark in this world is drawn, not typed. */
  const WARN = '<span class="warn-glyph" aria-hidden="true"></span>';

  /* Which rows are dropped open. View state, never persisted. */
  const dropped = new Set();

  function detailHTML(order) {
    const { lines } = SV.orders.money(order);
    return '<div class="row-detail">' +
      '<ul class="row-lines">' +
        lines.map((l) =>
          '<li' + (l.unmatched ? ' class="is-unmatched"' : '') + '>' +
            '<span class="q">' + SV.qty(l.qty) + '</span>' +
            '<span class="nm">' + (l.unmatched ? WARN : '') + e(l.name) + '</span>' +
            '<span class="amt">' + e(SV.money(l.qty * l.unitPrice)) + '</span>' +
          '</li>'
        ).join('') +
      '</ul>' +
      (order.notes ? '<p class="flag flag-note">' + e(order.notes) + '</p>' : '') +
    '</div>';
  }

  function rowHTML(order) {
    const { totals } = SV.orders.money(order);
    const units = order.items.reduce((s, l) => s + l.qty, 0);
    const unmatched = order.items.filter((l) => l.unmatched).length;
    const printed = SV.orders.printed(order);
    const open = dropped.has(order.id);

    const flag = unmatched
      ? '<span class="row-flag" title="SAMVAAD could not price ' + unmatched + ' item' +
        (unmatched > 1 ? 's' : '') + ' on this order.">' + WARN +
        '<span class="sr">' + unmatched + ' product' + (unmatched > 1 ? 's' : '') + ' not found</span></span>'
      : '';

    return '<article class="row' + (printed ? ' is-printed' : '') + (open ? ' is-dropped' : '') +
      '" data-order="' + e(order.id) + '" tabindex="-1">' +
      '<div class="row-top">' +
        '<span class="plate" data-ink="' + (printed ? 'printed' : order.source) + '">' +
          e(printed ? 'Printed' : order.source === 'whatsapp' ? 'WhatsApp' : 'Counter') + '</span>' +
        '<button class="row-lot" data-open="' + e(order.id) + '">' + e(order.id) + '</button>' +
        '<span class="row-when mono">' + e(SV.clock(order.createdAt)) + '</span>' +
        '<span class="row-total"><i>₹</i><b>' + SV.amount(totals.grand) + '</b></span>' +
        '<button class="caret" data-drop="' + e(order.id) + '" aria-expanded="' + (open ? 'true' : 'false') +
          '" aria-label="' + (open ? 'Hide' : 'Show') + ' what ' + e(order.id) + ' contains">' +
          '<span class="caret-mark" aria-hidden="true"></span></button>' +
      '</div>' +
      '<div class="row-bot">' +
        '<button class="row-who" data-open="' + e(order.id) + '">' +
          '<span class="nm">' + e(order.customerName) + '</span>' +
          '<span class="row-count">' + units + ' item' + (units === 1 ? '' : 's') + '</span>' +
        '</button>' +
        flag +
        (printed
          ? '<span class="row-when row-was">' + e(SV.clock(order.printedAt)) + '</span>'
          : '<button class="btn btn-seal btn-sm" data-print="' + e(order.id) + '">' +
            'Print bill<span class="chev" aria-hidden="true"></span></button>') +
      '</div>' +
      (open ? detailHTML(order) : '') +
    '</article>';
  }

  SV.board = {
    render(host) {
      /* Waiting first, newest first. Printed orders sink underneath. */
      const orders = SV.orders.all().slice().sort((a, b) => {
        if (!!a.printedAt !== !!b.printedAt) return a.printedAt ? 1 : -1;
        return b.createdAt - a.createdAt;
      });
      const waiting = orders.filter((o) => !o.printedAt);

      if (!orders.length) {
        host.innerHTML = '<div class="board-empty">' +
          '<b>No orders yet</b>' +
          '<p>Orders sent to the shop on WhatsApp appear here on their own. ' +
          'Press <em>Simulate order</em> to send one.</p>' +
        '</div>';
        return;
      }
      host.innerHTML = (waiting.length
        ? ''
        : '<p class="board-clear"><b>All clear.</b> Every order has been printed.</p>') +
        orders.map(rowHTML).join('');
    },

    /* Drop one row open or shut, in place. Rebuilding the list here would
       destroy the button you just pressed and drop focus to the body. */
    toggleDrop(id) {
      const row = SV.$('.row[data-order="' + id + '"]');
      if (!row) return;
      const caret = row.querySelector('.caret');
      const detail = row.querySelector('.row-detail');

      if (detail) {
        detail.remove();
        dropped.delete(id);
        row.classList.remove('is-dropped');
        caret.setAttribute('aria-expanded', 'false');
        caret.setAttribute('aria-label', 'Show what ' + id + ' contains');
        return;
      }
      const order = SV.orders.byId(id);
      if (!order) return;
      row.querySelector('.row-bot').after(SV.el(detailHTML(order)));
      dropped.add(id);
      row.classList.add('is-dropped');
      caret.setAttribute('aria-expanded', 'true');
      caret.setAttribute('aria-label', 'Hide what ' + id + ' contains');
    },

    collapseAll() {
      dropped.clear();
      SV.$$('.row-detail').forEach((n) => n.remove());
      SV.$$('.caret[aria-expanded="true"]').forEach((c) => {
        c.setAttribute('aria-expanded', 'false');
        c.setAttribute('aria-label', 'Show what ' + c.dataset.drop + ' contains');
      });
      SV.$$('.row.is-dropped').forEach((r) => r.classList.remove('is-dropped'));
    },

    anyDropped() { return dropped.size > 0; }
  };
})(window.SV);