[**@oaknational/curriculum-sdk v0.8.0**](../../../../README.md)

---

[@oaknational/curriculum-sdk](../../../../README.md) / [src/types/search-response-guards](../README.md) / lessonSummarySchema

# Variable: lessonSummarySchema

> `const` **lessonSummarySchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `contentGuidance`: `ZodUnion`\<readonly \[`ZodArray`\<`ZodObject`\<\{ `contentGuidanceArea`: `ZodString`; `contentGuidanceDescription`: `ZodString`; `contentGuidanceLabel`: `ZodString`; `supervisionlevel_id`: `ZodNumber`; \}, `$strict`\>\>, `ZodNull`\]\>; `downloadsAvailable`: `ZodBoolean`; `keyLearningPoints`: `ZodArray`\<`ZodObject`\<\{ `keyLearningPoint`: `ZodString`; \}, `$strict`\>\>; `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; `lessonKeywords`: `ZodArray`\<`ZodObject`\<\{ `description`: `ZodString`; `keyword`: `ZodString`; \}, `$strict`\>\>; `lessonTitle`: `ZodString`; `misconceptionsAndCommonMistakes`: `ZodArray`\<`ZodObject`\<\{ `misconception`: `ZodString`; `response`: `ZodString`; \}, `$strict`\>\>; `pupilLessonOutcome`: `ZodOptional`\<`ZodString`\>; `subjectSlug`: `ZodString`; `subjectTitle`: `ZodString`; `supervisionLevel`: `ZodUnion`\<readonly \[`ZodString`, `ZodNull`\]\>; `teacherTips`: `ZodArray`\<`ZodObject`\<\{ `teacherTip`: `ZodString`; \}, `$strict`\>\>; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; \}, `$strict`\> = `rawCurriculumSchemas.LessonSummaryResponseSchema`

Defined in: [sdks/oak-curriculum-sdk/src/types/search-response-guards.ts:11](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts#L11)

Schema for lesson summaries derived from the OpenAPI specification.
