# ADR-088: Result Pattern for Explicit Error Handling

## Status

Accepted

## Context

### The Problem with Exceptions

Traditional exception-based error handling has several fundamental issues:

1. **Invisible Control Flow**: Exceptions create hidden control flow paths. Any function call might throw, but this is not visible in the function signature. The caller cannot know from the type signature alone what errors might occur.

2. **Stringly-Typed Errors**: Catching errors often degrades to parsing error messages:

   ```typescript
   // ❌ Fragile: depends on error message format
   try {
     await fetchData();
   } catch (e) {
     if (e.message.includes('404')) {
       /* handle not found */
     }
     if (e.message.includes('500')) {
       /* handle server error */
     }
   }
   ```

3. **Easy to Forget**: Unlike return values, exceptions don't force handling. Unhandled exceptions become runtime crashes. Linters and type-checkers cannot enforce that all error cases are handled.

4. **Breaks Composition**: Exception-throwing functions don't compose well. Each layer must either handle, wrap, or re-throw—creating verbose, nested try-catch blocks.

5. **Information Loss**: By the time an error propagates up several layers, structured information is often lost, leaving only a string message.

### The Result Pattern

The **Result pattern** (also known as Either, Try, or Outcome in other languages) encodes success/failure in the type system:

```typescript
type Result<T, E> = Ok<T> | Err<E>;
```

- `Ok<T>` represents success, containing a value of type `T`
- `Err<E>` represents failure, containing an error of type `E`

This pattern forces explicit handling of both cases at compile time.

### Industry Adoption

The Result pattern is canonical in modern language design:

| Language | Type Name                  | Usage                        |
| -------- | -------------------------- | ---------------------------- |
| Rust     | `Result<T, E>`             | All fallible operations      |
| Go       | `(T, error)`               | Convention for error returns |
| Swift    | `Result<Success, Failure>` | Network calls, parsing       |
| Kotlin   | `Result<T>`                | Async operations             |
| Haskell  | `Either a b`               | Functional error handling    |
| Scala    | `Either[L, R]`             | Error handling in FP         |

TypeScript libraries like `neverthrow`, `fp-ts`, and `true-myth` implement this pattern.

## Decision

**We adopt the Result pattern as the standard mechanism for error handling in fallible operations throughout the codebase.**

### Core Types

We use the existing `@oaknational/result` package:

```typescript
import { ok, err, type Result, isOk, isErr } from '@oaknational/result';
```

### Typed Error Discriminated Unions

For operations with multiple failure modes, define a discriminated union of error types:

```typescript
/** Errors that can occur when fetching from the SDK. */
export type SdkFetchError =
  | { readonly kind: 'not_found'; readonly resource: string }
  | { readonly kind: 'server_error'; readonly status: number; readonly message: string }
  | { readonly kind: 'rate_limited'; readonly retryAfter: number }
  | { readonly kind: 'network_error'; readonly cause: Error };
```

### When to Use Result vs Exceptions

#### Use Result For:

1. **Expected failure modes**: Operations that can fail in predictable ways
   - API calls (404, 500, rate limits)
   - Parsing/validation (invalid format)
   - Resource access (not found, permission denied)
   - Business logic failures (insufficient funds, expired token)

2. **Operations where callers need to make decisions**: When the failure mode determines the next action

3. **Boundary crossings**: Data entering/leaving the system

#### Keep Exceptions For:

1. **Programming errors**: Logic bugs that should crash
   - Null reference on required value
   - Index out of bounds
   - Type assertion failures

2. **Unrecoverable states**: System-level failures
   - Out of memory
   - Configuration missing at startup
   - Corrupted invariants

3. **Third-party libraries**: That throw exceptions (wrap them at boundaries)

### Conversion at Boundaries

When calling exception-throwing code, convert to Result at the boundary:

```typescript
/** Wrap exception-throwing SDK call in Result. */
async function safeFetch<T>(
  operation: () => Promise<T>,
  resource: string,
): Promise<Result<T, SdkFetchError>> {
  try {
    const value = await operation();
    return ok(value);
  } catch (error) {
    return err(classifyError(error, resource));
  }
}

/** Classify an exception into a typed error. */
function classifyError(error: unknown, resource: string): SdkFetchError {
  if (!(error instanceof Error)) {
    return { kind: 'network_error', cause: new Error(String(error)) };
  }

  const message = error.message;
  if (message.includes('404')) {
    return { kind: 'not_found', resource };
  }
  if (message.includes('429')) {
    return { kind: 'rate_limited', retryAfter: 60 };
  }
  if (/50[0-4]/.test(message)) {
    const status = parseInt(message.match(/50[0-4]/)?.[0] ?? '500', 10);
    return { kind: 'server_error', status, message };
  }
  return { kind: 'network_error', cause: error };
}
```

### Handling Results

#### Pattern 1: Explicit Branching (Preferred)

```typescript
const result = await fetchUnitSummary(slug);

if (!result.ok) {
  switch (result.error.kind) {
    case 'not_found':
      logger.warn('Unit not found, skipping', { slug: result.error.resource });
      return null;
    case 'server_error':
      logger.warn('Server error, skipping', { status: result.error.status });
      return null;
    case 'rate_limited':
      await delay(result.error.retryAfter * 1000);
      return fetchUnitSummary(slug); // Retry
    case 'network_error':
      throw result.error.cause; // Propagate unrecoverable
  }
}

// TypeScript knows result.ok is true here
const summary = result.value;
```

#### Pattern 2: Early Return with Type Guard

```typescript
const result = await fetchUnitSummary(slug);

if (isErr(result)) {
  return handleError(result.error);
}

// result.value is now available with correct type
doSomethingWith(result.value);
```

#### Pattern 3: Map/FlatMap for Composition

```typescript
import { map, flatMap, unwrapOr } from '@oaknational/result';

const result = await fetchUnit(slug);
const lessons = map(result, (unit) => unit.lessons);
const count = unwrapOr(
  map(lessons, (l) => l.length),
  0,
);
```

### Exhaust Checking

TypeScript's exhaustiveness checking ensures all error cases are handled:

```typescript
function handleError(error: SdkFetchError): void {
  switch (error.kind) {
    case 'not_found':
      // handle
      break;
    case 'server_error':
      // handle
      break;
    case 'rate_limited':
      // handle
      break;
    case 'network_error':
      // handle
      break;
    default:
      // TypeScript error if we miss a case
      const exhaustive: never = error;
      throw new Error(`Unhandled error kind: ${exhaustive}`);
  }
}
```

### Async Result Utilities

For async operations, use the async wrappers:

```typescript
/** Try an async operation, returning Result. */
async function tryAsync<T, E>(
  operation: () => Promise<T>,
  mapError: (e: unknown) => E,
): Promise<Result<T, E>> {
  try {
    return ok(await operation());
  } catch (e) {
    return err(mapError(e));
  }
}
```

## Rationale

### Why This Approach

1. **Type Safety**: Errors are part of the function signature. Callers must handle them.

2. **Explicit Control Flow**: No hidden throw paths. The type system documents all failure modes.

3. **Composition**: Results compose cleanly with map, flatMap, and other combinators.

4. **Exhaustiveness**: Switch statements with discriminated unions ensure all cases are handled. Adding a new error kind causes compile errors at all call sites.

5. **Information Preservation**: Structured errors retain context through all layers.

6. **Testability**: Error paths are explicit and easily unit-tested without mocking throw behavior.

### Trade-offs

#### Advantages

- Compile-time safety for error handling
- Self-documenting APIs (errors visible in types)
- No hidden control flow
- Better composition
- Easier testing
- Forces consideration of failure modes

#### Disadvantages

- More verbose than exception throwing
- Learning curve for developers used to exceptions
- Some boilerplate for error type definitions
- Interop with exception-throwing libraries requires wrapping

## Consequences

### Positive

1. **Ingestion becomes resilient**: 404/500 errors are handled explicitly with proper logging and skip behavior, not crashes.

2. **SDK adapter documents failure modes**: Return types show exactly what can go wrong.

3. **No stringly-typed errors**: Error classification happens once at the boundary, then typed throughout.

4. **Compile-time enforcement**: Adding new error types forces handling at all call sites.

### Negative

1. **Migration effort**: Existing code using exceptions needs refactoring.

2. **Verbose**: More lines of code than simple throw/catch.

3. **Discipline required**: Developers must follow the pattern consistently.

### Neutral

1. **Performance**: Similar to exceptions in practice (no try-catch JIT deoptimization, but slightly more allocation for Result objects).

## Implementation Notes

### Existing Infrastructure

- `@oaknational/result` package exists at `packages/libs/result`
- Provides `ok`, `err`, `isOk`, `isErr`, `map`, `flatMap`, `mapErr`, `unwrap`, `unwrapOr`, `unwrapOrElse`

### Migration Path

1. Define typed error unions for each domain
2. Wrap exception-throwing calls at boundaries
3. Propagate Results through the call stack
4. Handle explicitly at decision points

### Example: SDK Adapter

```typescript
// Before: throws on error
async function getUnitSummary(slug: string): Promise<UnitSummary> {
  const res = await client.GET('/units/{unit}/summary', { params: { path: { unit: slug } } });
  assertSdkOk(res); // throws!
  return res.data;
}

// After: returns Result
async function getUnitSummary(slug: string): Promise<Result<UnitSummary, SdkFetchError>> {
  const res = await client.GET('/units/{unit}/summary', { params: { path: { unit: slug } } });
  if (!res.response.ok) {
    return err(classifyHttpError(res.response, slug));
  }
  return ok(res.data);
}
```

## References

- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/) - Scott Wlaschin
- [Rust Error Handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html)
- [ADR-054: Tool-Level Auth Error Interception](054-tool-level-auth-error-interception.md) - Uses Result pattern in tool execution
- [rules.md](../../.agent/directives-and-memory/rules.md) - "Handle All Cases Explicitly - Don't throw, use the result pattern"

