---
name: Science GT Phase 1B
overview: "Phase 1B Discovery + COMMIT for Science ground truths. For each of 24 queries: search bulk data (10+ candidates), get MCP summaries (5-10), analyse candidates, and COMMIT rankings BEFORE seeing search results or expected slugs. No benchmark. No .expected.ts files."
todos:
  - id: setup-primary
    content: "Setup: List all PRIMARY lessons and units to /tmp reference files"
    status: completed
  - id: pt1-primary
    content: "PRIMARY PT-1: Discovery + COMMIT for \"evolution Darwin finches Year 6\""
    status: completed
  - id: pt2-primary
    content: "PRIMARY PT-2: Discovery + COMMIT for \"electrical circuits conductors insulators\""
    status: completed
  - id: pt3-primary
    content: "PRIMARY PT-3: Discovery + COMMIT for \"states of matter solids liquids gases\""
    status: completed
  - id: ne1-primary
    content: "PRIMARY NE-1: Discovery + COMMIT for \"why do birds have different shaped beaks\""
    status: completed
  - id: ne2-primary
    content: "PRIMARY NE-2: Discovery + COMMIT for \"why do things fall down\""
    status: completed
  - id: ne3-primary
    content: "PRIMARY NE-3: Discovery + COMMIT for \"what makes ice turn into water\""
    status: completed
  - id: ii1-primary
    content: "PRIMARY II-1: Discovery + COMMIT for \"evoloution and adaptashun\""
    status: completed
  - id: ii2-primary
    content: "PRIMARY II-2: Discovery + COMMIT for \"electrisity and magnits\""
    status: completed
  - id: ii3-primary
    content: "PRIMARY II-3: Discovery + COMMIT for \"evapration and condensashun\""
    status: completed
  - id: ct1-primary
    content: "PRIMARY CT-1: Discovery + COMMIT for \"habitats and food chains\""
    status: completed
  - id: ct2-primary
    content: "PRIMARY CT-2: Discovery + COMMIT for \"light and plants growing\""
    status: completed
  - id: ct3-primary
    content: "PRIMARY CT-3: Discovery + COMMIT for \"friction and different materials\""
    status: completed
  - id: checkpoint-primary
    content: "PRIMARY CHECKPOINT: Verify all 12 COMMIT tables complete, no .expected.ts read"
    status: completed
  - id: setup-secondary
    content: "Setup: List all SECONDARY lessons and units to /tmp reference files"
    status: completed
  - id: pt1-secondary
    content: "SECONDARY PT-1: Discovery + COMMIT for \"cell structure and function\""
    status: completed
  - id: pt2-secondary
    content: "SECONDARY PT-2: Discovery + COMMIT for \"ionic and covalent bonding\""
    status: completed
  - id: pt3-secondary
    content: "SECONDARY PT-3: Discovery + COMMIT for \"electromagnetic spectrum waves\""
    status: completed
  - id: ne1-secondary
    content: "SECONDARY NE-1: Discovery + COMMIT for \"how do plants make their own food\""
    status: completed
  - id: ne2-secondary
    content: "SECONDARY NE-2: Discovery + COMMIT for \"why does metal go rusty\""
    status: completed
  - id: ne3-secondary
    content: "SECONDARY NE-3: Discovery + COMMIT for \"what makes things hot or cold\""
    status: completed
  - id: ii1-secondary
    content: "SECONDARY II-1: Discovery + COMMIT for \"resperation in humans\""
    status: completed
  - id: ii2-secondary
    content: "SECONDARY II-2: Discovery + COMMIT for \"photosythesis in plants\""
    status: completed
  - id: ii3-secondary
    content: "SECONDARY II-3: Discovery + COMMIT for \"electromagnatic waves and spectrum\""
    status: completed
  - id: ct1-secondary
    content: "SECONDARY CT-1: Discovery + COMMIT for \"energy and chemical reactions\""
    status: completed
  - id: ct2-secondary
    content: "SECONDARY CT-2: Discovery + COMMIT for \"cells and genetics inheritance\""
    status: completed
  - id: ct3-secondary
    content: "SECONDARY CT-3: Discovery + COMMIT for \"electricity and magnetism motors\""
    status: completed
  - id: checkpoint-secondary
    content: "SECONDARY CHECKPOINT: Verify all 12 COMMIT tables complete, no .expected.ts read"
    status: completed
  - id: final-checkpoint
    content: "FINAL: All 24 COMMIT tables complete, ready for Phase 1C"
    status: completed
---

# Science Ground Truth: Phase 1B — Discovery and COMMIT

**Last Updated**: 2026-01-21

**Status**: PLANNING

**Scope**: Discovery and COMMIT for all 24 Science queries — BEFORE benchmark, BEFORE reading .expected.ts files

---

## Context

### Phase 1A Complete

Phase 1A (Query Analysis) established:

1. **24 queries designed** across primary and secondary, covering biology, chemistry, and physics
2. **4 queries need revision** from original set (natural-expression and cross-topic queries used curriculum terms inappropriately)
3. **Mental model documented** for UK Science curriculum at both levels
4. **Category definitions established** for Science-specific testing

### Phase 1B Purpose

Phase 1B is **Discovery + COMMIT**. For each query:

1. Search bulk data for candidates (10+ slugs)
2. Get MCP summaries (5-10 candidates)
3. Analyse candidates against query
4. **COMMIT rankings BEFORE seeing search results or expected slugs**

This is the critical safeguard against validation bias.

---

## Foundation Document Commitment

Before beginning and at each checkpoint:

1. **Re-read** [rules.md](/.agent/directives-and-memory/rules.md) — First Question, quality gates
2. **Re-read** [testing-strategy.md](/.agent/directives-and-memory/testing-strategy.md) — Test behaviour, not implementation
3. **Re-read** [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) — Cardinal rules, anti-patterns
4. **Ask**: "Am I forming independent judgment, or validating something I've already seen?"

---

## Cardinal Rules for Phase 1B

### Rule 1: DO NOT Read .expected.ts Files

You do not know what the expected slugs are. Keep it that way until Phase 1C.

### Rule 2: DO NOT Run Benchmark

Benchmark shows search results. You must COMMIT before seeing them.

### Rule 3: Title-Only Matching is NOT Sufficient

Session 17 (German) proved: excellent lessons hide in non-obvious units. Review ALL units systematically.

### Rule 4: Fresh Analysis for EVERY Query

No copying from similar queries. Each of the 24 queries gets independent discovery.

### Rule 5: 100% Certainty Standard

Science is a critical subject. "Good enough" is not acceptable.

---

## Query Summary (From Phase 1A)

### PRIMARY (12 queries)

| Category | Q1 | Q2 | Q3 |

|----------|----|----|-----|

| precise-topic | "evolution Darwin finches Year 6" | "electrical circuits conductors insulators" | "states of matter solids liquids gases" |

| natural-expression | "why do birds have different shaped beaks" | "why do things fall down" | "what makes ice turn into water" |

| imprecise-input | "evoloution and adaptashun" | "electrisity and magnits" | "evapration and condensashun" |

| cross-topic | "habitats and food chains" | "light and plants growing" | "friction and different materials" |

### SECONDARY (12 queries)

| Category | Q1 | Q2 | Q3 |

|----------|----|----|-----|

| precise-topic | "cell structure and function" | "ionic and covalent bonding" | "electromagnetic spectrum waves" |

| natural-expression | "how do plants make their own food" | "why does metal go rusty" | "what makes things hot or cold" |

| imprecise-input | "resperation in humans" | "photosythesis in plants" | "electromagnatic waves and spectrum" |

| cross-topic | "energy and chemical reactions" | "cells and genetics inheritance" | "electricity and magnetism motors" |

---

## Resolution Plan

### Phase 1B Structure

For each query, execute Steps 1B.1 through 1B.5 in order. Do not skip steps.

The plan is organised by phase (PRIMARY then SECONDARY) and by category within each phase.

---

## PRIMARY Phase 1B

### Bulk Data Setup

```bash
cd apps/oak-open-curriculum-semantic-search

# List ALL lessons to reference file
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/science-primary.json > /tmp/science-primary-all.txt

# List ALL units for systematic review
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/science-primary.json > /tmp/science-primary-units.txt

# Count totals
wc -l /tmp/science-primary-all.txt
wc -l /tmp/science-primary-units.txt
```

---

### PT-1: precise-topic Query 1 — "evolution Darwin finches Year 6"

**Step 1B.1**: Search bulk data with terms: "evolution", "Darwin", "finches", "adaptation", "inherit"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for evolution/inheritance units

**Step 1B.4**: Analyse each candidate — does key learning mention evolution, Darwin, finches, adaptation?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### PT-2: precise-topic Query 2 — "electrical circuits conductors insulators"

**Step 1B.1**: Search bulk data with terms: "circuit", "conductor", "insulator", "electricity", "electrical"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for electricity units

**Step 1B.4**: Analyse each candidate — does key learning mention circuits, conductors, insulators?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### PT-3: precise-topic Query 3 — "states of matter solids liquids gases"

**Step 1B.1**: Search bulk data with terms: "states of matter", "solid", "liquid", "gas", "matter"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for states of matter units

**Step 1B.4**: Analyse each candidate — does key learning cover solids, liquids, gases?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### NE-1: natural-expression Query 1 — "why do birds have different shaped beaks"

**Step 1B.1**: Search bulk data with terms: "bird", "beak", "adaptation", "evolution", "Darwin", "finch"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for evolution/adaptation units

**Step 1B.4**: Analyse each candidate — does key learning explain WHY beaks differ (adaptation/evolution)?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### NE-2: natural-expression Query 2 — "why do things fall down"

**Step 1B.1**: Search bulk data with terms: "fall", "gravity", "force", "weight", "pull"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for forces/gravity units

**Step 1B.4**: Analyse each candidate — does key learning explain gravity/falling?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### NE-3: natural-expression Query 3 — "what makes ice turn into water"

**Step 1B.1**: Search bulk data with terms: "ice", "water", "melt", "heat", "change", "state"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for states of matter units

**Step 1B.4**: Analyse each candidate — does key learning explain melting?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### II-1: imprecise-input Query 1 — "evoloution and adaptashun"

**Step 1B.1**: Search bulk data with CORRECT terms: "evolution", "adaptation" (typos are for search testing, not bulk search)

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for evolution/adaptation units

**Step 1B.4**: Analyse each candidate — does key learning cover evolution AND adaptation?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### II-2: imprecise-input Query 2 — "electrisity and magnits"

**Step 1B.1**: Search bulk data with CORRECT terms: "electricity", "magnet", "magnetic"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for electricity/magnetism units

**Step 1B.4**: Analyse each candidate — does key learning cover electricity AND magnets?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### II-3: imprecise-input Query 3 — "evapration and condensashun"

**Step 1B.1**: Search bulk data with CORRECT terms: "evaporation", "condensation", "water cycle"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for states of matter/water cycle units

**Step 1B.4**: Analyse each candidate — does key learning cover evaporation AND condensation?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### CT-1: cross-topic Query 1 — "habitats and food chains"

**Step 1B.1**: Search bulk data with terms: "habitat", "food chain", "ecosystem", "living things"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for habitats AND food chain units

**Step 1B.4**: Analyse each candidate — does key learning mention BOTH habitats AND food chains?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### CT-2: cross-topic Query 2 — "light and plants growing"

**Step 1B.1**: Search bulk data with terms: "light", "plant", "grow", "photosynthesis", "sun"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for plants AND light units

**Step 1B.4**: Analyse each candidate — does key learning connect light TO plant growth?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

### CT-3: cross-topic Query 3 — "friction and different materials"

**Step 1B.1**: Search bulk data with terms: "friction", "material", "surface", "force", "grip"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for forces AND materials units

**Step 1B.4**: Analyse each candidate — does key learning connect friction TO material properties?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

**Checkpoint**: 10+ candidates, 5+ MCP summaries, COMMIT table complete

---

## PRIMARY Phase 1B Checkpoint

Before proceeding to SECONDARY:

- [ ] All 12 PRIMARY queries have COMMIT tables
- [ ] Each COMMIT table has 5 ranked slugs with scores and justifications
- [ ] Each query has 10+ candidates explored
- [ ] Each query has 5+ MCP summaries recorded
- [ ] NO .expected.ts files have been read
- [ ] NO benchmark has been run

---

## SECONDARY Phase 1B

### Bulk Data Setup

```bash
cd apps/oak-open-curriculum-semantic-search

# List ALL lessons to reference file
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/science-secondary.json > /tmp/science-secondary-all.txt

# List ALL units for systematic review
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/science-secondary.json > /tmp/science-secondary-units.txt

# Count totals
wc -l /tmp/science-secondary-all.txt
wc -l /tmp/science-secondary-units.txt
```

---

### PT-1: precise-topic Query 1 — "cell structure and function"

**Step 1B.1**: Search bulk data with terms: "cell", "structure", "function", "organelle", "membrane"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for cell biology units

**Step 1B.4**: Analyse each candidate — does key learning cover cell structure AND function?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### PT-2: precise-topic Query 2 — "ionic and covalent bonding"

**Step 1B.1**: Search bulk data with terms: "ionic", "covalent", "bond", "bonding", "electron"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for bonding/structure units

**Step 1B.4**: Analyse each candidate — does key learning cover BOTH ionic AND covalent bonding?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### PT-3: precise-topic Query 3 — "electromagnetic spectrum waves"

**Step 1B.1**: Search bulk data with terms: "electromagnetic", "spectrum", "wave", "radiation", "frequency"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for waves/EM spectrum units

**Step 1B.4**: Analyse each candidate — does key learning cover the electromagnetic spectrum?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### NE-1: natural-expression Query 1 — "how do plants make their own food"

**Step 1B.1**: Search bulk data with terms: "plant", "food", "photosynthesis", "glucose", "sunlight"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for photosynthesis units

**Step 1B.4**: Analyse each candidate — does key learning explain HOW plants make food?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### NE-2: natural-expression Query 2 — "why does metal go rusty"

**Step 1B.1**: Search bulk data with terms: "rust", "oxidation", "corrosion", "metal", "iron", "reaction"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for chemical reactions units

**Step 1B.4**: Analyse each candidate — does key learning explain rusting/oxidation?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### NE-3: natural-expression Query 3 — "what makes things hot or cold"

**Step 1B.1**: Search bulk data with terms: "heat", "temperature", "energy", "thermal", "transfer", "hot", "cold"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for energy/thermal units

**Step 1B.4**: Analyse each candidate — does key learning explain heat/temperature?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### II-1: imprecise-input Query 1 — "resperation in humans"

**Step 1B.1**: Search bulk data with CORRECT term: "respiration", "breathing", "oxygen", "energy"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for respiration units

**Step 1B.4**: Analyse each candidate — does key learning cover respiration in humans?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### II-2: imprecise-input Query 2 — "photosythesis in plants"

**Step 1B.1**: Search bulk data with CORRECT term: "photosynthesis"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for photosynthesis units

**Step 1B.4**: Analyse each candidate — does key learning cover photosynthesis?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### II-3: imprecise-input Query 3 — "electromagnatic waves and spectrum"

**Step 1B.1**: Search bulk data with CORRECT terms: "electromagnetic", "spectrum", "wave"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for EM spectrum units

**Step 1B.4**: Analyse each candidate — does key learning cover electromagnetic waves/spectrum?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### CT-1: cross-topic Query 1 — "energy and chemical reactions"

**Step 1B.1**: Search bulk data with terms: "energy", "reaction", "exothermic", "endothermic", "chemical"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for chemical reactions AND energy units

**Step 1B.4**: Analyse each candidate — does key learning connect energy TO chemical reactions?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### CT-2: cross-topic Query 2 — "cells and genetics inheritance"

**Step 1B.1**: Search bulk data with terms: "cell", "gene", "genetics", "inherit", "DNA", "chromosome"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for cells AND genetics units

**Step 1B.4**: Analyse each candidate — does key learning connect cells TO genetics/inheritance?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

### CT-3: cross-topic Query 3 — "electricity and magnetism motors"

**Step 1B.1**: Search bulk data with terms: "electricity", "magnetism", "motor", "electromagnetic", "current"

**Step 1B.2**: Get MCP summaries for 5-10 candidates

**Step 1B.3**: Get unit context for electricity AND magnetism units

**Step 1B.4**: Analyse each candidate — does key learning connect electricity TO magnetism (motors)?

**Step 1B.5**: COMMIT top 5 rankings with scores and justifications

---

## SECONDARY Phase 1B Checkpoint

Before concluding Phase 1B:

- [ ] All 12 SECONDARY queries have COMMIT tables
- [ ] Each COMMIT table has 5 ranked slugs with scores and justifications
- [ ] Each query has 10+ candidates explored
- [ ] Each query has 5+ MCP summaries recorded
- [ ] NO .expected.ts files have been read
- [ ] NO benchmark has been run

---

## Phase 1B Complete Validation

**Final Checkpoint — BEFORE Phase 1C:**

- [ ] All 24 queries have COMMIT tables (12 PRIMARY + 12 SECONDARY)
- [ ] Total MCP summaries: 120+ (5 per query minimum)
- [ ] Total candidates explored: 240+ (10 per query minimum)
- [ ] NO .expected.ts files have been read
- [ ] NO benchmark has been run
- [ ] All rankings based purely on curriculum content analysis

**Phase 1B is COMPLETE when all 24 COMMIT tables are filled.**

Phase 1C (Comparison) is OUT OF SCOPE for this plan.

---

## Evidence Requirements Per Query

For each of the 24 queries, document:

```
Query: "[query text]"
Category: [category]
Phase: [primary/secondary]

Step 1B.1 — Bulk Data Search:
  Search terms: [list]
  Candidates found: [count]
  Candidate list:
    1. [slug]
    2. [slug]
    ... (10+ total)

Step 1B.2 — MCP Summaries:
  1. SLUG: [slug]
     Keywords: [keywords]
     Key Learning: "[quote]"
  ... (5-10 total)

Step 1B.3 — Unit Context:
  Unit: [unit name]
  Lessons in order: [list]

Step 1B.4 — Candidate Analysis:
  1. SLUG: [slug]
     Query match: [STRONG/MODERATE/WEAK/NONE]
     Reasoning: [explanation]
  ... (for all candidates with MCP summaries)

Step 1B.5 — COMMIT Rankings:
| Rank | Slug | Score | Key Learning Quote | Why This Ranking |
|------|------|-------|-------------------|------------------|
| 1 | ... | 3 | "..." | ... |
| 2 | ... | 3 | "..." | ... |
| 3 | ... | 2 | "..." | ... |
| 4 | ... | 2 | "..." | ... |
| 5 | ... | 2 | "..." | ... |
```

---

## Anti-Patterns to Avoid

1. **Reading .expected.ts** — You don't know expected slugs yet
2. **Running benchmark** — You haven't committed rankings yet
3. **Copying from similar queries** — Each query needs fresh discovery
4. **Title-only matching** — Review ALL units, get MCP summaries for edge cases
5. **Fewer than 10 candidates** — Cast a wider net
6. **Fewer than 5 MCP summaries** — Can't analyse without key learning quotes
7. **Skipping COMMIT table** — This is the critical safeguard

---

## Tools Reference

| Tool | Purpose | When to Use |

|------|---------|-------------|

| `jq` on bulk-downloads/*.json | Find candidates by title/unit | Step 1B.1 |

| `get-lessons-summary` | Get key learning quotes | Step 1B.2 |

| `get-units-summary` | Understand lesson ordering | Step 1B.3 |

| **DO NOT USE** | benchmark, .expected.ts files | Not until Phase 1C |

---

## Success Criteria

Phase 1B is successful when:

1. All 24 COMMIT tables are complete with 5 ranked slugs each
2. Rankings are based purely on curriculum content analysis
3. No validation bias has occurred (no benchmark, no expected slugs seen)
4. Evidence is documented for each query (candidates, MCP summaries, analysis)

---

## Notes

### Why This Matters

From [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md):

> "True independent discovery means: you identify the best lessons from curriculum content, COMMIT to your rankings, and ONLY THEN compare against what search returned."

Phase 1B establishes independent judgment. Without it, Phase 1C comparison is meaningless.

### Quality Over Speed

There is no time pressure. Each of the 24 queries deserves thorough investigation. Science is a critical subject — the ground truths established here will guide search improvement for months.
