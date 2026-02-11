[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / isAllSubject

# Function: isAllSubject()

> **isAllSubject**(`value`): value is "art" \| "citizenship" \| "computing" \| "cooking-nutrition" \| "design-technology" \| "english" \| "french" \| "geography" \| "german" \| "history" \| "maths" \| "music" \| "physical-education" \| "religious-education" \| "rshe-pshe" \| "science" \| "spanish" \| "physics" \| "chemistry" \| "biology" \| "combined-science"

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/subject-hierarchy.ts:238](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/subject-hierarchy.ts#L238)

Type guard: Check if a string is a valid subject (including KS4 variants).

This validates against all 21 subjects (17 canonical + 4 KS4 variants).
Use this for validating bulk data subject values.

## Parameters

### value

`string`

The string to check

## Returns

value is "art" \| "citizenship" \| "computing" \| "cooking-nutrition" \| "design-technology" \| "english" \| "french" \| "geography" \| "german" \| "history" \| "maths" \| "music" \| "physical-education" \| "religious-education" \| "rshe-pshe" \| "science" \| "spanish" \| "physics" \| "chemistry" \| "biology" \| "combined-science"

True if the value is a valid AllSubjectSlug

## Example

```typescript
isAllSubject('physics'); // → true (KS4 variant)
isAllSubject('maths'); // → true (canonical)
isAllSubject('invalid'); // → false
```
