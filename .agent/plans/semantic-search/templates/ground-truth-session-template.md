# Ground Truth Review Session Template

Use this template when creating Cursor plans for ground truth review sessions.

**CRITICAL**: Deep exploration is mandatory. This means:

- **5-10 MCP summaries** per category (not 1-2)
- **Comparison tables** for every category
- **Unit-level exploration** using `get-units-summary`
- Explicitly asking **"Am I confident this is the BEST?"** before finalising

---

## Cursor Plan Frontmatter

```yaml
---
name: Ground Truth Session N
overview: "Session N: DEEP ground truth review for SUBJECT/PHASE (4 queries, X lessons in pool). Uses ALL relevant MCP tools AND bulk data with DEEP EXPLORATION STANDARD: 5-10 MCP summaries per category, comparison tables, unit exploration. Goal: discover BEST possible matches, not validate current matches are 'good enough'. Metrics: MRR, NDCG, P@3, R@10."
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
  - id: cat1-confident
    content: "precise-topic: Ask 'Am I confident this is the BEST?' — if no, explore more"
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
  - id: cat2-confident
    content: "natural-expression: Ask 'Am I confident this is the BEST?' — if no, explore more"
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
  - id: cat3-confident
    content: "imprecise-input: Ask 'Am I confident this is the BEST?' — if no, explore more"
    status: pending
  - id: cat4-bulk
    content: "cross-topic: Search bulk data for ALL relevant lessons"
    status: pending
  - id: cat4-mcp
    content: "cross-topic: Get MCP summaries for 5-10 candidates"
    status: pending
  - id: cat4-compare
    content: "cross-topic: Create comparison table, verify BOTH concepts in key learning"
    status: pending
  - id: cat4-confident
    content: "cross-topic: Ask 'Am I confident this is the BEST?' — if no, explore more"
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

## DEEP EXPLORATION STANDARD (Mandatory)

This session uses the **Deep Exploration Standard** established in Session 8:

| Requirement | Minimum | Why |
|-------------|---------|-----|
| MCP summaries per category | **5-10** | Reveals non-obvious candidates |
| Comparison tables | **Every category** | Prevents "good enough" thinking |
| Unit exploration | **Every relevant unit** | Finds hidden gems |
| Confidence check | **Before finalising** | Ensures thoroughness |

### Required Tools

| Tool | Purpose | Required |
|------|---------|----------|
| **Bulk data** (`jq`) | Find ALL candidate lessons | ✓ Always |
| **`get-lessons-summary`** | Keywords, key learning points | ✓ **5-10 per category** |
| **`get-units-summary`** | Lesson ordering in unit | ✓ All skill-level queries + unit exploration |
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

### Key considerations

- Parse the query for **ACTION verbs** (e.g., "learning to cook" → practical lessons, not theory)
- Match the **INFORMAL phrasing** of the query, not just technical terms
- Example: "making things move" → lessons with "mechanisms are systems that make something move" (not "cam mechanisms")
- Verify **vocabulary bridging**: For "green design", expected slugs should use "sustainable", "environmental" in key learning

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

Focus on: Which lessons explicitly combine BOTH/ALL concepts in their key learning points?

**Important insights from Session 8:**

- **Rendering can be valid intersection**: For "sketching + materials" queries, lessons about rendering that teach "show material texture" ARE valid intersections
- **Some queries have no perfect match**: If no single lesson combines all concepts, document this and select best approximations from different angles
- **Verify BOTH concepts**: Don't assume from title — check key learning points explicitly mention both concepts

### Step 4: Run gt-review

### Step 5: Select BEST matches

---

## Verification Step (CRITICAL)

Before finalising each category, explicitly ask yourself:

> **"Am I confident I have discovered the BEST possible matches through deep exploration, rather than just assessing if the returned results are 'good enough'?"**

### Verification Checklist

- [ ] Did I get **5-10 MCP summaries** for this category? (not 1-2)
- [ ] Did I create a **comparison table** with key learning points?
- [ ] Did I explore **all relevant units** using `get-units-summary`?
- [ ] Did I check for lessons with **non-obvious titles** whose key learning reveals relevance?
- [ ] For cross-topic: Did I verify expected slugs **actually combine BOTH concepts** in their key learning?
- [ ] For natural-expression: Did I match the **informal phrasing** of the query, not just technical terms?

If any answer is "no", go back and do deeper exploration.

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

### Shallow Exploration (Most Common Problem)

1. **Getting only 1-2 MCP summaries**: You need **5-10 per category** to find non-obvious candidates
2. **Skipping comparison tables**: Without explicit comparison, you'll accept "good enough" instead of finding BEST
3. **Only searching by title keywords**: MCP key learning points reveal relevance not visible in titles
4. **Accepting "looks good" without asking "is this the BEST?"**: The deep exploration question is mandatory

### Process Shortcuts

5. **Validating existing slugs instead of exploring**: Don't just check if current slugs appear in results
6. **Skipping `get-units-summary`**: Critical for lesson ordering AND discovering hidden candidates
7. **Using end-of-unit lessons for beginner queries**: Lessons 5-6 are often capstone content

### Semantic Mismatches

8. **Cross-topic without verifying BOTH concepts**: Expected slugs must explicitly combine both concepts in key learning
9. **Natural-expression with technical terms**: Match informal phrasing ("making things move") not technical terms ("cam mechanisms")
10. **Ignoring query verbs**: "learning to cook" indicates practical cooking lessons, not theory

### Benchmark Gaming

11. **Accepting low MRR without investigation**: Lower MRR with correct ground truth is valuable information
12. **Prioritising scores over correctness**: Ground truth correctness > benchmark scores
