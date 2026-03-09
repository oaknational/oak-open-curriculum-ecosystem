# Ground Truth Design Guide

**The single source of truth for designing, reviewing, and evaluating ground truths.**

This document contains:

- Design principles for creating ground truths
- Cardinal rules for evaluation
- The rigorous COMMIT protocol for independent discovery
- Anti-patterns to avoid
- Lessons learned from 25+ review sessions

**Last Updated**: 2026-01-26

---

## Scope: Educator Curriculum Search

### Current Ground Truths Are For:

| Dimension         | Current Scope                       | Future (Not Today)         |
| ----------------- | ----------------------------------- | -------------------------- |
| **Content Type**  | Lessons, units, sequences, threads  | Additional content types   |
| **User Persona**  | Professional educators (teachers)   | Pupils, students, learners |
| **Search Intent** | Finding curriculum content to teach | Self-directed learning     |

### Why This Matters

The search system will eventually serve multiple user types with different needs:

| User Type   | Search Behaviour                                        | Optimisation  |
| ----------- | ------------------------------------------------------- | ------------- |
| **Teacher** | Topic-focused, curriculum terminology, planning lessons | Current focus |
| **Pupil**   | Question-based, informal language, learning concepts    | Future work   |

A learner-focused search may require:

- Different RRF weightings (e.g., prioritise transcripts over structure)
- Different retrievers (e.g., semantic-heavy for natural questions)
- Different preprocessing (e.g., query expansion for informal language)
- Different result types (e.g., unit-level rather than lesson-level)

**All current ground truths assume the user is a professional teacher searching for lessons to teach.**

Queries should reflect teacher search patterns:

- Topic-focused, not advice-seeking
- Curriculum-aligned vocabulary (with natural bridging)
- No meta-phrases like "lessons about" or "how to teach"

---

## Core Principles (2026-01-26)

### We Test OUR Value, Not Elasticsearch

We know Elasticsearch works. We test whether **our search service with our data** delivers value to teachers.

| We Test                                            | We Don't Test (ES Handles)         |
| -------------------------------------------------- | ---------------------------------- |
| Does search help teachers find content?            | Stemming / morphological variation |
| Natural teacher queries returning relevant lessons | Disambiguation (filtering handles) |
| Typo recovery (a handful of proofs)                | Phrase matching internals          |

**Invalid categories**: Don't create ground truths for morphological variation ("fraction" vs "fractions"), ambiguous terms, or difficulty mismatch. Elasticsearch handles these, or filtering handles them.

### We Enable Teachers, Not Police Them

Teachers can search for anything. We don't judge what's "appropriate". A KS2 teacher searching "quadratic equations" should find quadratic equations. This is not a failure mode — this is the system working.

### Metadata Is the Default

| Reality                           | Wrong Framing             |
| --------------------------------- | ------------------------- |
| ALL search works on metadata      | "Fallback to metadata"    |
| Transcripts are **supplementary** | "Missing transcripts"     |
| Search MUST work for ALL subjects | "Special case for MFL/PE" |

Don't create "metadata-only" ground truths as a special category. Metadata-based search is the foundation for ALL lessons.

### Work With Current Data

| Test Now                          | Future Work (Don't Test)     |
| --------------------------------- | ---------------------------- |
| Current search with current data  | MFL multilingual embeddings  |
| Accept curriculum structure as-is | Vocabulary mining            |
| Document gaps for improvement     | Natural language paraphrases |

See future work plans in `.agent/plans/semantic-search/post-sdk/`.

### No Redundant Subject Terms

When a query is filtered to French, don't include "French" in the query. It adds noise and won't match well. The filter provides context.

**Bad**: "French negation ne pas" (filtered to French)
**Good**: "negation ne pas" (filtered to French)

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

1. **ALL queries rely on structure** — metadata is the foundation (100% coverage)
2. **Transcripts are supplementary** — some lessons have them (~81%), enhancing retrieval
3. **MFL/PE have low transcript coverage** — search relies more heavily on metadata for these subjects
4. **Title matches** come from Structure BM25; semantic understanding from both ELSER retrievers
5. **Don't create "metadata-only" categories** — metadata-based search is the default, not special

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

| Rule                   | Requirement                       | Example                                     |
| ---------------------- | --------------------------------- | ------------------------------------------- |
| Length                 | 2-10 words                        | "plate boundaries", "singing rounds"        |
| Realistic              | Would a teacher type this?        | Yes: "fractions unlike denominators"        |
| **Pedagogy aware**     | Professional UK teacher queries   | Yes: curriculum-aligned vocabulary          |
| Specific               | 5 lessons highly relevant         | Not: "maths" (too broad)                    |
| Differentiated         | Query adds value beyond filters   | Not: "art lessons secondary"                |
| **Curriculum-aligned** | Terms must exist in curriculum    | Not: "spanish vocabulary" (no such concept) |
| **No meta-phrases**    | No "teaching about", "lessons on" | Not: "teaching about fractions"             |
| **Topic-focused**      | Search topics, not advice         | Not: "how to teach fractions"               |

### Query Design for Teacher Context (2026-01-24)

Ground truth queries must reflect how **professional teachers** actually search for curriculum content. Teachers are finding content to teach, not seeking personal help or advice.

| Principle                  | Bad Example                   | Good Example                      | Why                                                             |
| -------------------------- | ----------------------------- | --------------------------------- | --------------------------------------------------------------- |
| **No meta-phrases**        | "teaching about email scams"  | "fake emails, scams"              | "teaching about" adds no search value                           |
| **No advice-seeking**      | "how to avoid getting hacked" | "phishing, social engineering"    | Teachers search for topics, not personal advice                 |
| **Topic-focused**          | "lessons on cyber security"   | "brute force attacks, hacking"    | Teachers type topics directly                                   |
| **Natural vocabulary mix** | All curriculum terms only     | "fake emails, social engineering" | Real searches blend natural teacher language + curriculum terms |

**Key insight**: Teachers don't type "lessons about X" or "teaching about X" — they type X directly. Any prefix like "how to teach", "lessons on", "teaching about" is redundant noise that doesn't improve search relevance.

**Example transformation**:

- Before: "how to avoid getting hacked online" (advice query, MRR 0.200)
- After: "fake emails, scams, social engineering" (topic query, MRR 1.000)

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

| Rule                   | Requirement                    | Why                                     |
| ---------------------- | ------------------------------ | --------------------------------------- |
| **Exactly 5 slugs**    | Target: 5 per query            | Enables meaningful metric calculation   |
| **Minimum 4 slugs**    | Only if curriculum limited     | Below 4 = query too narrow, redesign it |
| **Cross-unit allowed** | Slugs can come from ANY unit   | Best matches may be in different units  |
| At least one score=3   | Clear "right answer"           | Defines success                         |
| Graded relevance       | Mix of 3, 2, 1 scores          | Tests ranking quality                   |
| Verified existence     | All slugs in bulk data         | Prevents false negatives                |
| Justified scores       | Quote key learning as evidence | Prevents arbitrary scoring              |

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

Tests: Vocabulary bridging (natural teacher vocabulary → curriculum metadata)

**Key principle**: Teachers are professionals who know their domain. They use natural language when searching for resources — the words they'd naturally type when planning a lesson. This may differ from the exact terminology in curriculum metadata. Use **natural phrasing**, not clipped term lists (that's what `precise-topic` tests). No meta-phrases like "teaching about" or advice-seeking like "how to".

```typescript
// GOOD: How a teacher would naturally phrase it when planning
query: 'fake emails and online scams'
description: 'Tests teacher vocabulary → curriculum terms: "fake emails" → phishing'
expectedRelevance: {
  'social-engineering': 3,           // Teaches phishing, blagging
  'social-engineering-techniques': 3, // Teaches phishing, pharming
  'being-safe-online': 2,            // General overview
}

// BAD: Clipped term list (belongs in precise-topic, not natural-expression)
query: 'phishing scams social engineering'
// Problem: This is curriculum terminology, not natural teacher vocabulary

// BAD: Advice-seeking query (teachers search for topics to teach, not personal help)
query: 'how to avoid getting hacked online'
// Problem: Teachers search for curriculum content, not advice

// BAD: Meta-phrase adds no value
query: 'teaching about email scams'
// Problem: "teaching about" is noise — teachers type topics directly
```

#### imprecise-input

Tests: **Search resilience to messy real-world input**

Real users don't type perfectly. Teachers searching quickly may:

- Make typos ("techneeques" instead of "techniques")
- Truncate words ("tech" instead of "techniques")
- Use wrong word order
- Make phonetic errors
- Use alternative spellings (British/American, dialect variants)
- Make word boundary errors ("timetables" vs "times tables")
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

**Key principle**: Cross-topic intersections must exist **within a single unit or between units in the same sequence**. Random concept mashups from unrelated curriculum areas are not valid cross-topic queries.

```typescript
// GOOD: Query combines two concepts that appear together in curriculum
query: 'democracy and laws together'
description: 'Tests lessons that explicitly combine democracy + rule of law'
expectedRelevance: {
  'what-does-it-mean-to-live-in-a-democracy': 3,  // Combines both
  'what-are-rights-and-where-do-they-come-from': 3,  // Rule of law + democracy
  'what-is-the-right-to-protest-within-a-democracy-with-the-rule-of-law': 2,
}

// BAD: Random concept mashup (no curriculum connection)
query: 'maps and teamwork outdoor activities'
// Problem: These concepts don't appear together in curriculum

// BAD: Concepts from unrelated sequences
query: 'fractions and volcanoes'
// Problem: No genuine curriculum intersection exists
```

---

## Part 2: Cardinal Rules

### Rule 1: The Search Might Be RIGHT. Your Expected Slugs Might Be WRONG.

Session 9 proved this: Previous session claimed MRR 0.000 was a "search quality issue". After deep exploration, the expected slugs used "emotions" but the query said "feel". The search correctly prioritised "feel/feelings" lessons. After correction: MRR 0.000 → 1.000.

**The Key Question is NOT**: "Do expected slugs appear in results?"  
**The Key Question IS**: "What are the BEST slugs for this query, based on curriculum content?"

### Rule 2: Form Your OWN Assessment BEFORE Seeing Search Results

The purpose of the COMMIT protocol is to prevent "search validation bias" — the failure mode where you:

1. Run benchmark
2. See what search returned
3. Retroactively justify those results as "good"
4. Claim you did "independent discovery"

**This is not independent discovery. This is validation.**

True independent discovery means: you identify the best lessons from curriculum content, COMMIT to your rankings, and ONLY THEN compare against what search returned.

### Rule 3: Every Query Requires FRESH Analysis

Session 16 (geography) proved this: Even when two queries have "similar semantic intent", you MUST do fresh bulk exploration AND fresh MCP summaries for EACH query. Copying expected slugs from one query to another is FORBIDDEN.

### Rule 4: Title-Only Matching is NOT Sufficient

Session 17 (German) proved this: `das-leben-mit-behinderung-stem-changes-in-present-tense-weak-verbs` was initially missed because its unit title is "meine Welt" — not obviously about grammar. But MCP summary revealed it teaches ADVANCED stem variation rules.

Discovery MUST include systematic review of ALL units, not just those with obvious titles.

---

## Part 3: Rigorous Evaluation Protocol (COMMIT Methodology)

When reviewing or validating existing ground truths, use this rigorous protocol to ensure independent discovery.

### Protocol Overview

| Phase        | Purpose                            | Checkpoint                    |
| ------------ | ---------------------------------- | ----------------------------- |
| **Phase 0**  | Prerequisites                      | Tools working                 |
| **Phase 1A** | Query Analysis (REFLECT only)      | Query validated               |
| **Phase 1B** | Discovery + COMMIT (BEFORE search) | Rankings committed            |
| **Phase 1C** | Comparison (AFTER commitment)      | Three-way comparison complete |
| **Phase 2**  | Validation                         | Metrics collected             |

### Phase 0: Prerequisites

```bash
cd apps/oak-search-cli
source .env.local
```

| Tool       | Verification                                                 |
| ---------- | ------------------------------------------------------------ |
| MCP server | Call `get-curriculum-model`                                  |
| Bulk data  | `jq '.sequence \| length' bulk-downloads/SUBJECT-PHASE.json` |
| Benchmark  | `pnpm benchmark:lessons --help`                              |

**CHECKPOINT 0**: If ANY tool is unavailable → **STOP**.

### Phase 1A: Query Analysis (REFLECT — No Tools)

**⚠️ No searches. No tools. No data exploration. Just THINKING.**

Read the `.query.ts` file (NOT `.expected.ts`) and answer:

| Question                                      | Analysis Required                    |
| --------------------------------------------- | ------------------------------------ |
| What capability does this category test?      | State explicitly                     |
| Is this query a good test of that capability? | Evaluate design                      |
| Will success/failure be informative?          | Assess experiment                    |
| Any design issues?                            | Miscategorised, trivial, impossible? |

**CHECKPOINT 1A**: Query validated before searching.

### Phase 1B: Discovery + COMMIT (BEFORE Benchmark)

**⛔ DO NOT run benchmark until COMMIT is complete.**

| Step | Action              | Evidence Required                    |
| ---- | ------------------- | ------------------------------------ |
| 1B.1 | Search bulk data    | 10+ candidate slugs                  |
| 1B.2 | Get MCP summaries   | 5-10 with key learning quotes        |
| 1B.3 | Get unit context    | Lesson ordering                      |
| 1B.4 | Analyse candidates  | Reasoning for each                   |
| 1B.5 | **COMMIT rankings** | Top 5 with scores and justifications |

**COMMIT Table Template**:

| Rank | Slug   | Score (1-3) | Key Learning Quote | Why This Ranking |
| ---- | ------ | ----------- | ------------------ | ---------------- |
| 1    | \_\_\_ | \_\_\_      | "..."              | \_\_\_           |
| 2    | \_\_\_ | \_\_\_      | "..."              | \_\_\_           |
| 3    | \_\_\_ | \_\_\_      | "..."              | \_\_\_           |

**CHECKPOINT 1B**: Rankings committed BEFORE seeing search results OR expected slugs.

### Phase 1C: Comparison (AFTER Commitment)

**✅ NOW you may read `.expected.ts` and run benchmark.**

```bash
pnpm benchmark:lessons -s SUBJECT -p PHASE -c CATEGORY --review
```

**Three-Way Comparison Table** (MANDATORY):

| Slug   | YOUR Rank | SEARCH Rank | EXPECTED Score | Verdict                                           |
| ------ | --------- | ----------- | -------------- | ------------------------------------------------- |
| \_\_\_ | #1        | #?          | score ?        | Agreement / Search better / Your discovery better |

**Critical Question**: "What are the BEST slugs for this query — and where did they come from?"

| Answer Option            | Meaning                                  |
| ------------------------ | ---------------------------------------- |
| Current GT is CORRECT    | Expected slugs are best matches          |
| Search found BETTER      | Search returned genuinely better lessons |
| My candidates are BETTER | Discovery found better than both         |
| Mix is best              | Best GT combines sources                 |

**CHECKPOINT 1C**: Three-way comparison complete with justified decision.

---

## Part 4: Anti-Patterns

### Anti-Pattern 1: Search Validation (NOT Independent Discovery)

**❌ WRONG (Validates Search)**:

1. Run benchmark → see search returns A, B, C
2. Get MCP summaries for A, B, C
3. Note they have relevant content
4. Conclude "A, B, C are good"
5. Fill COMMIT table with A, B, C
6. Comparison table has identical columns

**Why wrong**: No independent judgment formed. Just justified what search returned.

**✅ CORRECT (Independent Discovery)**:

1. Search bulk data → find candidates X, Y, Z, A, B, W... (10+ slugs)
2. Get MCP summaries → analyse each against query
3. Realise X and Y directly match query; A and B are tangential
4. COMMIT: X=#1, Y=#2, W=#3 (BEFORE seeing search)
5. Run benchmark → see search returns A, B, C
6. Three-way comparison shows differences
7. Conclude: "X and Y are better than A and B because..."

### Anti-Pattern 2: "Similar Query" Shortcut

**❌ WRONG**:

1. Complete Query A properly with fresh MCP analysis
2. See Query B has "similar semantic intent" to Query A
3. Copy expected slugs from Query A to Query B
4. Skip fresh jq search for Query B

**Result**: Wrong slugs included (lesson with NO relevant key learning).

**✅ CORRECT**: Every query is independent. Fresh MCP analysis every time. No exceptions.

### Anti-Pattern 3: Title-Only Discovery

**❌ WRONG**:

1. Search bulk data with `grep` for obvious keywords
2. Only examine lessons with matching titles
3. Skip units with non-obvious titles
4. Miss excellent lessons in unexpected units

**✅ CORRECT**:

1. Search for obvious keywords
2. **ALSO** list ALL units and scan for relevant content
3. Get MCP summaries for edge cases
4. Discover lessons that titles don't suggest

---

## Part 5: Quick Review Process

For quick reviews (not full COMMIT protocol):

### Step 1: Run Benchmark Review Mode

```bash
pnpm benchmark:lessons -s SUBJECT -p PHASE -c CATEGORY --review
```

Output shows expected slugs, top 10 results, and all 4 metrics.

### Step 2: Explore Curriculum Data

Use MCP tools to verify relevance:

```text
get-lessons-summary: lesson="lesson-slug"
get-units-summary: unit="unit-slug"
```

### Step 3: Verify with Direct ES Queries

For imprecise-input or ranking issues:

```bash
source .env.local
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {"bool": {
      "must": [{"match": {"lesson_title": {"query": "term", "fuzziness": "AUTO"}}}],
      "filter": [{"term": {"subject_slug": "subject"}}]
    }},
    "size": 5,
    "_source": ["lesson_slug", "lesson_title"]
  }' | jq '.hits.hits[]._source'
```

### Step 4: Update Ground Truth

Based on evidence:

1. **Update query** if it lacks differentiation power
2. **Update expectedRelevance** with qualitatively best matches
3. **Update description** to explain what the test proves

### Step 5: Validate

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark:lessons --subject SUBJECT --phase PHASE --verbose
```

---

## Part 7: Troubleshooting

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

## Part 8: Bulk Data Exploration

### Setup

```bash
cd apps/oak-search-cli
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

## Part 9: Validation Reference

### Commands

```bash
pnpm type-check              # Stage 1: TypeScript compilation
pnpm ground-truth:validate   # Stage 2: 16 semantic checks
pnpm benchmark:lessons --verbose     # Stage 3: Measure against search
```

### Validation Checks (All Blocking)

| Check                   | Error                | Fix                                                   |
| ----------------------- | -------------------- | ----------------------------------------------------- |
| Slug doesn't exist      | `invalid-slug`       | Find correct slug in bulk data                        |
| Empty expectedRelevance | `empty-relevance`    | Add 5 slugs total, if that is impossible minimum of 4 |
| Score not 1/2/3         | `invalid-score`      | Use only 1, 2, or 3                                   |
| Query too short         | `short-query`        | Minimum 3 words                                       |
| Query too long          | `long-query`         | Maximum 10 words                                      |
| All same scores         | `uniform-scores`     | Vary scores (e.g., 3 and 2)                           |
| No score=3              | `no-highly-relevant` | At least one slug must be 3                           |
| Too many slugs          | `too-many-slugs`     | Maximum 5 (query too broad)                           |
| Wrong subject           | `cross-subject`      | Slug must match entry subject                         |

---

## Part 10: Lessons Learned

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

### From computing/secondary natural-expression (Session 25, 2026-01-24)

- **Queries must reflect teacher search behaviour**: Teachers search for curriculum topics, not personal advice. "How to avoid getting hacked" is an advice query; "fake emails, scams, social engineering" is a curriculum search.
- **No meta-phrases**: "teaching about", "lessons on", "how to teach" add no search value — teachers type topics directly.
- **Vocabulary bridging requires natural→curriculum mapping**: "fake emails" (natural teacher vocabulary) bridges to "phishing" (curriculum metadata term). Query should reflect how teachers naturally phrase searches.
- **`future-intent` category created**: Queries requiring Level 3-4 features (intent classification, semantic reranking) are now categorised as `future-intent` and excluded from aggregate statistics while tracking progress.
- **Example transformation**: "how to avoid getting hacked online" (MRR 0.200) → "fake emails, scams, social engineering" (MRR 1.000).

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

1. `pnpm benchmark:lessons -s X -p Y --review` — See current state with ALL 4 metrics
2. Explore via MCP tools — Find qualitatively best matches
3. Update ground truth file — Based on evidence
4. `pnpm ground-truth:validate` — Check validity
5. `pnpm benchmark:lessons -s X -p Y --verbose` — Measure aggregate metrics
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

### Other Documents

| Document                                                                                                           | Purpose                                   |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [Session Prompt](../../../../../../.agent/prompts/semantic-search/semantic-search.prompt.md)                       | Session entry point for GT work           |
| [GT Redesign Plan](../../../../../../.agent/plans/semantic-search/archive/completed/ground-truth-redesign-plan.md) | GT redesign (completed)                   |
| [IR-METRICS.md](../../../docs/IR-METRICS.md)                                                                       | Metric definitions (MRR, NDCG, P@3, R@10) |
