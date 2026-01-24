---
name: Science Deep Discovery Phase 1B
overview: "Comprehensive Phase 1B discovery for all 9 science queries. For each query: search bulk data with multiple terms (10+ candidates), get MCP summaries (5-10), analyse with key learning quotes, and COMMIT rankings. Ignore current expected slugs and search results — pure curriculum-based discovery."
todos:
  - id: phase0
    content: "PHASE 0: Verify bulk data exists, list ALL units for primary and secondary science"
    status: pending
  - id: q1-discovery
    content: "Q1 \"why do things fall down\": Bulk search (10+ candidates), MCP summaries (5-10), unit context, COMMIT table"
    status: pending
  - id: q2-discovery
    content: "Q2 \"what makes ice turn into water\": Bulk search, MCP summaries, unit context, COMMIT table"
    status: pending
  - id: q3-discovery
    content: "Q3 \"electrisity and magnits\": Bulk search, MCP summaries, unit context, COMMIT table"
    status: pending
  - id: q4-discovery
    content: "Q4 \"why does metal go rusty\": Bulk search, MCP summaries, unit context, COMMIT table"
    status: pending
  - id: q5-discovery
    content: "Q5 \"why do some things feel hotter than others\": Bulk search, MCP summaries, unit context, COMMIT table"
    status: pending
  - id: q6-discovery
    content: "Q6 \"resperation in humans\": Bulk search, MCP summaries, unit context, COMMIT table"
    status: pending
  - id: q7-discovery
    content: "Q7 \"carbon cycle in ecosystems\": Bulk search, MCP summaries, unit context, COMMIT table"
    status: pending
  - id: q8-discovery
    content: "Q8 \"ionic bonding electron transfer\": Bulk search, MCP summaries, unit context, COMMIT table"
    status: pending
  - id: q9-discovery
    content: "Q9 \"energy transfers and efficiency\": Bulk search, MCP summaries, unit context, COMMIT table"
    status: pending
  - id: synthesis
    content: "SYNTHESIS: Compare all 9 COMMIT tables with current expected slugs, document discrepancies"
    status: pending
---

# Science Deep Discovery - Phase 1B+ for 9 Queries

## Context

This is a comprehensive Phase 1B discovery following the [ground-truth-session-template.md](/.agent/plans/semantic-search/templates/ground-truth-session-template.md). The goal is to determine the **absolute best** curriculum matches for each query through independent discovery, **ignoring**:

- Current expected slugs (already in `.expected.ts` files)
- Actual search results
- Previous investigation conclusions

## Key Principle

> "The purpose is to discover the BEST POSSIBLE answers from curriculum content... all BEFORE seeing what search returns OR what the current expected slugs are."

---

## Queries to Investigate

| # | Query | Category | Phase | Key Stage |

|---|-------|----------|-------|-----------|

| 1 | "why do things fall down" | natural-expression | primary | KS2 |

| 2 | "what makes ice turn into water" | natural-expression | primary | KS2 |

| 3 | "electrisity and magnits" | imprecise-input | primary | KS2 |

| 4 | "why does metal go rusty" | natural-expression | secondary | KS3/KS4 |

| 5 | "why do some things feel hotter than others" | natural-expression | secondary | KS3/KS4 |

| 6 | "resperation in humans" | imprecise-input | secondary | KS3/KS4 |

| 7 | "carbon cycle in ecosystems" | precise-topic (KS4 biology) | secondary | KS4 |

| 8 | "ionic bonding electron transfer" | precise-topic (KS4 chemistry) | secondary | KS4 |

| 9 | "energy transfers and efficiency" | precise-topic (KS4 combined) | secondary | KS4 |

---

## Phase 0: Prerequisites

### Step 0.1: Verify Bulk Data

Confirm bulk files exist and record lesson counts:

```bash
cd apps/oak-open-curriculum-semantic-search
wc -l bulk-downloads/science-primary.json
wc -l bulk-downloads/science-secondary.json
```

### Step 0.2: List ALL Units

Generate complete unit lists for reference:

```bash
# Primary Science
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/science-primary.json > /tmp/science-primary-units.txt

# Secondary Science  
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/science-secondary.json > /tmp/science-secondary-units.txt
```

---

## Per-Query Discovery Protocol

For **each of the 9 queries**, execute these steps:

### Step 1B.1: Search Bulk Data (Multiple Terms)

Search with 3+ different terms. Example for Query 1:

```bash
# Term 1: Direct vocabulary
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | 
  select(.lessonTitle | test("fall|gravity"; "i")) | 
  "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/science-primary.json

# Term 2: Related concepts
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | 
  select(.lessonTitle | test("force|weight"; "i")) | 
  "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/science-primary.json

# Term 3: Unit-level search
jq -r '.sequence[] | select(.unitTitle | test("force"; "i")) | 
  "\(.unitSlug): \(.unitTitle) — \(.unitLessons | length) lessons"' bulk-downloads/science-primary.json
```

**Output**: Candidate list with **minimum 10 slugs**

### Step 1B.2: Get MCP Summaries (5-10 Candidates)

Use Oak MCP tools to get detailed lesson information:

- `get-lessons-summary` for each candidate slug
- Extract: Keywords, Key Learning Points, Misconceptions

**Output**: 5-10 MCP summaries with key learning quotes

### Step 1B.3: Get Unit Context

Use `get-units-summary` to understand:

- Lesson ordering within units
- Which lessons are foundational vs capstone
- Prior knowledge requirements

### Step 1B.4: Analyse and Rank Candidates

For each candidate, document:

- Key learning quote that matches (or doesn't match) the query
- Query match strength: STRONG / MODERATE / WEAK / NONE
- Reasoning

### Step 1B.5: COMMIT Rankings

Create COMMIT table with top 5-10 ranked slugs:

| Rank | Slug | Score (1-3) | Key Learning Quote | Why This Ranking |

|------|------|-------------|-------------------|------------------|

| 1 | ... | 3 | "..." | Directly answers query |

| 2 | ... | 3 | "..." | ... |

| ... | ... | ... | ... | ... |

---

## Deliverables Per Query

For each of the 9 queries, record:

1. **Candidate List** (10+ slugs from bulk data search)
2. **MCP Summaries** (5-10 with key learning quotes)
3. **Unit Context** (lesson ordering, foundational vs capstone)
4. **Analysis** (query match strength for each candidate)
5. **COMMIT Table** (top 5-10 ranked with scores and justifications)

---

## Bulk Data Files

- Primary: [science-primary.json](/apps/oak-open-curriculum-semantic-search/bulk-downloads/science-primary.json)
- Secondary: [science-secondary.json](/apps/oak-open-curriculum-semantic-search/bulk-downloads/science-secondary.json)

---

## MCP Tools to Use

| Tool | Purpose |

|------|---------|

| `get-lessons-summary` | Detailed lesson metadata, keywords, key learning |

| `get-units-summary` | Unit structure, lesson ordering, prior knowledge |

| `get-search-lessons` | Title-based search (supplement bulk data) |

| `get-search-transcripts` | Transcript-based search (find content not in titles) |

---

## Expected Output

A comprehensive document with:

- 9 COMMIT tables (one per query)
- 90+ candidate slugs analysed
- 45-90 MCP summaries with key learning quotes
- Clear justifications for all rankings
