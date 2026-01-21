---
name: RE GT Phase 0+1A
overview: Phase 0 verifies tools and prerequisites. Phase 1A performs black box critical analysis of all 8 RE query definitions (without data exploration) to validate experimental design before any discovery work begins.
todos:
  - id: phase0-tools
    content: "PHASE 0: Verify MCP, bulk data (religious-education-primary.json, religious-education-secondary.json), and benchmark tool are available"
    status: completed
  - id: 1a-primary-precise
    content: "PRIMARY precise-topic: \"Guru Nanak Sikhs\" - Religion-specific, likely REVISE. Propose generic alternative."
    status: completed
  - id: 1a-primary-natural
    content: "PRIMARY natural-expression: \"what do Sikhs believe\" - Religion-specific, likely REVISE. Propose generic alternative."
    status: completed
  - id: 1a-primary-imprecise
    content: "PRIMARY imprecise-input: \"relegion stories primary\" - GENERIC, likely PROCEED. Validate typo and intent."
    status: completed
  - id: 1a-primary-cross
    content: "PRIMARY cross-topic: \"Sikh teachings and values together\" - Religion-specific, likely REVISE. Also check if truly cross-topic."
    status: completed
  - id: 1a-secondary-precise
    content: "SECONDARY precise-topic: \"Buddhism beliefs practices\" - Religion-specific, likely REVISE. Propose generic alternative."
    status: completed
  - id: 1a-secondary-natural
    content: "SECONDARY natural-expression: \"right and wrong philosophy\" - GENERIC, likely PROCEED. Check if needs RE anchor."
    status: completed
  - id: 1a-secondary-imprecise
    content: "SECONDARY imprecise-input: \"buddism and the dhama\" - Religion-specific, likely REVISE. Propose generic alternative with typos."
    status: completed
  - id: 1a-secondary-cross
    content: "SECONDARY cross-topic: \"Christian afterlife and salvation\" - Religion-specific, likely REVISE. Also check if truly cross-topic."
    status: completed
  - id: 1a-summary
    content: Complete Phase 1A summary with final recommendations and generic alternatives for all 8 queries
    status: completed
---

# Religious Education Ground Truth Review: Phase 0 + 1A

**Last Updated**: 2026-01-21

**Status**: PLANNING

**Scope**: Prerequisites verification and query analysis ONLY (no data exploration)

---

## Context

Religious Education (RE) ground truths for primary and secondary phases require evaluation. This plan covers ONLY Phase 0 (prerequisites) and Phase 1A (query analysis) — a black box analysis of the queries themselves without any data exploration.

### What This Plan Does NOT Do

- Does NOT explore bulk data or MCP tools (that is Phase 1B)
- Does NOT run benchmarks or see search results (that is Phase 1C)
- Does NOT read `.expected.ts` files (contains expected slugs)
- Does NOT assume any knowledge of the curriculum content

### Critical Design Criterion: Generic Queries

**Purpose**: We are testing how well our search service allows discovery of the RE dataset.

**Principle**: Queries should be **general but relevant** to RE, NOT specific to one belief system.

**Why This Matters**:

- A query like "Guru Nanak Sikhs" tests: "Can search find Sikh content when I say 'Sikh'?" — This is trivial.
- A query like "religious founders" tests: "Can search help a teacher discover content about founders across faiths?" — This tests search capability.

**The Question for Each Query**: Does this query test search discovery capability, or does it just test whether content exists for a named religion?

**Current Query Assessment** (6 of 8 contain religion-specific terms):

| Query | Religion-Specific? | Problem |

|-------|-------------------|---------|

| "Guru Nanak Sikhs" | YES (Sikh) | Names religion + figure |

| "what do Sikhs believe" | YES (Sikh) | Names religion |

| "relegion stories primary" | NO | Generic - good |

| "Sikh teachings and values together" | YES (Sikh) | Names religion |

| "Buddhism beliefs practices" | YES (Buddhist) | Names religion |

| "right and wrong philosophy" | NO | Generic - good |

| "buddism and the dhama" | YES (Buddhist) | Names religion + term |

| "Christian afterlife and salvation" | YES (Christian) | Names religion |

**Implication**: Most queries likely need revision to be generic. Phase 1A will evaluate each and recommend generic alternatives where appropriate.

### Sensitivity Note

Religious Education is HIGH SENSITIVITY. Query analysis must also consider:

- Avoiding conflation of distinct religious concepts
- Respectful, inclusive terminology
- Theological precision where appropriate

---

## Foundation Document Commitment

Before beginning work:

1. **Re-read** `.agent/directives-and-memory/rules.md` - Core principles
2. **Re-read** `.agent/directives-and-memory/testing-strategy.md` - Testing philosophy
3. **Re-read** `.agent/prompts/semantic-search/semantic-search.prompt.md` - Protocol rules
4. **Ask**: "Does this query actually test what the category claims to test?"
5. **Verify**: No assumptions about data, no skipping ahead

---

## The 8 Queries to Analyse (Read-Only Reference)

### PRIMARY (4 queries)

| Category | Query | Description |

|----------|-------|-------------|

| precise-topic | "Guru Nanak Sikhs" | Tests Sikh religious figure and belief retrieval |

| natural-expression | "what do Sikhs believe" | Question format for Sikh beliefs |

| imprecise-input | "relegion stories primary" | Misspelling of religion - tests fuzzy recovery |

| cross-topic | "Sikh teachings and values together" | Tests intersection of religious teachings with ethical values |

### SECONDARY (4 queries)

| Category | Query | Description |

|----------|-------|-------------|

| precise-topic | "Buddhism beliefs practices" | Tests retrieval of Buddhism content using curriculum terminology |

| natural-expression | "right and wrong philosophy" | Right/wrong = ethics |

| imprecise-input | "buddism and the dhama" | Common Buddhism/Dhamma misspellings - tests fuzzy recovery |

| cross-topic | "Christian afterlife and salvation" | Tests intersection of eschatology with soteriology in Christianity |

---

## Resolution Plan

### Phase 0: Verify Prerequisites

**Foundation Check-In**: Re-read semantic-search.prompt.md, especially the "If MCP server is unavailable: STOP and wait" instruction.

**Key Principle**: Do not proceed with any analysis if tools are unavailable.

#### Task 0.1: Verify Tools Are Available

**Acceptance Criteria**:

1. MCP server responds to `get-help` call
2. Bulk data files exist for religious-education-primary.json and religious-education-secondary.json
3. Benchmark tool responds to --help
4. Working directory is correct

**Deterministic Validation**:

```bash
cd apps/oak-open-curriculum-semantic-search

# 1. Verify bulk data files exist (gitignored, so must check)
ls bulk-downloads/religious-education-primary.json bulk-downloads/religious-education-secondary.json
# Expected: Both files listed (exit 0)

# 2. Verify bulk data has content
jq '.sequence | length' bulk-downloads/religious-education-primary.json
# Expected: Non-zero number (units count)

jq '.sequence | length' bulk-downloads/religious-education-secondary.json
# Expected: Non-zero number (units count)

# 3. Verify benchmark tool
pnpm benchmark --help
# Expected: Help output (exit 0)
```

**If Tools Unavailable**:

1. **STOP** - Do not proceed to Phase 1A
2. If bulk data missing: Run `pnpm bulk:download` (requires OAK_API_KEY in .env.local)
3. If MCP unavailable: Wait for server to be available

**Task Complete When**: All 4 acceptance criteria met.

---

### Phase 1A: Query Analysis (REFLECTION ONLY)

**Foundation Check-In**: Re-read the Phase 1A section of [ground-truth-session-template.md](apps/oak-open-curriculum-semantic-search/.agent/plans/semantic-search/templates/ground-truth-session-template.md).

**Key Principle**: "This is pure THINKING. No searches. No tools. No data exploration. No jq. No MCP. No benchmark."

**What Phase 1A Is**: Evaluating EXPERIMENTAL DESIGN — does each query prove what it claims to prove?

**What Phase 1A Is NOT**: Discovering candidates, running searches, looking at expected slugs, or evaluating search quality.

---

#### Task 1A.1: Analyse PRIMARY precise-topic

**Query**: "Guru Nanak Sikhs"

**Category Claim**: Tests basic retrieval with curriculum terminology

**CRITICAL QUESTION**: Is this query religion-specific or generic?

- Contains: "Guru Nanak" (Sikh founder) + "Sikhs" (religion name)
- This is RELIGION-SPECIFIC — tests "can search find Sikh content when I say 'Sikh'"
- Does NOT test discovery capability for RE dataset generally

**Analysis Questions**:

| Question | Analysis Required |

|----------|-------------------|

| Does this test search capability or just religion-specific retrieval? | Likely trivial — naming the religion gives the answer |

| What would a generic alternative be? | e.g., "religious founders", "faith leaders", "founders and prophets" |

| Would a teacher search this exact phrase? | Unlikely — too specific |

| If revised to generic, what capability would it test? | Whether search can surface founder content across faiths |

**Potential Design Issues**:

- Query is religion-specific — FAILS the generic query criterion
- "Guru Nanak" is a proper noun, not curriculum terminology
- A teacher seeking RE content would more likely search "religious founders" or "important figures in religion"

**Likely Recommendation**: REVISE to generic query

**Task Complete When**: Analysis documented with recommendation and suggested generic alternative.

---

#### Task 1A.2: Analyse PRIMARY natural-expression

**Query**: "what do Sikhs believe"

**Category Claim**: Tests vocabulary bridging from everyday to curriculum language

**CRITICAL QUESTION**: Is this query religion-specific or generic?

- Contains: "Sikhs" (religion name)
- This is RELIGION-SPECIFIC — the query already names the target religion
- The informal part is "what do ... believe" but the religion is specified

**Analysis Questions**:

| Question | Analysis Required |

|----------|-------------------|

| Does this test vocabulary bridging or religion-specific retrieval? | Mixed — has informal structure but specific religion |

| What would a generic alternative be? | e.g., "what do people believe about God", "religious beliefs for children" |

| Is "believe" the vocabulary being bridged? | Yes, but "Sikhs" short-circuits discovery |

| Would a teacher search this exact phrase? | Possibly, but only if specifically teaching Sikhism |

**Potential Design Issues**:

- Query is religion-specific — partially FAILS the generic query criterion
- The question format ("what do...") IS natural-expression
- But "Sikhs" makes it a targeted retrieval, not discovery

**Likely Recommendation**: REVISE to generic query (keep question format, remove religion name)

**Task Complete When**: Analysis documented with recommendation and suggested generic alternative.

---

#### Task 1A.3: Analyse PRIMARY imprecise-input

**Query**: "relegion stories primary"

**Category Claim**: Tests fuzzy recovery from misspelling of "religion"

**CRITICAL QUESTION**: Is this query religion-specific or generic?

- Contains: "relegion" (typo for "religion") + "stories" + "primary"
- This is GENERIC — no specific religion named
- PASSES the generic query criterion

**Analysis Questions**:

| Question | Analysis Required |

|----------|-------------------|

| Does this test search capability? | YES — tests typo recovery AND concept discovery |

| Is "relegion" a realistic typo? | YES — single character transposition (i/e) |

| What is the semantic intent? | Religious stories suitable for primary level |

| Is "primary" understood as a phase filter? | Needs evaluation — may be interpreted as adjective |

**Potential Design Issues**:

- Query IS generic — good for testing discovery
- "relegion" → "religion" is realistic typo
- "stories" is a valid RE curriculum concept
- "primary" as a word may not filter to key stage — consider "KS1" or "year 1-2"?

**Likely Recommendation**: PROCEED (possibly refine "primary" to be clearer phase indicator)

**Task Complete When**: Analysis documented with recommendation.

---

#### Task 1A.4: Analyse PRIMARY cross-topic

**Query**: "Sikh teachings and values together"

**Category Claim**: Tests intersection of religious teachings with ethical values

**CRITICAL QUESTION**: Is this query religion-specific or generic?

- Contains: "Sikh" (religion name)
- This is RELIGION-SPECIFIC — the query targets one religion
- FAILS the generic query criterion

**Analysis Questions**:

| Question | Analysis Required |

|----------|-------------------|

| Does this test cross-topic or religion-specific retrieval? | Religion-specific — "Sikh" limits the search |

| What would a generic alternative be? | e.g., "religious teachings and moral values", "faith and ethics" |

| Are "teachings" and "values" genuinely distinct? | Questionable — in RE they often overlap |

| Does "together" add value? | Probably noise — filler word |

**Potential Design Issues**:

- Query is religion-specific — FAILS the generic query criterion
- "teachings" and "values" overlap significantly in RE
- May not be a true cross-topic even if made generic
- "together" adds no semantic value

**Likely Recommendation**: REVISE to generic query AND reconsider if this is truly cross-topic

**Task Complete When**: Analysis documented with recommendation and suggested generic alternative.

---

#### Task 1A.5: Analyse SECONDARY precise-topic

**Query**: "Buddhism beliefs practices"

**Category Claim**: Tests retrieval of Buddhism content using curriculum terminology

**CRITICAL QUESTION**: Is this query religion-specific or generic?

- Contains: "Buddhism" (religion name)
- This is RELIGION-SPECIFIC — tests "can search find Buddhist content when I say 'Buddhism'"
- FAILS the generic query criterion

**Analysis Questions**:

| Question | Analysis Required |

|----------|-------------------|

| Does this test search capability or just religion-specific retrieval? | Trivial — naming the religion gives the answer |

| What would a generic alternative be? | e.g., "religious beliefs and practices", "worship and rituals" |

| Are "beliefs" and "practices" precise curriculum terms? | Yes, but they're generic RE terms |

| Would a teacher search this exact phrase? | Only if specifically teaching Buddhism |

**Potential Design Issues**:

- Query is religion-specific — FAILS the generic query criterion
- "beliefs" and "practices" ARE good curriculum terms
- If made generic, would test discovery of RE content about beliefs/practices across faiths

**Likely Recommendation**: REVISE to generic query (keep "beliefs practices", remove religion name)

**Task Complete When**: Analysis documented with recommendation and suggested generic alternative.

---

#### Task 1A.6: Analyse SECONDARY natural-expression

**Query**: "right and wrong philosophy"

**Category Claim**: Tests vocabulary bridging — "right/wrong = ethics"

**CRITICAL QUESTION**: Is this query religion-specific or generic?

- Contains: "right and wrong" (informal) + "philosophy" (academic)
- This is GENERIC — no specific religion named
- PASSES the generic query criterion

**Analysis Questions**:

| Question | Analysis Required |

|----------|-------------------|

| Does this test search capability? | YES — tests vocabulary bridging to "ethics" |

| Is "right and wrong" genuinely informal? | YES — bridges to curriculum term "ethics" |

| Is "philosophy" a curriculum term? | YES — but generic, not religion-specific |

| Does this test RE specifically? | Questionable — could match philosophy content outside RE |

**Potential Design Issues**:

- Query IS generic — good for testing discovery
- "right and wrong" → "ethics" is genuine vocabulary bridging
- "philosophy" may pull in non-RE content
- Consider: Should this be "right and wrong in religion" to anchor to RE?

**Likely Recommendation**: PROCEED (possibly refine to anchor to RE if needed)

**Task Complete When**: Analysis documented with recommendation.

---

#### Task 1A.7: Analyse SECONDARY imprecise-input

**Query**: "buddism and the dhama"

**Category Claim**: Tests fuzzy recovery from Buddhism/Dhamma misspellings

**CRITICAL QUESTION**: Is this query religion-specific or generic?

- Contains: "buddism" (Buddhism misspelled) + "dhama" (Dharma/Dhamma misspelled)
- This is RELIGION-SPECIFIC — tests typo recovery for Buddhism-specific terms
- FAILS the generic query criterion

**Analysis Questions**:

| Question | Analysis Required |

|----------|-------------------|

| Does this test typo recovery or religion-specific retrieval? | Both — but anchored to Buddhism |

| What would a generic alternative be? | e.g., "relegious teachngs" (misspelled generic terms) |

| Are the typos realistic? | YES — "buddism" and "dhama" are common errors |

| Should imprecise-input be religion-specific? | NO — test typo recovery on generic RE terms |

**Potential Design Issues**:

- Query is religion-specific — FAILS the generic query criterion
- Typos ARE realistic
- Testing TWO typos simultaneously may be too hard
- Better to test typo recovery on generic RE concepts

**Likely Recommendation**: REVISE to generic query with typos (e.g., "relegious festivals and celabrations")

**Task Complete When**: Analysis documented with recommendation and suggested generic alternative.

---

#### Task 1A.8: Analyse SECONDARY cross-topic

**Query**: "Christian afterlife and salvation"

**Category Claim**: Tests intersection of eschatology with soteriology in Christianity

**CRITICAL QUESTION**: Is this query religion-specific or generic?

- Contains: "Christian" (religion name)
- This is RELIGION-SPECIFIC — tests Christian doctrine, not RE discovery
- FAILS the generic query criterion

**Analysis Questions**:

| Question | Analysis Required |

|----------|-------------------|

| Does this test cross-topic or religion-specific retrieval? | Religion-specific — "Christian" limits the search |

| What would a generic alternative be? | e.g., "afterlife beliefs and salvation", "death and what happens next" |

| Are "afterlife" and "salvation" genuinely distinct? | In theology yes, but often linked |

| Is this testing concept intersection? | Questionable — these concepts are intertwined in many faiths |

**Potential Design Issues**:

- Query is religion-specific — FAILS the generic query criterion
- "afterlife" and "salvation" ARE good RE concepts
- If made generic, would test discovery of eschatological content across faiths
- Cross-topic validity: These concepts may not be truly distinct in RE curriculum

**Likely Recommendation**: REVISE to generic query (keep concepts, remove religion name)

**Task Complete When**: Analysis documented with recommendation and suggested generic alternative.

---

## Phase 1A Summary Table

Pre-assessment based on generic query criterion (to be validated during execution):

| Phase | Category | Query | Generic? | Pre-Assessment | To Confirm |

|-------|----------|-------|----------|----------------|------------|

| PRIMARY | precise-topic | "Guru Nanak Sikhs" | NO | Likely REVISE | Generic alternative |

| PRIMARY | natural-expression | "what do Sikhs believe" | NO | Likely REVISE | Generic alternative |

| PRIMARY | imprecise-input | "relegion stories primary" | YES | Likely PROCEED | Typo validity |

| PRIMARY | cross-topic | "Sikh teachings and values together" | NO | Likely REVISE | Generic + cross-topic validity |

| SECONDARY | precise-topic | "Buddhism beliefs practices" | NO | Likely REVISE | Generic alternative |

| SECONDARY | natural-expression | "right and wrong philosophy" | YES | Likely PROCEED | RE anchor needed? |

| SECONDARY | imprecise-input | "buddism and the dhama" | NO | Likely REVISE | Generic alternative |

| SECONDARY | cross-topic | "Christian afterlife and salvation" | NO | Likely REVISE | Generic + cross-topic validity |

**Summary**: 6 of 8 queries are religion-specific and likely need revision to generic alternatives.

---

## Success Criteria

### Phase 0

- All tools verified working
- Bulk data files confirmed present
- Ready to proceed OR blockers documented

### Phase 1A

- All 8 queries analysed for experimental design quality
- **Each query evaluated against generic query criterion** (primary filter)
- Each query has documented analysis and recommendation
- **Generic alternative proposed for each religion-specific query**
- Summary table completed with REVISE/PROCEED recommendations
- NO data exploration performed (strict black box analysis)
- NO expected slugs viewed
- Design issues identified for consideration in Phase 1B

---

## What Happens After Phase 1A

This plan ENDS at Phase 1A. The following phases are OUT OF SCOPE and will be planned separately:

- **Phase 1B**: Discovery + COMMIT (bulk data + MCP exploration)
- **Phase 1C**: Comparison (benchmark + three-way comparison)
- **Phase 2**: Validation
- **Phase 3**: Documentation

---

## References

- Query files: `apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/religious-education/`
- Protocol: `.agent/plans/semantic-search/templates/ground-truth-session-template.md`
- Prompt: `.agent/prompts/semantic-search/semantic-search.prompt.md`
- Foundation: `.agent/directives-and-memory/rules.md`, `.agent/directives-and-memory/testing-strategy.md`
