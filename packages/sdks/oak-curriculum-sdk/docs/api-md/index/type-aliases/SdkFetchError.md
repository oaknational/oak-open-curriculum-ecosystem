[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / SdkFetchError

# Type Alias: SdkFetchError

> **SdkFetchError** = [`SdkNotFoundError`](../interfaces/SdkNotFoundError.md) \| [`SdkServerError`](../interfaces/SdkServerError.md) \| [`SdkRateLimitError`](../interfaces/SdkRateLimitError.md) \| [`SdkNetworkError`](../interfaces/SdkNetworkError.md) \| [`SdkValidationError`](../interfaces/SdkValidationError.md)

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:17](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L17)

Discriminated union of errors that can occur when fetching from the SDK.
Each variant has a `kind` discriminant for exhaustive switch statements.
