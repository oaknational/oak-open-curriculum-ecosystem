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
describes it). Rollout sequencing: mutation-testing plan.
Formal home: [`validation-strategy.md`](validation-strategy.md) (seeded
2026-06-23) per doctrine restructure plan.

## Philosophy

- ALWAYS test behaviour, NEVER test implementation
- Prefer pure functions and unit tests
- Always use TDD at ALL levels (unit, integration, E2E)
- Prefer unit tests over integration tests
- Prefer integration tests over E2E tests
- Unit and integration tests must not trigger IO beyond the loopback
  harness exchange defined under §Test Types. E2E and smoke tests may
  trigger IO only under their respective constraints below.
- NEVER create complex mocks, use simple mocks passed as arguments
  to the function under test. Complex mocks result in testing the
  mocks, and indicate that product code needs refactoring and
  simplification in order to be easily testable.
- ALL mocks MUST be simple fakes, passed as arguments to the function under test.
- **Constant object-literal fakes are the DEFAULT; a parametric
  (params-dependent) fake is admissible only when ALL five conditions
  hold** (test-expert ruling, 2026-07-02, curriculum-hub E3): (a) the
  parameter is contract data flowing through the seam, not a hardcoded
  internal; (b) the fake models the collaborator's DOCUMENTED
  semantics, stated in a comment; (c) it is a single branch-free pure
  expression of its params; (d) assertions stay output-shaped — never
  call-inspection; (e) fixtures are sized to discriminate.
  Argument-reflector fakes are admissible only where the seam's
  contract IS forwarding. Collaborator semantics that would need a
  BRANCH in the fake belong to a higher test scale, not a cleverer
  fake. Pre-flagging a parametric-fake deviation with its rationale in
  the review request is what makes the admission cheap.
- NEVER test external functionality, that is not under our control
- NEVER add complex logic to tests - it risks testing the test code rather than the code under test
- Always ask what a test is proving - it should prove something useful about the code under test
- Each proof should happen ONCE - repeated proofs are fragile and waste resources
- NEVER manipulate global state in tests - no `process.env` reads
  or mutations, no `vi.stubGlobal`, no `vi.mock`, no `vi.doMock`.
  Product code must accept configuration as parameters. See
  [ADR-078][di]. For React components that fetch or derive async
  state, the DI seam that makes this holdable is the view-binder
  split — views take state as props, a two-line binder owns the
  hook, tests render the view with literal states, zero mocks
  (the `view-binder-di-seam` pattern in active memory).

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
- **Test the feature-flag engine, not the configuration** - Test
  the flag resolution mechanism (opt-in, kill-switch, precedence)
  once, generically, as a named unit. Never test a specific flag's
  default, posture, or gated surfaces — those are configuration
  that flexes by release stage, and per-flag on/off tests re-prove
  the engine while pinning config. Wire posture at the call site.
  (Owner doctrine 2026-06-08; the specialisation of "assert
  effects, not constants" for flags.)
- **Prove behaviour, never config or content** - The umbrella over
  the rules above: a test proves observable behaviour *without
  constraining implementation*. Two corollaries (owner doctrine
  2026-06-26): hashing a source and pinning the hash is the
  antithesis — it pins bytes, proves no behaviour, fails loud on a
  harmless change; and the cure for a **content-quality invariant**
  (a firewall, e.g. "no curriculum data in this prose") is NOT a
  grep test but **construction plus human review**. The
  **designed-sentinel carve-out** (owner doctrine 2026-08-03): a
  literal content pin is admissible only when a named decision
  attaches to the value changing and the failure message instructs
  re-adjudication of that decision, never removal-on-sight —
  correction-layer override sentinels qualify; example-value pins
  do not, and their cure is a source-anchored test of the
  generating mechanism, red only when the mechanism breaks and
  silent on upstream content drift (trigger artefact: the MCP-462
  differential examples test that replaced three value-pinned
  tests).
- **Pinning an absence is not proof** (owner doctrine 2026-08-19,
  verbatim: "tests should prove behaviour, not configuration, pinning
  a lack of something does not provide value"): an assertion that a
  field, property, or capability is ABSENT from a configuration or
  registration object (`not.toHaveProperty`, negative config pins)
  proves no behaviour and blocks the surface's deliberate evolution.
  The designed-sentinel carve-out does not extend to absence — a
  sentinel attaches a named decision to a VALUE changing, never to a
  key not existing. A deliberate absence is recorded in the owning
  ADR or plan; where the absence has observable consequences, prove
  those consequences behaviourally through the public boundary.
  Negative-space tests that DRIVE the boundary and observe an
  outcome (a guard refusing an activation, an error path's observable
  result) are behaviour proofs, not absence pins — the discriminator
  is whether the test exercises behaviour or inspects configuration.
  (Trigger instance: an integration test pinning
  `not.toHaveProperty('outputSchema')` on a captured registration
  config.)
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
  tests. Operationalises [ADR-011 (Use Vitest for
  Testing)][adr-011-noskip] and [ADR-121 (Quality Gate
  Surfaces)][adr-121-noskip].
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

- **No wall-clock ceilings in gated tests** - A wall-clock assertion
  (`expect(elapsed).toBeLessThan(500)` or any finite ms ceiling) in a
  gated in-process test is the conditional-test defect class expressed
  through an assertion value: it is nondeterministic pass/fail across
  environments, and ANY finite ceiling fails under sufficient host
  contention. The cure is DELETE — no deterministic assertion is
  recoverable from wall-clock. A genuinely-owned cost budget belongs in
  a benchmark instrument (an on-demand script, reporting not gating),
  never in the test suite. Must-nots: raising the ceiling, retry-wraps,
  tolerance bands, relative bounds, or slicing the corpus out of
  behavioural tests (test-expert ruling, 2026-07-06: three wall-clock
  suites deleted; the real-corpus import design itself ruled conformant
  and retained).

[adr-011-noskip]: ../../docs/architecture/architectural-decisions/011-vitest-for-testing.md
[adr-121-noskip]: ../../docs/architecture/architectural-decisions/121-quality-gate-surfaces.md
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
[testing-patterns-value-proxies]: ../../docs/engineering/testing-patterns.md#acceptance-value-proxies

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
  ONE named sanctioned shape (recorded 2026-08-07 with the F-112
  push-path landing; the shape the F-112 commit-path cure
  established — see the `file-backed-stdio-for-spawned-gate-children`
  pattern): a SPAWN-TOPOLOGY CONTRACT test — where the behaviour
  under test IS a real child's stdio topology or exit/signal
  fidelity and no DI seam below it can carry the proof (a fake would
  model libuv engine semantics, the "double models the engine"
  trap) — may spawn a bounded, deterministic, synthetic child
  (`node -e`, literal env, no shell), homed in the workspace's
  integration-test directory, kept apart from the seam-shaped suite
  (worked instance: `agent-tools/tests/`). The seam-shaped remainder
  of any such suite stays spawn-free via ADR-078 injection;
  composition with real binaries belongs at smoke tier.
  `test-immediate-fails.md` item 8 points here.

- **No reading the `.agent/` knowledge substrate in tests** - Tests MUST
  NOT read from `.agent/**/*` for any reason (owner doctrine 2026-06-22,
  absolute). That tree is shared, mutable, relocatable knowledge, not test
  fixtures, so a test that reads it is asserting configuration rather than
  proving behaviour (see "Assert effects, not constants") and goes stale
  when the substrate moves. Worked instance: a gap-ledger test
  `readFileSync`-ed a plan JSON, asserted its `statuses` and finding
  tuples, and silently broke when a plan-estate relocation moved the file.
  If product code resolves `.agent/` paths, exercise it against a
  `mkdtemp` fixture repo, never the live tree.

### Prove the guard bites (mutation check on every gap-closing test)

Any test added to close a proof gap is validated by MUTATING the source to
the wrong behaviour and confirming exactly that test fails — then reverting.
A guard that cannot be shown to bite is decoration; the mutation check is
one minute of work and the only direct evidence the test guards anything
(recorded 2026-07-2x; composes with the atomic-landing invariant — the
mutation check happens before the commit that lands test and code together).
The same disease in existing suites: DECORATIVE assertions — asserted
values that never enter the exercised run — read as coverage while proving
nothing (a privacy-surface review found six under a README claiming the
behaviour was tested); the mutation check exposes them identically.

### Test doubles model the boundary, never the engine

A fake that models a vendor SDK's INTERNALS is wrong twice over: it encodes
guesses about the engine (wrong twice in two rounds on PR #618), and its
green proves conformance to the guess, not the behaviour. Fakes assert only
the handler's own observable behaviour at its boundary; composition with
the real engine is proven by real-SDK integration tests. Related trap: an
`isError`-shaped assertion is unfalsifiable as a liveness check when
unmatched anchors return well-formed empty envelopes — assert on content,
not on error-shape absence.

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
effects on any system outside the test process. These tests are
about testing CODE, not testing RUNNING SYSTEMS.

- **Unit test**: A test that verifies the behaviour of a single
  PURE function in isolation. Unit tests DO NOT trigger IO, have
  NO side effects, and contain NO MOCKS. Unit tests are
  automatically run in CI/CD.
- **Integration test**: A test that verifies the behaviour of a
  collection of units **working together as code**, NOT a running
  system. Integration tests still import and test code directly
  within the test process. They DO NOT trigger IO beyond the
  loopback harness exchange defined below, have NO side effects
  outside the test process, and can contain SIMPLE mocks which
  must be injected as arguments to the function under test. Integration tests are
  automatically run in CI/CD and include MCP protocol compliance
  testing. **Important**: Integration tests are NOT about testing
  a deployed or running system - they test how multiple code units
  integrate when imported and called directly. An HTTP exchange
  whose counterparty is an app the test itself imported and booted
  in-process (`supertest(app)`, or an equivalent harness) is
  calling mechanics, not prohibited IO; an exchange with any
  system the test did not import and boot is E2E-tier network IO.
  The listener must be ephemeral (`listen(0)`, never a fixed port)
  and closed within the same helper call; a self-managed listener
  binds loopback explicitly, and a harness-managed listener
  (supertest's own) is ephemeral and immediately closed, which is
  the accepted equivalent. Every other IO the test
  or the app performs — filesystem, outbound network from the app
  or its collaborators, process spawning — remains prohibited;
  upstream dependencies are still injected simple fakes. The
  classifier is the boundary, not the tool (owner-ratified
  2026-07-29 — full statement under E2E below).

#### Out-of-process tests

Out-of-process tests are tests that validate a running *system*,
the tests and the system run in *separate processes*. They are
slower, are less specific in the causes of issues but cast a wider
net, and may produce side effects locally and in external systems.

- **E2E test**: A test that verifies the behaviour of a running
  system. E2E tests CAN exchange STDIO with the running system —
  this is the protocol channel that defines what an E2E test IS for
  stdio-transport systems (MCP stdio). E2E tests MUST NOT trigger
  filesystem IO, network IO beyond the system under test's
  protocol channel, or any other side-effecting IO; the test's
  job is to drive the system over its protocol channel and
  assert on the response, not to manipulate the surrounding
  environment. E2E tests CAN have side effects strictly attributable
  to the running system itself, contain minimal mocks (largely around
  network IO inside the system), and MUST NOT spawn additional
  processes — only the runner harness boots the system. For
  HTTP-transport systems the protocol channel is real socket IO to a
  listening server. Classification of supertest (and any HTTP test
  harness) follows the **boundary, not the tool** (owner-ratified
  2026-07-29): "It depends on if it is calling a black box running
  system over a network interface (E2E), or if it is importing code
  and running it inside the test (integration)." `supertest(app)`
  against an imported, in-process app is an integration test — the
  harness's loopback socket is an implementation detail of the
  tool, not a system boundary. Supertest driven at a separately
  running black-box system over a network interface is E2E — see
  [`testing-patterns.md` §Test File
  Classification](../../docs/engineering/testing-patterns.md#test-file-classification).
  Note supertest exercises the HTTP/JSON-RPC exchange but not SSE
  transport serialisation; keep MCP-client-SDK E2E tests alongside it
  for transport fidelity. Naming alone (a `.e2e.test.ts` filename)
  does NOT exempt a test from in-process restrictions; classification
  is by **behaviour shape** (does the test drive a separately
  running system it did not import, or does it import product code
  and run it inside the test process?), not by filename suffix. A
  test whose system under test was imported into the test process
  is an integration test even if named `.e2e.test.ts`. These
  constraints are to allow E2E tests to be safely run in CI/CD.

- **Smoke test**: A test that proves the SHIPPED FORM of a system is
  viable — the built artefact, invoked exactly as production invokes
  it (plain `node dist/...`, the installed binary, the deployed URL),
  never source through a test-runner loader. Minimum behaviour scope,
  maximum execution-surface fidelity. Smoke tests CAN trigger all IO
  types, DO have side effects, and DO NOT contain mocks. Full
  definition, the per-artefact-class minimum truth-sets, and the
  new-binary requirement:
  [§Smoke Tests — Artefact Viability](#smoke-tests--artefact-viability).

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
directly. They never spawn processes, test deployed systems, or
exchange with any system the test did not itself import and boot;
the only network-shaped exchange permitted is the loopback harness
exchange with the imported app (§Test Types).

### Stubs vs Fakes

- **Runtime stubs**: plain functions that live in the SDK and are used in
  product code stub mode (e.g. `createStubRetrievalService`). They return
  canned data and have no test framework dependency.
- **Test fakes**: `vi.fn()` wrappers that live in `test-helpers/` directories
  and are used only in tests. They enable assertions on call counts, arguments,
  and return values.

Do not conflate the two. Runtime stubs are product code; test fakes are test
infrastructure.

### Smoke Tests — Artefact Viability

The test taxonomy above classifies by SCOPE of behaviour (unit →
integration → E2E). There is a second, orthogonal axis: EXECUTION
SURFACE. Scope-axis tests typically execute source through a
loader-assisted harness (vitest, tsx) while production executes built
artefacts under plain `node` — and nothing at any scope level REQUIRES
surface fidelity. An E2E test MAY boot the built artefact (the Oak
Search CLI contract E2E boots `dist/bin/oaksearch.js` and is the worked
example), but that coverage is incidental to its scope classification.
Smoke tests own the surface axis and make artefact fidelity MANDATORY:
minimum behaviour scope, maximum surface fidelity. Defects that exist
only in the built form — extensionless ESM import specifiers in
`dist`, lost executable bits, files missing from the build output,
broken package `exports` maps — evade any suite that happens to run
source. Worked instance: the 2026-07-21 agent-tools outage, where the
dist CLI was cold-start broken for a day under green CI ("the surface
that validates is not the surface that executes").

**Invariant: EVERY built binary carries at least one smoke test** that
invokes the artefact exactly as production invokes it and proves the
minimum truth-set for its class. New binaries satisfy the invariant at
landing — the smoke ships in the same PR as the binary (the
atomic-landing invariant). The pre-existing binary estate does not yet
satisfy it: that gap is RECORDED DEBT — enumerable mechanically at any
moment as the difference between the built binary entries a workspace
emits and the truth-set smokes reachable from its CI-run tasks — and
it is tracked in the work-management system as a bounded retrofit
obligation whose contract is stated here self-contained: every existing built
binary gains its truth-set smoke; the smoke-suffix convention is
unified estate-wide; and pre-doctrine "smoke" suites that are
scope-axis tests under this definition are reclassified into the
scope taxonomy with their docs and runner config.

Minimum truth-sets by artefact class:

- **CLI binary**: the built entry file exists, is executable, and
  carries its shebang; a cold start under plain `node` (no loader, no
  test runner) resolves the full module graph; `--help` exits 0 with
  usage on stdout; an unknown flag or invalid arguments exit non-zero
  with guidance on stderr and no stack trace; one trivial happy-path
  invocation exits 0.
- **Long-running server**: a cold start from the built artefact
  reports ready; the health or initialize surface responds; SIGTERM
  produces a clean exit.
- **Published package**: the PACKED form is the shipped form — `pnpm
  pack` (or the registry-equivalent) installed into a clean consumer
  workspace, then imported under plain `node`: every STATIC
  `exports`-map key is imported directly, and every wildcard subpath
  pattern (e.g. `./client/*`) is proven by importing at least one
  concrete subpath it matches. Importing from the workspace `dist`
  directly proves the build, not the publish: files, permissions, and
  manifest fields can be lost when the tarball is assembled.

Constraints:

- Readiness and completion are proven by EVENTS (an exit code, a ready
  line, a response), never by wall-clock assertions — the
  no-wall-clock rule applies to smoke tests unchanged. Harness
  timeouts are mechanics, not assertions.
- Smoke files live in the workspace's `smoke-tests/` directory, and
  each MUST be reachable from a script that a CI-gated task runs (a
  local-only smoke test re-opens the exact gap this section closes).
  The check↔CI parity validator keeps the aggregate honest; wiring
  each smoke into a CI-run task is the author's obligation at landing
  time. The binding invariant is REACHABILITY: a smoke file matches
  the glob its workspace's live runner actually executes — an
  unreachable smoke test is the defect, not a variant. One canonical
  suffix governs once the estate-wide unification (part of the
  retrofit obligation above) converges; adopting it workspace-by-
  workspace is done by changing the runner glob and the files in one
  landing, never by authoring a file the current glob cannot see.
- Smoke tests exercise the artefact boundary, not features: feature
  behaviour belongs to the scope axis (unit/integration/E2E). A smoke
  test that grows feature assertions is misfiled — move the assertions
  down the taxonomy.

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
- Use Supertest to drive HTTP surfaces — integration when the app is
  imported and booted in-process, E2E when it drives a separately
  running system (see §Test Types)
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

## When a Defect Is Found

Every issue earns a check
([principles.md §Code Quality](principles.md)). For a real defect in
product behaviour the check is a test: write the test that reproduces
the defect (Red) BEFORE the fix, at the same level as the defective
behaviour, then land test + fix in one commit (Green). Describe the
class the defect generalises to — parametrise or add sibling cases —
not only the reported instance.

When the issue is not product behaviour, the check is the appropriate
kind instead; the spectrum lives in principles.md §Code Quality.

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
  `baseTestConfig` from `@oaknational/workspace-config/vitest` (a
  declared `workspace:*` devDependency — never a relative path out
  of the workspace).
- **Pattern 2 (custom)**: Define a workspace-specific config.
  Non-negotiable: `exclude` MUST contain `'**/*.e2e.test.ts'`.
  `include` SHOULD use explicit conventions (`*.unit.test.ts`,
  `*.integration.test.ts`) not broad `*.test.ts` globs.

Workspaces with `*.e2e.test.ts` files MUST also have
`vitest.e2e.config.ts` (extending `baseE2EConfig` from
`@oaknational/workspace-config/vitest-e2e`, or workspace-specific)
and a `test:e2e` script in `package.json`.

## Test Assertion Placement

Keep E2E assertions on system/transport invariants; prove runtime
stub semantics in SDK unit/integration tests, not by asserting
server output against the same stub path.

## Acceptance Value-Proxies

Acceptance value-proxies must compare against independent ground-truth
measures, not against a prior baseline produced by the same method. If a
criterion says "agrees with prior baseline ±N%" without naming an independent
measure, reject the framing at plan-author time. Worked recipe:
[`testing-patterns.md` §Acceptance Value-Proxies][testing-patterns-value-proxies].

## Test Configuration Gotchas

Tooling-mechanics recipes (tsconfig include patterns, ESLint `projectService`,
vitest glob staleness, `.env` isolation, entry-point refactors) live in
[`testing-patterns.md` §Test Configuration Gotchas](../../docs/engineering/testing-patterns.md#test-configuration-gotchas).

## Harnesses Adapt to Shared Hosts

Owner-ruled, twice in one day (2026-07-29/30): when a test harness collides
with a live surface on a shared host, "the problem is lack of configuration
or adaptation in the server" — **the config adapts, never the seats**, and a
live owner-facing surface never pauses for a push gate. The first suspect in
any gate-vs-environment collision is the harness's missing adaptation, never
the schedule. Worked instances: a fixed-port Playwright `webServer` turned
one seat's render server into a fleet-wide push outage (cure: an ephemeral
port probed at config load — no `process.env` in config, `reuseExistingServer`
stays `false`); a UI-test webServer inheriting `.env.local` refused a valid
sink configuration (cure: the webServer pins its own observability env).
Corollary for guard design: when a guard bites the innocent, fix the shared
context so the guard's premise holds per-worktree — never weaken the guard.

## Test Data Anchoring

Tests that agree with code on the wrong contract are worse than no tests.
Anchor fixtures to schemas or captured API responses, not code assumptions
(e.g. `keyStageSlugs` instead of API `keyStages`). Use
`as const satisfies SDKType` to couple test data to SDK type evolution.

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
