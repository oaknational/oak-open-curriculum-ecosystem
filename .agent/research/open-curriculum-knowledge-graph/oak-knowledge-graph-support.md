# Knowledge graph Support for Subject Design

> **⚠️ FUTURE SCOPE (V2+)**: This document describes an advanced concept-layer
> knowledge graph that extends beyond the current V1 implementation. V1 provides
> a static, schema-level graph of concept TYPE relationships for agent support.
> The explicit/implicit concepts, NLP extraction, and searchable tools described
> here are future extensions.
>
> For the current V1 implementation scope, see:
>
> - `knowledge-graph-analysis-synthesis.md` (comprehensive synthesis)
> - `optimised-graph-proposal.md` (target structure)

## 1. Purpose

This document outlines how a **graph of relationships between explicit and implicit
concepts** in Oak’s curriculum can support the Subject Design Tool described in the
companion document.

The core idea is to add a **conceptual layer** above the existing Oak entities
(threads, units, lessons), so that subject design is driven by _concepts and their
relationships_, not just units and threads.

---

## 2. Concepts: explicit vs implicit

We distinguish between **explicit concepts** (already represented in Oak data) and
**implicit concepts** (derivable from content, but not first‑class in the current
model).

### 2.1 Explicit concepts

Explicit concepts are those that Oak already encodes or names, for example:

- **Threads**
  - e.g. `sustainability-and-climate-change`
  - e.g. `geometry-and-measure`
  - e.g. `bq01-biology-what-are-living-things-and-what-are-they-made-of`
- **Unit titles and summaries**
  - e.g. “The greenhouse effect and global warming” (Science, KS3)
  - e.g. “Water and rivers” (Geography)
- **Lesson titles and learning objectives**
  - e.g. “Understanding the carbon cycle”
  - e.g. “Adding fractions with the same denominator”
- **Curriculum keywords and misconceptions** (from lesson summaries)
  - e.g. keyword: “photosynthesis”; misconception: “plants get food from soil”.
- **National Curriculum statements / exam spec references** (where present)
  - e.g. “Pupils should be taught to interpret and construct pie charts and line graphs…”

These explicit elements can be normalised into a **Concept** node type with metadata
such as label, subject, key stage range, difficulty, and canonical sources.

### 2.2 Implicit concepts

Implicit concepts are ideas that are _present in content_ but not directly encoded as
separate fields. They can be inferred from:

- Video transcripts (`get-lessons-transcript`).
- Quiz questions and answers (`get-lessons-quiz`).
- Slide decks, worksheets and supplementary resources (`get-lessons-assets`).
- Co‑occurrence patterns of explicit concepts across units and threads.
- External mappings (e.g. to exam board specs or external ontologies).

**Examples of implicit concepts**

- A lesson on the greenhouse effect whose transcript mentions “positive feedback loops”,
  “ice‑albedo feedback”, and “runaway warming”:
  - Implicit concept: **“climate feedback loop”**  
    (Not necessarily named as a thread or keyword, but clearly taught.)
- A set of maths lessons where objectives mention fractions, decimals and percentages:
  - Implicit concept: **“equivalence between fractions, decimals and percentages”**, found
    via co‑occurrence and transcript patterns.
- Citizenship and Geography lessons referencing “climate justice”, “fairness”, “global
  north and south”:
  - Implicit concept: **“climate justice and equity”**.

These implicit concepts can be extracted using NLP/LLM pipelines and then added as
Concept nodes with provenance scores and links back to their sources.

---

## 3. Graph schema

At a high level, we introduce a **Knowledge graph** that connects Oak entities and
concepts.

### 3.1 Node types

- `Concept`
  - Represents an explicit or implicit concept.
  - Fields (examples):
    - `id` (e.g. `"concept:greenhouse-effect"`)
    - `label`: “Greenhouse effect”
    - `type`: `"explicit"` or `"implicit"`
    - `subjectTags`: `["science", "geography"]`
    - `keyStageRange`: `["ks2", "ks4"]`
    - `sourceConfidence`: numeric score
    - `examples`: pointers to units/lessons where exemplified.

- `Thread`
  - Existing Oak thread node (e.g. `"thread:sustainability-and-climate-change"`).

- `Unit`
  - Existing Oak unit (e.g. `"unit:water-and-rivers-ks3-geography"`).

- `Lesson`
  - Existing Oak lesson (e.g. `"lesson:introduction-to-the-greenhouse-effect"`).

- `NCStatement` / `ExamObjective` (optional v2)
  - Nodes representing curriculum statements or exam spec objectives.

### 3.2 Edge types

Examples of edges:

- `CONCEPT_REFINES_CONCEPT`
  - e.g. “greenhouse effect” refines “climate change”.
- `CONCEPT_PREREQUISITE_FOR_CONCEPT`
  - e.g. “particle model of matter” is a prerequisite for “atmospheric pressure”.
- `CONCEPT_EXEMPLIFIED_BY_LESSON`
  - Connects Concept → Lesson where it’s clearly taught or assessed.
- `CONCEPT_INTRODUCED_IN_UNIT`
  - Connects Concept → Unit where it first substantially appears.
- `CONCEPT_ASSOCIATED_WITH_THREAD`
  - Connects Concept ↔ Thread for conceptual strands.
- `THREAD_STRUCTURES_UNIT`
  - Thread → Unit (existing thread/unit relationships).
- `UNIT_PRECEDES_UNIT`
  - Directed edge reflecting `unitOrder` or prerequisite relationships.
- `CONCEPT_ALIGNS_WITH_NC_STATEMENT`
  - Connects to NCStatement / exam objectives.

This schema allows navigation like:

- “Show me all concepts directly or indirectly related to _sustainability_ for KS3.”
- “What concepts must be taught before ‘greenhouse effect’?”
- “Where do pupils first meet ‘climate justice’?”

---

## 4. Examples of explicit and implicit concept nodes

### 4.1 Explicit examples

#### Example 1 – “Greenhouse effect” (Science/Geography)

- **Source**: Lesson titled “The greenhouse effect and global warming”; keywords include
  “greenhouse effect”; unit belongs to `sustainability-and-climate-change` thread.
- Concept node:

```jsonc
{
  "id": "concept:greenhouse-effect",
  "label": "Greenhouse effect",
  "type": "explicit",
  "subjectTags": ["science", "geography"],
  "keyStageRange": ["ks3", "ks4"],
  "sourceConfidence": 1.0,
  "sources": [
    "lesson:the-greenhouse-effect-and-global-warming",
    "thread:sustainability-and-climate-change",
  ],
}
```

#### Example 2 – “Number: place value” (Maths)

- **Source**: Thread `number-place-value`, units “Place value within 1000”, “Place value
  within 1 000 000”.
- Concept node:

```jsonc
{
  "id": "concept:place-value",
  "label": "Place value",
  "type": "explicit",
  "subjectTags": ["maths"],
  "keyStageRange": ["ks1", "ks3"],
  "sourceConfidence": 1.0,
  "sources": ["thread:number-place-value", "unit:place-value-within-1000-y3-maths"],
}
```

### 4.2 Implicit examples

#### Example 3 – “Climate feedback loops” (implicit, Science/Geography)

- **Source signals**:
  - Transcript mentions “positive feedback”, “ice‑albedo feedback”, “self‑reinforcing
    cycle” in lessons tagged with `sustainability-and-climate-change`.
- Concept node:

```jsonc
{
  "id": "concept:climate-feedback-loops",
  "label": "Climate feedback loops",
  "type": "implicit",
  "subjectTags": ["science", "geography"],
  "keyStageRange": ["ks4"],
  "sourceConfidence": 0.78,
  "sources": [
    "lesson:the-greenhouse-effect-and-global-warming",
    "lesson:climate-change-and-ice-albedo",
  ],
}
```

#### Example 4 – “Equivalence between fractions, decimals and percentages” (Maths)

- **Source signals**:
  - Multiple lessons with objectives like “convert between fractions and decimals”,
    “understand percentages as ‘out of 100’”, with quiz questions requiring conversion.
- Concept node:

```jsonc
{
  "id": "concept:fraction-decimal-percentage-equivalence",
  "label": "Equivalence between fractions, decimals and percentages",
  "type": "implicit",
  "subjectTags": ["maths"],
  "keyStageRange": ["ks2", "ks3"],
  "sourceConfidence": 0.83,
  "sources": [
    "lesson:converting-fractions-to-decimals",
    "lesson:introducing-percentages",
    "lesson:comparing-fractions-decimals-and-percentages",
  ],
}
```

---

## 5. How the knowledge graph supports the Subject Design Tool

The knowledge graph enriches the Subject Design Tool in several key ways.

### 5.1 Better discovery than keyword search alone

When a user describes a new subject, the tool can:

- Map the description to **concept nodes** (both explicit and implicit) using semantic
  search over concept labels and descriptions.
- Traverse from those concepts to:
  - Threads (via `CONCEPT_ASSOCIATED_WITH_THREAD`),
  - Units (via `CONCEPT_INTRODUCED_IN_UNIT`),
  - Lessons (via `CONCEPT_EXEMPLIFIED_BY_LESSON`).

This allows the tool to:

- Find relevant content that doesn’t literally mention the user’s keywords.
- Distinguish between _core_ and _peripheral_ coverage of a theme.

**Example**: A user asks for a subject on “climate justice”.

- Knowledge graph can connect “climate justice and equity” (implicit concept) to lessons in
  Citizenship and Geography that discuss fairness, global impact and responsibility, even
  if “justice” is not in the lesson title.

### 5.2 Conceptual progression and prerequisites

Edges like `CONCEPT_PREREQUISITE_FOR_CONCEPT` and `UNIT_PRECEDES_UNIT` allow the tool to:

- Ensure units are ordered so that prerequisite concepts appear earlier.
- Detect gaps where a concept is used but its prerequisites don’t appear in the proposed
  subject sequence.

**Example** (Climate Change subject):

- `concept:particle-model-of-matter` → `concept:gas-pressure` → `concept:atmospheric-pressure` → `concept:greenhouse-effect`
- If the designer wants to include “atmospheric circulation and greenhouse gases” in Year 8
  but has not allocated any prior material on the particle model or gas pressure, the
  tool can raise a **prerequisite warning**.

### 5.3 Cross‑subject connectivity

Because concepts can be tagged with multiple subjects, the graph can surface **natural
cross‑subject links**:

- “Greenhouse effect” connects Geography (weather, climate) and Science (energy
  transfer, radiation).
- “Statistics: interpreting graphs” connects Maths and Science.
- “Rights and justice” connects Citizenship, History and RSHE/PSHE.

For the Subject Design Tool, this means:

- It can propose **multi‑subject units** structured around shared concepts.
- It can justify cross‑curricular combinations explicitly (“this unit brings together
  geographical and scientific perspectives on the same concept”).

### 5.4 Gap analysis and coverage maps

Using the knowledge graph, the tool can attach more meaningful analytics to the subject
blueprint:

- **Coverage heatmaps**
  - For each concept, show where it is introduced, developed and revisited.
- **Vertical coherence**
  - Check that concepts reappear at increasing levels of sophistication rather than
    being taught once and never revisited.
- **Missing steps**
  - Identify concepts that are prerequisites for later content but never appear in the
    designed subject sequence.

**Example**: A KS2–KS3 “Global Citizenship” subject might cover sustainability and human
rights, but the graph reveals that “data literacy” concepts (e.g. reading bar charts,
interpreting climate graphs) are weakly represented. The tool can suggest a supplementary
unit pulling in Maths or Science lessons that build these skills.

### 5.5 Explaining design decisions to users

The same knowledge graph can be used to generate **teacher‑facing explanations**:

- “We included these units because they develop the concepts: greenhouse effect, carbon
  cycle, climate justice.”
- “This Year 9 unit revisits ‘sustainability’ at a deeper level, building on earlier
  exposure in Year 7 Geography.”
- “We recommend adding a short unit on ‘interpreting graphs’ so pupils can access the
  data‑heavy climate lessons later.”

These explanations increase trust and make the tool’s behaviour more transparent.

---

## 6. MCP surface for knowledge graph (future tools)

To support the Subject Design Tool, we can expose a small set of MCP tools over the
knowledge graph.

### 6.1 `concept-search`

```jsonc
// Request
{
  "q": "climate justice",
  "keyStages": ["ks3", "ks4"],
  "subjects": ["geography", "citizenship"]
}

// Response (sketch)
{
  "concepts": [
    {
      "id": "concept:climate-justice-and-equity",
      "label": "Climate justice and equity",
      "score": 0.92
    },
    {
      "id": "concept:sustainability",
      "label": "Sustainability",
      "score": 0.74
    }
  ]
}
```

### 6.2 `concept-neighbours`

```jsonc
// Request
{
  "id": "concept:greenhouse-effect",
  "maxDepth": 2
}

// Response (sketch)
{
  "concept": "concept:greenhouse-effect",
  "neighbours": [
    {
      "id": "concept:climate-change",
      "relation": "CONCEPT_REFINES_CONCEPT"
    },
    {
      "id": "concept:particle-model-of-matter",
      "relation": "CONCEPT_PREREQUISITE_FOR_CONCEPT"
    },
    {
      "id": "thread:sustainability-and-climate-change",
      "relation": "CONCEPT_ASSOCIATED_WITH_THREAD"
    }
  ]
}
```

### 6.3 `concept-path`

```jsonc
// Request
{
  "from": "concept:sustainability",
  "to": "concept:climate-justice-and-equity",
  "maxLength": 4
}

// Response (sketch)
{
  "paths": [
    [
      "concept:sustainability",
      "concept:natural-resources",
      "concept:inequality",
      "concept:climate-justice-and-equity"
    ]
  ]
}
```

These tools allow the Subject Design Tool to:

- Enrich the conceptual spine of a subject.
- Find bridging concepts for cross‑subject units.
- Justify sequencing decisions via explicit concept paths.

---

## 7. Implementation notes

- The knowledge graph can initially be built **offline** using a combination of:
  - Existing threads, unit summaries, lesson summaries and NC references (explicit).
  - Transcript and quiz question mining (implicit).
  - LLM‑based concept extraction with conservative thresholds.
- Storage could be a dedicated graph store or a simple adjacency‑list representation
  behind the MCP tools.
- Versioning is important:
  - Attach a `graphVersion` to MCP responses so clients know which knowledge graph
    snapshot underpins a given subject blueprint.
- Safety and quality:
  - Implicit concepts should carry confidence scores and provenance.
  - High‑impact decisions (e.g. major prerequisite inferences) should be grounded in
    multiple sources where possible.

---

## 8. Summary

A Knowledge graph turns Oak’s rich but mostly structural curriculum data into a **semantic,
concept‑centred layer**. Combining this graph with the Subject Design Tool enables:

- Richer discovery of relevant content,
- Better‑informed progression and prerequisite checks,
- Stronger cross‑subject coherence,
- More transparent explanations for teachers.

Together, these capabilities make it feasible to design high‑quality synthetic subjects
like “Climate Change” or “Global Citizenship” while staying firmly rooted in Oak’s
existing curriculum.
