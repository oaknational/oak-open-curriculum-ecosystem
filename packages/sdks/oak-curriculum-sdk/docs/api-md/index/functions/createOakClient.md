[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / createOakClient

# Function: createOakClient()

> **createOakClient**(`config`): [`OakApiClient`](../type-aliases/OakApiClient.md)

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/client/index.ts:28

Create an Oak API client using the OpenAPI-Fetch style interface.

Supports both legacy API key string and new configuration object with
rate limiting and retry options.

Environment-agnostic: The SDK core never reads environment variables.
Always pass the API key explicitly.

## Parameters

### config

API key string (legacy) or configuration object

`string` | [`OakClientConfig`](../interfaces/OakClientConfig.md)

## Returns

[`OakApiClient`](../type-aliases/OakApiClient.md)

The method-based `OakApiClient` instance

## Examples

```ts
// Legacy usage (backwards compatible)
const client = createOakClient('my-api-key');
```

```ts
// New usage with rate limiting and retry configuration
const client = createOakClient({
  apiKey: 'my-api-key',
  rateLimit: { minRequestInterval: 200 },
  retry: { maxRetries: 5 },
});
```
