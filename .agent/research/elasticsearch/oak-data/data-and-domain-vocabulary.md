# Generic education + data vocabulary  

_How to handle cross-subject terms, structural language, and definitions alongside subject-specific synonyms_

You’ve already got a strong subject-specific synonym corpus. What you’re describing now is the **cross-cutting layer**: terms that relate to **education**, **curriculum structure**, and **programme metadata** (subjects, key stages, exam boards, tiers, etc.), plus **definitions** that help both agents and search users understand the domain.

This doc covers:

1) What belongs in “generic / structural” vs “subject”
2) How to represent **definitions** (not just synonyms)
3) How to apply each category in Elastic + in MCP tools, without causing relevance regressions

---

## 1) The big distinction: “words that shape the query” vs “words that describe the content”

### A) Structural / control vocabulary (query-shaping)

These terms primarily control **filters**, **scope**, and **navigation**:

- **Subjects**: “maths”, “computer science”, “food tech”
- **Key stages / year groups**: “KS2”, “Year 9”, “post-16”
- **Exam boards**: “AQA”, “Edexcel”, “OCR”
- **KS4 factors**: “foundation”, “higher”, “combined science”
- Sometimes: “unit”, “lesson”, “worksheet”, “slide deck”, “starter quiz”

**These should generally NOT be treated as “content synonyms”.**  
They are better used for:

- filter inference (“year 9” ⇒ `ks3` + `year=9`)
- query normalisation (“A-level” variants)
- query routing (e.g., “GCSE” => likely KS4)

You already have a lot of this in your structural synonym files:

- general educational terms + acronyms (e.g. SEND, EAL, GCSE, A-level)  
- subject name variants (e.g. “ICT” → computing, “food tech” → cooking & nutrition)  
- key stage and year variants (KS1/2/3/4/5 plus “Year 10”, “sixth form”, etc.)  
- exam board variants (AQA, Pearson Edexcel, OCR, Eduqas, etc.)

### B) Domain vocabulary (content-describing)

These terms describe concepts inside lesson content:

- “fronted adverbials”, “photosynthesis”, “trigonometry”
- “visual hierarchy” (art), “distractor” (MFL assessments), etc.

These can be expanded for recall (carefully), but they are **not generally filter-like**.

---

## 2) Where definitions belong (and why they are a separate asset)

### Definitions are not synonyms

A synonym map answers: “What else might the user type that means the same thing?”
A definition answers: “What is this term, in Oak’s domain?”

If you conflate the two, you’ll get classic failures:

- “GCSE” is a _label_ for a phase/exam context, not content
- “assessment” ≠ “exam” in all contexts (related, not equivalent)
- “tier” (“foundation/higher”) is a KS4 programme factor, not a topic

### What definitions are for (practically)

Definitions are useful in three places:

1) **MCP / agent reasoning**
   - Agents can disambiguate: is “GCSE” requesting KS4 filtering or content about GCSEs?
   - Agents can explain: “KS4 is Key Stage 4 (Years 10–11)…”
   - Agents can ask better follow-ups: “Do you mean AQA GCSE Biology or combined science?”

2) **Search UX (and “search SDK” explainability)**
   - When the SDK infers filters from “Year 9”, it can expose an explain string:
     - “Interpreted ‘Year 9’ as Key Stage 3”
   - Tooltips / autocomplete: “OCR (Oxford Cambridge and RSA)”

3) **Mining + governance**
   - Definitions provide “ground truth semantics” for review:
     - If a mined candidate is actually an example list, reject it.

> Oak’s lesson data includes “keywords and their pupil-friendly definitions”, plus learning points, misconceptions, teacher tips, etc. That’s a rich source for definitions, but it must be handled carefully (examples vs true definitions).  
> See Oak docs: Lesson data endpoint docs (fields listed).  
> <https://open-api.thenational.academy/docs/api-endpoints/lesson-data>

---

## 3) Recommended taxonomy: five cross-cutting vocab classes

You’ll usually want these as _separate exports_ (even if stored together):

### 1) `structural.normalisation`

**Purpose:** map user language → canonical filter values  
**Examples:** key stages, year group variants, exam boards, subject names  
**Typical action:** filter inference, query routing

**Do**

- keep canonical values aligned with your filter schema (subject slug, ks slug, etc.)
- treat these as “filter synonyms” / “routing synonyms”

**Don’t**

- push these into content synonym expansion unless you have a very specific reason
  (otherwise “GCSE” starts matching content about GCSE when the user just meant KS4)

### 2) `educational.acronyms`

**Purpose:** expand acronyms and abbreviations in education contexts  
**Examples:** SEND, EAL, Ofsted, DfE, CPD

**Best use:**

- agent understanding and explanations
- query rewriting when user writes acronym and expects content about the concept

**Caution:** some acronyms are overloaded across domains; keep them **UK-education-scoped**.

### 3) `generic.educationTerms`

**Purpose:** general pedagogical language  
**Examples:** “assessment”, “lesson”, “unit”, “misconception”

**Best use:**

- **definitions** (helpful for agents and UI)
- _light_ query expansion (careful: “assessment” → “test” is often okay, “exam” is sometimes too strong)

### 4) `programme.factors`

**Purpose:** KS4 complexity vocabulary  
**Examples:** tier (foundation/higher), exam subject (biology/chemistry/physics/combined), exam board

**Best use:**

- filter inference
- agent clarification prompts
- query-time boosting when filters already constrain (e.g., within KS4 science)

### 5) `glossary.definitions`

**Purpose:** authoritative definition text, with provenance  
**Examples:** “distractor”, “synonym” (as a reading/listening exam skill), “PALM” acronym

**Best use:**

- MCP ontology payloads
- UI tooltips / explain logs
- mining validation / review UX

---

## 4) How to represent definitions cleanly (data model)

A practical “definition registry” shape (language-agnostic JSON that TS can import):

```json
{
  "version": "2026-01-17",
  "terms": [
    {
      "id": "keystage.ks4",
      "label": "Key Stage 4",
      "aliases": ["ks4", "key stage 4", "gcse", "year 10", "year 11"],
      "type": "structural",
      "definition": "Key Stage 4 is the UK education stage typically covering Years 10–11 and GCSE study.",
      "provenance": ["curated"],
      "sensitivity": "low"
    },
    {
      "id": "assessment.distractor",
      "label": "Distractor",
      "aliases": ["plausible wrong answer", "trap answer"],
      "type": "glossary",
      "definition": "An incorrect but plausible answer option designed to test attention to detail in reading/listening tasks.",
      "provenance": ["oak.lesson.keyword.definition"],
      "sensitivity": "low"
    }
  ]
}
```

Key points:

- **`id` is stable** and namespaced (`keystage.*`, `examboard.*`, `glossary.*`)
- **aliases** can point to your existing synonym sources
- **definition** is short, user-facing, and safe to show
- **provenance** matters (curated vs mined vs extracted-from-Oak)
- **type** determines how the SDK uses it (filter routing vs content expansion vs UI only)

---

## 5) How to apply generic/structural vocab in the TypeScript search SDK

### Step 1 — Normalise and detect “structural intent”

Given: `freeText + filters`

Run a lightweight phase before building retrievers:

1) detect explicit filters already provided (these win)
2) detect structural terms in the query:
   - subject synonyms (“food tech”, “ICT”)
   - key stage / year patterns (“Year 9”, “KS2”, “post-16”)
   - exam boards (“AQA”, “Pearson”)
   - KS4 factors (“foundation tier”, “higher tier”, “combined science”)

**Output an explain log** (even if only for debugging / benchmark harness):

- inferred filters
- which matched terms triggered them
- confidence score / reason

### Step 2 — Apply inferred filters conservatively

**Do**

- only infer structural filters when confidence is high (e.g., “Year 9” is unambiguous)
- prefer “add filter” over “rewrite query” for structural terms

**Don’t**

- infer filters from ambiguous single tokens (“re”, “rs”, “pe” can be noisy)
- drop user query terms when inferring filters (keep original intent)

### Step 3 — Use definitions for agent/UI, not as synonym expansion

Definitions are extremely useful for:

- MCP tool answers (“I interpreted ‘KS4’ as Key Stage 4…”)
- tooltips/autocomplete
- debugging

They are rarely useful for index-time synonyms.

---

## 6) How to apply generic/structural vocab in Elasticsearch

### 6.1 Synonyms: only for true equivalence (and keep them small)

Elastic’s own guidance is to use synonyms wisely, and `synonym_graph` is recommended for multiword handling.  
Docs:

- synonym_graph token filter: <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter> :contentReference[oaicite:0]{index=0}
- token graphs overview: <https://www.elastic.co/docs/manage-data/data-store/text-analysis/token-graphs> :contentReference[oaicite:1]{index=1}
- “search with synonyms” guide: <https://www.elastic.co/docs/solutions/search/full-text/search-with-synonyms> :contentReference[oaicite:2]{index=2}

For your structural vocab:

- **subject synonyms** can be true equivalence at query-time (maths/mathematics/math)
- **exam board synonyms** are often equivalence (“Pearson” ↔ “Edexcel”), but be careful: “Pearson” may appear in other contexts
- **key stage synonyms** are largely equivalence, but “GCSE” is a contextual marker (often means KS4, but can also be content)

### 6.2 Manage synonyms via Synonyms API (operationally safer)

Docs: Create or update synonym set (10k rules max per set):  
<https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym> :contentReference[oaicite:3]{index=3}

Important operational note from Elastic:
> synonym sets must exist before indices reference them, or the index can become partially created/inoperable  
(see the “search with synonyms” guide) :contentReference[oaicite:4]{index=4}

### 6.3 Prefer query-time logic for “structural intent”

Rather than trying to make “Year 9” match “KS3” via synonyms in the index, do it in your SDK as filter inference.

This keeps:

- relevance stable
- explainability high
- maintenance simple

---

## 7) What to do / what NOT to do (examples)

### ✅ Good: structural term triggers filter

**Query:** “aqa gcse biology inheritance”  
**Action:**

- infer `ks4`
- infer `examBoard=aqa`
- infer `examSubject=biology` (if you support it as a filter)
- keep “inheritance” as content term

### ❌ Bad: treat “GCSE” as a content synonym

If “GCSE” is expanded into generic content synonyms, you can end up boosting:

- “revision”
- “exam techniques”
- etc.
…even when the user’s intent was simply “KS4 level”.

### ✅ Good: definitions used for explanation/tooling

When the SDK infers `ks4`, expose:

- “Interpreted ‘GCSE’ as Key Stage 4 (Years 10–11)”

### ❌ Bad: definitions used as expansion text

Don’t expand “distractor” into “incorrect but plausible answer option…” as query text.
That’s a definition for humans/agents, not a synonym.

---

## 8) Where Oak’s own docs help you design the definition layer

Oak’s API documentation is a useful “public truth” anchor for the glossary/definitions model:

- What is Oak’s API: <https://open-api.thenational.academy/docs> :contentReference[oaicite:5]{index=5}
- Lesson data fields (keywords + pupil-friendly definitions, learning points, misconceptions, etc.):  
  <https://open-api.thenational.academy/docs/api-endpoints/lesson-data> :contentReference[oaicite:6]{index=6}
- Unit & curriculum data endpoints:  
  <https://open-api.thenational.academy/docs/api-endpoints/unit-and-curriculum-data> :contentReference[oaicite:7]{index=7}
- Lists endpoint docs (good entry point for enumerations and taxonomy):  
  <https://open-api.thenational.academy/docs/api-endpoints/lists> :contentReference[oaicite:8]{index=8}

Use these as provenance for “structural” definitions and enumerations.

---

## 9) Recommended next change to your repo (minimal disruption)

Without rewriting your synonym corpus, add a **new top-level export** alongside it:

- `synonymsData` (existing, curated)
- `definitionData` (new registry described above)
- `structuralNormalisation` (derived, query-shaping maps)
- `relationshipExpansions` (mined, sense-gated)

Then update consumers:

- MCP ontology: include `definitionData` + keep synonyms
- Search SDK: use `structuralNormalisation` for filter inference
- Elasticsearch: keep synonym sets for strict equivalences only

This lets you keep your existing investment intact while making the system more precise and explainable.

---

## Appendix: Elastic docs relevant to your current architecture

- Retrievers overview (including rule retriever, RRF):  
  <https://www.elastic.co/docs/solutions/search/retrievers-overview> :contentReference[oaicite:9]{index=9}
- RRF retriever reference:  
  <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever> :contentReference[oaicite:10]{index=10}
- Synonyms API:  
  <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym> :contentReference[oaicite:11]{index=11}
- synonym_graph token filter:  
  <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter> :contentReference[oaicite:12]{index=12}
- Search with synonyms guide:  
  <https://www.elastic.co/docs/solutions/search/full-text/search-with-synonyms> :contentReference[oaicite:13]{index=13}
