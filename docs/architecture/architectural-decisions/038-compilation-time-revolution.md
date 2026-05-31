# ADR-038: Compilation-Time Revolution - Complete Validation Embedding

## Status

Accepted and Implemented

## Amendment Log

- **2026-05-30 amendment — generalisation to all compile-time-known
  constants** (Opalescent Transiting Prism / `claude-code`; eef thread).
  The original record framed compile-time embedding around the
  OpenAPI-schema-derived tool files (the worked example in §The Pattern).
  The underlying principle is wider and is generalised here: **any value
  whose exact shape is fully known at compile time — annotated `as
const` — carries its types by derivation from the value, not by
  runtime re-discovery of a shape that is already statically present.**
  This covers OpenAPI-derived tool files _and_ repository-held fixed
  corpora (for example, a frozen snapshot of an external dataset).

  **The operative axis is known-vs-unknown, not external-vs-internal.**
  "External" describes _provenance_ — the data originated outside this
  repository. "Unknown" is a _type-theoretic_ claim — the shape is not
  known at compile time. These are independent axes. A repository-held
  snapshot of an external dataset, frozen `as const`, is external in
  provenance but fully **known** in type: its types are derived with
  `typeof` and indexed-access, and membership in its value sets is checked
  with the constant-type-predicate pattern (ADR-153 — a `value is T`
  predicate backed by the `as const` constant). Typing such a constant
  `unknown`, or running a runtime parse over it to "discover" a shape the
  source file already fixes, is **type destruction**, not validation.

  This destruction prohibition is carried by the always-on
  `unknown-is-type-destruction` rule
  (`.agent/rules/unknown-is-type-destruction.md`): it forbids replacing a
  recoverable concrete type with `unknown`, and it explicitly records
  that `as const` and `satisfies` narrow at compile time _without_
  widening — they are off-topic for the rule, not instances of it. That
  rule operationalises ADR-034 (System Boundaries and Type Assertions);
  the destruction framing is the rule's, not a quotation from ADR-034.

  Runtime schema validation (Zod) stays correct at a genuine `unknown`
  boundary — third-party input whose shape is not yet established. ADR-028
  (Deferring Zod Validation) is corroborating prior art only: a pragmatic
  MVP deferral with explicit reconsideration triggers, not a categorical
  ruling. The known-vs-unknown axis draws the line: Zod over genuinely
  unknown incoming data is validation; Zod over a compile-time-known `as
const` constant re-derives a shape the compiler already holds and
  destroys the literal types in the process.

  **Worked instance.** The EEF Teaching & Learning Toolkit corpus
  (`packages/sdks/graph-corpus-sdk`, `eef-strands`) is a repository-held
  fixed snapshot held `as const`. Under this doctrine its strand,
  strand-id, key-stage, and phase types are derived directly from the
  constant (`typeof` / indexed-access), with zero hand-maintained type
  declarations and zero type assertions: the corpus foundation module
  already derives its types this way, and the corpus's remaining
  Zod-inferred types are migrating onto it. The constant _is_ the schema,
  so there is nothing to validate the constant against and no runtime
  "schema drift" check to run; the snapshot's external provenance does not
  make its shape unknown.

## Context

Previous attempts to eliminate type assertions in the MCP server revealed fundamental TypeScript limitations with dynamic dispatch and union types. ADR-037 documented how accessing `client[path][method]` with dynamic lookups created uncallable union types.

The breakthrough came from inverting the problem: instead of trying to preserve types through runtime dispatch, we embed ALL validation and execution logic at generation time into self-contained tool files.

## Decision

We will generate complete, self-contained tool files that embed all validation logic extracted from the OpenAPI schema at compilation time. Each tool file contains everything needed to validate and execute that specific tool, with zero runtime schema dependencies.

### The Pattern

Each generated tool file contains:

```typescript
// Tool metadata as const literals
const operationId = 'getLessonTranscript' as const;
const name = 'oak-get-lessons-transcript' as const;
const path = '/lessons/{lesson}/transcript' as const;
const method = 'GET' as const;

// Type-safe client reference
type Client = OakApiPathBasedClient['/lessons/{lesson}/transcript']['GET'];

// Parameter type guards with compile-time embedded values
const allowedKeyStageValues = ['ks1', 'ks2', 'ks3', 'ks4'] as const;
type KeyStageValue = (typeof allowedKeyStageValues)[number];
function isKeyStageValue(value: string): value is KeyStageValue {
  const stringKeyStageValue: readonly string[] = allowedKeyStageValues;
  return stringKeyStageValue.includes(value);
}

// Two-executor pattern
const executor = (
  client: OakApiPathBasedClient,
  requestParams: ValidRequestParams,
): ReturnType<Client> => {
  // Type-safe execution with validated params
};

const getExecutorFromGenericRequestParams = (
  client: OakApiPathBasedClient,
  requestParams: unknown,
) => {
  // Validates unknown input and returns executor
};
```

### Key Innovation: Two-Executor Pattern

1. **Type-safe executor**: Takes validated `ValidRequestParams`, used when types are known
2. **Generic wrapper**: Takes `unknown` params, validates, then delegates to type-safe executor

This solves the dynamic dispatch problem by moving validation INTO each tool rather than trying to dispatch TO tools dynamically.

## Implementation

### Generation Process

1. **Extract at generation time**:
   - Parameter `required` field from OpenAPI schema
   - Enum values for constrained parameters
   - Parameter types (string, number, boolean, array)

2. **Generate for each parameter**:
   - Type guard functions with embedded allowed values
   - Optional handling (`| undefined` for optional params)
   - Human-readable error messages

3. **Generate validation functions**:
   - `isValidRequestParams`: Complete request validation
   - `getValidRequestParamsDescription`: Schema documentation

4. **Generate executors**:
   - Type-safe executor with parameter extraction
   - Generic wrapper with validation

### File Structure

```text
mcp-tools/
├── index.ts        # MCP_TOOLS mapping
├── types.ts        # Operation ID mapping and type guards
├── lib.ts          # Helper functions
└── tools/
    ├── oak-get-lessons-transcript.ts
    ├── oak-get-sequences-units.ts
    └── ... (one file per tool)
```

## Consequences

### Positive

1. **Zero Runtime Schema Dependencies**: All validation logic is embedded at compile time
2. **No Type Assertions**: The two-executor pattern eliminates the need for assertions
3. **Complete Type Safety**: Full TypeScript type flow from MCP call to SDK response
4. **Self-Documenting**: Generated code shows exactly what values are allowed
5. **Performance**: No runtime schema parsing or validation construction
6. **Debugging**: Can read generated file to understand exact validation logic
7. **Extensibility**: Each tool is independent and can have custom logic if needed

### Negative

1. **Larger Generated Files**: Each tool file contains its complete validation logic
2. **Redundancy**: Similar validation patterns repeated across files
3. **Regeneration Required**: Must regenerate when schema changes

### Neutral

1. **Different Pattern**: Moves away from runtime dispatch to compile-time embedding
2. **More Files**: One file per tool instead of consolidated structures

## Why This Succeeds Where Others Failed

### The TypeScript Limitation

Previous approaches failed because TypeScript cannot handle:

```typescript
const response = await client[dynamicPath][dynamicMethod](params);
// Creates union of incompatible signatures
```

### Our Solution

We never use dynamic dispatch. Instead:

```typescript
const tool = MCP_TOOLS[toolName]; // Get tool with embedded executor
const result = await tool.getExecutorFromGenericRequestParams(client, params);
// Executor is already bound to specific path/method at generation time
```

## Related Decisions

- **Supersedes**: ADR-037 (Minimal Tool Lookup) - which hit TypeScript limitations
- **Extends**: ADR-031 (Generation-Time Extraction) - takes it to the extreme
- **Implements**: ADR-035 (Unified SDK-MCP) - achieves the goal differently
- **Preserves**: ADR-034 (No Type Assertions) - successfully maintains this principle
- **Composes with**: ADR-153 (Constant-Type-Predicate Pattern) - the
  constant-type-predicate (`value is T`) over an `as const` constant that the
  2026-05-30 generalisation relies on
- **Corroborated by**: ADR-028 (Deferring Zod Validation) - pragmatic Zod deferral,
  prior art for the known-vs-unknown line drawn in the 2026-05-30 amendment

## Key Insights

1. **Compilation Time is Free**: Complex logic at generation time has zero runtime cost
2. **Embedding > Lookup**: Embedding validation in tools is simpler than central validation
3. **Two-Phase Validation**: Unknown → Validated → Executed preserves type safety
4. **Generated Code is Code**: Treat generated files as first-class code, not just data

## References

- Implementation: `/packages/sdks/oak-curriculum-sdk/code-generation/mcp-tools/mcp-tool-generator.ts`
- Example output: `/packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/tools/`
- Plan: `/.agent/plans/compilation-time-revolution-plan.md`
