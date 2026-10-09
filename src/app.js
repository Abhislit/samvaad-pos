/* SAMVAAD POS — wiring.
   The whole flow: an order arrives from WhatsApp, it appears in the list, and
   it prints. There is nothing else to wire. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const clone = (v) => JSON.parse(JSON.stringify(v));
  const $ = SV.$;
  const $$ = (sel, root) => (root || document).querySelectorAll(sel);

  /* The demo shop's opening day lives with the rest of the authored data. */
  const seed = SV.data.seed;

  /* ── render ────────────────────────────────────────────────────────── */
  function renderRail() {
    const s = SV.store.state;
    const t = SV.orders.tally();
    $('[data-say]').textContent = t.waiting
      ? t.waiting + ' order' + (t.waiting === 1 ? '' : 's') + ' waiting to print'
      : 'Nothing waiting to print';

    const sound = $('#sound-toggle');
    sound.setAttribute('aria-pressed', String(s.ui.sound));
    sound.title = s.ui.sound ? 'Mute arrival sound (M)' : 'Unmute arrival sound (M)';
    $('#demo-btn').setAttribute('aria-pressed', String(s.ui.demo));
    $('#tray-btn').textContent = 'Tray: ' + SV.printer.paperLabel();
  }

  function renderFoot() {
    const t = SV.orders.tally();
    $('[data-printed]').innerHTML = t.printedToday
      ? '<b>' + t.printedToday + '</b> printed today · <b>' + SV.money(t.sales) + '</b>'
      : 'Nothing printed yet today';
  }

  /* ── the two slides ──────────────────────────────────────────────────
     To print and printed, side by side under the tabs. One slides in, the
     other slides out: the counter is not left behind in another window, and
     neither is it buried under a long printed pile. */
  let view = 'to-print';
  const lastCounts = { toPrint: -1, printed: -1 };
  const tickUntil = { toPrint: 0, printed: 0 };

  function renderSections() {
    const bar = $('#section-bar');
    const toPrint = SV.store.state.orders.filter((o) => !o.printedAt).length;
    const printed = SV.store.state.orders.filter((o) => o.printedAt).length;
    const tab = (key, label, n) =>
      '<button class="section-tab" role="tab" data-view="' + key + '" id="tab-' + key + '"' +
        ' aria-controls="slide-' + key + '" aria-selected="' + (view === key) + '">' +
        label + '<span class="section-n">' + n + '</span></button>';

    bar.innerHTML =
      tab('to-print', 'To print', toPrint) +
      tab('printed', 'Printed', printed) +
      (toPrint
        ? '<button class="btn btn-seal btn-sm section-all" data-print-all>' +
          'Print all ' + toPrint + '<span class="chev" aria-hidden="true"></span></button>'
        : '');

    /* Tick only a count that actually changed. The bar rebuilds on every store
       update, so animating unconditionally would celebrate nothing. The tick
       window survives an immediate duplicate render: an arrival writes once
       and the order event renders again with the same counts. */
    const now = Date.now();
    const tick = (key, next, lastKey) => {
      if (next !== lastCounts[lastKey]) {
        lastCounts[lastKey] = next;
        tickUntil[lastKey] = now + 260;
      }
      const n = bar.querySelector('[data-view="' + key + '"] .section-n');
      if (n && now < tickUntil[lastKey] && !calm().matches) n.classList.add('is-ticking');
    };
    tick('to-print', toPrint, 'toPrint');
    tick('printed', printed, 'printed');
  }

  function render() {
    SV.board.render($('#board'));
    renderRail();
    renderFoot();
    renderSections();
    /* The slide you are not looking at must be hidden from assistive tech too,
       not just faded out — it is in the DOM either way. Set here rather than
       only on a switch, so the very first paint is already honest. */
    $$('.tray').forEach((tray) => tray.setAttribute('aria-hidden', String(tray.dataset.tray !== view)));
  }

  function show(next) {
    if (next === view) return;
    view = next;
    $('#board').setAttribute('data-slide', view);
    render();

    /* Both trays travel, keyed rather than transitioned. Every other movement
       in this app is a keyframe — the arrival, the slide, the stamp — and a
       transition needs a committed start value that headless Chrome will not
       give us, so the same mechanism is used here for the same reason.

       The class has to be on before the browser paints the rebuilt board, which
       it is: render() writes innerHTML, this runs immediately after, and the
       next frame is the first one that shows. */
    if (!calm().matches) {
      const incoming = SV.$('.tray[data-tray="' + next + '"]');
      const outgoing = SV.$('.tray[data-tray="' + (next === 'printed' ? 'to-print' : 'printed') + '"]');
      if (outgoing) outgoing.classList.add('is-sliding-out');
      if (incoming) {
        incoming.classList.add('is-sliding-in');
        incoming.addEventListener('animationend', (ev) => {
          if (ev.target !== incoming || ev.animationName !== 'slide-in') return;
          incoming.classList.remove('is-sliding-in');
        });
      }
    }

    window.scrollTo({ top: 0, behavior: calm().matches ? 'auto' : 'smooth' });
  }

  /* ── the flow ──────────────────────────────────────────────────────── */
  function simulate() {
    SV.orders.receiveNewOrder(SV.data.makeIncoming(SV.store.state));
  }

  const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)');

  /* How long a motion takes, read from the same token its keyframe is timed by,
     so retiming an animation cannot leave the sequence waiting on a number
     that no longer exists. */
  const ms = (name, fallback) => parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name)) || fallback;

  /* ── approve ─────────────────────────────────────────────────────────
     The stamp comes down, contacts, and leaves APPROVED on the ticket. The
     plate is painted by the press, not swapped in under it: the arm is placed
     exactly where the plate will end up, so the press appears to leave it. */
  function approve(id) {
    const order = SV.orders.byId(id);
    if (!order || !SV.orders.canApprove(order)) return;

    if (calm().matches) {
      SV.orders.approve(id);
      SV.notifications.say('Approved · ' + order.id + ' · ' + order.customerName);
      return;
    }

    const row = SV.$('.row[data-order="' + id + '"]');
    const plate = row && row.querySelector('.plate');
    SV.board.approving(id);
    render();

    const landed = SV.$('.row[data-order="' + id + '"]');
    const target = landed && landed.querySelector('.plate');
    if (landed && target) {
      const box = target.getBoundingClientRect();
      const host = landed.getBoundingClientRect();
      const arm = SV.el('<span class="stamp-arm">Approve</span>');
      arm.style.left = (box.left - host.left) + 'px';
      arm.style.top = (box.top - host.top) + 'px';
      landed.appendChild(arm);
      arm.addEventListener('animationend', (ev) => {
        if (ev.target !== arm || ev.animationName !== 'stamp') return;
        SV.orders.approve(id);
        arm.remove();
        SV.notifications.say('Approved · ' + order.id + ' · ' + order.customerName);
      }, { once: true });
    } else {
      /* No row to stamp on: do the work rather than leave the order stuck. */
      setTimeout(() => SV.orders.approve(id), ms('--stamp-ms', 520));
    }
  }

  function printOrder(id) {
    const order = SV.orders.byId(id);
    if (!order || order.printedAt || !order.approvedAt) return;

    /* The print happens in two beats. First the head runs down the ticket
       while it is still unprinted; then the ticket is marked printed and
       travels down into the printed pile. Printing it first and animating
       second shows the press landing on a ticket that has already left.

       The drawer closes up front: it is the end of the operator's look at
       this order, and leaving it open for the pass would hide the machine
       behind it. */
    SV.drawer.close();
    if (calm().matches) return finishPrint(id);

    SV.board.printing(id);
    render();
    setTimeout(() => finishPrint(id), ms('--head-ms', 460));
  }

  function finishPrint(id) {
    SV.orders.markPrinted(id);
    const printed = SV.orders.byId(id);
    SV.printer.print(printed);
    SV.notifications.say(
      printed.billNo + ' printed · ' + printed.customerName + ' · ' +
      SV.money(SV.orders.money(printed).totals.grand)
    );
  }

  /* ── print again ──────────────────────────────────────────────────────
     A printed ticket keeps its bill number, so a reprint is the same receipt
     coming out of the machine a second time — not a new bill. */
  function reprintOrder(id) {
    const order = SV.orders.byId(id);
    if (!order || !order.printedAt) return;
    SV.printer.print(order);
    SV.notifications.say('Reprinting ' + order.billNo + ' · ' + order.customerName);
  }

  /* ── print all ────────────────────────────────────────────────────────
     Every waiting ticket goes out. Each sheet is fed so the operator sees
     what is being printed, then the whole stack goes to the printer in one
     job: a batch must never open a dialog per receipt. */
  let batchRunning = false;

  async function printAll() {
    if (batchRunning) return;
    const waiting = SV.orders.all()
      .filter((o) => !o.printedAt)
      .sort((a, b) => a.createdAt - b.createdAt);
    if (!waiting.length) return;

    batchRunning = true;
    const btn = $('[data-print-all]');
    if (btn) { btn.disabled = true; btn.textContent = 'Printing…'; }

    /* Bill numbers first, so the sheets on screen carry the numbers they will
       carry on paper. */
    const stamped = waiting.map((o) => {
      SV.orders.markPrinted(o.id);
      return SV.orders.byId(o.id);
    });

    try {
      SV.notifications.ratchet();
      await SV.printer.feedAll(stamped);
      SV.printer.handTo(stamped);
      const total = stamped.reduce((sum, o) => sum + SV.orders.money(o).totals.grand, 0);
      SV.notifications.say(
        stamped.length + ' bills printed · ' +
        SV.money(total) + ' · ' + stamped[0].billNo + '–' + stamped[stamped.length - 1].billNo
      );
    } finally {
      batchRunning = false;
      render();
    }
  }

  function toggleDemo() {
    SV.store.update((s) => { s.ui.demo = !s.ui.demo; });
    if (SV.store.state.ui.demo) SV.orders.startDemo();
    else SV.orders.stopDemo();
    SV.notifications.say(SV.store.state.ui.demo
      ? 'Demo mode on. An order will arrive every ' + SV.store.state.ui.demoGap + ' seconds.'
      : 'Demo mode off.');
  }

  /* ── events ────────────────────────────────────────────────────────── */
  function wire() {
    document.addEventListener('samvaad:order', (ev) => {
      /* Marked before the render, because render() consumes the mark. */
      if (ev.detail && ev.detail.order) SV.board.arriving(ev.detail.order.id);
      render();
      SV.notifications.play();
    });

    document.addEventListener('click', (ev) => {
      const pick = (sel) => ev.target.closest(sel);

      const approveBtn = pick('[data-approve]');
      if (approveBtn) return approve(approveBtn.dataset.approve);

      /* Scoped to the bar on purpose. The board carries its own view attribute
         for the slide, and an unscoped closest() here matched the board for
         every click inside it — which swallowed Print again and sent the
         operator back to the queue instead of reprinting. */
      const tab = pick('#section-bar [data-view]');
      if (tab) return show(tab.dataset.view);

      if (pick('[data-print-all]')) return printAll();

      const reprint = pick('[data-reprint]');
      if (reprint) return reprintOrder(reprint.dataset.reprint);

      const print = pick('[data-print]');
      if (print) return printOrder(print.dataset.print);

      const drop = pick('[data-drop]');
      if (drop) return SV.board.toggleDrop(drop.dataset.drop);

      const open = pick('[data-open]');
      if (open) return SV.drawer.open(open.dataset.open);

      if (pick('[data-close]')) return SV.drawer.close();

      const id = ev.target.id;
      if (id === 'simulate-btn') return simulate();
      if (id === 'sound-toggle') return SV.notifications.toggle();
      if (id === 'demo-btn') return toggleDemo();
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
        return;
      }
      const typing = /^(INPUT|SELECT|TEXTAREA)$/.test(ev.target.tagName);
      if (typing || ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (ev.key === 'm' || ev.key === 'M') return SV.notifications.toggle();
      if (ev.key === 's' || ev.key === 'S') {
        ev.preventDefault();
        simulate();
      }
    });
  }

  /* ── boot ──────────────────────────────────────────────────────────── */
  function boot() {
    SV.store.init(seed);
    document.body.setAttribute('data-paper', SV.store.state.ui.paper);
    wire();
    $('#board').setAttribute('data-slide', view);
    SV.store.subscribe(render);
    render();
  }

  document.addEventListener('DOMContentLoaded', boot);
})(window.SV);