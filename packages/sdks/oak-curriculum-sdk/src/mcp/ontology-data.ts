/**
 * Static curriculum ontology data for the POC.
 *
 * This module exports the pre-authored curriculum domain model as a constant.
 * It's consumed by the curriculum-model-data module to compose the combined
 * orientation response for the get-curriculum-model tool.
 *
 * @remarks This is a simple ontology for the public API data specifically. For the complete, official Oak ontology see https://github.com/oaknational/oak-curriculum-ontology
 */

import { conceptGraph } from '@oaknational/sdk-codegen/vocab';
import { threadProgressionGraph } from '@oaknational/sdk-codegen/vocab-data';
import { toolGuidanceData } from './tool-guidance-data.js';

/**
 * Curriculum ontology data describing the Oak curriculum domain model.
 *
 * Includes key stages, subjects, entity hierarchy, threads, and tool usage guidance.
 */
export const ontologyData = {
  version: '0.1.0-poc',
  generatedAt: '2025-11-27T00:00:00Z',
  purpose:
    'This ontology describes the Oak National Academy curriculum domain model. It provides context for AI agents to understand the structure of UK education content, including key stages, subjects, entity hierarchies, threads, and tool usage guidance.',
  notice:
    'This is a static POC. A future version will generate this data from the OpenAPI schema at compile time.',
  officialDocs: 'https://open-api.thenational.academy/docs/about-oaks-data/glossary',
  relatedResources: {
    threadProgressions:
      'Call get-thread-progressions for ordered unit sequences within curriculum threads (instance data)',
    priorKnowledgeGraph:
      'Call get-prior-knowledge-graph for unit dependencies and prior knowledge requirements',
  },

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
      "Threads show how ideas BUILD over time — they are the pedagogical backbone of Oak's curriculum. Understanding threads enables powerful queries like 'what comes before this topic?' and 'how does this concept develop from Year 1 to Year 11?'",
    countSummary: `${String(threadProgressionGraph.stats.threadCount)} threads across ${String(threadProgressionGraph.stats.subjectsCovered.length)} subjects, connecting units into learning progressions`,
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

  /**
   * Structural patterns in the curriculum data.
   */
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
        detection: 'Default when no tiers, examSubjects, or unitOptions present',
      },
      {
        id: 'tier-variants',
        description: 'Year response includes tiers[] at top level',
        appliesTo: ['maths KS4'],
        responseShape: '{ data: [{ year, tiers: [{ tierSlug, units }] }] }',
        detection: "Check for 'tiers' key in year response",
        note: 'Maths KS4 only. Lessons appear in both Foundation and Higher.',
      },
      {
        id: 'exam-subject-split',
        description: 'Science KS4 splits into Biology/Chemistry/Physics/Combined',
        appliesTo: ['science KS4'],
        responseShape: '{ data: [{ year, examSubjects: [{ examSubjectSlug, tiers: [...] }] }] }',
        detection: "Check for 'examSubjects' key in year response",
        critical: '/key-stages/ks4/subject/science/lessons returns EMPTY. Use sequences endpoint.',
      },
      {
        id: 'exam-board-variants',
        description: 'Subject has multiple sequences for different exam boards',
        appliesTo: [
          'citizenship',
          'computing',
          'english',
          'french',
          'geography',
          'german',
          'history',
          'music',
          'physical-education',
          'religious-education',
          'science',
          'spanish',
        ],
        detection: 'Subject has multiple ks4Options in /subjects/{subject} response',
        note: 'Science has exam boards AND exam subjects AND tiers (all three)',
      },
      {
        id: 'unit-options',
        description: 'Units have unitOptions[] with alternative content choices',
        appliesTo: [
          'art KS4',
          'design-technology KS4',
          'english KS4',
          'geography KS4',
          'history KS4',
          'religious-education KS4',
        ],
        responseShape: '{ units: [{ unitTitle, unitOptions: [{ unitSlug, unitTitle }] }] }',
        detection: "Check for 'unitOptions' key in unit response",
        note: 'Each unit option is a separate unit with its own lessons',
      },
      {
        id: 'no-ks4',
        description: 'Subject has no KS4 content',
        appliesTo: ['cooking-nutrition'],
        detection: 'Secondary sequence only covers years 7-9',
      },
    ],
    keyStageGaps: {
      description: 'Not all subjects cover all key stages',
      gaps: [
        { subjects: ['french', 'spanish'], gap: 'No KS1 (start at Year 3)' },
        { subjects: ['german', 'citizenship'], gap: 'No primary content' },
        { subjects: ['cooking-nutrition'], gap: 'No KS4 content' },
        { subjects: ['rshe-pshe'], gap: 'No bulk download file (API only)' },
      ],
    },
    combinationMatrix: {
      description:
        'Patterns can combine. Science KS4 has all three: exam boards + exam subjects + tiers',
      examples: [
        {
          subject: 'science',
          patterns: ['exam-board-variants', 'exam-subject-split', 'tier-variants'],
        },
        { subject: 'english', patterns: ['exam-board-variants', 'unit-options'] },
        { subject: 'geography', patterns: ['exam-board-variants', 'unit-options'] },
        { subject: 'maths', patterns: ['tier-variants'] },
      ],
    },
  },

  entityHierarchy: {
    description: 'Curriculum content is organised in a hierarchy from Subject down to Lesson',
    traversalNote:
      'Traversal typically starts from sequences (not subjects) because sequences contain the structural metadata (tiers, exam boards, exam subjects) needed for complete data retrieval. See structuralPatterns for details.',
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

  oakUrls: {
    description: 'URL patterns for linking to Oak Web Application',
    patterns: {
      lesson: 'https://www.thenational.academy/teachers/lessons/{lessonSlug}',
      unit: 'https://www.thenational.academy/teachers/curriculum/{sequenceSlug}/units/{unitSlug}',
      programme: 'https://www.thenational.academy/teachers/programmes/{programmeSlug}',
      threadFilter:
        'https://www.thenational.academy/teachers/curriculum/{subject}-{phase}/units?threads={threadSlug}',
    },
    examples: [
      'https://www.thenational.academy/teachers/lessons/add-fractions-with-the-same-denominator',
      'https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-foundation-aqa',
      'https://www.thenational.academy/teachers/curriculum/maths-primary/units?threads=geometry-and-measure',
    ],
  },

  /**
   * Domain synonyms for curriculum terminology.
   *
   * IMPORTANT: This synonyms data serves a DIFFERENT purpose than what LLMs need.
   *
   * What this provides:
   * - Term normalisation mappings (e.g., "PE" → "physical-education")
   * - Used by Search app for Elasticsearch synonym expansion
   *
   * What LLMs DON'T need from this:
   * - LLMs handle linguistic variation naturally (they don't need "maths" → "maths")
   * - LLMs understand abbreviations, colloquialisms, and typos without explicit mappings
   *
   * What LLMs WOULD benefit from instead:
   * - Domain-specific DEFINITIONS (what does "tier" mean in UK education?)
   * - Official Oak terminology (canonical names for concepts)
   * - Contextual usage notes (when does this term apply?)
   *
   * FUTURE: Consider replacing this with a glossary structure containing:
   * - term, definition, aliases, context, officialSource
   * The vocabulary-graph-data.ts already provides term definitions - that's closer to what's needed.
   *
   * @see ./synonyms/index.ts for individual synonym modules
   * @see 22-ontology-and-graphs-api-proposal.md for planned refactoring
   * @remarks Use `buildElasticsearchSynonyms()` to export ES-compatible format for search app.
   */
  // Removing until review.
  // synonyms: {
  //   description: 'Alternative terms users might use. Map to canonical slugs when calling tools.',
  //   note: 'This is not exhaustive - just examples and suggestions. Use your language understanding to recognise other variations, abbreviations, and natural phrasings.',
  //   ...synonymsData,
  // },

  /**
   * Property graph of curriculum concept TYPE relationships.
   *
   * Captures the structural relationships between entity types in the
   * curriculum domain model. Concepts represent entity TYPES (not instances),
   * edges show how types relate. Inferred edges (marked `inferred: true`)
   * are domain knowledge not explicit in the API.
   *
   * Categories: structure (core hierarchy), content (within lesson),
   * context (scoping), taxonomy (cross-cutting), ks4 (KS4 complexity),
   * metadata (educational annotations).
   */
  propertyGraph: conceptGraph,
} as const;

/**
 * Type representing the complete ontology data structure.
 * Derived from the const data to ensure type safety.
 */
export type OntologyData = typeof ontologyData;
