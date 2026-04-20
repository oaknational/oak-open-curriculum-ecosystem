---
name: "Production Factories In Tests Are Ceremony Unless They ARE The Subject"
use_this_when: "Writing or reviewing a test that imports a production factory (config loader, observability factory, SDK initialiser) to satisfy a downstream call's signature"
category: test-architecture
proven_in: "apps/oak-curriculum-mcp-streamable-http — `loadRuntimeConfig` + `createHttpObservabilityOrThrow` pulled into 16+ tests as incidental infrastructure; surfaced via MaxListenersExceededWarning; commits 276ea9bd + follow-up"
proven_date: 2026-04-18
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Tests that import production factories they do not assert on couple to unrelated refactors, carry hidden side effects (disk reads, SDK init, process listeners), and widen the test boundary beyond the named unit — bugs like Sentry-init listener leaks accumulate silently"
  stable: true
---

# Production Factories In Tests Are Ceremony Unless They ARE The Subject

## Principle

If a test imports function X from product code, then X must be the
**subject under test** — the unit the test's assertions speak to. If
X is incidental (present only to construct an object the test needs
elsewhere), it is ceremony. Ceremony imports are a defect, not a
neutral convenience.

## The Test

For every `import` from product code in a test file, ask:

> Does a test assertion in this file speak to the behaviour of this
> import?

If no, the import is ceremony. The fix depends on what the import
provides:

- **A type**: use `import type { X }` — permitted (no runtime ceremony).
- **A value**: replace with a test-owned fake injected via DI. The
  production factory is never called at test time.

## Why Ceremony Matters

1. **Widens the test boundary.** A test named "OAuth metadata" that
   imports `createHttpObservabilityOrThrow` now asserts indirectly on
   observability wiring; any observability refactor can break the
   OAuth-metadata test.
2. **Carries hidden side effects.** Production factories often
   perform real SDK initialisation, disk reads (env-file merging),
   schema validation, or network-adjacent work. These effects do not
   belong in tests.
3. **Hides bugs.** The 2026-04-18 MaxListenersExceededWarning was
   caused by `createHttpObservabilityOrThrow` triggering real
   `Sentry.init()` across 16+ tests; each init registered process
   listeners that accumulated past Node's 10-listener cap. The
   symptom looked exotic; the root cause was ceremony.

## The Fix

Three moves, in order of preference:

1. **Refactor to DI.** If the production code requires the factory's
   output, expose the seam in product code so tests can inject their
   own instance (ADR-078).
2. **Provide a test fake.** Author `createFakeX()` in test-helpers
   returning a plain object satisfying the interface. No production
   dependency. Inject it where the factory was used.
3. **Construct literal.** For config-shaped objects like
   `RuntimeConfig`, author a helper that returns a literal with
   hermetic defaults — no factory call, no disk, no env. See
   `createMockRuntimeConfig` in
   `apps/oak-curriculum-mcp-streamable-http/src/test-helpers/auth-error-test-helpers.ts`.

## Legitimate Exceptions

The factory IS the subject under test. The tests FOR
`loadRuntimeConfig` legitimately import and call it (they prove its
contract). These exceptions are declared as per-file allowlists in
the relevant workspace's `eslint.config.ts`, not as repo-wide rule
relaxations.

## Enforcement

`@oaknational/eslint-plugin-standards` `testRules` enforces this
structurally:

- `no-restricted-imports` (error) on known production-factory paths
  (`runtime-config`, `observability/http-observability`), with
  `allowTypeImports: true` for type-only use.
- Per-workspace `eslint.config.ts` allowlists the current backlog
  (each listed file is a known ceremony violation); migration
  deletes a line per file.
- Subject-under-test exceptions declared per-file at workspace level.

The pattern also appears in `.agent/rules/test-immediate-fails.md`
item 1 (Boundary Immediate Fails).

## The Discipline Generalises

Not just production factories. Any complex function imported into a
test that isn't the directly-tested unit is suspect. A "simple helper
function" that happens to be in product code and happens to be
convenient to call from a test is a candidate ceremony case. The
test-reviewer applies this broadly.

## Related

- `.agent/rules/test-immediate-fails.md` — the checklist that
  encodes this principle as rule #1.
- `.agent/plans/architecture-and-infrastructure/current/test-ceremony-production-factory-audit.plan.md`
  — tracks the repo-wide migration.
- `patterns/explicit-di-over-ambient-state.md` — the same discipline
  at the product-code layer.
- ADR-078 — the DI-for-testability foundation.
