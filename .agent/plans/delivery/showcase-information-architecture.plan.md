---
id: showcase-information-architecture
node_type: delivery
name: "Showcase information architecture — landing, generated reference, routed demos"
overview: >-
  Give the showcase a front door that explains itself, a token-source-
  generated reference route, and demo routes that each state what they
  prove.
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: "2026-08-13"
ratified_where: >-
  Owner card answers, design-lane session d0274e, 2026-08-13: "Ratify
  both now" and default-face "Keep Oak default"; indexed in the thread
  record §OWNER RULINGS 2026-08-13.
serves: design-system-as-configured-framework
impact_areas:
  - design-system
tickets:
  - MCP-592
depends_on: []
owner_gates: []
last_updated: 2026-08-13
---

# Showcase information architecture — landing, generated reference, routed demos

**Default-face gate discharged 2026-08-13.** The owner decided at the
ratification card: the showcase default stays Oak. The owner_gates
entry is removed per the discharge-by-removal shape; the pds-default
proposal that rode §Mechanism is superseded by this decision.

Readiness-review record (findings discharged by ID at slice pickup):
`.agent/reports/design/design-arc-plan-readiness-reviews-2026-08-13.md`.

## Goal

A visitor to the showcase understands within one screen what they are
looking at (owner critique, 2026-08-13, in-session: the current front
page is at once an unexplained landing, a thin specimen sheet, and the
switching demo's host). When this lands: the front page is a landing
that says what the system is and where each demo lives; comprehensive
token documentation exists at its own route, generated from the token
source; and every demo route states what it proves — the strategic
kernel's demos-as-falsifier-suite made legible.

## Mechanism

- The front page becomes a landing: what the system is, what each demo
  proves, doors to the routes. Copy assembled from ratified sources
  (the strategic node, the DDR corpus) — never invented.
- A reference route renders the kit's PUBLIC role vocabulary as API —
  every public role, with resolved values per cell of the identity ×
  theme matrix (three identities × five themes = fifteen cells),
  resolved from RENDERED state (`getComputedStyle`), since identity
  variance lives in the brand CSS packs, not in a token walk. Private
  tier-1 primitives and unlisted internals, if shown at all, sit in a
  visibly separate section marked non-contractual (the kit disclaims
  them).
- The switchboard and white-labelling routes gain self-descriptions;
  the page self-descriptions (masthead, headings, titles) are unified
  so no surface claims two identities. Routes and their
  self-descriptions derive from a single route registry, so a route
  added without a door or description fails closed.
- Default face: Oak, by owner decision (2026-08-13, ratification
  card — the pds-default derivation was presented and declined).

Sequencing: A1/A3 touch routes that exist only on the PR #846 branch
(`identity-switchboard`, `identity-white-labelling`) and follow its
merge; A2 (the reference route) is a new route and starts at
ratification. A1 lands before the recognisability plan's S4 chrome
work — the masthead files are shared, and that ordering is the
declared boundary between the two plans. A2 executes the
design-system-completion plan's W4.4 story pulled forward — one owner
card at ratification confirms the re-homing, with a dated amendment to
the completion plan at his word.

## Acceptance criteria (each with a proof — required)

1. The reference route renders every public role with its resolved
   value in all fifteen identity × theme cells, verified against
   rendered computed style — plus a separate completeness check that
   the rendered set equals the kit's declared public vocabulary.
   Proof: `repo-safe` — the cell-verification and completeness tests
   this plan lands.
2. The landing names the demo routes and each demo route states what
   it demonstrates, driven from the route registry (closure property:
   an unregistered or undescribed route fails). Proof: `repo-safe` —
   e2e cells over the registry.
3. The reference route passes the standing accessibility sweep across
   the cells it renders (a dense token table is a high-risk contrast
   surface). Proof: `repo-safe` — the route joins
   the showcase a11y spec matrix.
4. The front page reads as a landing, not a specimen sheet —
   instrumented first (a design-review rubric row recorded in the
   register), owner sign-off last. Proof: `owner-held` — Jim, in
   Chrome; recorded in the design-lane thread record with date.

## Todos (slices, each a single-story PR, default round budget)

- **A2 generated reference** (unblocked): the reference route with
  cell verification, completeness check, private-tier separation, and
  a11y coverage.
- **A1 landing** (after #846 merges): front page restructure —
  landing composition, doors, unified self-descriptions, route
  registry.
- **A3 demo self-descriptions** (with A1): switchboard and
  white-labelling routes state their falsifier; default face stays
  Oak (owner decision 2026-08-13).

## First-principles check (six clauses, applied at authoring)

1. Shape: proofs assert our routes' rendered behaviour, not framework
   routing.
2. Landing-path: tests join the showcase's existing Playwright estate
   and a11y matrix — inside current include patterns.
3. Vendor-literal / capability-locus: the switchboard routes live on
   the #846 branch until it merges (named above); identity variance
   lives in brand CSS packs, not the token walk — AC1 is
   computed-style for exactly this reason.
4. Optionality: the default-face gate is the one open decision, held
   as a gate with expiry — not embedded optionality.
5. Record-consumer: the route registry's readers are the landing, the
   doors, and AC2's closure test — three consumers from day one.
6. Rules-tier: screened against RULES_INDEX; copy assembly is bound by
   never-invent-public-copy; values rendered, never hand-mirrored
   (design-values-come-from-the-system).

## Out of scope

- New component development and any visual re-truing of identities —
  that is oak-identity-recognisability's lane (masthead ordering named
  in §Mechanism).
- Marketing or public-launch copy — the landing assembles ratified
  descriptions only.
- Navigation or chrome redesign beyond the landing's doors — chrome
  idiom work is the recognisability plan's S4 territory.
- Publishing the kit's private tier as contract — shown, if at all, as
  explicitly non-contractual.
