# Plan 15a: Public Resource Authentication Bypass

> **Status**: Ready for implementation  
> **Prerequisite**: None  
> **Follow-up**: Plan 15b (Static Shell Optimisation) - optional

---

## Foundation Documents

Re-read before starting and at each phase checkpoint:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

---

## Problem

ChatGPT makes ~60 `resources/read` calls during discovery. Each goes through Clerk authentication (~170ms overhead), causing ~10s total latency and user timeouts.

## Solution

Skip authentication for public resources that contain no user data.

---

## Security Rationale

The resources being made public contain **no user-specific data**:

| Resource                           | Why Public                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| `ui://widget/oak-json-viewer.html` | Static HTML shell; user data arrives via `window.openai.toolOutput` at render time |
| `docs://oak/getting-started.md`    | Static markdown generated at SDK compile time                                      |
| `docs://oak/tools.md`              | Static markdown generated at SDK compile time                                      |
| `docs://oak/workflows.md`          | Static markdown generated at SDK compile time                                      |

**Data-fetching tools (tools/call) still require authentication.**

---

## Architecture

Two auth layers require updating:

### Layer 1: Conditional Clerk Middleware

**File**: `src/conditional-clerk-middleware.ts`  
**Purpose**: Skip Clerk context setup (~170ms) for discovery methods  
**Current**: `resources/read` is NOT in skip list  
**Existing tests**: `conditional-clerk-middleware.integration.test.ts`

### Layer 2: MCP Router

**File**: `src/mcp-router.ts`  
**Purpose**: Enforce auth based on MCP method and tool security  
**Current**: `resources/read` falls through to "require auth" catch-all  
**Existing type guards**: `hasParams()`, `hasMethod()`

---

## Phase 1: Unit Tests (RED)

**Create** `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.unit.test.ts`:

```typescript
/**
 * Unit tests for public resource detection.
 * Pure function tests with no IO, no side effects, no mocks.
 * @packageDocumentation
 */
import { describe, it, expect } from 'vitest';
import { isPublicResourceUri } from './public-resources.js';

describe('isPublicResourceUri', () => {
  describe('returns true for public resources', () => {
    it('returns true for widget URI', () => {
      expect(isPublicResourceUri('ui://widget/oak-json-viewer.html')).toBe(true);
    });

    it('returns true for getting-started documentation', () => {
      expect(isPublicResourceUri('docs://oak/getting-started.md')).toBe(true);
    });

    it('returns true for tools documentation', () => {
      expect(isPublicResourceUri('docs://oak/tools.md')).toBe(true);
    });

    it('returns true for workflows documentation', () => {
      expect(isPublicResourceUri('docs://oak/workflows.md')).toBe(true);
    });
  });

  describe('returns false for non-public resources', () => {
    it('returns false for unknown widget URIs', () => {
      expect(isPublicResourceUri('ui://other/widget.html')).toBe(false);
    });

    it('returns false for unknown documentation URIs', () => {
      expect(isPublicResourceUri('docs://other/file.md')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isPublicResourceUri('')).toBe(false);
    });

    it('returns false for arbitrary strings', () => {
      expect(isPublicResourceUri('not-a-uri')).toBe(false);
    });
  });
});
```

**Run**: `pnpm test` → Tests fail (module doesn't exist)

---

## Phase 2: Implement Pure Function (GREEN)

**Create** `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts`:

````typescript
/**
 * Public resource definitions for selective authentication.
 *
 * Resources listed here skip Clerk authentication because they contain
 * no user-specific data. This is a latency optimisation for ChatGPT
 * discovery.
 *
 * ## Security Rationale
 *
 * - **Widget HTML**: Static shell that loads JS/CSS. User-specific
 *   data arrives via `window.openai.toolOutput` at render time.
 * - **Documentation**: Static markdown generated at SDK compile time.
 *   Contains no user-specific information.
 *
 * Data-fetching tools (tools/call) still require authentication.
 *
 * @packageDocumentation
 * @see ADR-057: Selective Authentication for MCP Resources
 */

import { AGGREGATED_TOOL_WIDGET_URI } from '../aggregated-tool-widget.js';
import { DOCUMENTATION_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/**
 * Resource URIs that are publicly accessible without authentication.
 *
 * Constructed from source constants to stay synchronised with registered resources.
 */
export const PUBLIC_RESOURCE_URIS = [
  AGGREGATED_TOOL_WIDGET_URI,
  ...DOCUMENTATION_RESOURCES.map((resource) => resource.uri),
] as const;

/**
 * Set for O(1) lookup of public resource URIs.
 * @internal
 */
const PUBLIC_RESOURCE_URI_SET: ReadonlySet<string> = new Set(PUBLIC_RESOURCE_URIS);

/**
 * Checks if a resource URI is public and should skip authentication.
 *
 * @param uri - The resource URI being requested
 * @returns True if the resource is public and auth can be skipped
 *
 * @example
 * ```typescript
 * isPublicResourceUri('ui://widget/oak-json-viewer.html'); // true
 * isPublicResourceUri('docs://oak/getting-started.md');    // true
 * isPublicResourceUri('ui://other/widget.html');           // false
 * ```
 */
export function isPublicResourceUri(uri: string): boolean {
  return PUBLIC_RESOURCE_URI_SET.has(uri);
}
````

**Run**: `pnpm test` → Unit tests pass

**REFACTOR**: Review for clarity. Current implementation is minimal; no refactoring needed.

---

## Phase 3: Integration Tests (RED)

**Add to** `apps/oak-curriculum-mcp-streamable-http/src/conditional-clerk-middleware.integration.test.ts`:

```typescript
describe('public resource authentication bypass', () => {
  it('skips Clerk for widget resources/read', () => {
    const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
    const req = createMockRequest('/mcp', {
      method: 'resources/read',
      params: { uri: 'ui://widget/oak-json-viewer.html' },
    });

    conditionalMw(req, mockRes, mockNext);

    expect(mockClerkMw).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('skips Clerk for documentation resources/read', () => {
    const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
    const req = createMockRequest('/mcp', {
      method: 'resources/read',
      params: { uri: 'docs://oak/getting-started.md' },
    });

    conditionalMw(req, mockRes, mockNext);

    expect(mockClerkMw).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });

  it('runs Clerk for unknown resource URIs', () => {
    const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
    const req = createMockRequest('/mcp', {
      method: 'resources/read',
      params: { uri: 'unknown://some/resource' },
    });

    conditionalMw(req, mockRes, mockNext);

    expect(mockClerkMw).toHaveBeenCalled();
  });

  it('runs Clerk for resources/read without uri param', () => {
    const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
    const req = createMockRequest('/mcp', {
      method: 'resources/read',
      params: {},
    });

    conditionalMw(req, mockRes, mockNext);

    expect(mockClerkMw).toHaveBeenCalled();
  });
});
```

**Create** `apps/oak-curriculum-mcp-streamable-http/src/mcp-router.integration.test.ts`:

```typescript
/**
 * Integration tests for MCP router middleware.
 *
 * Tests that the router correctly applies or skips auth middleware
 * based on MCP method and resource/tool security metadata.
 *
 * @packageDocumentation
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { createMcpRouter } from './mcp-router.js';

describe('createMcpRouter (Integration)', () => {
  let mockAuthMw: RequestHandler;
  let mockNext: NextFunction;
  let mockRes: Response;

  beforeEach(() => {
    mockAuthMw = vi.fn((_req, _res, next) => next());
    mockNext = vi.fn();
    mockRes = {} as Response;
  });

  function createMockRequest(body: unknown): Request {
    return { body } as Request;
  }

  describe('public resource authentication bypass', () => {
    it('skips auth for widget resources/read', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
        params: { uri: 'ui://widget/oak-json-viewer.html' },
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('skips auth for documentation resources/read', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
        params: { uri: 'docs://oak/tools.md' },
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('requires auth for unknown resource URIs', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
        params: { uri: 'unknown://some/resource' },
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });

    it('requires auth for resources/read without uri param', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
        params: {},
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });
  });
});
```

**Run**: `pnpm test` → Integration tests fail

---

## Phase 4: Update conditional-clerk-middleware.ts (GREEN)

**Add import**:

```typescript
import { isPublicResourceUri } from './auth/public-resources.js';
```

**Add type guards** (proper narrowing, no `as` assertions):

```typescript
/**
 * Type guard for object with params property.
 */
function hasParamsProperty(value: unknown): value is { params: unknown } {
  return typeof value === 'object' && value !== null && 'params' in value;
}

/**
 * Type guard for params object with uri property.
 */
function hasUriProperty(value: unknown): value is { uri: unknown } {
  return typeof value === 'object' && value !== null && 'uri' in value;
}

/**
 * Extracts resource URI from MCP request body.
 * Uses chained type guards to safely narrow types without assertions.
 *
 * @param body - Request body (unknown shape)
 * @returns Resource URI if present and string, undefined otherwise
 */
function getResourceUriFromBody(body: unknown): string | undefined {
  if (!hasParamsProperty(body)) {
    return undefined;
  }
  if (!hasUriProperty(body.params)) {
    return undefined;
  }
  if (typeof body.params.uri !== 'string') {
    return undefined;
  }
  return body.params.uri;
}
```

**Update `shouldSkipClerkMiddleware`** - add after existing discovery method checks:

```typescript
// Skip for public resource reads
if (mcpMethod === 'resources/read') {
  const uri = getResourceUriFromBody(req.body);
  if (uri && isPublicResourceUri(uri)) {
    return true;
  }
}
```

**Run**: `pnpm test` → conditional-clerk-middleware tests pass

---

## Phase 5: Update mcp-router.ts (GREEN)

**Add import**:

```typescript
import { isPublicResourceUri } from './auth/public-resources.js';
```

**Add type guard** (reuses existing `hasParams`):

```typescript
/**
 * Type guard for params object with uri property.
 */
function hasUri(value: unknown): value is { uri: unknown } {
  return typeof value === 'object' && value !== null && 'uri' in value;
}

/**
 * Extract resource URI from request body params.
 * Uses chained type guards to safely narrow types without assertions.
 */
function getResourceUriFromBody(body: unknown): string | undefined {
  if (!hasParams(body)) {
    return undefined;
  }
  if (!hasUri(body.params)) {
    return undefined;
  }
  if (typeof body.params.uri !== 'string') {
    return undefined;
  }
  return body.params.uri;
}
```

**Update `createMcpRouter`** - add after discovery method check:

```typescript
// Resource reads: check if public resource
if (method === 'resources/read') {
  const uri = getResourceUriFromBody(req.body);
  if (uri && isPublicResourceUri(uri)) {
    next();
    return;
  }
}
```

**Run**: `pnpm test` → All tests pass

**REFACTOR**: `getResourceUriFromBody` exists in both files. Leave as-is unless a third file needs it - premature abstraction adds complexity.

---

## Phase 6: Create ADR

**Create** `docs/architecture/architectural-decisions/057-selective-auth-public-resources.md`:

```markdown
# ADR-057: Selective Authentication for Public MCP Resources

## Status

Accepted

## Context

ChatGPT makes ~60 `resources/read` calls during discovery to fetch the widget HTML
and documentation resources. Each call goes through Clerk authentication middleware
(~170ms overhead), resulting in ~10s total latency and user-perceived timeouts.

The resources being fetched are:

- Widget HTML (`ui://widget/oak-json-viewer.html`) - static shell
- Documentation (`docs://oak/*.md`) - static markdown

These resources contain **no user-specific data**. User data arrives via
`window.openai.toolOutput` at render time for widgets, and documentation
is generated at SDK compile time.

## Decision

Skip Clerk authentication for `resources/read` requests where the URI matches
a known public resource:

1. Widget URI from `AGGREGATED_TOOL_WIDGET_URI`
2. Documentation URIs from SDK's `DOCUMENTATION_RESOURCES`

Both auth layers are updated:

- `conditional-clerk-middleware.ts` - skip Clerk context setup
- `mcp-router.ts` - skip auth middleware

## Consequences

### Positive

- **~8× latency improvement**: 60 × 170ms → 60 × ~20ms
- **No user timeouts**: Discovery completes in <2s
- **Security preserved**: Data-fetching tools (tools/call) still require auth

### Negative

- **Additional conditional logic**: Two files modified
- **Maintenance**: New resources must be added to public list

### Neutral

- Public resource list is derived from source constants, ensuring synchronisation

## References

- OpenAI Apps SDK: Widget resources are static shells
- MCP Spec: resources/list is discovery (no auth), resources/read follows resource security
- Plan 15a: Implementation details
```

---

## Phase 7: Quality Gates

```bash
pnpm format
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

All must pass.

---

## Phase 8: Deploy & Verify

1. **Deploy** to Vercel

2. **Check Vercel logs** for `resources/read` requests:
   - Look for `clerkMiddleware skipped` debug messages with public resource URIs
   - Verify request durations dropped from ~170ms to ~20ms

3. **Test in ChatGPT**:
   - Connect to the MCP server
   - Observe discovery completes without timeout
   - Tools list appears within 2-3 seconds

4. **Verify security**:
   - Attempt `resources/read` with unknown URI without auth token
   - Should receive 401 response

---

## Files Summary

| Action | File                                                                               |
| ------ | ---------------------------------------------------------------------------------- |
| Create | `src/auth/public-resources.ts`                                                     |
| Create | `src/auth/public-resources.unit.test.ts`                                           |
| Create | `src/mcp-router.integration.test.ts`                                               |
| Create | `docs/architecture/architectural-decisions/057-selective-auth-public-resources.md` |
| Modify | `src/conditional-clerk-middleware.ts`                                              |
| Modify | `src/conditional-clerk-middleware.integration.test.ts`                             |
| Modify | `src/mcp-router.ts`                                                                |

---

## Expected Impact

| Metric               | Before | After | Improvement |
| -------------------- | ------ | ----- | ----------- |
| Widget fetch latency | ~170ms | ~20ms | **8×**      |
| 60 resource reads    | ~10.2s | ~1.2s | **8×**      |
| ChatGPT timeout      | Yes    | No    | ✅          |

---

## Definition of Done

- [ ] Unit tests for `isPublicResourceUri()` pass
- [ ] Integration tests for conditional-clerk-middleware pass
- [ ] Integration tests for mcp-router pass
- [ ] `conditional-clerk-middleware.ts` skips Clerk for public `resources/read`
- [ ] `mcp-router.ts` skips auth for public `resources/read`
- [ ] ADR-057 created
- [ ] All quality gates pass
- [ ] Deployed to Vercel
- [ ] Verified in ChatGPT (<3s discovery)
