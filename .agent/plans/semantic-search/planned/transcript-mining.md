# Transcript Mining for Vocabulary Enrichment

**Status**: 📋 Planned  
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md) (Milestone 4)  
**Priority**: Medium  
**Dependencies**: LLM extraction pipeline

---

## Goal

Mine lesson video transcripts to extract vocabulary patterns that keyword definitions don't contain — spoken synonyms, explanatory phrases, and teacher language that users search with.

---

## The Opportunity

### What Transcripts Contain

| Pattern | Example | Value |
|---------|---------|-------|
| "Also called..." | "photosynthesis, also called plant energy production" | Explicit synonym |
| "Another word for..." | "subtract is take away" | Plain English synonym |
| "Remember, X means..." | "denominator means the bottom number" | Teacher language |
| "Don't confuse X with Y" | "perimeter with area" | Misconception pattern |

### Why This Matters

**Keyword definitions** are formal curriculum language.  
**Transcripts** are spoken classroom language.

Users search with **classroom language**, not curriculum language.

---

## Critical Constraint: LLM Required

**Regex-based extraction will not work.**

The 2025-12-26 synonym mining experiment showed:
- 93% of regex-mined synonyms were noise
- Only 7% were genuinely useful

**Transcript mining MUST use LLM-based extraction.**

---

## Phases

### Phase 1: Transcript Availability Audit

- Count lessons with `transcript_sentences` populated
- Sample transcript content to understand format
- Estimate total volume for processing cost

### Phase 2: Pattern Identification

Manually review 20-30 transcripts to identify:
- "Also known as" patterns
- Teacher explanation patterns
- Misconception introduction patterns

### Phase 3: LLM Extraction Pipeline

```typescript
interface TranscriptExtractionResult {
  synonyms: Array<{ term: string; synonym: string; confidence: number }>;
  explanations: Array<{ term: string; explanation: string }>;
  misconceptions: Array<{ confused: [string, string] }>;
  keyTerms: Array<{ term: string; frequency: number }>;
}
```

### Phase 4: Batch Processing Infrastructure

- Create transcript reader in vocab-gen
- Implement batched LLM calls
- Store extraction results

### Phase 5: Synonym Curation Review

LLM extraction produces **candidates**, not final synonyms.
Human or LLM agent review required.

### Phase 6: Integration and Measurement

- Add curated synonyms to appropriate files
- Rebuild and deploy to ES
- Measure MRR improvement on colloquial queries

---

## Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Synonyms extracted | significant improvement in search quality | Count after curation |
| Colloquial query MRR | +15% improvement | Before/after evaluation |
| Misconceptions identified | significant guidance for teachers | Count after review |
| False positive rate | <10% in candidates | Review rejection rate |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Transcripts not available | Audit first (Phase 1) |
| LLM extraction too expensive | Sample-based approach, prioritise high-frequency terms |
| Low signal-to-noise ratio | Multiple review passes, conservative inclusion |
| Synonyms already covered | Cross-reference with existing synonyms before adding |

---

## Data Source

The bulk download includes transcript fields:

```typescript
// lesson-schema.ts
transcript_sentences: z.string().optional(),
transcript_vtt: z.string().optional(),
```

**Scope**: ALL subjects, ALL key stages, ALL available transcripts (~47K lessons).

---

## Evaluation Requirements

Before implementing, establish baseline:

1. **Before**: Record colloquial category MRR via `pnpm eval:per-category`
2. **Create experiment file**: `transcript-synonym-extraction.experiment.md`
3. **Implement**: Extract and curate synonyms
4. **After**: Re-run `pnpm eval:per-category`
5. **Record**: Update [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)

**Target**: ≥5% improvement in colloquial category MRR (currently 0.500 → ≥0.525)

---

## Related Documents

- [roadmap.md](../roadmap.md) — Linear execution path
- [vocabulary-mining-bulk.md](vocabulary-mining-bulk.md) — Overall vocabulary mining

