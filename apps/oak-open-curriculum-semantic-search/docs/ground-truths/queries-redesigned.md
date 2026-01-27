# Ground Truth Queries: Redesign

**Status**: Stage 1b — Query Grounding Required  
**Target**: ~95 queries (complexity-weighted distribution)  
**Last Updated**: 2026-01-27

**Structure**: ⚠️ Revised (pending subject filter fix for science sub-disciplines)  
**Query Text**: ❌ Not yet created — this is next  
**Expected Slugs**: ❌ Not yet created

---

## Known-Answer-First Methodology

> **Queries must be derived FROM bulk data, not verified AGAINST it.**

### The Process

1. **Mine curriculum** → find rich topic areas with 5+ lessons
2. **Identify 5 target lessons** → these become expected slugs (cross-unit allowed)
3. **Construct query** → what would a teacher type to find those lessons?
4. **Assign graded relevance** → score each slug (3/2/1) with key learning evidence

### Expected Slugs Requirement

| Requirement         | Value                                             |
| ------------------- | ------------------------------------------------- |
| **Slugs per query** | **5** (minimum 4 if curriculum genuinely limited) |
| **Cross-unit**      | Allowed — slugs do NOT have to be from same unit  |
| **Score=3**         | At least one per query                            |
| **Justification**   | Every score backed by key learning quote          |

See [ground-truth-redesign-plan.md](../../../../.agent/plans/semantic-search/active/ground-truth-redesign-plan.md) for full methodology.

---

## Core Question

> "In a full range of likely search scenarios for professional teachers, is our system providing the value to the user that they need and we intend?"

This is what ground truths must answer. ALL users are professional teachers.

---

## Guiding Principles

### We Test OUR Value, Not Elasticsearch

| We Test                                 | We Don't Test (ES Handles)         |
| --------------------------------------- | ---------------------------------- |
| Does search help teachers find content? | Stemming / morphological variation |
| Natural teacher queries                 | Disambiguation (filtering handles) |
| Typo recovery (a handful of proofs)     | Phrase matching internals          |

### We Enable Teachers, Not Police Them

Teachers can search for anything. A KS2 teacher searching "quadratic equations" should find quadratic equations.

### Metadata Is the Default

ALL search works on metadata. Transcripts are supplementary. Search MUST work for ALL subjects.

### Natural Phrasing, Not Clipped Term Lists

Queries must reflect how teachers actually type — natural phrasing, not keyword lists.

| Bad (Clipped List)                | Good (Natural Phrasing)                        |
| --------------------------------- | ---------------------------------------------- |
| "bones muscles body movement"     | "how bones and muscles move the body"          |
| "fractions denominators adding"   | "adding fractions with different denominators" |
| "slavery abolition transatlantic" | "the transatlantic slave trade and abolition"  |

---

## Category Structure

| Category                | Purpose                             | Count | Notes                                    |
| ----------------------- | ----------------------------------- | ----- | ---------------------------------------- |
| `natural-query`         | How teachers actually search        | ~80   | Primary value test                       |
| `exact-term`            | BM25 returns exact curriculum terms | ~6    | Mechanics proof (subject-representative) |
| `typo-recovery`         | Fuzzy matching works                | ~3    | Mechanism test only (not per-subject)    |
| `curriculum-connection` | Genuine topic pairings              | ~4    | Only verified intersections              |
| `future-intent`         | Features not yet built              | ~2    | Excluded from stats                      |

**Eliminated categories**: morphological-variation, ambiguous-term, difficulty-mismatch, metadata-only — these test Elasticsearch or filtering, not our value.

**Typo-recovery rationale**: This tests a mechanism (fuzzy matching), not subject-specific behaviour. 2-3 global proofs are sufficient; one per subject would be wasteful.

---

## Complexity-Weighted Distribution

Maths and science have more queries because they have greater complexity at KS4, not because they are more important than other subjects. All lessons are equally important.

### Subject Filter Requirements

Users specify ONE subject value. Both `science` and `physics` are valid at any key stage.

| User Input | Key Stage | Filter Applied            | Expected Result                     | Status                   |
| ---------- | --------- | ------------------------- | ----------------------------------- | ------------------------ |
| `science`  | any       | `subject_parent: science` | All science (KS3 + KS4 variants)    | ⚠️ Needs verification    |
| `physics`  | KS4       | `subject_slug: physics`   | Only physics lessons                | ❌ Blocked (pending fix) |
| `physics`  | KS3       | `subject_parent: science` | All KS3 science (no physics at KS3) | ⚠️ Needs verification    |
| `physics`  | KS2       | `subject_parent: science` | All primary science                 | ⚠️ Needs verification    |
| `maths`    | any       | `subject_parent: maths`   | All maths                           | ✅ Works                 |

**Blocker**: Subject slug normalisation loses granular subject information. See [subject-filter-fix-plan.md](../../../../.agent/plans/semantic-search/active/subject-filter-fix-plan.md).

**Solution**: SDK-generated `SUBJECT_TO_PARENT` lookup table enables smart filtering — system determines which ES field to use based on subject and key stage.

### Distribution by Subject

| Priority    | Subject/Filter         | Primary | KS3    | KS4    | Total   | Notes                                                 |
| ----------- | ---------------------- | ------- | ------ | ------ | ------- | ----------------------------------------------------- |
| **Highest** | maths                  | 8       | 6      | 10     | 24      | KS4 complexity: higher-tier, circle theorems, vectors |
| **High**    | science (broad)        | 4       | 4      | —      | 8       | Uses `subject_parent` filter                          |
| **High**    | physics (KS4)          | —       | —      | 3      | 3       | Uses `subject_slug` filter (pending fix)              |
| **High**    | chemistry (KS4)        | —       | —      | 3      | 3       | Uses `subject_slug` filter (pending fix)              |
| **High**    | biology (KS4)          | —       | —      | 3      | 3       | Uses `subject_slug` filter (pending fix)              |
| **High**    | combined-science (KS4) | —       | —      | 2      | 2       | Uses `subject_slug` filter (pending fix)              |
| **High**    | english                | 4       | 3      | 3      | 10      |                                                       |
| **Medium**  | history                | 2       | 2      | 1      | 5       |                                                       |
| **Medium**  | geography              | 2       | 2      | 1      | 5       |                                                       |
| **Medium**  | computing              | 2       | 2      | 1      | 5       |                                                       |
| **Medium**  | PE                     | 2       | 1      | —      | 3       |                                                       |
| **Medium**  | RE                     | 2       | 1      | —      | 3       |                                                       |
| **Medium**  | french                 | 1       | 1      | 1      | 3       |                                                       |
| **Medium**  | german                 | —       | 1      | 1      | 2       |                                                       |
| **Medium**  | spanish                | 1       | —      | 1      | 2       |                                                       |
| **Medium**  | citizenship            | —       | 1      | 1      | 2       |                                                       |
| **Low**     | art                    | 1       | 1      | —      | 2       |                                                       |
| **Low**     | music                  | 1       | 1      | —      | 2       |                                                       |
| **Low**     | design-technology      | 1       | 1      | —      | 2       |                                                       |
| **Low**     | cooking-nutrition      | 1       | —      | —      | 1       |                                                       |
| **Global**  | typo-recovery          | —       | —      | —      | 3       | Mechanism tests (not per-subject)                     |
| **Global**  | curriculum-connection  | —       | —      | —      | 4       | Cross-topic intersections                             |
| **Global**  | future-intent          | —       | —      | —      | 2       | Excluded from stats                                   |
| **Total**   |                        | **32**  | **27** | **31** | **~99** |                                                       |

---

## Query Design Template

For each query, document:

| Field                    | Description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| **Category**             | `natural-query`, `exact-term`, `typo-recovery`, `curriculum-connection`, or `future-intent` |
| **Query**                | PLACEHOLDER                                                                                 |
| **Key Stage**            | `ks1`, `ks2`, `ks3`, or `ks4`                                                               |
| **Subject Filter**       | The subject used for filtering (e.g., `science`, `physics`)                                 |
| **Search Challenge**     | What specific search challenge does this test? (vocabulary bridging, term matching, etc.)   |
| **Curriculum Grounding** | What content in bulk data supports this query?                                              |

### Stage 2: Expected Slugs (to be added)

For each query, add **5 expected slugs** (minimum 4):

| Slug            | Relevance | Justification                                      |
| --------------- | --------- | -------------------------------------------------- |
| `lesson-slug-1` | 3         | Key learning: "[quote from MCP summary]"           |
| `lesson-slug-2` | 3         | Key learning: "[quote from MCP summary]"           |
| `lesson-slug-3` | 2         | Related: "[quote showing connection]"              |
| `lesson-slug-4` | 2         | Related: "[quote showing connection]"              |
| `lesson-slug-5` | 1         | Tangential: "[quote showing peripheral relevance]" |

**Requirements**:

- **5 slugs per query** (minimum 4 if curriculum genuinely limited)
- **Cross-unit allowed** — slugs do NOT have to be from same unit
- **At least one score=3** — clear "right answer"
- **Every score justified** — quote key learning text as evidence

**Relevance scores**: 3 = Direct match, 2 = Related, 1 = Tangential

---

## Progress Tracker

| Subject               | Primary | KS3    | KS4    | Total   | Structure    | Query Text | Expected Slugs |
| --------------------- | ------- | ------ | ------ | ------- | ------------ | ---------- | -------------- |
| maths                 | 8       | 6      | 10     | 24      | ❌           | ❌         | ❌             |
| science (broad)       | 4       | 4      | —      | 8       | ❌           | ❌         | ❌             |
| physics               | —       | —      | 3      | 3       | ❌ (blocked) | ❌         | ❌             |
| chemistry             | —       | —      | 3      | 3       | ❌ (blocked) | ❌         | ❌             |
| biology               | —       | —      | 3      | 3       | ❌ (blocked) | ❌         | ❌             |
| combined-science      | —       | —      | 2      | 2       | ❌ (blocked) | ❌         | ❌             |
| english               | 4       | 3      | 3      | 10      | ❌           | ❌         | ❌             |
| history               | 2       | 2      | 1      | 5       | ❌           | ❌         | ❌             |
| geography             | 2       | 2      | 1      | 5       | ❌           | ❌         | ❌             |
| computing             | 2       | 2      | 1      | 5       | ❌           | ❌         | ❌             |
| PE                    | 2       | 1      | —      | 3       | ❌           | ❌         | ❌             |
| RE                    | 2       | 1      | —      | 3       | ❌           | ❌         | ❌             |
| french                | 1       | 1      | 1      | 3       | ❌           | ❌         | ❌             |
| german                | —       | 1      | 1      | 2       | ❌           | ❌         | ❌             |
| spanish               | 1       | —      | 1      | 2       | ❌           | ❌         | ❌             |
| citizenship           | —       | 1      | 1      | 2       | ❌           | ❌         | ❌             |
| art                   | 1       | 1      | —      | 2       | ❌           | ❌         | ❌             |
| music                 | 1       | 1      | —      | 2       | ❌           | ❌         | ❌             |
| design-technology     | 1       | 1      | —      | 2       | ❌           | ❌         | ❌             |
| cooking-nutrition     | 1       | —      | —      | 1       | ❌           | ❌         | ❌             |
| typo-recovery         | —       | —      | —      | 3       | ❌           | ❌         | ❌             |
| curriculum-connection | —       | —      | —      | 4       | ❌           | ❌         | ❌             |
| future-intent         | —       | —      | —      | 2       | ❌           | ❌         | ❌             |
| **Total**             | **32**  | **27** | **31** | **~99** | ❌           | ❌         | ❌             |

**Legend**: ✅ Complete | ❌ Not yet created | ❌ (blocked) Requires subject filter fix

---

## Query Slots

Query slots are organised by subject and key stage. Each slot will be filled during the mining process using the known-answer-first methodology.

**Note**: Detailed query specifications will be added during the mining phase. The structure below defines the slots and the search challenges each should test.

---

## Maths (24 queries)

Maths has the largest content volume and more complexity at KS4 (higher-tier content, circle theorems, vectors, etc.). The higher query count probes this complexity.

### maths/primary (8 queries)

| #   | Category      | Key Stage | Search Challenge                                                            | Status |
| --- | ------------- | --------- | --------------------------------------------------------------------------- | ------ |
| 1   | natural-query | KS1/KS2   | Vocabulary bridging: informal "sharing" language → division partition model | ❌     |
| 2   | natural-query | KS1/KS2   | Vocabulary bridging: "times tables" → multiplication fluency content        | ❌     |
| 3   | natural-query | KS1/KS2   | Vocabulary bridging: "parts of a whole" → fractions introduction            | ❌     |
| 4   | natural-query | KS1/KS2   | Natural phrasing for fraction operations (unlike denominators)              | ❌     |
| 5   | natural-query | KS1/KS2   | Vocabulary bridging: "telling the time" → clock reading content             | ❌     |
| 6   | natural-query | KS1/KS2   | Natural phrasing for 2D shape properties (sides, vertices)                  | ❌     |
| 7   | natural-query | KS1/KS2   | Natural phrasing for measuring length with units                            | ❌     |
| 8   | exact-term    | KS1/KS2   | BM25 exact matching: "place value" curriculum term                          | ❌     |

### maths/KS3 (6 queries)

| #   | Category      | Key Stage | Search Challenge                                            | Status |
| --- | ------------- | --------- | ----------------------------------------------------------- | ------ |
| 1   | natural-query | KS3       | Vocabulary bridging: "finding x" → solving linear equations | ❌     |
| 2   | natural-query | KS3       | Natural phrasing for expanding brackets (single and double) | ❌     |
| 3   | natural-query | KS3       | Natural phrasing for ratio and proportion                   | ❌     |
| 4   | natural-query | KS3       | Natural phrasing for probability concepts                   | ❌     |
| 5   | natural-query | KS3       | Natural phrasing for straight line graphs (y = mx + c)      | ❌     |
| 6   | exact-term    | KS3       | BM25 exact matching: "standard form" curriculum term        | ❌     |

### maths/KS4 (10 queries)

| #   | Category      | Key Stage | Search Challenge                                          | Status |
| --- | ------------- | --------- | --------------------------------------------------------- | ------ |
| 1   | natural-query | KS4       | Natural phrasing for factorising quadratics               | ❌     |
| 2   | natural-query | KS4       | Natural phrasing for simultaneous equations methods       | ❌     |
| 3   | natural-query | KS4       | Natural phrasing for trigonometry (SOHCAHTOA)             | ❌     |
| 4   | natural-query | KS4       | Vocabulary bridging: "finding missing sides" → Pythagoras | ❌     |
| 5   | natural-query | KS4       | Natural phrasing for circle theorems (higher tier)        | ❌     |
| 6   | natural-query | KS4       | Natural phrasing for vector notation and operations       | ❌     |
| 7   | natural-query | KS4       | Natural phrasing for cumulative frequency and box plots   | ❌     |
| 8   | natural-query | KS4       | Natural phrasing for compound interest and growth         | ❌     |
| 9   | exact-term    | KS4       | BM25 exact matching: "algebraic proof" curriculum term    | ❌     |
| 10  | exact-term    | KS4       | BM25 exact matching: "iteration" curriculum term          | ❌     |

---

## Science (19 queries)

Science has significant complexity at KS4 where it fragments into separate disciplines (physics, chemistry, biology, combined-science). Ground truths must verify that subject filtering works correctly at each level.

### science/primary (4 queries) — Filter: `science`

| #   | Category      | Key Stage | Search Challenge                                                    | Status |
| --- | ------------- | --------- | ------------------------------------------------------------------- | ------ |
| 1   | natural-query | KS1/KS2   | Vocabulary bridging: "how living things work" → habitats/adaptation | ❌     |
| 2   | natural-query | KS1/KS2   | Natural phrasing for electrical circuits and components             | ❌     |
| 3   | natural-query | KS1/KS2   | Natural phrasing for states of matter (solids, liquids, gases)      | ❌     |
| 4   | natural-query | KS1/KS2   | Natural phrasing for human body systems (skeleton, muscles)         | ❌     |

### science/KS3 (4 queries) — Filter: `science`

| #   | Category      | Key Stage | Search Challenge                                               | Status |
| --- | ------------- | --------- | -------------------------------------------------------------- | ------ |
| 1   | natural-query | KS3       | Natural phrasing for cell biology (organelles, specialisation) | ❌     |
| 2   | natural-query | KS3       | Natural phrasing for forces and motion                         | ❌     |
| 3   | natural-query | KS3       | Natural phrasing for chemical reactions basics                 | ❌     |
| 4   | exact-term    | KS3       | BM25 exact matching: "photosynthesis" curriculum term          | ❌     |

### physics/KS4 (3 queries) — Filter: `physics` ⚠️ BLOCKED

**Requires subject filter fix**: Currently `physics` is normalised to `science`, so specific filtering is not possible.

| #   | Category      | Key Stage | Search Challenge                                       | Status       |
| --- | ------------- | --------- | ------------------------------------------------------ | ------------ |
| 1   | natural-query | KS4       | Natural phrasing for electromagnetic spectrum          | ❌ (blocked) |
| 2   | natural-query | KS4       | Natural phrasing for nuclear physics and radioactivity | ❌ (blocked) |
| 3   | natural-query | KS4       | Natural phrasing for wave properties and calculations  | ❌ (blocked) |

### chemistry/KS4 (3 queries) — Filter: `chemistry` ⚠️ BLOCKED

**Requires subject filter fix**: Currently `chemistry` is normalised to `science`, so specific filtering is not possible.

| #   | Category      | Key Stage | Search Challenge                                          | Status       |
| --- | ------------- | --------- | --------------------------------------------------------- | ------------ |
| 1   | natural-query | KS4       | Natural phrasing for organic chemistry (alkanes, alkenes) | ❌ (blocked) |
| 2   | natural-query | KS4       | Natural phrasing for rate of reaction factors             | ❌ (blocked) |
| 3   | natural-query | KS4       | Natural phrasing for electrolysis and electrochemistry    | ❌ (blocked) |

### biology/KS4 (3 queries) — Filter: `biology` ⚠️ BLOCKED

**Requires subject filter fix**: Currently `biology` is normalised to `science`, so specific filtering is not possible.

| #   | Category      | Key Stage | Search Challenge                                  | Status       |
| --- | ------------- | --------- | ------------------------------------------------- | ------------ |
| 1   | natural-query | KS4       | Natural phrasing for genetics and inheritance     | ❌ (blocked) |
| 2   | natural-query | KS4       | Natural phrasing for homeostasis and body systems | ❌ (blocked) |
| 3   | natural-query | KS4       | Natural phrasing for ecology and ecosystems       | ❌ (blocked) |

### combined-science/KS4 (2 queries) — Filter: `combined-science` ⚠️ BLOCKED

**Requires subject filter fix**: Currently `combined-science` is normalised to `science`, so specific filtering is not possible.

| #   | Category      | Key Stage | Search Challenge                                       | Status       |
| --- | ------------- | --------- | ------------------------------------------------------ | ------------ |
| 1   | natural-query | KS4       | Vocabulary bridging: cross-discipline integrated topic | ❌ (blocked) |
| 2   | natural-query | KS4       | Natural phrasing for required practical content        | ❌ (blocked) |

---

## English (10 queries)

### english/primary (4 queries)

| #   | Category      | Key Stage | Search Challenge                                                   | Status |
| --- | ------------- | --------- | ------------------------------------------------------------------ | ------ |
| 1   | natural-query | KS1/KS2   | Vocabulary bridging: "sentence starters" → fronted adverbials      | ❌     |
| 2   | natural-query | KS1/KS2   | Natural phrasing for speech punctuation (dialogue writing)         | ❌     |
| 3   | natural-query | KS1/KS2   | Natural phrasing for spelling rules (suffix patterns)              | ❌     |
| 4   | natural-query | KS1/KS2   | Vocabulary bridging: "understanding what you read" → comprehension | ❌     |

### english/KS3 (3 queries)

| #   | Category      | Key Stage | Search Challenge                                        | Status |
| --- | ------------- | --------- | ------------------------------------------------------- | ------ |
| 1   | natural-query | KS3       | Natural phrasing for persuasive writing techniques      | ❌     |
| 2   | natural-query | KS3       | Natural phrasing for poetry analysis methods            | ❌     |
| 3   | exact-term    | KS3       | BM25 exact matching: "relative clauses" curriculum term | ❌     |

### english/KS4 (3 queries)

| #   | Category      | Key Stage | Search Challenge                                     | Status |
| --- | ------------- | --------- | ---------------------------------------------------- | ------ |
| 1   | natural-query | KS4       | Natural phrasing for GCSE literature text analysis   | ❌     |
| 2   | natural-query | KS4       | Natural phrasing for transactional writing skills    | ❌     |
| 3   | natural-query | KS4       | Vocabulary bridging: character analysis in set texts | ❌     |

---

## History (5 queries)

### history/primary (2 queries)

| #   | Category      | Key Stage | Search Challenge                                   | Status |
| --- | ------------- | --------- | -------------------------------------------------- | ------ |
| 1   | natural-query | KS1/KS2   | Natural phrasing for Stone Age to Iron Age Britain | ❌     |
| 2   | natural-query | KS1/KS2   | Natural phrasing for Ancient Egypt civilisation    | ❌     |

### history/KS3 (2 queries)

| #   | Category      | Key Stage | Search Challenge                                          | Status |
| --- | ------------- | --------- | --------------------------------------------------------- | ------ |
| 1   | natural-query | KS3       | Natural phrasing for Norman Conquest and medieval England | ❌     |
| 2   | natural-query | KS3       | Natural phrasing for Industrial Revolution changes        | ❌     |

### history/KS4 (1 query)

| #   | Category      | Key Stage | Search Challenge                                         | Status |
| --- | ------------- | --------- | -------------------------------------------------------- | ------ |
| 1   | natural-query | KS4       | Natural phrasing for transatlantic slavery and abolition | ❌     |

---

## Geography (5 queries)

### geography/primary (2 queries)

| #   | Category      | Key Stage | Search Challenge                            | Status |
| --- | ------------- | --------- | ------------------------------------------- | ------ |
| 1   | natural-query | KS1/KS2   | Natural phrasing for rivers and water cycle | ❌     |
| 2   | natural-query | KS1/KS2   | Natural phrasing for continents and oceans  | ❌     |

### geography/KS3 (2 queries)

| #   | Category      | Key Stage | Search Challenge                                               | Status |
| --- | ------------- | --------- | -------------------------------------------------------------- | ------ |
| 1   | natural-query | KS3       | Natural phrasing for tectonic hazards (earthquakes, volcanoes) | ❌     |
| 2   | natural-query | KS3       | Natural phrasing for weather and climate patterns              | ❌     |

### geography/KS4 (1 query)

| #   | Category      | Key Stage | Search Challenge                                   | Status |
| --- | ------------- | --------- | -------------------------------------------------- | ------ |
| 1   | natural-query | KS4       | Natural phrasing for globalisation and development | ❌     |

---

## Computing (5 queries)

### computing/primary (2 queries)

| #   | Category      | Key Stage | Search Challenge                                                   | Status |
| --- | ------------- | --------- | ------------------------------------------------------------------ | ------ |
| 1   | natural-query | KS1/KS2   | Vocabulary bridging: "making things happen" → sequences/algorithms | ❌     |
| 2   | natural-query | KS1/KS2   | Natural phrasing for online safety and digital citizenship         | ❌     |

### computing/KS3 (2 queries)

| #   | Category      | Key Stage | Search Challenge                                                 | Status |
| --- | ------------- | --------- | ---------------------------------------------------------------- | ------ |
| 1   | natural-query | KS3       | Natural phrasing for Python programming basics                   | ❌     |
| 2   | natural-query | KS3       | Vocabulary bridging: "fake emails" → phishing/social engineering | ❌     |

### computing/KS4 (1 query)

| #   | Category   | Key Stage | Search Challenge                                              | Status |
| --- | ---------- | --------- | ------------------------------------------------------------- | ------ |
| 1   | exact-term | KS4       | BM25 exact matching: "computational thinking" curriculum term | ❌     |

---

## Other Subjects (18 queries)

### PE (3 queries)

| #   | Category      | Key Stage | Search Challenge                                             | Status |
| --- | ------------- | --------- | ------------------------------------------------------------ | ------ |
| 1   | natural-query | Primary   | Natural phrasing for invasion games skills                   | ❌     |
| 2   | natural-query | Primary   | Natural phrasing for gymnastics floor work                   | ❌     |
| 3   | natural-query | KS3       | Natural phrasing for anatomy and physiology (GCSE PE theory) | ❌     |

### RE (3 queries)

| #   | Category      | Key Stage | Search Challenge                                       | Status |
| --- | ------------- | --------- | ------------------------------------------------------ | ------ |
| 1   | natural-query | Primary   | Natural phrasing for religious festivals across faiths | ❌     |
| 2   | natural-query | Primary   | Natural phrasing for sacred texts and scriptures       | ❌     |
| 3   | natural-query | KS3       | Natural phrasing for ethics and moral philosophy       | ❌     |

### French (3 queries)

| #   | Category      | Key Stage | Search Challenge                                        | Status |
| --- | ------------- | --------- | ------------------------------------------------------- | ------ |
| 1   | natural-query | Primary   | Natural phrasing for introducing yourself (être, avoir) | ❌     |
| 2   | natural-query | KS3       | Natural phrasing for future tense formation             | ❌     |
| 3   | natural-query | KS4       | Natural phrasing for complex grammar structures         | ❌     |

### German (2 queries)

| #   | Category      | Key Stage | Search Challenge                                     | Status |
| --- | ------------- | --------- | ---------------------------------------------------- | ------ |
| 1   | natural-query | KS3       | Natural phrasing for present tense verb conjugations | ❌     |
| 2   | natural-query | KS4       | Natural phrasing for describing people and places    | ❌     |

### Spanish (2 queries)

| #   | Category      | Key Stage | Search Challenge                                   | Status |
| --- | ------------- | --------- | -------------------------------------------------- | ------ |
| 1   | natural-query | Primary   | Natural phrasing for expressing opinions (gustar)  | ❌     |
| 2   | natural-query | KS4       | Natural phrasing for travel and holiday vocabulary | ❌     |

### Citizenship (2 queries)

| #   | Category      | Key Stage | Search Challenge                                    | Status |
| --- | ------------- | --------- | --------------------------------------------------- | ------ |
| 1   | natural-query | KS3       | Natural phrasing for UK democracy and voting        | ❌     |
| 2   | natural-query | KS4       | Natural phrasing for rights, laws, and constitution | ❌     |

### Art (2 queries)

| #   | Category      | Key Stage | Search Challenge                                    | Status |
| --- | ------------- | --------- | --------------------------------------------------- | ------ |
| 1   | natural-query | Primary   | Natural phrasing for painting techniques and colour | ❌     |
| 2   | natural-query | KS3       | Natural phrasing for observational drawing skills   | ❌     |

### Music (2 queries)

| #   | Category      | Key Stage | Search Challenge                                    | Status |
| --- | ------------- | --------- | --------------------------------------------------- | ------ |
| 1   | natural-query | Primary   | Natural phrasing for singing and group performance  | ❌     |
| 2   | natural-query | KS3       | Natural phrasing for composition and creative music | ❌     |

### Design Technology (2 queries)

| #   | Category      | Key Stage | Search Challenge                                      | Status |
| --- | ------------- | --------- | ----------------------------------------------------- | ------ |
| 1   | natural-query | Primary   | Natural phrasing for mechanisms (levers, linkages)    | ❌     |
| 2   | natural-query | KS3       | Natural phrasing for sustainable design and materials | ❌     |

### Cooking and Nutrition (1 query)

| #   | Category      | Key Stage | Search Challenge                                    | Status |
| --- | ------------- | --------- | --------------------------------------------------- | ------ |
| 1   | natural-query | Primary   | Natural phrasing for healthy eating (Eatwell Guide) | ❌     |

---

## Global Mechanism Tests (9 queries)

These test search mechanisms that are not subject-specific.

### Typo Recovery (3 queries)

Typo recovery tests fuzzy matching. This is a mechanism test — if fuzzy matching works for one subject, it works for all. Testing per-subject would be wasteful.

| #   | Example Domain | Search Challenge                                         | Status |
| --- | -------------- | -------------------------------------------------------- | ------ |
| 1   | Maths          | Fuzzy matching: "similtaneous" → simultaneous equations  | ❌     |
| 2   | English        | Fuzzy matching: "Shakespear" → Shakespeare content       | ❌     |
| 3   | Science        | Fuzzy matching: "photosythesis" → photosynthesis content | ❌     |

### Curriculum Connection (4 queries)

Tests genuine cross-topic intersections that exist within the curriculum.

| #   | Subjects/Topics                    | Search Challenge                                    | Status |
| --- | ---------------------------------- | --------------------------------------------------- | ------ |
| 1   | Maths (fractions + decimals)       | Topics taught together in same sequence             | ❌     |
| 2   | Maths (algebra + graphs)           | Linking equations to their graphical representation | ❌     |
| 3   | Science (energy in living systems) | Cross-discipline biology + chemistry connection     | ❌     |
| 4   | RE (democracy + rule of law)       | Topics appearing together in citizenship/RE overlap | ❌     |

### Future Intent (2 queries)

Tests capabilities requiring Level 3-4 features (intent classification, semantic reranking). Excluded from aggregate statistics but track progress.

| #   | Query Type         | Search Challenge                                                   | Status |
| --- | ------------------ | ------------------------------------------------------------------ | ------ |
| 1   | Difficulty intent  | "Easy algebra for beginners" — requires intent understanding       | ❌     |
| 2   | Pedagogical intent | "Interactive fractions activities" — requires format understanding | ❌     |

---

## Next Steps

1. **Fix subject filter** — Implement [subject-filter-fix-plan.md](../../../../.agent/plans/semantic-search/active/subject-filter-fix-plan.md) to enable physics/chemistry/biology/combined-science filtering
2. **Mine curriculum data** — Use known-answer-first methodology to create grounded queries
3. **Fill query slots** — Replace search challenges with actual queries derived from bulk data
4. **Add expected slugs** — 5 slugs per query with graded relevance and justifications
