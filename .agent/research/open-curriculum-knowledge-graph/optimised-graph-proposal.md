# Optimised Knowledge Graph Proposal

This document proposes an optimised structure for the knowledge graph that reduces payload size while maintaining utility for AI agents.

---

## 1. Optimisation Goals

| Goal           | Current | Target | Approach                                 |
| -------------- | ------- | ------ | ---------------------------------------- |
| File size      | ~40KB   | ~20KB  | Remove unnecessary nodes, shorten labels |
| Node count     | 89      | ~75    | Remove SourceDoc nodes, consolidate      |
| Edge count     | 118     | ~100   | Remove redundant edges                   |
| Token estimate | ~10,000 | ~5,000 | Structural simplification                |

---

## 2. Structural Changes

### 2.1 Remove SourceDoc Nodes

The following nodes are research provenance, not useful for agents:

- `src_api_schema_sdk` — Local OpenAPI copy
- `src_curriculum_ontology_md` — Local markdown
- `src_official_api_ontology_comparison_md` — Internal comparison
- `src_ontology_research_summary_md` — Research summary

**Rationale**: Agents don't need to know about research artifacts. They need to understand the curriculum and API.

### 2.2 Simplify Edge Labels

| Current Label              | Proposed Label |
| -------------------------- | -------------- |
| "has sequences"            | "hasSequences" |
| "belongs to subject"       | "belongsTo"    |
| "listed by endpoint"       | "listedBy"     |
| "returned by endpoint"     | "returnedBy"   |
| "returns schema"           | "returns"      |
| "describes subjects"       | "describes"    |
| "links units across years" | "linksUnits"   |

### 2.3 Use Shorter Node IDs

| Current ID                   | Proposed ID      |
| ---------------------------- | ---------------- |
| "concept_subject"            | "c_subject"      |
| "concept_keystage"           | "c_ks"           |
| "ep_subjects_get"            | "ep_subjects"    |
| "schema_AllSubjectsResponse" | "s_AllSubjects"  |
| "link_oak_api_overview"      | "x_api_overview" |

### 2.4 Group Edges by Category

Instead of a flat edge array, use categorised arrays:

```typescript
{
  edges: {
    conceptRelations: [ /* concept → concept */ ],
    apiMappings: [ /* concept → endpoint */ ],
    schemaMappings: [ /* endpoint → schema, schema → concept */ ]
  }
}
```

This allows agents to query only relevant edge types.

---

## 3. Proposed Optimised Structure

```typescript
/**
 * Optimised Oak Curriculum Knowledge Graph
 *
 * A structural representation of curriculum concepts and their API mappings.
 * Use get-ontology for rich concept definitions and workflow guidance.
 */
export interface OptimisedKnowledgeGraph {
  readonly version: string;
  readonly generatedAt: string;
  readonly nodes: {
    readonly concepts: readonly ConceptNode[];
    readonly endpoints: readonly EndpointNode[];
    readonly schemas: readonly SchemaNode[];
    readonly links: readonly ExternalLinkNode[];
  };
  readonly edges: {
    readonly conceptRelations: readonly ConceptEdge[];
    readonly apiMappings: readonly ApiMappingEdge[];
    readonly schemaMappings: readonly SchemaMappingEdge[];
  };
  readonly crossReference: {
    readonly ontologySections: readonly string[];
    readonly note: string;
  };
}

interface ConceptNode {
  readonly id: string; // e.g., "c_subject"
  readonly label: string; // e.g., "Subject"
  readonly brief: string; // One-line description
}

interface EndpointNode {
  readonly id: string; // e.g., "ep_subjects"
  readonly path: string; // e.g., "/subjects"
  readonly method: 'GET';
}

interface SchemaNode {
  readonly id: string; // e.g., "s_AllSubjects"
  readonly name: string; // e.g., "AllSubjectsResponseSchema"
}

interface ExternalLinkNode {
  readonly id: string;
  readonly label: string;
  readonly url: string;
}

interface ConceptEdge {
  readonly from: string;
  readonly to: string;
  readonly rel: string; // Short relationship type
  readonly inferred?: true;
}

interface ApiMappingEdge {
  readonly concept: string;
  readonly endpoint: string;
  readonly direction: 'listedBy' | 'returnedBy' | 'usedBy';
}

interface SchemaMappingEdge {
  readonly endpoint?: string;
  readonly schema: string;
  readonly concept?: string;
  readonly direction: 'returns' | 'describes';
}
```

---

## 4. Example Optimised Data

### 4.1 Concepts (Sample)

```typescript
concepts: [
  { id: 'c_subject', label: 'Subject', brief: 'Curriculum subject (maths, history, etc.)' },
  { id: 'c_seq', label: 'Sequence', brief: 'Internal API grouping of units' },
  { id: 'c_prog', label: 'Programme', brief: 'User-facing curriculum pathway' },
  { id: 'c_unit', label: 'Unit', brief: 'Topic of study with lessons' },
  { id: 'c_lesson', label: 'Lesson', brief: 'Teaching session with objectives' },
  { id: 'c_thread', label: 'Thread', brief: 'Conceptual strand across years' },
  { id: 'c_ks', label: 'KeyStage', brief: 'Education stage (KS1-KS4)' },
  { id: 'c_year', label: 'YearGroup', brief: 'School year (Year 1-11)' },
  { id: 'c_phase', label: 'Phase', brief: 'Primary or secondary' },
  { id: 'c_quiz', label: 'Quiz', brief: 'Starter or exit quiz' },
  { id: 'c_asset', label: 'Asset', brief: 'Downloadable resource' },
  { id: 'c_transcript', label: 'Transcript', brief: 'Video transcript text' },
  // ... remaining concepts
];
```

### 4.2 Endpoints (Sample)

```typescript
endpoints: [
  { id: 'ep_subjects', path: '/subjects', method: 'GET' },
  { id: 'ep_subject', path: '/subjects/{subject}', method: 'GET' },
  { id: 'ep_ks_units', path: '/key-stages/{ks}/subject/{subj}/units', method: 'GET' },
  { id: 'ep_lesson_summary', path: '/lessons/{lesson}/summary', method: 'GET' },
  { id: 'ep_lesson_quiz', path: '/lessons/{lesson}/quiz', method: 'GET' },
  { id: 'ep_search', path: '/search/lessons', method: 'GET' },
  { id: 'ep_threads', path: '/threads', method: 'GET' },
  // ... remaining endpoints
];
```

### 4.3 Concept Relations (Sample)

```typescript
conceptRelations: [
  { from: 'c_subject', to: 'c_seq', rel: 'hasSequences' },
  { from: 'c_seq', to: 'c_unit', rel: 'includesUnits' },
  { from: 'c_unit', to: 'c_lesson', rel: 'containsLessons' },
  { from: 'c_lesson', to: 'c_quiz', rel: 'hasQuizzes' },
  { from: 'c_lesson', to: 'c_asset', rel: 'hasAssets' },
  { from: 'c_thread', to: 'c_unit', rel: 'linksUnits' },
  { from: 'c_ks', to: 'c_year', rel: 'includesYears' },
  { from: 'c_phase', to: 'c_ks', rel: 'includesKeyStages' },
  // ... remaining concept relations
];
```

### 4.4 API Mappings (Sample)

```typescript
apiMappings: [
  { concept: 'c_subject', endpoint: 'ep_subjects', direction: 'listedBy' },
  { concept: 'c_subject', endpoint: 'ep_subject', direction: 'returnedBy' },
  { concept: 'c_unit', endpoint: 'ep_ks_units', direction: 'returnedBy' },
  { concept: 'c_lesson', endpoint: 'ep_search', direction: 'returnedBy' },
  { concept: 'c_lesson', endpoint: 'ep_lesson_summary', direction: 'returnedBy' },
  { concept: 'c_quiz', endpoint: 'ep_lesson_quiz', direction: 'returnedBy' },
  { concept: 'c_thread', endpoint: 'ep_threads', direction: 'listedBy' },
  // ... remaining API mappings
];
```

### 4.5 Schema Mappings (Sample)

```typescript
schemaMappings: [
  { endpoint: 'ep_subjects', schema: 's_AllSubjects', direction: 'returns' },
  { endpoint: 'ep_subject', schema: 's_Subject', direction: 'returns' },
  { schema: 's_AllSubjects', concept: 'c_subject', direction: 'describes' },
  { schema: 's_AllSubjects', concept: 'c_seq', direction: 'describes' },
  { endpoint: 'ep_lesson_summary', schema: 's_LessonSummary', direction: 'returns' },
  { schema: 's_LessonSummary', concept: 'c_lesson', direction: 'describes' },
  // ... remaining schema mappings
];
```

---

## 5. Size Comparison

### Current Structure (~40KB)

```
89 nodes × ~300 bytes average = 26,700 bytes
118 edges × ~100 bytes average = 11,800 bytes
Metadata and formatting = ~1,500 bytes
Total ≈ 40,000 bytes
```

### Optimised Structure (~18KB)

```
~75 nodes × ~80 bytes average = 6,000 bytes (shorter IDs, brief descriptions)
~100 edges × ~50 bytes average = 5,000 bytes (shorter labels, structured)
Metadata and formatting = ~7,000 bytes (includes cross-reference)
Total ≈ 18,000 bytes
```

**Reduction**: ~55% smaller

---

## 6. Query Patterns Enabled

### 6.1 "What endpoints return Lesson data?"

```typescript
// Filter apiMappings where concept is c_lesson
const lessonEndpoints = graph.edges.apiMappings
  .filter((e) => e.concept === 'c_lesson')
  .map((e) => e.endpoint);
// Result: ['ep_search', 'ep_lesson_summary', 'ep_ks_lessons']
```

### 6.2 "What schema does GET /subjects return?"

```typescript
// Find endpoint, then find schema mapping
const endpoint = graph.nodes.endpoints.find((e) => e.path === '/subjects');
const schema = graph.edges.schemaMappings.find(
  (e) => e.endpoint === endpoint?.id && e.direction === 'returns',
);
// Result: { endpoint: 'ep_subjects', schema: 's_AllSubjects', direction: 'returns' }
```

### 6.3 "What concepts are related to Unit?"

```typescript
// Find all concept edges involving c_unit
const related = graph.edges.conceptRelations.filter(
  (e) => e.from === 'c_unit' || e.to === 'c_unit',
);
// Result: relationships to c_seq, c_lesson, c_thread, c_category, etc.
```

---

## 7. Alternative: Minimal Graph for Token Optimisation

For extreme token efficiency, a further-reduced "essential graph":

```typescript
export const essentialGraph = {
  // Core curriculum hierarchy only
  hierarchy: {
    Subject: ['Sequence'],
    Sequence: ['Unit'],
    Unit: ['Lesson'],
    Lesson: ['Quiz', 'Asset', 'Transcript'],
    KeyStage: ['YearGroup'],
    Phase: ['KeyStage'],
    Thread: ['Unit'],
  },

  // Key endpoint mappings only
  endpoints: {
    Subject: '/subjects',
    Lesson: '/lessons/{lesson}/summary',
    Unit: '/units/{unit}/summary',
    Search: '/search/lessons',
    Thread: '/threads',
  },

  // Cross-reference to ontology
  seeOntology: 'Call get-ontology for detailed concept definitions',
  seeFullGraph: 'Call get-knowledge-graph with detail=full for complete mappings',
} as const;
```

This "essential graph" would be ~2KB and could serve as the default response, with optional `detail` parameter for full graph.

---

## 8. Implementation Notes

### 8.1 Type Safety

Use `as const` and derive types:

```typescript
export const optimisedKnowledgeGraph = {
  // ... data
} as const;

export type KnowledgeGraph = typeof optimisedKnowledgeGraph;
export type ConceptId = KnowledgeGraph['nodes']['concepts'][number]['id'];
export type EndpointId = KnowledgeGraph['nodes']['endpoints'][number]['id'];
// etc.
```

### 8.2 Validation

At type-gen time, validate:

- All endpoint IDs exist in nodes
- All concept IDs exist in nodes
- All edge references are valid
- No orphan nodes (every node has at least one edge)

### 8.3 Tool Parameters (Optional)

If implementing queryable graph:

```typescript
GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    detail: {
      type: 'string',
      enum: ['essential', 'full'],
      description: 'Level of detail: essential (~2KB) or full (~18KB)',
      default: 'essential',
    },
    focus: {
      type: 'string',
      description: 'Concept to focus on (returns subgraph centered on this concept)',
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

## 10. Appendix: Full Node List (Optimised IDs)

### Concepts (28 → 28, renamed)

| Current                               | Optimised        | Label                       |
| ------------------------------------- | ---------------- | --------------------------- |
| concept_subject                       | c_subject        | Subject                     |
| concept_sequence                      | c_seq            | Sequence                    |
| concept_programme                     | c_prog           | Programme                   |
| concept_unit                          | c_unit           | Unit                        |
| concept_lesson                        | c_lesson         | Lesson                      |
| concept_thread                        | c_thread         | Thread                      |
| concept_keystage                      | c_ks             | KeyStage                    |
| concept_yeargroup                     | c_year           | YearGroup                   |
| concept_phase                         | c_phase          | Phase                       |
| concept_category                      | c_cat            | Category                    |
| concept_asset                         | c_asset          | Asset                       |
| concept_transcript                    | c_transcript     | Transcript                  |
| concept_quiz                          | c_quiz           | Quiz                        |
| concept_question                      | c_question       | Question                    |
| concept_answer                        | c_answer         | Answer                      |
| concept_content_guidance              | c_guidance       | ContentGuidance             |
| concept_supervision_level             | c_supervision    | SupervisionLevel            |
| concept_educational_metadata          | c_edumeta        | EducationalMetadata         |
| concept_exam_subject                  | c_examsubj       | ExamSubject                 |
| concept_tier                          | c_tier           | Tier                        |
| concept_pathway                       | c_pathway        | Pathway                     |
| concept_exam_board                    | c_examboard      | ExamBoard                   |
| concept_rate_limit                    | c_ratelimit      | RateLimitStatus             |
| concept_changelog_entry               | c_changelog      | ChangelogEntry              |
| concept_national_curriculum_statement | c_ncstatement    | NationalCurriculumStatement |
| concept_prior_knowledge_requirement   | c_priorknowledge | PriorKnowledgeRequirement   |
| concept_keyword                       | c_keyword        | LessonKeyword               |
| concept_misconception                 | c_misconception  | Misconception               |

### SourceDocs (5 → 0, removed)

All removed — research provenance not needed.

### ExternalLinks (5 → 5, renamed)

| Current                    | Optimised      |
| -------------------------- | -------------- |
| link_oak_api_overview      | x_api_overview |
| link_oak_swagger_json      | x_swagger      |
| link_oak_glossary          | x_glossary     |
| link_oak_ontology_diagrams | x_diagrams     |
| link_oak_main_site         | x_oak          |

### Endpoints (27 → 27, renamed)

All renamed from `ep_{path}_get` to `ep_{path}`.

### Schemas (24 → 24, renamed)

All renamed from `schema_{Name}` to `s_{Name}`.
