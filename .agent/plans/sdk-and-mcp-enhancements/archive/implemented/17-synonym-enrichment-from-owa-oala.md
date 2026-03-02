# Plan 17: Synonym Enrichment from OWA and OALA

**Status**: ✅ COMPLETE  
**Priority**: HIGH (Directly impacts hard query MRR)  
**Created**: 2025-12-18  
**Completed**: 2025-12-28  

---

## ✅ Completion Summary (2025-12-28)

All OWA and OALA synonym aliases have been merged into the SDK:

| Source | Items Added | Location |
|--------|-------------|----------|
| OWA subjects | art and design, phys ed, personal development, combined-science, trilogy science | `subjects.ts` |
| OALA key stages | eyfs, a-level, alevel, sixth form, reception, early years | `key-stages.ts` |
| OWA year variants | yr1, year1, y1 formats | `key-stages.ts` |
| Exam boards | AQA, Edexcel, OCR, WJEC/Eduqas | `exam-boards.ts` |

---

## Goal

Enrich our synonym system by importing alias data from:
1. **OWA** (`oakCurriculumData.ts`) - Subject aliases, year aliases, exam board data
2. **OALA** (`parseKeyStage.ts`, RAG utils) - Key stage parsing, subject expansion

This should improve hard query MRR by catching natural language variations.

---

## Current State

Our synonyms are in `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`:
- `subjects.ts` - Subject name variations
- `key-stages.ts` - Key stage aliases
- `numbers.ts` - Mathematical terms
- `maths.ts`, `geography.ts`, etc. - Subject-specific terms

**Gap Analysis**: See `.agent/research/feature-parity-analysis.md` Appendix C

---

## Source Files

### OWA
- `reference/Oak-Web-Application/src/context/Search/suggestions/oakCurriculumData.ts`
  - `OAK_SUBJECTS` - 24 subjects with aliases
  - `OAK_KEYSTAGES` - 4 key stages with aliases
  - `OAK_YEARS` - 12 years with aliases (y1, year1 variants)
  - `OAK_EXAMBOARDS` - 5 exam boards

### OALA
- `reference/oak-ai-lesson-assistant/packages/core/src/data/parseKeyStage.ts`
  - Maps "gcse" → ks4, "a_level" → ks5, "reception" → eyfs
  - Maps year numbers to key stages (year_7 → ks3)
  - Maps bare numbers 1-5 to key stages, 6-13 to years

- `reference/oak-ai-lesson-assistant/packages/rag/utils/parseSubjectsForRagSearch.ts`
  - Science subject expansion (science → [bio, chem, phys])

- `reference/oak-ai-lesson-assistant/packages/rag/utils/parseKeyStagesForRagSearch.ts`
  - Adjacent key stage expansion (ks2 → [ks1, ks2, ks3])

---

## Implementation Tasks

### Part 1: Merge OWA Subject Aliases

Update `synonyms/subjects.ts` with missing aliases from OWA:

| Subject | Add These Aliases |
|---------|------------------|
| `art` | "art and design", "art & design" |
| `computing` | "computers" |
| `english` | "reading", "writing", "english language arts" |
| `geography` | "geog" |
| `history` | "hist" |
| `biology` | "bio" |
| `chemistry` | "chem" |
| `physics` | "phys" |
| `physical-education` | "phys ed", "physical wellbeing" |
| `rshe-pshe` | "personal development", "sex education" |
| `combined-science` | **NEW ENTRY**: "combined sciences", "double award science", "trilogy science" |
| `financial-education` | **NEW ENTRY**: "financial literacy", "money management", "finance education", "personal finance" |

### Part 2: Merge OWA Year Aliases

Update `synonyms/key-stages.ts` with missing year format variations:

- Add "year1" (no space) variants alongside "year 1" (with space)
- Add "yr1", "yr 1" variants

### Part 3: Add OALA Key Stage Aliases

Update `synonyms/key-stages.ts` with OALA mappings:

| Add To | Aliases |
|--------|---------|
| `ks4` | "gcse" ✅ already have |
| `ks5` | **NEW ENTRY**: "a level", "a-level", "alevel", "sixth form" |
| `eyfs` | **NEW ENTRY**: "early years foundation stage", "eyfs", "early years", "foundation stage", "reception" |

### Part 4: Add Subject Expansion (Optional)

Consider adding to MCP tools or search logic:
- When user searches "science" at KS4, expand to include bio/chem/phys
- This is a query expansion feature, not just synonyms

### Part 5: Add Exam Board Synonyms

Create new file `synonyms/exam-boards.ts` if not exists, or update:

```typescript
export const examBoardSynonyms = {
  aqa: ['aqa exam board'],
  edexcel: ['pearson edexcel', 'pearson'],
  eduqas: ['wjec eduqas', 'wjec'],
  ocr: ['ocr exam board'],
} as const;
```

---

## Files to Modify

| File | Action |
|------|--------|
| `synonyms/subjects.ts` | Add missing aliases |
| `synonyms/key-stages.ts` | Add year variants, OALA mappings |
| `synonyms/exam-boards.ts` | Create or update |
| `synonyms/index.ts` | Export new entries |

---

## Testing

1. Re-run `pnpm type-gen` to regenerate ES synonyms
2. Re-run `pnpm es:setup` to push to Elasticsearch
3. Re-run four-retriever ablation test
4. Compare hard query MRR before/after

**Expected Impact**: Hard query MRR should improve as more natural language variations are caught.

---

## Success Criteria

1. All OWA subject aliases merged
2. OALA key stage aliases merged
3. Hard query MRR improves (target: +5% or more)
4. All quality gates pass

---

## Reference

- OWA alias system: `reference/Oak-Web-Application/src/context/Search/suggestions/oakCurriculumData.ts`
- OALA key stage parsing: `reference/oak-ai-lesson-assistant/packages/core/src/data/parseKeyStage.ts`
- Feature parity analysis: `.agent/research/feature-parity-analysis.md`
