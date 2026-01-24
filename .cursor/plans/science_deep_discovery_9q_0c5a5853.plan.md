---
name: Science Deep Discovery 9Q
overview: Deep Phase 1B discovery for 9 Science queries across 9 separate sessions. Each session dedicates full attention to one query, using exhaustive bulk data mining and MCP analysis to establish the TRUE best curriculum matches before any comparison to search results or existing expected slugs.
todos:
  - id: s1-primary-ne2
    content: "Session 1: \"why do things fall down\" - PRIMARY natural-expression-2 (gravity/forces)"
    status: completed
  - id: s2-primary-ne3
    content: "Session 2: \"what makes ice turn into water\" - PRIMARY natural-expression-3 (melting/states)"
    status: completed
  - id: s3-primary-ii2
    content: "Session 3: \"electrisity and magnits\" - PRIMARY imprecise-input-2 (electricity+magnets)"
    status: completed
  - id: s4-secondary-ne2
    content: "Session 4: \"why does metal go rusty\" - SECONDARY natural-expression-2 (oxidation)"
    status: completed
  - id: s5-secondary-ne3
    content: "Session 5: \"why do some things feel hotter than others\" - SECONDARY natural-expression-3 (thermal)"
    status: completed
  - id: s6-secondary-ii
    content: "Session 6: \"resperation in humans\" - SECONDARY imprecise-input (respiration)"
    status: completed
  - id: s7-ks4-bio
    content: "Session 7: \"carbon cycle in ecosystems\" - KS4 Biology (carbon cycle)"
    status: completed
  - id: s8-ks4-chem
    content: "Session 8: \"ionic bonding electron transfer\" - KS4 Chemistry (ionic bonding)"
    status: completed
  - id: s9-ks4-combined
    content: "Session 9: \"energy transfers and efficiency\" - KS4 Combined Science (energy)"
    status: completed
  - id: phase1c
    content: "Phase 1C: Run benchmarks, three-way comparisons for all 9 queries"
    status: completed
  - id: update-expected
    content: Update .expected.ts files based on COMMIT tables
    status: completed
  - id: validation
    content: "Final validation: type-check, ground-truth:validate, benchmark"
    status: completed
---

# Science Deep Discovery - 9 Queries, 9 Sessions

## Foundation Commitment

Before EACH session, re-read and recommit to:

- [rules.md](/.agent/directives-and-memory/rules.md) - First Question, TDD, quality gates
- [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) - TDD at all levels
- [schema-first-execution.md](/.agent/directives-and-memory/schema-first-execution.md) - Generator as source of truth

## The 9 Queries

### PRIMARY (3 queries, 3 sessions)

| Session | Query | File | Semantic Target |

|---------|-------|------|-----------------|

| 1 | "why do things fall down" | `natural-expression-2` | Gravity, forces, weight |

| 2 | "what makes ice turn into water" | `natural-expression-3` | Melting, states of matter, heat transfer |

| 3 | "electrisity and magnits" | `imprecise-input-2` | Electricity AND magnets combined |

### SECONDARY (6 queries, 6 sessions)

| Session | Query | File | Semantic Target |

|---------|-------|------|-----------------|

| 4 | "why does metal go rusty" | `natural-expression-2` | Oxidation, rusting, chemical reactions |

| 5 | "why do some things feel hotter than others" | `natural-expression-3` | Thermal conductivity OR thermoreceptors |

| 6 | "resperation in humans" | `imprecise-input` | Human respiration, cellular respiration |

| 7 | "carbon cycle in ecosystems" | `ks4/biology-filter` | Carbon cycle as whole system |

| 8 | "ionic bonding electron transfer" | `ks4/chemistry-filter` | Ionic bonding mechanism, electron transfer |

| 9 | "energy transfers and efficiency" | `ks4/combined-science-filter` | Energy transfer principles, efficiency calculations |

## Per-Session Protocol

Each session follows [ground-truth-session-template.md](/.agent/plans/semantic-search/templates/ground-truth-session-template.md) Phase 1B exactly.

### Step 1: List ALL Units

```bash
cd apps/oak-open-curriculum-semantic-search

# For PRIMARY sessions (1-3):
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/science-primary.json > /tmp/science-primary-units.txt
wc -l /tmp/science-primary-units.txt  # Record count

# For SECONDARY sessions (4-9):
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/science-secondary.json > /tmp/science-secondary-units.txt
wc -l /tmp/science-secondary-units.txt  # Record count
```

### Step 2: Search Bulk Data (3+ Terms)

Use multiple search terms. Cast a WIDE net - narrow searches will miss relevant content.

```bash
# Example for "why do things fall down":
# Term 1: Direct vocabulary
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | 
  select(.lessonTitle | test("fall|gravity"; "i")) | 
  "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/science-primary.json

# Term 2: Related concepts
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | 
  select(.lessonTitle | test("force|weight"; "i")) | 
  "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/science-primary.json

# Term 3: Unit-level search (find whole units about the topic)
jq -r '.sequence[] | select(.unitTitle | test("force"; "i")) | 
  "\(.unitSlug): \(.unitTitle) — \(.unitLessons | length) lessons"' bulk-downloads/science-primary.json
```

**Output**: Candidate list with minimum 10 slugs

### Step 3: Review Non-Obvious Units

Scan ALL units from Step 1. Look for units that MIGHT contain relevant content even if titles don't suggest it.

Example: A lesson about "everyday phenomena" might explain gravity. Title-only matching misses these.

### Step 4: Get MCP Summaries (5-10 Candidates)

Use `get-lessons-summary` for each candidate. Extract and record:

- Keywords
- Key Learning Points
- Misconceptions

**Critical**: Include candidates from non-obvious units discovered in Step 3.

### Step 5: Get Unit Context

Use `get-units-summary` for relevant units. Document:

- Lesson ordering (which are foundational vs capstone)
- Prior knowledge requirements
- Where in the curriculum this fits

### Step 6: Analyse and Rank Candidates

For each candidate with MCP summary:

- Does the key learning directly address the query?
- Quote the specific text that matches (or doesn't)
- Rate: STRONG / MODERATE / WEAK / NONE

### Step 7: COMMIT Rankings

Create COMMIT table with top 5-10 ranked slugs:

| Rank | Slug | Score (1-3) | Key Learning Quote | Why This Ranking |

|------|------|-------------|-------------------|------------------|

| 1 | ... | 3 | "..." | Directly answers query because... |

| 2 | ... | 3 | "..." | ... |

**CRITICAL**: This table is created BEFORE seeing search results or expected slugs.

## Bulk Data Files

- Primary: `apps/oak-open-curriculum-semantic-search/bulk-downloads/science-primary.json`
- Secondary: `apps/oak-open-curriculum-semantic-search/bulk-downloads/science-secondary.json`

## MCP Tools Required

| Tool | Purpose |

|------|---------|

| `get-lessons-summary` | Keywords, key learning, misconceptions |

| `get-units-summary` | Unit structure, lesson ordering |

| `get-key-stages-subject-units` | All units for subject/key-stage |

| `get-search-lessons` | Title-based search (supplement bulk) |

| `get-search-transcripts` | Transcript search (find hidden content) |

## Query Files (DO NOT READ `.expected.ts` until Phase 1C)

### PRIMARY

- `src/lib/search-quality/ground-truth/science/primary/natural-expression-2.query.ts`
- `src/lib/search-quality/ground-truth/science/primary/natural-expression-3.query.ts`
- `src/lib/search-quality/ground-truth/science/primary/imprecise-input-2.query.ts`

### SECONDARY

- `src/lib/search-quality/ground-truth/science/secondary/natural-expression-2.query.ts`
- `src/lib/search-quality/ground-truth/science/secondary/natural-expression-3.query.ts`
- `src/lib/search-quality/ground-truth/science/secondary/imprecise-input.query.ts`
- `src/lib/search-quality/ground-truth/science/secondary/ks4/biology-filter.query.ts`
- `src/lib/search-quality/ground-truth/science/secondary/ks4/chemistry-filter.query.ts`
- `src/lib/search-quality/ground-truth/science/secondary/ks4/combined-science-filter.query.ts`

## Session Deliverables

Each session produces:

1. Unit count for the phase (PRIMARY or SECONDARY)
2. Candidate list (10+ slugs from bulk data)
3. MCP summaries (5-10 with key learning quotes)
4. Unit context documentation
5. Analysis of each candidate
6. COMMIT table (top 5-10 ranked with justifications)

## After All 9 Sessions

Once all 9 COMMIT tables are complete:

1. Run Phase 1C for each query (benchmark, three-way comparison)
2. Update `.expected.ts` files based on COMMIT tables
3. Run full validation suite

## Quality Gates

- **Per-session**: COMMIT table must be complete before session ends
- **Cross-session**: All 9 COMMIT tables required before Phase 1C
- **Final**: `pnpm type-check`, `pnpm ground-truth:validate`, `pnpm benchmark`
