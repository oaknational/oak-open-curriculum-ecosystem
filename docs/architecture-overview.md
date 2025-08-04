# Architecture Overview

This document provides a high-level overview of the Oak Notion MCP Server architecture. For the comprehensive architectural vision, see the [Master Architecture Document](./architecture/master-architecture.md).

## System Purpose

The Oak Notion MCP Server provides read-only access to Notion workspaces through the Model Context Protocol (MCP), enabling AI assistants to query and analyze Notion content safely and efficiently.

## Core Architecture

The system implements a **Biological Architecture with Greek Nomenclature** - a living systems model that distinguishes between:

- **Chora (Χώρα)**: Cross-cutting fields that pervade the entire system
- **Organa (Ὄργανα)**: Discrete, bounded organs with specific functions
- **Psychon (Ψυχόν)**: The ensouled whole that brings everything to life

This approach is mathematically-grounded and validated by complex systems research.

### Current Implementation (Phase 3 - In Progress)

We're transitioning to a biological model with Greek nomenclature for conceptual clarity:

```
src/
├── chora/             # Cross-cutting fields (pervasive infrastructure)
│   ├── stroma/        # Structural matrix (types, contracts, schemas)
│   │   ├── types/     # Pure type definitions
│   │   ├── contracts/ # Interface definitions
│   │   └── schemas/   # Event and data schemas
│   ├── aither/        # Divine flows (infrastructure that moves)
│   │   ├── logging/   # Logging throughout the system
│   │   └── events/    # Event propagation
│   └── phaneron/      # Visible manifestation
│       └── config/    # Runtime configuration
├── organa/            # Discrete organs (bounded business logic)
│   ├── notion/        # Notion integration organ
│   └── mcp/           # MCP protocol organ
└── psychon.ts         # The ensouled whole (wires everything together)
```

### Architectural Components

#### 1. Chora/Stroma (Structural Matrix) - Foundation

- Types, contracts, and schemas that form the "physics" of our system
- Zero runtime code - pure compile-time structures
- Key contracts: Logger, ConfigProvider, EventBus, NotionOperations
- **Current**: `substrate/` → **Target**: `chora/stroma/`

#### 2. Chora/Aither (Divine Flows) - Pervasive Infrastructure

- **Logging**: Flows throughout like a nervous system
- **Events**: Propagate like hormonal signals
- **Current**: `systems/logging/`, `systems/events/` → **Target**: `chora/aither/`

#### 3. Chora/Phaneron (Visible Manifestation) - Configuration

- Runtime configuration that makes the system's state visible
- **Current**: `systems/config/` → **Target**: `chora/phaneron/`

#### 4. Organa (Discrete Organs) - Bounded Business Logic

- **Notion Organ**: Integration with Notion API
- **MCP Organ**: Protocol handling
- Zero cross-organ imports - communicate via dependency injection
- **Already renamed**: `organs/` → `organa/`

#### 5. Psychon (The Ensouled Whole) - Assembly

- Wires all chorai and organa together
- The living, breathing application
- **Current**: Future `organism.ts` → **Target**: `psychon.ts`

#### 5. Oak MCP Core (Future Keystone Species)

- Generic MCP framework (~3,050 LoC)
- Will be extracted as separate organism
- Foundation for ecosystem growth

## Key Architectural Principles

1. **Biological Model with Greek Nomenclature** - Chora + Organa + Psychon
2. **Pure Functions First** - Organelles with no side effects
3. **Clear Boundaries** - Chorai pervade, organa are discrete
4. **Operating at Criticality** - Edge of chaos for optimal performance
5. **Mathematical Grounding** - Validated by complex systems theory
6. **Early Warning Signals** - Import warnings show natural boundaries

### Why Greek Nomenclature?

1. **Avoids Overloaded Terms** - "System", "service", "component" mean too many things
2. **Precise Philosophical Meaning** - Each Greek term has specific philosophical heritage
3. **Cognitive Distance** - Foreign terms force clear thinking about distinctions

## Architectural Evolution

### Phase 3: Current - Biological Architecture with Greek Nomenclature ⏳ IN PROGRESS

**Progress**: Transitioning to chora/organa/psychon structure

- ✅ Renamed `organs/` → `organa/`
- ⏳ Transform `substrate/` → `chora/stroma/`
- ⏳ Transform `systems/` → `chora/aither/` + `chora/phaneron/`
- ⏳ Create `psychon.ts` to wire everything together
- Import warnings show where boundaries naturally want to form

### Phase 4: Next - Oak MCP Core Extraction

Extract the generic MCP framework as our first independent organism after Phase 3 completion.

### Phase 5: Future - Ecosystem Formation

Multiple organisms (oak-notion-mcp, oak-github-mcp) in shared environment.

## Quick Links

- [High Level Architecture](./architecture/high-level-architecture.md) - Detailed architecture documentation
- [Architecture Decision Records](./architecture/architectural-decisions/) - All architectural decisions
- [API Reference](./usage/api-reference.md) - Technical API documentation
- [Onboarding Journey](./development/onboarding-journey.md) - Getting started guide

## Architecture Decision Records

Key architectural decisions are documented as ADRs:

### Core Decisions

- [ADR-001: ESM-Only Package](./architecture/architectural-decisions/001-esm-only-package.md)
- [ADR-002: Pure Functions First](./architecture/architectural-decisions/002-pure-functions-first.md)
- [ADR-006: Cellular Architecture Pattern](./architecture/architectural-decisions/006-cellular-architecture-pattern.md)
- [ADR-009: Mathematical Foundation](./architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md)

### Implementation Decisions

- [ADR-003: Zod for Validation](./architecture/architectural-decisions/003-zod-for-validation.md)
- [ADR-004: Abstract Notion SDK](./architecture/architectural-decisions/004-no-direct-notion-sdk-usage.md)
- [ADR-005: Automatic PII Scrubbing](./architecture/architectural-decisions/005-automatic-pii-scrubbing.md)

[View all ADRs →](./architecture/architectural-decisions/)

## For AI Agents

If you're an AI agent working with this codebase, start with the [AI Agent Guide](./agent-guidance/ai-agent-guide.md) for specific guidance on navigating and modifying the codebase effectively.
