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

1. [current/claude-and-chatgpt-app-submission-compliance.plan.md](current/claude-and-chatgpt-app-submission-compliance.plan.md)

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

- Plan: [current/claude-and-chatgpt-app-submission-compliance.plan.md](current/claude-and-chatgpt-app-submission-compliance.plan.md) (WS1)
- Done when:
  - ADR-159 records the decision to comply with both policies
  - 15 permanent architectural requirements codified
  - `docs/governance/safety-and-security.md` extended with requirements
    and submission checklist
  - `oakContextHint` rationale documented
- Dependencies: none

### Phase 1 — Privacy Policy Integration

- Plan: [current/claude-and-chatgpt-app-submission-compliance.plan.md](current/claude-and-chatgpt-app-submission-compliance.plan.md) (WS2)
- Done when:
  - Privacy and cookie policy links surfaced in server metadata, README,
    and OAuth discovery endpoints
  - Data handling statement documented
- Dependencies: none (can run in parallel with Phase 0)

### Phase 2 — Graph Sub-Querying for Token Efficiency

- Plan: [current/claude-and-chatgpt-app-submission-compliance.plan.md](current/claude-and-chatgpt-app-submission-compliance.plan.md) (WS3-WS5)
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
