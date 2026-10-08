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

  /* An order the machine is still holding, and a ticket whose print is running.
     One-shot, not persisted: the class is added, the animation runs once, and
     the element leaves the DOM on the next render. */
  let arrivingId = null;
  let printingId = null;
  let approvingId = null;

  const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── the machine ──────────────────────────────────────────────────────
     The board reorders itself constantly: an arrival pushes everything down,
     a print drops one ticket out of the waiting pile and into the printed one.
     Rebuilding innerHTML teleports all of it. So the board measures where
     each ticket was, rebuilds, then puts each ticket back where it came from
     and lets it travel. A ticket with no previous position was not there a
     moment ago, and that is the arrival — it comes out of the slot instead. */
  function snapshot(host) {
    const map = new Map();
    if (calm().matches) return map;
    SV.$$('.row[data-order]', host).forEach((row) => {
      const r = row.getBoundingClientRect();
      if (r.width || r.height) map.set(row.dataset.order, { top: r.top, left: r.left });
    });
    return map;
  }

  function settle(host, before) {
    if (!before.size) return;
    const moved = [];
    SV.$$('.row[data-order]', host).forEach((row) => {
      const prev = before.get(row.dataset.order);
      if (!prev) return;
      const r = row.getBoundingClientRect();
      const dy = prev.top - r.top;
      const dx = prev.left - r.left;
      if (Math.abs(dy) < 0.5 && Math.abs(dx) < 0.5) return;
      row.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      moved.push(row);
    });
    if (!moved.length) return;
    /* One commit, then release together: a class beats writing a style per
       node, and every ticket keeps the same curve. */
    moved.forEach((row) => row.classList.add('is-moving'));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        moved.forEach((row) => { row.classList.add('is-sliding'); });
        moved.forEach((row) => row.addEventListener('animationend', (ev) => {
          /* Only our own slide counts. The stamp press on .plate and the
             drop-in on .row-detail also finish and bubble up here. */
          if (ev.target !== row || ev.animationName !== 'slide') return;
          row.classList.remove('is-moving', 'is-sliding');
          row.style.transform = '';
        }));
      });
    });
  }

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
    const approved = SV.orders.approved(order);
    const open = dropped.has(order.id);

    /* The two one-shot machine states. Rendered into the ticket that is
       mid-motion and into nothing else. */
    const arriving = !printed && !calm().matches && order.id === arrivingId;
    const printing = approved && !printed && !calm().matches && order.id === printingId;
    const approving = SV.orders.canApprove(order) && !calm().matches && order.id === approvingId;

    const flag = unmatched
      ? '<span class="row-flag" title="SAMVAAD could not price ' + unmatched + ' item' +
        (unmatched > 1 ? 's' : '') + ' on this order.">' + WARN +
        '<span class="sr">' + unmatched + ' product' + (unmatched > 1 ? 's' : '') + ' not found</span></span>'
      : '';

    return '<article class="row' + (printed ? ' is-printed' : '') + (open ? ' is-dropped' : '') +
      (arriving ? ' is-arriving' : '') + (printing ? ' is-printing' : '') +
      (approving ? ' is-approving' : '') +
      '" data-order="' + e(order.id) + '" tabindex="-1">' +
      '<div class="row-top">' +
        '<span class="plate" data-ink="' +
          (printed ? 'printed' : approved ? 'approved' : order.source) + '">' +
          e(printed ? 'Printed' : approved ? 'Approved' : order.source === 'whatsapp' ? 'WhatsApp' : 'Counter') +
        '</span>' +
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
          ? '<span class="row-when row-was">' + e(SV.clock(order.printedAt)) + '</span>' +
            '<button class="btn btn-ghost btn-sm" data-reprint="' + e(order.id) + '">' +
              'Print again<span class="chev" aria-hidden="true"></span></button>'
          : approved
            ? '<button class="btn btn-seal btn-sm" data-print="' + e(order.id) + '">' +
              'Print bill<span class="chev" aria-hidden="true"></span></button>'
            : '<button class="btn btn-seal btn-sm" data-approve="' + e(order.id) + '">' +
              'Approve<span class="chev" aria-hidden="true"></span></button>') +
      '</div>' +
      (open ? detailHTML(order) : '') +
    '</article>';
  }

  SV.board = {
    /* ── two trays ────────────────────────────────────────────────────
       To print, and printed. Not one list with the finished orders sinking
       under the queue: an operator needs to see what is done as much as what
       is not, and reprinting needs a home. */
    render(host) {
      const all = SV.orders.all();
      const byNewest = (a, b) => b.createdAt - a.createdAt;
      const toPrint = all.filter((o) => !o.printedAt).sort(byNewest);
      const printed = all.filter((o) => o.printedAt).sort((a, b) => b.printedAt - a.printedAt);

      const before = snapshot(host);

      if (!all.length) {
        host.innerHTML = '<div class="board-empty">' +
          '<b>No orders yet</b>' +
          '<p>Orders sent to the shop on WhatsApp appear here on their own. ' +
          'Press <em>Simulate order</em> to send one.</p>' +
        '</div>';
        return;
      }

      host.innerHTML =
        '<section class="tray" data-tray="to-print" aria-label="To print">' +
          '<div class="tray-body">' +
            (toPrint.length
              ? toPrint.map(rowHTML).join('')
              : '<p class="tray-empty">Nothing waiting. Every order has been printed.</p>') +
          '</div>' +
        '</section>' +
        '<section class="tray" data-tray="printed" aria-label="Printed">' +
          '<div class="tray-body">' +
            (printed.length
              ? printed.map(rowHTML).join('')
              : '<p class="tray-empty">Nothing printed yet today.</p>') +
          '</div>' +
        '</section>';

      settle(host, before);
      arrivingId = null;
      printingId = null;
      approvingId = null;
    },

    /* The arrival is the machine's own movement: a new ticket comes out of
       the slot rather than fading in. */
    arriving(id) { arrivingId = id; },

    /* The print runs before the ticket leaves the board, so the paper warms
       and the head passes while it is still the operator's to look at. */
    printing(id) { printingId = id; },

    /* The stamp comes down onto the ticket and leaves its plate behind. */
    approving(id) { approvingId = id; },

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