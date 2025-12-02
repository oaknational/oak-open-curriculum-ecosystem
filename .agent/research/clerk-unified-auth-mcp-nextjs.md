# Unified Auth with Clerk for **Aila**, **Semantic Search** (Next.js), and the **MCP Server** (Express on Vercel)

> **Goal** – Use the _same_ Clerk project (same users, policies, and social connections) across:
>
> - **Aila** – existing Next.js web app (already on Clerk)
> - **Semantic Search** – new Next.js web app
> - **MCP Server** – HTTP MCP server (Express) deployed on Vercel that must support OAuth per the MCP spec
>
> This document is an **introduction**, a **reference**, and an **implementable plan**. It assumes you already have a Clerk Production instance powering _Aila_.

---

## Table of Contents

1. [Executive Summary & Architecture](#executive-summary--architecture)
2. [What we will reuse from Aila’s Clerk setup](#what-we-will-reuse-from-ailas-clerk-setup)
3. [Standards & Requirements (MCP + OAuth)](#standards--requirements-mcp--oauth)
4. [Clerk project configuration (one time)](#clerk-project-configuration-one-time)
   - [Enforce internal access first (thenational.academy)](#enforce-internal-access-first-thenationalacademy)
   - [Social connections: Google and Microsoft](#social-connections-google-and-microsoft)
   - [Environment variables & keys](#environment-variables--keys)
   - [Sharing users across apps](#sharing-users-across-apps)
5. [Implementation – Semantic Search (Next.js)](#implementation--semantic-search-nextjs)
6. [Implementation – MCP Server (Express on Vercel)](#implementation--mcp-server-express-on-vercel)
   - [1) Express + Clerk middleware](#1-express--clerk-middleware)
   - [2) CORS](#2-cors)
   - [3) Bearer token verification and 401 semantics](#3-bearer-token-verification-and-401-semantics)
   - [4) MCP “Authorization Server Metadata” endpoint](#4-mcp-authorization-server-metadata-endpoint)
   - [5) Vercel deployment notes](#5-vercel-deployment-notes)
7. [How requests should flow (end‑to‑end)](#how-requests-should-flow-endtoend)
8. [Opening access to the public later](#opening-access-to-the-public-later)
9. [Security hardening checklist](#security-hardening-checklist)
10. [Testing & troubleshooting playbook](#testing--troubleshooting-playbook)
11. [Appendix A – Code snippets](#appendix-a--code-snippets)
12. [Appendix B – Terminology quick reference](#appendix-b--terminology-quick-reference)
13. [Appendix C – Source links](#appendix-c--source-links)

---

## Executive Summary & Architecture

- **Use the same Clerk Production instance** that powers _Aila_. Configure **Semantic Search** and the **MCP Server** to use this **one** instance’s keys and policies so the **same users and rules apply everywhere**. This shares the user base and sign‑in methods out of the box. citeturn24view0
- **Semantic Search (Next.js)** uses `@clerk/nextjs` for UI and session management. When it calls the **MCP Server**, it attaches the current **session token** in the `Authorization: Bearer <token>` header. citeturn7view0turn22search0
- The **MCP Server (Express)** uses `@clerk/express` middleware to authenticate requests, **returns 401** for missing/invalid tokens, and exposes a **discovery endpoint** at `/.well-known/oauth-authorization-server` that points to Clerk’s OIDC discovery for RFC 8414 compatibility (so MCP clients can discover auth automatically). citeturn1view0turn15view0turn23view0

```
+-------------------+           Bearer token            +---------------------+
|  Semantic Search  |  fetch(..., Authorization: ... ) |      MCP Server     |
|  Next.js (new)    | --------------------------------> |  Express on Vercel  |
|  @clerk/nextjs    |                                   |  @clerk/express     |
+---------+---------+                                   +----+-----------+----+
          |                                                  |           |
          | Clerk session (browser)                          | verifies  |
          v                                                  v           v
   +-------------+                                 +----------------+   +-----------------------+
   |   Clerk     |<---------- OIDC/OAuth ----------|   Discovery    |   | Users & Social IdPs  |
   |  (same app) |                                 | (well-known)   |   | Google / Microsoft   |
   +-------------+                                 +----------------+   +-----------------------+
```

---

## What we will reuse from Aila’s Clerk setup

- **Clerk Production instance** (users, MFA, session policies, and SSO connections).
- **Google** (and later **Microsoft**) social connections.
- **Allowlist** rules to restrict access **initially** to `*.thenational.academy` email addresses via Google/Microsoft. citeturn12view0

> Using the _same_ Clerk instance means **Semantic Search** and the **MCP Server** see the same users and follow the same sign‑in rules. If you used different Clerk instances, you’d split the user base and config.

---

## Standards & Requirements (MCP + OAuth)

- MCP auth over HTTP **MUST** implement **OAuth 2.1**, expose **Authorization Server Metadata** (RFC 8414), and **return HTTP 401** when authorization is needed/invalid so clients can begin the OAuth flow. It also standardizes **fallback paths** if discovery isn’t available. citeturn15view0
- **Access tokens** must be sent using the **`Authorization: Bearer`** header and **never** in the URL. Resource servers must validate tokens and reply **401** when invalid/expired. citeturn15view0
- Our approach: **Clerk** acts as the **IdP/Authorization Server**. The **MCP Server** is the _resource server_ that **verifies Clerk-issued tokens** and **hosts the discovery document** at `/.well-known/oauth-authorization-server` (proxying Clerk’s discovery), satisfying MCP’s discovery requirement without re-implementing OAuth. citeturn23view0turn15view0

---

## Clerk project configuration (one time)

### Enforce internal access first (`thenational.academy`)

1. In **Clerk Dashboard → Configuration → Restrictions**, enable **Allowlist** and add the domain `thenational.academy`. This blocks sign‑ups/sign‑ins from other domains while the allowlist is active. (You can relax this later.) citeturn12view0
2. **Note about Google’s `hd` param**: Google’s Hosted Domain (`hd`) parameter is **a hint**, not strict enforcement. Rely on Clerk’s **Allowlist** to enforce domain restrictions. citeturn4view1

### Social connections: Google and Microsoft

- **Google** – In **SSO connections**, add **Google**. For **production**, use your own Google OAuth credentials and ensure the Google app is **“In production”** (not “Testing”). Consider enabling Clerk’s **“Block email subaddresses”** to mitigate the `user+alias@domain` issue. citeturn13view0
- **Microsoft (Entra ID)** – Add **Microsoft** social connection and configure an app in the Microsoft Azure portal with the redirect URI from Clerk. citeturn13view1

### Environment variables & keys

- **Frontend (Next.js):** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (server only). Optional redirect URLs and domain-sharing variables are documented here. citeturn14view0
- **Backends (Express MCP):** `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, optionally `CLERK_JWT_KEY` (PEM public key for **networkless** JWT verification). citeturn11view0turn16view0

### Sharing users across apps

- To **share production settings and user data** across environments/apps, use the **same production API keys** and (when relevant for cookie-based SSO) the **same root domain**. This is how preview/staging share prod users; we use the same principle for multiple apps that should act as one group. citeturn24view0

---

## Implementation – **Semantic Search** (Next.js)

1. **Install & wrap the app**

```bash
npm i @clerk/nextjs
```

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
```

2. **Protect routes** using Clerk’s components (`<SignedIn>`, `<SignedOut>`) or route middleware as needed. See the Next.js quickstart. citeturn7view0

3. **Call the MCP Server with a Bearer token**

Use `getToken()` and include the session token in the `Authorization` header for cross‑origin requests. citeturn22search0

```tsx
// example client component or helper
import { useAuth } from '@clerk/nextjs';

export function useMcpFetch() {
  const { getToken } = useAuth();
  return async (input: RequestInfo, init: RequestInit = {}) => {
    const token = await getToken();
    return fetch(input, {
      ...init,
      headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` },
    });
  };
}
```

> **Why Bearer tokens?** When the client and server are on different origins, cookie-based sessions won’t flow; pass the session token explicitly as a Bearer token. citeturn22search0

---

## Implementation – **MCP Server** (Express on Vercel)

### 1) Express + Clerk middleware

```bash
npm i express @clerk/express @clerk/backend cors
```

```ts
// server.ts
import express from 'express';
import cors from 'cors';
import { clerkMiddleware, getAuth } from '@clerk/express';

const app = express();

app.use(express.json());

// Only allow your known frontends to call the MCP server
app.use(
  cors({
    origin: [
      'https://semantic-search.example.com',
      'https://aila.example.com',
      'http://localhost:3000',
    ],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type', 'MCP-Protocol-Version'],
  }),
);

// Clerk parses cookies or Bearer tokens and attaches req.auth
app.use(
  clerkMiddleware({
    // Verify tokens were minted for expected origins (prevents subdomain attacks)
    authorizedParties: [
      'https://semantic-search.example.com',
      'https://aila.example.com',
      'http://localhost:3000',
    ],
  }),
);

// Minimal auth guard for API semantics (no redirects)
function ensureAuth(req, res, next) {
  const { sessionId } = getAuth(req);
  if (!sessionId) {
    res.set('WWW-Authenticate', 'Bearer');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}

// Example protected MCP route
app.get('/v1/health', ensureAuth, (req, res) => {
  res.json({ ok: true });
});

export default app;
```

This follows the official `@clerk/express` pattern and uses `authorizedParties` to validate the token’s `azp` claim. citeturn1view0turn17view0

> **Offline/JWKS verification (optional)** – If you prefer networkless verification, set `CLERK_JWT_KEY` and validate with `@clerk/backend`’s `verifyToken()` or `authenticateRequest()` (which also supports `authorizedParties`). citeturn11view0turn16view0

### 2) CORS

Because `Semantic Search` and the MCP server are separate origins, enable CORS **only** for your known frontends and include `Authorization` in allowed headers (as shown above). (General Express/Vercel guidance.) citeturn21search0

### 3) Bearer token verification and **401** semantics

- If `Authorization` is missing or the token is invalid/expired, **return `401 Unauthorized`** and set `WWW-Authenticate: Bearer` to signal the client to start/refresh OAuth. This aligns with MCP’s requirements for starting the flow. citeturn15view0
- `clerkMiddleware()` already inspects cookies/headers and populates `req.auth`. Your guard simply checks `sessionId` (or you can fully verify the token manually). citeturn1view0

### 4) MCP “Authorization Server Metadata” endpoint

MCP clients **discover** how to authenticate via **RFC 8414 Authorization Server Metadata** at:

```
GET /.well-known/oauth-authorization-server
```

Instead of reinventing OAuth, simply **proxy Clerk’s OIDC discovery document** (the _Discovery URL_ shown in your Clerk OAuth application) and return it from this endpoint:

```ts
// server.ts (continued)
app.get('/.well-known/oauth-authorization-server', async (_req, res) => {
  const discoveryUrl = process.env.CLERK_OIDC_DISCOVERY_URL;
  // e.g. https://<your-app>.clerk.accounts.dev/.well-known/openid-configuration
  const r = await fetch(discoveryUrl);
  const data = await r.json();
  res.json(data); // OIDC discovery is a superset of RFC 8414 metadata
});
```

- MCP requires the **metadata endpoint to live at the root** of the MCP server’s domain; by proxying, clients still get the correct **issuer**, **authorization_endpoint**, **token_endpoint**, **jwks_uri**, etc., from Clerk. citeturn15view0turn23view0
- For **JWT verification**, you may also want to expose Clerk’s **JWKS** via Clerk’s documented path (`<Frontend API>/.well-known/jwks.json`) or just let clients use the path in the discovery document. citeturn16view0

> **Why this design?** It satisfies MCP’s discovery location requirement **and** lets Clerk remain the source of truth for OAuth/OIDC endpoints. citeturn15view0

### 5) Vercel deployment notes

Vercel supports Express with **zero configuration**; export your app from `server.ts`/`index.ts`. Put your keys in Vercel Project → **Settings → Environment Variables** and redeploy. citeturn21search0

---

## How requests should flow (end‑to‑end)

1. User signs in to **Semantic Search** with Google (or Microsoft) via Clerk. citeturn13view0turn13view1
2. **Semantic Search** calls the **MCP Server** with `Authorization: Bearer <Clerk session token>`. citeturn22search0
3. MCP Server’s Clerk middleware authenticates the token; your guard returns **401** if missing/invalid (so a client can initiate OAuth). citeturn1view0turn15view0
4. For MCP clients that need discovery, they fetch `/.well-known/oauth-authorization-server`, receive Clerk’s discovery, and complete OAuth using Clerk’s **authorize**/**token** endpoints. citeturn23view0turn15view0

---

## Opening access to the public later

- **Disable Allowlist** (or switch to **Blocklist** only) when you’re ready to accept all users. citeturn12view0
- Keep **Google** and **Microsoft** SSO enabled for convenience. citeturn13view0turn13view1
- Consider adding rate limits and monitoring before opening to the public.

---

## Security hardening checklist

- [ ] Set **`authorizedParties`** on the MCP Server (and anywhere you verify tokens) to pin tokens to your frontends’ origins. citeturn17view0turn11view0
- [ ] Prefer **networkless** verification (`CLERK_JWT_KEY`) for resilience. citeturn11view0
- [ ] Enforce **HTTPS** for all endpoints; MCP requires secure endpoints. citeturn15view0
- [ ] Keep **Allowlist** during internal testing; disable only when ready. citeturn12view0
- [ ] Limit CORS to known origins; include `Authorization` header. (Express/Vercel guidance.) citeturn21search0

---

## Testing & troubleshooting playbook

1. **Smoke test with Clerk’s Account Portal** – Confirm Google/Microsoft SSO work in **production** mode. citeturn13view0
2. **Acquire a token** in Semantic Search and **curl** the MCP Server:
   ```bash
   # In a Next.js server action or small test route, log await auth().getToken()
   curl -H "Authorization: Bearer <token>" https://mcp.example.com/v1/health
   ```
   The MCP Server should return `{"ok": true}`; if the token is missing/invalid, it should return **401** and set `WWW-Authenticate: Bearer`. citeturn15view0
3. **Discovery check** – `curl https://mcp.example.com/.well-known/oauth-authorization-server` returns Clerk’s OIDC discovery JSON (with `issuer`, `authorization_endpoint`, `token_endpoint`, `jwks_uri`, …). citeturn23view0
4. **JWKS check** – From the discovery `jwks_uri` (or Clerk Frontend API `/.well-known/jwks.json`), fetch keys and verify signature locally. citeturn16view0

---

## Appendix A – Code snippets

### A1. Next.js (Semantic Search): `auth()` in a Route Handler

```ts
// app/api/profile/route.ts
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId, getToken } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const token = await getToken();
  const r = await fetch(process.env.MCP_BASE_URL + '/v1/health', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return new Response(await r.text(), { status: r.status });
}
```

Use `auth().getToken()` to grab the current session token on the server. citeturn22search12

### A2. Express (MCP): Networkless verification with `@clerk/backend`

```ts
import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

async function verifyBearer(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    res.set('WWW-Authenticate', 'Bearer');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { isSignedIn, toAuth } = await clerk.authenticateRequest(req, {
      jwtKey: process.env.CLERK_JWT_KEY,
      authorizedParties: ['https://semantic-search.example.com'],
    });
    if (!isSignedIn) throw new Error('Not signed in');
    // attach useful claims
    req.auth = toAuth();
    next();
  } catch (err) {
    res.set('WWW-Authenticate', 'Bearer error="invalid_token"');
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
```

`authenticateRequest()` validates the signature (with JWKS or `CLERK_JWT_KEY`) and enforces `authorizedParties`. citeturn16view0

### A3. MCP discovery proxy in Express

```ts
app.get('/.well-known/oauth-authorization-server', async (_req, res) => {
  const discoveryUrl = process.env.CLERK_OIDC_DISCOVERY_URL; // from Clerk OAuth application
  const r = await fetch(discoveryUrl);
  res
    .status(r.status)
    .set(Object.fromEntries(r.headers))
    .send(await r.text());
});
```

The Clerk OAuth Application UI exposes a **Discovery URL**, **Authorize URL**, **Token URL**, and more; proxying the discovery URL satisfies MCP’s discovery requirement. citeturn23view0turn15view0

### A4. Vercel: minimal files for Express

- `server.ts` (export default `app` as shown above)
- No special config needed; Vercel detects Express automatically. Put env vars in Project Settings → **Environment Variables**. citeturn21search0

---

## Appendix B – Terminology quick reference

- **Clerk instance** – Your application in Clerk (has Dev/Prod environments, keys).
- **Publishable/Secret keys** – Frontend vs backend keys for your Clerk instance. citeturn14view0
- **Authorized Parties (`azp`)** – The origin allowed to mint valid session tokens; enforce via `authorizedParties` when verifying tokens. citeturn17view0turn11view0
- **JWKS** – JSON Web Key Set for verifying JWT signatures. Clerk publishes it at `<Frontend API>/.well-known/jwks.json`. citeturn16view0
- **MCP Authorization metadata** – OAuth server metadata (RFC 8414) discoverable at `/.well-known/oauth-authorization-server` on the MCP server’s domain. citeturn15view0

---

## Appendix C – Source links

- **MCP Authorization Spec (2025‑03‑26)** – requirements for 401, metadata, base URL, and third‑party flow. citeturn15view0
- **Clerk Express quickstart** – `clerkMiddleware`, `requireAuth`, `getAuth`. citeturn1view0
- **Clerk Next.js quickstart** – setup, environment variables. citeturn7view0
- **Clerk environment variables** – `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, redirects, satellite domains. citeturn14view0
- **authorizedParties best practice** (production). citeturn17view0
- **Allowlist & Restrictions** – domain allowlist/blocklist. citeturn12view0
- **Google provider** (prod credentials, “In production”, subaddress block). citeturn13view0
- **Microsoft provider** (Entra ID app + redirect URIs). citeturn13view1
- **Clerk OAuth/IdP & Discovery URL** – Clerk as IdP/authorization server. citeturn23view0
- **Make cross‑origin requests with `getToken()`**. citeturn22search0
- **JWKS endpoints** – where to fetch Clerk keys. citeturn16view0
- **Express on Vercel** – zero-config support. citeturn21search0
- **Sharing users/settings via same keys/domain**. citeturn24view0

---

### Implementation status

This plan keeps **one sign‑in** and **one user store** across _Aila_, _Semantic Search_, and the **MCP Server**, complies with MCP’s discovery and 401 semantics, and defers token issuance/validation to Clerk wherever possible.
