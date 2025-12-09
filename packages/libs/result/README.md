# @oaknational/result

Result<T, E> type for explicit error handling without exceptions.

## Purpose

Provides a type-safe way to handle errors without throwing exceptions. Forces explicit handling of both success and error cases at compile time, following the schema-first principle of making impossible states unrepresentable.

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

### Unwrapping

- `unwrap<T, E>(result)` - Get value or throw (use sparingly)
- `unwrapOr<T, E>(result, defaultValue)` - Get value or default
- `unwrapOrElse<T, E>(result, fn)` - Get value or compute default

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

