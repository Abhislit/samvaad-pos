/* SAMVAAD POS — printing.
   The receipt is the only thing that reaches paper. Everything else is removed
   from the print tree rather than faded out. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const PAPERS = {
    '58': '54mm',
    '80': '72mm',
    a4: '210mm'
  };

  let pageRule = null;

  function pageStyle() {
    if (!pageRule) {
      pageRule = document.createElement('style');
      pageRule.id = 'samvaad-page-rule';
      document.head.appendChild(pageRule);
    }
    const width = PAPERS[SV.store.state.ui.paper] || PAPERS['80'];
    pageRule.textContent = '@page { size: ' + width + ' auto; margin: 3mm; }';
  }

  /* Slab totals are the honest way to print a thermal bill: one CGST and one
     SGST line per distinct rate, rather than a line per item that would wrap
     on a 58 mm tray. */
  function taxSlabs(lines) {
    const byRate = new Map();
    lines.forEach((l) => {
      if (!l.gst) return;
      const cur = byRate.get(l.gst) || { rate: l.gst, base: 0 };
      cur.base += l.taxable;
      byRate.set(l.gst, cur);
    });
    return Array.from(byRate.values()).map((sl) => ({ rate: sl.rate, half: SV.pct(sl.base, sl.rate) }));
  }

  function receiptHTML(bill) {
    const s = SV.store.state;
    const t = bill.totals;
    const e = SV.esc;
    const n = (paise) => SV.money(paise).replace(/\.00$/, '');

    const lines = bill.lines
      .map((l) => {
        const tax = l.gst ? ` <i>${l.gst}% GST</i>` : '';
        return (
          '<div class="r-item">' +
          `<div class="n"><span>${l.qty} x ${e(l.name)}</span><span>${e(n(l.net))}</span></div>` +
          `<div class="d">${e(SV.money(l.unitPrice))} each${l.discount ? ' − ' + e(n(l.discount)) + ' disc' : ''}${tax}` +
          (l.pack ? ' · ' + e(l.pack) : '') +
          '</div></div>'
        );
      })
      .join('');

    /* Slab totals are the honest way to print it: one CGST and one SGST line per
       distinct rate, computed from that rate's share of the tax. */
    const slabs = taxSlabs(bill.lines);
    const taxBlock = slabs
      .map((s2) =>
        `<div class="r-row"><span>CGST @ ${s2.rate}%</span><span>${e(n(s2.half))}</span></div>` +
        `<div class="r-row"><span>SGST @ ${s2.rate}%</span><span>${e(n(s2.half))}</span></div>`
      )
      .join('');

    const source = bill.source === 'whatsapp'
      ? `<div class="r-src">ORDERED ON WHATSAPP${bill.orderId ? ' · ' + e(bill.orderId) : ''}</div>`
      : '<div class="r-src">COUNTER SALE</div>';

    return (
      '<div class="r-shop">' + e(s.shop.name) + '</div>' +
      '<div class="r-sub">' + e(s.shop.line2) + '</div>' +
      '<div class="r-sub">' + e(s.shop.phone) + ' · GSTIN ' + e(s.shop.gstin) + '</div>' +
      '<div class="r-hr"></div>' +
      '<div class="r-row"><span>BILL ' + e(bill.billNo) + '</span><span>' + e(SV.dayLabel(bill.createdAt)) + '</span></div>' +
      (bill.orderId ? '<div class="r-row"><span>ORDER ' + e(bill.orderId) + '</span><span>' + e(SV.clock(bill.createdAt)) + '</span></div>' : '') +
      '<div class="r-hr"></div>' +
      '<div class="r-label">CUSTOMER</div>' +
      '<div>' + e(bill.customer.name) + '</div>' +
      (bill.customer.phone ? '<div>' + e(bill.customer.phone) + '</div>' : '') +
      (bill.customer.address ? '<div>' + e(bill.customer.address) + '</div>' : '') +
      '<div class="r-hr"></div>' +
      '<div class="r-label">ITEM</div>' +
      lines +
      '<div class="r-hr"></div>' +
      '<div class="r-row"><span>SUBTOTAL</span><span>' + e(n(t.subtotal)) + '</span></div>' +
      (t.lineDiscount ? '<div class="r-row"><span>ITEM DISCOUNT</span><span>−' + e(n(t.lineDiscount)) + '</span></div>' : '') +
      (t.discount ? '<div class="r-row"><span>DISCOUNT</span><span>−' + e(n(t.discount)) + '</span></div>' : '') +
      taxBlock +
      (t.delivery ? '<div class="r-row"><span>DELIVERY</span><span>' + e(n(t.delivery)) + '</span></div>' : '') +
      '<div class="r-hr dbl"></div>' +
      '<div class="r-row r-total"><span>TOTAL</span><span>' + e(SV.money(t.grand)) + '</span></div>' +
      '<div class="r-hr"></div>' +
      '<div class="r-row"><span>PAID BY</span><span>' + e(bill.payment) + '</span></div>' +
      source +
      '<div class="r-foot">Printed from SAMVAAD POS · Browser print</div>' +
      '<div class="r-cut"></div>'
    );
  }

  SV.printer = {
    PAPERS,
    modeLabel() { return SV.connector.isAvailable() ? 'Local connector' : 'Browser print'; },

    /* Render the receipt into the print target, then print. */
    /* The receipt target stays `hidden` for the whole session. print.css's
       `#receipt` is an ID selector, so it outranks `[hidden]`'s attribute
       selector and reveals the receipt for print only — no unhide, and so no
       chance of leaving an unstyled receipt lying at the bottom of the page. */
    async printBill(bill) {
      if (SV.connector.isAvailable()) {
        const result = await SV.connector.sendToLocalConnector(bill);
        if (result.sent) return result;
      }
      const host = SV.$('#receipt');
      host.innerHTML = receiptHTML(bill);
      pageStyle();
      window.print();
      return { sent: false, printed: true };
    },

    /* A preview the operator can see on screen, properly styled — the markup
       above is print-only by design. */
    preview(bill) {
      const sheet = SV.$('#billsheet');
      if (!sheet) return;
      let pre = SV.$('#bill-preview');
      if (!pre) {
        pre = document.createElement('div');
        pre.id = 'bill-preview';
        pre.className = 'bill-preview';
        const scroll = SV.$('.billsheet-scroll');
        if (scroll) scroll.appendChild(pre);
      }
      pre.innerHTML = '<span class="bill-preview-h">How this will print</span>' + receiptHTML(bill);
      pre.hidden = false;
    },

    /* Same markup on screen, for previewing before the operator commits paper. */
    previewHTML(bill) { return receiptHTML(bill); }
  };
})(window.SV);