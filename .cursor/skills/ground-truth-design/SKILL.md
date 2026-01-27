---
name: ground-truth-design
description: Design ground truth queries for the Oak semantic search service using known-answer-first methodology. Use when creating new ground truths, redesigning existing queries, or working with files in src/lib/search-quality/ground-truth/.
---

# Ground Truth Design

Design ground truth queries that accurately measure search quality for the Oak curriculum search service.

## Core Principles

### We Test OUR Value, Not Elasticsearch

We know Elasticsearch works. We test whether **our search service with our data** delivers value to teachers.

| We Test | We Don't Test (ES Handles) |
|---------|---------------------------|
| Does search help teachers find content? | Stemming / morphological variation |
| Natural teacher queries returning relevant lessons | Disambiguation (filtering handles) |
| Typo recovery (a handful of proofs) | Phrase matching internals |

### We Enable Teachers, Not Police Them

Teachers can search for anything. We don't judge what's "appropriate".

### Metadata Is the Default

ALL search works on metadata. Transcripts are **supplementary**. Don't create "metadata-only" as a special category.

### No Redundant Subject Terms

When filtered to French, don't include "French" in the query. The filter provides context.

## Critical: Teacher Persona

**ALL ground truths are from the perspective of a PROFESSIONAL TEACHER in the UK.**

| Dimension | Current Scope | NOT (Future Work) |
|-----------|---------------|-------------------|
| Content Type | Lessons only | Units, sequences, threads |
| User Persona | **Professional UK teachers** | Pupils, students, learners |
| Search Intent | Finding curriculum content to teach | Self-directed learning |

Teachers search for **topics to teach**, not personal help or advice:

- "fake emails, scams" (topic search)
- NOT "how to avoid getting hacked" (advice-seeking)
- NOT "lessons about fractions" (meta-phrase)

Teachers type topics directly. Any prefix like "how to teach", "lessons on", "teaching about" is redundant noise.

## Bulk Data Access

**IMPORTANT**: The `bulk-downloads/` directory is gitignored. Cursor tools (LS, Glob, Grep) will NOT see these files.

Use shell commands to explore bulk data:

```bash
ls bulk-downloads/           # List available files
cat bulk-downloads/maths-primary.json | jq '.lessons | length'  # Count lessons
```

## Known-Answer-First Methodology

Ground truths are tests where we **know the correct answer before running search**.

### Step 1: Define the Scenario

What search capability are we testing?

| Category | Scenario |
|----------|----------|
| `natural-query` | Natural teacher vocabulary → curriculum metadata bridging (PRIMARY) |
| `exact-term` | Exact curriculum term retrieval (clipped term lists) |
| `typo-recovery` | Resilience to typos (a handful of proofs, not per subject) |
| `curriculum-connection` | Real curriculum concept intersections (only if verified in bulk data) |

### Invalid Categories (Don't Create)

| Category | Why Invalid |
|----------|-------------|
| `morphological-variation` | ES stemming handles "fraction" vs "fractions" |
| `ambiguous-term` | Filtering handles disambiguation |
| `difficulty-mismatch` | We enable teachers, not police them |
| `metadata-only` | Metadata IS the default, not special |

### Step 2: Find Content First

Mine bulk data to identify lessons that would prove the scenario:

```bash
cd apps/oak-open-curriculum-semantic-search

# List units and lessons
jq '.sequence[] | {unit: .unitTitle, lessons: [.unitLessons[].lessonTitle]}' \
  bulk-downloads/SUBJECT-PHASE.json

# Search for keywords
jq '.lessons[] | select(.lessonKeywords | test("TERM"; "i")) | {slug: .lessonSlug, title: .lessonTitle}' \
  bulk-downloads/SUBJECT-PHASE.json
```

These lessons ARE the known correct answer. Find them FIRST.

### Step 3: Design the Query

Create a query a teacher would realistically type:

| Category | Query Design |
|----------|-------------|
| `precise-topic` | Exact curriculum terms (clipped term lists) |
| `imprecise-input` | ONE realistic typo, word boundary error, or alternative spelling |
| `natural-expression` | How a teacher would naturally phrase it when planning lessons |
| `cross-topic` | Combine concepts naturally (must exist in same unit or sequence) |

### Step 4: Record Expected Slugs

The lessons from Step 2 become `expectedRelevance`:

| Score | Meaning |
|-------|---------|
| 3 | Direct match - teaches exactly what query asks |
| 2 | Related - covers topic but not directly |
| 1 | Tangential - mentions concept peripherally |

## Query Design Rules

| Rule | Requirement | Example |
|------|-------------|---------|
| Length | 3-7 words | "cell structure and function" |
| Realistic | Would a teacher type this? | Yes: "fractions unlike denominators" |
| Pedagogy aware | Professional UK teacher queries | Yes: curriculum-aligned vocabulary |
| Specific | 5 lessons highly relevant (min 4) | Not: "maths" (too broad) |
| Differentiated | Adds value beyond filters | Not: "art lessons secondary" |
| No meta-phrases | No "teaching about", "lessons on" | Not: "lessons on fractions" |
| Topic-focused | Topics, not advice | Not: "how to teach fractions" |
| No redundant subject | Don't repeat filter context | Not: "French negation" when filtered to French |

### Pre-Design Verification (MANDATORY)

Before writing any query, verify the concept exists:

```bash
# Count matches
jq -r '.lessons[] | select(.lessonSlug | test("your-term"; "i")) | .lessonSlug' \
  bulk-downloads/SUBJECT-PHASE.json | wc -l

# If < 3 matches, the query lacks coverage — redesign
```

## Category-Specific Guidance

### precise-topic

Tests exact curriculum term matching. Should achieve MRR 1.0 easily.

```typescript
query: 'quadratic equations factorising'
expectedRelevance: {
  'factorising-quadratic-expressions': 3,
  'solving-quadratics-by-factorising': 3,
}
```

### natural-expression

Tests bridging from **natural teacher vocabulary** to curriculum metadata terminology. Teachers are professionals who know their domain — they use natural language when searching, not the exact terms that appear in lesson metadata. No meta-phrases.

```typescript
// GOOD: How a teacher would naturally phrase it
query: 'fake emails and online scams'
description: 'Tests teacher vocabulary → curriculum terms: "fake emails" → phishing'

// BAD: Clipped term list (belongs in precise-topic)
query: 'phishing scams social engineering'

// BAD: Advice-seeking (teachers search for topics to teach, not personal help)
query: 'how to avoid getting hacked online'

// BAD: Meta-phrase adds no value
query: 'teaching about email scams'
```

### imprecise-input

Tests search resilience to typos. ONE realistic error per query.

```typescript
query: 'brush painting techneeques'
description: 'Tests typo "techneeques" still finds painting lessons'
```

**Known limitation**: Fuzzy matching handles character edits, NOT word boundaries:

- "multiplikation" → "multiplication" works
- "timetables" → "times table" does NOT work (tokenization mismatch)

### cross-topic

Tests genuine curriculum connections, not random mashups. Intersections must exist **within a single unit or between units in the same sequence**.

```typescript
// GOOD: Real curriculum connection (concepts appear together in curriculum)
query: 'ratio and scaling in maps'

// BAD: Random concept mashup (no curriculum connection)
query: 'maps and teamwork outdoor activities'

// BAD: Concepts from unrelated sequences
query: 'fractions and volcanoes'
```

## File Structure

```text
src/lib/search-quality/ground-truth/
├── {subject}/
│   └── {phase}/
│       ├── {category}.query.ts      # Query definition
│       ├── {category}.expected.ts   # Expected relevance
│       └── index.ts                 # Combines at runtime
```

### Query File Template

```typescript
import type { GroundTruthQueryDefinition } from '../../types';

export const SUBJECT_PHASE_CATEGORY_QUERY: GroundTruthQueryDefinition = {
  query: 'your query here',
  category: 'natural-expression',
  description: 'What this query tests and why',
  expectedFile: './natural-expression.expected.ts',
} as const;
```

### Expected File Template

```typescript
import type { ExpectedRelevance } from '../../types';

export const SUBJECT_PHASE_CATEGORY_EXPECTED: ExpectedRelevance = {
  'best-match-slug': 3,
  'good-match-slug': 2,
  'related-slug': 1,
} as const;
```

## Validation

```bash
pnpm type-check              # TypeScript compilation
pnpm ground-truth:validate   # 16 semantic checks
pnpm benchmark -s SUBJECT -p PHASE --review  # Per-query results
```

### Common Validation Errors

| Error | Fix |
|-------|-----|
| `invalid-slug` | Slug doesn't exist — find correct one in bulk data |
| `empty-relevance` | Add 5 slugs total, if that is impossible minimum of 4  |
| `no-highly-relevant` | At least one slug must have score 3 |
| `too-many-slugs` | Maximum 5 — query is too broad |
| `cross-subject` | Slug belongs to wrong subject |

## Anti-Patterns

### Search Validation (NOT Independent Discovery)

**WRONG**:

1. Run benchmark
2. See search returns A, B, C
3. Use A, B, C as expected slugs

**CORRECT**:

1. Mine bulk data for candidates
2. Analyse each against query intent
3. Select best matches based on curriculum content
4. THEN compare with search results

### Query/Slug Term Mismatch

Query says "verbs" but expected slugs have "avoir" without "verb" in metadata. Search cannot match them.

Verify that expected slugs contain terms semantically connected to the query.

## Additional Resources

For full evaluation protocol (COMMIT methodology), lessons learned from 25+ review sessions, and troubleshooting:

@apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md
