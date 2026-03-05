# No Type Shortcuts

Never use `as`, `any`, `!`, `Record<string, unknown>`, `{ [key: string]: unknown }`, `Object.*` methods, `Reflect.*` methods, or `isObject` type predicates. They all disable the type system. Preserve type information; never widen.

Exceptions: `as const` and `satisfies` are permitted — both are compile-time constraints that validate or narrow types without overriding the inferred type.

See `.agent/directives/rules.md` §Compiler Time Types for the full policy.
