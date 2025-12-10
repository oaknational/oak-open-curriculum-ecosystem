/* eslint-disable max-lines -- static ontology data file, structure requires length */
/**
 * Static curriculum ontology data for the POC.
 *
 * This module exports the pre-authored curriculum domain model as a constant.
 * It's imported by the aggregated-ontology tool to provide curriculum context
 * to AI agents.
 *
 * @remarks This is a POC implementation. See 02-curriculum-ontology-resource-plan.md
 * for the full schema-derived implementation.
 */

import { synonymsData } from './synonyms/index.js';
import { toolGuidanceData } from './tool-guidance-data.js';

/**
 * Curriculum ontology data describing the Oak curriculum domain model.
 *
 * Includes key stages, subjects, entity hierarchy, threads, and tool usage guidance.
 */
export const ontologyData = {
  version: '0.1.0-poc',
  generatedAt: '2025-11-27T00:00:00Z',
  notice:
    'This is a static POC. See 02-curriculum-ontology-resource-plan.md for full implementation.',
  officialDocs: 'https://open-api.thenational.academy/docs/about-oaks-data/glossary',

  curriculumStructure: {
    keyStages: [
      {
        slug: 'ks1',
        name: 'Key Stage 1',
        ageRange: '5-7',
        years: [1, 2],
        phase: 'primary',
        description: 'Foundation stage covering basic literacy and numeracy',
      },
      {
        slug: 'ks2',
        name: 'Key Stage 2',
        ageRange: '7-11',
        years: [3, 4, 5, 6],
        phase: 'primary',
        description: 'Primary education building on KS1 foundations',
      },
      {
        slug: 'ks3',
        name: 'Key Stage 3',
        ageRange: '11-14',
        years: [7, 8, 9],
        phase: 'secondary',
        description: 'Lower secondary education',
      },
      {
        slug: 'ks4',
        name: 'Key Stage 4',
        ageRange: '14-16',
        years: [10, 11],
        phase: 'secondary',
        description:
          'GCSE preparation years - has additional programme factors (tiers, exam boards)',
      },
    ],
    phases: [
      {
        slug: 'primary',
        name: 'Primary',
        keyStages: ['ks1', 'ks2'],
        years: [1, 2, 3, 4, 5, 6],
      },
      {
        slug: 'secondary',
        name: 'Secondary',
        keyStages: ['ks3', 'ks4'],
        years: [7, 8, 9, 10, 11],
      },
    ],
    subjects: [
      { slug: 'maths', name: 'Mathematics', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
      { slug: 'english', name: 'English', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
      {
        slug: 'science',
        name: 'Science',
        keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
        hasExamSubjects: true,
      },
      { slug: 'history', name: 'History', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
      { slug: 'geography', name: 'Geography', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
      { slug: 'art', name: 'Art', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
      { slug: 'music', name: 'Music', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
      {
        slug: 'physical-education',
        name: 'Physical Education',
        keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
      },
      { slug: 'computing', name: 'Computing', keyStages: ['ks1', 'ks2', 'ks3', 'ks4'] },
      {
        slug: 'religious-education',
        name: 'Religious Education',
        keyStages: ['ks1', 'ks2', 'ks3'],
      },
      { slug: 'french', name: 'French', keyStages: ['ks2', 'ks3', 'ks4'] },
      { slug: 'spanish', name: 'Spanish', keyStages: ['ks2', 'ks3', 'ks4'] },
      { slug: 'german', name: 'German', keyStages: ['ks3', 'ks4'] },
    ],
  },

  threads: {
    definition:
      'An attribute assigned to units that groups together units across the curriculum building a common body of knowledge. Threads are important for making vertical connections across year groups in each subject.',
    importance:
      "Threads show how ideas BUILD over time - they are the pedagogical backbone of Oak's curriculum",
    characteristics: [
      'Programme-agnostic: A single thread spans multiple programmes, key stages, and years',
      'Ordered: Units within a thread have unitOrder showing conceptual progression',
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
        progression: '2D shapes → Angles → Area/perimeter → Trigonometry',
      },
      {
        slug: 'bq01-biology-what-are-living-things-and-what-are-they-made-of',
        subject: 'science',
        spans: 'KS1 → KS4',
        unitCount: 32,
        progression: 'Observable features → Body systems → Cells → Molecular biology',
      },
    ],
    toolUsage: {
      listThreads: 'GET /threads - List all conceptual progression strands',
      getThreadUnits: 'GET /threads/{threadSlug}/units - See how a concept develops across years',
      filterByThread: 'Use thread filtering on Oak website: ?threads=geometry-and-measure',
    },
  },

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

  ks4Complexity: {
    note: 'KS4 has additional programme factors not present in KS1-3',
    programmeFactors: {
      tier: {
        values: ['foundation', 'higher'],
        appliesTo: ['maths', 'science'],
        description: 'Categorisation based on exam paper difficulty level',
      },
      examBoard: {
        values: ['aqa', 'ocr', 'edexcel', 'eduqas', 'edexcelb'],
        description: 'Official body that sets and grades qualifications',
      },
      examSubject: {
        values: ['biology', 'chemistry', 'physics', 'combined-science'],
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

  entityHierarchy: {
    description: 'Curriculum content is organised in a hierarchy',
    levels: [
      {
        entity: 'Subject',
        example: 'maths',
        contains: 'Sequences (API) / Programmes (user-facing)',
        schemaRef: 'AllSubjectsResponseSchema',
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
        example: 'fractions-year-4',
        contains: 'Lessons (typically 4-8 per unit)',
        schemaRef: 'UnitSummaryResponseSchema',
      },
      {
        entity: 'Lesson',
        example: 'adding-fractions-with-same-denominator',
        contains:
          'Up to 8 OPTIONAL components: curriculum info (always), slide deck, video, transcript, starter quiz, exit quiz, worksheet, additional materials',
        note: 'Not all lessons have all components - check availability before use',
        schemaRef: 'LessonSummaryResponseSchema',
      },
    ],
  },

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
        name: 'Additional materials',
        description: 'Supplementary resources',
        tool: 'get-lessons-assets',
        availability: 'optional',
      },
    ],
  },

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

  /**
   * Workflows imported from tool-guidance-data.ts (single source of truth).
   * These help AI agents understand how to combine tools for common tasks.
   */
  workflows: toolGuidanceData.workflows,

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
        example: 'unit:fractions-year-4',
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

  ukEducationContext: {
    description: 'Context about the UK education system for AI agents',
    notes: [
      'Key Stages are UK-specific age groupings defined by the National Curriculum',
      'Year 1 = age 5-6 (first year of primary school)',
      'Year 6 = age 10-11 (final year of primary, SATs exams)',
      'Year 7 = age 11-12 (first year of secondary school)',
      'Year 11 = age 15-16 (final year of secondary, GCSE exams)',
      'Primary = Years 1-6 (KS1 + KS2)',
      'Secondary = Years 7-11 (KS3 + KS4)',
      'Oak lessons align with the National Curriculum for England',
      'GCSE = General Certificate of Secondary Education (KS4 qualification)',
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

  canonicalUrls: {
    description: 'URL patterns for linking to Oak Web Application',
    patterns: {
      lesson: 'https://www.thenational.academy/teachers/lessons/{lessonSlug}',
      unit: 'https://www.thenational.academy/teachers/units/{unitSlug}',
      programme: 'https://www.thenational.academy/teachers/programmes/{programmeSlug}',
      threadFilter:
        'https://www.thenational.academy/teachers/curriculum/{subject}-{phase}/units?threads={threadSlug}',
    },
    examples: [
      'https://www.thenational.academy/teachers/lessons/adding-fractions-with-same-denominator',
      'https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-foundation-aqa',
      'https://www.thenational.academy/teachers/curriculum/maths-primary/units?threads=geometry-and-measure',
    ],
  },

  /**
   * Cross-reference to the knowledge graph for concept relationships.
   */
  seeAlso: 'Call get-knowledge-graph for concept TYPE relationships and domain structure',

  /**
   * Domain synonyms for curriculum terminology.
   *
   * Imported from the synonyms module - the SINGLE SOURCE OF TRUTH for synonyms used across:
   * - MCP tools (natural language understanding)
   * - Search app (Elasticsearch synonym expansion)
   * - Any other consumer needing term normalisation
   *
   * @see ./synonyms/index.ts for individual synonym modules
   * @remarks Use `buildElasticsearchSynonyms()` to export ES-compatible format.
   */
  synonyms: {
    description: 'Alternative terms users might use. Map to canonical slugs when calling tools.',
    note: 'This is not exhaustive - just examples and suggestions. Use your language understanding to recognise other variations, abbreviations, and natural phrasings.',
    ...synonymsData,
  },
} as const;

/**
 * Type representing the complete ontology data structure.
 * Derived from the const data to ensure type safety.
 */
export type OntologyData = typeof ontologyData;
