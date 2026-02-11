[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-guards](../README.md) / subjectSequencesSchema

# Variable: subjectSequencesSchema

> `const` **subjectSequencesSchema**: `ZodArray`\<`ZodObject`\<\{ `canonicalUrl`: `ZodOptional`\<`ZodString`\>; `keyStages`: `ZodArray`\<`ZodObject`\<\{ `keyStageSlug`: `ZodString`; `keyStageTitle`: `ZodString`; \}, `$strict`\>\>; `ks4Options`: `ZodUnion`\<readonly \[`ZodObject`\<\{ `slug`: `ZodString`; `title`: `ZodString`; \}, `$strict`\>, `ZodNull`\]\>; `phaseSlug`: `ZodString`; `phaseTitle`: `ZodString`; `sequenceSlug`: `ZodString`; `years`: `ZodArray`\<`ZodNumber`\>; \}, `$strict`\>\> = `rawCurriculumSchemas.SubjectSequenceResponseSchema`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/search-response-guards.ts:17

Schema for subject sequences derived from the OpenAPI specification.
