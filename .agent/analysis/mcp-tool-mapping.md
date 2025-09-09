# MCP Tool to OpenAPI Operation Mapping

## All MCP Tools Currently Exposed

| MCP Tool Name                        | OpenAPI Path                                       | Method | Operation ID                                                | Parameters                                          |
| ------------------------------------ | -------------------------------------------------- | ------ | ----------------------------------------------------------- | --------------------------------------------------- |
| oak-get-changelog                    | /changelog                                         | GET    | changelog-changelog                                         | None                                                |
| oak-get-changelog-latest             | /changelog/latest                                  | GET    | changelog-latest                                            | None                                                |
| oak-get-key-stages-subject-units     | /key-stages/{keyStage}/subject/{subject}/units     | GET    | getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits | path: keyStage, subject                             |
| oak-get-lessons-assets               | /lessons/{lesson}/assets/{type}                    | GET    | getAssets-getLessonAsset                                    | path: lesson, type                                  |
| oak-get-lessons-assets               | /lessons/{lesson}/assets                           | GET    | getAssets-getLessonAssets                                   | path: lesson; query: type                           |
| oak-get-sequences-assets             | /sequences/{sequence}/assets                       | GET    | getAssets-getSequenceAssets                                 | path: sequence; query: year, type                   |
| oak-get-key-stages-subject-assets    | /key-stages/{keyStage}/subject/{subject}/assets    | GET    | getAssets-getSubjectAssets                                  | path: keyStage, subject; query: type, unit          |
| oak-get-key-stages                   | /key-stages                                        | GET    | getKeyStages-getKeyStages                                   | None                                                |
| oak-get-key-stages-subject-lessons   | /key-stages/{keyStage}/subject/{subject}/lessons   | GET    | getLessons-getKeyStageAndSubjectLessons                     | path: keyStage, subject; query: limit, offset, unit |
| oak-get-lessons-summary              | /lessons/{lesson}/summary                          | GET    | getLessons-getSummary                                       | path: lesson                                        |
| oak-get-search-lessons               | /search/lessons                                    | GET    | getLessons-searchByTextSimilarity                           | query: q, keyStage, subject, unit                   |
| oak-get-lessons-transcript           | /lessons/{lesson}/transcript                       | GET    | getLessons-getTranscript                                    | path: lesson                                        |
| oak-get-key-stages-subject-questions | /key-stages/{keyStage}/subject/{subject}/questions | GET    | getQuestions-getKeyStageAndSubjectQuestions                 | path: keyStage, subject; query: limit, offset       |
| oak-get-lessons-quiz                 | /lessons/{lesson}/quiz                             | GET    | getQuestions-getQuiz                                        | path: lesson                                        |
| oak-get-sequences-questions          | /sequences/{sequence}/questions                    | GET    | getQuestions-getSequenceQuestions                           | path: sequence; query: year, limit, offset          |
| oak-get-rate-limit                   | /rate-limit                                        | GET    | getRateLimit-getRateLimit                                   | None                                                |
| oak-get-sequences-units              | /sequences/{sequence}/units                        | GET    | getSequences-units                                          | path: sequence; query: year                         |
| oak-get-subjects                     | /subjects                                          | GET    | getSubjects-getSubjects                                     | None                                                |
| oak-get-subjects-key-stages          | /subjects/{subject}/key-stages                     | GET    | getSubjects-getSubjectKeyStages                             | path: subject                                       |
| oak-get-subjects-sequences           | /subjects/{subject}/sequences                      | GET    | getSubjects-getSubjectSequences                             | path: subject                                       |
| oak-get-subjects-years               | /subjects/{subject}/years                          | GET    | getSubjects-getSubjectYears                                 | path: subject                                       |
| oak-get-threads                      | /threads                                           | GET    | getThreads-getThreads                                       | None                                                |
| oak-get-threads-units                | /threads/{threadSlug}/units                        | GET    | getThreads-getThreadUnits                                   | path: threadSlug                                    |
| oak-get-units-summary                | /units/{unit}/summary                              | GET    | getUnits-getSummary                                         | path: unit                                          |
| oak-get-search-transcripts           | /search/transcripts                                | GET    | searchTranscripts-searchByTextSimilarity                    | query: q                                            |

## Analysis Results

### Can All Tools Be Generated from Schema?

**YES** - Every single MCP tool maps directly to an OpenAPI operation with:

1. Path from the schema
2. Method from the schema (all GET currently)
3. Operation ID from the schema
4. Parameters from the schema

### Pattern for MCP Tool Names

The pattern appears to be:

- Prefix: `oak-`
- Method: `get` (matches HTTP GET)
- Resource path components joined with hyphens

Examples:

- `/lessons/{lesson}/summary` → `oak-get-lessons-summary`
- `/key-stages/{keyStage}/subject/{subject}/units` → `oak-get-key-stages-subject-units`

### Required Generation Components

1. **Tool Name Generation**: Can derive from path + method
2. **Parameter Extraction**: Available in schema parameters array
3. **Response Types**: Available in schema responses
4. **Descriptions**: Available in schema operation descriptions

## Conclusion

All 25 MCP tools can be completely generated from the OpenAPI schema. No manual data needed!
