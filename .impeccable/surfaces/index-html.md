---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface: SAMVAAD POS — order board

## Scope and visitor mode

Single route (`index.html`), the local POS screen of one shop. Visitor mode: **Operate**. The
operator's job is to accept, prepare, bill and print WhatsApp orders without retyping them.
Frequency: continuous, one-handed, at a fixed desktop terminal.

## Audience, job, action

Shopkeeper/operator of one Indian kirana or grocery. Job: clear the incoming WhatsApp queue.
Action per ticket: read it, press the arrow-led primary button, generate the bill, print it.
Customer history is secondary and must never dominate an order.

## Proof and content

All demonstration data is synthetic and labelled as such: customer names, phone numbers,
product catalogue, addresses, order history and dashboard figures are authored, never presented
as real. Commercial claims stay uninventable — no prices, benchmarks, endpoints or capabilities
the product does not have.

## Constraints

Static HTML/CSS/vanilla ES modules, no backend, no build step, `localStorage` persistence.
Desktop-first at 1366x768 and above; tablet works; mobile secondary. Printer mode reports
**Browser Print** honestly; the Trucount T-10 and the SAMVAAD POS CONNECTOR protocol are
simulated and must never be described as reachable.

## Chosen direction and memorable moment

**The Lot Ticket** — a ticket printer's desk at the wholesale mandi. Every order is a numbered
lot ticket on white stock; every state change is a rubber stamp pressed onto it.

Memorable moment: an incoming WhatsApp order cascades into the NEW lane character by character,
its lot number `#SAM-10294` flipping in, and the stamp plate lands with an ink spread the
operator can feel.

## Direction contract

**THESIS.** The POS is a ticket printer's desk. Every incoming WhatsApp order is a numbered lot
ticket on white stock, and every lifecycle change is a rubber stamp pressed onto it — so the
operator reads the day as a wall of tickets, not a spreadsheet of rows. This refuses the category
default: grey cards, blue accent, four dotless kanban columns.

**OWN-WORLD.** Paper and ink. Neutral white ticket stock on a deeper desk ground; separation by
hairline rule, and a single small contact shadow reserved for paper lying on the counter or lifted
off it, so nothing floats and nothing glows; ticket edges cut with perforation notches. Lot
numbers, stat numerals and
totals wear a stencil face, everything else a workhorse grotesque. Status is a filled, inked stamp
plate rotated -1.5deg, never a dot, never a faint tint. Jute gold is the seal and primary ink;
patina verdigris, India red, ledger green and graphite are the stamp tray. A dark machined top
rail is the counter's iron edge.

**STORY.** A WhatsApp order arrives as a ticket already printed with customer, items, GST and
total. The operator presses ACCEPT, the stamp lands, the ticket moves along the trays, and the
bill sheet inherits the same line items — nothing is re-keyed at any point.

**FIRST VIEWPORT.** A dark top rail: SAMVAAD wordmark left, one plain-language line saying how
many orders are waiting, sound and demo controls right. Below it a single list of perforated lot
tickets in a responsive grid — unprinted orders first, printed ones below in outline. Each ticket:
stamp plate top-left saying where the order came from, stencil lot number, arrival time, stencil
total in red stamp ink, and the arrow-led **Print bill** along the bottom edge with the customer
name. One line at the bottom carries the day's count and total. No lanes, no nav, no dashboard.

**Revised after build.** The first version of this contract committed to a four-tray Kanban board
with an eight-tab rail and a six-cell stat strip. The operator rejected it as too dense to read at a
counter. The world is unchanged; the topology is now one list and one button, which is what the
contract's own principle — built for the counter, not the office — actually asks for.

**FORM.** Lot ticket — the direction assigned by `concept-seed --scope direction --mode operate`
(decision round `9ffe5e16`, card "The Lot Ticket"), locked by the user over four alternates and
the category-standard exit. Code-led build path: no comp round, ambition carried by the FIRST
VIEWPORT block and the stamp-press and split-flap arrivals.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the finish review, the
verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions

- SAMVAAD POS CONNECTOR transport and print protocol (HTTP vs WebSocket, payload shape).
- Trucount T-10 driver behaviour and ESC/POS specifics.
- Real WebSocket transport and auth for the cloud hand-off.
- GST invoice numbering and filing compliance.
