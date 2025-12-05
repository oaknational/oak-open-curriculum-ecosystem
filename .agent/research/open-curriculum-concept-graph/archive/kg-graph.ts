// Oak Curriculum Knowledge Graph (auto-generated)
// This file defines a simple graph structure linking curriculum concepts,
// API endpoints, response schemas and external documentation links.

export type NodeType = 'Concept' | 'Endpoint' | 'Schema' | 'ExternalLink' | 'SourceDoc';

export interface KGNode {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  externalUrl?: string;
}

export interface KGEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  inferred?: boolean;
}

export interface KnowledgeGraph {
  nodes: KGNode[];
  edges: KGEdge[];
}

export const kgGraph: KnowledgeGraph = {
  nodes: [
    {
      id: 'concept_subject',
      type: 'Concept',
      label: 'Subject',
      description:
        'A distinct curriculum subject (e.g. maths, history) that spans key stages and year groups.',
    },
    {
      id: 'concept_programme',
      type: 'Concept',
      label: 'Programme',
      description:
        'A user-facing sequence of units for a specific subject and context (year, tier, pathway, exam board, etc.).',
    },
    {
      id: 'concept_sequence',
      type: 'Concept',
      label: 'Sequence',
      description:
        'An internal grouping of units used by the API for storage and querying; a single sequence can generate multiple programmes.',
    },
    {
      id: 'concept_thread',
      type: 'Concept',
      label: 'Thread',
      description:
        'A conceptual strand that links related units across years and key stages to show vertical progression.',
    },
    {
      id: 'concept_phase',
      type: 'Concept',
      label: 'Phase',
      description: 'A broad school phase such as primary or secondary that groups key stages.',
    },
    {
      id: 'concept_keystage',
      type: 'Concept',
      label: 'KeyStage',
      description: 'A formal stage of education (KS1–KS4).',
    },
    {
      id: 'concept_yeargroup',
      type: 'Concept',
      label: 'YearGroup',
      description: 'A school year (Year 1–11) within a key stage.',
    },
    {
      id: 'concept_unit',
      type: 'Concept',
      label: 'Unit',
      description:
        'A topic of study made up of a sequence of lessons, typically taught over several weeks.',
    },
    {
      id: 'concept_category',
      type: 'Concept',
      label: 'Category',
      description:
        'A subject-specific grouping used to classify units (e.g. biology, chemistry, physics in science).',
    },
    {
      id: 'concept_lesson',
      type: 'Concept',
      label: 'Lesson',
      description:
        'An individual teaching session with defined objectives, resources, and assessment.',
    },
    {
      id: 'concept_asset',
      type: 'Concept',
      label: 'Asset',
      description:
        'A downloadable or viewable resource for a lesson (slide deck, video, worksheet, quiz files, etc.).',
    },
    {
      id: 'concept_transcript',
      type: 'Concept',
      label: 'Transcript',
      description: 'The textual transcript and caption file content for a lesson video.',
    },
    {
      id: 'concept_quiz',
      type: 'Concept',
      label: 'Quiz',
      description:
        'A starter or exit quiz made up of questions and answers assessing understanding.',
    },
    {
      id: 'concept_question',
      type: 'Concept',
      label: 'Question',
      description:
        'An individual quiz question (multiple-choice, ordering, matching, short-answer, etc.).',
    },
    {
      id: 'concept_answer',
      type: 'Concept',
      label: 'Answer',
      description: 'An answer option for a quiz question, marked as correct or a distractor.',
    },
    {
      id: 'concept_content_guidance',
      type: 'Concept',
      label: 'ContentGuidance',
      description:
        'Advisory information indicating that a lesson contains potentially sensitive content.',
    },
    {
      id: 'concept_supervision_level',
      type: 'Concept',
      label: 'SupervisionLevel',
      description:
        'A level indicating how much adult supervision is recommended or required for a lesson.',
    },
    {
      id: 'concept_educational_metadata',
      type: 'Concept',
      label: 'EducationalMetadata',
      description:
        'Fields that describe educational context such as prior knowledge, curriculum statements, keywords and misconceptions.',
    },
    {
      id: 'concept_exam_subject',
      type: 'Concept',
      label: 'ExamSubject',
      description:
        'A KS4 exam-specific child subject (e.g. GCSE Biology) used within some sequences.',
    },
    {
      id: 'concept_tier',
      type: 'Concept',
      label: 'Tier',
      description:
        'An exam tier (e.g. foundation or higher) that selects a subset of units for some KS4 programmes.',
    },
    {
      id: 'concept_pathway',
      type: 'Concept',
      label: 'Pathway',
      description:
        'A KS4 programme pathway (e.g. core, GCSE) that affects which units are included.',
    },
    {
      id: 'concept_exam_board',
      type: 'Concept',
      label: 'ExamBoard',
      description:
        'An exam board (e.g. AQA, OCR) that can shape which KS4 programmes or sequences are used.',
    },
    {
      id: 'concept_rate_limit',
      type: 'Concept',
      label: 'RateLimitStatus',
      description:
        'The current rate limit information for an API key (limit, remaining, reset time).',
    },
    {
      id: 'concept_changelog_entry',
      type: 'Concept',
      label: 'ChangelogEntry',
      description: 'A record describing one versioned change to the API (version, date, notes).',
    },
    {
      id: 'concept_national_curriculum_statement',
      type: 'Concept',
      label: 'NationalCurriculumStatement',
      description: 'A statement from the national curriculum that a unit or lesson covers.',
    },
    {
      id: 'concept_prior_knowledge_requirement',
      type: 'Concept',
      label: 'PriorKnowledgeRequirement',
      description: 'A prerequisite knowledge statement needed before starting a unit.',
    },
    {
      id: 'concept_keyword',
      type: 'Concept',
      label: 'LessonKeyword',
      description: 'A key term used in a lesson, with a teacher-friendly definition.',
    },
    {
      id: 'concept_misconception',
      type: 'Concept',
      label: 'Misconception',
      description: 'A common misunderstanding that the lesson explicitly addresses.',
    },
    {
      id: 'src_api_schema_sdk',
      type: 'SourceDoc',
      label: 'api-schema-sdk.json (uploaded)',
      description: 'Local copy of the Oak Curriculum API OpenAPI schema.',
    },
    {
      id: 'src_curriculum_ontology_md',
      type: 'SourceDoc',
      label: 'curriculum-ontology.md (uploaded)',
      description: 'Local markdown description of the curriculum ontology.',
    },
    {
      id: 'src_official_api_ontology_comparison_md',
      type: 'SourceDoc',
      label: 'official-api-ontology-comparison.md (uploaded)',
      description: 'Internal comparison between the official API and the curriculum ontology.',
    },
    {
      id: 'src_ontology_research_summary_md',
      type: 'SourceDoc',
      label: 'ONTOLOGY_RESEARCH_SUMMARY.md (uploaded)',
      description: 'Research summary synthesising API and ontology structures.',
    },
    {
      id: 'link_oak_api_overview',
      type: 'ExternalLink',
      label: 'Oak API overview',
      description: 'Human-readable overview of the Oak Curriculum API.',
      externalUrl: 'https://open-api.thenational.academy/docs/about-oaks-api/api-overview',
    },
    {
      id: 'link_oak_swagger_json',
      type: 'ExternalLink',
      label: 'Oak OpenAPI swagger.json',
      description: 'Machine-readable OpenAPI description of the Oak Curriculum API.',
      externalUrl: 'https://open-api.thenational.academy/api/v0/swagger.json',
    },
    {
      id: 'link_oak_glossary',
      type: 'ExternalLink',
      label: 'Oak data glossary',
      description: 'Glossary of curriculum and data terms used by the Oak API and ontology.',
      externalUrl: 'https://open-api.thenational.academy/docs/about-oaks-data/glossary',
    },
    {
      id: 'link_oak_ontology_diagrams',
      type: 'ExternalLink',
      label: 'Oak ontology diagrams',
      description: 'Diagrammatic overview of Oak’s curriculum ontology.',
      externalUrl: 'https://open-api.thenational.academy/docs/about-oaks-data/ontology-diagrams',
    },
    {
      id: 'link_oak_main_site',
      type: 'ExternalLink',
      label: 'Oak National Academy – teachers site',
      description: 'Main teacher-facing site that surfaces the curriculum described by this API.',
      externalUrl: 'https://www.thenational.academy',
    },
    {
      id: 'ep_sequences_units_get',
      type: 'Endpoint',
      label: 'GET /sequences/{sequence}/units',
      description:
        'Returns units within a sequence, grouped by year and optionally branched by exam subjects and tiers.',
    },
    {
      id: 'ep_lessons_transcript_get',
      type: 'Endpoint',
      label: 'GET /lessons/{lesson}/transcript',
      description: 'Returns the lesson video transcript and caption file content.',
    },
    {
      id: 'ep_search_transcripts_get',
      type: 'Endpoint',
      label: 'GET /search/transcripts',
      description:
        'Searches lesson transcripts for a text snippet and returns the most similar lessons.',
    },
    {
      id: 'ep_sequences_assets_get',
      type: 'Endpoint',
      label: 'GET /sequences/{sequence}/assets',
      description: 'Returns all lesson assets for a sequence, grouped by lesson.',
    },
    {
      id: 'ep_keystage_subject_assets_get',
      type: 'Endpoint',
      label: 'GET /key-stages/{keyStage}/subject/{subject}/assets',
      description:
        'Returns assets for a key stage and subject, optionally filtered by type and unit.',
    },
    {
      id: 'ep_lessons_assets_get',
      type: 'Endpoint',
      label: 'GET /lessons/{lesson}/assets',
      description: 'Lists downloadable lesson assets and any third-party attributions.',
    },
    {
      id: 'ep_lessons_asset_by_type_get',
      type: 'Endpoint',
      label: 'GET /lessons/{lesson}/assets/{type}',
      description: 'Streams a specific asset file for the lesson.',
    },
    {
      id: 'ep_subjects_get',
      type: 'Endpoint',
      label: 'GET /subjects',
      description: 'Lists all subjects and their sequences, key stages and years.',
    },
    {
      id: 'ep_subject_get',
      type: 'Endpoint',
      label: 'GET /subjects/{subject}',
      description: 'Returns details for a single subject, including its sequences and coverage.',
    },
    {
      id: 'ep_subject_sequences_get',
      type: 'Endpoint',
      label: 'GET /subjects/{subject}/sequences',
      description: 'Lists sequences available for a subject.',
    },
    {
      id: 'ep_subject_keystages_get',
      type: 'Endpoint',
      label: 'GET /subjects/{subject}/key-stages',
      description: 'Lists key stages for which a subject has content.',
    },
    {
      id: 'ep_subject_years_get',
      type: 'Endpoint',
      label: 'GET /subjects/{subject}/years',
      description: 'Lists school years for which a subject has content.',
    },
    {
      id: 'ep_keystages_get',
      type: 'Endpoint',
      label: 'GET /key-stages',
      description: 'Lists all key stages available in the API.',
    },
    {
      id: 'ep_keystage_subject_lessons_get',
      type: 'Endpoint',
      label: 'GET /key-stages/{keyStage}/subject/{subject}/lessons',
      description: 'Lists lessons for a subject at a key stage, grouped by unit.',
    },
    {
      id: 'ep_keystage_subject_units_get',
      type: 'Endpoint',
      label: 'GET /key-stages/{keyStage}/subject/{subject}/units',
      description: 'Lists units for a subject at a key stage, grouped by year.',
    },
    {
      id: 'ep_lessons_quiz_get',
      type: 'Endpoint',
      label: 'GET /lessons/{lesson}/quiz',
      description: 'Returns starter and exit quizzes for a lesson.',
    },
    {
      id: 'ep_sequences_questions_get',
      type: 'Endpoint',
      label: 'GET /sequences/{sequence}/questions',
      description: 'Returns quizzes for all lessons in a sequence.',
    },
    {
      id: 'ep_keystage_subject_questions_get',
      type: 'Endpoint',
      label: 'GET /key-stages/{keyStage}/subject/{subject}/questions',
      description: 'Returns quizzes for all lessons in a subject at a key stage.',
    },
    {
      id: 'ep_lessons_summary_get',
      type: 'Endpoint',
      label: 'GET /lessons/{lesson}/summary',
      description: 'Returns an educational summary and metadata for a lesson.',
    },
    {
      id: 'ep_search_lessons_get',
      type: 'Endpoint',
      label: 'GET /search/lessons',
      description: 'Searches lessons by title, with optional key stage, subject and unit filters.',
    },
    {
      id: 'ep_units_summary_get',
      type: 'Endpoint',
      label: 'GET /units/{unit}/summary',
      description: 'Returns educational metadata and context for a unit.',
    },
    {
      id: 'ep_threads_get',
      type: 'Endpoint',
      label: 'GET /threads',
      description: 'Lists all curriculum threads.',
    },
    {
      id: 'ep_thread_units_get',
      type: 'Endpoint',
      label: 'GET /threads/{threadSlug}/units',
      description: 'Lists units belonging to a given thread.',
    },
    {
      id: 'ep_changelog_get',
      type: 'Endpoint',
      label: 'GET /changelog',
      description: 'Returns API change history entries.',
    },
    {
      id: 'ep_changelog_latest_get',
      type: 'Endpoint',
      label: 'GET /changelog/latest',
      description: 'Returns the latest API change entry.',
    },
    {
      id: 'ep_rate_limit_get',
      type: 'Endpoint',
      label: 'GET /rate-limit',
      description: 'Returns current API rate limit status for the caller.',
    },
    {
      id: 'schema_AllSubjectsResponse',
      type: 'Schema',
      label: 'AllSubjectsResponseSchema',
      description:
        'Response schema for listing all subjects and their sequences, years and key stages.',
    },
    {
      id: 'schema_SubjectResponse',
      type: 'Schema',
      label: 'SubjectResponseSchema',
      description: 'Response schema for a single subject and its sequences.',
    },
    {
      id: 'schema_SubjectSequenceResponse',
      type: 'Schema',
      label: 'SubjectSequenceResponseSchema',
      description: 'Response schema listing sequences for a subject.',
    },
    {
      id: 'schema_SubjectKeyStagesResponse',
      type: 'Schema',
      label: 'SubjectKeyStagesResponseSchema',
      description: 'Response schema listing key stages for a subject.',
    },
    {
      id: 'schema_SubjectYearsResponse',
      type: 'Schema',
      label: 'SubjectYearsResponseSchema',
      description: 'Response schema listing year groups for a subject.',
    },
    {
      id: 'schema_KeyStageResponse',
      type: 'Schema',
      label: 'KeyStageResponseSchema',
      description: 'Response schema listing key stages available in the API.',
    },
    {
      id: 'schema_KeyStageSubjectLessonsResponse',
      type: 'Schema',
      label: 'KeyStageSubjectLessonsResponseSchema',
      description: 'Response schema listing lessons grouped by unit for a subject and key stage.',
    },
    {
      id: 'schema_AllKeyStageAndSubjectUnitsResponse',
      type: 'Schema',
      label: 'AllKeyStageAndSubjectUnitsResponseSchema',
      description: 'Response schema listing units grouped by year for a subject and key stage.',
    },
    {
      id: 'schema_AllThreadsResponse',
      type: 'Schema',
      label: 'AllThreadsResponseSchema',
      description: 'Response schema listing all threads.',
    },
    {
      id: 'schema_ThreadUnitsResponse',
      type: 'Schema',
      label: 'ThreadUnitsResponseSchema',
      description: 'Response schema listing units for a thread.',
    },
    {
      id: 'schema_SequenceUnitsResponse',
      type: 'Schema',
      label: 'SequenceUnitsResponseSchema',
      description:
        'Response schema listing units within a sequence, grouped by year and exam variants.',
    },
    {
      id: 'schema_SequenceAssetsResponse',
      type: 'Schema',
      label: 'SequenceAssetsResponseSchema',
      description: 'Response schema listing lesson assets for a sequence, grouped by lesson.',
    },
    {
      id: 'schema_SubjectAssetsResponse',
      type: 'Schema',
      label: 'SubjectAssetsResponseSchema',
      description: 'Response schema listing lesson assets for a subject and key stage.',
    },
    {
      id: 'schema_LessonAssetsResponse',
      type: 'Schema',
      label: 'LessonAssetsResponseSchema',
      description: 'Response schema listing assets available for a lesson.',
    },
    {
      id: 'schema_LessonAssetResponse',
      type: 'Schema',
      label: 'LessonAssetResponseSchema',
      description: 'Streaming/attachment response schema for a specific lesson asset.',
    },
    {
      id: 'schema_TranscriptResponse',
      type: 'Schema',
      label: 'TranscriptResponseSchema',
      description:
        'Response schema containing the transcript and caption file content for a lesson.',
    },
    {
      id: 'schema_LessonSummaryResponse',
      type: 'Schema',
      label: 'LessonSummaryResponseSchema',
      description:
        'Response schema describing lesson metadata, content guidance and educational details.',
    },
    {
      id: 'schema_QuestionForLessonsResponse',
      type: 'Schema',
      label: 'QuestionForLessonsResponseSchema',
      description: 'Response schema describing starter and exit quiz questions for a lesson.',
    },
    {
      id: 'schema_QuestionsForSequenceResponse',
      type: 'Schema',
      label: 'QuestionsForSequenceResponseSchema',
      description: 'Response schema describing quiz questions for all lessons in a sequence.',
    },
    {
      id: 'schema_QuestionsForKeyStageAndSubjectResponse',
      type: 'Schema',
      label: 'QuestionsForKeyStageAndSubjectResponseSchema',
      description:
        'Response schema describing quiz questions for all lessons in a subject at a key stage.',
    },
    {
      id: 'schema_SearchTranscriptResponse',
      type: 'Schema',
      label: 'SearchTranscriptResponseSchema',
      description:
        'Response schema for transcript search results, including lesson slug and matching snippet.',
    },
    {
      id: 'schema_LessonSearchResponse',
      type: 'Schema',
      label: 'LessonSearchResponseSchema',
      description:
        'Response schema for title search results, including lessons and the units they appear in.',
    },
    {
      id: 'schema_RateLimitResponse',
      type: 'Schema',
      label: 'RateLimitResponseSchema',
      description: 'Response schema for the API rate limit endpoint.',
    },
    {
      id: 'schema_ChangelogArray',
      type: 'Schema',
      label: 'ChangelogArraySchema',
      description: 'Array schema for the changelog endpoint, listing versioned change entries.',
    },
    {
      id: 'schema_ChangelogLatest',
      type: 'Schema',
      label: 'ChangelogLatestSchema',
      description: 'Schema for the latest changelog entry.',
    },
  ],
  edges: [
    {
      id: 'edge_subject_sequence',
      from: 'concept_subject',
      to: 'concept_sequence',
      label: 'has sequences',
    },
    {
      id: 'edge_sequence_subject',
      from: 'concept_sequence',
      to: 'concept_subject',
      label: 'belongs to subject',
    },
    {
      id: 'edge_subject_keystage',
      from: 'concept_subject',
      to: 'concept_keystage',
      label: 'has key stages',
    },
    {
      id: 'edge_subject_yeargroup',
      from: 'concept_subject',
      to: 'concept_yeargroup',
      label: 'has year groups',
    },
    {
      id: 'edge_sequence_phase',
      from: 'concept_sequence',
      to: 'concept_phase',
      label: 'belongs to phase',
    },
    {
      id: 'edge_sequence_keystage',
      from: 'concept_sequence',
      to: 'concept_keystage',
      label: 'covers key stages',
    },
    {
      id: 'edge_sequence_yeargroup',
      from: 'concept_sequence',
      to: 'concept_yeargroup',
      label: 'covers year groups',
    },
    {
      id: 'edge_sequence_unit',
      from: 'concept_sequence',
      to: 'concept_unit',
      label: 'includes units',
    },
    {
      id: 'edge_programme_subject',
      from: 'concept_programme',
      to: 'concept_subject',
      label: 'about subject',
      inferred: true,
    },
    {
      id: 'edge_programme_unit',
      from: 'concept_programme',
      to: 'concept_unit',
      label: 'contains units',
      inferred: true,
    },
    {
      id: 'edge_programme_keystage',
      from: 'concept_programme',
      to: 'concept_keystage',
      label: 'scoped to key stage',
      inferred: true,
    },
    {
      id: 'edge_programme_yeargroup',
      from: 'concept_programme',
      to: 'concept_yeargroup',
      label: 'scoped to year group',
      inferred: true,
    },
    {
      id: 'edge_programme_pathway',
      from: 'concept_programme',
      to: 'concept_pathway',
      label: 'uses pathway',
      inferred: true,
    },
    {
      id: 'edge_programme_exam_board',
      from: 'concept_programme',
      to: 'concept_exam_board',
      label: 'uses exam board',
      inferred: true,
    },
    {
      id: 'edge_programme_tier',
      from: 'concept_programme',
      to: 'concept_tier',
      label: 'uses tier',
      inferred: true,
    },
    {
      id: 'edge_thread_unit',
      from: 'concept_thread',
      to: 'concept_unit',
      label: 'links units across years',
    },
    {
      id: 'edge_phase_keystage',
      from: 'concept_phase',
      to: 'concept_keystage',
      label: 'includes key stages',
    },
    {
      id: 'edge_keystage_yeargroup',
      from: 'concept_keystage',
      to: 'concept_yeargroup',
      label: 'includes year groups',
    },
    {
      id: 'edge_unit_lesson',
      from: 'concept_unit',
      to: 'concept_lesson',
      label: 'contains lessons',
    },
    {
      id: 'edge_unit_subject',
      from: 'concept_unit',
      to: 'concept_subject',
      label: 'belongs to subject',
      inferred: true,
    },
    {
      id: 'edge_unit_keystage',
      from: 'concept_unit',
      to: 'concept_keystage',
      label: 'belongs to key stage',
      inferred: true,
    },
    {
      id: 'edge_unit_yeargroup',
      from: 'concept_unit',
      to: 'concept_yeargroup',
      label: 'targets year group',
      inferred: true,
    },
    {
      id: 'edge_unit_category',
      from: 'concept_unit',
      to: 'concept_category',
      label: 'tagged with category',
    },
    {
      id: 'edge_unit_thread',
      from: 'concept_unit',
      to: 'concept_thread',
      label: 'tagged with thread',
    },
    {
      id: 'edge_lesson_asset',
      from: 'concept_lesson',
      to: 'concept_asset',
      label: 'has assets',
    },
    {
      id: 'edge_lesson_transcript',
      from: 'concept_lesson',
      to: 'concept_transcript',
      label: 'has transcript',
    },
    {
      id: 'edge_lesson_quiz',
      from: 'concept_lesson',
      to: 'concept_quiz',
      label: 'has quizzes',
    },
    {
      id: 'edge_lesson_unit',
      from: 'concept_lesson',
      to: 'concept_unit',
      label: 'belongs to unit',
    },
    {
      id: 'edge_lesson_content_guidance',
      from: 'concept_lesson',
      to: 'concept_content_guidance',
      label: 'has content guidance',
    },
    {
      id: 'edge_content_guidance_supervision',
      from: 'concept_content_guidance',
      to: 'concept_supervision_level',
      label: 'requires supervision level',
    },
    {
      id: 'edge_lesson_educational_metadata',
      from: 'concept_lesson',
      to: 'concept_educational_metadata',
      label: 'has lesson-level metadata',
    },
    {
      id: 'edge_unit_educational_metadata',
      from: 'concept_unit',
      to: 'concept_educational_metadata',
      label: 'has unit-level metadata',
    },
    {
      id: 'edge_quiz_question',
      from: 'concept_quiz',
      to: 'concept_question',
      label: 'contains questions',
    },
    {
      id: 'edge_question_answer',
      from: 'concept_question',
      to: 'concept_answer',
      label: 'has answers',
    },
    {
      id: 'edge_exam_subject_tier',
      from: 'concept_exam_subject',
      to: 'concept_tier',
      label: 'has tiers',
    },
    {
      id: 'edge_sequence_exam_subject',
      from: 'concept_sequence',
      to: 'concept_exam_subject',
      label: 'branches into exam subjects (KS4)',
      inferred: true,
    },
    {
      id: 'edge_educational_metadata_prior_knowledge',
      from: 'concept_educational_metadata',
      to: 'concept_prior_knowledge_requirement',
      label: 'includes prior-knowledge statements',
    },
    {
      id: 'edge_educational_metadata_curriculum_statement',
      from: 'concept_educational_metadata',
      to: 'concept_national_curriculum_statement',
      label: 'includes curriculum statements',
    },
    {
      id: 'edge_lesson_keyword',
      from: 'concept_lesson',
      to: 'concept_keyword',
      label: 'uses lesson keywords',
    },
    {
      id: 'edge_lesson_misconception',
      from: 'concept_lesson',
      to: 'concept_misconception',
      label: 'lists misconceptions',
    },
    {
      id: 'edge_concept_subject_ep_subjects',
      from: 'concept_subject',
      to: 'ep_subjects_get',
      label: 'listed by endpoint',
    },
    {
      id: 'edge_concept_subject_ep_subject',
      from: 'concept_subject',
      to: 'ep_subject_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_sequence_ep_sequences_units',
      from: 'concept_sequence',
      to: 'ep_sequences_units_get',
      label: 'units returned by endpoint',
    },
    {
      id: 'edge_concept_unit_ep_sequences_units',
      from: 'concept_unit',
      to: 'ep_sequences_units_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_unit_ep_keystage_subject_units',
      from: 'concept_unit',
      to: 'ep_keystage_subject_units_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_unit_ep_units_summary',
      from: 'concept_unit',
      to: 'ep_units_summary_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_lesson_ep_keystage_subject_lessons',
      from: 'concept_lesson',
      to: 'ep_keystage_subject_lessons_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_lesson_ep_lessons_summary',
      from: 'concept_lesson',
      to: 'ep_lessons_summary_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_lesson_ep_search_lessons',
      from: 'concept_lesson',
      to: 'ep_search_lessons_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_lesson_ep_search_transcripts',
      from: 'concept_lesson',
      to: 'ep_search_transcripts_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_lesson_ep_lessons_transcript',
      from: 'concept_lesson',
      to: 'ep_lessons_transcript_get',
      label: 'has transcript from endpoint',
    },
    {
      id: 'edge_concept_transcript_ep_lessons_transcript',
      from: 'concept_transcript',
      to: 'ep_lessons_transcript_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_transcript_ep_search_transcripts',
      from: 'concept_transcript',
      to: 'ep_search_transcripts_get',
      label: 'searched by endpoint',
    },
    {
      id: 'edge_concept_asset_ep_lessons_assets',
      from: 'concept_asset',
      to: 'ep_lessons_assets_get',
      label: 'listed by endpoint',
    },
    {
      id: 'edge_concept_asset_ep_lessons_asset_by_type',
      from: 'concept_asset',
      to: 'ep_lessons_asset_by_type_get',
      label: 'downloaded by endpoint',
    },
    {
      id: 'edge_concept_asset_ep_sequences_assets',
      from: 'concept_asset',
      to: 'ep_sequences_assets_get',
      label: 'listed by endpoint',
    },
    {
      id: 'edge_concept_asset_ep_keystage_subject_assets',
      from: 'concept_asset',
      to: 'ep_keystage_subject_assets_get',
      label: 'listed by endpoint',
    },
    {
      id: 'edge_concept_quiz_ep_lessons_quiz',
      from: 'concept_quiz',
      to: 'ep_lessons_quiz_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_quiz_ep_sequences_questions',
      from: 'concept_quiz',
      to: 'ep_sequences_questions_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_quiz_ep_keystage_subject_questions',
      from: 'concept_quiz',
      to: 'ep_keystage_subject_questions_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_thread_ep_threads',
      from: 'concept_thread',
      to: 'ep_threads_get',
      label: 'listed by endpoint',
    },
    {
      id: 'edge_concept_thread_ep_thread_units',
      from: 'concept_thread',
      to: 'ep_thread_units_get',
      label: 'used by endpoint',
    },
    {
      id: 'edge_concept_unit_ep_thread_units',
      from: 'concept_unit',
      to: 'ep_thread_units_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_keystage_ep_keystages',
      from: 'concept_keystage',
      to: 'ep_keystages_get',
      label: 'listed by endpoint',
    },
    {
      id: 'edge_concept_rate_limit_ep_rate_limit',
      from: 'concept_rate_limit',
      to: 'ep_rate_limit_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_changelog_ep_changelog',
      from: 'concept_changelog_entry',
      to: 'ep_changelog_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_concept_changelog_ep_changelog_latest',
      from: 'concept_changelog_entry',
      to: 'ep_changelog_latest_get',
      label: 'returned by endpoint',
    },
    {
      id: 'edge_ep_subjects_schema',
      from: 'ep_subjects_get',
      to: 'schema_AllSubjectsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_subject_schema',
      from: 'ep_subject_get',
      to: 'schema_SubjectResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_subject_sequences_schema',
      from: 'ep_subject_sequences_get',
      to: 'schema_SubjectSequenceResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_subject_keystages_schema',
      from: 'ep_subject_keystages_get',
      to: 'schema_SubjectKeyStagesResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_subject_years_schema',
      from: 'ep_subject_years_get',
      to: 'schema_SubjectYearsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_keystages_schema',
      from: 'ep_keystages_get',
      to: 'schema_KeyStageResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_keystage_subject_lessons_schema',
      from: 'ep_keystage_subject_lessons_get',
      to: 'schema_KeyStageSubjectLessonsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_keystage_subject_units_schema',
      from: 'ep_keystage_subject_units_get',
      to: 'schema_AllKeyStageAndSubjectUnitsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_threads_schema',
      from: 'ep_threads_get',
      to: 'schema_AllThreadsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_thread_units_schema',
      from: 'ep_thread_units_get',
      to: 'schema_ThreadUnitsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_sequences_units_schema',
      from: 'ep_sequences_units_get',
      to: 'schema_SequenceUnitsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_sequences_assets_schema',
      from: 'ep_sequences_assets_get',
      to: 'schema_SequenceAssetsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_keystage_subject_assets_schema',
      from: 'ep_keystage_subject_assets_get',
      to: 'schema_SubjectAssetsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_lessons_assets_schema',
      from: 'ep_lessons_assets_get',
      to: 'schema_LessonAssetsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_lessons_asset_type_schema',
      from: 'ep_lessons_asset_by_type_get',
      to: 'schema_LessonAssetResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_lessons_transcript_schema',
      from: 'ep_lessons_transcript_get',
      to: 'schema_TranscriptResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_lessons_summary_schema',
      from: 'ep_lessons_summary_get',
      to: 'schema_LessonSummaryResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_lessons_quiz_schema',
      from: 'ep_lessons_quiz_get',
      to: 'schema_QuestionForLessonsResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_sequences_questions_schema',
      from: 'ep_sequences_questions_get',
      to: 'schema_QuestionsForSequenceResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_keystage_subject_questions_schema',
      from: 'ep_keystage_subject_questions_get',
      to: 'schema_QuestionsForKeyStageAndSubjectResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_search_transcripts_schema',
      from: 'ep_search_transcripts_get',
      to: 'schema_SearchTranscriptResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_search_lessons_schema',
      from: 'ep_search_lessons_get',
      to: 'schema_LessonSearchResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_units_summary_schema',
      from: 'ep_units_summary_get',
      to: 'schema_SequenceUnitsResponse',
      label: 'returns schema',
      inferred: true,
    },
    {
      id: 'edge_ep_rate_limit_schema',
      from: 'ep_rate_limit_get',
      to: 'schema_RateLimitResponse',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_changelog_schema',
      from: 'ep_changelog_get',
      to: 'schema_ChangelogArray',
      label: 'returns schema',
    },
    {
      id: 'edge_ep_changelog_latest_schema',
      from: 'ep_changelog_latest_get',
      to: 'schema_ChangelogLatest',
      label: 'returns schema',
    },
    {
      id: 'edge_schema_allsubjects_subject',
      from: 'schema_AllSubjectsResponse',
      to: 'concept_subject',
      label: 'describes subjects',
    },
    {
      id: 'edge_schema_allsubjects_sequence',
      from: 'schema_AllSubjectsResponse',
      to: 'concept_sequence',
      label: 'describes sequences',
    },
    {
      id: 'edge_schema_allsubjects_keystage',
      from: 'schema_AllSubjectsResponse',
      to: 'concept_keystage',
      label: 'lists key stages',
    },
    {
      id: 'edge_schema_allsubjects_yeargroup',
      from: 'schema_AllSubjectsResponse',
      to: 'concept_yeargroup',
      label: 'lists year groups',
    },
    {
      id: 'edge_schema_sequenceunits_unit',
      from: 'schema_SequenceUnitsResponse',
      to: 'concept_unit',
      label: 'lists units',
    },
    {
      id: 'edge_schema_sequenceunits_thread',
      from: 'schema_SequenceUnitsResponse',
      to: 'concept_thread',
      label: 'lists threads on units',
    },
    {
      id: 'edge_schema_sequenceunits_category',
      from: 'schema_SequenceUnitsResponse',
      to: 'concept_category',
      label: 'lists categories on units',
    },
    {
      id: 'edge_schema_sequencesassets_asset',
      from: 'schema_SequenceAssetsResponse',
      to: 'concept_asset',
      label: 'lists assets',
    },
    {
      id: 'edge_schema_subjectassets_asset',
      from: 'schema_SubjectAssetsResponse',
      to: 'concept_asset',
      label: 'lists assets',
    },
    {
      id: 'edge_schema_lessonassets_asset',
      from: 'schema_LessonAssetsResponse',
      to: 'concept_asset',
      label: 'lists assets',
    },
    {
      id: 'edge_schema_transcript_transcript',
      from: 'schema_TranscriptResponse',
      to: 'concept_transcript',
      label: 'describes transcript',
    },
    {
      id: 'edge_schema_lessonsummary_lesson',
      from: 'schema_LessonSummaryResponse',
      to: 'concept_lesson',
      label: 'describes lesson',
    },
    {
      id: 'edge_schema_lessonsummary_metadata',
      from: 'schema_LessonSummaryResponse',
      to: 'concept_educational_metadata',
      label: 'describes metadata',
    },
    {
      id: 'edge_schema_lessonsummary_contentguidance',
      from: 'schema_LessonSummaryResponse',
      to: 'concept_content_guidance',
      label: 'describes content guidance',
    },
    {
      id: 'edge_schema_questions_lesson_quiz',
      from: 'schema_QuestionForLessonsResponse',
      to: 'concept_quiz',
      label: 'describes lesson quizzes',
    },
    {
      id: 'edge_schema_questions_sequence_quiz',
      from: 'schema_QuestionsForSequenceResponse',
      to: 'concept_quiz',
      label: 'describes sequence quizzes',
    },
    {
      id: 'edge_schema_questions_ks_quiz',
      from: 'schema_QuestionsForKeyStageAndSubjectResponse',
      to: 'concept_quiz',
      label: 'describes key stage quizzes',
    },
    {
      id: 'edge_schema_searchtranscripts_lesson',
      from: 'schema_SearchTranscriptResponse',
      to: 'concept_lesson',
      label: 'links to lessons',
    },
    {
      id: 'edge_schema_searchtranscripts_transcript',
      from: 'schema_SearchTranscriptResponse',
      to: 'concept_transcript',
      label: 'includes transcript snippets',
    },
    {
      id: 'edge_schema_searchlessons_lesson',
      from: 'schema_LessonSearchResponse',
      to: 'concept_lesson',
      label: 'lists lessons',
    },
    {
      id: 'edge_schema_searchlessons_unit',
      from: 'schema_LessonSearchResponse',
      to: 'concept_unit',
      label: 'lists units for lessons',
    },
    {
      id: 'edge_schema_ratelimit_concept',
      from: 'schema_RateLimitResponse',
      to: 'concept_rate_limit',
      label: 'describes rate limit',
    },
    {
      id: 'edge_schema_changelog_concept',
      from: 'schema_ChangelogArray',
      to: 'concept_changelog_entry',
      label: 'lists changelog entries',
    },
    {
      id: 'edge_schema_changeloglatest_concept',
      from: 'schema_ChangelogLatest',
      to: 'concept_changelog_entry',
      label: 'describes latest changelog entry',
    },
    {
      id: 'edge_src_schema_swagger_external',
      from: 'src_api_schema_sdk',
      to: 'link_oak_swagger_json',
      label: 'mirrors external OpenAPI spec',
    },
    {
      id: 'edge_src_ontology_diagrams_external',
      from: 'src_curriculum_ontology_md',
      to: 'link_oak_ontology_diagrams',
      label: 'summarises external ontology diagrams',
    },
    {
      id: 'edge_src_glossary_external',
      from: 'src_curriculum_ontology_md',
      to: 'link_oak_glossary',
      label: 'aligns with external glossary',
    },
    {
      id: 'edge_concept_subject_glossary',
      from: 'concept_subject',
      to: 'link_oak_glossary',
      label: 'defined in glossary',
      inferred: true,
    },
    {
      id: 'edge_concept_programme_docs',
      from: 'concept_programme',
      to: 'link_oak_api_overview',
      label: 'described in API docs',
      inferred: true,
    },
    {
      id: 'edge_concept_sequence_swagger',
      from: 'concept_sequence',
      to: 'link_oak_swagger_json',
      label: 'defined in OpenAPI spec',
      inferred: true,
    },
  ],
};
