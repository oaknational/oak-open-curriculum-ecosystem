# @oaknational/type-helpers

Typed helpers for own-key iteration and property access.

## Why This Package Exists

TypeScript deliberately widens `Object.keys()`, `Object.values()`, and
`Object.entries()` to broad string/any-based shapes. These helpers preserve
the caller's actual key and value types by iterating own enumerable string
keys with runtime guards instead of assertions.

The package intentionally stays small:

- It supports string-key iteration and typed get/set/membership helpers.
- It does not provide a generic `fromEntries` helper.
- It does not abstract symbol-key enumeration.

Call sites that need to rebuild objects should do so explicitly with a local
typed builder. Call sites that genuinely need symbol handling should model
that case directly.

## Helpers

| Helper                         | Replaces                       | Returns                      |
| ------------------------------ | ------------------------------ | ---------------------------- |
| `typeSafeKeys(obj)`            | `Object.keys(obj)`             | `Extract<keyof T, string>[]` |
| `typeSafeValues(obj)`          | `Object.values(obj)`           | `T[keyof T][]`               |
| `typeSafeEntries(obj)`         | `Object.entries(obj)`          | `[K, T[K]][]`                |
| `typeSafeGet(obj, key)`        | `Reflect.get(obj, key)`        | `T[K]`                       |
| `typeSafeSet(obj, key, value)` | `Reflect.set(obj, key, value)` | `void`                       |
| `typeSafeHas(obj, key)`        | `Reflect.has(obj, key)`        | `key is keyof T`             |
| `typeSafeHasOwn(obj, key)`     | `Object.hasOwn(obj, key)`      | `key is keyof T`             |

## Usage

```typescript
import { typeSafeEntries, typeSafeKeys } from '@oaknational/type-helpers';

const config: Readonly<{ host: string; port: number }> = {
  host: 'localhost',
  port: 3000,
};

const keys = typeSafeKeys(config);
const entries = typeSafeEntries(config);
```
