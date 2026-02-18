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

| Variable                   | Default Behaviour                                                                                              | Usage                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `ALLOWED_HOSTS`            | Localhost allow-list, or all Vercel deployment URLs + localhost entries if any Vercel URL present              | Override to provide a custom DNS allow-list for the DNS-rebinding guard                  |
| `ALLOWED_ORIGINS`          | Localhost origins, or all Vercel deployment URLs (as `https://` origins) + localhost if any Vercel URL present | Override to expand the CORS allow-list                                                   |
| `REMOTE_MCP_MODE`          | `stateless` (recommended)                                                                                      | See "MCP Transport Modes" section below for detailed explanation                         |
| `LOG_LEVEL`                | `info`                                                                                                         | Useful for smoke harness diagnostics; server-side logging tidy-up tracked in the backlog |
| `DANGEROUSLY_DISABLE_AUTH` | **Must remain unset/`false`**                                                                                  | Local development only; never enable in Vercel environments                              |

## Preview vs Production Notes

- **Preview Deployments**: Configure the same keys as production. Clerk restricts tokens by domain, so ensure preview URLs are present in the Clerk allowlist. If you rely on the automatic defaults, Vercel automatically supplies three deployment URLs (`VERCEL_URL`, `VERCEL_BRANCH_URL`, `VERCEL_PROJECT_PRODUCTION_URL`), and all of them become allow-listed hosts/origins.
- **Production Deployment**: Mirrors the preview configuration. All three Vercel deployment URLs are automatically allow-listed. Provide explicit `ALLOWED_HOSTS` / `ALLOWED_ORIGINS` only when you need to extend beyond or replace the defaults derived from Vercel's system environment variables.

## Vercel Deployment URLs

Vercel provides three system environment variables for deployment URLs. When deployed on Vercel, all three URLs are automatically included in the allowed hosts for DNS rebinding protection and CORS origins (in automatic mode):

| Variable                        | Description                                                | Example                           |
| ------------------------------- | ---------------------------------------------------------- | --------------------------------- |
| `VERCEL_URL`                    | Unique URL for this specific deployment                    | `myapp-abc123.vercel.app`         |
| `VERCEL_BRANCH_URL`             | Branch-specific URL (same for all deployments of a branch) | `myapp-git-feat-oauth.vercel.app` |
| `VERCEL_PROJECT_PRODUCTION_URL` | Production URL (same across all production deployments)    | `myapp.vercel.app`                |

This ensures that:

- Preview deployments work via their unique deployment URL and branch URL
- Production deployments are accessible via the unique deployment URL, production URL, and any custom domains
- You don't need to manually configure `ALLOWED_HOSTS` or `ALLOWED_ORIGINS` for standard Vercel deployments

For more information, see [Vercel's System Environment Variables documentation](https://vercel.com/docs/environment-variables/system-environment-variables).

## MCP Transport Modes

The `REMOTE_MCP_MODE` environment variable configures how the MCP transport manages sessions. Understanding this is important for correct deployment configuration.

### Stateless Mode (Default - Recommended for Vercel)

**Value**: `stateless` (or unset, defaults to stateless)

**How it works:**

- No session IDs generated or tracked
- Each request is completely independent
- No server-side state storage required
- Transport initialized with `sessionIdGenerator: undefined`

**CORS Headers (Stateless):**

```text
Allowed Headers: Content-Type, Authorization
Exposed Headers: WWW-Authenticate
```

**Why use stateless mode:**

- ✅ **Perfect for serverless**: No state to maintain between function invocations
- ✅ **Horizontal scaling**: Any instance can handle any request
- ✅ **Vercel compatible**: No session affinity or sticky sessions required
- ✅ **Simpler architecture**: No session storage or validation logic
- ✅ **MCP compliant**: Fully compliant with MCP Streamable HTTP specification

**Recommended for:**

- Vercel deployments (production and preview)
- AWS Lambda, Google Cloud Functions, Azure Functions
- Any serverless or auto-scaling platform
- Stateless RESTful architectures

### Session Mode (Not Recommended for Vercel)

**Value**: `session`

**How it works:**

- Server generates unique session IDs for each client
- Session ID sent via `Mcp-Session-Id` response header
- Client must include `mcp-session-id` request header on subsequent requests
- Server validates session ID and maintains in-memory state
- **Requires persistent server process** (not suitable for serverless)

**CORS Headers (Session):**

```text
Allowed Headers: Content-Type, Authorization, mcp-session-id
Exposed Headers: Mcp-Session-Id, WWW-Authenticate
```

**Why NOT to use session mode on Vercel:**

- ❌ **State lost between invocations**: Serverless functions are ephemeral
- ❌ **No session affinity**: Different requests may hit different instances
- ❌ **Scaling issues**: Requires sticky sessions or shared session storage
- ❌ **Complexity**: Needs session store (Redis, DynamoDB, etc.)

**When to use session mode:**

- Long-running server processes (traditional VPS, dedicated servers)
- Applications requiring server-side state between requests
- Load balancers with sticky session support
- Use cases where you CANNOT use OAuth or other stateless auth

### Current Implementation

The HTTP server uses the **per-request transport pattern**: each incoming request creates a fresh `McpServer` and `StreamableHTTPServerTransport`. This matches the MCP SDK's canonical stateless example and works correctly on Vercel (both cold starts and warm instances).

```typescript
// Per-request factory (from src/application.ts)
const mcpFactory: McpServerFactory = () => {
  const server = new McpServer(
    { name: 'oak-curriculum-http', version: '0.1.0' },
    { instructions: SERVER_INSTRUCTIONS },
  );
  registerHandlers(server, handlerOptions);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  return { server, transport };
};
```

Shared dependencies (Elasticsearch client, runtime configuration) are created once at startup. The `REMOTE_MCP_MODE` environment variable currently **only affects CORS headers**, not the actual transport behaviour.

### Recommendation

**For all Vercel deployments (production and preview), either:**

1. Leave `REMOTE_MCP_MODE` unset (defaults to stateless), OR
2. Explicitly set `REMOTE_MCP_MODE=stateless`

**Do not set `REMOTE_MCP_MODE=session` on Vercel** - it will not work correctly and may cause unexpected behavior.

## Verification Checklist

- After every configuration change, redeploy and run:
  1. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote --remote-base-url https://<deployment-host>/mcp`
  2. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live:auth` (optional but recommended when Clerk settings change)
- Confirm that unauthenticated `POST /mcp` requests return `401` with a `WWW-Authenticate` header, and that the OAuth flow succeeds in an MCP client such as Claude Desktop.
