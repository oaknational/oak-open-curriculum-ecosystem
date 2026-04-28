# Governance Concepts and Mechanism-Gap Baseline

**Captured**: 2026-04-19
**Purpose**: Abstract comparison baseline for governance-plane, authority,
supervision, and signal concepts that can strengthen local agentic engineering
without importing source-specific names, package identities, or wording.

## Metacognitive Framing

- **Thought**: The compared governance corpus first looks like a bundle of
  operational tooling, safety policy, and ecosystem packaging.
- **Reflection**: Its real contribution is not a particular tool shape but a
  clearer separation between what steers agent action, what executes work, and
  what records evidence about both.
- **Insight**: Our repo already has many of the relevant capabilities. The
  deeper gap is often that a mechanism exists without a stable abstract name,
  a boundary model, or a declared destination.
- **What changed**: The question is no longer "what features should we copy?".
  It is "which mechanism families deserve better names, better routing, or a
  bounded local pilot?".
- **Bridge from action to impact**: Record the abstract concepts, block
  cargo-cult import, and route each useful concept to the right plan,
  reference, report, or doctrine-adjacent surface.

## What the Compared Governance Corpus Is

Conceptually, the compared corpus is a governance-centred operating stack for
agents. It assumes that:

- action shaping must not live only inside model reasoning
- boundaries between humans, agents, tools, and control surfaces matter
- authority is not always binary; it can be staged, contextual, and revisited
- supervision, recovery, and evidence are part of the operating model, not
  afterthoughts
- limitations and residual risk deserve first-class documentation
- ecosystem propagation needs clear adapters, matrices, and adoption paths

## What It Provides

The compared model provides a strong vocabulary for:

- separating decision-making surfaces from work-execution surfaces
- treating relationship boundaries and authority gradients as design inputs
- running deterministic checks outside the model's reasoning loop
- supervising execution with pause, recover, and replay-like semantics
- separating attempt, observed outcome, and proven result records
- documenting residual risks and non-governed areas explicitly
- scaling adoption through minimal-to-full ladders rather than all-at-once
  uptake
- using propagation surfaces and outward capability mapping as first-class
  surfaces

## How It Works

The compared mechanism stack can be described in five layers:

| Layer | Function | Local analogue | Status |
| --- | --- | --- | --- |
| External decision layer | Applies deterministic action-shaping checks outside model reasoning | directives, plans, reviewer routing, quality gates | present but unnamed |
| Relationship and authority layer | Models actor boundaries, authority gradients, and confidence signals | precedence rules, reviewer escalation, tactical ownership concepts | partial |
| Supervised execution layer | Observes work, pauses or redirects it, and records recovery semantics | continuity surfaces, operational-awareness design, quality-gate loops | partial |
| Reliability and evidence layer | Distinguishes attempt, observed outcome, proven result, alerts, and audit surfaces | evidence plans, docs review, quality-gate output, sync logs | partial |
| Propagation layer | Carries concepts outward through adapters, matrices, and staged packs | ADR-125, support matrix, hub, outgoing practice context | present |

## What It Reframes Locally

The comparison changes how several local surfaces look:

- **Reviewer routing is one safeguard layer, not the whole governance system.**
  It needs a clearer place inside a larger safeguard stack.
- **Continuity and operational awareness sit in the work plane.** They carry
  short-horizon state but should not also be forced to explain all governance
  logic.
- **Evidence needs an attempt / observed outcome / proven result structure.**
  We currently capture proof and findings well, but the distinction between
  "what was tried", "what happened", and "what is proven" is still weaker than
  it could be.
- **Some plans need a clearer govern/do-not-govern boundary.** Local plans can
  benefit from explicit statements of what a lane controls and what remains out
  of scope.
- **Residual-risk and limitation material is under-developed.** Risk tables
  exist, but durable cross-lane residual-risk surfaces are still thin.

## Mechanism-Gap Inventory

| Local abstraction | Concise definition | Why it matters here | Current local analogue | Status | Target surface |
| --- | --- | --- | --- | --- | --- |
| Action-governance boundary | The distinction between shaping actions and generating reasoning | Clarifies what belongs in plans, reviewers, and runtime surfaces | directives, plans, reviewer routing | partial | future plan |
| External decision layer | Deterministic checks and routing outside the model loop | Makes local control mechanisms visible as one family | rules, gates, plan discipline | present but unnamed | reference/deep dive |
| Boundary model | Named boundaries across human, agent, tool, work plane, and control plane | Reduces hidden coupling and vague responsibility claims | scattered trust-boundary and continuity notes | missing | future plan |
| Graduated authority | Contextual authority that changes with situation, evidence, or risk | Would improve escalation and tactical ownership design | precedence rules and reviewer escalation hints | defer | future plan |
| Relationship-confidence signals | Signals that change how much latitude or scrutiny an actor gets | Sharpens reviewer routing and awareness semantics | change-category routing, review depth, user correction signals | partial | existing plan |
| Layered safeguard stack | The combined guard system across rules, reviewers, gates, continuity, and runtime | Helps explain why no single surface carries all safety | current rules + reviewers + gates + continuity | present but unnamed | reference/deep dive |
| Attempt / observed outcome / proven result structure | Separate records for what was tried, what happened, and what is proven | Strengthens evidence quality and rollback reasoning | evidence bundles, sync logs, napkin, validation outputs | partial | existing plan |
| Supervised execution lifecycle | Observe, pause, resume, redirect, recover, and close work cleanly | Gives the awareness plane a broader design frame | continuity, workstream thinking, tactical-card proposal | partial | existing plan |
| Residual-risk surface | Durable record of what remains uncertain, ungoverned, or intentionally deferred | Prevents false claims of completeness | plan risk tables and scattered notes | missing | future plan |
| Adoption ladder | Minimal-to-full uptake path for new mechanism families | Makes rollout proportional and evidence-led | strategic/current/active plan lifecycle, but not concept-specific | defer | future plan |
| Propagation surface | Stable core semantics with thin adapter surfaces and outward concept packs | Confirms where the repo is already strong | ADR-125, hub, practice-context packs | present | reference/deep dive |
| Signal ecology | Named families of sensors, alerts, feedback, and routed signals | Makes hidden routing behaviour legible | reviewer triage, fitness, gates, health probes | present but unnamed | future plan |
| Awareness plane | Shared short-horizon operational state separate from continuity canon | Important for multi-agent work and thread hygiene | awareness-plane plan and continuation-prompt pressure | partial | existing plan |

## Dedicated Inventory: Awareness, Sensing, Feedback, Alerts, and Signal Routing

| Mechanism type | Current local sources | Current consumers | Gap to close |
| --- | --- | --- | --- |
| Awareness surfaces | continuation prompt, active plans, napkin, proposed workstream briefs | active agents, handoff workflows | no dedicated short-horizon plane with clean ownership and expiry |
| Sensors | quality gates, reviewer findings, `rg` checks, health probes, user feedback | plans, reviewers, agents, humans | no shared sensor taxonomy or severity model |
| Feedback loops | reviewer corrections, docs hygiene rounds, consolidation, user correction | plans, docs, memory, directives | no single view of how signals promote into durable learning |
| Alerts and stops | blocking gates, explicit reviewer blockers, stale-link findings, continuity drift | active execution, closeout, follow-up planning | alert classes are implicit and inconsistent across surfaces |
| Signal routing | gateway triage, plan escalation, hub discoverability, lane READMEs | reviewers, planning surfaces, docs surfaces | route logic is partly present but not yet named as a mechanism family |
| Residual-risk notices | plan risks, sync-log caveats, evidence caveats | owners and later implementers | durable residual-risk surfaces remain weak and inconsistent |

## What Not to Import

The compared corpus is useful, but several things should stay out unless local
evidence later proves otherwise:

- source names, branded labels, package taxonomy, or product structure
- a heavyweight runtime store before the repo-local awareness pilot proves the
  need
- numeric confidence scoring without a clear local calibration problem to solve
- ecosystem breadth as a goal in its own right
- a duplicate evidence or governance canon parallel to ADRs, Practice Core, or
  `/docs/**`
- platform-specific implementation commitments that outrun the repo's current
  substrate

## High-Impact Next-Step Candidates

1. **Bring forward the attempt / observed outcome / proven result structure**
   in the evidence lane, because it improves claim quality without requiring a
   new runtime substrate.
2. **Strengthen the reviewer gateway as a signal router**, not just a roster
   manager, because that aligns with existing work already under way.
3. **Treat the operational-awareness plan as the bounded pilot for supervised
   execution semantics**, because it already owns thread-aware short-horizon
   state.
4. **Use the future mechanism-taxonomy lane for the boundary model, signal
   ecology, residual-risk surfaces, and adoption ladders**, because those
   concepts still need broader integration proof.

## Non-Adoption and Defer Signals

- **Keep propagation mechanics local where they already work.** The
  propagation surface is already strong; no new structural import is needed.
- **Defer graduated authority until a pilot produces evidence.** The concept is
  interesting, but the repo does not yet need a formal authority ladder on day
  one.
- **Reject any import that only changes naming without changing clarity.** New
  vocabulary must earn its place by making routing, design, or review
  decisions easier.

## Companion Baseline

- [practice-aligned-direction-and-gap-baseline.md](./practice-aligned-direction-and-gap-baseline.md)
  re-uses this baseline's vocabulary (status legend, mechanism-gap matrix
  shape, what-not-to-import discipline) to map ecosystem direction-of-travel
  signals to repo-local Practice intentions. Pair-read this baseline (abstract
  governance vocabulary) with that one (ecosystem direction-of-travel) when
  assessing whether a deferred concept has become applicable.
