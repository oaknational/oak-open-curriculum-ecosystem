# Semantic Search — Session Entry Point

**Last Updated**: 2026-01-09
**Status**: 🔶 **Deterministic Validation Complete** — Qualitative Review Pending

---

## What This Is

**Elasticsearch-backed semantic search** for Oak National Academy curriculum — 16,000+ lessons across 16 subjects, serving teachers and AI agents.

**Workspace**: `apps/oak-open-curriculum-semantic-search/`

---

## Current State: Three-Stage Validation

Ground truths require **three distinct validation stages**:

| Stage | What It Proves | Status |
|-------|----------------|--------|
| **1. Type-Check** | Data integrity (required fields) | ✅ **PASS** |
| **2. Runtime Validation** | Semantic rules (16 checks) | ✅ **PASS** |
| **3. Qualitative Review** | Production readiness | 🔶 **PENDING** |

### Deterministic Validation Output

```
✅ All ground truth entries are valid!
Total queries:     474
Total slugs:       1288
Valid slugs pool:  12320
Errors:            0
```

**Ground truths pass minimum threshold** — they are worthy of critical review. They are **NOT yet production-ready**.

---

## Next Session: Qualitative Review (Stage 3)

**The deterministic checks have passed. The critical analysis has NOT happened yet.**

For each of the 474 queries across 30 entries, critically verify:

| Check | Question | Method |
|-------|----------|--------|
| **Realism** | Would a teacher actually type this? | Human judgement |
| **Score=3 accuracy** | Does the top-scored lesson directly answer? | MCP `get-lessons-summary` |
| **Score=2/1 accuracy** | Are other scores appropriate? | MCP lookup |
| **Completeness** | Any relevant lessons missing? | Bulk data search |
| **Category accuracy** | Does category match query characteristics? | Compare to definitions |

### Process

```bash
# For each subject/phase entry:
1. Read queries in ground truth file
2. For each query, verify slugs via MCP: get-lessons-summary lesson:{slug}
3. Check bulk data for missing relevant lessons
4. Document issues in .agent/reviews/ground-truth-review-progress.md
```

**Phase 8 benchmarks should wait until qualitative review identifies any issues.**

---

## Ground Truth Coverage Summary

| Metric | Value |
|--------|-------|
| **Total queries** | 474 |
| **Total slugs** | 1,288 |
| **Subject-phase entries** | 30 |
| **Category coverage** | All entries meet minimums |

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [M3 Plan](../../plans/semantic-search/active/m3-revised-phase-aligned-search-quality.md) | Current phase status |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Validation requirements |
| [GROUND-TRUTH-PROCESS.md](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md) | Step-by-step process |

### Foundation Documents

- [rules.md](../../directives-and-memory/rules.md) — First Question, TDD, no type shortcuts
- [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — Test behaviour, not implementation

---

## Commands

```bash
pnpm type-check               # Stage 1: Data integrity ✅
pnpm ground-truth:validate    # Stage 2: Semantic rules ✅
pnpm ground-truth:analyze     # Quality breakdown by entry
pnpm benchmark --all          # Run benchmarks (after Stage 3)
```
