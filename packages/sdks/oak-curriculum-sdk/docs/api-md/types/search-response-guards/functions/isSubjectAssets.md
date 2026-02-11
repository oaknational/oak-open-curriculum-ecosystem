[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../../README.md) / [types/search-response-guards](../README.md) / isSubjectAssets

# Function: isSubjectAssets()

> **isSubjectAssets**(`v`): v is \{ assets: \{ label: string; type: "slideDeck" \| "exitQuiz" \| "exitQuizAnswers" \| "starterQuiz" \| "starterQuizAnswers" \| "supplementaryResource" \| "video" \| "worksheet" \| "worksheetAnswers"; url: string \}\[\]; attribution?: string\[\]; canonicalUrl?: string; lessonSlug: string; lessonTitle: string \}\[\]

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts:91](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/search-response-guards.ts#L91)

Type guard for subject assets response.

## Parameters

### v

`unknown`

Value to check

## Returns

v is \{ assets: \{ label: string; type: "slideDeck" \| "exitQuiz" \| "exitQuizAnswers" \| "starterQuiz" \| "starterQuizAnswers" \| "supplementaryResource" \| "video" \| "worksheet" \| "worksheetAnswers"; url: string \}\[\]; attribution?: string\[\]; canonicalUrl?: string; lessonSlug: string; lessonTitle: string \}\[\]

true if v is a valid SubjectAssets array
