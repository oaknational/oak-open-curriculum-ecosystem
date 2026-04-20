---
name: Operational Awareness and Continuity Surface Separation
overview: >
  Separate the canonical continuity contract, workstream resumption state, and
  thread-aware tactical coordination into distinct repo-local surfaces while
  preserving the current continuity doctrine and learning loop.
todos:
  - id: oa-phase-0-baseline
    content: "Phase 0: Capture the baseline and lock doctrine/backlog constraints."
    status: completed
    note: "Baseline at .agent/analysis/continuity-operational-awareness-baseline.md (2026-04-19) with 2026-04-20 addendum covering L-7 bespoke-to-plugin pivot, guardrail installation (commit 4bccba71), and deep-consolidation-due status. Validation criteria met: current surfaces classified by job/horizon/authority/expiry/concurrency; three prompt jobs named directly; repo-local vs cross-vendor sidecars separation recorded. Task 0.2 + Task 0.3 also satisfied by the plan's Design Contract + Bounded Uptake from Workbench Topology sections respectively."
  - id: oa-phase-1-design
    content: "Phase 1: Define the state-surface contract, authority order, and loop boundaries."
    status: completed
    note: "Design Contract section of this plan (Surface set + Authority order + Mandatory field contracts + Loop model) plus .agent/reference/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md satisfy Task 1.1 outputs. Task 1.2's four required rules are covered: (1) one canonical continuity contract (plan + deep-dive); (2) track cards single-writer (plan §Design Contract, tactical surface); (3) expired tactical cards must be resolved/promoted/deleted (plan §Risks + deep-dive §Proposed Shape expires_at field); (4) historical tactical notes excluded from live canonical surfaces (plan §Design Contract surface purpose lines — repo-continuity.md covers contract only, not history). The later workflow checklist output named in Task 1.2 is correctly deferred to Phase 2 since it ties to session-handoff/GO/session-continuation workflow surfaces."
  - id: oa-phase-2-integration
    content: "Phase 2: Integrate repo-local state surfaces into prompts, commands, and workflow docs."
    status: pending
  - id: oa-phase-3-pilot
    content: "Phase 3: Pilot the markdown-first model with parallel tracks and collect evidence."
    status: pending
  - id: oa-phase-4-rollout
    content: "Phase 4: Roll out, close documentation propagation, and decide whether portability promotion is justified."
    status: pending
---

# Operational Awareness and Continuity Surface Separation

**Last Updated**: 2026-04-20
**Status**: ACTIVE
**Scope**: Repo-local awareness plane, continuity-surface
separation, and portable-candidate extraction criteria for later promotion.

**Promoted**: 2026-04-20 — owner accepted markdown-first delivery shape; pilot
lane is the implementation lane for this plan itself, run as two parallel
tactical tracks (`contract-and-docs` + `workflow-and-runtime`). Phase 0
baseline refreshed with 2026-04-20 addendum noting bespoke-orchestrator pivot,
guardrail installation (commit `4bccba71`), and deep-consolidation-due status.
Deep consolidation rides inside Phase 3 + Phase 4 as the natural carrier.

**Baseline analysis**:
[continuity-operational-awareness-baseline.md](../../../analysis/continuity-operational-awareness-baseline.md)

**Broader mechanism baseline**:
[agentic-mechanism-inventory-baseline.md](../../../analysis/agentic-mechanism-inventory-baseline.md)

**Concept extract**:
[operational-awareness-and-state-surfaces.md](../../../reference/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md)

**Related future plan**:
[cross-vendor-session-sidecars.plan.md](../future/cross-vendor-session-sidecars.plan.md)

**Adjacent future plan**:
[operating-model-mechanism-taxonomy.plan.md](../future/operating-model-mechanism-taxonomy.plan.md)

**Promotion note** (historical): promoted `current/` → `active/` on 2026-04-20
per the Promoted block above.

## Context

The continuity rollout succeeded in establishing one canonical continuity
contract, a lightweight `session-handoff`, a complementary `GO` cadence, and a
formal surprise pipeline. The current continuation prompt then absorbed more
state because it was genuinely useful as:

- the canonical continuity contract
- a workstream resumption brief
- a shared tactical state surface for active parallel tracks

That growth is a signal, not a failure. The repo discovered a missing
operational layer and used the prompt to host it.

The problem now is **scope collision**:

- the compact contract is competing with lane-specific detail
- thread-unaware hygiene makes multi-agent updates risky
- historical tactical notes accumulate inside the same surface meant for cheap
  resumption

This plan introduces a repo-local awareness plane without changing
the top-level continuity doctrine or jumping straight to a cross-vendor sidecar
store.

In local mechanism language, this lane is the bounded work-plane pilot for
**supervised execution**. It owns how short-horizon operational state is
observed, refreshed, handed off, redirected, and closed without claiming the
whole runtime-governance model.

Metacognitive review of
[workbench-agent-operating-topology.md](../../../reference/agentic-engineering/workbench-agent-operating-topology.md)
shows that this prompt collision is one local symptom of a broader operating
model. This lane intentionally absorbs only the work-ledger, precedence, and
thread-aware coordination parts of that model. The broader interaction-plane,
signal-taxonomy, and renewal-trigger work is routed to adjacent plans rather
than smuggled into this rollout.

## Goal

Create a repo-local state model that:

- keeps one compact canonical continuity contract
- gives each active workstream a tracked short-horizon resumption brief
- gives each active agent or thread its own gitignored tactical track card
- makes the continuation prompt a behavioural entry surface rather than the
  main mutable state host
- routes promotable signals back into the existing learning loop rather than
  inventing a second memory doctrine
- carries forward the workbench note's work-ledger and authority-order
  insights without trying to solve the full operating-model taxonomy here
- treats the awareness plane as the repo-local pilot for supervised
  execution semantics at the work-plane level

## Non-Goals

- No immediate Practice Core mutation or new PDR in the initial rollout
- No SQLite-backed sidecar store or cross-vendor storage model in this lane
- No `AGENT.md` change
- No replacement of plans, `napkin.md`, or `distilled.md`
- No blind trimming of the current continuation prompt before mining the value
  it currently carries
- No attempt to codify the full interaction-plane, signal/sensor, or
  renewal-trigger taxonomy in this lane; that belongs to the adjacent
  operating-model mechanism taxonomy work

## Bounded Uptake from Workbench Topology

- **In scope here**:
  the temporary work-ledger concept, precedence/disagreement handling, and
  thread-aware tactical coordination surfaces
- **Design constraint here**:
  the new continuity and awareness surfaces are execution-channel artefacts;
  the visible exchange should summarise them, not become the state host
- **Adjacent but not owned here**:
  posture selection, private-feed classification, special-feed taxonomy,
  evidence-surface abstraction, artefact-economy rules, and renewal triggers
- **Routing rule**:
  no topology concept is left homeless; if it does not land here, it must land
  in the reviewer gateway plan, the evidence lane, or the future operating-model
  taxonomy plan

## Design Contract

### Surface set

The later active execution plan must implement exactly three repo-local state
surfaces:

All three are execution-channel state surfaces. They are read by workflows and
summarised in visible exchange, but they are not themselves user-facing
conversation surfaces.

1. **Canonical continuity surface**
   - default target: `.agent/state/repo-continuity.md`
   - purpose: repo-level continuity contract only
2. **Workstream brief surfaces**
   - default target: `.agent/state/workstreams/<slug>.md`
   - purpose: short-horizon lane resumption state
3. **Tactical track-card surfaces**
   - default target:
     `.agent/runtime/tracks/<workstream>--<agent>--<branch>.md`
   - purpose: thread-aware tactical coordination, gitignored by default

### Authority order

When surfaces disagree, the order is:

1. **Plans** — scope, sequencing, acceptance criteria, validation
2. **`repo-continuity.md`** — canonical continuity contract
3. **`workstreams/<slug>.md`** — lane-level short-horizon state
4. **Track cards** — tactical coordination only, never authoritative for scope
5. **`session-continuation.prompt.md`** — read order, routing, and operating
   instructions only

### Mandatory field contracts

`repo-continuity.md` must stay compact and cover only:

- active workstreams
- primary workstream brief
- repo-wide invariants / non-goals
- next safe step
- deep-consolidation status

`workstreams/<slug>.md` must cover:

- owning plan(s)
- current objective
- current state
- blockers / low-confidence areas
- next safe step
- active track links
- promotion watchlist

`runtime/tracks/*.md` must cover:

- agent or thread
- branch or worktree
- claimed territory
- current task
- blocker
- handoff note
- `expires_at`
- `promotion_needed`

### Loop model

The later active implementation must preserve the current learning loop and add
two narrower operational loops:

- **Repo continuity**:
  `resume -> execute -> handoff -> refresh repo continuity`
- **Workstream resumption**:
  `plan change -> refresh workstream brief -> GO/resume -> archive on closure`
- **Tactical awareness**:
  `claim -> update -> handoff -> resolve/expire`
- **Promotion edge**:
  `awareness/workstream signal -> napkin/distilled/permanent docs`

Taken together, these loops are the lane's bounded supervised-execution model:
observe, refresh, hand off, redirect when needed, and close cleanly.

## Phase 0 — Baseline and Constraints

### Task 0.1: Freeze the baseline

- Output:
  [continuity-operational-awareness-baseline.md](../../../analysis/continuity-operational-awareness-baseline.md)
- Required content:
  - current surfaces classified by job, horizon, authority, expiry, and
    concurrency risk
  - explicit finding that prompt growth came from utility rather than random
    drift
  - explicit separation between repo-local need and the broader sidecars plan
- Validation:
  - baseline file exists and covers the continuation prompt, plans, workflows,
    and learning surfaces
  - baseline names the three prompt jobs directly

### Task 0.2: Lock doctrine and backlog constraints

- Output: this plan's design contract plus the supporting deep dive
- Validation:
  - the plan keeps one canonical continuity contract
  - the plan keeps the existing operational / epistemic / institutional split
  - the plan records sidecars as adjacent future work, not the default delivery
    mechanism

### Task 0.3: Route the broader topology mechanisms without overloading this lane

- Inputs:
  - the workbench topology note
  - the broader mechanism baseline
  - the reviewer gateway plan
- Required output:
  - explicit statement of which mechanisms are absorbed here
    (`work ledger`, precedence, tactical coordination)
  - explicit routing of posture-selection and broader signal-taxonomy work to
    adjacent plans
- Validation:
  - this plan stays bounded to continuity and operational-awareness surfaces
  - no topology concept is left un-routed

## Phase 1 — State-Surface Design

### Task 1.1: Define the three-surface model

- Outputs:
  - this plan's Design Contract section
  - [operational-awareness-and-state-surfaces.md](../../../reference/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md)
- The design must specify:
  - exact surface paths
  - required fields
  - writer/reader expectations
  - expiry behaviour
  - authority boundaries
- Validation:
  - no surface duplicates plan authority
  - no surface creates a second canonical continuity contract
  - track cards are explicitly short-horizon and single-thread oriented

### Task 1.2: Define disagreement and hygiene rules

- Outputs: this plan's authority order and later workflow checklist
- Required rules:
  - one canonical continuity contract only
  - track cards are single-writer by default
  - expired tactical cards must be resolved, promoted, or deleted
  - historical tactical notes do not stay in live canonical surfaces
- Validation:
  - the design answers who writes, who reads, when it expires, and where
    promotion goes

## Phase 2 — Workflow Integration Design

### Task 2.1: Reframe the continuation prompt

- Target surfaces for later implementation:
  - `.agent/prompts/session-continuation.prompt.md`
  - `.agent/commands/session-handoff.md`
  - `.agent/skills/go/shared/go.md`
  - start-right surfaces only if read order changes materially
- Required future behaviour:
  - the continuation prompt becomes a behavioural entry surface only
  - `session-handoff` refreshes repo continuity and the relevant workstream
    brief, then updates the current track card only if one exists
  - `GO` reads repo continuity, the relevant workstream brief, and the current
    track card in that order
- Validation:
  - no live workflow continues to treat the prompt as the primary mutable state
    host
  - read/write responsibility is explicit per workflow

### Task 2.2: Define tracked and ignored scaffolding

- Expected future tracked surfaces:
  - `.agent/state/README.md`
  - `.agent/state/repo-continuity.md`
  - `.agent/state/workstreams/README.md`
  - `.agent/runtime/README.md`
  - `.agent/runtime/tracks/.gitkeep`
  - gitignore rules that ignore tactical-card markdown while preserving the
    tracked structure docs
- Validation:
  - the later implementation can create the directories without ambiguity
  - the ignored tactical surface remains documented and discoverable

## Phase 3 — Pilot and Evidence

### Task 3.1: Run a self-hosted parallel-track pilot

- Default pilot lane: the implementation of this plan itself once promoted to
  `active/`
- Default pilot tracks:
  - `contract-and-docs`
  - `workflow-and-runtime`
- Required pilot evidence artefact:
  - `.agent/analysis/operational-awareness-pilot-evidence.md`
- The pilot must cover:
  - ordinary single-agent resume
  - two parallel agents updating different track cards in one workstream
  - `session-handoff` from one track without trampling another track's state
  - stale tactical-card expiry and cleanup
  - promotable insight arising in tactical state and being routed into the
    learning loop
  - prompt, plan, and state-surface disagreement resolution
- Validation:
  - each scenario records the expected read/write surface order
  - each scenario ends with an explicit pass/fail call and notes any friction

### Task 3.2: Calibrate before wider rollout

- Output: explicit `promote`, `adjust`, or `reject` decision in the pilot
  evidence artefact
- Calibration rule:
  - if markdown-first tactical cards prove insufficient under bounded
    concurrency, capture the failure mode and promote the adjacent sidecars
    plan rather than stretching this lane into a database-backed design
- Validation:
  - the decision cites pilot evidence, not preference

## Phase 4 — Rollout, Portability, and Review

### Task 4.1: Roll out to target continuity workflows

- Target rollout set:
  - continuation prompt
  - `session-handoff`
  - `GO`
  - repo-local state scaffolding docs
- Validation:
  - prompt behaviour, workflow docs, and state surfaces all agree on the new
    separation model

### Task 4.2: Decide portability posture

- Required rule:
  - this lane is a **portable candidate**, not a Practice Core promotion by
    default
- Portability promotion criteria:
  - the model works across at least two distinct workstream shapes
  - the authority order remains stable under real parallel use
  - the tactical surface does not drift into a second memory doctrine
  - the repo can explain where markdown-first is sufficient and where a
    sidecar-store design would become necessary
- Validation:
  - if the criteria are not met, record explicit no-promotion rationale and
    keep the work repo-local

### Task 4.3: Documentation propagation and review closeout

- Mandatory documentation surfaces:
  - `docs/governance/continuity-practice.md`
  - `docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md`
  - `.agent/practice-core/practice.md`
  - `.agent/reference/agentic-engineering/README.md`
  - `.agent/reference/agentic-engineering/deep-dives/continuity-and-knowledge-flow.md`
  - `.agent/reference/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md`
- Review requirement:
  - planning closeout must include `docs-adr-reviewer`
  - planning closeout must include `assumptions-reviewer`
- Validation:
  - every touched documentation surface is updated or receives explicit
    no-change rationale
  - documentation propagation is recorded in the collection's
    `documentation-sync-log.md`

## Foundation Alignment

Before promotion to `active/` and at the start of each later implementation
phase:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Re-ask the first question: could it be simpler without compromising quality?

## Risks and Mitigations

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Markdown surfaces remain overloaded | The repo recreates the current problem under new filenames | Keep each surface single-purpose and enforce authority order in workflow docs |
| Tactical cards fossilise | Short-horizon state becomes a second memory layer | Require `expires_at`, resolution, or promotion before cards persist |
| Multiple agents trample shared state | The rollout fails under the exact condition it is meant to fix | Use track cards as the single-writer tactical boundary and pilot parallel updates explicitly |
| Repo-local model quietly becomes a Practice Core change | Portability pressure distorts the initial design | Keep promotion criteria explicit and require a later, separate promotion decision |
| Markdown-first proves insufficient | The design cannot safely handle real concurrency | Capture evidence and promote the adjacent sidecars plan rather than improvising a database design here |

## Documentation Propagation Commitment

This source plan is discoverable from the collection indexes, roadmap, hub, and
analysis lane. When promoted, the active execution plan must also record
updates or no-change rationale for the doctrine and deep-dive surfaces named
above.

## Consolidation

After the later implementation lane completes and quality gates pass, run
`/jc-consolidate-docs` to graduate settled continuity and operational-awareness
insights into their durable homes.
