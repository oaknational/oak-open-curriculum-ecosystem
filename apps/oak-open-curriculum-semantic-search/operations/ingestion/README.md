# Ingestion Operations

Data loading, validation, and monitoring tools for the semantic search indices.

## Canonical Ingestion Process

The canonical way to ingest curriculum data is via the main CLI:

```bash
# Full curriculum ingestion (all 17 subjects)
pnpm es:ingest-live --all --verbose

# Specific subject
pnpm es:ingest-live --subject maths --verbose

# Specific subject and keystage
pnpm es:ingest-live --subject maths --keystage ks4 --verbose

# Dry run (preview without indexing)
pnpm es:ingest-live --all --dry-run

# Force mode (overwrite existing documents)
pnpm es:ingest-live --all --force
```

### CLI Flags

| Flag                  | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `--all`               | Ingest all 17 subjects                                |
| `--subject <slug>`    | Ingest specific subject(s), can be repeated           |
| `--keystage <slug>`   | Filter by key stage (ks1, ks2, ks3, ks4)              |
| `--index <kind>`      | Filter to specific index kind (lessons, units, etc.)  |
| `--verbose`           | Enable detailed logging                               |
| `--dry-run`           | Preview without indexing                              |
| `--force`             | Overwrite existing documents (default: skip existing) |
| `--bypass-cache`      | Skip Redis cache requirement                          |
| `--clear-cache`       | Clear SDK response cache before ingestion             |
| `--ignore-cached-404` | Ignore cached 404s for transcripts (re-fetch)         |

### Incremental vs Force Mode

- **Incremental (default)**: Uses ES `create` action. Skips existing documents.
  Enables resumable ingestion if interrupted.
- **Force (`--force`)**: Uses ES `index` action. Overwrites existing documents.
  Use for full re-index or schema changes.

---

## Scripts

### `verify-ingestion.ts`

Validates ingested data for correctness and completeness.

**Usage**:

```bash
pnpm ingest:verify
pnpm ingest:verify --subject maths --keystage ks4
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

### `discover-lessons.ts`

Discovers available lessons from the search API for ground truth population.

**Usage**:

```bash
tsx operations/ingestion/discover-lessons.ts
```

**Purpose**: Exploration and debugging of search results for evaluation.

---

## Common Workflows

### Full Ingestion & Validation

```bash
# 1. Ensure ES is running and indices are set up
pnpm es:setup

# 2. Ensure Redis is running (for caching)
pnpm redis:up

# 3. Ingest all curriculum data
pnpm es:ingest-live --all --verbose

# 4. Validate after completion
pnpm ingest:verify

# 5. Check index status
pnpm es:status
```

### Resumable Ingestion

If ingestion is interrupted, simply re-run the same command:

```bash
pnpm es:ingest-live --all --verbose
```

The default incremental mode skips already-indexed documents, allowing resumption.

### Re-indexing After Schema Changes

```bash
# 1. Reset indices
pnpm es:setup reset

# 2. Force re-index all data
pnpm es:ingest-live --all --force --verbose
```

### Refreshing Transcripts

Many lessons legitimately have no transcript (art, PE, etc.). These 404 responses
are cached to avoid repeated API calls. To re-check for newly added transcripts:

```bash
# Re-fetch transcripts that were previously 404
pnpm es:ingest-live --all --ignore-cached-404 --force --verbose
```

**Note**: This does NOT clear the entire cache, only bypasses cached 404s for
transcript endpoints. See [ADR-066](../../docs/architecture/architectural-decisions/066-sdk-response-caching.md)
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

- [ADR-080](../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) - Curriculum patterns
- [ADR-083](../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) - Lesson enumeration strategy
- [ADR-087](../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) - Batch-atomic ingestion
- [current-state.md](../../../.agent/plans/semantic-search/current-state.md) - Current system metrics
