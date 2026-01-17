# Ground Truth Review Session Template

Use this template when creating Cursor plans for ground truth review sessions.

---

## Cursor Plan Frontmatter

```yaml
---
name: Ground Truth Session N
overview: "Session N: Comprehensive ground truth review for SUBJECT/PHASE (4 queries, X lessons in pool). Uses ALL relevant MCP tools AND bulk data."
todos:
  - id: prereq
    content: "Prerequisites: Verify MCP server, ES access, bulk data, list ALL lessons"
    status: pending
  - id: cat1-bulk
    content: "precise-topic: Search bulk data for ALL relevant lessons"
    status: pending
  - id: cat1-mcp
    content: "precise-topic: Get MCP summaries (get-lessons-summary) for 5-10 candidates"
    status: pending
  - id: cat1-unit
    content: "precise-topic: Get unit context (get-units-summary) if skill-level query"
    status: pending
  - id: cat1-compare
    content: "precise-topic: Create comparison table, select BEST matches"
    status: pending
  - id: cat2-bulk
    content: "natural-expression: Search bulk data for ALL relevant lessons"
    status: pending
  - id: cat2-mcp
    content: "natural-expression: Get MCP summaries for 5-10 candidates"
    status: pending
  - id: cat2-unit
    content: "natural-expression: Get unit context (get-units-summary) — CRITICAL for beginner queries"
    status: pending
  - id: cat2-compare
    content: "natural-expression: Create comparison table, select BEST matches"
    status: pending
  - id: cat3-bulk
    content: "imprecise-input: Search bulk data for ALL relevant lessons"
    status: pending
  - id: cat3-mcp
    content: "imprecise-input: Get MCP summaries for 5-10 candidates"
    status: pending
  - id: cat3-compare
    content: "imprecise-input: Create comparison table, select BEST matches"
    status: pending
  - id: cat4-bulk
    content: "cross-topic: Search bulk data for ALL relevant lessons"
    status: pending
  - id: cat4-mcp
    content: "cross-topic: Get MCP summaries for 5-10 candidates"
    status: pending
  - id: cat4-compare
    content: "cross-topic: Create comparison table, select BEST matches"
    status: pending
  - id: verify
    content: "Verification: Review ALL lessons list for missed candidates"
    status: pending
  - id: validate
    content: "Validation: type-check, ground-truth:validate, benchmark"
    status: pending
  - id: docs
    content: "Documentation: Update checklist, prompt, current-state"
    status: pending
---
```

---

## Plan Body Template

```markdown
# Ground Truth Review Session N: SUBJECT/PHASE

## Required Standard

**Use ALL relevant MCP tools AND bulk data** for every category.

| Tool | Purpose | Required |
|------|---------|----------|
| **Bulk data** (`jq`) | Find ALL candidate lessons | ✓ Always |
| **`get-lessons-summary`** | Keywords, key learning points | ✓ For 5-10 candidates |
| **`get-units-summary`** | Lesson ordering in unit | ✓ For skill-level queries |
| **`gt-review`** | Actual search results | ✓ Always |

---

## Prerequisites

```bash
cd apps/oak-open-curriculum-semantic-search
source .env.local

# Verify MCP server — call get-help
# Verify ES access
curl -s "\${ELASTICSEARCH_URL}/oak_lessons/_count" \
  -H "Authorization: ApiKey \${ELASTICSEARCH_API_KEY}" | jq '.count'

# Verify bulk data
jq '.lessons | length' bulk-downloads/SUBJECT-PHASE.json

# LIST ALL LESSONS (do once, scan for non-obvious candidates)
jq -r '.lessons[] | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/SUBJECT-PHASE.json | sort
```

**IMPORTANT**: Scan the full lesson list to identify lessons that might be relevant but wouldn't match title-based searches. MCP key learning points may reveal relevance not visible in titles.

---

## Category 1: precise-topic

**Current query**: "QUERY"
**Current expected**: SLUGS

### Step 1: Search bulk data

```bash
# Find ALL lessons matching query terms
jq -r '.lessons[] | select(.lessonTitle | test("TERM1|TERM2"; "i")) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/SUBJECT-PHASE.json
```

### Step 2: Get MCP summaries for 5-10 candidates

Use `get-lessons-summary` for each candidate to compare key learning points.

### Step 3: Get unit context (if skill-level query)

Use `get-units-summary` to understand lesson ordering within relevant units.

### Step 4: Create comparison table

| Slug | Unit | Lesson # | Key Learning | Relevance |
|------|------|----------|--------------|-----------|
| slug-1 | Unit Name | 1 | ... | Score=? |
| slug-2 | Unit Name | 3 | ... | Score=? |

### Step 5: Run gt-review

```bash
pnpm gt-review --subject SUBJECT --phase PHASE --category precise-topic
```

### Step 6: Select BEST matches and update ground truth

---

## Category 2: natural-expression

**Current query**: "QUERY"
**Current expected**: SLUGS

### Key consideration

Parse the query for ACTION verbs (e.g., "learning to cook" → practical lessons, not theory).

### Step 1: Search bulk data

```bash
jq -r '.lessons[] | select(.lessonTitle | test("TERM1|TERM2"; "i")) | "\(.lessonSlug) | \(.lessonTitle) | \(.unitTitle)"' bulk-downloads/SUBJECT-PHASE.json
```

### Step 2: Get MCP summaries for 5-10 candidates

### Step 3: Get unit context — CRITICAL for beginner/skill-level queries

Use `get-units-summary` to verify:

- Which lessons are FIRST in unit (true beginner content)
- Which lessons are END of unit (capstone/advanced)

### Step 4: Create comparison table

### Step 5: Run gt-review

### Step 6: Select BEST matches

---

## Category 3: imprecise-input

**Current query**: "QUERY" (note any intentional typos)
**Current expected**: SLUGS

### Step 1: Search bulk data

### Step 2: Get MCP summaries for 5-10 candidates

### Step 3: Create comparison table

Focus on: Which lessons match the SEMANTIC INTENT of the query (ignoring the typo)?

### Step 4: Run gt-review

### Step 5: Select BEST matches

---

## Category 4: cross-topic

**Current query**: "QUERY"
**Current expected**: SLUGS

### Step 1: Search bulk data

Search for BOTH/ALL concepts in the query:

```bash
# Find lessons for concept 1
jq -r '.lessons[] | select(.lessonTitle | test("CONCEPT1"; "i"))' ...

# Find lessons for concept 2
jq -r '.lessons[] | select(.lessonTitle | test("CONCEPT2"; "i"))' ...
```

### Step 2: Get MCP summaries for candidates

### Step 3: Create comparison table

Focus on: Which lessons explicitly combine BOTH/ALL concepts?

### Step 4: Run gt-review

### Step 5: Select BEST matches

---

## Verification Step

Before finalising, ask: "Am I confident I've found the BEST lessons?"

1. Review the full lesson list (from Prerequisites)
2. Check if any lessons with non-obvious titles might be relevant
3. Get MCP summaries for any additional candidates
4. The key learning points may reveal relevance not visible in titles

---

## Validation

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject SUBJECT --phase PHASE --verbose
```

---

## Documentation Updates

1. Update checklist in `.agent/plans/semantic-search/active/ground-truth-review-checklist.md`
2. Update prompt next session in `.agent/prompts/semantic-search/semantic-search.prompt.md`
3. Update progress in `.agent/plans/semantic-search/current-state.md`

---

## Session Completion Summary

| Category | MRR | NDCG | P@3 | R@10 | Key Finding |
|----------|-----|------|-----|------|-------------|
| precise-topic | X.XXX | X.XXX | X.XXX | X.XXX | ... |
| natural-expression | X.XXX | X.XXX | X.XXX | X.XXX | ... |
| imprecise-input | X.XXX | X.XXX | X.XXX | X.XXX | ... |
| cross-topic | X.XXX | X.XXX | X.XXX | X.XXX | ... |

### Changes Made

1. **Category**: What changed and why

### Key Learning

Any new insights to add to documentation.

```

---

## Checklist for Plan Completeness

Before starting a session, verify the plan includes:

- [ ] Prerequisites verification step (including list ALL lessons)
- [ ] Bulk data search for EVERY category
- [ ] MCP `get-lessons-summary` for 5-10 candidates per category
- [ ] MCP `get-units-summary` for skill-level queries (especially natural-expression)
- [ ] Comparison table creation for EVERY category
- [ ] `gt-review` execution for EVERY category
- [ ] Verification step (review full lesson list for missed candidates)
- [ ] Validation step (type-check, validate, benchmark)
- [ ] Documentation update step
- [ ] Session completion summary template

---

## Anti-Patterns to Avoid

1. **Validating existing slugs instead of exploring**: Don't just check if current slugs appear in results
2. **Skipping `get-units-summary`**: Critical for understanding lesson ordering
3. **Using end-of-unit lessons for beginner queries**: Lessons 5-6 are often capstone content
4. **Accepting low MRR without investigation**: Lower MRR with correct ground truth is valuable information
5. **Gaming benchmarks**: Ground truth correctness > benchmark scores
6. **Only searching by title keywords**: MCP key learning points may reveal relevance not visible in titles — review ALL lessons in pool
7. **Ignoring query verbs**: "learning to cook" indicates practical cooking lessons, not theory. Match the action implied by the query.
8. **Skipping verification**: Always ask "Am I confident?" before finalising. Get MCP summaries for any suspicious lessons.