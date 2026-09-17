---
id: shared-construct-extraction-pilot
node_type: delivery
name: "Shared-construct extraction pilot: the fleet workflow-stage scaffolding"
overview: "Run the identify→factor→test→document→land chain once at n=1: extract the twice-implemented fleet workflow-stage scaffolding into one assured package, making the worked pipeline the template for every later extraction."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-06
ratified_where: "Owner card at the Director seat 2026-08-06 (card answer: 'Ratified — stamp and merge'), relayed to the executing seat as directed comms event 827985ad-a863-423d-8b79-c29bb8c9197d; PR #786"
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets:
  - MCP-532
depends_on: []
owner_gates: []
last_updated: 2026-08-09
---

# Shared-construct extraction pilot: the fleet workflow-stage scaffolding

## Goal

One genuinely shared construct is identified, factored into a package,
tested, mutation-checked, documented, and landed — the owner's whole value
chain exercised once, end to end. The extraction consolidates the fleet
workflow-stage scaffolding that `agent-tools/src/corpus-analysis/workflows/`
and `agent-tools/src/restatement-audit/workflows/` each implement (the
second knowingly mirrors the first, with a cross-feature deep import and a
recorded surviving duplicate declaration — a self-documented second
consumer under `consolidate-at-second-consumer`). Because that scaffolding
is the estate's executable fleet-encoding substrate, the same extraction
directly improves the ease of starting well-designed agent fleets. The
worked pipeline — census, promotion-frame assessment, extraction, assurance,
documentation, landing — becomes the template and the empirical test of the
foundational building-block promotion frame, at a fraction of the cost of
completing the estate-wide instrument first.

## Decisions already made (what makes this decision-complete)

- **Candidate**: the workflow-stage scaffolding (verified first-hand
  2026-08-06; both directories share `stage-io`, `agent-schemas`,
  `prompts`, `run-inputs`, `run-data`, `stage-guards`, per-stage meta and
  workflow entries, and an esbuild `build/` harness, sharing only
  `parseWithSchema` from `agent-tools/src/core/schema-parse.js`).
- **Placement procedure**: the foundational building-block promotion frame's
  ten gates, assessed in the extraction PR with evidence. Named default:
  `packages/libs/` (the scaffolding carries runtime orchestration and
  esbuild bundling concerns, which the frame places in foundation
  libraries, not `packages/core/`). Core placement is taken only if the
  gate evidence contradicts the default.
- **Assurance** (per the excellence contract, testing-strategy, and
  validation-strategy): TDD with atomic landings; a hand-mutation check on
  every gap-closing test (prove the guard bites — mandatory, zero
  integration cost); ONE report-only Stryker pass on the new package
  reusing the canary-proven configuration pattern (self-contained
  `vitest.config.stryker.ts`, explicit unit/integration selection,
  `thresholds.break: null`, config passed as a positional argument) —
  survivors are classified (equivalent / unreachable / contract gap),
  never cured with mutant-targeted assertions (owner doctrine 2026-08-05);
  canonical TSDoc, a progressive README carrying the package's removal
  condition, dependency-boundary enforcement, and the packed-form smoke the
  published-package class requires.
- **Consumer migration**: both feature directories move onto the package in
  the same landing as the extraction (atomic relocation — no bridge, no
  mirror left behind; the cross-feature deep import and the duplicate
  declaration are removed, not preserved).
- **Feeder**: a bounded overlap-probe shortlist pass (at most eight
  read-only probes over the obvious duplication surfaces) produces
  candidates #2/#3 with file:line evidence; `utf16-order` (flagged by the
  estate review itself) is pre-queued. The landscape output is a routing
  artefact under tiered sight — candidates are verified first-hand before
  any further extraction is proposed.
- **Conscience checks**: the FULL Cricket suite — two quartets per moment
  (normal + adversarial stances across judgement-low / judgement-medium /
  judgement-high / procedure-xhigh), the Fable leg included per the
  owner's 2026-08-06 embargo lift — runs at four named moments: (1) after
  the plan node lands, before the census; (2) at the extraction-contract
  freeze (end of the census, before build); (3) at the extraction PR's
  merge boundary (after assurance); (4) at pilot close. Every run is
  recorded in the cricket tally at occurrence; divergence is adjudicated
  at the seat with the split routed per doctrine. Fable subagents are
  available generally where the leg's judgment weight warrants them;
  tier-per-leg economics continue to govern fleet composition.

## Mechanism

Pilot the pipeline, not the parts. A single bounded extraction surfaces
every unknown in the identify→land chain on a cheap worked example, makes
the promotion frame empirical, and produces the template later extractions
follow. The scaffolding candidate compounds this: goal one and goal three
of the owner's ask are served by one landing. Instrument-first sequencing
is explicitly replaced by extraction-first: the estate-review instrument
rests at its green preserved state as the reproducibility layer for any
later adjudication-grade census; its knip ignore keeps its recorded
removal condition.

## Todos (each slice a single-story PR; PDR-132 default budget ≤2 review rounds)

0. **STOP (discharged at plan landing).** The authoring seat wrap-closed
   (loss captures conserved: step-6 review reports onto PR #734, canary
   mechanics report into its worktree, the 2026-08-06 owner rulings —
   Fable embargo lift, full-Cricket moments — onto comms and memory) and
   compacted before execution; the continuation re-grounds and resumes
   here.
1. **Land this node** (docs PR; owner stamps ratification on sight).
   **Cricket moment 1** fires after the landing: two full quartets frame
   the pilot before any census work.
2. **Hygiene by sequence, not choice** — three small, independent slices:
   a. Commit the green security-cure batch onto PR #734 (the batch sits
      uncommitted and gate-green in the lane worktree with this slice as
      its named landing gate; one commit, bot-token HTTPS transport),
      then flip the PR ready. Gate: the owner's normal PR review ratifies
      the merge.
   b. Adjudication read of the fleet-topology report, then land it as a
      docs PR with its probe-evidence JSON (its §6 encoding proposals are
      this pilot's design input; its scaffolding finding is this pilot's
      candidate evidence).
   c. Consume the mutation canary's banked evidence in this pilot's
      assurance step — capability evidence, not a rollout. *(Amended
      2026-08-09: the ratified `mutation-testing-core-canary` node owns
      the completion steps this item previously restated — including a
      `stryker run stryker.config.ts` script fix its `.mjs` mechanism
      has since replaced. Executed 2026-08-09: full pass, survivor
      ledger, and reports banked at
      `packages/core/type-helpers/mutation-evidence/`, landing via
      PR 807.)*
3. **Duplication census** (read-only, one sitting): enumerate the shared
   responsibilities across the two scaffolding directories precisely
   (shared vs domain-specific member by member), run the ten promotion
   gates, record the placement decision with evidence. Output: the
   extraction contract in the PR description — no separate report.
   **Cricket moment 2** fires at the contract freeze, before any build.
4. **Extract and migrate** (the core slice, possibly split into 2–3
   atomic landings if review budgets demand): the package with its tests
   first (Red), both consumers migrated in the same landing as each
   moved responsibility, hand-mutation checks proven, boundaries enforced,
   TSDoc/README complete, packed-form smoke green.
5. **Assure**: the single report-only Stryker pass on the new package;
   survivor classification recorded in the PR; the estate's first real
   mutation evidence for an extracted construct. **Cricket moment 3**
   fires at the extraction PR's merge boundary.
6. **Feed forward**: the bounded shortlist probe pass; candidates #2/#3
   recorded with evidence in the thread record; promotion-frame and
   fleet-pattern learnings folded into their homes as they are
   encountered (two-speed learning riding the delivery). **Cricket
   moment 4** fires at pilot close, alongside the closing wrap.

## Acceptance criteria (each with a proof — required)

- One package exists containing the consolidated scaffolding; both feature
  directories consume it; the cross-feature deep import and the duplicate
  `DerivedJsonSchema` declaration are gone — `repo-safe`: depcruise/eslint
  boundary gates green, grep proves no `../../corpus-analysis/workflows`
  import remains under `restatement-audit/`, and both features' existing
  workflow suites pass unchanged.
- The package meets the excellence contract — `repo-safe`: TSDoc/typedoc
  clean, README present with removal condition, packed-form smoke green,
  every gap-closing test's hand-mutation check recorded in the PR, one
  Stryker report banked with every survivor classified.
- The promotion-frame assessment is recorded with evidence and a named
  placement decision — `owner-held`: the owner reads it in the extraction
  PR; owner sight ratifies the placement.
- The hygiene slices are landed or dispositioned: PR #734 ready and
  owner-reviewed; the topology report merged; the canary closed with
  banked evidence — `repo-safe` for the landings, `owner-held` for the
  #734 merge ratification.
- Candidates #2/#3 exist with first-hand-verified evidence — `repo-safe`:
  thread-record entries citing file:line.
- All four Cricket moments ran as full two-quartet suites and are
  recorded in the cricket tally at occurrence, with any divergence
  adjudicated and routed — `repo-safe`: the tally rows name the four
  moments and their verdicts.

## Out of scope

- The estate-wide deterministic census and the estate-review instrument's
  remaining contract slices — the instrument rests at its green preserved
  state; the knip ignore's removal condition (the estate run landing)
  stands unchanged; reopening is a separate owner decision.
- Stryker rollout beyond the single pilot pass — a later decision consuming
  this pilot's and the canary's banked evidence.
- The octopus and slime-mould fleet models — owner-named for another time;
  homed in the fleet-topology report's arrangements-to-try.
- New Linear tickets before the embargo lifts (2026-08-10) — the `tickets`
  field is backfilled at the lift.
- Any product/app surface change — this pilot lives entirely in
  agent-tooling and package space.
