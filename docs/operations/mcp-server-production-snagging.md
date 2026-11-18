# MCP server: production snagging list

Faults and shortcomings seen on the production Curriculum MCP server
(`https://mcp.thenational.academy/mcp`) that are not yet fixed or deliberately accepted. Each
entry says what was seen, when, and on what evidence. An entry leaves this list when it is fixed
or when a decision record accepts it.

This is a list of notes, not a plan: an entry carries no owner and no priority until someone
takes it up.

## Open

### 1. A client holding older sign-in state can fail against the two-issuer layout

- **Seen:** 2026-11-16.
- **What:** one client configuration failed to sign in, reporting that it expected
  `mcp.thenational.academy` and received `clerk.thenational.academy`. A fresh connection to the
  same address signed in.
- **Context:** the layout itself is decided, not a fault.
  [ADR-115](../architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md) has the
  protected-resource metadata name the upstream authorisation server
  (`https://clerk.thenational.academy`) while the server's own authorisation-server metadata uses
  the server's origin for clients that discover by origin.
- **Open question:** which client state fails, and whether a client can be told to discard it.
  The cause of the one failure was not established.

### 2. Unknown addresses return an HTML page

- **Seen:** 2026-11-16.
- **What:** a request to an address the server does not serve returns `Cannot GET /…` as HTML
  with status 404. A client of the server expects JSON.
- **Fix in hand:** the reunification pull request (oaknational#1023) returns
  `{"error":"Not found"}`. Remove this entry when a release carrying it is in production.

### 3. Some tools return very large results from small requests

- **Seen:** 2026-11-16.
- **What:** sizes of the normalised result:

  | Tool                       | Arguments                                            | Size         |
  | -------------------------- | ---------------------------------------------------- | ------------ |
  | `get-sequences-assets`     | `sequence: maths-primary`, `year: 1`                 | about 750 kB |
  | `browse-curriculum`        | none                                                 | about 740 kB |
  | `get-sequences-questions`  | `sequence: maths-secondary`, `limit: 20`             | about 346 kB |
  | `get-programmes-questions` | `programme: computing-secondary-year-7`, `limit: 20` | about 252 kB |

- **Effect:** a result of that size can exceed what a client or model accepts.

### 4. Most clients do not start sign-in from a challenge carried in a tool result

- **Seen:** 2026-11-16, in the `mcpjam compat` report (`@mcpjam/cli` 6.3.1, host catalogue 31).
- **What:** 24 of 28 client hosts show a tool result carrying `_meta["mcp/www_authenticate"]` as
  an ordinary error and do not start sign-in from it. Every tool declares the OAuth security
  scheme that asks for sign-in that way.
- **Effect:** on those clients, a user whose session has lapsed sees an error where a sign-in
  prompt was intended.

### 5. The response headers clients receive are not the ones the application sets

- **Seen:** 2026-11-16, on `/healthz`.
- **What:** `apps/oak-curriculum-mcp-streamable-http/src/security-headers.ts` sets a 13-directive
  content security policy, `X-Frame-Options: SAMEORIGIN` and `Referrer-Policy: no-referrer`.
  Production serves `content-security-policy: upgrade-insecure-requests; frame-ancestors 'self';`,
  `x-frame-options: DENY`, `referrer-policy: strict-origin-when-cross-origin` and a
  `permissions-policy` header the application does not set.
- **Cause:** Oak's Cloudflare rewrites response headers for hosts under `thenational.academy`
  (confirmed by the repository owner, 2026-11-16).
- **Effect:** the comments and tests in the application describe a policy that production does
  not serve. The policy in force is the one set at the edge.

## Evidence

Entries 1 to 5 come from the comparison recorded in
[the consistency report of 2026-11-16](../../.agent/reports/reunification-production-preview-consistency-2026-11-16.md).
