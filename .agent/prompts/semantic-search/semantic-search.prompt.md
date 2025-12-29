# Semantic Search — Current Work

**Status**: 🔄 Efficient API traversal implementation required
**Last Updated**: 2025-12-29
**Master Plan**: [Semantic Search Roadmap](../../plans/semantic-search/roadmap.md)

---

## 🎯 IMMEDIATE NEXT STEP

### 1. Implement Efficient API Traversal (BLOCKING)

**Plan**: [efficient-api-traversal.md](../../plans/semantic-search/active/efficient-api-traversal.md)

The current ingestion makes unnecessary API calls — fetching transcripts for lessons that don't have videos (e.g., computing lessons with interactive content). This causes:

- ~50% wasted API calls
- Many 404 errors polluting logs and cache
- Slower ingestion than necessary

**The fix**: Use bulk `/key-stages/{ks}/subject/{subject}/assets` endpoint to check video availability BEFORE fetching transcripts.

**Tasks**:

1. Audit current API call patterns during dry-run
2. Test bulk assets endpoint via MCP tools
3. Implement `buildVideoAvailabilityMap()` function
4. Update ingestion to skip transcript fetch for no-video lessons
5. Run quality gates

**Only after this is complete**, proceed to:

### 2. Reset Elasticsearch

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
```

### 3. Verify Caching Still Works

The adapter refactoring introduced a new `CacheOperations` interface. Verify:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --dry-run
```

### 4. Run Full Curriculum Ingestion

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:ingest-live --all --verbose
```

**Expected**: ~12,316 unique lessons across 17 subjects.

---

## Recent Work Completed (2025-12-29)

### Adapter Refactoring — COMPLETE ✅

Reduced `oak-adapter.ts` from **593 lines to 197 lines** using TDD:

| Metric             | Before    | After       | Change     |
| ------------------ | --------- | ----------- | ---------- |
| `oak-adapter.ts`   | 593 lines | 197 lines   | **-67%**   |
| Lint errors        | 70        | 0           | ✅ Fixed   |
| Quality gates      | Blocked   | All passing | ✅ Fixed   |

### New Architecture

```text
oak-adapter.ts (197 lines - Public API)
    ├── sdk-client-factory.ts (141 lines - client creation)
    │       ├── sdk-api-methods.ts (143 lines - endpoint factories)
    │       └── sdk-cache/cache-wrapper.ts (248 lines - caching with DI)
    ├── oak-adapter-threads.ts (98 lines - thread API methods)
    └── oak-adapter-types.ts (95 lines - type definitions)
```

### Key Design Decisions

1. **Dependency Injection** — Cache wrappers use `CacheOperations` interface, enabling testing without Redis
2. **TDD-Driven** — 22 adapter tests covering cache behaviour
3. **Reduced Complexity** — All functions under 50-line and 20-statement limits
4. **Documentation** — New `src/adapters/README.md` documents architecture

### Files Created/Modified

| File                               | Purpose                           |
| ---------------------------------- | --------------------------------- |
| `sdk-cache/cache-wrapper.ts`       | `withCache`, `withCacheAndNegative` |
| `sdk-cache/cache-wrapper.unit.test.ts` | 11 unit tests for cache wrappers |
| `sdk-api-methods.ts`               | API method factories              |
| `sdk-client-factory.ts`            | Client creation helpers           |
| `src/adapters/README.md`           | Architecture documentation        |

---

## Background Context

### ES Index Status (Needs Reset)

| Index                | Doc Count | Target   | Status            |
| -------------------- | --------- | -------- | ----------------- |
| `oak_lessons`        | 0         | ~12,316  | 📋 Needs reset    |
| `oak_units`          | 0         | —        | 📋 Needs reset    |
| `oak_unit_rollup`    | 0         | —        | 📋 Needs reset    |
| `oak_threads`        | 0         | —        | 📋 Needs reset    |
| `oak_sequences`      | 0         | —        | 📋 Needs reset    |
| `oak_sequence_facets`| 0         | —        | 📋 Needs reset    |

### Redis Cache Status (Needs Verification)

| Metric                   | Value     | Status                   |
| ------------------------ | --------- | ------------------------ |
| Lesson summaries cached  | 7,089     | ⚠️ Verify still accessible |
| Lesson transcripts cached| 4,281     | ⚠️ Verify still accessible |
| Unit summaries cached    | 669       | ⚠️ Verify still accessible |
| **Total cached**         | **12,039**| ⚠️ Verify after refactoring |

**Why verification needed**: The new `CacheOperations` interface changed how we interact with Redis. Need to confirm reads/writes still work.

### Expected Lesson Counts (from Bulk Download)

| Subject              | Target | Notes                    |
| -------------------- | ------ | ------------------------ |
| maths                | 1,934  | Includes KS4 tiers       |
| english              | 2,525  | Has unit options         |
| science              | 1,277  | Includes KS4 exam subjects |
| physical-education   | 992    |                          |
| geography            | 683    | Has unit options         |
| history              | 684    |                          |
| religious-education  | 612    |                          |
| computing            | 528    | ⚠️ Many may lack videos  |
| french               | 522    |                          |
| spanish              | 525    |                          |
| music                | 434    |                          |
| german               | 411    |                          |
| art                  | 403    | Has unit options         |
| design-technology    | 360    | Has unit options         |
| citizenship          | 318    |                          |
| cooking-nutrition    | 108    | No KS4                   |
| rshe-pshe            | TBD    | API only, no bulk file   |
| **TOTAL**            | **~12,316** |                     |

---

## Canonical Ingestion CLI

**Entry point**: `src/lib/elasticsearch/setup/ingest-live.ts`
**Command**: `pnpm es:ingest-live`

| Flag                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `--all`               | Ingest all 17 subjects                           |
| `--subject <slug>`    | Ingest specific subject(s), can be repeated      |
| `--keystage <slug>`   | Filter by key stage (ks1, ks2, ks3, ks4)         |
| `--index <kind>`      | Filter to specific index kind (lessons, units)   |
| `--force`             | Overwrite existing documents (ES `index` action) |
| `--bypass-cache`      | Skip Redis cache requirement                     |
| `--ignore-cached-404` | Bypass cached 404s for transcripts               |
| `--verbose`           | Detailed logging                                 |
| `--dry-run`           | Preview without indexing                         |

---

## Efficient API Traversal (Next Priority)

**Full plan**: [efficient-api-traversal.md](../../plans/semantic-search/active/efficient-api-traversal.md)

The ingestion pipeline currently makes wasteful API calls:

| Problem | Impact |
| ------- | ------ |
| Transcript fetch for no-video lessons | ~50% wasted calls, 404 errors |
| Per-lesson asset checks | Could use bulk endpoint instead |

**Solution**: Use `/key-stages/{ks}/subject/{subject}/assets` to get ALL lesson asset types in ONE call, then only fetch transcripts for lessons with `type: "video"`.

**Key bulk endpoints from OpenAPI schema**:

| Endpoint | Returns |
| -------- | ------- |
| `/key-stages/{ks}/subject/{subject}/assets` | All assets for subject/keystage |
| `/sequences/{sequence}/assets` | All assets for sequence |

This work MUST be completed before running full ingestion.

---

## Quality Gates (All Passing ✅)

Run from repo root after any changes:

```bash
pnpm type-gen          # Generate types from schema
pnpm build             # Build all packages
pnpm type-check        # TypeScript validation
pnpm lint:fix          # Auto-fix linting issues
pnpm format:root       # Format code
pnpm markdownlint:root # Markdown lint
pnpm test              # Unit + integration tests
pnpm test:e2e          # E2E tests
pnpm test:e2e:built    # E2E on built app
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

**All gates must pass. No exceptions.**

---

## Foundation Documents (MANDATORY)

Before any work, read:

1. **[rules.md](../../directives-and-memory/rules.md)** — First Question: "Could it be simpler?"
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — TDD at all levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth
4. **[AGENT.md](../../directives-and-memory/AGENT.md)** — Agent-specific directives

---

## Related Documents

| Document                        | Purpose                              |
| ------------------------------- | ------------------------------------ |
| [efficient-api-traversal.md](../../plans/semantic-search/active/efficient-api-traversal.md) | **NEXT PRIORITY** — Reduce API calls |
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Master plan with all milestones |
| [current-state.md](../../plans/semantic-search/current-state.md) | Current metrics snapshot |
| [complete-data-indexing.md](../../plans/semantic-search/active/complete-data-indexing.md) | Full ingestion plan |
| [pattern-aware-ingestion.md](../../plans/semantic-search/active/pattern-aware-ingestion.md) | Pattern implementation (COMPLETE) |
| [search_ingest_reset_with_review.plan.md](../../../.cursor/plans/search_ingest_reset_with_review_b5516f42.plan.md) | Detailed execution plan |

---

## Key Files

### Adapter Layer (Refactored 2025-12-29)

| File                             | Purpose                                                     |
| -------------------------------- | ----------------------------------------------------------- |
| `src/adapters/oak-adapter.ts`    | **Public API** — `createOakClient()`, `OakClient` interface |
| `src/adapters/oak-adapter-types.ts` | Type definitions for all API methods                     |
| `src/adapters/oak-adapter-threads.ts` | Thread-specific API methods                            |
| `src/adapters/sdk-api-methods.ts` | Factories for each API endpoint                            |
| `src/adapters/sdk-client-factory.ts` | Client creation (cached/uncached)                       |
| `src/adapters/sdk-guards.ts`     | Type guards for API response validation                     |
| `src/adapters/sdk-cache/`        | Caching infrastructure                                      |
| `src/adapters/README.md`         | Architecture documentation                                  |

### Caching Layer (New — 2025-12-29)

| File                                     | Purpose                                    |
| ---------------------------------------- | ------------------------------------------ |
| `sdk-cache/cache-wrapper.ts`             | `withCache`, `withCacheAndNegative`        |
| `sdk-cache/cache-wrapper.unit.test.ts`   | 11 unit tests                              |
| `sdk-cache/redis-connection.ts`          | `createRedisClient`, `withRedisConnection` |
| `sdk-cache/ttl-jitter.ts`                | `calculateTtlWithJitter` for stampede prevention |
| `sdk-cache/index.ts`                     | Re-exports                                 |

### Ingestion Pipeline

| File                                     | Purpose                    |
| ---------------------------------------- | -------------------------- |
| `src/lib/elasticsearch/setup/ingest-live.ts` | CLI entry point        |
| `src/lib/index-oak.ts`                   | Main indexing logic        |
| `src/lib/index-oak-keystage-ops.ts`      | Keystage operations        |
| `src/lib/indexing/curriculum-pattern-config.ts` | Pattern configuration |
| `src/lib/indexing/pattern-aware-fetcher.ts` | Pattern-aware traversal |

---

## OpenAPI Schema Reference

For API exploration, the OpenAPI schema is at:
`packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`

Key endpoints:

- `/subjects` — All subjects with sequences
- `/subjects/{subject}/sequences` — Sequence details
- `/sequences/{sequence}/units` — Units within sequence
- `/lessons/{lesson}/assets` — Asset types including video availability
- `/lessons/{lesson}/summary` — Lesson metadata
- `/lessons/{lesson}/transcript` — Transcript (only if video exists)

---

## MCP Tools Available

For curriculum exploration via OOC MCP server:

| Tool                                             | Purpose                            |
| ------------------------------------------------ | ---------------------------------- |
| `mcp_ooc-http-dev-local_get-lessons-assets`      | Check asset types for a lesson     |
| `mcp_ooc-http-dev-local_get-lessons-summary`     | Get lesson metadata                |
| `mcp_ooc-http-dev-local_search`                  | Search for lessons by topic        |
| `mcp_ooc-http-dev-local_get-ontology`            | Understand curriculum structure    |
| `mcp_ooc-http-dev-local_get-key-stages-subject-lessons` | List lessons by subject/keystage |
