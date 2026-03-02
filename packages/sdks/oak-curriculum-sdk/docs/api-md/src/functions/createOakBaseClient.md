[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / createOakBaseClient

# Function: createOakBaseClient()

> **createOakBaseClient**(`config`): [`BaseApiClient`](../classes/BaseApiClient.md)

Defined in: [sdks/oak-curriculum-sdk/src/client/index.ts:99](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/index.ts#L99)

Create the full Oak API base client with access to all features including rate limit tracking.

This returns the BaseApiClient instance which provides access to:

- The standard client interface
- The path-based client interface
- The rate limit tracker for monitoring API usage

## Parameters

### config

API key string (legacy) or configuration object

`string` | [`OakClientConfig`](../interfaces/OakClientConfig.md)

## Returns

[`BaseApiClient`](../classes/BaseApiClient.md)

The full BaseApiClient instance

## Example

```typescript
const baseClient = createOakBaseClient({
  apiKey: 'my-api-key',
  rateLimit: { minRequestInterval: 200 },
  retry: { maxRetries: 5 },
});

// Access the client
const data = await baseClient.client.GET('/subjects');

// Check rate limit status
const status = baseClient.rateLimitTracker.getStatus();
console.log('Remaining requests:', status.remaining);
```
