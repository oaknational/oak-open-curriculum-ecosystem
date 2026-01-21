---
name: Music GT Phase 1B
overview: Phase 1B (Discovery + COMMIT) for Music primary and secondary. Explore bulk data, get MCP summaries, and COMMIT independent rankings for all 8 queries BEFORE seeing search results or expected slugs.
todos:
  - id: primary-q1-1b
    content: "PRIMARY Q1 (precise-topic): Discovery + COMMIT for syncopation rhythm music ks2"
    status: completed
  - id: primary-q2-1b
    content: "PRIMARY Q2 (natural-expression): Discovery + COMMIT for singing in tune for children"
    status: completed
  - id: primary-q3-1b
    content: "PRIMARY Q3 (imprecise-input): Discovery + COMMIT for rythm beat ks1"
    status: completed
  - id: primary-q4-1b
    content: "PRIMARY Q4 (cross-topic): Discovery + COMMIT for singing and beat together"
    status: completed
  - id: secondary-q5-1b
    content: "SECONDARY Q5 (precise-topic): Discovery + COMMIT for drum grooves rhythm"
    status: completed
  - id: secondary-q6-1b
    content: "SECONDARY Q6 (natural-expression): Discovery + COMMIT for teach folk songs sea shanty"
    status: completed
  - id: secondary-q7-1b
    content: "SECONDARY Q7 (imprecise-input): Discovery + COMMIT for rythm patterns drums"
    status: completed
  - id: secondary-q8-1b
    content: "SECONDARY Q8 (cross-topic): Discovery + COMMIT for film music and composition together"
    status: completed
  - id: checkpoint-1b
    content: "CHECKPOINT 1B: Verify all 8 COMMIT tables complete, no .expected.ts read, no benchmark run"
    status: completed
---

# Music Ground Truth Evaluation — Phase 1B (Discovery + COMMIT)

**Scope**: 8 queries (4 primary, 4 secondary)

**Purpose**: Discover BEST possible answers and COMMIT rankings BEFORE benchmark

---

## Cardinal Rules for Phase 1B

1. **DO NOT read `.expected.ts` files** — you must not know expected slugs
2. **DO NOT run benchmark** — forbidden until all COMMIT tables complete
3. **Title-only matching is NOT sufficient** — review ALL units, get MCP summaries for edge cases
4. **Fresh analysis for EACH query** — no copying between queries

---

## Phase 1B Structure (repeat for each of 8 queries)

### Step 1B.1: Search Bulk Data

Search with 3+ terms. Cast a wide net.

```bash
cd apps/oak-open-curriculum-semantic-search

# Search lesson titles
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | select(.lessonTitle | test("TERM1|TERM2"; "i")) | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/music-PHASE.json

# Search unit titles  
jq -r '.sequence[] | select(.unitTitle | test("TERM"; "i")) | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' bulk-downloads/music-PHASE.json

# List ALL units (scan for non-obvious matches)
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' bulk-downloads/music-PHASE.json
```

**Record**: Search terms used, lessons found, candidate list (minimum 10 slugs)

### Step 1B.2: Get MCP Summaries

Call `get-lessons-summary` for 5-10 candidates.

**Record**: Slug, Keywords, Key Learning quote for each

### Step 1B.3: Get Unit Context

Call `get-units-summary` for relevant units.

**Record**: Unit name, lessons in order (note foundational vs capstone)

### Step 1B.4: Analyse Candidates

For each candidate with MCP summary:

- Does key learning directly address the query?
- Quote specific text that matches (or doesn't)
- Rate: STRONG / MODERATE / WEAK / NONE

### Step 1B.5: COMMIT Rankings

| Rank | Slug | Score (1-3) | Key Learning Quote | Why This Ranking |

|------|------|-------------|-------------------|------------------|

| 1 | ***|*** | "..." | ___ |

| 2 | ***|*** | "..." | ___ |

| 3 | ***|*** | "..." | ___ |

| 4 | ***|*** | "..." | ___ |

| 5 | ***|*** | "..." | ___ |

---

## PRIMARY Queries

### Q1: precise-topic — "syncopation rhythm music ks2"

**Search terms to try**: syncopation, rhythm, beat, off-beat

[Execute Steps 1B.1-1B.5]

### Q2: natural-expression — "singing in tune for children"

**Search terms to try**: singing, tune, pitch, voice, intonation

**Note**: "In tune" = PITCH accuracy, NOT rhythm. Look for pitch-related content.

[Execute Steps 1B.1-1B.5]

### Q3: imprecise-input — "rythm beat ks1"

**Semantic intent**: rhythm + beat lessons for KS1 (ages 5-7)

**Search terms to try**: rhythm, beat, pulse, steady beat

**Note**: KS1 age-appropriate = basic beat/pulse, not advanced concepts

[Execute Steps 1B.1-1B.5]

### Q4: cross-topic — "singing and beat together"

**Two concepts**: singing (vocal) + beat (pulse/rhythm)

**Search terms to try**: singing, beat, pulse, rhythm, voice

**Note**: Look for lessons combining BOTH concepts in key learning

[Execute Steps 1B.1-1B.5]

---

## SECONDARY Queries

### Q5: precise-topic — "drum grooves rhythm"

**Search terms to try**: drum, groove, rhythm, percussion, beat

[Execute Steps 1B.1-1B.5]

### Q6: natural-expression — "teach folk songs sea shanty"

**Search terms to try**: folk, shanty, sea, traditional, song

[Execute Steps 1B.1-1B.5]

### Q7: imprecise-input — "rythm patterns drums"

**Semantic intent**: rhythm patterns for drums

**Search terms to try**: rhythm, pattern, drum, percussion, beat

[Execute Steps 1B.1-1B.5]

### Q8: cross-topic — "film music and composition together"

**Two concepts**: film music (context) + composition (creating)

**Search terms to try**: film, movie, composition, compose, create, soundtrack

**Note**: Look for lessons about COMPOSING for film, not just analysing film music

[Execute Steps 1B.1-1B.5]

---

## CHECKPOINT 1B

After ALL 8 queries have COMMIT tables:

| Query | Candidates (10+) | MCP Summaries (5-10) | Unit Context | Analysis | COMMIT Table |

|-------|------------------|----------------------|--------------|----------|--------------|

| PRIMARY Q1 | ☐ | ☐ | ☐ | ☐ | ☐ |

| PRIMARY Q2 | ☐ | ☐ | ☐ | ☐ | ☐ |

| PRIMARY Q3 | ☐ | ☐ | ☐ | ☐ | ☐ |

| PRIMARY Q4 | ☐ | ☐ | ☐ | ☐ | ☐ |

| SECONDARY Q5 | ☐ | ☐ | ☐ | ☐ | ☐ |

| SECONDARY Q6 | ☐ | ☐ | ☐ | ☐ | ☐ |

| SECONDARY Q7 | ☐ | ☐ | ☐ | ☐ | ☐ |

| SECONDARY Q8 | ☐ | ☐ | ☐ | ☐ | ☐ |

**Verification before Phase 1C**:

- ☐ All 8 COMMIT tables complete
- ☐ `.expected.ts` files NOT read
- ☐ Benchmark NOT run
