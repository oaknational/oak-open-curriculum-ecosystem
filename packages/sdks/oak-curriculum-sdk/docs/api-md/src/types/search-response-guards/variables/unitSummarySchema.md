[**@oaknational/curriculum-sdk v0.8.0**](../../../../README.md)

---

[@oaknational/curriculum-sdk](../../../../README.md) / [src/types/search-response-guards](../README.md) / unitSummarySchema

# Variable: unitSummarySchema

> `const` **unitSummarySchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `categories`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `categorySlug`: `ZodOptional`\<`ZodString`\>; `categoryTitle`: `ZodString`; \}, `$strict`\>\>\>; `description`: `ZodOptional`\<`ZodString`\>; `keyStageSlug`: `ZodString`; `nationalCurriculumContent`: `ZodArray`\<`ZodString`\>; `notes`: `ZodOptional`\<`ZodString`\>; `phaseSlug`: `ZodString`; `priorKnowledgeRequirements`: `ZodArray`\<`ZodString`\>; `subjectSlug`: `ZodString`; `threads`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `order`: `ZodNumber`; `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>\>\>; `unitLessons`: `ZodArray`\<`ZodObject`\<\{ `lessonOrder`: `ZodOptional`\<`ZodNumber`\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; `state`: `ZodEnum`\<\{ `new`: `"new"`; `published`: `"published"`; \}\>; \}, `$strict`\>\>; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; `whyThisWhyNow`: `ZodOptional`\<`ZodString`\>; `year`: `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`\]\>; `yearSlug`: `ZodString`; \}, `$strict`\> = `rawCurriculumSchemas.UnitSummaryResponseSchema`

Defined in: [sdks/oak-curriculum-sdk/src/types/search-response-guards.ts:14](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts#L14)

Schema for unit summaries derived from the OpenAPI specification.
