# Agent preview verification

Operational checks for a **deployed** MCP HTTP server (Vercel preview or
production). These scripts replace the retired `pnpm smoke:remote` harness
(see ADR-121 change log, 2026-05-04). They live in this workspace because
they exercise this app's HTTP surface, not as a new ADR.

## When to run

- After a Vercel preview deploy, before pointing Cursor at a new URL
- After changing auth, middleware, or MCP transport code
- When validating that an agent host (Cursor) can complete OAuth + tool calls

## Scripts

| Script                           | npm command                | Auth required                          |
| -------------------------------- | -------------------------- | -------------------------------------- |
| `scripts/probe-remote-mcp.sh`    | `pnpm probe:remote`        | No (optional token for one initialize) |
| `scripts/agent-preview-smoke.ts` | `pnpm smoke:agent-preview` | Layer 1: no; Layer 2: Bearer token     |

Set the deployment origin (no trailing slash):

```bash
export MCP_PROBE_BASE_URL='https://<your-preview-host>'
```

### Baseline probe (curl, ~5s)

```bash
pnpm probe:remote
# or
pnpm probe:remote -- --base-url="$MCP_PROBE_BASE_URL"
```

Checks:

- `GET /healthz` → 200
- `GET /.well-known/oauth-protected-resource` → 200 with OAuth metadata
- `POST /mcp` without `Authorization` → 401 with `WWW-Authenticate` (`Bearer`, `resource_metadata=`)

### Agent smoke (fetch + SSE parse)

```bash
# Unauthenticated layer only
pnpm smoke:agent-preview

# Full path: same as a Cursor agent after OAuth
export MCP_PROBE_BEARER_TOKEN='<clerk-access-token>'
pnpm smoke:agent-preview
```

Layer 2 calls, in order:

1. `initialize`
2. `tools/list` (asserts `get-curriculum-model` is present)
3. `tools/call` `get-curriculum-model` (orientation tool agents are told to use first)

Obtain a token from Cursor after connecting the preview MCP server, or from
Clerk for a test user. **Do not commit tokens.**

## Cursor configuration

Point `.cursor/mcp.json` (or the Cursor UI) at the preview `/mcp` URL. After
OAuth, run `smoke:agent-preview` with `MCP_PROBE_BEARER_TOKEN` to confirm the
same path the IDE uses.

For Sentry error-path validation, use
`scripts/probe-sentry-error-capture.sh` (separate concern).

## Related docs

- [README smoke-test checklist](../README.md#smoke-test-checklist-post-deploy)
- [Sentry deployment runbook](../../../docs/operations/sentry-deployment-runbook.md) — notes `smoke:remote` retirement
