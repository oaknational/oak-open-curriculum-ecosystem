# Semantic Search — Current State

**Last Updated**: 2026-01-13
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## ✅ RRF Architecture Fixed (2026-01-13)

| Issue | Status |
|-------|--------|
| RRF penalises transcript-less documents | ✅ Fixed (ADR-099) |
| Post-RRF normalisation | ✅ Implemented in `lessons.ts` |
| Unit tests (17) + Integration tests (6) | ✅ Passing |
| DI refactor per ADR-078 | ✅ Complete |
| Valid baselines | 📋 Ready to establish |

**Details**: [transcript-aware-rrf.md](active/transcript-aware-rrf.md)

---

## Ground Truth Structure (2026-01-12)

| Metric | Value | Status |
|--------|-------|--------|
| Subject-phase entries | 30 | ✅ |
| Total queries | **120** | ✅ |
| Categories per entry | 4 | ✅ |
| AI-curated entries | **30/30** | ✅ |
| Quality gates | All passing | ✅ |
| RRF architecture | Fixed (ADR-099) | ✅ |
| **Benchmark validated** | Ready to run | 📋 |

Each subject-phase entry contains exactly 4 queries, one per category:

| Category | Tests | Example Query |
|----------|-------|---------------|
| `precise-topic` | Curriculum terminology | "quadratic equations factorising" |
| `natural-expression` | Vocabulary bridging | "the bit where you complete" |
| `imprecise-input` | Typo recovery | "simulatneous equasions" |
| `cross-topic` | Concept intersection | "algebra with graphs" |

---

## ES Index State

| Index | Documents | Storage |
|-------|-----------|---------|
| `oak_lessons` | 184,985 | 806.62MB |
| `oak_unit_rollup` | 165,345 | 706.06MB |
| `oak_units` | 1,635 | 8.94MB |
| `oak_threads` | 164 | 255.53KB |
| `oak_sequence_facets` | 57 | 375.14KB |
| `oak_sequences` | 30 | 267.67KB |
| `oak_meta` | 1 | 5.34KB |

**Note**: `oak_lessons` and `oak_unit_rollup` counts include ELSER sub-documents.

**Actual documents**:

| Type | Count |
|------|-------|
| Lessons | 12,833 |
| Units | 1,665 |
| Threads | 164 |
| Sequences | 30 |
| Sequence facets | 57 |
| **Total** | **16,414** |

---

## Transcript Coverage

| Subject Group | Coverage | Applicable Retrievers |
|---------------|----------|----------------------|
| MFL (French, German, Spanish) | ~0% | 2/4 (structure only) |
| PE Primary | ~0.6% | 2/4 (structure only) |
| PE Secondary | ~28.5% | Mostly 2/4 |
| All other subjects | 95-100% | 4/4 (structure + content) |

**~19% of all lessons have no transcript.** The current RRF penalises these by 50%.

---

## Bulk Data Files

30 files in `bulk-downloads/`:

| Phase | Count | Subjects |
|-------|-------|----------|
| Primary | 14 | art, computing, cooking-nutrition, design-technology, english, french, geography, history, maths, music, physical-education, religious-education, science, spanish |
| Secondary | 16 | art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, science, spanish |

---

## Validation Commands

```bash
cd apps/oak-open-curriculum-semantic-search

pnpm type-check               # TypeScript validation
pnpm ground-truth:validate    # Runtime validation (16 checks)
pnpm benchmark --all          # Run benchmarks (after RRF fix)
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Session entry |
| [Roadmap](roadmap.md) | Work items |
| [Transcript-Aware RRF](active/transcript-aware-rrf.md) | **CURRENT**: Fix RRF |
| [Ground Truth Process](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-PROCESS.md) | Curation workflow |
