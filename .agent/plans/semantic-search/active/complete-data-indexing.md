# 05: Complete Data Indexing

**Status**: 📋 PENDING — ES reset and cache validation required
**Priority**: High — BLOCKING all other work
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md) (Milestone 1)
**Created**: 2025-12-24
**Updated**: 2025-12-29
**Principle**: Index EVERYTHING — ES is a complete view of the curriculum

---

## Current State (2025-12-29)

### Completed

| Task                    | Status      |
| ----------------------- | ----------- |
| Pattern-aware ingestion | ✅ Complete |
| Adapter refactoring     | ✅ Complete (593→197 lines) |
| Quality gates           | ✅ All 11 passing |

### Pending Before Ingestion

| Task             | Why Needed                                      | Status    |
| ---------------- | ----------------------------------------------- | --------- |
| ES reset         | Fresh indices after code changes                | 📋 Pending |
| Cache validation | Verify new `CacheOperations` interface works    | 📋 Pending |
| ES upsert verify | Confirm incremental mode still works            | 📋 Pending |

---

## Next Steps (In Order)

### 1. Reset Elasticsearch

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
```

### 2. Verify Caching Works

The adapter refactoring introduced a new `CacheOperations` interface. Verify:

| Check                    | How to Verify                              |
| ------------------------ | ------------------------------------------ |
| Redis connection         | Run ingestion, check for "SDK caching enabled" |
| Cache reads              | Check for cache hits in verbose output     |
| Cache writes             | Check for cache misses followed by API calls |
| Negative caching (404s)  | Check "Caching 404 response" logs          |
| `--bypass-cache` flag    | Should log "SDK caching disabled"          |
| `--ignore-cached-404`    | Should log "Ignoring cached 404"           |

**Verification Commands**:

```bash
cd apps/oak-open-curriculum-semantic-search

# Test with cache enabled (should connect to Redis)
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --dry-run

# Test with cache bypassed
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --bypass-cache --dry-run

# Test ignoring cached 404s
pnpm es:ingest-live --subject maths --keystage ks1 --verbose --ignore-cached-404 --dry-run
```

### 3. Run Full Ingestion

```bash
pnpm es:ingest-live --all --verbose
```

**Expected**: ~12,316 unique lessons across 17 subjects.

**If interrupted**: Re-run the same command — incremental mode skips existing docs.

---

## Adapter Refactoring (Completed 2025-12-29)

Resolved 70 lint errors and complexity issues using TDD:

| New File                     | Purpose                                     | Lines |
| ---------------------------- | ------------------------------------------- | ----- |
| `sdk-cache/cache-wrapper.ts` | `withCache`, `withCacheAndNegative` with DI | 248   |
| `sdk-api-methods.ts`         | API method factories                        | 143   |
| `sdk-client-factory.ts`      | Client creation helpers                     | 141   |

**Key change**: Caching now uses `CacheOperations` interface:

```typescript
interface CacheOperations {
  readonly get: (key: string) => Promise<string | null>;
  readonly setex: (key: string, ttl: number, value: string) => Promise<void>;
}
```

This enables testing without Redis (dependency injection).

---

## Possible Transcript Investigation (Pending)

### Observation

During prior ingestion, many "Transcript unavailable" messages appeared for computing KS4 lessons:

```text
Transcript unavailable for binary-search
Transcript unavailable for bubble-sort-23973
Transcript unavailable for insertion-sort
...
```

### Hypothesis

Computing KS4 lessons may use interactive/coding-based content rather than video-based lessons. This would make transcript 404s **legitimate**, not a bug.

### Investigation Required

1. **Use `/lessons/{lesson}/assets/` endpoint** to check if these lessons have video assets
2. If no video asset → 404 is expected
3. If video asset exists but no transcript → this is a bug

---

## CLI Flags

| Flag                  | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `--all`               | Ingest all 17 subjects                           |
| `--subject <slug>`    | Ingest specific subject(s)                       |
| `--keystage <slug>`   | Filter by key stage                              |
| `--verbose`           | Detailed logging                                 |
| `--dry-run`           | Show what would be indexed                       |
| `--force`             | Use `index` action (overwrites existing docs)    |
| `--bypass-cache`      | Skip Redis cache requirement                     |
| `--ignore-cached-404` | Re-fetch transcripts that previously returned 404|

---

## Expected Counts (from Bulk Download)

| Subject              | Unique Lessons | Notes                    |
| -------------------- | -------------- | ------------------------ |
| maths                | 1,934          | Includes KS4 tiers       |
| english              | 2,525          | Has unit options         |
| science              | 1,277          | Includes KS4 exam subjects |
| physical-education   | 992            |                          |
| geography            | 683            | Has unit options         |
| history              | 684            |                          |
| religious-education  | 612            |                          |
| computing            | 528            | ⚠️ Many may lack videos  |
| french               | 522            |                          |
| spanish              | 525            |                          |
| music                | 434            |                          |
| german               | 411            |                          |
| art                  | 403            | Has unit options         |
| design-technology    | 360            | Has unit options         |
| citizenship          | 318            |                          |
| cooking-nutrition    | 108            | No KS4                   |
| rshe-pshe            | N/A            | API only, no bulk file   |
| **TOTAL**            | **~12,316**    |                          |

---

## Acceptance Criteria

- [ ] ES indices reset with current mappings
- [ ] Cache reads/writes verified with new CacheOperations interface
- [ ] `--bypass-cache` flag verified
- [ ] `--ignore-cached-404` flag verified
- [ ] Incremental mode (ES `create` action) verified
- [ ] All 17 subjects ingested
- [ ] Counts verified against bulk download reference (~12,316 unique lessons)
- [ ] Science KS4 included (requires sequence traversal — IMPLEMENTED)
- [ ] Ground truths expanded to cover all subjects (not just Maths KS4)
- [ ] Baseline metrics recorded for full-curriculum search
- [ ] Quality gates passing after ingestion

---

## Related Documents

- [ADR-089](../../../../docs/architecture/architectural-decisions/089-index-everything-principle.md) - Index Everything principle
- [ADR-087](../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) - Batch-atomic ingestion
- [pattern-aware-ingestion.md](./pattern-aware-ingestion.md) - Pattern traversal (COMPLETE)
- [Cardinal Rule](../../../directives-and-memory/rules.md) - All types from schema at compile time
