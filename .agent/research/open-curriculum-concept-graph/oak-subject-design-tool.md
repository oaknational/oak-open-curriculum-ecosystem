# Subject Design Tool for Oak MCP

> **⚠️ FUTURE SCOPE**: This document describes a future Subject Design Tool
> that would orchestrate existing Oak MCP tools and leverage a concept-layer
> knowledge graph (see `oak-knowledge-graph-support.md`). This is separate from
> the current `get-knowledge-graph` agent support tool being implemented.
>
> For the current V1 agent support tool, see:
>
> - `knowledge-graph-analysis-synthesis.md` (comprehensive synthesis)
> - `knowledge-graph-tool-research.md` (tool patterns)

## 1. Purpose

This document describes a **Subject Design Tool** that lives inside the Oak Curriculum MCP server.
The tool helps teachers and education leaders design new synthetic _subjects_ or cross-cutting
programmes (for example, a “Climate Change” subject) by orchestrating and recombining existing
Oak curriculum assets.

The tool is not about creating new canonical Oak subjects in the core system. Instead, it:

- Assists users in **designing subject blueprints** that can be shared, iterated on, or
  piloted locally.
- Ensures any proposed structure is **grounded in real Oak content** (units, lessons,
  threads, and assets).
- Makes **conceptual progression** and **coverage** explicit.

---

## 2. Scope, goals and non‑goals

### Goals

- Provide an interactive workflow to:
  - Capture a **design brief** for a new subject or cross-cutting programme.
  - Discover relevant Oak content across subjects, key stages and years.
  - Propose a **coherent, vertically sequenced subject blueprint**, including units and
    lesson groupings.
  - Surface **conceptual spines** (threads and concepts) underpinning the subject.
  - Highlight **gaps, overlaps** and dependencies (pre‑requisites) using Oak’s existing
    sequencing.
- Integrate naturally with existing Oak MCP tools (`get-ontology`, `search`, `get-threads`,
  `get-key-stages-subject-units`, `get-units-summary`, etc.).
- Be consumable both by:
  - Oak’s teacher-facing UI (e.g. “Design a new subject” wizard), and
  - Programmatic clients (CLI, internal tooling).

### Non‑goals (v1)

- Persisting new subjects into Oak’s **canonical curriculum store**.
- Generating brand‑new lesson content or assessments from scratch.
- Overriding or altering Oak’s official progression; the tool may recommend re-orderings
  or selections, but it should clearly distinguish them from core Oak sequences.
- Handling formal accreditation / compliance workflows.

---

## 3. User roles and primary use cases

### Roles

- **Classroom teacher**
  - Designs a short, thematic programme (e.g. “Sustainability Week” for Year 8).
  - Wants a small number of coherent units and lessons anchored in Oak.
- **Head of department / subject lead**
  - Designs a cross‑curricular subject (e.g. “Climate Change” spanning Geography,
    Science, Citizenship).
  - Needs visibility of progression, prerequisites and overlaps.
- **Senior leader / trust curriculum lead**
  - Prototypes new subject areas or programme variants at phase or multi‑school level.
  - Needs to understand implications for timetabling and staff expertise.

### Example use cases

1. _Design a KS3 “Climate Change” subject drawing on Geography, Science and Citizenship._
   - Years: 8–9, 1 lesson/week, 2 terms.
   - Outcome: 4–6 units with mapped Oak units/lessons, explicit conceptual spine.

2. _Build a primary “Global Citizenship” subject using RSHE/PSHE and Geography units._
   - Years: 4–6, 6–8 units.
   - Outcome: vertically coherent progression leading into KS3 Citizenship/Geography.

3. _Prototype an “Applied Maths for Computing” strand_
   - Uses Maths and Computing threads (e.g. data, algorithms, statistics).
   - Outcome: pathway recommendations and suggested Oak content.

---

## 4. High‑level architecture

The Subject Design Tool is exposed as a **single MCP tool** that orchestrates existing Oak tools.

```text
Client (UI / CLI / Agent)
    |
    v
Oak MCP: subject-design
    |
    +-- get-ontology
    +-- search / get-search-lessons / get-search-transcripts
    +-- get-subjects / get-subject-detail
    +-- get-key-stages-subject-units
    +-- get-units-summary
    +-- get-threads / get-threads-units
    +-- (optional) concept graph tools in future (see doc 2)
```

Internally, the tool does four main things:

1. **Interpret the brief** – parse the user’s description, constraints and intent into an
   internal design model.
2. **Discover candidates** – query Oak for relevant threads, units and lessons.
3. **Propose a subject blueprint** – assemble a structured progression: phases → key stages
   → years → units → mapped Oak content.
4. **Analyse coverage and coherence** – highlight gaps, overlaps and pre‑requisite issues.

---

## 5. MCP tool contract

### 5.1 Tool name and path

Suggested MCP resource path inside the Oak MCP server:

```text
/Oak Prod MCP/.../design-subject
```

(Exact path to be aligned with existing naming conventions.)

### 5.2 Request schema (SubjectDesignRequest)

```jsonc
{
  "name": "Climate Change",
  "intent": "Cross-curricular subject emphasising environmental science, geography and citizenship.",
  "description": "Students explore how Earth’s climate system works, how human actions influence it, and what it means to act sustainably.",
  "audience": "secondary",
  "keyStages": ["ks3", "ks4"],
  "years": [8, 9, 10],
  "timeConstraints": {
    "lessonsPerWeek": 1,
    "weeksPerYear": 30,
  },
  "contentConstraints": {
    "includeSubjects": ["science", "geography", "citizenship"],
    "excludeSubjects": ["rshe-pshe"],
    "threadsToPrioritise": [
      "sustainability-and-climate-change",
      "bq15-how-can-we-live-sustainably-to-protect-earth-for-a-better-future",
    ],
    "threadsToAvoid": [],
  },
  "pedagogicalPreferences": {
    "emphasis": ["inquiry-based", "project-based"],
    "assessmentFocus": ["conceptual-understanding", "applied-projects"],
  },
  "outputFormat": "subjectBlueprintV1",
}
```

Key notes:

- `keyStages` and `years` must be validated against `get-ontology` and `get-subjects-years`.
- `includeSubjects` and `threadsToPrioritise` help guide content discovery.
- `timeConstraints` allows the tool to approximate feasible numbers of units/lessons.

### 5.3 Response schema (SubjectBlueprintV1)

```jsonc
{
  "name": "Climate Change",
  "slug": "climate-change-secondary",
  "audience": "secondary",
  "keyStages": ["ks3", "ks4"],
  "years": [8, 9, 10],
  "highLevelRationale": "This synthetic subject weaves together geography, science and citizenship to build a coherent understanding of climate change from physical processes to human response.",
  "conceptualSpine": {
    "primaryThreads": [
      "sustainability-and-climate-change",
      "bq15-how-can-we-live-sustainably-to-protect-earth-for-a-better-future",
    ],
    "secondaryThreads": [
      "natural-resources",
      "human-systems-and-processes",
      "finance-and-the-economy",
    ],
    "keyConcepts": [
      "greenhouse effect",
      "carbon cycle",
      "climate vs weather",
      "sustainability",
      "mitigation and adaptation",
    ],
  },
  "structure": [
    {
      "year": 8,
      "keyStage": "ks3",
      "units": [
        {
          "id": "climate-change-y8-1",
          "title": "Weather, Climate and Earth Systems",
          "durationWeeks": 6,
          "drivingThreads": ["sustainability-and-climate-change"],
          "summary": "Students distinguish weather from climate and explore the components of Earth’s climate system.",
          "mappedOakUnits": [
            "unit:weather-and-climate-ks3-geography",
            "unit:earth-systems-and-resources-ks3-science",
          ],
          "mappedOakLessons": [
            "lesson:what-is-climate",
            "lesson:global-atmospheric-circulation",
            "lesson:the-water-cycle-and-weather",
            "lesson:introduction-to-the-greenhouse-effect",
          ],
        },
      ],
    },
  ],
  "analytics": {
    "estimatedTotalLessons": 42,
    "estimatedTotalTeachingHours": 42,
    "coverage": {
      "subjects": {
        "geography": 0.5,
        "science": 0.4,
        "citizenship": 0.1,
      },
      "threads": {
        "sustainability-and-climate-change": "high",
        "natural-resources": "medium",
      },
    },
    "prerequisiteWarnings": [
      {
        "type": "missing-prerequisite",
        "description": "Unit 'Atmospheric Chemistry and Climate' assumes prior knowledge of 'particle model of matter' which is not fully covered in the proposed sequence.",
        "relatedOakUnit": "unit:particle-model-of-matter-ks3-science",
      },
    ],
    "duplicationWarnings": [
      {
        "type": "possible-duplication",
        "description": "Two units cover 'carbon cycle' at similar depth; consider merging or re-scoping.",
        "unitIds": ["climate-change-y9-1", "climate-change-y10-2"],
      },
    ],
  },
}
```

The blueprint is explicitly **composable**: clients can display a summary, detail views
per unit, and deep links into Oak lesson pages.

---

## 6. Internal workflow

### Step 1 – Load ontology

- Call `get-ontology` to:
  - Validate key stages and years.
  - Resolve subject synonyms to canonical slugs.
  - Understand entity hierarchy and available tools.

### Step 2 – Interpret the design brief

- Use an LLM prompt (see §7) to:
  - Normalise and enrich the design brief (e.g. extract themes, map to subjects).
  - Propose an initial high‑level structure:
    - Phases → key stages → years → provisional units (titles + rationales).
  - Identify candidate threads and concepts from the description.

### Step 3 – Discover candidate content

For each provisional unit:

- Use **search tools**:
  - `/search` for broad discovery by topic.
  - `get-search-lessons` for title‑focused search within specific subjects/KS.
  - `get-search-transcripts` for deeper semantic matches (especially themes like “justice”,
    “sustainability”, “inequality”).
- Use **thread tools**:
  - `get-threads` to shortlist relevant threads.
  - `get-threads-units` for each shortlisted thread to find ordered units.
- Use **unit tools**:
  - `get-key-stages-subject-units` to enumerate candidate units for each subject/KS.
  - `get-units-summary` to read prerequisites, NC statements and future links.

The tool builds an internal **candidate pool** of Oak units and lessons with relevance
scores and alignment to the design brief.

### Step 4 – Assemble the subject blueprint

Using the candidate pool and thread ordering:

- Choose a **conceptual spine** by selecting a small set of primary threads.
- For each year:
  - Allocate units until time constraints are satisfied.
  - Prefer units that:
    - Fit the conceptual spine,
    - Respect the natural progression implied by `unitOrder` and prerequisites,
    - Offer diversity in activities and assessment types.
- Within each “synthetic unit”, map one or more Oak units and 4–8 Oak lessons.
- Ensure each synthetic unit has:
  - Title, rationale, threads, mapped content, and summary.

### Step 5 – Analyse coverage and coherence

- Check **prerequisites** using `get-units-summary` (prior units/knowledge).
- Check for **duplication** (same concepts heavily repeated at similar depth).
- Estimate **coverage** across:
  - Subjects,
  - Threads,
  - Key scientific/geographic/civic concepts.
- Attach warnings and suggestions to the blueprint.

---

## 7. Prompt design (LLM system / assistant prompts)

A sketch of the prompts used within the tool. These would be embedded in the
implementation and not exposed to end users.

### 7.1 System prompt (core)

> You are an expert curriculum designer working with Oak’s curriculum ontology.  
> You can see key stages, subjects, sequences, units, threads, and lesson summaries.  
> Your job is to design _synthetic subjects_ and cross‑curricular programmes **only** by
> combining existing Oak content. You must not invent new Oak units or lessons; instead,
> you propose synthetic structures that map onto real Oak entities (subjects, units,
> lessons, threads). When you suggest a unit or lesson, you always try to attach one or
> more Oak identifiers that could plausibly fulfil that role.

### 7.2 Assistant behaviour guidelines

- Always reason **from progression first** (threads, prerequisites, year/KS progression),
  not just keyword match.
- Make trade‑offs explicit: if time is tight, say what you would drop and why.
- Mark clearly where:
  - Oak has strong coverage,
  - Oak coverage is partial,
  - Oak coverage is weak or absent.
- Always include:
  - A conceptual spine (threads + key concepts),
  - A year‑by‑year structure,
  - A mapping to Oak units/lessons where possible.

### 7.3 Example internal prompt call

Input:

- Design brief (normalised JSON).
- Shortlist of candidate Oak units and threads (from tools).

Output:

- Proposed `SubjectBlueprintV1` (before final validation).

The LLM is instructed to **reference specific Oak IDs** provided in context whenever
suggesting mappings, and to avoid hallucinating IDs.

---

## 8. Integration with Oak products

### 8.1 Teacher UI (wizard)

A simple flow could look like:

1. “Describe the subject or theme you want to design” → free‑text + quick options.
2. “Choose your phase, key stages and years” → UI mapped to `keyStages` and `years`.
3. “Set constraints” → lessons per week, duration, included subjects.
4. Call `design-subject` tool, display **subject blueprint**:
   - High‑level rationale,
   - Conceptual spine,
   - Structure with units and mapped Oak content,
   - Warnings and suggestions.
5. Allow users to:
   - Accept / reject units,
   - Swap mapped Oak units/lessons,
   - Export or save locally.

### 8.2 Programmatic use

- Internal Oak tools can use `design-subject` to:
  - Prototype new programmes,
  - Analyse how proposed initiatives lean on the existing curriculum.
- Trusts or MATs could integrate the tool into their own planning tools (via MCP).

---

## 9. Future extensions

- **Concept graph integration**  
  Incorporate a graph‑based concept layer (see companion document) so candidate content
  selection is driven by conceptual relationships, not only threads and keyword search.

- **Persistence and sharing**  
  Add separate tools to:
  - Persist subject blueprints,
  - Share with colleagues,
  - Version and diff subject designs.

- **Impact and analytics**  
  Over time, log usage and edits to inform improvements to the official Oak curricula
  and to identify high‑value cross‑curricular patterns.
