# Eidola (Εἴδωλα) - Phantoms and Simulacra

**Etymology**: From Greek εἴδωλον (eídōlon) meaning "phantom", "image", or "simulacrum"

**Philosophical Heritage**: In ancient Greek thought, eidola were phantom images - the thin films of atoms that flew off objects and entered our eyes, creating vision. Plato used the term for the shadows on the cave wall - mere images of reality.

## Why Eidola?

We chose Eidola for our testing infrastructure because test doubles are:

- **Phantoms of Reality**: They look like real components but aren't alive
- **Simulacra**: Copies that simulate without truly being
- **Shadows on the Wall**: Simplified projections of complex reality
- **Non-Living Images**: They mirror life without possessing it

## What Haunts Here

The phantoms that help us test the living organism:

- **factories.ts** - Functions that conjure mock objects from nothing
- **notion-mocks.ts** - Phantom Notion objects that pretend to be real
- **notion-api-mocks.ts** - Spectral API responses that never touched a network

## Architectural Principles

1. **Parallel Existence**: Eidola exist alongside reality, not within it
2. **No Production Use**: These phantoms vanish when the organism awakens
3. **Perfect Mimicry**: They must fool the code that uses them
4. **Simplified Essence**: Capture just enough reality to be useful

## The Phantom Nature

Like the eidola in ancient atomism that allowed vision by carrying images through the air, our test eidola:

- Carry simplified images of complex components
- Allow us to "see" how our code behaves
- Are substanceless - mere appearances
- Enable testing by providing controllable phantoms

In Plato's cave, the prisoners mistake shadows (eidola) for reality. In our tests, our code interacts with these shadows, allowing us to verify behavior without the complexity and unpredictability of real external systems.

The eidola are not alive, but they allow us to test life.

## 🗺️ Developer Quick Reference

**You're looking for test mocks, stubs, and fixtures!**

| What you need      | Where to find it      | Example                        |
| ------------------ | --------------------- | ------------------------------ |
| Mock a logger      | `factories.ts`        | `createMockLogger()`           |
| Mock Notion client | `factories.ts`        | `createMockNotionOperations()` |
| Create test pages  | `notion-mocks.ts`     | `createMockPage()`             |
| Mock API responses | `notion-api-mocks.ts` | `createMockSearchResponse()`   |

### Common Imports

```typescript
// Factory functions
import {
  createMockLogger,
  createMockServerConfig,
  createMockNotionOperations,
} from '@chora/eidola';

// Notion object mocks
import {
  createMockPage,
  createMockDatabase,
  createMockPersonUser,
  createMockBotUser,
} from '@chora/eidola';

// API response mocks
import { createMockListUsersResponse, createMockSearchResponse } from '@chora/eidola';
```

### Quick Examples

```typescript
// In your test file
import { createMockLogger, createMockPage } from '@chora/eidola';

describe('MyComponent', () => {
  it('should handle pages', () => {
    const mockLogger = createMockLogger();
    const mockPage = createMockPage({
      properties: {
        title: { title: [{ plain_text: 'Test Page' }] },
      },
    });

    // Use your mocks in tests
    expect(mockPage.properties.title).toBeDefined();
  });
});
```

💡 **Remember**: Eidola are phantoms - they exist only in tests, never in production code!
