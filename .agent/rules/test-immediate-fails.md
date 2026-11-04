---
classification: situational
description: Test immediate-fail checklist. Any single violation rejects the test; first-pass screen before any deeper analysis.
trigger: surface:test-authoring
globs:
  - "**/*.test.ts"
---

# Test Immediate-Fails Checklist

Any single item below is an **immediate fail** — the test is rejected
without further analysis. This is the fast gate test-expert applies
first; tests that pass it then receive the full checklist.

Rooted in `.agent/directives/testing-strategy.md` (the dependency-injection
pattern is in `docs/engineering/testing-patterns.md` §In-Process Tests with
Dependency Injection).
Violations indicate product-code design problems, not test-authorship
problems — the fix is usually at the product-code level (expose a
seam, extract a pure function, inject a dependency).

## Boundary Immediate Fails

1. **Test imports product code that is not directly under test.**
   Tests must import only the unit they are testing. A production
   factory or loader that reads configuration or does IO
   (`createHttpObservabilityOrThrow`, `loadRuntimeConfig`,
   `initialiseTelemetry`, an app bootstrapper that reads configuration
   or the clock) is never imported into a
   test, whether or not the test sets out to prove it. The unit that
   needs it takes a fake injected via DI; any parsing or validation it
   does is proven as a pure function over an injected input; its IO
   is not a test's to prove. Rationale: imports define the test
   boundary; a test that imports factory X is coupled to X's behaviour
   and breaks on unrelated refactors of X.
2. **Test imports a complex test helper it does not own.** If the
   helper exists to make the test runnable (not to prove the unit),
   the helper itself has become incidental infrastructure. Fix the
   product code or inline a simple fake.
3. **Test uses a real production object where a fake would suffice.**
   E.g. real logger, real observability, real database adapter, real
   HTTP client. A test never receives a real instance of an object
   that does IO, whether or not it asserts on that object's
   behaviour: the object's pure logic (an adapter's mapping) is
   tested, and its IO is proven by validation, never by a test. A
   real object without IO is part of the composition the test proves
   when the asserted result depends on its behaviour; any other is
   replaced with a fake.

## Side-Effect Immediate Fails

4. **Any test triggers any IO.** IO is a filesystem read or write, a
   network call, a socket (loopback included), a child process, a
   clock read (`Date.now()`, `new Date()`, `performance.now()`), a
   timer that interacts with the runtime, or an SDK init call with
   side effects, in the test, in any helper it imports, or in the
   product code it runs; the cure for a clock read is an injected
   clock. This is
   the absolute invariant of `testing-strategy.md` §Philosophy
   (owner, 2026-09-14 and 2026-09-15). A filesystem read is IO
   whatever the provenance of the bytes: committed fixtures enter a
   test as imported modules or as literal values (a seat's reading from
   the 2026-09-19 directive pass, ratified by the owner's card of
   2026-09-20: "Yes, no disk reads"). A fixture-reading
   `test-helpers/` module (OCE's two worked instances were a
   conformance-suite fixture loader and a codegen schema-cache reader)
   is a defect under this item; existing code is evidence of the
   estate and carries no approval
   ([PDR-091](../practice-core/decision-records/PDR-091-precedence-is-not-approval.md)).
5. **Any test (unit or integration) touches `process.env`.** Reading OR writing `process.env` is prohibited.
   Pass literal inputs; do not inherit from shell state.
6. **Any test touches `process.cwd()`.** A test has no file path to
   anchor (item 4); a path the unit needs is passed in as a literal.
7. **Any test reads from `.env` / `.env.local` / any
   runtime environment file.** Tests construct config literals
   directly; they do not route through loaders that read disk.
8. **Any test spawns a child process, fork, or test-authored
   worker.** Covered by `testing-strategy.md` §Rules, "No process spawning
   in tests". A proof that needs a real child process (a child's stdio
   topology, its exit and signal fidelity) is an observation made
   once and recorded, or a validator's self-proof outside the
   in-process test run. The directive is the authority; this item
   points at it.
9. **Any test makes a real network or socket call.** Driving a
   separately running system is an E2E check, a validation surface.
   Code imported into the test process is proven at the handler
   seam, called directly: a harness's loopback listener is a socket.
   Network reach lives in validation checks run by CI-gated tasks, the
   deploy pipeline and operator context; never in a test (OCE records
   that boundary as its ADR-161, the network-free PR-check CI boundary).

## Mock/Stub Immediate Fails

10. **Test uses `vi.stubGlobal`, `vi.mock`, `vi.doMock`,
    `vi.useFakeTimers` or `vi.setSystemTime`.** Global state
    manipulation; prohibited outright. Use DI: a clock or scheduler
    is injected.
11. **Unit test contains any mock.** Unit tests are pure — no mocks,
    fakes, or stubs of any kind. Parameters in, result out.
12. **Integration test contains a mock with branching or a state machine.** Integration
    mocks are *simple* fakes — constant returns, a record of what the
    product sends through an output port, read as a value
    (`testing-strategy.md` §Stubs vs Fakes), or a parametric fake. No
    branching and no state machines; a fake whose answer depends on its
    inputs is a parametric fake and meets all five conditions of
    `testing-strategy.md` §Philosophy. Complexity signals product-code
    needs refactoring for testability.
13. **Test passes anything other than a fake or constant into the
    unit under test (unit test).** If the unit needs a real object
    to run, the unit is not isolated.

## Structural Immediate Fails

14. **Test authors any function with non-trivial complexity.**
    Helpers in tests must be trivial: build a literal, wrap a call.
    Conditional logic, loops with side effects, or multi-step state
    setup in a test function = test code testing itself.
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
18. **Test asserts on the product's queries or internal calls.** A
    spy on a private or internal method, or an assertion on which
    queries the product made of a collaborator it asks (an input
    port), how often or in what order, couples the test to
    implementation and breaks on refactor. Assert on return values,
    public behaviour, or an output port's record read as a value
    (`testing-strategy.md` §Stubs vs Fakes). The owner, 2026-09-24: "never
    test config or implementation (no call inspection, no config pins)".
19. **Test proves something about the test scaffolding, not the
    product code.** E.g. asserts that a mock returned the value it
    was configured to return; asserts on types only; tautologies
    (comparing two names at the same value).

## Pipeline Immediate Fails

20. **Test category does not match its file name.** A
    `*.unit.test.ts` that exercises several units working together is an
    integration test under the wrong name: rename it. The name must
    match the category the test's behaviour puts it in; a suffix names a
    file and never classifies it. A test that touches IO is item 4's
    defect under any name; its cure is an injected seam or a move to
    validation.
21. **Test is named `*.integration.test.ts` but opens a socket, hits
    the network, or spawns processes.** Classify by the boundary,
    then cure: a genuine separately-running-system exchange is an
    E2E or smoke check outside the in-process test run; outbound IO from
    imported code is a missing DI seam to fix.
22. **Test depends on test-execution order to pass.** Shared mutable
    state between tests is a correctness hazard. Each test must be
    self-contained.
23. **Test asserts one host's spelling.** A POSIX path literal where the
    code joins or resolves by host, or a POSIX-only capability (symlink
    privilege, `O_NOFOLLOW`): assert host-neutrally (absolute, ending in
    the expected segments) or name the forced host. Five instances,
    2026-09-27 to 2026-09-29, all green on POSIX: four failed the Windows
    job and one was a review finding. If one recurs with this item
    loaded, it is not working.

## When to Apply

- As the **first pass** on any test-expert invocation.
- Before any deeper analysis of test value or TDD compliance.
- Findings here block approval; every item must be clean before
  the test suite is considered compliant.

## Fix Direction

Most of these fails point at **product code problems**, not test
problems:

- "Test imports production factory X" → product code lacks a DI seam;
  refactor to accept X as a parameter.
- "A test touches IO" → inject the seam or extract a pure core; what
  needs real IO moves to validation.
- "Integration test has complex mock" → the dependency surface is too
  wide; split the responsibility in product code.

The test-expert flags the symptom. The fix is usually upstream.

## Related Rules

- `.agent/rules/no-global-state-in-tests.md` — specific prohibition
  on `process.env` reads/writes, `vi.stubGlobal`, `vi.mock`,
  `vi.doMock`, `vi.useFakeTimers` and `vi.setSystemTime`.
- `.agent/directives/testing-strategy.md` §Rules — the skip-mechanism
  prohibition (the **No skipped tests** bullet).
- `.agent/rules/no-conditional-tests.md` — prohibition on conditional
  execution and the architectural-failure diagnosis.
- `.agent/directives/testing-strategy.md` — full authoritative
  test-quality reference.
