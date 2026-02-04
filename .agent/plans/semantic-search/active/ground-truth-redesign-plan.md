# Ground Truth Redesign Plan

**Created**: 2026-01-25  
**Revised**: 2026-01-27  
**Status**: 🔄 Phase 1 — Minimum Viable Ground Truths  
**Objective**: Create ground truths that answer: "Does search help teachers find what they need?"

---

## Phase 1: Minimum Viable Ground Truths

**Goal**: One ground truth per subject-phase pair (~33 total). Establish baseline coverage, refine later.

### The Protocol

For each subject-phase pair:

1. **Find a rich unit** — Target units with 5+ lessons
2. **Pick a lesson** — Extract title, keywords, key learning, transcript (if available)
3. **Summarise** — Create summary from ALL available data
4. **Design query** — Based on summary, NOT title alone
5. **Run query** — Execute against actual search system
6. **Evaluate top 3** — Are results reasonable?
7. **Lock in or iterate** — If reasonable, record ground truth; if not, refine query or document issue

### Key Principles

- **DO NOT match on lesson title alone** — Queries must reflect natural teacher search behaviour
- **Test against actual search** — Iterate based on real results
- **Top 3 evaluation** — Reasonable results = ground truth locked in
- **Pragmatic** — We need baseline coverage now; refinement comes later

---

## Subject-Phase Coverage Target

| Phase | Subjects |
|-------|----------|
| Primary | ~15 |
| Secondary | ~18 (including KS4 science variants) |
| **Total** | **~33 ground truths** |

See `queries-redesigned.md` for the full coverage matrix.

---

## Technical Blockers: Resolved

### Subject Filter — ✅ FIXED 2026-01-27

KS4 science sub-disciplines (physics, chemistry, biology, combined-science) can now be filtered individually per ADR-101:

- Physics lessons: `subject_slug: 'physics'`, `subject_parent: 'science'`
- Chemistry lessons: `subject_slug: 'chemistry'`, `subject_parent: 'science'`
- etc.

All 33 subject-phase pairs are now unblocked.

---

## Execution

### Entry Point

Read the prompt: `@.agent/prompts/semantic-search/semantic-search.prompt.md`

### Bulk Data Location

```bash
cd apps/oak-open-curriculum-semantic-search
ls bulk-downloads/*.json
```

### Recording Ground Truths

Record completed ground truths in `queries-redesigned.md`.

---

## Phase 2 (Later)

Once Phase 1 baseline is established:

1. Expand to complexity-weighted coverage (~99 queries total)
2. Add multiple expected slugs per query
3. Add graded relevance scores (3/2/1)
4. Add justifications for each score

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [semantic-search.prompt.md](../../../prompts/semantic-search/semantic-search.prompt.md) | The protocol |
| [queries-redesigned.md](../../../../apps/oak-open-curriculum-semantic-search/docs/ground-truths/queries-redesigned.md) | Coverage matrix and completed ground truths |
| [ADR-101](../../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md) | Subject hierarchy design |
