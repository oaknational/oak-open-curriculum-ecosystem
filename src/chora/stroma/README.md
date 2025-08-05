# Stroma (Στρῶμα) - Structural Matrix

**Etymology**: From Greek στρῶμα (strôma) meaning "layer", "bed", or "structural foundation"

**Biological Heritage**: In biology, stroma is the supportive tissue or matrix - the structural framework that holds everything together (e.g., the stroma of the eye, the stroma in plant cells).

## Why Stroma?

We chose Stroma for our structural components because they:

- **Provide Foundation**: The bedrock on which all behavior is built
- **Define Structure**: Types, contracts, and schemas shape what can exist
- **Support Everything**: Like connective tissue, they hold the organism together
- **Are Purely Structural**: They contain no behavior, only form

## What Structures Here

The structural matrix of our organism:

- **types/** - Pure type definitions that shape data flow
- **contracts/** - Interface definitions that define capabilities
- **schemas/** - Structural schemas for validation and shape

## Architectural Principles

1. **Zero Runtime Code**: Stroma is purely compile-time structure
2. **Universal Foundation**: Every component builds on this matrix
3. **Immutable Structure**: These define the physics of our system
4. **Pure Definitions**: No logic, no behavior, only structure

## The Matrix Nature

Like the extracellular matrix in biology that provides structural and biochemical support, our stroma:

- Defines what shapes data can take (types)
- Establishes how components connect (contracts)
- Validates structural integrity (schemas)

Without stroma, our organism would collapse into an untyped, unstructured mass. The stroma provides the rigid framework that allows the fluid aither to flow in organized channels, and gives organs their defined shapes and interfaces.

## 🗺️ Developer Quick Reference

**You're looking for types, contracts, and schemas!**

| What you need         | Where to find it | Example                         |
| --------------------- | ---------------- | ------------------------------- |
| Core type definitions | `types/`         | `LogLevel`, `Dependencies`      |
| Interface contracts   | `contracts/`     | `Logger`, `NotionOperations`    |
| Event schemas         | `event-schemas/` | Event definitions (coming soon) |

### Common Imports

```typescript
// Types
import type { CoreDependencies, MinimalNotionClient } from '@chora/stroma';

// Contracts
import type { Logger, EventBus, NotionOperations } from '@chora/stroma';

// Type utilities
import { isLogLevel, getLogLevelValue } from '@chora/stroma';
```

### What Goes Where?

- **Need a new type?** → Add to `types/`
- **Defining an interface?** → Add to `contracts/`
- **Creating event types?** → Add to `event-schemas/`

💡 **Remember**: Stroma is compile-time only - no runtime code, no logic, just pure structure!
