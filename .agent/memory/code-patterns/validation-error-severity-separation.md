---
name: "Validation Error Severity Separation"
use_this_when: "A schema validation error message lists all absent fields alongside actually failing fields, making operators debug the wrong variables"
category: error-handling
proven_in: "packages/libs/env-resolution/src/resolve-env.ts"
proven_date: 2026-02-28
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Operators waste time configuring optional-but-absent variables when only one variable has an invalid value"
  stable: true
---

# Validation Error Severity Separation

## Principle

When a schema validator (Zod, Joi, JSON Schema, etc.) rejects input, the error message must distinguish between **fields that caused validation failures** and **fields that are merely absent but optional**. Conflating the two makes operators debug the wrong variables.

## Anti-Pattern

```
Missing keys: A, B, C, D, E, F, G, H
Validation errors: Invalid option for X
```

Here `A` through `H` are optional and absent (not errors), but `X` is the sole failure. The operator sees 9 problems instead of 1.

## Pattern

```
Failing keys: X
Validation errors: Invalid option for X
(8 optional keys not configured: A, B, C, D, E, F, G, H)
```

1. **Extract failing keys** from the validator's issue list (the keys that actually caused errors)
2. **Compute absent-but-not-failing keys** by subtracting failing keys from all absent keys
3. **Show failing keys prominently** in the error message
4. **Show absent-optional keys as a lower-priority diagnostic line** — useful for operators who want the full picture, but clearly subordinate to the actual failures

## Why It Matters

Schema validators introspect the full schema to report diagnostics. The full diagnostic set (which keys are present, which are absent) is useful for debugging, but it must not have equal visual weight with the actual failures. One invalid value in a schema with 20 optional fields should produce an error that immediately points to the one invalid value, not a wall of 19 "missing" keys.
