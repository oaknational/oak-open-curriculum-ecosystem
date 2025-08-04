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

### Current Implementation (Phase 3 - Complete)

We have successfully transitioned to a complete biological model with Greek nomenclature:

```
src/
├── chora/             # Cross-cutting fields (pervasive infrastructure)
│   ├── stroma/        # Structural matrix (types, contracts, schemas)
│   │   ├── types/     # Pure type definitions including environment interfaces
│   │   ├── contracts/ # Interface definitions
│   │   └── schemas/   # Event and data schemas
│   ├── aither/        # Divine flows (infrastructure that moves)
│   │   ├── logging/   # Logging throughout the system
│   │   ├── events/    # Event propagation
│   │   ├── errors/    # Alert/pain system of the organism
│   │   └── immunity/  # Immune system (PII scrubbing protection)
│   ├── phaneron/      # Visible manifestation
│   │   └── config/    # Runtime configuration
│   └── eidola/        # Phantoms/simulacra for testing
│       ├── factories.ts        # Mock factory functions
│       ├── notion-mocks.ts     # Notion-specific test doubles
│       └── notion-api-mocks.ts # API response simulacra
├── organa/            # Discrete organs (bounded business logic)
│   ├── notion/        # Notion integration organ
│   └── mcp/           # MCP protocol organ
└── psychon.ts         # The ensouled whole (wires everything together)
```

The organism is now complete and self-contained with all essential life functions integrated, including eidola for testing.

### Architectural Components

#### 1. Chora/Stroma (Structural Matrix) - Foundation

- Types, contracts, and schemas that form the "physics" of our system
- Zero runtime code - pure compile-time structures
- Key contracts: Logger, ConfigProvider, EventBus, NotionOperations
- **Current**: `substrate/` → **Target**: `chora/stroma/`

#### 2. Chora/Aither (Divine Flows) - Pervasive Infrastructure

- **Logging**: Flows throughout like a nervous system
- **Events**: Propagate like hormonal signals
- **Errors**: Alert/pain system warning of problems
- **Immunity**: Protective system scrubbing PII exposure
- **Completed**: Fully integrated into `chora/aither/`

#### 3. Chora/Phaneron (Visible Manifestation) - Configuration

- Runtime configuration that makes the system's state visible
- **Completed**: Fully integrated into `chora/phaneron/`

#### 4. Chora/Eidola (Phantoms/Simulacra) - Testing Infrastructure

- **Eidōlon** (εἴδωλον): "phantom" or "simulacrum" - perfect for test doubles
- Mock factories, test doubles, and API response simulacra
- Part of chora as they pervade testing throughout the organism
- **Completed**: Integrated from `test-helpers/` into `chora/eidola/`

#### 5. Organa (Discrete Organs) - Bounded Business Logic

- **Notion Organ**: Integration with Notion API
- **MCP Organ**: Protocol handling
- Zero cross-organ imports - communicate via dependency injection
- **Completed**: Already using `organa/` structure

#### 6. Psychon (The Ensouled Whole) - Assembly

- Wires all chorai and organa together
- The living, breathing application
- **Completed**: `psychon.ts` created and functioning

#### 7. Oak MCP Core (Future Keystone Species)

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

### Phase 3: Current - Biological Architecture with Greek Nomenclature ✅ COMPLETE

**Completed**: Full biological architecture with complete organism

- ✅ Renamed `organs/` → `organa/`
- ✅ Transformed `substrate/` → `chora/stroma/`
- ✅ Transformed `systems/` → `chora/aither/` + `chora/phaneron/`
- ✅ Created `psychon.ts` to wire everything together
- ✅ Integrated all essential life functions (errors, immunity, types)
- ✅ The organism is now complete and self-contained

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
