/* SAMVAAD POS — printing.
   The receipt is built straight from the order, because that is all there is
   and the order is already correct. The receipt is the only thing that ever
   reaches paper: everything else is removed from the print tree. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const PAPERS = {
    '58': { mm: '54mm', label: '58 mm' },
    '80': { mm: '72mm', label: '80 mm' },
    a4: { mm: '210mm', label: 'A4' }
  };

  let pageRule = null;

  /* A thermal head is told its own paper width. */
  function pageStyle() {
    if (!pageRule) {
      pageRule = document.createElement('style');
      pageRule.id = 'samvaad-page-rule';
      document.head.appendChild(pageRule);
    }
    const paper = PAPERS[SV.store.state.ui.paper] || PAPERS['80'];
    pageRule.textContent = '@page { size: ' + paper.mm + ' auto; margin: 3mm; }';
  }

  function receiptHTML(order) {
    const e = SV.esc;
    const s = SV.store.state;
    const n = (paise) => SV.money(paise).replace(/\.00$/, '');
    const { lines, totals } = SV.orders.money(order);

    const items = lines.map((l) =>
      '<div class="r-item">' +
        `<div class="n"><span>${l.qty} x ${e(l.name)}</span><span>${e(n(l.net))}</span></div>` +
        '<div class="d">' + e(SV.money(l.unitPrice)) + ' each' +
        (l.gst ? ` <i>${l.gst}% GST</i>` : '') +
        (l.pack ? ' · ' + e(l.pack) : '') +
        '</div></div>'
    ).join('');

    const tax = SV.bills.slabs(lines)
      .map((sl) =>
        `<div class="r-row"><span>CGST @ ${sl.rate}%</span><span>${e(n(sl.half))}</span></div>` +
        `<div class="r-row"><span>SGST @ ${sl.rate}%</span><span>${e(n(sl.half))}</span></div>`
      ).join('');

    return (
      '<div class="r-shop">' + e(s.shop.name) + '</div>' +
      '<div class="r-sub">' + e(s.shop.line2) + '</div>' +
      '<div class="r-sub">' + e(s.shop.phone) + ' · GSTIN ' + e(s.shop.gstin) + '</div>' +
      '<div class="r-hr"></div>' +
      '<div class="r-row"><span>BILL ' + e(order.billNo) + '</span><span>' + e(SV.dayLabel(order.createdAt)) + '</span></div>' +
      '<div class="r-row"><span>ORDER ' + e(order.id) + '</span><span>' + e(SV.clock(order.createdAt)) + '</span></div>' +
      '<div class="r-hr"></div>' +
      '<div class="r-label">CUSTOMER</div>' +
      '<div>' + e(order.customerName) + '</div>' +
      (order.phone ? '<div>' + e(order.phone) + '</div>' : '') +
      (order.address ? '<div>' + e(order.address) + '</div>' : '') +
      '<div class="r-hr"></div>' +
      '<div class="r-label">ITEM</div>' +
      items +
      '<div class="r-hr"></div>' +
      '<div class="r-row"><span>SUBTOTAL</span><span>' + e(n(totals.subtotal)) + '</span></div>' +
      tax +
      (totals.delivery ? '<div class="r-row"><span>DELIVERY</span><span>' + e(n(totals.delivery)) + '</span></div>' : '') +
      '<div class="r-hr dbl"></div>' +
      '<div class="r-row r-total"><span>TOTAL</span><span>' + e(SV.money(totals.grand)) + '</span></div>' +
      '<div class="r-hr"></div>' +
      '<div class="r-row"><span>PAID BY</span><span>' + e(order.payment) + '</span></div>' +
      '<div class="r-src">' + (order.source === 'whatsapp'
        ? 'ORDERED ON WHATSAPP · ' + e(order.id)
        : 'COUNTER SALE') + '</div>' +
      '<div class="r-foot">Printed from SAMVAAD POS · ' + e(SV.printer.modeLabel()) + '</div>' +
      '<div class="r-cut"></div>'
    );
  }

  SV.printer = {
    PAPERS,
    /* Exposed so the self-check can assert on the paper without printing it. */
    receiptFor: receiptHTML,

    paperLabel() {
      const p = PAPERS[SV.store.state.ui.paper] || PAPERS['80'];
      return p.label;
    },

    /* Honest by construction: the browser prints, and it says so on the paper. */
    modeLabel() { return SV.connector.isAvailable() ? 'Local connector' : 'Browser print'; },

    /* Print one order. The receipt target stays hidden for the whole session:
       print.css's #receipt is an ID selector, so it outranks the [hidden]
       attribute rule and reveals the receipt for print only. */
    async print(order) {
      if (SV.connector.isAvailable()) {
        const result = await SV.connector.sendToLocalConnector(order);
        if (result.sent) return result;
      }
      const { totals } = SV.orders.money(order);
      SV.$('#receipt').innerHTML = receiptHTML(order);
      pageStyle();
      window.print();
      return { printed: true, total: totals.grand };
    }
  };
})(window.SV);