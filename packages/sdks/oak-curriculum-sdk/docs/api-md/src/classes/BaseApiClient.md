[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / BaseApiClient

# Class: BaseApiClient

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:90](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L90)

Base wrapper that constructs both the method-based and path-based clients.

- Injects auth middleware with the provided API key.
- Creates a client bound to the configured `apiUrl`.
- Configures rate limiting and retry logic with exponential backoff.
- Exposes both client variants via getters.

Environment-agnostic: The API key must be passed in; no env access.

## Constructors

### Constructor

> **new BaseApiClient**(`config`): `BaseApiClient`

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:103](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L103)

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

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:151](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L151)

##### Returns

[`OakApiClient`](../type-aliases/OakApiClient.md)

---

### pathBasedClient

#### Get Signature

> **get** **pathBasedClient**(): [`OakApiPathBasedClient`](../type-aliases/OakApiPathBasedClient.md)

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:155](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L155)

##### Returns

[`OakApiPathBasedClient`](../type-aliases/OakApiPathBasedClient.md)

---

### rateLimitTracker

#### Get Signature

> **get** **rateLimitTracker**(): [`RateLimitTracker`](../interfaces/RateLimitTracker.md)

Defined in: [sdks/oak-curriculum-sdk/src/client/oak-base-client.ts:164](https://github.com/oaknational/oak-mcp-ecosystem/blob/75b5bc735a49141f750685399d9a67677fd4a630/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L164)

Get the rate limit tracker for monitoring API usage.
Provides information about request counts, rates, and rate limit status.

##### Returns

[`RateLimitTracker`](../interfaces/RateLimitTracker.md)
