# Agentic Engineering Enhancements Roadmap

**Status**: ✅ Phase 0 complete; Phase 1 ready to start
**Last Updated**: 2026-03-04
**Session Entry**: [start-right.prompt.md](../../prompts/start-right.prompt.md)

---

## Purpose

This roadmap is the strategic phase sequence for the
`agentic-engineering-enhancements` collection. Execution detail lives in
`active/` plans with atomic tasks and deterministic validation.

Strategic source plans remain authoritative for intent/rationale; active plans
are authoritative for execution tasks.

Authoritative active execution sources:

1. ~~phase-0-templates-and-components-foundation.md~~ (archived)
2. [phase-1-hallucination-guarding-execution.md](active/phase-1-hallucination-guarding-execution.md)
3. [phase-2-evidence-based-claims-execution.md](active/phase-2-evidence-based-claims-execution.md)
4. [phase-3-architectural-enforcement-execution.md](active/phase-3-architectural-enforcement-execution.md)
5. ~~phase-4-cross-agent-standardisation-execution.md~~ **Superseded** by Agent Artefact Portability plan (ADR-125) (archived)
6. [phase-5-mutation-testing-execution.md](active/phase-5-mutation-testing-execution.md)

---

## Explicit Goal 0

Create and maintain a well-structured `.agent/plans/templates/components`
ecosystem with useful, reusable templates that reduce plan drift and improve
execution quality.

---

## Documentation Synchronisation Requirement

No phase can be marked complete until documentation updates have been handled
for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/practice-core/practice.md`
3. any additionally impacted ADRs, `/docs/` pages, or README files

Each phase must either:

- update impacted documents directly, or
- record an explicit no-change rationale in
  [documentation-sync-log.md](documentation-sync-log.md)

Before phase closure, apply the
[`jc-consolidate-docs` workflow](../../../.cursor/commands/jc-consolidate-docs.md)
to ensure no settled documentation remains trapped in plans/prompts.

---

## Milestone Context

This roadmap aligns to:

- **Milestone 2**: hallucination/evidence guards, architectural enforcement,
  cross-agent standardisation
- **Milestone 3**: mutation testing rollout and optimisation

See [high-level-plan.md](../high-level-plan.md) for cross-collection context.

---

## Execution Order

```text
Phase 0: Planning system and template hardening      ✅ COMPLETE
Phase 1: Hallucination guarding rollout              📋 PLANNED
Phase 2: Evidence-based claims rollout               📋 PLANNED
Phase 3: Architectural enforcement execution         📋 PLANNED
Phase 4: Cross-agent standardisation execution       ⛔ SUPERSEDED (ADR-125)
Phase 5: Mutation testing execution                  📋 PLANNED
```

---

## Phase Details

### Phase 0 — Planning System and Template Hardening

- Active plan: ~~phase-0-templates-and-components-foundation.md~~ (archived)
- Status: ✅ Complete (2026-02-24)
- Done when:
  - templates/components inventory is intentionally structured and documented
  - useful templates exist for feature, quality-fix, adoption, and roadmap work
  - this collection has roadmap + atomic active plans for all phases
  - documentation synchronisation contract and tracking log are present
- Dependencies: none

### Phase 1 — Hallucination Guarding Rollout

- Active plan:
  [phase-1-hallucination-guarding-execution.md](active/phase-1-hallucination-guarding-execution.md)
- Source strategy:
  [hallucination-and-evidence-guard-adoption.plan.md](hallucination-and-evidence-guard-adoption.plan.md)
- Done when:
  - non-trivial claim classes and verification contract are implemented in
    prompts/review workflow
  - pilot baseline is captured with evidence
  - documentation sync log records updates/no-change rationale for Phase 1
- Dependencies: Phase 0 complete

### Phase 2 — Evidence-Based Claims Rollout

- Active plan:
  [phase-2-evidence-based-claims-execution.md](active/phase-2-evidence-based-claims-execution.md)
- Source strategy:
  [hallucination-and-evidence-guard-adoption.plan.md](hallucination-and-evidence-guard-adoption.plan.md)
- Done when:
  - evidence bundle usage is standardised across target workflows
  - merge-readiness checks enforce evidence requirements
  - documentation sync log records updates/no-change rationale for Phase 2
- Dependencies: Phase 1 complete

### Phase 3 — Architectural Enforcement Execution

- Active plan:
  [phase-3-architectural-enforcement-execution.md](active/phase-3-architectural-enforcement-execution.md)
- Source strategy:
  [architectural-enforcement-adoption.plan.md](architectural-enforcement-adoption.plan.md)
- Convergence update (2026-03-04):
  - ESLint convergence tasks (`no-console`, boundary/separation lint alignment, split-guidance updates) are executed in
    [devx-strictness-convergence.plan.md](../developer-experience/active/devx-strictness-convergence.plan.md)
  - `max-files-per-dir` rollout is explicitly deferred in the current window
  - depcruise/knip/qg integration remains owned by this phase
- Done when:
  - enforcement phases 0-5 are delivered with deterministic validation
  - evidence-backed claims exist for enforcement outcomes
  - documentation sync log records updates/no-change rationale for Phase 3
- Dependencies:
  - documentation boundary corrections already complete
  - Phase 2 claim/evidence workflow available

### Phase 4 — Cross-Agent Standardisation Execution

> **SUPERSEDED**: All cross-agent standardisation work has been absorbed into [ADR-125 (Agent Artefact Portability)](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md).

### Phase 5 — Mutation Testing Execution

- Active plan:
  [phase-5-mutation-testing-execution.md](active/phase-5-mutation-testing-execution.md)
- Source strategy:
  [mutation-testing-implementation.plan.md](mutation-testing-implementation.plan.md)
- **Milestone context**: Stryker is already a devDependency with a
  `pnpm mutate` turbo task and config inputs. It was briefly used and now
  needs proper integration. **Blocks public beta (M3), not public alpha
  (M1).** However, it remains a high-impact quality gateway that is not
  yet being used — proper integration is a priority for M3.
  (Source: onboarding simulation R27, owner disposition 2026-02-26.)
- Done when:
  - mutation phases 0-3 delivered (with rollout evidence and CI posture)
  - documentation sync log records updates/no-change rationale for Phase 5
- Dependencies:
  - Phase 2 evidence workflow available
  - Phase 3 enforcement baseline stable

---

## Deferred Safety Work (Not in current phase sequence)

- Sandboxed execution rollout
- Prompt-injection red-team automation

These remain intentionally deferred until hallucination/evidence controls are
stable across at least two delivery cycles.

---

## Quality Gates

Run from repo root, one at a time:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```
