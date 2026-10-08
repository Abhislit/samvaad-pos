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

  function meta(order) {
    const e = SV.esc;
    return '<span class="mono">' + e(SV.clock(order.createdAt)) + '</span>' +
      '<span>' + (order.source === 'whatsapp' ? 'WhatsApp' : 'Counter') + '</span>' +
      '<span>' + e(DELIVERY[order.delivery]) + '</span>' +
      '<span>' + e(order.payment) + '</span>';
  }

  function actions(order, extraClass) {
    const e = SV.esc;
    const out = [];
    out.push('<button class="btn btn-ghost btn-sm' + (extraClass || '') + '" data-ticket-open="' + e(order.id) + '">View order</button>');
    if (order.billNo) {
      out.push('<span class="tag">Billed ' + e(order.billNo) + '</span>');
    } else if (SV.orders.canBill(order)) {
      out.push('<button class="btn btn-ghost btn-sm" data-bill-open="' + e(order.id) + '">Bill</button>');
    }
    const next = SV.orders.nextAction(order);
    if (next) {
      out.push('<button class="btn btn-seal btn-sm" data-ticket-advance="' + e(order.id) + '">' +
        e(next.label) + '<span class="chev" aria-hidden="true"></span></button>');
    }
    return out.join('');
  }

  /* The full ticket, for the one tray that needs a decision made about it.
     Everything an operator needs to accept an order without opening it. */
  function ticketCard(order, fresh) {
    const e = SV.esc;
    const m = money(order);
    const unmatched = order.items.filter((l) => l.unmatched);
    const shown = order.items.slice(0, 3);
    const hidden = order.items.length - shown.length;

    return (
      '<article class="ticket ticket--live' + (fresh ? ' is-fresh' : '') + '" data-ticket="' + e(order.id) +
        '" data-status="' + e(order.status) + '" tabindex="-1">' +
        '<div class="ticket-head">' +
          '<span class="ticket-lot">' + (fresh ? SV.flipHTML(order.id) : e(order.id)) + '</span>' +
          plate(order) +
        '</div>' +
        '<button class="ticket-name" data-ticket-open="' + e(order.id) + '">' + e(order.customerName) + '</button>' +
        '<div class="ticket-when">' + meta(order) + '</div>' +
        (unmatched.length
          ? '<p class="flag flag-warn">' + WARN + '<span class="flag-bad">' + unmatched.length + ' product' +
            (unmatched.length > 1 ? 's' : '') + ' not found</span></p>'
          : '') +
        '<hr class="rule">' +
        '<ul class="ticket-lines">' +
          shown.map((l) =>
            '<li><span class="q">' + SV.qty(l.qty) + '</span>' +
            '<span class="nm">' + e(l.name) + '</span>' +
            '<span class="amt">' + e(SV.money(l.qty * l.unitPrice)) + '</span></li>'
          ).join('') +
          (hidden > 0 ? '<li class="more">+' + hidden + ' more item' + (hidden > 1 ? 's' : '') + '</li>' : '') +
        '</ul>' +
        (order.notes ? '<p class="flag flag-note">' + e(order.notes) + '</p>' : '') +
        '<div class="ticket-foot">' +
          '<span class="ticket-count">' + m.units + ' item' + (m.units === 1 ? '' : 's') + '</span>' +
          '<span class="ticket-total"><i>₹</i><b>' + SV.amount(m.grand) + '</b></span>' +
        '</div>' +
        '<div class="ticket-actions">' + actions(order) + '</div>' +
      '</article>'
    );
  }

  /* Everything past NEW is already claimed, so it needs to be scanned, not
     read. Two lines: what it is, what to press. */
  function ticketRow(order) {
    const e = SV.esc;
    const m = money(order);
    const next = SV.orders.nextAction(order);
    return (
      '<article class="ticket ticket--row" data-ticket="' + e(order.id) +
        '" data-status="' + e(order.status) + '" tabindex="-1">' +
        '<div class="row-top">' +
          plate(order) +
          '<button class="row-lot" data-ticket-open="' + e(order.id) + '">' + e(order.id) + '</button>' +
          /* A settled ticket's time is history; its lot number and bill are not. */
          (order.status === 'completed'
            ? ''
            : '<span class="row-when mono">' + e(SV.clock(order.createdAt)) + '</span>') +
          '<span class="row-total"><i>₹</i><b>' + SV.amount(m.grand) + '</b></span>' +
        '</div>' +
        '<div class="row-bot">' +
          '<button class="row-who" data-ticket-open="' + e(order.id) + '">' +
            e(order.customerName) +
          '</button>' +
/* A row carries the state change, and the bill beside it once the
             order is billable. An accepted ticket can be billed, and reaching
             that bill should not cost a detour through the detail view. */
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
      '</article>'
    );
  }

  function ticketHTML(order, opts) {
    return order.status === 'new'
      ? ticketCard(order, (opts || {}).fresh)
      : ticketRow(order);
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