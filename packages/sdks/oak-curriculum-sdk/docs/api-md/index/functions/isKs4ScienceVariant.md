[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / isKs4ScienceVariant

# Function: isKs4ScienceVariant()

> **isKs4ScienceVariant**(`subject`): subject is "physics" \| "chemistry" \| "biology" \| "combined-science"

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/search/subject-hierarchy.ts:197

Type guard: Check if a subject is a KS4 science variant.

KS4 science variants are: physics, chemistry, biology, combined-science.
Note: 'science' itself is NOT a variant (it's the parent).

## Parameters

### subject

`string`

The subject string to check

## Returns

subject is "physics" \| "chemistry" \| "biology" \| "combined-science"

True if the subject is a KS4 science variant

## Example

```typescript
isKs4ScienceVariant('physics'); // → true
isKs4ScienceVariant('science'); // → false (it's the parent)
isKs4ScienceVariant('maths'); // → false
```
