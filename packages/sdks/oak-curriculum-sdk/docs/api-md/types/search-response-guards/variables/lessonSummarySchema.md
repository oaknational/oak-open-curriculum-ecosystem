[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-guards](../README.md) / lessonSummarySchema

# Variable: lessonSummarySchema

> `const` **lessonSummarySchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `contentGuidance`: `ZodUnion`\<readonly \[`ZodArray`\<`ZodObject`\<\{ `contentGuidanceArea`: `ZodString`; `contentGuidanceDescription`: `ZodString`; `contentGuidanceLabel`: `ZodString`; `supervisionlevel_id`: `ZodNumber`; \}, `$strict`\>\>, `ZodNull`\]\>; `downloadsAvailable`: `ZodBoolean`; `keyLearningPoints`: `ZodArray`\<`ZodObject`\<\{ `keyLearningPoint`: `ZodString`; \}, `$strict`\>\>; `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; `lessonKeywords`: `ZodArray`\<`ZodObject`\<\{ `description`: `ZodString`; `keyword`: `ZodString`; \}, `$strict`\>\>; `lessonTitle`: `ZodString`; `misconceptionsAndCommonMistakes`: `ZodArray`\<`ZodObject`\<\{ `misconception`: `ZodString`; `response`: `ZodString`; \}, `$strict`\>\>; `pupilLessonOutcome`: `ZodOptional`\<`ZodString`\>; `subjectSlug`: `ZodString`; `subjectTitle`: `ZodString`; `supervisionLevel`: `ZodUnion`\<readonly \[`ZodString`, `ZodNull`\]\>; `teacherTips`: `ZodArray`\<`ZodObject`\<\{ `teacherTip`: `ZodString`; \}, `$strict`\>\>; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; \}, `$strict`\> = `rawCurriculumSchemas.LessonSummaryResponseSchema`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/search-response-guards.ts:11

Schema for lesson summaries derived from the OpenAPI specification.
