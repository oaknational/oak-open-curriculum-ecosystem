# User Experience Roadmap

**Status**: 📋 Phase 0 ready to start  
**Last Updated**: 2026-02-25

---

## Purpose

This roadmap defines UX strategy sequencing for public-alpha readiness across
the three user segments in this collection.

Execution detail remains in the technical collections. This roadmap governs
whether those outputs combine into a coherent user experience.

---

## Milestone Context

- **Milestone 1**: educator + engineering/Ed-Tech user experience is ready for
  public alpha.
- **Milestone 2**: learner-facing scope assessment and safeguarding-led
  promotion decisions.

See [high-level-plan.md](../high-level-plan.md) for the full milestone map.

---

## Execution Order

```text
Phase 0: Public-alpha UX contract and evidence model       📋 PLANNED
Phase 1: Educator + engineering alpha readiness            📋 PLANNED
Phase 2: Learner discovery and safeguarding gate review    📋 PLANNED
```

---

## Phase Details

### Phase 0 — Public-Alpha UX Contract and Evidence Model

- Primary artefact:
  [public-alpha-experience-contract.md](public-alpha-experience-contract.md)
- Done when:
  - user-segment outcomes are explicit and non-overlapping
  - no-go conditions for public alpha are defined
  - success signals and telemetry expectations are documented
  - dependencies to technical plans are linked
- Dependencies: none

### Phase 1 — Educator and Engineering Alpha Readiness

- Segment briefs:
  - [educator-end-users/README.md](educator-end-users/README.md)
  - [engineering-end-users/README.md](engineering-end-users/README.md)
- Done when:
  - educator core journeys are stable enough for alpha usage
  - engineering/Ed-Tech consumers have predictable contracts and diagnostics
  - top UX risks are mapped to technical mitigations
- Dependencies: Phase 0 complete

### Phase 2 — Learner Discovery and Safeguarding Gate Review

- Segment brief:
  [learner-end-users/README.md](learner-end-users/README.md)
- Done when:
  - learner scope decisions are evidence-backed
  - safeguarding/moderation prerequisites are explicit
  - promotion trigger from deferred to active planning is documented
- Dependencies: Phase 1 complete

---

## Cross-Collection Dependencies

| Collection | Dependency |
|------------|------------|
| `semantic-search/` | Relevance and retrieval quality for user trust |
| `sdk-and-mcp-enhancements/` | MCP extension host compatibility and UX surface evolution |
| `security-and-privacy/` | Safety, evidence discipline, and trust boundary assurance |
| `architecture-and-infrastructure/` | Reliability and observability that users directly feel |
| `developer-experience/` | Integration ergonomics for developer adoption |
