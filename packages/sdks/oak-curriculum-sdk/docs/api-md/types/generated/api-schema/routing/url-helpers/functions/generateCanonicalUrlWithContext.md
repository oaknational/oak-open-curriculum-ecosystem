[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../../../README.md) / [types/generated/api-schema/routing/url-helpers](../README.md) / generateCanonicalUrlWithContext

# Function: generateCanonicalUrlWithContext()

> **generateCanonicalUrlWithContext**(`type`, `id`, `context?`): `string` \| `null`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/routing/url-helpers.ts:62](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/routing/url-helpers.ts#L62)

Generate a canonical URL for a resource with context.

## Parameters

### type

The content type ('lesson', 'sequence', 'unit', 'subject', or 'thread')

`"lesson"` | `"subject"` | `"unit"` | `"sequence"` | `"thread"`

### id

`string`

The ID of the resource

### context?

Context for unit (subjectSlug, phaseSlug) or subject (keyStageSlugs)

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

`string` \| `null`

The canonical URL, or `null` for threads (no website equivalent)

## Throws

TypeError if content type is unsupported or required context is missing

Return semantics:
- `string`: Valid canonical URL
- `null`: Entity type has no canonical URL (e.g., threads)
- Throws: Invalid type or missing required context (fail fast)
