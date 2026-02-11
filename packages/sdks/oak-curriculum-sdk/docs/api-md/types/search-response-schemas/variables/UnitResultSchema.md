[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-schemas](../README.md) / UnitResultSchema

# Variable: UnitResultSchema

> `const` **UnitResultSchema**: `ZodObject`\<\{ `highlights`: `ZodDefault`\<`ZodArray`\<`ZodString`\>\>; `id`: `ZodString`; `rankScore`: `ZodNumber`; `unit`: `ZodNullable`\<`ZodObject`\<\{ `key_stage`: `ZodOptional`\<`ZodEnum`\<\{ `ks1`: `"ks1"`; `ks2`: `"ks2"`; `ks3`: `"ks3"`; `ks4`: `"ks4"`; \}\>\>; `subject_slug`: `ZodEnum`\<\{ `art`: `"art"`; `citizenship`: `"citizenship"`; `computing`: `"computing"`; `cooking-nutrition`: `"cooking-nutrition"`; `design-technology`: `"design-technology"`; `english`: `"english"`; `french`: `"french"`; `geography`: `"geography"`; `german`: `"german"`; `history`: `"history"`; `maths`: `"maths"`; `music`: `"music"`; `physical-education`: `"physical-education"`; `religious-education`: `"religious-education"`; `rshe-pshe`: `"rshe-pshe"`; `science`: `"science"`; `spanish`: `"spanish"`; \}\>; `unit_title`: `ZodString`; \}, `$strict`\>\>; \}, `$strict`\> = `GeneratedUnitResultSchema`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/search-response-schemas.ts:25

Schema describing an individual unit search result entry.
