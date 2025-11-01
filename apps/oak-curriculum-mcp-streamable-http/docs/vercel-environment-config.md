# Vercel Environment Configuration

This reference lists the environment variables and platform settings required to run the Streamable HTTP server on Vercel. Apply the same configuration to both the **Production** and **Preview** environments, with the exceptions noted below.

## Runtime Configuration

- **Runtime**: Node.js (Edge runtimes are not supported)
- **Build Output**: Serve the default `/api` output (no custom `output: export`)
- **Serverless Functions**: No additional configuration required; the server runs as a standard Node server

## Required Environment Variables

| Variable                | Production | Preview | Notes                                                                                                 |
| ----------------------- | ---------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `CLERK_PUBLISHABLE_KEY` | ✅         | ✅      | Clerk publishable key for the deployed application                                                    |
| `CLERK_SECRET_KEY`      | ✅         | ✅      | Clerk secret key used by server-side auth middleware                                                  |
| `OAK_API_KEY`           | ✅         | ✅      | Oak Curriculum API key for live data                                                                  |
| `ALLOWED_HOSTS`         | ✅         | ✅      | Comma-separated host allowlist (include the deployment hostname, e.g. `open-api.thenational.academy`) |
| `BASE_URL`              | ✅         | ✅      | Base REST API URL (e.g. `https://open-api.thenational.academy`)                                       |
| `MCP_CANONICAL_URI`     | ✅         | ✅      | Canonical MCP endpoint (e.g. `https://open-api.thenational.academy/mcp`)                              |

## Optional Environment Variables

| Variable                   | Default                       | Usage                                                                                         |
| -------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------- |
| `ALLOWED_ORIGINS`          | unset                         | Enable CORS for browser clients (comma-separated origins)                                     |
| `LOG_LEVEL`                | `info`                        | Set to `debug` temporarily when troubleshooting                                               |
| `DANGEROUSLY_DISABLE_AUTH` | **must remain unset/`false`** | Only used for local development. Never enable in Vercel environments (preview or production). |

## Preview vs Production Notes

- **Preview Deployments**: Configure the same keys as production. Clerk restricts tokens by domain, so ensure preview URLs are present in the Clerk allowlist (`ALLOWED_HOSTS` should include the `*.vercel.app` preview domain if needed). Keep `DANGEROUSLY_DISABLE_AUTH` unset so OAuth remains enforced.
- **Production Deployment**: Mirrors the preview configuration but with the final hostnames in `ALLOWED_HOSTS`, `BASE_URL`, and `MCP_CANONICAL_URI`.

## Verification Checklist

- After every configuration change, redeploy and run:
  1. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote --remote-base-url https://<deployment-host>/mcp`
  2. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live:auth` (optional but recommended when Clerk settings change)
- Confirm that unauthenticated `POST /mcp` requests return `401` with a `WWW-Authenticate` header, and that the OAuth flow succeeds in an MCP client such as Claude Desktop.
