# Biological Architecture Guide for AI Agents

**THIS IS THE AUTHORITATIVE ARCHITECTURAL REFERENCE FOR AI AGENTS**

## Executive Summary

This codebase implements a **Biological Architecture with Greek Nomenclature**. We model software as a living organism with:

- **Chora (Χώρα)**: Cross-cutting fields that pervade everything
- **Organa (Ὄργανα)**: Discrete, bounded organs with specific functions
- **Psychon (Ψυχόν)**: The ensouled whole that brings everything to life

This is not metaphor - it's mathematically grounded in complex systems theory. The Greek terms eliminate confusion and create precise architectural boundaries.

## Quick Reference

When working with code, ask yourself:

1. **Is this cross-cutting or discrete?**
   - Cross-cutting → Goes in `chora/`
   - Discrete → Goes in `organa/`

2. **For cross-cutting concerns, what type?**
   - Types/contracts → `chora/stroma/`
   - Logging/events → `chora/aither/`
   - Configuration → `chora/phaneron/`

3. **For discrete components:**
   - Each organ in `organa/` must have NO imports from other organs
   - Communication happens via dependency injection

## Philosophical Grounding

### Why Greek Nomenclature?

1. **Precision**: Each Greek term has specific philosophical meaning
2. **No Baggage**: Unlike "system", "service", "component" which mean too many things
3. **Cognitive Distance**: Foreign terms force clear thinking

### The Living System Model

Software is not a machine - it's a living organism:

- It grows and evolves
- It has natural boundaries (membranes)
- Components cooperate like organs
- Infrastructure flows like blood/nerves

## Detailed Architecture

### Chora - Cross-Cutting Fields

**Definition**: Infrastructure that pervades the entire system, cannot be contained.

#### Stroma (Στρῶμα) - Structural Matrix

- Location: `chora/stroma/` (currently `substrate/`)
- Contains: Types, contracts, schemas
- Nature: Compile-time only, zero runtime code
- Example: Interface definitions, type declarations

#### Aither (Αἰθήρ) - Divine Flows

- Location: `chora/aither/` (currently `systems/logging/`, `systems/events/`)
- Contains: Logging, event propagation
- Nature: Flows throughout like nervous system
- Example: Logger that every component uses

#### Phaneron (Φανερόν) - Visible Manifestation

- Location: `chora/phaneron/` (currently `systems/config/`)
- Contains: Runtime configuration
- Nature: Makes system state visible
- Example: Environment config, feature flags

### Organa - Discrete Organs

**Definition**: Bounded business logic components with specific functions.

- Location: `organa/*/`
- Current organs: `notion/`, `mcp/`
- Rules:
  - NO cross-organ imports
  - Clear public API via `index.ts`
  - Dependencies injected, not imported

### Psychon - The Ensouled Whole

**Definition**: The living application that emerges from all parts.

- Location: `psychon.ts` (future, currently missing)
- Purpose: Wires all chorai and organa together
- Nature: More than sum of parts - the life force

## Categorization Decision Tree

```text
Is this code cross-cutting (used everywhere)?
├─ YES: Goes in chora/
│   ├─ Is it compile-time structure?
│   │   └─ YES: chora/stroma/
│   ├─ Does it flow/propagate at runtime?
│   │   └─ YES: chora/aither/
│   └─ Is it runtime configuration?
│       └─ YES: chora/phaneron/
└─ NO: Goes in organa/
    └─ Create new organ with clear boundaries
```

## Examples

### Correct Patterns

```typescript
// ✅ CORRECT: Organ using injected dependencies
// organa/notion/index.ts
export function createNotionOperations(deps: { logger: Logger; config: Config }) {
  // Use injected dependencies
}
```

```typescript
// ✅ CORRECT: Chora type definition
// chora/stroma/contracts/logger.ts
export interface Logger {
  info(message: string): void;
  error(message: string, error?: Error): void;
}
```

### Incorrect Patterns

```typescript
// ❌ WRONG: Cross-organ import
// organa/mcp/handler.ts
import { notionClient } from '../notion/client.js';
// FIX: Inject notion operations via dependencies

// ❌ WRONG: Business logic in chora
// chora/aither/logging/notion-formatter.ts
function formatNotionPage(page: Page) {}
// FIX: Move to organa/notion/formatters/

// ❌ WRONG: Infrastructure in organ
// organa/notion/logger.ts
export class NotionLogger {}
// FIX: Use injected logger from chora/aither/
```

## Import Rules

1. **Chorai can import from chorai** (infrastructure builds on infrastructure)
2. **Organa CANNOT import from other organa** (organs are independent)
3. **Organa can import from chora** (organs use infrastructure)
4. **Everything can import from stroma** (types are foundational)

## For Architectural Review

When reviewing architecture:

1. **Check import directions** - Are boundaries respected?
2. **Verify categorization** - Is each component in the right place?
3. **Ensure independence** - Can organs function without each other?
4. **Validate pervasiveness** - Do chorai truly flow everywhere?

## Migration Path

Current → Target:

- `substrate/` → `chora/stroma/`
- `systems/logging/` → `chora/aither/logging/`
- `systems/events/` → `chora/aither/events/`
- `systems/config/` → `chora/phaneron/config/`
- `organs/` → `organa/` (already done)
- Create `psychon.ts` to wire everything

## References

- [ADR-020: Biological Architecture](../architecture/architectural-decisions/020-biological-architecture.md)
- [Phase 3 Implementation Plan](../../.agent/plans/phase-3-biological-architecture.md)
- [Boundary Enforcement with ESLint](../../.agent/reference/architecture/boundary-enforcement-with-eslint.md)
