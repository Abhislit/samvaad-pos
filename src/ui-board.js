/* SAMVAAD POS — the order board: four trays of lot tickets. */
window.SV = window.SV || {};

(function (SV) {
  'use strict';

  const LANES = [
    { key: 'new', name: 'New', hint: 'Waiting to be picked up', empty: 'No new tickets' },
    { key: 'preparing', name: 'Preparing', hint: 'Claimed, being filled', empty: 'Nothing being filled' },
    { key: 'ready', name: 'Ready', hint: 'Out for delivery or pickup', empty: 'Nothing waiting to go' },
    { key: 'completed', name: 'Completed', hint: 'Billed and gone', empty: 'No completed tickets yet' }
  ];

  const DELIVERY = { delivery: 'Delivery', pickup: 'Pickup' };

  /* Which rows are dropped open. View state, not order state: it is never
     persisted, because the next person to open the board should see the same
     queue the last one did. */
  const dropped = new Set();

  /* Every mark in this world is drawn, not typed. */
  const WARN = '<span class="warn-glyph" aria-hidden="true"></span>';

  function plate(order) {
    const spec = SV.orders.SPEC[order.status];
    return '<span class="plate" data-ink="' + spec.plate + '">' + SV.esc(spec.label) + '</span>';
  }

  /* A ticket's money, computed once and shared by both densities. */
  function money(order) {
    const lines = SV.bills.linesOf(order.items);
    return {
      units: order.items.reduce((s, l) => s + l.qty, 0),
      grand: SV.bills.totalsOf(lines, { delivery: order.delivery === 'delivery' ? 2000 : 0 }).grand
    };
  }

  /* One ticket, one shape, every tray. At a counter you scan for who, how much
     and how old, then open one. The items, the notes and the address are one
     click away in the drawer, which is where a shopkeeper reads them properly
     anyway. Only the not-found flag earns face space on the row, because it is
     work waiting to be done rather than information to be read. */
  function ticketHTML(order, opts) {
    const o = opts || {};
    const e = SV.esc;
    const m = money(order);
    const unmatched = order.items.filter((l) => l.unmatched).length;
    const next = SV.orders.nextAction(order);
    const fresh = !!o.fresh;
    const open = dropped.has(order.id);

    const flag = unmatched
      ? '<span class="row-flag" title="This order has ' + unmatched + ' item' + (unmatched > 1 ? 's' : '') +
        ' SAMVAAD could not price. Open the order to match ' + (unmatched > 1 ? 'them' : 'it') + '.">' +
        WARN + '<span class="sr">' + unmatched + ' product' + (unmatched > 1 ? 's' : '') + ' not found</span></span>'
      : '';

    return (
      '<article class="ticket ticket--row' + (fresh ? ' is-fresh' : '') + '" data-ticket="' + e(order.id) +
        '" data-status="' + e(order.status) + '" tabindex="-1">' +
        '<div class="row-top">' +
          plate(order) +
          '<button class="row-lot" data-ticket-open="' + e(order.id) + '">' +
            (fresh ? SV.flipHTML(order.id) : e(order.id)) + '</button>' +
          '<span class="row-total"><i>₹</i><b>' + SV.amount(m.grand) + '</b></span>' +
          '<button class="caret" data-ticket-drop="' + e(order.id) + '"' +
            ' aria-expanded="' + (open ? 'true' : 'false') + '"' +
            ' aria-label="' + (open ? 'Hide' : 'Show') + ' what ' + e(order.id) + ' contains">' +
            '<span class="caret-mark" aria-hidden="true"></span></button>' +
        '</div>' +
        '<div class="row-bot">' +
          '<button class="row-who" data-ticket-open="' + e(order.id) + '">' +
            '<span class="nm">' + e(order.customerName) + '</span>' +
            '<span class="row-when mono">' + e(SV.clock(order.createdAt)) + '</span>' +
          '</button>' +
          flag +
          (order.billNo
            ? '<span class="tag" title="Billed ' + e(order.billNo) + '">' + e(order.billNo) + '</span>'
            : (SV.orders.canBill(order)
                ? '<button class="btn btn-ghost btn-sm row-bill" data-bill-open="' + e(order.id) + '">Bill</button>'
                : '') +
              (next
                ? '<button class="btn btn-seal btn-sm" data-ticket-advance="' + e(order.id) + '">' +
                  e(next.label) + '<span class="chev" aria-hidden="true"></span></button>'
                : /* Completed and unbilled: the bill is the only action left. */
                  '<button class="btn btn-seal btn-sm" data-bill-open="' + e(order.id) + '">Generate bill</button>')) +
        '</div>' +
        (open ? detailHTML(order) : '') +
      '</article>'
    );
  }

  /* What the row is hiding: the lines, the note, and where it is going. Enough
     to accept an order without opening it, which is what the full card used to
     carry for every ticket in every tray. */
  function detailHTML(order) {
    const e = SV.esc;
    const items = order.items;
    return '<div class="row-detail">' +
      '<ul class="row-lines">' +
        items.map((l) =>
          '<li' + (l.unmatched ? ' class="is-unmatched"' : '') + '>' +
            '<span class="q">' + SV.qty(l.qty) + '</span>' +
            '<span class="nm">' + (l.unmatched ? WARN : '') + e(l.name) + '</span>' +
            '<span class="amt">' + e(SV.money(l.qty * l.unitPrice)) + '</span>' +
          '</li>'
        ).join('') +
      '</ul>' +
      '<div class="row-facts">' +
        '<span>Received ' + e(SV.clock(order.createdAt)) + '</span>' +
        '<span>' + (order.source === 'whatsapp' ? 'Ordered on WhatsApp' : 'Counter sale') + '</span>' +
        '<span>' + e(DELIVERY[order.delivery]) + '</span>' +
        '<span>' + e(order.payment) + '</span>' +
        '<span>' + order.items.length + ' line' + (order.items.length === 1 ? '' : 's') + '</span>' +
        (order.address && order.delivery === 'delivery'
          ? '<span class="row-addr">' + e(order.address) + '</span>' : '') +
      '</div>' +
      (order.notes ? '<p class="flag flag-note">' + e(order.notes) + '</p>' : '') +
    '</div>';
  }

  function laneHTML(lane, orders, freshId) {
    const groups = [];
    if (lane.key === 'preparing') {
      const claimed = orders.filter((o) => o.status === 'accepted');
      const filling = orders.filter((o) => o.status === 'preparing');
      if (claimed.length) {
        groups.push('<p class="lane-sub">Accepted · to start</p>');
        groups.push(claimed.map((o) => ticketHTML(o, { fresh: o.id === freshId })).join(''));
      }
      groups.push(filling.map((o) => ticketHTML(o, { fresh: o.id === freshId })).join(''));
    } else {
      groups.push(orders.map((o) => ticketHTML(o, { fresh: o.id === freshId })).join(''));
    }
    if (!orders.length) {
      groups.push('<div class="lane-empty"><b>' + SV.esc(lane.empty) + '</b>' + SV.esc(lane.hint) + '</div>');
    }

    return (
      '<section class="lane" data-lane="' + lane.key + '">' +
        '<header class="lane-head">' +
          '<h2 class="lane-name">' + SV.esc(lane.name) + '</h2>' +
          '<span class="lane-count" data-lane-count="' + lane.key + '">' + orders.length + '</span>' +
        '</header>' +
        '<div class="lane-body">' + groups.filter(Boolean).join('') + '</div>' +
      '</section>'
    );
  }

  SV.board = {
    LANES,
    ticketHTML,

    /* Drop one row open or shut. Re-renders the board so the row keeps its
       place in the tray rather than jumping. */
    toggleDrop(id) {
      if (dropped.has(id)) dropped.delete(id);
      else dropped.add(id);
      SV.board.render(SV.$('#board'), {});
    },

    anyDropped() { return dropped.size > 0; },

    collapseAll() { dropped.clear(); SV.board.render(SV.$('#board'), {}); },

    render(root, opts) {
      const o = opts || {};
      const state = SV.store.state;
      const focus = state.ui.focus;
      const orders = state.orders;

      /* innerHTML takes markup, so build the string first and mark the focused lane
       on the nodes afterwards. */
      root.innerHTML = LANES.map((lane) => {
        const inLane = orders.filter((ord) => SV.orders.laneOf(ord) === lane.key);
        /* The NEW tray fills from the top; the working trays fill oldest first,
           so the oldest ticket is never buried. */
        const sorted = inLane.slice().sort((a, b) =>
          lane.key === 'new' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
        return laneHTML(lane, sorted, o.freshId);
      }).join('');

      if (focus) {
        SV.$$('.lane', root).forEach((lane) => {
          lane.dataset.laneFocused = lane.dataset.lane === focus ? 'focused' : 'no';
        });
        root.dataset.focus = focus;
      } else {
        delete root.dataset.focus;
      }
    },

    /* Flash the ticket that just changed, so a status press in a full tray is
       still findable. */
    flash(orderId) {
      const node = SV.$('.ticket[data-ticket="' + orderId + '"]');
      if (!node) return;
      node.classList.add('is-alerting');
      setTimeout(() => node.classList.remove('is-alerting'), 1800);
      node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };
})(window.SV);