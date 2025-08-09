# ADR-021: Genotype and Phenotype Chorai Pattern

> 🗺️ **Related**: [ADR-020: Biological Architecture](./020-biological-architecture.md) | [Architecture Overview](../../architecture-overview.md) | [Phase 4 Plan](../../../.agent/plans/phase-4-oak-mcp-core-implementation-plan.md)

## Status

Accepted and Implemented

## Context

During Phase 4 implementation (genotype/phenotype separation), we needed to clarify whether chorai (cross-cutting infrastructure) exist only in the genotype or can also exist in phenotypes. The initial assumption was that ALL chorai would be extracted to the genotype (oak-mcp-core), but this created problems:

1. **Phenotype-specific types**: Notion-specific types and contracts don't belong in the generic genotype
2. **Phenotype-specific configuration**: Notion API configuration is meaningless to other phenotypes
3. **Phenotype-specific test infrastructure**: Notion mocks and test helpers are specific to Notion

## Decision

**Chorai can exist in BOTH genotype and phenotype**, following these principles:

### Genotype Chorai (oak-mcp-core)
These are the **genetic traits** - abstract patterns that ALL phenotypes inherit:

- **morphai**: Abstract patterns (Platonic forms) - tool patterns, handler patterns, registry patterns
- **stroma**: Core types and contracts - Logger, EventBus, generic MCP types
- **aither**: Universal flows - logging infrastructure, event system, error handling
- **phaneron**: Base configuration patterns - config management abstractions

### Phenotype Chorai (oak-notion-mcp)
These are **environmental extensions** - specific adaptations for the Notion environment:

- **eidola**: Notion-specific test infrastructure - mocks, fixtures, test helpers
- **stroma extensions**: Notion-specific types and contracts - NotionClient, NotionOperations
- **phaneron extensions**: Notion-specific configuration - NOTION_API_KEY, Notion config

### The Pattern

```text
GENOTYPE (oak-mcp-core)          PHENOTYPE (oak-notion-mcp)
├── chora/                       ├── chora/
│   ├── morphai/  [abstract]     │   ├── eidola/  [Notion tests]
│   ├── stroma/   [core types]   │   ├── stroma/  [Notion types]
│   ├── aither/   [logging]      │   └── phaneron/ [Notion config]
│   └── phaneron/ [base config]  ├── organa/ [implements morphai]
                                  └── psychon/ [wiring]
```

## Architectural Principles

1. **Inheritance Model**: Phenotypes inherit genotype chorai and extend with their own
2. **No Duplication**: Phenotypes don't duplicate genotype chorai, they import and extend
3. **Clear Boundaries**: Genotype has zero knowledge of specific phenotypes
4. **Type Extensions**: Phenotype stroma extends genotype stroma with specific types

## Implementation Example

```typescript
// In oak-mcp-core (genotype)
// chora/stroma/types/dependencies.ts
export interface CoreDependencies {
  logger: Logger;
  eventBus: EventBus;
}

// In oak-notion-mcp (phenotype)
// chora/stroma/notion-types/dependencies.ts
import type { Logger } from '@oaknational/mcp-moria';
import type { MinimalNotionClient } from './notion-client.js';

export interface NotionDependencies {
  notionClient: MinimalNotionClient;
  logger: Logger;  // Inherited from genotype
  notionOperations: NotionOperations;  // Phenotype-specific
}
```

## Consequences

### Positive

1. **Clean Separation**: Generic patterns stay generic, specific implementations stay specific
2. **Type Safety**: Each phenotype has its own type system extending the core
3. **Test Isolation**: Each phenotype has its own test infrastructure
4. **Future Phenotypes**: New phenotypes (oak-github-mcp) can have their own chorai

### Negative

1. **Conceptual Complexity**: Developers must understand chorai can exist at both levels
2. **Import Paths**: Must distinguish between genotype and phenotype chorai

### Neutral

1. **Documentation Need**: This pattern must be clearly documented
2. **Naming Conventions**: Phenotype chorai should indicate their specificity

## Decision Rules

### What goes in GENOTYPE chorai?
- Abstract patterns without implementation details
- Universal infrastructure all phenotypes need
- Core type definitions and contracts
- Base configuration management

### What goes in PHENOTYPE chorai?
- Implementation-specific types and contracts
- Environment-specific configuration
- Specific test mocks and fixtures
- Extensions of genotype patterns

## Migration Notes

During Phase 4 Sub-phase 1, we successfully:
1. Extracted universal chorai to oak-mcp-core (genotype)
2. Kept Notion-specific chorai in oak-notion-mcp (phenotype)
3. Established import patterns from phenotype to genotype
4. Achieved zero hard dependencies in the genotype (conditional dependencies with graceful degradation are permitted - see ADR-022)

This pattern is now the architectural standard for all future phenotypes.