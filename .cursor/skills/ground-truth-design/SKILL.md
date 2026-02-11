---
name: ground-truth-design
description: Design ground truth queries for the Oak semantic search service using known-answer-first methodology. Use when creating new ground truths, redesigning existing queries, or working with files in src/lib/search-quality/ground-truth/.
---

# Ground Truth Design

Design ground truth queries that accurately measure search quality for the Oak curriculum search service.

## Priorities

1. **Minimal working system** — Prove the approach with ~33 foundational ground truths
2. **Product integration** — Integrate semantic search into useful teacher tools
3. **Expansion** — Once proven, plan GT expansions for improved coverage

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

### Step 1: Find Content First

Mine bulk data to identify lessons:

```bash
cd apps/oak-search-cli

# List units and lessons
jq '.sequence[] | {unit: .unitTitle, lessons: [.unitLessons[].lessonTitle]}' \
  bulk-downloads/SUBJECT-PHASE.json

# Search for keywords
jq '.lessons[] | select(.lessonKeywords | test("TERM"; "i")) | {slug: .lessonSlug, title: .lessonTitle}' \
  bulk-downloads/SUBJECT-PHASE.json
```

### Step 2: Design the Query

Create a query a teacher would realistically type:

| Rule | Requirement | Example |
|------|-------------|---------|
| Length | 3-7 words | "cell structure and function" |
| Realistic | Would a teacher type this? | Yes: "fractions unlike denominators" |
| Pedagogy aware | Professional UK teacher queries | Yes: curriculum-aligned vocabulary |
| No meta-phrases | No "teaching about", "lessons on" | Not: "lessons on fractions" |
| Topic-focused | Topics, not advice | Not: "how to teach fractions" |
| No redundant subject | Don't repeat filter context | Not: "French negation" when filtered to French |

### Step 3: Test Via test-query-lessons.ts

```bash
pnpm tsx src/lib/search-quality/test-query-lessons.ts "your query" subject keyStage
```

### Step 4: Capture Top 3 with Relevance Scores

| Score | Meaning |
|-------|---------|
| 3 | Direct match — teaches exactly what query asks |
| 2 | Related — covers topic but not directly |
| 1 | Tangential — mentions concept peripherally |

## File Structure

```text
src/lib/search-quality/ground-truth/
├── types.ts              # LessonGroundTruth type definition
├── index.ts              # Exports and accessors
├── README.md             # Overview
└── entries/              # Individual ground truths
    ├── maths-secondary.ts
    ├── maths-primary.ts
    └── ...
```

### Entry Template

```typescript
/**
 * Subject Phase ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Subject Phase ground truth: Topic description.
 */
export const SUBJECT_PHASE: LessonGroundTruth = {
  subject: 'subject-slug',
  phase: 'primary' | 'secondary',
  keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4',
  query: 'realistic teacher query here',
  expectedRelevance: {
    'best-match-slug': 3,
    'good-match-slug': 2,
    'related-slug': 2,
  },
  description: 'Brief description of what the lesson teaches and why it matches.',
} as const;
```

## Validation

```bash
pnpm type-check              # TypeScript compilation
pnpm test                    # Unit tests
```

## Anti-Patterns

### Search Validation (NOT Independent Discovery)

**WRONG**:

1. Run search
2. See search returns A, B, C
3. Use A, B, C as expected slugs

**CORRECT**:

1. Mine bulk data for candidates
2. Design query based on curriculum content
3. Run query via test-query-lessons.ts
4. Capture top 3 results with relevance scores

### Query/Slug Term Mismatch

Query says "verbs" but expected slugs have "avoir" without "verb" in metadata. Search cannot match them.

Verify that expected slugs contain terms semantically connected to the query.

## Additional Resources

For full evaluation protocol (COMMIT methodology), lessons learned from 25+ review sessions, and troubleshooting:

@apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md
