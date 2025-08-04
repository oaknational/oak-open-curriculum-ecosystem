# Architecture Overview

This document provides a high-level overview of the Oak Notion MCP Server architecture. For the comprehensive architectural vision, see the [Master Architecture Document](./architecture/master-architecture.md).

## System Purpose

The Oak Notion MCP Server provides read-only access to Notion workspaces through the Model Context Protocol (MCP), enabling AI assistants to query and analyze Notion content safely and efficiently.

## Core Architecture

The system implements a **Complete Biological Architecture** - a mathematically-grounded approach validated by complex systems research.

### Current Implementation (Phase 3 - In Progress)

We've successfully transitioned from traditional layers to a complete biological model:

```
src/
├── substrate/         # Foundation (types & contracts) ✅
│   ├── types/        # Pure type definitions
│   ├── contracts/    # Logger, Config, EventBus, NotionOperations
│   └── event-schemas/# Event type definitions
├── systems/          # Pervasive Infrastructure ✅
│   ├── logging/      # Nervous system (flattened to 2 levels)
│   ├── events/       # Hormonal signaling (edge-compatible)
│   └── config/       # Endocrine system
├── organa/           # Discrete Business Logic ✅
│   ├── notion/       # Notion integration (with public API)
│   └── mcp/          # MCP protocol (uses dependency injection)
└── (organism.ts)     # Future: Assembly point
```

### Architectural Components

#### 1. Substrate (Foundation) ✅ COMPLETED

- Types, contracts, and event schemas
- The "physics" of our application
- Zero runtime code
- Key contracts: Logger, ConfigProvider, EventBus, NotionOperations

#### 2. Systems (Pervasive Infrastructure) ✅ COMPLETED

- **Logging**: Nervous system (flattened from 5 to 2 levels, domain-driven splitting)
- **Events**: Edge-compatible event bus for hormonal signaling
- **Config**: Endocrine system (moved from substrate to correct location)

#### 3. Organa (Discrete Business Logic) ✅ COMPLETED

- **Notion Organ**: Complete integration with public API (createNotionOperations)
- **MCP Organ**: Protocol handling with dependency injection
- Zero cross-organ imports achieved
- Communication via dependency injection, not events

#### 4. Organism (Assembly) ⏳ PENDING

- Will wire systems and organa together
- Entry point for the application
- Next step in Phase 3

#### 5. Oak MCP Core (Future Keystone Species)

- Generic MCP framework (~3,050 LoC)
- Will be extracted as separate organism
- Foundation for ecosystem growth

## Key Architectural Principles

1. **Complete Biological Model** - Substrate + Systems + Organs
2. **Pure Functions First** - Organelles with no side effects
3. **Clear Boundaries** - Natural separation, not forced
4. **Operating at Criticality** - Edge of chaos for optimal performance
5. **Mathematical Grounding** - Validated by complex systems theory
6. **Early Warning Signals** - 103 import warnings show natural boundaries

## Architectural Evolution

### Phase 3: Current - Biological Restructuring ⏳ IN PROGRESS

**Progress**: Foundation, Infrastructure, and Modularization phases completed. Integration phase pending.

- ✅ Substrate layer with types and contracts
- ✅ Systems layer with logging, events, and config
- ✅ Organa layer with Notion and MCP (zero cross-imports)
- ⏳ Organism assembly to wire everything together
- 91 import warnings remain (all expected architectural boundaries)

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
