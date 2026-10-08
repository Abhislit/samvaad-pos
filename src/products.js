/* SAMVAAD POS — WhatsApp product matching.
   SAMVAAD cloud keys lines to the shop's own product IDs. This is the fallback
   when one does not resolve, and the reason a bill can be trusted: an unmatched
   line stays unpriced and says so, rather than quietly costing nothing. */
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

  };
})(window.SV);