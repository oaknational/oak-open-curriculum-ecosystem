# ADR-020: Biological Architecture Pattern

> 🗺️ **Related**: [Architecture Map](../../ARCHITECTURE_MAP.md) | [Architecture Overview](../../architecture-overview.md) | [Biological Philosophy](../biological-philosophy.md)

## Status

Accepted and Implemented

## Context

Our codebase had directories (`errors/`, `utils/`, `types/`, `test-helpers/`) sitting outside the main architectural pattern. This created conceptual confusion about where functionality belonged and resulted in an incomplete organism that relied on external "tools" for essential life functions.

The realization: these aren't external tools - they're ALL integral parts of the organism:

- Error handling is the organism's alert/pain system
- PII scrubbing is the immune system
- Type definitions are structural interfaces for environmental interaction
- Test helpers are eidola (phantoms/simulacra) - the phantoms we use to test the living organism

## Decision

We adopt a complete biological architecture where ALL essential life functions are integrated into the organism, following a genotype/phenotype model:

### Genotype (oak-mcp-core) - The Genetic Blueprint

```
ecosystem/oak-mcp-core/src/
├── chora/              # Cross-cutting fields (pervasive infrastructure)
│   ├── morphai/        # Abstract patterns (Platonic forms)
│   │   ├── tools/      # Tool execution patterns
│   │   ├── handlers/   # Request handling patterns
│   │   ├── errors/     # Error handling patterns
│   │   └── registries/ # Collection management patterns
│   ├── stroma/         # Structural matrix
│   │   ├── types/      # Core type definitions
│   │   └── contracts/  # Interface definitions
│   ├── aither/         # Divine flows
│   │   ├── logging/    # Nervous system
│   │   ├── events/     # Hormonal signaling
│   │   ├── errors/     # Alert/pain system
│   │   └── sensitive-data/   # Protective system
│   └── phaneron/       # Base configuration patterns
│       └── config/     # Configuration abstractions
```

### Phenotype (oak-notion-mcp) - The Environmental Expression

```
ecosystem/oak-notion-mcp/src/
├── chora/              # Phenotype-specific chorai
│   └── eidola/         # Phantoms/simulacra (test helpers)
│       ├── factories.ts        # Mock factory functions
│       ├── notion-mocks.ts     # Notion-specific test doubles
│       └── notion-api-mocks.ts # API response simulacra
├── organa/             # Discrete organs (instantiate morphai)
│   ├── notion/         # Notion integration
│   └── mcp/            # MCP protocol handling
└── psychon/            # The ensouled whole
    └── index.ts        # Living application
```

## Consequences

### Positive

1. **Complete Organism**: All essential life functions are now part of the organism
2. **Clear Boundaries**: Import warnings act as "architectural truth detectors"
3. **Self-Contained**: The organism doesn't depend on external tools for survival
4. **Conceptual Clarity**: Each component has a clear biological metaphor

### Negative

1. **Deep Nesting**: Some import paths become longer (e.g., `chora/aither/sensitive-data/scrubbing.js`)
2. **Learning Curve**: Developers need to understand the biological metaphors

### Neutral

1. **Import Warnings**: ESLint warnings about parent imports are expected and show natural boundaries
2. **Eidola Integration**: Test helpers are now part of chora as phantoms used throughout testing

## Implementation Notes

The transition was completed in phases:

1. Analyzed where each directory belongs in the biological model
2. Moved directories to their appropriate locations
3. Updated all imports automatically with a custom script
4. Fixed TypeScript compilation issues
5. Ensured all tests pass

The organism is now complete and self-contained, with all essential life functions integrated into the biological architecture.
