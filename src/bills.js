/* SAMVAAD POS — the money on the receipt.
   Tax is split half into CGST and half into SGST per line, and printed grouped
   by slab. Nothing here is editable: the whole point is that the order arrived
   priced and the bill is that price. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  /* Delivery is one flat shop charge. */
  SV.DELIVERY_CHARGE = 2000;

  SV.bills = {
    linesOf(items) {
      return items.map((line) => {
        const gross = line.qty * line.unitPrice;
        const half = SV.pct(gross, line.gst || 0);
        return Object.assign({}, line, {
          gross,
          half,
          taxable: gross,
          cgst: half,
          sgst: half,
          net: gross + 2 * half
        });
      });
    },

    totalsOf(lines, opts) {
      const o = opts || {};
      const subtotal = lines.reduce((s, l) => s + l.gross, 0);
      const cgst = lines.reduce((s, l) => s + l.cgst, 0);
      const sgst = lines.reduce((s, l) => s + l.sgst, 0);
      const delivery = Math.max(0, Math.round(o.delivery || 0));
      return { subtotal, cgst, sgst, delivery, grand: subtotal + cgst + sgst + delivery };
    },

    /* One CGST and one SGST line per distinct slab, the way a thermal bill does
       it, rather than a line per item that would wrap on a 58 mm tray. */
    slabs(lines) {
      const byRate = new Map();
      lines.forEach((l) => {
        if (!l.gst) return;
        const cur = byRate.get(l.gst) || { rate: l.gst, base: 0 };
        cur.base += l.taxable;
        byRate.set(l.gst, cur);
      });
      return Array.from(byRate.values()).map((s) => ({ rate: s.rate, half: SV.pct(s.base, s.rate) }));
    }
  };
})(window.SV);