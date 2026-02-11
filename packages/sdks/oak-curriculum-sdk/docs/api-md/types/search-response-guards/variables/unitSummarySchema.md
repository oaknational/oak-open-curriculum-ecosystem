[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-guards](../README.md) / unitSummarySchema

# Variable: unitSummarySchema

> `const` **unitSummarySchema**: `ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `categories`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `categorySlug`: `ZodOptional`\<`ZodString`\>; `categoryTitle`: `ZodString`; \}, `$strict`\>\>\>; `description`: `ZodOptional`\<`ZodString`\>; `keyStageSlug`: `ZodString`; `nationalCurriculumContent`: `ZodArray`\<`ZodString`\>; `notes`: `ZodOptional`\<`ZodString`\>; `phaseSlug`: `ZodString`; `priorKnowledgeRequirements`: `ZodArray`\<`ZodString`\>; `subjectSlug`: `ZodString`; `threads`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `order`: `ZodNumber`; `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>\>\>; `unitLessons`: `ZodArray`\<`ZodObject`\<\{ `lessonOrder`: `ZodOptional`\<`ZodNumber`\>; `lessonSlug`: `ZodString`; `lessonTitle`: `ZodString`; `state`: `ZodEnum`\<\{ `new`: `"new"`; `published`: `"published"`; \}\>; \}, `$strict`\>\>; `unitSlug`: `ZodString`; `unitTitle`: `ZodString`; `whyThisWhyNow`: `ZodOptional`\<`ZodString`\>; `year`: `ZodUnion`\<readonly \[`ZodNumber`, `ZodString`\]\>; `yearSlug`: `ZodString`; \}, `$strict`\> = `rawCurriculumSchemas.UnitSummaryResponseSchema`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts:14](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts#L14)

Schema for unit summaries derived from the OpenAPI specification.
