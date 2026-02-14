# OAuth Validation with MCP Inspector (Manual)

## Purpose

Validate the real Clerk OAuth flow end-to-end after auth changes (middleware wiring, redirect URIs, key rotation).

This workflow is intentionally manual because it requires browser interaction and real Clerk configuration.

## Boundaries

- Manual workflow (not CI)
- Network IO allowed (Clerk)
- Use stub tools by default so no Oak API calls are required

## Recommended Workflow (Auth Enabled, Stub Tools)

1. Start the dev server with auth enabled and stub tools:

```bash
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev:auth:stub
```

2. Start the MCP Inspector against the running server:

```bash
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http inspect:oauth
```

3. In the Inspector UI:

- Connect to `http://localhost:3333/mcp` using the `http` transport
- Call a protected tool (for example `get-key-stages`)
- Complete the OAuth flow in the browser
- Re-run the tool call and confirm it succeeds

## Live Tools (Optional)

If you also want to validate the Oak API integration, start the server with auth enabled (live tools):

```bash
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http dev:auth
```

This requires a valid `OAK_API_KEY` in your local `.env` (never commit it).

## Troubleshooting

### Missing Clerk keys

The server will not start with auth enabled unless `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are present.

- `.env.example` must only contain placeholders
- Keep real keys in local `.env` / `.env.local` only (git-ignored)

### Inspector connects but OAuth does not complete

Likely causes:

- Redirect URI mismatch in Clerk
- Incorrect Clerk domain/keys
- Cookie/session blockers in the browser profile

## Related Docs

- MCP Inspector: <https://modelcontextprotocol.io/docs/tools/inspector>
- MCP spec (authorisation): <https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization>
