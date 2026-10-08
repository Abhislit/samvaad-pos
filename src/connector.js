/* SAMVAAD POS — the SAMVAAD POS CONNECTOR.
   The connector is the on-premise bridge that will carry the cloud payload to
   this screen and, later, drive the shop's TRUCOUNT T-10. Its protocol is not
   confirmed, so nothing here contacts a local service. Every function that
   would cross that boundary says so and returns a refusal instead. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const ENDPOINT = {
    /* Both are the shapes the real connector is expected to take. Neither is
       implemented; see the note in sendToLocalConnector. */
    ws: 'ws://127.0.0.1:8765',
    http: 'http://127.0.0.1:8765/print'
  };

  SV.connector = {
    ENDPOINT,
    name: 'SAMVAAD POS Connector',

    /* ── cloud side ─────────────────────────────────────────────────── */
    /* FUTURE WIRING — replace the simulated transport with:
         const ws = new WebSocket(ENDPOINT.ws);
         ws.onmessage = (ev) => SV.orders.receiveNewOrder(JSON.parse(ev.data));
       The demo never opens a socket, so nothing here can hang or leak. */
    transport: 'simulated',

    isOnline() { return SV.store.state.conn.online; },

    lastSyncLabel() {
      return SV.since(SV.store.state.conn.lastSync);
    },

    queueCount() { return SV.store.state.conn.queue.length; },

    /* A dropped connection is the normal condition of a shop on a weak line.
       Work is held in the queue and released when the link returns. */
    setOnline(online) {
      const released = [];
      SV.store.update((s) => {
        s.conn.online = online;
        s.conn.lastSync = Date.now();
        if (online) {
          s.conn.queue.forEach((entry) => released.push(entry));
          s.conn.queue = [];
        }
      });
      return released;
    },

    /* ── printer side ───────────────────────────────────────────────── */
    /* Off unless the operator explicitly switches the demo connector on. The
       browser cannot drive a T-10 directly; only a local service could. */
    isAvailable() {
      return SV.store.state.ui.connectorOn === true && SV.connector.isOnline();
    },

    /* Placeholder for the confirmed local print protocol. Returns a refusal
       rather than throwing, so the caller can fall back to browser print. */
    sendToLocalConnector(bill) {
      const payload = {
        billNo: bill.billNo,
        shop: SV.store.state.shop,
        width: SV.store.state.ui.paper,
        lines: bill.lines.map((l) => ({
          name: l.name,
          qty: l.qty,
          rate: l.unitPrice,
          gst: l.gst,
          amount: l.net
        })),
        totals: bill.totals,
        payment: bill.payment
      };
      return Promise.resolve({
        sent: false,
        reason: 'Local print protocol not implemented in this demo build.',
        endpoint: ENDPOINT,
        wouldSend: payload
      });
    }
  };
})(window.SV);