---
name: "no-console ESLint Enforcement"
overview: >
  Add `no-console: 'error'` to the shared ESLint config and eliminate
  all `console.*` usage across the codebase, replacing with proper
  UnifiedLogger or legitimate exemptions. Largely mechanical with
  nuanced exceptions for CLI output, smoke tests, and build scripts.
status: "superseded"
superseded_on: 2026-03-04
superseded_by: "../developer-experience/active/devx-strictness-convergence.plan.md"
todos:
  - id: add-rule
    content: "Add `no-console: 'error'` to recommended config in oak-eslint"
    status: cancelled
  - id: triage-violations
    content: "Run lint, triage all violations into categories: replace-with-logger, legitimate-cli-output, build-script, smoke-test"
    status: cancelled
  - id: fix-sdk-violations
    content: "Fix violations in packages/sdks/ — replace console.* with UnifiedLogger"
    status: cancelled
  - id: fix-app-violations
    content: "Fix violations in apps/ — replace console.* with UnifiedLogger or add scoped overrides for legitimate CLI output"
    status: cancelled
  - id: fix-core-violations
    content: "Fix violations in packages/core/ and packages/libs/"
    status: cancelled
  - id: quality-gates
    content: "Run full quality gate chain — all must pass with no-console enforced"
    status: cancelled
isProject: false
---

# no-console ESLint Enforcement

> Superseded on 2026-03-04. Execute from:
> `../developer-experience/active/devx-strictness-convergence.plan.md`.

**Last Updated**: 2026-03-04
**Status**: SUPERSEDED (scope folded into canonical strictness convergence plan)
**Priority**: Milestone 2 hardening follow-through
**Origin**: Logger architectural bug found during search snagging
session ([search-snagging.md](../semantic-search/archive/completed/search-snagging.md))

---

## Context

Historical context below reflects the pre-convergence state before this plan
was folded into the canonical strictness plan.

The shared ESLint config (`packages/core/oak-eslint`) has no
`no-console` rule. The old backlog explicitly called for it:
"Enforce logger usage with eslint no-console rule." The rule exists
only locally in `oak-search-cli`'s ESLint config.

Two SDK files were found using `console.log` in logger stdout sinks
instead of `createNodeStdoutSink()` — fixed in the snagging session.
But ~110 files across the codebase use `console.*` methods, meaning
the architectural pattern is not enforced.

## Approach

1. **Add `'no-console': 'error'` to `recommended.ts`** in
   `packages/core/oak-eslint/src/configs/recommended.ts`. This
   makes it the default for all workspaces.

2. **Triage all violations** into categories:

   | Category | Action | Example |
   |----------|--------|---------|
   | Replace with logger | Use `UnifiedLogger` with proper DI | SDK modules, app source |
   | Legitimate CLI output | Scoped `no-console` override in workspace ESLint config | CLI commands, `output.ts` |
   | Build/code-generation scripts | Scoped override in workspace ESLint config | `codegen.ts`, `zodgen.ts` |
   | Smoke tests | Scoped override for smoke test globs | `smoke-tests/*.ts` |
   | Logger package internals | Already uses `process.stdout.write`, should not need console | Verify only |

3. **Fix or override** each violation. This is largely mechanical:
   - Replace `console.log(msg)` with `logger.info(msg)`
   - Replace `console.error(msg)` with `logger.error(msg)`
   - Replace `console.warn(msg)` with `logger.warn(msg)`
   - For legitimate CLI output, add workspace-level override

4. **Remove the local `no-console` from `oak-search-cli`** — it
   will inherit from the shared config.

## Nuances

- **Widget script generators** (`widget-script.ts`,
  `js-generator.ts`) — these generate JavaScript strings containing
  `console.log` for browser execution. The ESLint rule would flag
  the string literal. These need a scoped override or the generated
  JS strings need to avoid `console` references.

- **Logger package** (`packages/libs/logger`) — `createNodeStdoutSink`
  uses `process.stdout.write`, not `console`. The `file-sink.ts` and
  `timing.ts` files may have legitimate `console` usage for fallback
  scenarios — check and fix.

- **Test files** — existing `testRules` in the shared config could
  include `'no-console': 'off'` if tests legitimately need console
  for debugging, but prefer structured logging even in tests.

## Estimated Effort

~2-3 hours mechanical work. Most violations are straightforward
replacements. The nuances (widget scripts, CLI output) require
per-file judgement but are well-bounded.

## Related

- [search-snagging.md](../semantic-search/archive/completed/search-snagging.md) — origin (logger finding)
- [logging-guidance.md](../../../docs/governance/logging-guidance.md) — canonical logger patterns
- [ADR-051](../../../docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md) — OTEL logging architecture
