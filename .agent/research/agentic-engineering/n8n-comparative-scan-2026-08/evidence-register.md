---
title: 'Evidence register — comparative scan and Practice diagnosis'
type: research-evidence-register
status: active
date: 2026-08-04
audience: 'Reviewers auditing the source-facing research and Practice-native conclusions'
subject: 'Traceability from public source observations and current OCE evidence to diagnosis findings'
related:
  - method-and-source-boundary.md
  - tranche-1-structural-observations.md
  - tranche-2-lifecycles-and-coordination.md
  - tranche-3-extension-governance-and-evolution.md
  - comparative-diagnosis.md
---

# Evidence register

## How to read this register

This register preserves provenance without making the comparative source the organising structure of
the main Practice report.

Each row contains:

- the Practice finding;
- current OCE evidence inspected independently;
- source-facing observations that prompted or challenged the question;
- interpretation class;
- confidence and important limits.

No source implementation is reproduced. Links point to the public `master` branch or current OCE
`main`. The upstream source licence and exclusions are recorded in
[method-and-source-boundary.md](method-and-source-boundary.md).

## Evidence classes

- **Explicit** — the source states the responsibility or intention.
- **Structural** — several relationships imply the arrangement.
- **Historical** — migration or retained compatibility explains the shape.
- **Contextual** — product, ecosystem, deployment, or commercial obligations materially shape it.
- **Contradictory** — live surfaces disagree; the disagreement is evidence.
- **Uncertain** — the available source is insufficient for a stable conclusion.

## Register

| Finding | Current OCE evidence | Comparative observation evidence | Class | Confidence and limit |
| --- | --- | --- | --- | --- |
| **D01 — canonical semantics and checked projections** | [PDR-009](../../../../.agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md); [PDR-035](../../../../.agent/practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md); [PDR-050](../../../../.agent/practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md); [host substrate inventory](../../../../.agent/memory/executive/memory-state-substrate-contracts.md); [ADR-165](../../../../docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md) | [telemetry definitions and projections](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/telemetry/README.md); [shared repository architecture](https://github.com/n8n-io/n8n/blob/master/AGENTS.md); [test-service registry](https://github.com/n8n-io/n8n/blob/master/packages/testing/containers/README.md) | Explicit + structural | **High.** OCE doctrine is clear; local gap ledger and live drift prove enactment is incomplete. |
| **D02 — enacted truth versus historical decision record** | Heavily amended [PDR-027](../../../../.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md), [PDR-094](../../../../.agent/practice-core/decision-records/PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md), and [PDR-125](../../../../.agent/practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md); generated/index precedents in PDR-050 | [breaking-change detector model](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/breaking-changes/README.md); [generated telemetry catalogue](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/telemetry/README.md) | Structural | **Medium-high.** Need an empirical cold-agent comparison before committing to another projection. |
| **D03 — durable plan intent versus schedule state** | [plan-node schema](../../../../.agent/plans/plan-node-schema.md); [plans root](../../../../.agent/plans-backlog-2026-07/README.md); [TAU index](../../../../.agent/plans-backlog-2026-07/telemetry-and-understanding/README.md) | Working definition, active version, history, and execution snapshot are separate: [workflow entity](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/db/src/entities/workflow-entity.ts), [workflow history](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/db/src/entities/workflow-history.ts), [publish history](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/db/src/entities/workflow-publish-history.ts) | Explicit | **High.** OCE already made the stronger Practice-native choice. Current plan-estate transition is openly incomplete. |
| **D04 — rule, occurrence, attempt, actor, and evidence lifecycle** | Plans, Linear edges, sessions, claims, handoffs, comms, branches, PRs, and memory exist but no single lifecycle contract was found: [PDR-027](../../../../.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md), [collaboration conventions](../../../../.agent/memory/operational/collaboration-state-conventions.md), [plan-node schema](../../../../.agent/plans/plan-node-schema.md) | Rule/occurrence separation and attempt/actor state: [scheduler architecture](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/scheduler/README.md); [execution entity](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/db/src/entities/execution-entity.ts); [queue types](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.types.ts) | Structural | **High.** The proposed five-part ontology is an original abstraction from both estates, not a copied source model. |
| **D05 — claims, liveness, succession, and stale actors** | [PDR-078](../../../../.agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md); [PDR-133](../../../../.agent/practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md); [collaboration conventions § Session-Close and Resume](../../../../.agent/memory/operational/collaboration-state-conventions.md); [state README](../../../../.agent/state/README.md) | Claims, leases, fencing, and stale ownership in [scheduler architecture](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/scheduler/README.md); process/worker distinctions in [scaling types](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.types.ts) | Explicit + structural | **High.** OCE's liveness ontology is more advanced; finding is limited to claim succession and stale-result authority. |
| **D06 — durable waiting and contested resumption** | Owner gates in [plan-node schema](../../../../.agent/plans/plan-node-schema.md); plan lanes, handoffs, escalations, automations, and external blocking are separate mechanisms | Waiting status and expected-state resumption in [execution status](https://github.com/n8n-io/n8n/blob/master/packages/workflow/src/execution-status.ts), [wait tracker](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/wait-tracker.ts), and [active executions](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/active-executions.ts) | Structural | **Medium-high.** A generic OCE mechanism may exist under another name; validate before planning. |
| **D07 — event facts and projections** | Immutable events and generated log in [state README](../../../../.agent/state/README.md); source/read-model doctrine in [PDR-050](../../../../.agent/practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md); shared spec/schema/local code in [PDR-125](../../../../.agent/practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md) | Typed event service, relays, durable bus, telemetry definitions: [event service](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/events/event.service.ts), [telemetry relay](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/events/relays/telemetry.event-relay.ts), [message event bus](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/eventbus/message-event-bus/message-event-bus.ts) | Explicit | **High.** Finding is mostly preservation and convergence, not invention. |
| **D08 — retention, consolidation, provenance, and forgetting** | [PDR-014](../../../../.agent/practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md); [PDR-050](../../../../.agent/practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md); [PDR-094](../../../../.agent/practice-core/decision-records/PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md); [collaboration conventions](../../../../.agent/memory/operational/collaboration-state-conventions.md) | Different retention classes in [execution config](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/config/src/configs/executions.config.ts), [scheduler](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/scheduler/README.md), and [Instance AI architecture](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/instance-ai/docs/architecture.md) | Explicit + contextual | **High.** OCE is substantively stronger; comparison mainly confirms the value of class-specific retention. |
| **D09 — agent experience and procedural compression** | [PDR-111](../../../../.agent/practice-core/decision-records/PDR-111-agent-experience-is-first-class.md); [frictions register](../../../../.agent/memory/operational/frictions-register.md); [cost-of-collaboration plan](../../../../.agent/plans-backlog-2026-07/agent-tooling/current/cost-of-collaboration.plan.md); [agent-tools scripts](../../../../agent-tools/package.json) | Outcome-oriented setup command with full logs and structured summary in [AGENTS.md](https://github.com/n8n-io/n8n/blob/master/AGENTS.md) and [package scripts](https://github.com/n8n-io/n8n/blob/master/package.json) | Explicit | **High.** The source supplies one useful arrangement; OCE friction evidence independently establishes the need. |
| **D10 — validation and immune-layer ecology** | [PDR-050 immune layer](../../../../.agent/practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md); broad validators and test scripts in [agent-tools package](../../../../agent-tools/package.json); Practice principles and gate doctrine | [boundary checker](https://github.com/n8n-io/n8n/blob/master/scripts/check-boundaries.mjs); [test containers](https://github.com/n8n-io/n8n/blob/master/packages/testing/containers/README.md); [Playwright orchestration](https://github.com/n8n-io/n8n/blob/master/packages/testing/playwright/docs/ORCHESTRATION.md); root task graph in [turbo.json](https://github.com/n8n-io/n8n/blob/master/turbo.json) | Structural | **High.** Exact overlap and independence of OCE checks still needs a generated inventory. |
| **D11 — executable multi-agent topology simulation** | Unit/E2E/smoke estate in [agent-tools package](../../../../agent-tools/package.json); bespoke topology incidents and plans in the agentic-engineering estate; no declarative topology harness found | Declarative capabilities and infrastructure modes in [test containers](https://github.com/n8n-io/n8n/blob/master/packages/testing/containers/README.md) and capability-aware sharding in [Playwright orchestration](https://github.com/n8n-io/n8n/blob/master/packages/testing/playwright/docs/ORCHESTRATION.md) | Structural + uncertain | **Medium.** Repository search may have missed an equivalent OCE harness. |
| **D12 — Practice evidence and TAU semantic core** | [TAU index](../../../../.agent/plans-backlog-2026-07/telemetry-and-understanding/README.md); [TAU delivery plan](../../../../.agent/plans-backlog-2026-07/telemetry-and-understanding/current/tau-delivery.plan.md); [agent-tools purpose report](../../../../.agent/reports/agentic-engineering/agent-tools-purpose-and-negative-space-concept-exploration-2026-08-01.md) | Provider-neutral definitions and sink separation in [telemetry README](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/telemetry/README.md), event service, metrics and trace attributes | Explicit | **High.** Comparison confirms an already selected OCE plan; it does not generate a rival recommendation. |
| **D13 — capability extension membrane** | [PDR-009](../../../../.agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md); [PDR-035](../../../../.agent/practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md); [PDR-125](../../../../.agent/practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md); adapter and validator tooling in `agent-tools` | Community package lifecycle, module lifecycle, loading and version selection: [community-package lifecycle](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.lifecycle.service.ts), [module registry](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/backend-common/src/modules/module-registry.ts), [loader](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/load-nodes-and-credentials.ts), [versioned type](https://github.com/n8n-io/n8n/blob/master/packages/workflow/src/versioned-node-type.ts) | Explicit + contextual | **Medium-high.** The shared membrane should govern semantics, not imply one executable plugin mechanism. |
| **D14 — compatibility obligation by seam** | Latest-only local substrate clause in [PDR-050](../../../../.agent/practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md); version-family external wire in [PDR-125](../../../../.agent/practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md); replacement doctrine in principles | Persisted artefact versions, mixed-version messages, major-release work and breaking-change history: [versioned type](https://github.com/n8n-io/n8n/blob/master/packages/workflow/src/versioned-node-type.ts), [scaling types](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.types.ts), [DEVELOPING_V3](https://github.com/n8n-io/n8n/blob/master/.github/DEVELOPING_V3.md), [breaking changes](https://github.com/n8n-io/n8n/blob/master/packages/cli/BREAKING-CHANGES.md) | Explicit + contextual | **High.** The estates have different obligations; OCE's seam-specific doctrine is the finding. |
| **D15 — contract-change impact detection** | Numerous specific validators in [agent-tools package](../../../../agent-tools/package.json); propagation and migration doctrine in PDR-050 and PDR-125; no general decision-linked estate detector found | Rule-based scan of actual user estate in [breaking-change module](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/breaking-changes/README.md) | Explicit | **Medium-high.** Generalisation should be tested on one major Practice contract change. |
| **D16 — invariant-led coordination topology** | Coordination home, local state, Director roles, team branch, GitHub/Linear boundaries, inter-Practice pointer model: [PDR-125](../../../../.agent/practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md), [PDR-127](../../../../.agent/practice-core/decision-records/PDR-127-team-branch-coordination-protocol.md), [PDR-024](../../../../.agent/practice-core/decision-records/PDR-024-vital-integration-surfaces.md) | Different topologies for durable scheduler, active workflows, waiting, queues and events: [scheduler](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/scheduler/README.md), [active workflow manager](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/active-workflow-manager.ts), [wait tracker](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/wait-tracker.ts), [scaling service](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.service.ts) | Structural | **Medium-high.** The decision lens is inferred; no claim that source topology should transfer. |
| **D17 — correction, cancellation, and human control** | Owner direction precedence, correction and interruption questions in [agent-tools purpose report](../../../../.agent/reports/agentic-engineering/agent-tools-purpose-and-negative-space-concept-exploration-2026-08-01.md); escalations, handoffs, claims and plan gates | Distinct correction, cancellation, event and bounded background-task paths in [Instance AI architecture](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/instance-ai/docs/architecture.md); cancellation propagation in [active executions](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/active-executions.ts) | Explicit + structural | **High.** OCE intent is strong; the finding concerns missing operational projection. |
| **D18 — communication planes and channel economy** | [collaboration conventions](../../../../.agent/memory/operational/collaboration-state-conventions.md); [state README](../../../../.agent/state/README.md); [PDR-127](../../../../.agent/practice-core/decision-records/PDR-127-team-branch-coordination-protocol.md); [cost-of-collaboration plan](../../../../.agent/plans-backlog-2026-07/agent-tooling/current/cost-of-collaboration.plan.md) | Job-local message types separated from broader process coordination in [scaling types](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/scaling/scaling.types.ts); domain event and relay split | Structural | **High.** The cost claim is independently supported by OCE frictions and plans. |
| **D19 — trust and authority for extensions and participants** | Trusted-agent assumption in [collaboration conventions](../../../../.agent/memory/operational/collaboration-state-conventions.md); open trust questions in [agent-tools purpose report](../../../../.agent/reports/agentic-engineering/agent-tools-purpose-and-negative-space-concept-exploration-2026-08-01.md) | Verification/admission/loading/runtime dimensions in [community package config](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.config.ts), [community lifecycle](https://github.com/n8n-io/n8n/blob/master/packages/cli/src/modules/community-packages/community-packages.lifecycle.service.ts), [runner config](https://github.com/n8n-io/n8n/blob/master/packages/%40n8n/config/src/configs/runners.config.ts) | Explicit + contextual | **High.** Exact hostile-participant controls require separate threat modelling; this report proposes the boundary, not controls. |
| **D20 — subtraction, retirement, and refusal** | Retired awareness workstream in [operational awareness research](../../../../.agent/research/agentic-engineering/operational-awareness-and-state-surfaces.md); current PDR-094 history; plan-estate retirement notes; latest-only local schemas | Deprecated package, major-release removal, retention and compatibility pressure in [node-dev README](https://github.com/n8n-io/n8n/blob/master/packages/node-dev/README.md), [DEVELOPING_V3](https://github.com/n8n-io/n8n/blob/master/.github/DEVELOPING_V3.md), and execution retention | Historical + contextual | **High.** OCE's demonstrated willingness to remove is a preservation finding. |
| **D21 — n8n as a possible specialised participant** | [PDR-024](../../../../.agent/practice-core/decision-records/PDR-024-vital-integration-surfaces.md); [TAU boundaries](../../../../.agent/plans-backlog-2026-07/telemetry-and-understanding/README.md); external organising-surface review; Practice memotype/phenotype doctrine | Source-wide evidence that n8n itself separates semantic definition, transport, execution and deployment roles | Contextual + uncertain | **High** that authority must remain Practice-owned; **low** on a concrete useful workflow until a real pressure is selected. |

## Direct contradiction register

### C01 — coordination-event rotation projection drift

**Canonical authority**

- [PDR-094](../../../../.agent/practice-core/decision-records/PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md):
  full extraction first; archive may remain as optional future-mining substrate; no per-event
  disposition ledger; pass-level watermark.

**Current aligned operational explanation**

- [collaboration-state conventions](../../../../.agent/memory/operational/collaboration-state-conventions.md):
  repeats the no-per-event-ledger and no-curation-obligation contract.

**Stale live projection**

- [state README](../../../../.agent/state/README.md): says rotation is archive-not-delete, requires a
  `manifest.jsonl` disposition row per event, and presents the archive as a retained store.

**Interpretation**

This is evidence for D01, D02, D08, and D20. It should be corrected by the owning migration or
documentation change. This research PR records the finding but does not bundle an unrelated repair.

## Important negative evidence

The scan did **not** support the following claims:

- that the Practice lacks a state/memory distinction;
- that the Practice lacks canonical content and platform-adapter discipline;
- that the Practice lacks liveness semantics;
- that the Practice lacks forgetting or provenance discipline;
- that the Practice should copy a workflow engine architecture;
- that n8n should become the central coordinator;
- that public-product compatibility is appropriate for local Practice state;
- that more telemetry sinks would create understanding;
- that more rules or gates are the default cure;
- that one universal plugin system should govern all capabilities.

## Remaining uncertainty

The following should remain hypotheses until tested:

1. whether a current multi-agent topology simulation harness already exists under a different name;
2. whether enacted-contract projections reduce real cold-agent error enough to justify a new derived
   surface;
3. which common operations are sufficiently deterministic to compress without hiding necessary
   judgement;
4. whether a common capability membrane can remain lightweight across skills, hooks, agents, MCP,
   and organisational surfaces;
5. whether any concrete n8n workflow reduces total coordination cost without becoming hidden
   authority;
6. which Practice event data can be collected ethically and usefully without individual monitoring;
7. whether obligation/attempt identity should live in existing Linear/GitHub surfaces, a local
   substrate, or several checked projections.

## Source-boundary attestation for this register

This register contains paths, links, high-level responsibility descriptions, and original
comparative interpretation only. It contains no copied source code, adapted implementation,
source-derived pseudocode, schema reproduction, prompt reproduction, or excluded Enterprise Edition
material.
