---
title: "Telemetry and Understanding research"
type: research-index
status: active
last_updated: 2026-07-14
---

# Telemetry and Understanding research

This directory contains the evidence and reasoning behind the
**Telemetry and Understanding System (TAU)** delivery programme.

TAU names a full loop:

```text
telemetry -> analysis -> interpretation -> understanding -> decision -> change -> outcome evidence
```

The programme is deliberately wider than a vendor integration and wider than
the existing `observability/` plan collection. It joins product analytics,
engineering observability, structured logging, monitoring, feedback,
experimentation, privacy, analysis, and decision use around explicit outcome
questions.

## Research set

| Document | Purpose |
|---|---|
| [Concept exploration and conserved decision passes](2026-07-11-concept-exploration-and-decision-matrix.md) | Tests the concept space using public Oak Reason/metacognition movements plus locally documented, re-derivable decision passes. |
| [Architecture and intent-corpus review](2026-07-11-architecture-and-intent-corpus-review.md) | Reviews the current logging, observability, monitoring, analytics, and analysis corpus as one system. |
| [PostHog baseline and build-vs-buy](2026-07-11-posthog-baseline-and-build-vs-buy.md) | Records the live empty-project baseline, current first-party capabilities, and adapter decisions. |
| [Sentry integration disposition ledger](2026-07-11-sentry-integration-disposition-ledger.md) | Dispositions the stalled Sentry work into preserve, complete, absorb, defer, or retire lanes. |

## Planning outputs

The research is operationalised by:

- [`plans/telemetry-and-understanding/roadmap.md`](../../plans-backlog-2026-07/telemetry-and-understanding/roadmap.md)
- [`plans/telemetry-and-understanding/current/tau-delivery.plan.md`](../../plans-backlog-2026-07/telemetry-and-understanding/current/tau-delivery.plan.md)

## Evidence authority by claim type

Resolve disagreement according to the claim being made:

- **Current runtime behaviour:** executable code and tests first, then live
  provider state and generated inventories. Plans and owner direction cannot
  override observed current-state facts.
- **Target direction and priority:** current owner direction, strategy, and
  accepted ADRs govern intent; a promoted TAU plan may sequence delivery after
  its Stage 0 authority gate closes.
- **Provider capability:** current first-party vendor documentation and live
  project probes govern what is available and configured.
- **Historical context:** superseded plans, reports, and memory remain evidence
  of prior intent and decisions, not current runtime or delivery authority.

## Live baseline

> **Dated snapshot — superseded in practice.** Production capture went live
> 2026-07-29 (runtime composition MCP-241; thousands of events within the
> first day). The zeros below describe the 2026-07-11 starting condition
> only; read live state from the PostHog project, never from this table.

The PostHog project inspected on 2026-07-11 is:

- project: **Oak Open Curriculum Ecosystem**
- project/team id: `221775`
- timezone: `Europe/London`
- event count: `0`
- feature flags: `0`
- experiments: `0`
- surveys: `0`
- warehouse sources: `0`
- Oak-authored dashboards or insights: `0`
- default internal/test-user cohort present and excluded by the project filter

This is an unusually useful starting condition: TAU can establish naming,
privacy, identity, question, and project-configuration discipline before any
production data accumulates.
