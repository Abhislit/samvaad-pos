/* SAMVAAD POS — authored demonstration data.
   Every name, phone, address, price and order here is synthetic. Nothing in
   this file is a real customer, a real shop or a real transaction. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  /* Prices are paise. GST is the Indian slab rate for the category. */
  SV.data = {
    shop: {
      name: 'SHREE SAI PROVISION STORES',
      line2: 'Shop 14, Gandhi Market, Pune 411001',
      phone: '+91 20 2444 1180',
      gstin: '27AABCS1429B1ZX',
      upi: 'shreesai@ybl',
      /* Not modelled in this demo build. */
      filingNote: 'Invoice numbering for GST filing is not modelled in this demo build.'
    },

    products: [
      { id: 'MILK001', name: 'Amul Taaza Milk', pack: '500 ml pouch', price: 3000, gst: 5, cat: 'Dairy' },
      { id: 'MILK002', name: 'Amul Gold Milk', pack: '1 litre', price: 6200, gst: 5, cat: 'Dairy' },
      { id: 'MILK003', name: 'Amul Gold Soya Milk', pack: '500 ml', price: 4500, gst: 12, cat: 'Dairy' },
      { id: 'BREAD001', name: 'Britannia Good Day Bread', pack: '400 g', price: 4000, gst: 18, cat: 'Bakery' },
      { id: 'BIS001', name: 'Parle-G Gold Medal Biscuits', pack: '100 g', price: 1000, gst: 18, cat: 'Bakery' },
      { id: 'BIS002', name: 'Britannia Marie Gold Biscuits', pack: '250 g', price: 2000, gst: 18, cat: 'Bakery' },
      { id: 'BUT001', name: 'Amul Butter', pack: '500 g', price: 28500, gst: 12, cat: 'Dairy' },
      { id: 'CHE001', name: 'Amul Cheese Slices', pack: '10 slices', price: 21000, gst: 12, cat: 'Dairy' },
      { id: 'ATA001', name: 'Aashirvaad Whole Wheat Atta', pack: '5 kg', price: 26500, gst: 5, cat: 'Staples' },
      { id: 'OIL001', name: 'Fortune Sunflower Oil', pack: '1 litre', price: 13800, gst: 5, cat: 'Staples' },
      { id: 'SAL001', name: 'Tata Iodised Salt', pack: '1 kg', price: 2800, gst: 5, cat: 'Staples' },
      { id: 'TEA001', name: 'Lipton Gold Tea', pack: '250 g', price: 13000, gst: 5, cat: 'Beverages' },
      { id: 'COC001', name: 'Coca-Cola', pack: '750 ml', price: 4500, gst: 28, cat: 'Beverages' },
      { id: 'PEP001', name: 'Pepsi', pack: '750 ml', price: 4200, gst: 28, cat: 'Beverages' },
      { id: 'MAG001', name: 'Maggi 2-Minute Noodles', pack: '70 g', price: 1400, gst: 12, cat: 'Staples' },
      { id: 'SUG001', name: 'Sugar', pack: '1 kg', price: 4400, gst: 5, cat: 'Staples' },
      { id: 'RAJ001', name: 'Anmol Toor Dal', pack: '1 kg', price: 17500, gst: 0, cat: 'Staples' },
      { id: 'SOY001', name: 'Tata Sampann Soy Sauce', pack: '200 ml', price: 3800, gst: 12, cat: 'Staples' },
      { id: 'TOA001', name: 'Britannia Whole Wheat Toast', pack: '400 g', price: 4500, gst: 18, cat: 'Bakery' },
      { id: 'HOM001', name: 'Surf Excel Matic', pack: '2 kg', price: 48000, gst: 18, cat: 'Household' },
      { id: 'SOAP001', name: 'Lux Beauty Soap', pack: '100 g x 3', price: 7800, gst: 18, cat: 'Household' },
      { id: 'DET001', name: 'Dettol Handwash', pack: '200 ml', price: 8900, gst: 18, cat: 'Household' },
      { id: 'COL001', name: 'Colgate MaxFresh', pack: '150 g', price: 9500, gst: 18, cat: 'Household' },
      { id: 'MST001', name: 'Good Knight Mosquito Refill', pack: '1 refill', price: 4500, gst: 18, cat: 'Household' },
      { id: 'TOM001', name: 'Tomato (loose)', pack: '1 kg', price: 3200, gst: 0, cat: 'Produce' },
      { id: 'ONI001', name: 'Onion (loose)', pack: '1 kg', price: 2800, gst: 0, cat: 'Produce' },
      { id: 'POT001', name: 'Potato (loose)', pack: '1 kg', price: 2400, gst: 0, cat: 'Produce' },
      { id: 'BAN001', name: 'Banana', pack: '1 kg', price: 5600, gst: 0, cat: 'Produce' },
      { id: 'EGG001', name: 'Farm Eggs', pack: 'dozen', price: 7800, gst: 0, cat: 'Produce' }
    ],

    customers: [
      { id: 'C001', name: 'Rahul Sharma', phone: '+91 98765 43210', address: 'Flat 302, Sai Residency, FC Road' },
      { id: 'C002', name: 'Meera Joshi', phone: '+91 98220 11478', address: '12, Shanti Nagar, Kothrud' },
      { id: 'C003', name: 'Arvind Patil', phone: '+91 97654 30912', address: 'Shop 7, Market Yard' },
      { id: 'C004', name: 'Sunita Deshmukh', phone: '+91 90112 55640', address: 'Bungalow 4, Paud Road' },
      { id: 'C005', name: 'Imran Sheikh', phone: '+91 99220 77315', address: '18, Nana Peth' },
      { id: 'C006', name: 'Kavita Menon', phone: '+91 97410 28863', address: 'Flat 11, Silver Oak, Baner' },
      { id: 'C007', name: 'Deepak Rao', phone: '+91 98867 41092', address: '26, Karve Road' },
      { id: 'C008', name: 'Anita Bhatt', phone: '+91 90969 12238', address: '3, Sarasbaug Society' },
      { id: 'C009', name: 'Suresh Kadam', phone: '+91 98225 60074', address: 'Lane 2, Kasba Peth' },
      { id: 'C010', name: 'Fatima Ansari', phone: '+91 91670 33821', address: '45, Camp' }
    ],

    notes: [
      'Please send fresh items.',
      'Ring the bell twice, I am on the second floor.',
      'No plastic bags please.',
      'Send before 6 PM.',
      'Keep the change ready.',
      'Leave it with the watchman if I am out.',
      'Please check the expiry on the milk.',
      'Extra packet of sugar.'
    ],

    payments: ['UPI', 'Cash', 'Card', 'WhatsApp Pay'],

    /* The exact payload shape SAMVAAD cloud hands to the local POS. */
    incoming: {
      order_id: 'SAM-10294',
      source: 'whatsapp',
      customer: { name: 'Rahul Sharma', phone: '+919876543210' },
      items: [
        { product_id: 'MILK001', name: 'Amul Taaza Milk', quantity: 2, unit_price: 30, gst: 0 },
        { product_id: 'BREAD001', name: 'Britannia Bread', quantity: 1, unit_price: 40, gst: 5 },
        { product_id: 'BIS001', name: 'Parle-G Biscuits', quantity: 3, unit_price: 10, gst: 5 }
      ],
      payment_method: 'UPI',
      delivery_type: 'delivery',
      notes: 'Please send fresh items.'
    }
  };

  /* Build a fresh order payload the way the cloud would send it. Paise on the
     wire, because a WhatsApp bill that disagrees with the bill book is worse
     than no bill at all. */
  /* ── the seed ─────────────────────────────────────────────────────────
     A shop part way through the day: some orders waiting, some already
     printed. Authored here rather than in app.js so the printed window can
     open the same day as the counter instead of inventing a second one. */
  SV.data.seed = function () {
    const d = SV.data;
    /* The seed is a shop part way through the day. If the real clock is in the
       small hours, `mins` ago spills the printed half into yesterday and the
       day's line reads "nothing printed yet today" directly under a screen full
       of printed tickets. Anchor to 11:40 today unless the real clock is later. */
    const anchor = SV.todayStart() + 11 * 3600e3 + 40 * 60e3;
    const now = Date.now() < anchor ? anchor : Date.now();
    const state = {
      schema: 1,
      shop: JSON.parse(JSON.stringify(d.shop)),
      products: JSON.parse(JSON.stringify(d.products)),
      orders: [],
      seq: 10293,
      billSeq: 0,
      ui: { sound: false, demo: false, demoGap: 25, paper: '80', connectorOn: false },
      conn: { online: true, lastSync: now }
    };

    const byName = (n) => state.products.length && d.customers.find((c) => c.name === n);
    const item = (id, qty) => {
      const prod = d.products.find((x) => x.id === id);
      return { product_id: prod.id, name: prod.name, quantity: qty, unit_price: prod.price / 100, gst: prod.gst };
    };

    const script = [
      { mins: 1, printed: false, c: 'Rahul Sharma', d: 'delivery', p: 'UPI', n: 'Please send fresh items.',
        i: [item('MILK001', 2), item('BREAD001', 1), item('BIS001', 3)] },
      { mins: 4, printed: false, c: 'Kavita Menon', d: 'delivery', p: 'UPI', n: 'Ring the bell twice, I am on the second floor.',
        i: [item('MILK003', 2), item('TEA001', 1), item('BIS002', 1)] },
      { mins: 7, printed: false, c: 'Suresh Kadam', d: 'pickup', p: 'Cash', n: '',
        i: [item('TOM001', 2), item('ONI001', 1), item('POT001', 3)] },
      { mins: 9, printed: false, c: 'Imran Sheikh', d: 'delivery', p: 'WhatsApp Pay', n: 'Keep the change ready.',
        i: [{ product_id: 'UNMAPPED772', name: 'Amul ghee', quantity: 1, unit_price: 0, gst: 0 }, item('EGG001', 1)] },
      { mins: 12, printed: false, c: 'Sunita Deshmukh', d: 'delivery', p: 'UPI', n: '',
        i: [item('BUT001', 1), item('BREAD001', 2)] },
      { mins: 22, printed: true, c: 'Arvind Patil', d: 'pickup', p: 'Cash', n: 'Send before 6 PM.',
        i: [item('OIL001', 1), item('ATA001', 1), item('SAL001', 2)] },
      { mins: 31, printed: true, c: 'Meera Joshi', d: 'delivery', p: 'UPI', n: 'Please check the expiry on the milk.',
        i: [item('MILK001', 4), item('CHE001', 1), item('COC001', 2)] },
      { mins: 44, printed: true, c: 'Deepak Rao', d: 'delivery', p: 'Card', n: '',
        i: [item('HOM001', 1), item('COL001', 1), item('MST001', 2)] },
      { mins: 63, printed: true, c: 'Anita Bhatt', d: 'pickup', p: 'UPI', n: 'Leave it with the watchman if I am out.',
        i: [item('SOAP001', 1), item('DET001', 2)] },
      { mins: 95, printed: true, c: 'Fatima Ansari', d: 'delivery', p: 'UPI', n: '',
        i: [item('RAJ001', 1), item('SOY001', 1), item('SUG001', 1)] },
      { mins: 140, printed: true, c: 'Rahul Sharma', d: 'delivery', p: 'UPI', n: '',
        i: [item('MILK001', 3), item('BIS001', 2), item('MAG001', 2)] },
      { mins: 210, printed: true, c: 'Kavita Menon', d: 'pickup', p: 'Cash', n: '',
        i: [item('BAN001', 2), item('TEA001', 1)] }
    ];

    script.forEach((row, n) => {
      const cust = byName(row.c);
      state.orders.push({
        id: 'SAM-' + (10293 - n),
        source: 'whatsapp',
        customerName: cust.name,
        phone: cust.phone,
        address: row.d === 'delivery' ? cust.address : '',
        items: row.i.map((raw) => SV.products.resolve(raw, state.products)),
        payment: row.p,
        delivery: row.d,
        notes: row.n,
        createdAt: now - row.mins * 60000,
        printedAt: row.printed ? now - (row.mins - 3) * 60000 : null,
        billNo: null
      });
    });

    state.seq = 10293 + script.length;
    state.orders.filter((o) => o.printedAt)
      .sort((a, b) => a.printedAt - b.printedAt)
      .forEach((o) => {
        state.billSeq += 1;
        o.billNo = 'B-' + String(state.billSeq).padStart(5, '0');
      });
    return state;
  }


  SV.data.makeIncoming = function (state, rnd) {
    const r = rnd || Math.random;
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const d = SV.data;
    const cust = pick(d.customers);
    /* Draw distinct lines, so a ticket never arrives with a single item by
       accident. */
    const basket = d.products.slice();
    const chosen = [];
    const count = Math.min(1 + Math.floor(r() * 4), basket.length);
    for (let i = 0; i < count; i += 1) {
      const at = Math.floor(r() * basket.length);
      const p = basket.splice(at, 1)[0];
      chosen.push({
        product_id: p.id,
        name: p.name,
        quantity: 1 + Math.floor(r() * 3),
        unit_price: p.price / 100,
        gst: p.gst
      });
    }

    /* Roughly one order in six carries a line SAMVAAD could not price, so the
       product-resolution path is always reachable in a demo. */
    if (r() < 0.17 && chosen.length) {
      const swap = ['Amul ghee', '20 l cylinder', 'sugar cube box', 'pan masala'][Math.floor(r() * 4)];
      chosen[Math.floor(r() * chosen.length)] = {
        product_id: 'UNMAPPED' + Math.floor(r() * 900 + 100),
        name: swap,
        quantity: 1 + Math.floor(r() * 2),
        unit_price: 0,
        gst: 0
      };
    }

    const delivery = r() < 0.62;
    return {
      order_id: 'SAM-' + (state.seq + 1),
      source: 'whatsapp',
      customer: { name: cust.name, phone: cust.phone.replace(/\s+/g, '') },
      items: chosen,
      payment_method: pick(d.payments),
      delivery_type: delivery ? 'delivery' : 'pickup',
      address: delivery ? cust.address : null,
      notes: r() < 0.55 ? pick(d.notes) : ''
    };
  };
})(window.SV);