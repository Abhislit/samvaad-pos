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

  /* ── the section bar ─────────────────────────────────────────────────
     One bar, pinned under the rail. It says which section you are in, how
     much is in each, and takes you back to the queue from the bottom of a
     long printed pile. */
  function renderSections() {
    const bar = $('#section-bar');
    const toPrint = SV.store.state.orders.filter((o) => !o.printedAt).length;
    const printed = SV.store.state.orders.filter((o) => o.printedAt).length;
    bar.innerHTML =
      '<button class="section-tab" data-jump="to-print" aria-current="true">' +
        'To print<span class="section-n">' + toPrint + '</span></button>' +
      '<button class="section-tab" data-window="printed.html">' +
        'Printed<span class="section-n">' + printed + '</span>' +
        '<span class="tab-go" aria-hidden="true"></span></button>' +
      (toPrint
        ? '<button class="btn btn-seal btn-sm section-all" data-print-all>' +
          'Print all ' + toPrint + '<span class="chev" aria-hidden="true"></span></button>'
        : '');
    /* Measured after the content is in, not assumed: the bar wraps to two rows
       on a narrow phone, and the jump offset has to agree with the bar the
       reader is actually looking at. */
    document.documentElement.style.setProperty('--section-bar-h', bar.offsetHeight + 'px');
  }

  /* Which section the reader is actually in: the last one whose top has passed
     the bar. Two sections, so scroll maths beats an observer. */
  function syncSection() {
    const bar = $('#section-bar');
    const line = $('#section-bar').getBoundingClientRect().bottom;
    const trays = $$('.tray');
    let current = trays.length ? trays[0].dataset.tray : 'to-print';
    trays.forEach((tray) => { if (tray.getBoundingClientRect().top <= line + 1) current = tray.dataset.tray; });
    /* At the foot of the page the last section is whatever is on screen, whatever
       the maths says: a short page cannot scroll a tray up under the bar, so
       without this a jump to Printed on a busy desk would leave the tab on
       To print while the printed pile filled the screen. */
    const atFoot = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 1;
    if (atFoot && trays.length) current = trays[trays.length - 1].dataset.tray;
    $$('.section-tab').forEach((tab) => {
      const on = tab.dataset.jump === current;
      tab.classList.toggle('is-current', on);
      if (on) tab.setAttribute('aria-current', 'true');
      else tab.removeAttribute('aria-current');
    });
  }

  function render() {
    SV.board.render($('#board'));
    renderRail();
    renderFoot();
    renderSections();
    syncSection();
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

      const jump = pick('[data-jump]');
      if (jump) {
        const tray = SV.$('.tray[data-tray="' + jump.dataset.jump + '"]');
        if (tray) tray.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      /* Printed opens its own window: the printed pile is reference material,
         and a shop that wants it on a second screen or beside the till should
         not have to lose the counter to go and look at it. Named, so a second
         click focuses the window already open instead of stacking another. */
      const win = pick('[data-window]');
      if (win) {
        const opened = window.open(win.dataset.window, 'samvaad-printed',
          'width=900,height=1000,noopener=no');
        if (!opened) SV.notifications.say('Your browser blocked the printed window.');
        return;
      }

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
    SV.store.subscribe(render);
    render();
    /* The bar follows the reader as the printed pile scrolls past. */
    window.addEventListener('scroll', syncSection, { passive: true });
    window.addEventListener('resize', syncSection);
  }

  document.addEventListener('DOMContentLoaded', boot);
})(window.SV);