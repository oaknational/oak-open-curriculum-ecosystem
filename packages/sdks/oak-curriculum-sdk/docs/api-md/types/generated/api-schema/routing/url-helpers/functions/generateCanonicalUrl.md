[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../../README.md) / [types/generated/api-schema/routing/url-helpers](../README.md) / generateCanonicalUrl

# Function: generateCanonicalUrl()

> **generateCanonicalUrl**(`type`, `id`, `context?`): `string` \| `undefined`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/routing/url-helpers.ts:105](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/routing/url-helpers.ts#L105)

## Parameters

### type

`"lesson"` | `"subject"` | `"unit"` | `"sequence"` | `"thread"`

### id

`string`

### context?

#### subject?

\{ `keyStageSlugs?`: readonly `string`[]; \}

#### subject.keyStageSlugs?

readonly `string`[]

#### unit?

\{ `phaseSlug?`: `string`; `subjectSlug?`: `string`; \}

#### unit.phaseSlug?

`string`

#### unit.subjectSlug?

`string`

## Returns

`string` \| `undefined`
