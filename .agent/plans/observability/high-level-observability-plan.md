---
title: "High-Level Observability Plan"
status: skeleton
phase_filled: 2
last_updated: 2026-04-18
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
direction_session: "docs/explorations/2026-04-18-observability-strategy-and-restructure.md"
execution_plan: ".agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md"
---

# High-Level Observability Plan

> **Status: skeleton.** This document was created in Phase 1 of the
> observability strategy restructure to establish the destination. Its
> substantive content is authored in Phase 2. Each section below is a
> placeholder with the intended scope noted.

## Purpose

Authoritative index for observability across the repo. Every
observability-related plan, ADR, and exploration is reachable from
here.

## Observability Principle

(Filled in Phase 2.) Condensed restatement of [ADR-162](../../../docs/architecture/architectural-decisions/162-observability-first.md) §Principle.

## Five Axes — MVP Scope

(Filled in Phase 2.) For each of the five axes — engineering, product,
usability, accessibility, security — list:

- MVP deliverable names + owning plan(s).
- Post-MVP deliverable names + owning future plan(s).
- Explorations informing scope.

## Launch Criteria

(Filled in Phase 2.) The data-scientist / engineer / product-owner /
a11y-reviewer test: can each answer their first-order questions from
telemetry alone on launch day?

## MVP Gate Summary

(Filled in Phase 2.) Which lanes must close before public beta launch
vs which can close post-launch.

## Plan Map

(Filled in Phase 2.) Full list of `active/` + `current/` + `future/`
observability plans with one-line summaries and promotion triggers
where applicable.

## Explorations Map

(Filled in Phase 2.) Eight initial explorations + status + which plan
each informs.

## Vendor-Independence Invariants

(Filled in Phase 2.) Short list of tests that prove ADR-162's
vendor-independence clause programmatically.

## Coordination Points With Non-Observability Workstreams

(Filled in Phase 2.) Where other plans (search, auth, rate-limit,
curriculum) emit events into the schema workspace.

## Related

- [Observability directory README](./README.md)
- [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
- [Direction-setting session report](../../../docs/explorations/2026-04-18-observability-strategy-and-restructure.md)
- [Observability strategy restructure plan](../../../.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md)
- [Repo-wide plan index](../high-level-plan.md)
