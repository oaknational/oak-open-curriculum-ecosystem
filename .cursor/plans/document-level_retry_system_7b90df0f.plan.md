---
name: Document-Level Retry System
overview: Implement document-level retry for ES bulk ingestion to achieve 100% indexing success despite ELSER queue overflow. Following TDD at all levels (unit, integration, E2E), with comprehensive documentation and architectural excellence as the priority.
todos:
  - id: phase-1-tests
    content: Write failing integration and E2E tests specifying retry behavior (TDD RED)
    status: completed
  - id: phase-2-impl
    content: Implement document-level retry in bulk-chunk-uploader.ts (TDD GREEN)
    status: completed
    dependencies:
      - phase-1-tests
  - id: phase-3-cli
    content: Add CLI flags for retry configuration (--max-retries, --retry-delay, --no-retry)
    status: completed
    dependencies:
      - phase-2-impl
  - id: phase-4-refactor
    content: "Refactor: Apply First Question, ensure architectural excellence"
    status: completed
    dependencies:
      - phase-3-cli
  - id: phase-5-docs
    content: Create TSDoc, README, and ADR-096 documentation
    status: completed
    dependencies:
      - phase-4-refactor
  - id: phase-6-gates
    content: Run full quality gate suite and analyze results
    status: completed
    dependencies:
      - phase-5-docs
  - id: phase-7-verify
    content: Run full ingestion and verify ~12,320 lessons indexed
    status: pending
    dependencies:
      - phase-6-gates
---

# Document-Level Retry for ES Bulk Ingestion

## ✅ IMPLEMENTATION COMPLETE

All code work is complete. Only verification against live Elasticsearch remains.

### Completed Work Summary

| Phase | Description | Status |

|-------|-------------|--------|

| 1 | Write failing integration and E2E tests (TDD RED) | ✅ Complete |

| 2 | Implement document-level retry (TDD GREEN) | ✅ Complete |

| 3 | Add CLI flags | ✅ Complete |

| 4 | Refactor for architectural excellence | ✅ Complete |

| 5 | Documentation (ADR-096, README, TSDoc) | ✅ Complete |

| 6 | Quality gates (all passing) | ✅ Complete |

| **7** | **Verify full ingestion** | 📋 **NEXT SESSION** |

### New Files Created

```text
src/lib/indexing/
├── http-retry.ts          # Tier 1 (HTTP-level) retry
├── document-retry.ts      # Tier 2 (document-level) retry
├── README.md              # Module documentation

src/lib/elasticsearch/setup/
├── ingest-cli-help.ts      # CLI help text
├── ingest-cli-processors.ts # Argument processors

docs/architecture/architectural-decisions/
└── 096-es-bulk-retry-strategy.md  # ADR
```

### Quality Gates Passed

- ✅ `pnpm type-gen`
- ✅ `pnpm build`
- ✅ `pnpm type-check`
- ✅ `pnpm lint:fix`
- ✅ `pnpm format:root`
- ✅ `pnpm markdownlint:root`
- ✅ `pnpm test` (809 tests)
- ✅ `pnpm test:e2e` (6 tests)
- ✅ `pnpm test:e2e:built` (4 tests)
- ✅ `pnpm test:ui` (26 tests)
- ✅ `pnpm smoke:dev:stub`

---

## Phase 7: Verification (Next Session)

### Run Full Ingestion

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup --reset
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force --verbose
pnpm es:status
```

### Expected Results

| Index | Expected Count |

|-------|----------------|

| `oak_lessons` | ~12,320 |

| `oak_units` | ~1,665 |

| `oak_unit_rollup` | ~1,665 |

| `oak_threads` | ~164 |

### Success Criteria

- [ ] ES document counts match expected (~12,320 lessons)
- [ ] Ingestion completes without manual intervention
- [ ] Retry logs show document-level failures being recovered

---

## Problem Statement (Resolved)

ELSER queue overflow causes ~47% of lesson documents to fail during bulk ingestion (HTTP 429 `inference_exception`). The retry utilities existed but were NOT wired into the uploader.

**Solution**: Two-tier retry system implemented and documented in ADR-096.

---

## User Impact

Teachers and students will be able to search ALL ~12,320 lessons in the Oak curriculum. Previously ~5,748 lessons were missing from search results.

---

## Key Files

| File | Purpose |

|------|---------|

| `src/lib/indexing/bulk-chunk-uploader.ts` | Upload orchestration |

| `src/lib/indexing/http-retry.ts` | Tier 1 retry (transport) |

| `src/lib/indexing/document-retry.ts` | Tier 2 retry (document-level) |

| `src/lib/indexing/bulk-retry-utils.ts` | `isRetryableError`, `extractFailedOperations` |

| `src/lib/elasticsearch/setup/ingest-cli-args.ts` | CLI argument parsing |

| `docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md` | ADR |

| `src/lib/indexing/README.md` | Module documentation |

---

## CLI Flags

| Flag | Default | Description |

|------|---------|-------------|

| `--max-retries <n>` | 3 | Maximum document-level retry attempts |

| `--retry-delay <ms>` | 5000 | Base delay for exponential backoff |

| `--no-retry` | false | Disable document-level retry |

---

## Entry Point for Next Session

➡️ **[semantic-search.prompt.md](.agent/prompts/semantic-search/semantic-search.prompt.md)**