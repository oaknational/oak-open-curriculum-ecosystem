---
name: Ground Truth Session 3
overview: Review and verify citizenship/secondary ground truths (4 categories) using the three-method evidence process, ensuring expected slugs represent what search SHOULD return for each query.
todos:
  - id: recommit-foundations
    content: Re-read foundation docs (rules.md, testing-strategy.md, schema-first-execution.md) at start and after 2 categories
    status: completed
  - id: verify-prerequisites
    content: "Verify all 3 exploration methods available: gt-review, ES access, MCP server. Download bulk data."
    status: completed
  - id: review-precise-topic
    content: Review citizenship/secondary precise-topic with 3-method evidence process
    status: completed
  - id: review-natural-expression
    content: Review citizenship/secondary natural-expression with 3-method evidence process
    status: completed
  - id: review-imprecise-input
    content: Review citizenship/secondary imprecise-input with 3-method evidence process
    status: completed
  - id: review-cross-topic
    content: Review citizenship/secondary cross-topic with 3-method evidence process
    status: completed
  - id: validate-benchmark
    content: Run type-check, ground-truth:validate, benchmark --subject citizenship --phase secondary --verbose
    status: completed
  - id: update-docs
    content: Update checklist progress and GROUND-TRUTH-GUIDE.md lessons learned if new insights emerge
    status: completed
---

# Ground Truth Review Session 3: citizenship/secondary

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

1. **Search service** - `pnpm gt-review --subject citizenship --phase secondary`
2. **Direct ES access** - `source .env.local` then test curl against `${ELASTICSEARCH_URL}`
3. **MCP server** - `oak-local` must be available for curriculum exploration

**Bulk data**: Run `pnpm bulk:download` in `apps/oak-open-curriculum-semantic-search` to get `citizenship-secondary.json`

**If any tool is unavailable: STOP and wait for user to fix.**

---

## Current State (citizenship/secondary)

| Category | Query | Status |

|----------|-------|--------|

| precise-topic | "democracy voting elections UK" | Pending review |

| natural-expression | "being fair to everyone rights" | Pending review |

| imprecise-input | "parliment functions and roles" | Pending review |

| cross-topic | "democracy and laws together" | Pending review |

Files: [src/lib/search-quality/ground-truth/citizenship/secondary/](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/citizenship/secondary/)

---

## Review Process (Per Category)

For each ground truth, execute ALL six steps. Do not skip any step.

### Step 1: Evaluate Query Design

- **Differentiation**: "What does matching specific results for this query tell us, given we're already filtering to citizenship + secondary?"
- **Structure coverage**: Will this query work for lessons without transcripts?

### Step 2: Run gt-review

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm gt-review --subject citizenship --phase secondary --category <category>
```

### Step 3: Direct ES Diagnostics

```bash
source .env.local
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"bool": {"must": [{"match": {"lesson_structure": "YOUR_QUERY"}}], "filter": [{"term": {"subject_slug": "citizenship"}}]}}, "size": 5, "_source": ["lesson_slug", "lesson_title"]}' | jq '.hits.hits[]._source'
```

### Step 4: MCP Curriculum Exploration

Do not just accept top-ranked results. Use MCP tools to find qualitatively best matches:

- `get-search-lessons`: q="your query", subject="citizenship"
- `get-key-stages-subject-lessons`: keyStage="ks3" or "ks4", subject="citizenship"
- `get-lessons-summary`: lesson="lesson-slug"

**Goal**: Find lessons that SHOULD rank highly, not just what currently does.

### Step 5: Bulk Data Exploration

```bash
jq -r '.lessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | "\(.lessonSlug) | \(.lessonTitle)"' bulk-downloads/citizenship-secondary.json
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

Current query: "democracy voting elections UK"

Expected slugs:

- `how-can-we-tell-if-the-uk-is-democratic` (3)
- `how-do-elections-in-the-uk-work` (3)
- `why-does-voting-matter` (2)

**Verify**: These look well-matched to the query. Confirm they are the best matches for UK democracy/elections/voting.

### natural-expression

Current query: "being fair to everyone rights"

Expected slugs:

- `what-does-fairness-mean-in-society` (3)
- `why-do-we-need-laws-on-equality-in-the-uk` (2)
- `what-are-rights-and-where-do-they-come-from` (2)

**Verify**: Does colloquial "being fair" correctly bridge to equality/fairness lessons? Are there better natural-language matches?

### imprecise-input

Current query: "parliment functions and roles" (typo: parliment)

Expected slugs:

- `what-is-parliament-and-what-are-its-functions` (3)
- `should-parliamentary-procedures-be-modernised` (2)

**Verify**: Does ES fuzziness + ELSER handle the "parliment" typo? Are these the best parliament-related lessons?

### cross-topic

Current query: "democracy and laws together"

Expected slugs:

- `what-does-it-mean-to-live-in-a-democracy` (3)
- `what-are-rights-and-where-do-they-come-from` (3)
- `what-is-the-right-to-protest-within-a-democracy-with-the-rule-of-law` (2)

**Scrutinise**: This query feels quite broad for citizenship (democracy + laws are core topics). Consider whether it has enough differentiation power, or whether expected slugs truly combine BOTH concepts.

---

## Validation (After All 4 Categories)

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject citizenship --phase secondary --verbose
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
