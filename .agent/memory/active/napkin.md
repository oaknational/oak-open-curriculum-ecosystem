---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-06-01 — napkin rotation (Moonless Lurking Dusk, dedicated knowledge-curation)

Rotated the prior napkin (759 lines, critical zone) after fully processing it.
Verbatim source preserved at
[`archive/napkin-2026-06-01-moonless-curation.md`](archive/napkin-2026-06-01-moonless-curation.md).
This archive is the source record, not the completion proof; the disposition is
below.

### Rotation disposition (extract → merge → prune → archive)

- **Graduated to `distilled.md`** (three durable cross-session lessons not yet
  homed): one-law-three-faces (derive-from-source / seams-compose / state-what-is
  are one principle); opening-statements-and-handoffs-teach-by-their-form; and
  independent-eyes-catch-what-self-review-cannot (+ delete-fake-surfaces vs
  full-removal scoping).
- **Graduated to a rule** (separate pass this session): the cite-or-tag
  corpus-grounding discipline → `.agent/rules/eef-corpus-grounding.md`
  (trigger-loaded). The conservation/no-tombstones family was already a rule
  (`no-tombstones-for-removed-ideas`).
- **Already represented (duplicate)** — left in the archive, not re-homed: the
  EEF-execution specifics (old-list correction, invocation policy, D3 surface
  direction, value reframe, D2 metacognition, replacement discipline, seam
  taxonomy) live in the live EEF plan and `pending-graduations.md`; the comms-CLI
  frictions (heartbeat typed args, `claims close --help`, `--body-file`, list
  parsing) live in the collaboration-state UX backlog in `pending-graduations.md`;
  dependency-update/knip notes and comms-event write-integrity notes live in the
  committed plan + `principles.md`; push-proves-gates-green is in platform memory.
- **Known/recurring (operational)** — not new knowledge: the recurring
  shell-quoting-backticks miss is a standing personal-discipline note, already
  recorded multiple times.
- **Owner-surfaced graduation candidates** (in this session's closeout): the two
  `distilled.md` PDR/clause candidates above, plus the general form of
  `harvest-from-deleted-is-contamination-vector` as a possible `verify-dont-trust`
  amendment.

### Insights from the curation pass

- **A "folded open question" can dissolve on contact with the infrastructure.**
  The cite-or-tag graduation carried a folded question — "how does a not-always-on,
  domain-scoped rule live, given the rules tier is always-on by construction?" — that
  read as real design work. The premise was simply false: `RULES_INDEX.md` already
  has a `Classification` column and 13 rules were already `trigger-loaded`. Before
  treating a folded question as a design problem, check whether the existing
  infrastructure already answers it. Most of the "design" was reading one table.
- **Graduate by consolidating, not by minting one rule per candidate.** Two
  owner-approved candidates (value-trace-before-building, fingerprint-data-before-
  shaping) were two faces of one discipline; authoring two rules would have been the
  fragmentation `new-rule-vs-pdr-clause` warns against. One rule with two facets is
  the cleaner home. The graduation count is not the goal; the home-fit is.
- **Owner-gated ≠ park-forever (owner reframe).** Most owner-gated register items
  have owner-direction as their co-trigger — and a dedicated consolidation session
  with the owner present is the *only* venue where that trigger can fire. Treating
  them as "waiting on an external event" parks them indefinitely. Now doctrine in
  `consolidate-docs` step 7: walk owner-gated items with the owner during the pass.
- **Archive-disposition has depth, and honesty is naming which depth you reached.**
  Napkin rotation dispositioned durable lessons item-level (→ distilled/rule) but the
  EEF-execution bulk at category level ("resident in the live plan / pending-
  graduations"), not line-by-line verified against each home. The verbatim archive is
  intact so nothing is lost — but the honest report names the category-vs-item
  distinction rather than implying every line was proven homed.

## Session: 2026-06-01 — graph-estate plan currency + graph-ingest decontamination (Coppery Warming Flame / `9a5cc3`)

Focused doc-edit session: made `graph-estate-consolidation.plan.md` post-D2
accurate + crystal-clear, decontaminated the two surviving `graph-ingest`
`gate-1a` comments, ran handoff + session-completion consolidation.

### Surprise — overclaimed "residue cleared" because it fit the narrative

In the new "Inbound from EEF D2" plan section I wrote the code-level gate residue
was "cleared". A clean grep then found two genuine `gate-1a` comments still live
in `graph-ingest` (not eef-strands, untouched by D2). Caught by my own
metacognition pass before it reached the owner. Root: asserted a convenient state
without the one-command check. Instance of `ground-convenient-claims` (platform
memory) — grounding drops exactly where a claim fits the thesis.

### Surprise — hedged a determinable fact back to the owner

Asked for a do-now subset, I wrote "preceded by Increment 1 *if* t1's verdicts
aren't yet settled" — a conditional branching on a checkable fact. The owner
caught it ("are they or not?"). One status-read (t1 `pending`; six files still in
their lanes) answered it: not settled. A conditional on a determinable fact is a
hedge AND a `no-responsibility-passback` — it hands the fact-finding back to the
owner. Instances of `present-verdicts-not-menus` / `no-hedging-vocabulary`.

### Insight — convenient state-claims need the one-command check at assertion time

Both failures are one shape: asserting a convenient state ("cleared" / "settled")
without running the cheap check (grep / status-read) that confirms or refutes it.
The check was one command away both times. The "cleared" overclaim I self-caught
in a later metacognition pass; the "if settled" hedge slipped to the owner one
reply later — so the cheap-check reflex must fire at *assertion time*, not only at
a subsequent reflective pass: a metacognition pass is a backstop, not the primary
guard. Pairs with `ground-convenient-claims` and the
`independent-eyes-catch-what-self-review-cannot` entry in `distilled.md`.

## Session: 2026-06-01 — EEF review + a forbidden-syntax misstep (Dawnlit Dancing Satellite, `b91f7b`)

- **type-check is cast-blind; lint is the only guard — and self-selecting a gate
  subset is how false-greens happen.** I wrote a derived structure using
  `Object.keys` and two `as` casts, ran `type-check` and `test` (both green), and
  called it verified.
  The cast *silences* tsc by design, so type-check could never catch it; the strict
  ESLint config (`consistent-type-assertions: never`, `no-restricted-properties` on
  `Object.keys` → `typeSafeKeys`, `no-explicit-any`) would have on the first run. The
  rules work; I didn't run them. **Run `lint` after every edit, not as a later gate,
  and never treat a green type-check as verification when casts are in play.**
- **Reaching for `as` / `Object.keys` / a non-parsing type-predicate is a STOP
  signal, not a tool choice.** It means type information was thrown away upstream —
  the shape is wrong. The forbidden syntax in v1 was a *symptom* of choosing a
  runtime keyed `Record` over known data; the type-level projection (`keyof`,
  indexed access, mapped types — here `FloorFieldName = keyof EefStrand`) needs none
  of it. In a corpus-as-type-authority codebase the default for "derived structure
  over known data" is type-level; dropping to `Object.keys`+cast imports a
  generic-JS reflex the whole architecture exists to forbid (doctrine-by-analogy).
- **Apply a stated principle as a PRE-WRITE screen, not a post-write patch.** The
  owner's projection-purity principle was complete *before* I wrote a line; it was
  enough to deduce the runtime-record shape was wrong. I built it anyway and absorbed
  three corrections doing work the principle should have done up front. Pairs with
  the `convenient state-claims` insight above: the screen fires at write time.
- **Product rigor is unconditional, even for code written "in support of" a review.**
  I under-applied rigor because I framed the module as a side-artefact to a doc
  review. A review mandate is not licence to inline under-gated product work —
  surface it as a scoped task instead.
- **Build the projection when its consumer exists.** `field-cardinality.ts` may be
  premature: its only consumer (D6 optionality) is pending (PDR-058 / Decision 6).
  "Construct all useful projections" (owner) and "absent until a real consumer needs
  it" (plan) tension out to: the durable fact (floor = `keyof EefStrand`) is true
  regardless, but exporting the module ahead of D6 is a candidate, not settled.
