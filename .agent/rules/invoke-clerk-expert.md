# Invoke Clerk Expert

Operationalises [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md), [ADR-053 (Clerk as Identity Provider)](../../docs/architecture/architectural-decisions/053-clerk-as-identity-provider.md), and [ADR-142 (`@clerk/mcp-tools` Adopt-or-Explain)](../../docs/architecture/architectural-decisions/142-clerk-mcp-tools-adopt-or-explain.md).

When changes touch Clerk-specific concerns, invoke the `clerk-expert` specialist in addition to the standard `code-expert` gateway.

## Trigger Conditions

Invoke `clerk-expert` when the change involves:

- Clerk middleware configuration (`clerkMiddleware()`, `requireAuth()`, `getAuth()`)
- Token verification logic (`verifyToken()`, `authenticateRequest()`)
- OAuth proxy endpoints (register, authorise, token exchange)
- Protected resource metadata (PRM) or authorisation server (AS) metadata generation or rewriting
- `@clerk/mcp-tools` usage or PRM helpers
- Clerk environment variable handling (`CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`)
- Social connection or allowlist configuration
- Clerk SDK version upgrades or migration
- Auth error detection or interception logic touching Clerk error patterns

## Non-Goals

Do not invoke `clerk-expert` for:

- Generic HTTP middleware issues unrelated to Clerk (request parsing, body limits)
- Non-Clerk authentication concepts unrelated to Clerk implementation
- Oak product decisions that do not involve Clerk platform capabilities
- Security exploitability assessment (use `security-expert`)
- MCP specification compliance assessment (use `mcp-expert`)

## Overlap Boundaries

- **`code-expert`**: Always invoke as the gateway. `clerk-expert` adds Clerk-specific depth.
- **`security-expert`**: Add when auth changes have exploitability implications (injection, credential exposure, auth bypass).
- **`mcp-expert`**: Add when MCP auth spec compliance is in question (WWW-Authenticate headers, RFC 9728/8414 structure).
- **`architecture-expert-wilma`**: Add when OAuth proxy resilience (timeouts, retries, circuit breaking) is involved.

## Invocation

See `.agent/memory/executive/invoke-code-experts.md` for the full reviewer catalogue and invocation policy. The `clerk-expert` canonical template is at `.agent/sub-agents/templates/clerk-expert.md`.
