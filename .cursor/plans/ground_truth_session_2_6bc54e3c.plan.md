---
name: Ground Truth Session 2
overview: Review and correct art/secondary ground truths (4 categories) using the three-method evidence process, ensuring expected slugs represent what search SHOULD return, then validate and update documentation.
todos:
  - id: recommit-foundations
    content: Re-read foundation docs (rules.md, testing-strategy.md, schema-first-execution.md) at start and after 2 categories
    status: completed
  - id: verify-prerequisites
    content: "Verify all 3 exploration methods available: gt-review, ES access, MCP server. Download bulk data."
    status: completed
  - id: review-precise-topic
    content: Review art/secondary precise-topic with 3-method evidence process
    status: completed
  - id: review-natural-expression
    content: Review art/secondary natural-expression with 3-method evidence process
    status: completed
  - id: review-imprecise-input
    content: Review art/secondary imprecise-input with 3-method evidence process
    status: completed
  - id: review-cross-topic
    content: Review art/secondary cross-topic with 3-method evidence process
    status: completed
  - id: validate-benchmark
    content: Run type-check, ground-truth:validate, benchmark --subject art --phase secondary --verbose
    status: completed
  - id: update-docs
    content: Update checklist progress and GROUND-TRUTH-GUIDE.md lessons learned
    status: completed
---

# Ground Truth Review Session 2: art/secondary

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

1. **Search service** - `pnpm gt-review --subject art --phase secondary`
2. **Direct ES access** - `source .env.local` then test curl against `${ELASTICSEARCH_URL}`
3. **MCP server** - `oak-local` must be available for curriculum exploration

**Bulk data**: Run `pnpm bulk:download` in `apps/oak-open-curriculum-semantic-search` to get `art-secondary.json`

**If any tool is unavailable: STOP and wait for user to fix.**

---

## Current State (art/secondary)

| Category | Query | TSDoc MRR | Status |

|----------|-------|-----------|--------|

| precise-topic | "abstract painting techniques" | 1.000 | Pending review |

| natural-expression | "feelings in pictures" | 0.833 | Pending review |

| imprecise-input | "teach drawing skills beginers" | 0.500 | Pending review |

| cross-topic | "portraits and colour expression" | 0.750 | Pending review |

Files: [src/lib/search-quality/ground-truth/art/secondary/](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/art/secondary/)

---

## Review Process (Per Category)

For each ground truth, execute ALL six steps. Do not skip any step.

### Step 1: Evaluate Query Design

- **Differentiation**: "What does matching specific results for this query tell us, given we're already filtering to art + secondary?"
- **Structure coverage**: Will this query work for lessons without transcripts?

### Step 2: Run gt-review

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm gt-review --subject art --phase secondary --category <category>
```

### Step 3: Direct ES Diagnostics

```bash
source .env.local
curl -s "${ELASTICSEARCH_URL}/oak_lessons/_search" \
  -H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query": {"bool": {"must": [{"match": {"lesson_structure": "YOUR_QUERY"}}], "filter": [{"term": {"subject_slug": "art"}}]}}, "size": 5, "_source": ["lesson_slug", "lesson_title"]}' | jq '.hits.hits[]._source'
```

### Step 4: MCP Curriculum Exploration

Do not just accept top-ranked results. Use MCP tools to find qualitatively best matches:

- `get-search-lessons`: q="your query", subject="art"
- `get-key-stages-subject-lessons`: keyStage="ks3" or "ks4", subject="art"
- `get-lessons-summary`: lesson="lesson-slug"

**Goal**: Find lessons that SHOULD rank highly, not just what currently does.

### Step 5: Bulk Data Exploration

```bash
jq -r '.lessons[] | select(.lessonTitle | test("KEYWORD"; "i")) | "\(.lessonSlug) | \(.lessonTitle)"' bulk-downloads/art-secondary.json
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

Current query: "abstract painting techniques"

Expected slugs: `abstract-art-painting-using-different-stimuli` (3), `abstract-art-dry-materials-in-response-to-stimuli` (3), `abstract-marks-respond-to-stimuli-by-painting` (2)

**Verify**: Do these slugs represent the best matches for abstract painting techniques in secondary art?

### natural-expression

Current query: "feelings in pictures"

Expected slugs: `personal-to-universal-art-as-connection` (3), `expressing-emotion-through-art` (2)

**Verify**: Does this colloquial phrasing correctly map to emotion/expression content? Are there better matches?

### imprecise-input

Current query: "teach drawing skills beginers" (typo: beginers)

Expected slugs: `i-cant-draw-building-confidence-through-drawing-techniques` (3), `drawing-for-different-purposes-and-needs` (2)

**Verify**: Does the system remain resilient to this typo? Are the expected slugs the best drawing fundamentals lessons for beginners?

### cross-topic

Current query: "portraits and colour expression"

Expected slugs: `exploring-portraits-through-paint` (3), `exploring-power-in-the-portrait` (2)

**Verify**: Do expected slugs truly combine BOTH concepts (portraits AND colour expression), or just touch one?

---

## Validation (After All 4 Categories)

```bash
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark --subject art --phase secondary --verbose
```

All must pass before session is complete.

---

## Documentation Updates

After validation:

1. Update checklist progress in [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md)
2. Record findings for each category (MRR, changes made, rationale)
3. Update [GROUND-TRUTH-GUIDE.md](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) "Lessons Learned" section

---

## Key Reference Documents

- [GROUND-TRUTH-GUIDE.md](/apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) - Single source of truth
- [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) - Session entry point
- [ADR-085](/docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) - Validation discipline
