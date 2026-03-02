[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / generateCanonicalUrl

# Function: generateCanonicalUrl()

> **generateCanonicalUrl**(`type`, `id`, `context?`): `string` \| `undefined`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/routing/url-helpers.d.ts:53

## Parameters

### type

`"subject"` | `"lesson"` | `"unit"` | `"sequence"` | `"thread"`

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
