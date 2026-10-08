/* SAMVAAD POS — the product catalogue and WhatsApp product matching.
   SAMVAAD cloud keys lines to the shop's own product IDs; this module is the
   last line of defence when one does not resolve. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const norm = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  SV.products = {
    all() { return SV.store.state.products; },

    byId(id) { return SV.store.state.products.find((p) => p.id === id) || null; },

    /* Options for the "product not found" picker, grouped so the operator can
       find a match in one tap instead of scrolling 28 rows. */
    options() {
      const byCat = new Map();
      SV.store.state.products.forEach((p) => {
        if (!byCat.has(p.cat)) byCat.set(p.cat, []);
        byCat.get(p.cat).push(p);
      });
      return Array.from(byCat, ([cat, items]) => ({ cat, items }));
    },

    /* Turn one line out of an incoming payload into a priced POS line.
       The cloud's ID wins; a name match is the fallback; anything else stays
       unmatched and the operator resolves it by hand. */
    resolve(item, catalogue) {
      const cat = catalogue || SV.store.state.products;
      const byId = cat.find((p) => p.id === item.product_id);
      if (byId) {
        return SV.products.line(byId, item.quantity, item);
      }

      const wanted = norm(item.name);
      if (wanted) {
        const hit = cat.find((p) => {
          const n = norm(p.name);
          return n === wanted || n.startsWith(wanted + ' ') || wanted.startsWith(n + ' ') || n.includes(wanted);
        });
        if (hit) return SV.products.line(hit, item.quantity, item);
      }

      return {
        productId: item.product_id || null,
        name: item.name || 'Unnamed item',
        pack: '',
        qty: Number(item.quantity) || 1,
        unitPrice: Math.round((Number(item.unit_price) || 0) * 100),
        gst: Number(item.gst) || 0,
        discount: 0,
        unmatched: true,
        suggested: item.name || ''
      };
    },

    line(product, qty, incoming) {
      return {
        productId: product.id,
        name: product.name,
        pack: product.pack,
        qty: Number(qty) || 1,
        unitPrice: product.price,
        gst: product.gst,
        discount: 0,
        unmatched: false,
        /* Keep whatever the cloud claimed, for the receipt trail. */
        claimed: incoming && incoming.unit_price != null
          ? Math.round(Number(incoming.unit_price) * 100)
          : product.price
      };
    },

    /* Operator hand-off for a not-found line. */
    adopt(orderId, lineIndex, productId) {
      const p = SV.products.byId(productId);
      if (!p) return false;
      const order = SV.orders.byId(orderId);
      if (!order) return false;
      const line = order.items[lineIndex];
      if (!line) return false;
      SV.store.update((s) => {
        const target = s.orders.find((o) => o.id === orderId).items[lineIndex];
        target.productId = p.id;
        target.name = p.name;
        target.pack = p.pack;
        target.unitPrice = p.price;
        target.gst = p.gst;
        target.unmatched = false;
        target.claimed = undefined;
      });
      return true;
    },

    /* Live price and GST edits from the Products screen. */
    edit(id, patch) {
      SV.store.update((s) => {
        const p = s.products.find((x) => x.id === id);
        if (!p) return;
        if (patch.price != null) p.price = Math.max(0, Math.round(patch.price));
        if (patch.gst != null) p.gst = Math.max(0, Math.round(patch.gst));
      });
    }
  };
})(window.SV);