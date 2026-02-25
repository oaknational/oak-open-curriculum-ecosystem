# @oaknational/type-helpers

Typed wrappers for `Object.*` and `Reflect.*` methods — the single audited
location where type-widening assertions are permitted.

## Why This Package Exists

TypeScript deliberately returns broad types from `Object.keys()` (`string[]`),
`Object.values()` (`any[]`), `Object.entries()` (`[string, any][]`), etc.
Similarly, `Reflect.get()` returns `any` and `Reflect.ownKeys()` returns
`(string | symbol)[]`. These methods destroy the specific key and value types
that the rest of the type system preserves.

The ESLint `@typescript-eslint/no-restricted-types` rule in the `strict`
config bans direct use of `Object.keys`, `Object.values`, `Object.entries`,
`Object.fromEntries`, `Object.getOwnPropertyNames`,
`Object.getOwnPropertySymbols`, `Reflect.get`, `Reflect.has`,
`Reflect.ownKeys`, and `Reflect.set`. The `no-restricted-properties` rule
enforces this at the call-site level.

This package provides typed alternatives that restore the specific key and
value types via a single, audited assertion per method.

## Type-Assertion Discipline

Each helper contains exactly one `as` type assertion. These are the ONLY
permitted type assertions in the codebase (enforced by the
`@typescript-eslint/consistent-type-assertions` ESLint rule, which is
disabled only in this file via a scoped override). The assertions are
vetted for correctness — they narrow from TypeScript's deliberately broad
return types to the specific types that the caller's context guarantees.

**Exception for plain objects**: When iterating over objects whose key type
genuinely IS `string` (e.g. Zod `.shape` objects), `for...in` is acceptable
as a language construct that does not widen types.

## Helpers

| Helper                         | Replaces                       | Returns                      |
| ------------------------------ | ------------------------------ | ---------------------------- |
| `typeSafeKeys(obj)`            | `Object.keys(obj)`             | `Extract<keyof T, string>[]` |
| `typeSafeValues(obj)`          | `Object.values(obj)`           | `T[keyof T][]`               |
| `typeSafeEntries(obj)`         | `Object.entries(obj)`          | `[K, T[K]][]`                |
| `typeSafeFromEntries(iter)`    | `Object.fromEntries(iter)`     | `Record<K, V>`               |
| `typeSafeGet(obj, key)`        | `Reflect.get(obj, key)`        | `T[K]`                       |
| `typeSafeSet(obj, key, value)` | `Reflect.set(obj, key, value)` | `void`                       |
| `typeSafeHas(obj, key)`        | `Reflect.has(obj, key)`        | `key is keyof T`             |
| `typeSafeHasOwn(obj, key)`     | `Object.hasOwn(obj, key)`      | `key is keyof T`             |
| `typeSafeOwnKeys(obj)`         | `Reflect.ownKeys(obj)`         | `(keyof T)[]`                |

## Usage

```typescript
import { typeSafeKeys, typeSafeEntries } from '@oaknational/type-helpers';

const config = { host: 'localhost', port: 3000 } as const;

// Returns ('host' | 'port')[] instead of string[]
const keys = typeSafeKeys(config);

// Returns ['host', 'localhost'] | ['port', 3000] entries
const entries = typeSafeEntries(config);
```

## References

- Created during ADR-108 Step 1 architecture remediation (N3)
- ESLint enforcement: `@oaknational/eslint-plugin-standards` strict config
