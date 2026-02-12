# ADR-018: Complete Biological Architecture

## Status

Accepted

## Context

Our initial cellular architecture (ADR-006) provided a good foundation but had limitations:

- Treated all components as "organs" regardless of their nature
- No clear distinction between infrastructure (logging) and business logic
- Unclear how cross-cutting concerns should be handled
- Missing the concept of shared foundations
- No provision for multi-application ecosystems

Real biological systems have multiple types of structures:

- Discrete organs with clear boundaries (heart, liver)
- Pervasive systems that flow everywhere (nervous, circulatory)
- Foundational substrate that everything exists within
- Ecosystems where organisms interact

## Decision

Refine our biological architecture to include all levels found in nature:

### 0. Substrate (Foundation)

- Types, contracts, event schemas
- The "physics" of our application world
- Compile-time only, no runtime

### 1. Organelles (Pure Functions)

- No state, no side effects
- Single responsibility
- The basic "chemistry"

### 2. Cells (Modules)

- Organelles + state management
- Clear membrane (index.ts)
- Self-contained units

### 3. Tissues (Domain Groups)

- Multiple cells working together
- Shared purpose within domain
- Local coordination

### 4. Dual Nature at System Level

#### 4a. Systems (Pervasive Infrastructure)

- Distributed throughout organism
- No single location
- Examples: logging (nervous system), events (signaling), config (endocrine)

#### 4b. Organs (Discrete Business Logic)

- Clear physical boundaries
- Specific business function
- Examples: search integration, MCP protocol handler

### 5. Organism (Complete Application)

- All systems + all organs
- Lives in one process
- Has a lifecycle

### 6. Ecosystem (Multiple Applications)

- Multiple organisms interacting
- Each in own workspace/process
- Communicate via contracts only

## Rationale

### Biological Accuracy

- Real organisms have both discrete organs AND pervasive systems
- This distinction explains why logging feels different from business logic integration
- Provides natural patterns for different types of components

### Mathematical Foundation

Recent complex systems research validates this architecture:

- **Pervasive vs Discrete Systems**: The distinction between distributed infrastructure (like the nervous system) and localized organs (like the heart) is fundamental across all complex systems (Scheffer et al., 2009)
- **Operating at Criticality**: Systems perform optimally at the edge of chaos - the brain operates at criticality for maximal information processing (Beggs & Plenz, 2003), just as our architecture seeks the sweet spot between rigidity and chaos
- **Heterogeneity Creates Stability**: Mathematical proof that diverse patterns enhance stability (Meena et al., 2023) - our different architectural patterns for systems vs organs is a feature, not a bug

### Technical Benefits

- Clear guidance on where components belong
- Natural boundaries prevent inappropriate coupling
- Infrastructure can flow everywhere without violating boundaries
- Business logic stays contained and testable

### Event System Clarity

Events exist at three levels:

1. **Event Schemas** (Substrate) - The types/blueprints
2. **Event Transport** (System) - The infrastructure/nervous system
3. **Event Instances** (Runtime) - Actual signals flowing

This tri-level structure mirrors findings in neuroscience where signals have structural (anatomy), transport (neural pathways), and instance (actual firing) levels.

## Consequences

### Positive

- Clearer mental model for different component types
- Natural patterns for cross-cutting concerns
- Better separation between infrastructure and business logic
- Clear path to microservices (organs → organisms)
- Supports both monolithic and distributed architectures

### Negative

- More complex than simple layered architecture
- Requires understanding biological metaphors
- Initial restructuring effort needed
- May seem over-engineered for small projects

## Implementation

### Directory Structure

```text
src/
├── substrate/           # Foundation layer ✅ COMPLETED
│   ├── types/          # Core types (LogLevel, etc.)
│   ├── contracts/      # Logger, Config, EventBus, DomainOperations
│   └── event-schemas/  # Event blueprints
├── systems/            # Pervasive infrastructure ✅ COMPLETED
│   ├── logging/        # Nervous system (flattened to 2 levels)
│   ├── events/         # Edge-compatible event bus
│   └── config/         # Configuration (moved from substrate)
├── organs/             # Discrete business logic ✅ COMPLETED
│   ├── search/         # Search integration (with public API)
│   └── mcp/            # MCP protocol (dependency injection)
└── organism.ts         # Application assembly ⏳ PENDING
```

### Implementation Status (Phase 3)

As of January 2025, we've successfully implemented the complete biological architecture:

1. **Substrate Layer**: All core types and contracts defined
2. **Systems Layer**: Logging flattened from 5 to 2 levels, event bus created, config properly placed
3. **Organs Layer**: Zero cross-organ imports achieved using dependency injection
4. **Integration**: Final organism assembly pending

The implementation reduced relative import warnings from 103 to 91 (all remaining are expected architectural boundaries).

### Simplification: Tissue Level

While the original design included a "tissue" level between cells and organs/systems, we simplified the implementation to avoid over-engineering. In practice:

- What we called "tissues" are simply subdirectories within organa (e.g., `search/formatters/`, `search/transformers/`)
- These groupings emerge naturally without needing a formal architectural concept
- The biological metaphor remains clear without this intermediate level

### Key Principles

1. **Substrate is shared** - Like physics, available everywhere
2. **Systems are pervasive** - Injected differently than organs
3. **Organs never import organs** - Communication via organism level
4. **Events are multi-faceted** - Schema + transport + instances
5. **Testing matches biology** - Each level has appropriate tests

### Migration Path

1. Identify current implicit systems (logging, config)
2. Extract to systems/ directory
3. Move business logic to organs/
4. Create substrate/ for shared types
5. Wire everything in organism.ts

## References

### Architecture Documents

- ADR-006: Original Cellular Architecture Pattern
- ADR-009: Mathematical Foundation for Architecture
- [Tissue and Organ Interfaces](../../tissue-and-organ-interfaces.md)

### Scientific Foundation

- Meena, C., et al. (2023). Emergent stability in complex network dynamics. Nature Physics. <https://doi.org/10.1038/s41567-023-02020-8>
- Scheffer, M., et al. (2009). Early-warning signals for critical transitions. Nature. <https://doi.org/10.1038/nature08227>
- Beggs, J. M., & Plenz, D. (2003). Neuronal avalanches in neocortical circuits. Journal of Neuroscience. <https://doi.org/10.1523/JNEUROSCI.23-35-11167.2003>
- Complex Systems Research Summary (2021-2025) - See `.agent/reference/complex-systems-dynamics/`
