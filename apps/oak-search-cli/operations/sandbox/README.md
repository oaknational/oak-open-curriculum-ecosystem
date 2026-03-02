# Sandbox Operations

Development and testing utilities for ingesting fixture data.

## Scripts

### `ingest.ts`

Ingests fixture data into Elasticsearch for local development and testing.

**Usage**:

```bash
# Ingest default fixtures
pnpm sandbox:ingest

# Specify custom fixture directory
tsx operations/sandbox/ingest.ts --fixture path/to/fixtures

# Dry run
tsx operations/sandbox/ingest.ts --dry-run

# Verbose output
tsx operations/sandbox/ingest.ts --verbose

# Target specific environment
tsx operations/sandbox/ingest.ts --target sandbox
```

**Purpose**: Local development and integration testing with controlled fixture data.

**What it does**:

- Loads lesson/unit/thread/sequence data from JSON fixtures
- Transforms to Elasticsearch document format
- Ingests into specified target index
- Uses `ingest-harness` library for orchestration
- Provides structured logging of operations

**CLI Flags**:

- `--target <env>` - Target environment (sandbox|primary)
- `--fixture <path>` - Path to fixture directory (default: `fixtures/sandbox`)
- `--dry-run` - Validate fixtures without ingesting
- `--verbose` - Enable detailed logging

## Ingestion Harness

The ingestion harness (`src/lib/indexing/ingest-harness.ts`) provides:

- Fixture loading and validation
- Document transformation
- Batch ingestion with atomic commits
- Progress reporting
- Error handling

**Documentation**: See [ingestion-harness.md](../../docs/ingestion-harness.md)

## Creating Fixtures

Fixture files should be placed in `fixtures/sandbox/` with this structure:

```text
fixtures/sandbox/
├── lessons.json       # Array of lesson objects
├── units.json         # Array of unit objects
├── threads.json       # Array of thread objects
└── sequences.json     # Array of sequence objects
```

Each fixture file should contain valid curriculum data matching the SDK types.

## Common Workflows

### Local Development Setup

```bash
# 1. Start local ES
docker compose up -d

# 2. Set up indices
pnpm es:setup

# 3. Ingest fixture data
pnpm sandbox:ingest

# 4. Verify
pnpm es:status
```

### Testing New Transformations

```bash
# 1. Update fixtures
# Edit fixtures/sandbox/*.json

# 2. Dry run to validate
tsx operations/sandbox/ingest.ts --dry-run --verbose

# 3. Ingest if valid
pnpm sandbox:ingest
```

## Related Documentation

- [ingestion-harness.md](../../docs/ingestion-harness.md) - Detailed harness documentation
- [ingestLogger](../../src/lib/logger.ts) - Logging utilities
- [SearchIndexTarget](../../src/lib/search-index-target.ts) - Environment configuration
