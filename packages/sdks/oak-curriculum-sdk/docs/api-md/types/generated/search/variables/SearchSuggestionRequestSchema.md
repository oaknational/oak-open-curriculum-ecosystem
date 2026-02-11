[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / SearchSuggestionRequestSchema

# Variable: SearchSuggestionRequestSchema

> `const` **SearchSuggestionRequestSchema**: `ZodObject`\<\{ `keyStage`: `ZodOptional`\<`ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>\>; `limit`: `ZodOptional`\<`ZodNumber`\>; `phaseSlug`: `ZodOptional`\<`ZodString`\>; `prefix`: `ZodString`; `scope`: `ZodEnum`\<\{ `lessons`: `"lessons"`; `sequences`: `"sequences"`; `units`: `"units"`; \}\>; `subject`: `ZodOptional`\<`ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>\>; \}, `$strict`\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/suggestions.ts:60

Zod schema for suggestion request payloads.
