[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../../../README.md)

***

[@oaknational/oak-curriculum-sdk](../../../../README.md) / [types/generated/search](../README.md) / isSearchSuggestionResponse

# Function: isSearchSuggestionResponse()

> **isSearchSuggestionResponse**(`value`): value is \{ cache: \{ ttlSeconds: number; version: string \}; suggestions: \{ contexts: \{ keyStages?: string\[\]; ks4OptionSlug?: string; phaseSlug?: string; sequenceId?: string; unitSlug?: string; years?: (string \| number)\[\] \}; keyStage?: "ks1" \| "ks2" \| "ks3" \| "ks4"; label: string; scope: "lessons" \| "units" \| "sequences"; subject?: "art" \| "citizenship" \| "computing" \| "cooking-nutrition" \| "design-technology" \| "english" \| "french" \| "geography" \| "german" \| "history" \| "maths" \| "music" \| "physical-education" \| "religious-education" \| "rshe-pshe" \| "science" \| "spanish"; url: string \}\[\] \}

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/search/suggestions.ts:80](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/search/suggestions.ts#L80)

Guard validating suggestion responses.

## Parameters

### value

`unknown`

## Returns

value is \{ cache: \{ ttlSeconds: number; version: string \}; suggestions: \{ contexts: \{ keyStages?: string\[\]; ks4OptionSlug?: string; phaseSlug?: string; sequenceId?: string; unitSlug?: string; years?: (string \| number)\[\] \}; keyStage?: "ks1" \| "ks2" \| "ks3" \| "ks4"; label: string; scope: "lessons" \| "units" \| "sequences"; subject?: "art" \| "citizenship" \| "computing" \| "cooking-nutrition" \| "design-technology" \| "english" \| "french" \| "geography" \| "german" \| "history" \| "maths" \| "music" \| "physical-education" \| "religious-education" \| "rshe-pshe" \| "science" \| "spanish"; url: string \}\[\] \}
