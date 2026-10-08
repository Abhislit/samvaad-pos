/* SAMVAAD POS — shared helpers.
   Classic script on purpose: the shop opens index.html straight off the disk,
   so nothing here may depend on a module server or a build step. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const inrFmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const inrWhole = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

  SV.$ = (sel, root) => (root || document).querySelector(sel);
  SV.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  SV.esc = (value) =>
    String(value == null ? '' : value).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* Money is stored in paise everywhere. Never a float rupee. */
  SV.money = (paise) => '₹' + inrFmt.format(paise / 100);
  SV.amount = (paise) => inrWhole.format(Math.round(paise / 100));
  SV.qty = (n) => (Number.isInteger(n) ? String(n) : String(n).replace(/\.00$/, ''));

  SV.clock = (ts) =>
    new Date(ts)
      .toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
      .replace(/\s?(am|pm)$/i, (_, m) => ' ' + m.toUpperCase());

  SV.dayLabel = (ts) =>
    new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  SV.since = (ts, now) => {
    const secs = Math.max(0, Math.round(((now || Date.now()) - ts) / 1000));
    if (secs < 45) return 'just now';
    const mins = Math.round(secs / 60);
    if (mins < 60) return mins + ' min ago';
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + ' hr ago';
    return Math.round(hrs / 24) + ' d ago';
  };

  /* Rupee math on paise. Half-up on the tax share, so a 5% item never loses a
     paisa to floating point across a whole bill. */
  SV.pct = (base, rate) => Math.round((base * rate) / 200);

  SV.flipHTML = (text) =>
    String(text)
      .split('')
      .map((ch, i) =>
        ch === ' '
          ? '<span class="ch ch-gut" aria-hidden="true"></span>'
          : `<span class="ch" style="--i:${i}" aria-hidden="true">${SV.esc(ch)}</span>`
      )
      .join('') + `<span class="sr">${SV.esc(text)}</span>`;

  SV.el = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  SV.on = (root, evt, sel, fn) =>
    root.addEventListener(evt, (e) => {
      const hit = e.target.closest(sel);
      if (hit && root.contains(hit)) fn(e, hit);
    });

  SV.todayStart = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
})(window.SV);