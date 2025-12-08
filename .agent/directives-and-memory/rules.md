# Rules

All of these rules MUST be followed at all times.

## First Question

Always apply the first question; **Ask: could it be simpler without compromising quality?**

## Core Rules

### Cardinal Rule of This Repository

If the upstream OpenAPI schema changes, then running `pnpm type-gen` followed by a `pnpm build` MUST be sufficient to bring all workspaces into alignment with the new schema.

We achieve this by ensuring that ALL static data structures, types, type guards, Zod schemas, Zod validators, and other type related information MUST be generated at compile time ONLY, and so flow from the Open Curriculum OpenAPI schema in the SDK, and from there to the apps. In other words, ALL the heavy lifting MUST happen at type-generation time, i.e. when `pnpm type-gen` is run. All the libraries, all the apps, all the MCP servers are simple consumers, the complexity is in the SDK and ONLY in the type-generation process.

### Code Design and Architectural Principles

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to _prove it fails_), Green (run the test to prove it passes, _because product code exists now_), Refactor (improve the product code implementation, now that the _behaviour_ at the interface will remain proven by the test)
- **Keep it simple** - DRY, KISS, YAGNI, SOLID principles
- **NEVER create compatibility layers, no backwards compatibility** - replace old approaches with new approaches, never create compatibility layers, never prioritise backwards compatibility
- **Keep it strict** - don't invent optionality, don't add fallback options. We know exactly what is needed, and the proper functioning of the system depends on acknowledging and embracing those restrictions, and the valuing insights offered by the type system.
- **Pure functions first** - Use TDD to design (_test first_, red, green, refactor), no side effects, no I/O
- **Build up through scales** - Functions → Modules → Packages (`core`, `libs`, `apps`)
- **Clear boundaries at each scale** - Define boundaries between and within scales CLEARLY with index.ts files
- **Fail FAST** - Fail fast with helpful error messages, never silently.
- **Handle All Cases Explicitly** - Don't throw, use the result pattern `Result<T, E>`, handle all cases explicitly.
- **Document Everywhere** - ALL files, modules, functions, data structures, classes, constants, and type information MUST have exhaustive, comprehensive TSDoc annotations that can be compiled by `typedoc`. All public API surfaces MUST be documented with examples and usage patterns. All major engineering or architectural decisions MUST be documented with ADRs. All use cases, public APIs, CLIs, troubleshooting and other concerns must be covered in authored markdown documentation in the appropriate directories, default to the README.md for the current workspace. Observe progressive disclosure, starting with the most general information and working towards the most specific. DO NOT create summary documents of each piece of work.
- **Onboarding** - We must have a clear onboarding path for new developers and AI agents, from the root README.md, to detailed documentation in the appropriate directories, to specialised documentation in the docs/ directory, to TSDoc annotations and ADRs. Observe progressive disclosure, starting with the most general information and working towards the most specific.

### Refactoring

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to _prove it fails_), Green (run the test to prove it passes, _because product code exists now_), Refactor (improve the product code implementation, know that the _behaviour_ at the interface will remain proven by the test)
- **NEVER create compatibility layers** - replace old approaches with new approaches
- **Splitting long files** - If a file is too long, split it into smaller files defined by groupings of responsibility, but keep the boundaries and public API clear with index.ts files, using TDD.
- **Splitting long functions** - If a function is too long, split it into smaller, pure functions with a single responsibility, using TDD.
- **Reducing complexity in functions** - If a function is too complex, identify distinct responsibilities and split it into smaller, pure functions with a single responsibility, using TDD.
- **Removing unused code** - If a function is not used, delete it. If product code is only used in tests, delete it. If a file is not used, delete it. Delete dead code.
- **Version with git, not with names** - Fix files in place, or replace old approaches with new approaches, NEVER create parallel versions using naming. Incorrect example: `execute-tool-call.ts` and `execute-tool-call.v2.ts`, correct example: `execute-tool-call.ts` and `execute-tool-call.ts` with a git history showing the evolution of the file. Incorrect example: `execute-tool-call.ts` and `execute-tool-call-correct.ts`, correct example: `execute-tool-call.ts` and `execute-tool-call.ts` with a git history showing the evolution of the file.

### Tooling

Use the right tool for the job:

- **Turborepo** for monorepo operations
- **pnpm** for monorepo definitions and package management
- **Vitest** for testing **runtime logic**
- **Playwright** for testing **runtime UI**
- **TypeScript** for compiler time types
- **ESLint** for syntax correctness, code-style adherence, **architectural boundary adherence**
- **Prettier** for code-style adherence
- **Typedoc** for documentation generation
- **Sentry** for observability, see [docs/agent-guidance/sentry-guidance.md](../../docs/agent-guidance/sentry-guidance.md)

### Code Quality

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to _prove it fails_), Green (run the test to prove it passes, _because product code exists now_), Refactor (improve the product code implementation, know that the _behaviour_ at the interface will remain proven by the test)
- **NEVER disable checks** - Never disable any quality gates, never disable type checks, never disable any linting, never disable any formatting, never disable any tests, never disable Git hooks (`--no-verify`)
- **Never work around checks** - e.g. if a variable is unused, figure out why and fix it, delete the variable if it is not needed. Do not disable eslint or typescript. ALWAYS fix the root cause, never work around it.
- **Never prefix variables with an underscore** - This is a hack, AND IT DOES NOT WORK. Either use the variable, or delete it.
- **Quality gates** - Run ALL gates after changes: format → type-check → lint → test → build
- **No unused code** - If a function is not used, delete it. If product code is only used in tests, delete it. If a file is not used, delete it. Delete dead code.

### Compiler Time Types and Runtime Validation

- **No type shortcuts** - Never use `as`, `any`, `!`, or `Record<string, unknown>`, or `{ [key: string]: unknown }`, or `Object.*` methods, or `Reflect.*` methods - they ALL disable the type system. The goal is to preserve type information as much as possible, not to work around this rule.
- **Preserve type information** - NEVER widen types by assigning to broader types like `string` or `number`. If you have a literal type `'/api/path'`, keep it as that literal, don't accept it as `string`. Type information flows from data structures with `as const` through to usage. Every `: string` or `: number` parameter destroys type information irreversibly
- **Single source of truth for types** - Define types ONCE, and import them consistently
- **Use library types directly where possible** - don't make up a type when you can use a library type
- **Validate external signals** - parse and/or validate external signals (e.g. API responses, read from files, etc), official SDKs count as validation, use Zod where appropriate
- **Type imports must be labelled with `type`** - e.g. `import type { Type } from 'package'` or `import { type Type } from 'package'`
- **Don't use type aliases, use good naming** Don't use type aliases, use good naming.

### Testing

For further information, see the [Testing Strategy](testing-strategy.md).

#### Test Types

Tests prove the correctness of runtime logic. If you want to validate types, use TypeScript, if you want to validate architectural structure, use ESLint.

- **In-process tests**: Tests that validate **code imported into the test process**. The code under test runs in the same process as the test runner. They are fast, specific, and do not produce side effects. These tests are about testing CODE, not testing RUNNING SYSTEMS.
  - **Unit test**: A test that verifies the behaviour of a single PURE function in isolation. Unit tests DO NOT trigger IO, have NO side effects, and contain NO MOCKS. Unit tests are automatically run in CI/CD. Must be named `*.unit.test.ts`.
  - **Integration test**: A test that verifies the behaviour of a collection of units **working together as code**, NOT a running system. Integration tests still import and test code directly within the test process. They DO NOT trigger IO, have NO side effects and can contain SIMPLE mocks which must be injected as arguments to the function under test. Integration tests are automatically run in CI/CD and include MCP protocol compliance testing. Must be named `*.integration.test.ts`. **Important**: Integration tests are NOT about testing a deployed or running system - they test how multiple code units integrate when imported and called directly.
- **Out-of-process tests**: Tests that validate a running _system_, the tests and the system run in _separate processes_. They are slower, are less specific in the causes of issues but cast a wider net, and may produce side effects locally and in external systems.
  - **E2E test**: A test that verifies the behaviour of a running system. E2E tests DO trigger IO, have side effects, and DO NOT contain mocks in many cases. E2E tests are NOT automatically run, because they produce side effects, and because they can induce costs. Must be named `*.e2e.test.ts`.

#### Universal Testing Rules

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to _prove it fails_), Green (run the test to prove it passes, _because product code exists now_), Refactor (improve the product code implementation, know that the _behaviour_ at the interface will remain proven by the test)
- **Test real behaviour, not implementation details** - We should be able to change _how_ something works without breaking the test that proves _that_ it works.
- **Test to interfaces, not internals** - Tests should be written to the interfaces, not the internals. Closely related to test behaviour not implementation.
- **No useless tests** - Each test must prove something useful about the product code. If a test is only testing the test or mocks, delete it.
- **Do not test types** - Tests are for logic, types are explored through creating tests, but types cannot be tested. If test only tests types, delete it.
- **KISS: No complex logic in tests** - Complexity in tests is a signal that we need to step back and simplify, the code and the test.
- **KISS: No complex mocks** - Mocks should be simple and focused, no complex logic in mocks, or we risk testing the mocks rather than the code. Complex mocks are a signal that we need to step back and simplify the code or our approach.
- **No skipped tests** - Fix it or delete it

### Developer Experience

- **No skipped tests** - Fix it or delete it
- **No commented out code** - Fix it or delete it
- **No dead code** - Delete it
- **Inline docs everywhere** - ALL files, modules, functions, data structures, classes, constants, and type information MUST have inline jsdoc/tsdoc comments that can be compiled by `typedoc` to generate documentation.

### Architectural Model

Use conventional monorepo structure in active code and docs:

- `apps/` – MCP servers and app wiring
- `packages/core/` – pure abstractions and shared types with minimal dependencies
- `packages/libs/` – runtime-adaptive libraries

Architectural boundaries are enforced by custom ESLint rules in `eslint-rules/`.
