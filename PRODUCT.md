# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/vanilla JavaScript, no backend, no build step. Persistence is `localStorage`, with an
in-memory fallback for origins that block it. Source is split by concept (`orders`, `customers`,
`products`, `bills`, `printer`, `connector`, `notifications`) and loaded as plain scripts on a single
`window.SV` namespace rather than ES modules: the shop must be able to open `index.html` straight off
the disk with nothing running. Chosen by explicit user requirement, not delegated.

## Users

The primary user is the shopkeeper or shop operator of a single Indian local shop (kirana, grocery, small supermarket), working alone or with one helper at a fixed counter POS terminal. They stand or sit at a desktop screen during the trading day, often one-handed between other tasks, while WhatsApp orders arrive continuously from regular customers. Their job is to accept, prepare, bill, and print orders without retyping anything.

Secondary user: the shop owner/manager who reviews the day's sales and order flow.

## Product Purpose

SAMVAAD is a WhatsApp ordering system for local shops. Customers message a shop's WhatsApp number with an order in plain text. SAMVAAD parses that conversation into a structured order and pushes it to the shop's local POS. This application is the local POS half: it receives structured orders, makes them visible instantly, walks the operator through the order lifecycle, generates the bill from the same data, and prints the receipt.

Success means the operator never types an order twice. Every order that arrived on WhatsApp appears on screen with its customer, items, prices, and GST already populated, and one click produces a correct, printable bill.

## Positioning

SAMVAAD closes the duplicate-entry gap between a shop's WhatsApp channel and its billing machine. A neighbouring billing-only POS starts from an empty bill; a neighbouring WhatsApp tool stops at the chat. SAMVAAD's mechanism is the structured hand-off: the cloud parses the WhatsApp conversation into an order payload keyed by the shop's own product IDs, and the local POS consumes that payload directly, so the bill is generated, not re-keyed.

## Operating Context

- The canonical flow: customer WhatsApp → SAMVAAD cloud → structured order → local POS screen → shopkeeper reviews → accepts → prepares → bill → print.
- Deployment is a local web app on the shop's own POS computer, intended for 1366×768 and larger desktop screens. Tablet works; mobile is secondary.
- A future on-premise **SAMVAAD POS CONNECTOR** bridges the cloud to the local PC over WebSocket/HTTPS and may drive the shop's billing machine. Its PC communication protocol is not yet confirmed, so the connector is simulated in this build.
- The shop may own a **TRUCOUNT T-10** billing machine with a built-in thermal printer. The browser cannot drive it directly; that integration is deferred until the protocol is known. Demo printing is browser print.
- The network drops. Orders must not be lost and the operator must be able to keep working.
- Currency is INR (₹). Time is local 12-hour with AM/PM, as the shop's customers speak.

## Capabilities and Constraints

- Order lifecycle: NEW → ACCEPTED → PREPARING → READY → COMPLETED, plus CANCELLED. Operator advances status explicitly.
- Incoming WhatsApp orders appear live without a page refresh, with a new-order badge, timestamp, customer name, source marker, total, highlight animation, and an optional sound.
- Order detail view shows customer, phone, order time, delivery vs pickup, payment method, address when applicable, line items with quantity/price/discount/GST/line total, and free-text notes from WhatsApp.
- Product matching resolves WhatsApp text to the shop's own product records by product ID. An unmatched item is flagged as not-found and the operator picks the correct product.
- Bill generation is derived from the order. Products are never re-entered. The operator may change discount, payment method, and customer details.
- Receipt printing supports 58mm, 80mm (default), and A4 via `@media print`, printing the receipt alone.
- Counter sales are supported: a shopkeeper can build a bill from scratch for a walk-in customer with no WhatsApp order behind it. A WhatsApp order pre-fills that same flow.
- Connection status is visible at all times (connected / offline) with last-sync time, and queued work syncs when the connection returns.
- Demo mode simulates incoming WhatsApp orders on a timer and on demand.
- Persistence is `localStorage` for the demo; there is no server.
- Deliberately undecided: the Trucount/connector print protocol, real WebSocket transport, GST filing/invoice numbering compliance, staff accounts and roles, inventory decrement, and loyalty. None are in scope.
- Do not display a claim that the browser controls the T-10 directly.

## Brand Commitments

- Name: **SAMVAAD**. The POS is the SAMVAAD brand, not a generic dashboard; the wordmark appears in the top navigation.
- WhatsApp is the customer-facing channel and must be visually marked on orders and bills, so the operator can always see where an order came from.
- English-only interface.
- "Do not make it look like a generic admin dashboard."

## Evidence on Hand

None. No logos, photography, customer testimonials, benchmarks, pricing, or real transaction data exist for this product. All demonstration data — customer names, phone numbers, products, addresses, and order history — is synthetic and authored by the build. It must never be presented as real.

## Product Principles

1. **Never type it twice.** Every downstream artifact inherits the order's data. If a field can be inherited, it is inherited.
2. **The next action is always obvious.** The operator's current position in the order lifecycle determines what the primary button says.
3. **Nothing is lost offline.** Connection state is honest and visible; work is queued, never dropped.
4. **Built for the counter, not the office.** Desktop-first density, large touch targets, and zero decorative surface between the operator and the order.
5. **Say what is true.** Printer mode reports Browser Print. Unmatched products say unmatched. The demo never pretends to be connected to hardware it cannot reach.

## Accessibility & Inclusion

Large, high-contrast, touch-friendly controls suitable for a shop floor. Status is never communicated by color alone; every status carries a text label. Keyboard operation is required for the order queue and bill actions. Reduced-motion preferences disable highlight and entrance animations.
