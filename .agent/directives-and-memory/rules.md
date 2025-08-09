# Rules

All of these rules MUST be followed at all times.

## Prime Directive

**Ask: could it be simpler without compromising quality?**

## Core Rules

### Design & Development

- **Keep it simple** - DRY, KISS, YAGNI, SOLID principles
- **Never create compatibility layers** - replace old approaches with new approaches
- **Pure functions first** - Use TDD to design, no side effects, no I/O (these are your "organelles")
- **Build up through scales** - Functions → Modules (cells) → Chorai/Organa
- **Clear boundaries at each scale** - Use barrel files (index.ts) as public APIs for modules
- **Never disable checks** - Never disable any quality gates, never disable any linting, never disable any formatting, never disable any tests
- **Never work around checks** - e.g. if a variable is unused, figure out why and fix it, delete the variable if it is not needed. Do not disable eslint or typescript, do not attempt to prefix the variable with an underscore. ALWAYS fix the root cause, never work around it.
- **Fail FAST** - Fail fast and hard with helpful errors, never silently
- **Quality gates** - Run ALL gates after changes: format → type-check → lint → test → build
- **No unused code** - If a function is not used, delete it. If product code is only used in tests, delete it. If a file is not used, delete it. Delete dead code.

### Types and Validation

- **No type shortcuts** - Never use `as`, `any`, `!`, or type assertions
- **Single source of truth for types** - Define types ONCE, and import them consistently
- **Use library types directly where possible** - don't make up a type when you can use a library type
- **Validate external signals** - parse and/or validate external signals (e.g. API responses, read from files, etc), official SDKs count as validation, use Zod where appropriate
- **Type imports must be labelled with `type`** - e.g. `import type { Type } from 'package'` or `import { type Type } from 'package'`

### Testing

#### Test Types

- **In-process tests**: Tests that validate code imported into the test process. They are fast, specific, and do not produce side effects.
  - **Unit test**: A test that verifies the behaviour of a single PURE function in isolation. Unit tests DO NOT trigger IO, have NO side effects, and contain NO MOCKS. Unit tests are automatically run in CI/CD.
  - **Integration test**: A test that verifies the behaviour of a collection of units. Integration tests DO NOT trigger IO, have NO side effects and can contain SIMPLE mocks which must be injected as arguments to the function under test. Integration tests are automatically run in CI/CD and include MCP protocol compliance testing.
- **Out-of-process tests**: Tests that validate a running *system*, the tests and the system run in *separate processes*. They are slower, are less specific in the causes of issues but cast a wider net, and may produce side effects locally and in external systems.
  - **E2E test**: A test that verifies the behaviour of a running system. E2E tests DO trigger IO, have side effects, and DO NOT contain mocks in many cases. E2E tests are NOT automatically run, because they produce side effects, and because they can induce costs.

#### Workspace-Level Testing

- **Moria (pure abstractions)**: Unit tests only, no mocks, no I/O, test files named `*.test.ts`
- **Histoi (adaptive tissues)**: Unit tests for pure logic, integration tests for runtime adaptation
- **Psycha (complete apps)**: Integration tests for assembly, E2E tests for full behavior

#### Psychon-Level Testing

- **Pure functions (organelles)**: Unit test with no mocks, no side effects, no I/O
- **Module integration (cells)**: Test with simple injected mocks, verify membrane behaviour
- **System integration (chorai/organa)**: Test component interactions with mocked boundaries
- **Real I/O**: Only in E2E tests

#### Universal Testing Rules

- **Each test proves ONE thing** - No duplicate proofs
- **No useless tests** - Each test must prove something useful about the product code. If a test is only testing the test or mocks, delete it.
- **KISS: No complex logic in tests** - Complexity in tests is a signal that we need to step back and simplify, the code and the test.
- **KISS: No complex mocks** - Mocks should be simple and focused, no complex logic in mocks, or we risk testing the mocks rather than the code. Complex mocks are a signal that we need to step back and simplify the code or our approach.
- **No skipped tests** - Fix it or delete it
- **TDD for Moria** - Write tests FIRST for all pure abstractions

### Biological Model Architecture

Think in biological scales at two levels:

#### Workspace-Level Architecture (Package Organization)

**Moria → Histoi → Psycha** - The three-tier ecosystem:

- **Moria (Molecules/Atoms)** = Pure abstractions with zero dependencies
  - Interfaces, types, pure algorithms
  - NO external dependencies, NO I/O
  - Example: `Logger` interface, `StorageProvider` interface
  
- **Histoi (Tissues/Matrices)** = Runtime-adaptive connective tissues
  - Bind organisms together, provide connectivity
  - Adapt to runtime environment (Node.js vs Edge vs Browser)
  - Example: Adaptive logger, adaptive storage
  
- **Psycha (Living Organisms)** = Complete applications
  - Compose moria abstractions + histoi tissues
  - Full MCP servers or other complete apps
  - Example: `oak-notion-mcp`, `github-mcp`

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

Think in biological scales within each psychon:

- **Chora/Stroma** = Structural matrix (types, contracts, schemas - compile-time only)
- **Pure functions** = Organelles (smallest units of functionality)
- **Modules** = Cells (self-contained units with clear membrane/interface)
- **Chora/Aither** = Divine flows (logging, events - pervasive runtime infrastructure)
- **Chora/Phaneron** = Visible manifestation (configuration - what appears)
- **Organa** = Discrete organs with specific functions (notion, mcp)
- **Psychon** = The ensouled whole (complete living application)
- **Multiple psycha** = Ecosystem (organisms interacting via contracts)

Key principles:

- **Stroma is foundational** - Types/contracts are the structural matrix everything follows
- **Chorai are pervasive** - Infrastructure fields flow through everything (aither for logs/events, phaneron for config)
- **Organa are discrete** - Business logic organs have clear boundaries, no cross-organ imports
- **Each module is a cell** - Has a membrane (index.ts), contains organelles (pure functions)
- **Inject dependencies** - Never import across organa, chorai flow everywhere
- **Events are multi-level** - Schemas (stroma) + Transport (aither) + Instances (runtime)
- **Warnings are insights** - Linter warnings reveal natural architectural boundaries

See [Biological Architecture Guide](../../docs/agent-guidance/architecture.md) for authoritative reference and [ADR-023](../../docs/architecture/architectural-decisions/023-moria-histoi-psycha-architecture.md) for the philosophical grounding.

**Mathematical Foundation**: These principles are grounded in complex systems theory (Meena et al., 2023; Scheffer et al., 2009) and validated across neuroscience, ecology, and machine learning. See [ADR-009](../../docs/architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md) for details.

Example structure:

```typescript
// src/organa/notion/search/index.ts - Cell membrane (public API)
export { createSearchService } from './factory';
export type { SearchService, SearchResult } from './types';

// src/organa/notion/search/transform.ts - Organelle (pure function)
export function transformResults(raw: RawData): SearchResult[] {
  // Pure transformation, no side effects
}

// src/organa/notion/search/factory.ts - Cell assembly
export function createSearchService(deps: Dependencies): SearchService {
  // Wire up the cell's internals
  return {
    search: async (query) => {
      const raw = await deps.client.search(query);
      return transformResults(raw); // Use organelle
    },
  };
}

// src/organa/notion/index.ts - Organ boundary (groups related cells)
export { createSearchService } from './search';
export { createQueryService } from './query';
export type { NotionServices } from './types';
```
