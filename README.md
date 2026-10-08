# SAMVAAD POS

The counter half of **SAMVAAD** — a WhatsApp ordering system for local shops.

A customer messages the shop's WhatsApp number in plain text:

```
2 Amul Milk
1 Bread
3 Parle-G
```

SAMVAAD parses that into a structured order and pushes it to the shop. This app is the
counter. The order arrives as a printed ticket with its customer, items, prices and GST
already on it. Press **Print bill** and the receipt comes out.

**The point of the whole system is that the shopkeeper never types an order twice.**

---

## Run it

Open `index.html`. That is the whole install — no server, no build step, no dependencies.

It also serves fine, and a server is slightly better because some browsers restrict
`localStorage` on `file://` origins:

```sh
python3 -m http.server 8000
```

Deployed copy: **https://abhislit.github.io/samvaad-pos/**

---

## The flow

```
Customer → WhatsApp → SAMVAAD cloud → this screen → Approve → Print bill → receipt
```

That is the whole product. Two beats, no second screen to learn, and no state to keep in step
beyond whether a ticket has been stamped yet.

1. An order arrives on WhatsApp and **comes out of the slot** in the top rail — no refresh, no
   retyping. Read it: who, how much, how many items, what time.
2. **Approve.** A stamp comes down onto the ticket and leaves `APPROVED` in its ink.
3. **Print bill.** A hot head crosses the ticket, then the receipt feeds out of the machine,
   line by line, and tears off. That sheet is then printed at the tray the shop has loaded —
   58 mm, 80 mm or A4.

Printed orders sink below the waiting ones and stop offering a button. The day's count and
total sit in one line at the bottom.

Order source is stamped on every ticket, and an item SAMVAAD could not price is flagged
**⚠** on the row, because a bill that silently costs nothing is worse than no bill.

From the browser console, `receiveNewOrder(payload)` is the one door every order comes
through — that is where the cloud socket will attach.

---

## Demo controls

| | |
|---|---|
| `Simulate order` | sends one realistic WhatsApp order |
| `Demo mode` | an order every 25 seconds |
| `Tray: 80 mm` | cycles 58 / 80 / A4 |
| `S` | simulate one order |
| `M` | mute / unmute the arrival chirp |
| `Esc` | close the order, or collapse an open row |
| sound | the arrival chirp, and the platen's ratchet while the receipt feeds |
| the caret on a row | drop the line items open without leaving the list |

Orders persist in `localStorage`. Clearing site data resets the demo shop.

---

## What is real and what is demo

**Real** — the arithmetic and the flow:

- Money is held in integer paise end to end. No float rupees anywhere.
- GST splits per line into CGST and SGST, and prints grouped by slab so a 58 mm tray does
  not wrap. Tax is computed on catalogue prices, which is the point of matching product IDs.
- An unknown WhatsApp item does not become ₹0 quietly — it is left unpriced and flagged.

**Demo** — everything you can see is synthetic, and is labelled as such:

- The shop, its GSTIN, every customer, phone, address, product and price is authored for
  this demo. None of it is real.
- GST invoice numbering for filing is **not modelled**.

**Not connected, on purpose:**

- **SAMVAAD cloud** — no WebSocket is opened. `ws://127.0.0.1:8765` is documented in
  `src/connector.js` as where real orders will arrive.
- **SAMVAAD POS CONNECTOR** — simulated. Nothing contacts a local service.
- **TRUCOUNT T-10** — the browser cannot drive it, and this app never claims it can.
  Printer mode reports **Browser print**, on the paper and in the tray label.

---

## Layout

```
index.html            the shell
styles/
  tokens.css          type ramp, radius scale, stamp tray
  app.css             the rail, the list, the ticket, the drawer
  print.css           the receipt-only print tree
src/
  store.js            state, persistence, change bus
  data.js             the synthetic shop, catalogue and the order generator
  products.js         WhatsApp product matching
  bills.js            the money on the receipt
  orders.js           intake, printing, the day's count
  printer.js          the receipt and window.print()
  connector.js        the simulated SAMVAAD POS CONNECTOR
  notifications.js    the arrival chirp and toasts
  ui-board.js         the list
  ui-drawer.js        the order, opened
  app.js              wiring
tests/
  run.js              node tests/run.js — 43 checks on the money and the flow
  contrast-audit.js   rendered-DOM WCAG audit
```

Plain scripts on one `window.SV` namespace rather than ES modules, so the shop can open the
file off the disk with nothing running.

```sh
node tests/run.js
```

---

## Printing

58 mm, 80 mm (default) and A4. `@media print` removes the interface and prints the receipt
alone. The receipt target stays `hidden` all session — `#receipt` is an ID selector, so it
outranks the `[hidden]` rule and print media reveals it on its own.

`SV.printer.print(order)` prefers the local connector when one is available and otherwise
calls `window.print()` — the seam where a confirmed TRUCOUNT protocol will go.