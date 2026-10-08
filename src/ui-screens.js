/* SAMVAAD POS — the four screens behind the rail tabs: bill book, products,
   customers, settings. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const e = SV.esc;

  function empty(title, body) {
    return '<div class="empty-state"><b>' + e(title) + '</b><p>' + e(body) + '</p></div>';
  }

  /* ── bill book ─────────────────────────────────────────────────────── */
  function billsScreen() {
    const state = SV.store.state;
    const stats = SV.orders.stats();
    const hours = hourlyBars(state.bills);

    const rows = state.bills.length
      ? state.bills.map((b) =>
          '<tr>' +
            '<td><span class="cell-2"><b class="stencil-name">' + e(b.billNo) + '</b>' +
              '<small>' + e(SV.clock(b.createdAt)) + ' · ' + e(SV.dayLabel(b.createdAt)) + '</small></span></td>' +
            '<td><span class="cell-2"><b>' + e(b.customer.name) + '</b>' +
              '<small>' + e(b.source === 'whatsapp' ? 'WhatsApp' : 'Counter') + '</small></span></td>' +
            '<td class="num">' + b.lines.length + '</td>' +
            '<td>' + e(b.payment) + '</td>' +
            '<td class="num">' + e(SV.money(b.totals.grand)) + '</td>' +
            '<td class="num">' +
              '<button class="btn btn-ghost btn-sm" data-bill-reopen="' + e(b.billNo) + '">Open</button> ' +
              '<button class="btn btn-ghost btn-sm" data-bill-print-no="' + e(b.billNo) + '">Print</button>' +
            '</td>' +
          '</tr>'
        ).join('')
      : '';

    return '<div class="screen-pad">' +
      '<h2 class="screen-title">Bill book</h2>' +

      '<div class="day-band">' +
        '<div class="day-cell"><span class="day-l">Bills today</span>' +
          '<span class="day-n">' + stats.todayOrders + '</span></div>' +
        '<div class="day-cell"><span class="day-l">Sales today</span>' +
          '<span class="day-n">' + e(SV.money(stats.todaySales)) + '</span>' +
          '<span class="day-sub">including tax and delivery</span></div>' +
        '<div class="day-cell"><span class="day-l">Via WhatsApp</span>' +
          '<span class="day-n">' + stats.whatsapp + ' of ' + (stats.todayOrders || 0) + '</span>' +
          '<span class="day-sub">' + (stats.counter
            ? stats.counter + ' counter sale' + (stats.counter > 1 ? 's' : '')
            : 'no counter sales') + '</span></div>' +
      '</div>' +

      '<div class="sheet-card"><header><h3>Orders by hour today</h3></header>' +
        '<div style="padding:0.8rem;display:grid;gap:0.4rem">' + hours + '</div></div>' +

      '<div class="sheet-card"><header><h3>Saved bills</h3>' +
        '<span class="tag">' + state.bills.length + ' in the book</span>' +
        '<button class="btn btn-seal btn-sm" id="new-bill-btn-2">Stamp new ticket<span class="chev" aria-hidden="true"></span></button>' +
      '</header>' +
      (state.bills.length
        ? '<div class="sheet-scroll"><table class="ledger-table"><thead><tr>' +
          '<th>Bill</th><th>Customer</th><th class="num">Lines</th><th>Payment</th>' +
          '<th class="num">Total</th><th class="num"></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
        : empty('The bill book is empty', 'Accept a ticket and generate a bill, or stamp a new counter ticket, and it lands here.')) +
      '</div></div>';
  }

  /* A POS-shaped chart: rows, not a decorative plot. Each hour is a labelled
     bar with its count and value, so a number is always readable too. */
  function hourlyBars(bills) {
    const start = SV.todayStart();
    const hourOf = (ts) => new Date(ts).getHours();
    const todays = bills.filter((b) => b.createdAt >= start);
    if (!todays.length) {
      return '<p style="font-size:.8125rem;color:var(--ink-faint)">No bills today yet.</p>';
    }
    /* Only the hours the shop actually traded in: a row of zeros from midnight
       is noise, not information. */
    const now = hourOf(Date.now());
    const from = todays.reduce((min, b) => Math.min(min, hourOf(b.createdAt)), now);
    const buckets = [];
    for (let h = from; h <= now; h += 1) buckets.push({ h, count: 0, value: 0 });
    todays.forEach((b) => {
      const hit = buckets.find((x) => x.h === hourOf(b.createdAt));
      if (hit) { hit.count += 1; hit.value += b.totals.grand; }
    });
    const peak = Math.max(1, ...buckets.map((b) => b.count));
    return buckets
      .map((b) => {
        const label = b.h % 12 === 0 ? 12 : b.h % 12;
        return '<div class="bar-meter">' +
          '<span class="mono" style="width:4.5rem;color:var(--ink-faint)">' + label + (b.h < 12 ? ' am' : ' pm') + '</span>' +
          '<span class="bar"><i style="width:' + Math.round((b.count / peak) * 100) + '%"></i></span>' +
          '<span class="val">' + b.count + ' · ' + SV.money(b.value) + '</span>' +
        '</div>';
      })
      .join('');
  }

  /* ── products ──────────────────────────────────────────────────────── */
  function productsScreen() {
    const state = SV.store.state;
    const byCat = new Map();
    state.products.forEach((p) => {
      if (!byCat.has(p.cat)) byCat.set(p.cat, []);
      byCat.get(p.cat).push(p);
    });

    const body = Array.from(byCat, ([cat, items]) =>
      '<div class="sheet-card"><header><h3>' + e(cat) + '</h3><span class="tag">' + items.length + '</span></header>' +
      '<div class="sheet-scroll"><table class="ledger-table"><thead><tr>' +
      '<th>Product ID</th><th>Item</th><th class="num">Price (₹)</th><th class="num">GST %</th>' +
      '</tr></thead><tbody>' +
      items.map((p) =>
        '<tr>' +
          '<td class="pid">' + e(p.id) + '</td>' +
          '<td><span class="cell-2"><b class="stencil-name">' + e(p.name) + '</b><small>' + e(p.pack) + '</small></span></td>' +
          '<td class="num"><input class="input" style="width:5.5rem;text-align:right" type="number" min="0" step="0.5" ' +
            'data-price="' + e(p.id) + '" value="' + (p.price / 100) + '" aria-label="Price of ' + e(p.name) + '"></td>' +
          '<td class="num"><input class="input" style="width:4rem;text-align:right" type="number" min="0" step="1" ' +
            'data-gst="' + e(p.id) + '" value="' + p.gst + '" aria-label="GST on ' + e(p.name) + '"></td>' +
        '</tr>'
      ).join('') +
      '</tbody></table></div></div>'
    ).join('');

    return '<div class="screen-pad">' +
      '<h2 class="screen-title">Products</h2>' +
      '<p class="note-strip is-calm"><span><b>' + state.products.length + ' products.</b> ' +
        'These are the IDs SAMVAAD matches incoming WhatsApp lines against. ' +
        'Changing a price here changes what the next bill for that product will charge. ' +
        'Catalogue, prices and slab rates in this build are synthetic.</span></p>' +
      '<div class="grid-2">' + body + '</div></div>';
  }

  /* ── customers ─────────────────────────────────────────────────────── */
  function customersScreen() {
    const state = SV.store.state;
    const rows = state.customers
      .map((c) => {
        const h = SV.customers.history(c.id);
        return '<tr>' +
          '<td><span class="cell-2"><b class="stencil-name">' + e(c.name) + '</b><small>' + e(c.id) + '</small></span></td>' +
          '<td class="mono">' + e(c.phone) + '</td>' +
          '<td>' + e(c.address || '—') + '</td>' +
          '<td class="num">' + h.orders + '</td>' +
          '<td class="num">' + (h.last ? e(SV.clock(h.last)) + ', ' + e(SV.dayLabel(h.last)) : '—') + '</td>' +
          '<td class="num">' + (h.spend ? e(SV.money(h.spend)) : '—') + '</td>' +
          '<td class="num"><button class="btn btn-ghost btn-sm" data-cust-call="' + e(c.id) + '">New ticket</button></td>' +
        '</tr>';
      })
      .join('');

    return '<div class="screen-pad">' +
      '<h2 class="screen-title">Customers</h2>' +
      '<p class="note-strip is-calm"><span>Customer records are built from the WhatsApp number on each order. ' +
        'Names, numbers and addresses here are synthetic.</span></p>' +
      '<div class="sheet-card"><header><h3>Regulars</h3><span class="tag">' + state.customers.length + ' on file</span></header>' +
      '<div class="sheet-scroll"><table class="ledger-table"><thead><tr>' +
      '<th>Customer</th><th>Phone</th><th>Address</th><th class="num">Orders</th>' +
      '<th class="num">Last order</th><th class="num">Lifetime</th><th class="num"></th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div></div></div>';
  }

  /* ── settings ──────────────────────────────────────────────────────── */
  function settingsScreen() {
    const s = SV.store.state;
    const conn = s.conn;

    return '<div class="screen-pad">' +
      '<h2 class="screen-title">Settings</h2>' +

      '<div class="grid-2">' +
        '<div class="sheet-card"><header><h3>Shop</h3><span class="tag tag-demo">Demo details</span></header>' +
          '<div style="padding:0.7rem 0.8rem;display:grid;gap:0.55rem">' +
            field('Shop name', 'name', s.shop.name) +
            field('Address', 'line2', s.shop.line2) +
            field('Phone', 'phone', s.shop.phone) +
            field('GSTIN', 'gstin', s.shop.gstin) +
            field('UPI id', 'upi', s.shop.upi) +
          '</div></div>' +

        '<div class="sheet-card"><header><h3>Counter</h3></header>' +
          '<div style="padding:0.2rem 0.8rem 0.5rem">' +
            toggle('sound', 'Arrival sound', 'Two-tone chirp when a WhatsApp order lands', s.ui.sound) +
            toggle('demo', 'Demo mode', 'Simulates a new WhatsApp order every ' + s.ui.demoGap + ' seconds', s.ui.demo) +
            toggle('connectorOn', 'Local connector', 'Off in this build. The browser cannot drive a TRUCOUNT T-10 directly.', s.ui.connectorOn) +
            '<div class="field" style="padding:0.55rem 0">' +
              '<label class="field-l" for="paper">Printer tray</label>' +
              '<select class="input" id="paper" data-ui="paper">' +
                '<option value="58"' + (s.ui.paper === '58' ? ' selected' : '') + '>58 mm — narrow thermal</option>' +
                '<option value="80"' + (s.ui.paper === '80' ? ' selected' : '') + '>80 mm — standard thermal (default)</option>' +
                '<option value="a4"' + (s.ui.paper === 'a4' ? ' selected' : '') + '>A4 — full sheet</option>' +
              '</select>' +
            '</div>' +
            '<div class="field" style="padding:0.2rem 0 0.6rem">' +
              '<label class="field-l" for="demo-gap">Demo interval (seconds)</label>' +
              '<input class="input" id="demo-gap" type="number" min="8" max="120" step="1" data-ui="demoGap" value="' + s.ui.demoGap + '">' +
            '</div>' +
          '</div></div>' +
      '</div>' +

      '<div class="sheet-card"><header><h3>' + e(SV.connector.name) + '</h3>' +
        '<span class="tag" style="background:var(--' + (conn.online ? 'ledger-wash' : 'india-wash') + ')">' +
        (conn.online ? 'Online' : 'Offline') + '</span></header>' +
        '<div style="padding:0.7rem 0.8rem;display:grid;gap:0.6rem">' +
          '<dl class="kv">' +
            '<dt>Transport</dt><dd class="mono">' + e(SV.connector.transport) + '</dd>' +
            '<dt>Cloud endpoint</dt><dd class="mono">' + e(SV.connector.ENDPOINT.ws) + ' · not opened in this build</dd>' +
            '<dt>Print endpoint</dt><dd class="mono">' + e(SV.connector.ENDPOINT.http) + ' · not called in this build</dd>' +
            '<dt>Last sync</dt><dd>' + e(SV.since(conn.lastSync)) + '</dd>' +
            '<dt>Queued offline</dt><dd>' + conn.queue.length + ' item' + (conn.queue.length === 1 ? '' : 's') + '</dd>' +
            '<dt>Printer</dt><dd>' + e(SV.printer.modeLabel()) + '</dd>' +
          '</dl>' +
          '<p class="note-strip"><span>This build never opens a socket and never calls a local service. ' +
            'The connector above describes the hand-off the real deployment will make.</span></p>' +
          '<div class="btn-row">' +
            '<button class="btn btn-ghost btn-sm" id="conn-toggle-2">' +
              (conn.online ? 'Simulate connection loss' : 'Restore connection') + '</button>' +
            '<button class="btn btn-ghost btn-sm" id="reset-demo">Reset demo data</button>' +
          '</div>' +
        '</div></div></div>';
  }

  function field(label, key, value) {
    return '<div class="field"><label class="field-l" for="shop-' + key + '">' + e(label) + '</label>' +
      '<input class="input" id="shop-' + key + '" data-shop="' + key + '" value="' + e(value) + '"></div>';
  }

  function toggle(key, label, note, on) {
    return '<label class="toggle"><span class="toggle-text"><b>' + e(label) + '</b><small>' + e(note) + '</small></span>' +
      '<input type="checkbox" data-ui="' + key + '"' + (on ? ' checked' : '') + '>' +
      '<span class="switch" aria-hidden="true"></span></label>';
  }

  SV.screens = {
    render(name, host) {
      const views = {
        bills: billsScreen,
        products: productsScreen,
        customers: customersScreen,
        settings: settingsScreen
      };
      const view = views[name];
      host.innerHTML = view ? view() : '';
    }
  };
})(window.SV);