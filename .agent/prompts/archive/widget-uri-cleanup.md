# Widget URI Single Source of Truth - Completion

## Context

Refactored widget URI architecture to follow schema-first execution directive with single source of truth in type-gen code.

## Completed Work

✅ **Architecture Implemented**:

- Single definition in `type-gen/typegen/cross-domain-constants.ts`
- Generator creates `src/types/generated/widget-constants.ts`
- SDK public API re-exports for HTTP servers
- Generated tool files (34) inline literal value
- HTTP server imports from SDK public API

✅ **All tests passing**: 1,189 tests (631 SDK + 558 HTTP server)

## Remaining Work

### Update Hardcoded Widget URI Literals

**9 files** still hardcode `'ui://widget/oak-json-viewer.html'` instead of importing `WIDGET_URI`:

**Production code (must fix)**:

1. `src/mcp/aggregated-ontology.ts:58`
2. `src/mcp/aggregated-help/definition.ts:60`
3. `src/mcp/aggregated-search/tool-definition.ts:51`
4. `src/mcp/aggregated-fetch.ts:49`
5. `src/mcp/aggregated-knowledge-graph.ts:63`

**Test code (should fix for consistency)**: 6. `src/mcp/universal-tools.unit.test.ts:310` 7. `src/mcp/universal-tools.integration.test.ts:161` 8. `src/mcp/universal-tools.integration.test.ts:226` 9. `src/mcp/aggregated-help.unit.test.ts:40`

### Required Changes

Replace hardcoded strings with:

```typescript
import { WIDGET_URI } from '../types/generated/widget-constants.js';

// Then use:
'openai/outputTemplate': WIDGET_URI,
```

**For test assertions**, import and use constant:

```typescript
import { WIDGET_URI } from '../types/generated/widget-constants.js';

expect(tool._meta?.['openai/outputTemplate']).toBe(WIDGET_URI);
```

## Validation

After updates, verify:

1. `pnpm type-gen` (regenerates constant file)
2. `pnpm build` (all packages)
3. `pnpm test` (all tests still pass)
4. `grep -r "'ui://widget/oak-json-viewer.html'" src/mcp` (should only find the generated constant definition)

## Files Modified (This Session)

**SDK**:

- Created: `type-gen/typegen/cross-domain-constants.ts`
- Created: `type-gen/typegen/generate-widget-constants.ts`
- Modified: `type-gen/typegen/index.ts`
- Modified: `type-gen/typegen.ts`
- Modified: `type-gen/typegen/mcp-tools/parts/emit-index.ts`
- Modified: `type-gen/typegen/mcp-tools/parts/generate-tool-file.ts`
- Modified: `src/mcp/widget-constants.ts` (now re-exports from generated)
- Modified: `tsup.config.ts` (removed old entry, added generated entry)

**HTTP Server**:

- Created: `src/widget-uri.ts` (pure function for cache-busting)
- Created: `src/widget-uri.unit.test.ts` (7 tests)
- Modified: `src/aggregated-tool-widget.ts` (imports SDK constant)
- Modified: `src/auth/public-resources.ts` (imports SDK constant)
- Modified: `e2e-tests/widget-metadata.e2e.test.ts` (imports SDK constant)
