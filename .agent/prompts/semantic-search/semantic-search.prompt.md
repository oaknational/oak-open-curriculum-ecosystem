# Semantic Search — Session Entry Point

**Last Updated**: 2026-01-17  
**Status**: **Ground Truth Review — In Progress (9/30 complete)**

---

## How to Use This Document

1. **Read this prompt first** — It provides essential context, required standards, and key learnings
2. **Then go to the checklist** — [ground-truth-review-checklist.md](../../plans/semantic-search/active/ground-truth-review-checklist.md) has progress tracking and your target subject-phase
3. **Use the plan template** — [ground-truth-session-template.md](../../plans/semantic-search/templates/ground-truth-session-template.md) when creating Cursor plans

---

## Search Architecture

### Two Information Sources Per Lesson

| Source | ES Field | Description | Coverage |
|--------|----------|-------------|----------|
| **Structure** | `lesson_structure` | Curated semantic summary (title, unit, keywords, key learning points) | ALL lessons (100%) |
| **Content** | `lesson_content` | Full video transcript + pedagogical fields | SOME lessons (~81%) |

### Four Retrievers (Combined via RRF)

| Retriever | ES Field | Technology | What It Does |
|-----------|----------|------------|--------------|
| **Structure BM25** | `lesson_structure`, `lesson_title` | Keyword matching | Fuzzy text search on curated summary |
| **Structure ELSER** | `lesson_structure_semantic` | Semantic embedding | Understands meaning of curated summary |
| **Content BM25** | `lesson_content`, `lesson_keywords`, etc. | Keyword matching | Fuzzy text search on transcript |
| **Content ELSER** | `lesson_content_semantic` | Semantic embedding | Understands meaning of transcript |

### How They Combine

| Lesson Type | Retrievers Used | Coverage |
|-------------|-----------------|----------|
| **With content** | All 4 retrievers combined via RRF | ~81% of lessons |
| **Without content** | Structure only (2 retrievers) | ~19% of lessons |

**Critical**: Structure is the **foundation** — ALL lessons have it. Content is a **bonus** where transcripts exist.

**Implication for Ground Truth Design**: Ground truths should primarily test Structure retrieval (which works for all lessons). Content-dependent queries will only work for ~81% of lessons.

---

## Current Task: Ground Truth Comprehensive Review

**Progress**: 9/30 subject-phases complete (36/120 ground truths)

**Previous work**: [Sessions 1-5 Log](../../plans/semantic-search/logs/sessions-1-5-log.md) | Session 6: cooking-nutrition/primary | Session 7: Post-synonym re-review | Session 8: design-technology (primary + secondary)

---

### ✅ Prerequisites Complete

| Prerequisite | Status | Date |
|--------------|--------|------|
| Synonym Coverage (ADR-100) | ✅ Complete | 2026-01-17 |
| Post-synonym re-review | ✅ Complete | 2026-01-17 |

**Synonyms**: All 17 subjects have domain-specific synonym files (~580 total).

**Re-review completed (2026-01-17)**:

- art/primary — verified correct
- art/secondary — verified correct
- citizenship/secondary — verified correct
- cooking-nutrition/primary — verified correct (low MRR reveals search quality gaps)
- cooking-nutrition/secondary — **cross-topic corrected** (was nutrition-theory, now cooking+nutrition)

See: [ADR-100](../../../docs/architecture/architectural-decisions/100-complete-subject-synonym-coverage.md) | [synonym-complete-coverage.md](../../plans/semantic-search/active/synonym-complete-coverage.md)

---

### Next Session: english (primary + secondary)

**Scope**: 2 subject-phases, 8 ground truths total

| Subject-Phase | Lessons | Synonyms |
|---------------|---------|----------|
| english/primary | ~2000+ | english.ts |
| english/secondary | ~1500+ | english.ts |

```bash
cd apps/oak-open-curriculum-semantic-search

# List all lessons first
jq -r '.lessons[] | "\(.lessonSlug) | \(.lessonTitle)"' bulk-downloads/english-primary.json | wc -l
jq -r '.lessons[] | "\(.lessonSlug) | \(.lessonTitle)"' bulk-downloads/english-secondary.json | wc -l

# Review english (both phases)
pnpm gt-review --subject english --phase primary
pnpm gt-review --subject english --phase secondary

# Benchmark after review
pnpm benchmark --subject english --verbose
```

**Ground truth files**:

- `src/lib/search-quality/ground-truth/english/primary/`
- `src/lib/search-quality/ground-truth/english/secondary/`

---

## CRITICAL: Required Standard

**Use ALL relevant MCP tools AND bulk data** for every ground truth review.

### Required Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **Bulk data** (`jq`) | Find ALL candidate lessons | Every category — search with multiple terms |
| **`get-lessons-summary`** | Get keywords, key learning points | **5-10 candidates per category** (mandatory) |
| **`get-units-summary`** | Understand lesson ordering within unit | Skill-level queries AND unit exploration |
| **`get-key-stages-subject-units`** | See unit structure for subject | When exploring curriculum structure |
| **`gt-review`** | See actual search results | Every category |
| **Direct ES queries** | Understand retriever behaviour | When debugging unexpected results |

### The Process (Per Category) — DEEP EXPLORATION STANDARD

1. **SEARCH bulk data comprehensively** — `jq` with multiple search terms to find ALL potentially relevant lessons. List ALL lessons in relevant units.
2. **GET MCP summaries** — `get-lessons-summary` for **5-10 candidates** (not 1-2). Include existing expected slugs AND new candidates.
3. **GET unit context** — `get-units-summary` to understand lesson ordering. Critical for skill-level queries but useful for all.
4. **RUN gt-review** — See actual search results and current MRR.
5. **CREATE comparison table** — Required for every category:

   ```
   | Slug | Keywords | Key Learning | Relevance Score | Notes |
   |------|----------|--------------|-----------------|-------|
   ```

6. **ASK "Am I confident?"** — Before finalising, explicitly ask: "Have I discovered the BEST possible matches through deep exploration, or just assessed if current matches are good enough?"
7. **SELECT THE BEST** — Choose slugs that are objectively the best semantic matches based on evidence.

### Anti-Patterns (DO NOT DO THIS)

- Looking at existing expected slugs → checking they appear → "looks good" ❌
- Getting only 1-2 MCP summaries instead of 5-10 ❌
- Skipping comparison table creation ❌
- Using only `get-lessons-summary` without exploring unit structure ❌
- Accepting "good enough" without asking "is this the BEST?" ❌
- Missing lessons with non-obvious titles (key learning reveals relevance) ❌

### Session Prerequisites (CHECK FIRST)

Before starting any session:

1. **MCP server available** — `oak-local` must be running. If unavailable, **STOP and wait**.
2. **ES access working** — `source .env.local` then test curl. If failing, **STOP and wait**.
3. **Bulk data present** — Check `bulk-downloads/` has JSON files for target subject.

**Do not proceed without all exploration methods available.**

**Guide**: [GROUND-TRUTH-GUIDE.md](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) — Design principles, troubleshooting, lessons learned

---

## Key Learnings (Sessions 1-8)

### Foundational Principles

1. **Query differentiation**: Ask "What does this query tell us given we're already filtering to [subject] + [phase]?"
2. **Imprecise-input tests resilience**: We prove that typos and messy input don't break search — the system should still return relevant results despite input errors (enabled by BM25 fuzziness + ELSER semantics + RRF combination)
3. **Ground truth correctness over benchmark scores**: If the semantically correct slugs don't rank well, the ground truth should still use them. A lower MRR reveals search quality issues — that's valuable information, not a problem to hide.
4. **Specification vs optimisation**: Ground truth review is about correctness (the answer key), not optimising scores (tuning the system).

### Exploration Standards (Session 8: Deep Review)

5. **Deep exploration is mandatory**: Get 5-10 MCP summaries per category, not just 1-2. Create explicit comparison tables with key learning points before selecting slugs.
6. **Unit-level exploration**: List ALL lessons in relevant units (not just keyword-filtered results). Lessons with non-obvious titles may be highly relevant — their key learning points reveal this.
7. **Comparison tables are required**: For every category, create a table comparing candidates: Slug | Keywords | Key Learning | Relevance Score. This prevents "good enough" thinking.
8. **Ask "Am I confident?"**: Before finalising each category, explicitly ask: "Have I discovered the BEST possible matches through deep exploration, or just assessed if current matches are good enough?"

### Semantic Matching

9. **Expected slugs must match query semantics**: Replace slugs that don't actually cover the query topic. "Coding for beginners" should return KS3 intro lessons, not KS4 advanced topics.
10. **Natural-expression matches informal language**: "DT making things move" should match lessons with "mechanisms are systems that make something move" in key learning — match the informal phrasing, not technical terms.
11. **Verify vocabulary bridging**: For sustainability queries like "green design environment friendly", expected slugs should explicitly use bridging vocabulary (e.g., "sustainable", "environmental impact") in their keywords/key learning.
12. **Human factors includes empathy**: In design context, "empathy" (understanding what users experience) IS human factors — don't miss lessons with related vocabulary.

### Cross-Topic Verification

13. **Cross-topic requires BOTH components**: For "X AND Y together" queries, expected slugs must combine BOTH concepts in their key learning points. Verify this explicitly, don't assume from title.
14. **Rendering can be valid intersection**: For sketching + materials queries, lessons about rendering that explicitly teach "show material texture through rendering" ARE valid intersections — they combine both concepts.
15. **Some queries have no perfect intersection**: If no single lesson truly combines all query concepts, document this and select best available approximations from different angles.

### MCP Tool Usage

16. **Use `get-lessons-summary` for 5-10 candidates**: Every category needs comprehensive MCP exploration, not just search result validation.
17. **Use `get-units-summary` for lesson ordering**: For skill-level queries, identify which lessons are FIRST (beginner) vs END of unit (capstone).
18. **Use unit listings to find hidden candidates**: List all lessons in a unit — lessons 3-4 may be more relevant than lessons 1-2 for specific queries.

### Practical Considerations

19. **Distinguish practical vs theory lessons**: For queries like "learning to cook X", practical hands-on lessons should be preferred over theory lessons — the query verb indicates intent.
20. **Review ALL lessons in the pool**: Don't rely solely on title-based searches. MCP key learning points may reveal relevance not visible in titles.

---

## Review Process (Per Ground Truth)

Use **three exploration methods** for each ground truth:

### Step 1: Evaluate Query Design

1. **Differentiation** — Ask: "What does matching specific results for this query tell us, given we're already filtering to [subject] + [phase]?"
2. **Retriever coverage** — Will this query work for Structure-only lessons (no transcript)? Structure retrieval is the foundation.

### Step 2: Run gt-review (Search Service)

```bash
pnpm gt-review --subject X --phase Y --category Z
```

This calls the search service directly and shows top 10 results with MRR.

### Step 3: Direct ES Diagnostics

Query Elasticsearch directly to understand retriever behaviour:

```bash
source .env.local

# Test Structure field (always present)
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {"bool": {
      "must": [{"match": {"lesson_structure": "YOUR_QUERY"}}],
      "filter": [{"term": {"subject_slug": "SUBJECT"}}]
    }},
    "size": 5,
    "_source": ["lesson_slug", "lesson_title"]
  }' | jq '.hits.hits[]._source'

# Test BM25 with fuzziness (for imprecise-input)
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {"bool": {
      "must": [{"match": {"lesson_title": {"query": "TYPO_TERM", "fuzziness": "AUTO"}}}],
      "filter": [{"term": {"subject_slug": "SUBJECT"}}]
    }},
    "size": 5,
    "_source": ["lesson_slug", "lesson_title"]
  }' | jq '.hits.hits[]._source'
```

### Step 4: MCP Curriculum Exploration (CRITICAL)

**Do not just accept top-ranked results.** Use Oak MCP server (`oak-local`) to find qualitatively better matches.

**Required MCP tools:**

```text
# For EVERY category — get individual lesson details
get-lessons-summary: lesson="lesson-slug"
  → Returns: keywords, key learning points, misconceptions, pupil outcome

# For skill-level queries (beginner/intro/advanced) — understand lesson ordering
get-units-summary: unit="unit-slug"
  → Returns: lesson order (1-6), unit description, prior knowledge requirements

# For curriculum structure exploration
get-key-stages-subject-units: keyStage="ks3", subject="subject-slug"
  → Returns: all units in key stage with their slugs

# For search comparisons
get-search-lessons: q="your query", subject="subject-slug"
  → Returns: MCP search results (may differ from ES hybrid search)
```

**Goal**: Find the lessons that SHOULD rank highly for this query, not just what currently does. If better matches exist, the ground truth must be corrected.

### Step 5: Bulk Data Exploration

```bash
jq -r '.lessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | "\(.lessonSlug) | \(.lessonTitle)"' \
  bulk-downloads/SUBJECT-PHASE.json
```

### Step 6: Update Ground Truth File

Based on evidence from steps 2-5, update query, expectedRelevance, and description.

### Step 7: Validate (After Each Subject-Phase)

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject X --phase Y --verbose
```

---

## Prerequisites

**If the MCP server (`oak-local`) is unavailable: STOP and wait for user to fix.**

Do not proceed without all three exploration methods available:

1. Search service (gt-review)
2. Direct ES access (curl to Elastic Cloud)
3. MCP server (oak-local)

---

## Metrics Quick Reference

The benchmark outputs 4 key metrics. Use them together for diagnosis:

| Metric | What It Tells You |
|--------|-------------------|
| **MRR** | Position of FIRST relevant result (1.0=pos 1, 0.5=pos 2) |
| **NDCG** | Overall ranking quality using graded relevance (1/2/3) |
| **P@3** | Precision in top 3 — 0.0 means none of top 3 are relevant |
| **R@10** | Coverage — are expected slugs found at all in top 10? |

**Diagnostic pattern**: High R@10 + Low NDCG/MRR = results ARE found but poorly ranked. See [IR-METRICS.md](../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md).

---

## Category Definitions

| Category | User Scenario | What It Tests | How ES Handles It |
|----------|---------------|---------------|-------------------|
| `precise-topic` | Teacher knows curriculum terminology | Basic retrieval with exact terms | Structure BM25 keyword matching |
| `natural-expression` | Teacher uses everyday language | Vocabulary bridging (requires LLM - will fail) | Both ELSER retrievers (semantic understanding) |
| `imprecise-input` | Teacher types imperfectly (typos, truncation, wrong order) | **Search resilience** — relevant results despite messy input | BM25 fuzziness + ELSER semantics + RRF combination |
| `cross-topic` | Teacher wants intersection content | Multi-concept matching | All 4 retrievers via RRF |

**Note**: natural-expression requires LLM interpretation we don't support. Review anyway for future-proofing. All categories should work with Structure-only retrieval (the foundation).

---

## Commands Reference

```bash
cd apps/oak-open-curriculum-semantic-search

# Ground truth review (design-technology example)
pnpm gt-review --subject design-technology --phase primary
pnpm gt-review --subject design-technology --phase secondary
pnpm gt-review --subject design-technology --phase primary --category precise-topic

# Validation
pnpm type-check
pnpm ground-truth:validate

# Benchmarking
pnpm benchmark --subject design-technology --verbose
pnpm benchmark --all
```

---

## Key Documents

| Document | Purpose |
|----------|---------|
| [Review Checklist](../../plans/semantic-search/active/ground-truth-review-checklist.md) | **CURRENT**: Linear execution plan |
| [Ground Truth Guide](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | **Design, review, troubleshooting** — single source of truth |
| [ADR-085](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Validation discipline and three-stage model |

---

## Workspace

| Path | Contents |
|------|----------|
| `apps/oak-open-curriculum-semantic-search/` | Search app |
| `src/lib/search-quality/ground-truth/` | Ground truth definitions |
| `evaluation/analysis/gt-review.ts` | Review CLI tool |
| `evaluation/analysis/benchmark.ts` | Benchmark runner |

---

## Foundation Documents (MANDATORY)

Before any work, read:

1. [rules.md](../../directives-and-memory/rules.md) — TDD, no type shortcuts, fail fast
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md) — TDD at ALL levels
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md) — Generator is source of truth

---

## Value & Impact

**Always ask**: "What value are we delivering, through what impact, for which users?"

| Value | Impact | Users |
|-------|--------|-------|
| Validated ground truths | Meaningful benchmarks | Developers |
| Query differentiation | Tests that reveal problems | Developers |
| Evidence-based expectations | Trust in metrics | Stakeholders |
| Qualitative matches from curriculum exploration | Benchmarks that push system improvement, not just tune to current performance | Developers, Product |

**Critical**: Exploring both top results AND curriculum data ensures ground truths represent what the system *should* return, not just what it currently returns. This creates benchmarks that drive improvement rather than just validating current behavior.

---

## Important Distinction: Specification vs Optimisation

**Ground truth review** (current task) is about **specification correctness** — ensuring ground truths accurately represent what search SHOULD return. This is fixing the answer key.

**Search optimisation** (separate, later task) is about improving system behaviour to achieve better scores against the correct specification. That is tuning the system.

We do not conflate these. Ground truths must be correct before metrics are meaningful. If better matches exist than current expected slugs, the ground truth is wrong and must be corrected.
