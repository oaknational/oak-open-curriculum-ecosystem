# Semantic Search — Current State

**Last Updated**: 2026-01-26  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)  
**Status**: ⚠️ **Stage 1b Required — Query Grounding**

---

## Current Priority

**Create queries using known-answer-first methodology** — see [ground-truth-redesign-plan.md](active/ground-truth-redesign-plan.md)

### What's Done

| Aspect | Status |
|--------|--------|
| Structure of `queries-redesigned.md` | ✅ Correct |
| Category naming | ✅ Aligned |
| Content-weighted distribution | ✅ Applied |
| Session template | ✅ Updated |

### What's Needed

| Aspect | Status |
|--------|--------|
| Create queries from bulk data | ❌ Not started |
| Expected slugs (5 per query) | ❌ Not started |
| Code implementation | ❌ Not started |

### Expected Slugs Requirements

| Requirement | Value |
|-------------|-------|
| **Slugs per query** | **5** (minimum 4 if curriculum limited) |
| **Cross-unit** | Allowed — slugs do NOT have to be from same unit |
| **Score=3** | At least one per query |
| **Justification** | Every score backed by key learning quote |

**Next**: For each subject-phase, execute known-answer-first process.

---

## Search Architecture

### Two Information Sources Per Lesson

| Source | ES Field | Description | Coverage |
|--------|----------|-------------|----------|
| **Structure** | `lesson_structure` | Curated semantic summary (title, unit, keywords, key learning points) | ALL lessons (100%) |
| **Content** | `lesson_content` | Full video transcript + pedagogical fields | SOME lessons (~81%) |

### Four Retrievers (Combined via RRF)

| Retriever | ES Field | Technology |
|-----------|----------|------------|
| **Structure BM25** | `lesson_structure`, `lesson_title` | Keyword matching with fuzziness |
| **Structure ELSER** | `lesson_structure_semantic` | Semantic embedding |
| **Content BM25** | `lesson_content`, `lesson_keywords`, etc. | Keyword matching with fuzziness |
| **Content ELSER** | `lesson_content_semantic` | Semantic embedding |

### Content Coverage by Subject

| Subject Group | Content Coverage | Retrievers Used |
|---------------|------------------|-----------------|
| MFL (French, German, Spanish) | ~0% | Structure only (2/4) |
| PE Primary | ~0.6% | Structure only (2/4) |
| PE Secondary | ~28.5% | Mostly Structure only |
| All other subjects | 95-100% | All 4 retrievers |

**~19% of all lessons have no transcript** — these rely solely on Structure BM25 + ELSER.

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

**Actual documents** (excluding ELSER sub-documents):

| Type | Count |
|------|-------|
| Lessons | 12,833 |
| Units | 1,665 |
| Threads | 164 |
| Sequences | 30 |
| Sequence facets | 57 |
| **Total** | **16,414** |

---

## Bulk Data Files

30 files in `bulk-downloads/` (gitignored — use shell to access):

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
pnpm benchmark --all          # Run benchmarks
```

---

## Historical Reference

For session-by-session logs from the original GT review process, see:
[archive/completed/ground-truth-review-sessions-jan-2026.md](archive/completed/ground-truth-review-sessions-jan-2026.md)

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Session entry |
| [GT Redesign Plan](active/ground-truth-redesign-plan.md) | Current strategy |
| [Ground Truth Guide](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design, troubleshooting |
| [Roadmap](roadmap.md) | Work phases |
