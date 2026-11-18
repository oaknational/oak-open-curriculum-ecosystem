# @oaknational/result

Result<T, E> type for explicit error handling without exceptions.

## Purpose

Provides a way to handle errors without throwing exceptions. TypeScript rejects a read of
`value` or `error` from a `Result<T, E>` until the union is narrowed to one arm; checking
`ok`, directly or with `isOk` or `isErr`, narrows it. The type does not make a caller handle
the failure: a caller can ignore a returned `Result`, substitute a default with `unwrapOr`
or `unwrapOrElse`, or call `unwrap`, which throws on an `Err`. It follows the schema-first
principle of making impossible states unrepresentable at the type level.

## Installation

```bash
pnpm add @oaknational/result
```

## Usage

### Basic Example

```typescript
import { ok, err, type Result } from '@oaknational/result';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err('Division by zero');
  }
  return ok(a / b);
}

const result = divide(10, 2);
if (result.ok) {
  console.log('Result:', result.value); // 5
} else {
  console.error('Error:', result.error);
}
```

### Pattern Matching

```typescript
import { isOk, isErr } from '@oaknational/result';

if (isOk(result)) {
  // TypeScript knows result.value is available
  console.log(result.value);
} else {
  // TypeScript knows result.error is available
  console.error(result.error);
}
```

### Chaining Operations

```typescript
import { map, flatMap } from '@oaknational/result';

const result = ok(5);

// Transform Ok values
const doubled = map(result, (x) => x * 2); // Ok(10)

// Chain Results
const chained = flatMap(result, (x) => (x > 0 ? ok(x * 2) : err('negative')));
```

### Error Transformation

```typescript
import { mapErr, unwrapOr } from '@oaknational/result';

// Transform error type
const result = err('404');
const withCode = mapErr(result, (code) => parseInt(code, 10));

// Provide default value
const value = unwrapOr(result, 0);
```

## API

### Types

- `Result<T, E>` - The union `Ok<T> | Err<E>`
- `Ok<T>` - The success arm, `{ ok: true, value: T }`
- `Err<E>` - The failure arm, `{ ok: false, error: E }`

### Creating Results

- `ok<T>(value: T): Ok<T>` - Create a successful result
- `err<E>(error: E): Err<E>` - Create an error result

### Type Guards

- `isOk<T, E>(result: Result<T, E>): result is Ok<T>` - Check if result is Ok
- `isErr<T, E>(result: Result<T, E>): result is Err<E>` - Check if result is Err

### Transformations

- `map<T, U, E>(result, fn)` - Transform Ok value
- `flatMap<T, U, E>(result, fn)` - Chain Results
- `mapErr<T, E, F>(result, fn)` - Transform Err value
- `collect<T, E>(results)` - Combine an iterable of Results into one Result of the values, or the first Err

### Unwrapping

- `unwrap<T, E>(result)` - Get value or throw (use sparingly)
- `unwrapErr<T, E>(result)` - Get error or throw (unwrap's inverse, for expected failures)
- `unwrapOr<T, E>(result, defaultValue)` - Get value or default
- `unwrapOrElse<T, E>(result, fn)` - Get value or compute default
- `unwrapOrThrow<T>(result)` - Get value or throw the Err's own `Error` object unchanged (the Err payload must be an `Error`)

### Exhaustiveness

- `assertNeverResult<E>(value: never, makeError)` - Turn an unreachable branch into an Err at runtime, so an exhaustive switch over a discriminated union stays exhaustive at compile time

## Philosophy

Result<T, E> enforces the "fail fast and hard" principle from our rules while providing explicit error information. It makes error handling:

1. **Explicit** - Cannot ignore errors
2. **Type-safe** - Errors are typed and checked
3. **Composable** - Chain operations safely
4. **Predictable** - No hidden control flow

## Integration with Schema-First

Result<T, E> complements our schema-first architecture by:

- Forcing explicit handling of all validation failures
- Making error states part of the type signature
- Enabling exhaustive case analysis at compile time

## Testing

Run tests with:

```bash
pnpm test
```

## License

MIT
