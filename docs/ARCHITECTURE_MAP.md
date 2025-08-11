# 🗺️ Architecture Map

> **First time here?** This map shows you exactly where to find what you need in our two-scale biological architecture.

## Architecture Evolution

### Current State

- **Moria (Molecules/Atoms)** (`ecosystem/moria/`) - Pure abstractions, zero dependencies
- **Histoi (Tissues/Matrices)** (`ecosystem/histoi/`) - Runtime-adaptive connective tissues
- **Psycha (Living Organisms)** (`ecosystem/psycha/`) - Complete applications

## Quick Navigation Guide

### Workspace Level (Package Organization)

| What you're looking for | Where to find it | Location | Description |
|-------------------------|------------------|----------|-------------|
| **Pure interfaces** | Moria tier | `ecosystem/moria/@oaknational/mcp-moria/src/interfaces/` | Logger, StorageProvider, etc. |
| **Pure types** | Moria tier | `ecosystem/moria/@oaknational/mcp-moria/src/types/` | Zero-dependency type definitions |
| **Pure algorithms** | Moria tier | `ecosystem/moria/@oaknational/mcp-moria/src/algorithms/` | Sorting, validation, etc. |
| **Adaptive logger** | Histoi tier | `ecosystem/histoi/@oaknational/mcp-histos-logger/` | Console/pino/edge adaptive |
| **Adaptive storage** | Histoi tier | `ecosystem/histoi/@oaknational/mcp-histos-storage/` | localStorage/fs adaptive |
| **Transport tissue** | Histoi tier | `ecosystem/histoi/@oaknational/mcp-histos-transport/` | stdio/HTTP adaptive |
| **Notion MCP server** | Psycha tier | `ecosystem/psycha/oak-notion-mcp/` | Complete application |

### Psychon Level (Within Each Organism)

| What you're looking for | Where to find it | Directory | Greek meaning |
|-------------------------|------------------|-----------|---------------|
| **Mocks** | Platonic forms | `src/chora/eidola/` | εἴδολα: Phantoms |
| **Types, interfaces** | Foundation layer | `src/chora/stroma/` | στρῶμα: Support/Foundation |
| **Logging, events** | System flows | `src/chora/aither/` | αἰθήρ: Air/Essence that flows |
| **Configuration** | Runtime settings | `src/chora/phaneron/` | φανερόν: Manifestation |
| **Notion integration** | Business logic | `src/organa/notion/` | ὄργανον: Organ |
| **MCP protocol** | Protocol handler | `src/organa/mcp/` | ὄργανον: Organ |
| **App wiring** | Main application | `src/psychon/` | ψυχόν: Soul/Living Whole |

## Architecture Concepts

### Two Complementary Scales

#### Workspace Architecture (Moria → Histoi → Psycha)

How packages relate in the workspace:

- **Moria** - Pure abstractions (interfaces, types, algorithms)
  - Zero dependencies, absolute purity
  - Example: `Logger` interface
  
- **Histoi** - Runtime-adaptive tissues that connect organisms
  - Adapt to Node.js vs Edge vs Browser
  - Example: Adaptive logger using console or pino
  
- **Psycha** - Complete living applications
  - Compose from moria and histoi
  - Example: oak-notion-mcp server

#### Psychon Architecture (Chorai + Organa → Psychon)

How components organize within each organism:

##### 🌊 Chorai (Χῶραι) - Pervasive Fields

Infrastructure that flows through everything:

- **eidola** - Mocks, testing helpers
- **stroma** - Types and contracts (compile-time only)
- **aither** - Logging and events (pervasive flows)
- **phaneron** - Configuration and environment

##### 🫀 Organa (Ὄργανα) - Discrete Organs

Bounded business logic units:

- **notion** - Notion API integration
- **mcp** - MCP protocol handling

##### 🎭 Psychon (Ψυχόν) - The Soul

The wiring layer that brings everything to life.

## Common Tasks

### "I want to add a pure interface"

→ Go to `ecosystem/moria/@oaknational/mcp-moria/src/interfaces/`

### "I need runtime-adaptive behavior"

→ Create a new tissue in `ecosystem/histoi/`

### "I want to add logging to my organism"

→ Go to `src/chora/aither/logging/`

### "I need to add a new type"

→ For pure types: `ecosystem/moria/@oaknational/mcp-moria/src/types/`
→ For organism-specific: `src/chora/stroma/types/`

### "I want to modify Notion integration"

→ Go to `src/organa/notion/`

### "I need to add a new MCP tool"

→ Go to `src/organa/mcp/tools/`

## Import Rules

### Workspace Level

```typescript
// ✅ ALLOWED
// Psycha imports from Moria and Histoi
import { Logger } from '@oaknational/mcp-moria';
import { createAdaptiveLogger } from '@oaknational/mcp-histos-logger';

// ❌ FORBIDDEN
// Moria cannot import anything
import something from 'any-package'; // NO!

// Histoi cannot import from other Histoi
import { storage } from '@oaknational/mcp-histos-storage'; // NO!
```

### Psychon Level

```typescript
// ✅ ALLOWED
// Organa can import from chorai
import type { Config } from '@chora/phaneron';
import { createLogger } from '@chora/aither';

// ❌ FORBIDDEN
// Cross-organ imports
import { notionClient } from '@organa/notion'; // NO!
```

## Migration Status

- **Phase 4**: ✅ Genotype/Phenotype model established
- **Phase 5**: 🚧 Moria/Histoi/Psycha evolution in progress
  - Moria package: In development
  - Histoi tissues: Planned
  - Psycha migration: Planned

## Learn More

- [Biological Architecture Guide](agent-guidance/architecture.md) - Authoritative reference
- [High-Level Architecture](architecture/high-level-architecture.md) - Technical details
- [Phase 5 Plan](.agent/plans/phase-5-moria-histoi-psycha-evolution.md) - Current work
