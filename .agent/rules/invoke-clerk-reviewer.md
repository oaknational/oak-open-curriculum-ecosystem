# Invoke Clerk Reviewer

When changes touch Clerk-specific concerns, invoke the `clerk-reviewer` specialist in addition to the standard `code-reviewer` gateway.

## Trigger Conditions

Invoke `clerk-reviewer` when the change involves:

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

Do not invoke `clerk-reviewer` for:

- Generic HTTP middleware issues unrelated to Clerk (request parsing, body limits)
- Non-Clerk authentication concepts unrelated to Clerk implementation
- Oak product decisions that do not involve Clerk platform capabilities
- Security exploitability assessment (use `security-reviewer`)
- MCP specification compliance assessment (use `mcp-reviewer`)

## Overlap Boundaries

- **`code-reviewer`**: Always invoke as the gateway. `clerk-reviewer` adds Clerk-specific depth.
- **`security-reviewer`**: Add when auth changes have exploitability implications (injection, credential exposure, auth bypass).
- **`mcp-reviewer`**: Add when MCP auth spec compliance is in question (WWW-Authenticate headers, RFC 9728/8414 structure).
- **`architecture-reviewer-wilma`**: Add when OAuth proxy resilience (timeouts, retries, circuit breaking) is involved.

## Invocation

See `.agent/directives/invoke-code-reviewers.md` for the full reviewer catalogue and invocation policy. The `clerk-reviewer` canonical template is at `.agent/sub-agents/templates/clerk-reviewer.md`.
