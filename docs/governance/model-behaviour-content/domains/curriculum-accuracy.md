---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# curriculum-accuracy — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

The authored conceptual model — ontology, domain concepts, subject and key-stage vocabulary. Reviewed by Oak curriculum experts.

**27 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (27)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C172 — GET\_CURRICULUM\_MODEL\_TOOL\_DEF.title

**What it says now:**

```text
title: 'Oak Curriculum Overview',
```

**What it is for:** Names the orientation tool 'Oak Curriculum Overview' so agents recognise it as the entry point for understanding the curriculum + tools.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-title · **Impact tier:** high-impact

### C173 — GET\_CURRICULUM\_MODEL\_TOOL\_DEF.description (interpolates ONTOLOGY\_RECOMMENDED\_FIRST\_STEP)

**What it says now:**

```text
description: `Returns a complete orientation to Oak National Academy's
```

**What it is for:** Positions the tool as a complete orientation (domain model + tool usage guidance), lists what to use it to understand, and says NOT to use it to fetch actual content (use search/fetch).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-description · **Impact tier:** high-impact

### C174 — GET\_CURRICULUM\_MODEL\_TOOL\_DEF.annotations

**What it says now:**

```text
title: 'Oak Curriculum Overview',
```

**What it is for:** MCP behaviour hints: read-only, non-destructive, idempotent, closed-world — signals a safe, no-side-effect orientation call.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C175 — GET\_CURRICULUM\_MODEL\_TOOL\_DEF.\_meta.ui (widget routing)

**What it says now:**

```text
_meta: {
    ui: {
      resourceUri: WIDGET_URI,
      visibility: ['model', 'app'] satisfies ('model' | 'app')[],
    },
```

**What it is for:** MCP Apps metadata (ADR-141) routing this tool's result to a widget resource and declaring visibility to both model and app surfaces.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C176 — runCurriculumModelTool summary

**What it says now:**

```text
summary: 'Oak Curriculum model loaded. Includes domain model and tool guidance.',
```

**What it is for:** Frames the returned payload, telling the agent the response contains both the domain model and tool guidance.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/execution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** response-format-template · **Impact tier:** high-impact

### C217 — CURRICULUM\_MODEL\_RESOURCE.title

**What it says now:**

```text
title: 'Oak Curriculum Model',
```

**What it is for:** Listing title 'Oak Curriculum Model' identifying the priority-1.0 orientation resource agents should load first.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C218 — CURRICULUM\_MODEL\_RESOURCE.description

**What it says now:**

```text
description:
    'Combined curriculum orientation: domain model (key stages, subjects, entity hierarchy, property graph) and tool usage guidance (categories, workflows, tips).',
```

**What it is for:** Describes the resource as combined curriculum orientation — domain model (key stages, subjects, entity hierarchy, property graph) plus tool usage guidance (categories, workflows, tips) — telling agents what orientation payload to expect.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** resource-name-or-description · **Impact tier:** high-impact

### C219 — CURRICULUM\_MODEL\_RESOURCE.annotations

**What it says now:**

```text
annotations: {
    priority: 1.0,
    audience: ['assistant'] satisfies ('user' | 'assistant')[],
  },
```

**What it is for:** MCP annotations (priority 1.0, audience ['assistant']) marking this resource for auto-injection into AI-assistant context — the strongest behaviour hint in this slice, driving pre-fetch/grounding at session start.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-annotations · **Impact tier:** high-impact

### C286 — ontologyData.version/generatedAt

**What it says now:**

```text
version: '0.2.0',
  generatedAt: '2026-06-23T00:00:00Z',
```

**What it is for:** Versions the ontology payload and dates it, letting agents reason about freshness.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** discovery-or-catalog-metadata · **Impact tier:** high-impact

### C287 — ontologyData.purpose

**What it says now:**

```text
purpose:
    'This ontology describes the Oak National Academy curriculum domain model. It provides context for AI agents to understand the structure of UK education content, including key stages, subjects, entity hierarchies, threads, and tool usage guidance.',
```

**What it is for:** Orients the agent: this ontology describes the Oak curriculum domain model to provide context on UK education content structure.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C288 — ontologyData.notice

**What it says now:**

```text
notice:
    'Partially schema-derived: the subject list, the key-stage list, and the KS4 examSubject variants are generated from the OpenAPI schema/SDK at build time and cannot drift from the live API. Display names, key-stage metadata, exam boards, tiers, and pathways are authored.',
```

**What it is for:** Discloses provenance: which lists are schema-derived (cannot drift) vs authored, so agents calibrate trust.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C290 — ontologyData.relatedResources

**What it says now:**

```text
relatedResources: {
    threadProgressions:
      'Call get-thread-progressions for ordered unit sequences within curriculum threads (instance data)',
    priorKnowledgeGraph:
      'Call get-prior-knowledge-graph with anchor unit slugs for the bounded prior-knowledge subgraph of those units (dependencies and prior knowledge requirements)',
  },
```

**What it is for:** Cross-references the get-thread-progressions and get-prior-knowledge-graph tools for instance data.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C291 — subject + key-stage display metadata

**What it says now:**

```text
const subjectDisplayMetadata: Record<
  CanonicalSubjectSlug,
  { name: string; keyStages: readonly string[]; hasExamSubjects?: boolean }
> = {
  maths: { name: 'Mathematics', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  english: { name: 'English', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  science: { name: 'Science', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'], hasExamSubjects: true },
  history: { name: 'History', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  geography: { name: 'Geography', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  art: { name: 'Art', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  music: { name: 'Music', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  'physical-education': { name: 'Physical Education', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  computing: { name: 'Computing', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  'religious-education': { name: 'Religious Education', keyStages: ['ks1', 'ks2', 'ks3'] },
  french: { name: 'French', keyStages: ['ks2', 'ks3', 'ks4'] },
  spanish: { name: 'Spanish', keyStages: ['ks2', 'ks3', 'ks4'] },
  german: { name: 'German', keyStages: ['ks3', 'ks4'] },
  citizenship: { name: 'Citizenship', keyStages: ['ks3', 'ks4'] },
  'design-technology': { name: 'Design and technology', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  'rshe-pshe': { name: 'RSHE (PSHE)', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
  'cooking-nutrition': { name: 'Cooking and nutrition', keyStages: ['ks1', 'ks2', 'ks3'] },
};

/**
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Provides authored human names, key-stage coverage, age ranges, year spans, phases, and descriptions for each subject and key stage, attached to schema-derived slugs.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C292 — ontologyData.threads

**What it says now:**

```text
threads: {
    definition:
      'An attribute assigned to units that groups together units across the curriculum building a common body of knowledge. Threads are important for making vertical connections across year groups in each subject.',
    importance:
      "Threads show how ideas BUILD over time — they are the pedagogical backbone of Oak's curriculum. Understanding threads enables powerful queries like 'what comes before this topic?' and 'how does this concept develop from Year 1 to Year 11?'",
    countSummary: `${String(threadProgressionStats.threadCount)} threads across ${String(threadProgressionStats.subjectsCovered.length)} subjects, connecting units into learning progressions`,
    characteristics: [
      'Programme-agnostic: A single thread spans multiple programmes, key stages, and years',
      'Year-ordered: A thread’s units progress by teaching year (within one year the order is not curricular)',
      'Cross-key-stage: Threads enable tracking progression from early years to GCSE',
      'Primary navigation: Threads are used as filters on the Oak website',
    ],
    examples: [
      {
        slug: 'number',
        subject: 'maths',
        spans: 'Reception → Year 11',
        unitCount: 118,
        progression: 'Counting 0-10 → Place value → Fractions → Algebra → Surds',
      },
      {
        slug: 'geometry-and-measure',
        subject: 'maths',
        spans: 'KS1 → KS4',
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Defines threads, asserts their pedagogical importance ('backbone of Oak's curriculum'), lists characteristics (incl. within-year order not curricular), worked examples with progressions, and REST tool-usage hints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C293 — ontologyData.programmesVsSequences

**What it says now:**

```text
programmesVsSequences: {
    criticalDistinction:
      "The API uses 'sequences' internally, but teachers navigate by 'programmes'",
    sequence: {
      definition: 'API organizational structure for curriculum data storage and retrieval',
      example: 'science-secondary-aqa',
      spans: 'Multiple key stages and years (e.g., KS3 + KS4)',
      note: 'One sequence can generate MANY programme views',
    },
    programme: {
      definition: 'A contextualized, user-facing curriculum pathway. What teachers navigate by.',
      example: 'biology-secondary-ks4-foundation-aqa',
      factors: ['keyStage', 'tier', 'examBoard', 'examSubject'],
      owaUrl: 'https://www.thenational.academy/teachers/programmes/{programmeSlug}',
    },
    relationship: {
      example: "One sequence 'science-secondary-aqa' maps to 8+ programme URLs for Year 10 alone",
      programmes: [
        'biology-secondary-ks4-foundation-aqa',
        'biology-secondary-ks4-higher-aqa',
        'chemistry-secondary-ks4-foundation-aqa',
        'chemistry-secondary-ks4-higher-aqa',
        'physics-secondary-ks4-foundation-aqa',
        'physics-secondary-ks4-higher-aqa',
        'combined-science-secondary-ks4-foundation-aqa',
        'combined-science-secondary-ks4-higher-aqa',
      ],
    },
  },
```

**What it is for:** Draws the critical distinction: API uses 'sequences' internally but teachers navigate 'programmes'; explains one-sequence-to-many-programmes with a science example.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C294 — ontologyData.ks4Complexity

**What it says now:**

```text
ks4Complexity: {
    note: 'KS4 has additional programme factors not present in KS1-3',
    programmeFactors: {
      tier: {
        values: ['foundation', 'higher'],
        appliesTo: ['maths', 'science'],
        description: 'Categorisation based on exam paper difficulty level',
      },
      examBoard: {
        values: ['aqa', 'edexcel', 'eduqas', 'ocr', 'wjec', 'edexcelb'],
        description: 'Official body that sets and grades qualifications',
      },
      examSubject: {
        values: [...KS4_SCIENCE_VARIANTS],
        appliesTo: ['science'],
        description: 'Child subject within KS4 science with associated examination',
      },
      pathway: {
        values: ['core', 'gcse'],
        appliesTo: ['citizenship', 'computing', 'physical-education'],
        description: 'Route through KS4 curriculum',
      },
    },
    subjectHierarchy: {
      parentSubject: "Top-level subject (e.g., 'Science' at KS1-3)",
      childSubject: "Specialisation within parent (e.g., 'Biology' within Science at KS4)",
      examSubject: "Child subject with exam board (e.g., 'AQA Biology GCSE')",
    },
  },
```

**What it is for:** Explains KS4 programme factors (tier, examBoard, examSubject, pathway) with which subjects they apply to, and the parent/child/exam subject hierarchy.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C295 — ontologyData.structuralPatterns

**What it says now:**

```text
structuralPatterns: {
    purpose:
      'The API response structure varies by subject and key stage. These patterns describe how to traverse the data correctly. Understanding patterns is ESSENTIAL for complete data retrieval.',
    criticalNote:
      'Patterns can COMBINE — a subject may have multiple patterns simultaneously. Science KS4 has THREE patterns (exam boards + exam subjects + tiers).',
    traversalGuidance: {
      simpleFlatRoute:
        'GET /key-stages/{ks}/subject/{subject}/lessons — works for KS1-KS3 all subjects',
      sequenceRoute:
        'GET /sequences/{sequence}/units?year={year} — required for KS4 patterns with tiers/examSubjects',
      scienceKs4Warning:
        'CRITICAL: GET /key-stages/ks4/subject/science/lessons returns EMPTY. Must use sequences endpoint and traverse examSubjects → tiers → units.',
      mathsKs4Note:
        'Maths KS4 has tiers but no exam boards. Use sequences endpoint to get tier information.',
      unitOptionsNote:
        'When units have unitOptions[], each option is a separate unit with its own lessons.',
    },
    note: 'API response structures vary by subject and key stage. Detect pattern from response shape.',
    patterns: [
      {
        id: 'simple-flat',
        description: 'Standard year → units[] → lessons[] structure',
        appliesTo: 'All subjects at KS1-KS3, most subjects at KS4',
        responseShape: '{ data: [{ year, units: [...] }] }',
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Teaches API traversal: named response patterns (simple-flat, tier-variants, exam-subject-split, exam-board-variants, unit-options, no-ks4), detection cues, key-stage gaps, and the combination matrix; states patterns can combine.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C296 — scienceKs4Warning / exam-subject-split.critical

**What it says now:**

```text
scienceKs4Warning:
        'CRITICAL: GET /key-stages/ks4/subject/science/lessons returns EMPTY. Must use sequences endpoint and traverse examSubjects → tiers → units.',

critical: '/key-stages/ks4/subject/science/lessons returns EMPTY. Use sequences endpoint.',
```

**What it is for:** High-salience CRITICAL warning: the science-KS4 lessons endpoint returns EMPTY; must use the sequences endpoint and traverse examSubjects → tiers → units.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C297 — ontologyData.entityHierarchy

**What it says now:**

```text
entityHierarchy: {
    description: 'Curriculum content is organised in a hierarchy from Subject down to Lesson',
    traversalNote:
      'Traversal typically starts from sequences (not subjects) because sequences contain the structural metadata (tiers, exam boards, exam subjects) needed for complete data retrieval. See structuralPatterns for details.',
    levels: [
      {
        entity: 'Subject',
        example: 'maths',
        contains: 'Sequences (API) / Programmes (user-facing)',
        schemaRef: 'SubjectResponseSchema',
      },
      {
        entity: 'Sequence',
        example: 'maths-primary',
        contains: 'Units (organised by year)',
        note: 'API internal structure - generates multiple programme views',
        schemaRef: 'SubjectSequenceResponseSchema',
      },
      {
        entity: 'Unit',
        types: ['simple', 'variant (tier-based)', 'optionality (teacher choice)'],
        example: 'comparing-fractions',
        contains: 'Lessons (typically 4-8 per unit)',
        schemaRef: 'UnitSummaryResponseSchema',
      },
      {
        entity: 'Lesson',
        example: 'add-fractions-with-the-same-denominator',
        contains:
          'Up to 8 OPTIONAL components: curriculum info (always), slide deck, video, transcript, starter quiz, exit quiz, worksheet, additional materials',
        note: 'Not all lessons have all components - check availability before use',
        schemaRef: 'LessonSummaryResponseSchema',
      },
    ],
  },
```

**What it is for:** Describes the Subject→Sequence→Unit→Lesson hierarchy, the traversal-starts-from-sequences note, per-level examples, schemaRefs, and lesson component list.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C298 — ontologyData.unitTypes

**What it says now:**

```text
unitTypes: {
    definition: 'Units come in three types based on how their lesson sequences work',
    types: [
      {
        type: 'simple',
        description: 'Standard unit with a fixed sequence of lessons',
      },
      {
        type: 'variant',
        description:
          'Different lesson sequences depending on context (e.g., foundation vs higher tier)',
        example: 'A trigonometry unit has 2 extra lessons in the higher tier',
      },
      {
        type: 'optionality',
        description: 'Multiple options for teacher personalisation',
        example: 'A history unit offers choice of Battle of Hastings OR Durham Cathedral',
      },
    ],
    apiField: 'unitOptions - array of alternative unit choices',
  },
```

**What it is for:** Defines simple/variant/optionality unit types with examples and the unitOptions API field.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C299 — ontologyData.lessonComponents

**What it says now:**

```text
lessonComponents: {
    definition: 'Oak lessons can have up to 8 component types. All components are OPTIONAL.',
    note: 'Not all lessons have all components. Check API responses for presence before use.',
    components: [
      {
        name: 'Curriculum information',
        description: 'Lesson summary with metadata',
        tool: 'get-lessons-summary',
        availability: 'always present',
      },
      {
        name: 'Slide deck',
        description: 'Presentation slides',
        tool: 'get-lessons-assets',
        availability: 'optional',
      },
      {
        name: 'Video',
        description: 'Teacher-delivered lesson video',
        tool: 'get-lessons-assets',
        availability: 'optional - not all lessons have video',
      },
      {
        name: 'Video transcript',
        description: 'Full text of video content',
        tool: 'get-lessons-transcript',
        availability: 'optional - only present if lesson has video',
      },
      {
        name: 'Starter quiz',
        description: 'Prior knowledge assessment',
        tool: 'get-lessons-quiz',
        availability: 'optional',
      },
      {
        name: 'Exit quiz',
        description: 'Learning assessment',
        tool: 'get-lessons-quiz',
        availability: 'optional',
      },
      {
        name: 'Worksheet',
        description: 'Practice tasks with answers',
        tool: 'get-lessons-assets',
        availability: 'optional',
      },
      {
```

*Shown in part only — read the full text in the source file below.*

**What it is for:** Lists the 8 optional lesson components, mapping each to the tool that fetches it and its availability (always/optional), with the check-before-use caveat.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C300 — ontologyData.contentGuidance

**What it says now:**

```text
contentGuidance: {
    definition: 'Warnings to teachers about lesson content requiring awareness or supervision',
    categories: [
      'Language and discrimination',
      'Upsetting, disturbing and sensitive content',
      'Nudity and sex',
      'Physical activity and equipment requiring safe use',
    ],
    supervisionLevels: [
      { level: 1, description: 'Adult supervision suggested' },
      { level: 2, description: 'Adult supervision recommended' },
      { level: 3, description: 'Adult supervision required' },
      { level: 4, description: 'Adult support required' },
    ],
    note: 'Use supervisionLevel field rather than relying on sub-guidance levels',
  },
```

**What it is for:** Documents safeguarding content-warning categories and the four adult-supervision levels; directs use of supervisionLevel over sub-guidance levels.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C301 — ontologyData.idFormats

**What it says now:**

```text
idFormats: {
    description: "The 'fetch' tool uses prefixed IDs to route to the correct endpoint",
    formats: [
      {
        prefix: 'lesson:',
        example: 'lesson:adding-fractions',
        fetchesFrom: 'Lesson summary endpoint',
      },
      {
        prefix: 'unit:',
        example: 'unit:comparing-fractions',
        fetchesFrom: 'Unit summary endpoint',
      },
      {
        prefix: 'subject:',
        example: 'subject:maths',
        fetchesFrom: 'Subject details endpoint',
      },
      { prefix: 'thread:', example: 'thread:number', fetchesFrom: 'Thread units endpoint' },
    ],
  },
```

**What it is for:** Explains the fetch tool's prefixed-ID routing (lesson:/unit:/subject:/thread:) with examples.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-guidance · **Impact tier:** high-impact

### C302 — ontologyData.ukEducationContext

**What it says now:**

```text
ukEducationContext: {
    description: 'Context about the UK education system for AI agents',
    notes: [
      'Key Stages are UK-specific age groupings defined by the National Curriculum',
      'Year 1 = age 5-6 (first year of primary school)',
      'Year 6 = age 10-11 (final year of primary, SATs exams)',
      'Year 7 = age 11-12 (first year of secondary school)',
      'Year 11 = age 15-16 (final year of secondary, GCSE exams on KS4 content)',
      'Primary = Years 1-6 (KS1 + KS2)',
      'Secondary = Years 7-11 (KS3 + KS4)',
      'Oak lessons align with the National Curriculum for England',
      'GCSE = General Certificate of Secondary Education (KS4 qualification). Note:  GCSE is not a pedagogical sequence term, the proper term is "KS4"',
    ],
    yearToAge: {
      year1: '5-6',
      year2: '6-7',
      year3: '7-8',
      year4: '8-9',
      year5: '9-10',
      year6: '10-11',
      year7: '11-12',
      year8: '12-13',
      year9: '13-14',
      year10: '14-15',
      year11: '15-16',
    },
  },
```

**What it is for:** Provides UK education context: key-stage age groupings, year→age mapping, primary/secondary spans, alignment to the National Curriculum for England.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C303 — ukEducationContext GCSE terminology note

**What it says now:**

```text
'GCSE = General Certificate of Secondary Education (KS4 qualification). Note:  GCSE is not a pedagogical sequence term, the proper term is "KS4"',
```

**What it is for:** Corrects terminology: GCSE is not a pedagogical sequence term; the proper term is 'KS4'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C304 — ontologyData.workflows + propertyGraph (imported)

**What it says now:**

```text
workflows: toolGuidanceData.workflows,

propertyGraph: conceptGraph,
```

**What it is for:** Delivers workflows (from tool-guidance-data) and the concept-type property graph (conceptGraph from sdk-codegen/vocab) as part of the orientation payload.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact

### C305 — composeCurriculumModelData / composeToolGuidance

**What it says now:**

```text
function composeToolGuidance() {
  return {
    serverOverview: toolGuidanceData.serverOverview,
    toolCategories: toolGuidanceData.toolCategories,
    workflows: toolGuidanceData.workflows,
    tips: toolGuidanceData.tips,
    idFormats: toolGuidanceData.idFormats,
  };
}

/**
 * Composes the full curriculum model data for agent orientation.
 *
 * Returns the complete ontology (domain model) plus tool guidance
 * in a single response. No parameters — the full model is always
 * returned. Per-tool help is available on each tool's own description.
 *
 * @returns Composed curriculum model data
 */
export function composeCurriculumModelData(): CurriculumModelData {
  return {
    domainModel: ontologyData,
    toolGuidance: composeToolGuidance(),
  };
}
```

**What it is for:** Assembles the get-curriculum-model response: the full ontology (domainModel) plus tool guidance (serverOverview, toolCategories, workflows, tips, idFormats) with no filtering — the single orientation payload.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** orientation-content · **Impact tier:** high-impact
