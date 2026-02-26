[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / SdkLegallyRestrictedError

# Interface: SdkLegallyRestrictedError

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:40

Resource is unavailable for legal reasons (HTTP 451).

The resource exists but is legally restricted (e.g. TPC-restricted
transcripts). This is semantically distinct from `not_found` (HTTP 404):

- 404: resource does not exist
- 451: resource exists but is legally inaccessible

Both are permanent and non-retryable, but have different implications
for caching, user messaging, observability, and audit trails.

## Properties

### kind

> `readonly` **kind**: `"legally_restricted"`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:41

---

### resource

> `readonly` **resource**: `string`

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:42

---

### resourceType

> `readonly` **resourceType**: [`ResourceType`](../type-aliases/ResourceType.md)

Defined in: sdks/oak-sdk-codegen/dist/types/generated/api-schema/error-types/sdk-error-types.d.ts:43
