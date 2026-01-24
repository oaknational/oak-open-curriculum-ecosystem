---
name: Spanish GT Phase 1A
overview: Phase 1A is REFLECTION ONLY — critically evaluate each of the 8 Spanish queries (4 primary, 4 secondary) as experimental designs, assessing whether they are good tests of their claimed capabilities. No tools, no searches, no benchmark, no expected slugs. Apply French/German MFL learnings as context.
todos:
  - id: prereq-reread
    content: Re-read and re-commit to foundation documents (rules.md, testing-strategy.md, schema-first-execution.md, semantic-search.prompt.md)
    status: completed
  - id: primary-precise
    content: "Phase 1A: PRIMARY precise-topic \"Spanish verb ser\" — evaluate as experimental design"
    status: completed
  - id: primary-natural
    content: "Phase 1A: PRIMARY natural-expression \"teach spanish greetings to children\" — evaluate as experimental design (apply greetings≠introductions learning)"
    status: completed
  - id: primary-imprecise
    content: "Phase 1A: PRIMARY imprecise-input \"spansh vocabulary primary\" — evaluate as experimental design"
    status: completed
  - id: primary-cross
    content: "Phase 1A: PRIMARY cross-topic \"Spanish verbs ser and estar together\" — evaluate as experimental design (does intersection exist at primary level?)"
    status: completed
  - id: secondary-precise
    content: "Phase 1A: SECONDARY precise-topic \"Spanish AR verbs present tense\" — evaluate as experimental design"
    status: completed
  - id: secondary-natural
    content: "Phase 1A: SECONDARY natural-expression \"teach Spanish verb endings year 7\" — evaluate as experimental design (apply German session learning)"
    status: completed
  - id: secondary-imprecise
    content: "Phase 1A: SECONDARY imprecise-input \"spanish grammer conjugating verbs\" — evaluate as experimental design"
    status: completed
  - id: secondary-cross
    content: "Phase 1A: SECONDARY cross-topic \"Spanish verbs and nouns together\" — evaluate as experimental design (is this too broad?)"
    status: completed
  - id: checkpoint-1a
    content: "Phase 1A CHECKPOINT: Verify all 8 queries have documented evaluations, NO tools were used, recommendations made for each"
    status: completed
---

# Spanish Ground Truth Phase 1A: Query Analysis (REFLECTION ONLY)

## Scope

Evaluate 8 Spanish queries (4 primary + 4 secondary) through **pure reflection**. This is about experimental design — does each query prove what it claims to prove?

---

## Pre-Requisites (Before Any Analysis)

Re-read and re-commit to these foundation documents:

- [rules.md](.agent/directives-and-memory/rules.md) — First Question: "Could it be simpler without compromising quality?"
- [testing-strategy.md](.agent/directives-and-memory/testing-strategy.md) — TDD at all levels, behaviour over implementation
- [schema-first-execution.md](.agent/directives-and-memory/schema-first-execution.md) — Schema-first mindset
- [semantic-search.prompt.md](.agent/prompts/semantic-search/semantic-search.prompt.md) — Cardinal rules and quality over speed

---

## MFL Context (From French/German Sessions)

Apply these proven learnings during reflection:

1. **Structure-only retrieval**: Spanish has ~0% content coverage (no transcripts). Keywords and key learning are everything.
2. **"Greetings" is NOT "Introductions"**: Greetings = hola/buenos días. Introductions = me llamo/soy.
3. **Cross-topic requires BOTH concepts in keywords**: Not just in key learning. If query uses "verbs", expected slugs need "verb" in keywords.
4. **Title matching heavily weighted**: Lessons with query terms in title rank higher.
5. **Year group matters**: "year 7" in query should weight foundational content.
6. **Register must match level**: Informal/basic language expects foundational content, not advanced.

---

## Phase 1A Protocol

For EACH query, answer these questions through pure reflection:

### Step 1A.1: State the Capability Being Tested

| Category | Capability Being Tested |

|----------|-------------------------|

| `precise-topic` | Basic retrieval with curriculum terminology |

| `natural-expression` | Vocabulary bridging from everyday to curriculum language |

| `imprecise-input` | Resilience to typos and messy input |

| `cross-topic` | Finding concept intersections |

### Step 1A.2: Evaluate Query as Test

- What does this query literally say?
- Is this query representative of real teacher behaviour for this category?
- If search succeeds, does that demonstrate the capability works?
- If search fails, does that reveal a real limitation?

### Step 1A.3: Assess Experimental Design Quality

- For `precise-topic`: Is this actually precise curriculum terminology?
- For `natural-expression`: Is this genuinely informal language (not curriculum terms)?
- For `imprecise-input`: Is the error realistic? Is this testing typo recovery or compound word expansion?
- For `cross-topic`: Does this intersection EXIST in the curriculum?

### Step 1A.4: Identify Design Issues

- Query doesn't test claimed capability?
- Query is miscategorised?
- Query success/failure won't be informative?
- Query is too easy or impossible?

### Step 1A.5: Recommendation

- Proceed, revise, or change category

---

## Queries to Evaluate

### Spanish PRIMARY (4 queries)

| Category | Query | Description |

|----------|-------|-------------|

| precise-topic | "Spanish verb ser" | Tests core verb concept retrieval in MFL |

| natural-expression | "teach spanish greetings to children" | Teacher intent phrasing for basic Spanish vocabulary |

| imprecise-input | "spansh vocabulary primary" | Misspelling of Spanish - tests fuzzy recovery |

| cross-topic | "Spanish verbs ser and estar together" | Tests intersection of two key Spanish verb concepts |

### Spanish SECONDARY (4 queries)

| Category | Query | Description |

|----------|-------|-------------|

| precise-topic | "Spanish AR verbs present tense" | Tests retrieval using curriculum terminology |

| natural-expression | "teach Spanish verb endings year 7" | Teacher request for verb conjugation |

| imprecise-input | "spanish grammer conjugating verbs" | Common grammar misspelling - tests fuzzy recovery |

| cross-topic | "Spanish verbs and nouns together" | Tests intersection of verb conjugation with noun/article agreement |

---

## Potential Concerns to Investigate (Reflection Focus)

### PRIMARY

1. **precise-topic "Spanish verb ser"**: Does primary curriculum use the term "ser" explicitly, or does it use phrases like "how to say I am"?

2. **natural-expression "teach spanish greetings to children"**: French session proved "greetings" ≠ "introductions". Is this query clear about what greetings means (hola, buenos días, buenas tardes)?

3. **cross-topic "Spanish verbs ser and estar together"**: At primary level, do lessons exist that teach BOTH ser AND estar in the same lesson? This is a specific question about curriculum reality.

### SECONDARY

1. **natural-expression "teach Spanish verb endings year 7"**: Nearly identical to German's "teach German verb endings year 7" which had MRR 0.500. Is Year 7 content weighted properly?

2. **cross-topic "Spanish verbs and nouns together"**: This is very broad. Every Spanish lesson involves verbs and nouns. Is this testing a meaningful intersection, or is it trivially true?

---

## What Phase 1A Does NOT Include

- NO jq searches on bulk data
- NO MCP tool calls
- NO benchmark runs
- NO reading of `.expected.ts` files
- NO data exploration of any kind

This is pure thinking about whether these queries are good tests.

---

## Checkpoint: Phase 1A Complete When

For EACH of the 8 queries:

- [ ] Capability being tested is clearly stated
- [ ] Query evaluated as test of that capability
- [ ] Experimental design quality assessed
- [ ] Potential design issues identified
- [ ] Recommendation made (proceed, revise, or change category)
- [ ] **Confirmed: No tools or searches were used**

---

## Output Format

Document findings in this structure for each query:

```markdown
### [PHASE]/[CATEGORY]

**Query**: "..."
**Capability Tested**: ...

**Evaluation**:
- What it literally says: ...
- Representative of teacher behaviour: Yes/No because...
- Success would prove: ...
- Failure would reveal: ...

**Design Quality Assessment**:
- [Category-specific analysis]

**Issues Identified**: None / [list issues]

**Recommendation**: Proceed / Revise to "..." / Change category to...
```
