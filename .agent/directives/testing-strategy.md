---
fitness_line_target: 380
fitness_line_limit: 450
fitness_char_limit: 33000
fitness_line_length: 100
split_strategy: "Move recipes to docs/engineering/testing-patterns.md and docs/engineering/testing-tdd-recipes.md; split by test level if needed"
---

# Testing and Development Strategy

> Foundational definition (see [tdd-as-design.md](tdd-as-design.md)): a test
> describes a system state, product code guides the system into it. They are
> two halves of one act of design. This directive defines the test-type
> taxonomy and shape rules; `tdd-as-design.md` defines *why* tests exist and
> the atomic-landing invariant.

## Tooling

- Vitest
- React Testing Library
- Supertest
- Playwright

Mutation testing (Stryker) is **meta-quality** — it audits the test surface,
not the product, and is the constraint that makes coverage meaningful (a test
that executes code without checking behaviour scores the same as one that
describes it). Rollout sequencing: [mutation-testing plan][mutation-plan].
Formal home: forthcoming `validation-strategy.md` per [doctrine restructure
plan][doctrine-plan].

[mutation-plan]: ../plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md
[doctrine-plan]: ../plans/agentic-engineering-enhancements/current/validation-and-tdd-doctrine-restructure.plan.md

## Philosophy

- ALWAYS test behaviour, NEVER test implementation
- Prefer pure functions and unit tests
- Always use TDD at ALL levels (unit, integration, E2E)
- Prefer unit tests over integration tests
- Prefer integration tests over E2E tests
- Unit and integration tests must not trigger IO. E2E and smoke tests may
  trigger IO only under their respective constraints below.
- NEVER create complex mocks, use simple mocks passed as arguments
  to the function under test. Complex mocks result in testing the
  mocks, and indicate that product code needs refactoring and
  simplification in order to be easily testable.
- ALL mocks MUST be simple fakes, passed as arguments to the function under test.
- NEVER test external functionality, that is not under our control
- NEVER add complex logic to tests - it risks testing the test code rather than the code under test
- Always ask what a test is proving - it should prove something useful about the code under test
- Each proof should happen ONCE - repeated proofs are fragile and waste resources
- NEVER manipulate global state in tests - no `process.env` reads
  or mutations, no `vi.stubGlobal`, no `vi.mock`, no `vi.doMock`.
  Product code must accept configuration as parameters. See
  [ADR-078][di].

## Rules

- **TDD = test + product code as PAIRS, in one landing** - ALWAYS
  use TDD, prefer pure functions and unit tests. Each cycle is a
  single landing unit (one commit): write the failing test first
  (Red), then the product code that makes it pass (Green), then
  refactor with the test as the safety net (Refactor). Test and
  product code travel together, never separated across commits.
  If a test cannot be greened in a single landing, the slice is
  too big — break it into smaller test+code pairs and land each
  as its own cycle. Every commit ends with all tests passing.
- **Test real behaviour, not implementation details** - We should
  be able to change *how* something works without breaking the test
  that proves *that* it works.
- **Test to interfaces, not internals** - Tests should be written
  to the interfaces, not the internals. Closely related to test
  behaviour not implementation.
- **Assert effects, not constants** - Test observable product
  behaviour through the interface, not the value of internal
  constants or configuration collections.
- **No useless tests** - Each test must prove something useful
  about the product code. If a test is only testing the test or
  mocks, delete it.
- **Do not test types** - Tests are for logic, types are explored
  through creating tests, but types cannot be tested. If test only
  tests types, delete it.
- **KISS: No complex logic in tests** - Complexity in tests is a
  signal that we need to step back and simplify, the code and the
  test.
- **KISS: No complex mocks** - Mocks should be simple and focused,
  no complex logic in mocks, or we risk testing the mocks rather
  than the code. Complex mocks are a signal that we need to step
  back and simplify the code or our approach.
- **No skipped tests** - Fix it or delete it. Skipping mechanisms
  (`it.skip`, `describe.skip`, `test.todo`, `it.todo`, `xit`,
  `xdescribe`) are forbidden outright. External-resource tests must
  fail fast with a helpful error, never silently skip. Validation
  scripts requiring external resources are standalone scripts, not
  tests. Full rule: [`no-skipped-tests.md`][no-skip].
- **No conditional tests** - Conditional execution of any kind is a
  symptom of architectural failure: `skipIf`, `runIf`, conditional
  registration, runtime branching in test bodies, conditional
  assertions, fixtures that vary with ambient state. The diagnosis
  is always product-code ambiguity (multi-mode functions,
  runtime-detected configuration, env-coupled behaviour). The
  corrective is to remove the conditional, fix the ambiguity at the
  source, and write deterministic behaviour-proving tests that do
  not constrain implementation. `it.each` over a literal dataset is
  NOT conditional — it is deterministic enumeration. Full rule:
  [`no-conditional-tests.md`][no-cond].

[no-skip]: ../rules/no-skipped-tests.md
[no-cond]: ../rules/no-conditional-tests.md

- **No ambient global state access** - Tests MUST NOT read or mutate
  `process.env`, use `vi.stubGlobal`, use `vi.mock`, or use
  `vi.doMock`. If a function needs configuration, refactor it to
  accept config as a parameter. See [ADR-078][di].
  Smoke composition roots — the Vitest runner config or spawn
  invocation — may read ambient env, validate it, and inject the
  result. Test files and setup files must not read or mutate
  `process.env`.

[di]: ../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md

- **No process spawning in in-process tests** - Test code MUST NOT
  spawn child processes, create test-authored workers, or
  instantiate tools that internally spawn processes (e.g.
  programmatic ESLint with TypeScript project service). This
  excludes vitest's own configured pool — the restriction is on
  what *test code* does, not the runner. Process spawning creates
  handles that prevent clean worker exit, causes CI hangs, and
  violates the principle of using the right tool for the job. Use
  the right tool: ESLint for boundary enforcement, Playwright for
  browser testing, vitest for runtime logic.

## Definitions

### System Architecture Components

- Pure function: A function that has no side effects and returns
  the same result for the same input. Pure functions are the
  building blocks of all code. Pure functions have unit tests.
  Naming convention: `*.unit.test.ts`.
- Integration point: A point in the code where multiple units are
  brought together to effect change in the larger system. Typically
  this is where IO interfaces are injected as arguments to
  functions, and where other configuration occurs. Integration
  points define boundaries of responsibility. Integration points
  have integration tests. Naming convention:
  `*.integration.test.ts`.
- System: The complete MCP server exposed via stdio transport.
  Systems have E2E tests. Naming convention: `*.e2e.test.ts`.

### Test Types

#### In-process tests

In-process tests are tests that validate **code imported into the
test process**. The code under test runs in the same process as
the test runner. They are fast, specific, and do not produce side
effects. These tests are about testing CODE, not testing RUNNING
SYSTEMS.

- **Unit test**: A test that verifies the behaviour of a single
  PURE function in isolation. Unit tests DO NOT trigger IO, have
  NO side effects, and contain NO MOCKS. Unit tests are
  automatically run in CI/CD.
- **Integration test**: A test that verifies the behaviour of a
  collection of units **working together as code**, NOT a running
  system. Integration tests still import and test code directly
  within the test process. They DO NOT trigger IO, have NO side
  effects and can contain SIMPLE mocks which must be injected as
  arguments to the function under test. Integration tests are
  automatically run in CI/CD and include MCP protocol compliance
  testing. **Important**: Integration tests are NOT about testing
  a deployed or running system - they test how multiple code units
  integrate when imported and called directly.

#### Out-of-process tests

Out-of-process tests are tests that validate a running *system*,
the tests and the system run in *separate processes*. They are
slower, are less specific in the causes of issues but cast a wider
net, and may produce side effects locally and in external systems.

- **E2E test**: A test that verifies the behaviour of a running
  system. E2E tests CAN exchange STDIO with the running system —
  this is the protocol channel that defines what an E2E test IS for
  stdio-transport systems (MCP stdio). E2E tests MUST NOT trigger
  filesystem IO, network IO, or any other side-effecting IO; the
  test's job is to drive the system over its protocol channel and
  assert on the response, not to manipulate the surrounding
  environment. E2E tests CAN have side effects strictly attributable
  to the running system itself, contain minimal mocks (largely around
  network IO inside the system), and MUST NOT spawn additional
  processes — only the runner harness boots the system. Naming
  alone (a `.e2e.test.ts` filename) does NOT exempt a test from
  in-process restrictions; classification is by **behaviour shape**
  (does the test exchange protocol with a separate running system?),
  not by filename suffix. A test that imports product code into the
  test process is an integration test even if named `.e2e.test.ts`.
  These constraints are to allow E2E tests to be safely run in CI/CD.

- **Smoke test**: A test that verifies the behaviour of a running
  system, locally or deployed. Smoke tests CAN trigger all IO
  types, DO have side effects, and DO NOT contain mocks.

#### Common Misconception: Integration Tests

**WRONG Understanding (Common but Incorrect):**

```typescript
// ❌ This is NOT an integration test - it's an E2E test
describe('API Integration Test', () => {
  it('should call the deployed API', async () => {
    const response = await fetch('http://localhost:3000/api/users');
    // Testing a RUNNING SYSTEM over HTTP
  });
});
```

**CORRECT Understanding (Our Definition):**

```typescript
// ✅ This IS an integration test - testing code units working together
import { UserService } from './user-service';
import { DatabaseAdapter } from './database-adapter';

describe('UserService Integration Test', () => {
  it('should retrieve users through the adapter', () => {
    const mockDb = { query: () => [{ id: 1, name: 'Alice' }] };
    const adapter = new DatabaseAdapter(mockDb); // Simple mock injected
    const service = new UserService(adapter);

    const users = service.getAllUsers();
    // Testing how CODE UNITS integrate, not a running system
    expect(users).toHaveLength(1);
  });
});
```

The key distinction: Integration tests import and test code
directly. They never spawn processes, make network calls, or test
deployed systems.

### Stubs vs Fakes

- **Runtime stubs**: plain functions that live in the SDK and are used in
  product code stub mode (e.g. `createStubRetrievalService`). They return
  canned data and have no test framework dependency.
- **Test fakes**: `vi.fn()` wrappers that live in `test-helpers/` directories
  and are used only in tests. They enable assertions on call counts, arguments,
  and return values.

Do not conflate the two. Runtime stubs are product code; test fakes are test
infrastructure.

### Design Approaches

- Test Driven Development (TDD): Write tests before writing code
  at ALL levels. Tests PROVE correctness and specify desired
  behaviour.
- Behaviour Driven Development (BDD): Write integration and E2E
  tests before writing code. These tests PROVE we are creating the
  **desired behaviour and impact** at the integration point and
  system level.

## TDD at All Levels

TDD applies to unit, integration, and E2E tests. Each level
describes its own scope of behaviour, and we need tests at every
level to fully describe the working system that delivers value:

| Test Level      | What It Describes               | Scope of Behaviour              |
| --------------- | ------------------------------- | ------------------------------- |
| **Unit**        | Pure function behaviour         | Narrow — one function or module |
| **Integration** | How units compose at a boundary | Medium — wired pieces           |
| **E2E**         | Running-system behaviour        | Broad — whole user-facing flow  |

Higher-level tests describe broader swathes of behaviour. They
take more product code to make pass because the behaviour they
specify is composed from many smaller pieces. Lower-level tests
give fast feedback and pinpoint failures; higher-level tests
prove the system delivers value as a whole. Both are required.

**The cycle is the same at every level**: write the failing test
that specifies the next slice of behaviour, write the product
code that makes it pass, refactor while keeping it green — all
in one landing. Across multiple cycles you build up the system
with tests describing it at every level. Each commit ends with
all tests passing at every level.

**Parallel cycles across levels**: a single delivery often needs
test+code pairs at multiple levels — a higher-level test may
require several lower-level cycles before it can be greened.
Order the cycles so each commit is internally complete (its own
test passes) and the higher-level test goes green in the commit
that adds the final piece it needs. The higher-level test is not
written ahead and left failing for multiple commits; it is
written in the commit where it can be made to pass.

**Key Insight**: If tests lag behind code at ANY level, TDD was
not followed at that level. If tests sit failing or skipped
across multiple commits at any level, TDD was not followed —
the slicing was wrong.

## Development Workflow

- ALWAYS USE TDD at ALL levels
- Use Vitest for all in-process tests (unit + integration)
- Use Supertest for HTTP-level E2E tests
- Use Playwright for UI E2E tests
- Use the MCP client SDK for MCP protocol E2E tests
- Use the canonical mocking approaches for the testing tools in use for a given test
- Tests live next to the code they test, not in a `test` directory
  - Unit tests live next to the pure function file containing the
    functions they test. They MUST end in `*.unit.test.ts`
  - Integration tests live next to the integration point file
    containing the integration points they test. They MUST end in
    `*.integration.test.ts`
  - E2E tests live in the `e2e-tests` directory. They test a running
    *system* rather than importing product code, so they do not
    co-locate with any product file. They MUST end in `*.e2e.test.ts`

## When Behaviour Changes

**Rule**: Update tests at the SAME level as the behaviour change
FIRST, before changing implementation — within the same landing.

- **Pure function behaviour changes**: update unit tests, then
  product code that makes them pass, in one commit
- **Integration behaviour changes**: update integration tests,
  then the wiring/code that makes them pass, in one commit
- **System behaviour changes**: update E2E tests, then the
  product code that makes them pass, in one commit (or, if the
  E2E test requires several lower-level changes first, sequence
  the lower-level test+code commits and finish with the
  E2E-test+wiring commit that turns the E2E test green)

**Example** (single landing):

- A protected endpoint should return a new status for a
  system-level condition
- In one commit: update the E2E test specifying the new status,
  add the product code that makes the test pass, and refactor
  internals as needed. The commit ends with all tests green.

**Example** (multi-landing for broader behaviour):

- An E2E test requires a new SDK function, a new request
  middleware, and a new response shape
- Commit 1: unit test for the SDK function + the function itself
- Commit 2: integration test for the middleware + the middleware
- Commit 3: E2E test specifying the new behaviour + the response
  shape change that wires it together; the E2E test goes green
- At every commit, all tests pass. No commit ends with a failing
  or skipped test.

This ensures tests remain specifications and that every commit
leaves the tree in a green state.

## Refactoring TDD

For refactoring that does not change public API (runtime behaviour
unchanged), the RED phase is compiler errors from signature
changes, not runtime test failures. Update test call sites first.
Existing tests ARE the safety net — run them before and after the
split, no new tests needed for internal restructuring.

For type-derivation fixes, use `satisfies` as a compile-time
anchor: `{ flat: 'value' } satisfies MyType` fails type-check if
the derivation is wrong, serving as the RED phase alongside
generator string-output tests.

## Canonical Vitest Configuration

Every workspace `vitest.config.ts` MUST follow one of two
patterns. Deviations cause silent test-category leaks (E2E tests
running under `pnpm test`, CI timeouts that don't reproduce
locally).

- **Pattern 1 (preferred)**: Import and re-export
  `baseTestConfig` from `vitest.config.base.ts` at the repo root.
  Adjust the relative path per workspace depth.
- **Pattern 2 (custom)**: Define a workspace-specific config.
  Non-negotiable: `exclude` MUST contain `'**/*.e2e.test.ts'`.
  `include` SHOULD use explicit conventions (`*.unit.test.ts`,
  `*.integration.test.ts`) not broad `*.test.ts` globs.

Workspaces with `*.e2e.test.ts` files MUST also have
`vitest.e2e.config.ts` (extending `vitest.e2e.config.base.ts` or
workspace-specific) and a `test:e2e` script in `package.json`.

## Test Assertion Placement

Keep E2E assertions on system/transport invariants; prove runtime
stub semantics in SDK unit/integration tests, not by asserting
server output against the same stub path.

## Acceptance Value-Proxies

Acceptance value-proxies must compare against independent ground-truth
measures. A value-proxy acceptance criterion ("the new CLI produces a
value within ±N% of the prior baseline") is **tautological** if the
new implementation and the baseline use the same method. Reproducing
the baseline value does not validate correctness; it validates only
internal consistency.

Worked example: a token-count CLI defines acceptance as "the chars/4
output agrees with the prior chars/4 baseline ±5%." The baseline is
itself chars/4. The CLI cannot fail the acceptance check by
construction — chars/4 reproducing chars/4 proves nothing.

The cure is to compare against a **method-independent ground-truth
measure**. For token-count, that is `wc -c` for total characters; the
chars/4 conversion then becomes a mechanical step verified
independently. For other domains, the ground-truth measure is the
authoritative external observation (file size from `stat`, byte count
from the filesystem, response time from a stopwatch, etc.) that the
proxy is supposed to approximate.

Acceptance criteria framed as "agrees with prior baseline ±N%" without
naming an independent ground-truth measure are tautological and fail
under normal churn (any drift looks like baseline error rather than
proxy error). Reject the framing at plan-author time, not at WS
execution.

## Test Configuration Gotchas

- `tsconfig.json` `include` patterns `**/*.test.ts` and
  `**/*.spec.ts` do NOT match test utility files (harness, fixture
  builder). Add `tests/**/*.ts` to the include array when creating
  non-test utilities in test directories.
- ESLint `projectService: true` uses the nearest
  `tsconfig.json`, not `tsconfig.lint.json`. Files must be
  included in both for linting to work.
- Stale vitest include globs are silent because of
  `passWithNoTests: true` — remove dead globs promptly after file
  moves.
- `resolveEnv` integration tests that need `.env` file isolation:
  use `'/tmp'` as `startDir` to prevent ambient `.env` files from
  satisfying schema requirements.
- After refactoring entry points (removing `dotenv`, changing
  `loadRuntimeConfig` signature), check E2E tests that launch the
  process directly — they break when the entry point contract
  changes.

## Test Data Anchoring

Tests that agree with code on the wrong contract are worse than
no tests. The snagging bugs that this repo encountered were
invisible because tests encoded the same wrong assumptions (e.g.
`keyStageSlugs` instead of the API's `keyStages`). Anchor test
fixtures to the schema or captured API responses, not to code
assumptions. Use `as const satisfies SDKType` to couple test data
to SDK type evolution.

## Test Isolation

- Replace Express `_router` access in tests with HTTP assertions
  via supertest — more resilient, tests actual behaviour.
- Repeated multi-line test setup → extract scoped helper inside
  `describe` block (e.g. `registerWithOverrides`, `baseEnv`).
- For large mechanical migrations (30+ files), use subagents to
  parallelise the work.
- Bulk operation factories should accept `startIndex` rather than
  mutating readonly `_id` after creation.

## Browser Proof Surfaces

Four browser-specific proof categories for UI-shipping workspaces:

1. **Accessibility audit** — Playwright + axe-core, WCAG 2.2 AA,
   zero-tolerance, both themes. 9th quality gate (blocking).
2. **Visual regression** — screenshot comparison baselines.
3. **Responsive validation** — viewport and fluid layout coverage.
4. **Theme/mode correctness** — light, dark, high-contrast passes.

For MCP App HTML resources: serve content directly to Playwright
(resource-level a11y), then verify via basic-host (integration-level).
See ADR-147, `docs/governance/accessibility-practice.md`.
