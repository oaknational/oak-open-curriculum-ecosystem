# Semantic Search — Session Context

**Status**: ✅ **IMPLEMENTATION COMPLETE** — Verification pending
**Last Updated**: 2026-01-01

---

## 🎯 NEXT SESSION: Verify Full Ingestion

### Single Remaining Task

Run full bulk ingestion against live Elasticsearch and verify ~12,320 lessons indexed.

```bash
cd apps/oak-open-curriculum-semantic-search

# Option 1: Default retry settings (3 retries, 5000ms base delay)
pnpm es:setup --reset
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force --verbose
pnpm es:status

# Option 2: Custom retry settings (if needed)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --force --max-retries 5 --retry-delay 10000
```

### Expected Results

| Index | Expected Count |
|-------|----------------|
| `oak_lessons` | ~12,320 |
| `oak_units` | ~1,665 |
| `oak_unit_rollup` | ~1,665 |
| `oak_threads` | ~164 |

### Prerequisites

- Elasticsearch instance running with ELSER configured
- Bulk download files in `./bulk-downloads`
- Valid `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY` in `.env.local`

---

## ✅ What's Complete

### Implementation (All Code Work Done)

| Component | Status | Notes |
|-----------|--------|-------|
| Two-tier retry system | ✅ Complete | HTTP + document-level retry |
| CLI flags | ✅ Complete | `--max-retries`, `--retry-delay`, `--no-retry` |
| Integration tests | ✅ Complete | 6 tests in `bulk-chunk-uploader.integration.test.ts` |
| E2E tests | ✅ Complete | 6 tests in `bulk-retry-cli.e2e.test.ts` |
| ADR-096 | ✅ Complete | ES Bulk Retry Strategy documented |
| README | ✅ Complete | `src/lib/indexing/README.md` |
| TSDoc | ✅ Complete | All public interfaces documented |
| All quality gates | ✅ Pass | 809 unit tests, 6 E2E tests |

### New Files Created

```text
src/lib/indexing/
├── http-retry.ts          # Tier 1 (HTTP-level) retry logic
├── document-retry.ts      # Tier 2 (document-level) retry logic
├── README.md              # Module documentation

src/lib/elasticsearch/setup/
├── ingest-cli-help.ts      # CLI help text (extracted)
├── ingest-cli-processors.ts # Argument processors (extracted)

docs/architecture/architectural-decisions/
└── 096-es-bulk-retry-strategy.md  # ADR documenting solution
```

### CLI Flags Added

| Flag | Default | Description |
|------|---------|-------------|
| `--max-retries <n>` | 3 | Maximum document-level retry attempts |
| `--retry-delay <ms>` | 5000 | Base delay for exponential backoff |
| `--no-retry` | false | Disable document-level retry |

---

## 📖 Architecture Overview

### Two-Tier Retry Strategy (ADR-096)

```text
┌─────────────────────────────────────────────────────────────┐
│                   Bulk Upload Flow                          │
│                                                             │
│  Chunk 1 ──┐                                               │
│  Chunk 2 ──┼──► Tier 1: HTTP Retry ──► ES Bulk API        │
│  Chunk N ──┘   (transport errors)                          │
│                     │                                       │
│                     ▼                                       │
│              Collect Failed Docs                           │
│                     │                                       │
│                     ▼                                       │
│            Tier 2: Document Retry                          │
│           (429, 502, 503, 504)                             │
│                     │                                       │
│                     ▼                                       │
│              Exponential Backoff                           │
│           (allow ELSER to drain)                           │
└─────────────────────────────────────────────────────────────┘
```

### Retryable vs Non-Retryable Errors

| Status | Type | Retry? | Example |
|--------|------|--------|---------|
| 429 | Rate limit | ✅ Yes | ELSER queue overflow |
| 502 | Bad gateway | ✅ Yes | Proxy errors |
| 503 | Unavailable | ✅ Yes | Service restarting |
| 504 | Timeout | ✅ Yes | Gateway timeout |
| 400 | Bad request | ❌ No | Mapping errors |
| 404 | Not found | ❌ No | Missing index |
| 409 | Conflict | ❌ No | Version conflict |

---

## 📖 Before You Start

**Read foundation documents:**

1. [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

**Read relevant ADRs:**

- [ADR-096: ES Bulk Retry Strategy](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md) — **NEW** Two-tier retry
- [ADR-070: SDK Rate Limiting and Retry](../../../docs/architecture/architectural-decisions/070-sdk-rate-limiting-and-retry.md) — Pattern source
- [ADR-087: Batch-Atomic Ingestion](../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) — Idempotent re-runs
- [ADR-088: Result Pattern](../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) — Typed errors

**Do NOT guess how ES works — read the official documentation:**

- [ES semantic_text](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text)
- [ELSER model docs](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Inference queue docs](https://www.elastic.co/docs/explore-analyze/machine-learning/inference/inference-queue)

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `src/lib/indexing/bulk-chunk-uploader.ts` | Upload orchestration |
| `src/lib/indexing/http-retry.ts` | Tier 1 retry (transport) |
| `src/lib/indexing/document-retry.ts` | Tier 2 retry (document-level) |
| `src/lib/indexing/bulk-retry-utils.ts` | `isRetryableError`, `extractFailedOperations` |
| `src/lib/elasticsearch/setup/ingest-cli-args.ts` | CLI argument parsing |
| `src/lib/indexing/README.md` | Module documentation |

---

## 🔧 Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. No exceptions.**

---

## 📚 Related Documents

| Document | Purpose |
|----------|---------|
| [roadmap.md](../../plans/semantic-search/roadmap.md) | Authoritative roadmap |
| [current-state.md](../../plans/semantic-search/current-state.md) | Current metrics |
| [elser-retry-robustness.md](../../plans/semantic-search/active/elser-retry-robustness.md) | Solution spec |
| [elser-scaling-notes.md](../../research/elasticsearch/elser/elser-scaling-notes.md) | ELSER research |

---

## ⚠️ Key Principles

1. **TDD always** — Red → Green → Refactor
2. **Reuse patterns** — ADR-070 retry pattern adapted for ES bulk
3. **Distinguish failure modes** — Only retry transient errors (429, 502, 503, 504)
4. **Schema-first** — Types flow from OpenAPI spec
5. **No type shortcuts** — No `as`, `any`, `!`
