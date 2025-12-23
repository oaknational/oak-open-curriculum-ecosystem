# Ingestion Operations

Data loading, validation, and monitoring tools for the semantic search indices.

## Scripts

### `ingest-all-combinations.ts`

Bulk ingests all subject/keystage combinations from the Oak Curriculum API.

**Usage**:

```bash
pnpm ingest:all
```

**Purpose**: Production data loading for comprehensive curriculum coverage.

**What it does**:

- Fetches all available subject/keystage combinations
- Ingests lessons, units, threads, sequences for each combination
- Provides progress reporting
- Handles errors gracefully with retries

**Documentation**: See inline JSDoc and [INGESTION-GUIDE.md](../../docs/INGESTION-GUIDE.md)

---

### `check-progress.ts`

Monitors ingestion progress by querying Elasticsearch document counts.

**Usage**:

```bash
pnpm ingest:progress
```

**Purpose**: Real-time monitoring of ingestion operations.

**Output**: Document counts per index, ingestion rates, estimated completion time.

---

### `verify-ingestion.ts`

Validates ingested data for correctness and completeness.

**Usage**:

```bash
pnpm ingest:verify
```

**Purpose**: Data quality assurance after ingestion.

**What it validates**:

- Document counts match expected values
- Unit `lesson_count` fields are correct
- Thread relationships are populated
- No data corruption or truncation

**Related files**:

- `verify-ingestion-lib.ts` - Core validation logic
- `verify-ingestion.unit.test.ts` - Tests for validation functions

---

### `discover-lessons.ts`

Discovers available lessons from the Oak Curriculum API without ingesting.

**Usage**:

```bash
tsx operations/ingestion/discover-lessons.ts [options]
```

**Purpose**: Exploration and debugging of API data availability.

---

## Common Workflows

### Full Ingestion & Validation

```bash
# 1. Ensure ES is running and indices are set up
pnpm es:setup

# 2. Ingest all data
pnpm ingest:all

# 3. Monitor progress (in separate terminal)
pnpm ingest:progress

# 4. Validate after completion
pnpm ingest:verify

# 5. Check index status
pnpm es:status
```

### Debugging Ingestion Issues

```bash
# 1. Discover what data is available
tsx operations/ingestion/discover-lessons.ts --subject maths --keystage ks4

# 2. Check unit lesson counts
tsx operations/ingestion/verify-ingestion.ts

# 3. Review logs
# Check application logs for error details
```

## Known Issues & Workarounds

### Upstream API Pagination Bug

**Issue**: The unfiltered `/lessons` endpoint returns incomplete data (see [ADR-083](../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)).

**Workaround**: Use `fetchAllLessonsByUnit()` which fetches lessons unit-by-unit.

**Status**: Documented in API wishlist, workaround implemented.

## Related Documentation

- [INGESTION-GUIDE.md](../../docs/INGESTION-GUIDE.md) - Comprehensive ingestion guide
- [ADR-083](../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md) - Lesson enumeration strategy
- [current-state.md](../../.agent/plans/semantic-search/current-state.md) - Current system metrics including index status
