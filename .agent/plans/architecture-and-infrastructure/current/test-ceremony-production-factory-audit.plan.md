---
name: "Test Ceremony — Production-Factory Import Audit"
overview: >
  Repo-wide audit and remediation of tests that import production factories
  (loadRuntimeConfig, createHttpObservabilityOrThrow, and similar) as
  incidental infrastructure rather than as the subject under test. Includes
  migration off `vi.mock` / `vi.stubGlobal` / `vi.doMock` (currently 19
  violations, tracked via ESLint `warn` gate in
  `@oaknational/eslint-plugin-standards` `testRules`). Completion flips the
  `warn` to `error`, closing the backlog.
derived_from: quality-fix-plan-template.md
sibling_brief: "architecture-and-infrastructure/future/test-suite-audit-and-triage.plan.md"
foundational_docs:
  - ".agent/directives/testing-strategy.md"
  - ".agent/rules/test-immediate-fails.md"
  - ".agent/rules/no-global-state-in-tests.md"
  - "docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md"
  - "docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md"
todos:
  - id: ws1-inventory
    content: "WS1: produce a complete inventory of every test file in the repo with a production-factory import that is not the directly-tested unit. Output: a machine-readable list grouped by factory (loadRuntimeConfig, createHttpObservabilityOrThrow, initialiseSentry, Clerk middleware factories, logger factories, anything else that emerges)."
    status: pending
    priority: next
  - id: ws2-vi-mock-inventory
    content: "WS2: inventory every use of `vi.mock`, `vi.doMock`, `vi.stubGlobal` across test files. For each: identify the product-code design problem the vi.mock was working around. Most will be DI seams that do not yet exist."
    status: pending
  - id: ws3-seam-patterns
    content: "WS3: from WS1+WS2 output, identify recurring patterns where the same product-code shape forces test ceremony (e.g. module-level singleton factory pulled in many tests). Each pattern is a candidate for a product-code refactor that fixes many tests at once."
    status: pending
  - id: ws4-migrate-by-pattern
    content: "WS4: migrate tests off each pattern, one pattern at a time. Expose the DI seam in product code where missing. Replace the production-factory import with a fake. Each pattern-level migration closes a cohort of tests simultaneously."
    status: pending
  - id: ws5-flip-severities
    content: "WS5: once a rule's backlog reaches zero, flip its ESLint severity from `warn` to `error` in `@oaknational/eslint-plugin-standards` `testRules`. Remove any workspace-level exception overrides that were added for legitimate subject-under-test cases and which are now the only remaining allowances."
    status: pending
  - id: ws6-report
    content: "WS6: final report — before/after violation counts per rule, pattern list extracted to `.agent/memory/patterns/`, lessons for future test authorship."
    status: pending
isProject: true
---

# Test Ceremony — Production-Factory Import Audit

**Last Updated**: 2026-04-18
**Status**: 🟡 PLANNING — ready to begin WS1
**Scope**: Systemic audit of test-boundary hygiene across the monorepo; remediation of accumulated ceremony.

---

## Context

A 2026-04-18 investigation into a `MaxListenersExceededWarning` revealed a
systemic pattern: integration and E2E tests routinely import production
factories (`loadRuntimeConfig`, `createHttpObservabilityOrThrow`,
`initialiseSentry`) as incidental infrastructure to make `createApp`-style
bootstrap calls runnable. None of those tests were proving anything about
those factories — they were using them as ceremony to construct the
objects they actually needed (a `RuntimeConfig`, an `HttpObservability`).

The MaxListeners bug was the symptom. Each `createHttpObservabilityOrThrow`
call in a test triggered a real `Sentry.init()` (because a developer's
`.env.local` had `SENTRY_MODE=sentry`), which registered process listeners
that accumulated across test cases until Node tripped the 10-listener cap.

### Problem Statement

Tests that import production factories they do not prove anything about:

1. **Widen the test boundary beyond the named unit.** A test "for OAuth
   metadata" shouldn't change behaviour when observability wiring is
   refactored.
2. **Carry hidden side effects** — the factories perform real SDK init,
   disk reads, schema validation, network-adjacent work.
3. **Couple tests to product-code churn they are not positioned to
   catch.** A refactor of `loadRuntimeConfig`'s internals now breaks
   tests of unrelated features.

### Existing Capabilities

- `createFakeHttpObservability()` already exists in
  `packages/libs/.../test-helpers/observability-fakes.ts` — it was unused
  until the 2026-04-18 migration of five tests.
- `createMockRuntimeConfig()` helpers exist in two places (MCP integration
  test-helpers + e2e-tests/helpers/test-config.ts) — both return a
  `RuntimeConfig` literal without disk reads.
- The canonical checklist is authored at
  `.agent/rules/test-immediate-fails.md`.
- ESLint rules enforcing a subset of the checklist live in
  `@oaknational/eslint-plugin-standards` `testRules` — zero-violation
  patterns at `error`, `vi.mock` family at `warn` pending this audit.

---

## Design Principles

1. **Tests must have tight, well-defined boundaries.** Unit tests =
   utterly strict and simple. Integration tests = imports limited to
   the units being integrated. E2E tests = less strict boundaries, but
   the boundary must still be understandable, known, and correct.
2. **Tests must only import product code that they are directly
   testing.** Incidental production-factory imports are ceremony and
   must be removed.
3. **The fix is usually at the product-code level.** If tests can't
   avoid importing factory X, product code needs a DI seam that lets
   tests inject an alternative.
4. **Pattern-level, not file-level, remediation.** Extract shared
   patterns; migrate cohorts at once; don't play whack-a-mole.

**Non-Goals** (YAGNI):

- Rewriting integration tests into unit tests where the integration
  boundary is genuinely the subject (e.g. tests of assembled Express
  middleware chains are legitimately integration-shaped).
- Refactoring product-code contracts beyond what the audit demands.
- New test infrastructure beyond the fakes + helpers already in place.

---

## Dependencies

**Blocking**: none. The ESLint gates are already in place and flagging
the current backlog at `warn` severity.

**Related**:

- `architecture-and-infrastructure/future/test-suite-audit-and-triage.plan.md`
  — the broader strategic brief. This plan executes the narrower
  "production-factory ceremony" slice of that audit.
- `architecture-and-infrastructure/current/quality-gate-hardening.plan.md`
  — complementary ESLint/typecheck gate work.

---

## WS1 — Production-Factory Import Inventory

**RED**: no inventory exists. Produce `.agent/evidence/test-ceremony-audit-inventory-2026-MM-DD.md`
listing every test file that imports a production factory it is not the
subject of. Group by factory.

**Scope**: at minimum these factories (expand as new patterns emerge):

- `loadRuntimeConfig`
- `createHttpObservability` / `createHttpObservabilityOrThrow`
- `initialiseSentry`
- Clerk middleware factories (`clerkMiddleware`, `createAuthHandler`, etc.)
- Logger factories that reach disk or env (e.g. `createLogger` that
  resolves config internally)
- Any other factory that internally calls `process.env`, reads a file,
  or initialises a vendor SDK

**GREEN**: inventory exists, is dated, and names every test file +
factory pair. No migration yet.

---

## WS2 — `vi.mock` / `vi.stubGlobal` / `vi.doMock` Inventory

**RED**: append to WS1 inventory a section listing every test file
using any of the vi.* global-manipulation APIs. For each: a one-line
note on why the test uses it (what DI seam it is working around).

**GREEN**: complete vi.* inventory with DI-seam analysis.

---

## WS3 — Pattern Extraction

**RED**: identify shared patterns across WS1+WS2 output. Expected
categories:

- **App-assembly tests pulling observability/config factories** — fixed
  by accepting a fake, not the production factory.
- **Unit tests using `vi.mock` to fake a dependency** — fixed by adding
  a DI parameter to the unit under test.
- **Integration tests using `vi.mock` to swap a module-level singleton**
  — fixed by refactoring the singleton into an injected collaborator.

Each pattern becomes a migration cohort in WS4.

**GREEN**: pattern list with per-pattern count + proposed remediation
shape.

---

## WS4 — Pattern-by-Pattern Migration

**RED**: for each pattern from WS3, migrate the tests + add the DI seam
where needed. Order by leverage: largest cohort first.

**Acceptance per pattern**:

1. Product-code DI seam exists (if the pattern required one).
2. All tests in the cohort pass the ESLint rules at `error` severity.
3. Tests in the cohort still pass (`pnpm check` green in the touched
   workspace).
4. Test-reviewer audit of a representative sample confirms the tests
   still prove what they did before.

**GREEN**: ESLint backlog count for that pattern reaches zero.

---

## WS5 — Severity Flip

**RED**: in `packages/core/oak-eslint/src/index.ts` `testRules`, flip
`no-restricted-properties` (the vi.* family) from `warn` to `error`.
Any lingering allowlist overrides in workspaces are removed if they
are no longer needed.

**GREEN**: `pnpm check` green with the rule at `error`; no per-file
allowances for the vi.* family remain.

---

## WS6 — Report and Pattern Extraction

**RED**: author `.agent/evidence/test-ceremony-audit-report-YYYY-MM-DD.md`:
before/after counts per rule, patterns extracted, product-code DI
seams added, list of `eslint.config.ts` overrides removed.

**GREEN**: if a repeated pattern is worth future reuse, extract to
`.agent/memory/patterns/`.

---

## Quality Gates

`pnpm check` from repo root exit 0 after each work-stream close. The
`testRules` ESLint rules run as part of `lint:fix`.

---

## Adversarial Review

- `test-reviewer` — applies `.agent/rules/test-immediate-fails.md` to
  each migrated cohort.
- `architecture-reviewer-fred` — reviews every new product-code DI
  seam added to satisfy a test-migration cohort.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Migrating a `vi.mock` away breaks a test's intended coverage | Test-reviewer audit per cohort before/after; keep the same assertions, only change the seam. |
| Product-code DI refactor introduces a regression | Each seam change is TDD — add the new test first (injected fake), then refactor product code to accept the seam. |
| Pattern extraction is over-generalised | Validate against at least two independent cohorts before naming a pattern. |
| The audit stalls mid-pattern | WS4 is cohort-at-a-time; each cohort closes independently; partial completion is fine between sessions. |

---

## Foundation Alignment

- `.agent/directives/testing-strategy.md` — authoritative baseline.
- `.agent/rules/test-immediate-fails.md` — the checklist this audit
  enforces.
- ADR-078 — the DI discipline the migrations implement.
- ADR-161 — the pipeline-boundary constraint that makes hermetic tests
  mandatory.

---

## Documentation Propagation

- Audit inventory + report under `.agent/evidence/`.
- Patterns to `.agent/memory/patterns/` as they emerge.
- ESLint rule severity changes in release notes.
- Cross-link from `test-suite-audit-and-triage.plan.md` (sibling brief)
  once this plan completes.

---

## Consolidation

After all work-streams close, run `/jc-consolidate-docs`. Candidate
pattern: **production-factory imports in tests are always ceremony** —
if it survives a second unrelated context validation.

---

## Acceptance Summary

1. Inventory of production-factory and vi.* violations exists and is
   dated.
2. Pattern list derived from inventory with per-pattern migration.
3. Every test file in the repo passes `.agent/rules/test-immediate-fails.md`
   immediate-fail screen.
4. ESLint `no-restricted-properties` rule flipped from `warn` to
   `error`; no workspace allowances remain that are not bona-fide
   subject-under-test exceptions.
5. `pnpm check` exit 0.
