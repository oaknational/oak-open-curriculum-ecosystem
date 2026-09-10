---
id: design-system-completion
node_type: delivery
name: "Design-system completion — five demos, identity contract, React tier, the wow bar (v2.2)"
overview: "Complete the Oak Open Curriculum Design System as a layered identity-agnostic framework, proven by five demos at the owner's wow bar: a path-named generated census with per-page dispositions, first light on the plain demo AND an early showcase probe before machinery spend, a schema'd identity/theme contract (orthogonal contrast/colour-vision axes, base-plus-overlay token trees, an emitter with a defined Oak input), the curated React tier on the ADR-213 §3 shape with a packaging story (the hub gaining identity switching through it), the showcase rebuilt inside a design grammar with density as a designed quantity, the layout-range zen demo proving expressive range over layout, and cross-demo theme behaviour stated as resolved-rendering observables."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: design-system-as-configured-framework
impact_areas:
  - design-system
tickets: []
depends_on: []
# depends_on is empty and TRUE: this node's landing change carries dated
# re-homing amendments that make THIS node the owner of the backlog
# workstreams it absorbs (§Relationships), so no standing cross-corpus
# blocking edge exists. The backlog corpus sits outside the conformant
# plans corpus by construction; nothing here waits on work owned there.
# The former ticket-mint gate (its record, conserved): it held ONLY the
# tickets field — substance owner-ratified 2026-08-02 (§Owner rulings).
# Both premises dissolved (embargo lifted 2026-08-06; ticket-existence
# obligation removed by the plan-node schema §2026-08-07 amendment,
# PR #817), so the gate DISCHARGED 2026-08-07 with tickets left [] — a
# visibility ticket remains optional working practice.
owner_gates:
  - awaiting: owner-decision
    clears_when: >-
      At W3.0 open the owner confirms the coverage reading of "full
      optional React component set" — full mapping-decision coverage with
      curated component minting (§Decision log, flagged seat reading).
    expires: 2026-09-07
last_updated: 2026-09-03
---

# Design-system completion — five demos, identity contract, React tier, the wow bar (v2.2)

**v2.2 (dated note, 2026-08-03) — the partition restructure.** Round 3 (31 agents,
`wf_121bcbac-abe`; `findings.v3.json` + `adjudication.v3.md`) returned a DIVERGING
loop verdict (98 → 112 → 113 findings while the plan doubled); the owner ratified
the partition at the card ("Yes, partition the work"): near-horizon stories (W0 +
W1, the wow-first slice) keep full depth, cure the round-3 near-horizon rows, and
alone carry the zero-finding bar (scoped re-review at draft-complete); far-horizon
workstreams (W2–W7) demote to pointer-level stories — goal, gates, dependencies,
acceptance SHAPE — whose mechanism is authored at each story's open under
per-story expert review (PDR-132). Rounds-2/3 far-horizon findings are conserved
as story-open inputs in §Story-open pointer tables, never as plan blockers. Same
sitting, the owner ratified the goal architecture recorded in the strategic
node's §"Kernel additions (owner words, 2026-08-03)": three properties — layer
sovereignty, cost-of-change-is-the-product, expressive range spans structure —
plus six derived goals; the demo census is FIVE (a layout-range zen-garden demo
joins); runtime identity switching is a demonstration owned by showcase + hub
only. Round-3 citations in this body are marked `(r3)` and index the
`findings.v3.json` arrays by the same array-index convention.

**v1 → v2 → v2.1 (dated note, 2026-08-02).** v1 (authored at the Director seat,
`6f3221e1e`) failed its tiered 31-agent review (98 findings, 23 blocking;
`adjudication.md`). v2 (this seat) cured the v1 corpus and failed round 2
(`wf_368f0694-4a8`: 112 rows — 4 landscape survivors, 20 dropped-at-cap, 78 expert,
10 frame; `adjudication.v2.md`). v2.1 amends in place under the same id (never
ratified — born-sketch). Every round-2 row carries a recorded disposition in
`.agent/reports/design/plan-review-2026-08-02/dispositions.v2.1.md`; round-1
dispositions are `dispositions.v2.md` with a dated corrections appendix.
**Citation legend**: bare ids in this body — `E##`/`F#`/`D#`/`X##` (round 1) and
`L#`/`D#`/`EX#`/`FR#` (round 2) — index the arrays of
`.agent/reports/design/plan-review-2026-08-02/findings.v1.json` and
`findings.v2.json` respectively, per the array-index convention stated in each
ledger's preamble; round-2 ids are used unless marked. Ids are provenance — every
substantive statement is carried in this body. Authored by the executing seat
(Corsair hunts Surf, 4d3282) per PDR-117.

## Direction (owner words, 2026-08-02, verbatim substance — carried unchanged)

1. Write a proper plan. 2. Stabilise what we have. 3. Enumerate and implement what we
are missing. 4. Demonstrate each and every feature in the design showcase app,
including all pages from the design system export, removing the current showcase page
(owner verdict: "visually I would reject it out of hand as incompetent"). 5. The
curriculum hub is NOT plain HTML/CSS (verified first-hand: Next.js 16 / React 19 /
Tailwind v4 since origin); owner ruling at the card: the hub STAYS as-is and the plain
path lives elsewhere. 6. The showcase app showcases React and Tailwind with our
system. 7. Oak-specific parts stay as thin as possible — ideally config passed to a
general framework. 8. The showcase retains the three identities at all times: Oak,
EMC², Freedonia DSE. 9. Freedonia has more off-horizontal elements; Oak has none. [Dated
supersession, 2026-08-03 tilt card (recorded at re-review round 2, finding 5):
the delivered values reverse this attribution — PDS (this identity, renamed)
structural zero; EMC² leans in. The off-horizontal elements belong to the
EMC²/creature identity, repo-verified at W0.4's tilt-attribution record.]
10. #709 disposition is §PR-709 below. 11. A new design seat executes (Corsair hunts
Surf, 4d3282). Amendment (same day): "we need a third demo and fourth demo, one for
plain html and css, one for React and nextjs and styled components, all with working
theme detection and selection." The bar, strengthened: "I want to look at each and
every demo and think 'wow, that looks _amazing_'."

**2026-08-03 addition (owner words, ratified at the card):** the goal
architecture governing this restructure lives in the strategic node's §"Kernel
additions (owner words, 2026-08-03)" — layer sovereignty (each layer optional and
complete, down to a zero-runtime static consumer with full identity fidelity);
cost-of-change-is-the-product (near-zero marginal cost of design change is the
core feature; switching merely demonstrates it; his value-frame verbatim, same
day: "enabling rapid innovation without compromising quality or stability" —
both arms bind in every trade); expressive range spans structure
(the zen-garden property; the fifth demo proves it). Demo roles, his words: the
showcase is "the primary demo"; the hub is "the first instance of a Claude Design
app ingested and reconstructed with our tools" and gains identity switching;
plain + styled are small proof demos; the fifth is "the css zen garden like demo".

**Post-v1 owner rulings (2026-08-02):** iteration is LOCAL — Claude Design rounds
only at owner-instigated moments, no two-way-sync investment; wow-first
decomposition — early rendered pages with machinery underneath, never workstreams of
plumbing before pixels; design authorship for the counter-identities is first-class
work. **Taste calibration (thread record ~20:50Z):** REJECTED — bare specimen grids,
native form-control switchboards, monochrome first paint. CALLED GOOD — the export's
own composed pages (the Identity Switchboard switching a real lesson-page specimen,
proper toggle-button controls). The export's visual language is the demonstrated
taste anchor.

## Owner rulings and gate provenance

Narrative moved out of frontmatter per the delivery contract (EX63); gate numbers
below track the CURRENT frontmatter array (dated renumber 2026-08-05: the former
gate 2 — the W2.7 off-horizontal session gate — DISCHARGED 2026-08-05, its values
owner-delivered at the 2026-08-03 card. The discharge's records, at their real
homes (trued at re-review round 2, finding 5): the delivered VALUES live at W2.7
with their provenance chain (the 2026-08-03 card answer, committed napkin
`b1b5431a7`); the CORRECTED ATTRIBUTION record is W0.4's tilt-attribution census
line (creature carries the rotations; the PDS-to-be identity is orthogonal —
repo-verified); and §Direction point 9's original attribution carries
its dated supersession note in place. Dated renumber
2026-08-07: the former gate 1 — the ticket-mint gate — DISCHARGED 2026-08-07; it
held ONLY the tickets field and never gated ratification (the v1 conflation,
round-1 E63/X4); its premises dissolved when the Linear embargo lifted
2026-08-06 and the plan-node schema §2026-08-07 amendment, PR #817, removed the
ticket-existence obligation — ticket minting is optional working practice, and
the stamp still completes when a fleet round closes clean and the owner's
implementation word arrives). Dated renumber 2026-09-03: the former gate 1 —
item 14 — DISCHARGED 2026-09-03 at the owner's card word ("strict everywhere,
all the time, and long-term architectural excellence, run it through the
decision matrix via the principles.md file and the cognitive skills"); its
grounds were round-1 E11/E31/E32, and the ruling with its delivery slice is
recorded at W0.2(b) and in §Decision log. Gate 1 (the W3.0 coverage card): the
seat reading it confirms is FR9's — a mapping DECISION per class (including
no-construct) satisfies "full set" via curated minting; the row is flagged in
§Decision log until his word.

## Goal · In · Out

**Goal**: the design system completed as a configured framework (the strategic
parent's kernel plus its 2026-08-03 Kernel additions), proven by five demos at the
wow bar with structural quality gates — every demo proving a named property of the
kernel (hub: a Claude Design app ingested and reconstructed with our tools, gaining
identity switching; showcase: the primary demo, the switching demonstration; plain:
layer sovereignty at the lowest layer; styled-components: layer breadth across
styling regimes; the zen demo: expressive range over layout) — and the owner's
first wow verdicts (plain demo AND a showcase probe) arriving before any
identity-machinery or React-tier spend.

**In scope**: the kit and token packages under `packages/design/` plus the new
identity-configuration workspace (W2.0); `oak-design-react`; the five demo apps
under `demos/` (hub, showcase, plain, styled-components, and the layout-range zen
demo — two exist, three are created here); the Demos Charter ADR; the identity/theme contract, emitter, and gates; the
token-reference page; the export-tweaks intake; the #709 closure acts; the dated ADR
amendments and backlog-plan re-homing amendments this node's work obligates
(§Relationships); the named consumer-census rows outside `demos/`/`packages/design/`
(today: the MCP-app visual-test theme list, which joins the W2.3 roster derivation).

**Out of scope (recorded deferrals — take-or-defer at owner word, never silent)**:
Stage B token-source convergence and the dual-gate window's closure (owned by
`design-system-integration` `ws-stage-b-convergence`; this plan's demos consume ONLY
the kit's own CSS surface for the window's duration — round-1 E1/E70); css-modules
consumption (dropped by the four-demo amendment); RTL/logical-properties
internationalisation; data-visualisation palettes; terminal (`oak-design-ink`)
and deck target upgrades beyond keeping existing behaviour green — print TARGET
upgrades likewise stay out, while per-identity PRINT PROJECTIONS entered scope
as W2.11 at the confirmed W0.5 ledger (item 7; dated boundary move 2026-08-08);
the MCP-app
hydration/theme-control DELIVERY tail that ADR-217 §1's 2026-07-31 amendment assigns
to MCP-448 (never absorbed here — EX65); Linear ticket true-ups before the
2026-08-10 embargo end; runtime identity switching outside the showcase and the
hub (owner word 2026-08-03, resolving the D3/X14 decision point: switching is the
demonstration, owned by the first two demos — the showcase and the hub; the plain,
styled, and zen demos are single-identity at build time, keeping theme
detection/selection per the four-demo amendment — the kit-owned identity runtime
(W3.3) makes any later extension a per-demo wiring story of order days).

## First-principles check (plan-body rule, clauses 4–6)

- No decided-state herein contradicts standing owner word: every §Decision log row
  carries provenance and date; the lost hub agreement is consciously superseded at
  his card answer and recorded in the charter ADR's provenance. Where earlier rounds
  asserted repository states first-hand reads falsify, this text carries the
  verified state.
- Landing path: plan nodes land under the plans conformance
  validator; demo workspaces land under the `demos/` tier rules (strict TS, shared
  ESLint, TDD, WCAG 2.2 AA) with the W1.1/W5.1 plumbing stories carrying the
  workspace-registration contract.
- Vendor and repository literals verified at authoring (2026-08-02, this seat):
  `oak-theme.js` five-name union and `choice()` (kit `src/oak-theme.ts:31`),
  `light-dark()` role composition, zero `@layer` in the kit's CSS files, zero
  `var(--oak-` references in `components.css`, the live `studio-source/` page count
  (79 — dated evidence only; the W0.1 census artefact is the authority — EX55), the
  tier package's single-entry bundle shape, ci.yml's `test:a11y` leg, Next 16 /
  React 19 (hub `package.json`); `styled-components` v6 + the App Router style
  registry re-verified against current upstream docs at W5 story open
  (read-nextjs-docs-before-coding).
- Record-consumer clause: the census artefacts are read by the W4.5 matrix gate and
  the coverage reviews; the disposition ledgers are read by the re-review fleet; the
  charter ADR is read by demo READMEs and every demo story's DoD; the wow-verdict
  register (the register W0.7 mints — EX53) is read at every checkpoint, while the
  landed hub fidelity register keeps its own hub-scoped consumers. No write-only
  records.
- Describing-surface convention (EX40): each workstream preamble names the
  workstream's describing surface; each story tags its test boundary against it, and
  a story whose boundary differs says so inline. A story with no taggable boundary
  is scaffolding and says that too. Owner-held-only stories are exempt — the
  acceptance typing discharges the clause. Far-horizon pointer stories (W2–W7,
  the 2026-08-03 partition) tag at story open when their mechanism is authored —
  acceptance-shape rows carry no tag (both clauses stated at re-review round 2,
  finding 3's class sweep).

## Workstreams

Sequencing (FR0/FR8): W0 → W1 (first light: the plain demo AND the early showcase
probe) → W2 and W3 in parallel lanes (W2.10's gate lands atomically with W3.1's
first family — EX46) → W4 page landings continue beneath approved pixels → W5 →
W7 → W6 (§Sequencing is the fuller statement; W7 may run any time after first
light). W1 needs the named W0 stories (W0.1 census, W0.2(a)/(b) stabilise, W0.3
charter, W0.5 enumeration sitting — before W1.2's page selection per FR5, W0.7
instrument v0, W0.8 re-homes, W0.9 hub pre-read, and W0.10's sittings for the
W1.5 counter-identity variants); the plain demo consumes the kit directly
(`oak-theme.js` is framework-neutral). W4.4 alone blocks on W2.2's emitted
projections (D2). Every story is sliced to single-story PRs on the PDR-132
two-round budget.

### W0 — Ground truth, stabilise, instruments, charter

Describing surface: per instrument — pure-classifier unit tests over INJECTED
file lists plus thin red-proven walker scripts wired into `pnpm check` (EX45
r3 trues the boundary; the `css-literal-values` / `validate-authored-css`
split stands), and the new hub Playwright/axe suites under the charter
DoD's both-arrays contract (re-review round 2, finding 2). Groundwork machinery
here (instruments, validators, harness re-homing) is W0's charge and does not
offend the wow-first ruling, which governs authored-scope machinery — token
systems, component libraries, design grammars (D4 r3); the first-pixels gate
is split accordingly (§Sequencing, FR4 r3).

- **W0.1 Page + feature census, generated and dispositioned.** Census domain
  named BY PATH (EX55 r2): `packages/design/oak-design-system/studio-source/`,
  excluding `original-capture-2026-07-23/` and
  `iteration-pull-preservation-2026-07-23/` — the preservation trees are
  historical records, never the requirement's domain. The CLASS census domain
  is named the same way (EX22 r3): ALL kit-published stylesheets
  (`components.css`, `colors_and_type.css`, `oak-icons.css`, `print.css`,
  `styles.css`), with print/deck classes taking an explicit
  `owner-accepted-exclusion` disposition rather than being invisible, and the
  expected class count stated in the parity line so a shrinking domain is
  visible. Two committed, dated artefacts derived mechanically: (a) the **page
  census** — every page artefact enumerated by filesystem walk at a dated
  commit, each row dispositioned and recording the page's FRAMING-PROSE
  state (the W0.5 item-10 owner-voice class reads this column at rebuild);
  PAGE-row vocabulary is RESTRICTED (FR3 r3):
  `express-composed` or `owner-accepted-exclusion` at census time — a page
  folding or demoting to reference is HIS call, batched into one owner card at
  W1.4's page-set finalisation, never a seat disposition; (b) the **feature
  census** — token roots, component classes, themes + motion axis, composition
  tokens, print/deck/worksheet targets, icons, fonts, `oak-theme.js`
  behaviours. Output includes the **gap census** with the `$type` completeness
  row SPLIT (EX5 r3): leaves whose type is inferable by alias or group
  inheritance gate at 100%; leaves whose value has no DTCG type carry an
  explicit recorded disposition (`$extensions` vendor annotation or a named
  exclusion list with a pinned count as the drift net) — W4.4's type-coverage
  check scopes to the first class; plus the kit's 7 hardcoded rotation
  instances (EX12 r2, dispositioned against the W2.7 boundary). Mechanism
  split TRUED (EX45 r3): the pure classifier takes an injected FILE LIST
  (paths + contents), so the bidirectional planted-fixture cases (EX43 r2 — a
  planted class/page/token-root MUST appear; declared-but-absent must fail)
  are literal-input unit tests; the walker stays `readdirSync` + hand-off
  guarded by the non-vacuity leg; the method-independent parity counts (export
  page-file count; distinct `.oak-` class count; token-root count) are
  walker-level acceptance lines, never tests. The showcase `sitemap.xml` is
  a third mechanical derivation from the page census (W0.5 instrument,
  owner word: "a comprehensive sitemap.xml"), with the axe/Lighthouse page
  lists DERIVED from the sitemap and a parity line of the same
  method-independent class. Acceptance (`repo-safe`:
  classifier tests + walker in `pnpm check` + committed artefacts + the parity
  lines incl. the sitemap derivation's; drift-guarded by W6.4): both
  artefacts committed with zero undispositioned rows.
- **W0.2 Stabilise.** (a) Verify every existing design gate FIRST-HAND,
  committing a dated baseline snapshot of gate states at W0 start (D12); red
  gates are named with linked fix PRs and fixed before anything else, each fix
  carrying a reproducing test at the defective scale in the same commit,
  generalised to the defect class (EX47 r2). (b) KNOWN-ISSUES triage:
  accessibility-class entries have exactly ONE disposition — fix (ADR-147
  zero-tolerance); others fix / accept-with-record / defer. The
  dark-link-on-lemon pairing (4.48:1) gets a SCOPED ROLE TOKEN as its default
  cure (EX4 r3; declaration shape Director-resolved 2026-08-05 at the
  re-review): a `text.link-on-decorative-5` role authored in both polarity
  arms, DECLARED at top-level `:root` (the site the landed dtcg↔CSS
  consistency gate's comparand reads) with band-scoped APPLICATION — the
  band rule consumes `var(--text-link-on-decorative-5)`, so the scope lives
  in the application, never the declaration. THAT token joins
  `dtcg/contrast-pairings.json` with TWO deliberate re-baselines in the
  expectations module, per its own no-silent-bumps header: the manifest
  pair count 42 → 43 AND the comparand size 167 → 168 (a typed colour leaf
  joins every composed theme's comparand). The recorded fallback stays: the
  manifest gains a scope field, decided at authoring — never the global
  `text.link` re-point the manifest cannot scope. Item 14 RULED 2026-09-03
  (owner card word, "strict everywhere, all the time, and long-term
  architectural excellence, run it through the decision matrix via the
  principles.md file and the cognitive skills"; lens-resolved the same day at
  the design-system-expert pass): the stated default on expiry (EX40/D16 r3 —
  subtree HC/colour-safe surfaces on `--surface-decorative-N` roles directly,
  the ruling upgrading the surface later) is REFUSED, not renewed. Item 14 was
  never an alias-breadth choice; it is a missing ENFORCEMENT of the invariant
  the design system already ruled (`packages/design/oak-design-system/DECISIONS.md`,
  2026-07-26: a custom property that composes other custom properties is
  re-declared wherever its inputs are overridden — overriding an input alone
  never reaches it). The should-be: closure is a CHECKED property of the token
  surface — for every theme scope, the set of root-declared properties that
  transitively reference an overridden property and are not re-declared in
  that scope is EMPTY, checked emit-or-fail over whatever theme blocks exist
  (taken against the POST-axis block set, EX13 r3, as the check's input).
  Delivery slice, this story, BLOCKING before any high-contrast or colour-safe
  subtree renders: (i) the closure check joins the existing design gate suite;
  (ii) the re-declarations the check demands — at the ruling's reading, 35
  root properties freeze inside the high-contrast subtree (ten canonical
  roles, among them `--bg-selected`, `--border-accent`, `--state-selected` and
  the accent and neutral shadow set) and 13 inside colour-safe; a shipped
  component paints a selected quiz answer from the frozen `--bg-selected`, and
  `--surface-red-subtle` freezing over the overridden `--bg-error-subtle` in
  colour-safe is accessibility-class, so its ONE disposition is FIX; the two
  hand re-declarations already in `colors_and_type.css` (their comments name
  the mechanism) are subsumed by the check; the enumerated frozen sets, the
  evidence anchors and the check's mechanism are recorded in
  `.agent/reports/design/item-14-closure-residue-2026-09-03.md`. New dated triage entry (W0.5 sitting item 6,
  owner-confirmed 2026-08-06): the creature (EMC²) whitelabel page does not
  honour reduced motion — accessibility-class, so its ONE disposition is
  FIX, BLOCKING wherever that page renders; the cured pair must be
  genuinely distinct (his words: the reduced arm still travels on hover,
  and the full arm "needs more motion in order for that to be visible").
  Describing-surface tag (EX40, added at re-review
  round 2): this story's boundary differs from the preamble's — it is the
  EXISTING design gate suites plus the committed dated baseline snapshot.
  Acceptance (`repo-safe`: the named suites green with
  the baseline snapshot and defect tests in the PR). The `prefers-contrast`
  route is NOT here — it is new product behaviour and lives in W2.4 (FR8 r2).
- **W0.3 The Demos Charter as doctrine.** The charter lands as its OWN new ADR
  (PDR-019 shape, citing ADR-213 for what ADR-213 says; ADR-213 takes a
  one-line pointer amendment — EX60 r2), and it carries DECISIONS, never
  mechanism (EX58 r3): the assignment table with provenance — **five demos**
  (2026-08-03 owner roles): hub = the first instance of a Claude Design app
  ingested and reconstructed with our tools, Tailwind-mapped, as-is
  architecture, gains identity switching (W3.5); showcase = the PRIMARY demo,
  React + Tailwind, the switching demonstration; plain = small proof demo,
  plain HTML + CSS; styled = small proof demo, React/Next/styled-components;
  layout-range = the css-zen-garden-like demo (W7) — plus the **as-is scope
  rule** (EX32 r2: architecture and consumption path only, never
  accessibility defects), the **three-identities reading** (all three
  reachable at all times from the showcase's identity control; simultaneous
  multi-identity surfaces fire the item-14 ruling first), the **DoD-is-a-floor
  stance**, and the **composition envelope BY REFERENCE** (EX55 r3): the
  envelope's substance lands as a dated addition to
  `docs/governance/one-html-many-css-compositions.md` (the concept's canonical
  home) — per-variant DECLARED reading sequences, and the admissibility rule
  (EX28 r3): a variant is admissible only if its declared sequence is
  satisfied by DOM ORDER ALONE; `reading-flow` rides as genuine progressive
  enhancement and the BINDING focus-order gate cell runs with `reading-flow`
  inert — with the charter citing that home, and an ADR-213 §3 dated
  amendment recording the region contract's first named binding moving to the
  demos tier (the clause's own "owner fork if that binding should differ" is
  carded). The demos-tier a11y DoD (in the tier's DoD docs, referenced by the
  ADR): pointers to ADR-147 + `docs/governance/accessibility-practice.md`
  plus the tier's additions — SC 2.4.11 with a concrete cell, SC 2.4.3/1.3.2,
  SC 1.4.13, SC 2.5.7, "state is never colour alone" as a checked criterion,
  the kit's stricter 44px floor referenced from the kit's own contract; a
  **shipped-page axis statement** (EX31 r3; the W0.5 "every page in every
  theme ... as a minimum" instrument, owner-confirmed): axe runs over each
  demo's COMPOSED pages across identity × the FULL palette-theme roster
  with the pinned cell count — the page list DERIVED from the
  census-generated sitemap where the demo carries one (method-independent
  parity; W0.1) — and every cell's assertion reads BOTH result arrays —
  `violations` empty AND `incomplete` first-hand-cleared via a
  CLEARED_INCOMPLETE allowlist keyed by rule and target (the landed
  MCP-app `landing-page.spec.ts` discipline: swallowed incompletes read as
  green while carrying unreviewed potential violations, on a kit with a
  recorded 4.48:1 near-miss) — the W2.5 specimen carrier is an additional
  state-coverage leg, never the substitute; the non-axe instrument cells
  (EX32 r3): SC 1.4.11 focus-indicator contrast, SC 1.4.10 reflow at 320px,
  SC 1.4.12 text spacing, each naming its instrument from W0.8's hoist; the
  **control pattern clause** (EX34 r3): every theme or identity control in
  ANY demo follows the ARIA APG — group semantics and accessible name,
  single-select state exposure, a named keyboard model, and a rendered cell
  asserting name/role/value plus a non-colour selected indicator; the
  demos-tier TEST-NAMING convention including the browser-suite
  suffix/directory, with `--passWithNoTests=false` on every new workspace's
  test script AND a named vitest-visible unit test landing WITH the
  workspace so green-from-cold is reachable at every landed state (EX52 r3;
  paired at re-review round 2, finding 7) — the browser-suite class this
  convention names is defined into `.agent/directives/testing-strategy.md`
  by the dated
  amendment this story's ADR obligation carries (§Relationships; re-review
  round 2, finding 8); and a named manual-review pass (the W0.7 legs) for
  what automation cannot reach. The correction set is DERIVED MECHANICALLY
  (grep for the superseded description — EX68 r3) and SPLIT by artefact kind
  (EX60 r3): the ADR + `demos/README.md`'s §Charter as pointer-plus-links
  ONLY (no row restatement; the same edit reconciles the README's "root gate
  configs are authoritative" sentence and trues the productionisation
  ownership sentence — EX59 r3) land at W0.3; each workspace's own README and
  `package.json` description ride that workspace's landing PR (W1.1, W4.2,
  W5.1), where they describe something true. `packages/design/README.md`
  gains its two missing workspaces. The ADR INDEX entry is an acceptance line
  (EX61 r3). Charter sequencing: the ADR merges before W1.1 opens (D1 r2).
  Describing-surface tag (EX40, added at re-review round 2): doctrine
  artefacts — scaffolding-class per the convention, said here.
  Acceptance (`repo-safe`: `check:docs` + the estate validator; the ADR PR
  diff; the index entry; the governance-doc addition; the dated
  `.agent/directives/testing-strategy.md` amendment diff): ADR landed, pointer
  edits in place, citations resolve.
- **W0.4 Identity census.** What differentiates the three identities today —
  brand.css contents, the non-`:root` rule inventory per identity (verified:
  the PDS-to-be identity 5 of 6 blocks non-root; creature — the kit's
  register name for the EMC² identity, `whitelabel/creature/`, "Educate My
  Creature Too"; bound here at re-review round 2, finding 9 — 11 of 12 incl.
  component-state and HC blocks), CDN asset dependencies, and the tilt
  attribution — the former gate 2's CORRECTED ATTRIBUTION RECORD (re-review
  round 2, finding 5): creature carries the rotations; the PDS-to-be
  identity is orthogonal today. W2's named input (L2 r2). Describing-surface tag (EX40): this
  story's boundary DIFFERS from the W0 preamble's — its describing surface
  is the committed census artefact's parity and acceptance lines, never a
  test that re-reads the artefact's contents (that shape is the audit-a-
  record class the convention exists to bar). Acceptance (`repo-safe`,
  explicit per D8
  r3): the committed census artefact contains all four named content classes
  per identity with verified counts, parity-checked against W0.1's scope.
- **W0.5 Export-tweaks intake.** The owner's tweak list channel is OPEN and
  starts with an ENUMERATION SITTING (FR5 r3): the owner lists the tweaks he
  already knows ONCE, each entry dated with his blocking/non-blocking word —
  sequenced BEFORE W1.2's page selection, so first light never renders pages
  he already wants changed; blocking tweaks touching the three chosen pages
  land in the W1.2 authoring itself. Thereafter the intake surface is
  CONCRETE (D4 r2): entries land in the design-sync NOTES surface beside the
  wow-verdict register, one entry per tweak with his word recorded at
  arrival; the executing seat reads the intake at each workstream open; a
  wow-checkpoint failure on a fidelity-clean page AUTO-PROMOTES the
  corresponding design change per §Quality bar rule 4 (batched, D1 r3).
  Iteration is LOCAL. THE SITTING IS HELD AND ITS LEDGER CONFIRMED (dated
  fold, 2026-08-08, the a729c466 combined window): held 2026-08-05 at the
  owner's export sitting; confirmed one-pass AS PROPOSED 2026-08-06 (comms
  event `0d5afca6`; the pre-registered sitting record rides PR #784).
  Numbering is the owner's — his message has no item 5. The ten items, each
  with his confirmed word and its carrier: (1) asset-closure class —
  BLOCKING for first light; manifest-guarded closure at W1.1's kit-copy
  parity rows (the export's sibling-layout failure class,
  `validate-kit-assets` precedent, W0.8(b)). (2) Oak no-messy-arrangements
  — BLOCKING on any Oak-identity first-light page; the Oak taste-anchor
  rule (ordered, calm, no overlap/collage — his verbatim ground: "Oak
  design is to maximise readability for everyone, including those with
  non-typical neurological makeup, so it would never use messy
  arrangements like this"; stated at W0.10's anchor definition) + the W0.7
  rubric's ordered-calm readability criterion. (3) content-provenance manifest — BLOCKING, safety
  class: every persona, institution, testimonial, statistic, and product
  name in the export/rebuild verified-real-and-appropriate or
  verified-fictional (the export instances cure at occurrence; the manifest
  gates the rebuild at W1.2's first-light pages and W4.2's landings),
  carrying an identity-values column for the W2.9 reference protocol. (4)
  EMC² tilt systematic-consistency — NON-BLOCKING; the W2.7 constraint row
  (W2.9 inherits it via its W2.7 dependency).
  (6) motion — per-identity MOTION STANCES owner-delivered (Oak: none; PDS:
  none; EMC² the motion identity, full/reduced genuinely distinct), riding
  W2.7 beside the tilt values; the creature reduced-motion DEFECT is
  BLOCKING wherever that page renders (W0.2(b) triage entry); the EMC²
  motion-pair demo is NON-BLOCKING new scope (honest preference adaptation;
  W1.4 page-set candidate). (7) worksheet contrast — the instance BLOCKING
  via the W2.5 matrix (a matrix that misses it is wrong); per-identity
  print projections NON-BLOCKING as the W2.11 named story. (8)
  discoverability — the example slides and worksheet become first-class
  navigation entries: NON-BLOCKING for the W1.5 probe, BLOCKING at W1.4's
  page-set finalisation. (9) editable slides — NON-BLOCKING
  post-first-light story, W4.8 (localStorage-only). (10) White-Labelling
  footer copy — BLOCKING on the pages it appears on; owner draft wording
  recorded: "our design system can support multiple identities, theme
  preferences and accessibility needs"; the class: every export page's
  framing prose gets an owner-voice pass at rebuild, the W0.1 census
  recording each page's prose state. The three INSTRUMENTS (owner words,
  same sitting): the showcase `sitemap.xml` GENERATED from the W0.1 page
  census with the axe/Lighthouse page lists DERIVED from it
  (method-independent parity); every page × every theme axe-checked in
  Playwright AS A MINIMUM (the W0.3 axis statement; the non-axe legs stay
  named beside it); Lighthouse as CI PERFORMANCE BUDGETS per page — a
  genuine plan addition (cross-demo acceptance; wiring rides the W1.1
  plumbing contract). Acceptance (`owner-held`: the enumeration sitting held
  and recorded — DISCHARGED as above; the intake surface confirmed at the
  W1.3 checkpoint).
- **W0.6 Hub browser proof surface.** The hub's real cross-demo delta
  (verified first-hand: pre-paint `oak-theme.js` inline + store-backed
  five-theme and motion selection EXIST; no `test:ui`/`test:a11y` scripts
  exist): land Playwright + axe describing the EXISTING behaviour, wired as
  `test:ui`/`test:a11y`, with a recorded MUTATION PROOF per assertion group.
  Every axe cell in these suites runs under the charter DoD's BOTH-ARRAYS
  contract — `violations` empty AND `incomplete` first-hand-cleared via a
  CLEARED_INCOMPLETE allowlist keyed by rule and target (re-review round 2,
  finding 2: browser axe lands results in `incomplete` at
  unresolvable-background nodes — the in-estate proof is the MCP-app
  landing-page case — so a violations-only browser suite is blind exactly
  where the jsdom disable's compensating note applied). SLICED
  ROUTE-BY-ROUTE (EX30 r3): each PR lands one route's cells TOGETHER
  with the fixes that make them green (ADR-147 zero-tolerance; never
  `skipRules`; no red gate ever exists), the remediation set
  discovery-bounded and sequenced before the W6.2 hub checkpoint at the
  latest. The hub's EXISTING jsdom axe backstop is named, and retirement of
  its `color-contrast` rule disable is an acceptance line of the
  browser-suite landing (EX39 r3; ground TRUED at re-review round 2:
  browser axe measures what the disable compensated for ONLY under the
  both-arrays contract — at unresolvable-background nodes its results land
  in `incomplete`, not `violations`); the retirement's semantics are
  stated: the disable and its documented compensating reviewer-recompute
  note retire TOGETHER, the BOTH-ARRAYS browser suite is named as the
  replacing instrument, and the jsdom suite's enumerated component STATES
  are either covered by browser-suite cells or their residual is recorded
  — never a re-enable of `color-contrast` under a DOM-emulation runner,
  where axe's results land in `incomplete` and an assertion on violations
  alone is unfalsifiable; the same principle binds the browser suite
  itself at unresolvable-background nodes, which is why the both-arrays
  contract is the retirement's precondition. This story also carries the ADR-147 §Tooling / ADR-121
  stale-CI TRUING (EX66 r3 — moved from W2.5: state the landed CI position
  as an outcome, delete the plan-item pointers), since it is the first story
  that lands new CI-run a11y suites. The hub's 548 arbitrary-value
  occurrences are recorded as an accessibility RISK (untokenised colour is
  ungated colour), not only token debt. Acceptance (`repo-safe`: the suites
  green in CI at the ci.yml `test:a11y` leg, route-sliced with fixes;
  every axe cell reading both arrays with its CLEARED_INCOMPLETE allowlist
  committed; the mutation proofs; the disable retired; the truing diffs).
- **W0.7 The design-review instrument, v0** (FR8 r2: manual, off the critical
  path's engineering). A COMMITTED RUBRIC document with explicit criteria
  derived from the export's own design language (type scale usage, spatial
  rhythm, hierarchy, colour discipline, composition grammar, a CROSS-PAGE
  COHESION clause, and the ORDERED-CALM READABILITY criterion — the owner's
  no-messy-arrangements rule, W0.5 item 2: readability for everyone
  including those with non-typical neurological makeup; no
  overlapping/collaged arrangements on Oak), applied at every checkpoint by
  THREE legs before any
  render reaches the owner: the seat's own pass, the paired
  accessibility-expert leg, and an INDEPENDENT fresh-context
  design-system-expert leg (FR1 r3 — opus, per invoke-design-system-expert;
  never the authoring seat) judging against the rubric AND free-form; an
  explicit fail state blocks a render from reaching the owner, and every
  leg's verdicts join the recorded miss-rate against the owner's actual
  verdicts so the instrument's blocking authority is EARNED. Calibration is
  GRADED with its fixture corpus ENUMERATED in the acceptance (D6 r3): the
  export's composed pages must-pass; the rejected showcase page AND
  deliberately degraded export-page variants (spacing, hierarchy,
  colour-discipline mutations) must-fail; a third page outside the
  calibration set proves novel-deviation catch. Recalibration re-runs at each
  workstream open and on EVERY rubric revision (EX54 r2: the record names the
  revision it calibrated); the rubric gains PER-IDENTITY language sections at
  the W0.10 taste-anchor sittings (FR0 r3). This story also MINTS the
  **wow-verdict register** — named distinctly from the landed hub fidelity
  register (EX53 r3), schema-validated on the landed `fidelity-register.ts`
  precedent — with a stated row schema: page, demo, verdict
  (PASS/FAIL/ITERATE), the qualities judged, the CELLS COVERED (identity ×
  theme — FR2 r3), owner-statement date, and the INSTRUMENT-LEG RESULTS —
  the three W0.7 legs' verdicts against the rubric, REQUIRED at
  checkpoint-class rows (W1.3, W1.5, W2.9, the §Quality bar checkpoints)
  and optional at the W0.9/W0.10 pre-reads, which run before this
  instrument exists (re-review round 2, finding 6: the earned-authority
  miss-rate needs every leg's verdicts recorded, and this field is their
  named per-row home). An instrument FAIL that blocks a
  render routes to the Director in the Quality-bar rule-3 shape (findings,
  screenshot, blocker assessment) for a named disposition — the instrument's
  false-positive rate is unmeasured at v0, and wow-first sequencing must not
  wait silently on an unearned block. Mechanisation of the rubric is a
  later, separately sliced story — never W1's dependency. Describing-surface
  tag (EX40): this story's outputs are committed records (rubric,
  calibration record, register schema) — scaffolding-class per the
  convention, said here; the register's behavioural consumers are the
  checkpoints that read it. Acceptance
  (`repo-safe`: rubric + graded calibration record with the enumerated
  fixture corpus + the schema-validated register committed).
- **W0.8 Shared instruments re-homed** (EX69/EX70/EX72/EX37 r2; SPLIT per
  EX69 r3). Clauses (a)/(b) — path-invoked node validators — home beside
  `validate-boundaries` (`packages/core/oak-eslint/scripts/`; the design-tier
  arm stays dropped): (a) the authored-CSS literal walker + non-vacuity leg,
  roster derived from the workspace inventory, PLUS its HTML ARM (EX49 r3:
  `.html` `<style>` blocks and `style=` attributes parsed through the same
  pure `findLiteralDesignValues` classifier, red-proven on a planted hex in a
  fixture page, and carrying its OWN non-vacuity leg — a per-demo page
  roster whose zero-page scan fails loud; the landed walker's single
  CSS-file guard cannot see an HTML arm scanning nothing) — the IDENTITY leg is migration-state-scoped (EX70 r3): it
  covers the W2.0 home's identity layers only and joins per identity at that
  identity's W2.2 migration landing, where its acceptance lives; the hub's
  authored CSS is OUT under the as-is ruling (stated, not implied); (b)
  `validate-kit-assets`/`kit-asset-parity`, roster derived from the workspace
  inventory (EX70 r2). Clause (c) — the shared demos test harness (origin
  gate, hermetic cross-origin interception, apply-state) — gets its OWN HOME
  (EX69 r3): a design-tier test-support workspace whose ADR-041 row permits
  `design` outbound, with a real `exports` entry and its own
  `@playwright/test`/`@axe-core/playwright` deps; the hoisted axe helper
  UPGRADES at the hoist to the both-arrays contract (violations empty AND
  incomplete first-hand-cleared via CLEARED_INCOMPLETE, per the W0.3 DoD —
  the landed showcase helper reads violations only, and hoisting that shape
  would propagate the swallowed-incomplete blindness to every demo); the
  `no-cross-demo`
  depcruise rule lands in the SAME PR red-proven against the pre-hoist shape.
  The hoist list also carries the non-axe instruments (EX32 r3; completed
  at re-review round 2, finding 1): the focus-ring contrast comparator, the
  320px reflow measure, and the SC 1.4.12 TEXT-SPACING measure — the
  standard text-spacing overrides (line height 1.5×, paragraph 2×, letter
  0.12×, word 0.16×) applied through the shared harness with
  overflow/clipping asserted, built on the landed overflow-measure pattern
  (`demos/oak-curriculum-hub/tools/measure-320.ts`); before this entry the
  estate had NO text-spacing instrument (grep-verified 2026-08-08) while
  the charter DoD's third non-axe cell demanded one from this hoist —
  consumed by every demo's DoD cells. Sequenced before W1's WORKSPACE landings (never the
  first pixels — FR4 r3). Acceptance (`repo-safe`: validators green over the
  surfaces that exist at landing; red-proofs recorded incl. the HTML arm).
- **W0.9 Hub wow pre-read** (FR6 r2, zero-cost, `owner-held`). Serve the
  EXISTING hub — with its search backend configured so search WORKS live
  (owner word 2026-08-05; the landed search implementation is complete and
  tested, the gap is env credentials only, per the demo README) — and the
  owner browses it end-to-end in Chrome. Describing-surface tag (EX40,
  added at re-review round 2): the conditional repo-safe leg's object is
  this plan body itself (minted stories) — scaffolding-class, said here.
  Acceptance
  (explicit per D5 r3 — `owner-held`: verdict recorded in the wow-verdict
  register; `repo-safe`: on a FAIL verdict, linked scoped visual-cure stories
  minted into this plan's body with named budget lines in the same sitting —
  never a contingent clause discovered at the plan's end). This resolves the
  hub reading; the charter ADR carries the resolved form.
- **W0.10 Counter-identity pre-read + taste-anchor sittings** (NEW — FR0 r3).
  Symmetric with W0.9 and BEFORE W2 opens: serve the existing renders of the
  two counter-identities (EMC² and the identity being renamed to PDS, owner
  instruction 2026-08-03), the owner browses, verdicts land in the
  wow-verdict register; then one owner DIRECTION SITTING per counter-identity
  mints that identity's own taste anchor — the analogue of Oak's anchor,
  which is the export's demonstrated language plus the no-messy-arrangements
  rule (W0.5 item 2) — and the W0.7 rubric gains its per-identity
  language section at the same sitting, so W2.9's instrument pass judges each
  identity against its own anchor and the first counter-identity wow signal
  arrives at MINIMUM sunk cost, never after the full W2 machinery spend. The
  cheap early probe rides W1: one composed page variant per counter-identity
  joins the W1.5 checkpoint. Describing-surface tag (EX40, added at
  re-review round 2): the repo-safe leg is a committed-record boundary (the
  rubric's per-identity sections) — scaffolding-class like W0.7's outputs,
  said here. Acceptance (`owner-held`: pre-read verdicts +
  both sittings recorded; `repo-safe`: the rubric's per-identity sections
  committed).

### W1 — First light: the plain demo AND the early showcase probe

The two cheapest full-page wow tests, promoted ahead of all machinery (FR0/F2
r1). The plain demo proves export-grade pages on the live kit with zero
build-time styling; the showcase probe proves the design grammar where the bar
binds hardest — BEFORE W2/W3 spend. The first renders double as live
calibration sittings for W0.7's rubric. Intra-workstream sequencing is
explicit (D3 r3): W1.2 starts only after W1.1's workspace is registered and
green in `pnpm check` (the PROVISIONAL W1.2 render for the first-pixels gate
needs only W0.2(a) + W0.7 v0 + W0.9, plus W0.5's blocking tweaks where
they touch the chosen pages — §Sequencing, FR4/FR5 r3; trued at re-review
round 2, finding 4). Describing
surface: the demos' Playwright `test:ui`/`test:a11y` suites per the charter
DoD.

- **W1.1 `demos/oak-plain-pages` workspace** (name at seat's discretion). The
  new-workspace plumbing contract: pnpm-workspace registration; the dated
  ADR-041 amendment as ROW AND COLUMN (EX78 r3): the demos importee column
  lands with `no` in every existing row (the inbound rule recorded where the
  matrix is authoritative), the `demos/` bullet trued to name the landed
  depcruise rule as its enforcement, and outbound cells narrowed to what
  demos consume today (core / sdks / design yes; foundation and adapter
  stay `no` until a real consumer widens them — EX78 r3 supersedes EX73 r2's
  wider enumeration); the demos-inventory leg in `validate-boundaries`;
  depcruise `no-packages-to-demos`/`no-cross-demo` rules (the latter landed
  by W0.8); knip/prettier/markdownlint entries; the per-workspace TURBO task
  entries with outputs and input exclusions mirroring the landed demos, and
  the `.dependency-cruiser.mjs` exclusion for the demo's served
  `oak-theme.js` copy (EX75 r3); the per-page Lighthouse CI budget wiring
  (the W0.5 instrument: the workspace's budget config + CI leg, its page
  list derived from the census-generated sitemap where the demo carries
  one); the DEMO-TIER vitest config pattern — NOT
  the base config, whose include globs collect `tests/**/*.spec.ts` where
  the browser suites live: co-located include globs with `tests/` excluded
  so Playwright specs run via `test:ui`/`test:a11y` only (the showcase's
  landed config is the precedent) — plus the charter's
  test-naming convention with `--passWithNoTests=false` (EX52 r3);
  Playwright wired as `test:ui`/`test:a11y`; the shared harness consumed
  from W0.8's test-support home; the kit-copy delivery + parity rows for the
  demo's served kit assets (EX70 r2) — landed AS this workspace's first
  vitest-visible co-located unit test on the showcase precedent
  (`tools/kit-asset-parity.unit.test.ts`), which is what makes
  `--passWithNoTests=false` green from cold at this landing PR (re-review
  round 2, finding 7 — zero added scope); this workspace's README +
  `package.json` description land here per the W0.3 split (EX60 r3). No
  app-shell prerequisites — this demo ships no React (EX19 r2 correction).
  Describing-surface tag (EX40, added at re-review round 2):
  workspace-plumbing scaffolding-class, said here — the kit-asset parity
  unit test is the story's one behavioural boundary.
  Acceptance (`repo-safe`: `pnpm check` green from cold with the workspace
  in, the parity unit test vitest-visible; the Lighthouse budget wiring
  pattern present per this contract — the showcase carries the live
  per-page budget requirement (cross-demo acceptance); the ADR-041
  row-and-column amendment diff in the PR).
- **W1.2 The export's three composed pages, authored fresh against the live
  kit.** Fresh authoring — the `studio-source/` pages STAY under
  studio-source; the demo authors its own markup expressing the same
  compositions. Static HTML + kit stylesheets + `oak-theme.js` for detection
  AND selection. The THEME CONTROL is specified (L0 r2): a toggle-button
  group in each page's masthead — the export's Identity Switchboard pattern,
  never a native select — real `<button>` elements wired to `oak-theme.js`
  `set()` by a small demo-local script, visible from page load (≤2
  activations), keyboard-operable, and conformant to the charter's APG
  control-pattern clause (EX34 r3: group semantics + accessible name,
  selected-state exposure, named keyboard model, non-colour selected
  indicator). The axis-model implication for this control (EX28(4) r2) is a
  STANDING checkpoint note from the first rendered control (EX65 r3 — carried
  in §Quality bar): the W1.3 sitting prices it, and whether the W1 control is
  re-faced after W2.4's axes land is decided at W2.4's story open, stated
  there. Pre-paint via parser-blocking head script per the charter. Zero raw
  literals — gated by W0.8's walker WITH its HTML arm (EX49 r3; never "by
  construction"). Blocking tweaks from W0.5's enumeration sitting that touch
  these pages land in this authoring (FR5 r3) — at the confirmed ledger
  that means: the asset-closure class (item 1), the Oak
  no-messy-arrangements rule (item 2), the content-provenance manifest
  instances (item 3), the creature reduced-motion defect where that page is
  chosen (item 6), and the White-Labelling footer copy where it appears
  (item 10). Acceptance (`repo-safe`:
  `test:ui` + `test:a11y` per the charter DoD incl. the no-flash cells; the
  content-provenance manifest complete over the chosen pages — item 3 is
  blocking here and the acceptance carries it;
  `owner-held`: wow checkpoint below).
- **W1.3 Wow checkpoint #1** (`owner-held`): rendered in the owner's Chrome
  (pixels, never artefact paths), verdicts recorded per page in the
  wow-verdict register using its schema INCLUDING the rubric evaluation
  results and cells covered (D10/FR2 r3); the W0.7 three-leg pass runs
  BEFORE the render is shown; each PASS lands its screenshot baseline per
  §Quality bar rule 6 (EX47 r3); the sitting doubles as the rubric's first
  live calibration and the W0.5 intake-surface confirmation.
- **W1.4 Showcase design grammar + the composed page set** (pulled forward
  from W4 — FR0 r2). The product-grade composed page set is named FIRST, in
  the export's own layout grammar (lesson pages, front pages, worksheets —
  seeded by the census's `express-composed` rows), as a COMMITTED page-set
  artefact that W4.5's matrix derives from; census features are then mapped
  ONTO the pages. Each page-set row carries: its layout-grammar family, the
  census rows it seeds, its DECLARED reading sequence per composition variant
  (the governance-doc envelope), and its per-page feature budget (FR2 r2) —
  demonstration density is a designed quantity adjudicated by the W0.7
  instrument. AT LEAST ONE variant explicitly uses CSS reordering (Grid
  `order`/template placement) to rearrange elements from DOM order, named
  here as the REQUIRED demonstrating surface for the standing reordering
  requirement and the W7 precursor (L2 r3) — admissible per the envelope's
  DOM-order rule. The page-set FINALISATION carries the batched owner card
  for every page-census row not `express-composed` (FR3 r3 — his word on
  folds/reference demotions, one card); the finalisation is also where W0.5
  item 8 BINDS — the example lesson slides and example worksheet enter the
  page set as first-class navigation entries (non-blocking for the W1.5
  probe, blocking here). The specimen-grid rule stands: a
  surface whose primary content is the feature itself FAILS the coverage
  matrix by definition; the bounded exception is the reference tier, designed
  to the same wow bar; low-glamour census rows may satisfy the matrix in the
  reference tier without per-gap owner ceremony. The artefact is finalised
  before any W4.2 landing; later changes reopen THIS story (D15 r2).
  Describing-surface tag (EX40; re-review round 2, finding 3): this story's
  boundary DIFFERS from the W1 preamble's — its describing surface is the
  committed page-set artefact's rows and their derivation consumers (W4.5's
  matrix derives from it; the finalisation card consumes it), never a test
  that re-reads the artefact's contents (the audit-a-record shape the
  convention bars — the same disambiguation W0.4 carries).
  Acceptance (`repo-safe`: the committed page-set artefact with budgets and
  declared sequences; `owner-held`: the batched page-disposition card).
- **W1.5 Early showcase wow probe** (`owner-held` — FR0 r2). One or two pages
  from W1.4's set authored IN the existing showcase workspace against kit
  classes (no W2 identity machinery, no W3 tier), shown at an owner
  checkpoint before any W2/W3 spend — the biggest wow unknown discovered at
  MINIMUM sunk cost. The probe's approval scope is stated (EX20 r3): it
  covers COMPOSITION AND GRAMMAR; pixel preservation through the W4
  consumption-path conversion is proven mechanically by the §Quality bar
  rule-6 screenshot baselines plus a pixel-parity acceptance cell in W4.2 —
  never asserted "identical by construction". The SAME LANDING replaces or
  redirects the owner-rejected showcase page's route (FR7 r3 — a dated
  interim act: the landed state at every moment shows only surfaces he has
  not rejected). The showcase CONTROL surface is specified with W1.2's
  specificity (EX24 r3): the control's form (toggle-button group per the
  taste calibration — the landed native-select Switchboard is REPLACED on
  the probe pages), its honest pre-hydration state, ≤2-activation
  reachability of high-contrast and colour-safe, exactly the three
  owner-named identities; the existing `Switchboard`/`LabelledSelect`
  modules and their geometry tests are named in W4.2's generated inventory
  so their dispositions are recorded, never lost. The counter-identity probe
  variants (one composed page per counter-identity — W0.10/FR0 r3) join this
  checkpoint. Describing-surface tag (EX40, added at re-review round 2): the
  repo-safe legs sit outside the W1 preamble's suites — a landed route
  replacement and the rule-6 screenshot baselines — said here.
  Acceptance (explicit per D9 r3 — `owner-held`: the probe pages
  rendered at the checkpoint with the three-leg W0.7 pass run first,
  verdicts + cells in the wow-verdict register; the checkpoint is the
  go/no-go for W2/W3 spend at this bar; `repo-safe`: the rejected-route
  replacement landed; baselines per rule 6).

### W2 — Identity and theme contract (pointer stories — mechanism at story open)

Far-horizon per the 2026-08-03 partition ruling: each story below carries goal,
gates, dependencies, and acceptance SHAPE only. Mechanism is authored at each
story's open under per-story expert review (PDR-132), from the story-open
inputs named in §Story-open pointer tables. Binding rulings carried forward
(decisions, never mechanism): identities are AUTHORED CONFIGURATION (manifest +
emitter; Oak references its own generated projection); the axis ruling (EX28) —
contrast and colour-vision compose with polarity AND the owner's four named
states (light, dark, high-contrast, colour-safe) remain first-class nameable
presets, never dissolved into coordinates; forced-colours is an adaptation
obligation, never a theme; W2's internal sequencing is explicit (L4 r3): W2.0 →
W2.1 ∥ W2.7 → W2.2 → the rest; NO high-contrast or colour-safe subtree renders
before the item-14 closure check is green (L5 r3; ruled 2026-09-03, the slice
at W0.2(b)) — W2.4/W2.5 rendering acceptance is blocked on that check by
construction; and the counter-identity
taste anchors exist BEFORE this workstream opens (FR0 r3 — minted at the W0/W1
pre-read and per-identity owner direction sittings).

- **W2.0 The identity-data home.** Goal: a new `packages/design/` workspace
  holding identity manifests, token trees, identity CSS layers, and vendored
  assets — the single home of identity DATA, boundary-ruled against the
  framework packages. Depends: nothing inside W2. Acceptance shape
  (`repo-safe`): workspace landed with boundary rules + the dated ADR-041
  amendment; the identity-№N pathway documented end-to-end (L0 r3).
- **W2.1 Identity manifest schema.** Goal: the declared-base overlay model as a
  validated schema every identity satisfies; rejection fixtures enumerate the
  non-negotiables (light / dark / high-contrast present, colour-safe default,
  every OS-signal composition resolvable). Depends: W2.0. Acceptance shape
  (`repo-safe`): fixture matrix + mutation proof.
- **W2.2 The identity emitter + the Oak projection generator.** Goal: manifest
  - trees → brand CSS + asset manifest + theme roster; Oak becomes
  configuration by generating its own projection; each identity migrates
  replace-dont-bridge at its own landing. Depends: W2.1. Acceptance shape
  (`repo-safe`): emitter fixtures; per-identity migration proofs (emitted
  output serves the demo suites green); the dated ADR amendment diffs.
- **W2.3 Theme roster generation.** Goal: the roster generated from config;
  consumers derive it, never restate it — theme-№N needs zero edits outside
  the one pinned, deliberately re-baselined expectations module. Depends:
  W2.2. Acceptance shape (`repo-safe`): the theme-№N falsifier red-then-green;
  the consumer-census validator red-proven.
- **W2.4 Theme overlays and axes re-architecture.** Goal: high-contrast and
  colour-safe become identity-supplied and axis-composable (dark ×
  more-contrast resolves; a dark-preferring user is never forced onto a white
  canvas); the `prefers-contrast` route lands here. Gates: the item-14 closure
  check green (W0.2(b)) — rendering blocked until it is (L5 r3); the re-authored non-default themes take a
  W0.7-instrument pass (FR2 r3). Depends: W2.1, W2.2. Acceptance shape
  (`repo-safe`): every identity renders its OWN high-contrast and colour-safe
  palettes, gate-proven per W2.5.
- **W2.5 Per-identity gate matrix.** Goal: contrast, colour-safety (a CVD leg
  distinct from contrast), and rendered a11y gated per identity × theme ×
  OS-signal cell, the cell count pinned so a shrinking matrix is visible.
  Gates: item-14 as W2.4. Depends: W2.2, W2.4. Acceptance shape (`repo-safe`):
  the matrix wired into `pnpm check`; pinned cell count; the widened
  ADR-147/ADR-121 amendment diffs; the W0.5 item-7 worksheet-contrast
  instance (`Worksheet.dc.html?brand=creature`, body copy washed out) named
  as a must-catch case — a matrix that misses it is wrong.
- **W2.6 Standing falsifiers.** Goal: identity-№N, theme-№N, thinness, and
  every-census-axis-reachable stand in CI as red-proven tripwires. Depends:
  W2.1–W2.3. Acceptance shape (`repo-safe`): each fixture proven biting once
  by mutation.
- **W2.7 Off-horizontal dimension.** Goal: identity tilt tokenised with its
  accessibility constraints. The VALUES are owner-delivered (card answer
  2026-08-03 ~09:15Z, verbatim in the committed napkin, `b1b5431a7`; gate
  discharged 2026-08-05): PDS structural zero; Oak zero on interactive and
  content-bearing elements — decoration MAY tilt, structural zero if
  easier; EMC² leans in, including ANIMATED tilts demonstrating motion vs
  no-motion. Gate: no tilt render before the token shape + constraints
  land. Constraint row (W0.5 item 4, owner-confirmed): EMC² rotation is
  SYSTEMATIC — tokenised fixed angles, never per-element random ("still
  consistent, not random, that would make it hard for some people to
  read"). The per-identity MOTION STANCES ride here as the motion analogue
  of the tilt values (W0.5 item 6, owner-delivered): Oak none; PDS none;
  EMC² the motion identity with full and reduced-motion genuinely distinct
  — the EMC² motion-pair page (ringing animations vs without) is the
  demonstrating surface, non-blocking new scope, W1.4 page-set candidate.
  Depends: W2.1. Acceptance shape (`repo-safe`): token shape +
  constraint tests encoding the delivered values, the
  systematic-consistency row, and the motion stances.
- **W2.8 Identity asset delivery.** Goal: each identity's payload (icons,
  logo, fonts) vendored into the W2.0 home, offline-safe, licence notices
  beside them, with the manifest-guarded ASSET CLOSURE (W0.5 item 1's
  class: every referenced asset resolves inside the served tree — the
  export's sibling-layout failure class) and the content-provenance rows
  (item 3) beside the licence notices. Depends: W2.0. Acceptance shape
  (`repo-safe`): hermetic demo suites + licence rows + the closure gate +
  the content-provenance rows present per identity payload.
- **W2.9 Identity design authorship.** Goal: the counter-identities authored
  to the wow bar as first-class design work, each judged against its OWN taste
  anchor (minted before W2 opened — FR0 r3) and across its FULL theme roster,
  never only its default (FR2 r3). Reference protocol (owner rulings
  2026-08-05, folded per the Director's process ruling): the official Oak
  Design Kit is reference-only — values may be EXAMINED exactly (read-only
  Figma access, quota-metered; the export-to-reference-local practice) and
  every EXPRESSIVE PALETTE value USED deviates deliberately per the
  cartographer's-folly ruling, canonical at DDR-007 with its own bounds
  (systematic, harmony-preserving, accessibility-safe perturbation;
  exempt classes — the attributed exact `ci-*` scientific values among
  them — stay exact per that record); provenance lands in the
  content-provenance manifest's identity-values column (W0.5 item 3). The
  Oak identity authorship carries the bounded SYSTEMATIC FOLLY PASS over
  the 68 byte-identical palette values found by the 2026-08-05 trap-street
  audit, with the designed re-baselines riding it; the W3 Buttons
  story-open pointer is TWO-SIDED — a similarity bound (perceptually
  correct against the reference) AND a distinctness bound (the folly
  deviation present). Pointer-grade until story open. Depends: W2.2;
  W2.7's session for any tilt values. Acceptance shape (`owner-held`):
  rendered identity checkpoints on composed-page carriers; (`repo-safe`):
  instrument records committed; the folly attestation in the provenance
  manifest.
- **W2.10 ADR-147 gate extension for `oak-design-react`.** Goal: the tier's
  rendered accessibility gate. Depends: lands atomically with W3.1's first
  component family. Acceptance shape (`repo-safe`): the extended gate green on
  the first family; the non-vacuity leg red-proven.
- **W2.11 Per-identity print projections (NEW at the confirmed W0.5
  ledger, item 7 — owner word 0d5afca6).** Goal: paper-destined artefacts
  get a DEFINED print/paper polarity per identity — a dark-first identity
  never ships an unreadable worksheet; the projections join W2.5's checked
  surface. Depends: W2.2, W2.5. Acceptance shape (`repo-safe`):
  per-identity print-projection cells in the W2.5 matrix; the W0.1 census
  print/deck `owner-accepted-exclusion` rows re-dispositioned against this
  story at its open. Mechanism at story open.

### W3 — The React component tier (pointer stories — mechanism at story open)

Binding rulings carried forward: CURATED adoption on the ADR-213 §3 shape —
coverage means a recorded mapping DECISION for every W0.1 census class, with
no-construct / stays-class-only the DEFAULT outcome; the coverage reading of
the owner's "full optional React component set" is carded to him at W3.0 open
(frontmatter gate 3); the §3 amendment records BOTH consumption shapes' roles
exactly as the Director ruled (EX56: the studio seeds remain the tier-3
token-sufficiency proof, adopted tier components paint via kit recipe classes,
and the rejection + curation doctrine are unchanged) — the round-3 faithfulness
rows are that story's correction set at open; adopted components are REWRITTEN
at adoption, never wrapped.

- **W3.0 Packaging, landing-sequence obligations + the mapping rule.** Goal:
  the tier package ships correctly (directive preservation, per-component
  exports, react peers) and the mapping-decision contract with its mechanical
  completeness check exists before any family lands. Gates: frontmatter gate 3
  (the coverage card) at open. Acceptance shape (`repo-safe`): packaging
  tests; the completeness check red-proven; the §3 amendment diff faithful to
  the ruling as given.
- **W3.1 Curated adoption, sliced by component family.** Goal: one family =
  one single-story PR, rewritten to consume kit classes with variants as
  props; rendered accessibility criteria ride W2.10's gate. Depends: W3.0;
  W2.10 atomic with the first family. Acceptance shape (`repo-safe`): W2.10
  green per family; coverage-table rows.
- **W3.2 Theme runtime completion.** Goal: the kit runtime's listener/storage
  contract completed and the React adapter's store shape defined against it.
  Depends: W3.0. Acceptance shape (`repo-safe`): store unit tests including
  the cross-writer staleness case red-then-green.
- **W3.3 Identity runtime binding.** Goal: identity as a KIT-OWNED,
  framework-neutral runtime trunk (get/choice/set/subscribe, pre-paint
  application, persistence) with a thin React adapter; the identity list feeds
  from W2.1's schema output, never a hardcoded union. Depends: W2.1, W2.2.
  Acceptance shape (`repo-safe`): reload/deep-link cells; the extended
  falsifier — minting identity №N requires zero demo source edits.
- **W3.4 Server/client boundary policy.** Goal: directives only where
  interactivity lives, enforced mechanically at source and at dist.
  Acceptance shape (`repo-safe`): the rule + dist assertion red-proven.
- **W3.5 Hub identity switching (NEW — owner word 2026-08-03).** Goal: the hub
  — "the first instance of a Claude Design app ingested and reconstructed with
  our tools" — gains runtime identity switching as a valuable demo: the
  real-product whitelabel demonstration, and the second member of the
  switching pair (showcase + hub). Scope: an ADDITION riding W3.3's
  framework-neutral runtime; the hub's as-is architecture ruling stands.
  Depends: W3.3; the hub's identity coverage in W2.5's matrix. Acceptance
  shape (`repo-safe`): the hub joins the switching cells in W6.1's cross-demo
  suite; (`owner-held`): a hub switching checkpoint in his Chrome.

### W4 — The showcase, rebuilt to the wow bar (pointer stories — mechanism at story open)

W4.1's design grammar and page set live in W1.4 (pulled forward — FR0 r2).
Binding rulings: per-page migration landings — describing tests, new page, old
markup removed, one landing each; the owner-rejected page is REPLACED at
W1.5's landing, never left rendering through W2/W3 (FR7 r3); page-census
dispositions carry owner word, batched at W1.4's page-set finalisation (FR3
r3).

- **W4.2 Per-page migration landings.** Goal: every showcase page rebuilt
  beneath already-approved pixels, the rejected surface's instrument inventory
  generated and dispositioned to zero rows, declared-sequence focus-order
  checks standing. Depends: W1.4's page-set artefact; W2/W3 only where a page
  consumes them. Acceptance shape (`repo-safe`): suites green at every
  landing + zero undispositioned inventory rows + the content-provenance
  manifest complete over each landed page (item 3 gates the rebuild);
  (`owner-held`): page-batch wow checkpoints per §Quality bar.
- **W4.3 Export-page expression per the census dispositions.** Goal: every
  express-composed and fold-into-composition row lands on a named showcase
  surface within its page's feature budget. Depends: the W4.2 cadence.
  Acceptance shape (`repo-safe`): matrix rows green; (`owner-held`): wow
  checkpoints.
- **W4.4 The token-reference page.** Goal: the reference tier generated at
  build time from W2's per-identity emitted projections, designed to the wow
  bar in the system's own language. Depends: W2.2 (this plan's single hard W2
  → W4 edge — D2). Acceptance shape (`repo-safe`): generation + scoped parity
  - coverage checks; (`owner-held`): wow checkpoint.
- **W4.5 Feature-coverage matrix, generated.** Goal: census rows mapped to
  demonstrating surfaces and gated mechanically against the test runners' own
  reports. Acceptance shape (`repo-safe`): the matrix gate in `pnpm check`.
- **W4.6 Tailwind discipline in the showcase.** Goal: kit recipes paint;
  Tailwind is composition vocabulary on wrappers only, mechanically enforced.
  Acceptance shape (`repo-safe`): the lint red-proven on planted violations;
  the computed-value cell.
- **W4.7 Whole-demo checkpoint** (`owner-held`). Goal: the owner browses the
  rebuilt showcase end-to-end; the minimum owner-viewed cell set covers every
  identity × both polarities plus high-contrast and colour-safe at least once
  (FR2 r3).
- **W4.8 Editable slides (NEW at the confirmed W0.5 ledger, item 9 —
  owner word 0d5afca6; post-first-light).** Goal: text-editable demo slides
  with working buttons — convert to PDF, print, save via localStorage
  (implying a reset) — the document-artefact workflow property;
  localStorage-only keeps privacy trivial. Depends: sequenced after first
  light; the W1.4 page set names the slides surface. Acceptance shape
  (`repo-safe`): demo suites over the edit, persist, reset,
  convert-to-PDF, and print cells — every named button behaviour has a
  cell; (`owner-held`): wow checkpoint. Mechanism at story open under
  per-story review.

### W5 — The styled-components demo (pointer stories — mechanism at story open)

A SMALL proof demo (owner word 2026-08-03): it proves layer breadth — the
system consumed through a css-in-js regime and through the React tier — and is
never a second full-feature showcase.

- **W5.1 The styled-demo workspace.** Goal: the workspace on the W1.1
  plumbing contract + the App Router style registry with a
  no-unstyled-first-paint assertion; vendor surface re-verified against
  current upstream docs at story open. Acceptance shape (`repo-safe`):
  `pnpm check` from cold; the first-paint assertion; the amendment diff.
- **W5.2 The styled demo's composed pages.** Goal: the demo's OWN page set,
  its differentiating design decision named at authoring time in the page-set
  artefact (FR6 r3). Depends: W5.1. Acceptance shape (`repo-safe`): page-set
  rows + suites; (`owner-held`): at W5.5.
- **W5.3 Consumption through the tier.** Goal: the tier's second consumer,
  proving the thinness claim; overrides through the sanctioned mechanism with
  build-mode proof cells. Depends: the W3.1 families it consumes. Acceptance
  shape (`repo-safe`): demo suites; zero forked component copies; the
  override cells.
- **W5.4 Token discipline.** Goal: no framework theme object holds token
  values; every styled component reads roles through `var()`; the
  template-literal detector lands red-first in the PR that adds the
  dependency. Acceptance shape (`repo-safe`): detector red-proven; suites
  green.
- **W5.5 Wow checkpoint** (`owner-held`): page batches, then the whole demo
  end-to-end, owner-viewed cells per FR2 r3.

### W7 — The layout-range demo (pointer story — mechanism at story open; NEW — owner word 2026-08-03, "css zen garden like")

The fifth demo, SMALL by design, proving the kernel's third property:
IDENTICAL semantic page structure rendered under radically different layouts
purely through design-system choices — the modern css-zen-garden form, and the
L2 standing requirement scaled to a whole demo. Goal: one page structure; a
small set of design variants, each a design-system configuration (tokens,
composition, layout grammar) with ZERO markup change; every variant holds the
accessibility floor (a declared reading sequence per the composition envelope;
focus-order judged against it). Single-identity at build time; theme
detection/selection per the cross-demo bar. Sequencing: after first light,
before W6 closure (its cells join W6.1); the W1.4 CSS-reordering variant (L2
r3) is its cheap near-horizon precursor. Mechanism, workspace name, and
variant count are authored at story open under per-story review. Acceptance
shape (`repo-safe`): the demo's suites + its W6.1 cells; (`owner-held`): the
wow checkpoint over every variant.

### W6 — Cross-demo closure (pointer stories — mechanism at story open)

- **W6.1 Cross-demo verification, mechanical.** Goal: the resolved-rendering
  cells (theme, identity, motion, before-first-paint, JS-disabled) green in
  all FIVE demos; the hub's story is verification of its existing wiring with
  recorded mutation proofs. The W0.5 instrument derivations verify here
  (census→sitemap→axe page-list parity as cross-demo cells where a demo
  carries a sitemap; the Lighthouse budgets leg over the showcase's derived
  page list, its scoped carrier), and the motion cell is judged against
  the per-identity stances (W2.7). Acceptance shape (`repo-safe`): the named
  cells green in every demo.
- **W6.2 Hub whole-demo checkpoint** (`owner-held`): the end-to-end browse
  closing the hub reading against the finished estate, owner-viewed cells per
  FR2 r3.
- **W6.3 PR-709 closure acts.** Goal: the by-file value-transfer comment and
  the MCP-448 routing of the ADR-217 delivery tail. Acceptance shape
  (`repo-safe`): the closure comment's story-id list resolves against landed
  tests.
- **W6.4 Census refresh + drift closure.** Goal: the census artefacts
  re-derived at a dated commit, the matrix recomputed, the
  method-independent parity legs re-run. Acceptance shape (`repo-safe`): zero
  undispositioned deltas; parity legs green.

## Story-open pointer tables (rounds 2–3 conserved as story-open inputs)

Per the 2026-08-03 partition ruling, far-horizon findings are conserved here as
REQUIRED story-open inputs, never plan blockers. At each W2–W7 story's open,
the authoring seat reads, BEFORE mechanism authoring:

1. that story's v2.1 mechanism text — frozen verbatim at
   `.agent/reports/design/plan-review-2026-08-02/v2.1-far-horizon-mechanism.md`
   (the round-2-cured baseline: authoritative for nothing, input for
   everything);
2. that story's round-2 dispositions in `dispositions.v2.1.md` (every round-2
   row carries one);
3. the round-3 rows below — array-index ids into `findings.v3.json` per the
   citation legend, derived mechanically from each row's `section` field (the
   corpus is the authority; a row naming several stories appears in each).

| Story | Round-3 rows |
| --- | --- |
| W2 preamble + sequencing | L4, EX63, EX64 |
| W2.0 | D2, EX71, EX79 |
| W2.1 | EX0, EX1, EX8, EX12, EX33, EX38 |
| W2.2 | EX0, EX6, EX7, EX71, EX72, EX76 |
| W2.3 | EX10, EX42, EX73, EX74 |
| W2.4 | D15, EX1, EX3, EX7, EX29, EX35, EX41, EX65 |
| W2.5 | EX2, EX31, EX33, EX36, EX38, EX48, EX81 |
| W2.6 | EX72, EX81 |
| W2.7 | EX9, EX36 |
| W2.8 | EX79 |
| W2.9 | FR0, FR2 |
| W2.10 | EX33 |
| W2.11 | (new story — no round-3 rows; owner-worded at the confirmed W0.5 ledger, item 7) |
| W3.0 | EX11, EX14, EX22, EX54, EX56 |
| W3.1 | D13, L3, EX15, EX16, EX54 |
| W3.2 | EX17, EX26 |
| W3.3 | D0, EX23, EX73 |
| W3.4 | EX27 |
| W3.5 | (new story — no round-3 rows; W3.3's rows apply where it consumes them) |
| W4.2 | D12, D14, EX24, EX28, EX37, FR7 |
| W4.3 | D11 |
| W4.4 | EX5, EX46, EX76 |
| W4.5 | EX43, EX44 |
| W4.6 | EX18, EX19 |
| W4.7 | D7, FR2 |
| W4.8 | (new story — no round-3 rows; owner-worded at the confirmed W0.5 ledger, item 9) |
| W5.1 | EX52, EX75 |
| W5.2 | FR6 |
| W5.3 | EX21, EX25, EX80 |
| W6.1 | EX50, EX51 |
| W6.2 | FR2 |
| W7 | L2 |

Rows anchored on near-horizon sections (W0/W1, the instrument, the quality
bar, §Relationships) are NOT in these tables — they are cured in the
near-horizon text itself; their per-row disposition ledger is
`dispositions.v2.2.md` (authored from living memory 2026-08-05 with dated
provenance in the file, superseding the earlier never-authored state), which
the 2026-08-05 scoped re-review verified row-by-row — 57/57 rows, with its
stated 113-row completeness sweep clean (see §Review record).

## Cross-demo acceptance (all five, owner amendments 2026-08-02 and 2026-08-03)

- Working theme detection AND selection in every demo, stated mechanically per
  W6.1 (resolved rendering + the two before-first-paint observables;
  persistence; high-contrast and colour-safe reachable from the visible theme
  control — control present, keyboard-operable, ≤2 activations from page load;
  reduced motion at the mechanical floor per D11, judged against the
  per-identity motion stances of W0.5 item 6: Oak none, PDS none, EMC²
  genuinely distinct full/reduced).
- Lighthouse CI PERFORMANCE BUDGETS per page (W0.5 instrument, owner word:
  "prove it is performant"; Director strengthening: budgets, not one-off
  measurements). The requirement is SHOWCASE-SCOPED — the owner's stated
  surface ("every showcase page") — with the page list derived from the
  census-generated sitemap (method-independent parity). The wiring pattern
  is defined once in the W1.1 plumbing contract, so any demo later adopting
  budgets inherits the mechanism; the showcase carries the requirement.
- Styling sourced solely from the design system through each demo's declared
  consumption path. Zero raw literals at point of use for the showcase, plain,
  styled, and layout-range demos (instruments per demo: W0.8 walker, W4.6
  class-string check, W5.4 template detector; the layout-range demo's
  instrument is named at its story open — never assumed covered). The named
  CSS instrument's documented blind spot is stated, not implied: at-rule
  params (media/container queries) are outside its declaration walk, so
  literal breakpoints are held by the documented-kit-constants convention
  and the instrument proves the invariant only inside declaration blocks it
  reaches. The hub's measured debt (548
  arbitrary-value occurrences, first-hand count 2026-08-02) is RECORDED as
  accepted standing debt under its as-is ruling AND as an accessibility risk
  (EX32 — untokenised colour is ungated colour), reduced opportunistically,
  never a criterion this plan pretends is met.
- WCAG 2.2 AA per the charter DoD (a floor, with the named manual pass);
  keyboard-complete over every interactive element; visible focus.

## Quality bar — the wow checkpoint (every demo, every page)

1. Rendered in the owner's Chrome at each checkpoint — pixels, never artefact
   paths. The owner's verdict is the gate. The verdict's RECORD (D6): a
   wow-verdict-register entry (the register W0.7 mints — EX53 r3) stating
   PASS / FAIL / ITERATE, the qualities judged, the cells covered, the
   date, and — at checkpoint-class rows — the instrument-leg results
   (re-review round 2, finding 6) — so the owner-held criterion has a
   resolvable record and the miss-rate mechanism its per-row inputs.
2. Beneath his eye, always-on: the wow-verdict register; the W0.7 rubric +
   accessibility-expert leg run BEFORE any render is shown; the mechanical
   gates green first.
3. A page failing the checkpoint iterates within its PR. **Owner wow
   iterations are a distinct loop and do not consume PDR-132 review rounds**;
   at the three-iteration bound the seat routes the page to the Director with
   the instrument's findings, screenshot, and blocker assessment — the
   Director resolves via a NAMED disposition (D0): defer the page / land with
   a recorded exception / re-scope / extend that page's budget — owner word
   wherever the landed bar changes.
4. A wow failure on a fidelity-clean page auto-promotes the design change in
   the W0.5 intake, batched with the sitting's other promotions (D1 r3) —
   the owner's verdict, not the intake default, decides priority.
5. Verdicts are BATCHED (FR7): the owner sees composed page sets and, at each
   demo's close, the whole demo end-to-end — never a drip of single-page
   asks; the rubric's cohesion clause judges the whole.
6. Every owner PASS lands that page's rendered screenshot baseline in the
   same PR (EX47 r3), so later work beneath approved pixels (the W4
   consumption-path conversions, refactors) is proven against the approved
   rendering mechanically — pixel preservation is never asserted "identical
   by construction".

Standing checkpoint note (EX65 r3, from the first rendered control onward):
each sitting that views a theme or identity control prices the EX28(4)
axis-model implication — whether that control's shape survives W2.4's
contrast/colour-vision axes — until W2.4's story open states the re-facing
decision.

## Sequencing and PR discipline

W0 → W1 (first light ×2) → W2 ∥ W3 → W4 → W5 → W7 → W6, with W2's internal
chain explicit (its preamble, L4 r3), W2.10 landing atomically with W3.1's
first family, W4.4 blocking on W2.2, each W3 family independent, and W7 free
to run any time after first light. The FIRST-PIXELS gate is SPLIT from the
plumbing gate (FR4 r3): the PROVISIONAL W1.2 render gates only on W0.2(a)
stabilise + W0.7's v0 rubric + W0.9's pre-read (plus W0.5's blocking tweaks
where they touch the chosen pages — FR5); W1.5 additionally carries its own
stated prerequisites — W1.4's committed page-set naming (seeded by W0.1's
census rows) and W0.10's sittings for the counter-identity variants; W0.1's
mechanised census, the charter ADR, and W0.8's re-homing otherwise proceed
in parallel and gate the W1.1/W5.1 workspace landings and W4 — never the
first pixels in front of the owner. Small single-story PRs; each PR: bot identity, Copilot at open,
full-condition merge, review-round budget TWO with tally-stop at budget
(PDR-132). Renders to the owner at every W1/W4/W5/W7 batch landing and the
W4.7/W5.5/W6.2 whole-demo checkpoints.

## Decision log (owner word unless marked seat-verdict)

Design decisions carried canonically by the
[Design Decision Record corpus](../../../docs/design/README.md) are listed
here with their record — whether or not a log row below restates them: the
configured-framework frame → DDR-001; CSS-first/one-behaviour →
DDR-002; the theme choice model → DDR-003; the five-theme roster with
access themes first-class → DDR-004; licence-follows-provenance → DDR-005;
the Oak Components reference posture → DDR-006; palette derivation →
DDR-007; floor conformance → DDR-008. New design decisions mint a DDR at
occurrence; this log stays the execution-context view.

| Decision | Provenance |
| --- | --- |
| Hub stays Tailwind-mapped; plain path lives elsewhere | Card answer 2026-08-02 |
| Four demos with working theme detection + selection | Amendment message 2026-08-02 |
| Tailwind showcased; other varieties as further demos | Card answer (custom) |
| css-modules deferred | Follows from the four-demo set; reversible |
| Wow bar applies to each and every demo | "look at each and every demo and think 'wow'" |
| Off-horizontal: tilt VALUES owner-delivered (2026-08-03 card, verbatim in the committed napkin `b1b5431a7`); the W2.7 session confirms-and-records against the token shape — the former W2.7 off-horizontal session gate discharged 2026-08-05 | Point 9 (superseded in place, dated note) + the corrected attribution record at W0.4 + the 2026-08-03 card answer |
| Iteration LOCAL; Claude Design at owner-instigated moments only | Post-v1 ruling 2026-08-02 |
| Wow-first decomposition; W1 carries BOTH first-light checkpoints | Post-v1 ruling; FR0 applied |
| Tier components paint via kit classes; Tailwind = composition vocabulary on wrappers only | Seat verdict (Corsair, 2026-08-02) per round-1 E15 + EX15; §3 amendment records both shapes' roles (Director-ruled 2026-08-02) |
| Styled demo consumes the tier (second consumer) | Seat verdict (Corsair, 2026-08-02); reviewable at W5 open |
| Three identities: reachable-at-all-times reading | Seat verdict (Corsair, 2026-08-02); simultaneous surfaces fire item-14 first |
| Hub wow reading: architecture as-is, visual quality in scope | Seat reading (Corsair, 2026-08-02) — resolved at the W0.9 pre-read |
| Identity = authored configuration (manifest + emitter); Oak references its generated projection | Seat verdict (Corsair, 2026-08-02) per EX0/EX57; ADR-213 §2 dated amendment carries it |
| Contrast + colour-vision as orthogonal axes composing with polarity | Seat decision (Corsair, 2026-08-02) per EX28 — FLAGGED for owner/Director; carried by W2.1/W2.4 |
| Tier polymorphism: render/`asChild` slot, element union `button \| a` | Seat decision (Corsair, 2026-08-02) per EX24 |
| "Full component set" = full mapping-decision coverage with curated minting | Seat reading per FR9 — FLAGGED; owner card at W3.0 open (frontmatter gate 3) |
| Review topology: tiered fleet, zero-finding round before implementation | Ultracode directive 2026-08-02 |
| PARTITION: near-horizon (W0+W1) full depth + zero-finding bar; far-horizon (W2–W7) pointer stories, mechanism at story open; rounds-2/3 far findings conserved as story-open inputs | Owner card 2026-08-03 ("Yes, partition the work"); adjudication.v3.md §Ratification addendum |
| Goal architecture ratified (layer sovereignty / cost-of-change-is-the-product / expressive range spans structure + six derived goals); homed in the strategic node §Kernel additions | Owner card 2026-08-03 |
| FIVE demos; runtime identity switching = showcase + hub only; hub = "first instance of a Claude Design app ingested and reconstructed with our tools"; plain + styled = small proof demos; fifth = the layout-range ("css zen garden like") demo | Owner card answer 2026-08-03, verbatim in the strategic node |
| Cost-of-change value-frame: "enabling rapid innovation without compromising quality or stability" — both arms bind in every trade | Owner words 2026-08-03, relayed via Director event 7b00c9e5 |
| The hub demo's search must WORK wherever the hub is served (live backend configured; the landed implementation is complete and tested — the verified gap is env credentials only, per the demo README) | Owner word 2026-08-05, Director session a0892f: "the search in the hub demo should _work_" |
| W2.7 tilt values: PDS structural zero; Oak zero on interactive/content-bearing (decoration MAY tilt, structural zero if easier); EMC² leans in incl. ANIMATED tilts demonstrating motion vs no-motion — the former W2.7 off-horizontal session gate discharged | Owner card answer 2026-08-03 ~09:15Z, verbatim in the committed napkin (`b1b5431a7`); trued 2026-08-05 at the handover (Magnetar corroboration, first-hand napkin verification) |
| Item 14: the stated default REFUSED, not renewed; closure is a CHECKED property of the token surface (every theme scope re-declares each root property that transitively references an overridden one; emit-or-fail) — enforcement of the 2026-07-26 design-system invariant, never an alias-breadth choice; the frontmatter gate discharged, W0.2(b) carries the slice | Owner card word 2026-09-03 ("strict everywhere, all the time, and long-term architectural excellence, run it through the decision matrix via the principles.md file and the cognitive skills"); lens-resolved at the design-system-expert pass the same day |

## Relationships (the estate edges)

- **`design-system-integration` (backlog, 🟢 EXECUTING)** — the ADR-213
  §3-named executor. In THIS node's landing change, dated amendments on that
  plan re-home `ws-gate-extension` → W2.10, `ws-owned-component-tier` → W3,
  and `ws-fixtures-parity` → W3.0/W3.1, each naming this node as carrier —
  after which no cross-corpus blocking edge exists (EX75: `depends_on: []`
  is true, not a workaround); ADR-213 §3 takes the EX57 r3 cure in its
  dated amendment — the gate-extension OUTCOME stated as the ship condition
  for the first component export, the plan-name executor pointer deleted
  (permanent docs never point at plan nodes; W2.10 is recorded as carrier
  in this body only); `ws-hub-migration`'s stale status is trued. Stage B
  (`ws-stage-b-convergence`), `ws-views-direct-kit-css`,
  `pr2-consistency-check`, and the design-sync batch STAY owned there; this
  plan's demos bind only the kit CSS surface during the window, and W4.4
  consumes W2's emitted projections, never the export dtcg.
- **`productionisation-and-reuse` (backlog, DECISION-COMPLETE/QUEUED)** —
  owner of the demos-tier productionisation roadmap (EX71). The same landing
  change carries a dated re-homing amendment there: `ws0-topology-demos-tier`'s
  demos-tier boundary substance (gate parity + one-way boundary) is carried by
  W1.1/W5.1 here, named as such; `ws1-token-consolidation`'s disposition is
  stated in the same amendment (owned there unless the owner supersedes).
- **`mcp-137-design-system-semantic-merge` (ratified)** — adjacent
  conservation lane; no shared workstreams; its re-synced studio baseline is
  an input to W0.5's intake routing.
- **Strategic node companion edits — CLOSED (EX67/EX77 r3)**: the `serves`
  re-point to TOOLS-2 landed 2026-08-02 (`e3574388b`, dated fact); the
  review citation's report path (EX64) landed 2026-08-05 with the
  ratification stamp. No companion edit rides this node's landing change.
- **ADR obligations by workstream**: W0.3 → the new Demos Charter ADR +
  ADR-213 one-line pointer amendment (EX60) + the dated
  `.agent/directives/testing-strategy.md` amendment DEFINING the
  browser-suite test class
  (Playwright UI/a11y suites: `.spec.ts` under `tests/`, wired via
  `test:ui`/`test:a11y`) alongside the `e2e-tests/`/`*.e2e.test.ts`
  system-test class — completing the directive's own "Use Playwright for
  UI E2E tests" clause, which names the class without shaping it; the
  shape is landed practice at the showcase suites and the MCP app's
  visual suite (re-review round 2, finding 8); W1.1/W5.1 → ADR-041 demos rows
  - demos matrix row (EX73); W2.0 → ADR-041 design-row amendment (EX66);
  W2.1 → ADR-213 §2 identity-configuration amendment with the Oak clause
  (EX57); W2.2 → ADR-041 intra-design + ADR-213 §4 emitter-relation
  amendment (EX58); W2.3 → dated ADR-213 §4 amendment recording the
  codegen-into-kit relation (which workspace writes, which files are
  generated, how drift is gated) beside the standing no-runtime-import
  invariant (EX73 r3); W2.5 → ADR-147 §Standard + ADR-121 matrix
  amendments (the stale-CI truing itself rides W0.6 per EX66 r3);
  W2.1/W2.4 → dated amendment to
  `docs/governance/design-token-practice.md` (identity-authored trees, the
  axis model, the selector set — EX62 r3); W2.1/W2.5 → dated addition to
  `docs/governance/accessibility-practice.md` (forced-colours adaptation
  obligations + the demos-tier SC additions, the charter citing that home —
  EX62 r3); W3.3 → dated ADR-213 §4 amendment extending the kit's
  enumerated public surface to the identity runtime (EX73 r3); W3.0 →
  ADR-213 §3 scoped consumption-mechanism amendment (EX56,
  Director-confirmed) + the §3 landing-sequence set; W6.3 →
  ADR-217/MCP-448 routing. Each amendment is an acceptance line of the
  workstream that triggers it.

## PR-709

Closed 2026-08-02 with the adjudication recorded on the PR (dated fact). The
remaining acts are W6.3's: the by-file value-transfer comment and the MCP-448
routing of the ADR-217 delivery tail.

## Execution seat

Authored at the design seat Corsair hunts Surf (4d3282) per PDR-117; that
seat closed at the 2026-08-03 clear-run, and the executing seat is named at
the owner's implementation word (dated truing 2026-08-05). Per
the 2026-08-03 partition ruling, the zero-finding bar scopes to the
NEAR-HORIZON slice (W0 + W1): the node routes to execution when a SCOPED
re-review (near-horizon lenses only) closes with zero surviving findings AND
the owner's implementation word arrives; the ratification stamp completes at
that word (§Owner rulings). Far-horizon stories are re-reviewed per story at
their open, never as plan blockers. Lane-internal review dispatches
follow invoke-code-experts; cross-lane residue routes to the Director.

## Review record

- v1: tiered 31-agent fleet (run `wf_b02eb59a-e81`, ~2.89M subagent tokens) —
  FAILED (98 findings, 23 blocking). Corpus + adjudication:
  `.agent/reports/design/plan-review-2026-08-02/`.
- v2: authored by the executing seat 2026-08-02; every v1 finding
  dispositioned in `dispositions.v2.md`. Round 2 (fresh run
  `wf_368f0694-4a8`, ~3.26M subagent tokens) — NOT a zero round: 112 rows
  (`findings.v2.json`, `adjudication.v2.md`); zero false-repository-claim
  findings (the round-1 class is extinct — recorded deliberately in the
  adjudication).
- v2.1: authored by the executing seat 2026-08-02; every round-2 row
  dispositioned in `dispositions.v2.1.md`; round-1 ledger corrections in the
  dated appendix on `dispositions.v2.md`.
- Round 3 (fresh run `wf_121bcbac-abe`, ~3.33M subagent tokens) — NOT zero
  (113 rows, `findings.v3.json`) and the LOOP VERDICT was DIVERGING (98 → 112
  → 113 while the plan doubled; the generator: far-horizon mechanism depth).
  Adjudication + the owner's partition ratification: `adjudication.v3.md`.
- v2.2: this text, authored by the executing seat 2026-08-03 under the
  ratified partition and goal architecture. Near-horizon round-3 rows are
  cured in the W0/W1 text; far-horizon rows conserve via §Story-open
  pointer tables; the v2.1 far-horizon mechanism is frozen at
  `.agent/reports/design/plan-review-2026-08-02/v2.1-far-horizon-mechanism.md`.
- Ledger truing (2026-08-05, Director session a0892f): the intended
  `dispositions.v2.2.md` was NEVER AUTHORED — the 2026-08-03 cold pause
  froze before it (first-hand verified: absent from the filesystem, every
  branch, and all git history; the author session's own resume map in the
  `design-system-integration` thread record lists it as remaining work).
  It is honestly recomputable — both inputs survive (`findings.v3.json`
  and this text). Same-day supersession: at the owner's handover word
  the authoring seat, convened with the previous design team, authored
  the ledger FROM LIVING MEMORY (`dispositions.v2.2.md`, dated
  provenance in the file; comms event `997a8970`); the scoped
  near-horizon re-review now VERIFIES it row-by-row and runs its stated
  completeness sweep, rather than deriving cold. The same
  truing pass landed the resume map's enumerated residual edits (Quality
  bar rule 6 and the standing control note, the register naming, D1
  batching, the §Relationships EX57/EX62/EX67/EX73/EX77 rows, the
  pointer-table additions).
- Scoped re-review round 1 (2026-08-05, run `wf_ca61fcdf-52c`, 18 agents
  over pinned main `188a0c8a5`): NOT zero — 20 real findings (3 confirmed
  under adversarial verification, 17 beyond-cap adjudicated real first-hand
  at the design seat; 7 refuted with grounds read and accepted);
  `dispositions.v2.2.md` verified row-by-row (57/57, one phantom-D17
  citation nit) and its 113-row completeness sweep clean. Director
  adjudication same day (set accepted; the W0.2(b) declaration shape
  resolved); every finding cured in this change. Round record:
  `.agent/reports/design/plan-review-2026-08-02/re-review-2026-08-05.md`.
  Next review act at that entry's writing: the scoped re-review re-runs
  under the slope rule — superseded by the entry below.
- Scoped re-review round 2 (2026-08-06, fleet run `wf_bd16152b-ee8`, 15
  agents, 5 lenses, ~1.16M subagent tokens, over pinned `568160df7`): NOT
  near-zero — 17 raw → 9 REAL after adversarial verification and first-hand
  adjudication at the design seat (6 MATERIAL, 3 MINOR; 7 refutations'
  grounds read and accepted). SLOPE 20 → 9: shrinking but not near-zero, so
  per the slope rule THE LOOP STOPPED for structural diagnosis — no round 3.
  Structural diagnosis (seat-authored, Director-accepted): at least six of
  the nine are CURE-EDGE RESIDUE of round 1's point-instance curing —
  multiply-stated invariants cured at the cited statement but not the
  class, contracts cured separately leaving their intersection open, and
  deletion cures whose pointer-claimed re-homing never landed.
- Director adjudication (2026-08-06, directed event; mandate re-broadcast
  as event `a729c466`): round-2 result ENDORSED in full, two findings
  spot-verified first-hand. Disposition adopted: ONE COMBINED WINDOW — the
  nine cures applied CLASS-WIDE (grep-enumerate every statement of each
  touched invariant; verify every pointer's landing), folded WITH the
  already-confirmed W0.5 amendment set, closed by a scoped DELTA-VERIFY
  over the touched statements only — never a full round 3. The zero bar is
  preserved: the owner's IMPLEMENTATION WORD comes at the delta-verify's
  clean close. The heavier state-once-point-elsewhere refactor is a named
  post-first-light hardening pointer — recorded, not scheduled. The window
  remained SEALED until the owner's design work-word (the a729c466
  payload; Saffron→Civet handoff 2026-08-07 carries the seat chain).
- Combined window EXECUTED (2026-08-08, this change): the window opened at
  the owner's word ("Time to unseal, time to make progress"), Director
  ROUTE `b7e4b897`. The nine cures applied CLASS-WIDE with the statement
  enumeration run as an 11-leg read-only workflow (`wf_45de2e3c-68c`, 0
  errors) before any edit, and the confirmed W0.5 set folded (ten items,
  three instruments, the two process-ruling riders — the W0.5 story
  carries the ledger; W2.11 and W4.8 minted at pointer grade on the
  owner's "named story"/"minted story" words). Pre-authoring gate: the
  full Cricket quartet ×2 (5 ON-TRACK / 3 DRIFTING, all
  provenance-class), routed non-unanimous to the Director and adjudicated
  PROCEED with every dissent dissolved on primary sources. The durable
  round-2 record authors with this window:
  `.agent/reports/design/plan-review-2026-08-02/re-review-2026-08-06.md`
  (findings, refutation grounds, structural diagnosis, cure and fold
  accounting). The scoped delta-verify record is appended below at its
  close; the owner's implementation word cards from the Director's seat
  at the clean close.
- Scoped DELTA-VERIFY (2026-08-08, closing this window): round 1 — ten
  adversarial class-completeness legs + the same-reviewer leg
  (docs-adr-expert at opus) over the touched statements
  (`wf_034bd28a-b2f`, 11 legs, 0 errors) returned 6 blocking findings,
  adjudicated at the seat into 4 defect classes against the pre-committed
  disposition rule and ALL CURED in-window (the class-5 §Direction
  taste-calibration splice REVERTED — dated records stay untouched; the
  Lighthouse wiring landed in the W1.1 contract; the testing-strategy
  amendment joined W0.3's acceptance line; the framing-prose column joined
  the W0.1 census). Round 2 — the scoped same-reviewer re-verify over the
  six re-touched sites: CLEAN, zero blocking findings; three of its six
  non-blocking observations absorbed with the reviewer's own wording
  (W1.1's acceptance carries the Lighthouse leg; the testing-strategy
  cites carry the directive path; item 4 notes W2.9's inheritance), three
  recorded and routed in the round-2 record. Slope 6 → 0: THE ZERO BAR IS
  MET for the combined window. The next gate is the OWNER'S IMPLEMENTATION
  WORD, carded from the Director's seat.
