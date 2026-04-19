# Governance Planes, Trust Boundaries, and Runtime Supervision

This deep dive covers the governance-plane concepts that sit around execution:
boundary modelling, authority, layered safeguards, and supervised execution.

## Canonical Anchors

- [ADR-119](../../../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
- [ADR-125](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
- [ADR-131](../../../../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)
- [ADR-150](../../../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
- [How the Agentic Engineering System Works](../../../../docs/foundation/agentic-engineering-system.md)

## Primary Local Source Material

- [workbench-agent-operating-topology.md](../workbench-agent-operating-topology.md)
- [operating-model-and-topology.md](./operating-model-and-topology.md)
- [operational-awareness-and-state-surfaces.md](./operational-awareness-and-state-surfaces.md)
- [reviewer-system-and-review-operations.md](./reviewer-system-and-review-operations.md)
- [agentic-mechanism-inventory-baseline.md](../../../analysis/agentic-mechanism-inventory-baseline.md)
- [governance-concepts-and-mechanism-gap-baseline.md](../../../analysis/governance-concepts-and-mechanism-gap-baseline.md)
- [governance-concepts-and-integration-report.md](../../../reports/agentic-engineering/deep-dive-syntheses/governance-concepts-and-integration-report.md)

## Current Synthesis

- The repo already has strong **work execution** surfaces: plans, reviewers,
  quality gates, continuity, and evidence lanes.
- The compared governance concepts clarify a second view: a **governance
  plane** around execution that decides what should happen, under what
  boundary conditions, with what safeguards, and with what residual risk.
- The strongest reflective framing that falls out of the comparison is a
  **three-plane view**:
  - **work plane**: execution, edits, checks, and closeout
  - **governance plane**: decisions, boundaries, escalation, and safeguards
  - **learning plane**: napkin, distilled, consolidation, and durable docs
- In local terms, the most useful abstractions are:
  - an **external decision layer** outside model reasoning
  - a **boundary model** across human, agent, tool, work plane, and control
    plane
  - a **layered safeguard stack** across rules, reviewers, gates, continuity,
    and runtime surfaces
  - a **supervised execution lifecycle** that can observe, pause, recover,
    redirect, and close work cleanly
  - a **signal ecology** of sensors, alerts, feedback loops, and routing
    behaviour
- The repo is already strongest on the work plane and learning plane. It is
  weaker, or at least less explicitly named, on:
  - authority gradients
  - residual-risk surfaces
  - attempt / observed outcome / proven result structure
  - explicit govern/do-not-govern statements

## Why This Matters

- It stops the continuation prompt, reviewer gateway, and evidence lane from
  each trying to carry the whole governance story alone.
- It provides a better explanation of how the repo's control surfaces interact
  without pretending they are all the same thing.
- It creates a clean bridge from local operational detail to broader mechanism
  taxonomy work.

## Best Current Routing

- [operational-awareness-and-continuity-surface-separation.plan.md](../../../plans/agentic-engineering-enhancements/current/operational-awareness-and-continuity-surface-separation.plan.md)
  should own short-horizon awareness surfaces and supervised execution at the
  work-plane level.
- [reviewer-gateway-upgrade.plan.md](../../../plans/agentic-engineering-enhancements/current/reviewer-gateway-upgrade.plan.md)
  should own signal routing, escalation semantics, and the review-facing part
  of the safeguard stack.
- [hallucination-and-evidence-guard-adoption.plan.md](../../../plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md)
  remains the right execution home for evidence-quality upgrades such as the
  attempt / observed outcome / proven result structure.
- [operating-model-mechanism-taxonomy.plan.md](../../../plans/agentic-engineering-enhancements/future/operating-model-mechanism-taxonomy.plan.md)
  should own the broader abstraction work around boundary models, signal
  ecology, residual risk, and adoption ladders.

## Good Follow-Up Questions

- Which governance-plane concepts improve current execution immediately, and
  which still need a pilot before they deserve a stable home?
- Where should residual-risk and limitation material live so it is durable
  without becoming a second canon?
- Which boundary concepts belong in doctrine-adjacent human-facing docs, and
  which should remain local engineering reference material?

## Related Lanes

- [analysis lane](../../../analysis/README.md)
- [formal synthesis lane](../../../reports/agentic-engineering/deep-dive-syntheses/README.md)
- [plans collection](../../../plans/agentic-engineering-enhancements/README.md)
- [deep-dives index](./README.md)
- [hub README](../README.md)
