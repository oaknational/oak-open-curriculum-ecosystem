# Sub-Plan 10: Transcript Mining for Vocabulary Enrichment

**Status**: 📋 PLANNED  
**Priority**: Medium  
**Parent**: [README.md](README.md)  
**Created**: 2025-12-27  
**Research**: [knowledge-graph-integration-opportunities.md](../../../research/semantic-search/knowledge-graph-integration-opportunities.md)

---

## 🎯 Goal

Mine lesson video transcripts to extract vocabulary patterns that keyword definitions don't contain — specifically spoken synonyms, explanatory phrases, and teacher language that users search with.

> **Scope**: ALL subjects, ALL key stages, ALL available transcripts. Examples may reference specific subjects for illustration, but extraction covers the complete curriculum (30 bulk files, ~47K lessons).

---

## The Opportunity

### What We Have

The bulk download data includes transcript fields:

```typescript
// lesson-schema.ts
transcript_sentences: z.string().optional(),
transcript_vtt: z.string().optional(),
```

**Current state**: We capture these fields but **do not mine them**.

### What Transcripts Contain That Definitions Don't

| Pattern | Example | Why It's Valuable |
|---------|---------|-------------------|
| "Also called..." | "This is photosynthesis, also called plant energy production" | Explicit synonym introduction |
| "Another word for..." | "Another word for subtract is take away" | Plain English synonym |
| "Remember, X means..." | "Remember, denominator means the bottom number" | Teacher explanation language |
| Repeated emphasis | Term spoken 5+ times in lesson | Importance signal |
| "Don't confuse X with Y" | "Don't confuse perimeter with area" | Misconception pattern |
| Concept introduction | "Today we're learning about..." | Context for vocabulary |

### Why This Matters

**Keyword definitions** are formal, written, curriculum language.  
**Transcripts** are spoken, teacher, classroom language.

Users search with **classroom language**, not curriculum language. Transcripts bridge this gap.

---

## 🚀 Intended Impact

### Search Improvement

| Before | After |
|--------|-------|
| User searches "bottom number" → 0 results | User searches "bottom number" → lessons about denominators |
| User searches "take away" → 0 results | User searches "take away" → lessons about subtraction |
| User searches "describing word" → limited results | User searches "describing word" → all adjective lessons |

### Quantified Target

- **+15-25 foundational synonyms** extracted from transcripts
- **+5-10% improvement in colloquial query MRR** (currently 0.500)
- **+10-20 misconception patterns** identified from "don't confuse" language

### User Value

| Persona | Benefit |
|---------|---------|
| **Parent (homeschool)** | Searches with everyday language, finds correct lessons |
| **Student** | Uses terms they heard in class, gets relevant results |
| **Teacher** | Sees how other teachers explain concepts |
| **AI Agent** | Better synonym expansion for natural language queries |

---

## ⚠️ Critical Constraint: LLM Required

**Regex-based extraction will not work.**

The 2025-12-26 synonym mining experiment demonstrated:
- 93% of regex-mined synonyms were noise
- Only 7% were genuinely useful
- Regex finds text patterns, not semantic relationships

**Transcript mining MUST use LLM-based extraction** to:
- Distinguish same-language synonyms from translations
- Identify pedagogical examples vs definitions
- Understand context (is "take away" being defined or just used?)
- Filter spoken filler from valuable content

---

## Phases

### Phase 1: Transcript Availability Audit

**Effort**: ~1 hour  
**Impact**: Scope understanding

1. Count lessons with `transcript_sentences` populated
2. Sample transcript content to understand format
3. Estimate total transcript volume for processing cost

**Questions to answer**:
- What percentage of lessons have transcripts?
- What is the average transcript length?
- Are transcripts VTT-formatted or plain text?

### Phase 2: Pattern Identification (Manual Sampling)

**Effort**: ~2 hours  
**Impact**: Design LLM prompts

Manually review 20-30 transcripts to identify:
- "Also known as" patterns and variations
- Teacher explanation patterns ("this means", "we call this")
- Misconception introduction patterns ("don't confuse", "students often think")
- Definition reinforcement patterns

**Output**: Pattern catalogue for LLM prompt design

### Phase 3: LLM Extraction Pipeline Design

**Effort**: ~4 hours  
**Impact**: Architecture

Design extraction pipeline:

```typescript
interface TranscriptExtractionResult {
  // Explicit synonyms ("also called X")
  synonyms: Array<{ term: string; synonym: string; confidence: number; context: string }>;
  
  // Explanatory phrases ("X means Y")
  explanations: Array<{ term: string; explanation: string; yearLevel: number }>;
  
  // Misconception patterns ("don't confuse X with Y")
  misconceptions: Array<{ confused: [string, string]; context: string }>;
  
  // Key term emphasis (term repeated 5+ times)
  keyTerms: Array<{ term: string; frequency: number }>;
}
```

**LLM prompt structure**:
```
You are analysing a UK curriculum lesson transcript for vocabulary patterns.

Transcript: [transcript text]
Lesson: [lesson metadata]
Subject: [subject]
Year: [year]

Extract:
1. Synonyms: Where the teacher says "also known as", "another word for", or introduces an alternative term
2. Explanations: Where the teacher explains what a term means in simpler language
3. Misconceptions: Where the teacher warns about common confusions
4. Key terms: Terms repeated 5+ times that are central to the lesson

Return structured JSON. Only include high-confidence extractions.
```

### Phase 4: Batch Processing Infrastructure

**Effort**: ~4 hours  
**Impact**: Enables full extraction

1. Create transcript reader in vocab-gen
2. Implement batched LLM calls (rate limiting, error handling)
3. Store extraction results in structured format
4. Implement caching to avoid re-processing

**Cost considerations**:
- Estimate tokens per transcript
- Calculate total cost for full curriculum
- Design sampling strategy if full processing too expensive

### Phase 5: Synonym Curation Review

**Effort**: ~2 hours per batch  
**Impact**: Quality control

LLM extraction produces **candidates**, not final synonyms.

Human or LLM agent review:
1. Verify extracted synonyms are genuinely synonymous
2. Check for false positives (examples, not synonyms)
3. Compare against existing synonyms to avoid duplication
4. Prioritize by value score (frequency × foundation × cross-subject)

### Phase 6: Integration and Measurement

**Effort**: ~4 hours  
**Impact**: Validates approach

1. Add curated synonyms to appropriate files (`maths.ts`, `english.ts`, etc.)
2. Rebuild and deploy to ES
3. Run evaluation corpus
4. Measure MRR improvement on colloquial queries
5. Document findings

---

## Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Synonyms extracted | ≥25 useful entries | Count after curation |
| Colloquial query MRR | +5% improvement | Before/after evaluation |
| Misconceptions identified | ≥10 new patterns | Count after review |
| False positive rate | <50% in candidates | Review rejection rate |

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Transcripts not available | Audit first (Phase 1) |
| LLM extraction too expensive | Sample-based approach, prioritize high-frequency terms |
| Low signal-to-noise ratio | Multiple review passes, conservative inclusion |
| Synonyms already covered | Cross-reference with existing synonyms before adding |

---

## Related Documents

- [knowledge-graph-integration-opportunities.md](../../../research/semantic-search/knowledge-graph-integration-opportunities.md) — Research
- [vocabulary-value-analysis.md](../../../research/semantic-search/vocabulary-value-analysis.md) — Value scoring for prioritization
- [02b-vocabulary-mining.md](02b-vocabulary-mining.md) — Overall vocabulary mining plan
- [synonyms/README.md](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/README.md) — Lessons learned from regex mining

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-27 | Initial plan created from transcript mining reflection |

