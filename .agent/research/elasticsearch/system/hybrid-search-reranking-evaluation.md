# Hybrid Search and Reranking Evaluation — Revised Analysis

**Date**: 2025-12-11  
**Status**: Updated Review  
**High‑Level Summary**:  
This evaluation provides strong evidence that **BM25 + ELSER (two‑way hybrid)** performs best on the current dataset. However, a broader view reveals that **search‑layer tuning is no longer the bottleneck**. Further improvements will only come from **better upstream data design**, not by adding more retrievers or rerankers. This report reframes the results through that lens.

---

# Abstract

While experiments show that _two‑way hybrid search_ (BM25 + ELSER) outperforms more complex configurations, this does **not** mean the system has reached its ceiling. Instead, it suggests that:

- **Current search infrastructure is already close to optimal for the existing data**, and
- **Meaningful future gains depend on improving the structure, summarisation, and content quality of upstream lesson metadata and text**, not on further manipulation of search configuration.

In short: **the search stack is not the limiting factor — the data architecture is.**

---

# Executive Summary

Search configurations were evaluated across 314 KS4 Maths lessons and 40 ground‑truth queries. The consistent finding:

👉 **Two‑way hybrid (BM25 + ELSER) delivers the best combination of quality, latency, and simplicity.**

More complex setups either offered no benefit or degraded results.

| Configuration                          | MRR       | NDCG@10   | Latency   | Verdict                          |
| -------------------------------------- | --------- | --------- | --------- | -------------------------------- |
| **2‑way hybrid (BM25 + ELSER)**        | **0.900** | **0.716** | **153ms** | ⭐ Best overall                  |
| 3‑way hybrid (BM25 + ELSER + E5 dense) | 0.892     | 0.715     | 180ms     | Adds complexity, no benefit      |
| 2‑way + rerank                         | 0.893     | 0.683     | 1546ms    | Large quality drop + 10× latency |
| 3‑way + rerank                         | 0.888     | 0.681     | 808ms     | Worst quality                    |

Yet these results must be contextualised: the dominant finding is not that “search is solved”, but that **search configuration changes are no longer the route to improvement**.

---

# Reframing the Results: What They Really Mean

The experiments show that:

- BM25 and ELSER already capture the essential retrieval signals for this dataset.
- RRF fusion is robust and not particularly sensitive to tuning.
- Adding another semantic retriever (dense vectors) does not introduce new useful signal.
- The reranker fails not because reranking is inherently ineffective, but because **it is given the wrong kind of text** to work with.

This suggests a deeper insight:

> **The lesson transcript is a poor retrieval primitive.  
> The search layer is being asked to compensate for upstream data that was never designed for modern semantic search architectures.**

This also explains why ELSER works well — it ignores large parts of the transcript and extracts sparse conceptual signals — while reranking fails — it reads too literally and too deeply.

The key conclusion is not "reranking doesn’t help" but:

> **Reranking cannot help until we provide a purpose‑built summarised representation of lessons.**

---

# Experiment 1: Three‑Way Hybrid (Adding E5 Dense Vectors)

**Hypothesis**: Dense vectors might add semantic diversity.  
**Outcome**: No improvement; slight degradation; +27 ms latency.

Findings remain valid:

- ELSER already captures nearly all semantic value in this domain.
- E5‑small lacks the domain richness to add new meaning.
- RRF weights are diluted by introducing a weaker retriever.

**Questioning assumptions:**

- We assumed dense vectors should “add semantic understanding”.
- But semantic overlap ≠ semantic complementarity.
- If two semantic retrievers use similar underlying representations (as E5‑small and ELSER do in this context), RRF fusion becomes _noisier_, not richer.

---

# Experiment 2: RRF Parameter Tuning

Minor changes yielded <1% variance.

This reinforces that RRF already performs well _given the input retrievers_.  
It does **not** imply RRF is globally insensitive; rather:

> **RRF is robust when the underlying retrievers already have strong signal.**

---

# Experiment 3: Reranking with `.rerank-v1-elasticsearch`

Reranking produced _significant latency increases_ and _degraded ranking quality_.

But the important insight is not simply “reranking is bad” — it is:

> **The reranker was given text fundamentally unsuitable for reranking.**

### Why full transcripts failed:

- Transcript length (~5000 tokens) exceeds transformer limits.
- Cross‑encoders have O(n²) cost; resulting in 22× longer latency.
- Truncation removes the “informative” part of transcripts.
- Transcript openings contain generic pedagogical boilerplate → poor discriminators.

### Why titles also failed:

- Title fields are far too short (5–10 words).
- Rerankers require ~150–300 tokens of high‑signal text to perform meaningfully.

### Deeper understanding:

The reranker isn't the issue — **our data is**.  
It requires a mid‑length, information‑dense field (100–200 words) that does not yet exist.

---

# Experiment 4: Cold Start Misdiagnosis

The initial 22s latency looked like a cold start issue.  
It turned out text length was the real cause.

**Takeaway:**  
Before debugging ML infrastructure, always inspect the text being fed into the model.

---

# Insight: We Have Hit the Limit of Search‑Layer Optimisation

The experiments collectively show:

- Our retrievers are strong.
- Fusion is robust.
- Rerankers fail because they are fed the wrong text.
- Dense vectors do not help because their semantic space overlaps with ELSER.

Thus:

> **Further ranking improvements will not come from search engines, algorithms, or models.  
> They will come from better upstream data structures.**

This is the critical realisation.

---

# Potential Improvements (The Real Path Forward)

## 1. Introduce a High‑Information‑Density Summary Field

The reranker needs a ~200‑token summary containing:

- Lesson purpose
- Key concepts
- Procedural knowledge
- Representations used
- Assumptions / prerequisites
- Misconceptions addressed

This field should be generated by an LLM using structured lesson metadata:

- title
- learning objectives
- keywords
- transcript excerpts (curated, not full text)

This would:

- Improve semantic retrieval quality
- Enable effective cross‑encoder reranking
- Reduce noise and duplication
- Reduce O(n²) inference costs
- Support future LLM‑powered lesson discovery features

## 2. Redesign Metadata Taxonomy

Useful improvements include:

- normalised “search keywords” separate from pedagogical tags
- consistently structured learning outcomes
- domain‑specific phrasing aligned with how teachers search
- eliminating boilerplate text from transcripts

## 3. Introduce a “search snippet” field (shorter than summary)

A ~40–60 token high‑precision snippet optimised for BM25 weighting.

## 4. Chunking for semantic fields

Break long transcripts into cohesive ~250‑token segments for:

- improved ELSER recall
- future LLM QA retrieval
- stronger semantic matching for multi‑hop queries

## 5. Rethink search as a _representation problem_, not a retrieval problem

Right now, lessons are represented by:

- a title
- long, low‑signal transcript
- semi‑structured metadata

An optimised system would have:

- consistent structured metadata
- multi‑granular summaries
- chunk‑level semantic embeddings
- rerank‑targeted mid‑length text

**Search can only be as good as the text you give it.**

---

# Updated Final Recommendation

Keeping things as they are:

- **2‑way hybrid (BM25 + ELSER)** remains production‑optimal.
- **No reranking** until we introduce a suitable summary field.
- **No dense vectors**; the signal adds noise, not value.

But the deeper recommendation:

> **Invest in upstream data quality, structure, and summarisation.  
> Search is no longer the bottleneck.**

---

# Appendix: Production Configuration (Unchanged)

```typescript
const retriever = {
  rrf: {
    retrievers: [
      {
        standard: {
          query: {
            multi_match: {
              query: searchText,
              type: 'best_fields',
              fuzziness: 'AUTO',
              fields: [
                'lesson_title^2',
                'transcript_text',
                'lesson_keywords^1.5',
                'key_learning_points',
              ],
            },
          },
        },
      },
      {
        standard: {
          query: {
            semantic: { field: 'lesson_semantic', query: searchText },
          },
        },
      },
    ],
    rank_window_size: 60,
    rank_constant: 60,
  },
};
```

---

# Final Takeaway

This evaluation does **not** show that we’ve hit the limits of Elasticsearch.

It shows we’ve hit the limits of **our current lesson representations**.

To move from “very good” to “excellent”, the next breakthrough will come from:

- better designed fields,
- high‑signal summaries,
- structured metadata, and
- smaller, semantically rich text units.

Search configuration has done its job.  
Now the data model must evolve.

---
