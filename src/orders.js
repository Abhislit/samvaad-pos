/* SAMVAAD POS — order intake and the order lifecycle.
   receiveNewOrder(payload) is the one door every order comes through, whether
   it arrived from the cloud, from the demo timer, or from the console. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const FLOW = ['new', 'accepted', 'preparing', 'ready', 'completed'];

  const SPEC = {
    new:       { label: 'New',       plate: 'new',       action: 'Accept order',  to: 'accepted' },
    accepted:  { label: 'Accepted',  plate: 'accepted',  action: 'Start preparing', to: 'preparing' },
    preparing: { label: 'Preparing', plate: 'preparing', action: 'Mark ready',     to: 'ready' },
    ready:     { label: 'Ready',     plate: 'ready',     action: 'Complete order', to: 'completed' },
    completed: { label: 'Completed', plate: 'completed', action: null,            to: null },
    cancelled: { label: 'Cancelled', plate: 'cancelled', action: null,            to: null }
  };

  /* NEW | ACCEPTED | PREPARING | READY | COMPLETED | CANCELLED */
  const KEYS = Object.keys(SPEC);

  SV.orders = {
    FLOW,
    KEYS,
    SPEC,
    LABEL: KEYS.reduce((m, k) => ((m[k] = SPEC[k].label), m), {}),

    all() { return SV.store.state.orders; },

    byId(id) { return SV.store.state.orders.find((o) => o.id === id) || null; },

    /* ACCEPTED has no tray of its own: it is a PREPARING ticket the operator
       has claimed but not started. It rides in that tray under its own band,
       so the tray count and the badge always agree. */
    laneOf(order) {
      if (order.status === 'cancelled') return 'completed';
      if (order.status === 'accepted') return 'preparing';
      return order.status;
    },

    /* Billable from ACCEPTED onward. The brief's rule: never bill a ticket the
       operator has not taken responsibility for. */
    canBill(order) { return order.status !== 'new' && order.status !== 'cancelled'; },

    nextAction(order) {
      const spec = SPEC[order.status];
      return spec && spec.action ? { label: spec.action, to: spec.to } : null;
    },

    /* ── the door ───────────────────────────────────────────────────── */
    receiveNewOrder(payload) {
      const state = SV.store.state;
      const id = payload.order_id || 'SAM-' + (10000 + state.seq + 1);
      if (SV.orders.byId(id)) return SV.orders.byId(id);

      const customer = SV.customers.findOrCreate({
        name: payload.customer && payload.customer.name,
        phone: payload.customer && payload.customer.phone,
        address: payload.address
      });

      const items = (payload.items || []).map((item) => SV.products.resolve(item));

      const order = {
        id,
        source: payload.source === 'counter' ? 'counter' : 'whatsapp',
        customerId: customer.id,
        customerName: customer.name,
        phone: customer.phone,
        address: payload.address || customer.address || '',
        items,
        payment: payload.payment_method || 'Cash',
        delivery: payload.delivery_type === 'pickup' ? 'pickup' : 'delivery',
        notes: payload.notes || '',
        status: 'new',
        createdAt: payload.createdAt || Date.now(),
        discount: 0,
        billNo: null,
        history: [{ status: 'new', at: payload.createdAt || Date.now() }]
      };

      const fresh = { id, seq: state.seq + 1 };
      SV.store.update((s) => {
        s.orders.unshift(order);
        s.seq = fresh.seq;
        /* Offline work is held, never dropped, and stamped when it syncs. */
        if (!s.conn.online) s.conn.queue.push({ kind: 'order', id, at: Date.now() });
      });

      document.dispatchEvent(new CustomEvent('samvaad:order', { detail: { order, fresh: true } }));
      return order;
    },

    /* ── lifecycle ──────────────────────────────────────────────────── */
    advance(id) {
      const order = SV.orders.byId(id);
      if (!order) return null;
      const next = SV.orders.nextAction(order);
      if (!next) return order;
      return SV.orders.setStatus(id, next.to);
    },

    setStatus(id, status) {
      if (!SPEC[status]) return null;
      let changed = null;
      SV.store.update((s) => {
        const order = s.orders.find((o) => o.id === id);
        if (!order || order.status === status) return;
        order.status = status;
        order.history.push({ status, at: Date.now() });
        changed = order;
      });
      if (changed) {
        document.dispatchEvent(new CustomEvent('samvaad:status', { detail: { order: changed, status } }));
      }
      return changed;
    },

    cancel(id) { return SV.orders.setStatus(id, 'cancelled'); },

    waitingCount() {
      return SV.store.state.orders.filter((o) => o.status === 'new').length;
    },

    /* ── the day's numbers ──────────────────────────────────────────── */
    stats() {
      const state = SV.store.state;
      const start = SV.todayStart();
      const byStatus = KEYS.reduce((m, k) => ((m[k] = 0), m), {});
      state.orders.forEach((o) => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });

      const todays = state.bills.filter((b) => b.createdAt >= start);
      return {
        byStatus,
        todayOrders: todays.length,
        todaySales: todays.reduce((s, b) => s + b.totals.grand, 0),
        whatsapp: todays.filter((b) => b.source === 'whatsapp').length,
        counter: todays.filter((b) => b.source === 'counter').length
      };
    },

    /* ── demo timer ─────────────────────────────────────────────────── */
    sim: { timer: null },

    startDemo(seconds) {
      SV.orders.stopDemo();
      const gap = Math.max(8, seconds || SV.store.state.ui.demoGap) * 1000;
      SV.orders.sim.timer = setInterval(() => {
        if (!SV.store.state.ui.demo) return;
        SV.orders.receiveNewOrder(SV.data.makeIncoming(SV.store.state));
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