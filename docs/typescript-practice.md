# TypeScript Practice

## General

- Never use `any`
- Never use `as` NO TYPE ASSERTIONS, NO TYPE CASTING, JUST NO.
- Only use `unknown` at the boundaries of the application
- Use type guards/predicates to narrow types (functions with the `is` keyword)

## External Types

- Use types from external libraries as-is, do not create substitute types in our code.

## Our Type Locations

- Define types in type files, close to where they are used.
- If a type is used in multiple locations, consider if this is signalling that a refactor is needed.

## Our Type Definitions

- Define runtime constants with `as const`
- Use those constants to define types
- Use those constants to create type predicate functions

### Example

```typescript
const ALLOWED_COLORS = ['red', 'green', 'blue'] as const;
type AllowedColor = (typeof ALLOWED_COLORS)[number];

function isAllowedColor(color: string): color is AllowedColor {
  const stringAllowedColors: readonly string[] = ALLOWED_COLORS;
  return stringAllowedColors.includes(color);
}
```

## Our Type Validation at External Boundaries

- At external boundaries such as network API calls, database calls, file system calls, etc., validate incoming data using Zod.
