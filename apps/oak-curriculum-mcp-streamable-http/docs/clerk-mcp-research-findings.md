# Clerk MCP OAuth 2.1 Compatibility

**Research Date**: 20 November 2025  
**Researcher**: Project Team  
**Purpose**: Validate Clerk as an authorisation server for Oak's MCP server  
**Decision**: Proceed, with empirical verification of RFC 8707 resource and
audience behaviour

## Executive Summary

Clerk, particularly when used with `@clerk/mcp-tools`, is compatible with the
OAuth 2.1 and MCP authorisation requirements Oak needs. The critical standards
surfaces are present: discovery metadata, PKCE, dynamic client registration,
protected resource metadata, and standard authorisation-server metadata.

The only item that still requires implementation-time verification is how the
resource parameter maps onto token audience claims in practice.

## Feature Support Matrix

| Feature                             | RFC       | Status             | Notes                                                 |
| ----------------------------------- | --------- | ------------------ | ----------------------------------------------------- |
| Discovery metadata                  | RFC 8414  | Verified           | Standard well-known metadata endpoints available      |
| PKCE with S256                      | OAuth 2.1 | Verified           | Suitable for public-client flows                      |
| Dynamic client registration         | RFC 7591  | Verified           | Supports client-registration workflows where required |
| Protected resource metadata         | RFC 9728  | Verified           | Supported through MCP-oriented helpers                |
| Authorisation-server metadata       | RFC 8414  | Verified           | Standard metadata surface available                   |
| Resource parameter / audience claim | RFC 8707  | Verify empirically | Confirm exact claim behaviour during implementation   |

## Findings

### Discovery metadata

Clerk exposes standard discovery metadata and aligns with the well-known
authorisation-server metadata model expected by MCP-capable OAuth clients.

### PKCE

Clerk supports PKCE with S256, which is mandatory for secure public-client
authorisation-code flows.

### Dynamic client registration

Clerk can support dynamic client-registration workflows, which keeps Oak
compatible with MCP clients that create dedicated OAuth clients per
connection.

### Protected resource metadata

`@clerk/mcp-tools` provides the pieces needed for protected resource metadata,
so the MCP server can publish the metadata documents that clients expect.

### Resource parameter behaviour

The remaining open question is not whether tokens are valid, but how the
resource parameter is reflected in token claims in practice. Oak should verify
that explicitly and document the observed behaviour in code and tests.

## Implementation Guidance

### Runtime

1. Use Clerk's supported server-side integration points already present in the
   app
2. Keep the MCP auth boundary explicit and testable
3. Document any provider-specific behaviour at the boundary where it matters

### Verification

1. Exercise an OAuth flow using a concrete `resource` value
2. Inspect the resulting token claims
3. Confirm Oak's audience validation matches the observed contract
4. Encode that behaviour in tests

## Testing Expectations

Minimum validation for this area:

1. Discovery metadata is published correctly
2. Protected resource metadata is published correctly
3. Authorisation flow succeeds with PKCE
4. Token validation passes for the intended resource/audience contract
5. Repeated authenticated MCP requests behave consistently

## Conclusion

Clerk is a suitable authorisation provider for Oak's MCP server. Proceed with
implementation, but treat RFC 8707 resource and audience behaviour as a
required empirical check rather than an assumption.
