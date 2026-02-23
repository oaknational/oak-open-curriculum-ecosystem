# Onboarding: Documentation Follow-On

> **Status**: NOT STARTED — schedule post-merge
>
> **Date**: 23 February 2026
>
> **Source**: [onboarding-review-report.md](./onboarding-review-report.md)
>
> **Merge-blocking plan (complete)**:
> [active/onboarding.plan.md](../semantic-search/active/onboarding.plan.md)
>
> **Governance follow-on**:
> [governance/onboarding-governance-follow-on.plan.md](./governance/onboarding-governance-follow-on.plan.md)
>
> These items are **documentation fixes** that can be resolved by writing or
> editing documentation using information already available in the repository.
> They do not require organisational policy input.

## Items

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

- [ ] **B7. Create non-technical curriculum domain guide**
  - Audiences: PO, CEO
  - Action: Explain key stages, subjects, lessons, units, and threads in plain
    language. Source from `ontology-data.ts` descriptions. Explain why these
    distinctions matter for search and discovery. Include user persona sketches
    for the three audience groups (developers, AI agents, teachers) with needs
    and journeys.

- [ ] **B8. Add mission framing to roadmap milestones**
  - Audiences: PO, CEO
  - Action: For each milestone in `high-level-plan.md`, add a one-sentence
    user-impact summary. E.g. "Milestone 1: Public Alpha — external developers
    and AI platforms can access Oak's curriculum for the first time."

- [ ] **B9. Document type-generation pipeline constraints and failure modes**
  - Audiences: Principal
  - Action: Add a "Known Constraints and Limitations" section to
    `docs/architecture/openapi-pipeline.md` covering unsupported OpenAPI
    patterns, known Zod generation edge cases, what breaking schema changes look
    like in practice, and the planned Castr migration.

- [ ] **B10. Address documentation scaling and sustainability**
  - Audiences: Principal, CTO
  - Action: Add a sustainability statement to `practice.md` or ADR-119
    acknowledging the maintenance cost of 500+ agent-related files, describing
    the consolidation mechanisms that manage it, and identifying the point at
    which the practice might need restructuring. Address Cardinal Rule
    repetition across 8+ documents (conscious trade-off for discoverability vs
    DRY risk).

---

## Traceability to Report

| Item | Report Findings |
|---|---|
| B7 | PO P2: No user personas; PO P2: Domain model only in TypeScript; CEO P2: Capability table jargon |
| B8 | PO P2: Roadmap milestones in engineering language; CEO P2: Roadmap has no mission framing |
| B9 | Principal P2: No pipeline failure mode documentation |
| B10 | Principal P2: Excessive Cardinal Rule repetition; Principal P2: Agentic practice sustainability; EM P2: Scaling characteristics; CTO P2: ADR count visibility |

## Specialist Delegations

| Specialist | Items |
|---|---|
| `architecture-reviewer-betty` | B10 (documentation volume sustainability, scaling risk) |
| `docs-adr-reviewer` | B7, B8 (domain guide, milestone framing) |
