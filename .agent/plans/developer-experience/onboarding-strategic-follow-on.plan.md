# Onboarding: Strategic / Governance Follow-On

> **Status**: NOT STARTED — schedule post-merge
>
> **Date**: 23 February 2026
>
> **Source**: [onboarding-review-report.md](./onboarding-review-report.md)
>
> **Merge-blocking plan**: [active/onboarding.plan.md](../semantic-search/active/onboarding.plan.md)
>
> These items emerged from the CTO, CEO, and principal engineer reviews. They
> are important for organisational positioning and risk management, but they are
> **strategy and governance decisions**, not onboarding documentation fixes.
> They should be scheduled as separate work items after merge.

## Items

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

- [ ] **B1. Add cost model/sustainability framing to VISION.md**
  - Audiences: CTO, CEO
  - Action: Add a "Cost Model and Sustainability" section covering
    infrastructure costs, team model, key technology dependencies, and how the
    agentic practice mitigates bus-factor risk.

- [ ] **B2. Create architectural risk register**
  - Audiences: Principal, CTO, EM
  - Action: Acknowledge key risks: bus factor, documentation volume
    sustainability, platform coupling (Cursor), single-provider search backend,
    SDK decomposition in progress. Include mitigations.

- [ ] **B3. Add "Risks and Mitigations" to VISION.md (business terms)**
  - Audiences: CEO, CTO
  - Action: Top 3-5 risks in business terms: reputational (AI misuse of
    curriculum), operational (bus factor, key-person), financial (infrastructure
    costs), regulatory (OGL compliance at scale). With mitigations.

- [ ] **B4. Document agentic practice transferability**
  - Audiences: CTO, Principal
  - Action: Identify which components are general-purpose (learning loop,
    sub-agent review, quality gates) vs Oak-specific (curriculum-domain skills,
    MCP tools). Outline path to adoption elsewhere.

- [ ] **B5. Articulate ecosystem/open-source strategy for non-technical audiences**
  - Audiences: CEO, CTO, PO
  - Action: Explain why openness is a strategic advantage for a non-profit
    whose goal is system-level impact. Clarify the current posture
    (source-available for reuse, not yet accepting external contributions) and
    future intent. Address the "not accepting contributions" vs MIT-licensed
    tension.

- [ ] **B6. Expand SECURITY.md for organisational risk assessment**
  - Audiences: CTO, CEO
  - Action: Address data governance, PII handling model, MCP security posture
    at an organisational level. Currently covers vulnerability reporting and
    secret scanning only.

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

Every item traces back to the audience-specific findings in the
[onboarding review report](./onboarding-review-report.md):

| Item | Report Findings |
|---|---|
| B1 | CTO P1: VISION.md lacks cost model/sustainability |
| B2 | Principal P1: No architectural risk register; EM P2: Bus factor; CTO P2: No technology risk register |
| B3 | CEO P2: Risk communication absent; CTO P2: Bus factor |
| B4 | CTO P2: Practice transferability claimed but not evidenced |
| B5 | CEO P2: Ecosystem/open-source strategy not articulated; CTO P2: Contributing section ambiguous; CEO P3: CONTRIBUTING.md contradictory signal |
| B6 | CTO P2: SECURITY.md minimal for CTO risk assessment |
| B7 | PO P2: No user personas; PO P2: Domain model only in TypeScript; CEO P2: Capability table jargon |
| B8 | PO P2: Roadmap milestones in engineering language; CEO P2: Roadmap has no mission framing |
| B9 | Principal P2: No pipeline failure mode documentation |
| B10 | Principal P2: Excessive Cardinal Rule repetition; Principal P2: Agentic practice sustainability; EM P2: Scaling characteristics; CTO P2: ADR count visibility |

## Specialist Delegations

| Specialist | Items |
|---|---|
| `architecture-reviewer-betty` | B10 (documentation volume sustainability, scaling risk) |
| `security-reviewer` | B6 (SECURITY.md expansion for organisational risk assessment) |
| `docs-adr-reviewer` | B1, B3, B5 (VISION.md structural improvements, strategy articulation) |
