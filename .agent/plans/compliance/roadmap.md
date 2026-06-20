# Compliance Roadmap

**Status**: Phase 0 ready to start
**Last Updated**: 2026-04-14
**Session Entry**: [start-right-quick.md](../../commands/start-right-quick.md)

---

## Purpose

Strategic phase sequence for external policy compliance covering both the
Anthropic Software Directory Policy and the OpenAI ChatGPT App Submission
Guidelines. Execution detail lives in lifecycle plans.

Authoritative execution sources:

1. [app-submission-standards.plan.md](../user-experience/educator-end-users/current/app-submission-standards.plan.md)

---

## Documentation Synchronisation Requirement

No phase can be marked complete until documentation updates are handled for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/practice-core/practice.md`
3. any additionally impacted ADRs, `/docs/` pages, or README files

---

## Current State

- Anthropic Software Directory Policy audit complete (2026-04-14)
- OpenAI ChatGPT App Submission Guidelines audit complete (2026-04-14)
- Server largely compliant across both policy sets
- 5 gaps identified (2 shared, 3 OpenAI-specific process items)
- No compliance-specific governance documentation exists yet
- 15 permanent architectural requirements identified for codification

---

## Statutory & Release-Blocking Compliance (production gate)

Distinct from the platform directory-submission phases below: a set of statutory and
safety-compliance obligations that **block production release** of the MCP app. **Most of
this work is performed by experts outside this repository** (legal, DPO, safeguarding, Oak's
analytics/research and AI Platform teams) — the repo's job is to **acknowledge, track, and
gate on** them, not to resolve them in-repo. None may be assumed complete; each is a
production go/no-go gate.

| Requirement | What | Execution | In-repo status |
|---|---|---|---|
| **ATRS** — [Algorithmic Transparency Recording Standard](https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub) | As an arms-length public body, Oak must publish an ATRS record before release. | External | Tracked here; no in-repo execution |
| **Detailed DPIA** | Full Data Protection Impact Assessment across the live data flows (Clerk + PostHog + Sentry). | External (DPO/legal) | Named in [launch-readiness §B3](../curriculum-mcp-path-to-ga/launch-readiness-framework.md); tracked here |
| **ICO Children's Code** | Applicability ruling + conformance — **cross-linked to the target-audience decision** (teachers/curriculum leaders; nothing aimed at students). | External (legal) + product | See [launch-readiness K2 ↔ §B3](../curriculum-mcp-path-to-ga/launch-readiness-framework.md); discussion open |
| **Safeguarding & content-safety assessment** | Assessed at the pupil boundary; the teacher is the safety layer. | External (safeguarding + editorial) | Named in [launch-readiness §B1](../curriculum-mcp-path-to-ga/launch-readiness-framework.md); tracked here |
| **Independent AI-output safety & quality evals** | Stress-test the MCP's AI outputs against Oak's quality and safety benchmarks. | External (Oak AI Platform) | No in-repo owner; tracked here |

The authoritative readiness catalogue for all of the above is
[launch-readiness-framework.md](../curriculum-mcp-path-to-ga/launch-readiness-framework.md)
Groups A–D; this section is the compliance lane's tracking view of the production-blocking
subset. Privacy policy / T&Cs surfacing has its own in-repo execution lane (Phase 1 below);
the legal decide-and-publish step is external.

---

## Execution Order

```text
Phase 0: Governance documentation (ADR + docs)        CURRENT
Phase 1: Privacy policy integration                    CURRENT
Phase 2: Graph sub-querying for token efficiency       CURRENT
Phase 3: Submission readiness (both platforms)          FUTURE (process, not code)
```

---

## Phase Details

### Phase 0 — Governance Documentation

- Plan: [app-submission-standards.plan.md](../user-experience/educator-end-users/current/app-submission-standards.plan.md) (WS1)
- Done when:
  - ADR-159 records the decision to comply with both policies
  - 15 permanent architectural requirements codified
  - `docs/governance/safety-and-security.md` extended with requirements
    and submission checklist
  - `oakContextHint` rationale documented
- Dependencies: none

### Phase 1 — Privacy Policy Integration

- Plan: [app-submission-standards.plan.md](../user-experience/educator-end-users/current/app-submission-standards.plan.md) (WS2)
- Done when:
  - Privacy and cookie policy links surfaced in server metadata, README,
    and OAuth discovery endpoints
  - Data handling statement documented
- Dependencies: none (can run in parallel with Phase 0)

### Phase 2 — Graph Sub-Querying for Token Efficiency

- Plan: [app-submission-standards.plan.md](../user-experience/educator-end-users/current/app-submission-standards.plan.md) (WS3-WS5)
- Done when:
  - All three graph tools accept per-surface filter params and
    `mode: 'summary'`
  - Prior-knowledge + misconception: `subject`/`keyStage` filters
  - Thread progressions: `subject` (array-contains) + `year` (range)
  - Factory generic over both data type and filter args type
  - TDD complete (RED/GREEN/REFACTOR)
- Dependencies: Phase 0 (ADR must exist before code changes reference it)

### Phase 3 — Submission Readiness (Both Platforms)

- Plan: [future/README.md](future/README.md) (process requirements)
- Done when:
  - Clerk test account with appropriate scopes prepared
  - Three working example prompts documented
  - Screenshots captured at required dimensions (OpenAI)
  - Developer identity verified on both platforms
  - Support contact information verified current
  - Submission checklist in `safety-and-security.md` fully satisfied
- Dependencies: Phases 0-2

---

## Quality Gates

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:widget
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

---

## Related Documents

1. [high-level-plan.md](../high-level-plan.md)
2. [Collection README](README.md)
3. [safety-and-security.md](../../../docs/governance/safety-and-security.md)
4. [08-mcp-graph-tools.md (archived)](../archive/semantic-search-archive-dec25/part-1-search-excellence/08-mcp-graph-tools.md) — original graph tool size analysis
5. [post-merge-tidy-up.plan.md](../sdk-and-mcp-enhancements/future/post-merge-tidy-up.plan.md) — M1-S007 deferred snag
