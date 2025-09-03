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

### executeToolCall

```ts
function executeToolCall(maybeToolName: unknown, maybeParams: unknown, client: PathBasedClient<paths, <templateLiteral>(…)>): Promise<ToolExecutionResult>
```

Ultra-thin executor - just validation and delegation to embedded executor

### typeSafeEntries

```ts
function typeSafeEntries(obj: T): <tuple>(…)[]
```

Typed entries (Object.entries)

### typeSafeFromEntries

```ts
function typeSafeFromEntries(iter: Iterable<<typeOperator>(…), any, any>): Record<K, V>
```

Typed fromEntries (Object.fromEntries)

### typeSafeGet

```ts
function typeSafeGet(obj: T, key: K): <indexedAccess>(…)
```

Typed value access (instead of Reflect.get)

### typeSafeHas

```ts
function typeSafeHas(obj: T, key: PropertyKey): <predicate>(…)
```

Membership check (instead of Reflect.has)

### typeSafeHasOwn

```ts
function typeSafeHasOwn(obj: T, key: PropertyKey): <predicate>(…)
```

Own-key check (typed)

### typeSafeKeys

```ts
function typeSafeKeys(obj: T): Extract<<typeOperator>(…), string>[]
```

Type safe object helpers

### typeSafeOwnKeys

```ts
function typeSafeOwnKeys(obj: T): <typeOperator>(…)[]
```

All own keys (instead of Reflect.ownKeys)

### typeSafeSet

```ts
function typeSafeSet(obj: T, key: K, value: <indexedAccess>(…)): void
```

Typed set (instead of Reflect.set)

### typeSafeValues

```ts
function typeSafeValues(obj: T): <indexedAccess>(…)[]
```

Typed values (Object.values)

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
