# Semantic Search Continuation Prompt

Use this prompt to continue semantic search implementation work.

## Foundation Documents (MUST READ FIRST)

Before any work, read and internalise:

1. `.agent/directives-and-memory/rules.md` - Cardinal rule, code design, quality gates
2. `.agent/directives-and-memory/testing-strategy.md` - TDD at all levels
3. `.agent/directives-and-memory/schema-first-execution.md` - Schema-first mandate
4. `.agent/directives-and-memory/AGENT.md` - Agent directives

**Key Principles**:

- All types, schemas, validators MUST flow from OpenAPI schema via `pnpm type-gen`
- All quality gate issues are BLOCKING—no exceptions
- TDD at all levels: Red → Green → Refactor
- No type assertions (`as`, `any`, `!`), no type shortcuts
- No `console` statements—use `@oaknational/mcp-logger`
- No `eslint-disable` comments—forbidden per rules.md
- Per-index completion contexts enforced (ADR-068)

**Re-read foundation documents regularly during work.**

---

## Current Blocking Issue

### Generator vs Generated Drift

Previous work edited generated files directly instead of updating the generator templates. This violates schema-first principles and must be corrected.

**Affected Files**:

| File                                               | Issue                                                                       |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| `type-gen/typegen/search/generate-search-index.ts` | Missing per-index completion schemas; still exports deprecated types        |
| `type-gen/typegen/search/index-doc-exports.ts`     | Retains deprecated `SearchCompletionSuggestPayloadSchema`                   |
| `src/types/generated/search/index.ts`              | Manually edited with new exports + eslint-disable (will revert on type-gen) |
| `src/types/index.ts`                               | Contains eslint-disable comments for deprecated re-exports                  |

**Required Fix**:

1. Update generator templates to emit per-index completion schemas
2. Remove deprecated `SearchCompletionSuggestPayload*` exports from generators
3. Remove all `eslint-disable` comments from generated files
4. Run `pnpm type-gen` to regenerate
5. Verify quality gates pass

**Root Cause Analysis**: See `.agent/analysis/semantic-search-compliance-and-ingestion-discovery.md`

---

## Current Elasticsearch State

**Last verified**: 2025-12-06 via Kibana

| Index                 | Docs | Notes                                          |
| --------------------- | ---- | ---------------------------------------------- |
| `oak_unit_rollup`     | 105  | Maths KS1 unit rollups                         |
| `oak_units`           | 37   | Unit metadata                                  |
| `oak_lessons`         | 0    | Failed with `strict_dynamic_mapping_exception` |
| `oak_sequences`       | 0    | Not yet populated                              |
| `oak_sequence_facets` | 0    | Not yet populated                              |
| `oak_meta`            | 0    | Not yet populated                              |

**Synonym Set**: `oak-syns` with 68 rules ✅

**Note**: 142 documents are indexed—unit-level ingestion succeeded, lesson ingestion failed.

---

## Quick Reference

### Elasticsearch Serverless

- **Kibana**: <https://poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud>
- **Cluster**: `poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud:443`

### CLI Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# Status
pnpm es:status

# Reset and ingest
npx tsx src/lib/elasticsearch/setup/cli.ts reset
pnpm es:ingest-live --subject maths --verbose

# Caching (optional, speeds up dev)
pnpm redis:up
SDK_CACHE_ENABLED=true pnpm es:ingest-live --subject maths --dry-run
```

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

1. **Fix generator drift** (BLOCKING)
   - Update `generate-search-index.ts` to emit per-index completion schemas
   - Remove deprecated exports from generator templates
   - Run `pnpm type-gen`
   - Remove any `eslint-disable` comments that remain

2. **Run quality gates**
   - All gates must pass before proceeding

3. **Resume ingestion**
   - Reset indexes: `npx tsx cli.ts reset`
   - Ingest Maths: `pnpm es:ingest-live --subject maths --verbose`
   - Verify in Kibana

---

## Key Files

### Generator Templates (Edit These)

```
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/
├── generate-search-index.ts          # Main generator (UPDATE THIS)
├── generate-search-index-docs.ts     # Doc schema generator
├── index-doc-exports.ts              # Export helper (UPDATE THIS)
├── completion-contexts.ts            # Per-index context source of truth
├── field-definitions.ts              # Unified field definitions
└── es-field-overrides.ts             # ES-specific overrides
```

### Generated Output (Don't Edit Directly)

```
packages/sdks/oak-curriculum-sdk/src/types/generated/search/
├── index.ts                          # Barrel exports
├── index-documents.ts                # ES document schemas
└── es-mappings/                      # ES mapping definitions
```

---

## Documentation Links

| Topic                         | Location                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| Semantic search planning      | `.agent/plans/semantic-search/index.md`                                                     |
| Phase roadmap                 | `.agent/plans/semantic-search/semantic-search-overview.md`                                  |
| Reference indices plan        | `.agent/plans/semantic-search/reference-indices-plan.md`                                    |
| Entity discovery pipeline     | `.agent/plans/semantic-search/entity-discovery-pipeline.md`                                 |
| Graph RAG vision              | `.agent/research/elasticsearch/ai/graph-rag-integration-vision.md`                          |
| SDK caching                   | `apps/oak-open-curriculum-semantic-search/docs/SDK-CACHING.md`                              |
| ADR-067 (ES mappings)         | `docs/architecture/architectural-decisions/067-sdk-generated-elasticsearch-mappings.md`     |
| ADR-068 (completion contexts) | `docs/architecture/architectural-decisions/068-per-index-completion-context-enforcement.md` |

---

## ES Serverless Gotchas

| Issue                                   | Solution                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `_cluster/health` fails                 | Use `/` or `/_cat/indices?v`                                              |
| `synonym_graph` at index time           | Split analyzers: `oak_text_index` (no synonyms), `oak_text_search` (with) |
| `optional: true` on completion contexts | Not supported—remove from definitions                                     |
| `number_of_shards/replicas`             | Not supported in Serverless—omit                                          |
