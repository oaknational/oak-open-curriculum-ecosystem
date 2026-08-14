# Rationale: Year 8 History unit landing page

## What the screen is for

A teacher has landed on this page from a subject/year browse. The one
question the visual-design skill asks — what is this screen for, and what
must the reader do next — resolves to: **confirm this is the right unit,
then get into a lesson.** Everything else (fuller unit context, downloads,
neighbouring units) is real and needed, but secondary to that.

## What I made primary

**The lesson list** carries the most visual weight on the page:

- Largest content heading after the hero (`oak-heading-3`, "Lessons in this
  unit"), positioned immediately below the hero — first thing the eye lands
  on after identity is established.
- Every lesson is a full-width `oak-card` inside `oak-card-link`, which
  gives it the system's signature interactive motif: the accent (lemon)
  offset shadow, hover-widen, press-collapse. That treatment is normally
  reserved for the page's primary interactive set, and I used it *only*
  here — nowhere else on the page gets the accent shadow — so it reads as
  "these are the things to click."
- Each row repeats the same shape (number badge, title, one-line
  description, resource-type chips, chevron) — repetition/similarity lets a
  teacher scan six rows without re-parsing structure each time.

The **hero** is identity, not a second primary: breadcrumb for "am I in the
right place", subject/year/lesson-count tags, one H1, one teaser sentence,
and exactly one primary action (`oak-btn`, "Start with lesson 1" — jumps
straight into the list) plus one visually quieter secondary action
(`oak-btn--secondary`, "Get all resources"). Two full-weight CTAs would have
put two elements in competition for primacy in the same view; only one gets
the primary button treatment.

## What I demoted, and on what grounds

**Unit summary** — same outline rank as the other sections (`<h2>`, so it
stays a proper landmark for heading-navigation users) but a smaller heading
*class* (`oak-heading-5` vs the list's `oak-heading-3`) and positioned
*after* the lesson list rather than before it. Tag and class are
deliberately decoupled here, per the skill: the tag carries document rank,
the class carries visual size — never pick a heading level for how big it
looks. Most teachers who clicked into this unit already know roughly what
it covers; the fuller narrative is for the minority who want it, so it gets
weight and space but not position.

**Downloads** — kept as a fully real, fully functional panel (all four
resource rows, a "download all" action, individual per-item download
buttons with proper `aria-label`s) but given the system's neutral grey card
shadow (`oak-card--grey-shadow`) instead of the accent shadow the lesson
cards use. It's findable — same container width, its own bordered card, a
proper heading — but the quieter shadow keeps it from competing with the
lesson list for the first glance.

**Related units** — the lowest-weight section on the page: smallest heading
(`oak-heading-6`), flat cards with *no* shadow (`oak-card--flat`), and set
inside a quiet neutral tone band (`oak-band` re-pointed to
`--bg-subtle` rather than a decorative pastel) that sits last in the page
and visually reads as "you've reached the edge of this page, here's where
you could go next" rather than a peer of the lesson list.

## Structural choice: a new page-type map, not the shipped one

The design system ships a `[data-page="unit"]` region map (hero, then a
facets/results split, then a full-width detail band). That map is shaped
for a *unit-browsing* page — a facet-filtered list of units. This screen is
a single unit's landing page, so reusing it would have forced an empty or
invented facets sidebar with nothing legitimate to put in it. The
design-system-usage skill explicitly allows minting a new page type when
the shipped one doesn't fit, so the page declares
`data-page="unit-landing"` with its own single-column region map (`hero →
results → content → resources → support`), keeping the same
`.oak-canvas`/`.oak-main`/`[data-region]` contract and DOM-order-is-reading-
order rule, just with a shape that actually matches this content.

## Colour last, on purpose

Per the skill's channel ordering (position, then size, then weight/space,
then colour), hierarchy here is carried by position and shadow-weight, not
hue. The hero's pastel band and the pink subject tag are decorative, not
meaning-bearing; lesson resource types (quiz/worksheet/video) are
icon+text, never colour alone. I rendered and checked the page under dark,
high-contrast and colour-safe themes (via `data-theme`) — the ranking holds
in all four because every colour used resolves through a semantic token
(`--text-*`, `--bg-*`, `--surface-decorative-*`, `--shadow-*`) rather than a
literal value, so re-theming can't collapse the hierarchy the way a
hardcoded hex would.

## Responsive check

Rendered at 1440px (desktop), 820px (tablet), 375px (common mobile) and
320px (the system's stated reflow floor). The two-column "About this unit"
grid collapses to one column under 760px; the hero and downloads button
clusters wrap; the related-units grid auto-fits down to one column. No
horizontal overflow at any width tested.
