# Vocabulary Value Analysis

**Created**: 2025-12-26  
**Context**: Semantic search vocabulary mining  
**Status**: 🔬 RESEARCH — Insights for action

---

## Purpose

This document captures the vocabulary value analysis methodology and findings from the bulk download mining work. The goal is to enable **data-driven synonym prioritisation** rather than reactive "fix failing queries" approach.

---

## The Value Score Framework

Every curriculum term can be scored by potential search impact:

```
Value = Frequency × Foundation Bonus × Cross-Subject Bonus
      = Frequency × (1 + 1/Year) × (1 + 0.2*(subjects-1))
```

### Factor Rationale

| Factor | Calculation | Why It Matters |
|--------|-------------|----------------|
| **Frequency** | Raw count from vocabulary graph | More lessons teach this → more search opportunities |
| **Foundation Bonus** | `1 + (1/Year)` | Year 1 terms get 2x, Year 2 get 1.5x, etc. Earlier = more foundational |
| **Cross-Subject Bonus** | `1 + 0.2*(subjects-1)` | Each additional subject adds 20%. Cross-subject terms have broader search |

### Example Calculations

```
adjective: 212 freq × (1 + 1/1) × (1 + 0.2*(4-1)) = 212 × 2 × 1.6 = 678
noun:      181 freq × (1 + 1/1) × (1 + 0.2*(4-1)) = 181 × 2 × 1.6 = 579
evaluate:   58 freq × (1 + 1/1) × (1 + 0.2*(12-1)) = 58 × 2 × 3.2 = 371
gradient:   50 freq × (1 + 1/3) × (1 + 0.2*(7-1)) = 50 × 1.33 × 2.2 = 147
```

---

## Top 50 Terms by Value Score

| Rank | Term | Value | Freq | Year | Subjects |
|------|------|-------|------|------|----------|
| 1 | adjective | 678 | 212 | 1 | 4 |
| 2 | noun | 579 | 181 | 1 | 4 |
| 3 | theme | 419 | 131 | 1 | 4 |
| 4 | synonym | 403 | 126 | 1 | 4 |
| 5 | suffix | 378 | 135 | 1 | 3 |
| 6 | texture | 374 | 85 | 1 | 7 |
| 7 | evaluate | 371 | 58 | 1 | 12 |
| 8 | structure | 326 | 68 | 1 | 8 |
| 9 | prediction | 312 | 65 | 1 | 8 |
| 10 | volume | 308 | 70 | 1 | 7 |
| 11 | verb | 304 | 95 | 1 | 4 |
| 12 | plan | 295 | 82 | 1 | 5 |
| 13 | evidence | 251 | 57 | 1 | 7 |
| 14 | power | 250 | 52 | 1 | 8 |
| 15 | purpose | 244 | 61 | 1 | 6 |
| 16 | adverb | 240 | 75 | 1 | 4 |
| 17 | perspective | 234 | 65 | 1 | 5 |
| 18 | sequence | 224 | 56 | 1 | 6 |
| 19 | expression | 220 | 55 | 1 | 6 |
| 20 | root word | 216 | 108 | 1 | 1 |
| 21 | atmosphere | 216 | 60 | 1 | 5 |
| 22 | difference | 209 | 58 | 1 | 5 |
| 23 | partition | 207 | 74 | 1 | 3 |
| 24 | data | 207 | 47 | 1 | 7 |
| 25 | tone | 205 | 64 | 1 | 4 |
| 26 | community | 203 | 39 | 1 | 9 |
| 27 | compare | 202 | 63 | 1 | 4 |
| 28 | sustainable | 202 | 42 | 1 | 8 |
| 29 | rhythm | 198 | 62 | 1 | 4 |
| 30 | conclusion | 184 | 46 | 1 | 6 |
| 31 | symbol | 182 | 38 | 1 | 8 |
| 32 | feedback | 180 | 45 | 1 | 6 |
| 33 | object | 180 | 41 | 1 | 7 |
| 34 | character | 173 | 54 | 1 | 4 |
| 35 | migration | 167 | 38 | 1 | 7 |
| 36 | climate | 166 | 46 | 1 | 5 |
| 37 | imagery | 163 | 51 | 1 | 4 |
| 38 | context | 161 | 55 | 3 | 7 |
| 39 | inequality | 157 | 59 | 3 | 6 |
| 40 | performance | 155 | 43 | 1 | 5 |
| 41 | multiple | 154 | 77 | 1 | 1 |
| 42 | accuracy | 151 | 42 | 1 | 5 |
| 43 | identity | 148 | 37 | 1 | 6 |
| 44 | gradient | 147 | 50 | 3 | 7 |
| 45 | reflect | 146 | 28 | 1 | 9 |
| 46 | scale | 145 | 33 | 1 | 7 |
| 47 | balance | 144 | 40 | 1 | 5 |
| 48 | composition | 144 | 36 | 1 | 6 |
| 49 | join | 143 | 51 | 1 | 3 |
| 50 | fronted adverbial | 140 | 70 | 1 | 1 |

---

## High-Value Synonym Candidates

Terms likely needing "plain English" synonyms for teacher search:

### English/Literacy Terms

| Term | Value | Freq | Definition Pattern | Suggested Synonyms |
|------|-------|------|-------------------|-------------------|
| adjective | 678 | 212 | "a word that **describes** a noun" | describing word, descriptive word |
| noun | 579 | 181 | "a **naming** word for people, places or things" | naming word, name word |
| suffix | 378 | 135 | "a letter or group of letters at the **end of a word**" | word ending, end of word |
| verb | 304 | 95 | "a being, **doing** or having word" | action word, doing word |
| adverb | 240 | 75 | "a word that **describes a verb**" | -ly word, how/when/where word |
| root word | 216 | 108 | "the **base word** from which other words are formed" | base word, stem |
| prefix | 94 | 26 | "changes the **start of a word**" | word beginning, start of word |
| fronted adverbial | 140 | 70 | "a sentence **starter** followed by a comma" | sentence starter |

### Maths Terms

| Term | Value | Freq | Definition Pattern | Suggested Synonyms |
|------|-------|------|-------------------|-------------------|
| partition | 207 | 74 | "to **divide into parts**" | break apart, split up, divide |
| multiple | 154 | 77 | "the result of **multiplying** a number" | times table number, times result |
| equation | 118 | 59 | "one number or calculation is **equal** to another" | number sentence, maths problem, sum |
| denominator | 55 | 41 | "the **bottom number** in a fraction" | bottom number, number below the line |
| numerator | 44 | 33 | "the **top number** in a fraction" | top number, number above the line |
| estimate | 109 | 39 | "find a value that is **close enough**" | guess, rough answer, approximately |
| evaluate | 371 | 58 | "**work out** how good it is" | work out, calculate, assess |

### Science Terms

| Term | Value | Freq | Definition Pattern | Suggested Synonyms |
|------|-------|------|-------------------|-------------------|
| prediction | 312 | 65 | "what you **think will happen**" | guess, what will happen |
| evidence | 251 | 57 | "**proof** or information" | proof, facts, data |
| conclusion | 184 | 46 | "final **result** or decision" | result, finding, answer |

---

## The Definition-as-Synonym-Source Pattern

The curriculum definitions often contain the natural synonym in the explanation:

```
TERM: "SYNONYM PATTERN in definition text..."

adjective: "a word that DESCRIBES a noun"           → describing word
noun:      "a NAMING word for people..."            → naming word
verb:      "a being, DOING or having word"          → doing word
partition: "to DIVIDE into parts"                   → divide, split
denominator: "the BOTTOM NUMBER in a fraction"     → bottom number
```

**Key insight**: The definition IS the synonym source — not regex patterns like "also known as". The definitions contain explanatory phrases that teachers use when searching.

---

## Cross-Subject Vocabulary Analysis

Terms appearing in multiple subjects have different meanings but high search value:

| Term | Frequency | Subjects | Note |
|------|-----------|----------|------|
| evaluate | 58 | 12 (most cross-subject term) | Different meaning per subject |
| structure | 68 | 8 | Architecture vs text vs molecule |
| prediction | 65 | 8 | Science hypothesis vs story prediction |
| power | 52 | 8 | Mathematical power vs political power |
| sustainable | 42 | 8 | Environmental context |
| texture | 85 | 7 | Art vs food vs music |
| volume | 70 | 7 | Sound volume vs 3D volume |
| evidence | 57 | 7 | Scientific vs historical vs legal |
| gradient | 50 | 7 | Maths slope vs art color transition |
| data | 47 | 7 | Computing vs science vs statistics |

**Implication**: Search must handle subject context. A query for "gradient" in maths context should find slope lessons, not art colour blending lessons.

---

## Current Synonym Coverage Analysis

| Metric | Value |
|--------|-------|
| Total curated synonyms | 163 entries |
| Top 100 terms covered | **0%** |
| Focus of current synonyms | GCSE compound terms (linear-equations, completing-the-square) |
| Focus needed | KS1/KS2 foundational vocabulary |

---

## Recommended Actions

### 1. Add Foundational Synonyms (High Priority)

Update `synonyms/english.ts`:
```typescript
adjective: ['describing word', 'descriptive word'],
noun: ['naming word', 'name word'],
verb: ['action word', 'doing word', 'being word'],
adverb: ['-ly word', 'describing verb word'],
suffix: ['word ending', 'end of word'],
prefix: ['word beginning', 'start of word'],
'fronted adverbial': ['sentence starter', 'adverbial phrase'],
'root word': ['base word', 'stem word'],
```

Update `synonyms/maths.ts`:
```typescript
partition: ['break apart', 'split up', 'divide into parts'],
multiple: ['times table number', 'times result'],
equation: ['number sentence', 'maths problem', 'sum'],
denominator: ['bottom number', 'number below the line'],
numerator: ['top number', 'number above the line'],
estimate: ['guess', 'rough answer', 'approximately'],
evaluate: ['work out', 'calculate', 'assess'],
```

### 2. Generate Synonym Candidate Report

New vocab-gen command:
```bash
pnpm vocab-gen --synonym-candidates
```

Output: Value-ranked terms with suggested synonyms extracted from definitions.

### 3. Design Stratified Evaluation Corpus

Replace ad-hoc diagnostic queries with systematic coverage:
- By subject (maths, english, science, history, etc.)
- By key stage (KS1, KS2, KS3, KS4)
- By query type (definition, topic, synonym-dependent, multi-concept)
- By persona (teacher, student, curriculum planner)

---

## Data Sources

- **Vocabulary graph**: `packages/sdks/oak-curriculum-sdk/src/mcp/vocabulary-graph-data.ts`
- **Curated synonyms**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/*.ts`
- **Bulk download data**: `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/`

---

## Related Documents

- [elasticsearch-optimization-opportunities.md](elasticsearch-optimization-opportunities.md) — ES optimization research
- [vocabulary-mining-bulk.md](../../plans/semantic-search/planned/vocabulary-mining-bulk.md) — Main plan
- [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md) — Graph export pattern
- [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) — Synonym source of truth

