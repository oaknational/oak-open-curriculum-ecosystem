# Semantic Search Continuation Prompt

Use this prompt to continue semantic search implementation work in a fresh session with no prior context.

## What is This System?

The Oak Open Curriculum Semantic Search is a Next.js application providing hybrid search (semantic + lexical) across Oak's curriculum data using Elasticsearch Serverless. It combines:

- **Semantic search**: ELSER sparse embeddings for meaning-based retrieval
- **Lexical search**: Traditional keyword + synonym matching
- **RRF fusion**: Combines both approaches for optimal results
- **Faceted navigation**: Filter by subject, key stage, year, category
- **Type-ahead suggestions**: Context-aware completion with per-index contexts

**Current State**: ES Serverless deployed and operational. All blocking issues resolved. Quality gates passing. Ready for next phase.

## Foundation Documents (MUST READ FIRST)

Before any work, read and internalize:

1. `.agent/directives-and-memory/rules.md` - Cardinal rule, code design, quality gates
2. `.agent/directives-and-memory/testing-strategy.md` - TDD at all levels
3. `.agent/directives-and-memory/schema-first-execution.md` - Schema-first mandate
4. `.agent/directives-and-memory/AGENT.md` - Agent directives

**Key Principles**:

- **Schema-First**: All types, schemas, validators flow from OpenAPI schema via `pnpm type-gen`
- **Quality Gates**: All gate issues are BLOCKING—no exceptions
- **TDD**: Red → Green → Refactor at all levels (unit, integration, E2E)
- **No Type Shortcuts**: No `as`, `any`, `!`, `Record<string, unknown>`, `Object.*`
- **Logging**: Use `@oaknational/mcp-logger`, never `console`
- **No Disabling**: Never use `eslint-disable` comments—forbidden
- **Completion Contexts**: Per-index contexts enforced (ADR-068)
- **Complexity**: Functions ≤8 complexity, files ≤250 lines

**Re-read foundation documents regularly during work.**

---

## Recent Improvements ✅

### Generator Drift Fixed (2025-12-06)

The generator vs generated drift issue has been **RESOLVED**. All changes now properly flow from generator templates following schema-first principles.

**Completed**:

- ✅ Updated `generate-search-index.ts` to emit per-index completion schemas
- ✅ Removed deprecated `SearchCompletionSuggestPayload*` exports from generators
- ✅ Removed all forbidden `eslint-disable` comments
- ✅ Added comprehensive unit tests for generator output
- ✅ All quality gates passing

### Type Safety Cleanup (2025-12-06)

**19 lint errors resolved**:

- ✅ Eliminated all type assertions (`as`), type shortcuts (`any`, `Record<string, unknown>`)
- ✅ Used proper openapi3-ts library types throughout
- ✅ Extracted complex functions into pure functions (complexity ≤8)
- ✅ Created `response-augmentation-helpers.ts` for path/ID extraction
- ✅ Files under 250 lines

### CLI Enhancement (2025-12-06)

- ✅ Added `--index` filter for selective ingestion (e.g., `--index lessons`)
- ✅ Reduces unnecessary data uploads during development
- ✅ Extracted filtering/metrics logic to separate modules

### Schema-First Ingestion (2025-12-06)

**Result<T,E> Error Handling**:

- ✅ Created `packages/libs/result` library for functional error handling
- ✅ Refactored `index-meta.ts` to use `Result<T,E>` pattern
- ✅ Fail-fast behavior with detailed ES errors in ingestion pipeline

**Field Definitions Organization**:

- ✅ Reorganized field definitions into domain-focused modules:
  - `field-definitions/curriculum.ts` - Educational content indexes
  - `field-definitions/observability.ts` - System behavior indexes (meta, zero-hit)
  - `field-definitions/types.ts` - Shared types
- ✅ Added boolean zodType support throughout generators
- ✅ Moved `oak_meta` index to schema-first (IndexMetaDoc, OAK_META_MAPPING)
- ✅ Moved `oak_zero_hit_telemetry` index to schema-first (ZeroHitDoc, OAK_ZERO_HIT_MAPPING)
- ✅ Created specific ES types to replace generic `UnknownRecord`

**Analysis**: See `.agent/analysis/semantic-search-compliance-and-ingestion-discovery.md` and `.agent/plans/semantic-search/schema-first_completion_*.plan.md`

---

## What's Been Completed

### Infrastructure ✅

- Elasticsearch Serverless deployed and operational
- Six indexes created: `oak_lessons`, `oak_units`, `oak_unit_rollup`, `oak_sequences`, `oak_sequence_facets`, `oak_meta`
- Synonym set `oak-syns` with 68 rules deployed
- ELSER sparse embeddings configured (`semantic_text` fields)
- Split analyzers for Serverless (`oak_text_index`, `oak_text_search`)

### SDK & Type Generation ✅

- Schema-first architecture: all types flow from OpenAPI via `pnpm type-gen`
- Unified field definitions: Zod schemas + ES mappings from single source
- Per-index completion context schemas (ADR-068)
- 13 generated search modules in SDK
- Response augmentation: automatic `canonicalUrl` injection

### Code Quality ✅

- All console statements replaced with `@oaknational/mcp-logger`
- Verbose flag controls log level (DEBUG/INFO)
- 19 type safety lint errors fixed
- No type shortcuts, all functions ≤8 complexity
- Generator drift resolved

### Features ✅

- Hybrid search with RRF (semantic + lexical)
- Three search endpoints: structured, natural language, suggestions
- Faceted navigation with subject/key stage/year filters
- CLI tools for ES setup, status, and ingestion
- `--index` filter for selective ingestion

## Current Elasticsearch State

**Last verified**: 2025-12-06 via Kibana

| Index                 | Docs | Status                                    |
| --------------------- | ---- | ----------------------------------------- |
| `oak_unit_rollup`     | 105  | ✅ Maths KS1 unit rollups                 |
| `oak_units`           | 37   | ✅ Unit metadata                          |
| `oak_lessons`         | 0    | ⚠️ Ready to re-ingest with fixed contexts |
| `oak_sequences`       | 0    | ⏳ Not yet populated                      |
| `oak_sequence_facets` | 0    | ⏳ Not yet populated                      |
| `oak_meta`            | 0    | ⏳ Version tracking index                 |

**Synonym Set**: `oak-syns` with 68 rules ✅

**Note**: Unit-level ingestion succeeded (142 docs). Lessons failed due to completion context bug (now fixed). Ready to re-ingest.

---

## Quick Reference

### Elasticsearch Serverless

- **Kibana**: <https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud>
- **Cluster**: `poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud:443`

### CLI Commands

All commands run from `apps/oak-open-curriculum-semantic-search`:

```bash
# Check Elasticsearch status
pnpm es:status

# Full ingestion (all subjects, all key stages)
pnpm es:ingest-live --verbose

# Filtered ingestion
pnpm es:ingest-live --subject maths --verbose
pnpm es:ingest-live --subject maths --keystage ks1 --verbose
pnpm es:ingest-live --subject maths --index lessons --verbose  # NEW: index filter

# Reset indexes (destructive)
npx tsx src/lib/elasticsearch/setup/cli.ts reset

# Development with caching (speeds up repeated ingestion)
pnpm redis:up  # Start Redis
SDK_CACHE_ENABLED=true pnpm es:ingest-live --subject maths --dry-run

# Dry run (preview without uploading)
pnpm es:ingest-live --subject maths --dry-run --verbose
```

**Environment Variables**:

- `ELASTICSEARCH_URL` - ES cluster endpoint (from `.env`)
- `ELASTICSEARCH_API_KEY` - API key for authentication
- `SDK_CACHE_ENABLED=true` - Enable Redis caching (optional)
- `OAK_API_KEY` - Oak curriculum API key

### Quality Gates

```bash
# From repo root, all must pass
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix
pnpm format:root && pnpm markdownlint:root
pnpm test && pnpm test:e2e && pnpm test:e2e:built
pnpm test:ui && pnpm smoke:dev:stub
```

---

## Immediate Next Steps

All blocking issues resolved! Ready to resume semantic search development.

### Option A: Resume Ingestion

Full re-ingestion with fixed completion contexts:

```bash
cd apps/oak-open-curriculum-semantic-search
npx tsx src/lib/elasticsearch/setup/cli.ts reset
pnpm es:ingest-live --subject maths --verbose
```

Verify in Kibana that lessons index successfully (completion contexts now correct).

### Option B: Selective Re-ingestion

Use new `--index` filter to re-ingest only lessons:

```bash
pnpm es:ingest-live --subject maths --index lessons --verbose
```

### Option C: Next Phase Work

Continue with semantic search roadmap:

- Reference indices (subjects, key stages, years)
- Ontology integration
- See `.agent/plans/semantic-search/semantic-search-overview.md` for phases

---

## Key Concepts

### Per-Index Completion Contexts (ADR-068)

Elasticsearch completion suggester contexts vary by index:

| Index                 | Contexts                             |
| --------------------- | ------------------------------------ |
| `oak_lessons`         | `subject`, `key_stage`, `phase`      |
| `oak_units`           | `subject`, `key_stage`, `phase`      |
| `oak_unit_rollup`     | `subject`, `key_stage`, `phase`      |
| `oak_sequences`       | `subject`, `phase`                   |
| `oak_sequence_facets` | `subject`, `phase`                   |
| `oak_threads`         | `subject`, `phase` (NOT `key_stage`) |

**Why?** Threads span multiple key stages, so filtering by key stage makes no sense.

**Implementation**: Single source of truth in `completion-contexts.ts`, enforced via generated Zod schemas and ES mappings.

### Unified Field Definitions Architecture

All field definitions flow from a single source, organized by domain:

```text
field-definitions/
├── types.ts (ZodFieldType, FieldDefinition)
├── curriculum.ts (lessons, units, sequences, threads)
├── observability.ts (meta, zero-hit telemetry)
└── index.ts (barrel export)
    ↓
├── zod-schema-generator.ts → Zod Schemas
└── es-mapping-from-fields.ts → ES Mappings (+ es-field-overrides.ts)
```

This prevents Zod/ES mapping drift that caused `strict_dynamic_mapping_exception`.

### Schema-First Mandate

**Never edit generated files directly.** Always update generators:

✅ **Edit These** (Generator Templates):

```
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/
├── generate-search-index.ts          # Main generator
├── generate-search-index-docs.ts     # Doc schema generator
├── completion-contexts.ts            # Per-index context definitions
├── field-definitions/                # Domain-organized field definitions
│   ├── curriculum.ts
│   ├── observability.ts
│   └── types.ts
└── es-field-overrides.ts             # ES-specific overrides
```

❌ **Don't Edit These** (Generated Output):

```
packages/sdks/oak-curriculum-sdk/src/types/generated/search/
├── index.ts                          # Auto-generated barrel
├── index-documents.ts                # Auto-generated schemas
└── es-mappings/                      # Auto-generated mappings
```

After editing generators: `pnpm type-gen` → `pnpm build` → verify quality gates.

### Public API Boundaries

**NEVER import from internal paths.** Always use public API entry points defined in `package.json` exports:

✅ **Use These Public APIs**:

- `@oaknational/oak-curriculum-sdk` - Core API (`src/index.ts`)
- `@oaknational/oak-curriculum-sdk/public/search` - Search types (`src/public/search.ts`)
- `@oaknational/oak-curriculum-sdk/public/mcp-tools` - MCP tools (`src/public/mcp-tools.ts`)

❌ **Never Deep-Link Past Public Boundaries**:

```typescript
// ❌ FORBIDDEN - violates boundary discipline
import { X } from '@oaknational/oak-curriculum-sdk/types/generated/search/es-types.js';

// ✅ CORRECT - use public API
import { X } from '@oaknational/oak-curriculum-sdk/public/search.js';
```

If a type is needed but not exported, **add it to the appropriate public entry point first**.

---

## Future Roadmap (What Comes Next)

After re-ingestion, the semantic search system continues with these phases:

### Phase 2: Threads & Enhanced Filtering

- Thread search scope and filtering
- Programme factors, unit types, tier filtering
- Content guidance structure
- See: Search UI and Service plans

### Phase 3: Reference Indices

- Searchable subject catalogue (`oak_subjects`)
- Key stage index (`oak_key_stages`)
- Year group index (`oak_years`)
- See: `.agent/plans/semantic-search/reference-indices-plan.md`

### Phase 4: Static Ontology Index (RAG)

- `oak_ontology` index from ontology + knowledge graph data
- RAG-ready ontology for context injection
- See: `.agent/plans/semantic-search/entity-discovery-pipeline.md`

### Phase 5: Instance Knowledge Graph

- `oak_curriculum_graph` - actual curriculum graph
- `oak_entities` - extracted curriculum entities
- Graph relationships for navigation

### Phase 6: Graph RAG Integration

- Multi-hop reasoning combining graph + RAG
- See: `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`

### Phase 7: MCP Connectivity

- Enhanced MCP search tool with graph modes
- Graph-aware curriculum exploration

### Phase 8: OpenAI App Widget

- Search widget with graph visualizations
- Teacher-facing semantic search interface

## Documentation Links

| Topic                         | Location                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| **Planning Hub**              | `.agent/plans/semantic-search/index.md` ⭐ START HERE                                       |
| Phase roadmap                 | `.agent/plans/semantic-search/semantic-search-overview.md`                                  |
| Reference indices plan        | `.agent/plans/semantic-search/reference-indices-plan.md`                                    |
| Entity discovery pipeline     | `.agent/plans/semantic-search/entity-discovery-pipeline.md`                                 |
| Graph RAG vision              | `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`                          |
| SDK caching                   | `apps/oak-open-curriculum-semantic-search/docs/SDK-CACHING.md`                              |
| Discovery analysis            | `.agent/analysis/semantic-search-compliance-and-ingestion-discovery.md`                     |
| ADR-067 (ES mappings)         | `docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md`     |
| ADR-068 (completion contexts) | `docs/architecture/architectural-decisions/068-per-index-completion-context-enforcement.md` |

---

## Verification & Troubleshooting

### Verify System is Working

```bash
# 1. Check quality gates (from repo root)
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix
pnpm test  # Should pass 800+ tests

# 2. Check Elasticsearch status
cd apps/oak-open-curriculum-semantic-search
pnpm es:status  # Should show index stats

# 3. Try a dry-run ingestion
pnpm es:ingest-live --subject maths --keystage ks1 --dry-run --verbose
# Should show what would be uploaded without errors

# 4. View Kibana (requires login)
# https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud
```

### Common Issues

| Problem                            | Solution                                                        |
| ---------------------------------- | --------------------------------------------------------------- |
| `strict_dynamic_mapping_exception` | Field missing from ES mapping. Check `field-definitions.ts`     |
| Generator/generated drift          | Update generators, never edit generated files. Run `type-gen`   |
| Lint errors after `type-gen`       | Generators likely emit bad code. Fix generator templates        |
| `console` statements               | Replace with `@oaknational/mcp-logger`. See `src/lib/logger.ts` |
| Completion context mismatch        | Check `completion-contexts.ts`. See ADR-068                     |
| Port conflict in smoke tests       | Kill process using port 3333 or use `--port`                    |
| Tests failing                      | Run quality gates one at a time to isolate issue                |

### ES Serverless Gotchas

| Issue                                   | Solution                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `_cluster/health` fails                 | Use `/` or `/_cat/indices?v` instead                                      |
| `synonym_graph` at index time           | Split analyzers: `oak_text_index` (no synonyms), `oak_text_search` (with) |
| `optional: true` on completion contexts | Not supported—remove from definitions                                     |
| `number_of_shards/replicas`             | Not supported in Serverless—omit from mappings                            |
| `highlight.max_analyzed_offset`         | Not supported in Serverless—omit                                          |
