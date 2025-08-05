# Biological Architecture Quick Reference

## Visual Architecture

```
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

## Greek Nomenclature & Meaning

| Greek Term             | Pronunciation | Meaning                     | Code Location         |
| ---------------------- | ------------- | --------------------------- | --------------------- |
| **Chora** (Χώρα)       | KHO-rah       | Space/field that pervades   | `src/chora/`          |
| **Stroma** (Στρῶμα)    | STRO-mah      | Supporting matrix           | `src/chora/stroma/`   |
| **Aither** (Αἰθήρ)     | eye-THAIR     | Divine substance that flows | `src/chora/aither/`   |
| **Phaneron** (Φανερόν) | fa-ne-RON     | What appears/is manifest    | `src/chora/phaneron/` |
| **Organa** (Ὄργανα)    | OR-ga-na      | Tools/instruments (plural)  | `src/organa/`         |
| **Psychon** (Ψυχόν)    | psoo-KHON     | The ensouled/animated whole | `src/psychon/`        |

## Quick Decision Tree

```
Is it a type, contract, or schema?
  └─ YES → chora/stroma/ (compile-time structure)

Does it need to flow everywhere?
  ├─ Logging/Events? → chora/aither/ (divine flows)
  └─ Configuration? → chora/phaneron/ (visible state)

Is it discrete business logic?
  └─ YES → organa/{name}/ (bounded organ)

Are you wiring everything together?
  └─ YES → psychon/ (the soul/wiring layer)
```

## Code Examples

### ✅ CORRECT Patterns

```typescript
// chora/stroma/contracts/search.ts - Structural contract
export interface SearchService {
  search(query: string): Promise<Result[]>;
}

// chora/aither/logging/index.ts - Pervasive logger
export function createLogger(context: string): Logger {
  // Logger that flows through everything
}

// chora/phaneron/config/index.ts - Configuration
export interface Config {
  notionApiKey: string;
  logLevel: LogLevel;
}

// organa/notion/index.ts - Discrete organ
export function createNotionOperations(deps: {
  logger: Logger; // From aither
  config: Config; // From phaneron
}): NotionOperations {
  // Business logic, no imports from other organa
}

// psychon/wiring.ts - Dependency injection
import { createLogger } from './chora/aither/logging/index.js';
import { createConfig } from './chora/phaneron/config/index.js';
import { createNotionOperations } from './organa/notion/index.js';
import { createMcpServer } from './organa/mcp/index.js';

export class Psychon {
  constructor() {
    const logger = createLogger('psychon');
    const config = createConfig();

    const notion = createNotionOperations({ logger, config });
    const mcp = createMcpServer({
      logger,
      config,
      notionOperations: notion, // Dependency injection
    });
  }
}
```

### ❌ INCORRECT Patterns

```typescript
// ❌ Cross-organ import
// organa/mcp/handler.ts
import { searchService } from '../notion/search.js';

// ❌ Runtime code in stroma
// chora/stroma/helpers.ts
export function processData() {
  /* runtime logic */
}

// ❌ Treating chorai like singletons
// chora/aither/logging/singleton.ts
export const logger = new Logger();

// ❌ Business logic in chorai
// chora/aither/notion-logger.ts
export function logNotionPage(page: Page) {
  /* too specific */
}
```

## Import Rules

### Allowed Imports ✅

```typescript
// Chorai can import from same chora field
import { LogLevel } from '../types.js'; // within aither

// Organa can import from any chora
import { Logger } from '../../chora/aither/logging/index.js';
import { Config } from '../../chora/phaneron/config/index.js';
import type { Contract } from '../../chora/stroma/contracts/index.js';

// Psychon can import from anywhere
import { createNotionOperations } from './organa/notion/index.js';
import { createLogger } from './chora/aither/logging/index.js';
```

### Forbidden Imports ❌

```typescript
// ❌ Cross-organ imports
// organa/notion/ → organa/mcp/

// ❌ Upward imports
import { something } from '../../../other.js';

// ❌ Deep imports (use public APIs)
import { internal } from './chora/aither/logging/internal/helper.js';
```

## The 91 Warnings as Insights

Those relative import warnings? They're architectural truth detectors:

- **Cross-organ attempts**: Show where organs want to communicate
- **Upward reaches**: Reveal missing abstractions
- **Deep coupling**: Indicate unclear boundaries

After implementing biological architecture, these warnings guide us to natural boundaries.

## Biological Principles

1. **Chorai are fields** - Like electromagnetic fields, they pervade everything
2. **Organa are discrete** - Like organs in a body, clear boundaries
3. **No organ-to-organ imports** - Heart doesn't import from liver
4. **Psychon integrates** - Like consciousness emerges from parts
5. **Greek clarity** - Each term has ONE precise meaning

## Migration Strategy

### Current State

```
src/
├── mixed concerns
├── substrate/systems/organa confusion
└── 91 relative import warnings
```

### Target State

```
src/
├── index.ts        # Entry point
├── psychon/        # The soul/wiring layer
│   ├── index.ts    # Orchestration
│   ├── wiring.ts   # Dependency injection
│   └── server.ts   # Server setup
├── chora/          # Pervasive fields
│   ├── stroma/     # Types, contracts (compile-time)
│   ├── aither/     # Logging, events (runtime flows)
│   └── phaneron/   # Configuration (visible state)
└── organa/         # Discrete organs
    ├── notion/     # Notion integration
    └── mcp/        # MCP server
```

## Common Questions

**Q: Is configuration a chora or organon?**  
A: Chora (phaneron) - it needs to be accessible everywhere

**Q: Where do utilities go?**  
A: If pure functions → organelles within appropriate organ/chora  
If cross-cutting → create appropriate chora subdivision

**Q: How do organs communicate?**  
A: Through dependency injection in psychon OR events via aither

**Q: What about errors and exceptions?**  
A: Error types → stroma, error handling → appropriate organ/chora

## Remember

1. **Greek terms = precision** - No ambiguity about what goes where
2. **Chorai flow, organa bound** - Fundamental distinction
3. **Warnings guide architecture** - Listen to what code wants
4. **Psychon emerges** - The whole is greater than parts

## Scientific Foundation

This isn't arbitrary - it's based on:

- Complex systems theory (heterogeneity = stability)
- Biological organization (real organisms have this structure)
- Empirical validation across domains

See [ADR-020](../architecture/architectural-decisions/020-biological-architecture.md) for philosophical grounding.
