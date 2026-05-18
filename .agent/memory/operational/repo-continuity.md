---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: 'Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here'
merge_class: index-narrative-tables
---

# Repo Continuity

Repo-level operational index for active thread state. Historical session-close
prose was archived verbatim during the 2026-05-12 consolidation pass at
[`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md).
Earlier archives remain under [`archive/`](archive/).

## Current State

- Current branch: `feat/mcp-graph-support-foundation`.
- **2026-05-17 (Solar Orbiting Asteroid)**: cross-thread program
  Interrupt Log entry 2026-05-14 #2 (upstream Oak API schema
  adoption + gate-green cleanup) **resolved at `ee41cd49`**;
  `pnpm check` fully green for the first time this branch
  (100/100 turbo tasks). Seven commits this session, each
  unmasked the next downstream gate as its upstream gate cleared:
  knip config gap → practice-fitness barrel slim →
  collaboration-state barrel slim → `test-coverage-review-lens`
  pattern → e2e file deletions (18 tests, duplicates of existing
  unit/integration coverage) → two pre-existing circular type
  imports broken (graph-core/jsonld and agent-tools/tui) →
  program plan interrupt closure. Step 2 (singleton-lane
  remediation) opens next session.
- The branch-primary lane remains `connecting-oak-resources`; its detailed
  state lives in
  [`threads/connecting-oak-resources.next-session.md`](threads/connecting-oak-resources.next-session.md).
- The Practice/tooling substrate lane for this branch remains
  `agentic-engineering-enhancements`; its detailed state lives in
  [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md).
- Cost-of-collaboration P0 implementation is complete. Direct evidence:
  [`.husky/pre-commit`](../../../.husky/pre-commit) now routes staged
  formatting and Markdown checks through `agent-tools:repo-check` while keeping
  shell lint and Turbo `type-check lint test` in the pre-commit broken-code
  guard. Knip and depcruise are now classified as higher-standard gates owned
  by pre-push, `pnpm check`, and CI rather than the commit boundary.
- Cost-of-collaboration P0.QG has new evidence from the Kilned Brazing Forge
  pass: staged Prettier/Markdownlint regression coverage landed under
  `agent-tools/tests/repo-check.integration.test.ts`, the `repo-check` dry
  graph now matches root `pnpm check` by using `lint` rather than `lint:fix`,
  and a warm `pnpm check:profile` completed green in 130561 ms. Hushed
  Shrouding Mist then disposed the suspected flaky-test candidates as not
  reproduced and captured representative busy-checkout green baselines:
  cold-like `.logs/check-profiles/check-profile-2026-05-12T07-33-57-773Z.json`
  at 147613 ms and warm
  `.logs/check-profiles/check-profile-2026-05-12T07-36-18-375Z.json` at
  131695 ms. P0.QG is complete: trigger contract, pre-push/CI assurance
  rebalance evidence, profile hardening, and post-change measurement are
  recorded in the cost-of-collaboration plan.
- The `pnpm check` profiling brief has a durable deep dive:
  [`pnpm-check-profiling-deep-dive-2026-05-12.md`](../../plans/agent-tooling/pnpm-check-profiling-deep-dive-2026-05-12.md).
  The final full-profile attempt reached the real workload and failed on
  `@oaknational/oak-curriculum-mcp-streamable-http#test` at
  `src/correlation/middleware.integration.test.ts:203`; the owner subsequently
  reported multiple green full `pnpm check` runs, so this is historical profile
  evidence rather than the current blocker.
- [`cost-of-collaboration.plan.md`](../../plans/agent-tooling/current/cost-of-collaboration.plan.md)
  now contains explicit P0 quality-gate performance tasks: baseline/unblock,
  trigger-contract, staged content scanners, pre-push/CI rebalance, profile
  hardening, and post-change measurement.
- Owner live change on 2026-05-12: root `pnpm check` has moved its lint,
  Markdown, and format proof steps to non-mutating commands. The next
  quality-gate baseline should verify and measure this before further tuning.
- P0, P-Foundation, P1, and P2 have landed. The Agent-tools hot collaboration
  scripts now route through the built unified `agent-tools` entrypoint without
  rebuilding on every invocation, `collaboration-state comms direct/reply` now
  author directed messages without hand-written JSON, and
  `collaboration-state comms watch` now provides a long-lived directed-message
  watcher with `fs.watch` plus polling fallback. P1 landed at `f88d0d67` after
  the owner gave fresh one-commit `--no-verify` authorisation because unrelated
  dirty `codex-exec` work blocked the repo-wide pre-commit hook; focused B-11
  validation had passed. P2 landed at `0d3af914`; its collaboration closeout
  state landed at `a2845659`; P3 commit-queue enforcement landed at
  `c083a1ab`. P4 identity disambiguation / active-agent visibility landed at
  `1bb369a5`; its post-P4 knip unblock landed at `730766ad`.
  `claims active-agents` now exposes active/stale/inactive/uncertain
  visibility, and write paths guard live routing-tuple collisions.
  Owner-requested collaboration TUI work is captured as pending P8 in the same
  plan, now sequenced immediately after P5. P8 is mandatory, not optional
  polish: the live TUI is the human-visible proof surface for this
  cost-of-collaboration arc.
  State/memory files remain always commit-includable when dirty; owner
  clarified on 2026-05-12 that every commit should include current memory/state
  files.
- P5 unified comms storage/parser/renderer migration landed at `30c8ad15`,
  with collaboration closeout at `6a1d8d9e`. Owner review then corrected the
  completion claim, and the follow-up P5 DI/no-IO boundary repair landed at
  `07ffee1d` with collaboration closeout at `d45944b4` and napkin note at
  `16425adf`. P5 is now complete: direct comms use cases can be invoked with
  simple fakes, imported comms commands do not acquire production IO defaults,
  and filesystem/stdout/watch wiring lives in CLI composition. Mandatory P8
  live collaboration TUI is now active and remains open: the current foundation
  starts, refreshes, shows inactive agents, has sensible defaults, and has
  distinct unit/integration/E2E/smoke proof surfaces. Operator-value signals
  landed at `2791be3c`, and the smallest interaction-hardening slice landed at
  `6e804485`, but P8 completion still requires attention workflow, reader
  resilience, remaining boundary review, and full `P8-A1` through `P8-A4`
  proof.
- The owner-directed consolidation drain of `repo-continuity.md` and
  [`pending-graduations.md`](pending-graduations.md) is complete for this
  pass: historical closeout prose was archived, the live state was preserved,
  the pending-graduations due index was reconciled, and ADR/PDR promotion
  decisions were surfaced explicitly.
- Conservation-first consolidation advanced again on 2026-05-12: the
  distilled-stage and `pending-graduations.md` passes are complete. The
  2026-05-14 Sylvan Budding Forest deep-dive then rotated the active
  napkin (CRITICAL → fresh; substance preserved in `distilled.md` + the
  `napkin-2026-05-14.md` archive). The next staged consolidation session
  should process `practice-bootstrap.md`.
- Next `agentic-engineering-enhancements` implementation continuation is
  **Step 2 — singleton-lane remediation** of the cross-thread
  [`token-remediation-p8-parallel-program.plan.md`](../../plans/agentic-engineering-enhancements/current/token-remediation-p8-parallel-program.plan.md).
  Step 1 (token work) closed at the WS2 boundary on 2026-05-14: WS1 landed at
  `7a050c2a`; WS2 token-frontmatter zone classification landed at `72d31ca8`
  with ADR-144 amended in place; the program snapshot updated at `737942c0`.
  First sub-step of Step 2 is owner/reviewer review of
  [`start-right-team-singleton-lane-remediation.plan.md`](../../plans/agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md);
  the plan is **not decision-complete** and must promote before WS execution.
- Completion-claim proof pipeline is now a queued agentic-engineering lane.
  Verdant Foraging Copse authored the findings report, executable plan, thread
  routing, and the first small skill amendment on 2026-05-13. The immediate
  next execution step is WS1 in
  [`completion-claim-proof-pipeline.plan.md`](../../plans/agentic-engineering-enhancements/current/completion-claim-proof-pipeline.plan.md):
  add the `completion-claims-must-match-plan` rule and smallest `jc-plan`
  proof-contract/template amendment. Do not start `agent-tools` code until the
  plan's WS4 bridge creates or amends the owning `agent-tooling` execution
  surface.
- External-substrate learning is now a future strategic-learning lane, not an
  implementation lane. The source-neutral study, companion non-plan insights
  note, and
  [`external-skills-substrate-learning.plan.md`](../../plans/agentic-engineering-enhancements/future/external-skills-substrate-learning.plan.md)
  route the work; this landed at `289f190b`. The plan is decision-complete for
  strategic routing but not ready for execution; the first executable slice is
  candidate-register creation plus Practice-fit review for C1/C2 only, after
  the recorded readiness gates are satisfied. The same closeout also landed
  `92826c91` context-cost reviewer hardening, `41acffcc` token-measurement
  plan routing, and `2ee8905d` doctrine/skill graduations.
- `connecting-oak-resources` lane advanced through multiple 2026-05-12 graph
  foundation commits. Holistic Inc.1a re-plan landed at `f73c42f5` (Clouded
  Vaulting Squall / `claude` / opus-4-7-1m / `866472`): WS1.4+WS1.5 collapsed,
  WS1.8 GraphDocument deferred to Inc.2 with retrospective-review tripwire,
  WS2.1/WS3.1 scaffold serialisation recorded, and WS3.3 adjacency scope
  sharpened. WS1.1 (`ad2abb69`), WS1.2 (`1885fbcf`), WS1.3 (`87e21125`),
  WS2.1 (`0f895070`), WS1.6 prep (`f36f98b1`), and WS1.4 (`95f42cb7`) are now
  landed. Luminous Threading Asteroid's closeout at `0d6f080a` records WS1.4
  coordination evidence: Solar support plus type/assumptions/test review
  resolved test classification, graph-core no-I/O remote-context guarding,
  Oak-specific fixture semantics, jsonld.js v9 wording, and typed
  runtime/options wrapper. Next graph implementation choices are WS1.5 canon,
  WS1.6 vocab implementation after the prep-note owner decisions, WS2.2
  jsonld-compatible ingestion, or WS3.1 graph-project scaffold after a fresh
  root-file check.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / `claude-code` / `228bc5` / 2026-05-06 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night (commit-only) / `claude-code` / opus-4.7 / `188baa` / 2026-05-10 |
| `agentic-engineering-enhancements` (alias: "agent communication improvements") | Practice continuity + agent-tools improvement | [record][agentic] | Swift Winging Gust / `claude` / Opus 4.7 (1M) / `50492a` / 2026-05-18 |
| `connecting-oak-resources` | Oak resource graph | [record][connecting] | Riverine Swimming Hull / `claude` / Opus 4.7 / `304dde` / 2026-05-14 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / `claude-code` / `e18e2c` / 2026-05-01 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / `codex` / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / `codex` / 2026-04-28 |
| `sector-engagement` | External adoption | [record][sector] | Squally / `cursor` / 2026-04-30 |
| `eef` | EEF evidence corpus | [record][eef] | Fragrant Regrowing Root / `codex` / GPT-5 / `019e12` / 2026-05-10 |

Compact identity rule (per [PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
and the 2026-05-17 structural refactor): this column carries only the
**latest** identity — `agent_name / platform / model / session_id_prefix /
last_session`. Full per-thread identity history and per-session context live
in each thread's next-session record.

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[observability]: threads/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/connecting-oak-resources.next-session.md
[oer]: threads/exploring-open-education-resources.next-session.md
[budget]: threads/architectural-budget-system.next-session.md
[cloudflare]: threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/sector-engagement.next-session.md
[eef]: threads/eef.next-session.md

## Next Safe Steps

### Active Cross-Thread Program (2026-05-14 — sequence-live)

**Sequence routing**: defer to
[`token-remediation-p8-parallel-program.plan.md`](../../plans/agentic-engineering-enhancements/current/token-remediation-p8-parallel-program.plan.md)
for the four-step owner-stated program: (1) finish token work →
(2) singleton-lane remediation → (3) P8 to acceptance →
(4) cost-of-collaboration residual and graph foundations in parallel.
**Current step: 2** (Step 1 closed at WS2 boundary 2026-05-14). Sessions
advancing the program MUST update the program's §Current Snapshot per its
Anti-Decay Handoff Clause.

### Agentic-Engineering Enhancements

Owner direction: program-step 2 next — singleton-lane remediation. Step 1
closed at the WS2 inclusive boundary: WS1 (`ws1-token-measurement`) landed
at `7a050c2a`, WS2 (`ws2-token-frontmatter`) landed at `72d31ca8` with
ADR-144 amended in place, and the program snapshot updated at `737942c0`.
Controlling plan for Step 2:
[`start-right-team-singleton-lane-remediation.plan.md`](../../plans/agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md).
Next safe step: owner/reviewer review of the singleton-lane remediation
plan (it is **not decision-complete**), then WS0 baseline disposition,
then WS0–WS7 execution. Do not bypass owner/reviewer review and do not
skip directly to WS1+ before WS0 runs.

P8 remains the paused active collaboration spine, not complete. P0,
P-Foundation, P1, P2, P3, P4, and P5 are complete. The P8 operator-value and
smallest interaction-hardening slices landed at `2791be3c` and `6e804485`.
Resume mandatory P8 live collaboration TUI from `p8-attention-state` after the
token-cost lane unless newer owner direction changes the sequence. P8 must not
be called complete until the plan's `P8-A1` through `P8-A4` proof contract is
satisfied. P6/P7 resume after the P8 operator-view path unless owner direction
changes.

Agentic-engineering collaboration sequence for the next session:

1. **Owner-selected implementation lane** — land the completed WS1 bundle, then
   complete
   [`fitness-token-measurements-and-frontmatter-mandation.plan.md`](../../plans/agentic-engineering-enhancements/current/fitness-token-measurements-and-frontmatter-mandation.plan.md)
   from WS2 through WS6 in dependency order.
2. **Paused active spine** — P8 `p8-attention-state` remains open and resumes
   after token-cost unless the owner reprioritises.
3. **Strategic exercise lane** — if the owner asks to exercise the
   external-substrate learning plan, open
   [`external-skills-substrate-learning.plan.md`](../../plans/agentic-engineering-enhancements/future/external-skills-substrate-learning.plan.md),
   create the decided candidate register, review C1/C2 for Practice fit and
   existing homes, then stop before C3-C8 adoption work. This does not supersede
   the token-cost next-session route unless owner direction explicitly says it
   does.
4. **Guardrail lane** — use
   [`completion-claim-proof-pipeline.plan.md`](../../plans/agentic-engineering-enhancements/current/completion-claim-proof-pipeline.plan.md)
   to keep P8/P5 completion language evidence-bound.
5. **Team-remediation planning lane** — the N=7 WS1 self-organisation
   experiment produced a first-pass remediation plan:
   [`start-right-team-singleton-lane-remediation.plan.md`](../../plans/agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md).
   It is not decision-complete; first safe step is owner/reviewer review, then
   WS0 baseline disposition. It does not supersede the token-cost commit
   boundary unless owner direction explicitly changes the sequence.
6. **Knowledge-graduation disposition lane** — **COMPLETE 2026-05-14**.
   The cross-platform graduation triage plan executed all owner-approved
   scope: Batches A/B/C landed at commit `c6008dee`; all five D1–D5
   amendments landed after owner per-diff review (commits `22d1980d`,
   `54425b6d`, `7821636b`); PDR-060 (Tooling Friction Is First-Class User
   Feedback) landed in closeout commit `0b585435`. Both plans archived
   to `.agent/plans/agentic-engineering-enhancements/archive/completed/`.
   Plan-pre-empted substance remains held against the singleton-lane
   plan; the paused coordinator-PDR stays paused.

Team collaboration research from the P8 controller window now has focused
artefacts: `start-right-team`, proposed ADR-181, the
`team-start-ritual-and-action-trace-2026-05-14.md` research note, and a
conditional team/sole-contributor branch in `session-handoff`. This advances
the agent-collaboration practice surface only; it does not change the next
P8 implementation target.

Current closeout note: the WS1 token-measurement team converged on one coherent
implementation and reported green acceptance evidence, but the session exposed
coordination friction: duplicate WS1 claims opened in parallel, one
consolidation pass initially missed live claims by probing `.active_claims`
instead of `.claims`, stale comms retention cleanup overlapped the WS1 window,
and a transient peer-staged rename made git/index work unsafe until the final
staged diff cleared. The working tree still contains source plus
collaboration-state residue. This handoff captures the positives, blockers,
and exact next step without starting WS2.

Completion-proof lane: continue from
[`completion-claim-proof-pipeline.plan.md`](../../plans/agentic-engineering-enhancements/current/completion-claim-proof-pipeline.plan.md).
The first implementation slice is doctrine/skill level only:
`completion-claims-must-match-plan` plus the smallest `jc-plan` proof-contract
and template amendment. This lane exists to prevent recurrence of the P5/P8
false-completion reports; it must preserve the distinction between
`partial-slice-landed`, `pending`, and `complete`.
The suspected flaky tests
listed in
[`cost-of-collaboration.flaky-tests.md`](../../plans/agent-tooling/current/cost-of-collaboration.flaky-tests.md)
are disposed as not reproduced, and representative busy-checkout cold/warm
`pnpm check:profile` baselines are green. Do not reopen the "make pre-commit
staged-only" framing. The preserved evidence and trigger map live in
[`pnpm-check-profiling-deep-dive-2026-05-12.md`](../../plans/agent-tooling/pnpm-check-profiling-deep-dive-2026-05-12.md);
the implementation tasks live in
[`cost-of-collaboration.plan.md`](../../plans/agent-tooling/current/cost-of-collaboration.plan.md).
P2 committed through the normal pre-commit hook after formatting the new source
files; do not preserve the earlier `codex-exec` dirty-tree blocker as current
state.

Workflow skill review lane remains available but is not the immediate
cost-of-collaboration continuation: the paired `jc-session-handoff` /
`jc-consolidate-docs` and `jc-metacognition` remediation pass is complete;
remaining skills can resume from the thread record if the owner reopens that
lane.

Conservation-first consolidation is staged across four sessions by owner
direction. The active napkin was processed first: the outgoing file was archived
intact as
[`napkin-2026-05-12b.md`](../active/archive/napkin-2026-05-12b.md), and its
behaviour-changing learning was distilled into
[`distilled.md`](../active/distilled.md) without treating fitness numbers as
brevity targets. The distilled-stage pass is now complete: mature lessons were
routed to durable doctrine and pattern homes, and unresolved or owner-shaped
items were kept in [`pending-graduations.md`](pending-graduations.md). The
`pending-graduations.md` pass is also complete: the due queue is empty, stale
body statuses are corrected, and remaining pending items are explicitly retained
by trigger/carrier. The next consolidation session should process
`practice-bootstrap.md`. At every stage, knowledge curation and conservation
outrank brevity; fitness numbers are advisory routing signals.

The acceptance bar remains:

- live state remains in this file;
- historical closeout prose remains archived, not deleted;
- distilled learning and pending-graduations are fully processed;
  practice-bootstrap is the next drain;
- pending-graduations index/counts match body entries marked `status: due`;
- ADR-shaped and PDR-shaped promotion decisions are visible to the owner;
- cost-of-collaboration P0 remains named as the blocker for multi-agent
  implementation windows.

Implementation lane after profiling and consolidation: follow the thread
record's cost-of-collaboration opener. P0, P-Foundation, P1, P2, P3, P4, and
P5 have landed; mandatory P8 live collaboration TUI is the next implementation
step.

### Connecting-Oak-Resources

Branch-primary graph work continues from
[`threads/connecting-oak-resources.next-session.md`](threads/connecting-oak-resources.next-session.md).
Current entry: **WS1.4 is landed at `95f42cb7`; WS1.6 prep is landed at
`f36f98b1`; WS1.3 is landed at `87e21125`; WS2.1 graph-ingest scaffold is
landed at `0f895070`.** Next implementation choices are WS1.5 canon, WS1.6
vocab-registry implementation after the prep-note owner decisions are respected,
WS2.2 jsonld-compatible ingestion, or WS3.1 graph-project scaffold after a fresh
root-file check. Inc.1a continues under the 2026-05-12 holistic re-plan
(`f73c42f5`): WS1.8 is deferred to Inc.2, and inherited patterns from landed
WS1/WS2 cycles remain authoritative in the active plan YAML.

**WS1.5 status (2026-05-13, Quiet Stalking Mirror)**: design fully absorbed inline in
the active graph-stack plan under `ws1-canon`. Three-reviewer pre-implementation
pass complete (code-expert APPROVE-WITH-NITS; assumptions-expert
GO-WITH-CONDITIONS; architecture-expert-betty GO-WITH-RESHAPE). Owner-stated
doctrinal rules (`no aliases, no fallbacks, fail fast and hard with helpful
error message, replace old with new`) recorded in plan body; URDNA2015 → RDFC-1.0
plan-text remediation applied in §ws1-canon and §Build-vs-Buy Attestation.
Implementation did NOT land in this session. Resume by: (1) verifying the
owner-known closeout bundle (pnpm/dependency refresh + P8 foundation repair —
see Agentic lane note above) has landed and the lockfile is clean; (2) adding
`rdf-canonize@^5` to `packages/core/graph-core/package.json` direct deps and
regenerating the lockfile; (3) implementing `src/canon/{runtime.ts,
canonicalize.ts, index.ts}` exactly to the absorbed design; (4) running the
five tests atomic-landing with product; (5) plan-text remediation already
applied so no follow-up doc churn required. Reviewer flags for the
implementation cycle remain type-expert (rdf-canonize wrapper shape + literal
preservation) and test-expert (deterministic order across blank-node fixtures).

## Open Owner-Decision Items

1. `practice.md` HARD character pressure remains owner-gated under the Core
   care-and-consult rule. Falsifiability:
   `pnpm practice:fitness:strict-hard`.
2. [`pending-graduations.md`](pending-graduations.md) is a consolidation-pass
   queue, not a daily session-open file. Its 2026-05-12 due queue is drained;
   future passes should preserve pending entries until their trigger fires and
   must not trim for metrics.
3. Monorepo workspace topology (superseding ADR-108, S0-S6 strategic plan) is
   parked until after the graph MVP implementation tranche unless the owner
   explicitly reopens it.
4. Cost-of-collaboration P0, P-Foundation, P1, P2, P3, P4, and P5 are
   complete; P1 landed at `f88d0d67`, P2 at `0d3af914`, P3 at `c083a1ab`, P4
   at `1bb369a5`, and the P5 DI/no-IO repair at `07ffee1d`.

## Repo-Wide Invariants / Non-Goals

Each invariant below has a canonical home; this section is a resume aid, not
the authority.

- no compatibility layers; replace, do not bridge —
  [`replace-dont-bridge`](../../rules/replace-dont-bridge.md);
- distinct architectural layers live in distinct workspaces —
  [ADR-154](../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md)
  and [`principles.md`](../../directives/principles.md);
- TDD at all levels —
  [`tdd-as-design.md`](../../directives/tdd-as-design.md);
- tests prove product behaviour, not configuration or file presence —
  [`testing-strategy.md`](../../directives/testing-strategy.md);
- strict boundary validation only —
  [`strict-validation-at-boundary`](../../rules/strict-validation-at-boundary.md);
- no `process.env` read/write in test files or setup files —
  [`no-global-state-in-tests`](../../rules/no-global-state-in-tests.md);
- `--no-verify` requires fresh per-invocation owner authorisation —
  [`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md);
- no warning toleration —
  [`no-warning-toleration`](../../rules/no-warning-toleration.md);
- owner direction beats plan —
  [`AGENT.md`](../../directives/AGENT.md);
- curriculum data in this monorepo comes only through the published Oak Open
  Curriculum HTTP API and generated SDK;
- knowledge preservation is absolute — writing to shared-state knowledge
  surfaces is never blocked by fitness limits —
  [PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md);
- shared-state files are always writable and commit-includable regardless of
  active claims —
  [`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md).
- current memory/state files should be included in every commit when dirty —
  owner clarification, 2026-05-12.

Current branch non-goals:

- do not reopen broader canonicalisation opportunistically;
- do not guess Vercel, Sentry, SonarCloud, or GitHub state before checking
  primary evidence;
- do not treat monitor setup or owner-handled preview validation as in-repo
  acceptance work.

## Deep Consolidation Status

**Status (2026-05-17 — Swift Winging Gust / `claude` / Opus 4.7 (1M) /
`50492a`)**: completed this handoff — owner-directed full structural
pass `/jc-consolidate-docs` targeting fitness functions for knowledge
curation and homing. Four moves landed:
(A) **Archive of historical session-close prose**: 425 lines of
"Deep Consolidation Status" prose (2026-05-12 → 2026-05-14) moved
verbatim to
[`archive/repo-continuity-session-history-2026-05-17.md`](archive/repo-continuity-session-history-2026-05-17.md)
per this file's own `split_strategy`. Result: repo-continuity
CRITICAL → soft.
(B) **Archive of graduations-log sections from distilled.md**: 158
lines of back-cite-only "Graduations Log — 2026-05-14" + already-
graduated "Recently Distilled — 2026-05-12 / 05-10 Napkin Rotation"
sections moved to
[`../active/archive/distilled-graduations-log-2026-05-14.md`](../active/archive/distilled-graduations-log-2026-05-14.md).
Substance lives at named permanent homes; archive carries the
audit trail. Result: distilled critical → still critical on lines
(455) and hard on chars; remaining 455 lines are durable substance,
not graduations log.
(C) **Two pending-graduation entries graduated**:
`skill-amend:session-handoff` for the `pnpm check` cleanliness gate
landed as new step 11 in
[`.agent/skills/session-handoff/SKILL-CANONICAL.md`](../../skills/session-handoff/SKILL-CANONICAL.md);
`rule-amend:no-verify-requires-fresh-authorisation` for hook-bypass
equivalence verified as already-landed at commit `da2a4aac`
(Luminous Waxing Twilight 2026-05-15) — entry marked graduated.
(D) **Active Threads identity-column structural refactor**: the
"Latest identity" column in this file pruned to compact form
(`agent_name / platform / model / session_id_prefix / last_session`)
per PDR-027; multi-paragraph per-session narrative removed;
accumulated identity-refresh paragraphs removed. Per-session detail
lives in thread records. Refactor pending-graduation entry marked
graduated.

Owner-directed limit adjustments after the structural pass:
distilled.md raised modestly (target 200→350, limit 275→500, chars
16500→28000) to accommodate durable cross-session learning substance.
pending-graduations.md tightened (target 2000→500, limit 2500→750)
after owner reframe — *"that is ridiculous, pending graduation is a
buffer location until write, not a dumping ground"* and *"500 soft
limit, 750 hard limit, and we revisit the pipeline to figure out why
it has become a broken accumulator in the system instead of a flow
control mechanism to balance back pressure."* The 3635-line buffer is
a flow-control failure, not a substance-preservation problem; back-
pressure signal preserved by tightening limits so the validator
continues to flash the underlying pipeline-repair need.

Generative-metacognition outcomes captured this pass (per the second
`/jc-metacognition` invocation, then the owner-named broadening of
metacognition from retrospective-only to retrospective-plus-generative):

- New `distilled.md` section "Recently Distilled — 2026-05-17 Swift
  Winging Gust pipeline-reframe" carrying three substance entries:
  surface classification for fitness-response routing
  (memory/state/buffer/doctrine), pipeline back-pressure as
  structural-cure signal, and doctrine-first vs first-principles
  cognitive-approach diversity in agent-owner pairs.
- Three buffer-shape PDR-candidate entries in
  `pending-graduations.md` (demonstrating the buffer-shape contract by
  example): `pdr:surface-classification-for-fitness-response`,
  `pdr:pipeline-back-pressure-is-structural-cure-signal`,
  `pdr:cognitive-approach-diversity-in-agent-owner-pairs`.
- Two Claude per-user feedback memories:
  `feedback_pending_graduations_is_buffer_not_dump` and
  `feedback_metacognition_impact_test` (the latter naming both
  retrospective and generative modes plus the shared pre-action
  ratification reflex).

Pipeline-repair work is now registered as a DECISION-COMPLETE-
FOR-STRATEGIC-ROUTING plan at
[`knowledge-flow-pipeline-mechanisms.plan.md`](../../plans/agentic-engineering-enhancements/current/knowledge-flow-pipeline-mechanisms.plan.md)
(authored 2026-05-18 Swift Winging Gust continuation). Six WSes:
WS1 producer-side buffer-shape contract; WS2 consumer-side trigger-
scan cadence + recurring-signal tripwire rule; WS3 drain pass for
existing backlog (first executable slice); WS4 ADR-144 surface-
classification amendment; WS5 declared-workflow-steps-require-
evidence rule; WS6 PDR-drafting lane for the five 2026-05-17
candidates. Suggested execution order WS3 → WS4 → WS1 → WS2 → WS5 →
WS6; owner-direction selects.

**Prior status (2026-05-17 — Solar Orbiting Asteroid / `claude` / Opus 4.7 (1M) /
`01ff58`)**: completed this handoff — owner-directed
`/jc-session-handoff` followed by `/jc-consolidate-docs`. Napkin
rotated to [`archive/napkin-2026-05-17.md`](../active/archive/napkin-2026-05-17.md);
fresh napkin started; behaviour-changing entries from the
2026-05-15 plus 2026-05-17 window distilled into new section
[`distilled.md` §"Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade"](../active/distilled.md).
Four pending-graduations entries captured this pass:
`pattern:gates-hide-gates` (pending second-instance);
`doc-amend:testing-patterns` for the supertest classification
conflict (pending owner-direction); `skill-amend:session-handoff`
for the `pnpm check` cleanliness step (due — owner direction fired
2026-05-14); `rule-amend:no-verify-requires-fresh-authorisation`
for hook-bypass equivalence (due — owner direction fired
2026-05-14). The `test-coverage-review-lens` pattern was already
graduated mid-session at commit `0c083409`. Fitness state post-pass:
napkin healthy ✓; distilled critical (substance preserved per the
learning-preservation rule — graduation upward is the next move;
candidate sections for graduation upward are the older "Recently
Distilled — 2026-05-09 / 05-10 / 05-12 / 05-13" blocks and
"Graduations Log" sections); pending-graduations critical on
characters (queue churn — same story); repo-continuity critical
(named structural cure remains the Active Threads identity column
refactor, pending in the register). No Practice Core contradiction
or extension surfaced this pass.

Previous deep-consolidation and session-close prose lives in:

- [`archive/repo-continuity-session-history-2026-05-17.md`](archive/repo-continuity-session-history-2026-05-17.md)
- [`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md)
- [`archive/repo-continuity-session-history-2026-05-10.md`](archive/repo-continuity-session-history-2026-05-10.md)
- [`archive/repo-continuity-session-history-2026-05-07.md`](archive/repo-continuity-session-history-2026-05-07.md)
- earlier dated archive files under [`archive/`](archive/)
