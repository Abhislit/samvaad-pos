/* SAMVAAD POS — wiring.
   Order in: WhatsApp payload (or the demo timer) -> SV.orders.receiveNewOrder.
   Order out: ticket on the board -> stamp -> bill -> print. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const e = SV.esc;
  const $ = SV.$;

  let currentScreen = 'board';
  const TRAY_TABS = { board: 1, preparing: 1, ready: 1, completed: 1 };

  /* ── seed ──────────────────────────────────────────────────────────── */
  const clone = (v) => JSON.parse(JSON.stringify(v));

  function seed() {
    const d = SV.data;
    const now = Date.now();
    const state = {
      schema: 1,
      shop: clone(d.shop),
      products: clone(d.products),
      customers: clone(d.customers),
      orders: [],
      bills: [],
      seq: 10293,
      billSeq: 0,
      ui: { sound: false, demo: false, demoGap: 25, paper: '80', connectorOn: false, focus: null },
      conn: { online: true, lastSync: now, queue: [] }
    };

    const byName = (n) => state.customers.find((c) => c.name === n);
    const item = (id, qty) => {
      const prod = d.products.find((x) => x.id === id);
      return { product_id: prod.id, name: prod.name, quantity: qty, unit_price: prod.price / 100, gst: prod.gst };
    };

    /* Twelve tickets across the lifecycle, so the trays are not empty on open
       and the day already has arithmetic behind it. */
    const script = [
      { mins: 1, status: 'new', c: 'Rahul Sharma', d: 'delivery', p: 'UPI', n: 'Please send fresh items.',
        i: [item('MILK001', 2), item('BREAD001', 1), item('BIS001', 3)] },
      { mins: 4, status: 'new', c: 'Kavita Menon', d: 'delivery', p: 'UPI', n: 'Ring the bell twice, I am on the second floor.',
        i: [item('MILK003', 2), item('TEA001', 1), item('BIS002', 1)] },
      { mins: 7, status: 'new', c: 'Suresh Kadam', d: 'pickup', p: 'Cash', n: '',
        i: [item('TOM001', 2), item('ONI001', 1), item('POT001', 3)] },
      { mins: 9, status: 'new', c: 'Imran Sheikh', d: 'delivery', p: 'WhatsApp Pay', n: 'Keep the change ready.',
        i: [{ product_id: 'UNMAPPED772', name: 'Amul ghee', quantity: 1, unit_price: 0, gst: 0 }, item('EGG001', 1)] },
      { mins: 13, status: 'accepted', c: 'Sunita Deshmukh', d: 'delivery', p: 'UPI', n: '',
        i: [item('BUT001', 1), item('BREAD001', 2)] },
      { mins: 22, status: 'preparing', c: 'Arvind Patil', d: 'pickup', p: 'Cash', n: 'Send before 6 PM.',
        i: [item('OIL001', 1), item('ATA001', 1), item('SAL001', 2)] },
      { mins: 31, status: 'preparing', c: 'Meera Joshi', d: 'delivery', p: 'UPI', n: 'Please check the expiry on the milk.',
        i: [item('MILK001', 4), item('CHE001', 1), item('COC001', 2)] },
      { mins: 44, status: 'ready', c: 'Deepak Rao', d: 'delivery', p: 'Card', n: '',
        i: [item('HOM001', 1), item('COL001', 1), item('MST001', 2)] },
      { mins: 63, status: 'ready', c: 'Anita Bhatt', d: 'pickup', p: 'UPI', n: 'Leave it with the watchman if I am out.',
        i: [item('SOAP001', 1), item('DET001', 2)] },
      { mins: 95, status: 'completed', c: 'Fatima Ansari', d: 'delivery', p: 'UPI', n: '',
        i: [item('RAJ001', 1), item('SOY001', 1), item('SUG001', 1)] },
      { mins: 140, status: 'completed', c: 'Rahul Sharma', d: 'delivery', p: 'UPI', n: '',
        i: [item('MILK001', 3), item('BIS001', 2), item('MAG001', 2)] },
      { mins: 210, status: 'completed', c: 'Kavita Menon', d: 'pickup', p: 'Cash', n: '',
        i: [item('BAN001', 2), item('TEA001', 1)] }
    ];

    const PATH = ['new', 'accepted', 'preparing', 'ready', 'completed'];

    script.forEach((row, n) => {
      const cust = byName(row.c);
      const at = now - row.mins * 60000;
      state.orders.push({
        id: 'SAM-' + (10293 - n),
        source: 'whatsapp',
        customerId: cust.id,
        customerName: cust.name,
        phone: cust.phone,
        address: row.d === 'delivery' ? cust.address : '',
        items: row.i.map((raw) => SV.products.resolve(raw, state.products)),
        payment: row.p,
        delivery: row.d,
        notes: row.n,
        status: row.status,
        createdAt: at,
        discount: 0,
        billNo: null,
        history: PATH.slice(0, PATH.indexOf(row.status) + 1).map((status, i) => ({
          status,
          at: at + (i + 1) * 90000
        }))
      });
    });

    state.seq = 10293 + script.length;

    /* Completed tickets get a bill in the book, so today's sales are real
       arithmetic over real seeded lines rather than a number typed in. The
       seed cannot go through the store — it runs before the state exists — so
       the ledger maths is applied directly here. */
    state.orders
      .filter((o) => o.status === 'completed')
      .reverse()
      .forEach((o) => {
        const lines = SV.bills.linesOf(o.items);
        const totals = SV.bills.totalsOf(lines, { delivery: o.delivery === 'delivery' ? 2000 : 0 });
        state.billSeq += 1;
        o.billNo = 'B-' + String(state.billSeq).padStart(5, '0');
        state.bills.unshift({
          billNo: o.billNo,
          orderId: o.id,
          source: o.source,
          customerId: o.customerId,
          customer: { name: o.customerName, phone: o.phone, address: o.address },
          delivery: o.delivery,
          items: o.items,
          lines,
          totals,
          payment: o.payment,
          createdAt: o.createdAt
        });
      });

    return state;
  }

  /* ── render ────────────────────────────────────────────────────────── */
  function renderRail() {
    const s = SV.store.state;
    const online = s.conn.online;
    document.body.setAttribute('data-online', online ? '1' : '0');

    SV.$$('[data-conn-state]').forEach((n) => { n.textContent = online ? 'Connected' : 'Disconnected'; });
    SV.$$('[data-conn-sync]').forEach((n) => { n.textContent = SV.since(s.conn.lastSync); });
    SV.$$('[data-queue-count]').forEach((n) => { n.textContent = s.conn.queue.length; });
    $('[data-tally="offline"]').hidden = online;
    $('[data-conn-led]').classList.toggle('is-syncing', online);

    const soundBtn = $('#sound-toggle');
    soundBtn.setAttribute('aria-pressed', String(s.ui.sound));
    soundBtn.title = s.ui.sound ? 'Mute arrival sound (M)' : 'Unmute arrival sound (M)';
    $('#demo-btn').setAttribute('aria-pressed', String(s.ui.demo));

    const counts = {
      board: s.orders.filter((o) => o.status === 'new').length,
      preparing: s.orders.filter((o) => o.status === 'preparing' || o.status === 'accepted').length,
      ready: s.orders.filter((o) => o.status === 'ready').length,
      completed: s.orders.filter((o) => o.status === 'completed').length
    };
    SV.$$('.tab').forEach((tab) => {
      const key = tab.dataset.nav;
      if (!(key in counts)) return;
      const node = tab.querySelector('.tab-count');
      node.textContent = counts[key];
      node.dataset.count = String(counts[key]);
      node.dataset.hot = key === 'board' && counts[key] > 0 ? '1' : '0';
    });

    const note = $('#conn-note');
    if (note) {
      note.textContent = online
        ? 'Demo build: the connector is simulated. No local service is contacted.'
        : 'Offline. Orders are held on this machine and released when the connection returns.';
    }
    const toggle = $('#conn-toggle');
    if (toggle) toggle.textContent = online ? 'Simulate connection loss' : 'Restore connection';
  }

  function renderTally() {
    const stats = SV.orders.stats();
    const put = (key, value) => {
      const cell = document.querySelector('[data-tally="' + key + '"] .tally-n');
      if (cell) cell.innerHTML = value;
    };
    /* The queue counts live on the tabs and the tray heads. Repeating them here
       said the same number three times and told the operator nothing. */
    put('orders', stats.todayOrders);
    /* The sign sets separately from the figure, as every other total does. */
    put('sales', '<i>₹</i>' + SV.amount(stats.todaySales));
    put('whatsapp', stats.whatsapp);
  }

  /* One sentence, in the words a shopkeeper would use, so the board explains
     itself before it is read. */
  function renderBoardSay() {
    const out = $('[data-board-say]');
    if (!out) return;
    const orders = SV.store.state.orders;
    const start = SV.todayStart();
    const fresh = orders.filter((o) => o.status === 'new' && o.source === 'whatsapp').length;
    const counter = orders.filter((o) => o.status === 'new' && o.source !== 'whatsapp').length;
    const working = orders.filter((o) => o.status === 'preparing' || o.status === 'accepted').length;
    const ready = orders.filter((o) => o.status === 'ready').length;
    /* "Today" means today: a settled ticket from yesterday is not today's. */
    const settled = orders.filter((o) => o.status === 'completed' && o.createdAt >= start).length;
    const bits = [];
    if (fresh) bits.push(fresh + ' new WhatsApp order' + (fresh > 1 ? 's' : '') + ' waiting');
    if (counter) bits.push(counter + ' new counter ticket' + (counter > 1 ? 's' : '') + ' waiting');
    if (working) bits.push(working + ' being prepared');
    if (ready) bits.push(ready + ' ready to go');
    if (settled) bits.push(settled + ' settled today');
    out.textContent = bits.length ? bits.join(' \u00b7 ') : 'Nothing in the trays. New WhatsApp orders appear here by themselves.';
  }

  function renderBoard(opts) {
    SV.board.render($('#board'), opts || {});
    renderBoardSay();
  }

  function renderScreen(name) {
    currentScreen = name;
    SV.$$('.screen').forEach((node) => {
      const on = node.id === 'screen-' + name;
      node.hidden = !on;
      node.classList.toggle('is-current', on);
    });
    SV.$$('.tab').forEach((tab) => {
      const on = tab.dataset.nav === name;
      tab.classList.toggle('is-current', on);
      if (on) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
    if (name === 'board') renderBoard();
    else SV.screens.render(name, $('#screen-' + name));
  }

  /* ── actions ───────────────────────────────────────────────────────── */
  function go(name) {
    if (TRAY_TABS[name]) {
      /* Tray tabs filter the board; pressing the active tray again shows all. */
      SV.store.update((s) => {
        s.ui.focus = name === 'board' ? null : (s.ui.focus === name ? null : name);
      });
      return renderScreen('board');
    }
    renderScreen(name);
  }

  function simulate() {
    SV.orders.receiveNewOrder(SV.data.makeIncoming(SV.store.state));
  }

  function advance(id) {
    const order = SV.orders.advance(id);
    if (!order) return;
    SV.board.flash(id);
    const next = SV.orders.nextAction(order);
    SV.notifications.say(order.id + ' stamped ' + SV.orders.LABEL[order.status].toLowerCase() +
      (next ? '. Next: ' + next.label.toLowerCase() + '.' : '. Nothing left on this ticket.'));
  }

  function toggleConnection() {
    const wasOnline = SV.store.state.conn.online;
    const released = SV.connector.setOnline(!wasOnline);
    const n = released.length;
    SV.notifications.say(
      wasOnline
        ? 'Offline. ' + (n ? n + ' item' + (n === 1 ? '' : 's') + ' queued.' : 'Orders are held on this machine.')
        : 'Connection restored.' + (n ? ' ' + n + ' queued item' + (n === 1 ? '' : 's') + ' released.' : ''),
      wasOnline ? 'bad' : 'calm'
    );
    renderRail();
  }

  function toggleDemo() {
    SV.store.update((s) => { s.ui.demo = !s.ui.demo; });
    if (SV.store.state.ui.demo) SV.orders.startDemo();
    else SV.orders.stopDemo();
    renderRail();
    SV.notifications.say(SV.store.state.ui.demo
      ? 'Demo mode on. A WhatsApp order arrives every ' + SV.store.state.ui.demoGap + ' seconds.'
      : 'Demo mode off.');
  }

  /* ── events ────────────────────────────────────────────────────────── */
  function wire() {
    document.addEventListener('samvaad:order', (ev) => {
      const order = ev.detail.order;
      SV.notifications.push(order);
      SV.notifications.play();
      /* Re-render with the arrival flag so the lot number cascades. */
      renderBoard({ freshId: order.id });
      if (!$('#drawer').hidden && SV.drawer.currentId === order.id) SV.drawer.refresh();
    });

    document.addEventListener('samvaad:status', () => {
      if (!$('#drawer').hidden) SV.drawer.refresh();
    });

    /* closest() chain, in priority order. Attribute presence decides, not the
       value, so a bare data-bill-close still fires. */
    document.addEventListener('click', (ev) => {
      const pick = (sel) => ev.target.closest(sel);

      const scrim = pick('#drawer-scrim');
      if (scrim) return SV.drawer.close();
      const billScrim = pick('#bill-scrim');
      if (billScrim) return SV.billsheet.close();

      const pill = pick('#conn-pill');
      if (pill) {
        const sheet = $('#conn-sheet');
        sheet.hidden = !sheet.hidden;
        pill.setAttribute('aria-expanded', String(!sheet.hidden));
        return;
      }
      const sheetHit = pick('#conn-sheet');
      if (sheetHit) {
        const toggle = pick('#conn-toggle');
        if (toggle) return toggleConnection();
        return;
      }
      const outside = !$('#conn-sheet').hidden && !pick('#conn-sheet, #conn-pill');
      if (outside) {
        $('#conn-sheet').hidden = true;
        $('#conn-pill').setAttribute('aria-expanded', 'false');
        return;
      }

      const drop = pick('[data-ticket-drop]');
      if (drop) return SV.board.toggleDrop(drop.dataset.ticketDrop);

      const advanceBtn = pick('[data-ticket-advance]');
      if (advanceBtn) return advance(advanceBtn.dataset.ticketAdvance);

      const openTicket = pick('[data-ticket-open]');
      if (openTicket) return SV.drawer.open(openTicket.dataset.ticketOpen);

      const openBill = pick('[data-bill-open]');
      if (openBill) return SV.billsheet.open(openBill.dataset.billOpen);

      const reopen = pick('[data-bill-reopen]');
      if (reopen) return SV.billsheet.openBill(reopen.dataset.billReopen);

      const printNo = pick('[data-bill-print-no]');
      if (printNo) {
        const bill = SV.bills.byNo(printNo.dataset.billPrintNo);
        return bill && SV.printer.printBill(bill);
      }
      const print = pick('[data-bill-print]');
      if (print) {
        const bill = SV.billsheet.save();
        if (!bill) return;
        /* Printing ends the job: the bill is saved, the paper is out, and the
           operator is put back on the board. Leaving the sheet up would wall
           them out of the queue behind a modal they did not ask for. */
        return SV.printer.printBill(bill).then((result) => {
          SV.billsheet.close();
          if (result && result.printed) {
            SV.notifications.say('Bill ' + bill.billNo + ' printed · ' + SV.money(bill.totals.grand) +
              '. Saved to the bill book.');
          }
          SV.board.flash(bill.orderId);
        });
      }

      if (pick('[data-bill-save]')) return SV.billsheet.save();
      if (pick('[data-bill-close]')) return SV.billsheet.close();
      if (pick('[data-drawer-close]')) return SV.drawer.close();

      const cancel = pick('[data-drawer-cancel]');
      if (cancel) {
        SV.orders.cancel(cancel.dataset.drawerCancel);
        return SV.drawer.close();
      }

      const addLine = pick('[data-counter-add]');
      if (addLine) {
        return SV.billsheet.addLine($('#counter-pick').value, Math.max(1, Number($('#counter-qty').value) || 1));
      }

      const call = pick('[data-cust-call]');
      if (call) {
        const c = SV.customers.byId(call.dataset.custCall);
        if (c) simulate();
        return;
      }

      const accept = pick('[data-toast-accept]');
      if (accept) {
        const toast = pick('[data-toast]');
        if (toast) SV.notifications.dismiss(toast);
        return;
      }

      const nav = pick('[data-nav]');
      if (nav) return go(nav.dataset.nav);

      const id = ev.target.id;
      if (id === 'simulate-btn') return simulate();
      if (id === 'demo-btn') return toggleDemo();
      if (id === 'sound-toggle') return SV.notifications.toggle();
      if (id === 'conn-toggle' || id === 'conn-toggle-2') return toggleConnection();
      if (id === 'new-bill-btn' || id === 'new-bill-btn-2') return SV.billsheet.newCounterBill();
      if (id === 'reset-demo') {
        SV.orders.stopDemo();
        SV.store.reset(seed);
        SV.drawer.close();
        SV.billsheet.close();
        renderRail();
        renderTally();
        renderScreen(currentScreen);
        return SV.notifications.say('Demo data reset to the seeded shop.');
      }
    });

    document.addEventListener('input', (ev) => {
      const t = ev.target;
      if (t.matches('[data-bill-field]')) return SV.billsheet.onField(t);
      if (t.matches('[data-price]')) {
        return SV.products.edit(t.dataset.price, { price: Math.round((Number(t.value) || 0) * 100) });
      }
      if (t.matches('[data-gst]')) return SV.products.edit(t.dataset.gst, { gst: Number(t.value) || 0 });
      if (t.matches('[data-shop]')) return SV.store.update((s) => { s.shop[t.dataset.shop] = t.value; });
      if (t.matches('[data-ui="demoGap"]')) {
        const gap = Math.max(8, Number(t.value) || 25);
        return SV.store.update((s) => { s.ui.demoGap = gap; });
      }
    });

    document.addEventListener('change', (ev) => {
      const t = ev.target;
      if (t.matches('[data-bill-field]')) return SV.billsheet.onField(t);

      if (t.matches('[data-resolve]')) {
        if (!t.value) return;
        if (SV.products.adopt(SV.drawer.currentId, Number(t.dataset.resolve), t.value)) {
          SV.drawer.refresh();
          SV.notifications.say('Product matched. The bill will price it from the catalogue.');
        }
        return;
      }

      if (t.matches('[data-ui]')) {
        const key = t.dataset.ui;
        if (t.type === 'checkbox') {
          SV.store.update((s) => { s.ui[key] = t.checked; });
          if (key === 'sound') SV.notifications.play();
          if (key === 'demo') {
            if (t.checked) SV.orders.startDemo();
            else SV.orders.stopDemo();
          }
          renderRail();
          return;
        }
        SV.store.update((s) => { s.ui[key] = t.value; });
        if (key === 'paper') {
          document.body.setAttribute('data-paper', t.value);
          SV.notifications.say('Printer tray set to ' + t.value.toUpperCase() + '.');
        }
        return;
      }

      /* the demo interval only matters once the value settles */
      if (t.matches('[data-ui="demoGap"]') && SV.store.state.ui.demo) {
        SV.orders.startDemo();
        SV.notifications.say('Demo interval: every ' + SV.store.state.ui.demoGap + ' seconds.');
      }
    });

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        if (SV.board.anyDropped()) return SV.board.collapseAll();
        if (!$('#conn-sheet').hidden) {
          $('#conn-sheet').hidden = true;
          $('#conn-pill').setAttribute('aria-expanded', 'false');
          return;
        }
        if (!$('#billsheet').hidden) return SV.billsheet.close();
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

    SV.store.subscribe(() => {
      renderRail();
      renderTally();
      if (currentScreen === 'board') renderBoard();
    });

    renderRail();
    renderTally();
    renderBoard();

    if (!SV.store.state.conn.online) {
      SV.notifications.say('Working offline. Orders are held on this machine.', 'bad');
    }
    window.setInterval(renderTally, 30000);
  }

  document.addEventListener('DOMContentLoaded', boot);
})(window.SV);