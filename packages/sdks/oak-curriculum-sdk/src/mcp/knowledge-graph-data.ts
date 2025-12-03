/* eslint-disable max-lines -- this is a static knowledge graph data file, disabling to maintain readability */
/**
 * Oak Curriculum Knowledge Graph (schema-level)
 *
 * Captures concept TYPE relationships for agent reasoning.
 * This is a static data structure — not searchable, not instance-level.
 *
 * Use `get-ontology` for rich definitions and usage guidance.
 *
 * @see knowledge-graph-analysis-synthesis.md for design rationale
 * @see optimised-graph-proposal.md for target structure
 *
 * @remarks This is authored domain knowledge that complements the OpenAPI schema.
 * The graph captures relationships that are implied but not explicit in the API.
 *
 * @module knowledge-graph-data
 */

/**
 * Oak Curriculum Concept Graph
 *
 * A structural representation of curriculum concept TYPE relationships.
 * The graph captures domain relationships, NOT API mappings.
 * Agents learn about endpoints from `tools/list`.
 *
 * @remarks
 * - ~28 concept nodes organised by category
 * - ~45 edges showing relationships (explicit + inferred)
 * - Inferred edges are marked with `inferred: true`
 * - Combined with ontology provides ~5K tokens of domain context
 */
export const conceptGraph = {
  /** Semantic version of the knowledge graph structure */
  version: '1.0.0',

  /**
   * Concept nodes representing curriculum entity types.
   * Each concept has an id, label, brief description, and category.
   */
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
      brief: 'Teaching session with 8 standard components',
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

  /**
   * Edges representing relationships between concepts.
   * Explicit edges come from API schema/glossary.
   * Inferred edges capture implicit domain knowledge.
   */
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
   */
  seeOntology: 'Call get-ontology for rich definitions, enumerated values, and workflow guidance',
} as const;

/**
 * Type representing the complete concept graph structure.
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
 * Type representing an edge in the concept graph.
 */
export type ConceptEdge = ConceptGraph['edges'][number];
