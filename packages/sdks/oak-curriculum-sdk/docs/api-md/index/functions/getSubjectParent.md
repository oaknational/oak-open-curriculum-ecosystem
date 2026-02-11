[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / getSubjectParent

# Function: getSubjectParent()

> **getSubjectParent**(`subject`): [`ParentSubjectSlug`](../type-aliases/ParentSubjectSlug.md)

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/subject-hierarchy.ts:218](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/subject-hierarchy.ts#L218)

Get the parent subject for any subject.

For science variants (physics, chemistry, biology, combined-science),
returns 'science'. For all other subjects, returns the subject itself.

## Parameters

### subject

A valid subject slug (AllSubjectSlug)

`"art"` | `"citizenship"` | `"computing"` | `"cooking-nutrition"` | `"design-technology"` | `"english"` | `"french"` | `"geography"` | `"german"` | `"history"` | `"maths"` | `"music"` | `"physical-education"` | `"religious-education"` | `"rshe-pshe"` | `"science"` | `"spanish"` | `"physics"` | `"chemistry"` | `"biology"` | `"combined-science"`

## Returns

[`ParentSubjectSlug`](../type-aliases/ParentSubjectSlug.md)

The parent subject slug (ParentSubjectSlug)

## Example

```typescript
getSubjectParent('physics'); // → 'science'
getSubjectParent('maths'); // → 'maths'
getSubjectParent('science'); // → 'science'
```
