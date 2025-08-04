# High Level Architecture

> "Architecture is not about files and folders, but about relationships and boundaries. Our 91 relative import warnings aren't bugs - they're architectural truth detectors showing us where natural boundaries want to form."

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Core Design Principles](#core-design-principles)
3. [System Architecture](#system-architecture)
4. [Architectural Scales](#architectural-scales)
5. [Layer Responsibilities](#layer-responsibilities)
6. [Security Model](#security-model)
7. [Testing Strategy](#testing-strategy)
8. [Error Handling](#error-handling)
9. [Mathematical Foundation](#mathematical-foundation)
10. [Migration Roadmap](#migration-roadmap)
11. [Reference Documents](#reference-documents)

## Executive Summary

The Oak Notion MCP Server implements a **Biological Architecture with Greek Nomenclature** - a mathematically-grounded approach to software design inspired by how biological systems achieve stability, resilience, and evolution at scale.

### Key Innovations

1. **Chora/Stroma Layer**: Shared types and contracts form the structural matrix of our application
2. **Chorai vs Organa**: Pervasive infrastructure (logging, events) is fundamentally different from discrete business logic (Notion, MCP)
3. **Psychon Integration**: The living whole that emerges from properly wired components
4. **Multi-Scale Design**: From pure functions (organelles) to distributed systems (ecosystems)
5. **Mathematical Validation**: Our patterns are proven by complex systems theory across multiple disciplines

### Why Greek Nomenclature?

- **Precision**: Each term has ONE specific meaning, no ambiguity
- **Cognitive Distance**: Forces clear thinking about architectural boundaries
- **Philosophical Grounding**: Terms chosen for their original meanings in Greek philosophy

## Core Design Principles

1. **Pure Functions First**: Maximum business logic implemented as pure, side-effect-free functions
2. **Dependency Injection**: All I/O operations are injected, making the system highly testable
3. **Clear Boundaries**: Well-defined interfaces between architectural layers
4. **Test-Driven Development**: Tests written before implementation
5. **Type Safety**: Strict TypeScript with no `any` types, validated boundaries using Zod
6. **Fail-Safe Defaults**: Read-only operations by default, write operations require explicit confirmation
7. **Privacy by Design**: Automatic PII scrubbing for sensitive data (emails)
8. **Biological Architecture**: Chorai (pervasive fields) vs Organa (discrete organs)
9. **Stroma Foundation**: Shared types and contracts form the structural matrix
10. **Multi-Scale Design**: Organelles → Cells → Chorai/Organa → Psychon → Ecosystem
11. **Operating at Criticality**: Like the brain, we aim for the edge of chaos
12. **Mathematical Grounding**: Architecture decisions based on proven complex systems principles

## System Architecture

### Current Layered View

```text
┌─────────────────────────────────────────┐
│            MCP Client                   │
│    (Claude Desktop, Roo Cline, etc)     │
└────────────────┬────────────────────────┘
                 │ stdio (JSON-RPC)
┌────────────────┴────────────────────────┐
│          MCP Protocol Layer             │
│      Request/Response Handlers          │
│    ┌─────────────────────────────┐      │
│    │ Resources │ Tools │ Prompts │      │
│    └─────────────────────────────┘      │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│        (Pure Functions Only)            │
│    ┌─────────────────────────────┐      │
│    │ Transformers │ Validators   │      │
│    │ Builders     │ Formatters   │      │
│    └─────────────────────────────┘      │
├─────────────────────────────────────────┤
│        Notion Adapter Layer             │
│         (Integration Point)             │
│    ┌─────────────────────────────┐      │
│    │    NotionClientWrapper      │      │
│    └─────────────────────────────┘      │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│    ┌─────────────────────────────┐      │
│    │ Config │ Logging │ Errors   │      │
│    └─────────────────────────────┘      │
└─────────────────────────────────────────┘
```

### Target Biological Architecture

```text
┌─────────────────────────── PSYCHON ───────────────────────────┐
│                    (The Ensouled Whole)                        │
│                                                                │
│  ┌─────────────────── CHORAI ────────────────────┐           │
│  │         (Pervasive Fields - Flow Everywhere)   │           │
│  │                                                 │           │
│  │  ┌──── Stroma ────┐  ┌──── Aither ────┐       │           │
│  │  │ Types/Contracts│  │ Logging/Events │       │           │
│  │  │ (Compile-time) │  │ (Divine Flows) │       │           │
│  │  └────────────────┘  └────────────────┘       │           │
│  │                                                 │           │
│  │  ┌────────── Phaneron ──────────┐             │           │
│  │  │      Configuration            │             │           │
│  │  │   (What Appears/Manifest)    │             │           │
│  │  └───────────────────────────────┘             │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                │
│  ┌─────────────────── ORGANA ─────────────────────┐           │
│  │      (Discrete Organs - Bounded Logic)         │           │
│  │                                                 │           │
│  │  ┌──── Notion ────┐    ┌───── MCP ─────┐     │           │
│  │  │ Notion API     │    │ MCP Protocol  │     │           │
│  │  │ Integration    │    │ Server Logic  │     │           │
│  │  └────────────────┘    └────────────────┘     │           │
│  │         ⚡ No Cross-Organ Imports ⚡           │           │
│  └─────────────────────────────────────────────────┘           │
└────────────────────────────────────────────────────────────────┘
```

### Current Implementation Status

```text
┌────────────────────────────────────────────────────────────────┐
│           Current Implementation (Phase 3 - 90% Complete)       │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │         Substrate → Chora/Stroma ✅ COMPLETED                ││
│ │   • types/: LogLevel, core types                             ││
│ │   • contracts/: Logger, Config, EventBus, NotionOperations   ││
│ │   • event-schemas/: Event type definitions                   ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─────────────────────┐  ┌─────────────────────────────────────┐│
│ │Systems → Chorai ✅   │  │    Organs → Organa ✅               ││
│ │ ┌─────────────────┐ │  │ ┌─────────────────────────────────┐││
│ │ │Logging → Aither │ │  │ │    Notion Organ                 │││
│ │ │(2 levels max)   │ │  │ │ • Transformers                  │││
│ │ └─────────────────┘ │  │ │ • Formatters                    │││
│ │ ┌─────────────────┐ │  │ │ • Public API via index.ts       │││
│ │ │Events → Aither  │ │  │ └─────────────────────────────────┘││
│ │ │(Edge-compat)    │ │  │ ┌─────────────────────────────────┐││
│ │ └─────────────────┘ │  │ │     MCP Organ                   │││
│ │ ┌─────────────────┐ │  │ │ • Tool handlers                 │││
│ │ │Config→Phaneron  │ │  │ │ • Resource handlers             │││
│ │ │(From systems)   │ │  │ │ • Uses dependency injection     │││
│ │ └─────────────────┘ │  │ └─────────────────────────────────┘││
│ └─────────────────────┘  └─────────────────────────────────────┘│
│                                                                 │
│ ⏳ Next: psychon.ts to wire everything together                 │
└────────────────────────────────────────────────────────────────┘
```

## Architectural Scales

### 0. Chora/Stroma (Foundation)

**What**: Types, contracts, event schemas - the structural matrix
**Where**: `src/chora/stroma/`
**Rules**:

- Zero runtime code
- Compile-time only
- Shared by everything

```typescript
// chora/stroma/types/core.ts
export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// chora/stroma/contracts/repository.ts
export interface Repository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

### 1. Organelles (Pure Functions)

**What**: Side-effect free functions - the basic units
**Where**: Throughout the codebase
**Rules**:

- No I/O, no state
- Single responsibility
- Highly testable

```typescript
// Pure function - an organelle
export function calculateRelevance(query: string, content: string): number {
  const queryTerms = query.toLowerCase().split(' ');
  const contentLower = content.toLowerCase();
  const matches = queryTerms.filter((term) => contentLower.includes(term));
  return matches.length / queryTerms.length;
}
```

### 2. Cells (Modules)

**What**: Self-contained units with clear boundaries
**Where**: Individual module directories
**Rules**:

- index.ts acts as membrane (barrel export)
- Contains organelles (pure functions)
- Single responsibility per file

### 3. Chorai (Pervasive Fields)

The infrastructure that flows through everything:

#### 3a. Chora/Aither (Divine Flows)

**What**: Logging and events - the flows that animate the system
**Where**: `src/chora/aither/`
**Examples**: Logger, EventBus

#### 3b. Chora/Phaneron (Visible Manifestation)

**What**: Configuration - what appears to the system
**Where**: `src/chora/phaneron/`
**Examples**: Config management, environment settings

### 4. Organa (Discrete Organs)

**What**: Complete functional units with clear boundaries
**Where**: `src/organa/`
**Examples**: Notion integration, MCP protocol handler
**Rules**:

- Clear boundaries
- Specific business function
- No cross-organ imports

```typescript
// organa/notion/index.ts - Organ boundary
export interface NotionOperations {
  search(query: string): Promise<SearchResults>;
  fetch(id: string): Promise<Document>;
  transform(raw: RawData): ProcessedData;
}
```

### 5. Psychon (The Living Whole)

**What**: Complete, living application
**Where**: `src/psychon.ts`
**Rules**:

- Wires all chorai and organa together
- Single deployment unit
- The consciousness that emerges

```typescript
// src/psychon.ts - where everything comes together
export class Psychon {
  constructor() {
    // Create chorai (pervasive fields)
    const logger = createLogger();
    const events = createEventBus();
    const config = createConfig();

    // Create organa with injected chorai
    const notion = createNotionOperations({ logger, events, config });
    const mcp = createMcpServer({
      logger,
      events,
      config,
      notionOperations: notion, // Dependency injection
    });
  }
}
```

### 6. Ecosystem (Future - Multiple Applications)

**What**: Multiple psycha (organisms) interacting
**Where**: Distributed system / monorepo
**Rules**:

- Organisms communicate via contracts only
- Natural selection (what works survives)

## Layer Responsibilities

### MCP Protocol Layer (→ Organa/MCP)

- **Purpose**: Handle MCP protocol communication and request routing
- **Components**: Request handlers, response formatters, protocol error handling
- **Key Principle**: Thin layer that delegates to business logic

### Business Logic Layer (→ Organelles in Organa)

- **Purpose**: Core application logic as pure functions
- **Components**: Transformers, validators, formatters, scrubbing utilities
- **Key Principle**: No side effects, fully testable

### Notion Adapter Layer (→ Organa/Notion)

- **Purpose**: Abstract Notion API interactions
- **Components**: NotionClientWrapper, request builders, response mappers
- **Key Principle**: Single point of integration with external API

### Infrastructure Layer (→ Chorai)

- **Purpose**: Cross-cutting pervasive concerns
- **Components**:
  - Logging (→ Aither): Flows through everything
  - Events (→ Aither): System-wide signaling
  - Config (→ Phaneron): Visible configuration
- **Key Principle**: Fields that pervade the entire system

## Security Model

### Read-Only by Default

- All operations are read-only
- No write, update, or delete operations exposed
- API key requires only read permissions

### Data Privacy

- Automatic email scrubbing in all text content
- Configurable PII detection patterns
- No caching of sensitive data
- Clear audit trail through logging

### Input Validation

- All inputs validated with Zod schemas at boundaries
- Type-safe boundaries between layers
- Once validated, types are trusted internally

## Testing Strategy

The system uses different testing approaches at each architectural scale:

| Level          | Greek Term   | Testing Approach                             |
| -------------- | ------------ | -------------------------------------------- |
| Foundation     | Chora/Stroma | Compile-time type checking                   |
| Pure Functions | Organelles   | Pure unit tests, no mocks                    |
| Modules        | Cells        | Integration tests with injected dependencies |
| Infrastructure | Chorai       | Infrastructure tests with test doubles       |
| Business Logic | Organa       | Business logic tests with mocked chorai      |
| Application    | Psychon      | Integration tests verifying wiring           |
| System         | Full Psychon | E2E tests with real I/O                      |
| Multi-App      | Ecosystem    | Contract tests between organisms             |

## Error Handling

### Fail-Fast Principle

- Validate inputs early
- Clear, actionable error messages
- No silent failures

### Error Propagation

- Errors bubble up through layers
- Each layer can add context
- MCP protocol layer formats for client

### Recovery Strategies

- Retry logic for transient failures
- Circuit breakers for external services
- Graceful degradation where possible

## Mathematical Foundation

Our architecture isn't just biologically inspired - it's mathematically validated by complex systems research.

### Stability Through Heterogeneity

Research by Meena et al. (2023) proves that heterogeneous networks naturally self-organize into stable configurations:

```
Stability Classifier: S = β(s + ν + ρ - μ - η)

Where:
- β > 0: Degree heterogeneity (variety in connections)
- s: Cooperation factor (1 for collaborative)
- S < 0: System is stable
```

**What this means**: Our different patterns (chorai vs organa) create mathematical stability.

### Operating at Criticality

Like the brain, optimal systems operate at the "edge of chaos" (Beggs & Plenz, 2003):

- Too rigid = brittle, can't adapt
- Too chaotic = unstable, can't function
- Criticality = maximum information processing

**What this means**: Our 91 import warnings show we're at a phase transition - exactly where we should be.

### Early Warning Signals

Scheffer et al. (2009) identified universal signals before system transitions:

- Increasing autocorrelation (dependencies coupling)
- Rising variance (fluctuating relationships)
- Slower recovery (changes propagating slowly)

**What this means**: Our import warnings are early warning signals showing natural boundaries.

## Migration Roadmap

### Phase 3: Biological Architecture Implementation (Current)

**Progress**: 90% Complete

- ✅ Substrate → Chora/Stroma extraction complete
- ✅ Systems → Chorai separation complete
- ✅ Organs → Organa with dependency injection
- ⏳ Next: Create psychon.ts to wire everything

**Metrics**:

- Started: 101 relative import warnings
- Current: 91 warnings (all expected boundaries)
- Target: 0 warnings after psychon integration

### Phase 4: oak-mcp-core Extraction

**Goal**: Extract generic MCP framework as pioneer organism
**Timeline**: 2-3 weeks after Phase 3

### Future Phases

- **Phase 5**: Multiple organisms (ecosystem)
- **Phase 6**: Full distributed system

## Reference Documents

### Core Architecture

1. **[Biological Architecture Guide](../agent-guidance/architecture.md)** - THE authoritative reference
2. **[ADR-020: Biological Architecture](architectural-decisions/020-biological-architecture.md)** - Greek nomenclature decision
3. **[Quick Reference](../agent-guidance/experimental-architecture-quick-reference.md)** - Visual guide with examples

### Supporting Documents

4. **[ADR-009: Mathematical Foundation](architectural-decisions/009-mathematical-foundation-for-architecture.md)** - Complex systems theory
5. **[Phase 3 Implementation Plan](../../.agent/plans/phase-3-biological-architecture.md)** - Current work
6. **[AGENT.md](../../.agent/directives-and-memory/AGENT.md)** - AI agent guidance

### Getting Started

7. **[Architecture Overview](../architecture-overview.md)** - High-level introduction
8. **[Onboarding Journey](../development/onboarding-journey.md)** - Developer setup

---

_"Like nature itself, our architecture evolves through selection pressure. The 91 import warnings aren't failures - they're the system telling us where it wants to grow."_
