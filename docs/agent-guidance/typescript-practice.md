# TypeScript Practice

## General

- NEVER disable type checking
- Never use `any`
- Never use `as` NO TYPE ASSERTIONS, NO TYPE CASTING, JUST NO.
- Only use `unknown` at the boundaries of the application
- Use type guards/predicates to narrow types (functions with the `is` keyword)
- There must be a SINGLE source of truth for each type

## External Types

- Use types from external libraries as-is, do not create substitute types in our code.

## Our Type Locations

- Define types in type files, close to where they are used.
- If a type is used in multiple locations, consider if this is signalling that a refactor is needed.

## Biological Architecture Type Organization

### Type Hierarchy

1. **Chora/Stroma** - Foundational types and contracts
   - All shared types, interfaces, and contracts
   - No runtime code, compile-time only
   - Available to all layers

2. **Chora/Aither & Phaneron** - Infrastructure types
   - Logger interfaces, event schemas, config types
   - Can reference stroma types

3. **Organa** - Business logic types
   - Domain-specific types for each organ
   - Can reference chora types
   - NEVER reference types from other organa

4. **Psychon** - Assembly types
   - Types for wiring and dependency injection
   - Can reference all layers

### Example Type Organization

```typescript
// chora/stroma/contracts/search.ts
export interface SearchService {
  search(query: string): Promise<SearchResult[]>;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
}

// chora/aither/logging/types.ts
import type { LogLevel } from '../../stroma/types/logging.js';

export interface Logger {
  log(level: LogLevel, message: string, context?: unknown): void;
}

// organa/notion/types.ts
import type { SearchResult } from '../../chora/stroma/contracts/search.js';
import type { Page } from '@notionhq/client'; // External type used as-is

export interface NotionSearchResult extends SearchResult {
  notionPageId: string;
  lastEditedTime: Date;
}
```

## Our Type Definitions

- Define runtime constants with `as const`
- Use those constants to define types
- Use those constants to create type predicate functions

### Example

```typescript
const ALLOWED_COLORS = ['red', 'green', 'blue'] as const;
type AllowedColor = (typeof ALLOWED_COLORS)[number];

function isAllowedColor(color: string): color is AllowedColor {
  const stringAllowedColors: readonly string[] = ALLOWED_COLORS;
  return stringAllowedColors.includes(color);
}
```

## Import Patterns for Biological Architecture

### Correct Import Examples

```typescript
// ✅ Organa importing from chora
// organa/notion/client.ts
import type { Logger } from '../../chora/aither/logging/types.js';
import type { Config } from '../../chora/phaneron/config/types.js';
import type { NotionContract } from '../../chora/stroma/contracts/notion.js';

// ✅ Chora importing within same field
// chora/aither/events/emitter.ts
import type { EventSchema } from '../types.js';

// ✅ Psychon importing from all layers
// psychon.ts
import type { Logger } from './chora/aither/logging/types.js';
import type { NotionOperations } from './organa/notion/types.js';
import type { McpServer } from './organa/mcp/types.js';
```

### Incorrect Import Examples

```typescript
// ❌ Cross-organ import
// organa/mcp/handler.ts
import type { NotionClient } from '../notion/client.js';

// ❌ Upward import
// chora/aither/logging/formatter.ts
import type { AppConfig } from '../../../config.js';

// ❌ Deep import into internals
// organa/notion/service.ts
import type { InternalHelper } from '../../chora/aither/logging/internal/helper.js';
```

## Our Type Validation at External Boundaries

- At external boundaries such as network API calls, database calls, file system calls, etc., validate incoming data using Zod.
- Once validated at the boundary, use the validated types throughout the internal system
- This creates a trusted zone where types are guaranteed to be correct

### Biological Architecture Validation Pattern

```typescript
// chora/stroma/schemas/notion-page.ts
import { z } from 'zod';

export const NotionPageSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  lastEditedTime: z.string().datetime(),
});

export type NotionPage = z.infer<typeof NotionPageSchema>;

// organa/notion/api-client.ts
import { NotionPageSchema } from '../../chora/stroma/schemas/notion-page.js';

export async function fetchPage(id: string): Promise<NotionPage> {
  const response = await fetch(`/pages/${id}`);
  const data = await response.json();

  // Validate at the boundary
  return NotionPageSchema.parse(data);
  // After this point, NotionPage type is trusted
}
```
