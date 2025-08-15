# Rules

All of these rules MUST be followed at all times.

## Prime Directive

**Ask: could it be simpler without compromising quality?**

## Core Rules

### Code Patterns and Architectural Principles

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to *prove it fails*), Green (run the test to prove it passes, *because product code exists now*), Refactor (improve the product code implementation, know that the *behaviour* at the interface will remain proven by the test)
- **Keep it simple** - DRY, KISS, YAGNI, SOLID principles
- **NEVER create compatibility layers** - replace old approaches with new approaches
- **Pure functions first** - Use TDD to design (*test first*, red, green, refactor), no side effects, no I/O (these are your "organelles")
- **Build up through scales** - Functions → Modules (cells) → Chorai/Organa
- **Clear boundaries at each scale** - Define boundaries between and within scales CLEARLY with index.ts files
- **Fail FAST** - Fail fast and hard with helpful errors, never silently
- **Inline docs everywhere** - ALL files, modules, functions, data structures, classes, constants, and type information MUST have inline jsdoc/tsdoc comments that can be compiled by `typedoc` to generate documentation.

See also [Biological Model Architecture](#biological-model-architecture) below.

### Refactoring

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to *prove it fails*), Green (run the test to prove it passes, *because product code exists now*), Refactor (improve the product code implementation, know that the *behaviour* at the interface will remain proven by the test)
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
- **TypeScript** for compiler time types
- **ESLint** for syntax correctness, code-style adherence, **architectural boundary adherence**
- **Prettier** for code-style adherence
- **Typedoc** for documentation generation

### Code Quality

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to *prove it fails*), Green (run the test to prove it passes, *because product code exists now*), Refactor (improve the product code implementation, know that the *behaviour* at the interface will remain proven by the test)
- **NEVER disable checks** - Never disable any quality gates, never disable type checks, never disable any linting, never disable any formatting, never disable any tests, never disable Git hooks (`--no-verify`)
- **Never work around checks** - e.g. if a variable is unused, figure out why and fix it, delete the variable if it is not needed. Do not disable eslint or typescript, do not attempt to prefix the variable with a `_`. ALWAYS fix the root cause, never work around it.
- **Quality gates** - Run ALL gates after changes: format → type-check → lint → test → build
- **No unused code** - If a function is not used, delete it. If product code is only used in tests, delete it. If a file is not used, delete it. Delete dead code.

### Compiler Time Types and Runtime Validation

- **No type shortcuts** - Never use `as`, `any`, `!`, or `Record<string, unknown>`, or `Object.*` methods, or `Reflect.*` methods - they ALL disable the type system
- **Preserve type information** - NEVER widen types by assigning to broader types like `string` or `number`. If you have a literal type `'/api/path'`, keep it as that literal, don't accept it as `string`. Type information flows from data structures with `as const` through to usage. Every `: string` or `: number` parameter destroys type information irreversibly
- **Single source of truth for types** - Define types ONCE, and import them consistently
- **Use library types directly where possible** - don't make up a type when you can use a library type
- **Validate external signals** - parse and/or validate external signals (e.g. API responses, read from files, etc), official SDKs count as validation, use Zod where appropriate
- **Type imports must be labelled with `type`** - e.g. `import type { Type } from 'package'` or `import { type Type } from 'package'`

### Testing

#### Test Types

Tests prove the correctness of runtime logic. If you want to validate types, use TypeScript, if you want to validate architectural structure, use ESLint.

- **In-process tests**: Tests that validate **code imported into the test process**. The code under test runs in the same process as the test runner. They are fast, specific, and do not produce side effects. These tests are about testing CODE, not testing RUNNING SYSTEMS.
  - **Unit test**: A test that verifies the behaviour of a single PURE function in isolation. Unit tests DO NOT trigger IO, have NO side effects, and contain NO MOCKS. Unit tests are automatically run in CI/CD. Must be named `*.unit.test.ts`.
  - **Integration test**: A test that verifies the behaviour of a collection of units **working together as code**, NOT a running system. Integration tests still import and test code directly within the test process. They DO NOT trigger IO, have NO side effects and can contain SIMPLE mocks which must be injected as arguments to the function under test. Integration tests are automatically run in CI/CD and include MCP protocol compliance testing. Must be named `*.integration.test.ts`. **Important**: Integration tests are NOT about testing a deployed or running system - they test how multiple code units integrate when imported and called directly.
- **Out-of-process tests**: Tests that validate a running *system*, the tests and the system run in *separate processes*. They are slower, are less specific in the causes of issues but cast a wider net, and may produce side effects locally and in external systems.
  - **E2E test**: A test that verifies the behaviour of a running system. E2E tests DO trigger IO, have side effects, and DO NOT contain mocks in many cases. E2E tests are NOT automatically run, because they produce side effects, and because they can induce costs. Must be named `*.e2e.test.ts`.

#### Universal Testing Rules

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (run the test to *prove it fails*), Green (run the test to prove it passes, *because product code exists now*), Refactor (improve the product code implementation, know that the *behaviour* at the interface will remain proven by the test)
- **Test real behaviour, not implementation details** - We should be able to change *how* something works without breaking the test that proves *that* it works.
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

### Biological Model Architecture

This applies to workspaces under `ecosystem/`, relative to the root of the repository. It does not apply to `packages/` which use traditional architectural patterns.

Think in biological scales at two levels, workspace (ecosystem) and psychon (organism).

Import patterns between categories are enforced by [ESLint Rules](../architecture/workspace-eslint-rules.md), but they can only do so much, we must be disciplined and follow the rules.

#### Workspace-Level Architecture (Ecosystem Package Organisation)

**Moria → Histoi → Psycha** - The three-tier ecosystem:

Key principles:

- **Moria has ZERO dependencies** - Not even TypeScript utility libraries
- **Histoi are transplantable** - Same tissue works across different organisms
- **Psycha compose, not inherit** - Pull in what they need from moria/histoi
- **No circular dependencies** - Strict hierarchy: Psycha → Histoi → Moria

Import rules:

- **Moria**: Cannot import ANYTHING external (zero dependencies)
- **Histoi**: Can import from Moria, cannot import from other Histoi or Psycha
- **Psycha**: Can import from Moria and Histoi, cannot import from other Psycha

#### Psychon-Level Architecture (Within Each Organism)

Key principles:

- **Stroma is foundational** - Types/contracts are the structural matrix everything follows
- **Chorai are pervasive** - Infrastructure fields flow through everything (aither for logs/events, phaneron for config)
- **Organa are discrete** - Business logic organs have clear boundaries, no cross-organ imports
- **Each module is a cell** - Has a membrane (index.ts), contains organelles (pure functions)
- **Inject dependencies** - Never import across organa, chorai flow everywhere
- **Events are multi-level** - Schemas (stroma) + Transport (aither) + Instances (runtime)

See [Architecture Guide](../../docs/agent-guidance/architecture.md) for authoritative reference and [ADR-023](../../docs/architecture/architectural-decisions/023-moria-histoi-psycha-architecture.md) for the philosophical grounding, and [ADR-009](../../docs/architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md) for the mathematical foundation -- these principles are grounded in complex systems theory and validated across neuroscience, ecology, and machine learning (Meena et al., 2023; Scheffer et al., 2009).
