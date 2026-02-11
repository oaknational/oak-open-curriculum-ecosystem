[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../../README.md)

---

[@oaknational/oak-curriculum-sdk](../../README.md) / [index](../README.md) / BaseApiClient

# Class: BaseApiClient

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:63](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L63)

Base wrapper that constructs both the method-based and path-based clients.

- Injects auth middleware with the provided API key.
- Creates a client bound to the configured `apiUrl`.
- Configures rate limiting and retry logic with exponential backoff.
- Exposes both client variants via getters.

Environment-agnostic: The API key must be passed in; no env access.

## Constructors

### Constructor

> **new BaseApiClient**(`config`): `BaseApiClient`

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:76](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L76)

Create a new Oak API client with optional rate limiting and retry configuration.

Supports both legacy string signature (API key only) and new config object.

#### Parameters

##### config

API key string (legacy) or full configuration object

`string` | [`OakClientConfig`](../interfaces/OakClientConfig.md)

#### Returns

`BaseApiClient`

## Accessors

### client

#### Get Signature

> **get** **client**(): [`OakApiClient`](../type-aliases/OakApiClient.md)

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:127](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L127)

##### Returns

[`OakApiClient`](../type-aliases/OakApiClient.md)

---

### pathBasedClient

#### Get Signature

> **get** **pathBasedClient**(): [`OakApiPathBasedClient`](../type-aliases/OakApiPathBasedClient.md)

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:131](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L131)

##### Returns

[`OakApiPathBasedClient`](../type-aliases/OakApiPathBasedClient.md)

---

### rateLimitTracker

#### Get Signature

> **get** **rateLimitTracker**(): [`RateLimitTracker`](../interfaces/RateLimitTracker.md)

Defined in: [packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:140](https://github.com/oaknational/oak-mcp-ecosystem/blob/f1af18965d39c4eda1de9a2e93a1faa5f4bdf4f1/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L140)

Get the rate limit tracker for monitoring API usage.
Provides information about request counts, rates, and rate limit status.

##### Returns

[`RateLimitTracker`](../interfaces/RateLimitTracker.md)
