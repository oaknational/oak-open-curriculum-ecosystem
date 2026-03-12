# Utilities

Simple helper scripts for one-off tasks and data exports.

## Scripts

### `generate-synonyms.ts`

Exports Elasticsearch-compatible synonym set from SDK ontology data.

**Usage**:

```bash
tsx operations/utilities/generate-synonyms.ts > /tmp/synonyms.json
```

**Purpose**: Export synonyms for manual inspection or external use.

**What it does**:

- Calls `serialiseElasticsearchSynonyms()` from SDK
- Outputs ES-compatible JSON format to stdout

**Note**: This is primarily for debugging/inspection. Synonyms are automatically deployed during `pnpm es:setup` via the SDK.

**Related**:

- [ADR-063](../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) - SDK as source of truth for synonyms
- [SYNONYMS.md](../../docs/SYNONYMS.md) - Synonym management guide

---

### `run-typedoc.ts`

Generates API documentation from TypeScript source files.

**Usage**:

```bash
# Generate HTML and JSON docs
pnpm doc-gen

# Or directly:
tsx operations/utilities/run-typedoc.ts
```

**Purpose**: Build-time documentation generation for API reference.

**What it generates**:

- `docs/api/` - HTML documentation
- `docs/api/typedoc.json` - JSON for tooling consumption

**Configuration**: `typedoc.json` in repository root

---

## About Utilities

Utilities are simple, single-purpose scripts that:

- Perform one-off tasks
- Export or format data
- Support development workflows
- Are NOT part of the critical operational path

**Key differences from operations**:

- ✅ Can use `console.log` for output
- ✅ Simpler structure (max 100 lines)
- ✅ Minimal error handling (fail fast)
- ❌ Should not manage production systems
- ❌ Should not have complex logic

## Adding New Utilities

Keep it simple:

````typescript
#!/usr/bin/env -S pnpm exec tsx
/**
 * Brief description of what this utility does.
 *
 * @example
 * ```bash
 * tsx operations/utilities/my-utility.ts > output.json
 * ```
 */

import { someFunction } from '@oaknational/curriculum-sdk';

// Simple, focused logic
const result = someFunction();
console.log(JSON.stringify(result, null, 2));
````

If a utility grows beyond ~50 lines or needs complex logic, consider moving it to a proper operations subdirectory with full standards.
