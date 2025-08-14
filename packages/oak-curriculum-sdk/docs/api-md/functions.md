# Functions

### createOakClient

```ts
function createOakClient(apiKey: string): OakApiClient;
```

Create an Oak API client using the OpenAPI-Fetch style interface.

Environment-agnostic: The SDK core never reads environment variables.
Always pass the API key explicitly.

### createOakPathBasedClient

```ts
function createOakPathBasedClient(apiKey: string): OakApiPathBasedClient;
```

Create an Oak API client using the path-indexed interface.

Environment-agnostic: The SDK core never reads environment variables.
Always pass the API key explicitly.

### validateRequest

```ts
function validateRequest(
  path: string,
  method: HttpMethod,
  args: unknown,
): ValidationResult<unknown>;
```

Validates request parameters against the schema for the given path and method
Uses generated schemas from the endpoints file

### validateResponse

```ts
function validateResponse(
  path: string,
  method: HttpMethod,
  statusCode: number,
  response: unknown,
): ValidationResult<Record<string, unknown>>;
```

Validates response data for an API operation
