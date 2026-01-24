# Ground Truth Design Guide

**The single source of truth for designing, reviewing, and improving ground truths.**

**Last Updated**: 2026-01-23

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

| Rule                   | Requirement                     | Example                                     |
| ---------------------- | ------------------------------- | ------------------------------------------- |
| Length                 | 3-7 words                       | "cell structure and function"               |
| Realistic              | Would a teacher type this?      | Yes: "teach fractions year 4"               |
| Specific               | 2-4 lessons highly relevant     | Not: "maths" (too broad)                    |
| Differentiated         | Query adds value beyond filters | Not: "art lessons secondary"                |
| **Curriculum-aligned** | Terms must exist in curriculum  | Not: "spanish vocabulary" (no such concept) |

### Pre-Design Verification (MANDATORY)

Before writing any query, verify the concept exists in the curriculum with sufficient coverage:

```bash
# 1. List all units to understand curriculum structure
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle)"' bulk-downloads/{subject}-{phase}.json

# 2. Search for your query terms in lesson slugs
jq -r '.sequence[].unitLessons[].lessonSlug' bulk-downloads/{subject}-{phase}.json | grep -i "your-term"

# 3. If < 3 matches, the query lacks coverage — redesign
```

**Example**: "spanish vocabulary" returns 0 matches; "adjective agreement" returns 5 matches. Design queries around concepts that exist.

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

**Known limitation**: Fuzzy matching handles character edits within tokens, but NOT word boundary changes. For example:

- "multiplikation" → "multiplication" ✓ (fuzzy handles k→c)
- "timetables" → "times table" ✗ (one word vs two words — tokenization mismatch)

If your imprecise-input query includes a compound word that the curriculum spells as two words, fuzzy matching alone won't bridge the gap. Consider whether the imprecise-input test is testing typo recovery (achievable) or compound word expansion (requires synonyms).

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

### Step 1: Run Benchmark Review Mode

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm benchmark -s citizenship -p secondary -c precise-topic --review
```

Output shows:

- Expected slugs with relevance scores
- Top 10 actual results
- Which expected slugs were found and at what position
- ALL 4 metrics: MRR, NDCG@10, P@3, R@10

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

**Symptom**: Benchmark review shows useful results, but expected slugs aren't found.

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

### From english/primary (Session 9)

- **"emotions" ≠ "feel"**: Vocabulary matters. Query said "how characters feel" but expected slugs used "emotions". Search correctly prioritised "feel/feelings" lessons. The ground truth was WRONG, not the search.
- **Low MRR can mean WRONG ground truth**: MRR 0.000 was not a search issue — after correction: MRR 0.000 → 1.000.
- **ALL 4 metrics together**: MRR alone can mislead. P@3 and R@10 confirm whether results are actually good.

### From french/cross-topic (Session 12)

- **Query/slug term mismatch**: Query used "verbs" but expected slugs had "avoir" without "verb" in keywords. Search couldn't match them.
- **REFLECT before searching**: This mismatch was detectable by thinking, not by running searches.

### From geography (Session 15-16)

- **Search validation is not discovery**: Running benchmark first and justifying results is not independent discovery.
- **COMMIT before benchmark**: Must form independent judgment before seeing search results.
- **"actions" ≠ "effects"**: Query asking for "effects" should not expect slugs about "actions to tackle".
- **EVERY query requires FRESH MCP analysis**: Even when two queries have "similar semantic intent", you MUST do fresh bulk exploration AND fresh MCP summaries for EACH query.

### From german (Session 17)

- **Title-only matching misses excellent content**: `das-leben-mit-behinderung...` teaches advanced grammar but unit title "meine Welt" doesn't suggest this.
- **Systematic unit review required**: Review ALL units, not just those with obvious title matches.
- **MCP summaries reveal hidden gems**: Key learning often contains highly relevant content not visible in titles.

### From history (Session 18)

- **Check ALL units, not just obvious ones**: `improvements-in-public-health-in-the-19th-century` (in Medicine unit) was relevant to "factory age workers conditions" but was missed because only the Industrial Revolution unit was checked.
- **Search can be MORE comprehensive than manual discovery**: For one query, search found relevant content that manual discovery missed. This is a signal that discovery was incomplete.
- **100% certainty standard**: For critical subjects like maths, "good enough" is not acceptable. Every unit must be checked systematically.

### From maths preparation (Session 19)

- **Phase 1A (query analysis) is valuable**: Analysing queries before exploring data catches design issues early.
- **3 queries per category for maths**: The most important subject needs comprehensive coverage.
- **Vocabulary bridges must be genuine**: "the bit where you complete the square" tests noise filtering, not vocabulary bridging (since "complete the square" is already curriculum terminology).
- **Cross-topic must combine concepts, not tools**: "pattern blocks tangrams" tests tool co-occurrence, not meaningful concept intersection.

### From maths Phase 1C (Session 20)

- **Query register must match expected content level**: "Finding the unknown number" is basic/informal language that maps to LINEAR equations, not advanced quadratic solving. Expected slugs should match the sophistication level implied by query language.
- **Compound word tokenization breaks fuzzy matching**: "timetables" (one word) vs "times table" (two words) is NOT a fuzzy matching issue — it's a tokenization mismatch. Fuzzy handles character edits within tokens, not word boundary changes. With `minimum_should_match: 75%`, if one token completely fails to match, the whole query returns zero results. See [ADR-103](../../../../../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md).
- **Cross-topic ground truths must reflect curriculum reality**: If a cross-topic intersection (e.g., "fractions + money") doesn't exist strongly in the curriculum, the GT cannot specify lessons that don't exist. The GT should reflect what the curriculum CAN provide, not an ideal that the curriculum doesn't support.
- **Search can outperform manual discovery**: For "finding the unknown number," search correctly prioritised linear equations while human COMMIT had advanced quadratics. The Phase 1C three-way comparison revealed this — search was RIGHT.
- **Secondary outperforms Primary for a reason**: Secondary content uses standardised mathematical terminology. Primary uses varied, child-friendly language creating vocabulary fragmentation. This is structural, not a search bug.
- **Imprecise-input divide**: Secondary typo recovery works well (terms are distinctive). Primary typo recovery struggles (common words + `minimum_should_match` create compound failures).

### From RE Phase 1C (Session 21)

- **Generic queries require generic expected slugs**: Queries like "religious founders and leaders" need cross-faith content, not Sikh-only. The original GT was COMPLETELY wrong for 6 of 9 queries.
- **Bulk API data alignment issue**: The Oak Bulk API returns incomplete data for paired RE units (Islam half only, not Buddhism half). This causes GT validation failures for lessons that exist in search but not in bulk data.

### From PE Phase 1C (Session 21)

- **Synonym DRY fix**: Subject name synonyms must be defined ONLY in `subjects.ts`. Duplicate definitions in concept files cause incorrect expansion (e.g., "sport/sports" expanding incorrectly from PE queries).
- **BM25 explain investigation**: ES explain API can verify fuzzy matching works correctly. Multi-term query ranking naturally prioritises lessons matching more terms.

### From Science Phase 1B-1C (Sessions 22-23)

- **Subject hierarchy not modelled in ES**: Physics/chemistry/biology/combined-science are conceptually "Science" but have different `subject_slug` values. 44% of Science Secondary expected slugs were excluded by the filter. Fixed by adding `subject_parent` field. See [ADR-101](../../../../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md).
- **Fuzzy edit distance 2 causes false positives**: "magnits" (intended: magnets) matches "magnify/magnification" because both share "magni-" prefix and AUTO allows 2 edits for 6+ char words. See [ADR-103](../../../../../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md).
- **Control queries diagnose problem type**: Adding "electricity and magnets" (no typos) confirmed the issue was fuzzy matching, not search architecture.
- **GT may be wrong, not search**: "energy transfers and efficiency" scored low because GT had work/power/KE lessons; search correctly found efficiency lessons. MRR 0.333 → 1.000 after correction.
- **`minimum_should_match` conditional syntax**: Changed from `75%` to `2<65%` (≤2 terms: all required; >2 terms: 65%). Neutral for 2-term, better for 3+ term queries. See [ADR-102](../../../../../../docs/architecture/architectural-decisions/102-conditional-minimum-should-match.md).
- **Domain term boosting is the long-term solution**: Fuzzy false positives need curriculum vocabulary boosting, not just threshold tuning. Documented for future implementation. See [ADR-104](../../../../../../docs/architecture/architectural-decisions/104-domain-term-boosting.md).

### From Spanish Phase 1C (Session 24)

- **Query-data alignment is critical**: Queries must use terminology that actually exists in the curriculum. "spansh vocabulary primary" had 0% hits because "vocabulary" doesn't exist in Spanish curriculum — it's organized by **grammar concepts** (ser/estar, tener, adjective agreement).
- **Curriculum analysis reveals structure**: Spanish primary teaches verb conjugations (soy/es/eres, estoy/está, tengo/tiene), adjective agreement, and sound-symbol correspondences. Queries must align with this structure.
- **25% zero-hit rate = query design problem**: Original PRIMARY queries had 25% zero-hit rate. After aligning queries with curriculum terminology: 0% zero-hit, MRR 0.375 → 1.000.
- **MFL subjects have no transcripts**: Spanish (like French/German) relies 100% on structure-based retrieval (titles, keywords, key learning). Queries must match this metadata.
- **Redesigned queries**:
  - "teach spanish greetings to children" (1 match) → "teaching estar for states and location KS2" (5+ matches)
  - "spansh vocabulary primary" (0 matches) → "spansh adjective agreemnt" (5 matches)
- **Always verify query coverage BEFORE designing GT**: Use bulk data exploration to confirm the query concept exists and has sufficient coverage (3-5 lessons minimum).

### Phase 1A Query Analysis Framework

Phase 1A (introduced Session 19) catches query design issues BEFORE exploring data:

| Check              | Question                                          |
| ------------------ | ------------------------------------------------- |
| Capability test    | Does this query test what the category claims?    |
| Register match     | Does query language match expected content level? |
| Achievability      | Can fuzzy matching handle this imprecise-input?   |
| Curriculum reality | Does the cross-topic intersection exist?          |

Common design issues caught by Phase 1A:

- **Miscategorised queries**: "the bit where you complete the square" contains curriculum terminology — not a vocabulary bridge
- **Compound word tokenization**: "timetables" vs "times table" is not achievable with fuzzy matching alone
- **Non-existent intersections**: Cross-topic queries for concept combinations not in curriculum

---

## Quick Reference

### File Structure (Split Architecture 2026-01-19)

Ground truths are split into two files with different lifecycles:

- **Query files** (`*.query.ts`): Define what we're testing. Change rarely.
- **Expected files** (`*.expected.ts`): Define current "answer key". Change when curriculum updates.

```text
src/lib/search-quality/ground-truth/
├── {subject}/
│   └── {phase}/
│       ├── precise-topic.query.ts      # Query definition
│       ├── precise-topic.expected.ts   # Expected relevance
│       ├── precise-topic-2.query.ts    # Additional query (maths has 3 per category)
│       ├── precise-topic-2.expected.ts
│       ├── natural-expression.query.ts
│       ├── natural-expression.expected.ts
│       ├── imprecise-input.query.ts
│       ├── imprecise-input.expected.ts
│       ├── cross-topic.query.ts
│       ├── cross-topic.expected.ts
│       └── index.ts                    # Combines queries + expected at runtime
├── registry/
│   └── entries.ts
├── types.ts
└── GROUND-TRUTH-GUIDE.md  ← You are here
```

**Note**: Maths has 3 queries per category (24 total) due to its critical importance.

### Entry Templates

**Query file (`*.query.ts`)**:

```typescript
/**
 * Query definition for {category} ground truth.
 * This file contains ONLY the query metadata, NOT the expected results.
 * @packageDocumentation
 */
import type { GroundTruthQueryDefinition } from '../../types';

export const {SUBJECT}_{PHASE}_{CATEGORY}_QUERY: GroundTruthQueryDefinition = {
  query: 'your query here',
  category: '{category}',
  description: 'What this query tests and why',
  expectedFile: './{category}.expected.ts',
} as const;
```

**Expected file (`*.expected.ts`)**:

```typescript
/**
 * Expected relevance for {category} ground truth.
 * @packageDocumentation
 */
import type { ExpectedRelevance } from '../../types';

export const {SUBJECT}_{PHASE}_{CATEGORY}_EXPECTED: ExpectedRelevance = {
  'best-match-slug': 3,
  'good-match-slug': 2,
  'related-slug': 1,
} as const;
```

### Session Workflow

1. `pnpm benchmark -s X -p Y --review` — See current state with ALL 4 metrics
2. Explore via MCP tools — Find qualitatively best matches
3. Update ground truth file — Based on evidence
4. `pnpm ground-truth:validate` — Check validity
5. `pnpm benchmark -s X -p Y --verbose` — Measure aggregate metrics
6. Update checklist — Record findings with all 4 metrics

---

## Related Documents

### Architectural Decision Records

| ADR                                                                                                                                                          | Purpose                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| [ADR-085: Ground Truth Validation Discipline](../../../../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md)         | Three-stage validation model, 16 checks, design rules |
| [ADR-098: Ground Truth Registry](../../../../../../docs/architecture/architectural-decisions/098-ground-truth-registry.md)                                   | Registry structure, split file architecture           |
| [ADR-101: Subject Hierarchy for Search Filtering](../../../../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md) | `subject_parent` field for Science KS4                |
| [ADR-102: Conditional minimum_should_match](../../../../../../docs/architecture/architectural-decisions/102-conditional-minimum-should-match.md)             | Query tuning for multi-term queries                   |
| [ADR-103: Fuzzy Matching Limitations](../../../../../../docs/architecture/architectural-decisions/103-fuzzy-matching-limitations.md)                         | Tokenization vs character edits, compound words       |
| [ADR-104: Domain Term Boosting](../../../../../../docs/architecture/architectural-decisions/104-domain-term-boosting.md)                                     | Future solution for fuzzy false positives (proposed)  |

### Session and Process Documents

| Document                                                                                                      | Purpose                                    |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Review Checklist](../../../../../../.agent/plans/semantic-search/active/ground-truth-review-checklist.md)    | Current review progress                    |
| [Session Template](../../../../../../.agent/plans/semantic-search/templates/ground-truth-session-template.md) | LINEAR execution protocol with COMMIT step |
| [Session Prompt](../../../../../../.agent/prompts/semantic-search/semantic-search.prompt.md)                  | Session entry point                        |
| [IR-METRICS.md](../../../docs/IR-METRICS.md)                                                                  | Metric definitions (MRR, NDCG, P@3, R@10)  |
