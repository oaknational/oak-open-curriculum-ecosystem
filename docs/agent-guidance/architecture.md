# Biological Architecture Guide

**THIS IS THE AUTHORITATIVE ARCHITECTURAL REFERENCE**

## Executive Summary

This codebase implements a **Biological Architecture with Greek Nomenclature**, organized at two complementary scales:

### Workspace Architecture (Package Organization)

**Moria → Histoi → Psycha** - The three-tier ecosystem:

- **Moria (Molecules/Atoms)**: Pure abstractions with zero dependencies
  - *Example*: `Logger` interface, `StorageProvider` interface, pure algorithms
- **Histoi (Tissues/Matrices)**: Runtime-adaptive connective tissues that bind organisms
  - *Example*: Adaptive logger (console vs pino), adaptive storage (localStorage vs fs)
- **Psycha (Living Organisms)**: Complete applications
  - *Example*: `oak-notion-mcp` server, `github-mcp` server

### Psychon Architecture (Within Each Organism)

**Chorai + Organa → Psychon** - The internal structure:

- **Chorai**: Pervasive infrastructure fields that flow everywhere
- **Organa**: Discrete business logic organs with clear boundaries
- **Psychon**: The ensouled whole that emerges from integration

This is not metaphor - it's mathematically grounded in complex systems theory. The Greek terms eliminate confusion and create precise architectural boundaries.

## Visual Architecture

### Workspace Level

```
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
│  │   (Contains Psychon)         │                │
│  └──────────────────────────────┘                │
└──────────────────────────────────────────────────┘
```

### Psychon Level (Within Each Organism)

```
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

## Greek Nomenclature & Definitions

### Workspace Level Terms

| Greek Term | Pronunciation | Translation | Definition | Example |
|------------|---------------|-------------|------------|---------|
| **Moria** (Μόρια) | MO-ree-ah | Molecules/Atoms | Pure abstractions, zero dependencies | `Logger` interface |
| **Histoi** (Ἱστοί) | hee-STOY | Tissues/Matrices | Runtime-adaptive connective tissues | Adaptive logger tissue |
| **Psycha** (ψυχά) | psoo-KHA | Living Organisms | Complete applications | `oak-notion-mcp` server |

### Psychon Level Terms

| Greek Term | Pronunciation | Translation | Definition | Example |
|------------|---------------|-------------|------------|---------|
| **Morphai** (Μορφαί) | mor-FAI | Forms | Hidden forms, Platonic ideals | `ToolExecutor` pattern |
| **Stroma** (Στρῶμα) | STRO-mah | Support/Foundation | Types and contracts (compile-time) | `NotionBlock` type |
| **Aither** (Αἰθήρ) | eye-THAIR | Air/Essence | Logging and events (pervasive flows) | Logger flowing through layers |
| **Phaneron** (Φανερόν) | fa-ne-RON | Manifestation | Configuration and environment | `.env` configuration |
| **Organa** (Ὄργανα) | OR-ga-na | Organs | Discrete business logic | Notion search organ |
| **Psychon** (Ψυχόν) | psoo-KHON | Soul/Living Whole | The wiring layer | Main application class |

## Quick Decision Trees

### Workspace Level: Which Package?

```
Is it a pure abstraction with zero dependencies?
  └─ YES → ecosystem/moria/ (molecules/atoms)

Does it adapt to different runtime environments?
  └─ YES → ecosystem/histoi/ (tissues/matrices)

Is it a complete application?
  └─ YES → ecosystem/psycha/ (living organisms)
```

### Psychon Level: Where in the Organism?

```
Is it a type, contract, or schema?
  └─ YES → chora/stroma/ (compile-time structure)

Is it an abstract pattern or interface?
  └─ YES → chora/morphai/ (Platonic forms)

Does it need to flow everywhere?
  ├─ Logging/Events? → chora/aither/ (divine flows)
  └─ Configuration? → chora/phaneron/ (visible state)

Is it discrete business logic?
  └─ YES → organa/{name}/ (bounded organ)

Are you wiring everything together?
  └─ YES → psychon/ (the soul/wiring layer)
```

## Import Rules

### Workspace Level Import Rules

```typescript
// ✅ ALLOWED
// Psycha can import from Histoi and Moria
import { Logger } from '@oaknational/mcp-moria';
import { createAdaptiveLogger } from '@oaknational/mcp-histos-logger';

// Histoi can import from Moria
import { StorageProvider } from '@oaknational/mcp-moria';

// ❌ FORBIDDEN
// Moria cannot import anything external
import something from 'any-package'; // NO!

// Histoi cannot import from other Histoi
import { logger } from '@oaknational/mcp-histos-logger'; // NO!

// Psycha cannot import from other Psycha
import { service } from '@oaknational/github-mcp'; // NO!
```

### Psychon Level Import Rules

1. **Chorai can import from chorai** (infrastructure builds on infrastructure)
2. **Organa CANNOT import from other organa** (organs are independent)
3. **Organa can import from chora** (organs use infrastructure)
4. **Everything can import from stroma** (types are foundational)

## Code Examples

### Workspace Level Examples

```typescript
// ecosystem/moria/@oaknational/mcp-moria/src/interfaces/logger.ts
// Pure abstraction - zero dependencies
export interface Logger {
  trace(message: string, context?: unknown): void;
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, error?: unknown, context?: unknown): void;
}

// ecosystem/histoi/@oaknational/mcp-histos-logger/src/adaptive.ts
// Runtime-adaptive tissue
import { Logger } from '@oaknational/mcp-moria';

export function createAdaptiveLogger(): Logger {
  if (typeof window !== 'undefined') {
    return createBrowserLogger(); // Uses console
  } else if (typeof process !== 'undefined') {
    return createNodeLogger(); // Uses pino
  } else {
    return createEdgeLogger(); // Uses edge-compatible logger
  }
}

// ecosystem/psycha/oak-notion-mcp/src/index.ts
// Complete organism
import { Logger } from '@oaknational/mcp-moria';
import { createAdaptiveLogger } from '@oaknational/mcp-histos-logger';
import { createNotionOperations } from './organa/notion/index.js';

const logger = createAdaptiveLogger();
const notion = createNotionOperations({ logger });
```

### Psychon Level Examples

```typescript
// ✅ CORRECT: Organ using injected dependencies
// organa/notion/index.ts
export function createNotionOperations(deps: { 
  logger: Logger; // From aither
  config: Config; // From phaneron
}) {
  // Use injected dependencies, no cross-organ imports
}

// ✅ CORRECT: Chora type definition
// chora/stroma/contracts/logger.ts
export interface Logger {
  info(message: string): void;
  error(message: string, error?: Error): void;
}

// ❌ WRONG: Cross-organ import
// organa/mcp/handler.ts
import { notionClient } from '../notion/client.js'; // NO!
// FIX: Inject notion operations via dependencies

// ❌ WRONG: Business logic in chora
// chora/aither/logging/notion-formatter.ts
function formatNotionPage(page: Page) {} // Too specific!
// FIX: Move to organa/notion/formatters/
```

## Testing Strategy

### Workspace Level Testing

- **Moria**: Unit tests only, no mocks, no I/O (`*.test.ts`)
- **Histoi**: Unit tests for pure logic, integration tests for runtime adaptation
- **Psycha**: Integration tests for assembly, E2E tests for full behavior

### Psychon Level Testing

- **Pure functions (organelles)**: Unit test with no mocks
- **Module integration (cells)**: Test with simple injected mocks
- **System integration (chorai/organa)**: Test component interactions
- **Real I/O**: Only in E2E tests

## Biological Principles

1. **Two complementary scales** - Workspace (Moria/Histoi/Psycha) and Psychon (Chorai/Organa)
2. **Zero dependencies in Moria** - Pure abstractions must remain pure
3. **Histoi are transplantable** - Same tissue works across different organisms
4. **Chorai are fields** - Like electromagnetic fields, they pervade everything
5. **Organa are discrete** - Like organs in a body, clear boundaries
6. **No organ-to-organ imports** - Heart doesn't import from liver
7. **Psychon integrates** - Like consciousness emerges from parts
8. **Greek clarity** - Each term has ONE precise meaning

## For Architectural Review

When reviewing architecture:

1. **Check workspace hierarchy** - Psycha → Histoi → Moria (never reverse)
2. **Verify Moria purity** - Zero external dependencies
3. **Confirm Histoi adaptability** - Runtime detection working?
4. **Check import directions** - Are boundaries respected?
5. **Verify categorization** - Is each component in the right place?
6. **Ensure independence** - Can organs function without each other?
7. **Validate pervasiveness** - Do chorai truly flow everywhere?

## Common Questions

**Q: What's the difference between Moria and Morphai?**  
A: Moria is a workspace-level package (pure abstractions), Morphai is a type of chora within a psychon (Platonic forms)

**Q: Can Histoi packages depend on each other?**  
A: No, each tissue must be independent and transplantable

**Q: Where do utilities go?**  
A: Pure utilities → Moria. Runtime-adaptive utilities → Histoi. Domain-specific → appropriate organ

**Q: How do organs communicate?**  
A: Through dependency injection in psychon OR events via aither

**Q: What about shared business logic?**  
A: If truly shared → create a tissue in Histoi. If domain-specific → keep in organ

## Migration Path

### Phase 4 → Phase 5

- `oak-mcp-core` → Split into `moria` + multiple `histoi` packages
- Genotype/Phenotype → Workspace tiers (Moria/Histoi/Psycha)
- Monolithic core → Distributed responsibilities

### Current Psychon Structure → Target

- `substrate/` → `chora/stroma/`
- `systems/logging/` → `chora/aither/logging/`
- `systems/events/` → `chora/aither/events/`
- `systems/config/` → `chora/phaneron/config/`
- `server*.ts` + wiring → `psychon/` directory

## Scientific Foundation

This architecture is based on:

- **Complex systems theory** - Heterogeneity = stability (Meena et al., 2023)
- **Biological organization** - Real organisms have this multi-scale structure
- **Empirical validation** - Proven across neuroscience, ecology, and ML domains

## References

- [ADR-023: Moria/Histoi/Psycha Architecture](../architecture/architectural-decisions/023-moria-histoi-psycha-architecture.md)
- [ADR-020: Biological Architecture](../architecture/architectural-decisions/020-biological-architecture.md)
- [Phase 5: Moria/Histoi/Psycha Evolution](../../.agent/plans/phase-5-moria-histoi-psycha-evolution.md)
- [Testing Strategy](testing-strategy.md)
- [Workspace ESLint Rules](../architecture/workspace-eslint-rules.md)
