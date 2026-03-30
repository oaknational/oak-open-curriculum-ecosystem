# Spike: `@clerk/mcp-tools/express` Adoption Evaluation

**Date**: 2026-03-26
**Phase**: Phase 0 of [MCP Runtime Boundary Simplification](../../.agent/plans/sdk-and-mcp-enhancements/current/mcp-runtime-boundary-simplification.plan.md)
**Decision**: [ADR-142](../architecture/architectural-decisions/142-clerk-mcp-tools-adopt-or-explain.md)

## Purpose

Evaluate whether official `@clerk/mcp-tools/express` utilities can replace the
hand-rolled MCP auth plumbing in `apps/oak-curriculum-mcp-streamable-http`.

The package is already a dependency (`@clerk/mcp-tools@^0.3.1`) but only
`generateClerkProtectedResourceMetadata()` from the `server` entry point is
used. The Express utilities are unused with no ADR documenting why.

**Guiding principle**: Use off-the-shelf wherever possible. Be idiomatic and
canonical. Innovate in Oak's domain (curriculum), not in plumbing.

## Package Under Evaluation

- **Package**: `@clerk/mcp-tools`
- **Installed version**: `0.3.1`
- **Description**: "Tools for writing MCP clients and servers without pain"
- **Entry points evaluated**: `@clerk/mcp-tools/server`, `@clerk/mcp-tools/express`

## Decision Table

| Utility                          | Entry Point | Decision  | Oak File It Would Replace                 | Gap                                                            |
| -------------------------------- | ----------- | --------- | ----------------------------------------- | -------------------------------------------------------------- |
| `verifyClerkToken`               | `server`    | **ADOPT** | `src/auth/mcp-auth/verify-clerk-token.ts` | Identical implementation                                       |
| `mcpAuth`                        | `express`   | **SKIP**  | `src/auth/mcp-auth/mcp-auth.ts`           | No RFC 8707, no DNS rebinding, no granular errors              |
| `mcpAuthClerk`                   | `express`   | **SKIP**  | `src/auth/mcp-auth/mcp-auth-clerk.ts`     | Wraps `mcpAuth` — inherits all gaps                            |
| `streamableHttpHandler`          | `express`   | **SKIP**  | `src/handlers.ts`                         | Incompatible with per-request server model (ADR-112)           |
| `protectedResourceHandlerClerk`  | `express`   | **SKIP**  | `src/auth-routes.ts` (PRM endpoints)      | No Host validation, `process.env` reads, no path-qualified PRM |
| `authServerMetadataHandlerClerk` | `express`   | **SKIP**  | `src/auth-routes.ts` (AS metadata)        | No URL rewriting, no caching, `process.env` reads              |

## Detailed Analysis

### 1. `verifyClerkToken` — ADOPT

**Library signature** (`@clerk/mcp-tools/server`):

```typescript
function verifyClerkToken(
  auth: MachineAuthObject<'oauth_token'>,
  token: string | undefined,
): AuthInfo | undefined;
```

**Oak's implementation** (`src/auth/mcp-auth/verify-clerk-token.ts`):

```typescript
export function verifyClerkToken(
  auth: MachineAuthObject<'oauth_token'>,
  token: string | undefined,
): AuthInfo | undefined;
```

Identical signature, identical logic, identical return type. Both:

1. Return `undefined` for missing token
2. Return `undefined` for unauthenticated
3. Throw on wrong `tokenType` (programmer error)
4. Return `undefined` for missing `clientId`, `scopes`, or `userId`
5. Return `{ token, scopes, clientId, extra: { userId } }` on success

**Behavioural delta**: The library version adds `console.error` calls for
unexpected Clerk states (e.g., missing `clientId` when authenticated). These are
defence-in-depth logging for genuinely unexpected states and represent a net
positive for observability.

**Conclusion**: Direct replacement. Delete Oak's file, import from library.
Existing unit tests become conformance tests.

### 2. `mcpAuth` — SKIP

**Library implementation** (from `dist/express/index.js:6490`):

```javascript
async function mcpAuth(verifyToken) {
  return async (req, res, next) => {
    const prmUrl = getPRMUrl(req);
    if (!req.headers.authorization) {
      return res
        .status(401)
        .set({
          'WWW-Authenticate': `Bearer resource_metadata=${prmUrl}`,
        })
        .send({ error: 'Unauthorized' });
    }
    const token = authHeader?.split(' ')[1];
    if (!token) throw new Error(`Invalid authorization header value...`);
    const authData = await verifyToken(token, req);
    if (!authData) return res.status(401).json({ error: 'Unauthorized' });
    req.auth = authData;
    next();
  };
}
```

**Gaps compared to Oak's `mcpAuth`**:

1. **No RFC 8707 audience validation** — Oak's version calls
   `validateResourceParameter(token, expectedResource, logger)` to verify the
   JWT `aud` claim matches the expected resource URL. The library skips this
   entirely.

2. **No `allowedHosts` DNS rebinding protection** — Oak's version validates the
   Host header against an allowlist before generating PRM URLs. The library
   trusts `req.protocol + req.get("host")` unconditionally.

3. **No granular `WWW-Authenticate` error descriptions** — Oak returns specific
   `error="invalid_request"`, `error="invalid_token"` with descriptive
   `error_description` per RFC 6750. The library returns a bare 401.

4. **Overwrites `req.auth`** — The library sets `req.auth = authData` (MCP
   SDK's `AuthInfo`), which clobbers the Clerk auth object set by
   `clerkMiddleware()`. Oak's version deliberately does NOT overwrite `req.auth`,
   relying on Clerk's middleware to set it.

5. **Throws on malformed header** — The library throws an unhandled `Error` for
   malformed `Authorization` headers. Oak returns a structured 401 response.

### 3. `mcpAuthClerk` — SKIP

Thin wrapper around `mcpAuth` that calls `getAuth(req, { acceptsToken:
"oauth_token" })` and `verifyClerkToken`. Inherits all gaps from `mcpAuth`
(§2 above).

### 4. `streamableHttpHandler` — SKIP

**Library implementation** (from `dist/express/index.js:6572`):

```javascript
function streamableHttpHandler(server) {
  return async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  };
}
```

**Architectural incompatibility**: Takes a **shared** `McpServer` and calls
`server.connect(transport)` per request. Oak uses **per-request servers**
(ADR-112) where each request creates a fresh `McpServer` instance with its own
tool registrations and auth context. Adopting `streamableHttpHandler` would
require abandoning the per-request server model.

Additionally:

- `sessionIdGenerator: undefined` — no session support
- No integration point for `AsyncLocalStorage` or explicit auth context passing
- No composition with Oak's `createMcpRequest()` bridge (which will itself be
  removed in Phases 4/5, but via an Oak-owned explicit ingress boundary)

### 5. `protectedResourceHandlerClerk` — SKIP

**Library implementation** (from `dist/express/index.js:6545`):

```javascript
function protectedResourceHandlerClerk(properties) {
  return (req, res) => {
    const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
    if (!publishableKey) throw new Error('CLERK_PUBLISHABLE_KEY required');
    const metadata = generateClerkProtectedResourceMetadata({
      publishableKey,
      resourceUrl: getResourceUrl(req),
      properties,
    });
    res.json(metadata);
  };
}
```

**Gaps**:

1. **No Host validation** — `getResourceUrl(req)` trusts
   `req.protocol + req.get("host")` unconditionally. Oak validates the Host
   header against `allowedHosts` and returns 403 for invalid hosts.

2. **Reads `process.env` directly** — Violates ADR-078 (dependency injection).
   Oak injects `runtimeConfig.env.CLERK_PUBLISHABLE_KEY`.

3. **No path-qualified PRM** — Only serves at `/.well-known/oauth-protected-resource`.
   Oak also serves at `/.well-known/oauth-protected-resource/mcp` per
   RFC 9728 Section 3.1.

4. **No `scopes_supported`** — Oak includes `scopes_supported` from the SDK's
   `SCOPES_SUPPORTED` constant. The library omits this field.

### 6. `authServerMetadataHandlerClerk` — SKIP

**Library implementation** (from `dist/express/index.js:6535`):

```javascript
async function authServerMetadataHandlerClerk(_, res) {
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) throw new Error('CLERK_PUBLISHABLE_KEY required');
  const metadata = await fetchClerkAuthorizationServerMetadata({ publishableKey });
  res.json(metadata);
}
```

**Gaps**:

1. **Fetches on every request** — No caching. Oak fetches once at startup and
   caches the upstream metadata.

2. **No URL rewriting** — Returns raw Clerk metadata URLs pointing to Clerk's
   FAPI. Oak rewrites endpoint URLs to point to this server's own origin (e.g.,
   `authorization_endpoint`, `token_endpoint`) so clients interact with the
   proxy, not Clerk directly.

3. **Reads `process.env` directly** — Same ADR-078 violation as §5.

## Impact on Phases 4/5

Minimal. Since all Express utilities are SKIP, Phases 4/5 of the simplification
plan proceed as originally scoped: **build Oak-owned explicit ingress context**.
The only change is replacing the hand-rolled `verifyClerkToken` with the library
import, which is a contained Step 4 change.

## Live-Doc Citations

| Source                     | URL                                                               | Accessed   |
| -------------------------- | ----------------------------------------------------------------- | ---------- |
| Clerk Express MCP guide    | <https://clerk.com/docs/expressjs/guides/ai/mcp/build-mcp-server> | 2026-03-26 |
| `@clerk/mcp-tools` GitHub  | <https://github.com/clerk/mcp-tools>                              | 2026-03-26 |
| `@clerk/mcp-tools` npm     | <https://www.npmjs.com/package/@clerk/mcp-tools>                  | 2026-03-26 |
| Library source (installed) | `node_modules/@clerk/mcp-tools/dist/express/index.js`             | 0.3.1      |
| Library types (installed)  | `node_modules/@clerk/mcp-tools/dist/express/index.d.ts`           | 0.3.1      |
| Library server types       | `node_modules/@clerk/mcp-tools/dist/server.d.ts`                  | 0.3.1      |

**Key finding from live docs**: The Clerk Express MCP guide references RFC 9728
(protected resource metadata) and RFC 8414 (AS metadata) but makes **no mention**
of RFC 8707 (resource indicators), audience validation, or DNS rebinding
protection. This confirms the library does not implement these features.
