# Research Proposal: Search Query Optimization for Lesson Search

**Status**: 📋 Proposal  
**Created**: 2025-12-18  
**Author**: AI Assistant (Claude)  
**Domain**: Semantic Search - Elasticsearch Serverless  
**Priority**: High  

---

## Why This Matters

### The Mission

Oak National Academy provides **free, world-class educational resources** to every teacher and student in the UK. The curriculum spans thousands of lessons across all subjects and key stages, representing one of the most comprehensive open educational resources in the world.

**The promise**: When a teacher searches for "that sohcahtoa stuff for triangles" or a student types "how to rearrange formulas", they should find exactly what they need—instantly, intuitively, and without needing to know the exact terminology.

**The reality today**: Our search works brilliantly for topic-based queries ("quadratic equations", "photosynthesis") but struggles with how teachers and students actually search:

- **Naturalistic queries**: "teach my students about solving for x"
- **Misspellings**: "simulatneous equasions" (common, especially on mobile)
- **Colloquial language**: "the bit where you complete the square"
- **Intent-based**: "challenging extension work for able mathematicians"

These "hard queries" represent real user behaviour—and they're where we're letting teachers down.

### Why "Good Enough" Isn't Good Enough

This isn't just about metrics. When search fails:

- A teacher wastes 5 minutes they don't have, then gives up
- A student can't find the revision lesson they need before an exam
- A school abandons Oak for a competitor with better discoverability
- The mission of open, accessible education is undermined

**We're building public infrastructure for education.** The search experience should be as good as Google, because that's what users expect—and that's what they deserve.

### The Opportunity

We have something rare: **world-class educational content**. Oak lessons are:

- Expertly designed by subject specialists
- Pedagogically structured with learning objectives, misconceptions, and outcomes
- Semantically rich with transcripts, summaries, and curriculum metadata

This content is **better structured** than most search corpora. We should be able to build search that's **better than generic** because we understand the domain deeply.

---

## Executive Summary

This research proposal outlines techniques to improve search relevance for "hard queries" in the Oak curriculum lesson search system. Hard queries include naturalistic phrasing, misspellings, synonyms, and intent-based searches that current lexical+semantic hybrid search struggles with.

**Current State**: Lesson Hard MRR = 0.367 (Acceptable rating)  
**Target**: Lesson Hard MRR ≥ 0.50 (Good rating)  
**Gap**: 36% improvement needed

The proposal presents seven research directions, prioritized by expected impact and implementation effort, with concrete experiment plans for each.

**The bar is high because the mission is important.**

---

## Table of Contents

- [Why This Matters](#why-this-matters)
- [Executive Summary](#executive-summary)

1. [Problem Analysis](#1-problem-analysis)
2. [Current Architecture](#2-current-architecture)
3. [What We've Learned](#3-what-weve-learned)
4. [Research Directions](#4-research-directions)
5. [Experiment Plan](#5-experiment-plan)
6. [Success Metrics](#6-success-metrics)
7. [Risk Assessment](#7-risk-assessment)
8. [Instance Details](#8-instance-details)
9. [Verified Feature Availability](#9-verified-feature-availability-2025-12-18)
10. [References](#10-references)

**Appendices**:
- [A: Hard Query Ground Truth](#appendix-a-hard-query-ground-truth)
- [B: Implementation Checklist](#appendix-b-implementation-checklist)
- [C: Playground Experiment Log](#appendix-c-playground-experiment-log)
- [D: Comprehensive Research Answers](#appendix-d-comprehensive-experimentation-plan) (Q&A from 2025-12-18)
- [E: Detailed Experimentation Plan](#appendix-e-detailed-experimentation-plan)
- [F: Deep Dive - Linear Retriever vs RRF](#appendix-f-deep-dive---linear-retriever-vs-rrf)
- [G: Deep Dive - LLM Capabilities for Search](#appendix-g-deep-dive---llm-capabilities-for-search)
- [H: Hard Query Test Scenario Analysis](#appendix-h-hard-query-test-scenario-analysis)

---

## 1. Problem Analysis

### 1.1 Hard Query Categories

Analysis of the 15 hard ground truth queries reveals six distinct challenge categories:

| Category | Example Query | Why It's Hard |
|----------|---------------|---------------|
| **Naturalistic** | "teach my students about solving for x" | Pedagogical framing not in lesson content |
| **Misspellings** | "simulatneous equasions substitution method" | Edit distance > 2, multiple errors |
| **Synonyms** | "rules for powers and indices" | Conceptual synonym (indices = exponents) |
| **Multi-concept** | "combining algebra with graphs" | Requires understanding topic relationships |
| **Colloquial** | "that sohcahtoa stuff for triangles" | Informal language to formal topic mapping |
| **Intent-based** | "challenging extension work for able mathematicians" | No explicit topic, pure pedagogical intent |

### 1.2 Query-by-Query Analysis

| Query | Expected Lessons | Current Rank | Gap Analysis |
|-------|------------------|--------------|--------------|
| "teach my students about solving for x" | solving-simple-linear-equations | 4th+ | Intent not matched |
| "simulatneous equasions substitution method" | simultaneous-equations-by-substitution | 5th+ | Misspelling blocks match |
| "circel theorms tangent" | circle-theorem-tangent lessons | Not found | Severe misspelling |
| "that sohcahtoa stuff" | trigonometry lessons | Varies | Colloquial → formal gap |
| "challenging extension work" | problem-solving lessons | Not found | No explicit topic signal |

### 1.3 Why Current Hybrid Fails

The four-retriever hybrid architecture (BM25 + ELSER on Content + Structure) was designed for topic-based queries where lexical and semantic signals complement each other. For hard queries:

1. **BM25 fails completely** on severe misspellings (edit distance > 2)
2. **BM25 adds noise** on naturalistic queries (matches stop words, irrelevant terms)
3. **ELSER alone performs better** on hard queries (0.287 MRR vs 0.250 hybrid, pre-optimization)
4. **RRF fusion dilutes** the ELSER signal with noisy BM25 results

---

## 2. Current Architecture

### 2.1 Four-Retriever Hybrid Design

```
Query → [BM25 Content] ─┐
     → [BM25 Structure] ─┼─→ RRF Fusion → Top 10 Results
     → [ELSER Content] ──┤
     → [ELSER Structure]─┘
```

**RRF Formula**: `score = Σ (1 / (rank_i + k))` where k = 60

### 2.2 Content-Type-Aware BM25 (Current)

Following ablation testing, we implemented differentiated BM25 configs:

| Content Type | BM25 Config | Rationale |
|--------------|-------------|-----------|
| **Lessons** | `fuzziness: AUTO`, `min_should_match: 75%` | Short queries benefit from precision |
| **Units** | `fuzziness: AUTO:3,6`, transpositions enabled | Longer queries benefit from recall |

### 2.3 Available ES Serverless Features

| Feature | Endpoint | Status | Cost |
|---------|----------|--------|------|
| BM25 | Built-in | ✅ Used | Included |
| ELSER | `.elser-2-elasticsearch` | ✅ Used | Included |
| Semantic Rerank | `.rerank-v1-elasticsearch` | 📋 Available | Included |
| LLM Inference | `.gp-llm-v2-chat_completion` | 📋 Available | Included |
| Phonetic | `analysis-phonetic` plugin | ❓ TBD | Included |

---

## 3. What We've Learned

### 3.1 Ablation Study Results (Phase 3e)

| Enhancement | Lesson Hard MRR | Lesson Std MRR | Verdict |
|-------------|-----------------|----------------|---------|
| Baseline (no enhancements) | 0.250 | 0.931 | Control |
| `min_should_match: 75%` | **0.367 (+47%)** | 0.931 | ✅ Keep |
| `fuzziness: AUTO:3,6` | 0.250 (+0%) | 0.931 | ❌ No effect |
| Phrase prefix boost | 0.250 (+0%) | 0.938 | ❌ No effect |
| Stemming (`light_english`) | Regressed | — | ❌ Harmful |
| Stop words (`_english_`) | Regressed | — | ❌ Harmful |
| All combined (Phase 3e full) | 0.323 (+29%) | 0.938 | Mixed |

**Key Insight**: `min_should_match: 75%` is the single most effective BM25 enhancement for lessons (+47% MRR), but enhanced fuzziness provides no benefit and actually hurts when combined with min_should_match.

### 3.2 Content-Type Sensitivity

| Enhancement | Lesson Impact | Unit Impact |
|-------------|---------------|-------------|
| `min_should_match: 75%` | ✅ +11.7% | ❌ -15.8% |
| `fuzziness: AUTO:3,6` | ⚪ 0% | ✅ +4.2% |

**Key Insight**: Optimal BM25 configuration differs by content type. Lessons benefit from precision; units benefit from recall.

### 3.3 Architecture-Level Findings

| Finding | Evidence | Implication |
|---------|----------|-------------|
| ELSER outperforms BM25 on hard queries | ELSER: 0.287 vs BM25: 0.080 | Weight ELSER higher in fusion |
| RRF dilutes ELSER signal | Hybrid: 0.250 vs ELSER-only: 0.287 | Consider dynamic weighting |
| Four-way improves after BM25 fix | Hybrid: 0.367 after content-type-aware | Fixed BM25 noise issue |

---

## 4. Research Directions

### 4.1 Semantic Reranking (Cross-Encoder)

**Concept**: Use a neural reranker to reorder top-K results based on query-document semantic similarity.

**How It Works**:
1. Retrieve top 50 results with current hybrid approach
2. Pass (query, document) pairs to cross-encoder model
3. Reranker scores semantic relevance
4. Return results reordered by reranker score

**Implementation**:
```typescript
{
  retriever: {
    text_similarity_reranker: {
      retriever: {
        rrf: { /* existing four-way hybrid */ }
      },
      field: "lesson_content",
      inference_id: "elastic-rerank",
      inference_text: query,
      rank_window_size: 50
    }
  }
}
```

**Why It Should Help**:
- Cross-encoders are state-of-the-art for relevance ranking
- Can capture semantic relationships that BM25/ELSER miss
- Works on naturalistic and intent-based queries
- Handles concept relationships ("sohcahtoa" → trigonometry)

**Effort**: Low (1-2 hours) - Query-time change only  
**Expected Impact**: HIGH (+10-20% MRR)  
**Latency Impact**: +100-300ms per query

**References**:
- [Elastic Rerank Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html)
- [Elastic Rerank Announcement](https://ir.elastic.co/news/news-details/2024/Elastic-Announces-Elastic-Rerank-Model-to-Power-Up-Semantic-Search/default.aspx)

---

### 4.2 Linear Retriever (Weighted Fusion)

> **Note**: RRF does NOT support per-retriever weights. The Linear Retriever
> (ES 8.18+ preview, 9.0+ GA) is the correct approach for weighted fusion.
> See [Appendix F](#appendix-f-deep-dive---linear-retriever-vs-rrf) for details.

**Concept**: Combine retriever scores using weights and normalisation, preserving
score magnitudes and allowing precise control over retriever contributions.

**Formula**:
```
Linear Score = Σ (weight_i × normalize(score_i))
```

**Implementation**:
```typescript
retriever: {
  linear: {
    retrievers: [
      {
        retriever: { standard: { query: /* BM25 content */ } },
        weight: 0.5,
        normalizer: 'minmax'
      },
      {
        retriever: { standard: { query: /* ELSER content */ } },
        weight: 1.5,
        normalizer: 'minmax'
      },
      {
        retriever: { standard: { query: /* BM25 structure */ } },
        weight: 0.5,
        normalizer: 'minmax'
      },
      {
        retriever: { standard: { query: /* ELSER structure */ } },
        weight: 1.5,
        normalizer: 'minmax'
      },
    ]
  }
}
```

**Why It Should Help**:
- ELSER alone outperforms hybrid on hard queries (0.287 vs 0.080 BM25)
- Higher ELSER weight amplifies semantic signal
- Lower BM25 weight reduces lexical noise for naturalistic queries
- Preserves score magnitudes unlike RRF's rank-only approach
- Tunable without reindexing

**Effort**: Low (1-2 hours)  
**Expected Impact**: Medium (+5-10% MRR)  
**Latency Impact**: None

**Availability**: ES 8.18+ (preview), ES 9.0+ (GA)

**When to use RRF vs Linear**:
| Scenario | Recommendation |
|----------|----------------|
| Quick hybrid setup | RRF (simpler) |
| Fine-tuned relevance | Linear (weighted) |
| Query-type-specific weights | Linear (essential) |
| Disparate score scales | RRF (rank-based) |

**References**:
- [Linear Retriever Blog](https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search)
- [Hybrid Search Guide](https://www.elastic.co/search-labs/blog/hybrid-search-elasticsearch)

---

### 4.3 Query Classification + Routing

**Concept**: Classify incoming queries and route to optimal retrieval strategies.

**Classification Categories**:
| Type | Signal | Route |
|------|--------|-------|
| Topic | Short, no stop words, dictionary words | Four-way hybrid |
| Naturalistic | Long, many stop words, question words | ELSER-weighted or reranked |
| Misspelling | Low spelling confidence, short words | Enhanced fuzzy + phonetic |
| Intent | Question words, no topic nouns | Reranked path |

**Implementation Options**:

**A. Rule-Based (Simple)**:
```typescript
function classifyQuery(text: string): QueryType {
  const words = text.toLowerCase().split(/\s+/);
  const stopWordRatio = words.filter(isStopWord).length / words.length;
  
  if (words.length >= 5 && stopWordRatio > 0.3) return 'naturalistic';
  if (hasQuestionWords(text) && !hasTopicNouns(text)) return 'intent';
  if (getSpellingConfidence(text) < 0.8) return 'misspelling';
  return 'topic';
}
```

**B. LLM-Based (More Accurate)**:
```typescript
async function classifyQuery(text: string): Promise<QueryType> {
  const response = await esLLM.complete({
    model: '.gp-llm-v2-chat_completion',
    prompt: `Classify this educational search query:
      "${text}"
      Categories: topic, naturalistic, misspelling, intent
      Respond with just the category name.`
  });
  return response.text.trim() as QueryType;
}
```

**Why It Should Help**:
- Different query types have different optimal strategies
- Avoids "one size fits all" that hurts edge cases
- Can progressively add routes as we learn

**Effort**: Medium (4-8 hours)  
**Expected Impact**: HIGH (+15-25% MRR for targeted query types)  
**Latency Impact**: Minimal (rule-based) or +50-100ms (LLM-based)

> **⚠️ ADR REQUIRED**: When implementing query classification and routing,
> create **ADR-082: Query Classification and Routing Architecture** documenting:
> - Classification algorithm (rule-based vs LLM-based)
> - Routing table mapping query types to pre-processing strategies
> - Fallback behaviour when classification fails
> - Latency budget allocation for classification step
> - Metrics for classification accuracy evaluation
>
> Reference [ADR-081: Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)
> for evaluation criteria.

---

### 4.4 LLM Query Expansion/Reformulation

**Concept**: Use LLM to expand or rewrite queries before retrieval.

**Examples**:
| Original | Expanded |
|----------|----------|
| "that sohcahtoa stuff" | "trigonometry sine cosine tangent SOHCAHTOA right-angled triangles" |
| "teach solving for x" | "solving linear equations algebraic expressions finding unknown variables" |
| "challenging extension work" | "problem solving advanced mathematics extension higher ability" |

**Implementation**:
```typescript
async function expandQuery(original: string): Promise<string> {
  const response = await esLLM.complete({
    model: '.gp-llm-v2-chat_completion',
    prompt: `You are helping teachers find maths lessons. 
Expand this search query with related mathematical terms and synonyms.
Keep the original terms and add relevant expansions.
Query: "${original}"
Expanded query:`
  });
  return `${original} ${response.text}`;
}
```

**Why It Should Help**:
- Bridges gap between colloquial and formal terminology
- Adds topic terms to intent-based queries
- Can correct misspellings before search
- Leverages world knowledge about curriculum

**Effort**: Medium (4-6 hours)  
**Expected Impact**: HIGH for naturalistic/intent queries (+10-15% MRR)  
**Latency Impact**: +100-200ms per query

**Considerations**:
- Requires careful prompt engineering
- May need caching for common queries
- Quality depends on LLM understanding of curriculum

---

### 4.5 Phonetic Matching (Double Metaphone)

**Concept**: Match words that sound alike regardless of spelling.

**Phonetic Encoding Examples**:
| Query Term | Phonetic Code | Would Match |
|------------|---------------|-------------|
| `circel` | `SRKL` | `circle` → `SRKL` ✅ |
| `simulatneous` | `SMLTN` | `simultaneous` → `SMLTN` ✅ |
| `therum` | `0RM` | `theorem` → `0RM` ✅ |
| `pythagorus` | `P0KRS` | `pythagoras` → `P0KRS` ✅ |

**Implementation**:

**1. Add Phonetic Filter**:
```typescript
// In es-analyzer-config.ts
phonetic_filter: {
  type: 'phonetic',
  encoder: 'double_metaphone',
  replace: false  // Keep both original and phonetic tokens
}
```

**2. Create Phonetic Analyzer**:
```typescript
oak_text_phonetic: {
  type: 'custom',
  tokenizer: 'standard',
  filter: ['lowercase', 'phonetic_filter']
}
```

**3. Add Subfield to Titles**:
```typescript
lesson_title: {
  type: 'text',
  analyzer: 'oak_text_index',
  search_analyzer: 'oak_text_search',
  fields: {
    keyword: { type: 'keyword', ignore_above: 256 },
    phonetic: { type: 'text', analyzer: 'oak_text_phonetic' }
  }
}
```

**4. Include in Query at Low Boost**:
```typescript
const fields = [
  'lesson_title^3',
  'lesson_title.phonetic^0.5',  // Low boost for phonetic fallback
  'lesson_keywords^2',
  // ... other fields
];
```

**Why It Should Help**:
- Handles severe misspellings beyond edit distance 2
- Works for mathematical terms (theorem, pythagorean, etc.)
- Low boost prevents false positives

**Effort**: Medium (2-3 hours + reindex)  
**Expected Impact**: Medium for misspelling queries (+5-10% MRR)  
**Latency Impact**: Minimal (indexed at ingest time)

**Requirements**:
- Phonetic analysis plugin must be available (standard in ES Cloud)
- Requires full reindex

**References**:
- [Phonetic Analysis Plugin](https://www.elastic.co/guide/en/elasticsearch/plugins/8.18/analysis-phonetic.html)
- [Double Metaphone](https://www.elastic.co/guide/en/elasticsearch/plugins/8.19/analysis-phonetic-token-filter.html)

---

### 4.6 Domain-Specific Field Boosting

**Concept**: Leverage curriculum-specific fields that signal pedagogical intent.

**Current Field Weights**:
```typescript
const LESSON_BM25_CONTENT = [
  'lesson_title^3',
  'lesson_keywords^2',
  'key_learning_points^2',
  'misconceptions_and_common_mistakes',  // No boost
  'teacher_tips',                         // No boost
  'content_guidance',                     // No boost
  'lesson_content',                       // No boost
];
```

**Proposed Enhancement**:
```typescript
const LESSON_BM25_CONTENT_ENHANCED = [
  'lesson_title^3',
  'lesson_keywords^2',
  'key_learning_points^2',
  'pupil_lesson_outcome^1.5',            // ADD: Intent signal
  'misconceptions_and_common_mistakes^1.5', // BOOST: Common queries
  'teacher_tips^1',                       // BOOST: Pedagogical signal
  'content_guidance^0.5',                 // Low boost
  'lesson_content',
];
```

**Rationale**:
- `pupil_lesson_outcome`: Contains what students will learn (intent matching)
- `misconceptions_and_common_mistakes`: Contains what students commonly get wrong (relates to "that X stuff" queries)
- `teacher_tips`: Contains pedagogical context

**Why It Should Help**:
- Better leverages existing pedagogical metadata
- Matches intent-based queries to outcome fields
- Low cost, no reindex required

**Effort**: Low (1 hour)  
**Expected Impact**: Low-Medium (+3-5% MRR)  
**Latency Impact**: None

---

### 4.7 Curriculum Thread Expansion

**Concept**: Use curriculum thread hierarchy to expand queries.

**How Threads Work**:
```
Thread: "Algebraic Representations"
├── solving-linear-equations
├── simultaneous-equations-graphically
├── quadratic-graphs
└── ...
```

**Implementation**:
```typescript
async function expandWithThreads(query: string): Promise<string[]> {
  // 1. Find lessons matching query
  const initial = await search(query, { size: 3 });
  
  // 2. Extract threads from top results
  const threads = initial.flatMap(lesson => lesson.thread_slugs);
  
  // 3. Get all lessons in those threads
  const expanded = await getThreadLessons(threads);
  
  // 4. Return lesson slugs as candidates
  return expanded.map(l => l.lesson_slug);
}
```

**Why It Should Help**:
- Leverages Oak's curriculum structure
- Finds related lessons even when query terms don't match
- "combining algebra with graphs" → finds all graphical algebra lessons

**Effort**: Medium (4-6 hours)  
**Expected Impact**: Medium for multi-concept queries (+5-10% MRR)  
**Latency Impact**: Significant (requires pre-search)

---

## 5. Experiment Plan

> **See [Appendix E: Detailed Experimentation Plan](#appendix-e-detailed-experimentation-plan)**
> for the comprehensive, day-by-day experiment schedule with detailed methods.

### 5.1 Prioritisation Matrix

| Technique | Effort | Expected Impact | Reindex? | Priority |
|-----------|--------|-----------------|----------|----------|
| Semantic Reranking | Low | HIGH (+10-20% MRR) | No | 🥇 1st |
| LLM Query Expansion | Medium | HIGH (+10-15% MRR) | No | 🥈 2nd |
| Linear Retriever (Weighted) | Low | Medium (+5-10% MRR) | No | 🥉 3rd |
| Query Classification | Medium | HIGH (per category) | No | 4th |
| Phonetic Matching | Medium | Medium (+5-10% MRR) | Yes | 5th |
| Field Boosting | Low | Low-Medium (+3-5% MRR) | No | 6th |
| Thread Expansion | Medium | Medium (+5-10% MRR) | No | 7th |

**Key Update (2025-12-18)**: Linear Retriever (ES 8.16+) replaces "Weighted RRF"
as RRF itself doesn't support weighting. Linear retriever provides true weighted
combination with configurable normalisers.

### 5.2 Three-Phase Experiment Approach

#### Phase 1: Kibana Playground Experiments (Immediate)

Rapid iteration without code changes:

| ID | Experiment | Purpose | Status |
|----|------------|---------|--------|
| P1 | Enable BM25 in Playground | Compare 4-way hybrid vs semantic-only | 📋 Planned |
| P2 | Add semantic reranker | Test highest-impact technique | 📋 Planned |
| P3 | Test LLM query expansion | Test reformulation approach | 📋 Planned |
| P4 | Document hard query baseline | Understand current failures | 📋 Planned |

#### Phase 2: Dev Tools Console Experiments

For features not available in Playground:

| ID | Experiment | Purpose | Status |
|----|------------|---------|--------|
| D1 | Linear Retriever testing | Test weighted fusion (ES 8.16+) | 📋 Planned |
| D2 | Phonetic analyzer availability | Verify plugin presence | 📋 Planned |

#### Phase 3: Code Implementation

Build and measure what works:

| ID | Implementation | Prerequisite | Status |
|----|----------------|--------------|--------|
| I1 | Semantic reranking | P2 successful | 📋 Planned |
| I2 | Query expansion module | P3 successful | 📋 Planned |
| I3 | Linear retriever migration | D1 successful | 📋 Planned |

### 5.3 Experiment Details

#### Experiment 1: Semantic Reranking (P2 → I1)

**Hypothesis**: Cross-encoder reranking will significantly improve hard query
MRR by capturing semantic relevance that ELSER misses.

**Playground Test (P2)**:
```json
{
  "retriever": {
    "text_similarity_reranker": {
      "retriever": { "rrf": { /* existing hybrid */ } },
      "field": "lesson_content",
      "inference_id": ".rerank-v1-elasticsearch",
      "inference_text": "{query}",
      "rank_window_size": 50
    }
  }
}
```

**Success Criteria**:
- [ ] Hard query MRR ≥ 0.45 (20%+ improvement from 0.367)
- [ ] Standard query MRR ≥ 0.92 (no regression from 0.931)
- [ ] p95 latency ≤ 1500ms (allow +200ms for reranking)

---

#### Experiment 2: LLM Query Expansion (P3 → I2)

**Hypothesis**: Expanding colloquial queries into curriculum terms before
search will bridge the vocabulary gap.

**Manual Test (P3)**:
1. Take query: "that sohcahtoa stuff for triangles"
2. Ask Playground LLM: "What mathematical terms relate to sohcahtoa?"
3. Expected expansion: "trigonometry SOHCAHTOA sine cosine tangent right triangle"
4. Search with expanded terms
5. Compare results

**Success Criteria**:
- [ ] Naturalistic query MRR improvement ≥ 20%
- [ ] Expansion latency ≤ 200ms
- [ ] No hallucinated/irrelevant terms

---

#### Experiment 3: Linear Retriever (D1 → I3)

**Hypothesis**: Weighting ELSER higher than BM25 will improve hard queries
without regressing standard queries.

**Console Test (D1)**:
```json
{
  "retriever": {
    "linear": {
      "retrievers": [
        { "retriever": { /* BM25 */ }, "weight": 0.5, "normalizer": "minmax" },
        { "retriever": { /* ELSER content */ }, "weight": 1.5, "normalizer": "minmax" },
        { "retriever": { /* ELSER structure */ }, "weight": 1.0, "normalizer": "minmax" }
      ]
    }
  }
}
```

**Weight Matrix to Test**:
| Config | BM25 | ELSER Content | ELSER Structure |
|--------|------|---------------|-----------------|
| Baseline | 1.0 | 1.0 | 1.0 |
| ELSER-heavy | 0.5 | 1.5 | 1.0 |
| ELSER-dominant | 0.3 | 1.7 | 1.0 |
| Content-focused | 0.5 | 1.8 | 0.7 |

**Success Criteria**:
- [ ] Identify optimal weight configuration
- [ ] Hard query MRR improvement without standard regression
- [ ] Document weight sensitivity

---

## 6. Success Metrics

### 6.1 What Success Looks Like for Users

| MRR | Rating | User Experience |
|-----|--------|-----------------|
| ≥ 0.80 | Excellent | "Found it immediately" — teacher clicks first or second result |
| ≥ 0.50 | Good | "Found it quickly" — teacher scans top 2-3 results, finds what they need |
| ≥ 0.33 | Acceptable | "Had to look around" — teacher scrolls, tries a few results |
| ≥ 0.25 | Poor | "Frustrating" — correct result buried, might miss it entirely |
| < 0.25 | Very Poor | "Gave up" — teacher can't find what they need, leaves frustrated |

**Our current hard query MRR of 0.367 means**: The right lesson is typically the 3rd result. Teachers have to scroll and click around. It works, but it's not the "just works" experience they deserve.

**Our target of ≥ 0.50 means**: The right lesson is typically the 2nd result. Teachers glance at results and find what they need. Search becomes invisible infrastructure—it just works.

### 6.2 Target Metrics

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| **Hard Query MRR** | 0.367 | **≥ 0.50** | +36% |
| Hard Query NDCG@10 | 0.250 | ≥ 0.40 | +60% |
| Standard Query MRR | 0.931 | ≥ 0.92 | No regression |
| p95 Latency | ~1300ms | ≤ 1500ms | Allow +200ms |

### 6.3 Per-Experiment Targets

| Experiment | MRR Target | Notes |
|------------|------------|-------|
| Semantic Reranking | ≥ 0.45 | Biggest single lever |
| Weighted RRF | ≥ 0.40 | Quick win |
| Query Classification | ≥ 0.45 | Combined effect |
| LLM Query Expansion | ≥ 0.42 | For naturalistic queries |
| Phonetic | ≥ 0.38 | For misspelling queries |

---

## 7. Risk Assessment

### 7.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Reranker not available on Serverless | Low | High | Check endpoint before implementation |
| Weighted RRF not in ES version | Medium | Medium | Fallback to query-time boosting |
| LLM latency too high | Medium | Medium | Implement caching, batch queries |
| Phonetic false positives | Medium | Low | Use low boost, test thoroughly |

### 7.2 Quality Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Standard query regression | Medium | High | Gate all changes on standard MRR ≥ 0.92 |
| Overfitting to test queries | Medium | Medium | Hold out some hard queries |
| Latency regression | High | Medium | Set latency budget, optimize |

### 7.3 Scope Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Diminishing returns | Medium | Medium | Prioritize high-impact experiments |
| Feature creep | Low | Medium | Stick to experiment plan |
| Time overrun | Medium | Low | Timebox each experiment |

---

## 8. Instance Details

### Elastic Cloud Serverless Instance

| Property | Value |
|----------|-------|
| **Kibana** | `poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud` |
| **Elasticsearch** | `poc-open-curriculum-api-search-dd21a1.es.europe-west1.gcp.elastic.cloud` |
| **Region** | `europe-west1` (GCP Belgium) |
| **Type** | Elastic Cloud Serverless |

### Environment Configuration

```bash
# Required in .env.local
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
```

---

## 9. Verified Feature Availability (2025-12-18)

### ✅ Verified via Kibana UI Exploration

The following features were **confirmed available** by exploring the Kibana UI at
`poc-open-curriculum-api-search-dd21a1.kb.europe-west1.gcp.elastic.cloud`:

### 9.1 Inference Endpoints - ALL CONFIRMED ✅

| Endpoint | Type | Service | Status | Use Case |
|----------|------|---------|--------|----------|
| **`.rerank-v1-elasticsearch`** | `rerank` | Elasticsearch (ML Nodes) | ✅ TECH PREVIEW | **Semantic Reranking** |
| **`.gp-llm-v2-chat_completion`** | `chat_completion` | Elastic Inference (GPU) | ✅ PRECONFIGURED | **Query Expansion** |
| `.elser-2-elasticsearch` | `sparse_embedding` | Elasticsearch (ML Nodes) | ✅ PRECONFIGURED | Already using |
| `.elser-2-elastic` | `sparse_embedding` | Elastic Inference (GPU) | ✅ PRECONFIGURED | Alternative ELSER |
| `.jina-embeddings-v3` | `text_embedding` | Elastic Inference (GPU) | TECH PREVIEW | Dense embeddings |
| `.multilingual-e5-small-elasticsearch` | `text_embedding` | Elasticsearch (ML Nodes) | ✅ PRECONFIGURED | Dense embeddings |
| `.gp-llm-v2-completion` | `completion` | Elastic Inference (GPU) | ✅ PRECONFIGURED | Text completion |
| `.rainbow-sprinkles-elastic` | `chat_completion` | Elastic Inference (GPU) | ✅ PRECONFIGURED | Chat |

**Key Finding**: The `.rerank-v1-elasticsearch` endpoint is **preconfigured and ready to use**
for Experiment 1 (Semantic Reranking). The `.gp-llm-v2-chat_completion` endpoint is ready for
Experiment 4 (LLM Query Expansion).

### 9.2 ES Version - Serverless Latest

Elastic Cloud Serverless runs on the latest stable version with automatic upgrades.
**Weighted RRF** (introduced in ES 8.15+) should be available but needs verification via test query.

### 9.3 Phonetic Analysis - TBD

Plugin availability needs verification. On Cloud Serverless, plugins are managed by Elastic.
Can test by attempting to create an analyzer with `analysis-phonetic` filter.

### 9.4 Current Analyzer Configuration

**Important**: Stemming is **NOT** enabled. Current analyzer chain:

```typescript
// From es-analyzer-config.ts
oak_text_index: { filter: ['lowercase'] }           // Index time
oak_text_search: { filter: ['lowercase', 'oak_syns_filter'] }  // Search time
```

Phase 3e testing found that stemming **regressed** hard query performance, so it was removed.

### 9.5 Kibana Playground Available

The Kibana **Playground** (`/app/search_playground`) provides an interactive environment
for testing search queries and experimenting with reranking, embeddings, and other features.

### 9.6 Latency Budget Decision

| Use Case | Acceptable p95 | Priority |
|----------|---------------|----------|
| Demo/Stakeholder | ≤ 2000ms | MRR first |
| Production API | ≤ 500ms | Latency first |
| MCP Tool | ≤ 1500ms | Balance |

**Current**: ~1300ms p95 for four-way hybrid
**With reranking**: ~1600ms p95 estimated (+300ms)

**Decision needed**: What is the primary use case and acceptable latency?

---

## 10. References

### 9.1 Elasticsearch Documentation

- [Semantic Reranking](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html)
- [Reciprocal Rank Fusion](https://www.elastic.co/guide/en/elasticsearch/reference/8.19/rrf.html)
- [Weighted RRF](https://www.elastic.co/search-labs/blog/weighted-reciprocal-rank-fusion-rrf)
- [Phonetic Analysis Plugin](https://www.elastic.co/guide/en/elasticsearch/plugins/8.18/analysis-phonetic.html)
- [Fuzziness Options](https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#fuzziness)

### 9.2 Research Papers

- [Query Expansion with LLMs (GRF)](https://arxiv.org/abs/2305.07477)
- [RQ-RAG: Query Reformulation](https://arxiv.org/abs/2404.00610)
- [QE-RAG: Query Entry Errors](https://arxiv.org/abs/2504.04062)

### 9.3 Internal Documentation

- [Phase 3 Plan](../plans/semantic-search/phase-3-multi-index-and-fields.md)
- [Feature Parity Analysis](feature-parity-analysis.md)
- [Testing Strategy](../directives-and-memory/testing-strategy.md)

---

## Appendix A: Hard Query Ground Truth

```typescript
// From apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/hard-queries.ts

const HARD_QUERIES = [
  // Naturalistic
  { query: 'teach my students about solving for x', ... },
  { query: 'lesson on working out missing angles in shapes', ... },
  { query: 'what to teach before quadratic formula', ... },
  
  // Misspellings
  { query: 'simulatneous equasions substitution method', ... },
  { query: 'circel theorms tangent', ... },
  { query: 'standerd form multiplying dividing', ... },
  
  // Synonyms
  { query: 'finding the gradient of a straight line', ... },
  { query: 'rules for powers and indices', ... },
  { query: 'how to rearrange formulas', ... },
  
  // Multi-concept
  { query: 'combining algebra with graphs', ... },
  { query: 'probability with tree diagrams and fractions', ... },
  
  // Colloquial
  { query: 'that sohcahtoa stuff for triangles', ... },
  { query: 'the bit where you complete the square', ... },
  
  // Intent-based
  { query: 'challenging extension work for able mathematicians', ... },
  { query: 'visual introduction to vectors for beginners', ... },
];
```

---

## Appendix B: Implementation Checklist

> **Updated 2025-12-18** - Aligned with three-phase experiment approach.

### Phase 1: Playground Experiments

#### P1: Enable BM25 in Playground
- [ ] Navigate to Playground Query view
- [ ] Add BM25 multi_match retrievers to RRF
- [ ] Test 5 hard queries
- [ ] Compare results to semantic-only baseline
- [ ] Document in Appendix C

#### P2: Semantic Reranking
- [x] Verify endpoint availability ✅ `.rerank-v1-elasticsearch` confirmed
- [ ] Wrap RRF in `text_similarity_reranker`
- [ ] Test 5 hard queries with reranking
- [ ] Measure subjective relevance improvement
- [ ] Document in Appendix C

#### P3: LLM Query Expansion
- [x] Verify endpoint availability ✅ `.gp-llm-v2-chat_completion` confirmed
- [ ] Manually expand 3 hard queries via Chat
- [ ] Search with expanded terms
- [ ] Compare results to original queries
- [ ] Document expansion patterns that work

#### P4: Hard Query Baseline
- [ ] Run all 15 hard queries through Playground
- [ ] Record top 3 results for each
- [ ] Categorise successes and failures
- [ ] Identify patterns in failures

---

### Phase 2: Dev Tools Console Experiments

#### D1: Linear Retriever
- [ ] Verify ES version ≥ 8.16 (Linear retriever availability)
- [ ] Test baseline equal weights
- [ ] Test ELSER-heavy (0.5/1.5) configuration
- [ ] Test ELSER-dominant (0.3/1.7) configuration
- [ ] Document optimal weights

#### D2: Phonetic Analyzer
- [ ] Attempt to create phonetic analyzer
- [ ] If available: test on misspelling queries
- [ ] If unavailable: document for future when available
- [ ] Assess false positive risk

---

### Phase 3: Code Implementation

#### I1: Semantic Reranking (requires P2 success)
- [ ] Add reranker to `rrf-query-builders.ts`
- [ ] Create configurable rerank flag
- [ ] Add ablation smoke test
- [ ] Measure MRR, NDCG, latency
- [ ] Update quality gate baseline if improved

#### I2: Query Expansion (requires P3 success)
- [ ] Create `query-expansion/` module
- [ ] Design prompt template from P3 learnings
- [ ] Add unit tests
- [ ] Integrate with search pipeline
- [ ] Measure end-to-end impact

#### I3: Linear Retriever (requires D1 success)
- [ ] Replace RRF with Linear retriever
- [ ] Configure optimal weights from D1
- [ ] Update unit tests
- [ ] Run full ablation suite
- [ ] Document performance changes

---

### Verification Checkpoints

| Checkpoint | Requirement | Status |
|------------|-------------|--------|
| Reranker endpoint | `.rerank-v1-elasticsearch` available | ✅ Verified |
| LLM endpoint | `.gp-llm-v2-chat_completion` available | ✅ Verified |
| ES version | ≥ 8.16 for Linear retriever | ❓ TBD |
| Phonetic plugin | `analysis-phonetic` available | ❓ TBD |
| Stemming status | No stemming on any analyzer | ✅ Verified |

---

## Appendix C: Playground Experiment Log

### Session 1: 2025-12-18

**Objective**: Test semantic reranking and query expansion in Kibana Playground.

**Setup**:
- LLM: Anthropic Claude Sonnet 3.7 (preconfigured)
- Data: `oak_lessons` index (43 fields)
- Documents sent to LLM: 3

---

#### Experiment 1.1: Hard Query Test - "teach my students about solving for x"

**Query**: "teach my students about solving for x"

**Playground Query Structure** (discovered via Query view):
```json
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {
          "standard": {
            "query": {
              "semantic": {
                "field": "lesson_content_semantic",
                "query": "{query}"
              }
            }
          }
        },
        {
          "standard": {
            "query": {
              "semantic": {
                "field": "lesson_structure_semantic", 
                "query": "{query}"
              }
            }
          }
        }
      ]
    }
  }
}
```

**Key Finding**: Playground uses **semantic-only RRF** (no BM25!). Only fields with
`_semantic` suffix are searched:
- `lesson_content_semantic` ✅ Enabled
- `lesson_structure_semantic` ✅ Enabled
- All BM25 text fields ❌ Disabled

**Result**: LLM responded:
> "Based on the context provided, I don't have specific content focused on teaching
> students how to solve for x in general algebraic equations."

**Analysis**: This confirms the retrieval gap. The semantic-only search didn't surface
lessons about "solving for x" (linear equations). This is exactly the problem our
research aims to solve.

**Comparison to Production**:
| Aspect | Playground | Our Production |
|--------|------------|----------------|
| Retrievers | 2 (semantic only) | 4 (BM25 + ELSER × 2) |
| BM25 | ❌ Not used | ✅ Content + Structure |
| ELSER/Semantic | ✅ Used | ✅ Content + Structure |
| Reranking | ❌ Not configured | ❌ Not yet implemented |

---

*Last updated: 2025-12-18*

---

## Appendix D: Comprehensive Experimentation Plan

### Overview

This plan consolidates all approved experiments and research questions from the
2025-12-18 planning session. The goal is systematic, well-documented exploration
of search optimisation techniques, with all findings recorded in this document.

### Key Questions to Answer

| # | Question | Status |
|---|----------|--------|
| Q1 | Does no-stemming apply to both lessons and units? | ✅ Answered |
| Q2 | Would stemming help specifically on BM25 structure retrievers? | ✅ Researched |
| Q3 | What features does the ES LLM connection enable? | ✅ Researched |
| Q4 | What have we learned about enhancements for all query types? | ✅ Synthesised |
| Q5 | What specifically helps hard lesson queries? | 🔬 Experimenting |

---

### Q1 Answer: Stemming Configuration

**Question**: Does the no-stemming setting apply to both lessons and units?

**Answer**: **YES** - the same analyzer configuration is used for ALL indexes.

From `es-analyzer-config.ts`:
```typescript
export const ES_ANALYZER_CONFIG = {
  oak_text_index: {
    type: 'custom',
    tokenizer: 'standard',
    filter: ['lowercase'],  // No stemming
  },
  oak_text_search: {
    type: 'custom',
    tokenizer: 'standard',
    filter: ['lowercase', 'oak_syns_filter'],  // Synonyms only, no stemming
  },
} as const;
```

This configuration is applied via `textFieldWithAnalyzers()` in all field overrides:
- `lessons-overrides.ts` → lesson_content, lesson_structure, pedagogical fields
- `unit-rollup-overrides.ts` → unit_content, unit_structure
- Both use identical analyzer settings

**Implication**: Any stemming experiment would affect both lessons and units equally.

---

### Q2 Answer: Stemming on Structure Indexes Specifically

**Question**: Would stemming help on BM25 structure retrievers specifically, since
they are more about keyword matching than semantic understanding?

**Answer**: **Unlikely to help, and research suggests it could harm precision.**

#### Evidence from ES Best Practices:

1. **Titles should NOT use stemming** - Titles are concise and benefit from exact
   matching. Stemming can cause unintended matches (e.g., "universe" ↔ "university").

2. **Keywords/metadata should NOT use stemming** - These are structured terms where
   exact matching is crucial.

3. **Content/transcripts CAN use stemming** - Longer text benefits from stemming
   to improve recall.

#### Our Structure Fields Analysis:

| Index | Structure Field | Contents | Stemming Recommendation |
|-------|-----------------|----------|------------------------|
| Lessons | `lesson_structure` | Curated summary (~100 words) | ❌ Don't add |
| Lessons | `lesson_title^3` | Title (exact terms) | ❌ Don't add |
| Units | `unit_structure` | Curated summary (~100 words) | ❌ Don't add |
| Units | `unit_title^3` | Title (exact terms) | ❌ Don't add |

#### Why Phase 3e Stemming Regressed:

We tested `light_english` stemmer on ALL fields (content + structure) in Phase 3e.
The regression was likely because:

1. **Structure fields contain curated keywords** - Stemming diluted the keyword signal
2. **Synonyms already handle variants** - `oak_syns_filter` provides controlled expansion
3. **Hard queries benefit from exact matching** - "solving for x" needs exact "x"

#### Alternative: Multi-Field with Selective Stemming

If we wanted to test stemming on content only, we could use multi-field mapping:

```typescript
lesson_content: {
  type: 'text',
  analyzer: 'oak_text_index',  // No stemming
  search_analyzer: 'oak_text_search',
  fields: {
    stemmed: {
      type: 'text',
      analyzer: 'english'  // With stemming
    }
  }
}
```

Then query both: `['lesson_content^2', 'lesson_content.stemmed^0.5']`

**Recommendation**: Do not add stemming to structure fields. Consider testing
multi-field stemming on content fields only as a lower-priority experiment.

---

### Q3 Answer: ES LLM Connection Features

**Question**: What features/applications does the LLM connection in ES enable?
Does it enable natural language to structured response? Can it be used alongside
normal queries?

**Answer**: The ES LLM connection enables several powerful features:

#### 1. Query Expansion/Reformulation

**Use case**: Expand colloquial queries into curriculum terms BEFORE search.

```typescript
// Original: "that sohcahtoa stuff"
// Expanded: "trigonometry sine cosine tangent SOHCAHTOA right-angled triangles"

const response = await esLLM.complete({
  model: '.gp-llm-v2-chat_completion',
  prompt: `Expand this educational search query with mathematical terms:
    "${originalQuery}"
    Return only the expanded query.`
});
const expandedQuery = response.text;
// Use expandedQuery in normal BM25+ELSER search
```

**Key point**: This runs BEFORE the search, then uses normal retrievers.

#### 2. Natural Language to ES Query DSL

**Use case**: Convert user questions into structured ES queries.

```typescript
// User: "Find algebra lessons for Year 9 with extension activities"
// LLM generates:
{
  "query": {
    "bool": {
      "must": [{ "match": { "lesson_content": "algebra extension" }}],
      "filter": [{ "term": { "years": "9" }}]
    }
  }
}
```

**Implementation via Inference Processor**:
```json
PUT _ingest/pipeline/query_helper_pipeline
{
  "processors": [
    {
      "script": {
        "source": "ctx.prompt = 'Generate ES query for: ' + ctx.content"
      }
    },
    {
      "inference": {
        "model_id": ".gp-llm-v2-chat_completion",
        "input_output": {
          "input_field": "prompt",
          "output_field": "query"
        }
      }
    }
  ]
}
```

#### 3. RAG (Retrieval Augmented Generation)

**Use case**: Search retrieves documents → LLM generates response using them.

This is what the Kibana Playground does:
1. Execute search query (RRF with semantic retrievers)
2. Take top N documents
3. Send to LLM with user question
4. LLM generates response grounded in retrieved content

**Our use case**: Not primary (we return search results, not generated answers),
but useful for MCP tool responses.

#### 4. Chat Completion Streaming

**Use case**: Real-time streaming responses for interactive applications.

```json
POST /_inference/chat_completion/.gp-llm-v2-chat_completion/_stream
{
  "messages": [
    {"role": "user", "content": "Explain how to solve linear equations"}
  ]
}
```

#### Summary Table

| Feature | Use Case | Runs With Search? | Priority |
|---------|----------|-------------------|----------|
| Query Expansion | Pre-search reformulation | BEFORE search | 🥇 HIGH |
| Query DSL Generation | NL to structured | REPLACES manual query | Medium |
| RAG | Answer generation | AFTER search | Low (not our use case) |
| Streaming Chat | Interactive UX | Standalone | Low |

**Recommendation**: Focus on **Query Expansion** as it directly addresses hard
queries without changing our search architecture.

---

### Q4 Answer: Enhancements for All Query Types

**Question**: What have we learned about potential enhancements for ALL indexes
and retrievers, not just hard queries?

#### A. Index Structure Best Practices

| Practice | Current State | Recommendation |
|----------|---------------|----------------|
| Separate BM25/semantic fields | ✅ Done | Keep (content vs content_semantic) |
| Multi-field for flexibility | ❌ Not done | Consider for title (exact + stemmed) |
| Keyword fields for filtering | ✅ Done | Keep (subject_slug, key_stage) |
| Completion for autocomplete | ✅ Done | Keep (title_suggest) |
| Term vectors for highlighting | ✅ Done | Keep (lesson_content) |

#### B. Retriever Configuration

| Practice | Current State | Recommendation |
|----------|---------------|----------------|
| Content-type-aware BM25 | ✅ Done | Keep (lessons vs units differ) |
| RRF fusion | ✅ Done | Consider Linear retriever upgrade |
| Semantic reranking | ❌ Not done | **Add** (top priority) |
| Query classification | ❌ Not done | Consider for routing |

#### C. Analyzer Configuration

| Practice | Current State | Recommendation |
|----------|---------------|----------------|
| Synonyms for domain terms | ✅ Done | Expand oak-syns dictionary |
| No stemming on structure | ✅ Correct | Keep |
| Lowercase normalisation | ✅ Done | Keep |
| Stop words | ❌ Removed | Keep removed (hurt hard queries) |

#### D. Query-Time Optimisations

| Practice | Current State | Recommendation |
|----------|---------------|----------------|
| Field boosting | ✅ Done | Fine-tune (pupil_outcome?) |
| min_should_match | ✅ Lessons only | Keep for lessons |
| Fuzziness | ✅ Content-type-aware | Keep |
| Phrase boosting | ❌ Removed | Reconsider for exact matches |

---

### Q5: Hard Lesson Query Specific Optimisations

**Question**: What specifically helps hard lesson queries, which are most in need
of improvement?

#### Current Hard Query MRR: 0.367 (Acceptable)
#### Target: ≥ 0.50 (Good)

#### High-Impact Techniques (Prioritised)

| # | Technique | Expected Impact | Effort | Reindex? |
|---|-----------|-----------------|--------|----------|
| 1 | Semantic Reranking | +10-20% MRR | Low | No |
| 2 | Query Expansion (LLM) | +10-15% MRR | Medium | No |
| 3 | Linear Retriever (weighted) | +5-10% MRR | Low | No |
| 4 | Query Classification | +15-25% MRR per category | Medium | No |
| 5 | Phonetic Matching | +5-10% MRR (misspellings) | Medium | Yes |

#### Why These Help Hard Queries Specifically

1. **Semantic Reranking**: Cross-encoder captures nuanced relevance that ELSER
   misses. "teach solving for x" → reranker understands teaching context.

2. **Query Expansion**: Bridges colloquial → formal gap BEFORE search.
   "sohcahtoa stuff" → "trigonometry SOHCAHTOA sine cosine tangent"

3. **Linear Retriever**: Weight ELSER higher than BM25 for naturalistic queries.
   ELSER alone: 0.287 MRR vs BM25 alone: 0.080 MRR on hard queries.

4. **Query Classification**: Route different query types to optimal strategies.
   - Topic queries → 4-way hybrid (current)
   - Naturalistic → ELSER-dominant
   - Misspellings → phonetic fallback

5. **Phonetic Matching**: Catches severe misspellings beyond fuzziness.
   "circel theorms" → circle theorem (phonetic: SRKL 0RMS)

---

## Appendix E: Detailed Experimentation Plan

### Phase 1: Playground Experiments (Immediate)

These experiments use the Kibana Playground for rapid iteration.

#### Experiment P1: Enable BM25 Fields in Playground

**Objective**: Compare 4-way hybrid vs semantic-only in Playground.

**Method**:
1. Navigate to Playground Query view
2. Edit the query to add BM25 retrievers:
   ```json
   {
     "retriever": {
       "rrf": {
         "retrievers": [
           { "standard": { "query": { "multi_match": { 
             "query": "{query}", 
             "fields": ["lesson_title^3", "lesson_content", "key_learning_points^2"],
             "type": "best_fields",
             "fuzziness": "AUTO",
             "minimum_should_match": "75%"
           }}}},
           { "standard": { "query": { "semantic": { 
             "field": "lesson_content_semantic", "query": "{query}" 
           }}}},
           { "standard": { "query": { "semantic": { 
             "field": "lesson_structure_semantic", "query": "{query}" 
           }}}}
         ]
       }
     }
   }
   ```
3. Test hard queries and compare results

**Expected Outcome**: Better results than semantic-only baseline.

**Log Results**: Record MRR improvement estimates.

---

#### Experiment P2: Add Semantic Reranker

**Objective**: Test if reranking improves hard query results.

**Method**:
1. Wrap RRF retriever in `text_similarity_reranker`
2. Configure:
   ```json
   {
     "retriever": {
       "text_similarity_reranker": {
         "retriever": {
           "rrf": { /* existing hybrid retriever */ }
         },
         "field": "lesson_content",
         "inference_id": ".rerank-v1-elasticsearch",
         "inference_text": "{query}",
         "rank_window_size": 50
       }
     }
   }
   ```
3. Test same hard queries

**Expected Outcome**: Significant relevance improvement on naturalistic queries.

**Log Results**: Note which query types improve most.

---

#### Experiment P3: Test LLM Query Expansion

**Objective**: Test if expanding queries before search improves results.

**Method**:
1. Use Chat interface to manually expand query:
   - Original: "teach my students about solving for x"
   - Ask LLM: "What mathematical terms relate to 'solving for x'?"
   - Use expanded terms in new search

2. Compare results of expanded vs original query

**Expected Outcome**: Expanded queries surface more relevant results.

**Log Results**: Document which expansions help and which don't.

---

#### Experiment P4: Hard Query Baseline Documentation

**Objective**: Document current Playground behaviour on all hard queries.

**Method**:
1. Run each of 15 hard queries through Playground
2. Record:
   - Top 3 results returned
   - LLM's response quality
   - Which queries succeed vs fail
3. Categorise failures by type

**Hard Queries to Test**:
1. "teach my students about solving for x"
2. "lesson on working out missing angles in shapes"
3. "what to teach before quadratic formula"
4. "simulatneous equasions substitution method"
5. "circel theorms tangent"
6. "standerd form multiplying dividing"
7. "finding the gradient of a straight line"
8. "rules for powers and indices"
9. "how to rearrange formulas"
10. "combining algebra with graphs"
11. "probability with tree diagrams and fractions"
12. "that sohcahtoa stuff for triangles"
13. "the bit where you complete the square"
14. "challenging extension work for able mathematicians"
15. "visual introduction to vectors for beginners"

**Expected Outcome**: Baseline understanding of where Playground fails.

---

### Phase 2: Dev Tools Console Experiments

For queries that can't be tested in Playground.

#### Experiment D1: Linear Retriever (Weighted RRF Replacement)

**Objective**: Test if weighting ELSER higher improves hard queries.

**Method**: Use Dev Tools Console:
```json
GET oak_lessons/_search
{
  "retriever": {
    "linear": {
      "retrievers": [
        {
          "retriever": { "standard": { "query": { "multi_match": {
            "query": "teach solving for x",
            "fields": ["lesson_title^3", "lesson_content"]
          }}}},
          "weight": 0.5,
          "normalizer": "minmax"
        },
        {
          "retriever": { "standard": { "query": { "semantic": {
            "field": "lesson_content_semantic",
            "query": "teach solving for x"
          }}}},
          "weight": 1.5,
          "normalizer": "minmax"
        }
      ]
    }
  }
}
```

**Note**: Linear retriever requires ES 8.16+. If not available, use RRF and
boost individual query scores.

---

#### Experiment D2: Phonetic Analyzer Availability

**Objective**: Verify if phonetic analysis is available on Serverless.

**Method**:
```json
PUT test_phonetic_index
{
  "settings": {
    "analysis": {
      "filter": {
        "phonetic_filter": {
          "type": "phonetic",
          "encoder": "double_metaphone"
        }
      },
      "analyzer": {
        "phonetic_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "phonetic_filter"]
        }
      }
    }
  }
}
```

**Expected Outcome**: If succeeds → phonetic available. If fails → not available.

---

### Phase 3: Code Implementation

After Playground/Console experiments validate approaches.

#### Implementation I1: Semantic Reranking

**Prerequisite**: P2 shows improvement
**Files**: `rrf-query-builders.ts`
**Test**: Add to ablation smoke tests
**Metrics**: MRR, NDCG, latency

#### Implementation I2: Query Expansion

**Prerequisite**: P3 shows improvement
**Files**: New `query-expansion/` module
**Test**: Unit tests for expansion function
**Metrics**: Before/after MRR

#### Implementation I3: Linear Retriever

**Prerequisite**: D1 shows improvement
**Files**: `rrf-query-builders.ts` (rename to `retriever-builders.ts`?)
**Test**: Update ablation tests
**Metrics**: Per-retriever contribution

---

### Experiment Order

Optimised for learning and dependencies:

| Day | Experiments | Purpose |
|-----|-------------|---------|
| 1 | P4 (baseline), P1 (BM25 in Playground) | Understand current state |
| 1 | P2 (reranker) | Test highest-impact technique |
| 2 | P3 (query expansion), D2 (phonetic) | Test remaining techniques |
| 2 | D1 (Linear retriever) | Test weighted fusion |
| 3+ | I1-I3 (implementations) | Build what works |

---

### Success Criteria

| Metric | Current | Target | Stretch |
|--------|---------|--------|---------|
| Hard Query MRR | 0.367 | 0.50 | 0.60 |
| Standard Query MRR | 0.931 | ≥0.92 | ≥0.93 |
| p95 Latency | ~1300ms | ≤1500ms | ≤1200ms |

---

### Documentation Requirements

All experiments must record:
1. **Setup**: Configuration used
2. **Queries tested**: Which of the 15 hard queries
3. **Results**: Ranking of expected lesson (1st, 2nd, not found, etc.)
4. **Observations**: What worked, what didn't, why
5. **Next steps**: What to try based on findings

---

## Appendix F: Deep Dive - Linear Retriever vs RRF

### Overview

This section provides a comprehensive comparison of the two primary fusion
techniques for hybrid search in Elasticsearch: Reciprocal Rank Fusion (RRF)
and the Linear Retriever. Understanding when to use each is crucial for
optimising search relevance.

### What They Are

#### Reciprocal Rank Fusion (RRF)

**Formula**: `score = Σ (1 / (rank_i + k))` where k = rank_constant (default 60)

RRF merges results from multiple retrievers based on **rank position only**,
not the actual scores. A document ranked 1st in any retriever contributes
`1/(1+60) ≈ 0.016` to its final score.

**Key characteristics**:
- **Score-agnostic**: Ignores actual relevance scores
- **Rank-focused**: Only considers position in result lists
- **Parameter-light**: Only `rank_constant` and `rank_window_size` to tune
- **Self-normalising**: No need to normalise scores from different retrievers

#### Linear Retriever

**Formula**: `score = Σ (weight_i × normalize(score_i))`

Linear retriever combines results using **weighted, normalised scores** from
each retriever.

**Key characteristics**:
- **Score-aware**: Uses actual relevance scores
- **Weighted**: Each retriever can have different importance
- **Normalisation options**: MinMax, L2, or custom normalisers
- **Fine-grained control**: Precise tuning of retriever contributions

### Technical Comparison

| Aspect | RRF | Linear Retriever |
|--------|-----|------------------|
| **Introduced** | ES 8.14 | ES 8.18 (preview), 9.0 (GA) |
| **Status** | Generally Available | Generally Available (9.0+) |
| **Input** | Ranks only | Scores + weights |
| **Normalisation** | Implicit | Explicit (MinMax, L2) |
| **Tuning complexity** | Low | Medium-High |
| **Score semantics** | Ranks compressed | Scores preserved |
| **Edge case handling** | Documents not in retriever get infinite rank | Documents not in retriever get zero score |

### Canonical Use Cases

#### When to Use RRF

1. **Disparate scoring systems**: When combining retrievers with incompatible
   score ranges (e.g., BM25 scores vs kNN distances)

2. **Quick hybrid setup**: When you want a "just works" approach without
   extensive tuning

3. **Rank-based relevance**: When you care about "is this in the top K?"
   rather than "how much better is this than that?"

4. **Unknown score distributions**: When you don't understand the score
   distributions of your retrievers

**Example use case**: E-commerce search combining product title match (BM25)
with visual similarity (kNN on image embeddings). The score scales are
completely different, so RRF's rank-based approach avoids score calibration.

#### When to Use Linear Retriever

1. **Fine-tuned relevance**: When you need precise control over retriever
   contributions

2. **Known score semantics**: When you understand what scores mean and want
   to preserve relative differences

3. **Educational/domain search**: When certain signals (e.g., semantic match)
   should dominate for specific query types

4. **A/B testing weights**: When experimentally determining optimal retriever
   weights

**Example use case**: Educational search where ELSER semantic understanding
should be weighted 2× higher than BM25 lexical matching for naturalistic
queries, but equally weighted for topic-based queries.

### Elasticsearch Official Recommendation

Based on Elasticsearch documentation and Search Labs guidance:

> **For most hybrid search implementations, RRF is the recommended starting
> point** due to its simplicity and effectiveness without requiring score
> normalisation or weight tuning.
>
> **Linear retriever is recommended when**:
> 1. You have specific requirements for score-based ranking
> 2. You need to tune the relative importance of different retrievers
> 3. You're doing systematic relevance optimisation with A/B testing

For **educational search specifically**, the recommendation is nuanced:

- **Start with RRF** for initial implementation
- **Graduate to Linear** when you have data showing that specific retrievers
  (e.g., ELSER) outperform others for specific query types
- **Consider query classification** to route different query types to
  different retriever configurations

### Our Recommendation for Oak Search

Given our findings from Phase 3e ablation testing:

| Query Type | ELSER MRR | BM25 MRR | Recommendation |
|------------|-----------|----------|----------------|
| Hard (naturalistic) | 0.287 | 0.080 | Weight ELSER higher |
| Standard (topic) | ~0.60 | ~0.85 | Weight BM25 higher |
| Overall (mixed) | — | — | Query classification |

**Recommendation**: Implement Linear Retriever with query-type-aware weights:

```typescript
// Naturalistic queries (detected via classification)
const naturalisticWeights = {
  bm25Content: 0.3,
  bm25Structure: 0.3,
  elserContent: 1.5,
  elserStructure: 1.2,
};

// Topic queries (short, dictionary words)
const topicWeights = {
  bm25Content: 1.2,
  bm25Structure: 1.0,
  elserContent: 0.8,
  elserStructure: 0.8,
};
```

**Migration path**:
1. Keep RRF for now (stable, working)
2. Experiment with Linear in Playground (D1)
3. Implement query classification first
4. Apply Linear with type-specific weights

---

## Appendix G: Deep Dive - LLM Capabilities for Search

### Overview

Elasticsearch's LLM integration enables several powerful capabilities for
enhancing search. This section analyses each capability and its applicability
to Oak's educational search system.

### Available Capabilities

#### 1. Query Expansion/Reformulation

**What it does**: Expands or rewrites a query BEFORE search to include
related terms, synonyms, and clarifications.

**ES Implementation**:
```typescript
// Call inference endpoint before search
const expansion = await client.inference.inference({
  task_type: 'completion',
  inference_id: '.gp-llm-v2-chat_completion',
  input: `Expand this educational search query with mathematical terms
          and synonyms: "${originalQuery}". Return only search terms.`
});

// Use expanded query in search
const results = await client.search({
  index: 'oak_lessons',
  query: { multi_match: { query: expansion.text, ... } }
});
```

**Applicability for Oak**:
| Aspect | Assessment |
|--------|------------|
| Use on ALL queries? | ⚠️ Consider selectively |
| Latency impact | +100-200ms |
| Best for | Colloquial, naturalistic, short queries |
| Risk | Over-expansion on topic queries |

**Recommendation**: Use query expansion **selectively** based on query
classification:
- ✅ Naturalistic: "teach my students about solving for x"
- ✅ Colloquial: "that sohcahtoa stuff"
- ⚠️ Topic queries: "quadratic equations" (may dilute precision)
- ❌ Misspellings: Handle with fuzzy/phonetic instead

---

#### 2. Natural Language to Query DSL (NL→DSL)

**What it does**: Converts natural language queries into structured
Elasticsearch Query DSL, extracting filters, aggregations, and complex
query logic.

**ES Implementation**:
```typescript
const dsl = await client.inference.inference({
  task_type: 'completion',
  inference_id: '.gp-llm-v2-chat_completion',
  input: `Convert this natural language query to Elasticsearch DSL for
          the oak_lessons index. Available fields: subject_slug, key_stage,
          lesson_title, lesson_content. Query: "${naturalQuery}"
          Respond with valid JSON only.`
});

const query = JSON.parse(dsl.text);
const results = await client.search({ index: 'oak_lessons', ...query });
```

**Applicability for Oak**:
| Aspect | Assessment |
|--------|------------|
| Use case | New "natural search" endpoint |
| Latency impact | +150-300ms |
| Best for | Complex intent-based queries |
| Risk | LLM hallucination, invalid DSL |

**Example transformations**:
| Natural Language | Generated DSL |
|------------------|---------------|
| "KS4 algebra lessons about equations" | `{ filter: [{ term: { key_stage: "ks4" }}, { match: { subject_slug: "maths" }}], query: { match: { lesson_content: "algebra equations" }}}` |
| "easy introduction lessons for year 7" | `{ filter: [{ term: { years: "7" }}], query: { match: { lesson_title: "introduction" }}}` |

**Recommendation**: Implement as a **separate endpoint** for complex queries,
not as a replacement for standard search. Use when:
- Query contains explicit filter criteria ("KS4", "Year 7", "foundation tier")
- Query length > 10 words (suggests complex intent)
- Query classification detects "intent-based" type

---

#### 3. Retrieval Augmented Generation (RAG)

**What it does**: Retrieves documents via search, then uses LLM to generate
a response grounded in the retrieved content.

**ES Implementation**:
```typescript
// Step 1: Retrieve documents
const searchResults = await client.search({
  index: 'oak_lessons',
  retriever: { rrf: { ... } },
  size: 5
});

// Step 2: Generate grounded response
const ragResponse = await client.inference.inference({
  task_type: 'chat_completion',
  inference_id: '.gp-llm-v2-chat_completion',
  input: {
    messages: [
      { role: 'system', content: 'Answer based only on provided context.' },
      { role: 'user', content: `Context: ${JSON.stringify(searchResults.hits)}
                                Question: ${userQuery}` }
    ]
  }
});
```

**Applicability for Oak**:
| Aspect | Assessment |
|--------|------------|
| Use case | MCP tool responses, answer generation |
| Latency impact | +200-500ms |
| Best for | "Tell me about..." queries in MCP |
| Risk | Hallucination, inaccuracy |

**CRITICAL for education**: RAG must be **accuracy-first**. Implement with:
1. **Strict grounding**: Only use retrieved content, never hallucinate
2. **Citation**: Always cite which lessons the answer comes from
3. **Confidence thresholds**: Decline to answer if retrieval confidence is low
4. **Human verification**: Flag generated answers for review

**Recommendation**: Implement RAG for **MCP tool responses** where users
expect synthesised answers, NOT for search results where users expect to
browse lessons.

---

#### 4. Streaming Chat Completion

**What it does**: Provides real-time streaming responses for interactive
chat interfaces.

**ES Implementation**:
```typescript
const stream = await client.inference.streamInference({
  task_type: 'chat_completion',
  inference_id: '.gp-llm-v2-chat_completion',
  input: { messages: [...] }
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

**Applicability for Oak**:
| Aspect | Assessment |
|--------|------------|
| Use case | Interactive demos, chat UI |
| Latency impact | First token ~100ms |
| Best for | Conversational interfaces |
| MCP relevance | Low (MCP is request/response) |

**Recommendation**: **Defer** for now. Useful for future chat-based search
interface, but not immediately applicable to MCP tools or current search API.

---

### Proposed Architecture: NL-First Search Pipeline

Based on the analysis, here's a proposed architecture for a new
**natural language search function**:

```
┌─────────────────────────────────────────────────────────────────┐
│                     NL Search Pipeline                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Query ──► Query Classification                            │
│                      │                                          │
│         ┌───────────┬┴────────────┬─────────────┐               │
│         ▼           ▼             ▼             ▼               │
│     [topic]    [natural]     [intent]     [misspell]            │
│         │           │             │             │               │
│         ▼           ▼             ▼             ▼               │
│      (none)    Query Exp.    NL→DSL        Phonetic             │
│         │           │        Extract        Enhance             │
│         │           │        Filters            │               │
│         │           │             │             │               │
│         └───────────┴─────────────┴─────────────┘               │
│                           │                                     │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   Standard Hybrid      │  ◄── ALL paths converge │
│              │   (4-way RRF/Linear)   │                         │
│              │   + extracted filters  │                         │
│              │   + phonetic fields    │                         │
│              └────────────────────────┘                         │
│                           │                                     │
│                           ▼                                     │
│                    Semantic Reranker                            │
│                           │                                     │
│                           ▼                                     │
│                   ┌───────┴───────┐                             │
│                   ▼               ▼                             │
│              [Search API]   [MCP Tools]                         │
│                   │               │                             │
│              Return Hits    Apply RAG                           │
│                   │               │                             │
│              ┌────┴────┐    ┌────┴────┐                         │
│              ▼         ▼    ▼         ▼                         │
│           Lessons   Units  Answer  Citations                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Pipeline stages**:

1. **Query Classification** (rule-based or LLM):
   - Detect query type (topic, natural, intent, misspelling)
   - Route to appropriate **pre-processing** (not separate search paths)

2. **Type-Specific Pre-Processing** (enriches query BEFORE hybrid search):
   - **Topic** → No pre-processing, use query as-is
   - **Naturalistic** → LLM query expansion adds curriculum terms
   - **Intent-based** → NL→DSL extracts filters (e.g., "KS4" → `key_stage: "ks4"`)
     but text portion still goes to hybrid
   - **Misspelling** → Add phonetic field queries to the retriever set

3. **Standard Hybrid Search** (ALL paths converge here):
   - Every query type uses the same 4-way hybrid (BM25 + ELSER)
   - Pre-processing enriches the query text or adds filters
   - Phonetic retriever added as 5th retriever if misspelling detected
   - Consistent architecture, comparable results, single code path

4. **Semantic Reranking** (always):
   - Cross-encoder reranking on all paths
   - Captures nuanced relevance

5. **Output Processing**:
   - Search API → Return ranked lessons
   - MCP Tools → Apply RAG for synthesised answers

**Key insight**: Pre-processing transforms the query or extracts filters,
but ALL queries ultimately go through the standard hybrid retriever.
This keeps the architecture simple and allows fair comparison.

> **⚠️ ADR REQUIRED**: When implementing this pipeline, create:
> - **ADR-082**: Query Classification and Routing Architecture
> - Update **ADR-081** with results from experiments P1-P4, D1-D2
>
> All experiments must follow the evaluation framework defined in
> [ADR-081: Search Approach Evaluation Framework](../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md).

---

### LLM Capability Decision Matrix

| Capability | When to Use | When NOT to Use |
|------------|-------------|-----------------|
| **Query Expansion** | Naturalistic, colloquial, short queries | Topic queries, misspellings |
| **NL→DSL** | Complex intent, explicit filters (KS4, Year 7) | Simple topic searches |
| **RAG** | MCP tools needing answers, "tell me about" | Search UI returning lesson list |
| **Streaming** | Interactive chat UI | API responses, MCP |

---

## Appendix H: Hard Query Test Scenario Analysis

### Overview

This section documents the rationale behind each hard query test scenario,
including what it validates, its priority weighting, and potential
optimisation paths.

### Priority Distribution

| Priority | Count | Description |
|----------|-------|-------------|
| **critical** | 3 | Misspelling queries - must work for core UX |
| **high** | 6 | Naturalistic + synonym - common teacher behaviour |
| **medium** | 4 | Multi-concept + colloquial - ELSER strengths |
| **exploratory** | 2 | Intent-based - may need NL→DSL pipeline |

### Query Categories by Optimisation Path

#### Category 1: Misspellings (Critical Priority)

**Current approach**: Fuzzy matching (`fuzziness: AUTO`)
**Limitation**: Edit distance ≤ 2

| Query | Edit Distances | Current Likelihood | Optimisation |
|-------|----------------|-------------------|--------------|
| "standerd form" | 1 | ✅ Should work | Keep fuzzy |
| "simulatneous equasions" | 2+2 | ⚠️ May fail | Phonetic needed |
| "circel theorms" | 2+2 | ❌ Likely fails | Phonetic critical |

**Optimisation path**: Phonetic matching (Double Metaphone) for edit
distance > 2 cases.

#### Category 2: Naturalistic (High Priority)

**Current approach**: BM25 + ELSER hybrid
**Limitation**: Vocabulary mismatch

| Query | Challenge | Optimisation |
|-------|-----------|--------------|
| "teach my students about solving for x" | Pedagogical framing | Query expansion |
| "lesson on working out missing angles" | Descriptive language | ELSER structure |
| "what to teach before quadratic formula" | Sequencing intent | Thread expansion |

**Optimisation path**: LLM query expansion to map teacher language to
curriculum terms.

#### Category 3: Synonyms (High Priority)

**Current approach**: Synonym filter (oak_syns_filter) + ELSER
**Limitation**: Limited synonym dictionary

| Query | Mapping Required | Current Coverage |
|-------|-----------------|------------------|
| "gradient of straight line" | straight line → linear | ⚠️ Partial |
| "rules for powers and indices" | rules → laws, powers → indices | ⚠️ Partial |
| "rearrange formulas" | rearrange → change subject | ❌ Missing |

**Optimisation path**: Expand oak-syns dictionary + rely on ELSER
semantic understanding.

#### Category 4: Multi-Concept (Medium Priority)

**Current approach**: BM25 multi-match + ELSER
**Limitation**: AND vs OR semantics

| Query | Concepts | Challenge |
|-------|----------|-----------|
| "combining algebra with graphs" | algebra, graphs | Find intersection |
| "probability with tree diagrams and fractions" | probability, trees, fractions | All must match |

**Optimisation path**: `min_should_match: 75%` helps here. Thread expansion
could also surface related lessons.

#### Category 5: Colloquial (Medium Priority)

**Current approach**: ELSER semantic understanding
**Limitation**: Informal language dilutes signal

| Query | Formal Equivalent | ELSER Task |
|-------|-------------------|------------|
| "that sohcahtoa stuff for triangles" | trigonometry | Acronym → topic |
| "the bit where you complete the square" | completing the square | Filter noise |

**Optimisation path**: Query expansion to translate colloquial → formal.
`min_should_match` helps filter "that", "stuff", "the bit where".

#### Category 6: Intent-Based (Exploratory Priority)

**Current approach**: ELSER semantic + hope
**Limitation**: No explicit topic signal

| Query | Intent | Challenge |
|-------|--------|-----------|
| "challenging extension work for able mathematicians" | Difficulty: hard | No topic filter |
| "visual introduction to vectors for beginners" | Difficulty: easy, Style: visual | Qualifiers only |

**Optimisation path**: NL→DSL transformation to extract:
- Difficulty level → filter on lesson metadata (if indexed)
- Audience level → filter on year/key_stage
- Style → boost specific fields (pupil_lesson_outcome)

### Semantic Boundary Analysis

At some point, pure semantic search cannot satisfy queries that require:
1. **Metadata filtering**: "KS4 only" → needs explicit filter
2. **Aggregation**: "most popular" → needs sort/agg
3. **Comparison**: "easier than this lesson" → needs multi-document reasoning

For these cases, **NL→DSL pipeline** is the appropriate solution, routing
the query through LLM translation before search.

---

*Last updated: 2025-12-18*
