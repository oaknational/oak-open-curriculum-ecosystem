# Vercel Environment Configuration

This reference lists the environment variables and platform settings required to run the Streamable HTTP server on Vercel. Apply the same configuration to both the **Production** and **Preview** environments, with the exceptions noted below.

## Runtime Configuration

- **Runtime**: Node.js (Edge runtimes are not supported)
- **Build Output**: Serve the default `/api` output (no custom `output: export`)
- **Serverless Functions**: No additional configuration required; the server runs as a standard Node server

## Required Environment Variables

| Variable                | Production | Preview | Notes                                                |
| ----------------------- | ---------- | ------- | ---------------------------------------------------- |
| `CLERK_PUBLISHABLE_KEY` | ✅         | ✅      | Clerk publishable key for the deployed application   |
| `CLERK_SECRET_KEY`      | ✅         | ✅      | Clerk secret key used by server-side auth middleware |
| `OAK_API_KEY`           | ✅         | ✅      | Oak Curriculum API key for live data                 |

## Optional Environment Variables

| Variable                       | Default Behaviour                                                                 | Usage                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `ALLOWED_HOSTS`                | Localhost allow-list, or `VERCEL_URL` + localhost entries if `VERCEL_URL` present | Override to provide a custom DNS allow-list for the DNS-rebinding guard                  |
| `ALLOWED_ORIGINS`              | Localhost origins, or `https://${VERCEL_URL}` + localhost if `VERCEL_URL` present | Override to expand the CORS allow-list                                                   |
| `REMOTE_MCP_MODE`              | `stateless`                                                                       | Switch to `session` to enable session headers in CORS responses                          |
| `LOG_LEVEL`                    | `info`                                                                            | Useful for smoke harness diagnostics; server-side logging tidy-up tracked in the backlog |
| `MCP_STREAMABLE_HTTP_LOG_FILE` | `apps/oak-curriculum-mcp-streamable-http/.logs/dev-server.log`                    | Override the file sink used by the in-process logger                                     |
| `DANGEROUSLY_DISABLE_AUTH`     | **Must remain unset/`false`**                                                     | Local development only; never enable in Vercel environments                              |

## Preview vs Production Notes

- **Preview Deployments**: Configure the same keys as production. Clerk restricts tokens by domain, so ensure preview URLs are present in the Clerk allowlist. If you rely on the automatic defaults, Vercel will supply `VERCEL_URL`, which becomes the allow-listed host/origin.
- **Production Deployment**: Mirrors the preview configuration. Provide explicit `ALLOWED_HOSTS` / `ALLOWED_ORIGINS` only when you need to extend beyond the defaults derived from `VERCEL_URL`.

## Verification Checklist

- After every configuration change, redeploy and run:
  1. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote --remote-base-url https://<deployment-host>/mcp`
  2. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live:auth` (optional but recommended when Clerk settings change)
- Confirm that unauthenticated `POST /mcp` requests return `401` with a `WWW-Authenticate` header, and that the OAuth flow succeeds in an MCP client such as Claude Desktop.
