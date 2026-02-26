[**@oaknational/curriculum-sdk v0.8.0**](../../README.md)

---

[@oaknational/curriculum-sdk](../../README.md) / [src](../README.md) / typeSafeKeys

# Function: typeSafeKeys()

> **typeSafeKeys**\<`T`\>(`obj`): `Extract`\<keyof `T`, `string`\>[]

Defined in: core/type-helpers/dist/index.d.ts:10

Typed Object.\* wrappers — the ONE place where Object method type-widening
is centralised. TypeScript deliberately returns broad types from Object.keys
(string[]), Object.values (any[]), Object.entries ([string, any][]) etc.
These wrappers restore the specific key and value types via a single, audited
assertion per method. The rest of the codebase MUST use these helpers instead
of calling Object.keys/values/entries/fromEntries/getOwnPropertyNames/
getOwnPropertySymbols directly.

## Type Parameters

### T

`T` _extends_ `object`

## Parameters

### obj

`T`

## Returns

`Extract`\<keyof `T`, `string`\>[]
