/* SAMVAAD POS — arrival notice.
   Sound is synthesised, not shipped: the counter needs no asset file, and a
   thermal printer's chirp is two oscillators and an envelope. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  let ctx = null;

  /* A 58 mm printer's double chirp. Nothing loads, nothing can 404 at the till. */
  function chirp() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = ctx || new AC();
      if (ctx.state === 'suspended') ctx.resume();
      const t0 = ctx.currentTime;
      [[1180, 0], [880, 0.085]].forEach(([freq, at]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t0 + at);
        gain.gain.setValueAtTime(0.0001, t0 + at);
        gain.gain.exponentialRampToValueAtTime(0.07, t0 + at + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + at + 0.07);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t0 + at);
        osc.stop(t0 + at + 0.09);
      });
    } catch (_) {
      /* audio blocked until a gesture — silence is an acceptable failure */
    }
  }

  SV.notifications = {
    enabled() { return SV.store.state.ui.sound; },

    setEnabled(on) {
      SV.store.update((s) => { s.ui.sound = on; });
      if (on) chirp();
    },

    toggle() { SV.notifications.setEnabled(!SV.notifications.enabled()); },

    play() { if (SV.notifications.enabled()) chirp(); },

    /* ── toast ──────────────────────────────────────────────────────── */
    push(order, opts) {
      const host = SV.$('#toaster');
      if (!host) return;
      const lines = SV.bills.linesOf(order.items);
      const totals = SV.bills.totalsOf(lines, { delivery: order.delivery === 'delivery' ? 2000 : 0 });

      const node = SV.el(
        '<div class="toast" data-toast>' +
          '<div>' +
            '<div class="lot">' + SV.esc(order.id) + '</div>' +
            '<div class="msg">New WhatsApp order · ' + SV.esc(order.customerName) + ' · ' +
              SV.money(totals.grand) + '</div>' +
          '</div>' +
          '<button class="btn btn-seal btn-sm" data-toast-accept>Accept</button>' +
        '</div>'
      );

      if (opts && opts.silent !== true) {
        node.querySelector('[data-toast-accept]').addEventListener('click', () => {
          SV.orders.advance(order.id);
          SV.notifications.dismiss(node);
        });
      } else {
        node.querySelector('[data-toast-accept]').remove();
      }

      host.appendChild(node);
      const life = 9000;
      setTimeout(() => SV.notifications.dismiss(node), life);
      return node;
    },

    dismiss(node) {
      if (!node || !node.isConnected) return;
      node.classList.add('is-going');
      setTimeout(() => node.remove(), 220);
    },

    say(message, tone) {
      const host = SV.$('#toaster');
      if (!host) return;
      const node = SV.el(
        '<div class="toast" data-toast data-tone="' + (tone === 'bad' ? 'bad' : 'calm') + '">' +
          '<div class="msg">' + SV.esc(message) + '</div>' +
        '</div>'
      );
      host.appendChild(node);
      setTimeout(() => SV.notifications.dismiss(node), 4200);
    },

    count: (order) => order.items.reduce((s, l) => s + l.qty, 0)
  };
})(window.SV);