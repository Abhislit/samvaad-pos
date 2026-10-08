---
name: SAMVAAD POS
description: A ticket printer's desk at the wholesale mandi — every order is a numbered lot ticket, every state change a rubber stamp pressed onto it.
colors:
  # Stock — the desk, the tickets, the ledger sheet
  desk: "oklch(92.6% 0.006 84)"
  stock: "oklch(99.3% 0.002 84)"
  stock-tray: "oklch(96.4% 0.005 84)"
  stock-ledger: "oklch(97.6% 0.008 82)"
  # Ink — the three steps that carry words. There is no fourth.
  ink: "oklch(17.5% 0.008 62)"
  ink-soft: "oklch(39% 0.009 62)"
  ink-faint: "oklch(54% 0.007 62)"
  # Marks — shapes that are not words. Kept out of the ink ramp on purpose.
  mark: "oklch(64% 0.006 62)"
  mark-quiet: "oklch(70% 0.006 62)"
  rule: "oklch(17.5% 0.008 62 / 0.16)"
  rule-mid: "oklch(17.5% 0.008 62 / 0.30)"
  rule-hair: "oklch(17.5% 0.008 62 / 0.08)"
  # Control edges — a boundary that must clear the 3:1 non-text floor, which an
  # alpha rule cannot. Distinct from --rule-mid; see The Control-Edge Rule.
  control-edge: "oklch(48% 0.008 62)"
  # Iron rail — the machined counter edge
  rail: "oklch(20.5% 0.009 250)"
  rail-line: "oklch(100% 0 0 / 0.10)"
  rail-ink: "oklch(93% 0.005 84)"
  rail-ghost: "oklch(72% 0.008 84)"
  # The stamp tray
  jute: "oklch(80.5% 0.163 82)"
  jute-deep: "oklch(52% 0.140 74)"
  jute-wash: "oklch(94% 0.058 84)"
  verdigris: "oklch(51% 0.086 188)"
  verdigris-wash: "oklch(93% 0.032 190)"
  ledger: "oklch(45% 0.104 148)"
  ledger-wash: "oklch(94% 0.038 150)"
  india: "oklch(47.5% 0.183 26)"
  india-wash: "oklch(94.5% 0.036 27)"
  graphite: "oklch(44% 0.006 250)"
  # Inks that sit ON a stamp colour — named for the ground, so they travel with it
  on-jute: "oklch(26% 0.035 70)"
  on-jute-deep: "oklch(24% 0.03 70)"
  on-verdigris: "oklch(98% 0.012 190)"
  on-ledger: "oklch(98% 0.012 150)"
  on-graphite: "oklch(84% 0.006 84)"
  jute-edge: "oklch(45% 0.13 70)"
  # Figure tint — a status numeral is never a tint of its own ink. One member
  # survives: --fig-verdigris and --fig-ledger existed only for strip cells the
  # strip no longer has, and a one-member family is a name waiting to drift.
  fig-jute: "oklch(74.5% 0.175 80)"
  # Alert and note stock
  alert: "oklch(38% 0.14 26)"
  alert-ink: "oklch(34% 0.12 26)"
  alert-deep: "oklch(38% 0.13 26)"
  alert-led: "oklch(97% 0.02 26)"
  note-ink: "oklch(38% 0.07 74)"
  note-deep: "oklch(38% 0.09 74)"
  calm-ink: "oklch(30% 0.07 190)"
  whatsapp: "oklch(62% 0.13 152)"
  # Alphas on the dark rail
  rail-wash: "oklch(100% 0 0 / 0.05)"
  rail-soft: "oklch(100% 0 0 / 0.06)"
  rail-hair: "oklch(100% 0 0 / 0.11)"
  rail-lift: "oklch(100% 0 0 / 0.12)"
  rail-grain: "oklch(100% 0 0 / 0.022)"
  # Darks on dark
  edge-hair: "oklch(0% 0 0 / 0.22)"
  edge-soft: "oklch(0% 0 0 / 0.30)"
  edge: "oklch(0% 0 0 / 0.40)"
  edge-deep: "oklch(0% 0 0 / 0.50)"
  ink-alpha: "oklch(0% 0 0 / 0.16)"
  ink-alpha-w: "oklch(100% 0 0 / 0.16)"
  shade-deep: "oklch(17.5% 0.008 62 / 0.28)"
  scrim: "oklch(17.5% 0.008 62 / 0.42)"
  # Stepped off a stock or an ink
  ink-hover: "oklch(25% 0.01 62)"
  desk-lit: "oklch(94.6% 0.006 84)"
  # Device colours — the printer draws one black on white, and a mask key must be opaque
  print-ink: "#000"
  print-ground: "#fff"
  mask-solid: "#000"
typography:
  display:
    fontFamily: "\"Stardos Stencil\", \"Archivo\", system-ui, sans-serif"
    fontSize: "var(--t-figure)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.01em"
  headline:
    fontFamily: "\"Stardos Stencil\", \"Archivo\", system-ui, sans-serif"
    fontSize: "var(--t-screen)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.14em"
  lot-number:
    fontFamily: "\"Stardos Stencil\", \"Archivo\", system-ui, sans-serif"
    fontSize: "var(--t-lot)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.055em"
  total:
    fontFamily: "\"Stardos Stencil\", \"Archivo\", system-ui, sans-serif"
    fontSize: "var(--t-total)"
    fontWeight: 700
    lineHeight: 1
  title:
    fontFamily: "\"Stardos Stencil\", \"Archivo\", system-ui, sans-serif"
    fontSize: "var(--t-name)"
    fontWeight: 400
    letterSpacing: "0.04em"
    lineHeight: 1.2
  body:
    fontFamily: "Archivo, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "var(--t-name)"
    fontWeight: 400
    lineHeight: 1.5
  copy:
    fontFamily: "Archivo, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "var(--t-lead)"
    fontWeight: 400
    lineHeight: 1.35
  control:
    fontFamily: "Archivo, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "var(--t-body)"
    fontWeight: 600
    lineHeight: 1.2
  label:
    fontFamily: "Archivo, system-ui, -apple-system, \"Segoe UI\", sans-serif"
    fontSize: "var(--micro)"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.16em"
  mono:
    fontFamily: "ui-monospace, \"DejaVu Sans Mono\", \"SFMono-Regular\", Menlo, Consolas, monospace"
    fontSize: "0.8125em"
    fontWeight: 400
    letterSpacing: "-0.01em"
rounded:
  hair: "1px"
  cut: "2px"
  sm: "3px"
  pill: "999px"
  shell: "8px"
spacing:
  xs: "0.15rem"
  sm: "0.4rem"
  md: "0.6rem"
  lg: "0.9rem"
  xl: "1.25rem"
  gutter: "clamp(0.75rem, 1.4vw, 1.5rem)"
  tap: "2.5rem"
components:
  button-seal:
    backgroundColor: "{colors.jute}"
    textColor: "{colors.on-jute}"
    rounded: "{rounded.sm}"
    height: "{spacing.tap}"
    padding: "0 0.9rem"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock}"
    rounded: "{rounded.sm}"
    height: "{spacing.tap}"
    padding: "0 0.9rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.sm}"
    height: "{spacing.tap}"
    padding: "0 0.9rem"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.india}"
    rounded: "{rounded.sm}"
    height: "{spacing.tap}"
    padding: "0 0.9rem"
  stamp-plate:
    backgroundColor: "{colors.jute}"
    textColor: "{colors.on-jute}"
    rounded: "{rounded.cut}"
    padding: "0.32em 0.6em 0.28em"
  stamp-plate-accepted:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock}"
    rounded: "{rounded.cut}"
    padding: "0.32em 0.6em 0.28em"
  stamp-plate-preparing:
    backgroundColor: "{colors.verdigris}"
    textColor: "{colors.on-verdigris}"
    rounded: "{rounded.cut}"
    padding: "0.32em 0.6em 0.28em"
  stamp-plate-ready:
    backgroundColor: "{colors.ledger}"
    textColor: "{colors.on-ledger}"
    rounded: "{rounded.cut}"
    padding: "0.32em 0.6em 0.28em"
  stamp-plate-completed:
    backgroundColor: "transparent"
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.cut}"
    padding: "0.32em 0.6em 0.28em"
  stamp-plate-cancelled:
    backgroundColor: "transparent"
    textColor: "{colors.india}"
    rounded: "{rounded.cut}"
    padding: "0.32em 0.6em 0.28em"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.rail-ghost}"
    rounded: "0"
    height: "var(--rail-h)"
    padding: "0 0.7rem"
  tab-current:
    backgroundColor: "transparent"
    textColor: "{colors.stock}"
    rounded: "0"
    height: "var(--rail-h)"
    padding: "0 0.7rem"
  input:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "2.25rem"
    padding: "0.35rem 0.5rem"
  lot-ticket:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "0 0 3px 3px"
    padding: "0.85rem 0.7rem 0.6rem"
  # `.ticket--live` — the full card, and the only status that gets one (NEW).
  ticket-live:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "0 0 3px 3px"
    padding: "0.85rem 0.7rem 0.6rem"
  # `.ticket--row` — the compact row, every status past NEW. Same paper, less of it.
  ticket-row:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "0 0 3px 3px"
    padding: "0.5rem 0.6rem 0.45rem"
  row-lot:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "0"
    typography:
      fontFamily: "\"Stardos Stencil\", \"Archivo\", system-ui, sans-serif"
      fontSize: "var(--t-lead)"
      fontWeight: 700
      lineHeight: 1
      letterSpacing: "0.05em"
  row-who:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "0"
    typography:
      fontFamily: "Archivo, system-ui, sans-serif"
      fontSize: "var(--t-name)"
  row-total:
    backgroundColor: "transparent"
    textColor: "{colors.india}"
    rounded: "0"
    typography:
      fontFamily: "\"Stardos Stencil\", \"Archivo\", system-ui, sans-serif"
      fontSize: "var(--t-mark)"
      fontWeight: 700
  board-say:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "0"
    typography:
      fontFamily: "Archivo, system-ui, sans-serif"
      fontSize: "var(--t-body)"
  tag-done:
    backgroundColor: "{colors.desk}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.cut}"
    padding: "0.15em 0.35em"
---

# Design System: SAMVAAD POS

## Overview

**Creative North Star: "The Lot Ticket"**

This is a ticket printer's desk at the wholesale mandi, not a task manager. An incoming WhatsApp
order is a numbered lot ticket already printed on white stock — customer, lines, GST slab, total —
and the only thing the operator ever does to it is press a rubber stamp. That premise decides
everything else: the screen is four trays on a counter, not four columns of cards; the rails and
dividers are torn paper edges and hairline rules, with a single small contact shadow kept for paper
lying on the counter or lifted off it; and the loudest thing on any surface is a lot number wearing a
stencil face, because on a real ticket the number is what you read.

The material is drawn, not imported. Ticket edges are punched with a repeating radial-gradient that
leaves a tear hairline under the notches. The bottom-right corner of every ticket is torn off with a
single 315deg gradient. Stamp plates carry an ink mottle — two multiply-blended dot layers over an
inner bleed — so the status colour looks pressed rather than filled. The rail wears a brushed grain
from a 1px hairline every 3px at 2.2% white. Every mark in the product is drawn the same way — the
chevron, the speaker cone, the printer, the warning triangle. None of this is decoration for its own
sake: each device is the cheapest CSS that produces the material it names, and the world refuses
anything it cannot justify that way.

It is a dense screen. The operator is standing at a fixed terminal, reading at arm's length under
bad light, and every tap costs a stamp. So the build is quiet by default and loud only where the
operator must act: colour commits at **region scale** — a filled lane-count block, a filled stamp
plate, the ink tally strip — and never as scattered accents. Nothing functional goes below
`--micro` (0.6875rem / 11px), a floor that exists because the room is bright and the reader is not.

Density is a decision, not a constant. A ticket needs **reading** only while nobody has claimed it;
after that it needs **scanning**. So the board runs two densities — a full card in the NEW tray, a
two-line row everywhere else — and the whole layout is budgeted around that. On the target viewport
(1366×768) the chrome before the first ticket is 199px, a live card is 283px, and a row is 77px,
which is what turns a tray from one and a half visible tickets into seven.

**Key Characteristics:**
- Paper-and-ink neutrals plus exactly one accent (jute gold); a five-ink stamp tray for state.
- Two ticket densities on one board: the full card where a decision is made, a two-line row
  everywhere past it.
- Stencil (Stardos Stencil) for every number that must be read at a glance; Archivo for everything else.
- Status is a filled, rotated, mottled stamp plate with a text label — never a dot, never a tint.
- Hairline rules and drawn material; one small contact shadow, reserved for paper at rest or lifted.
- One perforation geometry at two densities: an 8px band, a 1px tear hairline at 7px, notches on a 9px
  period. A height change to one density is a regression in the other.
- The rupee sign always sets separately from the figure, one step down, never inside the numeral.
- A sentence the screen speaks is a claim, and gets the same filtering as the numbers it summarises.
- Every size, radius and colour is a named token in `tokens.css`; the sweep found nothing left as a
  literal.
- Integer paise and `en-IN` grouping on every rupee figure, in every surface including the receipt.
- A number appears once on a surface; the strip carries only what the board does not already show.

## Colors

The palette is paper and ink: four warm off-white stocks and three warm-black inks, a machined dark
iron rail, and a stamp tray of five inks plus jute gold as the single accent — 87 tokens in
`tokens.css` `:root`, of which the colours below are the ground.

**Canonical format is OKLCH**, defined once in `styles/tokens.css` `:root`. Do not introduce hex or
rgb equivalents; the hue consistency across the stock and ink ramps is the point of authoring in
OKLCH.

### Primary
- **Jute Gold** (`jute`): the seal. The one accent. Used for the primary action button
  (`.btn-seal`), the NEW stamp plate, the current-tab underline, the filled NEW lane count, the
  arrival toast ground, and the row hover in ledger tables. It never becomes a border colour on its
  own and never becomes text on paper.
- **Deep Jute** (`jute-deep`): jute pressed further. The border of the seal button, the inner ring on
  the NEW plate, the ON state of a switch, and the NEW lane name.
- **Jute Wash** (`jute-wash`): jute thinned to a ground. Ticket notes (`.flag-note`), the `DEMO DATA`
  and `DEMO DETAILS` tags, the ON switch track, the fresh-ticket arrival glow, and the default toast.

### Secondary — the stamp tray
Four more inks, used to mean state and nothing else. Each is paired with a `-wash` ground for the
same meaning at low emphasis.
- **Verdigris Patina** (`verdigris` / `verdigris-wash`): PREPARING. The PREPARING plate, the PREPARING
  lane count, the meter fill in `.bar-meter`, and the calm note strip.
- **Ledger Green** (`ledger` / `ledger-wash`): READY. The READY plate, the READY lane count, and the
  online LED on the connection pill.
- **India Red** (`india` / `india-wash`): money and refusal. Every rupee total on a ticket, the
  CANCELLED plate, the grand total rule on the bill sheet, the danger button, and the warning note
  strip. Red in this system means *this is the number* or *this is a stop*, never decoration.
- **Graphite** (`graphite`): COMPLETED, the only tray ink with no wash. The COMPLETED lane count,
  filled. Terminal states get graphite rather than a fifth bright hue.

### Neutral
- **Ticket Stock** (`stock`): the near-white every ticket, input, button and sheet is printed on.
- **Tray Stock** (`stock-tray`): one step down. Lane bodies and the torn-stub corner gradient.
- **Ledger Stock** (`stock-ledger`): the bill sheet, a hair warmer than tray stock so the invoice
  reads as its own kind of paper.
- **Bench Desk** (`desk`): the counter ground behind everything, and the page background gradient's
  lower stop. Also the fill behind a quantity chip and an empty switch track.
- **Ink** (`ink`), **Soft Ink** (`ink-soft`), **Faint Ink** (`ink-faint`): one warm black at three
  steps of intent — primary text, secondary text, metadata. `ink-faint` is the floor, not a starting
  point: it is the lightest step that may carry a word, and it is the last one. There is deliberately
  no fourth. Never mix them; step down the ramp instead.
- **Marks** (`mark`, `mark-quiet`): shapes that are not words, and the only colours in the system
  lighter than `ink-faint`. `mark` is the switch knob and the order-trail chevron; `mark-quiet` is the
  counter-sale source dot. They are a separate family on purpose — see **The Mark-Not-Muted Rule**
  below, which is the rule that keeps them there.
- **Rules** (`rule` 16%, `rule-mid` 30%, `rule-hair` 8%): three strengths of ink line. `rule` is a
  section divider, `rule-mid` a container, lane or button border and the dashed accepted sub-band,
  `rule-hair` a table row divider. All three derive from `ink` at alpha, so they move together.
- **Control Edge** (`control-edge`): the boundary of a control — every `.input`, `select.input` and
  the `.switch` track. It is a named solid ink, not a fourth alpha rule, because a rule draws a line
  between things while a control's boundary has to be *findable*: `--rule-mid` at 30% measures
  **2.00:1** on `--stock` and **1.96:1** on `--desk`, both under the 3:1 non-text floor WCAG 1.4.11
  sets for anything that carries meaning without words, which is every input and switch in the app.
  `--control-edge` measures **6.41:1** on `--stock` and **5.24:1** on `--desk`. A filled button's
  border stays `--rule-mid` and that is not an oversight: the word inside it already identifies it,
  so the line is decoration beside a label rather than the thing carrying the state.
- **Counter Iron** (`rail`), **Rail Ink** (`rail-ink`), **Rail Ghost** (`rail-ghost`), **Rail Line**
  (`rail-line`): the one dark surface in the system, carrying its own ink ramp because text on iron
  cannot use the paper ink ramp. Measured on the iron, not on paper: `rail-ink` sits at **14.6:1**
  against `rail` and `rail-ghost` at **7.2:1**, both comfortably over AA. Any contrast report that
  reads these against white has resolved the rail's ground to the wrong token and is not a finding
  against the build.

### Derived — what a stamp colour carries with it
The tray inks are the only saturated colours in the system, and everything that has to sit *on* one
is its own token, never a second guess at the same value. Four families:

- **`--on-<stamp ink>` — ink on a stamp colour.** `--on-jute` on the NEW plate and the seal button,
  `--on-jute-deep` on the NEW lane count, `--on-verdigris` on the PREPARING plate, `--on-ledger` on
  the READY plate, `--on-graphite` on the tally strip's labels over ink. Named for the ground it
  sits on, so retinting a plate retints its text in the same edit. `--jute-edge` is the pressed-beyond
  edge of the seal button's hover, and travels with jute the same way.
- **`--fig-<tray ink>` — the numeral tint.** One member survives, `--fig-jute`, the lightened variant
  the seal button hovers to on the one dark interactive surface in the system. A status numeral is
  never a tint of its own ink: on iron, the stamp colour itself does not survive. `--fig-verdigris`
  and `--fig-ledger` were deleted with the strip cells that used them — a token kept "for a figure that
  has to survive on iron" is a token nobody has yet needed, and a two-member family with one member is
  a name waiting to drift. Do not re-add a `--fig-*` until a figure is on iron and needs it.
- **Alert and note stock.** `--alert` is the offline band's ground, `--alert-led` its LED;
  `--alert-ink` and `--alert-deep` are the two steps of text on red stock (a note strip and a warning
  flag); `--note-ink` and `--note-deep` are the same pair on jute stock; `--calm-ink` is text on the
  verdigris strip; `--whatsapp` belongs to the source dot and nothing else.
- **`--rail-*` and `--edge-*` — the two alpha ladders.** Five strengths of white on iron
  (`--rail-grain` 2.2%, `--rail-wash` 5%, `--rail-soft` 6%, `--rail-hair` 11%, `--rail-lift` 12%) and
  four strengths of black on dark (`--edge-hair` 22%, `--edge-soft` 30%, `--edge` 40%, `--edge-deep`
  50%). The rail's cell dividers, hardware washes and brushed grain are the rail ladder; the rail's
  machined bottom edge and the tally strip's rules are the edge ladder. Three more alphas sit on their
  own ground: the stamp plate's mottle is `--edge-hair` for its dark dot layer and `--ink-alpha-w` for
  its light one, with `--ink-alpha` as the inner bleed; `--shade-deep` is the sticky footer's
  scroll-cue; `--scrim` is the overlay wash.

**Alpha washes are mixes, not literals.** Wherever a wash steps off a stamp colour it is written as
`color-mix(in oklch, var(--india) 40%, transparent)`, not as a hand-computed `oklch` with the alpha
typed in. The tray ink stays the single source, so a change to india carries its borders, plate rings,
toast edges and hovers with it.

**Device colours.** `--print-ink` (`#000`) and `--print-ground` (`#fff`) are the printer's inks, and
`--mask-solid` (`#000`) is the rail-nav fade mask's key. None of the three is a palette ink, and none
is to be retinted toward the screen palette: a thermal head draws one black on white, and a CSS mask
key must be fully opaque or the mask it keys does not mask. `#000` appears twice in the rendered
output — once as `--print-ink`, once as `--mask-solid` — and a third time at `styles/app.css:62`,
inside the `@supports not (mask-image: linear-gradient(90deg, #000, transparent))` feature probe. That
one is not a colour and cannot be made one: `var()` is illegal in an `@supports` prelude, so the probe
has to spell its own sentinel. A sweep that reports it is reporting a construct, not a finding.

### Named Rules

**The Region-Scale Rule.** Colour commits in blocks, never in accents. A filled stamp plate, a filled
lane-count block, the ink tally strip, the seal button — those are the only places a hue is allowed to
saturate. A new coloured accent on a border, an icon, or a single word is a defect even when the hue
is already in the tray.

**The Tinted-Tray Rule.** The tray that needs work is the tinted one, and the tint means nothing else.
`.lane[data-lane="new"]` gets a jute-tinted ground — `color-mix(in oklch, var(--jute) 11%,
var(--stock-tray))`, measured at `oklch(94.65% 0.022 83.78)` against `oklch(96.4% 0.005 84)` for an
untinted tray — plus a `color-mix(in oklch, var(--jute-deep) 28%, transparent)` border, so the work tray
is identifiable before anything in it is read. The tint is written as a mix off the tray ink for the
reason **The Derived-Ink Rule** gives; it is not a second stock token. Nothing else may take it: a tint
that says "where do I work" and is also used for emphasis has stopped answering the question.

**The One-Number Rule.** A figure appears once on a surface, as a figure. If two regions would print the
same number, one of them is wrong. The tally strip used to break this — six cells printing the queue
counts that the tabs and the tray heads already print, so 4/3/2 appeared three times each — and it is now
three cells carrying only the facts the board does not already show: **Today's bills** (today's bills,
`en-IN` grouped, from the ledger), **Today's sales** (today's grand totals, one money figure), and
**Bills via WhatsApp** (today's bills whose source is WhatsApp). All three are day figures read off
`SV.orders.stats()`, which filters on `SV.todayStart()`, so they are the only numbers on the surface
that are scoped to today rather than to the queue. See **The Board-Speaks-First Rule** in Components for
the prose sentence, which restates queue counts in words and is the one deliberate departure from this
rule — it earns it by being a sentence the operator reads once, not a figure they reconcile.

**The Stamp-Tray Rule.** The five tray inks (jute, verdigris, ledger, india, graphite) each mean one
state and are never interchangeable or reused for an unrelated purpose. India red is reserved for
money and refusal; if something is not money and not a stop, it is not red.

**The Derived-Ink Rule.** Anything that sits on a stamp colour is named for the colour it sits on —
`--on-<that ink>` — so it travels with the ground instead of duplicating it. Anything that steps off a
stock or an ink is named for the stock it derives from (`--desk-lit`, `--ink-hover`, `--shade-deep`).
Anything alpha on the dark rail is `--rail-*`; anything dark on dark is `--edge-*`. Before writing a
new colour literal, look for the name it already has; a hand-written `oklch` next to a tray ink is a
defect even when the value is right.

**The Mark-Not-Muted Rule.** A muted colour in this system is a `--mark`, never a lightened `--ink`.
The ink ramp has exactly three steps, and its last one, `--ink-faint`, is where words stop. There was
once a fourth step, `--ink-ghost`; it measured **2.8:1** on `--stock-tray` and was deleted rather than
re-tuned, because a token that exists only to look quiet will be reached for again. When a shape needs
to recede, take `mark` or `mark-quiet`; when a word needs to recede, take `ink-faint`. The two are not
interchangeable, and the reason is physical: at `--micro` under bad light, the gap between a readable
grey and an unreadable one is the entire job.

Recorded here because it is the kind of rule the next pass will otherwise undo. The neighbouring
deletions share the logic and are worth not re-creating either: `--radius-plate` was a second name for
the 2px step and is gone, so one radius has one name; `--on-jute-hi` byte-duplicated the live
`--fig-jute` and is gone, so the `--on-<ground>` naming rule is now unbroken — every `--on-*` token
names a stock or ink that exists. A token with no job is not a spare; it is a name waiting to drift.

Measured on the grounds they actually sit on, so the next pass does not have to re-derive them:
`mark` on `--desk` (the switch knob) is **2.71:1** and `mark-quiet` on `--stock` (the counter dot) is
**2.62:1** — both below the 3:1 non-text floor, which is acceptable *only* because a word sits beside
each one in the same row. Every live word pairing clears AA at `ink-faint`: 4.57:1 on `--stock-tray`
(lane-empty, lane-sub, the connector sheet), 4.97:1 on `--stock` (the ticket, the sheet cards) and
4.73:1 on `--stock-ledger` (the bill sheet).

**An audit that only walks reachable states has a blind spot, and it cost a pass.** The `Settled` tag
carried `--ink-faint` on `--desk` — **4.05:1** at 11px, below AA — through a whole review cycle
because no seeded ticket reached the branch that emits it, so the DOM walk never saw the element.
Contrast checks that sample rendered pages cannot certify a state the seed data never produces. Reach
for the branch, not the seed: render the state, then measure it.

**The Control-Edge Rule.** A rule draws a line between things; a control's edge is the thing that says
where the control is. So the boundary of anything interactive takes `--control-edge`, never an alpha
rule, and `--rule-mid` is for containers, lanes and filled buttons — places where the word inside
already identifies the object. WCAG 1.4.11 asks 3:1 for a boundary that carries meaning without words,
and `--rule-mid` cannot reach it at 30% ink; `--control-edge` clears it on both grounds the controls
sit on. An alpha rule that measures 2:1 is not a subtle border, it is a control the operator has to
hunt for.

**The Settled-Tag Rule.** `Settled` confirms a finished sale and nothing else. It is emitted only when
`status === 'completed'` — never inferred from "no bill, no next action and nothing billable", which is
how a *cancelled* ticket was once labelled `Settled`. The plate already states every status in words,
so a second tag that restates the plate is at best redundant and at worst a second, wrong answer to
"what state is this in". Set it in `--ink-soft` on `--desk`, **7.71:1** — `--ink-faint` on `--desk`
is 4.05:1 and fails AA at 11px, so it is not a step this tag can spend.

> **Drift, recorded so it is not canonized as a live component.** With the lifecycle as built, nothing
> reaches the tag. `canBill` is false only for `new` and `cancelled`, and `completed` has no next
> action, so a completed ticket always shows either its bill reference or **Generate bill**, while a
> cancelled one now shows nothing. The branch is guarded correctly and the styling is right; it is
> presently unreachable. Leave it correct — the guard is the invariant, not the branch — but do not
> document a `Settled` tag as something a row currently prints.
>
> The dormant `.fact dt` pairing recorded in earlier passes is gone — `.fact dt` now takes
> `--ink-soft` — and `.tag-mute` no longer exists in the stylesheet.

**The One-Label Rule.** Every status carries a text label in addition to its colour — the stamp plate
says `NEW`, `ACCEPTED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`. Colour is never the only
carrier of state, and no status is ever rendered as a bare dot. (The `.src-dot` and `.conn-led` dots
are permitted only because a word sits beside them in the same row.)

## Typography

**Display Font:** Stardos Stencil (self-hosted, 400 + 700)
**Body Font:** Archivo (self-hosted variable, 400–700, `font-stretch` 75%–125%)
**Label/Mono Font:** the platform monospace stack — `ui-monospace`, `"DejaVu Sans Mono"`,
`"SFMono-Regular"`, Menlo, Consolas

**Character:** A stencil and a grotesque, both drawn from the same trade — one is cut, one is
lettered. Stardos Stencil owns every number that must survive a glance across a counter (lot numbers,
tally figures, day figures, ticket totals, the grand total) and the uppercase section voice that
labels a tray or a panel. Archivo owns prose: item names, notes, buttons, metadata. The pairing reads
as printed shop paperwork rather than as software, because the two faces were cut for the same wall.

**A real constraint, not a preference.** Stardos Stencil has no U+20B9 rupee glyph. An Archivo
latin-ext subset is loaded specifically to carry it, and the stencil stack lists Archivo second:
`--stencil: "Stardos Stencil", "Archivo", system-ui, sans-serif`. Any total rendered in the stencil
therefore has its `₹` silently set in Archivo. Do not "fix" this by removing Archivo from the stack.
What you do with the sign once it is in Archivo is **The Rupee-Sets-Separately Rule**: wrap it, step it
down, and never let it inherit the figure's size.

### Hierarchy
Every size below is a token on the ramp, not a literal. The ramp is defined once in `tokens.css` and
nothing in the product steps off it.

| token | size | role |
| --- | --- | --- |
| `--micro` | 0.6875rem (11px) | the hard floor: labels, metadata, column heads |
| `--t-label` | 0.75rem (12px) | uppercase labels, tabs, buttons, plate text |
| `--t-body` | 0.8125rem (13px) | the workhorse: controls, table cells, ticket lines |
| `--t-lead` | 0.875rem (14px) | body copy, inputs, facts, the board title, a row's lot number |
| `--t-name` | 0.9375rem (15px) | the customer or shop name |
| `--t-screen` | 1rem (16px) | screen titles |
| `--t-mark` | 1.125rem (18px) | wordmark, bill number, ledger head, a row's total |
| `--t-lot` | 1.1875rem (19px) | the lot number on a full ticket |
| `--t-total` | 1.3125rem (21px) | the ticket total, the tally strip's figures |
| `--t-figure` | 1.5rem (24px) | the day band, the grand total |

- **Display** (700, `--t-figure`, line-height 1): the day band on the Bills screen and the grand total
  on the bill sheet. The largest type in the product is a number.
- **Headline** (700, `--t-screen`, line-height 1.1, `0.14em` tracking, uppercase, stencil): screen
  titles (`BILLS`, `PRODUCTS`, `CUSTOMERS`, `SETTINGS`), the bill sheet bar, and the connector sheet
  header. **The order board is the one screen that does not use it** — `.board-title` is `--t-lead`,
  because it now shares a line with `.board-say`, and a 16px stencil title next to a 13px sentence
  would read as two headings.
- **Lot Number** (700, `--t-lot`, line-height 1.1, `0.055em` tracking, stencil): the identity of
  every ticket on the full card. Set with a `0.34em` gutter for each space so the ID reads as a stamped
  number rather than a word. **In a row the same number steps down to `--t-lead`** (14px) — see the
  ticket component; a lot ID is recognised, not read, once it is claimed.
- **Total** (700, `--t-total`, line-height 1, stencil, tabular): the full card's foot figure, the
  tally strip's figures and a row's, each with its `₹` set separately in Archivo `700` — at
  `--t-body` on the card, `--t-label` in a row, and `0.66em` of the strip figure, which is its one
  relative step. **A row's total steps down to `--t-mark`** (18px) for the same reason its lot
  number does.
- **Title** (400, `--t-name`, `0.04em`, stencil): customer and shop names on the full card, in the
  drawer, and on the bill sheet. **In a row the name is Archivo `--t-name`**, not stencil — a row's name
  is read word by word when the operator is looking for one, and it is the one string on the row that
  must never truncate.
- **Body** (400, `--t-name`, line-height 1.5, Archivo): the document default — it is literally the
  `body` rule, `font: 400 var(--t-name)/1.5 var(--ui)`, so the page has no size of its own to drift
  from. Item names, note text, empty-state prose. **Copy** is `--t-lead` for prose blocks and inputs;
  **Control** is `--t-body` at `600` for buttons, inputs and table cells. `.board-say` is `--t-body`,
  because a sentence is neither a label nor body copy.
- **Label** (700, `--micro` = `0.6875rem`, `0.14em`–`0.16em` tracking, uppercase): every metadata
  label, tray name, column head and field label in the product.
- **Mono** (400, `0.8125em`, `-0.01em`): phone numbers, IDs, lot IDs and every money column. It is the
  ramp's one relative step — see The Ramp Rule for why.

**The ramp is closed.** Ten steps, ten tokens, and the design-system sweep reports zero font-size
literals left in the screen build — the root default and the input font are both on the ramp
(`400 var(--t-name)/1.5` and `600 var(--t-lead)/1.2`), so there is no un-ramped base to inherit.
Take the next size up or down the ramp; do not interpolate one.

### Named Rules

**The Ramp Rule.** Every `font-size` in the screen build names a token on the ramp above. The ramp was
swept into `tokens.css` from what the build was already using, so the tokens describe the design
rather than constrain it — and a value that appears only once is still a step, not a one-off literal.
There are exactly two sizes on screen that are *relative*, and both are deliberate: `.mono` at
`0.8125em` of its context, because a monospace figure must shrink with whatever it sits inside rather
than sit at a fixed size beside it, and `.tally-n i` at `0.66em`, the rupee sign that steps down inside
the strip's own figure — see **The Rupee-Sets-Separately Rule** below, which is why the second one is
relative rather than a step on the ramp. The receipt adds four more relative sizes inside its own tree
— `1.18em` for the shop name and total, `0.92em` for its metadata rows — and those are covered by the
Receipt section, not by this ramp.

**The Rupee-Sets-Separately Rule.** In this system the rupee sign always sets separately from the
figure, one step down, never inside the numeral. Every money run is `'<i>₹</i>' + figure`, and every
`.tally-n i`, `.row-total i` and `.ticket-total i` is that one step. The reason is the type: Stardos
Stencil has no U+20B9, so a sign inside the stencil run falls through to Archivo anyway — at the
figure's weight and size, which reads as a numeral with a stray glyph in it rather than as a currency
mark. Writing `SV.money()` as a single text node once did exactly that on the tally strip, setting
`₹701.72` at the full `--t-total` and breaking the pattern every other total follows. Set the sign,
then the figure. One exception would be a second pattern, so there is none.

**The Micro Floor Rule.** `--micro: 0.6875rem` (11px) is a hard floor for any functional text. It was
set after a legibility pass, and the reason is physical: this screen is read at arm's length under bad
light at a fixed terminal. Nothing functional — label, metadata, table cell, badge, footnote, a row's
action label — goes under it. Nothing on the board sits below it today; the tightest functional text
on the board is exactly at the floor, which is the row's action button and the bill tag. The rule
governs the screen. The 58mm receipt runs a 10px base, which is device pixels on paper rather than a
UI size, and is off-ramp by design for the reason given in the Receipt section.

**The Stencil-Numbers Rule.** If a value is a number the operator scans for — a count, a total, a lot
ID, a figure on a screen — it is stencil. If it is a thing the operator reads — a name, a note, a
label — it is Archivo. Do not mix the two inside one token of type.

## Layout

The page is a fixed vertical spine over a scrolling board: a sticky iron rail (`--rail-h: 3.5rem`),
then the tally strip, then `main` as a flex column that fills the remaining height. Every screen is a
`flex: 1` column of its own, so switching screens never reflows the rail or the tally.

- **Board:** `grid-template-columns: repeat(4, minmax(0, 1fr))`, `gap: 0.75rem`, `align-items: start`,
  padded by `--gutter` on the inline axis only. Lanes size to content, not to the viewport.
- **Tally strip:** three equal cells in a `repeat(3, minmax(0, 1fr))` grid on the ink ground, with a
  full-bleed offline band that spans `1 / -1` beneath them when the connection drops. Each cell insets
  its own labels by `--gutter` — 19.1px at 1366px, 12–24px across the range — while the strip itself
  runs edge to edge. A padding heuristic that scores the strip as cramped is measuring the inset of an
  edge-to-edge band against a minimum-card-padding target; the numbers are recorded here so the next
  pass does not have to re-derive them. The cells carry the day's figures, so they have no `data-tally`
  status key and no per-status tint; see **The One-Number Rule** in Colors.
- **Focused lane:** `[data-focus]` collapses the board to `minmax(0, 1fr)` and reflows the focused
  lane's body into `repeat(auto-fit, minmax(16rem, 21rem))`. Focusing one tray gives that tray the
  whole board so its tickets flow across instead of stacking in one narrow column.
- **Horizontal gutter** is the only fluid metric: `--gutter: clamp(0.75rem, 1.4vw, 1.5rem)`. The board
  and the tally share it, which is what makes them read as one sheet.
- **Spacing rhythm:** there is no spacing scale token in the code, and that is deliberate — the build
  steps literal `0.15 / 0.2 / 0.3 / 0.4 / 0.5 / 0.6 / 0.75 / 0.85 / 0.9 / 1 / 1.25rem` inside
  components, while `--gutter` and `--tap` carry the responsive axis. Match the surrounding literal
  step; do not invent a scale. The frontmatter's `spacing` block records those observed steps for
  tooling, and `xs`–`xl` there are **not** `var(--spacing-*)` — only `gutter` and `tap` are real
  custom properties.
- **Touch target:** `--tap: 2.5rem` is the minimum height for any `.btn`. `.btn-sm` drops to `2rem`
  and is only ever used inside a ticket's action row, where the ticket itself is the larger target.

**The density budget, measured.** The chrome above the first ticket is the price of every ticket the
operator can see, so it is measured rather than assumed. On the POS target viewport (1366×768):

| band | height |
| --- | --- |
| iron rail (`--rail-h`) | 56px |
| tally strip | 55px |
| board head (title + `.board-say` + tools) | 49px |
| tray head | 38px |
| **chrome before the first ticket** | **199px** |

Below that, a ticket in NEW is 283px and a ticket past NEW is 77px — so a tray holds roughly one and a
half full cards or seven rows. That ratio is the whole argument for two densities: one density would
make the working trays unreadable past their third ticket. The board is `align-items: start`, so lanes
size to content and the page scrolls rather than clipping.

**Verify row content by measurement, not by reading the screenshot.** Three defects in this build
looked fine in a screenshot and were wrong in the DOM: a customer name truncating to "Sunita Desh..."
because line one carried too much; a lot number wrapping to two lines once a `Billed B-00001` tag
joined it; and a 26-character lot number spilling past the ticket onto the tray behind it, measured at
441px of `scrollWidth` against a 300px `clientWidth`. All three were invisible at a glance and obvious
from the numbers. A row's height is fixed by its two lines, so any fact added to it is a layout
change: check the box first, then decide where the fact goes.

**Breakpoints** (`max-width`, in the order they appear in `app.css`):
- `1180px` — board 4 → 2 columns. The tally stays at three cells; its cells are wide enough to hold
  their labels without clipping at every width down to 720px.
- `900px` — the rail wraps: brand and tools on row one, all eight tabs on row two. The tab strip's
  edge fade and horizontal scroll are removed, because two wrapped rows beat hiding a quarter of the
  navigation off-canvas. `.grid-2/3`, the bill sheet's two-column grid and the bill edit row all
  collapse to one; the bill sheet becomes a full-bleed sheet at `inset: 0`.
- `720px` — board 4 → 1 column; the tally becomes a single stack of bands, label left and figure right,
  because three labels cannot sit side by side at that width; drawer → `100vw`; the drawer's fact list
  un-stacks from `6.5rem 1fr`.
- `560px` — the bill sheet's footer bar stacks vertically and stretches.

## Elevation & Depth

**Depth is contact, not lift.** The system has exactly two shadows, both defined in `tokens.css`, and
neither is a glow or a floating drop:

- **`--lift`** (`0 1px 0 oklch(17.5% 0.008 62 / 0.10), 0 2px 4px oklch(17.5% 0.008 62 / 0.06)`): paper
  resting on the desk. A 1px hard contact line plus a 4px diffuse. Applied to `.ticket` and
  `.sheet-card` only.
- **`--lift-up`** (`0 1px 0 oklch(17.5% 0.008 62 / 0.12), 0 6px 16px oklch(17.5% 0.008 62 / 0.13)`):
  paper picked up off the desk — the drawer, the bill sheet, the connector sheet, the toast, and the
  alerting ticket.

Everything else separates with a hairline rule. Containers are flat, with a 1px `--rule` or
`--rule-mid` border doing the work a shadow would do in a default UI. The one non-lift shadow in the
build appears twice, on the sticky footer bars: `0 -9px 11px -9px var(--shade-deep)`, a scroll-cue that
lets content pass under the bar without looking clipped.

The rail gets a different depth instrument entirely: `inset 0 -1px 0 var(--edge-deep)` for its bottom
edge and `0 1px 0 var(--rail-soft)` for a machined highlight. That is a lit metal edge, not a card.
Over it sits the brushed grain, a 1px hairline repeating every 3px at `--rail-grain`'s 2.2% white. The
design-system sweep flags that as a repeating-stripes gradient, and it stays: a brushed-metal grain
*is* hairline repetition, and a heuristic cannot tell a material from a decorative stripe. The
distinction to preserve is intent — one rail, one grain — not the absence of repetition.

### Named Rules

**The Hairline Rule.** Depth is a hairline rule or one of the two lifts — nothing else. Do not add a
third shadow, a coloured glow, or a blur to a resting surface. If a layer needs to read as above
another, it gets `--lift-up` and a scrim; if it needs to read as beside, it gets a rule.

## Shapes

The silhouette is paper cut by hand, so **corners are barely rounded and nothing is fully round**
except the small metal controls in the rail. The radius scale is five steps, and every one of them is a
token on it:

- `--radius-hair` (1px) is a printed edge: the wordmark's jute rule, the printer icon's box.
- `--radius-cut` (2px) is a cut corner: stamp plates, quantity chips, tags, order-trail steps, ledger
  boxes, the ledger's ruled stamp, and the lane-count blocks. It used to have a second name,
  `--radius-plate`, holding the same 2px for the plate alone; the duplicate is gone and `.plate` reads
  `--radius-cut`, because one radius with two names is two names to keep in sync.
- `--radius` (3px) is the system's default radius — tickets, lanes, buttons, inputs, sheets, tags and
  the toaster.
- `--radius-pill` (999px) is reserved for the rail's machined hardware — the connection pill, icon
  buttons, the demo-mode button, the switch track, and the meter bar — because those are the counter's
  metal fittings, not paper.
- `--radius-shell` (8px) is the one rounded-off silhouette in the product: the right edge of the mute
  speaker cone. It exists because a speaker cone is the only thing in this world that is genuinely
  domed, and the shape has to say so.
- **The lot ticket is asymmetric on purpose**: `border-radius: 0 0 3px 3px`. Square at the head
  (where the perforation is punched), rounded at the foot.
- **Perforation.** `.ticket::before` is an absolutely-positioned 8px band along the ticket's top edge:
  notches punched on a 9px period (`radial-gradient(circle at 3.6px -1px, var(--desk) 3.7px,
  transparent 3.9px) 0 0 / 9px 7px repeat-x`), with a `1px` `--rule-mid` tear hairline drawn at 7px
  beneath them. The notches are punched out in the desk colour, so they read through to the tray
  behind. Both densities use this geometry, unchanged.
- **Torn stub corner.** `.ticket::after` is an 11px square at the bottom-right cut by a single
  `linear-gradient(315deg, var(--stock-tray) 0 50%, transparent 50%)`.
- **Hairline rules** replace borders inside content: `<hr class="rule">` at 1px `--rule`, and
  `rule-double` at 3px total (1px `--rule-mid` top and bottom) for the grand-total break on the bill
  sheet and the receipt.
- **The accepted sub-band** is the one dashed edge in the system: a `1px dashed --rule-mid` top rule
  on `.lane-sub`, followed by a `1px solid --rule-hair` hairline that runs to the lane's right edge.
  Dashed here means "part of the tray above, not a tray of its own."
- **Nothing clips a radius on a full-bleed surface.** The drawer and bill sheet are `0` radius at
  ≤900px when they go full-bleed, because paper does not have rounded corners when it is the whole desk.

### Named Rules

**The One-Shell Rule.** `--radius-shell` (8px) has exactly one user: the mute speaker cone. It is a
token rather than a literal so the exception is visible and cannot spread by example — if a second
shape starts reaching for it, the rule has been broken, and the shape should have been designed to say
why it is genuinely domed. The same test governs `--radius-pill`: metal fittings only, and if you are
unsure whether something is a fitting, it is paper.

**The One-Perforation Rule.** The perforation is one geometry at two densities. `.ticket::before` is
8px tall with its tear hairline at 7px, and `.ticket--row::before` inherits that height rather than
restating it. A height change to either is a regression in the other, and the failure is silent: the
band is a positioned overlay, not layout, so shortening one costs no height and shows nothing broken
except a tear hairline that has been clipped off the bottom of its own box. The band, the 7px hairline
offset and the 9px notch period are one number set. If a future density needs a different punch, it
gets a different element, not a different `height` on this one.

## Components

### Buttons
- **Shape:** `--radius` (3px), `1.5px solid --rule-mid` border, minimum height `--tap` (2.5rem). Archivo
  `600` at `--t-body`, `font-stretch: 94%`, `0.02em` tracking, `0 0.9rem` inline padding.
- **Seal** (`.btn-seal`, the primary): filled jute on a `--jute-deep` border, `700`, `--on-jute` text.
  Hover deepens to `--fig-jute` with a `--jute-edge` border. This is the only filled-jute
  interactive element and it always ends in a `.chev` (a 1.6px two-border chevron rotated 45°) because
  the seal is a press that moves the ticket forward.
- **Ink** (`.btn-ink`): filled ink, stock text. The dark commitment, used on the ink bar of the bill
  sheet.
- **Ghost** (`.btn-ghost`): transparent, `--rule-mid` border, `--ink-soft` text. Hover fills with
  stock. This is the default for secondary actions ("View order", "Bill").
- **Danger** (`.btn-danger`): transparent, `color-mix(in oklch, var(--india) 55%, transparent)` border,
  india text. Hover fills `--india-wash`. Never filled red.
- **Hover / Focus / Active:** hover shifts background and border over `0.12s`; `:active` is
  `translateY(1px)` over `0.06s` — the button physically presses. `:focus-visible` gets the token
  focus ring (`--focus`): `0 0 0 2px var(--stock), 0 0 0 4px oklch(47.5% 0.183 26 / 0.85)`, a stock gap so the
  ring reads on any ground. Disabled is `opacity: 0.42` and `not-allowed`.
- **Small** (`.btn-sm`): 2rem height, `0 0.6rem` padding, `--t-label` type. Ticket action rows flex their
  buttons, with `.btn-seal` at `flex: 1.6` so the press is always the widest target.

### Stamp Plate (status)
- **Style:** a filled, inked, rotated plate — `transform: rotate(-1.5deg)`, `--radius-cut`,
  `0.32em 0.6em 0.28em` padding, Stardos Stencil `700` at `--micro`, `0.14em` tracking, uppercase.
- **Ink by status:** `NEW` jute on `--on-jute` with a `1.5px --jute-deep` inner ring ·
  `ACCEPTED` ink on stock · `PREPARING` verdigris on `--on-verdigris` · `READY` ledger on
  `--on-ledger` ·
  `COMPLETED` transparent with a `1.5px --rule-mid` inner ring and `--ink-faint` text · `CANCELLED`
  transparent with a `1.5px --india` inner ring and india text.
- **Mottle:** `::after` lays two `radial-gradient` dot layers (`0.5px` dots at `3px 3px` and `4px 4px`,
  offset `1px 2px`:
  `--edge-hair` and `--ink-alpha-w`) under `mix-blend-mode: multiply` at `opacity: 0.8`, plus an
  `inset 0 0 2px var(--ink-alpha)` bleed. This is what makes the plate read as pressed ink.
- **Behaviour:** `.is-stamped` runs `stamp-press` for `0.3s` — it falls in from `rotate(-8deg)
  scale(1.24)` at `opacity: 0.08` with a 1.6px blur, contacts hard at 38%, settles at 100%. The
  overshoot is kept on purpose (a rubber stamp overshoots); the elastic tail is not.
- `COMPLETED` and `CANCELLED` are the only outlined plates — they are the two states that are no
  longer in play, and an outline says so without another hue.

### Lot Ticket (the signature component) — two densities
The lot ticket is printed twice on this board, and the split is the system's most important layout
decision. The rule behind it: **a ticket needs reading only while nobody has claimed it; after that it
needs scanning.** `.ticket--live` is the full card and renders for status NEW only. `.ticket--row` is
every other status. Both are the same paper — same perforation, same torn stub corner, same
`--lift` contact shadow — at two densities.

Both densities name the ticket the same way — the lot number and the customer name are the two facts
an operator recognises a ticket by — but only the row makes both of them controls. In a row the two
names *are* the affordance, because there is no room for a third one. In the card the name alone is a
button; the lot number is still a plain stencil span there, which is a gap rather than a decision and
is recorded as such below.

#### `.ticket--live` — the full card, status NEW only
- **Corner style:** `0 0 3px 3px`; **background:** `stock`; **border:** `1px solid --rule-mid`;
  **shadow:** `--lift`; **padding:** `0.85rem 0.7rem 0.6rem`; internal `gap: 0.45rem`. **Measured height:**
  283px on the POS viewport.
- **Anatomy, top to bottom:** the lot number in stencil `--t-lot` opposite the stamp plate, both
  centered · the customer name as a stencil `--t-name` button (`.ticket-name`, `--ink`, `--jute-edge`
  on hover, full-width, `text-align: left`) · one meta line at `--micro` in `--ink-faint`: time,
  source, fulfilment, payment · an optional warning flag for unpriced products · a hairline rule · up
  to three line items, each a quantity chip (`.q`, stencil `700`, desk ground, `2px` radius) + name +
  right-aligned monospace amount, then a `+N more items` line · the WhatsApp note when present, in the
  jute `.flag-note` strip · the foot: item count at `--micro`, and the total in india red at stencil
  `700` `--t-total` with the `₹` set separately in Archivo `700` `--t-body` · **View order** /
  **Accept order**. The warning flag opens with `.warn-glyph`, drawn in CSS, never a glyph character.
- The card is the only ticket that states its source at all, and it states it as a **word** in the meta
  line. The `--whatsapp` / `--mark-quiet` source dot with `WHATSAPP ORDER · COUNTER SALE` beside it
  lives on the drawer header now, not on the board. Past NEW the source is a settled fact and the row
  does not repeat it.

> **Drift, recorded so it is not inherited as a rule.** The live card's lot number is a `<span
> class="ticket-lot">`, not a button — only `.ticket-name` opens the order. In a row both `.row-lot`
> and `.row-who` are buttons. The design intent is for both names to be controls at both densities; the
> card half of that is not built. Make the card's lot a button or drop the claim — a design rule and a
> half-implementation must not both be recorded.

#### `.ticket--row` — the compact row, every other status
- **Same paper, same perforation:** `padding: 0.5rem 0.6rem 0.45rem`, `gap: 0.3rem`, and the same 8px
  perforation band as the card. The band used to be shortened to 6px here to keep the punched edge off a
  row that has only two lines, which cost the tear hairline its position: the hairline sits at 7px
  inside the band, so at 6px it painted outside the box and was clipped — a live card showed its tear
  line and a row showed nothing. The band is an absolutely-positioned overlay, so restoring 8px cost
  the row no height at all. **Measured height:** 77px with a timestamp, 68px on a settled row.
- **Line one is identity and money** (`.row-top`): the stamp plate, then the lot number as a
  `--t-lead` stencil button (`.row-lot`, `--ink`), then the time (`.row-when`, `--micro`
  `--ink-faint`), then the total pushed right (`.row-total`: india red, stencil `700` `--t-mark`, `₹`
  separately in Archivo `700` `--t-label`).
- **The lot number is guarded, not trusted.** `.row-lot` is `flex: 0 1 auto; min-width: 0; overflow:
  hidden; text-overflow: ellipsis` with `white-space: nowrap`, so a long id ellipsizes inside the row
  instead of pushing the plate and the total out of it. It is latent for the `SAM-NNNNN` ids this shop
  issues — 9 characters — and unguarded is not the same as safe: the connector mints whatever
  `order_id` the cloud sends.
- **Line two is the customer and the action** (`.row-bot`): the name as a `--t-name` button
  (`.row-who`, `--ink-soft`, `flex: 1; min-width: 0`, ellipsis) and one control on the right — the seal
  button that advances the ticket, or **Generate bill**, or the bill reference.
- **There is no "View order" button in a row**, because in a row that button would cost more room than
  the name it is protecting. The two name buttons are the affordance instead.

**Two facts a row deliberately drops, and why.**
- **The phone number.** The drawer has it (`.cust-strip`), and the name is the identifier an operator
  actually recognises across a counter. Printing both on one line is what forced the truncation.
- **The timestamp on a settled ticket.** It is history; the lot number and the bill number are not. A
  completed row's line one is plate, lot, total — and the bill reference rides line two.

**The bill reference on a settled row is the number alone**, `B-00001`, with the word `Billed` carried in
the `title` attribute, because the word cost the row its layout. The `.tag-done` `Settled` tag is the
fallback past that — desk ground, `--ink-soft` at `--micro`, `0.35em` inline padding — and by **The
Settled-Tag Rule** it is emitted only for `status === 'completed'`. See the drift note in Colors: on the
lifecycle as built, no ticket reaches it today.

**A row's action is counter-sized text.** `.row-bot .btn` sets `--micro` with `0.55rem` inline padding
and a `0.38em` chevron instead of the base `0.44em`. The reason has to survive any future edit: **the
action label stays whole and the customer name is what must never truncate.** The button is
`flex: none`, so it takes its natural width and the name absorbs the remainder. Shrink the button
before the name.

**Extending a row is a layout change, not an addition.** A row's height is fixed by its two lines, so
adding a third fact is a re-layout: decide what comes off before deciding what goes on, and verify it by
measuring `scrollWidth` against `clientWidth`.

#### Shared by both densities
- **Arrival:** `.is-fresh` runs `ticket-in` (`0.4s ease-out`, from `translateY(-6px)` behind a
  `0 0 0 3px --jute-wash` ring) while each character of the lot number flips in on
  `animation-delay: calc(var(--i) * 26ms)` with `steps(4)` — a split-flap, 26ms apart. The perforation
  briefly glows `--jute-wash` for `1.1s`. Only NEW arrivals are fresh, so this is the card's behaviour.
- **Alerting:** `.is-alerting` swaps to `0 0 0 2px var(--jute), 0 0 0 6px var(--jute-wash),
  var(--lift-up)` for 1.8s and scrolls into view — so a ticket that changed status inside a full tray
  is still findable. This is the row's most important behaviour: a row is 77px, and the operator may not
  be looking at that tray when the stamp lands.

### Lane (a tray)
- **Corner style:** `3px`; **background:** `stock-tray`; **border:** `1px solid --rule`; no shadow.
  It is a tray, not a card — flat, and one step down from the tickets sitting in it.
- **The NEW tray is the tinted one.** `.lane[data-lane="new"]` takes a jute-tinted ground and a
  jute-deep border, so the tray that needs work is identifiable before anything in it is read — see
  **The Tinted-Tray Rule** in Colors for the values and the exclusivity. It also retints its tickets'
  perforation: the tear hairline under the punched notches steps to
  `color-mix(in oklch, var(--jute-deep) 34%, transparent)`, so the punched edge on a ticket sitting in
  the work tray is visibly its own thing. Nothing else in the build may take this treatment.

> **Drift, recorded so it is not inherited as a rule.** The retint also moved the geometry. The NEW
> lane's cards keep the inherited 8px band but draw their hairline at `0 5px` and their notch tile at
> `9px 5px`, while every other tray's tickets and every row draw theirs at `0 7px` and `9px 7px` — so
> the work tray's tear line sits 2px higher and its notches are shorter, with 3px of plain stock at the
> foot of the band. **The One-Perforation Rule** forbids exactly this; the ink change is the whole of
> the intent. Match `0 7px / 9px 7px` here and keep the jute mix.
- **Head:** a `linear-gradient(var(--stock), var(--stock-tray))` cap with a `1px --rule` bottom rule,
  the tray name in stencil `700` `--t-label` uppercase at `0.16em`, and a filled 1.5rem lane-count block
  pushed right. The count block is jute for NEW (`--jute` ground, `--on-jute-deep` text), verdigris
  for PREPARING, ledger for READY, graphite for COMPLETED.
- **Body:** `0.6rem` padding, `0.6rem` gap, `min-height: 5rem`. Empty trays show a dashed `--rule-mid`
  box with a stencil `--t-label` title over a one-line hint at `--t-label` in `--ink-faint`.
- **Accepted sub-band:** in the PREPARING tray only, accepted tickets are grouped under a dashed
  `.lane-sub` rule reading `ACCEPTED · TO START`. **ACCEPTED deliberately has no tray of its own** —
  it rides in PREPARING, so the tray count, the tab chip and the lane head can never disagree about
  where an accepted ticket is.

### The board's one sentence (`.board-say`)
- **The board says what it is.** A single plain-English sentence sits beside the screen title, live,
  updated on every board render, in up to five clauses: `4 new WhatsApp orders waiting · 2 new counter
  tickets waiting · 3 being prepared · 2 ready to go · 3 settled today`, or when every tray is empty,
  `Nothing in the trays. New WhatsApp orders appear here by themselves.`
- **The clauses are distinct claims, so each one is filtered.** `settled today` counts
  `status === 'completed'` **and** `createdAt >= SV.todayStart()` — without the day filter a settled
  ticket from yesterday moved the sentence while the strip's `todayOrders` correctly stayed put, which
  is a sentence disagreeing with the number printed beside it. `new WhatsApp orders` counts only
  `source === 'whatsapp'`; counter tickets were being counted as WhatsApp ones, so a counter-sourced
  ticket inflated a claim about WhatsApp. It gets its own clause — `N new counter tickets waiting` —
  which is also the honest place for it. Being prepared and ready to go are queue claims and stay
  unfiltered, because that is what they are.
- **Why it exists:** the board must explain itself before it is read, and this is the only line that
  does. The five clauses drop out only when their count is zero, so the sentence never pads itself with
  noughts; the empty case replaces the whole sentence rather than reading `0 · 0 · 0 · 0`.
- **Style:** Archivo `--t-body` (13px) in `--ink-soft`, measured at 7.71:1 against `--desk`, the ground
  the board head inherits from the page. It is prose, so it takes Archivo — **The Stencil-Numbers Rule**
  does not reach a sentence.
- **Placement:** beside the title on one line at ≥901px (`margin: 0 auto 0 0` pushes the tools right);
  below 900px it takes its own full-width line (`flex-basis: 100%`, `order: 3`) so it never squeezes the
  title or the tools.

**The Board-Speaks-First Rule.** The board must explain itself before it is read, and this sentence is
the only line that does. Write it in the words a shopkeeper would use, keep it to one sentence, and drop
a clause rather than print a `0`. A screen that needs a legend is a screen that has failed.

**The Sentence-Is-A-Claim Rule.** A sentence the screen speaks is a claim, and a claim gets the same
filtering as the numbers it summarises. Every clause here is written from the same predicates as the
figure it restates — same status test, same day boundary, same source filter — so the prose cannot
drift away from the ledger it describes. If a clause cannot be written with the figure's own predicate,
the figure is wrong or the clause is not worth printing.

### Tally Strip (the day's totals)
- A `repeat(3, minmax(0, 1fr))` grid on `--ink` with stock text and a `1px --rail-hair` left border
  between cells. Each cell is a stencil `700` `--t-total` figure over a `--micro` uppercase label at
  `0.16em` in `--on-graphite`, and Today's sales sets its `₹` separately in Archivo `700` at `0.66em`
  of the figure — `'<i>₹</i>' + SV.amount(...)`, per **The Rupee-Sets-Separately Rule**.
- **Three cells, and only three:** Today's bills, Today's sales, Bills via WhatsApp. The strip used to
  carry six, printing the queue counts that the tabs and the tray heads already print. What survives is
  the set the board does not otherwise show — the day's arithmetic, read off the ledger rather than off
  the queue. **The One-Number Rule** in Colors is the rule this establishes.
- **The figures are stock, not tinted.** There is no per-status tint on the strip any more, because
  there is no status on the strip any more, and the rules that used to supply one are gone: the three
  `.tally-cell[data-tally="…"] .tally-n` colour rules and the `nth-child` border rules at 1180px and
  720px all matched cells the strip no longer has. They took `--fig-verdigris` and `--fig-ledger` with
  them. A colour rule for a cell that does not exist is a figure the design thinks it is showing.
- When the connection drops, a full-bleed `--alert` band with an `--alert-led` LED spans `1 / -1`
  beneath the cells and states plainly that orders will sync.
- Below 720px the three cells stop being columns and become three full-width bands: label right,
  figure left, `baseline`-aligned, `--gutter`-padded. Three labels side by side would clip at 390px;
  three bands do not.

### Inputs / Fields
- **Style:** `1.5px solid --control-edge`, `--radius` (3px), `--stock` ground, minimum height `2.25rem`,
  Archivo `600` `--t-lead`, `font-variant-numeric: tabular-nums`. Labels are `--micro`, `700`,
  `0.14em`, uppercase, `--ink-faint`. The border is `--control-edge` and not `--rule-mid` because the
  boundary of a control is the thing that makes it findable, and `--rule-mid` measures 2.00:1 on
  `--stock` — under the 3:1 floor every input and switch in this app was failing; see
  **The Control-Edge Rule** in Colors.
- **Focus:** `:focus-visible` shifts the border to `--ink` and takes the token focus ring.
- **Switch:** a `2.75rem × 1.5rem` `999px` desk track with a 1.125rem `--mark` knob and the same
  `1.5px solid --control-edge` boundary; checked turns the track `--jute-wash` with a `--jute-deep`
  border and slides the knob `--jute-deep` by `1.2rem` over `0.16s`. The knob is a shape, so it wears
  a `--mark` and is allowed to sit below the text threshold — it is never given a lightened ink.

### Navigation (the iron rail)
- **Style:** a `--rail-h` (3.5rem) sticky bar on `--rail` with the brushed grain, a `--rail-soft`
  top highlight and a `--edge-deep` inset bottom edge. Wordmark in stencil `700` `--t-mark` at `0.1em`,
  followed by a 3px jute rule and a `--micro` `POS` at `0.22em`.
- **Tabs:** Archivo `600` `--t-label` at `font-stretch: 92%`, `--rail-ghost` at rest, `--rail-ink` on
  hover (over a `--rail-wash`). The current tab is `--stock` with a `3px` inset jute underline — an
  underline, never a filled pill.
- **Counts:** a `1.35rem` square stencil chip in `--rail-ghost` on ink; on the current tab, or when
  `data-hot="1"`, it inverts to jute on ink. Zero hides the chip entirely.
- **Overflow:** the strip fades out over its last `1.75rem` via a `mask-image` so a clipped word never
  looks like an affordance; below 900px that is dropped in favour of wrapping to two rows. The mask
  keys off `--mask-solid` — a mask has to be opaque to mask, so this is the one place a `#000` in this
  product is not the printer's ink.
- **Hardware:** connection pill, sound toggle and demo button are all `999px` metal fittings with
  `1px solid --rail-line` borders and white-alpha grounds. The sound icon and print icon are **drawn in
  CSS** from borders and gradients — no icon font, no `<img>`.

### Icons
Drawn, never fetched — no icon font, no glyph character, no `<img>`, no fetched SVG. Every mark in the
product is built from borders, gradients or clip-paths:

- `.chev` — two 1.6px borders rotated 45°.
- `.icon-mute` — a CSS speaker body (a `clip-path` pentagon) on a left rail, plus a jute slash that
  disappears when muted, and a `--radius-shell` cone edge.
- `.icon-print` — a bordered box with a paper slot and a `0 0 0 1.5px var(--jute)` output.
- `.warn-glyph` — the warning triangle: a border-triangle with a bar knocked out of it in the flag's
  own ground, so it reads on red stock and on the drawer's resolve row alike. It was the last glyph in
  the build and it is now a drawn member of this family like the rest.
- `.step-arrow` — the order trail's chevron, in `--mark` at 1.4px.
- The LEDs (`.conn-led`, `.tally-off-led`) are drawn discs, permitted because a word sits beside each
  one in the same row.

### Bill Sheet (the shop's own ledger)
- A `min(46rem, …)` sheet on `--stock-ledger`, centred with `translateX(-50%)`, `--lift-up`, an ink bar
  across the top and a stock footer bar. Shop name in stencil `700` `--t-mark`; bill/date/order numbers
  right-aligned in stencil; two ledger boxes for Customer and Order; the item table at `--t-body`
  with `--micro` uppercase heads; totals right-aligned in monospace at `min(20rem, 100%)`.
- The grand total breaks on a `3px double var(--india)` rule with india text and a stencil
  `700 --t-figure` figure — the same red rule as the receipt's `.r-hr.dbl`.
- **GST is split per line into CGST and SGST, each `Math.round(base × rate / 200)` on paise** so a
  5% item never loses a paisa across a bill. Tax is computed on the line value *after* that line's own
  discount.

### Receipt (print)
- A separate, deliberately non-inherited tree: `@media print` removes the rail, tally, main, drawer,
  bill sheet, scrims and toaster with `display: none !important`, strips every `box-shadow` and
  `text-shadow`, and kills all `background-image` — the printer cannot draw them. The page ground is
  `--print-ground`, not a literal white.
- **The tray sets the base; the receipt's own sizes are relative to it.** `#receipt` declares
  `font: 400 var(--tray-80-type)/1.35 var(--mono)` and each tray overrides only `font-size`, with the
  paper width following the tray the shop actually loaded: `58` → 54mm at `--tray-58-type` (10px),
  `80` → 72mm at `--tray-80-type` (11px, the default), `a4` → 150mm at `--tray-a4-type` (13px). The
  matching `@page { size: … auto; margin: 3mm }` is injected at runtime by `src/printer.js`.
- **Everything inside the receipt is an `em` off that base**, never an absolute size: `.r-shop` and
  `.r-total` are `700 1.18em` (line-height 1.25 and 1.3), and the metadata rows — `.r-sub`, `.r-meta`,
  `.r-item .d`, `.r-foot`, `.r-src` — are `0.92em`. Measured across the three trays:

  | tray | paper | base | `.r-shop` | `.r-total` |
  | --- | --- | --- | --- | --- |
  | `58` | 54mm | 10px | 11.8px | 11.8px |
  | `80` | 72mm | 11px | 12.98px | 12.98px |
  | `a4` | 150mm | 13px | 15.34px | 15.34px |

- **Why it is written this way.** `.r-shop` and `.r-total` were previously hardcoded at `13px` outside
  any tray scope, so a 54mm roll printed its shop name and grand total at A4 size and overran its paper
  width, while the `#receipt` base was a literal `11px` that the 58mm and A4 trays silently ignored.
  The fix was not three more tray tokens; it was making the headings relative, so changing the tray
  changes the whole receipt at once. A new line in the receipt should be sized in `em` against the
  base, and if it must differ per tray it belongs in a `body[data-paper] #receipt` override alongside
  the base itself.
- The three tray sizes are `--tray-*-type` and never `--t-*`: a thermal head is measured in device
  pixels, not in screen rem, so the tray sizes sit on their own scale and move on their own.
- Rules are dashed `1px var(--print-ink)`; the total rule is `r-hr.dbl`, a `2px` solid top and bottom.
- **Tax is summarised by slab on the receipt** — one `CGST @ <rate>%` and one `SGST @ <rate>%` line
  per distinct rate, not one line per item, which is the only way a thermal bill stays readable.
  Every amount is integer paise formatted with `en-IN` grouping.

### Toaster
- `min(22rem, …)` fixed bottom-right at `--gutter`, `role="status"` `aria-live="polite"`.
- **The tint is the signal.** Arrival is jute wash, alert is india wash, calm is verdigris wash — no
  coloured bar is bolted to the side, and each wash's border is a `color-mix` off its own tray ink.
  Enters on `translateY(8px)` over `0.2s`; the lot number is stencil `700` at `--t-body`, the message
  Archivo `--t-label` in `--ink-soft`, and the action button auto-margins right.

### Motion
Deliberately short and physical. State transitions `0.12s`–`0.16s`; the stamp press `0.3s` with
`cubic-bezier(0.16, 1, 0.3, 1)`; ticket arrival `0.4s ease-out` with per-character `26ms` delays;
drawer `0.22s ease-out` from `translateX(14px)`; toast `0.2s`. The only loop is the 1.1s sync LED
pulse. `prefers-reduced-motion: reduce` collapses every duration to `0.001ms` globally in
`tokens.css`.

## Do's and Don'ts

### Do:
- **Do** press a status change as a filled stamp plate with a text label, and let `.is-stamped` play.
- **Do** commit colour at region scale — a filled plate, a filled count block, the tally strip.
- **Do** keep every rupee figure in integer paise and format it with `en-IN` grouping; keep tabular
  numerals on every money column.
- **Do** separate layers with a hairline rule, `--lift` for paper at rest, or `--lift-up` for paper
  picked up.
- **Do** keep functional text at or above `--micro` (0.6875rem / 11px), and take every other size from
  the ramp (`--t-label` → `--t-figure`) rather than writing one out.
- **Do** draw an icon in CSS from borders, gradients or clip-paths, the way `.chev`, `.icon-mute`,
  `.icon-print` and `.warn-glyph` already are.
- **Do** name a colour that sits on a stamp ink `--on-<that ink>`, and reach for an existing token
  before writing a literal. Where an alpha wash is needed off a tray ink, write
  `color-mix(in oklch, var(--india) 40%, transparent)` so the tray stays the source.
- **Do** keep `--print-ink`, `--print-ground` and `--mask-solid` as device colours when you touch the
  receipt, set the tray's base with `--tray-*-type`, and size every line inside `#receipt` in `em`
  against that base so the receipt scales with the tray.
- **Do** let the stencil stack fall through to Archivo for `₹`; that is the shipped result.
- **Do** set the rupee sign separately from the figure and one step down, in every money run —
  `'<i>₹</i>' + figure`, never `SV.money()` as one text node.
- **Do** write a sentence's numbers with the same predicates as the figures it summarises, and drop a
  clause rather than print a `0`.
- **Do** hide a zero count entirely rather than printing a `0`.
- **Do** pick the density from the status, not from the available space: the full card in NEW, the
  two-line row everywhere past it. Past NEW a ticket is claimed and needs scanning, not reading.
- **Do** keep the lot number and the customer name as the two controls that open the order, at both
  densities. Those are the facts an operator recognises a ticket by.
- **Do** keep a row's action label whole and shrink the button before the name — `.row-bot .btn` runs
  `--micro` so that the name never has to.
- **Do** print a figure once on a surface. If a second region would show it, cut one of them.
- **Do** guard a row's identifiers against the data the connector can actually send: `.row-lot`
  ellipsizes rather than spilling, and a check that only sees `SAM-NNNNN` has not seen the guard.
- **Do** tint the work tray and nothing else; the tint answers "where do I work" and no other question.
- **Do** let the board say what it is in one plain sentence, and update it whenever the board renders.

### Don't:
- **Don't** render status as a bare dot or a faint tint — the filled plate and its word are the system.
- **Don't** add a lighter ink to make something read as muted, and don't reintroduce a fourth step
  below `--ink-faint`. Muted is a `--mark` or `--mark-quiet` when it is a shape, `--ink-faint` when it
  is a word, and there is no third option.
- **Don't** use a second accent. The tray inks each mean one state; India red is money and refusal only.
- **Don't** introduce hex, rgb or hsl alongside the OKLCH source in `tokens.css`.
- **Don't** add a shadow that is not `--lift` or `--lift-up`, and don't add a glow or a blur to a
  resting surface.
- **Don't** put functional text below `--micro`, and don't "fix" the stencil stack's missing rupee by
  removing Archivo from it.
- **Don't** set `₹` inside a numeral run, and don't add a second relative font size where a ramp step
  will do.
- **Don't** treat a passing contrast audit as proof about a state no seeded ticket reaches — render the
  state, then measure it.
- **Don't** change the perforation band's height at one density without changing the other, and don't
  move a tray's hairline to re-tint it. The ink mix is the whole of the tint.
- **Don't** border an interactive control with an alpha rule; `--control-edge` is what clears 3:1.
- **Don't** hand-write an `oklch` next to a tray ink, and don't invent a sixth ink — extend the tray
  instead.
- **Don't** retint `--print-ink`, `--print-ground` or `--mask-solid` toward the screen palette, and
  don't reuse a palette ink as a mask key.
- **Don't** reach for `--radius-shell` outside the mute speaker cone, or for `--radius-pill` outside
  the rail's metal fittings.
- **Don't** put a dotless kanban, a blue accent, a grey card or a soft elevation shadow on this
  surface — that is the category default the world exists to refuse.
- **Don't** make ACCEPTED its own tray or count. It rides in PREPARING under a dashed sub-band so the
  tray count, the tab chip and the lane head cannot disagree.
- **Don't** re-key an order into a bill. The bill inherits its lines; products are never re-entered.
- **Don't** put a third fact on a row. A row's height is fixed by its two lines, so adding one is a
  layout change: decide what comes off before deciding what goes on.
- **Don't** restore a queue count to the tally strip. The tabs and the tray heads already print it, and
  the strip is for the day's arithmetic only.
- **Don't** give a row a "View order" button. The lot number and the name already open the order, and
  the button would cost more room than the name it protects.
- **Don't** truncate the customer name to protect a button, a tag, or a timestamp. Verify row content
  by measuring `scrollWidth` against `clientWidth`; a screenshot will not show it.
- **Don't** let a lot number spill past the ticket onto the tray behind it.