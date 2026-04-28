# Reviewer System and Review Operations

This deep dive covers the reviewer gateway, specialist-review routing, review
depth, and reintegration discipline.

## Canonical Anchors

- [ADR-114](../../../../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md)
- [ADR-129](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)
- [ADR-146](../../../../docs/architecture/architectural-decisions/146-assumptions-reviewer-meta-level-plan-assessment.md)
- [ADR-149](../../../../docs/architecture/architectural-decisions/149-frontend-specialist-reviewer-gateway-cluster.md)
- [invoke-code-reviewers.md](../../../memory/executive/invoke-code-reviewers.md)

## Operational and Canon-Adjacent Sources

- [reviewer-gateway-upgrade.plan.md](../../../plans/agentic-engineering-enhancements/current/reviewer-gateway-upgrade.plan.md)

## Staged and Reflective Sources

- [reviewer-gateway-operations.md](../../../practice-context/outgoing/reviewer-gateway-operations.md)
- [production-reviewer-scaling.md](../../../practice-context/outgoing/production-reviewer-scaling.md)
- [2026-03-10-the-reviewers-as-collaborators.md](../../../experience/2026-03-10-the-reviewers-as-collaborators.md)
- [phase-5-sub-agents-collaboration.md](../../../experience/phase-5-sub-agents-collaboration.md)

## Discoverability Research and Audits

- [2026-02-20-onboarding-review.md](../../../research/developer-experience/2026-02-20-onboarding-review.md)
- [documentation-audit-report.md](../../../research/documentation-audit-report.md)

## Current Synthesis

- The reviewer system is no longer just a list of specialists. The core concept
  is a **gateway** that performs layered triage, selects review depth, and
  tracks coverage.
- ADR-114 and ADR-129 explain the structural side: templates, wrappers, and
  reviewer/skill/rule triplets. The gateway plan and practice-context notes
  explain the operational side: when to invoke whom, how much review to ask
  for, and how to reintegrate findings.
- Review discoverability and onboarding are part of the same problem. If
  contributors cannot see the roster, entry points, or ADR path, the review
  system degrades operationally before it degrades conceptually.
- Experience records show the intended social framing: reviewers are meant to
  collaborate and sharpen decisions, not simply gatekeep from a distance.

## Good Follow-Up Questions

- Which specialist clusters now need formal promotion out of staged
  practice-context notes?
- Where should discoverability responsibilities sit: gateway docs, onboarding
  docs, or hub-style concept indexes?
- Which reviewer outputs should graduate into formal report lanes rather than
  remaining session-local?

## Related Lanes

- [research reviewer lane](../../../research/agentic-engineering/reviewer-systems-and-discoverability/README.md)
- [formal synthesis lane](../../../reports/agentic-engineering/deep-dive-syntheses/README.md)
- [plans collection](../../../plans/agentic-engineering-enhancements/README.md)
- [deep-dives index](./README.md)
- [hub README](../README.md)
