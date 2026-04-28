# [Collection Name] Roadmap

**Status**: [Current milestone and state]
**Last Updated**: [YYYY-MM-DD]
**Session Entry**: [prompt link]

---

## Purpose

[Strategic sequence for the collection. Execution detail lives in
`active/` or `current/`; `future/` carries later strategic intent with a
named promotion trigger.]

Authoritative execution sources:

1. [active/plan-in-progress.md]
2. [current/plan-next.md]
3. [future/plan-later.md] — strategic backlog, not executable yet

---

## Documentation Synchronisation Requirement

No phase can be marked complete until documentation updates are handled for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `docs/architecture/architectural-decisions/124-practice-propagation-model.md`
3. `.agent/practice-core/practice.md`
4. any additionally impacted ADRs, `/docs/` pages, or README files

Record updates (or no-change rationale) in a collection-local
`documentation-sync-log.md`.
Apply `.agent/commands/consolidate-docs.md` before closing major phases.

---

## Milestone Context

[How this roadmap aligns with high-level-plan milestones]

---

## Current State

- [Completed outcome 1]
- [Completed outcome 2]
- [Known blockers]

---

## Execution Order

```text
Phase 0: [Name]                     [Status]
Phase 1: [Name]                     [Status]
Phase 2: [Name]                     [Status]
```

---

## Phase Details

### Phase 0 — [Name]

- In-progress plan: [active/phase-0-*.md]
- Done when: [definition of done]
- Dependencies: [dependency list]

### Phase 1 — [Name]

- Next-up plan: [current/phase-1-*.md]
- Done when: [definition of done]
- Dependencies: [dependency list]

### Phase 2 — [Name]

- Later strategic plan: [future/phase-2-*.md]
- Promotion trigger: [named, testable condition before it becomes current]
- Done when: [definition of done]
- Dependencies: [dependency list]

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
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

---

## Related Documents

1. [high-level-plan.md](../high-level-plan.md)
2. [Collection README](README.md)
3. [Relevant ADR]
4. [Key research document]
