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
- **No shortcuts** - Never use `as`, `any`, `!`, or type assertions
- **Single source of truth** - Define types ONCE, use library types directly
- **Fail properly** - Fail fast and hard with helpful errors, never silently
- **Quality gates** - Run ALL gates after changes: format → type-check → lint → test → build
- **validate external signals** - parse and/or validate external signals (e.g. API responses, read from files, etc), official SDKs count as validation

### Architecture (Biological Model with Greek Nomenclature)

Think in biological scales:

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

See [Biological Architecture Guide](../../docs/agent-guidance/architecture.md) for authoritative reference and [ADR-020](../../docs/architecture/architectural-decisions/020-biological-architecture.md) for the philosophical grounding.

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

### Testing

- **Pure functions (organelles)**: Unit test with no mocks, no side effects, no I/O
- **Module integration (cells)**: Test with simple injected mocks, verify membrane behaviour
- **System integration (chorai/organa)**: Test component interactions with mocked boundaries
- **Real I/O**: Only in E2E tests
- **Each test proves ONE thing** - No duplicate proofs
- **No useless tests** - Each test must prove something useful about the product code
- **No complex logic in tests** - Complexity in tests means refactoring is needed
