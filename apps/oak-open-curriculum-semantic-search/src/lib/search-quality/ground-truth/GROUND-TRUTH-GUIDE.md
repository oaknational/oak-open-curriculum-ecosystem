# Ground Truth Design Guide

**The single source of truth for designing, reviewing, and improving ground truths.**

**Last Updated**: 2026-01-14

---

## Search Architecture

### Two Information Sources Per Lesson

Each lesson document has two potential sources of searchable information:

| Source        | ES Field           | Description                                                           | Coverage            |
| ------------- | ------------------ | --------------------------------------------------------------------- | ------------------- |
| **Structure** | `lesson_structure` | Curated semantic summary (title, unit, keywords, key learning points) | ALL lessons (100%)  |
| **Content**   | `lesson_content`   | Full video transcript + pedagogical fields                            | SOME lessons (~81%) |

### Four Retrievers

The search system uses four retrievers combined via Reciprocal Rank Fusion (RRF):

| Retriever           | ES Field                                  | Technology         | What It Does                           |
| ------------------- | ----------------------------------------- | ------------------ | -------------------------------------- |
| **Structure BM25**  | `lesson_structure`, `lesson_title`        | Keyword matching   | Fuzzy text search on curated summary   |
| **Structure ELSER** | `lesson_structure_semantic`               | Semantic embedding | Understands meaning of curated summary |
| **Content BM25**    | `lesson_content`, `lesson_keywords`, etc. | Keyword matching   | Fuzzy text search on transcript        |
| **Content ELSER**   | `lesson_content_semantic`                 | Semantic embedding | Understands meaning of transcript      |

### How They Combine (RRF)

| Lesson Type         | Retrievers Used                   | Coverage        |
| ------------------- | --------------------------------- | --------------- |
| **With content**    | All 4 retrievers combined via RRF | ~81% of lessons |
| **Without content** | Structure only — 2 retrievers     | ~19% of lessons |

**Critical**: Structure is the **foundation** — all lessons have it. Content is a **bonus** where transcripts exist. MFL (French, German, Spanish) and PE subjects have very low content coverage.

### Implications for Ground Truth Design

1. **Structure-based queries** work for all lessons (100% coverage)
2. **Content-dependent queries** only work for lessons with transcripts (~81%)
3. **Low MRR in MFL/PE** may indicate content-dependency, not search failure
4. **Title matches** come from Structure BM25; semantic understanding from both ELSER retrievers

---

## What Ground Truths Measure

| What We Thought                                  | What We're Actually Measuring                     |
| ------------------------------------------------ | ------------------------------------------------- |
| "Does search help teachers find useful content?" | "Did search return the exact slugs we specified?" |

Ground truths test **expected slug position**, not user satisfaction. A query may receive low MRR while search returns useful results.

## Important Distinction: Specification vs Optimisation

**Ground truth review** is about **specification correctness** — ensuring ground truths accurately represent what search SHOULD return. This is fixing the answer key. Expected slugs must be the qualitatively best matches for each query.

**Search optimisation** (a separate, later task) is about improving system behaviour to achieve better scores against the correct specification. That is tuning the system.

We do not conflate these. Ground truths must be correct before metrics are meaningful. If better matches exist than the current expected slugs, the ground truth is wrong and must be corrected — regardless of the impact on MRR scores.

---

## Part 1: Design Principles

### The Differentiation Question

Before writing any ground truth, ask:

> "What does matching specific results for this query tell us, given we're already filtering to [subject] + [phase]?"

**Bad**: "French vocabulary primary" — tells us nothing when already filtering to French + KS1/KS2  
**Good**: "food vocabulary restaurant ordering" — tests specific topic within French

### Query Design Rules

| Rule           | Requirement                     | Example                       |
| -------------- | ------------------------------- | ----------------------------- |
| Length         | 3-7 words                       | "cell structure and function" |
| Realistic      | Would a teacher type this?      | Yes: "teach fractions year 4" |
| Specific       | 2-4 lessons highly relevant     | Not: "maths" (too broad)      |
| Differentiated | Query adds value beyond filters | Not: "art lessons secondary"  |

### Expected Results Rules

| Rule                 | Requirement            | Why                               |
| -------------------- | ---------------------- | --------------------------------- |
| Maximum 5 slugs      | More = query too broad | Tests ranking, not topic presence |
| At least one score=3 | Clear "right answer"   | Defines success                   |
| Graded relevance     | Mix of 3, 2, 1 scores  | Tests ranking quality             |
| Verified existence   | All slugs in bulk data | Prevents false negatives          |

### Category-Specific Design

#### precise-topic

Tests: Direct curriculum term matching

```typescript
// GOOD: Specific curriculum terminology
query: 'quadratic equations factorising'
expectedRelevance: {
  'factorising-quadratic-expressions': 3,
  'solving-quadratics-by-factorising': 3,
  'quadratic-graphs-and-roots': 2,
}
```

#### natural-expression

Tests: Vocabulary bridging (colloquial → technical)

```typescript
// GOOD: Everyday language that maps to curriculum terms
query: 'being fair to everyone rights'
description: 'Tests "being fair" → equality, "rights" → legal protections'
expectedRelevance: {
  'what-does-fairness-mean-in-society': 3,
  'why-do-we-need-laws-on-equality-in-the-uk': 2,
}
```

#### imprecise-input

Tests: **Search resilience to messy real-world input**

Real users don't type perfectly. Teachers searching quickly may:

- Make typos ("techneeques" instead of "techniques")
- Truncate words ("tech" instead of "techniques")
- Use wrong word order
- Make phonetic errors
- Have mobile keyboard / autocorrect issues

The **imprecise-input** category proves that **imprecise input doesn't break search**. The system should still return relevant results despite input errors.

This resilience comes from multiple Elasticsearch features working together:

- BM25 with `fuzziness: AUTO` — handles edit-distance typos
- ELSER semantic embeddings — understands meaning beyond surface form
- RRF combination — multiple signals compensate for imperfect input

```typescript
// GOOD: Query contains realistic typo, search still finds relevant results
query: 'brush painting techneeques'
description: 'Tests that misspelling "techniques" does not prevent finding painting techniques lessons'
expectedRelevance: {
  'explore-a-variety-of-painting-techniques': 3,
  'mixing-secondary-colours-autumn-oranges': 2,
}
```

**Success criterion**: Despite the imprecise input, the expected relevant lessons still appear in results.

#### cross-topic

Tests: Multi-concept intersection

```typescript
// GOOD: Query combines two distinct concepts
query: 'democracy and laws together'
description: 'Tests lessons that explicitly combine democracy + rule of law'
expectedRelevance: {
  'what-does-it-mean-to-live-in-a-democracy': 3,  // Combines both
  'what-are-rights-and-where-do-they-come-from': 3,  // Rule of law + democracy
  'what-is-the-right-to-protest-within-a-democracy-with-the-rule-of-law': 2,
}
```

---

## Part 2: Review Process

### Step 1: Run gt-review

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm gt-review --subject citizenship --phase secondary --category precise-topic
```

Output shows:

- Expected slugs with relevance scores
- Top 10 actual results
- Which expected slugs were found and at what position
- MRR score

### Step 2: Explore Curriculum Data

**CRITICAL**: Do not just accept top-ranked results.

Use the Oak MCP server (`oak-local`) to explore:

```text
# Search with query variations
get-search-lessons: q="democracy voting", subject="citizenship"

# Browse units in the subject
get-key-stages-subject-lessons: keyStage="ks3", subject="citizenship"

# Read lesson content to verify relevance
get-lessons-summary: lesson="what-is-democracy"
```

**Goal**: Find lessons that are **qualitatively better matches** for what the query should test, even if they don't currently rank highly. This ensures benchmarks push the system to improve.

### Step 3: Verify with Direct ES Queries

For imprecise-input or when investigating ranking issues:

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local

# Test typo with fuzziness
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {"bool": {
      "must": [{"match": {"lesson_title": {"query": "goverment", "fuzziness": "AUTO"}}}],
      "filter": [{"term": {"subject_slug": "citizenship"}}]
    }},
    "size": 5,
    "_source": ["lesson_slug", "lesson_title"]
  }' | jq '.hits.hits[]._source'
```

### Step 4: Update Ground Truth

Based on evidence from steps 1-3:

1. **Update query** if it lacks differentiation power
2. **Update expectedRelevance** with qualitatively best matches
3. **Update description** to explain what the test proves
4. **Update TSDoc comment** with review date

### Step 5: Validate

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject citizenship --phase secondary --verbose
```

All must pass before proceeding.

---

## Part 3: Troubleshooting

### Low MRR Despite Good Results

**Symptom**: gt-review shows useful results, but expected slugs aren't found.

**Diagnosis**: Expected slugs may not be the best matches.

**Fix**:

1. Look at what search actually returns
2. Use MCP tools to verify if returned results are qualitatively better
3. Update expectedRelevance to match reality (if returned results are genuinely better)

### Query Too Broad

**Symptom**: Many relevant results, hard to pick expected slugs.

**Diagnosis**: Query lacks specificity.

**Fix**: Add distinguishing terms:

| Too Broad   | Better                                 |
| ----------- | -------------------------------------- |
| "fractions" | "adding fractions unlike denominators" |
| "democracy" | "democracy voting elections UK"        |

### Cross-Subject Contamination

**Symptom**: Validation fails with `cross-subject` error.

**Diagnosis**: Expected slug belongs to wrong subject.

**Fix**:

```bash
# Find which subject a slug belongs to
cat bulk-downloads/*.json | jq -r '.lessons[] | select(.lessonSlug == "the-slug") | "\(.subjectSlug) | \(.lessonSlug)"'
```

---

## Part 4: Bulk Data Exploration

### Setup

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm bulk:download  # Downloads all subject-phase files
```

### Common Queries

```bash
# List lessons with keyword in title
cat bulk-downloads/citizenship-secondary.json | \
  jq -r '.lessons[] | select(.lessonTitle | test("government"; "i")) | "\(.lessonSlug) | \(.lessonTitle)"'

# Count lessons
cat bulk-downloads/citizenship-secondary.json | jq '.lessons | length'

# Find lessons by exact slug
cat bulk-downloads/citizenship-secondary.json | \
  jq '.lessons[] | select(.lessonSlug == "what-is-democracy")'

# List all slugs containing a word
cat bulk-downloads/maths-primary.json | \
  jq -r '.lessons[] | select(.lessonSlug | test("fraction"; "i")) | .lessonSlug' | head -20
```

---

## Part 5: Validation Reference

### Commands

```bash
pnpm type-check              # Stage 1: TypeScript compilation
pnpm ground-truth:validate   # Stage 2: 16 semantic checks
pnpm benchmark --verbose     # Stage 3: Measure against search
```

### Validation Checks (All Blocking)

| Check                   | Error                | Fix                            |
| ----------------------- | -------------------- | ------------------------------ |
| Slug doesn't exist      | `invalid-slug`       | Find correct slug in bulk data |
| Empty expectedRelevance | `empty-relevance`    | Add at least 2 slugs           |
| Score not 1/2/3         | `invalid-score`      | Use only 1, 2, or 3            |
| Query too short         | `short-query`        | Minimum 3 words                |
| Query too long          | `long-query`         | Maximum 10 words               |
| All same scores         | `uniform-scores`     | Vary scores (e.g., 3 and 2)    |
| No score=3              | `no-highly-relevant` | At least one slug must be 3    |
| Too many slugs          | `too-many-slugs`     | Maximum 5 (query too broad)    |
| Wrong subject           | `cross-subject`      | Slug must match entry subject  |

---

## Part 6: Lessons Learned

### From art/primary (Session 1)

- **Removed redundant filter terms**: "primary" in query is redundant when already filtering to primary phase
- **Replace generic with specific slugs**: "mark-making" → specific painting technique slug

### From art/secondary (Session 2)

- **Verify slug content matches query semantics**: A lesson in a "painting" unit may not be about painting. Example: `abstract-art-dry-materials-in-response-to-stimuli` is about pencils/pastels, not paint, despite being in the "Abstract painting" unit.
- **MCP lesson summaries reveal true content**: Always check keywords and key learning points via `get-lessons-summary` to verify a slug matches query intent.
- **Score reflects semantic fit, not unit membership**: Being in the same unit doesn't guarantee high relevance. Score=3 means direct match; score=2 means related but not directly matching all query concepts.

### From citizenship/secondary (Session 3)

- **Imprecise-input tests resilience**: The goal is to prove search works despite input errors, not to isolate one mechanism
- **Direct ES queries reveal truth**: When MRR looks good but something feels wrong, query ES directly
- **Fuzziness works when applied**: ES `fuzziness: AUTO` correctly handles typos — combined with ELSER and RRF, imprecise queries should still find relevant results
- **Expected slugs must match exact query terms**: A query for "functions and roles" should not have expected slugs about "procedures and traditions" even if both are parliament-related. Semantic precision matters.

### From computing/primary (Session 4)

- **COMPREHENSIVE exploration is mandatory**: Do not just validate existing slugs are "acceptable". Search bulk data with multiple terms to find ALL potentially relevant lessons, then systematically compare them.
- **Create comparison tables**: For topics with many candidates (e.g., 6 lessons in "Digital painting" unit, 12 lessons related to "sequences"), create a table comparing key learning points and relevance to the query.
- **Foundational lessons are score=3**: The lesson that introduces or defines the core concept should typically be score=3. Lessons about specific techniques or applications are score=2.
- **Scores should match semantic relevance, not search rank**: If search ranks slug A higher than slug B, but slug B is semantically more relevant to the query, slug B should have the higher score. Ground truths specify what SHOULD be returned, not what IS returned.

---

## Quick Reference

### File Structure

```text
src/lib/search-quality/ground-truth/
├── {subject}/
│   └── {phase}/
│       ├── precise-topic.ts
│       ├── natural-expression.ts
│       ├── imprecise-input.ts
│       ├── cross-topic.ts
│       └── index.ts
├── registry/
│   └── entries.ts
├── types.ts
└── GROUND-TRUTH-GUIDE.md  ← You are here
```

### Entry Template

```typescript
/**
 * {Category} ground truth query for {Phase} {Subject}.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: YYYY-MM-DD - [Decision rationale] */
export const {SUBJECT}_{PHASE}_{CATEGORY}: readonly GroundTruthQuery[] = [
  {
    query: 'your query here',
    category: '{category}',
    priority: 'high',  // critical | high | medium | exploratory
    description: 'What this query tests and why expected slugs were chosen',
    expectedRelevance: {
      'best-match-slug': 3,
      'good-match-slug': 2,
    },
  },
] as const;
```

### Session Workflow

1. `pnpm gt-review --subject X --phase Y` — See current state
2. Explore via MCP tools — Find qualitatively best matches
3. Update ground truth file — Based on evidence
4. `pnpm ground-truth:validate` — Check validity
5. `pnpm benchmark --subject X --phase Y --verbose` — Measure
6. Update checklist — Record findings and MRR

---

## Related Documents

| Document                                                                                                         | Purpose                                     |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [ADR-085](../../../../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Validation discipline and three-stage model |
| [Review Checklist](../../../../../../.agent/plans/semantic-search/active/ground-truth-review-checklist.md)       | Current review progress                     |
| [Session Prompt](../../../../../../.agent/prompts/semantic-search/semantic-search.prompt.md)                     | Session entry point                         |
