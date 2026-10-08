/* SAMVAAD POS — customer records.
   Secondary to the order: this exists so the operator can confirm a number and
   recognise a regular, never to take over the ticket. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const digits = (s) => String(s || '').replace(/\D/g, '');

  SV.customers = {
    all() { return SV.store.state.customers; },

    byId(id) { return SV.store.state.customers.find((c) => c.id === id) || null; },

    /* Phone arrives from the cloud as +919876543210 and is stored as a readable
       +91 98765 43210, which is how the shopkeeper reads it off a bill. */
    prettyPhone(raw) {
      const d = digits(raw);
      if (d.length === 10) return '+91 ' + d.slice(0, 5) + ' ' + d.slice(5);
      if (d.length === 12) return '+91 ' + d.slice(2, 7) + ' ' + d.slice(7);
      return raw || '—';
    },

    findOrCreate(payload) {
      const phone = digits(payload && payload.phone);
      const hit = SV.store.state.customers.find((c) => digits(c.phone) === phone);
      if (hit) return hit;
      const made = {
        id: 'C' + String(SV.store.state.seq).padStart(3, '0'),
        name: (payload && payload.name) || 'Walk-in customer',
        phone: SV.customers.prettyPhone(payload && payload.phone),
        address: (payload && payload.address) || ''
      };
      SV.store.update((s) => { s.customers.push(made); });
      return made;
    },

    history(customerId) {
      const state = SV.store.state;
      const orders = state.orders.filter((o) => o.customerId === customerId);
      const bills = state.bills.filter((b) => b.customerId === customerId);
      const spend = bills.reduce((sum, b) => sum + b.totals.grand, 0);
      return {
        orders: orders.length,
        bills: bills.length,
        spend,
        last: orders.reduce((max, o) => Math.max(max, o.createdAt), 0)
      };
    }
  };
})(window.SV);