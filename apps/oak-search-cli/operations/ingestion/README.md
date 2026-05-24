# Ingestion Operations

Data loading, validation, and monitoring tools for the semantic search indices.

## Canonical Ingestion Process

The canonical way to ingest curriculum data is via the main CLI:

```bash
# Full curriculum ingestion (API mode; all 17 subjects)
pnpm es:ingest -- --api --all --verbose

# Specific subject (API mode)
pnpm es:ingest -- --api --subject maths --verbose

# Specific subject and keystage (API mode)
pnpm es:ingest -- --api --subject maths --key-stage ks4 --verbose

# Dry run (preview without indexing)
pnpm es:ingest -- --api --all --dry-run

# Incremental mode (skip existing, useful for resuming)
pnpm es:ingest -- --api --all --incremental
```

### CLI Flags

| Flag                  | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `--all`               | Ingest all 17 subjects                               |
| `--subject <slug>`    | Ingest specific subject(s), can be repeated          |
| `--key-stage <slug>`  | Filter by key stage (ks1, ks2, ks3, ks4)             |
| `--index <kind>`      | Filter to specific index kind (lessons, units, etc.) |
| `--verbose`           | Enable detailed logging                              |
| `--dry-run`           | Preview without indexing                             |
| `--incremental`       | Skip existing documents (default: overwrite)         |
| `--bypass-cache`      | Skip Redis cache requirement                         |
| `--clear-cache`       | Clear SDK response cache before ingestion            |
| `--ignore-cached-404` | Ignore cached 404s for transcripts (re-fetch)        |

### Incremental vs Force Mode

- **Incremental**: Uses ES `create` action and skips existing documents.
  Enable with `--incremental` for resumable ingestion.
- **Overwrite (default)**: Uses ES `index` action. Overwrites existing documents.
  Use for full re-index or schema changes.

---

## Scripts

### `verify-ingestion.ts`

Validates ingested data for correctness and completeness.

**Usage**:

```bash
pnpm ingest:verify
pnpm ingest:verify --subject maths --key-stage ks4
```

**Purpose**: Data quality assurance after ingestion.

**What it validates**:

- Document counts match expected values from bulk download
- Missing lessons identified
- Per-subject/keystage coverage analysis

**Related files**:

- `verify-ingestion-lib.ts` - Core validation logic
- `verify-ingestion.unit.test.ts` - Tests for validation functions

---

## Common Workflows

### Full Ingestion & Validation

```bash
# 1. Ensure ES is running and indices are set up
pnpm es:setup

# 2. Ensure Redis is running (for caching)
pnpm redis:up

# 3. Ingest all curriculum data (API mode)
pnpm es:ingest -- --api --all --verbose

# 4. Validate after completion
pnpm ingest:verify

# 5. Check index status
pnpm es:status
```

### Resumable Ingestion

If ingestion is interrupted, simply re-run the same command:

```bash
pnpm es:ingest -- --api --all --incremental --verbose
```

With `--incremental`, the CLI skips already-indexed documents, allowing resumption.

### Re-indexing After Schema Changes

```bash
# 1. Reset indices
pnpm es:setup reset

# 2. Re-index all data (API mode; bulk is default)
pnpm es:ingest -- --api --all --verbose
```

### Search URL Field Reindex Boundary

When deploying code changes that affect search document building or Oak URL
generation, some improvements only appear in the search index after a
re-ingest. Current code in `src/lib/indexing/` emits the following URL fields
for fresh documents:

| Field          | Source file                    | Status                                               |
| -------------- | ------------------------------ | ---------------------------------------------------- |
| `lesson_url`   | `lesson-document-builder.ts`   | Required; emitted via `generateLessonOakUrl()`       |
| `unit_url`     | `unit-document-core.ts`        | Required; emitted via `generateUnitOakUrl()`         |
| `unit_urls`    | `lesson-document-core.ts`      | Required; array of Oak unit URLs                     |
| `sequence_url` | `sequence-document-builder.ts` | Required; emitted via `generateSequenceOakUrl()`     |
| `thread_url`   | `thread-document-builder.ts`   | Intentionally omitted (threads have no Oak web page) |

The `generate*OakUrl()` helpers live in `oak-url-convenience.ts` in
`@oaknational/curriculum-sdk`. See
[ADR-145](../../../../docs/architecture/architectural-decisions/145-oak-url-naming-collision-remediation.md)
for the rename from `canonicalUrl` to `oakUrl`.

Existing indexed documents retain their old values until a re-ingest replaces
them. Common stale-index symptoms:

- Search results contain `thread_url` values even though current code omits
  the field.
- `lesson_url` values use an older URL pattern from before the Oak URL rename.

These are not code bugs when fresh documents emit the current shape; they clear
after overwrite-mode ingestion.

The `thread_url` field remains optional in the Elasticsearch mapping and Zod
schema for backward compatibility with existing indexed documents. The generated
field definitions live at
`packages/sdks/oak-sdk-codegen/code-generation/typegen/search/field-definitions/curriculum.ts`.

### Post-deploy Reindex Validation

After deploying document-building or URL-generation changes, run this workflow
from the `apps/oak-search-cli` workspace:

```bash
# 1. Ensure Redis is running (required for SDK response caching)
pnpm redis:status
pnpm redis:up

# 2. Re-download bulk data from the upstream API
pnpm bulk:download

# 3. Regenerate codegen artefacts from fresh bulk data
pnpm bulk:codegen

# 4. Reset indices and re-create mappings from current schema
pnpm es:reset

# 5. Full re-ingest all subjects (API mode)
pnpm es:ingest -- --api --all --verbose

# 6. Verify document counts and coverage
pnpm ingest:verify

# 7. Check index health
pnpm es:status
```

Validation checklist after re-ingest:

1. Run `pnpm ingest:verify` and confirm all subjects report expected counts.
2. Run `pnpm es:status` and confirm indices are green with expected document
   counts.
3. Spot-check search results for `thread_url`; the field should be absent from
   newly indexed thread documents.
4. Spot-check `lesson_url`, `unit_url`, and `sequence_url`; values should use
   the current Oak URL format.

### Stale `thread_url` Cleanup

When `thread_url` is made optional in thread index documents, existing
`oak_threads` records may still contain old values from previous ingestions.
Re-index threads to refresh documents without stale `thread_url` values:

```bash
# Re-index only threads (bulk ingestion mode)
pnpm es:ingest -- --index threads --verbose
```

Notes:

- Requires bulk download files in `./bulk-downloads` (run `pnpm bulk:download` first).
- Existing thread documents keep old `thread_url` values until they are re-indexed.
- Do not add `--incremental`; overwrite mode (default) is required for cleanup.
- This is safe because `thread_url` is optional in the schema.
- Re-indexing threads rewrites documents from current source data. Thread builders
  never emit `thread_url`, so stale values are removed on overwrite.

### Refreshing Transcripts

Many lessons legitimately have no transcript (art, PE, etc.). These 404 responses
are cached to avoid repeated API calls. To re-check for newly added transcripts:

```bash
# Re-fetch transcripts that were previously 404 (API mode)
pnpm es:ingest -- --api --all --ignore-cached-404 --verbose
```

**Note**: This does NOT clear the entire cache, only bypasses cached 404s for
transcript endpoints. See [ADR-066](../../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md)
for details on negative caching.

---

## Architecture

The ingestion pipeline uses a pattern-aware traversal strategy to handle
the 7 different curriculum structural patterns:

| Pattern               | Description                            | Subjects          |
| --------------------- | -------------------------------------- | ----------------- |
| `simple-flat`         | Standard year → units → lessons        | Most KS1-KS3      |
| `tier-variants`       | Year → tiers → units                   | Maths KS4         |
| `exam-subject-split`  | Year → exam subjects → tiers → units   | Science KS4       |
| `exam-board-variants` | Multiple sequences (AQA, Edexcel, OCR) | 12 subjects KS4   |
| `unit-options`        | Units with unitOptions[]               | 6 subjects KS4    |
| `no-ks4`              | No KS4 content                         | Cooking-nutrition |
| `empty`               | No content for combination             | Edge cases        |

**Implementation**: See `src/lib/indexing/curriculum-pattern-config.ts`

---

## Known Issues & Workarounds

### Upstream API Pagination Bug

**Issue**: The unfiltered `/lessons` endpoint returns incomplete data
(see [ADR-083](../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)).

**Workaround**: Use `fetchAllLessonsByUnit()` which fetches lessons unit-by-unit.

**Status**: Documented in API wishlist, workaround implemented.

---

## Related Documentation

- [ADR-080](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) - Curriculum patterns
- [ADR-083](../../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) - Lesson enumeration strategy
- [ADR-087](../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) - Batch-atomic ingestion
- [current-state.md](../../../../.agent/plans/archive/semantic-search-archive-dec25/current-state.md) - Archived system snapshot
