[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../README.md) / [types/generated/search/responses.units](../README.md) / UnitResultSchema

# Variable: UnitResultSchema

> `const` **UnitResultSchema**: `ZodObject`\<\{ `highlights`: `ZodDefault`\<`ZodArray`\<`ZodString`\>\>; `id`: `ZodString`; `rankScore`: `ZodNumber`; `unit`: `ZodNullable`\<`ZodObject`\<\{ `key_stage`: `ZodOptional`\<`ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>\>; `subject_slug`: `ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>; `unit_title`: `ZodString`; \}, `$strict`\>\>; \}, `$strict`\>

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.units.ts:24](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/responses.units.ts#L24)

Schema describing an individual unit search result entry.
