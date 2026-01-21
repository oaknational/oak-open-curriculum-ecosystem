---
name: RE GT Phase 1B
overview: Phase 1B performs exhaustive discovery across bulk data and MCP tools for all 9 RE queries (4 primary, 5 secondary) to identify the BEST possible curriculum matches. COMMIT rankings for each query BEFORE any benchmark or expected slug review.
todos:
  - id: phase1b-setup
    content: Verify bulk data files exist and list ALL units for primary and secondary RE
    status: completed
  - id: 1b-primary-precise
    content: "PRIMARY precise-topic: \"religious founders and leaders\" - bulk search, MCP summaries, COMMIT rankings"
    status: completed
  - id: 1b-primary-natural
    content: "PRIMARY natural-expression: \"why do people pray\" - bulk search, MCP summaries, COMMIT rankings"
    status: completed
  - id: 1b-primary-imprecise
    content: "PRIMARY imprecise-input: \"relegion stories primary\" - bulk search, MCP summaries, COMMIT rankings"
    status: completed
  - id: 1b-primary-cross
    content: "PRIMARY cross-topic: \"places of worship and religious festivals\" - bulk search, MCP summaries, COMMIT rankings"
    status: completed
  - id: 1b-secondary-precise
    content: "SECONDARY precise-topic: \"religious beliefs and practices\" - bulk search, MCP summaries, COMMIT rankings"
    status: completed
  - id: 1b-secondary-natural
    content: "SECONDARY natural-expression: \"right and wrong philosophy\" - bulk search, MCP summaries, COMMIT rankings"
    status: completed
  - id: 1b-secondary-imprecise
    content: "SECONDARY imprecise-input: \"meditaton and prayer practices\" - bulk search, MCP summaries, COMMIT rankings"
    status: completed
  - id: 1b-secondary-cross
    content: "SECONDARY cross-topic: \"sacred texts and ethical teachings\" - bulk search, MCP summaries, COMMIT rankings"
    status: completed
  - id: 1b-secondary-cross2
    content: "SECONDARY cross-topic-2: \"East-West Schism...\" - bulk search, MCP summaries, COMMIT rankings (academic query)"
    status: completed
  - id: checkpoint-1b
    content: "CHECKPOINT: Verify ALL 9 queries have COMMIT tables complete, NO expected slugs seen, NO benchmark run"
    status: completed
---

# Religious Education Ground Truth Review: Phase 1B Discovery + COMMIT

**Last Updated**: 2026-01-21

**Status**: PLANNING

**Scope**: Exhaustive curriculum discovery for all 9 RE queries, COMMIT rankings BEFORE benchmark

---

## Context

Phase 1A (complete) revised 6 of 8 original queries to be generic, avoiding religion-specific proper nouns. Phase 1B performs independent discovery to find the BEST curriculum matches from bulk data and MCP tools.

### Prerequisite: Phase 0+1A Complete

The 9 queries are finalized:

**PRIMARY (4 queries)**:

- `precise-topic`: "religious founders and leaders"
- `natural-expression`: "why do people pray"
- `imprecise-input`: "relegion stories primary"
- `cross-topic`: "places of worship and religious festivals"

**SECONDARY (5 queries)**:

- `precise-topic`: "religious beliefs and practices"
- `natural-expression`: "right and wrong philosophy"
- `imprecise-input`: "meditaton and prayer practices"
- `cross-topic`: "sacred texts and ethical teachings"
- `cross-topic-2`: "East-West Schism and ecumenical movements compared with other religious traditions"

### Cardinal Rules (from semantic-search.prompt.md)

1. **The search might be RIGHT. Expected slugs might be WRONG.**
2. **Form YOUR OWN assessment BEFORE seeing search results OR expected slugs.**
3. **Title-only matching is NOT sufficient** - MCP summaries reveal content not visible in titles.

---

## Foundation Document Commitment

Before beginning work:

1. **Re-read** `.agent/directives-and-memory/rules.md` - Core principles
2. **Re-read** `.agent/prompts/semantic-search/semantic-search.prompt.md` - Protocol rules
3. **Re-read** [ground-truth-session-template.md](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/templates/ground-truth-session-template.md) - Phase 1B steps
4. **Ask**: "Have I explored ALL units, not just obvious title matches?"
5. **Verify**: NO `.expected.ts` files read, NO benchmark run until COMMIT complete

---

## Bulk Data Files

```bash
cd apps/oak-open-curriculum-semantic-search

# Verify bulk data exists
ls bulk-downloads/religious-education-primary.json bulk-downloads/religious-education-secondary.json

# List ALL units (primary)
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/religious-education-primary.json

# List ALL units (secondary)
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/religious-education-secondary.json

# List ALL lessons (for systematic review)
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/religious-education-primary.json | sort > /tmp/re-primary-lessons.txt

jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' \
  bulk-downloads/religious-education-secondary.json | sort > /tmp/re-secondary-lessons.txt
```

---

## Resolution Plan

### Phase 1B: Discovery + COMMIT (All 9 Queries)

**Key Principle**: Exhaustive discovery using BOTH bulk data AND MCP tools. DO NOT read `.expected.ts` files. DO NOT run benchmark until all COMMIT steps complete.

---

#### Task 1B.1: PRIMARY — "religious founders and leaders"

**Query Intent**: Discover content about founders/leaders across faiths (not religion-specific)

**Step 1B.1.1: Search Bulk Data (Multiple Terms)**

Search with 3+ different terms:

- "founder"
- "leader"
- "prophet"
- "important figure"
- "guru" / "rabbi" / "imam" (as concepts, not proper nouns)

```bash
# Search for founder/leader related terms
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | select(.lessonTitle | test("founder|leader|prophet|figure|life of"; "i")) | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/religious-education-primary.json
```

**Evidence Required**:

- 10+ candidate slugs from multiple search terms
- Note which units contain relevant content
- Note non-obvious lessons that might be relevant

**Step 1B.1.2: Get MCP Summaries (5-10 candidates)**

Call `get-lessons-summary` for candidates. Document:

- Slug
- Keywords
- Key Learning (quote exact text)

**Step 1B.1.3: Get Unit Context**

Call `get-units-summary` for relevant units. Note lesson ordering (foundational vs capstone).

**Step 1B.1.4: Analyse Candidates**

For each candidate:

- Does key learning directly address "founders and leaders"?
- Query match: STRONG / MODERATE / WEAK / NONE
- Reasoning

**Step 1B.1.5: COMMIT Rankings**

| Rank | Slug | Score (1-3) | Key Learning Quote | Why This Ranking |

|------|------|-------------|-------------------|------------------|

| 1 | ***|*** | "..." | ___ |

| 2 | ***|*** | "..." | ___ |

| 3 | ***|*** | "..." | ___ |

| 4 | ***|*** | "..." | ___ |

| 5 | ***|*** | "..." | ___ |

**Acceptance Criteria**:

- 10+ candidates identified from bulk data
- 5-10 MCP summaries with key learning quotes
- Unit context documented
- All candidates analysed with reasoning
- COMMIT table complete with scores and justifications

---

#### Task 1B.2: PRIMARY — "why do people pray"

**Query Intent**: Natural expression about prayer/worship concepts (vocabulary bridging)

**Discovery Focus**: "pray" should bridge to curriculum terms like "worship", "devotion", "prayer", "sacred practices"

**Step 1B.2.1-5**: Follow same structure as Task 1B.1

**Search Terms**: "pray", "worship", "devotion", "sacred", "ritual"

---

#### Task 1B.3: PRIMARY — "relegion stories primary"

**Query Intent**: Fuzzy recovery from "relegion" typo + "stories" concept

**Discovery Focus**: Religious stories, narratives, parables, sacred texts suitable for primary level

**Step 1B.3.1-5**: Follow same structure as Task 1B.1

**Search Terms**: "story", "stories", "narrative", "parable", "sacred text", "scripture"

---

#### Task 1B.4: PRIMARY — "places of worship and religious festivals"

**Query Intent**: Cross-topic intersection of TWO distinct concepts

**Discovery Focus**:

- Concept A: Places of worship (mosque, church, synagogue, temple, gurdwara)
- Concept B: Religious festivals (Diwali, Eid, Christmas, Hanukkah, Vaisakhi)
- Ideal: Lessons combining BOTH concepts

**Step 1B.4.1-5**: Follow same structure as Task 1B.1

**Search Terms**: "worship" + "festival", "place" + "celebration", "sacred building", "religious holiday"

**Special Note**: Document if no lessons combine BOTH concepts (curriculum gap, not search gap)

---

#### Task 1B.5: SECONDARY — "religious beliefs and practices"

**Query Intent**: Generic discovery of beliefs/practices content across faiths

**Step 1B.5.1-5**: Follow same structure as Task 1B.1

**Search Terms**: "belief", "practice", "worship", "ritual", "tradition", "observance"

---

#### Task 1B.6: SECONDARY — "right and wrong philosophy"

**Query Intent**: Vocabulary bridging — "right and wrong" should map to "ethics", "morality"

**Discovery Focus**: Ethics, moral philosophy, ethical teachings in religious contexts

**Step 1B.6.1-5**: Follow same structure as Task 1B.1

**Search Terms**: "ethic", "moral", "right", "wrong", "good", "evil", "justice"

---

#### Task 1B.7: SECONDARY — "meditaton and prayer practices"

**Query Intent**: Fuzzy recovery from "meditaton" typo + discovery of meditation/prayer content

**Discovery Focus**: Meditation, prayer, contemplation, spiritual practices

**Step 1B.7.1-5**: Follow same structure as Task 1B.1

**Search Terms**: "meditation", "prayer", "contemplation", "mindfulness", "spiritual practice"

---

#### Task 1B.8: SECONDARY — "sacred texts and ethical teachings"

**Query Intent**: Cross-topic intersection of scripture AND moral philosophy

**Discovery Focus**:

- Concept A: Sacred texts (Bible, Quran, Torah, Vedas, Guru Granth Sahib)
- Concept B: Ethical teachings (moral guidance, commandments, rules)
- Ideal: Lessons combining BOTH concepts

**Step 1B.8.1-5**: Follow same structure as Task 1B.1

**Search Terms**: "text" + "ethic", "scripture" + "moral", "teaching" + "guidance"

---

#### Task 1B.9: SECONDARY — "East-West Schism and ecumenical movements compared with other religious traditions"

**Query Intent**: Academic query testing sophisticated users - historical event with cross-tradition comparison

**Discovery Focus**:

- Primary concept: Christian schism, denominational differences, ecumenism
- Secondary concept: Comparative religion, interfaith dialogue
- This is a HIGH DIFFICULTY query - may have limited direct matches

**Step 1B.9.1-5**: Follow same structure as Task 1B.1

**Search Terms**: "schism", "denomination", "ecumenical", "unity", "division", "Catholic", "Orthodox", "Protestant", "comparative", "interfaith"

**Special Note**: Document if curriculum lacks content on this specific topic. Consider what the BEST available matches are, even if not perfect.

---

## Checkpoint 1B (All Queries)

Before proceeding to Phase 1C, verify for ALL 9 queries:

- [ ] 10+ candidate slugs from bulk data
- [ ] 5-10 MCP summaries with key learning quotes
- [ ] Unit context documented
- [ ] All candidates analysed with reasoning
- [ ] COMMIT table complete with scores and justifications
- [ ] **NO `.expected.ts` files read**
- [ ] **NO benchmark run**

**If ANY checkbox empty for ANY query, GO BACK. Do not proceed.**

---

## Success Criteria

### Phase 1B

- All 9 queries have exhaustive discovery documented
- Each query has 10+ candidates from bulk data
- Each query has 5-10 MCP summaries with key learning quotes
- Each query has COMMIT table with scores and justifications
- All work completed WITHOUT seeing expected slugs or search results
- Ready to proceed to Phase 1C (comparison)

---

## What Happens After Phase 1B

This plan ENDS at Phase 1B. The following phases are OUT OF SCOPE:

- **Phase 1C**: Comparison (benchmark + three-way comparison)
- **Phase 2**: Validation
- **Phase 3**: Documentation

---

## Anti-Pattern: Search Validation

### WRONG (Validates Search)

1. Run benchmark, see search returns A, B, C
2. Get MCP summaries for A, B, C
3. Conclude "A, B, C are good"
4. Fill COMMIT table with A, B, C

### CORRECT (Independent Discovery)

1. Search bulk data with multiple terms
2. Find candidates X, Y, Z, A, B, W...
3. Get MCP summaries, analyse each
4. COMMIT: X=#1, Y=#2, W=#3 (before seeing search)
5. ONLY THEN run benchmark in Phase 1C

---

## References

- Query files: `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/religious-education/`
- Bulk data: `apps/oak-open-curriculum-semantic-search/bulk-downloads/religious-education-*.json`
- Protocol: `.agent/plans/semantic-search/templates/ground-truth-session-template.md`
- Foundation: `.agent/directives-and-memory/rules.md`
