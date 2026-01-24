---
name: Priority 1 Zero-Hit Investigation
overview: "Exhaustively investigate the 7 zero-hit queries (MRR = 0.000) from the problematic queries list. For each query: critically evaluate whether it tests the right thing, explore bulk data and MCP tools independently to find the BEST possible matches, then compare against expectations and search results."
todos:
  - id: foundation
    content: Re-read foundation docs (rules.md, semantic-search.prompt.md) before starting
    status: completed
  - id: q1-1a
    content: "Query 1 (multiplikation timetables): Phase 1A - Critical query analysis"
    status: completed
  - id: q1-1b
    content: "Query 1: Phase 1B - Independent discovery using bulk data + MCP"
    status: completed
  - id: q1-1c
    content: "Query 1: Phase 1C - Compare and determine root cause"
    status: completed
  - id: q2-1a
    content: "Query 2 (footbal skills primary): Phase 1A - Critical query analysis"
    status: completed
  - id: q2-1b
    content: "Query 2: Phase 1B - Independent discovery"
    status: completed
  - id: q2-1c
    content: "Query 2: Phase 1C - Compare and determine root cause"
    status: completed
  - id: q3-1a
    content: "Query 3 (vikins and anglo saxons): Phase 1A - Critical query analysis"
    status: completed
  - id: q3-1b
    content: "Query 3: Phase 1B - Independent discovery"
    status: completed
  - id: q3-1c
    content: "Query 3: Phase 1C - Compare and determine root cause"
    status: completed
  - id: q4-1a
    content: "Query 4 (narative writing storys iron man Year 3): Phase 1A - Critical query analysis"
    status: completed
  - id: q4-1b
    content: "Query 4: Phase 1B - Independent discovery"
    status: completed
  - id: q4-1c
    content: "Query 4: Phase 1C - Compare and determine root cause"
    status: completed
  - id: q5-1a
    content: "Query 5 (teach French negative sentences year 7): Phase 1A - Critical query analysis"
    status: completed
  - id: q5-1b
    content: "Query 5: Phase 1B - Independent discovery"
    status: completed
  - id: q5-1c
    content: "Query 5: Phase 1C - Compare and determine root cause"
    status: completed
  - id: q6-1a
    content: "Query 6 (coding for beginners...): Phase 1A - Critical query analysis"
    status: completed
  - id: q6-1b
    content: "Query 6: Phase 1B - Independent discovery"
    status: completed
  - id: q6-1c
    content: "Query 6: Phase 1C - Compare and determine root cause"
    status: completed
  - id: q7-1a
    content: "Query 7 (nutrition and cooking techniques together): Phase 1A - Critical query analysis"
    status: completed
  - id: q7-1b
    content: "Query 7: Phase 1B - Independent discovery"
    status: completed
  - id: q7-1c
    content: "Query 7: Phase 1C - Compare and determine root cause"
    status: completed
  - id: update-investigation
    content: Update problematic-queries-investigation.md with all findings
    status: completed
---

# Priority 1 Zero-Hit Query Investigation

## Foundation Principles (from rules.md, testing-strategy.md)

Before each step, ask: **Could it be simpler without compromising quality?**

Before investigating each query, ask: **Is this query testing the right thing at the right layer?**

Re-read foundation documents periodically:

- [rules.md](/.agent/directives-and-memory/rules.md)
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md)
- [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md)

---

## The 7 Zero-Hit Queries

| # | Query | Location | Category |

|---|-------|----------|----------|

| 1 | `multiplikation timetables` | maths/primary/imprecise-input-2 | imprecise-input |

| 2 | `footbal skills primary` | physical-education/primary/imprecise-input | imprecise-input |

| 3 | `vikins and anglo saxons` | history/primary/imprecise-input | imprecise-input |

| 4 | `narative writing storys iron man Year 3` | english/primary/imprecise-input | imprecise-input |

| 5 | `teach French negative sentences year 7` | french/secondary/natural-expression | natural-expression |

| 6 | `coding for beginners programming basics introduction` | computing/secondary/natural-expression | natural-expression |

| 7 | `nutrition and cooking techniques together` | cooking-nutrition/secondary/cross-topic | cross-topic |

---

## Per-Query Investigation Protocol

For **each** of the 7 queries, execute these phases in strict order:

### Phase 1A: Query Analysis (REFLECTION ONLY)

No tools. No searches. Just thinking.

1. **Read the query file** (e.g., `imprecise-input-2.query.ts`)
2. **State what capability this category claims to test**
3. **Critically evaluate**: Is this query a good test of that capability?

   - For `imprecise-input`: Is the typo realistic? Is it testing fuzzy matching or something else (e.g., tokenization)?
   - For `natural-expression`: Is this genuinely informal language? Or already curriculum vocabulary?
   - For `cross-topic`: Do BOTH concepts actually exist in the curriculum intersection?

4. **Identify design issues**: Should this query be revised or recategorized?

### Phase 1B: Independent Discovery

Use bulk data AND MCP tools. DO NOT read `.expected.ts` files yet.

1. **Explore bulk data broadly**:

   ```bash
   cd apps/oak-open-curriculum-semantic-search
   jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/SUBJECT-PHASE.json
   ```

2. **Search for multiple related terms** (10+ candidates)
3. **Get MCP summaries** for 5-10 candidates using `get-lessons-summary`
4. **Analyze key learning points** to assess true relevance
5. **COMMIT your rankings** (top 5 with scores and justifications)

### Phase 1C: Comparison

NOW read `.expected.ts` and run benchmark.

1. **Read expected slugs** for the first time
2. **Run benchmark**: `pnpm benchmark -s SUBJECT -p PHASE -c CATEGORY --review`
3. **Three-way comparison**: YOUR rankings vs SEARCH results vs EXPECTED slugs
4. **Determine root cause**:

   - Query-data misalignment (vocabulary not in curriculum)
   - GT errors (expected slugs are wrong)
   - Search limitation (fuzzy/tokenization issue)
   - Query design flaw (should be redesigned)

5. **Document findings** in Session Log section of investigation.md

---

## Key Files

- Query definitions: `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/{subject}/{phase}/*.query.ts`
- Expected slugs: `*.expected.ts` (same location)
- Bulk data: `apps/oak-open-curriculum-semantic-search/bulk-downloads/{subject}-{phase}.json`
- Investigation doc: `.agent/plans/semantic-search/active/problematic-queries-investigation.md`

---

## MCP Tools to Use

- `get-lessons-summary` — Keywords, key learning for specific lessons
- `get-units-summary` — Unit structure and lesson ordering
- `get-key-stages-subject-units` — Browse available units
- `oak-local-search` — Search across curriculum (for discovery)

---

## Success Criteria

For each query, determine ONE of:

1. **Query is valid, GT needs correction** — Update expected slugs
2. **Query is valid, search has limitation** — Document in ADR-103 or similar
3. **Query design is flawed** — Redesign query to properly test the capability
4. **Query-data alignment issue** — Redesign query to use curriculum vocabulary
