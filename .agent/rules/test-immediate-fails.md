# Test Immediate-Fails Checklist

Any single item below is an **immediate fail** — the test is rejected
without further analysis. This is the fast gate test-expert applies
first; tests that pass it then receive the full checklist.

Rooted in `.agent/directives/testing-strategy.md` and
[ADR-078](../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md).
Violations indicate product-code design problems, not test-authorship
problems — the fix is usually at the product-code level (expose a
seam, extract a pure function, inject a dependency).

## Boundary Immediate Fails

1. **Test imports product code that is not directly under test.**
   Tests must import only the unit they are testing. Incidental
   production factories (`createHttpObservabilityOrThrow`,
   `loadRuntimeConfig`, `initialiseSentry`, app bootstrappers) that
   the test is not proving must be replaced with a fake injected via
   DI. Rationale: imports define the test boundary; a test that
   imports factory X is coupled to X's behaviour and breaks on
   unrelated refactors of X.
2. **Test imports a complex test helper it does not own.** If the
   helper exists to make the test runnable (not to prove the unit),
   the helper itself has become incidental infrastructure. Fix the
   product code or inline a simple fake.
3. **Test uses a real production object where a fake would suffice.**
   E.g. real logger, real observability, real database adapter, real
   HTTP client. If the test does not assert on that object's
   behaviour, it must not receive a real instance.

## Side-Effect Immediate Fails

4. **Unit test triggers any IO.** Unit tests are for pure functions
   only — no filesystem reads/writes, no network calls, no child
   process spawning, no timers that interact with the runtime, no
   SDK init calls with side effects. ONE named sanctioned shape
   (owner-carded ruling 2026-08-02; tier wording generalised with the
   2026-08-03 owner ratification of source-derived expectations — the
   carve-out's own rationale is tier-agnostic): an in-process test
   (`.unit.test.ts` or `.integration.test.ts`) MAY read COMMITTED
   repo artefacts through an owned `test-helpers/` fixture surface
   anchored at `import.meta.dirname` (the
   `mcp-conformance/test-helpers/fixture-loader.ts` precedent; the
   sdk-codegen `mcp-tools/test-helpers/schema-cache-reader.ts` worked
   instance) — committed bytes are fixtures by provenance, not
   runtime IO; the helper must exist to pin real committed fixtures
   at their canonical paths (never to make the test runnable — item
   2's complex-helper prohibition still binds), and the
   classification axis stays the boundary, never the mechanism.
5. **Any test (unit/integration/E2E in-process) touches
   `process.env`.** Reading OR writing `process.env` is prohibited.
   Pass literal inputs; do not inherit from shell state.
6. **Any in-process test touches `process.cwd()`.** Anchor file
   paths at `import.meta.dirname`, not the caller's cwd.
7. **Any in-process test reads from `.env` / `.env.local` / any
   runtime environment file.** Tests construct config literals
   directly; they do not route through loaders that read disk.
8. **Any in-process test spawns a child process, fork, or
   test-authored worker.** Covered by `testing-strategy.md §No
   process spawning in in-process tests`, which also carries the ONE
   named sanctioned shape (the spawn-topology contract test,
   recorded 2026-08-07 with the F-112 push-path landing) — the
   directive is the authority; this item only points at it.
9. **Any test makes a real network call beyond its tier's protocol
   channel.** Two channels are calling mechanics, not violations:
   an E2E test's exchange with the separately running system under
   test, and a harness's loopback exchange with an app the test
   itself imported and booted in-process (owner-ratified
   2026-07-29). All other real network IO is smoke-tier only;
   smoke tests run on-demand per
   [ADR-161](../../docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md).

## Mock/Stub Immediate Fails

10. **Test uses `vi.stubGlobal`, `vi.mock`, `vi.doMock`.** Global
    state manipulation; prohibited outright. Use DI.
11. **Unit test contains any mock.** Unit tests are pure — no mocks,
    fakes, or stubs of any kind. Parameters in, result out.
12. **Integration test contains a mock with logic.** Integration
    mocks are *simple* fakes — constant returns, captured calls. No
    branching, no state machines, no string interpolation of inputs.
    Complexity signals product-code needs refactoring for
    testability.
13. **Test passes anything other than a fake or constant into the
    unit under test (unit test).** If the unit needs a real object
    to run, the unit is not isolated.

## Structural Immediate Fails

14. **Test authors any function with non-trivial complexity.**
    Helpers in tests must be trivial: build a literal, wrap a call.
    Conditional logic, loops with side effects, or multi-step state
    setup in a test function = test code testing itself. ONE named
    sanctioned shape (owner-ratified 2026-08-03, the meta-examples
    round-trip rework): a test MAY author a small derivation helper
    that projects EXPECTATIONS from a committed fixture read via item
    4's sanctioned surface, when the projection models a DOCUMENTED
    product contract named in a comment — deriving expectations from
    the owning source is the ratified alternative to pinning copies
    of upstream content, which stays admissible only as a designed
    sentinel carrying a named decision.
15. **Test contains skipped or pending cases** (`it.skip`,
    `describe.skip`, `test.todo`, `it.todo`, `xit`, `xdescribe`, or
    any skip/pending mechanism). Fix or delete. See
    `.agent/directives/testing-strategy.md` §Rules.
16. **Test contains conditional execution** of any kind:
    `it.skipIf`, `describe.skipIf`, `it.runIf`, `describe.runIf`,
    conditional `it`/`describe` registration, runtime branching
    inside the test body, conditional assertions
    (`if (env === 'X') expect(...)`), or fixtures whose shape
    varies with ambient state. Conditional tests are an
    architectural-failure signal — the fix lives in product code,
    not in the test. See `no-conditional-tests.md`.
17. **Test does not use DI where DI is possible.** If the unit
    supports a dependency parameter, the test must use it. Do not
    reach past the seam to a module-level singleton.
18. **Test asserts on spies against private/internal methods.**
    Couples the test to implementation; breaks on refactor. Assert
    on return values or public behaviour.
19. **Test proves something about the test scaffolding, not the
    product code.** E.g. asserts that a mock returned the value it
    was configured to return; asserts on types only; tautologies
    (comparing two names at the same value).

## Pipeline Immediate Fails

20. **Test category does not match its file name.** A
    `*.unit.test.ts` that touches IO is a category error — either
    rename or redesign. Per `testing-strategy.md`, naming IS the
    category. The one exception is item 4's sanctioned shape:
    helper-mediated reads of COMMITTED artefacts via an owned
    `test-helpers/` fixture surface remain `.unit` — renaming such a
    test to `.integration` cures nothing, since integration also
    forbids filesystem IO.
21. **Test is named `*.integration.test.ts` but hits network beyond
    a harness's loopback exchange with an app the test itself
    imported and booted in-process, or spawns processes.** Classify
    by the boundary, then cure: a genuine separately-running-system
    exchange belongs at E2E/smoke tier; outbound IO from imported
    code is a missing DI seam to fix, never a rename.
22. **Test depends on test-execution order to pass.** Shared mutable
    state between tests is a correctness hazard. Each test must be
    self-contained.

## When to Apply

- As the **first pass** on any test-expert invocation.
- Before any deeper analysis of test value or TDD compliance.
- Findings here block approval; all 22 items must be clean before
  the test suite is considered compliant.

## Fix Direction

Most of these fails point at **product code problems**, not test
problems:

- "Test imports production factory X" → product code lacks a DI seam;
  refactor to accept X as a parameter.
- "Unit test touches IO" → the code under test isn't a pure function;
  extract a pure core.
- "Integration test has complex mock" → the dependency surface is too
  wide; split the responsibility in product code.

The test-expert flags the symptom. The fix is usually upstream.

## Related Rules

- `.agent/rules/no-global-state-in-tests.md` — specific prohibition
  on `process.env` reads/writes, `vi.stubGlobal`, `vi.mock`,
  `vi.doMock`.
- `.agent/directives/testing-strategy.md` §Rules — the skip-mechanism
  prohibition (no-skipped-tests bullet).
- `.agent/rules/no-conditional-tests.md` — prohibition on conditional
  execution and the architectural-failure diagnosis.
- `.agent/directives/testing-strategy.md` — full authoritative
  test-quality reference.
