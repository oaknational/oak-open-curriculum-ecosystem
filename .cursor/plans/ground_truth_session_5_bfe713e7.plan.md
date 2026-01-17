---
name: Ground Truth Session 5
overview: "Session 5: Comprehensive ground truth review for computing/secondary (4 queries, 348 lessons in pool). COMPLETED 2026-01-15 with thorough MCP exploration including get-units-summary for lesson ordering."
todos:
  - id: recommit-foundations
    content: Re-read foundation docs (rules.md, testing-strategy.md) and CRITICAL exploration reminder at start
    status: completed
  - id: verify-prerequisites
    content: Verify MCP server, ES access, and bulk data (computing-secondary.json with 348 lessons)
    status: completed
  - id: review-precise-topic
    content: "COMPREHENSIVE: Search ALL Python/list lessons (expect 8-15), get MCP summaries, compare, select BEST"
    status: completed
  - id: review-natural-expression
    content: "COMPREHENSIVE: Used get-units-summary to identify lesson ordering. Selected TRUE beginner lessons (1-3) not capstone (5-6)"
    status: completed
  - id: review-imprecise-input
    content: "COMPREHENSIVE: Verified sql-searches IS querying (SELECT). sql-fundamentals is foundational (INSERT/UPDATE/DELETE)"
    status: completed
  - id: review-cross-topic
    content: "COMPREHENSIVE: Confirmed only 2 lessons explicitly combine loops + data structures"
    status: completed
  - id: validate-benchmark
    content: "PASSED: type-check, ground-truth:validate, benchmark. MRR 0.875, Filtered (excl natural-expression) MRR 1.000"
    status: completed
  - id: update-docs
    content: Updated checklist, prompt, current-state, and this plan with findings and lessons learned
    status: completed
---

# Ground Truth Review Session 5: computing/secondary

## Pre-Session: Commit to Active Exploration

**CRITICAL REMINDER**: The goal is to find THE BEST matches, not verify existing ones are "acceptable".

For EVERY category:

1. Search bulk data comprehensively with multiple terms
2. Get MCP summaries for 5-10 candidates
3. Create comparison table
4. Select the objectively best matches

**Anti-pattern**: Look at existing slugs → check they appear → "looks good"

---

## Prerequisites Verification

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local

# Verify MCP server
# Call get-help or get-ontology to confirm oak-local is responding

# Verify ES access
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_count" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" | jq '.count'

# Verify bulk data (348 lessons available)
jq '.lessons | length' bulk-downloads/computing-secondary.json
```

---

## Category 1: precise-topic

**Current query**: "Python programming lists data structures projects"

**Current expected**: `creating-lists-in-python` (3), `data-structure-projects-in-python` (3), `python-list-operations` (2)

### Step 1: Search ALL Python/lists/data-structures lessons

```bash
# Find ALL lessons about Python lists
jq -r '.lessons[] | select((.lessonTitle | test("python|list"; "i")) or (.unitTitle | test("python|list|data.?structure"; "i"))) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/computing-secondary.json

# Find lessons specifically about data structures
jq -r '.lessons[] | select(.lessonTitle | test("data.?structure|array"; "i")) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/computing-secondary.json
```

### Step 2: Get MCP summaries for ALL Python/list candidates (expect 8-15 lessons)

Use `get-lessons-summary` for each candidate to compare key learning points.

### Step 3: Create comparison table and select BEST matches

Consider: Which lessons most directly teach Python lists and data structures?

---

## Category 2: natural-expression

**Current query**: "coding for beginners programming basics introduction"

**Current expected**: `writing-a-text-based-program` (3), `variables-23785` (2), `building-a-program-using-control-structures` (2)

### Step 1: Search ALL beginner/introduction/basics lessons

```bash
# Find ALL introductory programming lessons
jq -r '.lessons[] | select((.lessonTitle | test("intro|begin|basic|first|start"; "i")) or (.unitTitle | test("intro|begin"; "i"))) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle) | \(.keyStageSlug)"' bulk-downloads/computing-secondary.json

# Find lessons in KS3 (more beginner-appropriate)
jq -r '.lessons[] | select(.keyStageSlug == "ks3") | select(.unitTitle | test("program|python|coding"; "i")) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/computing-secondary.json | head -30
```

### Step 2: Get MCP summaries for ALL introductory candidates

Focus on lessons that would be appropriate for a true beginner.

### Step 3: Compare systematically — which lessons best bridge "coding for beginners" to curriculum language?

---

## Category 3: imprecise-input

**Current query**: "databse querying lessons" (typo: databse)

**Current expected**: `sql-searches` (3), `sql-fundamentals` (2)

### Step 1: Search ALL database/SQL lessons

```bash
# Find ALL database/SQL lessons
jq -r '.lessons[] | select((.lessonTitle | test("database|sql|query"; "i")) or (.unitTitle | test("database|sql"; "i"))) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/computing-secondary.json
```

### Step 2: Get MCP summaries for ALL SQL/database candidates

Focus on lessons about "querying" specifically (the semantic intent of the query).

### Step 3: Compare — which lessons best match "database querying"?

Consider: SQL searches vs SQL fundamentals vs other SQL operations.

---

## Category 4: cross-topic

**Current query**: "programming with data structures loops"

**Current expected**: `using-for-loops-to-iterate-data-structures` (3), `iterating-through-data-structures` (2)

### Step 1: Search ALL loop + data structure lessons

```bash
# Find ALL loop-related lessons
jq -r '.lessons[] | select(.lessonTitle | test("loop|iterat|for.?loop|while"; "i")) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/computing-secondary.json

# Find lessons mentioning both loops and data structures
jq -r '.lessons[] | select((.lessonTitle | test("data.?structure"; "i")) or (.unitTitle | test("data.?structure"; "i"))) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/computing-secondary.json
```

### Step 2: Get MCP summaries for ALL iteration/loop candidates

Compare key learning points for relevance to "programming with data structures loops".

### Step 3: Identify lessons that explicitly combine loops + data structures

---

## Validation (After All 4 Categories)

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject computing --phase secondary --verbose
```

---

## Documentation Updates

1. Mark computing/secondary complete in [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md)
2. Add lessons learned to [GROUND-TRUTH-GUIDE.md](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md)
3. Update progress in [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md)

---

## Key Files

- Ground truths: `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/secondary/`
- Bulk data: `apps/oak-open-curriculum-semantic-search/bulk-downloads/computing-secondary.json` (348 lessons)
- Checklist: `.agent/plans/semantic-search/active/ground-truth-review-checklist.md`

---

## Session 5 Completion Summary (2026-01-15)

### Final Results

| Category | MRR | R@10 | Key Finding |

|----------|-----|------|-------------|

| precise-topic | 1.000 | 1.000 | All 3 expected slugs optimal |

| natural-expression | 0.500 | 0.333 | Correctly uses TRUE beginner lessons (1-3), exposes search quality issue |

| imprecise-input | 1.000 | 1.000 | sql-searches is THE querying lesson; sql-fundamentals is foundation |

| cross-topic | 1.000 | 1.000 | Only 2 lessons combine loops + data structures |

### Key Changes Made

1. **natural-expression**: Changed from Lessons 5-6 (end of unit) to Lessons 1-3 (true beginners):

   - `writing-a-text-based-program` (3) — Lesson 1, first Python lesson
   - `working-with-numerical-inputs` (2) — Lesson 2, basic variables
   - `using-selection` (2) — Lesson 3, basic selection
   - **Discovery**: Used MCP `get-units-summary` to see lesson ordering. Previous selection (Lessons 5-6) were capstone lessons, NOT beginner content.

2. **imprecise-input**: Updated description to clarify:

   - `sql-searches` teaches SELECT which IS querying
   - `sql-fundamentals` teaches INSERT/UPDATE/DELETE — foundational SQL, not querying itself

### Critical Learning

**MCP `get-units-summary` reveals lesson ordering**. For queries about "beginners", the FIRST lessons in a unit (1-3) are true beginner content. END of unit lessons (5-6) are capstone/advanced content that assumes prior knowledge.

**Ground truth correctness > benchmark scores**. The natural-expression MRR dropped from 0.500 (R@10 1.000) to 0.500 (R@10 0.333) because we now use semantically correct slugs. This correctly exposes that search doesn't optimally rank true beginner lessons — valuable information for search improvement.
