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
> taxonomy and shape rules; `tdd-as-design.md` defines _why_ tests exist and
> the atomic-landing invariant.

## Tooling

- Vitest (unit and integration; runtime logic)
- React Testing Library (component integration, in-process)
- Playwright (UI E2E checks in the browser, against a production build)
- The HTTP E2E driver, the protocol client and the rendering-proof harness the
  host declares (P9; §This host's bindings)

Mutation testing is **meta-quality** — it audits the test surface, not the
product, and is the constraint that makes coverage meaningful (a test that
executes code without checking behaviour scores the same as one that
describes it). The instrument, where one is adopted, is the host's (P10;
§This host's bindings); the claim-directed practice (write the mutant that
would falsify the guard, prove the test bites) is in
[`validation-strategy.md` §Prove the guard bites](validation-strategy.md).

## Philosophy

- ALWAYS test behaviour, NEVER test implementation
- **Tests prove the behaviour of product code, and must never be used to
  constrain configuration or implementation** (owner, 2026-09-24,
  verbatim: "tests prove behaviour of product code, they must never, ever
  be used to constrain configuration or implementation", and of its
  reach: "no excemptions, strict, everywhere, all of the time"). A test
  reads what the product returns, writes or leaves behind at its
  boundary; what the product sends through an output port is something
  it writes (§Stubs vs Fakes). A test never asserts which queries the
  product made of a collaborator, how often or in what order, never pins
  a configuration value and never asserts an implementation shape.
  Configuration is guaranteed by construction or by a validator.
- **Tests are forbidden real IO and child processes; validators start the
  minimum and alter nothing** (owner, 2026-09-29, as two seats relayed it: "tests are
  FORBIDDEN to create real IO and child processes. I don't want excuses or
  carve outs, we have these rules for a reason", and "validation scripts can
  start real processes, but they are to be kept to a MINIMUM, and they are
  FORBIDDEN from altering the code or triggering builds"; the same day: "There
  are consistent, strict test rules in all Practice repos. There are
  validation scripts for checks that do not belong in tests. The validation
  scripts have been abused in order to avoid the strictures of the tests, this
  is unacceptable. We have far too many "validation scripts" in both estates,
  they take TOO LONG to run, dragging on every commit and push, and they are
  testing things that should be in tests and tested at a lower level with no
  IO and with DI. So stop that, and make the rules clearer, and at least for
  local CI runs start profiling the total run times and the run times of the
  individual tasks. ALL CI tasks should be run through Turbo."). A check that
  asserts behaviour is a test: in-process, no IO, dependencies injected, never
  an inspection of which calls were made, a pinned literal or a count of work
  done. A validation script exists only for a check that cannot be a test; it
  runs the built artefact, alters no code (no repair mode, formatter write,
  install or build) and is counted; a smoke that alters code is misfiled and
  comes out. Every CI task runs through Turbo with declared inputs, and each
  gate run records its total and per-task time before a cure is chosen.
- Prefer pure functions and unit tests
- Always use TDD at ALL levels (unit and integration tests; an E2E check is
  written first in the same way)
- Prefer unit tests over integration tests
- Prefer integration tests over E2E checks
- **Tests never, under any circumstances, use or create IO.** Every test of
  every kind, every helper a test imports, and the product code a test runs:
  no filesystem, no network, no
  socket (loopback included), no process spawn, no clock, no environment
  read. This is an absolute invariant, not a matter of degree (owner,
  2026-09-14 and 2026-09-15); a test that uses or creates IO is an error
  (owner, 2026-09-06). There is no allowlist, no exemption and no carve-out,
  and a reviewer's precedent never licenses one
  ([PDR-091](../practice-core/decision-records/PDR-091-precedence-is-not-approval.md)):
  an agent having broken the rule before is not permission to break it again,
  and a seat refutes such a precedent claim itself, never routing it upward
  as a question for the owner.
  What a test cannot prove without IO is not a test's to prove. It is proven
  by non-test validation kept to a minimum, which never alters the code or
  triggers a build (a validator script's own self-proof, run by a CI-gated
  task; [validation-strategy.md](validation-strategy.md) §Validators), or by
  an observation made once at cure time and recorded (§Right tool there).
  Existing code that breaks the invariant is a defect: it is cured by
  injection or moved to validation, never exempted, and its presence
  licenses nothing.
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
  an inspection of the queries it answered; (e) fixtures are sized to
  discriminate.
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
  or mutations, no `vi.stubGlobal`, no `vi.mock`, no `vi.doMock`, no
  `vi.useFakeTimers` or `vi.setSystemTime`.
  Product code must accept configuration, and a clock or scheduler, as
  parameters. See
  [`no-global-state-in-tests`][di]. For React components that fetch or derive async
  state, the DI seam that makes this holdable is the view-binder
  split — views take state as props, a two-line binder owns the
  hook, tests render the view with literal states, zero mocks
  (recorded in OCE as the `view-binder-di-seam` pattern).

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
  be able to change _how_ something works without breaking the test
  that proves _that_ it works.
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
  the rules above: a test proves observable behaviour _without
  constraining implementation_. Two corollaries (owner doctrine
  2026-06-26): hashing a source and pinning the hash is the
  antithesis — it pins bytes, proves no behaviour, fails loud on a
  harmless change; and the cure for a **content-quality invariant**
  (a firewall, e.g. "no curriculum data in this prose") is NOT a
  grep test but **construction plus human review**. A literal content
  pin is never admissible: the cure for a pinned value is a test of
  the mechanism that generates it, asserting relations to the inputs
  the test injects, so it is red only when the mechanism breaks and
  silent on upstream content drift. A value that carries a decision is
  recorded in its owning ADR and guaranteed by construction (one
  exported source) or by a validator, never by a test.
- **Pinning an absence is not proof** (owner doctrine 2026-08-19,
  verbatim: "tests should prove behaviour, not configuration, pinning
  a lack of something does not provide value"): an assertion that a
  field, property, or capability is ABSENT from a configuration or
  registration object (`not.toHaveProperty`, negative config pins)
  proves no behaviour and blocks the surface's deliberate evolution.
  A deliberate absence is recorded in the owning
  ADR or plan; where the absence has observable consequences, prove
  those consequences behaviourally through the public boundary.
  Negative-space tests that DRIVE the boundary and observe an
  outcome (a guard refusing an activation, an error path's observable
  result) are behaviour proofs, not absence pins — the discriminator
  is whether the test exercises behaviour or inspects configuration.
  (Trigger instance: an integration test pinning
  `not.toHaveProperty('outputSchema')` on a captured registration
  config.)
- **Counters and reported stats are configuration echoes** (owner,
  2026-08-13, mid-review: "you are still testing configuration, not
  behaviour"): a test asserting an exclusion counter, a stat field or the
  argument of a query the product made asserts what the configuration
  echoes back, not whether the restricted content flowed. The cure is a sentinel-content assertion
  through the public result (in OCE: the hidden lesson's keyword
  appears only when the switch admits it). The generator to watch is testing at the
  seam where the wiring is visible instead of the surface where the
  behaviour is observable.
- **Assert relations to injected inputs, never literals of our own
  configuration** (owner doctrine 2026-08-26, verbatim core: "tests
  are for proving product behaviour not configuration"): a design
  decision written as a literal cannot catch its own mistake — three
  PRM tests pinned `authorization_servers: [selfOrigin]` and so could
  never have caught the served-metadata lie that broke production,
  while the same invariant written as a RELATION to the injected
  upstream fixture ("the issuer a client holds equals the `iss` it
  will receive") discriminated, and its mutation checks bit exactly as
  enumerated (2026-09-01, MCP-655). Two corollaries: a cure with NO
  observable behaviour cannot have a behavioural test, and that
  absence is the sign to drop the cure or record it in the owning ADR
  with an owner-held proof; and a configuration property (a build
  tool's env passthrough, a package manager's default resolution) is
  proven by exercising its own boundary once at cure time and
  guaranteed by construction (declarative config, fail-fast hook,
  preflight probe) — never narrated as proven by a product suite
  passing over it. A behaviour the product gets from a helper it calls by
  default (a file write, in the instance) is proven by making the helper
  an injected seam and passing a fake that exposes a violation (a writer
  that truncates), never by asserting which helper is named (a seat's
  reading, 2026-09-13, of the owner's words as its handoff relays them:
  "proven by relation to the injected seam, not by asserting the helper's
  name"). §Prove the guard bites asks that a mutant of the guarded
  behaviour dies; it does not ask that our own configuration be pinned. A
  surviving mutant is a gap only when it changes behaviour at a boundary.
  One that changes a value of our own configuration and leaves every
  required result as it was (in the instances, a directory prefix and
  flags handed to git) survives because this rule is working; one that
  alters a required result (a status code, a retry limit) is a gap,
  however the value is written. Hold an assertion against this rule
  before adding it because a mutant survives, or restoring it because a
  sibling estate removed it (2026-10-01, two instances in one day).
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
- **KISS: a large fixture, an allowlist or a helper definition inside a
  test is a design smell** - logic a test carries as a fixture, an
  allowlist or a helper belongs in product code as the source of truth;
  relocate it there and let the test read it (owner preference,
  2026-03-08; graduated 2026-10-01 at the owner's card).
- **No skipped tests** - Fix it or delete it. Skipping mechanisms
  (`it.skip`, `describe.skip`, `test.todo`, `it.todo`, `xit`,
  `xdescribe`) are forbidden outright. A check that needs an external
  resource fails fast with a helpful error, never silently skips. Validation
  scripts requiring external resources are standalone scripts, not
  tests.
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
  and retained). The benchmark instrument's method is growth, never
  absolute time: time the same operation at two input sizes and compare
  the ratio (about two for a doubling when linear). A fast machine hides
  a quadratic behind a small constant: a 200 KB word took 1.4 s locally
  and 6.3 s on the runner, where the test timed out red (2026-09-10, in OCE,
  the Bash-guard matcher), and the two-size ratio would have shown it in ten
  seconds.

[no-cond]: ../rules/no-conditional-tests.md

- **No ambient global state access** - Tests MUST NOT read or mutate
  `process.env`, use `vi.stubGlobal`, `vi.mock` or `vi.doMock`, or
  replace the clock with `vi.useFakeTimers` or `vi.setSystemTime`. If a
  function needs configuration or the time, refactor it to accept the
  configuration, or a clock or scheduler, as a parameter. See
  [`no-global-state-in-tests`][di].
  A validation check's composition root (a smoke or E2E check's runner
  config, global setup or entry script) may read ambient env, validate
  it, and inject the result. Test files and other setup files must not read
  or mutate `process.env`.

[di]: ../rules/no-global-state-in-tests.md
[testing-patterns-value-proxies]: ../../docs/engineering/testing-patterns.md#acceptance-value-proxies

- **No process spawning in tests** - Test code MUST NOT
  spawn child processes, create test-authored workers, or
  instantiate tools that internally spawn processes (e.g.
  programmatic ESLint with TypeScript project service). This
  excludes vitest's own configured pool — the restriction is on
  what _test code_ does, not the runner. Process spawning creates
  handles that prevent clean worker exit, causes CI hangs, and
  violates the principle of using the right tool for the job. Use
  the right tool: ESLint for boundary enforcement, Playwright for
  browser testing, vitest for runtime logic.
  A child's stdio topology or exit and signal fidelity is real process
  IO; where no injection seam below it can carry the proof (a fake would
  model libuv engine semantics, the "double models the engine" trap), the
  proof is an observation made once at cure time and recorded, or a
  validator's self-proof outside the in-process test run (the
  `file-backed-stdio-for-spawned-gate-children` pattern describes the
  shape being proven). An existing suite that spawns is a defect under
  this rule, cured the same way.
  `test-immediate-fails.md` item 8 points here.

- **No reading the `.agent/` knowledge substrate in tests** - Tests MUST
  NOT read from `.agent/**/*` for any reason (owner doctrine 2026-06-22,
  absolute). That tree is shared, mutable, relocatable knowledge, not test
  fixtures, so a test that reads it is asserting configuration rather than
  proving behaviour (see "Assert effects, not constants") and goes stale
  when the substrate moves. Worked instance: a gap-ledger test
  `readFileSync`-ed a plan JSON, asserted its `statuses` and finding
  tuples, and silently broke when a plan-estate relocation moved the file.
  If product code resolves `.agent/` paths, exercise it against an
  injected file view, never a temporary directory and never the live
  tree.

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
behaviour was tested); the mutation check exposes them identically. A mutant that leaves a syntax error is killed by the parser, not by
the claim: replace a removed statement with a no-op (`:` in shell, `void 0` in
TypeScript) so the mutant fails on the claim itself (2026-09-25).

Two guard shapes that read as biting and do not. **A poll on an absence
passes before the event lands**: `expect.poll` returns on its first pass,
so "the stale marker is absent" was true BEFORE the held response resolved
and the test could not fail on its own bug; regression guards wait on a
POSITIVE post-event signal (the stale link's REMOVAL), and the calibration
is red-proof — revert the cure in place, rebuild, watch the exact assertion
time out, restore byte-identical (2026-08-18). **A repro must fail for the
RIGHT reason**: a crash-window fixture that crashed at the pre-read was
green by accident; the cure landed the failure inside the true window and
pinned the matcher to the window's own signature (`EACCES` at the queue
path) so a too-early failure cannot green it vacuously (2026-08-18). **A
cell red on both sides of a cure proves nothing**: a guard's calibration
evidence is void unless the cell is GREEN on the cured state first and red
exactly on the revert — a second instance the same sitting passed with both
cure arms reverted because `once` had already cleared the fired listeners
(2026-08-19).

### Test doubles model the boundary, never the engine

A fake that models a vendor SDK's INTERNALS is wrong twice over: it encodes
guesses about the engine (wrong twice in two rounds on PR #618), and its
green proves conformance to the guess, not the behaviour. Fakes assert only
the handler's own observable behaviour at its boundary; composition with
the real engine is proven by a validation check against the real SDK. Related trap: an
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
- System: a complete running system driven over its protocol channel; the
  host names its systems and their channels (P11; §This host's bindings).
  Systems have E2E checks (validation, not tests; see §Out-of-process
  checks).

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
  within the test process. They trigger NO IO, have NO side effects
  outside the test process, and can contain SIMPLE fakes which must
  be injected as arguments to the function under test. Integration
  tests are automatically run in CI/CD. **Important**: Integration
  tests are NOT about testing a deployed or running system - they test
  how multiple code units integrate when imported and called directly.
  An HTTP surface is exercised below the listener, at a handler or
  middleware function called directly with request and response values:
  a loopback socket is IO, whatever tool opens it. Every upstream
  dependency is an injected simple fake.

#### Out-of-process checks

Out-of-process checks validate a running _system_: the check and the
system run in _separate processes_. Driving a system over a protocol
channel, booting a built artefact, opening a socket, reading a
filesystem: each is IO, so an out-of-process check is not a test and
never lives in the in-process test run. It is a **validation surface**
([validation-strategy.md](validation-strategy.md)): a validator script
with its own minimal self-proof, reachable from a CI-gated task, or an
observation recorded once. They are slower and less specific in the
causes of issues, and cast a wider net. The scope words stay, because
the questions they name stay:

- **E2E check**: proves a running system's behaviour over its protocol
  channel (stdio for a CLI, HTTP for a server, the browser for a UI; the
  host's systems are in §This host's bindings, P11). It drives the system
  and asserts on the response; it never
  manipulates the surrounding environment, and only its harness boots
  the system. Classification follows the **boundary, not the tool** (owner,
  2026-07-29): "It depends on if it is calling a black box running
  system over a network interface (E2E), or if it is importing code
  and running it inside the test (integration)." A harness driving a
  separately running system is an E2E check; code imported into the
  test process is under the integration rule above, whatever its
  filename says — see
  [`testing-patterns.md` §Test File
  Classification](../../docs/engineering/testing-patterns.md#test-file-classification).
  A file named as an E2E check that imports product code and runs it
  in the test process is an integration test under the wrong name
  (`test-immediate-fails` item 20), whatever its suffix or directory.

- **Smoke check**: proves the SHIPPED FORM of a system is viable — the
  built artefact, invoked exactly as production invokes it (plain
  `node dist/...`, the installed binary, the deployed URL), never
  source through a test-runner loader. Minimum behaviour scope,
  maximum execution-surface fidelity. A smoke check is a validator,
  never a test. Full definition, the per-artefact-class minimum
  truth-sets, and the new-binary requirement:
  [§Smoke Checks — Artefact Viability](#smoke-checks--artefact-viability).

#### Common Misconception: Integration Tests

**WRONG Understanding (Common but Incorrect):**

```typescript
// ❌ This is NOT an integration test - it drives a running system, so
// it is an E2E check, and as a test it is an error (network IO)
describe("API Integration Test", () => {
  it("should call the deployed API", async () => {
    const response = await fetch("http://localhost:3000/api/users");
    // Testing a RUNNING SYSTEM over HTTP
  });
});
```

**CORRECT Understanding (Our Definition):**

```typescript
// ✅ This IS an integration test - testing code units working together
import { UserService } from "./user-service";
import { DatabaseAdapter } from "./database-adapter";

describe("UserService Integration Test", () => {
  it("should retrieve users through the adapter", () => {
    const mockDb = { query: () => [{ id: 1, name: "Alice" }] };
    const adapter = new DatabaseAdapter(mockDb); // Simple mock injected
    const service = new UserService(adapter);

    const users = service.getAllUsers();
    // Testing how CODE UNITS integrate, not a running system
    expect(users).toHaveLength(1);
  });
});
```

The key distinction: Integration tests import and test code
directly. They never spawn processes, open sockets, test deployed
systems, or exchange with any running system; no network-shaped
exchange is permitted, loopback included (§Test Types).

### Stubs vs Fakes

- **Runtime stubs**: plain functions that live in product code and are used when
  product code runs in a stub mode. They return canned data and have no test
  framework dependency.
- **Test fakes**: simple functions or objects that live in `test-helpers/`
  directories and are used only in tests. They stand in for a dependency so
  the code under test can run. What the product sends through an output port
  (a sink, writer or emitter) is its output: the port's fake keeps a record,
  and the test reads that record as a value, as the port's receiver would.
  Messages the port's contract makes separate are read with their count and
  order; a byte or text stream is read as its joined content, because how
  many writes carry it is buffering. What the product asks of an input port
  (a collaborator it queries) is never asserted: which queries it made, how
  often or in what order is implementation (§Philosophy). A collaborator
  that both answers queries and receives output (a store with get and put)
  is judged per operation: what it receives is output, and the queries it
  answers are never asserted. Across ports, the order in which the
  product reaches them is never itself the claim. Where an
  outcome depends on one port not being reached before another decides (a
  refusal that must mint nothing), the proof is the outcome: give the
  port that must not be reached a fake that fails, so that reaching it
  turns the refusal into a failure the test reads at the boundary; a call
  count is never the proof. A property no admissible fake can observe (one
  token for every attempt) is not a test's to prove: the structure
  carries it, a type or the place of a call (a seat's observation,
  2026-09-29; one instance).

Do not conflate the two. Runtime stubs are product code; test fakes are test
infrastructure.

### Smoke Checks — Artefact Viability

Smoke checks are validators, never tests: booting an artefact is
process and filesystem IO. The files and directories still named
"smoke tests" are history; each is run by a CI-gated task, never by the
test runner's in-process suites. As validators they start the fewest
processes, never alter the code and never build: a smoke reads the artefact
a separate step built ([validation-strategy.md](validation-strategy.md)
§Validators).

The taxonomy above classifies by SCOPE of behaviour (unit →
integration → E2E). There is a second, orthogonal axis: EXECUTION
SURFACE. Scope-axis tests and checks typically execute source through a
loader-assisted harness (vitest, tsx) while production executes built
artefacts under plain `node` — and nothing at any scope level REQUIRES
surface fidelity. An E2E check MAY boot the built artefact (jimcresswell.net's
Playwright suite runs against the production build its `e2e:server` script
builds and serves, and OCE's CLI contract E2E booted its built binary), but
that coverage is incidental to its scope classification.
Smoke checks own the surface axis and make artefact fidelity MANDATORY:
minimum behaviour scope, maximum surface fidelity. Defects that exist
only in the built form — extensionless ESM import specifiers in
`dist`, lost executable bits, files missing from the build output,
broken package `exports` maps — evade any suite that happens to run
source. Worked instance: the 2026-07-21 agent-tools outage, where the
dist CLI was cold-start broken for a day under green CI ("the surface
that validates is not the surface that executes").

**Invariant: EVERY built binary carries at least one smoke check** that
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
scope-axis tests or checks under this definition are reclassified into
the scope taxonomy with their docs and runner config.

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
  no-wall-clock rule applies to smoke checks unchanged. Harness
  timeouts are mechanics, not assertions.
- Smoke files live in the workspace's `smoke-tests/` directory (the
  name is history), and each MUST be reachable from a script that a
  CI-gated task runs (a local-only smoke check re-opens the exact gap
  this section closes).
  The check↔CI parity validator keeps the aggregate honest; wiring
  each smoke into a CI-run task is the author's obligation at landing
  time. The binding invariant is REACHABILITY: a smoke file matches
  the glob its workspace's live runner actually executes — an
  unreachable smoke check is the defect, not a variant. One canonical
  suffix governs once the estate-wide unification (part of the
  retrofit obligation above) converges; adopting it workspace-by-
  workspace is done by changing the runner glob and the files in one
  landing, never by authoring a file the current glob cannot see.
- Smoke checks exercise the artefact boundary, not features: feature
  behaviour belongs to the scope axis (unit/integration/E2E). A smoke
  check that grows feature assertions is misfiled — move the assertions
  down the taxonomy.

### Design Approaches

- Test Driven Development (TDD): Write tests before writing code
  at ALL levels. Tests PROVE correctness and specify desired
  behaviour.
- Behaviour Driven Development (BDD): Write integration tests and
  E2E checks before writing code. They PROVE we are creating the
  **desired behaviour and impact** at the integration point and
  system level.

## TDD at All Levels

TDD applies to unit tests, integration tests and E2E checks. An E2E
check is a validation surface, not a test (§Out-of-process checks);
the cycle discipline applies to it unchanged, so "test" in this section
reads "test or check" at the E2E level. Each level describes its own
scope of behaviour, and we need a description at every level to fully
describe the working system that delivers value:

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

A test file's opening comment names which surface each of its tests proves (the source, the
configuration, the rendered adapter), so a reader knows what a green run certifies (2026-10-03).

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
- HTTP E2E checks use the HTTP E2E driver the host declares (P9), only
  against a separately running system; an integration test calls the
  handler below the listener and opens no socket (see §Test Types)
- Use Playwright for UI E2E checks
- Protocol E2E checks use the protocol client the host declares (P9)
- Use the canonical mocking approaches for the testing tools in use for a given test
- Tests live next to the code they test, not in a `test` directory
  - Unit tests live next to the pure function file containing the
    functions they test. They MUST end in `*.unit.test.ts`
  - Integration tests live next to the integration point file
    containing the integration points they test. They MUST end in
    `*.integration.test.ts`
  - E2E checks live apart from product code, because they drive a
    running _system_ rather than importing it. Protocol and CLI E2E
    checks (Vitest) live in the workspace's `e2e-tests/` directory,
    named `*.e2e.test.ts` and run by the workspace's `test:e2e`. UI
    and HTTP E2E checks (Playwright) live in the directory the
    workspace's Playwright config names as its `testDir`, named as its
    `testMatch` states and run by the Playwright scripts that
    workspace's `package.json` names (the host's values: P12, §This
    host's bindings). Either way a check is reachable from a CI-gated task,
    because a check that nothing runs is the worse defect (the
    reachability rule of §Smoke Checks)

## When Behaviour Changes

**Rule**: Update tests at the SAME level as the behaviour change
FIRST, before changing implementation — within the same landing.

- **Pure function behaviour changes**: update unit tests, then
  product code that makes them pass, in one commit
- **Integration behaviour changes**: update integration tests,
  then the wiring/code that makes them pass, in one commit
- **System behaviour changes**: update E2E checks, then the
  product code that makes them pass, in one commit (or, if the
  E2E check requires several lower-level changes first, sequence
  the lower-level test+code commits and finish with the
  E2E-check+wiring commit that turns the E2E check green)

**Example** (single landing):

- A protected endpoint should return a new status for a
  system-level condition
- In one commit: update the E2E check specifying the new status,
  add the product code that makes it pass, and refactor
  internals as needed. The commit ends with all tests green.

**Example** (multi-landing for broader behaviour):

- An E2E check requires a new SDK function, a new request
  middleware, and a new response shape
- Commit 1: unit test for the SDK function + the function itself
- Commit 2: integration test for the middleware + the middleware
- Commit 3: E2E check specifying the new behaviour + the response
  shape change that wires it together; the E2E check goes green
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
patterns. Deviations cause silent test-category leaks (E2E checks
running under `pnpm test`, CI timeouts that don't reproduce
locally).

- **Pattern 1 (preferred)**: Import and re-export
  `baseTestConfig` from the workspace-config package's `vitest` export
  (P2; a declared `workspace:*` devDependency — never a relative path
  out of the workspace).
- **Pattern 2 (custom)**: Define a workspace-specific config.
  Non-negotiable: `exclude` MUST contain `'**/*.e2e.test.ts'`.
  `include` SHOULD use explicit conventions (`*.unit.test.ts`,
  `*.integration.test.ts`) not broad `*.test.ts` globs.

Workspaces with `*.e2e.test.ts` files MUST also have
`vitest.e2e.config.ts` (extending `baseE2EConfig` from
the workspace-config package's `vitest-e2e` export (P2), or
workspace-specific) and a `test:e2e` script in `package.json`. A file they govern that drives a separately
running system is an E2E check (§Out-of-process checks); one that
imports product code and runs it in the test process is an integration
test under the wrong name
(`test-immediate-fails` item 20). The `exclude` keeps them out of the
in-process test run, which admits no IO.

## Test Assertion Placement

Keep E2E check assertions on system/transport invariants; prove runtime
stub semantics in the owning workspace's unit/integration tests, not
by asserting server output against the same stub path.

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
port the harness's own server process binds and keeps for its whole life,
serving the build from that socket, so no server this run did not start is
ever proved; jimcresswell.net's site config, 2026-09-13, starts that process from
global setup and hands its origin to the workers through the runner's own
environment, read there only as the runner's internal handshake channel, so
the environment never sets the harness's port or origin from outside); a
UI-test webServer
inheriting `.env.local` refused a valid sink configuration (cure: the
webServer pins its own observability env).
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

See the accessibility practice document the host declares (§This host's
bindings).

## This host's bindings

The values the shared text above names by parameter, for this host (OCE).
The sibling estate's copy of this file carries its own section here;
everything above it is the same text in both.

- **P9, the test tooling set**: HTTP E2E checks use Supertest, only against
  a separately running system; MCP protocol E2E checks use the MCP client
  SDK; no rendering-proof harness is declared.
- **P10, the mutation instrument**: Stryker, wired through the root `mutate`
  turbo task, with a backlog rollout plan.
- **P11, the systems under test**: the MCP server over stdio or HTTP; a UI
  in the browser. Integration tests include MCP protocol compliance testing
  over in-process calls. An HTTP harness exercises the HTTP/JSON-RPC exchange
  but not SSE transport serialisation; keep MCP-client-SDK E2E checks
  alongside it for transport fidelity.
- **P12, E2E and smoke locations**: each workspace's `e2e-tests/` directory
  with `*.e2e.test.ts` (Vitest, run by the workspace's `test:e2e`);
  Playwright `*.spec.ts` under the config's `testDir`; smoke files under
  `smoke-tests/`.
- **Accessibility practice**:
  [`docs/governance/accessibility-practice.md`](../../docs/governance/accessibility-practice.md).
  For MCP App HTML resources: serve content directly to Playwright
  (resource-level a11y), then verify via basic-host (integration-level);
  see ADR-147.
