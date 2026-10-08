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

  /* Read from the same tokens the stylesheet is timed by. */
  const ms = (name) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
  const FEED_MS = ms('--feed-ms') || 1150;
  const TEAR_MS = ms('--tear-ms') || 260;

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

    /* ── the feed ──────────────────────────────────────────────────────
       The paper comes out of the machine, travels at a platen's constant
       rate, then tears on its perforation. Resolves when the sheet is off,
       so the caller can hand the real receipt to the printer afterwards. */
    feed(order, opts) {
      /* A batch asked for everything at once moves at a working pace rather
         than one sheet at reading pace. */
      const quick = !!(opts && opts.quick);
      const outlet = SV.$('#outlet');
      const paper = SV.$('#paper');
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

      paper.innerHTML = receiptHTML(order);
      outlet.hidden = false;
      outlet.classList.remove('is-tearing');

      /* Height has to be measured: the sheet is as long as the order is. */
      paper.style.height = 'auto';
      const full = paper.scrollHeight;
      paper.style.height = '';
      paper.style.setProperty('--feed-h', full + 'px');
      paper.style.setProperty('--feed-ms', (quick ? FEED_MS * 0.5 : FEED_MS) + 'ms');

      /* Forced reflow so the feed animation starts from zero every time. */
      void paper.offsetHeight;
      if (calm.matches) {
        /* Reduced motion keeps the outcome: the sheet is shown finished, held
           long enough to read, and then goes. No movement. */
        paper.style.height = full + 'px';
        return new Promise((done) => setTimeout(() => {
          outlet.hidden = true;
          paper.style.height = '';
          done();
        }, 1400));
      }

      return new Promise((done) => {
        const pace = quick ? FEED_MS * 0.5 : FEED_MS;
        setTimeout(() => outlet.classList.add('is-tearing'), pace + 90);
        setTimeout(() => {
          outlet.hidden = true;
          paper.style.height = '';
          paper.classList.remove('is-tearing');
          outlet.classList.remove('is-tearing');
          done();
        }, pace + 90 + TEAR_MS);
      });
    },

    /* The real thing leaves the machine. One or many sheets, one print job:
       a batch must never open a dialog per receipt. */
    async handTo(orders) {
      const batch = Array.isArray(orders) ? orders : [orders];
      if (SV.connector.isAvailable()) {
        const result = await SV.connector.sendToLocalConnector(batch[0]);
        if (result.sent) return result;
      }
      SV.$('#receipt').innerHTML =
        batch.map((o) => '<div class="r-sheet">' + receiptHTML(o) + '</div>').join('');
      pageStyle();
      window.print();
      return { printed: true, count: batch.length };
    },

    /* Every sheet, fed in turn. Resolves when the stack is through, so the
       caller can hand the whole batch to the printer once.

       Reduced motion shows one sheet for the hold rather than every sheet for
       a quarter of a second each: a seven-sheet batch would otherwise stand
       still for seven seconds, which is worse than any animation is worth. */
    async feedAll(orders) {
      if (!orders.length) return;
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (calm) return void (await SV.printer.feed(orders[orders.length - 1], { quick: true }));
      for (const order of orders) await SV.printer.feed(order, { quick: true });
    },
    /* Exposed so the self-check can assert on the paper without printing it. */
    receiptFor: receiptHTML,

    paperLabel() {
      const p = PAPERS[SV.store.state.ui.paper] || PAPERS['80'];
      return p.label;
    },

    /* Honest by construction: the browser prints, and it says so on the paper. */
    modeLabel() { return SV.connector.isAvailable() ? 'Local connector' : 'Browser print'; },

    /* Feed the sheet out of the machine, then print it. */
    async print(order) {
      const { totals } = SV.orders.money(order);
      SV.notifications.ratchet();
      await SV.printer.feed(order);
      const result = await SV.printer.handTo(order);
      return Object.assign({ total: totals.grand }, result);
    },
  };
})(window.SV);