[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / createOakBaseClient

# Function: createOakBaseClient()

> **createOakBaseClient**(`config`): [`BaseApiClient`](../classes/BaseApiClient.md)

Defined in: packages/sdks/oak-curriculum-sdk/docs/\_typedoc_src/client/index.ts:89

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

```ts
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
