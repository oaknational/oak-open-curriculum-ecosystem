---
name: Problematic Queries Remediation
overview: "Fix 5 problematic zero-hit queries by following the Ground Truth Protocol: Phase 1A (query analysis), Phase 1B (discovery + COMMIT), Phase 1C (comparison). Each fix requires verifying hypotheses from the investigation document against actual curriculum data before making changes."
todos:
  - id: q1-discovery
    content: "Query 1 (cooking-nutrition cross-topic): Phase 1A analysis + Phase 1B discovery using bulk data + MCP"
    status: completed
  - id: q1-commit-compare
    content: "Query 1: COMMIT rankings, run benchmark, three-way comparison, make fix"
    status: completed
  - id: q2-discovery
    content: "Query 2 (english imprecise-input): Phase 1A + 1B discovery"
    status: completed
  - id: q2-commit-compare
    content: "Query 2: COMMIT, benchmark, comparison, fix"
    status: completed
  - id: q3-discovery
    content: "Query 3 (history imprecise-input): Phase 1A + 1B discovery"
    status: completed
  - id: q3-commit-compare
    content: "Query 3: COMMIT, benchmark, comparison, fix"
    status: completed
  - id: q4-discovery
    content: "Query 4 (PE imprecise-input): Phase 1A + 1B discovery - verify vocabulary issue"
    status: completed
  - id: q4-commit-compare
    content: "Query 4: COMMIT, benchmark, comparison, redesign query if needed"
    status: completed
  - id: q5-discovery
    content: "Query 5 (french natural-expression): Phase 1A + 1B discovery"
    status: completed
  - id: q5-commit-compare
    content: "Query 5: COMMIT, benchmark, comparison, redesign query if needed"
    status: completed
  - id: validation
    content: Run type-check, ground-truth:validate, benchmarks for all affected subjects
    status: completed
  - id: documentation
    content: Update problematic-queries-investigation.md with findings and fixes
    status: completed
---

# Problematic Queries Remediation Plan

## Context

The [problematic-queries-investigation.md](.agent/plans/semantic-search/active/problematic-queries-investigation.md) identifies 7 Priority 1 (zero-hit) queries. The investigation contains **hypotheses** about fixes, but these must be **verified** through actual curriculum exploration before changes are made.

**Critical lesson**: The previous attempt failed because changes were made based on hypotheses without verifying:

- Whether proposed slugs exist in bulk data
- Whether proposed slugs actually match query intent (via MCP summaries)
- The proper 1A → 1B → 1C protocol

## Scope: 5 Actionable Items

| Query | Subject/Phase | Category | Investigation Hypothesis |

|-------|---------------|----------|-------------------------|

| `nutrition and cooking techniques together` | cooking-nutrition/secondary | cross-topic | GT slugs are theory-only, need cooking+nutrition |

| `narative writing storys iron man Year 3` | english/primary | imprecise-input | GT incomplete, add story-focused slug |

| `vikins and anglo saxons` | history/primary | imprecise-input | GT too narrow, needs both-topics lesson |

| `footbal skills ks2` | physical-education/primary | imprecise-input | Query uses vocabulary not in curriculum |

| `teach French negative sentences year 7` | french/secondary | natural-expression | Query uses English for French curriculum |

**Already done**: `timetables` synonym (exists in [maths.ts](packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/maths.ts) lines 53-63)

**Blocked**: `coding for beginners...` requires query rules (future feature)

## Protocol for Each Query

Per [ground-truth-session-template.md](.agent/plans/semantic-search/templates/ground-truth-session-template.md):

### Phase 1A: Query Analysis (Reflection Only)

- Read query from `.query.ts` file
- Assess: Is this a good test of the category's capability?
- Identify design issues

### Phase 1B: Discovery + COMMIT

- Search bulk data with multiple terms (10+ candidates)
- Get MCP summaries (5-10 lessons)
- Analyse candidates against query intent
- COMMIT rankings BEFORE benchmark

### Phase 1C: Comparison

- Run benchmark with `--review`
- Create three-way comparison (YOUR rankings vs SEARCH vs EXPECTED)
- Answer: What are the BEST slugs?

---

## Query 1: `nutrition and cooking techniques together`

**Files**:

- Query: [cooking-nutrition/secondary/cross-topic.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/cooking-nutrition/secondary/cross-topic.query.ts)
- Expected: [cooking-nutrition/secondary/cross-topic.expected.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/cooking-nutrition/secondary/cross-topic.expected.ts)
- Bulk: `bulk-downloads/cooking-nutrition-secondary.json`

**Investigation hypothesis**: Current slugs (`eat-well-now`, `making-better-food-and-drink-choices`) are theory-only. Proposed replacements combine nutrition + cooking.

**Verification needed**:

1. Confirm current slugs are theory-only via MCP summaries
2. Find lessons that genuinely combine BOTH nutrition AND cooking techniques
3. Get MCP summaries to verify key learning includes both concepts

---

## Query 2: `narative writing storys iron man Year 3`

**Files**:

- Query: [english/primary/imprecise-input.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/english/primary/imprecise-input.query.ts)
- Expected: [english/primary/imprecise-input.expected.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/english/primary/imprecise-input.expected.ts)
- Bulk: `bulk-downloads/english-primary.json`

**Investigation hypothesis**: Add `sequencing-and-retelling-the-story-of-the-iron-man` because it matches "storys" better.

**Verification needed**:

1. Confirm this slug exists in bulk data
2. Get MCP summary to verify it's relevant to "storys" aspect
3. Compare with existing expected slugs

---

## Query 3: `vikins and anglo saxons`

**Files**:

- Query: [history/primary/imprecise-input.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/history/primary/imprecise-input.query.ts)
- Expected: [history/primary/imprecise-input.expected.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/history/primary/imprecise-input.expected.ts)
- Bulk: `bulk-downloads/history-primary.json`

**Investigation hypothesis**: Add `how-the-vikings-changed-britain` which covers both topics.

**Verification needed**:

1. Confirm this slug exists in bulk data
2. Get MCP summary to verify it covers BOTH Vikings AND Anglo-Saxons
3. Assess if current GT is truly "too narrow" or if the slug is invalid

---

## Query 4: `footbal skills ks2`

**Files**:

- Query: [physical-education/primary/imprecise-input.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/physical-education/primary/imprecise-input.query.ts)
- Expected: [physical-education/primary/imprecise-input.expected.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/physical-education/primary/imprecise-input.expected.ts)
- Bulk: `bulk-downloads/physical-education-primary.json`

**Investigation hypothesis**: Curriculum uses "feet" not "football". Query needs redesign.

**Verification needed**:

1. Search bulk data for "football" — confirm it doesn't exist
2. Confirm curriculum terminology is "feet", "dribbling", etc.
3. Design alternative query that tests imprecise-input with curriculum vocabulary

---

## Query 5: `teach French negative sentences year 7`

**Files**:

- Query: [french/secondary/natural-expression.query.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/french/secondary/natural-expression.query.ts)
- Expected: [french/secondary/natural-expression.expected.ts](apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/french/secondary/natural-expression.expected.ts)
- Bulk: `bulk-downloads/french-secondary.json`

**Investigation hypothesis**: Query uses English vocabulary for French curriculum concepts. Redesign needed.

**Verification needed**:

1. Confirm curriculum uses "negation" or "ne...pas" terminology
2. Search for what French lessons actually contain
3. Design alternative query that tests natural-expression appropriately

---

## Validation Phase

After all fixes:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check
pnpm ground-truth:validate
```

Run benchmarks for affected subject-phases:

```bash
pnpm benchmark -s cooking-nutrition -p secondary --review
pnpm benchmark -s english -p primary --review
pnpm benchmark -s history -p primary --review
pnpm benchmark -s physical-education -p primary --review
pnpm benchmark -s french -p secondary --review
```

---

## Success Criteria

- All 5 queries have non-zero MRR
- All fixes verified through proper discovery protocol
- `pnpm ground-truth:validate` passes
- Documentation updated in [problematic-queries-investigation.md](.agent/plans/semantic-search/active/problematic-queries-investigation.md)
