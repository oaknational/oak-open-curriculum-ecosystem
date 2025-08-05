# Architecture Overview

> 🗺️ **Looking for a quick reference?** See the [Architecture Map](ARCHITECTURE_MAP.md) for a visual guide to finding what you need.

This document provides a high-level overview of the Oak Notion MCP Server architecture. For detailed technical design, see the [High-Level Architecture](./architecture/high-level-architecture.md).

## System Purpose

The Oak Notion MCP Server provides read-only access to Notion workspaces through the Model Context Protocol (MCP), enabling AI assistants to query and analyze Notion content safely and efficiently.

## Core Architecture

The system implements a **Biological Architecture with Greek Nomenclature** - a living systems model with a complete hierarchy from molecules to ecosystems.

> 🗺️ **Need to find something quickly?** The [Architecture Map](ARCHITECTURE_MAP.md) provides a visual guide to all directories and their purposes.

### Three Fundamental Categories

1. **Discrete Hierarchy**: Bounded assemblies that nest hierarchically (molecules → organisms)
2. **Cross-Cutting Chōra**: Pervasive fields that flow through all levels
   - **Morphai** (μορφαί): Abstract patterns - Platonic forms that organs instantiate
   - **Stroma** (στρῶμα): Structural matrix - types, contracts, schemas
   - **Aither** (αἰθήρ): Divine flows - logging, events, errors
   - **Phaneron** (φανερόν): The visible - configuration, runtime settings
   - **Eidola** (εἴδωλα): Phantoms - test mocks and fixtures
3. **Parallel Phantom Layer**: Testing infrastructure (eidola) that mirrors the living system

This approach is mathematically-grounded and validated by complex systems research.

### Current Implementation (Phase 4 - Genotype/Phenotype Model)

We have successfully evolved to a **genotype/phenotype model** with workspace structure:

```text
ecosystem/
├── oak-mcp-core/      # GENOTYPE - Genetic blueprint for all MCP servers
│   └── src/chora/     # Cross-cutting genetic traits
│       ├── morphai/   # Abstract patterns (Platonic forms)
│       │   ├── tools/      # Tool creation patterns
│       │   ├── handlers/   # Request handling patterns
│       │   ├── errors/     # Error handling patterns
│       │   └── registries/ # Collection management patterns
│       ├── stroma/    # Structural matrix (types, contracts)
│       ├── aither/    # Divine flows (logging, events, errors)
│       ├── phaneron/  # Visible manifestation (configuration)
│       └── eidola/    # Phantoms/simulacra for testing
│
└── oak-notion-mcp/    # PHENOTYPE - Notion-specific expression
    └── src/
        ├── psychon/   # The soul - wiring and orchestration
        ├── organa/    # Organs - business logic units
        │   ├── mcp/   # MCP protocol handling
        │   └── notion/# Notion-specific logic
        └── chora/     # Phenotype-specific infrastructure
            └── (notion-specific extensions)
```

### The Morphai: Completing the Biological Model

**Morphai (μορφαί)** represent the Platonic forms - the perfect, abstract patterns that exist in the genotype. They are the "genetic code" that defines:

- **What it means to be** a tool, handler, or registry (essence)
- **How patterns compose** to form complex behaviors
- **Universal shapes** that all phenotypes can instantiate

Organs in phenotypes are the "shadows" of these perfect forms, implementing them in specific contexts.

The organism is now complete with a true genetic inheritance model.

## Import Relationship Rules

### Core Principle: ALL Cross-Boundary Imports Must Use Public APIs

The following diagram shows the complete import relationship model for our biological architecture:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      WHOLE SYSTEM IMPORT ARCHITECTURE                        │
│                                                                              │
│  FUNDAMENTAL RULE: Any import between organizational structures              │
│                    MUST be via public API (index.ts)                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ PSYCHON/ - The Soul Layer (Wires Everything)                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ // src/psychon/wiring.ts                                                 │ │
│ │ import { createConsoleLogger } from '@chora/aither/logging';  ✅        │ │
│ │ import { getNotionConfig } from '@chora/phaneron/config';     ✅        │ │
│ │ import { createNotionOrgan } from '@organa/notion';           ✅        │ │
│ │ import { createMcpOrgan } from '@organa/mcp';                 ✅        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                                      │
                    ▼                                      ▼
┌─────────────────────────────┐          ┌─────────────────────────────┐
│      ORGANA (Organs)        │          │    CHORAI (Infrastructure)   │
├─────────────────────────────┤          ├─────────────────────────────┤
│                             │          │                             │
│  ┌───────────────────────┐  │          │  ┌────────────────────┐    │
│  │ organa/notion/        │  │          │  │ chora/stroma/      │    │
│  │  ├── index.ts  [API]  │  │          │  │  ├── index.ts [API]│    │
│  │  ├── client.ts        │  │          │  │  ├── types/        │    │
│  │  ├── search/          │  │          │  │  │   └── index.ts  │    │
│  │  │   ├── index.ts     │  │          │  │  └── contracts/    │    │
│  │  │   └── searcher.ts  │  │          │  │      └── index.ts  │    │
│  │  └── query/           │  │          │  └────────────────────┘    │
│  │      ├── index.ts     │  │          │                             │
│  │      └── querier.ts   │  │          │  ┌────────────────────┐    │
│  └───────────────────────┘  │          │  │ chora/aither/      │    │
│            ❌                │          │  │  ├── index.ts [API]│    │
│  ┌───────────────────────┐  │          │  │  ├── logging/      │    │
│  │ organa/mcp/           │  │          │  │  │   └── index.ts  │    │
│  │  ├── index.ts  [API]  │  │          │  │  ├── events/       │    │
│  │  ├── server.ts        │  │          │  │  │   └── index.ts  │    │
│  │  └── handlers/        │  │          │  │  └── errors/       │    │
│  │      └── index.ts     │  │          │  │      └── index.ts  │    │
│  └───────────────────────┘  │          │  └────────────────────┘    │
│                             │          │                             │
└─────────────────────────────┘          └─────────────────────────────┘

IMPORT EXAMPLES WITHIN EACH STRUCTURE:

┌─────────────────────────────────────────────────────────────────────────────┐
│ WITHIN organa/notion/ (Linear Hierarchy)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  notion/client.ts:                                                          │
│    import { search } from './search/index.js';        ✅ (child via API)   │
│    import { Logger } from '@chora/aither/logging';    ✅ (chora via API)   │
│                                                                              │
│  notion/search/searcher.ts:                                                 │
│    import { formatResults } from './formatter.js';    ✅ (sibling)         │
│    import { client } from '../client.js';             ❌ (parent import)   │
│    import { EventBus } from '@chora/aither/events';   ✅ (chora via API)   │
│    import { querier } from '../query/querier.js';     ❌ (reach into peer)│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ WITHIN chora/aither/ (Linear Hierarchy)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  aither/logging/logger.ts:                                                  │
│    import { formatter } from './formatters/index.js';  ✅ (child via API)  │
│    import type { LogLevel } from '@chora/stroma';      ✅ (chora via API) │
│    import { sanitize } from '../sensitive-data/scrubbing.js'; ✅ (within aither) │
│                                                                              │
│  aither/logging/formatters/json.ts:                                         │
│    import { colors } from '../colors/palette.js';     ✅ (within aither)   │
│    import { sanitize } from './sanitizer.js';         ✅ (sibling)        │
│    import type { Contract } from '@chora/stroma';      ✅ (chora via API)  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ CROSS-BOUNDARY IMPORTS (Always via Public API)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ CORRECT:                                                                │
│  // In organa/notion/client.ts                                              │
│  import { createConsoleLogger } from '@chora/aither/logging';               │
│  import type { NotionConfig } from '@chora/phaneron/config';                │
│                                                                              │
│  // In chora/aither/events/event-bus.ts                                     │
│  import type { EventContract } from '@chora/stroma/contracts';              │
│  import { scrubSensitiveData } from '@chora/aither/sensitive-data';               │
│                                                                              │
│  ❌ INCORRECT:                                                              │
│  // In organa/notion/search.ts                                              │
│  import { McpHandler } from '@organa/mcp/handlers/base';    // Cross-organ  │
│  import { JsonFormatter } from '@chora/aither/logging/formatters/json';     │
│  import { configLoader } from '../../chora/phaneron/config/loader';         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ SPECIAL CASES                                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. PSYCHON LAYER: Can import from any organ/chora (but via public APIs)    │
│     - src/index.ts (entry point)                                            │
│     - src/psychon/** (all wiring components)                                │
│                                                                              │
│  2. EIDOLA: Can access internals for mocking                                │
│     import { InternalClient } from '@organa/notion/client';  ✅ (testing)   │
│                                                                              │
│  3. TEST FILES: Can break boundaries for testing                            │
│     import { privateHelper } from '../src/internal/helper';  ✅ (in tests)  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Visual Summary of Import Rules

```text
                    ┌─────────────┐
                    │  PSYCHON/   │ ← Wiring layer (via public APIs)
                    │  ┌───────┐  │
                    │  │ index │  │
                    │  ├───────┤  │
                    │  │wiring │  │
                    │  ├───────┤  │
                    │  │server │  │
                    │  └───────┘  │
                    └──────┬──────┘
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
┌───────────────┐                    ┌───────────────┐
│    ORGANA     │                    │    CHORAI     │
├───────────────┤                    ├───────────────┤
│               │                    │               │
│   notion ──┐  │                    │  stroma ←──┐  │
│            ▼  │                    │     ↕ API  │  │
│   mcp    [API]│ ← via public API   │  aither ←──┤  │
│     ↕          │                    │     ↕ API  │  │
│  [Linear      │                    │  phaneron ←┘  │
│   Hierarchy]  │                    │               │
│               │                    │  [All via API]│
└───────┬───────┘                    └───────┬───────┘
        │                                     │
        └─────────────► ✅ ◄─────────────────┘
              Import chorai via public API only
```

### Summary of ALL Import Rules

1. **Cross-boundary imports**: ALWAYS via public API (index.ts)
2. **Within a structure**: Linear hierarchy (no parent imports)
3. **Organa → Organa**: FORBIDDEN (use psychon for wiring)
4. **Chorai → Organa**: FORBIDDEN (infrastructure has no business knowledge)
5. **Organa → Chorai**: ALLOWED (via public API only)
6. **Chorai → Chorai**: ALLOWED (via public API only)
7. **Internal structure**: Can import siblings and children, never parents
8. **Special exemptions**: Psychon layer (wiring), Eidola (mocking), and test files

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

## Complete Biological Hierarchy

Our architecture follows a complete biological hierarchy:

### Discrete Hierarchy (Bounded Assemblies)

- **Morion → Moria**: Molecules (language syntax features)
- **Organelle → Organelles**: Pure functions (no side effects)
- **Kytos → Kytia**: Cells (individual modules)
- **Histos → Histoi**: Tissues (related modules in directories)
- **Organon → Organa**: Organs (services like notion/, mcp/)
- **Systema → Systemata**: Systems (grouped organs) - potentially useful later
- **Psychon → Psycha**: Organisms (complete applications)
- **Ecosystema → Ecosystemata**: Ecosystems - collections of applications, libraries, etc (monorepo)
- **Biosphaera → Biosphaerae**: Biospheres - collections of ecosystems?

### Cross-Cutting Chōra (Pervasive Fields)

- **Aither**: Flows that touch everything (logging, events, errors)
- **Stroma**: Foundational matrix (types, contracts, schemas)
- **Phaneron**: Visible manifestation (configuration)
- **Krypton**: Hidden values (secrets) - _future_
- **Kanōn**: Canonical rules (tooling config) - _future_
- **Kratos**: Power/control (authorization) - _future_
- **Nomos**: Laws (policies) - _future_

### Parallel Layer

- **Eidōlon → Eidōla**: Phantoms (test doubles, mocks)

## Key Architectural Principles

1. **Biological Model with Greek Nomenclature** - Complete hierarchy from molecules to biosphere
2. **Pure Functions First** - Organelles with no side effects
3. **Clear Boundaries** - Chorai pervade, organa are discrete
4. **Operating at Criticality** - Edge of chaos for optimal performance
5. **Mathematical Grounding** - Validated by complex systems theory
6. **Early Warning Signals** - Import warnings show natural boundaries

### Why Greek Nomenclature?

1. **Avoids Overloaded Terms** - "System", "service", "component" mean too many things
2. **Precise Philosophical Meaning** - Each Greek term has specific philosophical heritage
3. **Cognitive Distance** - Foreign terms force clear thinking about distinctions

> **Complete Etymology**: See our [Naming Guide](./naming.md) for detailed explanations of each term's etymology, philosophical heritage, and architectural meaning.

## Architectural Evolution

### Phase 3: Current - Biological Architecture with Greek Nomenclature ✅ COMPLETE

**Completed**: Full biological architecture with complete organism

- ✅ Renamed `organs/` → `organa/`
- ✅ Transformed `substrate/` → `chora/stroma/`
- ✅ Transformed `systems/` → `chora/aither/` + `chora/phaneron/`
- ✅ Created `psychon.ts` to wire everything together
- ✅ Integrated all essential life functions (errors, sensitive data protection, types)
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

## Import Rules Within and Between Chorai

### Critical Distinction: Within vs Between

1. **Within a Chora** (e.g., within aither):
   - Components can access each other directly
   - Example: `aither/logging/logger.ts` can import from `aither/logging/formatters/pretty.ts`
   - Rationale: Components within a chora form a cohesive substrate

2. **Between Chorai** (e.g., aither → stroma):
   - MUST use public APIs only (index.ts files)
   - Example: `aither/logging/logger.ts` must import from `@chora/stroma`, not `@chora/stroma/types/logging.js`
   - Rationale: Maintains proper boundaries between different infrastructure concerns

3. **Index.ts Files** (Public API aggregators):
   - Can import from their immediate children to create the public API
   - Example: `aither/index.ts` can import from `./logging/index.js`
   - This is how public APIs are constructed from internal components

### Examples:

```typescript
// ✅ CORRECT - Within aither, direct access allowed
// In aither/logging/formatters/pretty.ts
import { colors } from '../colors/palette.js';
import { LogLevel } from '../types/levels.js';

// ✅ CORRECT - Between chorai, use public API
// In aither/logging/logger.ts
import type { Contract } from '@chora/stroma'; // Via public API

// ❌ INCORRECT - Between chorai, reaching into internals
// In aither/events/event-bus.ts
import type { EventContract } from '../../stroma/contracts/event-bus.js';

// ✅ CORRECT - Index.ts aggregating child exports
// In aither/index.ts
export { createLogger } from './logging/index.js';
export { EventBus } from './events/index.js';
```

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
