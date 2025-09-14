# Oak Curriculum SDK — AI Reference

Generated: 2025-09-14T08:58:44.709Z

This single-file document is intended for AI agents. It contains the public API surface of the SDK, usage examples, and programmatic exports. For detailed human-oriented docs, see files under `docs/api/`.

## Quickstart

### Create clients

```ts
import { createOakClient, createOakPathBasedClient } from '@oaknational/oak-curriculum-sdk';

const apiKey = 'YOUR_API_KEY';
const client = createOakClient(apiKey);
const pathClient = createOakPathBasedClient(apiKey);
```

### Call an endpoint (method-based)

```ts
const res = await client.GET('/lessons/{lesson}/transcript', {
  params: { path: { lesson: 'lesson-slug' } },
});
if (res.error) throw res.error;
console.log(res.data);
```

### Call an endpoint (path-based)

```ts
const res2 = await pathClient['/lessons/{lesson}/transcript'].GET({
  params: { path: { lesson: 'lesson-slug' } },
});
console.log(res2.data);
```

### Programmatic tool generation

```ts
import { toolGeneration, schema } from '@oaknational/oak-curriculum-sdk';

for (const op of toolGeneration.PATH_OPERATIONS) {
  const { pathParams, toMcpToolName } = toolGeneration.parsePathTemplate(op.path, op.method);
  console.log(op.operationId, toMcpToolName(), pathParams);
}
```

## Conventions

- Authorization: pass API key to `createOakClient(apiKey)`; the SDK never reads env vars.
- Base URL: defaults to the production API; override via `OAK_API_URL` if needed.
- Responses: every call returns `{ data, error, response }` from openapi-fetch.
- Rate limits: see `/rate-limit` endpoint; headers expose remaining/limit.

## Endpoint Catalog

### GET /changelog/latest

- operationId: changelog-latest
- description: Get the latest version and latest change note for the API
  Parameters:
  _No parameters_

### GET /changelog

- operationId: changelog-changelog
- description: History of significant changes to the API with associated dates and versions
  Parameters:
  _No parameters_

### GET /key-stages/{keyStage}/subject/{subject}/assets

- operationId: getAssets-getSubjectAssets
- summary: Assets
- description: This endpoint returns signed download URLs and types for available assets for a given key stage and subject, grouped by lesson. You can also optionally filter by type and unit.
  Parameters:
- path keyStage (string enum:4) — required
- path subject (string enum:17) — required
- query type (string enum:9)
- query unit (string)

### GET /key-stages/{keyStage}/subject/{subject}/lessons

- operationId: getKeyStageSubjectLessons-getKeyStageSubjectLessons
- summary: Lessons
- description: This endpoint returns an array of available published lessons for a given subject and key stage, grouped by unit.
  Parameters:
- path keyStage (string enum:4) — required
- path subject (string enum:17) — required
- query unit (string)
- query offset (number)
- query limit (number)

### GET /key-stages/{keyStage}/subject/{subject}/questions

- operationId: getQuestions-getQuestionsForKeyStageAndSubject
- summary: Quiz questions by subject and key stage
- description: This endpoint returns quiz questions and answers for each lesson within a requested subject and key stage.
  Parameters:
- path keyStage (string enum:4) — required
- path subject (string enum:17) — required
- query offset (number)
- query limit (number)

### GET /key-stages/{keyStage}/subject/{subject}/units

- operationId: getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits
- summary: Units
- description: This endpoint returns an array of units containing available published lessons for a given key stage and subject, grouped by year. Units without published lessons will not be returned by this endpoint.
  Parameters:
- path keyStage (string enum:4) — required
- path subject (string enum:17) — required

### GET /key-stages

- operationId: getKeyStages-getKeyStages
- summary: Key stages
- description: This endpoint returns all the key stages (titles and slugs) that are currently available on Oak
  Parameters:
  _No parameters_

### GET /lessons/{lesson}/assets/{type}

- operationId: getAssets-getLessonAsset
- summary: Lesson asset by type
- description: This endpoint will stream the downloadable asset for the given lesson and type.
  There is no response returned for this endpoint as it returns a content attachment.
  Parameters:
- path lesson (string) — required
- path type (string enum:9) — required

### GET /lessons/{lesson}/assets

- operationId: getAssets-getLessonAssets
- summary: Downloadable lesson assets
- description: This endpoint returns the types of available assets for a given lesson, and the download endpoints for each.
  This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.

Parameters:

- path lesson (string) — required
- query type (string enum:9)

### GET /lessons/{lesson}/quiz

- operationId: getQuestions-getQuestionsForLessons
- summary: Quiz questions by lesson
- description: The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors.
  Parameters:
- path lesson (string) — required

### GET /lessons/{lesson}/summary

- operationId: getLessons-getLesson
- summary: Lesson summary
- description: This endpoint returns a summary for a given lesson
  Parameters:
- path lesson (string) — required

### GET /lessons/{lesson}/transcript

- operationId: getLessonTranscript-getLessonTranscript
- summary: Lesson transcript
- description: This endpoint returns the video transcript and video captions file for a given lesson.
  Parameters:
- path lesson (string) — required

### GET /rate-limit

- operationId: getRateLimit-getRateLimit
- description: Check your current rate limit status (note that your rate limit is also included in the headers of every response).

This specific endpoint does not cost any requests.
Parameters:
_No parameters_

### GET /search/lessons

- operationId: getLessons-searchByTextSimilarity
- summary: Lesson search using lesson title
- description: Search for a term and find the 20 most similar lessons with titles that contain similar text.
  Parameters:
- query q (string) — required
- query keyStage (string enum:4)
- query subject (string enum:17)
- query unit (string)

### GET /search/transcripts

- operationId: searchTranscripts-searchTranscripts
- summary: Lesson search using lesson video transcripts
- description: Search for a term and find the 5 most similar lessons whose video transcripts contain similar text.
  Parameters:
- query q (string) — required

### GET /sequences/{sequence}/assets

- operationId: getAssets-getSequenceAssets
- summary: Assets within a sequence
- description: This endpoint returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson.
  This endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.
  Parameters:
- path sequence (string) — required
- query year (number)
- query type (string enum:9)

### GET /sequences/{sequence}/questions

- operationId: getQuestions-getQuestionsForSequence
- summary: Questions within a sequence
- description: This endpoint returns all quiz questions for a given sequence. The assets are separated into starter quiz and entry quiz arrays, grouped by lesson.
  Parameters:
- path sequence (string) — required
- query year (number)
- query offset (number)
- query limit (number)

### GET /sequences/{sequence}/units

- operationId: getSequences-getSequenceUnits
- summary: Units within a sequence
- description: This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.
  Parameters:
- path sequence (string) — required
- query year (string enum:12)

### GET /subjects/{subject}/key-stages

- operationId: getSubjects-getSubjectKeyStages
- summary: Key stages within a subject
- description: This endpoint returns a list of key stages that are currently available for a given subject.
  Parameters:
- path subject (string) — required

### GET /subjects/{subject}/sequences

- operationId: getSubjects-getSubjectSequence
- summary: Sequencing information for a given subject
- description: This endpoint returns an array of sequence objects that are currently available for a given subject. For secondary sequences, this includes information about key stage 4 variance such as exam board sequences and non-GCSE ‘core’ unit sequences.
  Parameters:
- path subject (string) — required

### GET /subjects/{subject}/years

- operationId: getSubjects-getSubjectYears
- summary: Year groups for a given subject
- description: This endpoint returns an array of years that are currently available for a given subject.
  Parameters:
- path subject (string) — required

### GET /subjects/{subject}

- operationId: getSubjects-getSubject
- summary: Subject
- description: This endpoint returns the sequences, key stages and years that are currently available for a given subject.
  Parameters:
- path subject (string) — required

### GET /subjects

- operationId: getSubjects-getAllSubjects
- summary: Subjects
- description: This endpoint returns an array of all available subjects and their associated sequences, key stages and years.
  Parameters:
  _No parameters_

### GET /threads/{threadSlug}/units

- operationId: getThreads-getThreadUnits
- summary: Units belonging to a given thread
- description: This endpoint returns all of the units that belong to a given thread.
  Parameters:
- path threadSlug (string) — required

### GET /threads

- operationId: getThreads-getAllThreads
- summary: Threads
- description: This endpoint returns an array of all threads, across all subjects. Threads signpost groups of units that link to one another, building a common body of knowledge over time. They are an important component of how Oak’s curricula are sequenced.
  Parameters:
  _No parameters_

### GET /units/{unit}/summary

- operationId: getUnits-getUnit
- summary: Unit summary
- description: This endpoint returns unit information for a given unit, including slug, title, number of lessons, prior knowledge requirements, national curriculum statements, prior unit details, future unit descriptions, and lesson titles that form the unit
  Parameters:
- path unit (string) — required

## MCP Tool Catalog

### get-changelog

- path: /changelog
- method: GET
- operationId: changelog-changelog
- path params: _None_
- query params: _None_

### get-changelog-latest

- path: /changelog/latest
- method: GET
- operationId: changelog-latest
- path params: _None_
- query params: _None_

### get-key-stages

- path: /key-stages
- method: GET
- operationId: getKeyStages-getKeyStages
- path params: _None_
- query params: _None_

### get-key-stages-subject-assets

- path: /key-stages/{keyStage}/subject/{subject}/assets
- method: GET
- operationId: getAssets-getSubjectAssets
- path params: keyStage, subject
- query params: type, unit

### get-key-stages-subject-lessons

- path: /key-stages/{keyStage}/subject/{subject}/lessons
- method: GET
- operationId: getKeyStageSubjectLessons-getKeyStageSubjectLessons
- path params: keyStage, subject
- query params: unit, offset, limit

### get-key-stages-subject-questions

- path: /key-stages/{keyStage}/subject/{subject}/questions
- method: GET
- operationId: getQuestions-getQuestionsForKeyStageAndSubject
- path params: keyStage, subject
- query params: offset, limit

### get-key-stages-subject-units

- path: /key-stages/{keyStage}/subject/{subject}/units
- method: GET
- operationId: getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits
- path params: keyStage, subject
- query params: _None_

### get-lessons-assets

- path: /lessons/{lesson}/assets
- method: GET
- operationId: getAssets-getLessonAssets
- path params: lesson
- query params: type

### get-lessons-assets-by-type

- path: /lessons/{lesson}/assets/{type}
- method: GET
- operationId: getAssets-getLessonAsset
- path params: lesson, type
- query params: _None_

### get-lessons-quiz

- path: /lessons/{lesson}/quiz
- method: GET
- operationId: getQuestions-getQuestionsForLessons
- path params: lesson
- query params: _None_

### get-lessons-summary

- path: /lessons/{lesson}/summary
- method: GET
- operationId: getLessons-getLesson
- path params: lesson
- query params: _None_

### get-lessons-transcript

- path: /lessons/{lesson}/transcript
- method: GET
- operationId: getLessonTranscript-getLessonTranscript
- path params: lesson
- query params: _None_

### get-rate-limit

- path: /rate-limit
- method: GET
- operationId: getRateLimit-getRateLimit
- path params: _None_
- query params: _None_

### get-search-lessons

- path: /search/lessons
- method: GET
- operationId: getLessons-searchByTextSimilarity
- path params: _None_
- query params: q, keyStage, subject, unit

### get-search-transcripts

- path: /search/transcripts
- method: GET
- operationId: searchTranscripts-searchTranscripts
- path params: _None_
- query params: q

### get-sequences-assets

- path: /sequences/{sequence}/assets
- method: GET
- operationId: getAssets-getSequenceAssets
- path params: sequence
- query params: year, type

### get-sequences-questions

- path: /sequences/{sequence}/questions
- method: GET
- operationId: getQuestions-getQuestionsForSequence
- path params: sequence
- query params: year, offset, limit

### get-sequences-units

- path: /sequences/{sequence}/units
- method: GET
- operationId: getSequences-getSequenceUnits
- path params: sequence
- query params: year

### get-subject-detail

- path: /subjects/{subject}
- method: GET
- operationId: getSubjects-getSubject
- path params: subject
- query params: _None_

### get-subjects

- path: /subjects
- method: GET
- operationId: getSubjects-getAllSubjects
- path params: _None_
- query params: _None_

### get-subjects-key-stages

- path: /subjects/{subject}/key-stages
- method: GET
- operationId: getSubjects-getSubjectKeyStages
- path params: subject
- query params: _None_

### get-subjects-sequences

- path: /subjects/{subject}/sequences
- method: GET
- operationId: getSubjects-getSubjectSequence
- path params: subject
- query params: _None_

### get-subjects-years

- path: /subjects/{subject}/years
- method: GET
- operationId: getSubjects-getSubjectYears
- path params: subject
- query params: _None_

### get-threads

- path: /threads
- method: GET
- operationId: getThreads-getAllThreads
- path params: _None_
- query params: _None_

### get-threads-units

- path: /threads/{threadSlug}/units
- method: GET
- operationId: getThreads-getThreadUnits
- path params: threadSlug
- query params: _None_

### get-units-summary

- path: /units/{unit}/summary
- method: GET
- operationId: getUnits-getUnit
- path params: unit
- query params: _None_

## Kind:2s

### index

### types/generated/api-schema/api-paths-types

### types/generated/api-schema/path-parameters
