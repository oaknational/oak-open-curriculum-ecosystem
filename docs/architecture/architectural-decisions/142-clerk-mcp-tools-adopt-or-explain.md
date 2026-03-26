# ADR-142: `@clerk/mcp-tools` Adopt-or-Explain Decision

## Status

Accepted

## Date

2026-03-26

## Related

- [ADR-078](078-dependency-injection-for-testability.md) — Dependency injection
  for testability
- [ADR-112](112-per-request-mcp-server-instances.md) — Per-request MCP server
  instances
- [ADR-126](126-conditional-clerk-middleware.md) — Conditional Clerk middleware
- [ADR-141](141-mcp-apps-standard-primary.md) — MCP Apps standard as primary

## Context

The `@clerk/mcp-tools` package (`~0.3.1`) is already a dependency of
`apps/oak-curriculum-mcp-streamable-http`. Only
`generateClerkProtectedResourceMetadata()` from the `server` entry point is
used. The Express entry point (`@clerk/mcp-tools/express`) provides six
utilities that overlap with hand-rolled MCP auth plumbing:

1. `verifyClerkToken` (server) — Clerk token verification
2. `mcpAuth` (express) — Generic MCP auth middleware
3. `mcpAuthClerk` (express) — Clerk-specific MCP auth middleware
4. `streamableHttpHandler` (express) — Express↔MCP transport bridge
5. `protectedResourceHandlerClerk` (express) — RFC 9728 PRM endpoint
6. `authServerMetadataHandlerClerk` (express) — OAuth AS metadata endpoint

No ADR previously documented why these utilities are unused. This ADR records
the evaluation and adopt-or-explain decision for each utility, per the principle:
_use off-the-shelf wherever possible; innovate in Oak's domain, not in plumbing._

Full investigation findings are recorded in the
[spike document](../../spikes/clerk-mcp-tools-express-evaluation.md).

## Decision

### Adopt: `verifyClerkToken` from `@clerk/mcp-tools/server`

The library's `verifyClerkToken` is functionally identical to Oak's hand-rolled
`src/auth/mcp-auth/verify-clerk-token.ts`. Same type signature, same logic, same
return type. Adopting it reduces maintenance burden while retaining existing unit
tests as conformance tests.

### Skip: All five Express utilities

Each utility is skipped for specific, documented reasons:

| Utility                          | Primary Reason                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `mcpAuth`                        | No RFC 8707 audience validation; no `allowedHosts` DNS rebinding protection; overwrites `req.auth` |
| `mcpAuthClerk`                   | Wraps `mcpAuth` — inherits all gaps                                                                |
| `streamableHttpHandler`          | Takes shared `McpServer` — incompatible with per-request server model (ADR-112)                    |
| `protectedResourceHandlerClerk`  | No Host validation; reads `process.env` directly (ADR-078); no path-qualified PRM (RFC 9728 §3.1)  |
| `authServerMetadataHandlerClerk` | No URL rewriting; fetches on every request (no caching); reads `process.env` directly (ADR-078)    |

These are not philosophical objections. They are concrete feature gaps confirmed
by reading the library source (`dist/express/index.js`) and validated against
live Clerk documentation (accessed 2026-03-26), which confirms no RFC 8707
support.

### Re-evaluation trigger

If a future `@clerk/mcp-tools` release adds RFC 8707 audience validation,
configurable Host validation, and per-request server support, the SKIP decisions
should be re-evaluated. All three conditions are conjunctive — all must be met
for any Express utility to be reconsidered. The conformance tests retained from
the `verifyClerkToken` adoption provide a model for how to validate library
behaviour against Oak's contract.

**Mechanism**: Dependabot/Renovate alerts for `@clerk/mcp-tools` minor and major
bumps will trigger re-evaluation. The version range is pinned to `~0.3.1`
(patch-only) because the package is pre-1.0 and semver minor bumps may include
breaking changes. Any version bump PR must re-read this ADR and assess whether
the SKIP conditions have changed.

### Accepted residual risk: opaque token bypass

When Clerk issues opaque tokens (prefixed `oat_`), the RFC 8707 audience
validation in `resource-parameter-validator.ts` returns `{ valid: true }` without
checking the audience claim, because opaque tokens cannot be decoded client-side.
If Clerk shifts to opaque tokens for OAuth flows, audience binding is silently
bypassed. This is a pre-existing condition, not introduced by this ADR. It
should be re-evaluated if Clerk's OAuth token verification API begins returning
resource binding information for opaque tokens.

### Accepted residual risk: npm availability

The adopted `verifyClerkToken` is a runtime dependency on `@clerk/mcp-tools`.
If the package were removed from npm, Oak would have no local fallback. The
conformance tests provide a contract specification that could be used to
re-implement locally from git history, but the runtime dependency remains. This
is an accepted trade-off of the adopt decision; the probability is low (Clerk is
well-funded) and the mitigation path is clear.

### Pre-existing ADR-078 gap in `check-mcp-client-auth.ts`

`check-mcp-client-auth.ts` hard-imports `verifyClerkToken` (and four other
dependencies) from module scope rather than receiving them as injected
parameters. This violates ADR-078 (dependency injection for testability) and
forces `vi.mock` usage in the test file. This is pre-existing debt — the same
pattern existed for `getAuth`, `getRequestContext`, `toolRequiresAuth`, and
`validateResourceParameter` before this ADR. The DI refactoring of
`checkMcpClientAuth` is scoped to Phase 4/5 of the MCP Runtime Boundary
Simplification plan, where the explicit ingress boundary will restructure auth
context passing and eliminate these hard imports.

## Consequences

1. **One file deleted**: `src/auth/mcp-auth/verify-clerk-token.ts` — replaced by
   library import.
2. **Import paths updated**: Three source files and one test file updated to
   import `verifyClerkToken` from `@clerk/mcp-tools/server`.
3. **Unit tests retained**: `verify-clerk-token.unit.test.ts` becomes a
   conformance test suite verifying the library function matches Oak's contract.
   The suite guards both call sites (`mcp-auth-clerk.ts` and
   `check-mcp-client-auth.ts`).
4. **Phase 4/5 scope unchanged**: The simplification plan's ingress boundary
   work proceeds as originally scoped — build Oak-owned explicit ingress context
   rather than adopt library utilities.
5. **Architectural record established**: Future contributors have a documented
   rationale for why the Express utilities are unused, preventing re-investigation.
6. **DI refactoring deferred**: The pre-existing ADR-078 violation in
   `check-mcp-client-auth.ts` is tracked for Phase 4/5, not this ADR.
