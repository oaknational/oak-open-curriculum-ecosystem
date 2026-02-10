# High Level Architecture

> 🗺️ **Quick Navigation**: [Architecture Map](../ARCHITECTURE_MAP.md) | [Architecture Overview](../architecture-overview.md) | [Naming Guide](../naming.md)

> "Architecture is not about files and folders, but about relationships and boundaries. Our import warnings aren't bugs - they're architectural truth detectors showing us where natural boundaries want to form."

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

### Architecture Evolution ✅ COMPLETED (Phase 5)

We have successfully evolved from a two-tier genotype/phenotype model to a three-tier workspace architecture:

#### Workspace Architecture (Moria/Histoi/Psycha) ✅ IMPLEMENTED

- **Moria (Molecules/Atoms)**: Pure abstractions with zero dependencies - `@oaknational/mcp-moria` package
- **Histoi (Tissues/Matrices)**: Runtime-adaptive connective tissues:
  - `@oaknational/mcp-histos-logger` - Adaptive logging with Consola
  - `@oaknational/mcp-histos-storage` - FileSystem/LocalStorage/Memory storage
  - `@oaknational/mcp-histos-env` - Environment abstraction
  - `@oaknational/mcp-histos-transport` - STDIO transport (gold standard implementation)
- **Psycha (Living Organisms)**: Complete applications - `@oaknational/oak-notion-mcp`

#### Psychon Architecture (Within Each Organism)

- **Chorai**: Pervasive infrastructure fields (morphai, stroma, aither, phaneron)
- **Organa**: Discrete business logic organs with clear boundaries
- **Psychon**: The ensouled whole that emerges from integration

### Key Innovations

1. **Two-Scale Architecture**: Workspace level (packages) and Psychon level (within organisms)
2. **Zero Dependencies in Moria**: Pure abstractions remain truly pure
3. **Transplantable Histoi**: Tissues that adapt to different runtime environments
4. **Chora/Stroma Layer**: Shared types and contracts form the structural matrix
5. **Chorai vs Organa**: Pervasive infrastructure vs discrete business logic
6. **Mathematical Validation**: Patterns proven by complex systems theory

### Why Greek Nomenclature?

- **Precision**: Each term has ONE specific meaning, no ambiguity
- **Cognitive Distance**: Forces clear thinking about architectural boundaries
- **Philosophical Grounding**: Terms chosen for their original meanings in Greek philosophy

## Core Design Principles

1. **Pure Functions First**: Maximum business logic as pure, side-effect-free functions
2. **Zero Dependencies in Moria**: Absolute purity for foundational abstractions ✅
3. **Runtime Adaptation in Histoi**: Tissues adapt to their host environment ✅
4. **Dependency Injection**: All I/O operations are injected (see ADR-024) ✅
5. **Clear Boundaries**: ESLint-enforced interfaces between all layers ✅
6. **Test-Driven Development**: Tests written before implementation
7. **Type Safety**: Strict TypeScript with no `any` types
8. **Fail-Safe Defaults**: Read-only operations by default
9. **Privacy by Design**: Automatic PII scrubbing
10. **Multi-Scale Design**: From molecules to ecosystems
11. **Operating at Criticality**: Like the brain, at the edge of chaos
12. **Mathematical Grounding**: Based on proven complex systems principles

## System Architecture

### Target Three-Tier Architecture

```text
┌─────────────────── ECOSYSTEM ───────────────────┐
│                                                  │
│  ┌─────────── MORIA ───────────┐                │
│  │   Pure Abstractions          │                │
│  │   Zero Dependencies          │                │
│  │   Interfaces & Algorithms    │                │
│  └──────────────────────────────┘                │
│              ↓                                   │
│  ┌─────────── HISTOI ──────────┐                │
│  │   Connective Tissues/Matrices│                │
│  │   Runtime-Adaptive           │                │
│  │   Transplantable             │                │
│  └──────────────────────────────┘                │
│              ↓                                   │
│  ┌─────────── PSYCHA ──────────┐                │
│  │   Living Organisms           │                │
│  │   Complete Applications      │                │
│  │   (Contains Psychon below)   │                │
│  └──────────────────────────────┘                │
└──────────────────────────────────────────────────┘
```

### Psychon Architecture (Within Each Organism)

```text
┌─────────────────────────── PSYCHON ───────────────────────────┐
│                    (The Ensouled Whole)                        │
│                                                                │
│  ┌─────────────────── CHORAI ────────────────────┐           │
│  │         (Pervasive Fields - Flow Everywhere)   │           │
│  │                                                 │           │
│  │  ┌─── Morphai ────┐  ┌──── Stroma ────┐      │           │
│  │  │ Hidden Forms   │  │ Types/Contracts│      │           │
│  │  │ (Platonic)     │  │ (Compile-time) │      │           │
│  │  └────────────────┘  └────────────────┘      │           │
│  │                                                 │           │
│  │  ┌──── Aither ────┐  ┌─── Phaneron ───┐      │           │
│  │  │ Logging/Events │  │ Configuration  │      │           │
│  │  │ (Divine Flows) │  │ (Manifestation)│      │           │
│  │  └────────────────┘  └────────────────┘      │           │
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

### Implementation Phases

#### Phase 4: Genotype/Phenotype Model (Completed)

- Extracted oak-mcp-core as genotype
- oak-notion-mcp as phenotype

#### Phase 5: Moria/Histoi/Psycha Evolution (Current)

- Split oak-mcp-core into:
  - **Moria**: Pure abstractions (Logger, StorageProvider interfaces)
  - **Histoi**: Runtime-adaptive tissues (adaptive logger, storage)
- Move oak-notion-mcp to Psycha tier

## Architectural Scales

### Workspace Level

#### 0. Moria (Molecules/Atoms)

**What**: Pure abstractions with zero dependencies
**Where**: `ecosystem/moria/@oaknational/mcp-moria/`
**Examples**:

- Logger interface
- StorageProvider interface
- Pure algorithms

```typescript
// ecosystem/moria/@oaknational/mcp-moria/src/interfaces/logger.ts
export interface Logger {
  trace(message: string, context?: unknown): void;
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, error?: unknown, context?: unknown): void;
}
```

#### 1. Histoi (Tissues/Matrices)

**What**: Runtime-adaptive connective tissues
**Where**: `ecosystem/histoi/@oaknational/mcp-histos-*/`
**Examples**:

- Adaptive logger (console in browser, pino in Node.js)
- Adaptive storage (localStorage in browser, fs in Node.js)

```typescript
// ecosystem/histoi/@oaknational/mcp-histos-logger/src/adaptive.ts
import { Logger } from '@oaknational/mcp-moria';

export function createAdaptiveLogger(): Logger {
  if (typeof window !== 'undefined') {
    return createBrowserLogger();
  } else if (typeof process !== 'undefined') {
    return createNodeLogger();
  } else {
    return createEdgeLogger();
  }
}
```

#### 2. Psycha (Living Organisms)

**What**: Complete applications
**Where**: `ecosystem/psycha/*/`
**Examples**: oak-notion-mcp, github-mcp

### Psychon Level (Within Each Organism)

#### 0. Chora/Stroma (Foundation)

**What**: Types, contracts, event schemas - the structural matrix
**Where**: `src/chora/stroma/`
**Rules**: Zero runtime code, compile-time only

#### 1. Chora/Morphai (Forms)

**What**: Hidden forms and Platonic ideals
**Where**: `src/chora/morphai/`
**Examples**: ToolExecutor pattern, RequestHandler interface

#### 2. Chora/Aither (Air/Essence)

**What**: Logging and events - pervasive flows
**Where**: `src/chora/aither/`
**Examples**: Logger that flows through all layers, event bus

#### 3. Chora/Phaneron (Manifestation)

**What**: Configuration and perceivable environment
**Where**: `src/chora/phaneron/`
**Examples**: .env configuration, API keys management

#### 4. Organa (Organs)

**What**: Discrete business logic organs
**Where**: `src/organa/*/`
**Examples**: Notion integration organ, MCP protocol organ, Curriculum API organ

**Important**: External service connectors (like Notion or Curriculum API clients) are **organs that process external data**, not passive connectors. They actively transform, validate, and enrich external data, making them functional units (organs) rather than structural connectors (ligaments). This follows the biological pattern where organs like lungs interface with external air while remaining organs.

#### 5. Psychon (Soul/Living Whole)

**What**: The wiring layer that brings everything to life
**Where**: `src/psychon/`
**Example**: Main application class, dependency injection

```typescript
// src/psychon/index.ts
export class Psychon {
  constructor() {
    // Import from Moria
    const { Logger } = await import('@oaknational/mcp-moria');

    // Import from Histoi
    const { createAdaptiveLogger } = await import('@oaknational/mcp-histos-logger');

    // Create infrastructure
    const logger = createAdaptiveLogger();
    const config = createConfig();

    // Create organs with injected dependencies
    const notion = createNotionOperations({ logger, config });
    const mcp = createMcpServer({
      logger,
      config,
      notionOperations: notion,
    });
  }
}
```

## Layer Responsibilities

### Workspace Level Responsibilities

#### Moria Layer

- **Purpose**: Define pure contracts and algorithms
- **Components**: Interfaces, types, pure functions
- **Key Principle**: Zero dependencies, absolute purity

#### Histoi Layer

- **Purpose**: Provide runtime-adaptive capabilities
- **Components**: Adaptive implementations, conditional exports
- **Key Principle**: Transplantable between organisms

#### Psycha Layer

- **Purpose**: Complete, functioning applications
- **Components**: Full MCP servers, complete systems
- **Key Principle**: Compose from moria and histoi

### Psychon Level Responsibilities

#### MCP Protocol Layer (→ Organa/MCP)

- **Purpose**: Handle MCP protocol communication
- **Components**: Request handlers, response formatters
- **Key Principle**: Thin layer delegating to business logic

#### Business Logic Layer (→ Organelles in Organa)

- **Purpose**: Core application logic as pure functions
- **Components**: Transformers, validators, formatters
- **Key Principle**: No side effects, fully testable

#### Infrastructure Layer (→ Chorai)

- **Purpose**: Cross-cutting pervasive concerns
- **Components**: Logging, events, configuration
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

### Workspace Level Testing

| Level  | Testing Approach                                      | Example                        |
| ------ | ----------------------------------------------------- | ------------------------------ |
| Moria  | Unit tests only, no mocks, no I/O                     | Interface implementation tests |
| Histoi | Unit tests for pure logic, integration for adaptation | Runtime detection tests        |
| Psycha | Integration tests for assembly, E2E for full behavior | MCP protocol tests             |

### Psychon Level Testing

| Level          | Greek Term   | Testing Approach                        |
| -------------- | ------------ | --------------------------------------- |
| Foundation     | Chora/Stroma | Compile-time type checking              |
| Pure Functions | Organelles   | Pure unit tests, no mocks               |
| Infrastructure | Chorai       | Infrastructure tests with test doubles  |
| Business Logic | Organa       | Business logic tests with mocked chorai |
| Application    | Psychon      | Integration tests verifying wiring      |

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

Our architecture is mathematically validated by complex systems research.

### Stability Through Heterogeneity

Research by Meena et al. (2023) proves heterogeneous networks self-organize into stable configurations:

```
Stability Classifier: S = β(s + ν + ρ - μ - η)
Where β > 0 (degree heterogeneity) and S < 0 (stable)
```

**Application**: Different patterns (moria vs histoi vs psycha) create mathematical stability.

### Operating at Criticality

Like the brain, optimal systems operate at the "edge of chaos" (Beggs & Plenz, 2003).

**Application**: Import warnings show we're at a phase transition - exactly where we should be.

### Early Warning Signals

Scheffer et al. (2009) identified universal signals before system transitions.

**Application**: Import warnings are early warning signals showing natural boundaries.

## Migration Roadmap

### Phase 4: Genotype/Phenotype (Completed)

- ✅ Extracted oak-mcp-core
- ✅ Established genotype/phenotype model

### Phase 5: Moria/Histoi/Psycha Evolution (Current)

**Goal**: Transform to three-tier architecture
**Status**: Implementation in progress

Sub-phases:

1. Create Moria package (in progress)
2. Create Histoi tissues
3. Migrate oak-notion-mcp to Psycha
4. Delete oak-mcp-core

### Future Phases

- **Phase 6**: Multiple organisms (ecosystem)
- **Phase 7**: Full distributed system

## Reference Documents

### Core Architecture

1. **[Biological Architecture Guide](../agent-guidance/architecture.md)** - Authoritative reference
2. **[ADR-023: Moria/Histoi/Psycha](architectural-decisions/023-moria-histoi-psycha-architecture.md)** - Three-tier decision
3. **[Phase 5 Plan](../../.agent/plans/phase-5-moria-histoi-psycha-evolution.md)** - Current implementation

### Supporting Documents

4. **[Testing Strategy](../../../.agent/directives/testing-strategy.md)** - TDD approach at all levels
5. **[Workspace ESLint Rules](workspace-eslint-rules.md)** - Import enforcement
6. **[AGENT.md](../../.agent/directives/AGENT.md)** - AI agent guidance

---

_"Like nature itself, our architecture evolves through selection pressure. The three tiers - Moria, Histoi, Psycha - reflect how real biological systems organize from molecules to organisms."_
