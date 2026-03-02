
# Offline Vocabulary Mining & Analysis Pipeline

> **Status**: Research documentation
> **Last Updated**: 2026-01-17

_Scope, guarantees, failure modes, and promotion rules_

This document defines the **offline Python analysis workspace** used to mine curriculum data and produce **trusted, reviewable knowledge artifacts** for search and AI systems.

> **Current State**: Oak Search currently uses manually curated synonyms in `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/` (~580 entries across 17 subjects). A TypeScript-based synonym miner already exists at `vocab-gen/generators/synonym-miner.ts` that extracts synonyms from keyword definitions using patterns like "also known as".

> **Future Direction**: Static vocabulary analysis (mining) will eventually move **upstream** to the bulk-data generation pipeline (i.e., where Oak's curriculum data is assembled). This keeps vocabulary extraction close to the source data and maintains the SDK as a consumer of generated artefacts.

It exists to **bound responsibility**.

The mining pipeline is powerful, but deliberately **non-authoritative**. Its role is to _propose_, never to _decide_. All behaviour in Elasticsearch remains driven by explicitly reviewed and versioned assets.

This document should be read alongside:

- the Search Decision Model (behaviour and routing)
- the synonym and vocabulary governance documents
- the Elastic Serverless execution strategy

---

## 1. Purpose and non-goals

### 1.1 Purpose

The Python analysis workspace exists to:

- Process large, heterogeneous curriculum datasets efficiently
- Extract **candidate lexical and conceptual knowledge**
- Improve recall and domain coverage in a controlled way
- Support **human review and governance**
- Produce **deterministic, auditable artifacts**

It is an **offline, batch-oriented system**.

---

### 1.2 Explicit non-goals

The mining workspace does **not**:

- Decide search behaviour
- Modify Elasticsearch indices directly
- Create or update synonym sets automatically
- Encode ranking logic
- Infer intent or sense authoritatively
- Operate at query-time
- Replace human judgement

> If a change affects runtime search behaviour, it must go through review and promotion outside the mining pipeline.

---

## 2. Inputs and trust boundaries

### 2.1 Authoritative inputs

The following inputs are treated as **authoritative structure**, but not authoritative semantics:

- Oak bulk curriculum JSON (subject–phase partitioned)
- Curriculum metadata (subjects, phases, units, lessons)
- Lesson keywords and learning outcomes
- Pupil-facing keyword definitions (as _candidate definitions_, not truth)

Public reference for Oak bulk data shape:

- <https://open-api.thenational.academy/docs>
- <https://open-api.thenational.academy/docs/api-endpoints/lesson-data>

---

### 2.2 Non-authoritative inputs

The following inputs are **supporting evidence only**:

- Lesson transcripts
- Teacher tips
- Free-text descriptions
- Worked examples
- Assessment questions

These are high-signal, but noisy. They **must never be used alone** to infer equivalence.

---

### 2.3 Structural guarantees

The mining pipeline enforces:

- **Subject–phase isolation** (e.g. `maths-secondary` is never mixed with `science-secondary`)
- Deterministic traversal order
- Explicit null handling (`null`, `"NULL"`, missing fields)
- Streaming or chunked processing for large datasets

This ensures that “sense leakage” cannot occur accidentally.

---

## 3. Canonical outputs (closed set)

The mining pipeline is only allowed to emit the following artifacts.

If an output does not fit one of these categories, it should **not exist**.

---

### 3.1 `aliases.<sense>.json`  

**Strict equivalence candidates only**

Purpose:

- Propose abbreviations, aliases, and formatting variants that may be _truly interchangeable_

Allowed content:

- Acronyms ↔ expansions
- Spelling variants (UK/US, hyphenation)
- Stable symbol ↔ phrase mappings (especially in maths)

Required evidence:

- Explicit patterns (`X (Y)`, `Y (X)`, `X = Y`)
- Consistent usage across multiple lessons
- Low ambiguity across contexts

Forbidden evidence:

- Co-occurrence alone
- Proximity in transcripts
- Conceptual relatedness

These files may be promoted to Elasticsearch synonym sets **only after review**.

---

### 3.2 `vocab.<sense>.json`  

**Phrase detection dictionary**

Purpose:

- Identify multi-word domain phrases reliably at query-time

Allowed content:

- Noun phrases
- Technical terms
- Curriculum-specific expressions

Constraints:

- No semantics
- No relationships
- No expansion logic

These files support phrase detection and explainability, not recall.

---

### 3.3 `related.<sense>.json`  

**Conceptual adjacency graph**

Purpose:

- Propose _related_ terms that may support exploration or discovery

Allowed evidence:

- Repeated co-occurrence within lessons or units
- Definitional language (“X is…”, “X means…”, “X is a type of…”)
- Cross-lesson consistency

Constraints:

- Weighted edges
- Hard cap on top-K neighbours per term
- Subject–phase scoped only

Forbidden uses:

- Treating these as synonyms
- Global merging across senses

These files feed **relationship channels**, never synonym sets.

---

### 3.4 `definitions.<sense>.json` (optional)

Purpose:

- Propose candidate definitions for review

Sources:

- Lesson keyword definitions
- Repeated definitional sentences
- Glossary-like structures

Constraints:

- Never auto-promoted
- Always reviewed
- Stored with provenance

Definitions are explanatory assets, not expansion rules.

---

## 4. Evidence standards by artifact type

| Artifact | Minimum evidence | Insufficient evidence |
|--------|-----------------|----------------------|
| Alias | Explicit abbreviation pattern + repetition | Co-occurrence only |
| Vocabulary phrase | High document frequency | Single transcript |
| Related term | Repeated co-occurrence + structure | One-off proximity |
| Definition | Declarative explanatory language | Example lists |

If evidence does not meet the minimum standard, the artifact must not be emitted.

---

## 5. Review and promotion pipeline

Mining outputs are **proposals**, not changes.

### 5.1 Promotion stages

1. **Extraction** (Python)
2. **Human review**
3. **Acceptance or rejection**
4. **Manual promotion** to:
   - synonym sets
   - relationship fields
   - definition registries
5. **Versioned deployment**
6. **Measurement via benchmark harness**

There is no fast path that skips review.

---

### 5.2 Explicit prohibitions

The mining pipeline must never:

- Write to Elasticsearch
- Update synonym sets
- Modify rule sets
- Trigger deployments

---

## 6. Versioning, reproducibility, and auditability

Each mining run must record:

- Input dataset identifiers
- Code version / git SHA
- Timestamp
- Sense list processed
- Output checksums

Outputs must be:

- Deterministic for a given input and code version
- Re-runnable for audit purposes
- Versioned independently of search releases

---

## 7. Failure modes and guardrails (Python-specific)

### 7.1 Expected failures

- Malformed subject–phase files
- Unexpected null structures
- Vocabulary explosion in noisy subjects
- Transcript sparsity (e.g. MFL)

### 7.2 Required responses

- Fail fast on structural errors
- Warn (not fail) on sparse evidence
- Cap output sizes deterministically
- Emit diagnostics, not partial truth

Mining failure must be **loud**, never silent.

---

## 8. Relationship to the wider system

This document defines:

- **What knowledge can be proposed**

Other documents define:

- How knowledge is applied (Search Decision Model)
- How Elasticsearch executes behaviour (retrievers, RRF, reranking)
- How governance and ownership work

The mining pipeline is intentionally **downstream of data** and **upstream of humans**.

It is not part of the runtime system.

---

## 9. Tooling and environment expectations

Recommended characteristics:

- Python 3.x
- Streaming-friendly JSON parsing
- Deterministic execution
- Fast iteration
- Strong test coverage

Python is chosen for:

- NLP ecosystem maturity
- Analytical expressiveness
- Reviewability

Example tooling (non-exhaustive):

- spaCy (phrase extraction)
- scikit-learn (lightweight statistics)
- `uv` for environment management  
  <https://docs.astral.sh/uv/>

---

## 10. Final framing

> **The mining pipeline is an advisor, not an authority.**

Its job is to surface _possibilities_:

- “This might be an alias”
- “These terms often co-occur”
- “This sentence looks definitional”

It must never assert:

- “These are synonyms”
- “This is the correct meaning”
- “This should affect search now”

By keeping this boundary explicit, the system remains:

- explainable
- governable
- safe to evolve
- resilient to data drift

That is the purpose of this document.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [README.md](./README.md) | Index and reading order |
| [handling-existing-synonymish-things.md](./handling-existing-synonymish-things.md) | Managing existing synonym corpus |
| [aliases-and-equivalances.md](./aliases-and-equivalances.md) | Mining strict equivalences — key consumer |
| [data-and-domain-vocabulary.md](./data-and-domain-vocabulary.md) | Structural vocabulary and definitions |
| [elasticsearch-approaches.md](./elasticsearch-approaches.md) | Elastic-native implementation patterns |
| [uses-of-structured-domain-knowledge.md](./uses-of-structured-domain-knowledge.md) | Survey of all vocabulary levers |
| [documentation-gap-analysis.md](./documentation-gap-analysis.md) | Gaps and remediation plan |
