# Oak Curriculum Knowledge Graph – Markdown Representation

This document is a human-readable view of the same graph that appears in `kg-graph.ts`.

## 1. Node types

- **Concept**
- **Endpoint**
- **ExternalLink**
- **Schema**
- **SourceDoc**

## 2. Nodes

### 2.1 Concept nodes

- **Answer** (`concept_answer`)
  - Type: `Concept`
  - Description: An answer option for a quiz question, marked as correct or a distractor.

- **Asset** (`concept_asset`)
  - Type: `Concept`
  - Description: A downloadable or viewable resource for a lesson (slide deck, video, worksheet, quiz files, etc.).

- **Category** (`concept_category`)
  - Type: `Concept`
  - Description: A subject-specific grouping used to classify units (e.g. biology, chemistry, physics in science).

- **ChangelogEntry** (`concept_changelog_entry`)
  - Type: `Concept`
  - Description: A record describing one versioned change to the API (version, date, notes).

- **ContentGuidance** (`concept_content_guidance`)
  - Type: `Concept`
  - Description: Advisory information indicating that a lesson contains potentially sensitive content.

- **EducationalMetadata** (`concept_educational_metadata`)
  - Type: `Concept`
  - Description: Fields that describe educational context such as prior knowledge, curriculum statements, keywords and misconceptions.

- **ExamBoard** (`concept_exam_board`)
  - Type: `Concept`
  - Description: An exam board (e.g. AQA, OCR) that can shape which KS4 programmes or sequences are used.

- **ExamSubject** (`concept_exam_subject`)
  - Type: `Concept`
  - Description: A KS4 exam-specific child subject (e.g. GCSE Biology) used within some sequences.

- **KeyStage** (`concept_keystage`)
  - Type: `Concept`
  - Description: A formal stage of education (KS1–KS4).

- **LessonKeyword** (`concept_keyword`)
  - Type: `Concept`
  - Description: A key term used in a lesson, with a teacher-friendly definition.

- **Lesson** (`concept_lesson`)
  - Type: `Concept`
  - Description: An individual teaching session with defined objectives, resources, and assessment.

- **Misconception** (`concept_misconception`)
  - Type: `Concept`
  - Description: A common misunderstanding that the lesson explicitly addresses.

- **NationalCurriculumStatement** (`concept_national_curriculum_statement`)
  - Type: `Concept`
  - Description: A statement from the national curriculum that a unit or lesson covers.

- **Pathway** (`concept_pathway`)
  - Type: `Concept`
  - Description: A KS4 programme pathway (e.g. core, GCSE) that affects which units are included.

- **Phase** (`concept_phase`)
  - Type: `Concept`
  - Description: A broad school phase such as primary or secondary that groups key stages.

- **PriorKnowledgeRequirement** (`concept_prior_knowledge_requirement`)
  - Type: `Concept`
  - Description: A prerequisite knowledge statement needed before starting a unit.

- **Programme** (`concept_programme`)
  - Type: `Concept`
  - Description: A user-facing sequence of units for a specific subject and context (year, tier, pathway, exam board, etc.).

- **Question** (`concept_question`)
  - Type: `Concept`
  - Description: An individual quiz question (multiple-choice, ordering, matching, short-answer, etc.).

- **Quiz** (`concept_quiz`)
  - Type: `Concept`
  - Description: A starter or exit quiz made up of questions and answers assessing understanding.

- **RateLimitStatus** (`concept_rate_limit`)
  - Type: `Concept`
  - Description: The current rate limit information for an API key (limit, remaining, reset time).

- **Sequence** (`concept_sequence`)
  - Type: `Concept`
  - Description: An internal grouping of units used by the API for storage and querying; a single sequence can generate multiple programmes.

- **Subject** (`concept_subject`)
  - Type: `Concept`
  - Description: A distinct curriculum subject (e.g. maths, history) that spans key stages and year groups.

- **SupervisionLevel** (`concept_supervision_level`)
  - Type: `Concept`
  - Description: A level indicating how much adult supervision is recommended or required for a lesson.

- **Thread** (`concept_thread`)
  - Type: `Concept`
  - Description: A conceptual strand that links related units across years and key stages to show vertical progression.

- **Tier** (`concept_tier`)
  - Type: `Concept`
  - Description: An exam tier (e.g. foundation or higher) that selects a subset of units for some KS4 programmes.

- **Transcript** (`concept_transcript`)
  - Type: `Concept`
  - Description: The textual transcript and caption file content for a lesson video.

- **Unit** (`concept_unit`)
  - Type: `Concept`
  - Description: A topic of study made up of a sequence of lessons, typically taught over several weeks.

- **YearGroup** (`concept_yeargroup`)
  - Type: `Concept`
  - Description: A school year (Year 1–11) within a key stage.

### 2.2 Endpoint nodes

- **GET /changelog** (`ep_changelog_get`)
  - Type: `Endpoint`
  - Description: Returns API change history entries.

- **GET /changelog/latest** (`ep_changelog_latest_get`)
  - Type: `Endpoint`
  - Description: Returns the latest API change entry.

- **GET /key-stages/{keyStage}/subject/{subject}/assets** (`ep_keystage_subject_assets_get`)
  - Type: `Endpoint`
  - Description: Returns assets for a key stage and subject, optionally filtered by type and unit.

- **GET /key-stages/{keyStage}/subject/{subject}/lessons** (`ep_keystage_subject_lessons_get`)
  - Type: `Endpoint`
  - Description: Lists lessons for a subject at a key stage, grouped by unit.

- **GET /key-stages/{keyStage}/subject/{subject}/questions** (`ep_keystage_subject_questions_get`)
  - Type: `Endpoint`
  - Description: Returns quizzes for all lessons in a subject at a key stage.

- **GET /key-stages/{keyStage}/subject/{subject}/units** (`ep_keystage_subject_units_get`)
  - Type: `Endpoint`
  - Description: Lists units for a subject at a key stage, grouped by year.

- **GET /key-stages** (`ep_keystages_get`)
  - Type: `Endpoint`
  - Description: Lists all key stages available in the API.

- **GET /lessons/{lesson}/assets/{type}** (`ep_lessons_asset_by_type_get`)
  - Type: `Endpoint`
  - Description: Streams a specific asset file for the lesson.

- **GET /lessons/{lesson}/assets** (`ep_lessons_assets_get`)
  - Type: `Endpoint`
  - Description: Lists downloadable lesson assets and any third-party attributions.

- **GET /lessons/{lesson}/quiz** (`ep_lessons_quiz_get`)
  - Type: `Endpoint`
  - Description: Returns starter and exit quizzes for a lesson.

- **GET /lessons/{lesson}/summary** (`ep_lessons_summary_get`)
  - Type: `Endpoint`
  - Description: Returns an educational summary and metadata for a lesson.

- **GET /lessons/{lesson}/transcript** (`ep_lessons_transcript_get`)
  - Type: `Endpoint`
  - Description: Returns the lesson video transcript and caption file content.

- **GET /rate-limit** (`ep_rate_limit_get`)
  - Type: `Endpoint`
  - Description: Returns current API rate limit status for the caller.

- **GET /search/lessons** (`ep_search_lessons_get`)
  - Type: `Endpoint`
  - Description: Searches lessons by title, with optional key stage, subject and unit filters.

- **GET /search/transcripts** (`ep_search_transcripts_get`)
  - Type: `Endpoint`
  - Description: Searches lesson transcripts for a text snippet and returns the most similar lessons.

- **GET /sequences/{sequence}/assets** (`ep_sequences_assets_get`)
  - Type: `Endpoint`
  - Description: Returns all lesson assets for a sequence, grouped by lesson.

- **GET /sequences/{sequence}/questions** (`ep_sequences_questions_get`)
  - Type: `Endpoint`
  - Description: Returns quizzes for all lessons in a sequence.

- **GET /sequences/{sequence}/units** (`ep_sequences_units_get`)
  - Type: `Endpoint`
  - Description: Returns units within a sequence, grouped by year and optionally branched by exam subjects and tiers.

- **GET /subjects/{subject}** (`ep_subject_get`)
  - Type: `Endpoint`
  - Description: Returns details for a single subject, including its sequences and coverage.

- **GET /subjects/{subject}/key-stages** (`ep_subject_keystages_get`)
  - Type: `Endpoint`
  - Description: Lists key stages for which a subject has content.

- **GET /subjects/{subject}/sequences** (`ep_subject_sequences_get`)
  - Type: `Endpoint`
  - Description: Lists sequences available for a subject.

- **GET /subjects/{subject}/years** (`ep_subject_years_get`)
  - Type: `Endpoint`
  - Description: Lists school years for which a subject has content.

- **GET /subjects** (`ep_subjects_get`)
  - Type: `Endpoint`
  - Description: Lists all subjects and their sequences, key stages and years.

- **GET /threads/{threadSlug}/units** (`ep_thread_units_get`)
  - Type: `Endpoint`
  - Description: Lists units belonging to a given thread.

- **GET /threads** (`ep_threads_get`)
  - Type: `Endpoint`
  - Description: Lists all curriculum threads.

- **GET /units/{unit}/summary** (`ep_units_summary_get`)
  - Type: `Endpoint`
  - Description: Returns educational metadata and context for a unit.

### 2.3 ExternalLink nodes

- **Oak API overview** (`link_oak_api_overview`)
  - Type: `ExternalLink`
  - Description: Human-readable overview of the Oak Curriculum API.
  - External link: [https://open-api.thenational.academy/docs/about-oaks-api/api-overview](https://open-api.thenational.academy/docs/about-oaks-api/api-overview)

- **Oak data glossary** (`link_oak_glossary`)
  - Type: `ExternalLink`
  - Description: Glossary of curriculum and data terms used by the Oak API and ontology.
  - External link: [https://open-api.thenational.academy/docs/about-oaks-data/glossary](https://open-api.thenational.academy/docs/about-oaks-data/glossary)

- **Oak National Academy – teachers site** (`link_oak_main_site`)
  - Type: `ExternalLink`
  - Description: Main teacher-facing site that surfaces the curriculum described by this API.
  - External link: [https://www.thenational.academy](https://www.thenational.academy)

- **Oak ontology diagrams** (`link_oak_ontology_diagrams`)
  - Type: `ExternalLink`
  - Description: Diagrammatic overview of Oak’s curriculum ontology.
  - External link: [https://open-api.thenational.academy/docs/about-oaks-data/ontology-diagrams](https://open-api.thenational.academy/docs/about-oaks-data/ontology-diagrams)

- **Oak OpenAPI swagger.json** (`link_oak_swagger_json`)
  - Type: `ExternalLink`
  - Description: Machine-readable OpenAPI description of the Oak Curriculum API.
  - External link: [https://open-api.thenational.academy/api/v0/swagger.json](https://open-api.thenational.academy/api/v0/swagger.json)

### 2.4 Schema nodes

- **AllKeyStageAndSubjectUnitsResponseSchema** (`schema_AllKeyStageAndSubjectUnitsResponse`)
  - Type: `Schema`
  - Description: Response schema listing units grouped by year for a subject and key stage.

- **AllSubjectsResponseSchema** (`schema_AllSubjectsResponse`)
  - Type: `Schema`
  - Description: Response schema for listing all subjects and their sequences, years and key stages.

- **AllThreadsResponseSchema** (`schema_AllThreadsResponse`)
  - Type: `Schema`
  - Description: Response schema listing all threads.

- **ChangelogArraySchema** (`schema_ChangelogArray`)
  - Type: `Schema`
  - Description: Array schema for the changelog endpoint, listing versioned change entries.

- **ChangelogLatestSchema** (`schema_ChangelogLatest`)
  - Type: `Schema`
  - Description: Schema for the latest changelog entry.

- **KeyStageResponseSchema** (`schema_KeyStageResponse`)
  - Type: `Schema`
  - Description: Response schema listing key stages available in the API.

- **KeyStageSubjectLessonsResponseSchema** (`schema_KeyStageSubjectLessonsResponse`)
  - Type: `Schema`
  - Description: Response schema listing lessons grouped by unit for a subject and key stage.

- **LessonAssetResponseSchema** (`schema_LessonAssetResponse`)
  - Type: `Schema`
  - Description: Streaming/attachment response schema for a specific lesson asset.

- **LessonAssetsResponseSchema** (`schema_LessonAssetsResponse`)
  - Type: `Schema`
  - Description: Response schema listing assets available for a lesson.

- **LessonSearchResponseSchema** (`schema_LessonSearchResponse`)
  - Type: `Schema`
  - Description: Response schema for title search results, including lessons and the units they appear in.

- **LessonSummaryResponseSchema** (`schema_LessonSummaryResponse`)
  - Type: `Schema`
  - Description: Response schema describing lesson metadata, content guidance and educational details.

- **QuestionForLessonsResponseSchema** (`schema_QuestionForLessonsResponse`)
  - Type: `Schema`
  - Description: Response schema describing starter and exit quiz questions for a lesson.

- **QuestionsForKeyStageAndSubjectResponseSchema** (`schema_QuestionsForKeyStageAndSubjectResponse`)
  - Type: `Schema`
  - Description: Response schema describing quiz questions for all lessons in a subject at a key stage.

- **QuestionsForSequenceResponseSchema** (`schema_QuestionsForSequenceResponse`)
  - Type: `Schema`
  - Description: Response schema describing quiz questions for all lessons in a sequence.

- **RateLimitResponseSchema** (`schema_RateLimitResponse`)
  - Type: `Schema`
  - Description: Response schema for the API rate limit endpoint.

- **SearchTranscriptResponseSchema** (`schema_SearchTranscriptResponse`)
  - Type: `Schema`
  - Description: Response schema for transcript search results, including lesson slug and matching snippet.

- **SequenceAssetsResponseSchema** (`schema_SequenceAssetsResponse`)
  - Type: `Schema`
  - Description: Response schema listing lesson assets for a sequence, grouped by lesson.

- **SequenceUnitsResponseSchema** (`schema_SequenceUnitsResponse`)
  - Type: `Schema`
  - Description: Response schema listing units within a sequence, grouped by year and exam variants.

- **SubjectAssetsResponseSchema** (`schema_SubjectAssetsResponse`)
  - Type: `Schema`
  - Description: Response schema listing lesson assets for a subject and key stage.

- **SubjectKeyStagesResponseSchema** (`schema_SubjectKeyStagesResponse`)
  - Type: `Schema`
  - Description: Response schema listing key stages for a subject.

- **SubjectResponseSchema** (`schema_SubjectResponse`)
  - Type: `Schema`
  - Description: Response schema for a single subject and its sequences.

- **SubjectSequenceResponseSchema** (`schema_SubjectSequenceResponse`)
  - Type: `Schema`
  - Description: Response schema listing sequences for a subject.

- **SubjectYearsResponseSchema** (`schema_SubjectYearsResponse`)
  - Type: `Schema`
  - Description: Response schema listing year groups for a subject.

- **ThreadUnitsResponseSchema** (`schema_ThreadUnitsResponse`)
  - Type: `Schema`
  - Description: Response schema listing units for a thread.

- **TranscriptResponseSchema** (`schema_TranscriptResponse`)
  - Type: `Schema`
  - Description: Response schema containing the transcript and caption file content for a lesson.

### 2.5 SourceDoc nodes

- **api-schema-sdk.json (uploaded)** (`src_api_schema_sdk`)
  - Type: `SourceDoc`
  - Description: Local copy of the Oak Curriculum API OpenAPI schema.

- **curriculum-ontology.md (uploaded)** (`src_curriculum_ontology_md`)
  - Type: `SourceDoc`
  - Description: Local markdown description of the curriculum ontology.

- **official-api-ontology-comparison.md (uploaded)** (`src_official_api_ontology_comparison_md`)
  - Type: `SourceDoc`
  - Description: Internal comparison between the official API and the curriculum ontology.

- **ONTOLOGY_RESEARCH_SUMMARY.md (uploaded)** (`src_ontology_research_summary_md`)
  - Type: `SourceDoc`
  - Description: Research summary synthesising API and ontology structures.

## 3. Edges (relationships)

Each edge connects a `from` node to a `to` node with a relationship label.

### 3.44 From `schema_AllSubjectsResponse` (AllSubjectsResponseSchema)

- `edge_schema_allsubjects_keystage`: **AllSubjectsResponseSchema** (`schema_AllSubjectsResponse`) -- _lists key stages_ --> **KeyStage** (`concept_keystage`)
- `edge_schema_allsubjects_sequence`: **AllSubjectsResponseSchema** (`schema_AllSubjectsResponse`) -- _describes sequences_ --> **Sequence** (`concept_sequence`)
- `edge_schema_allsubjects_subject`: **AllSubjectsResponseSchema** (`schema_AllSubjectsResponse`) -- _describes subjects_ --> **Subject** (`concept_subject`)
- `edge_schema_allsubjects_yeargroup`: **AllSubjectsResponseSchema** (`schema_AllSubjectsResponse`) -- _lists year groups_ --> **YearGroup** (`concept_yeargroup`)

### 3.15 From `concept_asset` (Asset)

- `edge_concept_asset_ep_keystage_subject_assets`: **Asset** (`concept_asset`) -- _listed by endpoint_ --> **GET /key-stages/{keyStage}/subject/{subject}/assets** (`ep_keystage_subject_assets_get`)
- `edge_concept_asset_ep_lessons_assets`: **Asset** (`concept_asset`) -- _listed by endpoint_ --> **GET /lessons/{lesson}/assets** (`ep_lessons_assets_get`)
- `edge_concept_asset_ep_lessons_asset_by_type`: **Asset** (`concept_asset`) -- _downloaded by endpoint_ --> **GET /lessons/{lesson}/assets/{type}** (`ep_lessons_asset_by_type_get`)
- `edge_concept_asset_ep_sequences_assets`: **Asset** (`concept_asset`) -- _listed by endpoint_ --> **GET /sequences/{sequence}/assets** (`ep_sequences_assets_get`)

### 3.57 From `schema_ChangelogArray` (ChangelogArraySchema)

- `edge_schema_changelog_concept`: **ChangelogArraySchema** (`schema_ChangelogArray`) -- _lists changelog entries_ --> **ChangelogEntry** (`concept_changelog_entry`)

### 3.17 From `concept_changelog_entry` (ChangelogEntry)

- `edge_concept_changelog_ep_changelog`: **ChangelogEntry** (`concept_changelog_entry`) -- _returned by endpoint_ --> **GET /changelog** (`ep_changelog_get`)
- `edge_concept_changelog_ep_changelog_latest`: **ChangelogEntry** (`concept_changelog_entry`) -- _returned by endpoint_ --> **GET /changelog/latest** (`ep_changelog_latest_get`)

### 3.58 From `schema_ChangelogLatest` (ChangelogLatestSchema)

- `edge_schema_changeloglatest_concept`: **ChangelogLatestSchema** (`schema_ChangelogLatest`) -- _describes latest changelog entry_ --> **ChangelogEntry** (`concept_changelog_entry`)

### 3.9 From `concept_content_guidance` (ContentGuidance)

- `edge_content_guidance_supervision`: **ContentGuidance** (`concept_content_guidance`) -- _requires supervision level_ --> **SupervisionLevel** (`concept_supervision_level`)

### 3.13 From `concept_educational_metadata` (EducationalMetadata)

- `edge_educational_metadata_curriculum_statement`: **EducationalMetadata** (`concept_educational_metadata`) -- _includes curriculum statements_ --> **NationalCurriculumStatement** (`concept_national_curriculum_statement`)
- `edge_educational_metadata_prior_knowledge`: **EducationalMetadata** (`concept_educational_metadata`) -- _includes prior-knowledge statements_ --> **PriorKnowledgeRequirement** (`concept_prior_knowledge_requirement`)

### 3.12 From `concept_exam_subject` (ExamSubject)

- `edge_exam_subject_tier`: **ExamSubject** (`concept_exam_subject`) -- _has tiers_ --> **Tier** (`concept_tier`)

### 3.42 From `ep_changelog_get` (GET /changelog)

- `edge_ep_changelog_schema`: **GET /changelog** (`ep_changelog_get`) -- _returns schema_ --> **ChangelogArraySchema** (`schema_ChangelogArray`)

### 3.43 From `ep_changelog_latest_get` (GET /changelog/latest)

- `edge_ep_changelog_latest_schema`: **GET /changelog/latest** (`ep_changelog_latest_get`) -- _returns schema_ --> **ChangelogLatestSchema** (`schema_ChangelogLatest`)

### 3.23 From `ep_keystages_get` (GET /key-stages)

- `edge_ep_keystages_schema`: **GET /key-stages** (`ep_keystages_get`) -- _returns schema_ --> **KeyStageResponseSchema** (`schema_KeyStageResponse`)

### 3.30 From `ep_keystage_subject_assets_get` (GET /key-stages/{keyStage}/subject/{subject}/assets)

- `edge_ep_keystage_subject_assets_schema`: **GET /key-stages/{keyStage}/subject/{subject}/assets** (`ep_keystage_subject_assets_get`) -- _returns schema_ --> **SubjectAssetsResponseSchema** (`schema_SubjectAssetsResponse`)

### 3.24 From `ep_keystage_subject_lessons_get` (GET /key-stages/{keyStage}/subject/{subject}/lessons)

- `edge_ep_keystage_subject_lessons_schema`: **GET /key-stages/{keyStage}/subject/{subject}/lessons** (`ep_keystage_subject_lessons_get`) -- _returns schema_ --> **KeyStageSubjectLessonsResponseSchema** (`schema_KeyStageSubjectLessonsResponse`)

### 3.37 From `ep_keystage_subject_questions_get` (GET /key-stages/{keyStage}/subject/{subject}/questions)

- `edge_ep_keystage_subject_questions_schema`: **GET /key-stages/{keyStage}/subject/{subject}/questions** (`ep_keystage_subject_questions_get`) -- _returns schema_ --> **QuestionsForKeyStageAndSubjectResponseSchema** (`schema_QuestionsForKeyStageAndSubjectResponse`)

### 3.25 From `ep_keystage_subject_units_get` (GET /key-stages/{keyStage}/subject/{subject}/units)

- `edge_ep_keystage_subject_units_schema`: **GET /key-stages/{keyStage}/subject/{subject}/units** (`ep_keystage_subject_units_get`) -- _returns schema_ --> **AllKeyStageAndSubjectUnitsResponseSchema** (`schema_AllKeyStageAndSubjectUnitsResponse`)

### 3.31 From `ep_lessons_assets_get` (GET /lessons/{lesson}/assets)

- `edge_ep_lessons_assets_schema`: **GET /lessons/{lesson}/assets** (`ep_lessons_assets_get`) -- _returns schema_ --> **LessonAssetsResponseSchema** (`schema_LessonAssetsResponse`)

### 3.32 From `ep_lessons_asset_by_type_get` (GET /lessons/{lesson}/assets/{type})

- `edge_ep_lessons_asset_type_schema`: **GET /lessons/{lesson}/assets/{type}** (`ep_lessons_asset_by_type_get`) -- _returns schema_ --> **LessonAssetResponseSchema** (`schema_LessonAssetResponse`)

### 3.35 From `ep_lessons_quiz_get` (GET /lessons/{lesson}/quiz)

- `edge_ep_lessons_quiz_schema`: **GET /lessons/{lesson}/quiz** (`ep_lessons_quiz_get`) -- _returns schema_ --> **QuestionForLessonsResponseSchema** (`schema_QuestionForLessonsResponse`)

### 3.34 From `ep_lessons_summary_get` (GET /lessons/{lesson}/summary)

- `edge_ep_lessons_summary_schema`: **GET /lessons/{lesson}/summary** (`ep_lessons_summary_get`) -- _returns schema_ --> **LessonSummaryResponseSchema** (`schema_LessonSummaryResponse`)

### 3.33 From `ep_lessons_transcript_get` (GET /lessons/{lesson}/transcript)

- `edge_ep_lessons_transcript_schema`: **GET /lessons/{lesson}/transcript** (`ep_lessons_transcript_get`) -- _returns schema_ --> **TranscriptResponseSchema** (`schema_TranscriptResponse`)

### 3.41 From `ep_rate_limit_get` (GET /rate-limit)

- `edge_ep_rate_limit_schema`: **GET /rate-limit** (`ep_rate_limit_get`) -- _returns schema_ --> **RateLimitResponseSchema** (`schema_RateLimitResponse`)

### 3.39 From `ep_search_lessons_get` (GET /search/lessons)

- `edge_ep_search_lessons_schema`: **GET /search/lessons** (`ep_search_lessons_get`) -- _returns schema_ --> **LessonSearchResponseSchema** (`schema_LessonSearchResponse`)

### 3.38 From `ep_search_transcripts_get` (GET /search/transcripts)

- `edge_ep_search_transcripts_schema`: **GET /search/transcripts** (`ep_search_transcripts_get`) -- _returns schema_ --> **SearchTranscriptResponseSchema** (`schema_SearchTranscriptResponse`)

### 3.29 From `ep_sequences_assets_get` (GET /sequences/{sequence}/assets)

- `edge_ep_sequences_assets_schema`: **GET /sequences/{sequence}/assets** (`ep_sequences_assets_get`) -- _returns schema_ --> **SequenceAssetsResponseSchema** (`schema_SequenceAssetsResponse`)

### 3.36 From `ep_sequences_questions_get` (GET /sequences/{sequence}/questions)

- `edge_ep_sequences_questions_schema`: **GET /sequences/{sequence}/questions** (`ep_sequences_questions_get`) -- _returns schema_ --> **QuestionsForSequenceResponseSchema** (`schema_QuestionsForSequenceResponse`)

### 3.28 From `ep_sequences_units_get` (GET /sequences/{sequence}/units)

- `edge_ep_sequences_units_schema`: **GET /sequences/{sequence}/units** (`ep_sequences_units_get`) -- _returns schema_ --> **SequenceUnitsResponseSchema** (`schema_SequenceUnitsResponse`)

### 3.18 From `ep_subjects_get` (GET /subjects)

- `edge_ep_subjects_schema`: **GET /subjects** (`ep_subjects_get`) -- _returns schema_ --> **AllSubjectsResponseSchema** (`schema_AllSubjectsResponse`)

### 3.19 From `ep_subject_get` (GET /subjects/{subject})

- `edge_ep_subject_schema`: **GET /subjects/{subject}** (`ep_subject_get`) -- _returns schema_ --> **SubjectResponseSchema** (`schema_SubjectResponse`)

### 3.21 From `ep_subject_keystages_get` (GET /subjects/{subject}/key-stages)

- `edge_ep_subject_keystages_schema`: **GET /subjects/{subject}/key-stages** (`ep_subject_keystages_get`) -- _returns schema_ --> **SubjectKeyStagesResponseSchema** (`schema_SubjectKeyStagesResponse`)

### 3.20 From `ep_subject_sequences_get` (GET /subjects/{subject}/sequences)

- `edge_ep_subject_sequences_schema`: **GET /subjects/{subject}/sequences** (`ep_subject_sequences_get`) -- _returns schema_ --> **SubjectSequenceResponseSchema** (`schema_SubjectSequenceResponse`)

### 3.22 From `ep_subject_years_get` (GET /subjects/{subject}/years)

- `edge_ep_subject_years_schema`: **GET /subjects/{subject}/years** (`ep_subject_years_get`) -- _returns schema_ --> **SubjectYearsResponseSchema** (`schema_SubjectYearsResponse`)

### 3.26 From `ep_threads_get` (GET /threads)

- `edge_ep_threads_schema`: **GET /threads** (`ep_threads_get`) -- _returns schema_ --> **AllThreadsResponseSchema** (`schema_AllThreadsResponse`)

### 3.27 From `ep_thread_units_get` (GET /threads/{threadSlug}/units)

- `edge_ep_thread_units_schema`: **GET /threads/{threadSlug}/units** (`ep_thread_units_get`) -- _returns schema_ --> **ThreadUnitsResponseSchema** (`schema_ThreadUnitsResponse`)

### 3.40 From `ep_units_summary_get` (GET /units/{unit}/summary)

- `edge_ep_units_summary_schema`: **GET /units/{unit}/summary** (`ep_units_summary_get`) -- _returns schema_ --> **SequenceUnitsResponseSchema** (`schema_SequenceUnitsResponse`) _(inferred)_

### 3.6 From `concept_keystage` (KeyStage)

- `edge_concept_keystage_ep_keystages`: **KeyStage** (`concept_keystage`) -- _listed by endpoint_ --> **GET /key-stages** (`ep_keystages_get`)
- `edge_keystage_yeargroup`: **KeyStage** (`concept_keystage`) -- _includes year groups_ --> **YearGroup** (`concept_yeargroup`)

### 3.8 From `concept_lesson` (Lesson)

- `edge_lesson_asset`: **Lesson** (`concept_lesson`) -- _has assets_ --> **Asset** (`concept_asset`)
- `edge_lesson_content_guidance`: **Lesson** (`concept_lesson`) -- _has content guidance_ --> **ContentGuidance** (`concept_content_guidance`)
- `edge_lesson_educational_metadata`: **Lesson** (`concept_lesson`) -- _has lesson-level metadata_ --> **EducationalMetadata** (`concept_educational_metadata`)
- `edge_concept_lesson_ep_keystage_subject_lessons`: **Lesson** (`concept_lesson`) -- _returned by endpoint_ --> **GET /key-stages/{keyStage}/subject/{subject}/lessons** (`ep_keystage_subject_lessons_get`)
- `edge_concept_lesson_ep_lessons_summary`: **Lesson** (`concept_lesson`) -- _returned by endpoint_ --> **GET /lessons/{lesson}/summary** (`ep_lessons_summary_get`)
- `edge_concept_lesson_ep_lessons_transcript`: **Lesson** (`concept_lesson`) -- _has transcript from endpoint_ --> **GET /lessons/{lesson}/transcript** (`ep_lessons_transcript_get`)
- `edge_concept_lesson_ep_search_lessons`: **Lesson** (`concept_lesson`) -- _returned by endpoint_ --> **GET /search/lessons** (`ep_search_lessons_get`)
- `edge_concept_lesson_ep_search_transcripts`: **Lesson** (`concept_lesson`) -- _returned by endpoint_ --> **GET /search/transcripts** (`ep_search_transcripts_get`)
- `edge_lesson_keyword`: **Lesson** (`concept_lesson`) -- _uses lesson keywords_ --> **LessonKeyword** (`concept_keyword`)
- `edge_lesson_misconception`: **Lesson** (`concept_lesson`) -- _lists misconceptions_ --> **Misconception** (`concept_misconception`)
- `edge_lesson_quiz`: **Lesson** (`concept_lesson`) -- _has quizzes_ --> **Quiz** (`concept_quiz`)
- `edge_lesson_transcript`: **Lesson** (`concept_lesson`) -- _has transcript_ --> **Transcript** (`concept_transcript`)
- `edge_lesson_unit`: **Lesson** (`concept_lesson`) -- _belongs to unit_ --> **Unit** (`concept_unit`)

### 3.48 From `schema_LessonAssetsResponse` (LessonAssetsResponseSchema)

- `edge_schema_lessonassets_asset`: **LessonAssetsResponseSchema** (`schema_LessonAssetsResponse`) -- _lists assets_ --> **Asset** (`concept_asset`)

### 3.55 From `schema_LessonSearchResponse` (LessonSearchResponseSchema)

- `edge_schema_searchlessons_lesson`: **LessonSearchResponseSchema** (`schema_LessonSearchResponse`) -- _lists lessons_ --> **Lesson** (`concept_lesson`)
- `edge_schema_searchlessons_unit`: **LessonSearchResponseSchema** (`schema_LessonSearchResponse`) -- _lists units for lessons_ --> **Unit** (`concept_unit`)

### 3.50 From `schema_LessonSummaryResponse` (LessonSummaryResponseSchema)

- `edge_schema_lessonsummary_contentguidance`: **LessonSummaryResponseSchema** (`schema_LessonSummaryResponse`) -- _describes content guidance_ --> **ContentGuidance** (`concept_content_guidance`)
- `edge_schema_lessonsummary_metadata`: **LessonSummaryResponseSchema** (`schema_LessonSummaryResponse`) -- _describes metadata_ --> **EducationalMetadata** (`concept_educational_metadata`)
- `edge_schema_lessonsummary_lesson`: **LessonSummaryResponseSchema** (`schema_LessonSummaryResponse`) -- _describes lesson_ --> **Lesson** (`concept_lesson`)

### 3.5 From `concept_phase` (Phase)

- `edge_phase_keystage`: **Phase** (`concept_phase`) -- _includes key stages_ --> **KeyStage** (`concept_keystage`)

### 3.3 From `concept_programme` (Programme)

- `edge_programme_exam_board`: **Programme** (`concept_programme`) -- _uses exam board_ --> **ExamBoard** (`concept_exam_board`) _(inferred)_
- `edge_programme_keystage`: **Programme** (`concept_programme`) -- _scoped to key stage_ --> **KeyStage** (`concept_keystage`) _(inferred)_
- `edge_concept_programme_docs`: **Programme** (`concept_programme`) -- _described in API docs_ --> **Oak API overview** (`link_oak_api_overview`) _(inferred)_
- `edge_programme_pathway`: **Programme** (`concept_programme`) -- _uses pathway_ --> **Pathway** (`concept_pathway`) _(inferred)_
- `edge_programme_subject`: **Programme** (`concept_programme`) -- _about subject_ --> **Subject** (`concept_subject`) _(inferred)_
- `edge_programme_tier`: **Programme** (`concept_programme`) -- _uses tier_ --> **Tier** (`concept_tier`) _(inferred)_
- `edge_programme_unit`: **Programme** (`concept_programme`) -- _contains units_ --> **Unit** (`concept_unit`) _(inferred)_
- `edge_programme_yeargroup`: **Programme** (`concept_programme`) -- _scoped to year group_ --> **YearGroup** (`concept_yeargroup`) _(inferred)_

### 3.11 From `concept_question` (Question)

- `edge_question_answer`: **Question** (`concept_question`) -- _has answers_ --> **Answer** (`concept_answer`)

### 3.51 From `schema_QuestionForLessonsResponse` (QuestionForLessonsResponseSchema)

- `edge_schema_questions_lesson_quiz`: **QuestionForLessonsResponseSchema** (`schema_QuestionForLessonsResponse`) -- _describes lesson quizzes_ --> **Quiz** (`concept_quiz`)

### 3.53 From `schema_QuestionsForKeyStageAndSubjectResponse` (QuestionsForKeyStageAndSubjectResponseSchema)

- `edge_schema_questions_ks_quiz`: **QuestionsForKeyStageAndSubjectResponseSchema** (`schema_QuestionsForKeyStageAndSubjectResponse`) -- _describes key stage quizzes_ --> **Quiz** (`concept_quiz`)

### 3.52 From `schema_QuestionsForSequenceResponse` (QuestionsForSequenceResponseSchema)

- `edge_schema_questions_sequence_quiz`: **QuestionsForSequenceResponseSchema** (`schema_QuestionsForSequenceResponse`) -- _describes sequence quizzes_ --> **Quiz** (`concept_quiz`)

### 3.10 From `concept_quiz` (Quiz)

- `edge_concept_quiz_ep_keystage_subject_questions`: **Quiz** (`concept_quiz`) -- _returned by endpoint_ --> **GET /key-stages/{keyStage}/subject/{subject}/questions** (`ep_keystage_subject_questions_get`)
- `edge_concept_quiz_ep_lessons_quiz`: **Quiz** (`concept_quiz`) -- _returned by endpoint_ --> **GET /lessons/{lesson}/quiz** (`ep_lessons_quiz_get`)
- `edge_concept_quiz_ep_sequences_questions`: **Quiz** (`concept_quiz`) -- _returned by endpoint_ --> **GET /sequences/{sequence}/questions** (`ep_sequences_questions_get`)
- `edge_quiz_question`: **Quiz** (`concept_quiz`) -- _contains questions_ --> **Question** (`concept_question`)

### 3.56 From `schema_RateLimitResponse` (RateLimitResponseSchema)

- `edge_schema_ratelimit_concept`: **RateLimitResponseSchema** (`schema_RateLimitResponse`) -- _describes rate limit_ --> **RateLimitStatus** (`concept_rate_limit`)

### 3.16 From `concept_rate_limit` (RateLimitStatus)

- `edge_concept_rate_limit_ep_rate_limit`: **RateLimitStatus** (`concept_rate_limit`) -- _returned by endpoint_ --> **GET /rate-limit** (`ep_rate_limit_get`)

### 3.54 From `schema_SearchTranscriptResponse` (SearchTranscriptResponseSchema)

- `edge_schema_searchtranscripts_lesson`: **SearchTranscriptResponseSchema** (`schema_SearchTranscriptResponse`) -- _links to lessons_ --> **Lesson** (`concept_lesson`)
- `edge_schema_searchtranscripts_transcript`: **SearchTranscriptResponseSchema** (`schema_SearchTranscriptResponse`) -- _includes transcript snippets_ --> **Transcript** (`concept_transcript`)

### 3.2 From `concept_sequence` (Sequence)

- `edge_sequence_exam_subject`: **Sequence** (`concept_sequence`) -- _branches into exam subjects (KS4)_ --> **ExamSubject** (`concept_exam_subject`) _(inferred)_
- `edge_concept_sequence_ep_sequences_units`: **Sequence** (`concept_sequence`) -- _units returned by endpoint_ --> **GET /sequences/{sequence}/units** (`ep_sequences_units_get`)
- `edge_sequence_keystage`: **Sequence** (`concept_sequence`) -- _covers key stages_ --> **KeyStage** (`concept_keystage`)
- `edge_concept_sequence_swagger`: **Sequence** (`concept_sequence`) -- _defined in OpenAPI spec_ --> **Oak OpenAPI swagger.json** (`link_oak_swagger_json`) _(inferred)_
- `edge_sequence_phase`: **Sequence** (`concept_sequence`) -- _belongs to phase_ --> **Phase** (`concept_phase`)
- `edge_sequence_subject`: **Sequence** (`concept_sequence`) -- _belongs to subject_ --> **Subject** (`concept_subject`)
- `edge_sequence_unit`: **Sequence** (`concept_sequence`) -- _includes units_ --> **Unit** (`concept_unit`)
- `edge_sequence_yeargroup`: **Sequence** (`concept_sequence`) -- _covers year groups_ --> **YearGroup** (`concept_yeargroup`)

### 3.46 From `schema_SequenceAssetsResponse` (SequenceAssetsResponseSchema)

- `edge_schema_sequencesassets_asset`: **SequenceAssetsResponseSchema** (`schema_SequenceAssetsResponse`) -- _lists assets_ --> **Asset** (`concept_asset`)

### 3.45 From `schema_SequenceUnitsResponse` (SequenceUnitsResponseSchema)

- `edge_schema_sequenceunits_category`: **SequenceUnitsResponseSchema** (`schema_SequenceUnitsResponse`) -- _lists categories on units_ --> **Category** (`concept_category`)
- `edge_schema_sequenceunits_thread`: **SequenceUnitsResponseSchema** (`schema_SequenceUnitsResponse`) -- _lists threads on units_ --> **Thread** (`concept_thread`)
- `edge_schema_sequenceunits_unit`: **SequenceUnitsResponseSchema** (`schema_SequenceUnitsResponse`) -- _lists units_ --> **Unit** (`concept_unit`)

### 3.1 From `concept_subject` (Subject)

- `edge_concept_subject_ep_subjects`: **Subject** (`concept_subject`) -- _listed by endpoint_ --> **GET /subjects** (`ep_subjects_get`)
- `edge_concept_subject_ep_subject`: **Subject** (`concept_subject`) -- _returned by endpoint_ --> **GET /subjects/{subject}** (`ep_subject_get`)
- `edge_subject_keystage`: **Subject** (`concept_subject`) -- _has key stages_ --> **KeyStage** (`concept_keystage`)
- `edge_concept_subject_glossary`: **Subject** (`concept_subject`) -- _defined in glossary_ --> **Oak data glossary** (`link_oak_glossary`) _(inferred)_
- `edge_subject_sequence`: **Subject** (`concept_subject`) -- _has sequences_ --> **Sequence** (`concept_sequence`)
- `edge_subject_yeargroup`: **Subject** (`concept_subject`) -- _has year groups_ --> **YearGroup** (`concept_yeargroup`)

### 3.47 From `schema_SubjectAssetsResponse` (SubjectAssetsResponseSchema)

- `edge_schema_subjectassets_asset`: **SubjectAssetsResponseSchema** (`schema_SubjectAssetsResponse`) -- _lists assets_ --> **Asset** (`concept_asset`)

### 3.4 From `concept_thread` (Thread)

- `edge_concept_thread_ep_threads`: **Thread** (`concept_thread`) -- _listed by endpoint_ --> **GET /threads** (`ep_threads_get`)
- `edge_concept_thread_ep_thread_units`: **Thread** (`concept_thread`) -- _used by endpoint_ --> **GET /threads/{threadSlug}/units** (`ep_thread_units_get`)
- `edge_thread_unit`: **Thread** (`concept_thread`) -- _links units across years_ --> **Unit** (`concept_unit`)

### 3.14 From `concept_transcript` (Transcript)

- `edge_concept_transcript_ep_lessons_transcript`: **Transcript** (`concept_transcript`) -- _returned by endpoint_ --> **GET /lessons/{lesson}/transcript** (`ep_lessons_transcript_get`)
- `edge_concept_transcript_ep_search_transcripts`: **Transcript** (`concept_transcript`) -- _searched by endpoint_ --> **GET /search/transcripts** (`ep_search_transcripts_get`)

### 3.49 From `schema_TranscriptResponse` (TranscriptResponseSchema)

- `edge_schema_transcript_transcript`: **TranscriptResponseSchema** (`schema_TranscriptResponse`) -- _describes transcript_ --> **Transcript** (`concept_transcript`)

### 3.7 From `concept_unit` (Unit)

- `edge_unit_category`: **Unit** (`concept_unit`) -- _tagged with category_ --> **Category** (`concept_category`)
- `edge_unit_educational_metadata`: **Unit** (`concept_unit`) -- _has unit-level metadata_ --> **EducationalMetadata** (`concept_educational_metadata`)
- `edge_concept_unit_ep_keystage_subject_units`: **Unit** (`concept_unit`) -- _returned by endpoint_ --> **GET /key-stages/{keyStage}/subject/{subject}/units** (`ep_keystage_subject_units_get`)
- `edge_concept_unit_ep_sequences_units`: **Unit** (`concept_unit`) -- _returned by endpoint_ --> **GET /sequences/{sequence}/units** (`ep_sequences_units_get`)
- `edge_concept_unit_ep_thread_units`: **Unit** (`concept_unit`) -- _returned by endpoint_ --> **GET /threads/{threadSlug}/units** (`ep_thread_units_get`)
- `edge_concept_unit_ep_units_summary`: **Unit** (`concept_unit`) -- _returned by endpoint_ --> **GET /units/{unit}/summary** (`ep_units_summary_get`)
- `edge_unit_keystage`: **Unit** (`concept_unit`) -- _belongs to key stage_ --> **KeyStage** (`concept_keystage`) _(inferred)_
- `edge_unit_lesson`: **Unit** (`concept_unit`) -- _contains lessons_ --> **Lesson** (`concept_lesson`)
- `edge_unit_subject`: **Unit** (`concept_unit`) -- _belongs to subject_ --> **Subject** (`concept_subject`) _(inferred)_
- `edge_unit_thread`: **Unit** (`concept_unit`) -- _tagged with thread_ --> **Thread** (`concept_thread`)
- `edge_unit_yeargroup`: **Unit** (`concept_unit`) -- _targets year group_ --> **YearGroup** (`concept_yeargroup`) _(inferred)_

### 3.59 From `src_api_schema_sdk` (api-schema-sdk.json (uploaded))

- `edge_src_schema_swagger_external`: **api-schema-sdk.json (uploaded)** (`src_api_schema_sdk`) -- _mirrors external OpenAPI spec_ --> **Oak OpenAPI swagger.json** (`link_oak_swagger_json`)

### 3.60 From `src_curriculum_ontology_md` (curriculum-ontology.md (uploaded))

- `edge_src_glossary_external`: **curriculum-ontology.md (uploaded)** (`src_curriculum_ontology_md`) -- _aligns with external glossary_ --> **Oak data glossary** (`link_oak_glossary`)
- `edge_src_ontology_diagrams_external`: **curriculum-ontology.md (uploaded)** (`src_curriculum_ontology_md`) -- _summarises external ontology diagrams_ --> **Oak ontology diagrams** (`link_oak_ontology_diagrams`)
