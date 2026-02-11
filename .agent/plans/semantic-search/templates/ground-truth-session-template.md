# Ground Truth Design Session — Linear Protocol

**Purpose**: Design ground truth queries and mine expected slugs for a subject/phase.

**Last Updated**: 2026-01-26

---

## Core Question

> "In a full range of likely search scenarios for professional teachers, is our system providing the value they need?"

This is what ground truths must answer.

---

## Session Scope

**Subject**: [subject]  
**Phase**: `primary` / `secondary`  
**Target Query Count**: [count] (from content-weighted distribution)

### Content-Weighted Targets

| Priority | Subjects | Target |
|----------|----------|--------|
| **Highest** | maths | 10 primary, 16 secondary |
| **High** | english | 4 primary, 6 secondary |
| **High** | science | 4 primary, 8 secondary |
| **Medium** | history, geography, computing | 2 primary, 3 secondary each |
| **Medium** | PE, RE | 2 primary, 1 secondary each |
| **Medium** | french | 1 primary, 2 secondary |
| **Medium** | german, spanish, citizenship | 1-2 secondary each |
| **Low** | art, music, DT | 1 each phase |
| **Low** | cooking-nutrition | 1 primary only |

---

## Phase 0: Prerequisites

### Step 0.1: Verify Tools

```bash
cd apps/oak-search-cli
source .env.local
```

| Tool | Verification | Status |
|------|--------------|--------|
| MCP server | Call `get-help` | ☐ Working |
| Bulk data | `ls bulk-downloads/SUBJECT-PHASE.json` | ☐ Present |
| Benchmark | `pnpm benchmark --help` | ☐ Working |

**CHECKPOINT 0**: If ANY tool is unavailable → **STOP**.

### Step 0.2: Explore Curriculum Structure

```bash
# Count lessons
jq '.lessons | length' bulk-downloads/SUBJECT-PHASE.json

# List all units
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/SUBJECT-PHASE.json

# Sample lesson structure
jq '.lessons[0] | keys' bulk-downloads/SUBJECT-PHASE.json
```

**Total lessons**: [count]  
**Total units**: [count]

☐ Phase 0 complete

---

## Phase 1: Query Design

For each query target, complete the following workflow.

### Query Design Principles

1. **Natural phrasing** — how a teacher would actually type it
2. **No clipped term lists** — "bones muscles body" is wrong; "how bones and muscles work" is right
3. **No redundant subject terms** — don't say "French" when filtered to French
4. **No meta-phrases** — "lessons on" or "teaching about" adds no value
5. **Topic-focused** — teachers search for topics, not advice
6. **Verified curriculum grounding** — query terms must exist in bulk data

### Category Reference

| Category | Purpose | Count per Subject |
|----------|---------|-------------------|
| `natural-query` | How teachers actually search | Bulk of queries |
| `exact-term` | Proves BM25 works | 0-1 per subject |
| `typo-recovery` | Proves fuzzy matching works | 0-1 per subject (5 total) |
| `curriculum-connection` | Genuine topic pairings | 0-1 per subject (2 total) |
| `future-intent` | Not yet built (excluded) | 0-1 total |

---

### Query N Template

**Query Number**: [N] of [total]

#### Step 1.1: Mine Curriculum Topics

Explore bulk data to find rich topic areas:

```bash
# Search for potential topics
jq -r '.lessons[] | "\(.lessonSlug): \(.lessonTitle)"' bulk-downloads/SUBJECT-PHASE.json | head -50

# Search for specific terms
jq -r '.lessons[] | select(.lessonTitle | test("TERM"; "i")) | "\(.lessonSlug): \(.lessonTitle)"' \
  bulk-downloads/SUBJECT-PHASE.json
```

**Topic area identified**: [...]

☐ Step 1.1 complete

#### Step 1.2: Draft Natural-Phrasing Query

**Draft query**: "[...]"

**Self-check**:

| Question | Answer |
|----------|--------|
| Would a teacher type this exactly? | ☐ Yes ☐ No → revise |
| Is it natural phrasing (not clipped terms)? | ☐ Yes ☐ No → revise |
| Does it avoid redundant subject terms? | ☐ Yes ☐ No → revise |
| Does it avoid meta-phrases? | ☐ Yes ☐ No → revise |
| Is it topic-focused (not advice-seeking)? | ☐ Yes ☐ No → revise |

**Final query**: "[...]"

☐ Step 1.2 complete

#### Step 1.3: Verify Curriculum Grounding

```bash
# Verify query terms appear in curriculum
jq -r '.lessons[] | select(.lessonTitle | test("QUERY_TERM"; "i")) | "\(.lessonSlug): \(.lessonTitle)"' \
  bulk-downloads/SUBJECT-PHASE.json
```

**Matching lessons found**: [...]

**If < 3 matches**: Query lacks coverage → redesign or choose different topic.

☐ Step 1.3 complete

#### Step 1.4: Assign Category

Based on query characteristics:

- ☐ `natural-query` — Natural teacher phrasing
- ☐ `exact-term` — Exact curriculum terminology (e.g., "equivalent fractions")
- ☐ `typo-recovery` — Contains realistic typo (only if needed for quota)
- ☐ `curriculum-connection` — Combines two verified concepts
- ☐ `future-intent` — Requires intent understanding (excluded from stats)

**Category**: [...]

☐ Step 1.4 complete

#### Step 1.5: Document Query

| Field | Value |
|-------|-------|
| **Category** | [...] |
| **Query** | "[...] " |
| **Phase** | [...] |
| **Scenario** | What capability does this test? |
| **Curriculum Grounding** | What content supports this query? |
| **Rationale** | Why is this a good test? |

☐ Step 1.5 complete — **Query N designed**

---

## Phase 2: Mine Expected Slugs

For each designed query, mine expected slugs from bulk data.

### Expected Slugs Workflow

#### Step 2.1: Search for Candidates

```bash
# Search with multiple terms from the query
jq -r '.lessons[] | select(.lessonTitle | test("TERM1|TERM2"; "i")) | 
  "\(.lessonSlug): \(.lessonTitle)"' bulk-downloads/SUBJECT-PHASE.json
```

**Candidate list** (aim for 5-10):

```text
1. [slug]
2. [slug]
3. [slug]
4. [slug]
5. [slug]
```

☐ Step 2.1 complete

#### Step 2.2: Get MCP Summaries

Call `get-lessons-summary` for top candidates:

```text
1. SLUG: [slug]
   Keywords: [keywords]
   Key Learning: "[key learning]"

2. SLUG: [slug]
   Keywords: [keywords]
   Key Learning: "[key learning]"

3. SLUG: [slug]
   Keywords: [keywords]
   Key Learning: "[key learning]"
```

☐ Step 2.2 complete

#### Step 2.3: Assign Relevance Scores

Based on key learning analysis:

| Slug | Relevance | Justification |
|------|-----------|---------------|
| [...] | 3 | Direct match: [...] |
| [...] | 2 | Related: [...] |
| [...] | 1 | Tangential: [...] |

**Relevance scoring**:

- **3 = Direct match**: Lesson is exactly what the query is looking for
- **2 = Related**: Lesson covers the topic but isn't the primary focus
- **1 = Tangential**: Lesson touches on the topic peripherally

**Rules**:

- **5 slugs per query** (minimum 4 if curriculum genuinely limited)
- Slugs can come from different units (cross-unit allowed)
- At least one must be relevance 3
- Vary scores (not all the same)
- Every score must be justified with key learning evidence

☐ Step 2.3 complete

---

## Phase 3: Validation

### Step 3.1: Compile All Queries

Copy all designed queries to `queries-redesigned.md`:

```bash
# Verify document structure
head -100 docs/ground-truths/queries-redesigned.md
```

☐ Step 3.1 complete

### Step 3.2: Update Progress Tracker

Update the progress tracker in `queries-redesigned.md`:

| Subject | Primary | Secondary | Total | Status |
|---------|---------|-----------|-------|--------|
| [...] | [...] | [...] | [...] | Complete |

☐ Step 3.2 complete

### Step 3.3: Verify Total Count

**Target**: ~85 queries total  
**Actual**: [...] queries

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total queries | [...] | ~85 | ☐ Pass |
| natural-query | [...] | ~73 | ☐ Pass |
| exact-term | [...] | ~6 | ☐ Pass |
| typo-recovery | [...] | ~5 | ☐ Pass |
| curriculum-connection | [...] | ~2 | ☐ Pass |

☐ Step 3.3 complete

---

## Phase 4: Implementation (Stage 3)

After all queries are designed and expected slugs mined, implement in code.

### Step 4.1: Create Query Files

For each query, create `*.query.ts`:

```typescript
/**
 * Query definition for {category} ground truth.
 * @packageDocumentation
 */
import type { GroundTruthQueryDefinition } from '../../types';

export const {SUBJECT}_{PHASE}_{CATEGORY}_QUERY: GroundTruthQueryDefinition = {
  query: 'your query here',
  category: '{category}',
  description: 'What this query tests',
  expectedFile: './{category}.expected.ts',
} as const;
```

### Step 4.2: Create Expected Files

For each query, create `*.expected.ts`:

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

### Step 4.3: Validate Implementation

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject SUBJECT --phase PHASE --verbose
```

☐ Phase 4 complete

---

## Session Summary

**Subject/Phase**: [subject/phase]  
**Queries Designed**: [count]  
**Categories Used**:

- natural-query: [count]
- exact-term: [count]
- typo-recovery: [count]
- curriculum-connection: [count]
- future-intent: [count]

**Key Decisions**:

1. [decision]
2. [decision]
3. [decision]

**Notes for Future Sessions**:

1. [note]
2. [note]

---

## Quick Reference

### Bulk Data Commands

```bash
cd apps/oak-search-cli

# List files
ls bulk-downloads/*.json

# Count lessons
jq '.lessons | length' bulk-downloads/SUBJECT-PHASE.json

# Search titles
jq -r '.lessons[] | select(.lessonTitle | test("TERM"; "i")) | 
  "\(.lessonSlug): \(.lessonTitle)"' bulk-downloads/SUBJECT-PHASE.json

# List units
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle)"' bulk-downloads/SUBJECT-PHASE.json

# Lessons in a unit
jq -r '.sequence[] | select(.unitSlug == "UNIT") | .unitLessons[] | 
  "\(.lessonSlug): \(.lessonTitle)"' bulk-downloads/SUBJECT-PHASE.json
```

### MCP Tools

- `get-lessons-summary`: Get lesson keywords and key learning
- `get-units-summary`: Get unit structure and lesson ordering
- `get-help`: Reference for all available tools

### Validation Commands

```bash
pnpm type-check              # TypeScript
pnpm ground-truth:validate   # 16 semantic checks
pnpm benchmark --verbose     # Full metrics
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [queries-redesigned.md](../../../apps/oak-search-cli/docs/ground-truths/queries-redesigned.md) | Query design output |
| [GROUND-TRUTH-GUIDE.md](../../../apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles and evaluation |
| [IR-METRICS.md](../../../apps/oak-search-cli/docs/IR-METRICS.md) | Metric definitions |
| [ground-truth-redesign-plan.md](../active/ground-truth-redesign-plan.md) | Current strategy |
