[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / SearchSuggestionResponseSchema

# Variable: SearchSuggestionResponseSchema

> `const` **SearchSuggestionResponseSchema**: `ZodObject`\<\{ `cache`: `ZodDefault`\<`ZodObject`\<\{ `ttlSeconds`: `ZodNumber`; `version`: `ZodString`; \}, `$strict`\>\>; `suggestions`: `ZodDefault`\<`ZodArray`\<`ZodObject`\<\{ `contexts`: `ZodDefault`\<`ZodObject`\<\{ `keyStages`: `ZodOptional`\<`ZodArray`\<...\>\>; `ks4OptionSlug`: `ZodOptional`\<`ZodString`\>; `phaseSlug`: `ZodOptional`\<`ZodString`\>; `sequenceId`: `ZodOptional`\<`ZodString`\>; `unitSlug`: `ZodOptional`\<`ZodString`\>; `years`: `ZodOptional`\<`ZodArray`\<...\>\>; \}, `$strict`\>\>; `keyStage`: `ZodOptional`\<`ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>\>; `label`: `ZodString`; `scope`: `ZodEnum`\<\{ `lessons`: `"lessons"`; `sequences`: `"sequences"`; `units`: `"units"`; \}\>; `subject`: `ZodOptional`\<`ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>\>; `url`: `ZodString`; \}, `$strict`\>\>\>; \}, `$strict`\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/suggestions.ts:43](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/suggestions.ts#L43)

Zod schema for suggestion response envelopes.
