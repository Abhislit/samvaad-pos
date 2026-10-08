# SAMVAAD POS

The local POS half of **SAMVAAD** — a WhatsApp ordering system for local shops.

A customer messages the shop's WhatsApp number in plain text:

```
2 Amul Milk
1 Bread
3 Parle-G
```

SAMVAAD parses that into a structured order and pushes it to the shop's counter. This app is the
counter. The order arrives as a printed ticket with its customer, items, prices and GST already on
it. One click produces a correct bill and a receipt.

**The point of the whole system is that the shopkeeper never types an order twice.** Every bill
inherits its lines from the order behind it. Products are never re-keyed.

---

## Run it

Open `index.html`. That is the whole install — no server, no build step, no dependencies to
install.

It also serves fine, and a server is slightly better because some browsers restrict `localStorage`
on `file://` origins:

```sh
python3 -m http.server 8000
```

Deployed copy: **https://abhislit.github.io/samvaad-pos/**

---

## The workflow

```
Customer → WhatsApp → SAMVAAD cloud → local POS → accept → prepare → bill → print
```

1. A WhatsApp order arrives and **appears on the board by itself** — no refresh, no retyping.
2. It lands in the **NEW** tray as a full ticket: customer, phone, items, totals, note.
3. `ACCEPT ORDER` → the ticket is stamped and moves along.
4. `START PREPARING` → `MARK READY` → `COMPLETE ORDER`.
5. `GENERATE BILL` opens the shop's ledger with the order's lines already on it.
6. Change discount, payment method or customer details if you need to. **Never the products.**
7. `PRINT BILL` prints the receipt alone.

Order states: `NEW → ACCEPTED → PREPARING → READY → COMPLETED`, plus `CANCELLED`.

---

## What is real and what is demo

**Real** — the arithmetic and the flow:

- Money is held in integer paise end to end. No float rupees anywhere.
- GST splits per line into CGST and SGST at bill time, and prints grouped by slab on the receipt.
- The order lifecycle, bill derivation and product matching are genuine code paths, not mock-ups.
- Counter sales are supported: `Stamp new ticket` builds the same bill sheet from scratch.

**Demo** — everything you can see is synthetic, and is labelled as such:

- The shop (`SHREE SAI PROVISION STORES`), its GSTIN, every customer name, phone number and
  address, the product catalogue and all prices are authored for this demo. None of it is real.
- GST invoice numbering for filing is **not modelled**.

**Not connected, on purpose:**

- **SAMVAAD cloud** — no WebSocket is opened. `ws://127.0.0.1:8765` is documented in
  `src/connector.js` as the point where real orders will arrive.
- **SAMVAAD POS CONNECTOR** — simulated. Nothing contacts a local service.
- **TRUCOUNT T-10** — the browser cannot drive it, and this app never claims it can. Printer
  mode reports **Browser print**.

Those three are the real deployment's job. This build stops at the browser and says so.

---

## Demo controls

| | |
|---|---|
| `Simulate WhatsApp order` | pushes one realistic order |
| `Demo mode` (rail, or **Settings**) | a new order every 25s |
| `M` | mute / unmute the arrival chirp |
| `S` | simulate one order |
| `Esc` | close the drawer or bill sheet |
| Connection pill | simulate losing the connection — orders are held and released |

Orders persist in `localStorage`. **Settings → Reset demo data** puts it back.

An unmatched WhatsApp item (roughly one in six) shows `⚠ PRODUCT NOT FOUND`; open the order and
pick the right product, and the bill prices it from the catalogue.

From the browser console, `receiveNewOrder(payload)` is the one door every order comes through.

---

## Layout

```
index.html            the shell
styles/
  tokens.css          87 tokens: the type ramp, radius scale, stamp tray
  app.css             components
  print.css           the receipt-only print tree
src/
  store.js            state, persistence, change bus
  data.js             the synthetic shop, catalogue and customers
  products.js         catalogue and WhatsApp product matching
  customers.js        customer records
  orders.js           intake and the order lifecycle
  bills.js            bill derivation and the money
  printer.js          printBill and the receipt markup
  connector.js        the simulated SAMVAAD POS CONNECTOR
  notifications.js    arrival sound and toasts
  ui-*.js             board, drawer, bill sheet, screens
tests/
  run.js              node tests/run.js — 46 checks on the money and the lifecycle
  contrast-audit.js   rendered-DOM WCAG audit across every screen
```

Plain scripts on one `window.SV` namespace rather than ES modules, so the shop can open the file
off the disk with nothing running.

```sh
node tests/run.js
```

---

## Printing

58 mm, 80 mm (default) and A4, set in **Settings → Printer tray**. `@media print` removes the
interface and prints the receipt alone.

`printBill(bill)` prefers the local connector when one is available and otherwise calls
`window.print()` — the seam where a confirmed TRUCOUNT protocol will go.