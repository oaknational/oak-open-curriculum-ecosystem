---
fitness_line_target: 450
fitness_line_limit: 525
fitness_char_limit: 24000
fitness_line_length: 100
split_strategy: "This file is the source of truth for all principles. Extract only elaborated guidance to governance docs, never the principles themselves. The principles are operationalised through several mechanisms, including rules, sub-agents, and tooling."
---

# Principles

All of these principles MUST be followed at all times.

## First Question

Always apply the first question; **Ask: could it be simpler _without
compromising quality or value_?**. The answer will often be no, that is fine,
but bring real critical thinking to the question each time.

## Strict and Complete

**Strict and complete, everywhere, all the time.** Prefer explicit, strict,
total, fully checked systems over permissive, partial, or hand-wavy
ones. Do not invent optionality, fallback options, or implied
enforcement. Type precision is one of the clearest concrete
expressions of this tenet.

## Architectural Excellence Over Expediency

Always choose long-term architectural clarity over short-term
convenience. If a shortcut creates duplication across architectural
layers, it is not a shortcut — it is a debt that compounds silently.
Copying a function "because it's faster" creates two implementations
that drift apart. The cost of the drift is invisible until it
manifests as a real bug (wrong search results, inconsistent
behaviour, stale configuration). The correct response is always to
fix the boundary, not to duplicate across it.

## Owner Direction Beats Plan

Owner direction during a session beats the active plan. On conflict:
follow the direction, surface the conflict, update the plan at the
next safe checkpoint. Never silently ignore or abandon. Precedence
rule, not a licence to abandon planning discipline (PDR-018).

## Core Rules

### Cardinal Rule of This Repository

If the upstream OpenAPI schema changes, then running
`pnpm sdk-codegen` followed by a `pnpm build` MUST be sufficient to
bring all workspaces into alignment with the new schema.

We achieve this by ensuring that ALL static data structures, types,
type guards, Zod schemas, Zod validators, and other type related
information MUST be generated at compile time ONLY, and so flow from
the Open Curriculum OpenAPI schema in the SDK, and from there to the
apps. In other words, ALL the heavy lifting MUST happen at
sdk-codegen time, i.e. when `pnpm sdk-codegen` is run. All the
libraries, all the apps, all the MCP servers are simple consumers,
the complexity is in the SDK and ONLY in the code-generation process.
No ad-hoc types. If a type is missing, it is a generator bug — fix
the generator, not the consumer.

### Separate Framework from Consumer

Whenever we build something, clearly separate (a) a
purpose-specific, consumer-general framework from (b) the
Oak-specific consumer instance. The framework is the reusable
mechanism that solves a category of problem — usable by any
consumer. The consumer instance applies that framework to Oak's
domain and data. This separation must be visible in code structure:
different modules, directories, or packages. If general mechanism
and Oak-specific configuration are mixed in one module, split them.
The framework defines the contract; the consumer provides the
specifics. The test: "Could a non-Oak consumer use this component
unchanged?" If not, extract the Oak-specific parts.

### Decompose at the Tension

When code resists clean classification or forces compromise
labels ("lifecycle-neutral", "shared", "cross-cutting"), that
resistance reveals hidden coupling. The response is to decompose
at the fault line — separate the concerns being conflated — not
to classify around the compromise. A barrel re-export that exists
to make something "work" is a symptom; the cure is to eliminate
the coupling that made the barrel necessary. Each tension resolved
this way produces cleaner boundaries and simpler classification.

### Code Design and Architectural Principles

- **TDD** - ALWAYS use TDD at ALL levels — unit, integration, AND
  E2E. Write tests **FIRST**. Red (run the test to _prove it
  fails_), Green (run the test to prove it passes, _because
  product code exists now_), Refactor (improve the product code
  implementation, now that the _behaviour_ at the interface will
  remain proven by the test). If tests lag behind code at ANY
  level, TDD was not followed.
- **Keep it simple** - DRY, KISS, YAGNI, SOLID principles
- **NEVER create compatibility layers, no backwards
  compatibility** - replace old approaches with new approaches,
  never create compatibility layers, never prioritise backwards
  compatibility. When renaming, rename EVERYWHERE — interfaces,
  private functions, variable names, log keys, TSDoc. One concept
  = one name.
- **Keep it strict** - don't invent optionality, don't add fallback
  options. We know exactly what is needed, and the proper
  functioning of the system depends on acknowledging and embracing
  those restrictions, and the valuing insights offered by the type
  system.
- **Pure functions first** - Use TDD to design (_test first_, red,
  green, refactor), no side effects, no I/O
- **Consistent Naming** - Use consistent naming conventions for
  files, modules, functions, data structures, classes, constants,
  type information and CONCEPTS. For instance, if we use `keyStage`
  then that is the label, not `keyStageSlug` or `keyStageId`. If
  you need to add nuance, use TSDoc to provide context, links, and
  examples.
- **Semantic naming over mechanism naming** — Name modules and
  functions by WHY they exist, not HOW they work.
  `preserveSchemaExamplesInToolsList` over
  `overrideToolsListHandler`. The name should explain the removal
  condition.
- **Build up through scales** - Functions → Modules → Packages
  (`core`, `libs`, `apps`)
- **Clear boundaries at each scale** - Define boundaries between
  and within scales CLEARLY with index.ts files
- **Fail FAST** - Fail fast with helpful error messages, never
  silently. NEVER IGNORE ERRORS. Detect problems early (validate
  at entry points, not deep in the call stack), fail immediately
  (don't continue with invalid state), be specific (error messages
  must explain what went wrong and why), and guide resolution
  (where possible, indicate how to fix the problem).
  Anti-patterns: swallowing exceptions with empty catch blocks,
  logging errors but continuing execution, returning `null` or
  `undefined` to indicate failure, generic error messages
  ("An error occurred").
- **Handle All Cases Explicitly** - Don't throw, use the result
  pattern `Result<T, E>`, handle all cases explicitly.
- **Preserve the error cause chain** - Always preserve the error
  cause chain, don't lose information, don't lose context, don't
  lose the ability to debug the problem.
- **No empty catch blocks** - Never use empty catch blocks, always
  handle errors explicitly and using the `Result<T, E>` pattern.
- **Document Everywhere** - ALL files, modules, functions, data
  structures, classes, constants, and type information MUST have
  exhaustive, comprehensive TSDoc annotations that can be compiled
  by `typedoc`. All public API surfaces MUST be documented with
  examples and usage patterns. All major engineering or
  architectural decisions MUST be documented with ADRs. All use
  cases, public APIs, CLIs, troubleshooting and other concerns
  must be covered in authored markdown documentation in the
  appropriate directories, default to the README.md for the current
  workspace. Observe progressive disclosure, starting with the
  most general information and working towards the most specific.
  DO NOT create summary documents of each piece of work. **TSDoc
  syntax**: open every TSDoc block with a plain-language summary
  sentence (not a tag); put supporting detail in `@remarks`; only
  use tags supported by `tsdoc.json`; use `@packageDocumentation`
  for file-level docs (never `@module` or `@fileoverview`); escape
  literal braces as `\{` and `\}` for clean `tsdoc/syntax`; use
  TSDoc to explain intent and trade-offs, not to narrate obvious
  code.
- **Onboarding** - We must have a clear onboarding path for new
  developers and AI agents, from the root README.md, to detailed
  documentation in the appropriate directories, to specialised
  documentation in the docs/ directory, to TSDoc annotations and
  ADRs. Observe progressive disclosure, starting with the most
  general information and working towards the most specific.
- **No absolute paths** - The repo is used on many machines. ALL
  filesystem paths in the repo (documentation, plans, config,
  frontmatter, comments, example commands) MUST be relative:
  either relative to the repo root or relative to the file
  containing the path. NO absolute paths (e.g. `/Users/...`,
  `C:\...`). Absolute paths expose usernames and local directory
  structure and do not resolve for other contributors or in CI.
- **No symlinks** — Symlinks are forbidden. Structure workspaces
  properly and use the pnpm workspace dependency graph. Any
  discovered symlinks must be removed immediately as highest
  priority. Platform adapters (`.claude/`, `.cursor/`, `.agents/`)
  must be real files — thin pointers to canonical content — not
  symlinks. pnpm's own `node_modules` symlinks are managed by
  pnpm and are not in scope.
- **No shims, no hacks, no workarounds** — Do it properly or do
  something else. Never introduce shims, polyfills, compatibility
  wrappers, renamed globals, or any mechanism whose purpose is to
  make old code work with new contracts. Replace the old code. If
  the replacement is not ready, leave the old code disabled — do
  not bridge it.

### Refactoring

- **TDD** — see §Code Design above
- **NEVER create compatibility layers** - replace old approaches
  with new approaches
- **Don't extract single-consumer abstractions** — If a protocol
  has exactly one consumer, inline it. The test: "does anything
  else consume this?" If no, the extraction adds indirection and
  maintenance surface without value.
- **Splitting long files** - If a file exceeds 250 lines
  (`max-lines`), split it into smaller files defined by groupings
  of responsibility, keeping boundaries and public API clear with
  index.ts files, using TDD. Run lint after every substantive edit
  to catch violations early.
- **Splitting long functions** - If a function exceeds 50 lines
  (`max-lines-per-function`), split it into smaller, pure functions
  with a single responsibility, using TDD. Extract conditional
  phase dispatch, multi-branch logic, and accumulator loops into
  named helpers.
- **Reducing complexity in functions** - If a function is too
  complex, identify distinct responsibilities and split it into
  smaller, pure functions with a single responsibility, using TDD.
  ESLint counts `??` and `?.` as branches — five
  nullish-coalescing expressions in one function can breach the
  complexity limit.
- **Removing unused code** - If a function is not used, delete it.
  If product code is only used in tests, delete it. If a file is
  not used, delete it. Delete dead code.
- **Version with git, not with names** - Fix files in place, or
  replace old approaches with new approaches, NEVER create parallel
  versions using naming. Incorrect: `execute-tool-call.ts` and
  `execute-tool-call.v2.ts`. Correct: `execute-tool-call.ts` with
  a git history showing the evolution. Incorrect:
  `execute-tool-call.ts` and `execute-tool-call-correct.ts`.
  Correct: `execute-tool-call.ts` with a git history showing the
  evolution.

### Tooling

Use the right tool for the job:

- **Turborepo** for monorepo operations
- **pnpm** for monorepo definitions and package management
- **Vitest** for testing **runtime logic**
- **Playwright** for testing **runtime UI**
- **TypeScript** for compiler time types
- **ESLint** for syntax correctness, code-style adherence,
  **architectural boundary adherence**
- **Prettier** for code-style adherence
- **Typedoc** for documentation generation
- **Sentry** for observability (guidance archived to
  `docs/agent-guidance/archive/sentry-guidance.md`)

All workspace tooling configuration MUST follow the canonical
patterns defined in the base configs at the repo root. Workspace
configs extend base configs — they do not replace them. This applies
to `vitest.config.ts`, `tsconfig.json`, `eslint.config.ts`, and all
other tooling. Deviations cause silent quality-gate leaks (e.g. E2E
tests running under `pnpm test`, disabled lint rules, weakened
type-checking). See [Testing Strategy: Canonical Vitest
Configuration][vitest-config] for vitest-specific patterns. E2E
vitest configs may be workspace-specific when base defaults (include
paths, setup files) don't apply.

[vitest-config]: testing-strategy.md#canonical-vitest-configuration

### Code Quality

- **TDD** — see §Code Design above
- **NEVER disable checks** - Never disable any quality gates, never
  disable type checks, never disable any linting, never disable
  any formatting, never disable any tests, never disable Git hooks
  (`--no-verify`)
- **No warning toleration, anywhere** - Warnings are not deferrable
  in any system the repo influences (build, quality gates, runtime,
  monitoring). A warning is the cheap, early version of the failure
  it names. Fix the root cause in the same work-item, or escalate
  the warning to a hard error in the same commit. Acknowledged-and-
  deferred warnings consistently explode at the next stage. See
  `.agent/rules/no-warning-toleration.md` for the operational
  discipline (covers esbuild/tsc/ESLint/vitest/depcruise/knip and
  Sentry runtime/uptime surfaces).
- **Never work around checks** - e.g. if a variable is unused,
  figure out why and fix it, delete the variable if it is not
  needed. Do not disable eslint or typescript. ALWAYS fix the root
  cause, never work around it.
- **Fix things** - All quality gates are blocking at all times,
  regardless of location, cause, or context.
- **Never weaken a gate to solve a testing problem** - If a test
  needs content that a gate forbids (e.g. an `eslint-disable`
  comment to test the `no-eslint-disable` rule), solve via string
  construction, fixtures, or test infrastructure — never exempt the
  test from the gate. The purpose of hardening is strictness; any
  exemption undermines the gate for all future code.
- **Never prefix variables with an underscore** - This is a hack,
  AND IT DOES NOT WORK. Figure out why the variable is unused and
  fix the root cause. Either use the variable, or delete it.
- **Quality gates** - Run ALL gates after changes. The gate
  taxonomy has complementary layers, each catching a different
  class of defect:
  1. **Formatting** (`format`, `markdownlint`) — consistent style,
     no merge noise
  2. **Type correctness** (`type-check`) — compile-time type safety
  3. **Linting** (`lint`) — code patterns, import boundaries,
     architectural rules. Custom lint rules
     (`@oaknational/eslint-plugin-standards`) encode architectural
     decisions as enforceable checks — workspace boundary rules,
     layer-direction constraints, file-count limits per directory,
     and prohibited import patterns. These turn ADRs into
     automated enforcement.
  4. **Static analysis** (`knip`, `depcruise`) — unused
     code/exports/dependencies, circular dependencies, layer
     violations. These catch dead code and structural drift that
     linting and type-checking cannot see. Linting enforces _what
     you should do_; static analysis detects _what you forgot to
     clean up_.
  5. **Testing** (`test`, `test:widget`, `test:e2e`, `test:ui`, `smoke`) —
     behavioural correctness at all levels
  6. **Mutation testing** (`mutate`) — test suite effectiveness.
     Proves tests actually detect real faults, not just exercise
     code paths.
  7. **Build** (`build`) — production artefacts compile and bundle
     correctly
  8. **Specialist review** (sub-agents) — architectural compliance,
     security, documentation
  9. **Accessibility audit** (`test:a11y`) — WCAG 2.2 AA compliance
     for UI-shipping workspaces, zero-tolerance, both themes
- **No unused code** - If a function is not used, delete it. If
  product code is only used in tests, delete it. If a file is not
  used, delete it. Delete dead code. Static analysis tools (knip,
  dependency-cruiser) enforce this at scale.
- **Misleading docs are blocking** - Docs that misstate behaviour
  or point at retired surfaces are a quality-gate blocker. Missing
  docs prompt verification; misleading docs are trusted and acted
  on. Fix immediately — never defer, never TODO. Pairs with PDR-026
  §Landing target definition.

### Compiler Time Types and Runtime Validation

- **No type shortcuts** — never use `as`, `any`, `!`,
  `Record<string, unknown>`, `{ [key: string]: unknown }`,
  `Object.*` methods, `Reflect.*` methods, `isObject` type
  predicates, `z.unknown()` (where a concrete schema exists),
  `z.record(z.string(), z.unknown())`, or hand-crafted Zod
  schemas that duplicate generated shapes. They all disable the
  type system. Preserve type information; never widen. `as const`
  and `satisfies` are the only permitted exceptions — both are
  compile-time constraints that narrow without overriding. When
  using external libraries, prefer official library types and
  error classes over local `*Like` shapes.
- **`unknown` is type destruction** — `unknown`, `z.unknown()`,
  and `Record<string, unknown>` erase structural type information.
  **Permitted**: function parameter at an incoming external
  boundary from a third-party system (data genuinely has no known
  shape yet); `z.unknown()` only when the upstream schema
  genuinely declares no structure (e.g. polymorphic aggregation
  buckets from Elasticsearch). **Forbidden**: replacing a concrete
  type with `unknown` to avoid a type error; using `z.unknown()`
  where a concrete Zod schema exists or can be generated; using
  `z.record(z.string(), z.unknown())` as a stand-in for a known
  object shape; hand-crafting a Zod schema that approximates a
  generated shape. **The test**: if the type information exists
  anywhere in the pipeline — the OpenAPI spec, the generated
  types, a library's exported types — it MUST be preserved.
- **Preserve type information** — NEVER widen types by assigning to
  broader types like `string` or `number`. If you have a literal
  type `'/api/path'`, keep it as that literal, don't accept it as
  `string`. Type information flows from data structures with
  `as const` through to usage. Every `: string` or `: number`
  parameter destroys type information irreversibly.
- **Single source of truth for types** — define types ONCE,
  preferably from the API spec or an external library, and then do
  not allow them to widen. Never redefine them later as
  approximations.
- **Use library types directly where possible** — don't make up a
  type when you can use a library type.
- **Prefer library-native error and response types** — when parsing
  third-party SDK outputs (e.g. Elasticsearch), use official
  exported types/classes first; only introduce local shapes when
  the library does not expose what is needed.
- **Validate external signals** — parse and/or validate external
  signals (e.g. API responses, read from files, etc), official
  SDKs count as validation, use Zod where appropriate. See
  `.agent/rules/strict-validation-at-boundary.md`.
- **Type imports must be labelled with `type`** — e.g.
  `import type { Type } from 'package'` or
  `import { type Type } from 'package'`.
- **Don't use type aliases, use good naming** — type aliases are a
  source of entropy.
- **Reviewer findings are action items by default** — implement all
  reviewer findings unless explicitly rejected as incorrect with a
  written rationale.

### Testing

For further information, see the [Testing Strategy][testing] and
[ADR-078: Dependency Injection for Testability][di].

[testing]: testing-strategy.md
[di]: ../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md

#### Test Types

Tests prove the correctness of runtime logic. If you want to
validate types, use TypeScript, if you want to validate
architectural structure, use ESLint.

- **In-process tests**: Tests that validate **code imported into
  the test process**. The code under test runs in the same process
  as the test runner. They are fast, specific, and do not produce
  side effects. These tests are about testing CODE, not testing
  RUNNING SYSTEMS.
  - **Unit test**: A test that verifies the behaviour of a single
    PURE function in isolation. Unit tests DO NOT trigger IO,
    have NO side effects, and contain NO MOCKS. Unit tests are
    automatically run in CI/CD. Must be named `*.unit.test.ts`.
  - **Integration test**: A test that verifies the behaviour of a
    collection of units **working together as code**, NOT a
    running system. Integration tests still import and test code
    directly within the test process. They DO NOT trigger IO,
    have NO side effects and can contain SIMPLE mocks which must
    be injected as arguments to the function under test.
    Integration tests are automatically run in CI/CD and include
    MCP protocol compliance testing. Must be named
    `*.integration.test.ts`. **Important**: Integration tests are
    NOT about testing a deployed or running system - they test
    how multiple code units integrate when imported and called
    directly.
- **Out-of-process tests**: Tests that validate a running
  _system_, the tests and the system run in _separate processes_.
  They are slower, are less specific in the causes of issues but
  cast a wider net, and may produce side effects locally and in
  external systems.
  - **E2E test**: A test that verifies the behaviour of a running
    system. E2E tests DO trigger IO, have side effects, and DO
    NOT contain mocks in many cases. E2E tests are NOT
    automatically run, because they produce side effects, and
    because they can induce costs. Must be named
    `*.e2e.test.ts`.

#### Dependency Injection for Testability

**Environment variables MUST be read once at the entry point**,
then passed as configuration through the call stack. Product code
MUST NOT read `process.env` directly—it must accept configuration
as parameters.

**Prohibited in ALL tests (unit, integration, AND E2E)**:

- `process.env.X = 'value'` - mutates global state, causes race
  conditions
- `vi.stubGlobal('fetch', ...)` - mutates global objects
- `vi.mock('module', ...)` - manipulates module cache at the
  module level, leaks between test files
- `vi.doMock('module', ...)` - manipulates module cache, subtle
  race conditions

**Required pattern**: Pass configuration as explicit function
parameters. Simple fakes injected as constructor arguments, not
complex mocks.

#### Universal Testing Rules

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests.
  Write tests **FIRST**. Red (run the test to _prove it fails_),
  Green (run the test to prove it passes, _because product code
  exists now_), Refactor (improve the product code implementation,
  know that the _behaviour_ at the interface will remain proven by
  the test)
- **Test real behaviour, not implementation details** - We should
  be able to change _how_ something works without breaking the
  test that proves _that_ it works.
- **Test to interfaces, not internals** - Tests should be written
  to the interfaces, not the internals. Closely related to test
  behaviour not implementation.
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
- **No skipped tests** - Fix it or delete it
- **Dead tests are worse than no tests** — If a test file naming
  convention excludes it from the test runner's include pattern,
  it creates false confidence. Always verify new naming conventions
  against the vitest config.
- **Assert effects, not constants** — Test observable product
  behaviour through the interface, not the value of internal
  constants. "At least one tool has property X" survives
  refactoring; `TOOL_SET.size > 0` tests configuration.
- **No process spawning in in-process tests** - Test code MUST NOT
  spawn child processes, create test-authored workers, or
  instantiate tools that internally spawn processes (e.g.
  programmatic ESLint with TypeScript project service). Use the
  right tool: ESLint for boundary enforcement, Playwright for
  browser testing, vitest for runtime logic.

### Developer Experience

- **No commented out code** - Fix it or delete it
- **Inline docs everywhere** - ALL files, modules, functions, data
  structures, classes, constants, and type information MUST have
  inline jsdoc/tsdoc comments that can be compiled by `typedoc`
  to generate documentation.

### Architectural Model

Use conventional monorepo structure in active code and docs:

- `apps/` – runnable apps that provide services to users
- `packages/sdks/` – SDKs (Curriculum SDK, Search SDK, SDK Codegen)
- `packages/core/` – shared low-level code (ESLint plugin,
  type-helpers, result, env schemas)
- `packages/libs/` – shared libraries (logger, env-resolution)

See [AGENT.md](./AGENT.md#structure) for the full package listing.
Architectural boundaries are enforced by custom ESLint rules.

### Layer Role Topology

Apps are **thin user interfaces**. SDKs and libraries own **all
domain-specific logic and mechanisms**. Apps compose SDK capabilities
through their public API surfaces; apps NEVER reimplement domain
logic that an SDK already provides.

Concretely:

- **SDKs own**: query shapes (retrievers, filters, highlights),
  query processing (noise removal, phrase detection), score
  processing (normalisation, filtering), field inventories, data
  contracts, and type definitions. If two consumers would need the
  same logic, it belongs in an SDK.
- **Apps own**: CLI commands, request assembly (combining SDK-built
  retrievers with app-specific index resolution and pagination),
  operational tooling (ingestion, admin commands), and user-facing
  presentation. These are integration concerns, not domain logic.
- **The test**: "Could another app need this?" If yes, it belongs
  in a package, not an app. If an app contains domain logic that
  duplicates an SDK, that is a boundary violation — collapse it by
  importing from the SDK.

This is not aspirational; it is a structural constraint. Violations
cause silent drift: the SDK gets tuned but the app's copy does not,
producing different behaviour for the same input.
