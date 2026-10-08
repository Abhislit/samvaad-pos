/* SAMVAAD POS — the printed window.
   What the counter sends you to when you click PRINTED: every bill that has
   gone out today, and Print again on each. It reads the same store as the
   counter, so it re-reads on every store change and after printing. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const $ = SV.$;

  function render() {
    const s = SV.store.state;
    const t = SV.orders.tally();

    $('[data-say]').textContent = t.printedToday
      ? t.printedToday + ' bill' + (t.printedToday === 1 ? '' : 's') + ' printed today'
      : 'Nothing printed yet today';

    $('#tray-btn').textContent = 'Tray: ' + SV.printer.paperLabel();
    document.body.setAttribute('data-paper', s.ui.paper);

    const printed = SV.orders.all()
      .filter((o) => o.printedAt)
      .sort((a, b) => b.printedAt - a.printedAt);

    $('#board').innerHTML = printed.length
      ? '<section class="tray" data-tray="printed" aria-label="Printed">' +
          '<div class="tray-body">' + SV.board.rowsOf(printed) + '</div>' +
        '</section>'
      : '<div class="board-empty"><b>No bills printed yet</b>' +
        '<p>Anything this counter prints shows up here, with its bill number.</p></div>';

    $('[data-printed]').innerHTML = t.printedToday
      ? '<b>' + t.printedToday + '</b> printed today · <b>' + SV.money(t.sales) + '</b>'
      : 'Nothing printed yet today';
  }

  function reprint(id) {
    const order = SV.orders.byId(id);
    if (!order || !order.printedAt) return;
    SV.printer.print(order);
    SV.notifications.say('Reprinting ' + order.billNo + ' · ' + order.customerName);
  }

  function boot() {
    SV.store.init(SV.data.seed);
    wire();
    SV.store.subscribe(render);
    render();

    /* The counter carries on after this window opens. Same origin, so its
       writes arrive here as storage events. Without this the window sits
       showing seven bills while the till prints five more and the operator
       reprints from a list that no longer matches the day. */
    window.addEventListener('storage', (ev) => {
      if (ev.key !== SV.store.KEY || !ev.newValue) return;
      SV.store.init(SV.data.seed);
      render();
    });
  }

  function wire() {
    document.addEventListener('click', (ev) => {
      const pick = (sel) => ev.target.closest(sel);

      const reprintBtn = pick('[data-reprint]');
      if (reprintBtn) return reprint(reprintBtn.dataset.reprint);

      const drop = pick('[data-drop]');
      if (drop) return SV.board.toggleDrop(drop.dataset.drop);

      const open = pick('[data-open]');
      if (open) return SV.drawer.open(open.dataset.open);

      if (pick('[data-close]')) return SV.drawer.close();

      const id = ev.target.id;
      if (id === 'counter-btn') return window.close();
      if (id === 'tray-btn') {
        const order = ['58', '80', 'a4'];
        const next = order[(order.indexOf(SV.store.state.ui.paper) + 1) % order.length];
        SV.store.update((s) => {
          s.ui.paper = next;
          document.body.setAttribute('data-paper', next);
        });
        return;
      }
    });

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        if (SV.board.anyDropped()) return SV.board.collapseAll();
        if (!$('#drawer').hidden) return SV.drawer.close();
        return window.close();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', boot);
})(window.SV);