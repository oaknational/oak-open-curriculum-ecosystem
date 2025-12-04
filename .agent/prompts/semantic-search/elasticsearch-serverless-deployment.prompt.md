# Elasticsearch Serverless Deployment Prompt

Use this prompt to configure and deploy indexes on the existing ES Serverless instance.

## Foundation Documents (READ FIRST)

1. `.agent/directives-and-memory/rules.md` - Cardinal rule and code design principles
2. `.agent/directives-and-memory/testing-strategy.md` - TDD at all levels (E2E ≠ network, only smoke tests hit network)
3. `semantic-search-implementation.prompt.md` (same directory) - Current semantic search state

## Target Environment

**ES Serverless Instance (ALREADY PROVISIONED)**:

```text
Endpoint: https://poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud:443
Region: europe-west1 (GCP)
Status: Provisioned, no indexes created
```

**What needs to be done**:

1. Generate/obtain API key with correct permissions
2. Create synonym set (`oak-syns`)
3. Create indexes with mappings (5 indexes)
4. Verify connection and permissions
5. Run initial data ingestion (sandbox fixtures or live SDK)

## Required API Key Permissions

The API key needs these privileges:

- `manage` - for index operations (create, delete, configure)
- `read` - for search queries
- `write` - for document indexing
- `monitor` - for cluster health checks

## Scripts Architecture Overview

The `scripts/` directory contains **operational infrastructure**, not just simple utilities:

```text
scripts/
├── setup.sh              # Index bootstrap (generates synonyms from SDK + creates indexes)
├── alias-swap.sh         # Zero-downtime index repointing
├── generate-synonyms.ts  # Exports SDK synonyms to ES format
├── sandbox/
│   └── ingest.ts         # CLI-driven fixture/live ingestion
├── observability/
│   └── delete-zero-hit-events.ts  # Telemetry cleanup
└── archive/
    └── scaffolding/      # HISTORICAL - app bootstrap scripts (reference only)

src/lib/elasticsearch/definitions/  # Index mapping files
├── oak-lessons.json
├── oak-units.json
├── oak-unit-rollup.json
├── oak-sequences.json
└── oak-sequence-facets.json
```

## SDK Data Imports (Single Source of Truth)

**Synonyms, ontology data, and knowledge graph are imported from SDK**:

```typescript
import {
  ontologyData, // Curriculum domain model
  conceptGraph, // Knowledge graph structure
  buildElasticsearchSynonyms, // ES synonym export
  buildSynonymLookup, // Term normalisation
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools';
```

The `setup.sh` script generates synonyms dynamically from SDK at runtime.

## Search Index Target System

The app supports **dual-target indexing** for safe testing:

| Target    | Index Names                      | Use Case    |
| --------- | -------------------------------- | ----------- |
| `primary` | `oak_lessons`, `oak_units`, etc. | Production  |
| `sandbox` | `oak_lessons_sandbox`, etc.      | Testing/dev |

Configured via `SEARCH_INDEX_TARGET` env var. The `rewriteBulkOperations()` function automatically maps index names.

## Index Ecosystem (5 Indexes)

### 1. oak_lessons

Lesson documents with semantic embeddings for hybrid search.

**Key Fields**:

- `lesson_id`, `lesson_slug`, `lesson_title`
- `subject_slug`, `key_stage`, `years`
- `unit_ids[]`, `unit_titles[]`, `unit_count`
- `lesson_keywords[]`, `key_learning_points[]`, `misconceptions_and_common_mistakes[]`
- `teacher_tips[]`, `content_guidance[]`
- `transcript_text` (text with term vectors for highlighting)
- `lesson_semantic` (semantic_text for vector search)
- `title_suggest` (completion with subject/key_stage/sequence contexts)

### 2. oak_units

Basic unit metadata for faceted filtering.

**Key Fields**:

- `unit_id`, `unit_slug`, `subject_slug`, `key_stage`, `years`
- `lesson_ids[]`, `lesson_count`
- `unit_topics[]`, `sequence_ids[]`
- `unit_url`, `subject_programmes_url`, `updated_at`

### 3. oak_unit_rollup

Unit documents with aggregated lesson snippets for semantic search.

**Key Fields**:

- Same as units, plus:
- `unit_title` (text, copy_to unit_semantic)
- `rollup_text` (concatenated lesson passages, copy_to unit_semantic)
- `unit_semantic` (semantic_text)
- `title_suggest` (completion with contexts)

### 4. oak_sequences

Programme sequence documents for curriculum navigation.

**Key Fields**:

- `sequence_id`, `sequence_slug`, `sequence_title`
- `subject_slug`, `subject_title`, `phase_slug`, `phase_title`
- `category_titles[]`, `key_stages[]`, `years[]`, `unit_slugs[]`
- `sequence_semantic` (semantic_text)
- `title_suggest` (completion with subject/phase contexts)

### 5. oak_sequence_facets

Sequence facet documents for faceted navigation.

**Key Fields**:

- `subject_slug`, `sequence_slug`, `key_stage`, `key_stage_title`
- `phase_slug`, `phase_title`
- `years[]`, `unit_slugs[]`, `unit_titles[]`
- `unit_count`, `lesson_count`
- `has_ks4_options` (boolean for KS4 complexity)
- `sequence_canonical_url`

### 6. oak_zero_hit_events (telemetry)

Telemetry index for zero-result queries, created lazily on first write.

**Key Fields**:

- `@timestamp`, `search_scope`, `query`
- `filters` (flattened), `index_version`
- `request_id`, `session_id`
- `took_ms`, `timed_out`

**Note**: This index is NOT created by `setup.sh`. It is created automatically when the first zero-hit event is persisted, with an ILM policy for automatic retention.

## Synonym Set (oak-syns)

**Source**: SDK `ontologyData.synonyms` (single source of truth)

Synonyms are generated dynamically by `scripts/generate-synonyms.ts` which calls `buildElasticsearchSynonyms()` from the SDK. Categories:

- **Key stages**: ks1-ks4 ↔ year groups, GCSE
- **Subjects**: maths ↔ mathematics, dt ↔ design and technology
- **Geography themes**: climate, mountains, rivers, coasts, volcanoes
- **History periods**: WW1, WW2, Tudors, Victorians, Cold War
- **Maths concepts**: addition ↔ add ↔ plus ↔ sum
- **English**: grammar, punctuation, Shakespeare
- **Science**: photosynthesis, respiration, forces, energy

**Note**: The static `scripts/synonyms.json` file was deleted. Synonyms now flow from SDK.

## Environment Configuration

File: `apps/oak-open-curriculum-semantic-search/.env.example`

```env
# Required for ES
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here

# Required for data ingestion
OAK_API_KEY=your_oak_api_key_here

# Index target: primary | sandbox
SEARCH_INDEX_TARGET=sandbox

# Optional: LLM for natural language parsing
AI_PROVIDER=openai  # or 'none' to disable
OPENAI_API_KEY=your_openai_api_key_here
```

Create `.env.local`:

```bash
cd apps/oak-open-curriculum-semantic-search
cp .env.example .env.local
# Edit with your credentials
```

## Script Details

### setup.sh - Index Bootstrap

Creates synonyms and indexes in the correct order:

```bash
# Generates synonyms dynamically from SDK ontologyData
SYNONYMS_JSON=$(npx tsx "$SCRIPT_DIR/generate-synonyms.ts")

# Creates oak-syns synonym set (MUST happen first - indexes reference it)
echo "$SYNONYMS_JSON" | curl -X PUT "${ES_URL}/_synonyms/oak-syns" -d @-

# Creates indexes with mappings from src/lib/elasticsearch/definitions/
for idx in oak_lessons oak_unit_rollup oak_units oak_sequences oak_sequence_facets; do
  curl -X PUT "${ES_URL}/${idx}" --data-binary @"${DEFINITIONS_DIR}/${idx//_/-}.json"
done
```

**Note**: Indexes reference `oak-syns` in their `oak_syns_filter` analyzer, so synonyms MUST be created first.

### alias-swap.sh - Zero-Downtime Deployment

Atomically swaps index aliases for blue-green deployments:

```bash
# Usage: alias-swap.sh <fromIndex> <toIndex> <alias>
./alias-swap.sh oak_lessons_v1 oak_lessons_v2 oak_lessons_live
```

Executes atomic `_aliases` operation removing old and adding new in single transaction.

### sandbox/ingest.ts - Data Ingestion CLI

Sophisticated ingestion harness supporting:

- **Fixture-backed mode**: Reads from `fixtures/sandbox/` JSON files
- **Live SDK mode**: Fetches real data via Oak Curriculum SDK
- **Dry-run**: Preview what would be indexed without ES calls
- **Target selection**: Route to `primary` or `sandbox` indexes
- **Metrics collection**: Tracks sequence facet processing times

```bash
# Fixture-backed sandbox ingestion
pnpm sandbox:ingest --target sandbox --dry-run --verbose

# Live SDK ingestion to primary
pnpm sandbox:ingest --target primary
```

The harness uses `buildIndexBulkOps()` which:

1. Fetches subject sequences
2. Builds sequence facet sources
3. For each key-stage/subject pair:
   - Builds unit documents
   - Builds lesson documents (with transcripts)
   - Builds rollup documents (aggregated snippets)
   - Builds sequence facet documents

### observability/delete-zero-hit-events.ts - Telemetry Cleanup

Purges old zero-hit telemetry events with retention policy:

```bash
# Delete events older than 30 days (requires --force)
pnpm zero-hit:purge --target sandbox --older-than-days 30 --force
```

## Document Transform Pipeline

The `src/lib/indexing/document-transforms.ts` module creates ES documents:

```typescript
createUnitDocument({ summary, subject, keyStage, subjectProgrammesUrl })
// → SearchUnitsIndexDoc with title_suggest contexts

createLessonDocument({ lesson, transcript, summary, ... })
// → SearchLessonsIndexDoc with keywords, learning points, etc.

createRollupDocument({ summary, snippets, ... })
// → SearchUnitRollupDoc with rollup_text from lesson passages
```

**Key insight**: `extractPassage()` pulls first 1-2 sentences (≤300 chars) from each lesson transcript to create `rollup_text`.

## Step-by-Step Deployment Checklist

### Phase 0.1: API Key Generation

1. Log into Elastic Cloud console: <https://cloud.elastic.co/>
2. Navigate to the project: `poc-open-curriculum-api-search`
3. Go to **Security** → **API Keys** → **Create API Key**
4. Configure:
   - **Name**: `oak-search-app-dev`
   - **Expiration**: No expiration (for development)
   - **Privileges**: Full access (or specify indices: `oak_*`)
5. Copy the encoded API key (format: `base64(id:api_key)`)

### Phase 0.2: Verify Connection

Test the connection manually:

```bash
export ES_URL="https://poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud:443"
export ES_KEY="<your-api-key>"

# Test cluster health
curl -s -H "Authorization: ApiKey ${ES_KEY}" "${ES_URL}/_cluster/health" | jq .

# List existing indices (should be empty initially)
curl -s -H "Authorization: ApiKey ${ES_KEY}" "${ES_URL}/_cat/indices?v"
```

Expected health response:

```json
{
  "cluster_name": "...",
  "status": "green",
  "number_of_nodes": ...,
  ...
}
```

### Phase 0.3: Create Indexes

```bash
cd apps/oak-open-curriculum-semantic-search
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
pnpm elastic:setup
```

Verify:

```bash
curl -s -H "Authorization: ApiKey ${ES_KEY}" "${ES_URL}/_cat/indices?v" | grep oak
```

Expected output shows 5 indexes:

```text
health status index               uuid  pri rep docs.count docs.deleted store.size pri.store.size
green  open   oak_lessons         ...   1   0   0          0            ...        ...
green  open   oak_units           ...   1   0   0          0            ...        ...
green  open   oak_unit_rollup     ...   1   0   0          0            ...        ...
green  open   oak_sequences       ...   1   0   0          0            ...        ...
green  open   oak_sequence_facets ...   1   0   0          0            ...        ...
```

### Phase 0.4: Initial Data Ingestion

**Option A: Sandbox fixtures (no Oak API key needed)**

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm sandbox:ingest --target sandbox --dry-run  # Preview
pnpm sandbox:ingest --target sandbox            # Ingest fixtures
```

**Option B: Live SDK data (requires OAK_API_KEY)**

```bash
# Via API route (slower, full curriculum)
curl -H "x-api-key: ${SEARCH_API_KEY}" http://localhost:3000/api/index-oak
```

### Phase 0.5: Verify Ingestion

```bash
# Check document counts
curl -s -H "Authorization: ApiKey ${ES_KEY}" "${ES_URL}/_cat/indices?v" | grep oak

# Test a simple search
curl -s -H "Authorization: ApiKey ${ES_KEY}" \
     -H "Content-Type: application/json" \
     "${ES_URL}/oak_lessons/_search" \
     -d '{"query":{"match_all":{}},"size":1}' | jq '.hits.total'

# Test semantic search (after documents are indexed)
curl -s -H "Authorization: ApiKey ${ES_KEY}" \
     -H "Content-Type: application/json" \
     "${ES_URL}/oak_lessons/_search" \
     -d '{"query":{"semantic":{"field":"lesson_semantic","query":"climate change"}}}' | jq '.hits.hits[:2]'
```

## Scaffolding Scripts (HISTORICAL REFERENCE)

The `scripts/archive/scaffolding/` directory contains **historical scaffolding scripts** used to bootstrap the app:

- `oak-open-curriculum-search-scaffolding.sh` - Full app scaffold (1200+ lines)
- `apply-split-search-endpoints.sh` - Patch for endpoint separation

**These are NOT meant to be run again.** They document:

- Original architecture design patterns
- SDK-first adapter approach
- RRF (Reciprocal Rank Fusion) implementation
- Hybrid search query structure
- Type-safe SDK guard integration

Reference these for understanding the app's design philosophy.

## API Routes for Indexing

### GET /api/index-oak

Full curriculum indexing via SDK:

```bash
curl -H "x-api-key: ${SEARCH_API_KEY}" http://localhost:3000/api/index-oak
```

Uses `buildIndexBulkOps()` → `rewriteBulkOperations()` → `esBulk()` pipeline.

### GET /api/rebuild-rollup (if exists)

Rebuilds unit rollup documents from existing lesson data.

## Creating Smoke Tests

Per the testing strategy, ES connection tests should be **smoke tests** (not E2E):

- E2E tests: CAN trigger File System and STDIO IO but **NOT network IO**
- Smoke tests: CAN trigger all IO types including network

Create smoke tests in:

```text
apps/oak-open-curriculum-semantic-search/smoke-tests/
```

Example smoke test structure:

```typescript
// smoke-tests/es-connection.smoke.test.ts
import { describe, it, expect } from 'vitest';
import { Client } from '@elastic/elasticsearch';

describe('ES Connection (Smoke)', () => {
  it('should connect to Elasticsearch cluster', async () => {
    const client = new Client({
      node: process.env.ELASTICSEARCH_URL,
      auth: { apiKey: process.env.ELASTICSEARCH_API_KEY },
    });
    const health = await client.cluster.health();
    expect(health.status).toMatch(/green|yellow/);
  });

  it('should have oak_lessons index', async () => {
    const client = new Client({ ... });
    const exists = await client.indices.exists({ index: 'oak_lessons' });
    expect(exists).toBe(true);
  });

  it('should support semantic search', async () => {
    const client = new Client({ ... });
    const result = await client.search({
      index: 'oak_lessons',
      query: { semantic: { field: 'lesson_semantic', query: 'test' } },
      size: 1
    });
    expect(result.hits).toBeDefined();
  });
});
```

## Troubleshooting

### "unauthorized" or 401 errors

- API key may be incorrect or expired
- Check that the key has correct privileges
- Verify the key format (should be base64 encoded `id:api_key`)

### "index_not_found_exception"

- Run `pnpm elastic:setup` first
- Check that the index names match (`oak_lessons` not `oak-lessons`)

### Synonym set errors

- Synonyms must be created before indexes that reference them
- The setup script handles this order correctly

### semantic_text field errors

- Ensure ES Serverless supports semantic_text (it should by default)
- Check that the inference model is available

## Reference Documentation

- `.agent/reference-docs/elasticsearch/README.md` - Overview and links
- `.agent/reference-docs/elasticsearch/elastic-search-serverless-docs.md` - Serverless concepts
- `.agent/reference-docs/elasticsearch/elastic-cloud-serverless-api-usage.md` - API examples
- `apps/oak-open-curriculum-semantic-search/docs/ES_SERVERLESS_SETUP.md` - App-specific setup guide

## Quality Gates Reminder

After deployment changes, run the full quality gate suite:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

## Success Criteria

| Checkpoint                  | Expected Result                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------- |
| API key generated           | 64+ character base64 string                                                            |
| Connection test             | `{"status":"green"}` or `"yellow"`                                                     |
| Synonyms set created        | `oak-syns` available at `/_synonyms/oak-syns`                                          |
| Indexes created             | 5 indexes: oak_lessons, oak_units, oak_unit_rollup, oak_sequences, oak_sequence_facets |
| Sandbox ingestion (dry-run) | Lists documents with counts per index kind                                             |
| Sandbox ingestion (live)    | Documents appear in indexes (doc count > 0)                                            |
| Lexical search works        | `match_all` returns documents                                                          |
| Semantic search works       | `semantic` query on `*_semantic` fields works                                          |
| Completion suggest works    | `title_suggest` returns autocomplete options                                           |
| Smoke test passes           | ES connection smoke test green                                                         |

## Key Implementation Files

| File                                      | Purpose                              |
| ----------------------------------------- | ------------------------------------ |
| `src/lib/es-client.ts`                    | Singleton ES client factory          |
| `src/lib/elastic-http.ts`                 | Search/bulk helpers with type safety |
| `src/lib/search-index-target.ts`          | Primary/sandbox target resolution    |
| `src/lib/index-oak.ts`                    | Build bulk ops from SDK data         |
| `src/lib/indexing/document-transforms.ts` | Create index documents               |
| `src/lib/indexing/sandbox-harness.ts`     | Orchestrate fixture/live ingestion   |
| `src/adapters/oak-adapter-sdk.ts`         | Oak SDK client wrapper               |
| `app/api/index-oak/route.ts`              | HTTP endpoint for full indexing      |

## Next Steps After Deployment

Once ES is deployed and verified:

1. **Update prompts**: Mark Phase 0 complete in `semantic-search-implementation.prompt.md`
2. **Create smoke tests**: Add `smoke-tests/` directory with ES connection tests
3. **Continue Phase 1**: Thread filtering, programme factors
4. **Production ingestion**: Full curriculum via `/api/index-oak` or enhanced sandbox harness
5. **Widget integration**: Connect semantic search to OpenAI app widget

## Architectural Notes

### Why 5 Index Kinds?

1. **oak_lessons**: Fine-grained search on lesson content
2. **oak_units**: Fast faceted filtering on unit metadata
3. **oak_unit_rollup**: Unit-level semantic search without duplicating all transcripts
4. **oak_sequences**: Programme/sequence navigation
5. **oak_sequence_facets**: Sequence-based faceted navigation

### Hybrid Search Pattern

The app uses **RRF (Reciprocal Rank Fusion)** to combine:

- **Lexical search**: BM25 on `*_title`, `transcript_text`, `rollup_text`
- **Semantic search**: Vector search on `*_semantic` fields

This is implemented in `src/lib/rrf.ts` and `src/lib/hybrid-search/`.

### Rollup Text Strategy

Instead of storing full transcripts on units, `rollup_text` contains extracted passages (first 1-2 sentences, ≤300 chars) from each lesson. This enables:

- Unit-level semantic search
- Snippet highlights in results
- Manageable index size
