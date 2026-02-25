# ADR-047: Canonical URL Generation at sdk-codegen Time

## Status

**Accepted** - 2024-12-19

## Context

The Oak Curriculum SDK serves multiple consuming applications (HTTP MCP server, OpenAI connector, etc.) that all need to generate canonical URLs for curriculum resources. Previously, each application implemented its own URL generation logic, leading to:

- **Code duplication** across multiple applications
- **Inconsistent URL patterns** between different consumers
- **Maintenance burden** when URL patterns change
- **Type safety issues** with manual URL construction
- **Testing complexity** requiring URL generation tests in each application

The canonical URL generation logic was scattered across:

- HTTP MCP server (`apps/http-mcp-server/src/url-helpers.ts`)
- OpenAI connector (`packages/sdks/oak-curriculum-sdk/src/openai-connector/index.ts`)
- Various test files

## Decision

**Generate canonical URL helpers at code-generation time and automatically augment all API responses with canonical URLs.**

### Implementation Strategy

1. **sdk-codegen Time Generation**: URL helpers are generated during the SDK's type generation pipeline (`pnpm sdk-codegen`)
2. **Response Augmentation**: All API responses are automatically augmented with `canonicalUrl` fields
3. **Schema Decoration**: The OpenAPI schema is decorated to include `canonicalUrl` fields in response types
4. **Centralized Logic**: All URL generation logic lives in the SDK core, not in consuming applications
5. **Fail-Fast Design**: URL generation requires complete context; partial context results in warnings, not broken URLs

### Technical Details

#### URL Helper Generation

- Generated in `packages/sdks/oak-curriculum-sdk/code-generation/routing/generate-url-helpers.ts`
- Creates typed URL generation functions for each content type (lesson, unit, subject, sequence, thread)
- Includes context-aware URL generation for resources that require additional metadata
- Uses structured logging for debugging URL generation issues

#### Response Augmentation

- Implemented in `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
- Automatically extracts context from response data
- Generates canonical URLs using the generated URL helpers
- Integrates with the `validateResponse` function to augment all API responses

#### Schema Decoration

- OpenAPI schema is decorated during type generation to include `canonicalUrl` fields
- Generated types automatically include `canonicalUrl` in response interfaces
- Ensures type safety across all consuming applications

## Rationale

### Why Code-Generation Time?

1. **Performance**: URL generation logic is pre-computed and optimized at build time
2. **Type Safety**: Generated URL helpers are fully typed based on the OpenAPI schema
3. **Consistency**: All consumers get identical URL generation behavior
4. **Maintainability**: Single source of truth for URL patterns in the SDK

### Why Response Augmentation?

1. **Transparency**: Consuming applications receive canonical URLs without additional API calls
2. **Simplicity**: No need for applications to implement URL generation logic
3. **Consistency**: All responses include canonical URLs in the same format
4. **Backward Compatibility**: Existing applications continue to work without changes

### Why Fail-Fast Design?

1. **Reliability**: Better to log warnings than generate invalid URLs
2. **Debugging**: Clear logging helps identify missing context issues
3. **Type Safety**: Prevents runtime errors from malformed URLs
4. **User Experience**: Applications can handle missing URLs gracefully

## Consequences

### Positive

- **Eliminated Code Duplication**: URL generation logic exists only in the SDK
- **Improved Type Safety**: All URL generation is fully typed
- **Simplified Applications**: Consuming applications no longer need URL generation logic
- **Consistent Behavior**: All applications generate identical canonical URLs
- **Better Testing**: URL generation is tested once in the SDK, not in each application
- **Easier Maintenance**: URL pattern changes only require SDK updates
- **Enhanced Developer Experience**: Canonical URLs are automatically available

### Negative

- **SDK Complexity**: The SDK now handles more responsibilities
- **Build Time**: Type generation takes slightly longer due to URL helper generation
- **Bundle Size**: Generated URL helpers add to the SDK bundle size
- **Coupling**: Consuming applications are more tightly coupled to SDK behavior

### Migration Impact

- **HTTP MCP Server**: Removed manual URL generation, now uses SDK-augmented responses
- **OpenAI Connector**: Removed manual URL generation, now uses SDK-augmented responses
- **E2E Tests**: Updated to expect canonical URLs in all responses
- **Type Definitions**: All response types now include `canonicalUrl` fields

## Implementation

### Files Created/Modified

#### Core Implementation

- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts` - Response augmentation logic
- `packages/sdks/oak-curriculum-sdk/code-generation/routing/generate-url-helpers.ts` - URL helper generator
- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/routing/url-helpers.ts` - Generated URL helpers

#### Schema Integration

- `packages/sdks/oak-curriculum-sdk/code-generation/schema-decoration-core.ts` - Schema decoration logic
- Integration with type generation pipeline to decorate OpenAPI schema

#### Application Updates

- `apps/http-mcp-server/src/url-helpers.ts` - Removed (replaced by SDK)
- `packages/sdks/oak-curriculum-sdk/src/openai-connector/index.ts` - Removed manual URL generation
- Various test files updated to expect canonical URLs

### Quality Gates

All changes pass the complete quality gate sequence:

1. `pnpm i` - Dependencies installed
2. `pnpm sdk-codegen` - Type generation successful
3. `pnpm build` - Build successful
4. `pnpm type-check` - Type checking passed
5. `pnpm lint -- --fix` - Linting passed
6. `pnpm -F @oaknational/curriculum-sdk docs:all` - Documentation generated
7. `pnpm format:root` - Code formatting applied
8. `pnpm markdownlint` - Markdown linting passed
9. `pnpm test` - All tests passing (173/173)
10. `pnpm test:e2e` - All E2E tests passing (24/24)

## Related ADRs

- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md) - Establishes SDK as authoritative source
- [ADR-031: Generation-Time Extraction](031-generation-time-extraction.md) - Build-time processing approach
- [ADR-026: OpenAPI Code Generation Strategy](026-openapi-code-generation-strategy.md) - Code generation from OpenAPI
- [ADR-033: Centralised Log Level Configuration](033-centralised-log-level-configuration.md) - Structured logging approach

## Success Criteria

✅ **Code Duplication Eliminated**: URL generation logic exists only in the SDK  
✅ **Type Safety Achieved**: All URL generation is fully typed  
✅ **Applications Simplified**: Consuming applications no longer implement URL generation  
✅ **Consistency Ensured**: All applications generate identical canonical URLs  
✅ **Testing Improved**: URL generation tested once in SDK  
✅ **Maintenance Simplified**: URL pattern changes only require SDK updates  
✅ **Quality Gates Passed**: All tests and quality checks passing  
✅ **Documentation Updated**: SDK README and ADR documentation complete
