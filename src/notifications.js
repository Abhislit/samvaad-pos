/* SAMVAAD POS — the arrival notice.
   A sound, synthesised rather than shipped, so the counter needs no asset file.
   And one line of toast, because an order that arrives silently is an order
   that sits there until someone happens to look. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  let ctx = null;

  /* A 58 mm printer's double chirp: two oscillators and an envelope. */
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

    /* An arrival, then a print. Both are one line, both go away. */
    say(message, tone) {
      const host = SV.$('#toaster');
      if (!host) return;
      const node = SV.el(
        '<div class="toast" data-tone="' + (tone === 'bad' ? 'bad' : 'calm') + '">' +
          '<div class="msg">' + SV.esc(message) + '</div>' +
        '</div>'
      );
      host.appendChild(node);
      setTimeout(() => {
        node.classList.add('is-going');
        setTimeout(() => node.remove(), 220);
      }, 4200);
    }
  };
})(window.SV);
