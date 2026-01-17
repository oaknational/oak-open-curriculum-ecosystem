# Ground Truth Review Checklist

**Status**: In Progress  
**Progress**: 6/30 subject-phases complete (24/120 ground truths)  
**Next**: cooking-nutrition/secondary (4 queries)

**Previous work**: [Sessions 1-5 Log](../logs/sessions-1-5-log.md)

---

## CRITICAL: Required Standard

**Use ALL relevant MCP tools AND bulk data** for every ground truth review.

### Required Tools (Per Category)

| Tool | Purpose | Required |
|------|---------|----------|
| **Bulk data** (`jq`) | Find ALL candidate lessons | ✓ Always |
| **`get-lessons-summary`** | Keywords, key learning points | ✓ For 5-10 candidates |
| **`get-units-summary`** | Lesson ordering in unit | ✓ For skill-level queries (beginner/intro/advanced) |
| **`get-key-stages-subject-units`** | Unit structure | When exploring curriculum |
| **`gt-review`** | Actual search results | ✓ Always |

### The Process (Per Category)

1. **SEARCH bulk data** — `jq` with multiple terms to find ALL potentially relevant lessons
2. **GET MCP summaries** — `get-lessons-summary` for 5-10 candidates
3. **GET unit context** — `get-units-summary` when query involves skill level
4. **RUN gt-review** — See search results and MRR
5. **CREATE comparison table** — Key learning points + relevance assessment
6. **SELECT THE BEST** — Objectively best semantic matches

### Anti-pattern (DO NOT DO THIS)

- Looking at existing slugs → checking they appear → "looks good"
- Using only `get-lessons-summary` without `get-units-summary` for skill-level queries
- Accepting end-of-unit lessons as "beginner" content without checking lesson order

---

## Session Entry

**Before starting each session:**

1. **Read the entry prompt first** — [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) has essential context, required standards, and key learnings
2. **Verify prerequisites** — MCP server, ES access, bulk data
3. **Find your target subject-phase below** — Work through all 4 categories
4. **Use the plan template** — [ground-truth-session-template.md](../templates/ground-truth-session-template.md) when creating Cursor plans

**If any tool is unavailable: STOP and wait. Do not guess.**

---

## Search Architecture (ESSENTIAL CONTEXT)

### Two Information Sources Per Lesson

| Source | ES Field | Description | Coverage |
|--------|----------|-------------|----------|
| **Structure** | `lesson_structure` | Curated semantic summary (title, unit, keywords, key learning points) | ALL lessons (100%) |
| **Content** | `lesson_content` | Full video transcript + pedagogical fields | SOME lessons (~81%) |

### Four Retrievers

| Retriever | ES Field | Technology | What It Does |
|-----------|----------|------------|--------------|
| **Structure BM25** | `lesson_structure`, `lesson_title` | Keyword matching | Fuzzy text search on curated summary |
| **Structure ELSER** | `lesson_structure_semantic` | Semantic embedding | Understands meaning of summary |
| **Content BM25** | `lesson_content`, `lesson_keywords`, etc. | Keyword matching | Fuzzy text search on transcript |
| **Content ELSER** | `lesson_content_semantic` | Semantic embedding | Understands meaning of transcript |

### How They Combine (RRF)

- **With content**: All 4 retrievers combined via RRF (~81% of lessons)
- **Without content**: Structure only — 2 retrievers (~19% of lessons)

**Critical**: Structure is the **foundation** — ALL lessons have it. Content is a **bonus** where transcripts exist. MFL and PE have very low content coverage (~0-28%).

---

## Instructions

For each ground truth, use **three exploration methods**:

### Step 1: Evaluate Query Design

1. **Differentiation** — Ask: "What does matching specific results for this query tell us, given we're already filtering to [subject] + [phase]?"
2. **Retriever coverage** — Will this query work for Structure-only lessons (no transcript)? Structure retrieval is the foundation.
3. **Fix bad queries** — Replace queries that lack differentiation power

### Step 2: Run gt-review (Search Service)

```bash
pnpm gt-review --subject X --phase Y --category Z
```

This calls the search service directly and shows:

- Top 10 results from our hybrid search
- Which expected slugs were found and at what position
- MRR score

### Step 3: Direct ES Diagnostics

Query Elasticsearch directly to understand retriever behaviour:

```bash
source .env.local

# Test BM25 with fuzziness (for imprecise-input)
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {"bool": {
      "must": [{"match": {"lesson_title": {"query": "YOUR_TERM", "fuzziness": "AUTO"}}}],
      "filter": [{"term": {"subject_slug": "SUBJECT"}}]
    }},
    "size": 5,
    "_source": ["lesson_slug", "lesson_title"]
  }' | jq '.hits.hits[]._source'

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
    "_source": ["lesson_slug", "lesson_title", "lesson_structure"]
  }' | jq '.hits.hits[]._source'
```

### Step 4: MCP Curriculum Exploration (CRITICAL)

**Do not just accept top-ranked results.** Use Oak MCP server (`oak-local`) to find qualitatively better matches.

**Required MCP tools:**

```text
# REQUIRED for EVERY category — get individual lesson details
get-lessons-summary: lesson="lesson-slug"
  → Returns: keywords, key learning points, misconceptions, pupil outcome
  → Use for: 5-10 candidates per category

# REQUIRED for skill-level queries (beginner/intro/advanced) — understand lesson ordering
get-units-summary: unit="unit-slug"
  → Returns: lesson order (1-6), unit description, prior knowledge requirements
  → Use for: Understanding which lessons are FIRST (beginner) vs END (capstone)

# For curriculum structure exploration
get-key-stages-subject-units: keyStage="ks3", subject="subject-slug"
  → Returns: all units in key stage with their slugs
```

**Goal**: Find the lessons that SHOULD rank highly for this query, not just what currently does. If better matches exist, the ground truth must be corrected.

### Step 5: Bulk Data Exploration

Explore the downloaded bulk data to find lessons by title/content:

```bash
# Find lessons with keyword in title
jq -r '.lessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | "\(.lessonSlug) | \(.lessonTitle)"' \
  bulk-downloads/SUBJECT-PHASE.json

# Get lesson details
jq '.lessons[] | select(.lessonSlug == "SLUG")' \
  bulk-downloads/SUBJECT-PHASE.json
```

### Step 6: Update Ground Truth File

Based on evidence from steps 2-5:

- Update query if needed
- Update `expectedRelevance` with **qualitatively best matches** from exploration
- Update description to reflect what the test proves
- Update TSDoc comment with review date

### After All 4 Categories Complete

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject X --phase Y --verbose
```

**If MCP server is unavailable**: STOP and wait for user to fix. Do not proceed without exploration capability.

---

## Progress

### 1. art/primary **← REVIEWED 2026-01-14**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000, both expected slugs found. "Year 1" is realistic teacher input.
- [x] natural-expression — MRR 1.000. **FIXED**: Replaced `profile-portraits-in-art` (about identifying) with `analyse-a-facial-expression-through-drawing` (about drawing). Both now at #1 and #2.
- [x] imprecise-input — MRR 0.500, typo doesn't break search. Both expected slugs found (#2, #8). **System is resilient.**
- [x] cross-topic — MRR 1.000, perfect ordering. Rainforest + colour + texture intersection works.

**Changes**: natural-expression score=2 slug corrected.

File: `src/lib/search-quality/ground-truth/art/primary/`

---

### 2. art/secondary **← REVIEWED 2026-01-15**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000. **FIXED**: `abstract-art-dry-materials-in-response-to-stimuli` changed from score=3 to score=2 (lesson is about dry materials like pencils, not painting).
- [x] natural-expression — MRR 1.000. Score=3 slug has "feelings" as keyword, directly about art conveying emotions.
- [x] imprecise-input — MRR 0.500. System resilient to typo "beginers". Both expected slugs found (#2, #4).
- [x] cross-topic — MRR 1.000. Score=3 slug combines portraits + colour + expression explicitly.

**Changes**: precise-topic score correction for dry-materials slug (3→2).

File: `src/lib/search-quality/ground-truth/art/secondary/`

---

### 3. citizenship/secondary **← REVIEWED 2026-01-15**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000, all 3 expected slugs found. UK democracy/elections/voting terms well-differentiated.
- [x] natural-expression — MRR 1.000, all 3 expected slugs found. "being fair" bridges correctly to fairness/equality.
- [x] imprecise-input — MRR 1.000. **FIXED**: Replaced `should-parliamentary-procedures-be-modernised` (about procedures/traditions) with `what-is-the-difference-between-the-government-and-parliament` (about roles). Expected slugs must match query semantics.
- [x] cross-topic — MRR 1.000, all 3 expected slugs found. Democracy + laws intersection has good differentiation.

**Changes**: imprecise-input score=2 slug corrected (procedures→roles).

File: `src/lib/search-quality/ground-truth/citizenship/secondary/`

---

### 4. computing/primary **← REVIEWED 2026-01-15**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000. Systematically compared all 6 lessons in Digital painting unit. Added `choosing-the-right-digital-painting-tool` as 4th expected slug.
- [x] natural-expression — MRR 0.167. **FIXED**: Replaced `making-choices-when-using-information-technology` (about choices, not safety) with `benefits-of-information-technology` (mentions "safer" in key learning).
- [x] imprecise-input — MRR 0.333. **FIXED**: Swapped scores - `connecting-networks` (score=3) explains what internet IS; `the-internet-and-world-wide-web` (score=2) is about WWW services.
- [x] cross-topic — MRR 1.000. Systematically compared all 12 sequence-related lessons. Swapped scores - `programming-sequences` (score=3) is foundational; added 2 more score=2 slugs.

**Changes**: All 4 categories updated after systematic bulk data exploration. Multiple score corrections and slug additions.

File: `src/lib/search-quality/ground-truth/computing/primary/`

---

### 5. computing/secondary **← REVIEWED 2026-01-15**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 1.000. All 3 expected slugs from "Python programming with sequences of data" unit are optimal.
- [x] natural-expression — MRR 0.500, R@10 0.333. **CORRECTED**: Using TRUE beginner lessons (Lessons 1-3 in unit: `writing-a-text-based-program`, `working-with-numerical-inputs`, `using-selection`) instead of end-of-unit capstone lessons (5-6). Only 1/3 expected slugs found in top 10 — this correctly exposes that search doesn't optimally rank true beginner content.
- [x] imprecise-input — MRR 1.000. Clarified: `sql-searches` IS querying (SELECT). `sql-fundamentals` is foundational SQL (INSERT/UPDATE/DELETE) — score=2 as related foundation, not direct match.
- [x] cross-topic — MRR 1.000. Expected slugs are the ONLY two lessons combining loops + data structures.

**Changes**: natural-expression — selected TRUE beginner lessons (first 3 in unit) based on MCP unit summary showing lesson order. Previous selection (Lessons 5-6) were end-of-unit capstone content, not beginner lessons.

File: `src/lib/search-quality/ground-truth/computing/secondary/`

---

### 6. cooking-nutrition/primary **← REVIEWED 2026-01-16**

[↑ Instructions](#instructions)

- [x] precise-topic — MRR 0.500, NDCG 0.419, P@3 0.333, R@10 0.800. Updated: Added `introducing-the-eatwell-guide` (score=3), upgraded `sources-of-energy-and-nutrients` (3), downgraded `healthy-meals` (2). Now 5 expected slugs covering foundational nutrition and healthy eating. **Insight**: High R@10 but low NDCG indicates results ARE found but poorly ranked.
- [x] natural-expression — MRR 0.250, NDCG 0.385, P@3 0.000, R@10 0.667. Updated: `making-a-healthy-wrap-for-lunch` (score=3) is the ONLY lesson combining cooking + healthy + lunch. Added `making-an-international-salad` (2) which explicitly mentions "healthy meals" in key learning, and `healthy-meals` (2) for meal planning. **Insight**: P@3=0.000 means none of top 3 are relevant — search prioritises theory over practical cooking.
- [x] imprecise-input — MRR 0.500, NDCG 0.516, P@3 0.667, R@10 0.800. Updated: Added `sources-of-energy-and-nutrients`, `food-labels-for-health` (score=3), `health-and-wellbeing` (score=2). Typo "nutrision" poorly handled by fuzzy matching but ELSER semantics provide resilience.
- [x] cross-topic — MRR 1.000, NDCG 0.957, P@3 0.667, R@10 1.000. Perfect match. Updated: Upgraded `why-we-need-energy-and-nutrients` to score=3, added `making-curry-in-a-hurry` (score=2).

**Aggregate**: MRR 0.563 | NDCG 0.569 | P@3 0.417 | R@10 0.817

**Key Learnings**:

1. Search ranks "community" and "wellbeing" lessons higher than nutrition-focused lessons for healthy eating queries
2. For "learning to cook" queries, distinguish practical cooking lessons from theory — practical lessons should be preferred
3. Review ALL lessons in pool (not just title searches) — `making-an-international-salad` mentions "healthy meals" in key learning, not visible in title
4. Low MRR with high R@10 indicates correct lessons ARE found, just not ranked optimally — valuable search quality insight

File: `src/lib/search-quality/ground-truth/cooking-nutrition/primary/`

---

### 7. cooking-nutrition/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/cooking-nutrition/secondary/`

---

### 8. design-technology/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/design-technology/primary/`

---

### 9. design-technology/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/design-technology/secondary/`

---

### 10. english/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/english/primary/`

---

### 11. english/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/english/secondary/`

---

### 12. french/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/french/primary/`

---

### 13. french/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/french/secondary/`

---

### 14. geography/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/geography/primary/`

---

### 15. geography/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/geography/secondary/`

---

### 16. german/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/german/secondary/`

---

### 17. history/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/history/primary/`

---

### 18. history/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/history/secondary/`

---

### 19. maths/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/maths/primary/`

---

### 20. maths/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/maths/secondary/`

---

### 21. music/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/music/primary/`

---

### 22. music/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/music/secondary/`

---

### 23. physical-education/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/physical-education/primary/`

---

### 24. physical-education/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/physical-education/secondary/`

---

### 25. religious-education/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/religious-education/primary/`

---

### 26. religious-education/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/religious-education/secondary/`

---

### 27. science/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/science/primary/`

---

### 28. science/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/science/secondary/`

---

### 29. spanish/primary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/spanish/primary/`

---

### 30. spanish/secondary

[↑ Instructions](#instructions)

- [ ] precise-topic
- [ ] natural-expression
- [ ] imprecise-input
- [ ] cross-topic

File: `src/lib/search-quality/ground-truth/spanish/secondary/`

---

## Category Definitions

| Category | User Scenario | What It Tests | How ES Handles It |
|----------|---------------|---------------|-------------------|
| `precise-topic` | Teacher knows curriculum terminology | Basic retrieval with exact terms | Structure BM25 (keyword match on curated summary) |
| `natural-expression` | Teacher uses everyday language | Vocabulary bridging (requires LLM - will fail) | Both ELSER retrievers (semantic understanding) |
| `imprecise-input` | Teacher types imperfectly (typos, truncation, wrong order) | **Search resilience** — relevant results despite messy input | BM25 fuzziness + ELSER semantics + RRF combination |
| `cross-topic` | Teacher wants intersection content | Multi-concept matching | All 4 retrievers via RRF |

**Key insight for imprecise-input**: We are proving that imprecise input **doesn't break search**, not isolating a single mechanism. Real users make typos, truncate words, and type messily — the combined system (BM25 fuzziness + ELSER semantic understanding + RRF fusion) should be resilient to this.

**Note**: All categories should work with Structure-only retrieval (the foundation). Content retrieval is a bonus that may improve rankings where transcripts exist.

---

## Commands Reference

```bash
# Review specific category
pnpm gt-review --subject french --phase primary --category precise-topic

# Review all categories for a subject-phase
pnpm gt-review --subject french --phase primary

# Validate after updates
pnpm type-check
pnpm ground-truth:validate

# Benchmark after validation
pnpm benchmark --subject french --phase primary --verbose
```

---

## Metrics Interpretation

The benchmark outputs 4 key metrics. Each reveals different information:

| Metric | Question Answered | Interpretation |
|--------|-------------------|----------------|
| **MRR** | How quickly is FIRST relevant result found? | 1.0 = position 1, 0.5 = position 2, 0.33 = position 3. Low MRR = users must scroll. |
| **NDCG** | How good is the OVERALL ranking? | Uses graded relevance (1/2/3). 1.0 = perfect ranking. High R@10 + low NDCG = results found but poorly ranked. |
| **P@3** | Are the TOP 3 results relevant? | 0.67 = 2/3 relevant. P@3=0 means none of top 3 are useful — poor user experience. |
| **R@10** | Do we FIND the relevant results at all? | 0.8 = 80% of expected slugs appear in top 10. High R@10 = good coverage. |

**Key diagnostic patterns:**

- **High R@10, Low MRR, Low NDCG**: Results ARE found, just ranked poorly → search ranking issue
- **Low R@10**: Missing results entirely → ground truth may use wrong slugs OR search coverage issue
- **P@3 = 0**: Terrible user experience — top results all wrong even if lower results are good

See [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md) for detailed definitions.

---

## Notes

- **Required standard**: Use ALL relevant MCP tools (`get-lessons-summary`, `get-units-summary`) AND bulk data for every category.
- **Structure is the foundation**: All lessons have the `lesson_structure` field (curated summary). Ground truths should primarily test Structure retrieval.
- **Content is a bonus**: ~81% of lessons have the `lesson_content` field (transcript). MFL and PE have very low coverage (~0-28%).
- **natural-expression category**: Requires LLM interpretation we don't support yet. Review anyway to ensure the query and expected results are sensible for when we do add LLM support. **CRITICAL**: Use `get-units-summary` to verify lesson ordering for beginner/skill-level queries.
- Update the progress counter at the top after completing each subject-phase.

---

## Important Distinction: Specification vs Optimisation

**Ground truth review** (this task) is about **specification correctness** — ensuring ground truths accurately represent what search SHOULD return. This is fixing the answer key.

**Search optimisation** (separate, later task) is about improving system behaviour to achieve better scores against the correct specification. That is tuning the system.

We do not conflate these. Ground truths must be correct before metrics are meaningful. If better matches exist than current expected slugs, the ground truth is wrong and must be corrected — regardless of the impact on MRR scores.

---

## Reference

- **Full guide**: [GROUND-TRUTH-GUIDE.md](../../../apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) — Design principles, troubleshooting, lessons learned
- **Sessions 1-5 Log**: [sessions-1-5-log.md](../logs/sessions-1-5-log.md) — Previous work before enhanced understanding
