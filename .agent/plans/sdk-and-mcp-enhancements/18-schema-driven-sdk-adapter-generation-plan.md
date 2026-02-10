# Plan 10: Schema-Driven SDK Client Adapter Generation

**Status**: 🔴 NOT STARTED  
**Estimated Duration**: ~3-4 days  
**Priority**: Medium (architectural improvement, not blocking)  
**Related ADRs**: ADR-088 (Result Pattern), ADR-030 (SDK as Single Source of Truth)

---

## Problem Statement

The search application (`oak-open-curriculum-semantic-search`) maintains a manual adapter layer that:

1. Wraps the SDK's raw `OakApiClient` (from `openapi-fetch`)
2. Applies type guards to validate responses
3. Returns `Result<T, SdkFetchError>` per ADR-088
4. Classifies HTTP errors into discriminated union types

This adapter layer is currently:

- **Hand-authored** in `src/adapters/oak-adapter-sdk.ts`
- **Duplicated** in concept if other apps need the same functionality
- **Fragile** - must be manually updated when SDK endpoints change
- **Inconsistent** with the Cardinal Rule (all types should flow from OpenAPI schema at type-gen time)

### Current Architecture

```text
Oak API → OpenAPI Schema → SDK Type-Gen → Raw OakApiClient → Manual Adapter → App
                                              ↓
                                         Returns raw
                                         Response<T>
                                              ↓
                                    Manual type guards
                                    Manual error classification
                                    Manual Result wrapping
```

### Proposed Architecture

```text
Oak API → OpenAPI Schema → SDK Type-Gen → Result-Returning Client → App
                                              ↓
                              Generated type guards
                              Generated error classification
                              Generated Result<T, SdkFetchError>
```

---

## Goals

1. **Eliminate manual adapter maintenance** - All SDK client methods generated from OpenAPI schema
2. **Enforce Result pattern at SDK level** - Apps receive Result types, not raw responses
3. **Single source of truth** - Error types, type guards, and client methods all generated
4. **Reduce app-level boilerplate** - Apps use SDK directly without wrapper layers

---

## Non-Goals

1. Changing the raw `OakApiClient` - it remains available for advanced use cases
2. Breaking backward compatibility - Result-returning client is additive
3. Mandating Result pattern for all SDK consumers - it's opt-in via import

---

## Design

### Option A: Parallel Client in SDK (Recommended)

Generate a parallel `OakResultClient` alongside `OakApiClient`:

```typescript
// packages/sdks/oak-curriculum-sdk/src/client/oak-result-client.ts (GENERATED)

import { ok, err, type Result } from '@oaknational/result';
import type { SdkFetchError } from '../types/generated/api-schema/error-types/sdk-error-types.js';
import type { SearchUnitSummary, SearchLessonSummary } from '../types/openapi.js';
import { isUnitSummary, isLessonSummary } from '../validation/search-response-validators.js';
import { classifyHttpError, validationError } from '../types/generated/api-schema/error-types/sdk-error-types.js';

/**
 * Result-returning Oak API client.
 *
 * All methods return `Result<T, SdkFetchError>` per ADR-088.
 * Generated at type-gen time from OpenAPI schema.
 *
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */
export interface OakResultClient {
  /** Fetch a unit summary. Returns Result per ADR-088. */
  getUnitSummary(unitSlug: string): Promise<Result<SearchUnitSummary, SdkFetchError>>;

  /** Fetch a lesson summary. Returns Result per ADR-088. */
  getLessonSummary(lessonSlug: string): Promise<Result<SearchLessonSummary, SdkFetchError>>;

  // ... all other endpoints
}

export function createOakResultClient(config: OakClientConfig): OakResultClient {
  const baseClient = createOakBaseClient(config);
  const client = baseClient.client;

  return {
    async getUnitSummary(unitSlug) {
      const res = await client.GET('/units/{unit}/summary', {
        params: { path: { unit: unitSlug } },
      });
      if (!res.response.ok) {
        return err(
          classifyHttpError(res.response.status, unitSlug, 'unit', res.response.statusText),
        );
      }
      const data = res.data;
      if (isUnitSummary(data)) {
        return ok(data);
      }
      return err(validationError(unitSlug, 'UnitSummary', data));
    },
    // ... generated for each endpoint
  };
}
```

**Pros:**

- Clean separation from raw client
- Opt-in for consumers
- No breaking changes

**Cons:**

- Two client types to maintain (generated, so minimal burden)
- Consumers must choose which to use

### Option B: Wrapper Methods on Base Client

Add Result-returning methods to the existing client:

```typescript
// createOakBaseClient returns both:
const { client, getUnitSummary, getLessonSummary, ... } = createOakBaseClient(config);

// client.GET() - raw access
// getUnitSummary() - Result-returning, validated
```

**Pros:**

- Single client import
- Progressive adoption

**Cons:**

- Bloated API surface
- Confusion about which methods to use

### Recommended: Option A

Option A provides cleaner separation and explicit opt-in for the Result pattern.

---

## Implementation Phases

### Phase 1: Design and Generator Architecture (~1 day)

1. Define the generator input (OpenAPI paths + response schemas)
2. Define the generator output (TypeScript client code)
3. Map OpenAPI response types to type guards (already exist in SDK)
4. Design error classification logic (already exists as `classifyHttpError`)

**Deliverables:**

- Generator design document
- Type mapping specification
- Integration plan with existing type-gen

### Phase 2: Generator Implementation (~1.5 days)

1. Create generator in `packages/sdks/oak-curriculum-sdk/type-gen/typegen/result-client/`
2. Generate `OakResultClient` interface from OpenAPI paths
3. Generate factory function with all endpoint methods
4. Generate documentation from OpenAPI descriptions

**Deliverables:**

- Working generator
- Generated `oak-result-client.ts`
- Export from SDK public API

### Phase 3: Migrate Search App (~1 day)

1. Replace manual `oak-adapter-sdk.ts` with SDK's generated client
2. Update imports across the search app
3. Remove now-redundant adapter types
4. Verify all tests pass

**Deliverables:**

- Simplified search app adapter layer
- Reduced app code by ~200 lines
- All tests passing

### Phase 4: Documentation and Cleanup (~0.5 days)

1. Update SDK documentation
2. Create ADR for Result Client pattern
3. Update search app documentation
4. Archive old adapter code

**Deliverables:**

- ADR-089: Schema-Driven Result Client Generation
- Updated SDK README
- Updated search app docs

---

## Success Criteria

1. **Cardinal Rule Compliance**: Running `pnpm type-gen` generates the complete Result-returning client
2. **Type Safety**: All endpoint return types are narrowed via generated type guards
3. **Error Classification**: All HTTP errors classified into `SdkFetchError` union
4. **App Simplification**: Search app adapter layer reduced to thin configuration
5. **Test Coverage**: Generator tested with schema fixtures

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAPI schema doesn't provide enough info for type guards | High | Use existing manually-authored guards as fallback; iterate on schema |
| Generated code bloat | Medium | Only generate for endpoints actually used; tree-shaking handles rest |
| Complex response shapes | Medium | Start with simple endpoints; handle complex shapes incrementally |
| Breaking changes to existing SDK consumers | High | Additive-only; Result client is new export, not replacement |

---

## Dependencies

- ADR-088 (Result Pattern) - already established
- Error type generator - already implemented
- Type guards - already exist in SDK
- `@oaknational/result` package - already a dependency

---

## Future Considerations

1. **Upstream API Enhancement**: If the Oak API ever returns structured error responses, the generator could extract error details
2. **Retry Configuration**: Result client could integrate retry logic (currently in base client middleware)
3. **Caching Integration**: Result client could integrate with Redis caching (currently in search app)
4. **Other Apps**: Once proven in search app, other apps can adopt the generated client

---

## Related Files

- `apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts` - Current manual adapter (to be replaced)
- `apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk-types.ts` - Current manual types
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/error-types/` - Error type generator (pattern to follow)
- `packages/sdks/oak-curriculum-sdk/src/validation/` - Existing type guards to reuse

---

## References

- [ADR-088: Result Pattern for Explicit Error Handling](../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md)
- [ADR-030: SDK as Single Source of Truth](../../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md)
- [Cardinal Rule](../../directives/rules.md#cardinal-rule-of-this-repository)

