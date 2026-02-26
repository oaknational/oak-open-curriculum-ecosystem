[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / createOakPathBasedClient

# Function: createOakPathBasedClient()

> **createOakPathBasedClient**(`config`): [`OakApiPathBasedClient`](../type-aliases/OakApiPathBasedClient.md)

Defined in: [sdks/oak-curriculum-sdk/src/client/index.ts:66](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/index.ts#L66)

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

```typescript
// Legacy usage (backwards compatible)
const client = createOakPathBasedClient('my-api-key');
```

```typescript
// New usage with rate limiting and retry configuration
const client = createOakPathBasedClient({
  apiKey: 'my-api-key',
  rateLimit: { minRequestInterval: 200 },
  retry: { maxRetries: 5 },
});
```
