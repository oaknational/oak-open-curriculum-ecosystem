[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / createOakPathBasedClient

# Function: createOakPathBasedClient()

> **createOakPathBasedClient**(`config`): [`OakApiPathBasedClient`](../type-aliases/OakApiPathBasedClient.md)

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/index.ts:58](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/index.ts#L58)

Create an Oak API client using the path-indexed interface.

Supports both legacy API key string and new configuration object with
rate limiting and retry options.

Environment-agnostic: The SDK core never reads environment variables.
Always pass the API key explicitly.

## Parameters

### config

API key string (legacy) or configuration object

`string` | [`OakClientConfig`](../interfaces/OakClientConfig.md)

## Returns

[`OakApiPathBasedClient`](../type-aliases/OakApiPathBasedClient.md)

The path-based `OakApiPathBasedClient` instance

## Examples

```ts
// Legacy usage (backwards compatible)
const client = createOakPathBasedClient('my-api-key');
```

```ts
// New usage with rate limiting and retry configuration
const client = createOakPathBasedClient({
  apiKey: 'my-api-key',
  rateLimit: { minRequestInterval: 200 },
  retry: { maxRetries: 5 },
});
```
