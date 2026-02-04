/* eslint-disable max-lines -- this is a static knowledge graph data file, disabling to maintain readability */
/**
 * Oak Curriculum Knowledge Graph (schema-level) — A Property Graph
 *
 * Captures concept TYPE relationships for agent reasoning.
 * This is a static data structure — not searchable, not instance-level.
 *
 * RELATIONSHIP TO ONTOLOGY:
 * This property graph is a SUBSET of what's in ontology-data.ts, expressed as explicit
 * nodes and edges. Almost everything here could be inferred from the ontology's narrative
 * descriptions, but the graph format is useful for:
 * - Explicit relationship direction and typing
 * - Graph-based traversal reasoning
 * - Compact structural overview
 *
 * WHAT THIS ADDS (not duplicated from ontology):
 * - Explicit edge labeling with from/to/rel structure
 * - "inferred" markers distinguishing schema-explicit vs domain-inferred relationships
 * - Category groupings (structure, content, context, taxonomy, ks4, metadata)
 *
 * WHAT ONTOLOGY HAS (this does not):
 * - Rich definitions and examples
 * - Workflow guidance
 * - Structural patterns with detection logic
 * - UK education context
 * - Canonical URL patterns
 *
 * FUTURE CONSIDERATION:
 * Consider merging this into ontology-data.ts as an embedded `schema` section,
 * eliminating the need for two separate files. See 20-ontology-and-graphs-api-proposal.md.
 *
 * Use `get-ontology` for rich definitions and usage guidance.
 *
 * @see knowledge-graph-analysis-synthesis.md for design rationale
 * @see optimised-graph-proposal.md for target structure
 * @see 20-ontology-and-graphs-api-proposal.md for API consolidation proposal
 *
 * @remarks This is authored domain knowledge that complements the OpenAPI schema.
 * The graph captures relationships that are implied but not explicit in the API.
 */

export const conceptGraph = {
  version: '1.0.0',
  purpose:
    'A structural representation of curriculum concept TYPE relationships (schema-level). This graph captures domain relationships — how entity types connect conceptually. Use this to understand the curriculum data model.',
  usage: {
    whyThisExists:
      'The graph captures relationships that are implied but not explicit in the API schema. Understanding these relationships helps AI agents reason about curriculum queries.',
    howToUse:
      'Nodes represent entity TYPES (not instances). Edges show how types relate. Inferred edges (marked inferred: true) are domain knowledge not explicit in the API.',
    combinedWith:
      'Call get-ontology for rich definitions, enumerated values, workflow guidance, and structural patterns. Together they provide ~5K tokens of domain context.',
  },
  statistics: {
    conceptNodes:
      '~28 concept nodes organised by category (structure, content, context, taxonomy, ks4, metadata)',
    edges: '~45 edges showing relationships (explicit from API + inferred from domain knowledge)',
    inferredEdgesNote:
      "Edges with 'inferred: true' are domain relationships implied but not explicit in the API",
  },

  conceptsDescription:
    'Concept nodes representing curriculum entity types. Each concept has an id, label, brief description, and category. Categories group related concepts: structure (core hierarchy), content (within lesson), context (scoping), taxonomy (cross-cutting), ks4 (KS4 complexity), metadata (educational annotations).',
  concepts: [
    // ===== STRUCTURE (core hierarchy) =====
    {
      id: 'subject',
      label: 'Subject',
      brief: 'Curriculum subject area (maths, history, etc.)',
      category: 'structure',
    },
    {
      id: 'sequence',
      label: 'Sequence',
      brief: 'Internal API grouping of units across years',
      category: 'structure',
    },
    {
      id: 'unit',
      label: 'Unit',
      brief: 'Topic of study with ordered lessons',
      category: 'structure',
    },
    {
      id: 'lesson',
      label: 'Lesson',
      brief: 'Teaching session with up to 8 optional components',
      category: 'structure',
    },

    // ===== CONTENT (within lesson) =====
    {
      id: 'quiz',
      label: 'Quiz',
      brief: 'Starter or exit assessment',
      category: 'content',
    },
    {
      id: 'question',
      label: 'Question',
      brief: 'Quiz question with answers',
      category: 'content',
    },
    {
      id: 'answer',
      label: 'Answer',
      brief: 'Correct answer or distractor',
      category: 'content',
    },
    {
      id: 'asset',
      label: 'Asset',
      brief: 'Downloadable resource (slides, worksheet)',
      category: 'content',
    },
    {
      id: 'transcript',
      label: 'Transcript',
      brief: 'Video transcript text',
      category: 'content',
    },

    // ===== CONTEXT (scoping) =====
    {
      id: 'phase',
      label: 'Phase',
      brief: 'Primary or secondary',
      category: 'context',
    },
    {
      id: 'keystage',
      label: 'KeyStage',
      brief: 'KS1-KS4 formal education stage',
      category: 'context',
    },
    {
      id: 'yeargroup',
      label: 'YearGroup',
      brief: 'Year 1-11 school year',
      category: 'context',
    },

    // ===== TAXONOMY (cross-cutting) =====
    {
      id: 'thread',
      label: 'Thread',
      brief: 'Conceptual strand linking units across years',
      category: 'taxonomy',
    },
    {
      id: 'category',
      label: 'Category',
      brief: 'Subject-specific grouping of units',
      category: 'taxonomy',
    },

    // ===== KS4 COMPLEXITY =====
    {
      id: 'programme',
      label: 'Programme',
      brief: 'User-facing curriculum pathway (derived view)',
      category: 'ks4',
    },
    {
      id: 'tier',
      label: 'Tier',
      brief: 'Foundation or higher difficulty level',
      category: 'ks4',
    },
    {
      id: 'pathway',
      label: 'Pathway',
      brief: 'Core or GCSE route through KS4',
      category: 'ks4',
    },
    {
      id: 'examboard',
      label: 'ExamBoard',
      brief: 'AQA, OCR, Edexcel, Eduqas',
      category: 'ks4',
    },
    {
      id: 'examsubject',
      label: 'ExamSubject',
      brief: 'Biology, Chemistry, Physics (KS4 science)',
      category: 'ks4',
    },

    // ===== EDUCATIONAL METADATA =====
    {
      id: 'keyword',
      label: 'Keyword',
      brief: 'Critical vocabulary for the lesson',
      category: 'metadata',
    },
    {
      id: 'misconception',
      label: 'Misconception',
      brief: 'Common misunderstanding to address',
      category: 'metadata',
    },
    {
      id: 'contentguidance',
      label: 'ContentGuidance',
      brief: 'Sensitive content advisory',
      category: 'metadata',
    },
    {
      id: 'supervisionlevel',
      label: 'SupervisionLevel',
      brief: 'Adult supervision requirement level',
      category: 'metadata',
    },
    {
      id: 'priorknowledge',
      label: 'PriorKnowledge',
      brief: 'Prerequisite understanding required',
      category: 'metadata',
    },
    {
      id: 'nationalcurriculum',
      label: 'NationalCurriculumStatement',
      brief: 'NC coverage alignment',
      category: 'metadata',
    },
    {
      id: 'keylearningpoint',
      label: 'KeyLearningPoint',
      brief: 'Main knowledge outcome of lesson',
      category: 'metadata',
    },
    {
      id: 'teachertip',
      label: 'TeacherTip',
      brief: 'Pedagogical guidance for delivery',
      category: 'metadata',
    },
  ],

  edgesDescription: {
    purpose:
      'Edges represent relationships between concepts. Each edge has a from node, to node, and relationship type.',
    explicitVsInferred:
      "Explicit edges come from the API schema/glossary (documented). Inferred edges (marked 'inferred: true') capture implicit domain knowledge that helps AI agents understand the curriculum.",
    readingEdges: "Read as: 'from' → 'rel' → 'to'. Example: subject → hasSequences → sequence",
  },
  edges: [
    // ===== EXPLICIT EDGES (from schema/glossary) =====

    // Core hierarchy
    { from: 'subject', to: 'sequence', rel: 'hasSequences' },
    { from: 'sequence', to: 'unit', rel: 'containsUnits' },
    { from: 'unit', to: 'lesson', rel: 'containsLessons' },

    // Content hierarchy
    { from: 'lesson', to: 'quiz', rel: 'hasQuizzes' },
    { from: 'quiz', to: 'question', rel: 'containsQuestions' },
    { from: 'question', to: 'answer', rel: 'hasAnswers' },
    { from: 'lesson', to: 'asset', rel: 'hasAssets' },
    { from: 'lesson', to: 'transcript', rel: 'hasTranscript' },

    // Context relationships
    { from: 'phase', to: 'keystage', rel: 'includesKeyStages' },
    { from: 'keystage', to: 'yeargroup', rel: 'includesYears' },
    { from: 'subject', to: 'keystage', rel: 'availableAt' },

    // Taxonomy relationships
    { from: 'thread', to: 'unit', rel: 'linksAcrossYears' },
    { from: 'unit', to: 'thread', rel: 'taggedWith' },
    { from: 'unit', to: 'category', rel: 'taggedWith' },

    // Educational metadata (explicit in API)
    { from: 'lesson', to: 'keyword', rel: 'hasKeywords' },
    { from: 'lesson', to: 'misconception', rel: 'addressesMisconceptions' },
    { from: 'lesson', to: 'contentguidance', rel: 'hasGuidance' },
    { from: 'contentguidance', to: 'supervisionlevel', rel: 'requiresSupervision' },
    { from: 'unit', to: 'priorknowledge', rel: 'requiresPriorKnowledge' },
    { from: 'unit', to: 'nationalcurriculum', rel: 'covers' },
    { from: 'lesson', to: 'keylearningpoint', rel: 'delivers' },
    { from: 'lesson', to: 'teachertip', rel: 'hasTips' },

    // ===== INFERRED EDGES (implicit but valuable) =====

    // Unit context (always present but not explicit edges in API)
    { from: 'unit', to: 'subject', rel: 'belongsTo', inferred: true },
    { from: 'unit', to: 'keystage', rel: 'scopedTo', inferred: true },
    { from: 'unit', to: 'yeargroup', rel: 'targets', inferred: true },
    { from: 'unit', to: 'phase', rel: 'belongsTo', inferred: true },

    // Lesson context (inherited from unit)
    { from: 'lesson', to: 'subject', rel: 'belongsTo', inferred: true },
    { from: 'lesson', to: 'keystage', rel: 'scopedTo', inferred: true },
    { from: 'lesson', to: 'unit', rel: 'belongsTo', inferred: true },

    // Programme (derived concept, not API entity)
    { from: 'programme', to: 'sequence', rel: 'derivedFrom', inferred: true },
    { from: 'programme', to: 'subject', rel: 'about', inferred: true },
    { from: 'programme', to: 'keystage', rel: 'scopedTo', inferred: true },
    { from: 'programme', to: 'yeargroup', rel: 'targets', inferred: true },
    { from: 'programme', to: 'unit', rel: 'containsUnits', inferred: true },
    { from: 'programme', to: 'tier', rel: 'usesFactorWhen', inferred: true },
    { from: 'programme', to: 'pathway', rel: 'usesFactorWhen', inferred: true },
    { from: 'programme', to: 'examboard', rel: 'usesFactorWhen', inferred: true },

    // KS4 branching (conditional, subject-specific)
    { from: 'sequence', to: 'examsubject', rel: 'branchesInto', inferred: true },
    { from: 'sequence', to: 'tier', rel: 'hasTiers', inferred: true },
    { from: 'examsubject', to: 'tier', rel: 'hasTiers', inferred: true },
    { from: 'examsubject', to: 'unit', rel: 'containsUnits', inferred: true },
    { from: 'tier', to: 'unit', rel: 'containsUnits', inferred: true },
  ],

  /**
   * Cross-reference to the ontology tool for rich definitions.
   *
   * This property graph defines entity TYPES and relationship TYPES.
   * For structural patterns (how to traverse the API for different subjects/keystages),
   * see the ontology's `structuralPatterns` section.
   */
  seeOntology:
    'Call get-ontology for rich definitions, enumerated values, workflow guidance, and structural patterns for API traversal',
} as const;

/**
 * Type representing the complete knowledge graph structure.
 * Derived from the const data to ensure type safety.
 */
export type ConceptGraph = typeof conceptGraph;

/**
 * Type representing valid concept IDs in the graph.
 * Useful for type-safe edge references.
 */
export type ConceptId = ConceptGraph['concepts'][number]['id'];

/**
 * Type representing valid concept categories.
 */
export type ConceptCategory = ConceptGraph['concepts'][number]['category'];

/**
 * Type representing an edge in the knowledge graph.
 */
export type ConceptEdge = ConceptGraph['edges'][number];
