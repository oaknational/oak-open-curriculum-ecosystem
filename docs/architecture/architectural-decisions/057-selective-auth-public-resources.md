# ADR-057: Selective Authentication for Public MCP Resources

## Status

Accepted. Amended 2026-05-10 to clarify that the public-resource bypass is a
deliberate carve-out, not a precedent for unauthenticated MCP methods. Amended
2026-09-14 (MCP-489) to name the current widget constants and the retired
widget addresses.

## Context

ChatGPT makes approximately 60 `resources/read` calls during discovery to fetch the widget HTML and documentation resources. Each call goes through Clerk authentication middleware (~170ms overhead), resulting in approximately 10 seconds total latency and user-perceived timeouts.

The resources being fetched are:

- Widget HTML (the MCP App widget at `WIDGET_URI`) - static document
- Documentation (`docs://oak/*.md`) - static markdown

These resources contain **no user-specific data**:

- Widget HTML is a static, self-contained app. User-specific data reaches it from tool results through the MCP Apps host at render time.
- Documentation is static markdown generated at SDK compile time with no user-specific information.

## Decision

Skip Clerk authentication for `resources/read` requests where the URI matches a known public resource:

1. The widget address, `WIDGET_URI`, and the retired widget addresses, `RETIRED_WIDGET_URIS`, from the SDK (ADR-141). A retired address is not served; listing it lets an unauthenticated read reach the resource-not-found error instead of an authorization challenge.
2. Documentation URIs from SDK's `DOCUMENTATION_RESOURCES`

Both auth layers are updated:

- `conditional-clerk-middleware.ts` - skips Clerk context setup (~170ms overhead)
- `mcp-router.ts` - skips auth middleware

The public resource list is derived from source constants, ensuring synchronisation with registered resources. The retired widget addresses are the one listed set that is deliberately not registered.

This is the only accepted HTTP-auth bypass for MCP JSON-RPC methods. The bypass
is valid only when all of the following are true:

- the method is `resources/read`;
- the URI is on the known public-resource allowlist;
- the content is static or public documentation;
- the resource contains no user, school, tenant, operational, or personal data.

Any future public resource must be deliberately classified into this allowlist.
Tool calls, prompts, discovery methods, and non-public resources remain covered
by ADR-113's HTTP-level authentication rule. **The classification rule, its
basis in MCP's server-level authorization model, and the extension to app-local
resources are recorded in [ADR-205](./205-public-resource-classification-pattern.md).**

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

- Public resource list is constructed from source constants (`WIDGET_URI`, `RETIRED_WIDGET_URIS`, `DOCUMENTATION_RESOURCES`, `NAVIGATION_GUIDANCE_URIS`), ensuring automatic synchronisation when resources are registered

## References

- [MCP Apps specification](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx) - UI resources are static HTML documents a host renders in a sandbox
- [MCP Spec: Resources](https://modelcontextprotocol.io/specification/2025-06-18/server/resources) - resources/list is discovery (no auth), resources/read follows resource security
- [ADR-056: Conditional Clerk Middleware for Discovery](./056-conditional-clerk-middleware-for-discovery.md) - Initial discovery method auth bypass
- Plan 15a: Public Resource Authentication Bypass
