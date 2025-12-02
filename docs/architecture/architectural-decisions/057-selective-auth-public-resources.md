# ADR-057: Selective Authentication for Public MCP Resources

## Status

Accepted

## Context

ChatGPT makes approximately 60 `resources/read` calls during discovery to fetch the widget HTML and documentation resources. Each call goes through Clerk authentication middleware (~170ms overhead), resulting in approximately 10 seconds total latency and user-perceived timeouts.

The resources being fetched are:

- Widget HTML (`ui://widget/oak-json-viewer.html`) - static shell
- Documentation (`docs://oak/*.md`) - static markdown

These resources contain **no user-specific data**:

- Widget HTML is a static shell that loads JS/CSS. User-specific data arrives via `window.openai.toolOutput` at render time.
- Documentation is static markdown generated at SDK compile time with no user-specific information.

## Decision

Skip Clerk authentication for `resources/read` requests where the URI matches a known public resource:

1. Widget URI from `AGGREGATED_TOOL_WIDGET_URI`
2. Documentation URIs from SDK's `DOCUMENTATION_RESOURCES`

Both auth layers are updated:

- `conditional-clerk-middleware.ts` - skips Clerk context setup (~170ms overhead)
- `mcp-router.ts` - skips auth middleware

The public resource list is derived from source constants, ensuring synchronisation with registered resources.

### Implementation Details

A new `src/auth/public-resources.ts` module provides:

- `PUBLIC_RESOURCE_URIS` - readonly array of known public URIs
- `isPublicResourceUri()` - O(1) lookup function

A shared `src/auth/mcp-body-parser.ts` module provides:

- `getResourceUriFromBody()` - extracts URI from request body with proper type narrowing

Both middleware files import these shared utilities, avoiding code duplication.

## Consequences

### Positive

- **~8× latency improvement**: 60 × 170ms → 60 × ~20ms
- **No user timeouts**: Discovery completes in <2s instead of ~10s
- **Security preserved**: Data-fetching tools (`tools/call`) still require authentication
- **Schema-first compliant**: Public resource list derived from SDK exports

### Negative

- **Additional conditional logic**: Two middleware files modified with auth bypass logic
- **Maintenance**: New public resources must be added to the source constants

### Neutral

- Public resource list is constructed from source constants (`AGGREGATED_TOOL_WIDGET_URI`, `DOCUMENTATION_RESOURCES`), ensuring automatic synchronisation when resources are registered

## References

- [OpenAI Apps SDK: Widget Resources](https://platform.openai.com/docs/guides/apps) - Widget resources are static shells
- [MCP Spec: Resources](https://modelcontextprotocol.io/specification/2025-06-18/server/resources) - resources/list is discovery (no auth), resources/read follows resource security
- [ADR-056: Conditional Clerk Middleware for Discovery](./056-conditional-clerk-middleware-for-discovery.md) - Initial discovery method auth bypass
- Plan 15a: Public Resource Authentication Bypass
