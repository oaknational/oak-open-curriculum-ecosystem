# Parameter Examples Metadata - Implementation Plan

**Status**: 📋 PLANNED  
**Date**: 2025-11-26  
**Priority**: High - Improves AI agent tool understanding  
**Depends On**: tool-metadata-alignment-plan.md (✅ COMPLETE)

---

## Executive Summary

Add `example` metadata extraction from the OpenAPI schema to MCP tool parameter definitions. This helps AI agents understand expected input formats through concrete examples rather than abstract descriptions.

### Problem Statement

1. **AI agents struggle with format inference**: Description text like "sequence slug identifier" doesn't clearly convey expected format.
2. **Our OpenAPI schema has 131 examples**: Rich metadata exists but isn't surfacing to MCP clients.
3. **Examples are more actionable than descriptions**: `"example": "english-primary"` immediately shows the expected format.

### Value for AI Agents

```typescript
// Without examples - AI must infer format from description
{
  "sequence": {
    "type": "string",
    "description": "The sequence slug identifier"
  }
}

// With examples - AI sees concrete expected format
{
  "sequence": {
    "type": "string",
    "description": "The sequence slug identifier",
    "examples": ["english-primary", "maths-secondary-higher"]
  }
}
```

### Solution

Extract `example` from OpenAPI parameters at type-gen time and emit to JSON Schema `examples` array, following the schema-first principle.

---

## Directive References

Read and follow:

- `.agent/directives-and-memory/rules.md` - TDD, schema-first, no type shortcuts
- `.agent/directives-and-memory/testing-strategy.md` - TDD at ALL levels
- `.agent/directives-and-memory/schema-first-execution.md` - Generated artifacts drive runtime

---

## JSON Schema Specification

Per [JSON Schema draft-07](https://json-schema.org/draft-07/schema):

```json
{
  "examples": {
    "type": "array",
    "items": true
  }
}
```

- `examples` is an array of valid values for the schema
- Used to provide sample data that validates against the schema
- Distinct from `example` (singular) used in OpenAPI 3.x parameters

### OpenAPI to JSON Schema Mapping

| OpenAPI Field                      | JSON Schema Field | Notes                  |
| ---------------------------------- | ----------------- | ---------------------- |
| `parameter.example`                | `examples[0]`     | Single example → array |
| `parameter.schema.example`         | `examples[0]`     | Fallback location      |
| `parameter.examples` (OpenAPI 3.1) | `examples`        | Direct mapping         |

---

## Current State Analysis

### OpenAPI Schema Examples

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`

**Count**: 131 `"example":` occurrences

**Sample examples from schema**:

| Parameter    | Example Value                                       | Why Useful                      |
| ------------ | --------------------------------------------------- | ------------------------------- |
| `sequence`   | `"english-primary"`                                 | Shows slug format               |
| `lesson`     | `"checking-understanding-of-basic-transformations"` | Shows long slug format          |
| `year`       | `"1"` or `3`                                        | Shows numeric string vs integer |
| `q` (search) | `"Who were the romans?"`                            | Shows natural language query    |
| `type`       | `"slideDeck"`                                       | Shows camelCase enum value      |

### Current ParamMetadata Interface

```typescript
export interface ParamMetadata {
  readonly typePrimitive: PrimitiveType;
  readonly valueConstraint: boolean;
  readonly required: boolean;
  readonly allowedValues?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
  // MISSING: example?: unknown;
}
```

### Current Extraction Code

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts`

```typescript
function extractParamMetadata(param: ParameterObject): ParamMetadata {
  // ... existing extraction
  return {
    // ... existing fields
    description: paramDescription ?? schemaDescription,
    default: schema && 'default' in schema ? schema.default : undefined,
    // MISSING: example extraction
  };
}
```

---

## Implementation Phases

### Phase 0 – Grounding and Scope Confirmation

1. **ACTION**: Re-read `rules.md`, `testing-strategy.md`, and `schema-first-execution.md`.
2. **REVIEW**: Confirm understanding: all example changes happen in type-gen templates.
3. **QUALITY-GATE**: Run from repo root: `pnpm type-gen && pnpm build && pnpm type-check && pnpm lint && pnpm test`

### Phase 1 – Extend ParamMetadata Interface (TDD: Write Tests First)

4. **ACTION**: Write unit test in `build-zod-type.unit.test.ts` asserting that `buildZodType` adds `.example()` when example is provided. Test MUST fail initially (RED).

```typescript
describe('with example', () => {
  it('does not add example to Zod (not supported)', () => {
    // Note: Zod doesn't have .example() - examples go in JSON Schema only
    const meta: ParamMetadata = {
      typePrimitive: 'string',
      required: true,
      valueConstraint: false,
      example: 'english-primary',
    };
    // Zod output unchanged - examples are for JSON Schema
    expect(buildZodType(meta)).toBe('z.string()');
  });
});
```

5. **ACTION**: Write unit test for JSON Schema property builder asserting `examples` array is emitted.
6. **REVIEW**: Confirm tests fail as expected (RED state).

7. **ACTION**: Add `example?: unknown` to `ParamMetadata` interface in `param-metadata.ts`.
8. **ACTION**: Update `createMutableParamMetadata` to include example field.
9. **QUALITY-GATE**: Run `pnpm type-check` to verify interface compiles.

### Phase 2 – Extract Examples in Type-Gen (Schema-First)

10. **ACTION**: In `mcp-tool-generator.ts`, update `extractParamMetadata` to extract example:

```typescript
function extractParamMetadata(param: ParameterObject): ParamMetadata {
  // ... existing code

  // Extract example from parameter level or schema level
  const paramExample = 'example' in param ? param.example : undefined;
  const schemaExample = schema && 'example' in schema ? schema.example : undefined;

  return {
    // ... existing fields
    example: paramExample ?? schemaExample,
  };
}
```

11. **REVIEW**: Verify extraction checks both `param.example` and `param.schema.example`.
12. **QUALITY-GATE**: Run `pnpm type-check` in SDK package.

### Phase 3 – Emit Examples to JSON Schema

13. **ACTION**: In `build-json-schema-property.ts`, update `buildCommon` to include examples:

```typescript
function buildCommon(meta: ParamMetadata): {
  readonly description?: string;
  readonly default?: unknown;
  readonly examples?: readonly unknown[];
} {
  const out: { description?: string; default?: unknown; examples?: unknown[] } = {};
  if (meta.description !== undefined) {
    out.description = meta.description;
  }
  if (meta.default !== undefined) {
    out.default = meta.default;
  }
  if (meta.example !== undefined) {
    out.examples = [meta.example];
  }
  return out;
}
```

14. **ACTION**: Update JSON Schema property interfaces to include `examples` field.
15. **REVIEW**: Verify examples array is emitted, not singular example.
16. **QUALITY-GATE**: Run `pnpm type-check && pnpm lint`.

### Phase 4 – Update Zod Input Schema Converter (Aggregated Tools)

17. **ACTION**: In `zod-input-schema.ts`, update interfaces to include `examples`:

```typescript
interface JsonSchemaPropertyString {
  readonly type: 'string';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
  readonly examples?: readonly unknown[]; // ADD
}
```

18. **ACTION**: Examples don't need Zod conversion (they're for JSON Schema output only).
19. **REVIEW**: Confirm examples field is defined but not processed in Zod conversion.
20. **QUALITY-GATE**: Run `pnpm type-check`.

### Phase 5 – Add Examples to Aggregated Tools

21. **ACTION**: In `aggregated-search.ts`, add examples to `SEARCH_INPUT_SCHEMA`:

```typescript
export const SEARCH_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    q: {
      type: 'string',
      description: 'Search query string to find lessons and transcripts',
      examples: ['Who were the romans?', 'photosynthesis', 'fractions year 4'],
    },
    keyStage: {
      type: 'string',
      description: 'Filter by key stage',
      enum: [...KEY_STAGES],
      examples: ['ks2'],
    },
    // ...
  },
};
```

22. **ACTION**: In `aggregated-fetch.ts`, add examples to `FETCH_INPUT_SCHEMA`:

```typescript
export const FETCH_INPUT_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'Canonical identifier in format "type:slug"',
      examples: [
        'lesson:adding-fractions-with-the-same-denominator',
        'unit:fractions',
        'subject:maths',
      ],
    },
  },
};
```

23. **REVIEW**: Examples should be realistic and diverse.
24. **QUALITY-GATE**: Run `pnpm type-check && pnpm lint`.

### Phase 6 – Regenerate and Verify

25. **ACTION**: Run `pnpm type-gen` to regenerate all tool files.
26. **ACTION**: Grep generated files to verify examples are present:

```bash
grep -l '"examples":' packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/*.ts
```

27. **REVIEW**: Spot-check 5 generated files to confirm examples are correct.
28. **QUALITY-GATE**: Run full gate: `pnpm build && pnpm type-check && pnpm lint && pnpm test`.

### Phase 7 – Add Unit Tests for Behaviour Specification

29. **ACTION**: Add unit test to `mcp-tool-generator.unit.test.ts`:

```typescript
describe('parameter example extraction behaviour', () => {
  it('extracts example from parameter level', () => {
    const schema = buildSchemaWithParamLevelExample();
    const files = generateCompleteMcpTools(schema);
    const toolFile = files.data.tools['get-resources.ts'];

    expect(toolFile).toContain('"examples":["english-primary"]');
  });

  it('extracts example from schema level', () => {
    const schema = buildSchemaWithSchemaLevelExample();
    const files = generateCompleteMcpTools(schema);
    const toolFile = files.data.tools['get-items.ts'];

    expect(toolFile).toContain('"examples":["sample-value"]');
  });

  it('omits examples when none provided', () => {
    const schema = buildSchemaWithNoExample();
    const files = generateCompleteMcpTools(schema);
    const toolFile = files.data.tools['get-things.ts'];

    expect(toolFile).not.toContain('"examples":');
  });
});
```

30. **ACTION**: Add corresponding test fixtures to `test-fixtures.ts`.
31. **REVIEW**: Ensure tests specify behaviour, not implementation.
32. **QUALITY-GATE**: Run `pnpm test` to verify tests pass (GREEN).

### Phase 8 – Verify E2E Flow

33. **ACTION**: Start dev server and query `tools/list`:

```bash
curl -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | \
  jq '.result.tools[] | select(.name == "get-sequences-units") | .inputSchema.properties.sequence'
```

34. **ACTION**: Verify examples array appears in response.
35. **REVIEW**: Confirm examples are visible to MCP clients.
36. **QUALITY-GATE**: Run `pnpm test:e2e` if applicable.

### Phase 9 – Final Acceptance and Documentation

37. **ACTION**: Verify all acceptance criteria (below) are met.
38. **ACTION**: Update inline JSDoc comments explaining examples extraction.
39. **REVIEW**: Self-review against `rules.md` and `schema-first-execution.md`.
40. **QUALITY-GATE**: Run full quality gate sequence from repo root.

---

## Acceptance Criteria

### Type Generation

| Criterion                                             | Test Method            | Pass/Fail |
| ----------------------------------------------------- | ---------------------- | --------- |
| `ParamMetadata` includes `example?: unknown`          | TypeScript compilation | ⬜        |
| `extractParamMetadata` extracts from `param.example`  | Unit test              | ⬜        |
| `extractParamMetadata` falls back to `schema.example` | Unit test              | ⬜        |
| JSON Schema includes `examples` array                 | Grep generated files   | ⬜        |
| `pnpm type-gen` succeeds with examples                | Run type-gen           | ⬜        |

### Generated Tools

| Criterion                                                     | Test Method          | Pass/Fail |
| ------------------------------------------------------------- | -------------------- | --------- |
| Tools with examples in OpenAPI have `examples` in JSON Schema | Grep generated files | ⬜        |
| Tools without examples omit `examples` field                  | Grep generated files | ⬜        |
| Examples are arrays (not singular)                            | Code inspection      | ⬜        |

### Aggregated Tools

| Criterion                                                 | Test Method     | Pass/Fail |
| --------------------------------------------------------- | --------------- | --------- |
| `search` tool has examples for `q`, `keyStage`, `subject` | Code inspection | ⬜        |
| `fetch` tool has examples for `id`                        | Code inspection | ⬜        |
| Examples demonstrate format diversity                     | Code review     | ⬜        |

### E2E Verification

| Criterion                                       | Test Method         | Pass/Fail |
| ----------------------------------------------- | ------------------- | --------- |
| `tools/list` response includes `examples` array | curl/jq             | ⬜        |
| MCP client (Cursor) receives examples           | Manual verification | ⬜        |

### Quality Gates

| Gate              | Status |
| ----------------- | ------ |
| `pnpm type-gen`   | ⬜     |
| `pnpm build`      | ⬜     |
| `pnpm type-check` | ⬜     |
| `pnpm lint`       | ⬜     |
| `pnpm test`       | ⬜     |

---

## Key Files

### Type Generation (Schema-First)

| File                                                             | Purpose             | Change Required       |
| ---------------------------------------------------------------- | ------------------- | --------------------- |
| `type-gen/typegen/mcp-tools/parts/param-metadata.ts`             | Metadata interface  | Add `example` field   |
| `type-gen/typegen/mcp-tools/mcp-tool-generator.ts`               | Main generator      | Extract `example`     |
| `type-gen/typegen/mcp-tools/parts/build-json-schema-property.ts` | JSON Schema builder | Emit `examples` array |
| `type-gen/typegen/mcp-tools/parts/json-schema-types.ts`          | JSON Schema types   | Add `examples` field  |

### SDK (Aggregated Tools)

| File                           | Purpose            | Change Required              |
| ------------------------------ | ------------------ | ---------------------------- |
| `src/mcp/aggregated-search.ts` | Search tool schema | Add `examples` to properties |
| `src/mcp/aggregated-fetch.ts`  | Fetch tool schema  | Add `examples` to properties |
| `src/mcp/zod-input-schema.ts`  | Schema converter   | Add `examples` to interfaces |

### Tests

| File                                                         | Purpose         | Change Required              |
| ------------------------------------------------------------ | --------------- | ---------------------------- |
| `type-gen/test-fixtures.ts`                                  | Test fixtures   | Add example-related schemas  |
| `type-gen/typegen/mcp-tools/mcp-tool-generator.unit.test.ts` | Generator tests | Add example extraction tests |
| `src/mcp/zod-input-schema.unit.test.ts`                      | Converter tests | Add examples round-trip test |

---

## Risks and Mitigations

| Risk                                | Likelihood | Impact | Mitigation                             |
| ----------------------------------- | ---------- | ------ | -------------------------------------- |
| Examples not passed through MCP SDK | Low        | Medium | Test E2E with actual MCP client        |
| Large examples bloat JSON Schema    | Low        | Low    | Only extract first example, keep short |
| Examples may be outdated in OpenAPI | Medium     | Low    | Examples are hints, not constraints    |
| Zod doesn't support examples        | Known      | None   | Examples only go to JSON Schema        |

---

## TDD Reminder

Per testing-strategy.md:

> "Write tests **FIRST**. Red → Green → Refactor"

All changes should follow:

1. **RED**: Write test that fails (feature doesn't exist yet)
2. **GREEN**: Implement minimal code to pass test
3. **REFACTOR**: Improve implementation while keeping tests green

---

## Schema-First Compliance

Per `schema-first-execution.md`:

> "Every byte of runtime behaviour for MCP tool execution **must** be driven by generated artefacts"

The `examples` for generated tools MUST be extracted and emitted in the type-gen templates, NOT manually added in runtime code.

---

## Why This Matters for AI Agents

1. **Format inference**: `"examples": ["english-primary"]` immediately shows kebab-case slug format
2. **Value range hints**: `"examples": ["ks1", "ks2"]` shows likely values even without enum
3. **Query understanding**: `"examples": ["Who were the romans?"]` shows natural language is expected
4. **Error reduction**: Agents less likely to hallucinate invalid formats with concrete examples

### Example Impact on AI Tool Calls

**Without examples** (current state):

```
AI sees: sequence (string) - "The sequence slug identifier"
AI might call: get-sequences-units({ sequence: "English Primary" })  // WRONG
```

**With examples** (proposed):

```
AI sees: sequence (string) - "The sequence slug identifier", examples: ["english-primary"]
AI will call: get-sequences-units({ sequence: "english-primary" })  // CORRECT
```

---

## Future Considerations

- **Multiple examples**: JSON Schema allows array; consider extracting OpenAPI 3.1 `examples` object if present
- **Example validation**: Could add build-time check that examples match schema constraints
- **Rich examples**: Some parameters might benefit from multiple examples showing different patterns
- **Example generation**: For parameters without examples, could generate from enum values or patterns
