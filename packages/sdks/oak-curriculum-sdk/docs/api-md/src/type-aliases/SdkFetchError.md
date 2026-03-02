[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / SdkFetchError

# Type Alias: SdkFetchError

> **SdkFetchError** = [`SdkNotFoundError`](../interfaces/SdkNotFoundError.md) \| [`SdkLegallyRestrictedError`](../interfaces/SdkLegallyRestrictedError.md) \| [`SdkServerError`](../interfaces/SdkServerError.md) \| [`SdkRateLimitError`](../interfaces/SdkRateLimitError.md) \| [`SdkNetworkError`](../interfaces/SdkNetworkError.md) \| [`SdkValidationError`](../interfaces/SdkValidationError.md)

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:16

Discriminated union of errors that can occur when fetching from the SDK.
Each variant has a `kind` discriminant for exhaustive switch statements.
