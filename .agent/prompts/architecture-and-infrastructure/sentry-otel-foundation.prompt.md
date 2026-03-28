---
prompt_id: architecture-sentry-otel-foundation
title: "Sentry + OpenTelemetry Foundation Session Entry Point"
type: handover
status: active
last_updated: 2026-03-28
---

# Sentry + OpenTelemetry Foundation — Session Entry Point

This is the operational handover for the active observability foundation work.
Keep it thin. The active plan owns the facts; this prompt only tells a fresh
session where to start.

## Current State (end of 2026-03-28 remediation session)

Branch: `feat/full-sentry-otel-support`. Pushed head: `44d8d74d`.

A deep remediation session ran 6 specialist reviewers against the full branch
diff, identified 21 findings across 4 priority tiers, and began fixing them.
The remediation plan is now the authoritative next-step guide.

**What was fixed** (in working tree, not yet committed):

- `@oaknational/sentry-node` is fully green (type-check, lint, 20/20 tests)
- HTTP app type-check is green, all 734 unit/integration tests pass, all 201
  E2E tests pass
- Most lint errors resolved: `http-observability.ts` split into 4 modules
  (504→207 lines), 8 other files split/reduced, all `no-unsafe-assignment`
  errors fixed, `Object.keys` replaced with `typeSafeKeys`
- `server-runtime.unit.test.ts` completely rewritten: proper Logger overloads,
  getters for mutable state, no `as` casts, correct `express()` fakes

**What blocks the commit**: the pre-commit hook runs full lint. A missing
`PhasedTimer` import in `application.ts` and possibly a few residual
function-length violations remain. Fix these, then commit.

**What remains after the commit** (Phases B–E in the remediation plan):

- F8: Live log sink uses `captureMessage` instead of `Sentry.logger.*` API
- F9: Undeclared transitive `@sentry/node` dependency
- F10: `vi.mock()` ADR-078 violation (largest item — DI refactor)
- F11: Signal race condition in server shutdown
- F12: MCP wrapper error recording decoupling
- F13: Span operation error suppression
- F14: `vi.spyOn(process.stdout)` in tests
- F15–F16: Security hardening (DSN in error messages, Object.assign ordering)
- F17–F21: Improvements (per-test factories, DRY spans, dead code, fixture
  clear, redaction keys)

## Read First

1. **[sentry-otel-remediation.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-remediation.plan.md)** — Start here. 21 findings, 5 phases, prioritised execution sequence.
2. [sentry-otel-integration.execution.plan.md](../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) — Main execution plan with full context.
3. [sentry-otel-foundation.review-checkpoint-2026-03-27.md](../../plans/architecture-and-infrastructure/active/sentry-otel-foundation.review-checkpoint-2026-03-27.md) — Phase 1 review status.
4. [ADR-141](../../../docs/architecture/architectural-decisions/141-coherent-structured-fan-out-for-observability.md)
5. [testing-strategy.md](../../directives/testing-strategy.md)
6. [AGENT.md](../../directives/AGENT.md)

Primary code surfaces:

- `packages/libs/sentry-node/src/` — all files
- `packages/libs/sentry-mcp/src/` — wrappers and types
- `packages/core/observability/src/` — redaction and span context
- `apps/oak-curriculum-mcp-streamable-http/src/observability/` — split into 4 modules
- `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts` — lifecycle
- `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts` — logger factory

## Restart Sequence

1. Read the remediation plan first — it has the prioritised finding list and
   the exact execution sequence.
2. Fix the remaining Phase A blockers (missing import, any residual lint).
3. Commit — the pre-commit hook will run full type-check + lint + test.
4. Begin Phase B (architectural issues F8–F14).
5. After Phase B, run Phase C (security), Phase D (improvements), Phase E
   (full verification + reviewer re-run).
6. Keep every finding visible until fixed or explicitly superseded.
7. Continue with Search CLI adoption only after the HTTP slice is fully green.

## Reviewer Matrix (from 2026-03-28 remediation session)

| Reviewer | Verdict | Key Findings |
|----------|---------|-------------|
| code-reviewer | CHANGES REQUESTED | 6 critical (types, casts, for-in, file sizes) |
| test-reviewer | CRITICAL VIOLATIONS | vi.mock ADR-078, value capture bug, global state |
| architecture-reviewer-fred | ISSUES FOUND | transitive dep, 504-line file, span duplication |
| architecture-reviewer-wilma | CRITICAL ISSUES | signal race, error suppression, recorder decoupling |
| security-reviewer | LOW RISK | DSN in errors, Object.assign ordering |
| sentry-reviewer | ISSUES FOUND | captureMessage vs logger.*, non-throwing spans |

## Authority Rule

1. The remediation plan is the authority for what to fix and in what order.
2. The main execution plan is the authority for full implementation context.
3. The review checkpoint is the authority for handover review status.
4. This prompt is an entry point only — it must not restate plan facts.
