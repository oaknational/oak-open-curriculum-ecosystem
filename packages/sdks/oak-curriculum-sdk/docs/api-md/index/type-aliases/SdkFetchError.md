[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / SdkFetchError

# Type Alias: SdkFetchError

> **SdkFetchError** = [`SdkNotFoundError`](../interfaces/SdkNotFoundError.md) \| [`SdkServerError`](../interfaces/SdkServerError.md) \| [`SdkRateLimitError`](../interfaces/SdkRateLimitError.md) \| [`SdkNetworkError`](../interfaces/SdkNetworkError.md) \| [`SdkValidationError`](../interfaces/SdkValidationError.md)

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/types/generated/api-schema/error-types/sdk-error-types.ts:17

Discriminated union of errors that can occur when fetching from the SDK.
Each variant has a `kind` discriminant for exhaustive switch statements.
