# Tissue and Organ Interfaces

This document defines the interface patterns for tissues, systems, and organs in our complete biological architecture.

## Complete Hierarchy

0. **Substrate** (Foundation) - Types, contracts, event schemas
1. **Organelles** (Pure Functions) - Individual function calls
2. **Cells** (Modules) - Self-contained units with index.ts as membrane
3. **Tissues** (Related Modules) - Groups of cells working together
   4a. **Systems** (Pervasive Infrastructure) - Distributed throughout organism (logging, events, config)
   4b. **Organs** (Discrete Business Logic) - Clear boundaries (Notion, MCP, search)
4. **Organism** (Application) - The complete application
5. **Ecosystem** (Multiple Applications) - Organisms interacting via contracts

## Tissue Interfaces

### Definition

A tissue is a collection of related cells (modules) that work together to provide a cohesive set of functionality. Tissues have:

- A clear domain boundary
- Shared types and interfaces
- Coordinated behavior patterns
- A tissue-level index.ts that exports the public API

### Structure Pattern

```
src/notion/                     # Tissue boundary
├── index.ts                    # Tissue membrane (public API)
├── types.ts                    # Shared tissue types
├── formatting/                 # Cell 1
│   ├── index.ts               # Cell membrane
│   ├── formatters.ts          # Organelles
│   └── property-extractors/   # Sub-cell
├── transformers/              # Cell 2
│   ├── index.ts               # Cell membrane
│   └── *.ts                   # Organelles
└── query-building/            # Cell 3
    ├── index.ts               # Cell membrane
    └── *.ts                   # Organelles
```

### Tissue Interface Example

```typescript
// src/notion/index.ts - Tissue membrane
// Groups related cells and defines tissue-level contracts

// Re-export cell interfaces
export * from './formatting';
export * from './transformers';
export * from './query-building';

// Define tissue-level types that span cells
export interface NotionTissue {
  // Factory functions that create configured cells
  createFormatter(config: FormatterConfig): Formatter;
  createTransformer(config: TransformerConfig): Transformer;
  createQueryBuilder(config: QueryConfig): QueryBuilder;
}

// Tissue-level factory
export function createNotionTissue(deps: TissueDependencies): NotionTissue {
  return {
    createFormatter: (config) => createFormatter({ ...deps, ...config }),
    createTransformer: (config) => createTransformer({ ...deps, ...config }),
    createQueryBuilder: (config) => createQueryBuilder({ ...deps, ...config }),
  };
}
```

### Current Tissues in Codebase

1. **Logging Tissue** (`src/logging/`)
   - Cells: formatters, transports, tracing
   - Interface: Logger creation and configuration
   - Communication: Through logger instances and context

2. **Notion Tissue** (`src/notion/`)
   - Cells: formatting, transformers, query-building
   - Interface: Data transformation and query construction
   - Communication: Through shared types and function composition

3. **MCP Tissue** (`src/mcp/`)
   - Cells: tools, resources, handlers
   - Interface: Protocol implementation
   - Communication: Through MCP SDK types

## System Interfaces (Pervasive Infrastructure)

### Definition

A system is pervasive infrastructure that flows throughout the organism. Systems:

- Have no single location - they're distributed
- Provide cross-cutting concerns (logging, events, monitoring)
- Are injected differently than organs (like nerves already being in muscles)
- Form the "physiological systems" of the application

### Structure Pattern

```
src/
├── substrate/                  # Foundation layer
│   ├── event-schemas/         # Event blueprints
│   ├── contracts/             # Shared interfaces
│   └── types/                 # Core types
├── systems/                   # Pervasive infrastructure
│   ├── logging/               # Nervous system
│   │   ├── index.ts          # System API
│   │   ├── channels/         # Log channels
│   │   └── formatters/       # Log formatting
│   ├── event-transport/       # Event nervous system
│   │   ├── index.ts          # System API
│   │   ├── channels/         # Event pathways
│   │   └── routers/          # Event routing
│   └── config/               # Endocrine system
│       ├── index.ts          # System API
│       └── providers/        # Config sources
```

### System Interface Example

```typescript
// systems/logging/index.ts - Logging system (like nervous system)
export interface LoggingSystem {
  // Factory for creating loggers in different contexts
  createLogger(context: string): Logger;

  // System-wide configuration
  setLevel(level: LogLevel): void;
  addTransport(transport: Transport): void;

  // Monitoring
  getMetrics(): LogMetrics;
}

// systems/event-transport/index.ts - Event system
export interface EventTransport {
  // Create communication channels
  createChannel(name: string): EventChannel;
  createRouter(routes: RouteMap): EventRouter;

  // System management
  listChannels(): string[];
  getChannelMetrics(name: string): ChannelMetrics;
}

// Usage in organs - systems are injected
export function createNotionOrgan(deps: {
  logger: Logger; // From logging system
  events: EventChannel; // From event system
}): NotionOrgan {
  // Organ uses injected systems
}
```

### Event System: Three Facets

```typescript
// 1. EVENT SCHEMAS (Substrate) - Compile-time definitions
// substrate/event-schemas/notion-events.ts
export interface PageIndexedSchema {
  type: 'notion.page.indexed';
  pageId: string;
  timestamp: Date;
}

// 2. EVENT TRANSPORT (System) - Infrastructure
// systems/event-transport/index.ts
export interface EventChannel {
  send<T extends EventSchema>(event: T): void;
  subscribe<T extends EventSchema>(handler: (event: T) => void): void;
}

// 3. EVENT INSTANCES (Runtime) - Actual signals
// These are runtime data, not defined in code
const event: PageIndexedSchema = {
  type: 'notion.page.indexed',
  pageId: '123',
  timestamp: new Date(),
};
```

## Organ Interfaces

### Definition

An organ is a complete functional system composed of multiple tissues. Organs:

- Provide major application capabilities
- Coordinate between tissues
- Define system-level contracts
- Have clear input/output boundaries

### Structure Pattern

```
src/
├── substrate/                  # Shared foundation
│   ├── contracts/             # Organ interfaces
│   └── types/                 # Shared types
├── systems/                   # Pervasive infrastructure
│   ├── logging/
│   └── events/
├── organs/                    # Discrete business logic
│   ├── notion-organ/          # Complete Notion system
│   │   ├── index.ts          # Organ membrane (public API)
│   │   ├── tissues/          # Internal organization
│   │   │   ├── client/
│   │   │   ├── transformer/
│   │   │   └── cache/
│   │   └── internal/         # Private implementation
│   └── mcp-organ/            # Complete MCP protocol system
│       ├── index.ts          # Organ membrane
│       ├── tissues/
│       │   ├── protocol/
│       │   ├── handlers/
│       │   └── transport/
│       └── internal/
└── organism.ts               # Wires organs and systems together
```

### Organ Interface Example

```typescript
// src/notion-system/index.ts - Organ membrane
// Coordinates multiple tissues into a complete system

import { NotionTissue } from '../notion';
import { CacheTissue } from './cache';
import { ClientTissue } from './client';

export interface NotionSystem {
  // High-level operations that coordinate tissues
  search(query: string): Promise<SearchResults>;
  getPage(id: string): Promise<Page>;
  queryDatabase(id: string, filter: Filter): Promise<QueryResults>;

  // System health and management
  healthCheck(): Promise<SystemHealth>;
  clearCache(): void;
}

export function createNotionSystem(deps: SystemDependencies): NotionSystem {
  // Create tissues
  const notion = createNotionTissue(deps.notion);
  const cache = createCacheTissue(deps.cache);
  const client = createClientTissue(deps.client);

  // Wire tissues together into organ
  return {
    search: async (query) => {
      const cached = await cache.get(query);
      if (cached) return cached;

      const raw = await client.search(query);
      const formatted = notion.createFormatter().format(raw);

      await cache.set(query, formatted);
      return formatted;
    },
    // ... other methods
  };
}
```

### Current Organ Structure (Implicit)

Currently, our organs are implicit in the architecture:

1. **MCP Protocol Organ**
   - Tissues: tools, resources, transport
   - Interface: MCP server implementation
   - Location: Distributed across `src/mcp/` and `src/server.ts`

2. **Notion Integration Organ**
   - Tissues: formatting, transformers, query-building
   - Interface: Notion API operations
   - Location: `src/notion/` and `src/mcp/tools/notion-operations/`

3. **Logging System Organ**
   - Tissues: formatters, transports, tracing
   - Interface: Application-wide logging
   - Location: `src/logging/`

## Interface Patterns

### 1. Tissue-Level Patterns

```typescript
// Tissue membrane pattern
export interface TissueAPI {
  // Factory methods for creating cells
  createCell(config: CellConfig): Cell;

  // Tissue-wide operations
  coordinate(cells: Cell[]): TissueResult;

  // Events for inter-tissue communication
  on(event: TissueEvent, handler: Handler): void;
  emit(event: TissueEvent, data: any): void;
}
```

### 2. Organ-Level Patterns

```typescript
// Organ membrane pattern
export interface OrganAPI {
  // High-level business operations
  performOperation(input: Input): Promise<Output>;

  // System management
  initialize(): Promise<void>;
  shutdown(): Promise<void>;

  // Health monitoring
  getMetrics(): Metrics;
  healthCheck(): HealthStatus;
}
```

### 3. Inter-Organ Communication

```typescript
// Organs NEVER import each other directly
// Communication happens through:

// 1. Dependency injection at organism level
export function createOrganism(config: Config) {
  const logging = createLoggingSystem();
  const notion = createNotionOrgan({ logger: logging.createLogger('notion') });
  const mcp = createMCPOrgan({
    logger: logging.createLogger('mcp'),
    tools: { search: notion.search }, // Wire organs together here
  });
}

// 2. Event-based communication via systems
export interface OrganEvents {
  // Organs publish to event system
  publish(event: EventSchema): void;

  // Organs subscribe through event system
  subscribe(pattern: string, handler: EventHandler): void;
}
```

## Ecosystem Interfaces

### Definition

An ecosystem is multiple organisms (applications) interacting. Ecosystems:

- Enable horizontal scaling
- Allow independent deployment
- Communicate via contracts only
- Form distributed systems

### Structure Pattern

```
ecosystem/
├── shared-substrate/           # Shared between organisms
│   ├── contracts/             # API contracts
│   ├── event-schemas/         # Shared event types
│   └── types/                 # Common types
├── notion-mcp-organism/       # Current monolith
│   ├── substrate/             # Local substrate
│   ├── systems/               # Local systems
│   ├── organs/                # Local organs
│   └── organism.ts            # Main app
├── notion-indexer-organism/   # Separate indexing service
│   ├── substrate/
│   ├── systems/
│   ├── organs/
│   └── organism.ts
└── ecosystem.yaml            # Ecosystem configuration
```

### Ecosystem Interface Example

```typescript
// shared-substrate/contracts/indexer.ts
export interface IndexerService {
  indexPage(pageId: string): Promise<IndexResult>;
  getIndexStatus(): Promise<IndexStatus>;
}

// notion-indexer-organism/organism.ts
export function createIndexerOrganism(): IndexerService {
  // Implements the contract
}

// notion-mcp-organism/organs/notion-organ/index.ts
export function createNotionOrgan(deps: {
  indexer: IndexerService; // Injected from ecosystem
}) {
  // Uses indexer via contract
}
```

## Testing Strategies

### Testing at Each Level

| Level          | Boundary           | Testing Strategy                      |
| -------------- | ------------------ | ------------------------------------- |
| **Substrate**  | Type definitions   | Compile-time only                     |
| **Organelles** | Function signature | Pure unit tests, no mocks             |
| **Cells**      | Module exports     | Integration tests with injected mocks |
| **Tissues**    | Domain API         | Domain integration tests              |
| **Systems**    | Infrastructure API | System tests with test doubles        |
| **Organs**     | Business API       | Organ tests with mocked systems       |
| **Organism**   | Process boundary   | E2E tests                             |
| **Ecosystem**  | Network boundary   | Contract tests between organisms      |

### Example Tests

```typescript
// Substrate - Compile-time validation
type _TestSchema = AssertType<PageIndexedSchema, EventSchema>;

// Organelle - Pure unit test
describe('calculateRelevance', () => {
  it('returns score between 0 and 1', () => {
    expect(calculateRelevance('test', 'test content')).toBe(0.5);
  });
});

// Cell - Integration test
describe('ScoringCell', () => {
  it('scores documents using injected config', () => {
    const cell = createScoringCell({ boost: 1.5 });
    expect(cell.score('test', mockDoc)).toBeGreaterThan(0);
  });
});

// Tissue - Domain integration
describe('NotionTissue', () => {
  it('coordinates cells for data processing', async () => {
    const tissue = createNotionTissue(mockDeps);
    const result = await tissue.processPage(mockPage);
    expect(result).toHaveExpectedStructure();
  });
});

// System - Infrastructure test
describe('LoggingSystem', () => {
  it('routes logs to configured transports', () => {
    const system = createLoggingSystem(testConfig);
    const logger = system.createLogger('test');
    logger.info('message');
    expect(mockTransport.write).toHaveBeenCalled();
  });
});

// Organ - Business logic test
describe('NotionOrgan', () => {
  it('searches with caching', async () => {
    const organ = createNotionOrgan(mockSystems);
    await organ.search('query');
    await organ.search('query'); // Second call
    expect(mockClient.search).toHaveBeenCalledOnce();
  });
});

// Organism - E2E test
describe('MCPServer', () => {
  it('handles search requests end-to-end', async () => {
    const server = await createOrganism(e2eConfig);
    const response = await server.handleRequest({
      method: 'tools/call',
      params: { name: 'search', arguments: { query: 'test' } },
    });
    expect(response.content).toContainSearchResults();
  });
});

// Ecosystem - Contract test
describe('IndexerContract', () => {
  it('adheres to shared contract', async () => {
    const indexer = createIndexerOrganism();
    await validateContract(IndexerService, indexer);
  });
});
```

## Migration Path

### Current State → Target State

1. **Identify implicit tissues**: Group related modules that work together
2. **Create tissue interfaces**: Add tissue-level index.ts files
3. **Define organ boundaries**: Group tissues into functional systems
4. **Add organ interfaces**: Create system-level APIs
5. **Implement communication**: Add event/message passing between organs

### Example Migration

```typescript
// Before: Direct imports across boundaries
import { formatPage } from '../notion/formatters';
import { searchNotion } from '../notion/client';

// After: Use tissue/organ interfaces
import { createNotionSystem } from '../notion-system';

const notionSystem = createNotionSystem(deps);
const results = await notionSystem.search(query);
```

## Mathematical Foundation

The tissue and organ architecture is grounded in complex systems research:

### Proven Principles

1. **Heterogeneity Creates Stability** (Meena et al., 2023)
   - Different architectural patterns for systems vs organs isn't inconsistency - it's mathematically optimal
   - Systems with diverse interaction patterns are more stable than homogeneous ones

2. **Operating at Criticality** (Beggs & Plenz, 2003; Schoenholz et al., 2017)
   - Like the brain, software systems perform best at the edge of chaos
   - Too rigid = brittle; too loose = unpredictable
   - The sweet spot maximizes both stability and adaptability

3. **Early Warning Signals** (Scheffer et al., 2009)
   - Systems approaching transitions show increasing autocorrelation and variance
   - Our import warnings and coupling metrics are such signals
   - They indicate where the architecture naturally wants boundaries

4. **Cross-Disciplinary Validation**
   - These principles work in ecology (biodiversity), neuroscience (brain networks), and ML (deep learning)
   - The same mathematics that governs ecosystem stability applies to software architecture

## Best Practices

### Tissue Design

1. Keep tissues focused on a single domain
2. Define clear tissue boundaries with index.ts
3. Share types within tissue, not across
4. Use dependency injection for external dependencies

### Organ Design

1. Organs should be independently deployable
2. Define clear input/output contracts
3. Handle failures gracefully at organ boundaries
4. Monitor organ health independently

### Communication

1. Use events for loose coupling between organs
2. Define clear message schemas
3. Handle async communication patterns
4. Plan for organ failure/recovery

## Conclusion

This document defines how tissues and organs should be structured and interfaced in our cellular architecture. The key principles are:

- **Tissues** group related cells and provide domain-specific APIs
- **Organs** coordinate tissues into complete functional systems
- **Interfaces** at each level provide clear contracts and boundaries
- **Communication** happens through well-defined patterns
- **Testing** validates behavior at each scale

As we evolve the architecture, we'll progressively introduce these patterns while maintaining backward compatibility.
