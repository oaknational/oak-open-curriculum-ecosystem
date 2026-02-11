[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-guards](../README.md) / subjectSequencesSchema

# Variable: subjectSequencesSchema

> `const` **subjectSequencesSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `keyStages`: `ZodArray`\<`ZodObject`\<\{ `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; \}, `$strict`\>\>; `ks4Options`: `ZodUnion`\<readonly \[`ZodObject`\<\{ `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>, `ZodNull`\]\>; `phaseSlug`: `ZodString`; `phaseTitle`: `ZodString`; `sequenceSlug`: `ZodString`; `years`: `ZodArray`\<`ZodNumber`\>; \}, `$strict`\>\> = `rawCurriculumSchemas.SubjectSequenceResponseSchema`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts:17](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts#L17)

Schema for subject sequences derived from the OpenAPI specification.
