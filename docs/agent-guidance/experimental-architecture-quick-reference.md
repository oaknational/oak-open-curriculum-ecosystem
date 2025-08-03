# Experimental Architecture Quick Reference

## Complete Biological Model

### Architecture Scales

```
0. Substrate (Foundation) - Types, contracts, event schemas
1. Organelles (Pure Functions) - No side effects, single responsibility
2. Cells (Modules) - Self-contained with membrane (index.ts)
3. Tissues (Domain Groups) - Related cells working together
4. Systems (Pervasive) - Infrastructure like logging (everywhere)
5. Organs (Discrete) - Business logic with clear boundaries
6. Organism (Application) - Complete app wiring everything together
7. Ecosystem (Multiple Apps) - Organisms interacting via contracts
```

### Key Distinctions

**Systems vs Organs**

- **Systems** (logging, events): Flow everywhere, no single location
- **Organs** (Notion, MCP): Discrete boundaries, specific location

**Substrate vs Runtime**

- **Substrate**: Types, contracts, schemas - compile-time only
- **Runtime**: Actual code that executes

## When Writing Code

### ✅ DO

```typescript
// Define types in substrate
// substrate/types/search.ts
export interface SearchQuery { /* ... */ }

// Create systems that flow everywhere
// systems/logging/index.ts
export function createLoggingSystem() {
  return { createLogger: (context) => /* ... */ };
}

// Build organs with clear boundaries
// organs/notion/index.ts
export function createNotionOrgan(deps: {
  logger: Logger;  // From system
  events: EventChannel;  // From system
}) {
  // Organ implementation
}

// Wire in organism
// organism.ts
const logging = createLoggingSystem();
const notion = createNotionOrgan({
  logger: logging.createLogger('notion')
});
```

### ❌ DON'T

```typescript
// Don't import across organs
import { searchService } from '../mcp-organ'; // ❌

// Don't put runtime code in substrate
// substrate/types/helper.ts
export function processData() {
  /* ... */
} // ❌

// Don't treat systems like organs
// systems/logging/singleton.ts
export const logger = new Logger(); // ❌
```

## Quick Decision Guide

**Q: Where does this type/contract go?**  
A: In `substrate/` - it's the physics everyone follows

**Q: Is this infrastructure that needs to be everywhere?**  
A: Make it a system in `systems/` with pervasive injection

**Q: Is this business logic with clear boundaries?**  
A: Make it an organ in `organs/` with no cross-organ imports

**Q: How do organs communicate?**  
A: Through events (via event system) or dependency injection at organism level

**Q: Should I fix relative import warnings?**  
A: They're showing you architectural boundaries - use them as guides

## Architecture Patterns

### Substrate Pattern

```typescript
// substrate/contracts/search.ts
export interface SearchService {
  search(query: string): Promise<Result[]>;
}

// substrate/event-schemas/notion.ts
export interface PageIndexedSchema {
  type: 'notion.page.indexed';
  pageId: string;
}
```

### System Pattern

```typescript
// systems/logging/index.ts
export interface LoggingSystem {
  createLogger(context: string): Logger;
  setLevel(level: LogLevel): void;
}

// Injected pervasively throughout organs
```

### Organ Pattern

```typescript
// organs/notion/index.ts
export function createNotionOrgan(deps: {
  // Systems injected
  logger: Logger;
  events: EventChannel;
  // Other organs NEVER imported
}): NotionOrgan {
  // Clear boundary - no imports from other organs
}
```

### Event Communication

```typescript
// Events have three facets:

// 1. Schema (substrate)
interface PageIndexedSchema {
  /* ... */
}

// 2. Transport (system)
const events = createEventTransport();

// 3. Instance (runtime)
events.send({ type: 'page.indexed', pageId: '123' });
```

## Biological Principles

1. **Substrate is shared** - Like physics, available everywhere
2. **Systems are pervasive** - Like blood vessels, flow everywhere
3. **Organs are discrete** - Like heart/liver, clear boundaries
4. **No organ-to-organ imports** - Communication via organism
5. **Events are multi-level** - Schema + transport + instances
6. **Same patterns at every scale** - Fractal architecture

## Migration Strategy

### Current State

- Mixed concerns in src/
- 103 relative import warnings
- No clear system/organ distinction

### Target State

```
src/
├── substrate/      # Foundation (compile-time)
├── systems/        # Pervasive infrastructure
├── organs/         # Discrete business logic
└── organism.ts     # Wiring point
```

### Phase 3 Goals

1. Extract substrate (types, contracts, schemas)
2. Separate systems (logging, events, config)
3. Organize organs (notion, mcp)
4. Wire in organism.ts

## Remember

1. **Biological accuracy matters** - Real organisms have both systems AND organs
2. **Heterogeneity = Stability** - Different patterns in different contexts is good
3. **Let warnings guide you** - They show natural boundaries
4. **Think in scales** - Apply same principles from functions to ecosystems
5. **Events enable evolution** - Loose coupling allows change

## The 103 Warnings

Those relative import warnings? They're architectural truth detectors showing where boundaries naturally want to form. After Phase 3's biological restructuring, most will disappear naturally.

## Scientific Foundation

This architecture isn't just intuition - it's based on:

- **Mathematical proof** that heterogeneity creates stability (Meena et al., 2023)
- **Empirical evidence** from neuroscience showing brains operate at criticality (Beggs & Plenz, 2003)
- **Universal patterns** of early warning signals in complex systems (Scheffer et al., 2009)

See `.agent/reference/complex-systems-dynamics/` for the research papers that validate our approach.
