# Aither (Αἰθήρ) - Divine Flows

**Etymology**: From Greek αἰθήρ (aithḗr) meaning "upper air", "pure air", or "ether"

**Mythological Heritage**: In Greek mythology, Aither was the primordial deity of the upper air - the pure essence breathed by the gods, as opposed to the normal air (ἀήρ, aer) breathed by mortals.

## Why Aither?

We chose Aither for our flowing infrastructure because these components:

- **Flow Through Everything**: Like divine breath, they permeate the entire organism
- **Carry Vital Signals**: They transport information, warnings, and events
- **Are Essential for Life**: Without these flows, the organism cannot function
- **Connect All Parts**: They enable communication across boundaries

## What Flows Here

The divine flows that animate our organism:

- **logging/** - The nervous system carrying signals throughout
- **events/** - Hormonal messaging enabling organ coordination
- **errors/** - The pain/alert system warning of problems
- **sensitive-data/** - The protective system preventing data contamination

## Architectural Principles

1. **Always Flowing**: These systems are active, not passive structures
2. **Omnipresent**: Available to every cell, tissue, and organ
3. **Life-Critical**: The organism dies without these flows
4. **Pure Infrastructure**: No business logic, only vital flows

## The Divine Nature

In ancient philosophy, aither was what separated the divine realm from the mortal. Similarly, our aither components provide the elevated infrastructure that allows our business logic (organa) to operate at a higher level, freed from mundane concerns like:

- How to format log messages
- Where to send events
- How to classify errors
- How to protect sensitive data

These divine flows handle such concerns automatically, pervasively, allowing our organs to focus on their specific functions.

## 🗺️ Developer Quick Reference

**You're looking for logging, events, error handling, and data protection!**

| What you need        | Where to find it  | Example                                     |
| -------------------- | ----------------- | ------------------------------------------- |
| Create a logger      | `logging/`        | `createConsoleLogger()`                     |
| Handle errors        | `errors/`         | `createMcpError()`, `classifyNotionError()` |
| Emit/handle events   | `events/`         | `createEventBus()`                          |
| Scrub sensitive data | `sensitive-data/` | `scrubEmail()`, `scrubSensitiveData()`      |

### Common Imports

```typescript
// Logging
import { createConsoleLogger, createContextLogger } from '@chora/aither';

// Error handling
import { createMcpError, formatErrorForUser } from '@chora/aither';

// Events
import { createEventBus } from '@chora/aither';
import type { EventBus } from '@chora/stroma'; // Note: type comes from stroma

// Data protection
import { scrubEmail, scrubSensitiveData } from '@chora/aither';
```

### Quick Examples

```typescript
// Create a logger
const logger = createConsoleLogger({ level: 'info' });

// Handle errors safely
try {
  // ... code that might fail
} catch (error) {
  const mcpError = createMcpError('INTERNAL_ERROR', 'Operation failed', error);
  logger.error('Operation failed', mcpError);
}

// Protect sensitive data
const safeData = scrubSensitiveData({ email: 'user@example.com' });
// Result: { email: 'u***@example.com' }
```

💡 **Remember**: Aither is infrastructure - it flows through everything but contains no business logic!
