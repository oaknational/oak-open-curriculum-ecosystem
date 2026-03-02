[**@oaknational/curriculum-sdk v0.8.0**](../../../../README.md)

---

[@oaknational/curriculum-sdk](../../../../README.md) / [src/types/search-response-guards](../README.md) / subjectAssetsSchema

# Variable: subjectAssetsSchema

> `const` **subjectAssetsSchema**: `ZodArray`\<`ZodObject`\<\{ `assets`: `ZodArray`\<`ZodObject`\<\{ `label`: `ZodString`; `type`: `ZodEnum`\<\{ `exitQuiz`: `"exitQuiz"`; `exitQuizAnswers`: `"exitQuizAnswers"`; `slideDeck`: `"slideDeck"`; `starterQuiz`: `"starterQuiz"`; `starterQuizAnswers`: `"starterQuizAnswers"`; `supplementaryResource`: `"supplementaryResource"`; `video`: `"video"`; `worksheet`: `"worksheet"`; `worksheetAnswers`: `"worksheetAnswers"`; \}\>; `url`: `ZodString`; \}, `$strict`\>\>; `attribution`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; \}, `$strict`\>\> = `rawCurriculumSchemas.SubjectAssetsResponseSchema`

Defined in: [sdks/oak-curriculum-sdk/src/types/search-response-guards.ts:78](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts#L78)

Schema for subject assets derived from the OpenAPI specification.
