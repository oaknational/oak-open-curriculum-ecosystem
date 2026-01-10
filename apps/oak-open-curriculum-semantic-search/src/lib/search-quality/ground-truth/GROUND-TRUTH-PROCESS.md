# Ground Truth Creation Process

**Purpose**: Step-by-step process for creating validated search quality ground truths.

**Last Updated**: 2026-01-09

**Important**: Follow these steps in exact order. Do not skip steps.

---

## 🚨 Critical: Three-Stage Validation Model

Ground truths require **three distinct validation stages**:

| Stage                                 | What It Proves   | What It Does NOT Prove |
| ------------------------------------- | ---------------- | ---------------------- |
| **1. Type-Check**                     | Data integrity   | Semantic correctness   |
| **2. Runtime Validation (16 checks)** | Semantic rules   | Production readiness   |
| **3. Qualitative (manual review)**    | Production ready | —                      |

### Stage 1: Type-Check (TypeScript Enforced)

The `GroundTruthQuery` type enforces required fields at compile time:

- `category` — REQUIRED
- `priority` — REQUIRED
- `description` — REQUIRED

```bash
pnpm type-check  # MUST PASS before Stage 2
```

### Stage 2: Runtime Validation (16 checks)

Semantic rules that TypeScript cannot enforce.

```bash
pnpm ground-truth:validate  # MUST PASS before Stage 3
```

**Passing type-check AND runtime validation means ground truths meet a MINIMUM QUALITY THRESHOLD.** This makes them _worthy of investment in manual review_. It does **NOT** mean they are production-ready.

**Ground truths are NOT production-ready until ALL THREE stages are complete.**

---

## 🚨 Critical: Bulk Data Format

The bulk download files use the following structure:

```json
{
  "lessons": [
    {
      "lessonSlug": "adding-fractions", // camelCase, not snake_case
      "lessonTitle": "Adding fractions",
      "subjectSlug": "maths",
      "keyStageSlug": "ks2"
    }
  ],
  "sequenceSlug": "maths-primary"
}
```

**Key points**:

- Data is in `.lessons[]` array (NOT top-level array)
- Field is `lessonSlug` (camelCase, NOT `lesson_slug`)
- Always use correct jq syntax: `.lessons[] | select(...)`

---

## 📐 Design Rules

These rules ensure ground truths test **ranking quality**, not just topic presence.

### Query Design

- **3-7 words**: Short enough to be realistic, long enough to be specific
- **Specific**: Only 2-4 lessons should be highly relevant
- **Realistic**: Would a teacher actually type this?
- **Single-word exception**: Only acceptable for imprecise-input category

### Expected Results

- **Maximum 5 slugs** per query (more = query too broad)
- **At least one score=3** (tests for a clear "right answer")
- **Graded relevance**: Mix of 3s, 2s, and 1s (tests ranking quality)
- **Verified slugs**: Each checked against bulk data

### Anti-Patterns to Avoid

| Anti-Pattern    | Example                        | Problem                              |
| --------------- | ------------------------------ | ------------------------------------ |
| Topic matching  | "trigonometry" with 17 results | Tests presence, not ranking          |
| All same score  | 5 slugs all score=3            | Cannot test ranking quality          |
| Too broad       | "maths"                        | Every maths lesson is "relevant"     |
| No clear answer | All score=2                    | No target to measure success against |

### Review Checklist

Before committing any ground truth:

- [ ] Would a teacher actually type this query?
- [ ] Does at least one lesson directly answer the query (score=3)?
- [ ] Are other lessons appropriately scored (2 for related, 1 for tangential)?
- [ ] Is the query specific enough to test ranking, not just topic presence?
- [ ] Does the query have 3-7 words (or is imprecise-input category)?
- [ ] Are there 5 or fewer expected slugs?

**Full design rules**: See [ADR-085 Section 6](../../../../../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md#6-ground-truth-design-rules)

---

## Step 1: Identify the Subject and Phase

Decide which subject/phase combination you are creating ground truths for.

**Format**: `{subject}/{phase}` where:

- subject: e.g., `english`, `maths`, `science`
- phase: `primary` or `secondary`

**Example**: `english/primary`

---

## Step 2: Download the Bulk Data

```bash
cd apps/oak-open-curriculum-semantic-search

# Download bulk data for ALL subjects and phases
# This creates files like: bulk-downloads/{subject}-{phase}.json
pnpm bulk:download
```

This downloads all subject/phase combinations at once. Wait for the download to complete.

Verify the file exists for your target:

```bash
ls -la bulk-downloads/{subject}-{phase}.json
```

**Example**:

```bash
ls -la bulk-downloads/english-primary.json
```

---

## Step 3: Explore Available Lessons

Open the bulk data file and explore what lessons exist:

```bash
# List all unique lesson titles (first 50)
cat bulk-downloads/{subject}-{phase}.json | jq -r '.lessons[].lessonTitle' | sort -u | head -50

# Search for lessons containing a keyword
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons[] | select(.lessonTitle | test("narrative"; "i")) | {slug: .lessonSlug, title: .lessonTitle}'

# Count total lessons
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons | length'
```

**Example**:

```bash
cat bulk-downloads/english-primary.json | jq '.lessons[] | select(.lessonTitle | test("BFG"; "i")) | {slug: .lessonSlug, title: .lessonTitle}'
```

Record 5-10 lesson slugs that you will use as expected results.

---

## Step 4: Create the Query

Write a query that a teacher might use to find those lessons.

**Rules**:

- The query should be 3-7 words
- The query should be something a teacher would realistically type
- The query should relate to the lessons you found in Step 3

**Example**: For lessons about "The BFG", a query might be:

- `"The BFG reading comprehension"`
- `"BFG Roald Dahl lessons"`

---

## Step 5: Choose Query Category

Assign a category that describes the **user scenario** and **behavior being tested**:

| Category             | User Scenario                  | Behavior Proved             | Example                           |
| -------------------- | ------------------------------ | --------------------------- | --------------------------------- |
| `precise-topic`      | Teacher knows curriculum terms | Basic retrieval works       | "quadratic equations factorising" |
| `natural-expression` | Teacher uses everyday language | System bridges vocabulary   | "teach solving for x"             |
| `imprecise-input`    | Teacher makes typing errors    | System recovers from errors | "fotosynthesis"                   |
| `cross-topic`        | Teacher wants intersection     | System finds overlaps       | "algebra with graphs"             |
| `pedagogical-intent` | Teacher describes goal         | System understands purpose  | "extension work able students"    |

**Note**: Categories are outcome-oriented (2026-01-09). Legacy categories (`naturalistic`, `misspelling`, `synonym`, `multi-concept`, `colloquial`, `intent-based`) are still accepted for backward compatibility but deprecated.

---

## Step 6: Assign Relevance Scores

For each slug from Step 3, assign a relevance score:

| Score | Meaning             | Use when...                                         |
| ----- | ------------------- | --------------------------------------------------- |
| **3** | Highly Relevant     | The lesson is exactly what the query is looking for |
| **2** | Relevant            | The lesson is related and useful                    |
| **1** | Marginally Relevant | The lesson is tangentially related                  |

**Do NOT include irrelevant lessons (score 0).**

---

## Step 7: Write the Ground Truth Entry

Create or update the ground truth file:

**File location**: `src/lib/search-quality/ground-truth/{subject}/{phase}/{topic}.ts`

**Required fields**:

```typescript
{
  query: 'your query here',
  expectedRelevance: {
    'lesson-slug-1': 3,
    'lesson-slug-2': 2,
  },
}
```

**Recommended fields** (strongly encouraged):

```typescript
{
  query: 'your query here',
  expectedRelevance: {
    'lesson-slug-1': 3,
    'lesson-slug-2': 2,
  },
  category: 'naturalistic',        // Query type (see Step 5)
  description: 'Tests ability to find BFG lessons using book title',
  priority: 'high',                // critical | high | medium | exploratory
}
```

**Full example**:

```typescript
{
  query: 'The BFG reading comprehension',
  expectedRelevance: {
    'engaging-with-the-bfg': 3,
    'writing-the-opening-of-the-bfg-part-one': 2,
    'publishing-a-narrative-based-on-the-bfg': 2,
  },
  category: 'naturalistic',
  description: 'Tests exact title matching for popular book-based units',
  priority: 'high',
}
```

---

## Step 8: Add to Index File

Update the index file for this subject/phase:

**File**: `src/lib/search-quality/ground-truth/{subject}/{phase}/index.ts`

Add your import and include in the exports.

---

## Step 9: Add to Registry (if new subject/phase)

If this is a new subject/phase combination, update the registry:

**File**: `src/lib/search-quality/ground-truth/registry/entries.ts`

---

## Step 10: Validate All Slugs (Programmatic)

**✅ Validation script is fully functional** (fixed 2026-01-08).

### Generate Types (if bulk data updated)

```bash
pnpm ground-truth:generate
```

This generates:

- `ground-truths/generated/lesson-slugs-by-subject.ts` — Branded types + subject map
- `ground-truths/generated/ground-truth-schemas.ts` — Zod validation schemas

### Run Validation

```bash
pnpm ground-truth:validate
```

**TypeScript-enforced fields** (Stage 1):

| Field         | Requirement                            |
| ------------- | -------------------------------------- |
| `category`    | REQUIRED — TypeScript error if missing |
| `priority`    | REQUIRED — TypeScript error if missing |
| `description` | REQUIRED — TypeScript error if missing |

**Runtime validation checks** (Stage 2, 16 total, all blocking):

| #   | Check                 | Error Category               | Description                                  |
| --- | --------------------- | ---------------------------- | -------------------------------------------- |
| 1   | Slug existence        | `invalid-slug`               | All slugs must exist in 12,320 valid slugs   |
| 2   | Non-empty relevance   | `empty-relevance`            | expectedRelevance must have ≥1 slug          |
| 3   | Valid scores          | `invalid-score`              | Relevance scores must be 1, 2, or 3          |
| 4   | No duplicate queries  | `duplicate-query`            | Each query unique within entry               |
| 5   | No duplicate slugs    | `duplicate-slug-in-query`    | No repeated slugs in single query            |
| 6   | Query length          | `short-query` / `long-query` | 3-10 words required                          |
| 7   | Slug format           | `slug-format`                | Lowercase with hyphens                       |
| 8   | Cross-subject         | `cross-subject`              | Slugs must match entry's subject             |
| 9   | Phase consistency     | `phase-mismatch`             | keyStage must match phase                    |
| 10  | KS4 consistency       | `ks4-in-primary`             | KS4 not allowed in primary                   |
| 11  | Minimum slugs         | `single-slug`                | At least 2 expected results                  |
| 12  | **Score variety**     | `uniform-scores`             | 2+ slugs must have varied scores             |
| 13  | Highly relevant       | `no-highly-relevant`         | At least one slug must have score=3          |
| 14  | **Maximum slugs**     | `too-many-slugs`             | Maximum 5 expected results (query too broad) |
| 15  | Zod schema            | `schema-validation`          | Must pass schema validation                  |
| 16  | **Category coverage** | `category-coverage`          | Entry must meet minimum per category         |

**Expected output**: `✅ All ground truth entries are valid!`

**If validation fails**: The script lists all errors by category. Fix each error:

1. Open the relevant ground truth file
2. For invalid slugs, search bulk data:

   ```bash
   cat bulk-downloads/{subject}-{phase}.json | jq -r '.lessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | "\(.lessonSlug) | \(.lessonTitle)"'
   ```

3. Fix the error (replace slug, add priority, vary scores, etc.)
4. Re-run validation

**ALL errors must be fixed before proceeding to Step 11.**

---

## Step 11: Agent Review (Structured)

After programmatic validation, the agent must review each ground truth entry.

For EACH query in the ground truth file, verify:

### 11a. Query Realism

- [ ] Would a teacher actually type this query?
- [ ] Is the query 3-7 words?
- [ ] Does it represent a realistic search scenario?

### 11b. Relevance Score Accuracy

For each expected slug:

- [ ] Fetch the lesson summary via MCP: `get-lessons-summary lesson:{slug}`
- [ ] Confirm the lesson content matches the query intent
- [ ] Verify the relevance score is appropriate (3/2/1)

### 11c. Completeness

- [ ] Are there other relevant lessons in the bulk data that should be included?
- [ ] Run: `cat bulk-downloads/{subject}-{phase}.json | jq '.[] | select(.lesson_title | test("QUERY_KEYWORD"; "i")) | .lesson_slug'`
- [ ] Add any missed relevant lessons

### 11d. Category and Priority

- [ ] Is the category accurate for this query type?
- [ ] Is the priority appropriate (critical for common scenarios)?

### 11e. Sign-off

Document the review:

```typescript
// Reviewed: 2026-01-06
// Agent verified: slugs exist, relevance scores accurate, no missed lessons
```

---

## Step 12: Run Benchmark

Test your ground truths against the search system:

```bash
pnpm benchmark --subject {subject} --phase {phase} --verbose
```

**Review the output**:

- Each query should show ✓ or ✗
- If all queries show ✗, your slugs may be wrong (go back to Step 10)
- If some queries show ✗, the search system may need improvement (this is expected)

---

## Step 13: Commit

```bash
git add src/lib/search-quality/ground-truth/{subject}/
git commit -m "feat(search-quality): add {subject}/{phase} ground truths"
```

---

## Ground Truth Field Reference

### Required Fields

| Field               | Type                     | Description                                  |
| ------------------- | ------------------------ | -------------------------------------------- |
| `query`             | `string`                 | The search query text (3-7 words)            |
| `expectedRelevance` | `Record<string, number>` | Map of lesson_slug → relevance score (3/2/1) |

### Recommended Fields

| Field         | Type            | Description                                  |
| ------------- | --------------- | -------------------------------------------- |
| `category`    | `QueryCategory` | Type of query challenge (see Step 5)         |
| `description` | `string`        | What this query tests/validates              |
| `priority`    | `QueryPriority` | Importance: critical/high/medium/exploratory |

### Optional Fields

| Field      | Type       | Description                                       |
| ---------- | ---------- | ------------------------------------------------- |
| `keyStage` | `KeyStage` | Override for KS4-specific queries (e.g., `'ks4'`) |

---

## Canonical Scenario Categories (MANDATORY)

Ground truths form a **subject × phase × category matrix** that must have consistent coverage.

### The Validation Matrix

```text
Subject (16) × Phase (2) × Category (5) = Consistent Coverage
```

Every subject-phase entry MUST contain queries from ALL required categories:

| Category             | User Scenario                  | Priority    | Required | Min | Example                        |
| -------------------- | ------------------------------ | ----------- | -------- | --- | ------------------------------ |
| `precise-topic`      | Teacher knows curriculum       | Critical    | **YES**  | 4+  | "cell structure function"      |
| `natural-expression` | Teacher uses everyday language | High        | **YES**  | 2+  | "teach solving for x"          |
| `imprecise-input`    | Teacher makes typing errors    | Critical    | **YES**  | 1+  | "fotosynthesis"                |
| `cross-topic`        | Teacher wants intersection     | Medium      | **YES**  | 1+  | "algebra with graphs"          |
| `pedagogical-intent` | Teacher describes goal         | Exploratory | **YES**  | 1+  | "extension work able students" |

**Minimum per entry**: 9-10 queries covering all 5 required categories.

### Category Migration (2026-01-09)

Legacy categories have been migrated to outcome-oriented categories:

| Legacy                    | New Category         | Notes        |
| ------------------------- | -------------------- | ------------ |
| `naturalistic` (formal)   | `precise-topic`      | ~313 queries |
| `naturalistic` (informal) | `natural-expression` | ~28 queries  |
| `synonym`                 | `natural-expression` | 31 queries   |
| `colloquial`              | `natural-expression` | 24 queries   |
| `misspelling`             | `imprecise-input`    | 34 queries   |
| `multi-concept`           | `cross-topic`        | 16 queries   |
| `intent-based`            | `pedagogical-intent` | 2 queries    |

### Consistency Requirement

**ALL subject-phase pairings must have the SAME category coverage.** No entry may omit a required category.

This ensures:

- Benchmarks are comparable across subjects and phases
- Category-level MRR analysis is meaningful
- Gaps in search capability are detectable across the full curriculum

### Category Coverage Checklist

For **EACH** subject-phase entry, verify:

- [ ] Contains 4+ `precise-topic` queries
- [ ] Contains 2+ `natural-expression` queries
- [ ] Contains 1+ `imprecise-input` query
- [ ] Contains 1+ `cross-topic` query
- [ ] Contains 1+ `pedagogical-intent` query

**If any required category is missing → Add queries before the entry is considered complete.**

---

## Validation Commands Quick Reference

```bash
# Generate types from bulk data (run after bulk:download)
pnpm ground-truth:generate

# Stage 1: Type-check (data integrity)
pnpm type-check

# Stage 2: Runtime validation (16 semantic checks)
pnpm ground-truth:validate

# Check if a specific slug exists
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons[] | select(.lessonSlug == "your-slug-here")'

# Find lessons by keyword in title
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | {slug: .lessonSlug, title: .lessonTitle}'

# List all slugs containing a word
cat bulk-downloads/{subject}-{phase}.json | jq -r '.lessons[] | select(.lessonSlug | test("word"; "i")) | .lessonSlug'

# Count total lessons in file
cat bulk-downloads/{subject}-{phase}.json | jq '.lessons | length'

# List all lesson slugs (first 20)
cat bulk-downloads/{subject}-{phase}.json | jq -r '.lessons[].lessonSlug' | head -20
```

## Type Generation Infrastructure

The ground truth validation uses generated types from bulk data:

| File                                                 | Purpose                             |
| ---------------------------------------------------- | ----------------------------------- |
| `ground-truths/generation/bulk-data-parser.ts`       | Parse bulk JSON with Result pattern |
| `ground-truths/generation/type-emitter.ts`           | Generate branded slug types         |
| `ground-truths/generation/schema-emitter.ts`         | Generate Zod schemas                |
| `ground-truths/generated/lesson-slugs-by-subject.ts` | 12,320 valid slugs + subject map    |
| `ground-truths/generated/ground-truth-schemas.ts`    | Runtime validation schemas          |
