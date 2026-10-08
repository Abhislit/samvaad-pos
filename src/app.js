/* SAMVAAD POS — wiring.
   The whole flow: an order arrives from WhatsApp, it appears in the list, and
   it prints. There is nothing else to wire. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const clone = (v) => JSON.parse(JSON.stringify(v));
  const $ = SV.$;

  /* ── seed ────────────────────────────────────────────────────────────
     A shop mid-morning: some orders waiting, some already printed. */
  function seed() {
    const d = SV.data;
    const now = Date.now();
    const state = {
      schema: 1,
      shop: clone(d.shop),
      products: clone(d.products),
      orders: [],
      seq: 10293,
      billSeq: 0,
      ui: { sound: false, demo: false, demoGap: 25, paper: '80', connectorOn: false },
      conn: { online: true, lastSync: now }
    };

    const byName = (n) => state.products.length && d.customers.find((c) => c.name === n);
    const item = (id, qty) => {
      const prod = d.products.find((x) => x.id === id);
      return { product_id: prod.id, name: prod.name, quantity: qty, unit_price: prod.price / 100, gst: prod.gst };
    };

    const script = [
      { mins: 1, printed: false, c: 'Rahul Sharma', d: 'delivery', p: 'UPI', n: 'Please send fresh items.',
        i: [item('MILK001', 2), item('BREAD001', 1), item('BIS001', 3)] },
      { mins: 4, printed: false, c: 'Kavita Menon', d: 'delivery', p: 'UPI', n: 'Ring the bell twice, I am on the second floor.',
        i: [item('MILK003', 2), item('TEA001', 1), item('BIS002', 1)] },
      { mins: 7, printed: false, c: 'Suresh Kadam', d: 'pickup', p: 'Cash', n: '',
        i: [item('TOM001', 2), item('ONI001', 1), item('POT001', 3)] },
      { mins: 9, printed: false, c: 'Imran Sheikh', d: 'delivery', p: 'WhatsApp Pay', n: 'Keep the change ready.',
        i: [{ product_id: 'UNMAPPED772', name: 'Amul ghee', quantity: 1, unit_price: 0, gst: 0 }, item('EGG001', 1)] },
      { mins: 12, printed: false, c: 'Sunita Deshmukh', d: 'delivery', p: 'UPI', n: '',
        i: [item('BUT001', 1), item('BREAD001', 2)] },
      { mins: 22, printed: true, c: 'Arvind Patil', d: 'pickup', p: 'Cash', n: 'Send before 6 PM.',
        i: [item('OIL001', 1), item('ATA001', 1), item('SAL001', 2)] },
      { mins: 31, printed: true, c: 'Meera Joshi', d: 'delivery', p: 'UPI', n: 'Please check the expiry on the milk.',
        i: [item('MILK001', 4), item('CHE001', 1), item('COC001', 2)] },
      { mins: 44, printed: true, c: 'Deepak Rao', d: 'delivery', p: 'Card', n: '',
        i: [item('HOM001', 1), item('COL001', 1), item('MST001', 2)] },
      { mins: 63, printed: true, c: 'Anita Bhatt', d: 'pickup', p: 'UPI', n: 'Leave it with the watchman if I am out.',
        i: [item('SOAP001', 1), item('DET001', 2)] },
      { mins: 95, printed: true, c: 'Fatima Ansari', d: 'delivery', p: 'UPI', n: '',
        i: [item('RAJ001', 1), item('SOY001', 1), item('SUG001', 1)] },
      { mins: 140, printed: true, c: 'Rahul Sharma', d: 'delivery', p: 'UPI', n: '',
        i: [item('MILK001', 3), item('BIS001', 2), item('MAG001', 2)] },
      { mins: 210, printed: true, c: 'Kavita Menon', d: 'pickup', p: 'Cash', n: '',
        i: [item('BAN001', 2), item('TEA001', 1)] }
    ];

    script.forEach((row, n) => {
      const cust = byName(row.c);
      state.orders.push({
        id: 'SAM-' + (10293 - n),
        source: 'whatsapp',
        customerName: cust.name,
        phone: cust.phone,
        address: row.d === 'delivery' ? cust.address : '',
        items: row.i.map((raw) => SV.products.resolve(raw, state.products)),
        payment: row.p,
        delivery: row.d,
        notes: row.n,
        createdAt: now - row.mins * 60000,
        printedAt: row.printed ? now - (row.mins - 3) * 60000 : null,
        billNo: null
      });
    });

    state.seq = 10293 + script.length;
    state.orders.filter((o) => o.printedAt)
      .sort((a, b) => a.printedAt - b.printedAt)
      .forEach((o) => {
        state.billSeq += 1;
        o.billNo = 'B-' + String(state.billSeq).padStart(5, '0');
      });
    return state;
  }

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

  function render() {
    SV.board.render($('#board'));
    renderRail();
    renderFoot();
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
  }

  document.addEventListener('DOMContentLoaded', boot);
})(window.SV);