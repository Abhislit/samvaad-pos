/* SAMVAAD POS — bill derivation and the money.
   A bill inherits its lines from an order. The operator changes discount,
   payment and customer details; products are never re-keyed. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const roundPaise = (n) => Math.round(n);

  SV.bills = {
    /* Per-line money. Tax is computed on the line value after its own discount,
       then split half into CGST and half into SGST. */
    linesOf(items) {
      return items.map((line) => {
        const gross = line.qty * line.unitPrice;
        const discount = Math.min(line.discount || 0, gross);
        const taxable = gross - discount;
        const cgst = SV.pct(taxable, line.gst || 0);
        return Object.assign({}, line, {
          discount,
          gross,
          taxable,
          cgst,
          sgst: SV.pct(taxable, line.gst || 0),
          net: taxable + 2 * SV.pct(taxable, line.gst || 0)
        });
      });
    },

    totalsOf(lines, opts) {
      const o = opts || {};
      const subtotal = lines.reduce((s, l) => s + l.gross, 0);
      const lineDiscount = lines.reduce((s, l) => s + l.discount, 0);
      const cgst = lines.reduce((s, l) => s + l.cgst, 0);
      const sgst = lines.reduce((s, l) => s + l.sgst, 0);
      const billDiscount = Math.max(0, Math.min(roundPaise(o.discount || 0), subtotal - lineDiscount));
      const delivery = Math.max(0, roundPaise(o.delivery || 0));
      return {
        subtotal,
        lineDiscount,
        discount: billDiscount,
        taxable: subtotal - lineDiscount - billDiscount,
        cgst,
        sgst,
        delivery,
        grand: subtotal - lineDiscount - billDiscount + cgst + sgst + delivery
      };
    },

    /* The whole point of the product: this bill is the WhatsApp order, priced.
       A counter sale passes an order-shaped object with no orderId. */
    fromOrder(order, opts) {
      const o = opts || {};
      const lines = SV.bills.linesOf(order.items);
      const totals = SV.bills.totalsOf(lines, {
        discount: o.discount != null ? o.discount : order.discount || 0,
        delivery: o.delivery != null ? o.delivery : deliveryCharge(order)
      });
      return {
        billNo: SV.bills.nextNo(),
        orderId: order.id || null,
        source: order.source || 'counter',
        customerId: order.customerId || null,
        customer: Object.assign(
          { name: order.customerName || 'Walk-in customer', phone: order.phone || '', address: order.address || '' },
          o.customer || {}
        ),
        items: order.items.map((l) => Object.assign({}, l)),
        payment: o.payment || order.payment || 'Cash',
        createdAt: o.createdAt || Date.now(),
        lines,
        totals
      };
    },

    save(bill) {
      SV.store.update((s) => {
        s.bills.unshift(bill);
        s.billSeq += 1;
        if (bill.orderId) {
          const order = s.orders.find((o) => o.id === bill.orderId);
          if (order) {
            order.billNo = bill.billNo;
            order.discount = bill.totals.discount;
            order.payment = bill.payment;
          }
        }
      });
      return bill;
    },

    nextNo() {
      return 'B-' + String(SV.store.state.billSeq + 1).padStart(5, '0');
    },

    byNo(no) { return SV.store.state.bills.find((b) => b.billNo === no) || null; },

    recalc(bill, opts) {
      const lines = SV.bills.linesOf(bill.items);
      return Object.assign({}, bill, lines, {
        totals: SV.bills.totalsOf(lines, {
          discount: opts.discount != null ? opts.discount : bill.totals.discount,
          delivery: opts.delivery != null ? opts.delivery : bill.totals.delivery
        })
      });
    }
  };

  /* Delivery is a flat shop charge in the demo. The brief's worked example puts
     ₹20 on top of a ₹130 basket; keep that as the single rule. */
  function deliveryCharge(order) {
    return order.delivery === 'delivery' ? 2000 : 0;
  }
})(window.SV);