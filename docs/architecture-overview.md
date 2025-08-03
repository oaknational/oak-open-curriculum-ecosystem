# Architecture Overview

This document provides a high-level overview of the Oak Notion MCP Server architecture. For the comprehensive architectural vision, see the [Master Architecture Document](./architecture/master-architecture.md).

## System Purpose

The Oak Notion MCP Server provides read-only access to Notion workspaces through the Model Context Protocol (MCP), enabling AI assistants to query and analyze Notion content safely and efficiently.

## Core Architecture

The system implements a **Complete Biological Architecture** - a mathematically-grounded approach validated by complex systems research.

### Current Implementation

We're transitioning from a traditional layered architecture to a complete biological model:

```
Traditional Layers → Biological Architecture
├── Protocol Layer → MCP Organ
├── Business Logic → Pure Organelles + Cells
├── Infrastructure → Pervasive Systems
└── External APIs → Environmental Interface
```

### Architectural Components

#### 1. Substrate (Foundation)

- Types, contracts, and event schemas
- The "physics" of our application
- Zero runtime code

#### 2. Systems (Pervasive Infrastructure)

- **Logging**: Nervous system flowing throughout
- **Events**: Signaling between components
- **Config**: Endocrine system for settings

#### 3. Organs (Discrete Business Logic)

- **Notion Organ**: Complete Notion integration
- **MCP Organ**: Protocol handling
- Clear boundaries, no cross-organ imports

#### 4. Oak MCP Core (Future Keystone Species)

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

### Phase 3: Current - Biological Restructuring

Implementing complete biological architecture with substrate, systems, and organs.

### Phase 4: Next - Oak MCP Core Extraction

Extract the generic MCP framework as our first independent organism.

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
