[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / SdkNetworkError

# Interface: SdkNetworkError

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:67](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L67)

Network-level failure (timeout, DNS, connection refused).
The request never reached the server or response was incomplete.

## Properties

### cause

> `readonly` **cause**: `Error`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:70](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L70)

---

### kind

> `readonly` **kind**: `"network_error"`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:68](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L68)

---

### resource

> `readonly` **resource**: `string`

Defined in: [packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts:69](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/error-types/sdk-error-types.ts#L69)
