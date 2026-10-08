/* SAMVAAD POS — order intake.
   One job: an order arrives from WhatsApp, and it can be printed. There is no
   lifecycle to walk and nowhere to type the order a second time. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  let billSeq = 0;

  /* A number arrives from the cloud as +919876543210 and is read off a bill as
     +91 98765 43210. Two helpers, because that is all the customer record
     ever needed to be. */
  const digits = (v) => String(v || '').replace(/\D/g, '');
  SV.customersPhone = digits;
  SV.customersPrettyPhone = (raw) => {
    const d = digits(raw);
    if (d.length === 10) return '+91 ' + d.slice(0, 5) + ' ' + d.slice(5);
    if (d.length === 12) return '+91 ' + d.slice(2, 7) + ' ' + d.slice(7);
    return raw || '';
  };

  SV.orders = {
    /* ── the door ─────────────────────────────────────────────────────
       Every order comes through here, whatever delivered it: the demo
       button, the demo timer, or the cloud socket that will replace both. */
    receiveNewOrder(payload) {
      const state = SV.store.state;
      const id = payload.order_id || 'SAM-' + (10000 + state.seq + 1);
      if (SV.orders.byId(id)) return SV.orders.byId(id);

      const phone = SV.customersPhone(payload.customer && payload.customer.phone);
      const order = {
        id,
        source: payload.source === 'counter' ? 'counter' : 'whatsapp',
        customerName: (payload.customer && payload.customer.name) || 'WhatsApp customer',
        phone: phone ? SV.customersPrettyPhone(phone) : '',
        address: payload.address || '',
        items: (payload.items || []).map((item) => SV.products.resolve(item)),
        payment: payload.payment_method || 'Cash',
        delivery: payload.delivery_type === 'pickup' ? 'pickup' : 'delivery',
        notes: payload.notes || '',
        createdAt: payload.createdAt || Date.now(),
        approvedAt: null,
        printedAt: null,
        billNo: null
      };

      const seq = state.seq + 1;
      SV.store.update((s) => { s.orders.unshift(order); s.seq = seq; });
      document.dispatchEvent(new CustomEvent('samvaad:order', { detail: { order } }));
      return order;
    },

    byId(id) { return SV.store.state.orders.find((o) => o.id === id); },
    all() { return SV.store.state.orders; },

    printed(order) { return !!order.printedAt; },

    /* Two beats, not a lifecycle: an order is approved, then it prints.
       Nothing else is a state, because nothing else changes what the machine
       does. */
    approved(order) { return !!order.approvedAt; },
    canApprove(order) { return !order.approvedAt && !order.printedAt; },
    canPrint(order) { return !!order.approvedAt && !order.printedAt; },

    approve(id) {
      let done = null;
      SV.store.update((s) => {
        const order = s.orders.find((o) => o.id === id);
        if (!order || order.approvedAt || order.printedAt) return;
        order.approvedAt = Date.now();
        done = order;
      });
      return done;
    },

    /* Printing is the end of the road for a ticket. The bill number is kept on
       the order rather than in a separate book, because nothing else needs it. */
    markPrinted(id) {
      let done = null;
      SV.store.update((s) => {
        const order = s.orders.find((o) => o.id === id);
        if (!order || order.printedAt) return;
        order.approvedAt = order.approvedAt || Date.now();
        billSeq += 1;
        order.billNo = 'B-' + String(s.billSeq + billSeq).padStart(5, '0');
        order.printedAt = Date.now();
        done = order;
      });
      return done;
    },

    nextBillNo() { return 'B-' + String(SV.store.state.billSeq + billSeq + 1).padStart(5, '0'); },

    /* The order's money, which is what the receipt prints. */
    money(order) {
      const lines = SV.bills.linesOf(order.items);
      return { lines, totals: SV.bills.totalsOf(lines, { delivery: order.delivery === 'delivery' ? 2000 : 0 }) };
    },

    /* One line of truth for the rail: what is waiting, and what has gone out. */
    tally() {
      const orders = SV.orders.all();
      const start = SV.todayStart();
      const waiting = orders.filter((o) => !o.printedAt);
      const done = orders.filter((o) => o.printedAt && o.printedAt >= start);
      const sales = done.reduce((sum, o) => sum + SV.orders.money(o).totals.grand, 0);
      return { waiting: waiting.length, printedToday: done.length, sales };
    },

    /* ── demo timer ─────────────────────────────────────────────────── */
    sim: { timer: null },

    startDemo() {
      SV.orders.stopDemo();
      const gap = Math.max(8, SV.store.state.ui.demoGap) * 1000;
      SV.orders.sim.timer = setInterval(() => {
        if (SV.store.state.ui.demo) SV.orders.receiveNewOrder(SV.data.makeIncoming(SV.store.state));
      }, gap);
    },

    stopDemo() {
      if (SV.orders.sim.timer) clearInterval(SV.orders.sim.timer);
      SV.orders.sim.timer = null;
    }
  };

  /* Console entry point, so the cloud hand-off can be exercised from devtools
     against a real payload. */
  window.receiveNewOrder = (order) => SV.orders.receiveNewOrder(order);
})(window.SV);