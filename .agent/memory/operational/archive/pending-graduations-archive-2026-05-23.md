---
archive_kind: pending-graduations-snapshot
archived_on: 2026-05-23
archived_by: Breezy Cresting Beacon via knowledge-preservation curation pass
archive_reason: 'Resolved 2026-05-23 pattern candidates plus older register entries whose durable homes now carry the reusable substance. Live register keeps queue/disposition pointers; this archive preserves the original candidate bodies.'
window_covered: '2026-05-23 pattern drain and older-entry target-exists sweep'
---

# Pending-Graduations Archive — 2026-05-23 Pattern Drain and Older-Entry Sweep

This archive preserves the original register bodies for pattern-shaped
entries and older resolved entries whose reusable substance now lives in
durable homes. The live pending-graduations register keeps concise
disposition pointers so unresolved candidates remain visible without
duplicating matured bodies.

## Entries

### Reciprocal cross-agent reviewer dispatch pattern — empirically validated (n=8 catches)

Archive note: the durable pattern home normalises this evidence label to
`n=9 substantive review findings` so the third-axis Stormbound verdict
is counted consistently. This archived title preserves the original
register wording from the first-out closeout entry.

`[CANDIDATE: reciprocal-cross-agent-reviewer-dispatch | captured: 2026-05-23 | source: napkin+pattern-emergence | target: pattern:reciprocal-cross-agent-reviewer-dispatch (memory/active/patterns/) | trigger: n>=3-validation | size: M | status: graduated]`

The session produced **8 substantive defect catches** via cross-agent
post-execution reviewer dispatch. The pattern: agent A lands cycle X,
agent B dispatches a reviewer (code-expert / type-expert /
docs-adr-expert) on X's diff, returns verdict via directed comms; A
absorbs the findings in a follow-up `chore(scope): absorb <reviewer>
post-exec on <SHA>` commit. The pattern then runs in the other
direction.

Worked instances this session:

- SVW -> Sparking (3 catches absorbed): t13a TSDoc forward-reference
  -> `8f253280`; t1 `RankOptions.context` 3 plan-vs-implementation
  divergences (focus enum 4/6 + missing `pp_percentage` + `max_results`
  mis-nested) -> `9425faa0`; WS2.2 literal-object quads partial
  C2-deviation -> `361cae35`.
- Sparking -> SVW (3 catches absorbed): registration tests were
  schema-audit not behavioural; KS5 phase-resolution coverage gap;
  `m.content.text` access unguarded -> `11c05ced`; plus SHA-pinned
  TSDoc reference rot risk.
- Foamy -> SVW (1+ catches): TSDoc line-range references that would
  rot when strategy doc edits -> absorbed in-touch at SVW's t9 commit.
- SVW -> Foamy (1 catch surfaced): WS4.5 `depends_on` array drift +
  stale `Last Updated` header on WS4.4 amendment.

Plus the architecture-expert-betty self-dispatch on Sparking's t1
(`5ec02aec`) returned independent findings (relocate re-exports to
dedicated `public/evidence-corpus.ts` subpath) absorbed cleanly,
confirming the pattern also works as self-dispatch when the reciprocal
agent's bandwidth is constrained.

Strong empirical evidence; pairs naturally with the existing
`invoke-code-experts` rule + executive-memory invocation matrix. Pattern
file at
`.agent/memory/active/patterns/reciprocal-cross-agent-reviewer-dispatch.md`
is the natural home: it captures the WHEN/HOW separately from the
WHO/WHAT enumeration in the rule + executive-memory.

---

### Untracked-WIP whole-tree lint-blocker recurring pattern (3 instances this session)

`[CANDIDATE: untracked-wip-whole-tree-lint-blocker | captured: 2026-05-23 | source: napkin+pattern-emergence+comms-log | target: pattern:untracked-wip-whole-tree-lint-blocker (memory/active/patterns/) | trigger: n>=3-validation | size: S | status: graduated]`

Three instances this session of the failure mode "agent A's untracked
work-in-progress with lint errors blocks agent B's pre-commit hook":

1. Foamy's untracked
   `packages/core/graph-core/src/graph-view/index.ts` (8 ESLint errors)
   blocked Sparking's t20 first commit attempt at 22:00Z; Foamy cleared
   via the honest-restructure pattern (module split) at 22:03Z.
2. Sparking's untracked
   `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/freshness.ts`
   (4 TSDoc errors + 1 `consistent-type-assertions` error) blocked SVW's
   t10 first commit attempt at 22:25Z; Sparking cleared via the
   honest-restructure pattern (binding-test deletion) at 22:47Z, helped
   by Foamy's directed diagnostic at 22:45:56Z.
3. Sparking's untracked WS2.3 turtle parser had prettier format errors
   blocking subsequent pushes; Shade landed `644c937b` as a peer-format
   cure at 06:13Z 2026-05-23.

**Working cure**: directed diagnostic from peer with concrete fix shapes
(Foamy -> Sparking with three named fix shapes at 22:45:56Z is the
canonical worked instance). The cure is collaboration via comms, not
architectural change.

Adjacent existing pattern surface: `local-broken-code-never-leaves` rule
and `all-quality-gates-blocking-always` doctrine define the WHAT; this
candidate names the recurring WHEN (untracked WIP) and the HOW (directed
peer diagnostic). Pattern home at
`.agent/memory/active/patterns/untracked-wip-whole-tree-lint-blocker.md`
slots beside those rule references.

---

### Honest-restructure-over-band-aid pattern confirmed across 2 agents in 2 cycles

`[CANDIDATE: honest-restructure-over-band-aid | captured: 2026-05-23 | source: napkin+pattern-emergence | target: pattern:honest-restructure-over-band-aid (memory/active/patterns/) | trigger: second-instance | size: S | status: partially-graduated]`

When a quality-gate fires mid-authoring, the team's emergent response was
honest architectural restructure rather than a band-aid to pass the gate.
Two worked instances this session:

1. Foamy split WS4.4 `graph-view/index.ts` into three modules
   (`index.ts` barrel + `types.ts` + `interface.ts`) when it hit the
   workspace `max-lines: 250` ceiling, rather than compress prose to
   pass. The split exposed natural conceptual boundaries: architectural
   excellence, not a workaround.
2. Sparking deleted the `eef-freshness-binding.unit.test.ts` file
   entirely per `no-conditional-tests.md` diagnosis #3
   ("External-resource gating"), rather than use a file-existence guard
   via `describe.runIf`. The cure was to defer the binding test to
   t2-zod-loader's cycle, when the data file actually lands: honest plan
   amendment, not papering over.

Adjacent existing surface: `local-broken-code-never-leaves` rule +
`all-quality-gates-blocking-always` doctrine establish the principle;
this pattern names the **response shape** when those gates fire
mid-authoring. Pattern home at
`.agent/memory/active/patterns/honest-restructure-over-band-aid.md`.

The pattern home remains `status: emerging`; promotion to `proven` awaits
a third-instance observation in a later session.

---

## Older-entry target-exists sweep - 2026-05-23

This section preserves older register bodies whose reusable substance now
lives at verified durable homes. The live register keeps only concise
disposition pointers after this sweep.

### Different-lens reviewers catch different gaps - multi-reviewer dispatch is not redundancy

Archive note: durable home verified at
`.agent/memory/active/patterns/different-lens-reviewer-divergence.md`.

- 2026-05-11; **Different-lens reviewers catch different gaps -**
  *Graduated 2026-05-11 (Fronded Flowering Seed consolidate-docs pass)*
  to repo-local pattern instance at
  `.agent/memory/active/patterns/different-lens-reviewer-divergence.md`.
  Substance-ripeness evidence: graduation-candidates-drain session ran
  6 multi-reviewer dispatches (3 per phase) and observed zero
  finding-overlap across pairs - each lens (betty/fred boundary +
  principles, assumptions-expert premises, docs-adr-expert documentation
  quality) caught structurally distinct gaps. Original capture below
  preserved for provenance:
- 2026-05-11; **Different-lens reviewers catch different gaps -
  multi-reviewer dispatch is not redundancy** (Dusky Masking Cloak
  2026-05-11, observed during graph execution-prep step 2 Inc.1
  decomposition).
  `[captured: 2026-05-11 | source: napkin-2026-05-11 | target: candidate-pattern:.agent/memory/active/patterns/ OR amend:invoke-code-experts | trigger: second-instance OR owner-direction | size: S | status: pending]`
  Opener prescribed `architecture-expert-betty + code-expert` for Inc.1
  decomposition review. Betty returned CLOSED with a minor follow-up
  (WS4.2 earliest-start nuance - boundary-correctness lens). `code-expert`
  independently surfaced a structurally distinct finding: WS2.1+WS3.1
  scaffold pair is NOT parallel-safe (root-file write conflicts on
  `pnpm-workspace.yaml`, root `tsconfig.json`, root `package.json`) -
  file-conflict-surface lens. The plan body had masked this by grouping
  WS2.1+WS3.1 alongside WS2.2+WS3.2 / WS2.3+WS3.3 in the "parallel-safe
  pairs" list. Pattern shape: *"when reviewers operate with different
  lenses (boundary correctness vs file-conflict surface), each surfaces
  gaps the other does not see; treat multi-reviewer dispatch as
  multi-lens coverage, not redundant validation."* Already partly captured
  in 2026-05-07 napkin "two reviewers converged on the same BLOCKER" -
  that was about convergence as deeper-signal marker; this is the
  divergence corollary. Graduation-target: candidate pattern note or
  amendment to `invoke-code-experts` doctrine. Trigger: second instance
  OR owner direction.

### Fitness validator output should print the non-reactive-response discipline reminder

Archive note: durable homes verified in the practice-fitness formatter
and ADR-144 amendment log. The live register now keeps only a concise
graduated pointer.

- 2026-05-09; **fitness-validator output should print the
  non-reactive-response discipline reminder inline at non-healthy
  zones** (doctor-safe-merge tooling-feedback 2026-05-07; corpus
  recurrence confirmed 2026-05-09).
  `[captured: 2026-05-09 | source: historical-napkin-synthesis-2026-05-09 | target: tool-amend:scripts/validate-practice-fitness.ts | trigger: tooling-implementation OR owner-direction OR second-instance | size: S | status: pending]`
  Three corpus-window instances of agents reflexively trimming
  substance when fitness signals fire (Embered 05-06, Pelagic 05-07,
  doctor-safe-merge 05-07) prove the doctrine is doctrine-resistant
  under context pressure. Reading the rule once is verifiably not
  enough. The cure: fitness validator output (`pnpm
  practice:fitness:informational`) should print the discipline
  reminder text inline at every non-healthy (`soft` / `hard` /
  `critical`) zone - *"Preserve substance first. Do not delete, trim,
  compress, or weaken memory or Practice Core content to make this
  report greener. Treat fitness as a routing signal: home, graduate,
  split, refine real redundancy, review the limit, or open an
  explicit remediation lane."* This is sibling cure to the
  lifecycle-aware fitness model (see entry above); both graduate
  together. Source-surface:
  [`archive/napkin-2026-05-07-doctor-safe-merge.md`](../../active/archive/napkin-2026-05-07-doctor-safe-merge.md)
  §Practice-tooling-feedback `agent-tools:practice-fitness`. Source
  finding:
  [`historical-napkin-synthesis-2026-05-09.md`](../../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F1. Graduation-target: `scripts/validate-practice-fitness.ts`
  output amendment to print discipline-reminder when any zone is
  non-healthy. Trigger: tooling-implementation OR owner direction.
  Status: pending.

### Spine drift via comprehensive cataloguing

Archive note: durable home verified at
`.agent/memory/active/patterns/comprehensive-cataloguing-drift.md`,
which preserves the spine-specific worked instance as part of the broader
anti-pattern.

- 2026-05-07; **spine drift via comprehensive cataloguing - when a
  coordination spine starts enumerating "things adjacent that the
  spine doesn't ship", the spine has shifted from coordination tool
  to roadmap and is over-claiming authority** (Windward Darting
  Horizon, owner correction during MVP-arc spine authoring; same
  session as the sequence-or-admit-not-doing doctrine).
  `[captured: 2026-05-07 | source: owner-direction | target: pattern:patterns/spine-drift-via-comprehensive-cataloguing.md | trigger: second-instance | size: M | status: pending]`
  Owner correction: *"the NC work is explicitly NOT part of the MVP,
  you have clearly become confused"*. Sequence: I authored an MVP-arc
  spine, then at the doctrine correction (entry above) I treated the
  NC SKOS taxonomy plan as an "out-of-arc item" the spine should
  sequence - generating a `## Out-of-MVP-Arc Items` section + per-
  slice resolution todos + `mvp_arc_sequencing` YAML field on the NC
  plan. All wrong. The NC plan was never IN the spine's scope; "cuts"
  and "out-of-arc resolution" were category errors. The spine should
  track ONLY what's IN the spine's commitment; adjacent plans own
  their own sequencing. Source-surface: napkin
  [`napkin.md § 2026-05-07 Surprise - boundary error: spine should not track non-MVP plans`](../../active/napkin.md).
  Graduation-target: anti-pattern in `.agent/memory/active/patterns/`
  named `spine-drift-via-comprehensive-cataloguing.md` (polarity:
  anti-pattern); template signal for spine authoring: when tempted to
  enumerate "things outside the spine" inside the spine, stop and ask
  whether the spine has become a roadmap. Trigger: second-instance
  observed (could come from any coordination-spine plan author).
  **Status: partially graduated 2026-05-09** - historical-napkin-synthesis
  found three corpus-window instances (spine, reviewer-pass, rule-extension)
  and authored the broader anti-pattern as
  [`comprehensive-cataloguing-drift.md`](../../active/patterns/comprehensive-cataloguing-drift.md).
  This entry's spine-specific instance evidence is preserved by the broader
  pattern's spine-instance section; entry remains as historical capture.
  Source: [`historical-napkin-synthesis-2026-05-09.md`](../../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F2.

### Inter-agent communication is a first-class coordination primitive

Archive note: durable homes verified in `agent-collaboration.md` and the
coordinated-session cadence in `use-agent-comms-log.md`.

- 2026-05-05; **Inter-agent communication is a first-class coordination
  primitive** (Lacustrine Navigating Rudder, owner-named after the
  Gnarled-Lacustrine sub-2-min-roundtrip resolution).
  Source-surface: user-memory `feedback_inter_agent_comms_first_class.md`,
  napkin §Surprise 4 (this date).
  Graduation-target: extend [`.agent/rules/use-agent-comms-log.md`](../../../rules/use-agent-comms-log.md)
  to make explicit the workflow ("when another agent's state blocks
  yours and they may still be active: post comms-event with deadline
  - default-action; poll briefly; escalate to owner only if no
    response inside the deadline window"). Possible PDR candidate
    encoding the more general principle: agent-to-agent coordination
    is direct unless the decision is owner-owned. Possibly an ADR
    amendment to ADR-150 (Continuity Surfaces) since comms live
    in that surface.
    Trigger-condition: second instance of agent-to-agent coordination
    resolving without owner mediation (this Gnarled-Lacustrine round
    is the worked example; second instance graduates from feedback to
    rule).
    Status: `pending`.

### First-question at every elaboration boundary

Archive note: durable rule verified at
`.agent/rules/re-apply-first-question-at-elaboration-boundaries.md`,
with references from governance and distilled surfaces.

- 2026-05-04; **first-question at every elaboration boundary, not
  only at plan-author time** (Verdant Sprouting Leaf, surfaced
  during /jc-consolidate-docs napkin extraction; substance from Salty
  Navigating Jetty 2026-05-03 session-spiral diagnosis): PDR-043 cue 3
  ("first-principles framing question - what would the path look like
  with no closure pressure?") is currently scoped to "when proposing
  any change". The sharpening from Salty's session: the cue must fire
  at *every elaboration boundary* - plans-creating-plans, arc-
  justifying-arcs, prerequisite-justifying-prerequisites. The three-
  day observability spiral (2026-05-01 through 2026-05-03) was
  internally coherent at every plan-authoring step but never re-asked
  the first-question at the level of *should this whole arc exist?*.
  Salty's diagnosis: *plan-following can disguise rush-impulse if
  the principles' first-question is not re-applied at every
  elaboration boundary*. Source-surface: napkin 2026-05-03 (Salty)
  §"Session-spiral diagnosis"; complementary to PDR-018 §Beneficial
  prerequisites must not block (which provides the prerequisite-
  classification cure) and PDR-043 cue 3 (which provides the per-
  change cure but not the per-elaboration-boundary cure). Graduation-
  target: PDR-043 amendment §"Cue 3 fires at every elaboration
  boundary" OR PDR-018 amendment §"First-question discipline at
  elaboration boundaries". Trigger-condition: second instance OR
  owner direction. Salty's session is the first instance; Tidal
  Flowing Reef's "framing-trap" entry on the same date is closely
  related but expresses the same shape (option A vs option B between
  two violations is the wrong frame; the question is *how do we adopt
  our new insights?*). Status: pending - awaiting second instance or
  owner direction. **Enforcement note (per PDR-038 §2026-05-04
  amendment)**: at maturity, doctrine without enforcement is
  liability. The structural enforcement candidate for this principle
  is a planning-discipline check at plan-authoring time + plan-
  reviewer dispatch - both of which would naturally extend the
  doctrine-scanner CLI work proposed in
  `future/memetic-immune-system-and-progressive-disclosure.plan.md`.
