# No Type Shortcuts

Never use `as`, `any`, `!`, `Record<string, unknown>`, `{ [key: string]: unknown }`, `Object.*` methods, `Reflect.*` methods, `isObject` type predicates, `z.unknown()` (where a concrete schema exists), `z.record(z.string(), z.unknown())`, or hand-crafted Zod schemas that duplicate generated shapes. They all disable the type system. Preserve type information; never widen.

Exceptions: `as const` and `satisfies` are permitted — both are compile-time constraints that validate or narrow types without overriding the inferred type. `z.unknown()` is permitted only at genuine external boundaries from third-party systems (see `.agent/rules/unknown-is-type-destruction.md`).

When using external libraries, prefer the official library types and error classes over local `*Like` shapes. Define local types only when no suitable library type exists, and keep that definition in one canonical location.

See `.agent/directives/principles.md` §Compiler Time Types for the full policy.
