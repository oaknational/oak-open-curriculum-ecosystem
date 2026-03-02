# ADR-029: No Manual API Data Structures in MCP

**Status**: Accepted  
**Date**: 2025-08-12  
**Decision Makers**: Development Team

## Context

The Oak Curriculum MCP server needs to provide tools that wrap the Oak Curriculum API. These tools require:

- API endpoint definitions
- Parameter schemas
- Response types
- Validation rules

Initially, we created a metadata registry that contained hardcoded API paths and parameter definitions. This approach creates a maintenance burden and prevents automatic adaptation to API changes.

## Problem Statement

How do we ensure the MCP automatically adapts to API changes without requiring manual code updates?

## Decision

**We will NOT maintain any manual API data structures in the MCP codebase.**

All API-related information must be imported from the SDK, which is automatically generated from the OpenAPI specification.

## Detailed Rules

### What is Prohibited ❌

1. **No hardcoded API paths**

   ```typescript
   // PROHIBITED
   const TOOL_METADATA = {
     '/lessons/{lesson}/transcript': { ... }  // ❌ Hardcoded path
   };
   ```

2. **No manual parameter definitions**

   ```typescript
   // PROHIBITED
   const params = {
     lesson: { type: 'string', pattern: '^[a-z0-9-]+$' }, // ❌ Manual schema
   };
   ```

3. **No duplicate type definitions**

   ```typescript
   // PROHIBITED
   interface LessonParams {
     // ❌ Duplicating SDK types
     lesson: string;
   }
   ```

4. **No manual validation logic**

   ```typescript
   // PROHIBITED
   function validateKeyStage(value: string) {
     // ❌ Manual validation
     return ['ks1', 'ks2', 'ks3', 'ks4'].includes(value);
   }
   ```

### What is Allowed ✅

1. **Decorative metadata only**

   ```typescript
   // ALLOWED
   const TOOL_METADATA = {
     getLessonTranscript: {
       // ✅ Keyed by operationId
       description: 'Enhanced human-friendly description',
       examples: ['Example usage'],
       category: 'content',
       priority: 'high',
     },
   };
   ```

2. **Import from SDK**

   ```typescript
   // ALLOWED
   import { KEY_STAGES, SUBJECTS, validation } from '@oaknational/curriculum-sdk';
   ```

3. **Generate from SDK data**

   ```typescript
   // ALLOWED
   const tools = toolGeneration.PATH_OPERATIONS.map(generateTool);
   ```

## Consequences

### Positive

1. **Automatic API Adaptation**: When the API changes and SDK is updated, MCP tools automatically reflect changes
2. **Zero Maintenance**: No manual updates needed for API changes
3. **Guaranteed Consistency**: MCP tools always match current API specification
4. **Reduced Bugs**: Single source of truth eliminates synchronization errors
5. **Faster Development**: No need to manually maintain API definitions

### Negative

1. **SDK Dependency**: MCP is completely dependent on SDK quality and completeness
2. **Build Complexity**: Requires build-time tool generation step
3. **Limited Customization**: Cannot easily override SDK definitions if needed
4. **Debugging Complexity**: Generated code can be harder to debug

### Mitigation Strategies

1. **SDK Dependency**: Participate in SDK development to ensure quality
2. **Build Complexity**: Create clear documentation and error messages
3. **Limited Customization**: Use metadata layer for enhancements
4. **Debugging**: Include source maps and clear generation timestamps

## Implementation

All phases are complete.

### Phase 1: Clean Up

- Removed hardcoded paths from metadata registry
- Deleted manual validation functions
- Removed duplicate constant definitions

### Phase 2: SDK Exports

- SDK exports all required types, validators, and tool generation helpers
- SDK provides validation namespace via generated Zod schemas

### Phase 3: Generation Pipeline

- Build-time generation script implemented (`pnpm sdk-codegen`)
- All tool metadata generated from OpenAPI schema via `MCP_TOOL_DESCRIPTORS`
- Runtime validation uses generated Zod schemas exclusively

## Validation

We will know this decision is successful when:

1. MCP has zero hardcoded API paths
2. All API data comes from SDK imports
3. API changes require zero MCP code changes
4. All tools are generated programmatically

## Alternatives Considered

### Alternative 1: Maintain Manual Definitions

- **Pros**: Full control, easier debugging
- **Cons**: High maintenance, drift risk, duplication
- **Rejected**: Maintenance burden outweighs benefits

### Alternative 2: Hybrid Approach

- **Pros**: Some automation, some control
- **Cons**: Complex, unclear boundaries
- **Rejected**: Partial automation still requires maintenance

### Alternative 3: Direct OpenAPI Consumption

- **Pros**: Skip SDK dependency
- **Cons**: Duplicate SDK's work, complex parsing
- **Rejected**: SDK already solves this problem

## Related Decisions

- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md)
- [Programmatic Tool Generation Architecture](../programmatic-tool-generation.md)

## References

- [Phase 6 Implementation Plan](../../../.agent/plans/archive/completed/phase-6-oak-curriculum-api-implementation-plan.md)
- [Oak Curriculum SDK](../../../packages/sdks/oak-curriculum-sdk/README.md)
