# SAMVAAD POS — design system

The built world, documented from the code that ships. Written after the build, from
`styles/tokens.css` and `styles/app.css`; if the two ever disagree, the code is right.

## The world

**The Lot Ticket** — a ticket printer's desk at the wholesale mandi. Every order is a
numbered lot ticket on white stock, stamped with where it came from. The POS is a ticket
printer's desk; it refuses the category default of grey cards, a blue accent and dotless
kanban columns.

The build was reduced to one flow after the first version shipped — an order arrives on
WhatsApp, it prints. What survives below is what that flow still needs.

## Colour

Restrained: paper-and-ink neutrals plus one accent, with a stamp tray. Colour commits at
region scale — filled plates and the rail — not as scattered accents.

| token | value | what it is |
|---|---|---|
| `--stock` | `oklch(99.3% 0.002 84)` | ticket stock |
| `--stock-warm` | `oklch(97.6% 0.008 82)` | a printed ticket |
| `--desk` | `oklch(92.6% 0.006 84)` | the counter the tickets lie on |
| `--ink` | `oklch(17.5% 0.008 62)` | type |
| `--ink-soft` | `oklch(39% 0.009 62)` | secondary type, fact labels |
| `--ink-faint` | `oklch(54% 0.007 62)` | captions, the item count, the clock |
| `--rule` / `--rule-mid` | `… / 0.16` / `… / 0.30` | hairline / structural rule |
| `--rail` | `oklch(20.5% 0.009 250)` | the machined rail across the top |
| `--jute` | `oklch(80.5% 0.163 82)` | jute-sack gold: the seal and the print action |
| `--jute-deep` | `oklch(52% 0.140 74)` | its border and its wash's edge |
| `--india` | `oklch(47.5% 0.183 26)` | every money figure, and the unpriced flag |
| `--graphite` | `oklch(44% 0.006 250)` | spent ink |
| `--control-edge` | `oklch(48% 0.008 62)` | a control's boundary |
| `--mark` | `oklch(64% 0.006 62)` | marks that are not words |

**The Mark-Not-Muted Rule.** No token in this system renders as words below AA, so a
"muted" colour must be a `--mark`, never a lightened ink. `--ink-faint` is the floor.

**The Control-Edge Rule.** `--control-edge` exists because a control's boundary must clear
the 3:1 non-text floor, which `--rule-mid` at 0.30 alpha does not: it measured 2.00:1 on
stock. Structural hairlines keep their own weight; controls take the heavier one.

**The Rupee Rule.** The rupee sign always sets separately from the figure, one step down,
never inside the numeral — `.row-total i` against `.row-total b`.

## Type

Stardos Stencil for every scannable number and the uppercase voice; Archivo for everything
else; the platform mono for product IDs, phones, GSTIN and money columns.

| token | value | where |
|---|---|---|
| `--micro` | `0.6875rem` | the floor for any functional text |
| `--t-body` | `0.8125rem` | controls, table cells, line items |
| `--t-label` | `0.75rem` | screen titles, small buttons |
| `--t-lead` | `0.875rem` | the screen title |
| `--t-mark` | `1.125rem` | the wordmark, a lot number |
| `--t-total` | `1.3125rem` | the total on a ticket |

**The Micro Floor Rule.** A counter is read at arm's length under bad light. Nothing
functional goes under 11px.

**The Stencil Numbers Rule.** Lot numbers, totals and stat figures are stencil. A number
has to be readable at a glance from standing height, and stencil is the voice the jute sacks
and crate stencils in this world are printed in.

Stardos Stencil has no U+20B9, which is why the Archivo latin-ext subset is loaded: the
stencil stack falls through to Archivo for the rupee sign.

## Shapes

Almost nothing is rounded. `--radius-hair: 1px` is a printed edge, `--radius-cut: 2px` a cut
corner, `--radius: 3px` the ticket itself. A stamp plate is rotated −1.5°, never level.

## Elevation

**The Hairline Rule.** Separation is a hairline rule. Depth is either `--lift` for paper lying
on the counter or `--lift-up` for paper picked up, plus the one shadow on a pinned action bar
that tells the operator the pane runs on underneath it. Nothing glows. A third shadow,
`--lift-feed`, belongs to paper still held by the machine — lit from the slot above it and
sitting closer to the platen than the tickets already on the counter.

**The Fibre Rule.** `--fibre` is three gradients at three angles and three periods, laid over
the stock only. It is what stops a ticket reading as a white rectangle, at 1.4% and 0.9% ink —
visible at arm's length under bad light, invisible as a pattern on screen.

## The machine

Two focal sequences, and both come from this product rather than from a library.

**The feed.** The rail is the machine's top; paper leaves its underside. A receipt emerges from
behind a dark lip at `72mm` — the same millimetres the tray prints — because a preview narrower
than the paper wraps where the real receipt does not, and a preview that lies is worse than no
preview. It travels at a **platen's constant rate**: `linear`, because paper does not accelerate
through a roller. Then it tears on a perforation, like the tickets do, and the mouth ticks once.

**The stamp.** Approve is a rubber stamp, not a label swap. The arm is placed exactly where the
plate will end up, so the press appears to *leave* `APPROVED` in its ink rather than reveal a
label that was there all along. It falls from above and small, contacts hard, and overshoots —
because it is a physical object. The ticket flinches once at contact.

**The head.** Printing runs the head down the face of the ticket while it is still unprinted,
then the ticket travels down into the printed pile. Printing first and animating second would
show the press landing on a ticket that has already left.

Every duration lives in a token — `--feed-ms`, `--tear-ms`, `--stamp-ms`, `--head-ms` — which
times the keyframe and is read back by the sequence that waits on it, so the two cannot drift.

Nothing loops and nothing autoplays. The feed runs once per explicit print. Reduced motion
keeps the outcome and drops the travel: the stamp leaves its plate, the sheet is shown finished
and held long enough to read, and no animation runs at all.

## Components

- **The rail.** Dark, brushed with a 1px/3px repeating hairline at 2.2% alpha. Wordmark
  left, one plain-language line of state, sound and demo right. It says how many orders are
  waiting, so that number exists in exactly one place.
- **The lot ticket.** Perforated head (repeating radial notches with a tear hairline), stamp
  plate, stencil lot number, clock, stencil total, customer name and item count, and one
  arrow-led action: **Approve**, then **Print bill**. `APPROVED` is filled ledger green,
  `PRINTED` is outlined, never filled — spent ink does not shout.
- **One header row, two sections in it.** `To print` and `Printed` sit in the header beside the
  title and the tools, so the whole screen has one band of controls instead of two. The header
  itself pins under the rail on a desk. It stops pinning on a phone: there it wraps to three
  lines, and 148px of a 844px screen is a worse trade than making the tabs one flick up the way.
- **Printed opens a window.** The printed pile is reference material. `window.open` with a fixed
  name, so a second click focuses the window already open instead of stacking another, and a
  `storage` listener so it follows the counter — press Print all and the list grows as you watch.
  A window showing seven bills while the till printed five more would be worse than no window. Two sticky headers was the first attempt and it was worse: the top of
  the screen told you nothing once you were half way down a printed pile. One bar carries the
  current section, both counts, and the jump back. It tracks the reader as they scroll, and at
  the foot of a short page the last section wins, because a page too short to scroll cannot
  bring a section up under the bar. The jump offset is the bar's **measured** height, read
  after its content is in — guessed, it landed a section behind and the tab disagreed with the
  screen. Not one list with the finished orders sinking to the bottom: an operator needs to see
  what is done as much as what is not, and reprinting needs a home. `PRINTED` rows carry
  **Print again**, which keeps the bill number — a reprint is the same receipt a second time,
  not a new bill.
- **The outlet.** Fixed, centred under the rail, `pointer-events: none` so it can never trap a
  click. It is removed from the print tree: on paper the receipt is the whole truth.
- **A batch.** `Print all` feeds every sheet, then hands the stack over in **one** print job —
  `break-inside: avoid` per sheet, so no receipt is split across a page break. A batch must
  never open a dialog per receipt. Under reduced motion it shows one sheet for the hold, not
  every sheet for a quarter of a second: seven sheets at that rate would stand still for seven
  seconds.
- **The row never shrinks.** The name's flex item is `1 0 auto`, so when the actions stop
  fitting it is they that wrap — a half-printed customer name is worse than a taller ticket.
  Verified unclipped at 360, 390, 414, 720, 768, 1024, 1280, 1366, 1440 and 1920.
- **The drop.** A caret opens the line items in place. One row's DOM is touched, never the
  list's: rebuilding it would destroy the pressed button, drop focus to the body and replay
  every caret's rotation — which reads as a blink.

## Motion

The machine is the only thing that moves on its own. Nothing loops, nothing animates on
load, and no effect runs that does not report a state change the operator has to see.

**The board hands tickets back.** `render()` rebuilds the list with `innerHTML`, which
teleports every ticket whenever the sort changes. So the board measures each ticket's
position first, rebuilds, then writes the inverse transform onto every ticket that moved and
releases them on one shared class. A ticket with no previous position was not there a moment
ago — that is the arrival, and it comes out of the slot instead of fading in.

**The print happens in two beats.** The head runs down the face of the ticket while it is
still unprinted, then the ticket is marked printed and travels down into the printed pile.
Printing first and animating second puts the press on a ticket that has already left. The
drawer closes up front so the pass is never hidden behind it. `HEAD_MS` in `app.js` and the
`head` keyframe in `app.css` are the same 460ms in two files, and they must move together.

Under `prefers-reduced-motion` the board is not measured at all: `snapshot()` returns empty,
so no transform is ever written, no arrival class is rendered, and `printOrder` skips the
delay and prints immediately. The state still changes; only the movement is gone.
- **Drawn marks only.** The warning triangle is borders and a knocked-out bar, like the
  chevron, the caret and the mute speaker. It is `display: inline-block` because `width` and
  `height` are ignored on an inline box — a bug that hid it at 0×0 until it was stated.

## Print

**The Receipt Rule.** The receipt target stays `hidden` for the whole session. `#receipt` is
an ID selector, so it outranks the `[hidden]` attribute rule and print media reveals it alone;
nothing is ever unhidden, so an unstyled receipt can never be left lying at the bottom of the
page. The tray sets the base size (`--tray-58-type` 10px, `--tray-80-type` 11px,
`--tray-a4-type` 13px) and every line inside is sized in `em` against it, so a 54 mm roll
never prints A4-sized headings.

`--print-ink` and `--print-ground` are device colours, not screen inks. Do not retint them.

## Browser surfaces

Selection, scrollbars and the caret are themed from the palette. `::selection` is jute on
`--on-jute`, scrollbars are `--rule-mid` with a `--ink-faint` hover, and the caret is
`--india` — the one colour in this system that means "you are here". These are the parts of
a page that ship as Chrome defaults and belong to no design system.

## Deliberate exemptions from the mechanical detector

- The rail's brushed grain and `--fibre` read as repeating stripe patterns. A brushed-metal
  grain *is* hairline repetition, and laid paper *is* laid lines; the heuristic cannot tell a
  material from a decoration.
- `--mask-solid` is `#000` because a CSS mask key must be fully opaque and cannot be a
  palette ink.

## Honesty

Printer mode reports **Browser print**, on the paper and in the tray label. An item SAMVAAD
could not price stays unpriced and is flagged. The demo never claims to be connected to
hardware it cannot reach, and every shop, customer and price in it is synthetic.