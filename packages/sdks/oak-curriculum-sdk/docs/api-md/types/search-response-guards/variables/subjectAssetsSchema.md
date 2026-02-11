[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-guards](../README.md) / subjectAssetsSchema

# Variable: subjectAssetsSchema

> `const` **subjectAssetsSchema**: `ZodArray`\<`ZodObject`\<\{ `assets`: `ZodArray`\<`ZodObject`\<\{ `label`: `ZodString`; `type`: `ZodEnum`\<\{ `exitQuiz`: `"exitQuiz"`; `exitQuizAnswers`: `"exitQuizAnswers"`; `slideDeck`: `"slideDeck"`; `starterQuiz`: `"starterQuiz"`; `starterQuizAnswers`: `"starterQuizAnswers"`; `supplementaryResource`: `"supplementaryResource"`; `video`: `"video"`; `worksheet`: `"worksheet"`; `worksheetAnswers`: `"worksheetAnswers"`; \}\>; `url`: `ZodString`; \}, `$strict`\>\>; `attribution`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; \}, `$strict`\>\> = `rawCurriculumSchemas.SubjectAssetsResponseSchema`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/search-response-guards.ts:78

Schema for subject assets derived from the OpenAPI specification.
