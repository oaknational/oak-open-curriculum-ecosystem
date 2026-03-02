[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / SdkNotFoundError

# Interface: SdkNotFoundError

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:24

Resource was not found (HTTP 404).

The resource does not exist in the API. This is distinct from
`legally_restricted` (HTTP 451) where the resource exists but
cannot be accessed for legal reasons.

## Properties

### kind

> `readonly` **kind**: `"not_found"`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:25

---

### resource

> `readonly` **resource**: `string`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:26

---

### resourceType

> `readonly` **resourceType**: [`ResourceType`](../type-aliases/ResourceType.md)

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:27
