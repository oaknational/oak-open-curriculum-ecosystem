---
name: Public API Boundaries & Generator Fixes
overview: 'Fix @timestamp field quoting in generator and establish proper public API boundaries for Elasticsearch types by creating elasticsearch.ts entry point and updating all imports to respect package.json exports.'
status: pending
created: 2025-12-06
todos:
  - id: fix-timestamp-quoting
    content: Fix @timestamp field quoting in index-doc-code-gen.ts
    status: pending
  - id: create-es-public-api
    content: Create src/elasticsearch.ts public API entry point
    status: pending
  - id: update-package-exports
    content: Add elasticsearch exports to package.json
    status: pending
  - id: update-observability-imports
    content: Update observability imports to use elasticsearch.js
    status: pending
  - id: run-type-gen
    content: Run pnpm type-gen to regenerate with fixes
    status: pending
  - id: run-quality-gates
    content: Run full quality gate suite
    status: pending
  - id: test-ingestion
    content: Test ingestion with both success and failure cases
    status: pending
---

# Public API Boundaries & Generator Fixes

## Context

During schema-first migration, two issues were identified:

1. **Generator Bug**: The `@timestamp` field is not quoted in generated Zod schemas, causing syntax errors
2. **Boundary Violations**: Code imports from internal generated paths not exposed in `package.json` exports

Both violate the cardinal rules in `.agent/directives-and-memory/rules.md` and `.agent/directives-and-memory/schema-first-execution.md`.

## Problem 1: Invalid JavaScript - @timestamp Field

**Current Generated Code** (Invalid):

```typescript
export const ZeroHitDocSchema = z.object({
  @timestamp: z.string().min(1),  // ❌ Syntax error - @ is not valid identifier start
  search_scope: z.string().min(1),
  // ...
});
```

**Root Cause**: Generator doesn't quote field names that aren't valid JavaScript identifiers.

**Valid JavaScript Identifiers**: Match `/^[a-zA-Z_$][a-zA-Z0-9_$]*$/`

## Problem 2: Public API Boundary Violations

**Current Violations**:

```typescript
// ❌ Imports from paths not in package.json exports
import { EsIndexBody } from '@oaknational/oak-curriculum-sdk/types/generated/search/es-types.js';
import { OAK_ZERO_HIT_MAPPING } from '@oaknational/oak-curriculum-sdk/types/generated/search/es-mappings/index.js';
```

**Root Cause**: Missing public API entry point for Elasticsearch infrastructure types.

**Current Public API Pattern**:

- Main: `@oaknational/oak-curriculum-sdk` → `src/index.ts`
- Search: `@oaknational/oak-curriculum-sdk/public/search` → `src/public/search.ts`
- MCP: `@oaknational/oak-curriculum-sdk/public/mcp-tools` → `src/public/mcp-tools.ts`

## Solution

### 1. Fix @timestamp Field Quoting

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/index-doc-code-gen.ts`

**Add Helper Function**:

```typescript
/**
 * Quotes field names that are not valid JavaScript identifiers
 *
 * @example
 * maybeQuoteFieldName('subject') // → 'subject'
 * maybeQuoteFieldName('@timestamp') // → "'@timestamp'"
 */
function maybeQuoteFieldName(name: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : `'${name}'`;
}
```

**Update Both Generator Functions**:

In `generateDocSchemaWithTypedCompletion`:

```typescript
// Change from:
return `    ${field.name}: ${zodExpression},`;

// Change to:
return `    ${maybeQuoteFieldName(field.name)}: ${zodExpression},`;
```

In `generateSimpleDocSchema`:

```typescript
// Change from:
return `    ${field.name}: ${zodExpression},`;

// Change to:
return `    ${maybeQuoteFieldName(field.name)}: ${zodExpression},`;
```

### 2. Create Elasticsearch Public API Entry Point

**Create**: `packages/sdks/oak-curriculum-sdk/src/elasticsearch.ts`

````typescript
/**
 * Elasticsearch Infrastructure Types
 *
 * Type-safe Elasticsearch structures for index creation, search requests,
 * and observability operations. All Elasticsearch-related imports MUST
 * come through this entry point to maintain boundary discipline.
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   EsIndexBody,
 *   EsSearchBody,
 *   OAK_ZERO_HIT_MAPPING
 * } from '@oaknational/oak-curriculum-sdk/elasticsearch.js';
 * ```
 *
 * ## Architecture
 *
 * These types are generated at compile time from field definitions in
 * `type-gen/typegen/search/field-definitions/`. Never edit generated
 * files directly - always update the generators.
 *
 * @module elasticsearch
 * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html}
 */

// ============================================================================
// Elasticsearch Request/Response Types
// ============================================================================

/**
 * Type-safe Elasticsearch request and response structures.
 * Replaces generic `Record<string, unknown>` with specific types.
 */
export type {
  /** Index creation body structure */
  EsIndexBody,
  /** ILM policy definition structure */
  EsIlmPolicyBody,
  /** Search request body structure */
  EsSearchBody,
  /** Hit source structure in search results */
  EsHitSource,
  /** Individual search hit structure */
  EsSearchHit,
  /** Search hits collection structure */
  EsSearchHits,
  /** Search aggregations structure */
  EsSearchAggregations,
  /** Complete search response structure */
  EsSearchResponse,
  /** Elasticsearch mappings structure */
  EsMappings,
  /** Elasticsearch settings structure */
  EsSettings,
} from './types/generated/search/es-types.js';

// ============================================================================
// Curriculum Index Mappings
// ============================================================================

/**
 * Generated Elasticsearch index mappings for curriculum content.
 * These flow from field definitions in `field-definitions/curriculum.ts`.
 */
export {
  /** oak_lessons index mapping */
  OAK_LESSONS_MAPPING,
  /** oak_units index mapping */
  OAK_UNITS_MAPPING,
  /** oak_unit_rollup index mapping */
  OAK_UNIT_ROLLUP_MAPPING,
  /** oak_sequences index mapping */
  OAK_SEQUENCES_MAPPING,
  /** oak_sequence_facets index mapping */
  OAK_SEQUENCE_FACETS_MAPPING,
} from './types/generated/search/es-mappings/index.js';

export type {
  OakLessonsMapping,
  OakUnitsMapping,
  OakUnitRollupMapping,
  OakSequencesMapping,
  OakSequenceFacetsMapping,
} from './types/generated/search/es-mappings/index.js';

// ============================================================================
// Observability Index Mappings
// ============================================================================

/**
 * Generated Elasticsearch index mappings for system observability.
 * These flow from field definitions in `field-definitions/observability.ts`.
 */
export {
  /** oak_meta index mapping - tracks index versions and metadata */
  OAK_META_MAPPING,
  /** oak_zero_hit_telemetry index mapping - tracks zero-result searches */
  OAK_ZERO_HIT_MAPPING,
} from './types/generated/search/es-mappings/index.js';

export type {
  OakMetaMapping,
  OakZeroHitMapping,
} from './types/generated/search/es-mappings/index.js';
````

### 3. Add Elasticsearch Exports to package.json

**File**: `packages/sdks/oak-curriculum-sdk/package.json`

**Add After Line 75** (after `./public/mcp-tools.js`):

```json
    "./elasticsearch": {
      "types": "./dist/elasticsearch.d.ts",
      "default": "./dist/elasticsearch.js"
    },
    "./elasticsearch.js": {
      "types": "./dist/elasticsearch.d.ts",
      "default": "./dist/elasticsearch.js"
    }
```

### 4. Update All Imports

**Files to Update**:

1. `apps/oak-open-curriculum-semantic-search/src/lib/observability/zero-hit-persistence-index.ts`
2. `apps/oak-open-curriculum-semantic-search/src/lib/observability/zero-hit-persistence-search.ts`

**Change FROM**:

```typescript
import type {
  EsIndexBody,
  EsIlmPolicyBody,
} from '@oaknational/oak-curriculum-sdk/types/generated/search/es-types.js';
import { OAK_ZERO_HIT_MAPPING } from '@oaknational/oak-curriculum-sdk/types/generated/search/es-mappings/index.js';
```

**Change TO**:

```typescript
import {
  OAK_ZERO_HIT_MAPPING,
  type EsIndexBody,
  type EsIlmPolicyBody,
  type EsSearchBody,
  type EsHitSource,
  // etc. as needed
} from '@oaknational/oak-curriculum-sdk/elasticsearch.js';
```

### 5. Generate & Test

**Sequence**:

```bash
# From repo root
pnpm type-gen      # Regenerate with @timestamp fix
pnpm build         # Build SDK with new elasticsearch.js
pnpm type-check    # Verify types
pnpm lint:fix      # Auto-fix any formatting
pnpm format:root   # Format all files
pnpm test          # Unit tests
```

### 6. Verify Ingestion

**Test both success and failure cases**:

```bash
cd apps/oak-open-curriculum-semantic-search

# Test success case with --dry-run
pnpm es:ingest-live --subject maths --keystage ks1 --dry-run --verbose

# Test with caching
pnpm redis:up
SDK_CACHE_ENABLED=true pnpm es:ingest-live --subject maths --index lessons --dry-run --verbose

# Test actual ingestion (if dry-run passes)
pnpm es:ingest-live --subject maths --keystage ks1 --index lessons --verbose
```

## Architectural Principles Applied

### Schema-First Execution

All types flow from generators:

- Field definitions → Zod schemas
- Field definitions → ES mappings
- Generators must produce valid JavaScript
- Never edit generated files

### Boundary Discipline

Public API boundaries defined in `package.json`:

- Consumers import from public entry points only
- Internal paths are not accessible
- New types require updating public API first
- Documentation at each boundary

### Fail Fast

- Generator validates field names
- Type system prevents boundary violations
- Build fails if public API is breached
- Ingestion pipeline returns explicit Result<T,E>

## Success Criteria

- [ ] `pnpm type-gen` generates valid JavaScript for all schemas
- [ ] `pnpm build` succeeds with no errors
- [ ] All imports use public API paths only
- [ ] No `@oaknational/oak-curriculum-sdk/types/generated/*` imports exist
- [ ] Zero-hit telemetry schema includes properly quoted `@timestamp`
- [ ] Ingestion succeeds with detailed progress logging
- [ ] Ingestion failures produce explicit, helpful error messages
- [ ] All quality gates pass

## Related Documentation

- `.agent/directives-and-memory/rules.md` - Cardinal rules and boundary discipline
- `.agent/directives-and-memory/schema-first-execution.md` - Schema-first mandate
- `docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md` - ES mapping generation
- `.agent/plans/semantic-search/schema-first_completion_*.plan.md` - Previous schema-first work
