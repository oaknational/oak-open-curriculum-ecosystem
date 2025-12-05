# Optimised Knowledge Graph Proposal

> **STATUS: V1 TARGET STRUCTURE**
>
> This document defines the target structure for V1 implementation:
> ~28 concept nodes and ~45 edges, concept-only (no API mapping).
> For comprehensive synthesis, see `knowledge-graph-analysis-synthesis.md`.

This document proposes an optimised structure for the knowledge graph that focuses on **concept relationships** rather than API implementation details.

**Last Updated**: December 2025 (major revision: removed API focus, concept-only graph)

---

## Terminology: Schema-Level Knowledge Graph

The **Oak Curriculum Knowledge Graph (schema-level)** captures:

- **Structure and form**: How concept types relate to each other
- **NOT substance**: Not specific instances (individual lessons, units)

This is the schema/TBox portion of a full knowledge graph. The ontology provides enumerated instances (actual key stages, subjects) plus rich guidance. Together they form a complete domain model.

---

## 1. Optimisation Goals

| Goal           | Current | Target | Approach                                       |
| -------------- | ------- | ------ | ---------------------------------------------- |
| File size      | ~40KB   | ~8KB   | Remove API nodes, keep concepts only           |
| Node count     | 89      | ~28    | Concepts only (no Endpoints, Schemas, etc.)    |
| Edge count     | 118     | ~40    | Concept-to-concept edges only                  |
| Token estimate | ~10,000 | ~2,000 | Radical simplification to domain relationships |

---

## 2. Structural Changes (Major Revision)

### 2.1 Remove ALL Non-Concept Nodes

**Remove entirely:**

| Node Type    | Count | Reason                                     |
| ------------ | ----- | ------------------------------------------ |
| Endpoint     | 27    | Agents see `tools/list` — no duplication   |
| Schema       | 24    | Internal API detail, not domain knowledge  |
| SourceDoc    | 4     | Research provenance, not useful for agents |
| ExternalLink | 5     | Consider keeping for documentation refs    |

**Keep:**

| Node Type | Count | Reason                        |
| --------- | ----- | ----------------------------- |
| Concept   | 28    | Domain model — the core value |

### 2.2 Remove ALL API-Mapping Edges

**Remove entirely:**

- `Concept → Endpoint` edges ("listed by endpoint", "returned by endpoint")
- `Endpoint → Schema` edges ("returns schema")
- `Schema → Concept` edges ("describes", "lists")

**Keep:**

- `Concept → Concept` edges (hierarchy, relationships)
- Inferred relationship edges

### 2.3 Simplify Node IDs

Since we're keeping concepts only:

| Current ID          | Proposed ID |
| ------------------- | ----------- |
| "concept_subject"   | "subject"   |
| "concept_keystage"  | "keystage"  |
| "concept_sequence"  | "sequence"  |
| "concept_unit"      | "unit"      |
| "concept_lesson"    | "lesson"    |
| "concept_thread"    | "thread"    |
| "concept_programme" | "programme" |

### 2.4 Simplify Edge Labels

| Current Label              | Proposed Label     |
| -------------------------- | ------------------ |
| "has sequences"            | "hasSequences"     |
| "includes units"           | "containsUnits"    |
| "contains lessons"         | "containsLessons"  |
| "links units across years" | "linksAcrossYears" |
| "belongs to subject"       | "belongsTo"        |
| "scoped to key stage"      | "scopedTo"         |

---

## 3. Proposed Concept-Only Structure

```typescript
/**
 * Oak Curriculum Concept Graph
 *
 * A structural representation of curriculum concept relationships.
 * Use get-ontology for rich concept definitions and workflow guidance.
 *
 * This graph captures domain relationships, NOT API mappings.
 * Agents learn about endpoints from tools/list.
 */
export interface ConceptGraph {
  readonly version: string;
  readonly concepts: readonly ConceptNode[];
  readonly edges: readonly ConceptEdge[];
  readonly seeOntology: string;
}

interface ConceptNode {
  readonly id: string; // e.g., "subject"
  readonly label: string; // e.g., "Subject"
  readonly brief: string; // One-line description
  readonly category?: ConceptCategory;
}

type ConceptCategory =
  | 'structure' // Subject, Sequence, Unit, Lesson
  | 'content' // Asset, Transcript, Quiz, Question, Answer
  | 'metadata' // EducationalMetadata, ContentGuidance, etc.
  | 'context' // KeyStage, Phase, YearGroup
  | 'ks4' // Programme, Tier, Pathway, ExamBoard, ExamSubject
  | 'taxonomy'; // Thread, Category

interface ConceptEdge {
  readonly from: string;
  readonly to: string;
  readonly rel: string; // e.g., "containsUnits", "belongsTo"
  readonly inferred?: true; // Mark relationships not explicit in API
}
```

---

## 4. Example Concept-Only Data

### 4.1 Concepts

```typescript
concepts: [
  // Structure concepts
  {
    id: 'subject',
    label: 'Subject',
    brief: 'Curriculum subject (maths, history, etc.)',
    category: 'structure',
  },
  {
    id: 'sequence',
    label: 'Sequence',
    brief: 'Internal API grouping of units',
    category: 'structure',
  },
  { id: 'unit', label: 'Unit', brief: 'Topic of study with lessons', category: 'structure' },
  {
    id: 'lesson',
    label: 'Lesson',
    brief: 'Teaching session with objectives',
    category: 'structure',
  },

  // Content concepts
  { id: 'quiz', label: 'Quiz', brief: 'Starter or exit quiz', category: 'content' },
  { id: 'question', label: 'Question', brief: 'Quiz question with answers', category: 'content' },
  {
    id: 'answer',
    label: 'Answer',
    brief: 'Answer option (correct or distractor)',
    category: 'content',
  },
  { id: 'asset', label: 'Asset', brief: 'Downloadable resource', category: 'content' },
  { id: 'transcript', label: 'Transcript', brief: 'Video transcript text', category: 'content' },

  // Context concepts
  { id: 'keystage', label: 'KeyStage', brief: 'Education stage (KS1-KS4)', category: 'context' },
  { id: 'yeargroup', label: 'YearGroup', brief: 'School year (Year 1-11)', category: 'context' },
  { id: 'phase', label: 'Phase', brief: 'Primary or secondary', category: 'context' },

  // Taxonomy concepts
  { id: 'thread', label: 'Thread', brief: 'Conceptual strand across years', category: 'taxonomy' },
  { id: 'category', label: 'Category', brief: 'Subject-specific grouping', category: 'taxonomy' },

  // KS4 complexity concepts
  { id: 'programme', label: 'Programme', brief: 'User-facing curriculum pathway', category: 'ks4' },
  { id: 'tier', label: 'Tier', brief: 'Foundation or higher', category: 'ks4' },
  { id: 'pathway', label: 'Pathway', brief: 'Core or GCSE route', category: 'ks4' },
  { id: 'examboard', label: 'ExamBoard', brief: 'AQA, OCR, Edexcel, etc.', category: 'ks4' },
  {
    id: 'examsubject',
    label: 'ExamSubject',
    brief: 'Biology, Chemistry, etc. (KS4)',
    category: 'ks4',
  },

  // Metadata concepts
  {
    id: 'contentguidance',
    label: 'ContentGuidance',
    brief: 'Sensitive content advisory',
    category: 'metadata',
  },
  {
    id: 'supervisionlevel',
    label: 'SupervisionLevel',
    brief: 'Adult supervision required',
    category: 'metadata',
  },
  {
    id: 'educationalmetadata',
    label: 'EducationalMetadata',
    brief: 'Prior knowledge, keywords, etc.',
    category: 'metadata',
  },
  // ... remaining ~28 concepts
];
```

### 4.2 Concept Edges (Core Hierarchy)

```typescript
edges: [
  // Core hierarchy
  { from: 'subject', to: 'sequence', rel: 'hasSequences' },
  { from: 'sequence', to: 'unit', rel: 'containsUnits' },
  { from: 'unit', to: 'lesson', rel: 'containsLessons' },

  // Content hierarchy
  { from: 'lesson', to: 'quiz', rel: 'hasQuizzes' },
  { from: 'lesson', to: 'asset', rel: 'hasAssets' },
  { from: 'lesson', to: 'transcript', rel: 'hasTranscript' },
  { from: 'quiz', to: 'question', rel: 'containsQuestions' },
  { from: 'question', to: 'answer', rel: 'hasAnswers' },

  // Context relationships
  { from: 'phase', to: 'keystage', rel: 'includesKeyStages' },
  { from: 'keystage', to: 'yeargroup', rel: 'includesYears' },
  { from: 'subject', to: 'keystage', rel: 'availableAt' },

  // Taxonomy relationships
  { from: 'thread', to: 'unit', rel: 'linksAcrossYears' },
  { from: 'unit', to: 'thread', rel: 'taggedWith' },
  { from: 'unit', to: 'category', rel: 'taggedWith' },

  // Inferred relationships
  { from: 'unit', to: 'subject', rel: 'belongsTo', inferred: true },
  { from: 'unit', to: 'keystage', rel: 'belongsTo', inferred: true },
  { from: 'unit', to: 'yeargroup', rel: 'targets', inferred: true },

  // KS4 complexity (all inferred - Programme is derived)
  { from: 'programme', to: 'subject', rel: 'about', inferred: true },
  { from: 'programme', to: 'keystage', rel: 'scopedTo', inferred: true },
  { from: 'programme', to: 'unit', rel: 'containsUnits', inferred: true },
  { from: 'programme', to: 'tier', rel: 'uses', inferred: true },
  { from: 'programme', to: 'pathway', rel: 'uses', inferred: true },
  { from: 'programme', to: 'examboard', rel: 'uses', inferred: true },
  { from: 'sequence', to: 'examsubject', rel: 'branchesInto', inferred: true },
  { from: 'examsubject', to: 'tier', rel: 'hasTiers', inferred: true },

  // Metadata relationships
  { from: 'lesson', to: 'contentguidance', rel: 'hasGuidance' },
  { from: 'contentguidance', to: 'supervisionlevel', rel: 'requiresSupervision' },
  { from: 'lesson', to: 'educationalmetadata', rel: 'hasMetadata' },
  { from: 'unit', to: 'educationalmetadata', rel: 'hasMetadata' },
  // ... remaining ~40 edges
];
```

**NOTE**: No endpoint or schema nodes/edges. Agents learn about API from `tools/list`.

---

## 5. Size Comparison

### Current Structure (~40KB) — Wrong Focus

```
89 nodes:
  - 28 Concept nodes
  - 27 Endpoint nodes ← REMOVE (agents see tools/list)
  - 24 Schema nodes ← REMOVE (API detail)
  - 5 ExternalLink nodes
  - 5 SourceDoc nodes ← REMOVE (research provenance)

118 edges:
  - ~30 Concept → Concept ← KEEP
  - ~40 Concept → Endpoint ← REMOVE
  - ~27 Endpoint → Schema ← REMOVE
  - ~21 Schema → Concept ← REMOVE

Total ≈ 40,000 bytes / ~10,000 tokens
```

### Concept-Only Structure (~8KB) — Correct Focus

```
~28 concept nodes × ~120 bytes = 3,360 bytes
~40 concept edges × ~60 bytes = 2,400 bytes
Metadata and cross-reference = ~2,000 bytes
Total ≈ 8,000 bytes / ~2,000 tokens
```

**Reduction**: 80% smaller, 80% fewer tokens

### Combined Token Budget

```
Ontology: ~12KB (~3,000 tokens)
Graph:    ~8KB  (~2,000 tokens)
─────────────────────────────────
Total:    ~20KB (~5,000 tokens) for complete domain context
```

This is manageable for agent context windows.

---

## 6. Query Patterns Enabled

### 6.1 "What concepts are related to Unit?"

```typescript
// Find all edges involving 'unit'
const related = graph.edges.filter((e) => e.from === 'unit' || e.to === 'unit');
// Result: relationships to sequence, lesson, thread, category, subject, keystage, yeargroup
```

### 6.2 "What does a Lesson contain?"

```typescript
// Find edges where Lesson is the source
const lessonContains = graph.edges.filter((e) => e.from === 'lesson');
// Result: quiz, asset, transcript, contentguidance, educationalmetadata
```

### 6.3 "What's the full hierarchy from Subject to Question?"

```typescript
// Trace the path
const path = ['subject', 'sequence', 'unit', 'lesson', 'quiz', 'question', 'answer'];
// Agent can reason about depth and navigation
```

### 6.4 "What inferred relationships exist?"

```typescript
// Find all inferred edges
const inferred = graph.edges.filter((e) => e.inferred);
// Result: Programme relationships, Unit → Subject/KeyStage, etc.
// These represent domain knowledge not explicit in the API
```

**NOT supported (and shouldn't be):**

- ~~"What endpoints return Lesson data?"~~ — use `tools/list`
- ~~"What schema does GET /subjects return?"~~ — API detail

---

## 7. Alternative: Ultra-Minimal Graph

For extreme token efficiency (if ~8KB is still too much):

```typescript
export const minimalGraph = {
  // Core hierarchy as adjacency list
  hierarchy: {
    subject: ['sequence'],
    sequence: ['unit'],
    unit: ['lesson'],
    lesson: ['quiz', 'asset', 'transcript'],
    quiz: ['question'],
    question: ['answer'],
  },

  // Context hierarchy
  context: {
    phase: ['keystage'],
    keystage: ['yeargroup'],
  },

  // Cross-cutting relationships
  taxonomy: {
    thread: ['unit'], // Threads link units across years
    category: ['unit'], // Categories group units within subject
  },

  // Inferred (KS4 complexity)
  ks4: {
    programme: ['unit', 'tier', 'pathway', 'examboard'],
    examsubject: ['tier'],
  },

  seeOntology: 'Call get-ontology for definitions and guidance',
} as const;
```

This ultra-minimal graph would be ~1.5KB (~400 tokens).

**Trade-off**: Loses concept briefs and explicit inferred flags, but captures core structure.

---

## 8. Implementation Notes

### 8.1 Type Safety

Use `as const` and derive types:

```typescript
export const conceptGraph = {
  version: '1.0.0',
  concepts: [...],
  edges: [...],
  seeOntology: 'Call get-ontology for definitions',
} as const;

export type ConceptGraph = typeof conceptGraph;
export type ConceptId = ConceptGraph['concepts'][number]['id'];
// Compile-time validation of edge references
```

### 8.2 Validation

At authoring time, validate:

- All edge `from`/`to` values reference existing concept IDs
- No orphan concepts (every concept has at least one edge)
- Consistent with ontology concept names
- Inferred edges are marked

### 8.3 OpenAI SDK Compliance

The graph goes in `structuredContent` (model needs it):

```typescript
return {
  content: [{ type: 'text', text: 'Concept relationships loaded.' }],
  structuredContent: conceptGraph, // Model reasons about this
  _meta: {
    toolName: 'get-knowledge-graph',
    // Widget hints only, NOT the graph data
  },
};
```

### 8.4 Tool Parameters (Optional Future)

Could add focused queries if needed:

```typescript
GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    focus: {
      type: 'string',
      description: 'Concept to focus on (returns subgraph)',
    },
  },
  additionalProperties: false,
};
```

---

## 9. Migration Path

1. **Create optimised data file** in SDK: `knowledge-graph-data.ts`
2. **Validate** against current graph (ensure no information loss)
3. **Add tool** following existing patterns
4. **Test with agents** to validate utility
5. **Iterate** based on actual usage patterns

---

## 10. Appendix: Concept-Only Node List

### Concepts (28 total, simplified IDs)

| Category    | ID                  | Label                       | Brief                      |
| ----------- | ------------------- | --------------------------- | -------------------------- |
| structure   | subject             | Subject                     | Curriculum subject         |
| structure   | sequence            | Sequence                    | Internal API grouping      |
| structure   | unit                | Unit                        | Topic of study             |
| structure   | lesson              | Lesson                      | Teaching session           |
| content     | quiz                | Quiz                        | Starter or exit quiz       |
| content     | question            | Question                    | Quiz question              |
| content     | answer              | Answer                      | Answer option              |
| content     | asset               | Asset                       | Downloadable resource      |
| content     | transcript          | Transcript                  | Video transcript           |
| context     | keystage            | KeyStage                    | KS1-KS4                    |
| context     | yeargroup           | YearGroup                   | Year 1-11                  |
| context     | phase               | Phase                       | Primary or secondary       |
| taxonomy    | thread              | Thread                      | Conceptual strand          |
| taxonomy    | category            | Category                    | Subject-specific grouping  |
| ks4         | programme           | Programme                   | User-facing pathway        |
| ks4         | tier                | Tier                        | Foundation or higher       |
| ks4         | pathway             | Pathway                     | Core or GCSE               |
| ks4         | examboard           | ExamBoard                   | AQA, OCR, etc.             |
| ks4         | examsubject         | ExamSubject                 | Biology, Chemistry, etc.   |
| metadata    | contentguidance     | ContentGuidance             | Sensitive content advisory |
| metadata    | supervisionlevel    | SupervisionLevel            | Adult supervision level    |
| metadata    | educationalmetadata | EducationalMetadata         | Prior knowledge, keywords  |
| metadata    | priorknowledge      | PriorKnowledgeRequirement   | Prerequisite knowledge     |
| metadata    | curriculumstatement | NationalCurriculumStatement | NC coverage                |
| metadata    | keyword             | LessonKeyword               | Key vocabulary             |
| metadata    | misconception       | Misconception               | Common misunderstanding    |
| operational | ratelimit           | RateLimitStatus             | API rate limit (keep?)     |
| operational | changelog           | ChangelogEntry              | API change record (keep?)  |

### Removed Node Types

| Type         | Count | Reason                                    |
| ------------ | ----- | ----------------------------------------- |
| Endpoint     | 27    | Agents see `tools/list`                   |
| Schema       | 24    | Internal API detail                       |
| SourceDoc    | 4     | Research provenance                       |
| ExternalLink | 5     | Consider keeping for doc links (optional) |
