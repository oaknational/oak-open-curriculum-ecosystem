# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow the instructions.

Read the [metacognitive prompt](./metacognition.md) and follow the instructions. Now read this document again; what has changed, why? Would you like to update your todo list?

## Prime Directive

**Ask: could it be simpler without compromising quality?**

## Core Rules

### Design & Development

- **Keep it simple** - DRY, KISS, YAGNI, SOLID principles
- **Never create compatibility layers** - replace old approaches with new approaches
- **Pure functions first** - Use TDD to design, no side effects, no I/O (these are your "organelles")
- **Build up through scales** - Functions → Modules (cells) → Systems (tissues/organs)
- **Clear boundaries at each scale** - Use barrel files (index.ts) as public APIs for modules
- **No shortcuts** - Never use `as`, `any`, `!`, or type assertions
- **Single source of truth** - Define types ONCE, use library types directly
- **Fail properly** - Fail fast and hard with helpful errors, never silently
- **Quality gates** - Run ALL gates after changes: format → type-check → lint → test → build
- **validate external signals** - parse and/or validate external signals (e.g. API responses, read from files, etc), official SDKs count as validation

### Architecture (Complete Biological Model)

Think in biological scales:

- **Substrate** = The physics/chemistry (types, contracts, schemas - compile-time only)
- **Pure functions** = Organelles (smallest units of functionality)
- **Modules** = Cells (self-contained units with clear membrane/interface)
- **Related modules** = Tissues (groups working together in a domain)
- **Infrastructure** = Systems (pervasive, like nervous/circulatory systems)
- **Business logic** = Organs (discrete, like heart/liver)
- **Application** = Organism (the complete MCP server)
- **Multiple apps** = Ecosystem (organisms interacting via contracts)

Key principles:

- **Substrate is shared** - Types/contracts are the "physics" everything follows
- **Systems are pervasive** - Infrastructure like logging flows everywhere
- **Organs are discrete** - Business logic has clear boundaries
- **Each module is a cell** - Has a membrane (index.ts), contains organelles (pure functions)
- **Inject dependencies** - Never import across organs, systems inject differently
- **Events are multi-level** - Schemas (substrate) + Transport (system) + Instances (runtime)
- **Warnings are insights** - Linter warnings often reveal architectural boundaries

See [Cellular Architecture Pattern](../../docs/architecture/architectural-decisions/006-cellular-architecture-pattern.md) for detailed explanation.

**Mathematical Foundation**: These principles are grounded in complex systems theory (Meena et al., 2023; Scheffer et al., 2009) and validated across neuroscience, ecology, and machine learning. See [ADR-009](../../docs/architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md) for details.

Example structure:

```typescript
// src/notion/search/index.ts - Cell membrane (public API)
export { createSearchService } from './factory';
export type { SearchService, SearchResult } from './types';

// src/notion/search/transform.ts - Organelle (pure function)
export function transformResults(raw: RawData): SearchResult[] {
  // Pure transformation, no side effects
}

// src/notion/search/factory.ts - Cell assembly
export function createSearchService(deps: Dependencies): SearchService {
  // Wire up the cell's internals
  return {
    search: async (query) => {
      const raw = await deps.client.search(query);
      return transformResults(raw); // Use organelle
    },
  };
}

// src/notion/index.ts - Tissue boundary (groups related cells)
export { createSearchService } from './search';
export { createQueryService } from './query';
export type { NotionServices } from './types';
```

### Testing

- **Pure functions (organelles)**: Unit test with no mocks, no side effects, no I/O
- **Module integration (cells)**: Test with simple injected mocks, verify membrane behavior
- **System integration (tissues/organs)**: Test component interactions with mocked boundaries
- **Real I/O**: Only in E2E tests
- **Each test proves ONE thing** - No duplicate proofs
- **No useless tests** - Each test must prove something useful about the product code
- **No complex logic in tests** - Complexity in tests means refactoring is needed

## Project Context

**What**: oak-notion-mcp - MCP server for Notion API access  
**Package Manager**: pnpm (REQUIRED - never npm/yarn)  
**Commands**: See [Development Commands](#development-commands) below

## Essential Links

**Must Read**:

- [Development Practice](../../docs/agent-guidance/development-practice.md) - Code standards
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md) - TDD/BDD approach
- [TypeScript Practice](../../docs/agent-guidance/typescript-practice.md) - Type safety
- [Experimental Architecture](../../docs/agent-guidance/experimental-architecture-quick-reference.md) - Quick patterns

**Architecture Deep Dive**:

- [High Level Architecture](../../docs/architecture/high-level-architecture.md) - Complete system design
- [Cellular Architecture Pattern](../../docs/architecture/architectural-decisions/006-cellular-architecture-pattern.md) - Multi-scale approach
- [Tissue and Organ Interfaces](../../docs/architecture/tissue-and-organ-interfaces.md) - Higher-level boundaries
- [Mathematical Foundation](../../docs/architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md) - Why heterogeneity works

**Reference**:

- [Safety and Security](../../docs/agent-guidance/safety-and-security.md)
- [Project Setup](../../docs/development/project-setup.md) - Environment & dependencies

## Development Commands

```bash
pnpm install        # Setup
pnpm format         # 1. Format code
pnpm type-check     # 2. Check types
pnpm lint           # 3. Lint
pnpm test           # 4. Test
pnpm build          # 5. Build
```

Run quality gates 1-5 in order after changes and before commits.

## Remember

1. Read GO.md every 3rd task for grounding
2. Use TodoWrite to track complex work
3. General documentation lives in docs/, only context-specific documentation should be inline
4. When in doubt, make it simpler
5. Think in scales: organelles (functions) → cells (modules) → tissues (domains) → systems/organs → organism (application)
6. When you finish a major piece of work, record your experiences and insights in .agent/experience/, not technical docs but subjective comprehension and qualia-analogues
