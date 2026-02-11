[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / SearchSuggestionItemSchema

# Variable: SearchSuggestionItemSchema

> `const` **SearchSuggestionItemSchema**: `ZodObject`\<\{ `contexts`: `ZodDefault`\<`ZodObject`\<\{ `keyStages`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `ks4OptionSlug`: `ZodOptional`\<`ZodString`\>; `phaseSlug`: `ZodOptional`\<`ZodString`\>; `sequenceId`: `ZodOptional`\<`ZodString`\>; `unitSlug`: `ZodOptional`\<`ZodString`\>; `years`: `ZodOptional`\<`ZodArray`\<`ZodUnion`\<readonly \[`ZodNumber`, `ZodString`\]\>\>\>; \}, `$strict`\>\>; `keyStage`: `ZodOptional`\<`ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>\>; `label`: `ZodString`; `scope`: `ZodEnum`\<\{ `lessons`: `"lessons"`; `sequences`: `"sequences"`; `units`: `"units"`; \}\>; `subject`: `ZodOptional`\<`ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>\>; `url`: `ZodString`; \}, `$strict`\>

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/search/suggestions.ts:28

Zod schema describing an individual suggestion entry.
