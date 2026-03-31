---
name: Auth Safety Correction
overview: "Fix the defensive gap in tool-auth-checker.ts: apply deny-by-default semantics when securitySchemes is absent, empty, or malformed. Independent of Domain A/B; can be executed immediately."
lastValidatedDate: 2026-03-05
todos:
  - id: phase-0-foundation
    content: "Re-read principles.md, testing-strategy.md, schema-first-execution.md. Confirm deny-by-default is the correct security stance (check ADR-113). Record recommitment."
    status: pending
  - id: phase-1-red-missing-schemes
    content: "RED: Write failing test for absent securitySchemes on a generated tool — toolRequiresAuth should return true."
    status: pending
  - id: phase-2-red-empty-schemes
    content: "RED: Write failing test for empty securitySchemes array — toolRequiresAuth should return true."
    status: pending
  - id: phase-3-red-malformed-schemes
    content: "RED: Write failing test for malformed securitySchemes (non-array or null) — toolRequiresAuth should return true + structured warning log."
    status: pending
  - id: phase-4-red-aggregated
    content: "RED: Write failing tests for all three cases on an aggregated tool (AGGREGATED_TOOL_DEFS path)."
    status: pending
  - id: phase-5-green
    content: "GREEN: Implement deny-by-default in tool-auth-checker.ts. All RED tests must pass. No existing passing tests must break."
    status: pending
  - id: phase-6-refactor
    content: "REFACTOR: Extract the decision table into a named helper with clear intent. No behaviour changes. All tests still pass."
    status: pending
  - id: phase-7-quality-gates
    content: "Run pnpm qg (type check, lint, test). All gates green. No ts-ignore, no eslint-disable."
    status: pending
isProject: false
---

# Auth Safety Correction

**Status**: Not started
**Last Updated**: 2026-03-30

## Context

Extracted from [roadmap.md](../roadmap.md) Domain C item C8. This fix is independent of Domain A research and Domain B specialist work and can be executed immediately.

**Provenance**: ADR-113 (auth for all MCP methods except defined public routes), current-state evidence finding #9 (confirmed 2026-02-23).

## Non-Goals

- No changes to OAuth flow, Clerk integration, or public resource bypass logic.
- No changes to the MCP Apps standard migration (metadata keys, MIME type, widget JS).
- No API contract changes.

## Problem

`apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts` currently calls `.securitySchemes.some(...)` without a null guard:

```typescript
// Current (unsafe):
export function toolRequiresAuth(toolName: UniversalToolName): boolean {
  const schemes = isAggregatedToolName(toolName)
    ? AGGREGATED_TOOL_DEFS[toolName].securitySchemes
    : getToolFromToolName(toolName).securitySchemes;

  return schemes.some((scheme) => scheme.type === 'oauth2');
}
```

If `securitySchemes` is absent, empty, or malformed, the function either throws or returns `false` (no auth required). Both outcomes are unsafe.

## Required Behaviour (Normative Decision Table)

| `securitySchemes` value | Required behaviour |
|-------------------------|--------------------|
| Present, contains `oauth2` | Auth required — return `true` |
| Present, all `noauth` | No extra tool-level auth — return `false` |
| Absent (`undefined`) | **Auth required — return `true`** (deny-by-default) |
| Empty array (`[]`) | **Auth required — return `true`** (deny-by-default) |
| Malformed (non-array, `null`) | **Auth required — return `true`** + emit structured warning log (ADR-051) |
| Descriptor lookup failure | **Auth required — return `true`** + emit structured warning log |

Rationale: any ambiguity about auth requirements MUST resolve to requiring auth. Permissive fallback on missing config is a security defect.

## Foundation Recommitment

Before any change, re-read and recommit to:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. ADR-113: `docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md`

First question: could this be simpler without compromising security?

## TDD Phases

### Phase 0 — Foundation recommitment

**Task complete when**: re-read completed; decision table in this plan confirms deny-by-default aligns with ADR-113; no open questions recorded.

### Phase 1 — RED: absent `securitySchemes` on generated tool

**Target file**: `apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.test.ts` (or equivalent)

Write a test:

```typescript
it('requires auth when securitySchemes is absent on a generated tool', () => {
  // mock getToolFromToolName to return a descriptor with no securitySchemes
  expect(toolRequiresAuth('some-generated-tool')).toBe(true);
});
```

**Task complete when**: test file exists, test runs, test fails with current implementation.

### Phase 2 — RED: empty `securitySchemes`

Write a test:

```typescript
it('requires auth when securitySchemes is an empty array', () => {
  // mock returns { securitySchemes: [] }
  expect(toolRequiresAuth('some-generated-tool')).toBe(true);
});
```

**Task complete when**: test runs and fails.

### Phase 3 — RED: malformed `securitySchemes`

Write a test:

```typescript
it('requires auth and emits a warning when securitySchemes is malformed', () => {
  // mock returns { securitySchemes: null } or non-array
  expect(toolRequiresAuth('some-generated-tool')).toBe(true);
  // assert warning log emitted (spy on logger)
});
```

**Task complete when**: test runs and fails.

### Phase 4 — RED: same three cases for aggregated tools

Write parallel tests for the `isAggregatedToolName` path (using `AGGREGATED_TOOL_DEFS`).

**Task complete when**: all three aggregated tool tests run and fail.

### Phase 5 — GREEN: implement deny-by-default

Implement the decision table in `tool-auth-checker.ts`.

Acceptance criteria:

- All RED tests from phases 1–4 now pass.
- All previously passing tests still pass.
- No `ts-ignore`, no `eslint-disable`, no type shortcuts.
- Warning log uses structured logging per ADR-051 (not `console.warn`).

**Deterministic validation**:

```bash
pnpm test --filter oak-curriculum-mcp-streamable-http -- tool-auth-checker
```

Expected: all tests pass, no failures.

**Task complete when**: command above exits 0; all 6 cases in the decision table are covered by passing tests.

### Phase 6 — REFACTOR

Extract the decision table into a named helper (e.g. `resolveAuthRequired`) with a clear docstring. No behaviour changes; all tests remain green.

**Task complete when**: extracted helper is named meaningfully, logic is readable without inline comments, all tests still pass.

### Phase 7 — Quality gates

Run all quality gates:

```bash
pnpm qg
```

**Task complete when**: exits 0, no type errors, no lint errors, no test failures, no skipped tests.

## Rollback

If any quality gate fails after the change, revert `tool-auth-checker.ts` to the previous state. The auth checker is a critical security path — do not leave it in a partially-modified state.

## Exit Criteria

1. Decision table implemented and all six cases covered by passing tests.
2. All tests in `tool-auth-checker.test.ts` pass including original tests.
3. Warning log emitted (structured) for malformed/absent `securitySchemes` cases.
4. `pnpm qg` exits 0 with no suppressions.
5. No behaviour change to the `oauth2 present` or `all noauth` cases (regression-free).
