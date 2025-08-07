# Target Architecture: The Evolved MCP Ecosystem

*This document describes the target architecture for the Oak MCP ecosystem - a biologically-inspired, multi-organism system with clear separation of concerns and optimal runtime adaptation.*

## Core Insight

The fundamental tension we discovered: different kinds of shared code want to live in different places. The current monolithic `oak-mcp-core` tries to be three things simultaneously:
1. **Pure abstractions** (interfaces, types, algorithms) - truly generic, no IO
2. **Runtime capabilities** (env loading, file access) - need IO but are generic  
3. **Development conveniences** (dotenv loading, config helpers) - opinionated shared patterns

This violates the Single Responsibility Principle at the package level and creates architectural tension.

## The Resolution: Three Biological Categories

Our target architecture recognizes three distinct biological categories, each with its own directory and purpose:

### 1. Morphai (μορφαί) - Pure Forms
**Location**: `ecosystem/morphai/`  
**Package**: `@oaknational/mcp-morphai`  
**Nature**: Pure genetic information - the Platonic forms that define what things ARE  
**Contents**: 
- Abstract interfaces (Logger, StorageProvider, EventBus)
- Type definitions (pure TypeScript types)
- Abstract patterns (Tool, Handler, Registry)
- Pure algorithms (validation, parsing, transformation)
- No runtime code, no dependencies, no IO

### 2. Organa (ὄργανα) - Transplantable Organs  
**Location**: `ecosystem/organa/`  
**Packages**: 
- `@oaknational/mcp-organ-logger`
- `@oaknational/mcp-organ-storage`  
- `@oaknational/mcp-organ-env`
- `@oaknational/mcp-organ-transport` (stdio for local, Streamable HTTP for remote - NOT SSE which is deprecated)
- (more organs as needed)

**Nature**: Adaptive implementations that can work in different host organisms  
**Key Features**:
- Each organ can adapt to its runtime environment (Node.js, Edge, Browser)
- Tree-shakeable through conditional exports and dynamic imports
- Ships with its own types (concrete implementations)
- Implements interfaces from morphai
- Can be "transplanted" into any organism

### 3. Psycha (ψυχά) - Living Organisms
**Location**: `ecosystem/psycha/`  
**Packages**:
- `@oaknational/notion-mcp-server`
- `@oaknational/github-mcp-server` (future)
- `@oaknational/slack-mcp-server` (future)

**Nature**: Complete, living applications - the ensouled wholes  
**Composition**:
- Uses abstract forms from morphai
- Incorporates transplantable organs from organa
- Has its own internal organs (business logic)
- Has its own chora (local infrastructure)
- Lives in a specific runtime environment

## Complete Directory Structure

```
oak-notion-mcp/                           # Repository root
└── ecosystem/                            # The biosphere
    ├── morphai/                          # Pure forms (Platonic abstractions)
    │   └── @oaknational/mcp-morphai/     # The pure patterns package
    │       ├── src/
    │       │   ├── interfaces/           # Abstract contracts
    │       │   │   ├── Logger.ts
    │       │   │   ├── StorageProvider.ts
    │       │   │   ├── EnvironmentProvider.ts
    │       │   │   └── EventBus.ts
    │       │   ├── patterns/             # Morphai - abstract patterns
    │       │   │   ├── Tool.ts           # What IS a tool (essence)
    │       │   │   ├── Handler.ts        # What IS a handler
    │       │   │   └── Registry.ts       # What IS a registry
    │       │   ├── algorithms/           # Pure functions
    │       │   │   ├── validation/       # Pure validation logic
    │       │   │   ├── parsing/          # Pure parsing functions
    │       │   │   └── transformation/   # Pure transformers
    │       │   └── types/                # Pure TypeScript types
    │       └── package.json
    │
    ├── organa/                            # Transplantable organs (plural)
    │   ├── @oaknational/mcp-organ-logger/
    │   │   ├── src/
    │   │   │   ├── node.ts               # Node-specific implementation
    │   │   │   ├── edge.ts               # Edge-specific implementation
    │   │   │   ├── adaptive.ts           # Runtime detection & routing
    │   │   │   ├── shared/               # Shared code (like Consola usage)
    │   │   │   │   └── console.ts
    │   │   │   └── types.ts              # Concrete types for this organ
    │   │   ├── package.json              # With conditional exports
    │   │   └── tsconfig.json
    │   │
    │   ├── @oaknational/mcp-organ-storage/
    │   │   ├── src/
    │   │   │   ├── node.ts               # FileSystem-based storage
    │   │   │   ├── edge.ts               # KV store-based storage
    │   │   │   ├── adaptive.ts           # Runtime detection
    │   │   │   └── types.ts
    │   │   └── package.json
    │   │
    │   ├── @oaknational/mcp-organ-env/
    │   │   ├── src/
    │   │   │   ├── node.ts               # process.env + dotenv
    │   │   │   ├── edge.ts               # Context-based env vars
    │   │   │   ├── adaptive.ts           # Runtime detection
    │   │   │   └── types.ts
    │   │   └── package.json
    │   │
    │   └── @oaknational/mcp-organ-transport/
    │       ├── src/
    │       │   ├── stdio.ts              # Local subprocess transport
    │       │   ├── http-streamable.ts    # Remote Streamable HTTP (NOT SSE)
    │       │   ├── session.ts            # Session management for stateful remote
    │       │   ├── adaptive.ts           # Transport selection based on config
    │       │   └── types.ts
    │       └── package.json
    │
    └── psycha/                            # Living organisms (plural)
        └── @oaknational/notion-mcp-server/
            ├── src/
            │   ├── psychon/               # The soul - wiring & orchestration
            │   │   ├── index.ts           # Entry point
            │   │   ├── wiring.ts          # Dependency injection
            │   │   └── server.ts          # Main server setup
            │   ├── organa/                # Internal organs (business logic)
            │   │   ├── notion/            # Notion-specific logic
            │   │   │   ├── client.ts
            │   │   │   ├── search/
            │   │   │   └── query/
            │   │   └── mcp/               # MCP protocol handling
            │   │       ├── handlers/
            │   │       └── resources/
            │   └── chora/                 # Local infrastructure
            │       └── (phenotype-specific extensions)
            └── package.json
```

## Package Configuration for Tree-Shaking

### Transplantable Organ Package.json Example

```json
{
  "name": "@oaknational/mcp-organ-logger",
  "version": "1.0.0",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/types.d.ts",
      "node": {
        "import": "./dist/node.mjs",
        "require": "./dist/node.cjs"
      },
      "edge-light": "./dist/edge.mjs",
      "worker": "./dist/edge.mjs",
      "browser": "./dist/edge.mjs",
      "default": "./dist/adaptive.mjs"
    },
    "./node": {
      "types": "./dist/types.d.ts",
      "import": "./dist/node.mjs"
    },
    "./edge": {
      "types": "./dist/types.d.ts",
      "import": "./dist/edge.mjs"
    }
  },
  "dependencies": {
    "@oaknational/mcp-morphai": "workspace:^",
    "consola": "^3.0.0"
  },
  "devDependencies": {
    "dotenv": "^16.5.0"
  }
}
```

## Runtime Adaptation Patterns

### Pattern 1: Automatic Runtime Detection
```typescript
import { createLogger } from '@oaknational/mcp-organ-logger';
const logger = await createLogger(); // Automatically detects Node vs Edge
```

### Pattern 2: Explicit Runtime Selection
```typescript
import { createLogger } from '@oaknational/mcp-organ-logger/node';
const logger = createLogger(); // Forces Node implementation, edge code tree-shaken
```

### Pattern 3: Bundler Configuration
```javascript
// vite.config.js
export default {
  resolve: {
    conditions: ['edge-light'] // Forces edge versions for all packages
  }
}
```

## Key Architectural Properties

### 1. Clear Separation of Concerns
- **Morphai**: What things ARE (ontology)
- **Organa**: How things WORK (implementation)  
- **Psycha**: What things DO (application)

### 2. Runtime Adaptation, Not Degradation
Edge runtimes aren't "limited" - they have different capabilities:
- **Node.js**: `fs`, `process.env`, `AsyncLocalStorage`, `EventEmitter`
- **Edge**: `KV Store`, `env context`, `AsyncLocalStorage`, `EventTarget`

Organs adapt to use the available capabilities, not degrade to lowest common denominator.

### 3. Tree-Shaking Through Dynamic Imports
```typescript
// Only the needed runtime is included in the final bundle
if (typeof process !== 'undefined' && process.versions?.node) {
  const { NodeLogger } = await import('./node.js');
  return new NodeLogger();
} else {
  const { EdgeLogger } = await import('./edge.js');
  return new EdgeLogger();
}
```

### 4. Type Safety Across Environments
All organs implement the same interfaces from morphai, ensuring type safety regardless of runtime:
```typescript
// Both NodeLogger and EdgeLogger implement this
interface Logger {
  info(message: string): void;
  error(message: string): void;
}
```

### 5. Consumer Responsibility for IO
The organism (psychon) is responsible for choosing its environment and wiring IO, while organs provide the capabilities.

## Biological Metaphor Alignment

### The Complete Biological Model

1. **Morphai = DNA/Genome**
   - Pure information, instructions, potential
   - No implementation, just patterns

2. **Transplantable Organs = Universal Organs**
   - Like organs that can work in different species (xenotransplantation)
   - Adapt to their host environment
   - Can be shared across organisms

3. **Psycha = Complete Organisms**
   - Living, breathing applications
   - Composed of selected organs
   - Live in specific environments

### Phenotypic Plasticity
The adaptive organs demonstrate phenotypic plasticity - the same genetic code (interface) expressing differently based on environment (runtime).

## Benefits of This Architecture

### 1. Technical Benefits
- **Optimal bundle sizes** through tree-shaking
- **Zero configuration** in most cases (automatic runtime detection)
- **Full control** when needed (explicit imports)
- **Type safety** across all environments
- **Clean dependency graph** - no circular dependencies possible

### 2. Organizational Benefits  
- **Clear ownership** - each package has single responsibility
- **Independent deployment** - organs can be versioned separately
- **Parallel development** - teams can work on different organs
- **Easy testing** - each organ is self-contained

### 3. Philosophical Coherence
- **Aligns with biological model** perfectly
- **Follows Greek nomenclature** consistently  
- **Resolves architectural tensions** completely
- **Enables future evolution** naturally

## Package Naming Convention

All packages follow conventional naming for discoverability:
- Organization: `@oaknational`
- Morphai: `@oaknational/mcp-morphai`
- Organs: `@oaknational/mcp-organ-{name}`
- Organisms: `@oaknational/{service}-mcp-server`

## Transport Architecture for Remote Servers

### Local vs Remote Deployment

1. **Local MCP Servers** (Current Implementation)
   - Run as subprocess via stdio transport
   - Configured in `.mcp.json` with command/args
   - Direct process communication
   - No network overhead

2. **Remote MCP Servers** (Future Implementation)
   - Deployed to edge runtimes (Cloudflare Workers, Vercel Edge, etc.)
   - Communicate via Streamable HTTP transport
   - **IMPORTANT**: SSE (Server-Sent Events) transport is DEPRECATED
   - Require session management for stateful operations
   - Support both stateless and stateful modes

### Transport Organ Design

The `@oaknational/mcp-organ-transport` provides adaptive transport implementations:

```typescript
// Automatic transport selection based on config
import { createTransport } from '@oaknational/mcp-organ-transport';

const transport = await createTransport({
  type: 'auto',  // Detects from config
  config: {
    // For local: command and args
    // For remote: endpoint URL and auth
  }
});
```

### Session Management for Remote Servers

Remote servers may require session management for stateful operations:

```typescript
interface RemoteSession {
  id: string;
  endpoint: URL;
  auth?: AuthConfig;
  state?: SessionState;
  heartbeat?: HeartbeatConfig;
}
```

## Future Evolution Paths

This architecture naturally supports:
1. **New organisms** - Just create new psycha using existing organs
2. **New organs** - Add transplantable capabilities all organisms can use
3. **New runtimes** - Add new adaptations to existing organs (e.g., Deno)
4. **Ecosystem growth** - Multiple organisms sharing organs in the biosphere
5. **Deployment flexibility** - Same organism can run locally or remotely

## Critical Success Factors

1. **Maintain strict boundaries** - No cross-organism imports
2. **Keep morphai pure** - No runtime code in abstractions
3. **Ensure tree-shaking** - Use dynamic imports and conditional exports
4. **Document adaptation** - Clear docs on how organs adapt
5. **Version carefully** - Organs are shared dependencies

## Summary

This target architecture resolves the fundamental tension by recognizing three distinct categories of code (morphai, organa, psycha) and giving each its proper place in a biologically-coherent ecosystem. The result is an architecture that is:
- **Philosophically coherent** with our biological model
- **Technically optimal** with tree-shaking and runtime adaptation
- **Organizationally scalable** with clear boundaries and responsibilities
- **Future-ready** for ecosystem growth and evolution

The key insight: **Different kinds of shared code want to live in different places**, and by acknowledging this truth, we achieve a tension-free, elegant architecture that feels natural and right.