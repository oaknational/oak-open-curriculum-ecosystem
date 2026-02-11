[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../../README.md) / [types/generated/api-schema/routing/url-helpers](../README.md) / generateCanonicalUrl

# Function: generateCanonicalUrl()

> **generateCanonicalUrl**(`type`, `id`, `context?`): `string` \| `undefined`

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc\_src/types/generated/api-schema/routing/url-helpers.ts:105

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
