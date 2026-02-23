# Onboarding: Governance Follow-On

> **Status**: NOT STARTED — schedule post-merge
>
> **Date**: 23 February 2026
>
> **Source**: [onboarding-review-report.md](../onboarding-review-report.md)
>
> **Merge-blocking plan (complete, archived)**:
> [onboarding.plan.md](../../semantic-search/archive/completed/onboarding.plan.md)
>
> **Documentation follow-on (complete, archived)**:
> [onboarding-documentation-follow-on.plan.md](../archive/completed/onboarding-documentation-follow-on.plan.md)
>
> These items emerged from the CTO, CEO, and principal engineer reviews. They
> require **organisational policy input, cost data, or strategic decisions**
> that do not currently exist in the repository. They cannot be resolved by
> writing documentation alone — they need input from leadership.

## Items

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

- [ ] **B1. Add cost model/sustainability framing to VISION.md**
  - Audiences: CTO, CEO
  - Requires: Real infrastructure cost data, team model decisions
  - Action: Add a "Cost Model and Sustainability" section covering
    infrastructure costs, team model, key technology dependencies, and how the
    agentic practice mitigates bus-factor risk.

- [ ] **B2. Create architectural risk register**
  - Audiences: Principal, CTO, EM
  - Requires: Organisational risk assessment and prioritisation
  - Action: Acknowledge key risks: bus factor, documentation volume
    sustainability, platform coupling (Cursor), single-provider search backend,
    SDK decomposition in progress. Include mitigations.

- [ ] **B3. Add "Risks and Mitigations" to VISION.md (business terms)**
  - Audiences: CEO, CTO
  - Requires: Business-level risk decisions (reputational, operational,
    financial, regulatory)
  - Action: Top 3-5 risks in business terms: reputational (AI misuse of
    curriculum), operational (bus factor, key-person), financial (infrastructure
    costs), regulatory (OGL compliance at scale). With mitigations.

- [ ] **B4. Document agentic practice transferability**
  - Audiences: CTO, Principal
  - Requires: Strategic analysis of what is general-purpose vs Oak-specific
  - Action: Identify which components are general-purpose (learning loop,
    sub-agent review, quality gates) vs Oak-specific (curriculum-domain skills,
    MCP tools). Outline path to adoption elsewhere.

- [ ] **B5. Articulate ecosystem/open-source strategy for non-technical audiences**
  - Audiences: CEO, CTO, PO
  - Requires: Policy decisions about contribution acceptance and open-source
    posture
  - Action: Explain why openness is a strategic advantage for a non-profit
    whose goal is system-level impact. Clarify the current posture
    (source-available for reuse, not yet accepting external contributions) and
    future intent. Address the "not accepting contributions" vs MIT-licensed
    tension.

- [ ] **B6. Expand SECURITY.md for organisational risk assessment**
  - Audiences: CTO, CEO
  - Requires: Organisational security posture decisions, data governance policy
  - Action: Address data governance, PII handling model, MCP security posture
    at an organisational level. Currently covers vulnerability reporting and
    secret scanning only.

---

## Traceability to Report

| Item | Report Findings |
|---|---|
| B1 | CTO P1: VISION.md lacks cost model/sustainability |
| B2 | Principal P1: No architectural risk register; EM P2: Bus factor; CTO P2: No technology risk register |
| B3 | CEO P2: Risk communication absent; CTO P2: Bus factor |
| B4 | CTO P2: Practice transferability claimed but not evidenced |
| B5 | CEO P2: Ecosystem/open-source strategy not articulated; CTO P2: Contributing section ambiguous; CEO P3: CONTRIBUTING.md contradictory signal |
| B6 | CTO P2: SECURITY.md minimal for CTO risk assessment |

## Specialist Delegations

| Specialist | Items |
|---|---|
| `security-reviewer` | B6 (SECURITY.md expansion for organisational risk assessment) |
| `docs-adr-reviewer` | B1, B3, B5 (VISION.md structural improvements, strategy articulation) |
