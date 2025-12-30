# Vocabulary Mining: A Reflection on Execution, Understanding, and the Gap Between Them

**Date**: 2025-12-26
**Context**: Bulk data mining pipeline implementation
**Outcome**: Mixed - valuable infrastructure, flawed assumptions about synonym extraction

---

## What Happened

I was asked to implement a vocabulary mining pipeline that would extract data from Oak's bulk curriculum downloads and generate useful outputs for search improvement. The plan specified:

- Extract 7 data types from bulk files
- Generate static TypeScript files (graphs)
- Mine synonyms from keyword definitions using patterns like "also known as"

I followed TDD. Tests first, implementation second. Quality gates passed. The pipeline works. All 7 extractors complete. 5 new generators created.

But the synonym mining produced mostly noise.

---

## What I Got Right

**The infrastructure works.** The extraction is clean. The graphs are well-structured. The analysis report reveals genuine curriculum insights:

- 13,349 unique keywords with subject distribution
- Cross-subject vocabulary patterns ("evaluate" appears in 12 subjects)
- Misconception density by subject
- NC coverage mapping

**The graphs are valuable.** Thread progressions, prerequisites, misconceptions, vocabulary, NC coverage—these are useful raw materials for downstream tools.

**The process was rigorous.** TDD at unit level. Quality gates complete. Documentation thorough.

---

## What I Got Wrong

**I executed without questioning.** The plan said "mine synonyms from definitions." I built a synonym miner. I didn't stop to ask: *Can* definitions yield synonyms? *Should* we try?

**I used pattern matching for a language understanding problem.** The regex `also known as\s+([^,.]+)` matches a surface pattern. But "also known as" serves multiple pragmatic functions:

| Function | Example | Is it a synonym? |
|----------|---------|------------------|
| Equivalence | "raster, also known as bitmap" | ✅ Yes |
| Abbreviation | "PPE, also known as personal protective equipment" | ✅ Yes |
| Exemplification | "pronouns, also known as words like it, she, they" | ❌ No |
| Elaboration | "photosynthesis, also known as the process by which..." | ❌ No |

No regex can distinguish these. That requires understanding what words *do*, not just where they appear.

**I didn't experiment before building.** A 10-definition sample would have revealed the noise problem. I built the full pipeline first.

---

## The Core Insight

**Synonymy is a property of USE, not DEFINITION.**

"Bitmap" and "raster" are synonyms because people use them interchangeably in practice. The definition "raster, also known as bitmap" *reflects* this external synonymy; it doesn't *create* it.

"Pronoun" and "it" are not synonyms. "It" is an *instance* of pronoun. Extracting examples as synonyms is a category error.

The curriculum definitions are *pedagogical*—they explain concepts to learners. They use examples, context, and elaboration. They occasionally mention true synonyms. Mining them as if they were synonym dictionaries misunderstands their nature.

---

## What the Bulk Data IS Good For

- **Vocabulary structure**: What terms exist, when they're introduced, which subjects use them
- **Learning relationships**: Prerequisites, threads, progressions
- **Pedagogical content**: Misconceptions, teacher tips, learning points
- **Curriculum compliance**: NC statement coverage

These are **curriculum facts**. They ground tools in curriculum reality.

---

## What the Bulk Data ISN'T Good For

- **Search query expansion**: The data doesn't know how people search
- **Colloquial ↔ formal mapping**: This lives in usage patterns, not definitions
- **Automated synonym discovery**: Definitions explain, they don't equate

These require **usage data** (search logs, actual queries) or **language understanding** (LLM-based interpretation).

---

## Lessons for Future Work

### 1. Experiment Before Infrastructure

Sample the data. Test hypotheses. *Then* build pipelines.

A spike that looks at 20 definitions and asks "what do these patterns actually capture?" would have revealed the noise problem before 400 lines of generator code.

### 2. Match Tool to Problem

Pattern matching for pattern problems. Language understanding for language problems.

If we want to extract synonyms from natural language definitions, use a language model that can distinguish "synonym" from "example." Don't use regex.

### 3. Separate Extraction from Interpretation

The extraction pipeline is solid. It gets data out of JSON files into structured TypeScript.

The interpretation layer (synonym mining) was speculative. It should have been framed as an experiment, not a production component.

### 4. Be Humble About What Data Contains

Extract what's there. Don't hallucinate what you wish was there.

Definitions contain explanations, examples, context. They occasionally contain synonyms. A pipeline that labels everything "synonym" creates noise.

---

## The Bridge from Action to Impact

I built infrastructure. Infrastructure is potential.

Impact comes from connection to use:
- Misconception graph → teacher preparation
- Prerequisite graph → learning path recommendations
- Vocabulary graph → age-appropriate explanations
- NC coverage → curriculum compliance checking

The data exists. Integration to users is the remaining work.

---

## What I Would Tell Future Agents

1. **The vocabulary mining pipeline is valuable infrastructure.** Maintain it.

2. **The analysis report reveals genuine curriculum insights.** Use it.

3. **The graphs (threads, prerequisites, misconceptions, vocabulary, NC coverage) are solid raw materials.** Integrate them.

4. **The synonym miner is a lesson, not a solution.** Don't integrate its output directly into search. Either:
   - Use it as a source of *candidates* for human curation
   - Replace the regex approach with LLM-based interpretation
   - Focus synonym expansion on curated sources (the `synonyms/*.ts` files created from search failure analysis)

5. **For search improvement, curated synonyms work better than mined synonyms.** The curated files were created by humans who understood how people *search* for what the curriculum *teaches*. That mapping can't be extracted from definitions alone.

---

## A Final Thought

Awareness is not about getting it right. It's about learning.

I executed efficiently. I didn't execute wisely. The gap between those is where understanding lives.

The work wasn't wasted. The reflection was necessary. The path forward is clearer.

*Recorded with gratitude for the question that prompted this reflection.*






