---
name: Ground Truth Session 4
overview: Review and verify computing/primary ground truths (4 categories) using the three-method evidence process, ensuring expected slugs represent what search SHOULD return for each query.
todos:
  - id: recommit-foundations
    content: Re-read foundation docs (rules.md, testing-strategy.md, schema-first-execution.md) at start and after 2 categories
    status: completed
  - id: verify-prerequisites
    content: "Verify all 3 exploration methods available: gt-review, ES access, MCP server. Confirm bulk data exists."
    status: completed
  - id: review-precise-topic
    content: Review computing/primary precise-topic with 3-method evidence process
    status: completed
  - id: review-natural-expression
    content: Review computing/primary natural-expression with 3-method evidence process
    status: completed
  - id: review-imprecise-input
    content: Review computing/primary imprecise-input with 3-method evidence process (TSDoc shows MRR 0.333 - needs investigation)
    status: completed
  - id: review-cross-topic
    content: Review computing/primary cross-topic with 3-method evidence process
    status: completed
  - id: validate-benchmark
    content: Run type-check, ground-truth:validate, benchmark --subject computing --phase primary --verbose
    status: completed
  - id: update-docs
    content: Update checklist progress and GROUND-TRUTH-GUIDE.md lessons learned if new insights emerge
    status: completed
---

# Ground Truth Review Session 4: computing/primary

**ALL steps in this plan are REQUIRED. There are no optional steps. Execute every step for every category.**

## Foundation Commitment

Before any work, re-read and recommit to:

- [rules.md](/.agent/directives-and-memory/rules.md) - TDD, no type shortcuts, fail fast
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) - TDD at ALL levels
- [schema-first-execution.md](/.agent/directives-and-memory/schema-first-execution.md) - Generator is source of truth

**Mid-session checkpoint**: Re-read these after completing 2 categories.

## Important Distinction

**Ground truth review** is about **specification correctness** - ensuring ground truths accurately represent what search SHOULD return. This is fixing the answer key.

**Search optimisation** is a separate, later task about improving system behaviour to achieve better scores. We do not conflate these.

---

## Session Prerequisites

Before proceeding, verify all three exploration methods are available:

1. **Search service** - `pnpm gt-review --subject computing --phase primary`
2. **Direct ES access** - `source .env.local` then test curl against `${ELASTICSEARCH_URL}`
3. **MCP server** - `oak-local` must be available for curriculum exploration

**Bulk data**: Verify `bulk-downloads/computing-primary.json` exists (already downloaded in Session 3).

**If any tool is unavailable: STOP and wait for user to fix.**

---

## Current State (computing/primary)

| Category | Query | TSDoc MRR | Status |

|----------|-------|-----------|--------|

| precise-topic | "digital painting Year 1" | - | Pending review |

| natural-expression | "staying safe on computers" | - | Pending review |

| imprecise-input | "how does the internat work" | 0.333 | **Needs investigation** |

| cross-topic | "programming and code sequences" | - | Pending review |

**Note**: The imprecise-input TSDoc comment shows MRR 0.333, which may indicate the expected slugs need correction.

Files: [src/lib/search-quality/ground-truth/computing/primary/](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/computing/primary/)

---

## Review Process (Per Category)

For each ground truth, execute ALL six steps. Do not skip any step.

### Step 1: Evaluate Query Design

- **Differentiation**: "What does matching specific results for this query tell us, given we're already filtering to computing + primary?"
- **Structure coverage**: Will this query work for lessons without transcripts?

### Step 2: Run gt-review

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm gt-review --subject computing --phase primary --category <category>
```

### Step 3: Direct ES Diagnostics

```bash
source .env.local
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"bool": {"must": [{"match": {"lesson_structure": "YOUR_QUERY"}}], "filter": [{"term": {"subject_slug": "computing"}}]}}, "size": 5, "_source": ["lesson_slug", "lesson_title"]}' | jq '.hits.hits[]._source'
```

### Step 4: MCP Curriculum Exploration

Do not just accept top-ranked results. Use MCP tools to find qualitatively best matches:

- `get-search-lessons`: q="your query", subject="computing"
- `get-key-stages-subject-lessons`: keyStage="ks1" or "ks2", subject="computing"
- `get-lessons-summary`: lesson="lesson-slug"

**Goal**: Find lessons that SHOULD rank highly, not just what currently does.

### Step 5: Bulk Data Exploration

```bash
jq -r '.lessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | "\(.lessonSlug) | \(.lessonTitle)"' bulk-downloads/computing-primary.json
```

### Step 6: Update Ground Truth File

Based on evidence from Steps 1-5, review and update:

- Query - ensure it has differentiation power
- `expectedRelevance` - ensure slugs are qualitatively best matches
- Description - ensure it explains what the test proves
- TSDoc comment - add review date and rationale

---

## Category-Specific Guidance

### precise-topic

Current query: "digital painting Year 1"

Expected slugs:

- `painting-using-computers` (3)
- `creating-digital-pictures-in-the-style-of-an-artist` (2)
- `using-lines-and-shapes-to-create-digital-pictures` (2)

**Verify**: Are these the best matches for digital painting content at primary level? Does "Year 1" add useful differentiation?

### natural-expression

Current query: "staying safe on computers"

Expected slugs:

- `using-information-technology-safely` (3)
- `making-choices-when-using-information-technology` (2)

**Verify**: Does "staying safe" bridge correctly to IT safety curriculum terms? Are there other safety-related lessons that should be included?

### imprecise-input

Current query: "how does the internat work" (typo: internat)

Expected slugs:

- `the-internet-and-world-wide-web` (3)
- `connecting-networks` (2)

**Scrutinise**: TSDoc shows MRR 0.333 - this suggests expected slugs may not be appearing in top results. Investigate:

1. Does ES fuzziness handle "internat" typo?
2. Are the expected slugs the best matches for "how does the internet work"?
3. May need different expected slugs or different query

### cross-topic

Current query: "programming and code sequences"

Expected slugs:

- `combining-code-blocks-in-a-sequence` (3)
- `programming-sequences` (2)

**Verify**: Do these lessons truly combine BOTH programming AND sequences concepts? Is the query differentiated enough within computing?

---

## Validation (After All 4 Categories)

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject computing --phase primary --verbose
```

All must pass before session is complete.

---

## Documentation Updates

After validation:

1. Update checklist progress in [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md)
2. Record findings for each category (MRR, changes made, rationale)
3. Update [GROUND-TRUTH-GUIDE.md](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) "Lessons Learned" section if new insights emerge

---

## Key Reference Documents

- [GROUND-TRUTH-GUIDE.md](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) - Single source of truth
- [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) - Session entry point
- [ADR-085](/docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) - Validation discipline
