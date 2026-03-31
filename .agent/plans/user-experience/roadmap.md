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

- **Milestone 2**: educator + engineering/Ed-Tech user experience is ready for
  open public alpha.
- **Milestone 3**: learner-facing scope assessment and safeguarding-led
  promotion decisions.

See [high-level-plan.md](../high-level-plan.md) for the full milestone map.

---

## Current Readiness Position (2026-02-25)

### Public-Alpha UX Baseline

The intended alpha UX baseline is minimal and should currently be true:

1. SDK works
2. Search works
3. MCP server works
4. ChatGPT key commands show basic branding

### Open UX Decision

One UX decision remains:

1. whether to support MCP Apps extension enough to show basic branding in Claude
   before public alpha

### Remaining Non-UX Blocker

1. Sentry + OTel foundation verification for the HTTP MCP server and Search CLI

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
  - Milestone 2 UI-surface decision criteria are defined (Option X/Option Y)
  - dependencies to technical plans are linked
- Dependencies: none

### Phase 1 — Educator and Engineering Alpha Readiness

- Segment briefs:
  - [educator-end-users/README.md](educator-end-users/README.md)
  - [engineering-end-users/README.md](engineering-end-users/README.md)
- Executable plans (current):
  - [engineering-end-users/current/search-sdk-github-release-asset-distribution.execution.plan.md](engineering-end-users/current/search-sdk-github-release-asset-distribution.execution.plan.md)
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

## Milestone 1 UI-Surface Decision Gate (UX-Owned)

The UX collection is authoritative for decision criteria between:

1. **Option X**: support MCP Apps extension sufficiently to show basic branding
   in Claude before public alpha
2. **Option Y**: launch with ChatGPT basic branding only and add Claude basic
   branding support in Milestone 2

Evidence inputs for this gate:

1. Supported-client compatibility and risk evidence from
   [../sdk-and-mcp-enhancements/roadmap.md](../sdk-and-mcp-enhancements/roadmap.md)
2. Renderer/reactivation sequencing and prerequisites from
   [../semantic-search/future/08-experience-surfaces-and-extensions/widget-renderer-reactivation.md](../semantic-search/future/08-experience-surfaces-and-extensions/widget-renderer-reactivation.md)
3. Milestone-level trade-off framing from
   [../high-level-plan.md](../high-level-plan.md)

Decision focus for this cycle:

- whether Claude basic-branding support (via MCP Apps extension) is required
  before public alpha, or can be deferred post-alpha.

Decision output:

- One explicit selected option, with rationale, expected user impact, and
  rollback posture documented in
  [public-alpha-experience-contract.md](public-alpha-experience-contract.md).

---

## Cross-Collection Dependencies

| Collection | Dependency |
|------------|------------|
| `semantic-search/` | Relevance and retrieval quality for user trust |
| `sdk-and-mcp-enhancements/` | MCP extension host compatibility and UX surface evolution |
| `security-and-privacy/` | Safety, evidence discipline, and trust boundary assurance |
| `architecture-and-infrastructure/` | Reliability and observability that users directly feel |
| `developer-experience/` | Integration ergonomics for developer adoption |
| `external/ooc-api-wishlist/` | Upstream API/schema constraints that affect UX feasibility |
| `research/auth/` | Clerk production migration decision and rollout planning |
