# Compilation-Time Revolution Plan: MCP Tool Generation

## Status: ✅ COMPLETE

All core implementation steps (1-15) have been successfully completed. The generator now produces fully type-safe code with zero `any` types.

## Overview

Transform the MCP tool generation to embed all validation and type information at compile-time, eliminating runtime schema lookups and creating fully self-contained, type-safe tool definitions.

## Disallowed Types

- No `any`
- No type assertions other than `as const`
- No `unknown` or `record<string, unknown>` except at incoming system boundaries where we genuinely don't know the shape of the data

## Context

### Current State

- Tools are generated with embedded executors but limited validation
- Runtime validation relies on external schema lookups
- Type safety requires type assertions in some places

### Target State

- All parameter metadata extracted from OpenAPI schema at generation time
- Complete validation logic embedded in each tool file
- Two-executor pattern: one type-safe, one for generic MCP calls
- Zero runtime schema dependencies

### Key Files

#### Generator File to Modify

- `/packages/oak-curriculum-sdk/scripts/typegen/mcp-tools/mcp-tool-generator.ts`

#### Example of Target Output

- `/packages/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/tools/oak-get-key-stages-subject-assets.ts`

#### Integration Point

- `/packages/oak-curriculum-sdk/src/mcp/execute-tool-call.ts` - Uses `tool.getExecutorFromGenericRequestParams()`

### Pattern Overview

```typescript
// Target pattern for each generated tool
const operationId = '...' as const;
const name = '...' as const;
const path = '...' as const;
const method = '...' as const;

// Type-safe client reference
type Client = OakApiPathBasedClient[path][method];

// Parameter type guards (for constrained params)
const allowedXValues = [...] as const;
type XValue = typeof allowedXValues[number] | undefined; // | undefined for optional
function isXValue(value: string | undefined): value is XValue { ... }

// Parameter metadata with embedded type guards
const pathParams = { 
  paramName: {
    typePrimitive: "string",
    valueConstraint: true,
    allowedValues: allowedXValues,
    typeguard: isXValue
  }
};

// Request validation
type ValidRequestParams = { params: { path: {...}, query?: {...} } };
function isValidRequestParams(requestParams: unknown): requestParams is ValidRequestParams { ... }
function getValidRequestParamsDescription(): string { ... }

// Two executors
const executor = (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => { ... }
const getExecutorFromGenericRequestParams = (client: OakApiPathBasedClient, requestParams: unknown) => { ... }

// Export with both executors
export const toolName = {
  name, path, method, operationId,
  pathParams, queryParams,
  executor,
  getExecutorFromGenericRequestParams
} as const;
```

## Part 1: Core Implementation (Required) ✅

### Step 1: Extract 'required' field from OpenAPI schema parameters ✅

- Modify parameter extraction in `generateToolFile()`
- Store `required` boolean for each parameter
- This determines if parameter accepts `undefined`

### Step 2: Generate individual const declarations for tool metadata ✅

- Replace inline object with separate consts
- `const operationId = '${operationId}' as const;`
- `const name = '${toolName}' as const;`
- `const path = '${path}' as const;`
- `const method = '${method}' as const;`

### Step 3: Generate Client type extraction ✅

- Add after const declarations:
- `type Client = OakApiPathBasedClient['${path}']['${method.toUpperCase()}'];`

### Step 4: Generate type guards for constrained parameters ✅

- For each parameter with enum values:

  ```typescript
  const allowed${ParamName}Values = [${enumValues}] as const;
  type ${ParamName}Value = typeof allowed${ParamName}Values[number];
  function is${ParamName}Value(value: string): value is ${ParamName}Value { ... }
  ```

### Step 5: Handle optional parameters ✅

- Check parameter's `required` field
- For optional enum params: add `| undefined` to type
- Adjust type guard to accept undefined:

  ```typescript
  function isXValue(value: string | undefined): value is XValue {
    if (value === undefined) return true;
    ...
  }
  ```

### Step 6: Generate pathParams and queryParams with typeguard property ✅

- Include the guard function reference:

  ```typescript
  const pathParams = {
    paramName: {
      typePrimitive: "string",
      valueConstraint: true,
      allowedValues: allowedParamNameValues,
      typeguard: isParamNameValue
    }
  };
  ```

### Step 7: Generate ValidRequestParams type ✅

- Build proper TypeScript type with optionality:

  ```typescript
  type ValidRequestParams = {
    params: {
      path: { requiredParam: string },
      query?: { optionalParam?: string }
    }
  };
  ```

### Step 8: Generate isValidRequestParams type guard ✅

- Check all required params exist
- Validate all params with their guards
- Return proper type predicate

### Step 9: Generate getValidRequestParamsDescription function ✅

- Build human-readable schema description
- List all parameters with their constraints
- Used in error messages

### Step 10: Generate type-safe executor function ✅

- Takes `ValidRequestParams` type
- Calls client with validated params
- Returns `ReturnType<Client>`

### Step 11: Generate getExecutorFromGenericRequestParams wrapper ✅

- Takes generic `unknown` params
- Validates with `isValidRequestParams`
- Throws descriptive error or returns executor

### Step 12: Update tool export structure ✅

- Export object with all properties
- Include both `executor` and `getExecutorFromGenericRequestParams`
- Maintain `as const` for literal types

### Step 13: Handle tools with no parameters ✅

- Generate empty params objects
- Skip validation logic
- Direct executor call

### Step 14: Test generation with various combinations ✅

- Required path + optional query
- Multiple enum parameters
- No parameters
- Mixed constrained/unconstrained

### Step 15: Update execute-tool-call.ts types if needed ✅

- Ensure compatibility with new tool structure
- Update type definitions for `MCP_TOOLS`

## Part 2: Improvements (Enhancements)

### Step 16: Generate proper error messages

- Include parameter name in all TypeErrors
- Show allowed values in consistent format
- Add which parameter type (path/query)

### Step 17: Handle number, boolean, array types

- Extend type guards for non-string types
- Generate appropriate validation
- Handle type coercion if needed

### Step 18: Handle array query parameters

- Support `?status=a&status=b` patterns
- Generate array type guards
- Validate each array element

### Step 19: Handle unconstrained parameters

- Different validation for non-enum params
- Type checking without value constraints
- Simpler guard functions

### Step 20: Add explanatory comments

- Mark optional parameters: `// Optional parameter`
- Explain validation logic
- Document type constraints

### Step 21: Handle very long enum lists

- Consider readability for 20+ values
- Maybe truncate in error messages
- Format across multiple lines

### Step 22: Verify executor return type

- Ensure type safety maintained
- Check `ReturnType<Client>` matches

### Step 23: Ensure correct return types

- Verify `getExecutorFromGenericRequestParams` typing
- Check compatibility with execute-tool-call.ts

### Step 24: Update MCP_TOOLS type

- Add new properties if needed
- Ensure backward compatibility

### Step 25: Handle $ref parameters

- Currently skipped with `if ('$ref' in param) continue;`
- Resolve references to actual parameter definitions
- Generate appropriate validation

## Implementation Notes

### OpenAPI Schema Access

The generator has access to the full OpenAPI schema through:

```typescript
const schema = generateSchema(apiContent);
const pathItem = schema.paths[path];
const operation = pathItem[method];
const parameters = operation.parameters || [];
```

### Parameter Structure

Each parameter in the schema has:

- `name`: Parameter name
- `in`: "path" or "query"
- `required`: boolean (defaults to false for query, true for path)
- `schema.enum`: Array of allowed values (if constrained)
- `schema.type`: The base type (string, number, etc.)

### Key Functions to Modify

1. `generateToolFile()` - Main generation function
2. Extract parameter metadata with required field
3. Generate all the new functions and types
4. Update the export structure

### Testing

After generation, run:

```bash
pnpm generate:openapi
pnpm test
pnpm build
```

Verify generated files match the new pattern and all tests pass.

## Success Criteria ✅

- ✅ All generated tool files follow the new pattern
- ✅ No runtime schema lookups required
- ✅ Type safety preserved throughout
- ✅ Execute-tool-call.ts works with new structure
- ✅ All existing tests pass
- ✅ Build succeeds without type errors

## Additional Improvements Completed

Beyond the original plan, we also:

- ✅ Replaced ALL `any` types in the generator with proper OpenAPI types
- ✅ Created `PrimitiveType` union and `ParamMetadata` interface for complete type safety
- ✅ Fixed generator bugs (duplicate returns, inconsistent signatures)
- ✅ Added optional chaining for safer path parameter access
- ✅ Ensured consistent function signatures across all tools
- ✅ Renamed `generateMinimalToolLookup` to `generateCompleteMcpTools` for accuracy
- ✅ Updated documentation to reflect the complete nature of generated tools
- ✅ Fixed type assertion in schema-generators.ts to avoid unsafe assignments
