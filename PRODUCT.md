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

This product is one flow. Everything that does not serve it was removed, not deferred.

- An order arrives from WhatsApp as a structured payload keyed to the shop's own product
  IDs and appears in the list without a refresh.
- The order shows its customer, items, prices, GST, total and time, all of it priced by
  SAMVAAD before it arrives.
- One action: **Print bill**. It prints the receipt. There is no lifecycle, no approval
  chain, no second screen to learn.
- Printed orders sink below the waiting ones and stop offering the button. One line at the
  bottom carries the day's count and total.
- A line SAMVAAD could not price stays unpriced and is flagged on its row. It is never
  quietly worth nothing.
- Each row drops its line items open in place, so the items are readable without leaving
  the list. One click opens the whole order.
- Receipt printing is 58 mm, 80 mm (default) and A4, and only the receipt reaches paper.
- Persistence is `localStorage`. There is no server.
- Deliberately out of scope, and absent rather than half-built: the order lifecycle, the
  Kanban trays, the bill book, the product catalogue screen, the customer register, the
  settings screen, counter sales, offline queueing, discount and payment-method editing,
  staff accounts, inventory, loyalty, and GST invoice numbering for filing.
- A future on-premise **SAMVAAD POS CONNECTOR** will carry the cloud payload to the local
  PC and may drive the shop's billing machine. Its protocol is not confirmed, so the
  connector is simulated and never contacted.
- The shop may own a **TRUCOUNT T-10** with a built-in thermal printer. The browser cannot
  drive it, and this app never claims it can. Printer mode reports **Browser print**.

## Brand Commitments

- Name: **SAMVAAD**. The POS is the SAMVAAD brand, not a generic dashboard; the wordmark appears in the top navigation.
- WhatsApp is the customer-facing channel and must be visually marked on orders and bills, so the operator can always see where an order came from.
- English-only interface.
- "Do not make it look like a generic admin dashboard."

## Evidence on Hand

None. No logos, photography, customer testimonials, benchmarks, pricing, or real transaction data exist for this product. All demonstration data — customer names, phone numbers, products, addresses, and order history — is synthetic and authored by the build. It must never be presented as real.

## Product Principles

1. **Never type it twice.** The receipt is built from the order's own priced lines. There is nowhere to re-enter a product, because there is no field for one.
2. **One thing to do.** An unprinted order has one button on it. Everything else about it is information.
3. **Built for the counter, not the office.** Desktop-first density, large touch targets, and zero decorative surface between the operator and the order.
4. **Say what is true.** Printer mode reports Browser print. An unpriced item says unpriced. The demo never pretends to be connected to hardware it cannot reach.

## Accessibility & Inclusion

Large, high-contrast, touch-friendly controls suitable for a shop floor. Status is never communicated by color alone; every status carries a text label. Keyboard operation is required for the order queue and bill actions. Reduced-motion preferences disable highlight and entrance animations.
