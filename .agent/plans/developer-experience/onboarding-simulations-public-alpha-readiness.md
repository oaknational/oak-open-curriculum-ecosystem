# Onboarding Simulations and Public-Alpha Readiness

**Status**: 🔄 Active (pre-alpha rerun required)  
**Last Updated**: 2026-02-25  
**Owner Boundary**: `developer-experience/`

---

## Purpose

This is the canonical onboarding document for the repository.

It consolidates:

1. the multi-audience onboarding review reports,
2. merge-blocking onboarding remediation outcomes,
3. documentation and governance follow-on tracks, and
4. the required rerun process before public alpha.

This document is authoritative for onboarding status and next action.

---

## Consolidated Sources

Historical source snapshots are preserved for traceability:

- [onboarding.report.2026-02-25.md](./archive/superseded/onboarding.report.2026-02-25.md)
- [onboarding-review-report.2026-02-25.md](./archive/superseded/onboarding-review-report.2026-02-25.md)
- [onboarding-governance-follow-on.plan.2026-02-25.md](./archive/superseded/onboarding-governance-follow-on.plan.2026-02-25.md)
- [onboarding.plan.md](../semantic-search/archive/completed/onboarding.plan.md)
- [onboarding-documentation-follow-on.plan.md](./archive/completed/onboarding-documentation-follow-on.plan.md)

---

## Baseline Review Context (23 February 2026)

Methodology:

- 8 independent onboarding reviews via the `onboarding-reviewer` sub-agent
- persona lenses: junior dev, mid-level dev, lead dev, principal engineer,
  engineering manager, product owner, CTO, CEO
- plan restructuring reviewed by `architecture-reviewer-barney`

## Why Guardrails Exist

Quality gates, type-safety rules, TDD discipline, and architectural constraints
are the structural immune system of the codebase.

Without guardrails, human and AI development drifts, entropy accumulates, and
repository integrity degrades. The rules are not bureaucracy; they are the
mechanism that keeps structure coherent over time.

---

## Baseline Outcomes Snapshot

| Area | Outcome |
|---|---|
| Cross-cutting findings flagged by 4+ personas | 7 |
| Merge-blocking onboarding workstreams (A1-A8) | ✅ Complete (archived) |
| Documentation follow-on items (B7-B10) | ✅ Complete (archived) |
| Governance follow-on items (B1-B6) | 📋 Pending leadership input |
| CEO and Product Owner rerun after fixes | ✅ PASS (2026-02-23) |

### Audience Status (Baseline)

| Audience | Status | Time to first success |
|---|---|---|
| Junior developers | Critical gaps (then remediated) | Blocked initially |
| Mid-level developers | Gaps found | ~1-2 days |
| Lead developers | Gaps found | ~1 day |
| Principal engineers | Gaps found | ~2-4 hours |
| Engineering managers | Gaps found | Process clarity gap |
| Product owners | Critical gaps (then remediated path) | No clear path initially |
| CTOs | Gaps found | Discoverability and risk framing gaps |
| CEOs | Critical gaps | Mission framing absent at entry points |

### Cross-Cutting Findings (4+ Personas)

1. Broken `institutional-memory.md` link in `README.md`
2. Missing prerequisites in onboarding path
3. `pnpm make` docs drift (missing `subagents:check`)
4. `foundation/VISION.md` buried and under-discoverable
5. No human-facing explanation of the agentic practice
6. No documented PR/review process in human docs
7. `.env.example` contradiction on Elasticsearch requirement

---

## Track Status

### Track A: Merge-Blocking Onboarding Remediation

- **Status**: ✅ Complete
- **Archive**: [onboarding.plan.md](../semantic-search/archive/completed/onboarding.plan.md)
- Scope: A1-A8 foundational correctness, onboarding flow, and audience-path fixes.

### Track B (Docs): Documentation Follow-On

- **Status**: ✅ Complete
- **Archive**:
  [onboarding-documentation-follow-on.plan.md](./archive/completed/onboarding-documentation-follow-on.plan.md)
- Completed items:
  - B7 non-technical curriculum domain guide
  - B8 mission framing in milestone roadmap
  - B9 type-generation pipeline constraints/failure-modes doc
  - B10 documentation sustainability and scaling framing

### Track B (Governance): Leadership-Input Items

- **Status**: 📋 Not started
- These cannot be completed by documentation editing alone.

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

- [ ] **B1. Add cost model and sustainability framing to `foundation/VISION.md`**
  - Requires infrastructure-cost evidence and team-model decisions.
- [ ] **B2. Create architectural risk register**
  - Requires organisation-level risk prioritisation.
- [ ] **B3. Add business-level risks and mitigations to `foundation/VISION.md`**
  - Requires reputational, operational, financial, and regulatory framing.
- [ ] **B4. Document agentic-practice transferability**
  - Requires explicit split of general-purpose vs Oak-specific components.
- [ ] **B5. Clarify ecosystem/open-source posture for non-technical audiences**
  - Requires policy decisions for contribution posture.
- [ ] **B6. Expand `SECURITY.md` for organisational risk assessment**
  - Requires data governance and security-posture decisions.

Traceability to baseline report:

| Item | Source finding |
|---|---|
| B1 | CTO: cost/sustainability framing absent |
| B2 | Principal/EM/CTO: no consolidated risk register |
| B3 | CEO/CTO: business risk framing absent |
| B4 | CTO: transferability claim not evidenced |
| B5 | CEO/CTO/PO: open-source posture unclear to non-technical readers |
| B6 | CTO: organisational-level security framing absent |

---

## Public-Alpha Rerun Requirement

A fresh onboarding simulation pass is required before Milestone 1 exit.

Rationale:

- repository state, plan structure, and UX framing changed materially after the
  baseline review,
- public-alpha entry requires confidence across technical and non-technical
  onboarding paths,
- governance/policy gaps must be re-evaluated against current docs and risk posture.

### Rerun Scope

Run updated onboarding simulations against current repository state for:

1. junior dev
2. mid-level dev
3. lead dev
4. principal engineer
5. engineering manager
6. product owner
7. CTO
8. CEO

### Rerun Inputs

- [README.md](../../../README.md)
- [docs/README.md](../../../docs/README.md)
- [docs/foundation/onboarding.md](../../../docs/foundation/onboarding.md)
- [docs/foundation/VISION.md](../../../docs/foundation/VISION.md)
- [high-level-plan.md](../high-level-plan.md)
- [user-experience/public-alpha-experience-contract.md](../user-experience/public-alpha-experience-contract.md)

### Rerun Output Contract

For each persona, capture:

1. entry-point success/failure in first 5 minutes,
2. time-to-first-success estimate,
3. blocker list (P0/P1/P2/P3),
4. trust and clarity observations,
5. remediation recommendations mapped to permanent-doc locations,
6. whether issue is docs-only or leadership/policy dependent.

### Pre-Alpha Exit Criteria (Onboarding)

All must be true:

1. no P0 onboarding blockers across the 8 personas,
2. no contradictory onboarding instructions in canonical entry points,
3. public-alpha UX baseline is clear in both technical and non-technical framing,
4. remaining governance items (B1-B6) are either resolved or explicitly accepted
   as deferred with owner, rationale, and review date.

---

## Post-Rerun Closure Process

After rerun completion:

1. mine settled findings into permanent docs (ADRs, `/docs/`, collection README files),
2. update this document with the new baseline and decision log,
3. archive rerun execution artefacts under `archive/completed/` with dates,
4. keep this file as the single active onboarding status hub.

---

## Delta Findings Added (Junior Simulation, 25 February 2026)

The following findings were added from a root-README-first junior simulation
run completed on **2026-02-25**.

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

- [ ] **D1. Entry-point cognitive load remains high for junior contributors**
  - Evidence:
    - onboarding Step 2 requires reading multiple heavy directives before first
      implementation work (`onboarding.md`, `AGENT.md`, `rules.md`).
    - root README transitions quickly into practice internals for users who may
      still be orienting.
  - Impact:
    - slower confidence-building and delayed time-to-first-meaningful-change.
  - Recommended action:
    - add a strict "junior fast path" that preserves quality gates while
      minimising mandatory first-pass reading.
  - Classification: docs/process framing (no policy dependency).

- [ ] **D2. Local hook strictness creates early-journey friction**
  - Evidence:
    - pre-commit runs `format-check`, `markdownlint-check`, and
      `type-check/lint/test`.
    - pre-push runs secret scan, sdk-codegen/build verification, drift checks,
      and E2E.
  - Impact:
    - first contribution cycles can feel unexpectedly heavy to juniors.
  - Recommended action:
    - document expected hook/runtime cost up front in onboarding and provide a
      "what to run before first commit" expectation block.
  - Classification: docs/process framing (policy-preserving).

- [ ] **D3. Test-surface expectations are still easy to misread**
  - Evidence:
    - CI runs `pnpm test`; broader suites (`test:ui`, `test:e2e`, smoke) are
      covered via other local surfaces (`pnpm qg`, `pnpm check`, hooks).
  - Impact:
    - junior contributors may incorrectly assume CI is full-system coverage.
  - Recommended action:
    - add a concise test-surface matrix in onboarding and quick-start docs with
      plain-language intent per surface.
  - Classification: docs-only.

Notes:

- The credential mismatch and stale security-guide terminology findings were
  actioned directly in canonical docs on 2026-02-25 and are not tracked here as
  open D-items.

---

## Change Log

- **2026-02-25**: Consolidated onboarding report + plan set into one canonical
  document; preserved legacy source snapshots in `archive/superseded/`.
- **2026-02-25**: Added delta findings D1-D3 from junior onboarding simulation.
