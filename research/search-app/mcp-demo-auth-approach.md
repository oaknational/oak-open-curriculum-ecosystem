# MCP Demo Auth Plan — OAuth2.1-Compliant (Vercel + Express + TypeScript)

**Context**: A **streamable HTTP remote MCP server** built with the TypeScript SDK, deployed on **Vercel**. You want a **demo‑ready**, standards‑compliant approach that **doesn’t require paid third‑party services** beyond what you already have. Your original idea was to verify **Google ID tokens** directly at the server.

> **Bottom line**: Keep Google for user sign‑in, but issue and accept **your own short‑lived OAuth 2.1 access tokens** (JWT) that are **audience‑bound** to your MCP server. Expose **OAuth 2.0 Protected Resource Metadata** and return proper `WWW-Authenticate` hints. Do **not** accept raw Google **ID tokens** as your bearer credential to the MCP server.

---

## 1) Recommended Architecture (demo-friendly, best practice)

### High-level

- **Role split (can be same Node process):**
  - **MCP Resource Server (RS)** — your streamable HTTP endpoint (the thing clients call).
  - **Authorization Server (AS)** — a **thin** OAuth 2.1 surface you host that:
    - performs **Google OIDC login** for the human user (Authorization Code + PKCE);
    - **mints your own access tokens** (JWT per RFC 9068) with `aud` = your MCP “canonical resource URI”;
    - publishes **Authorization Server Metadata** and **JWKS**.
- **Discovery for clients**
  - The RS publishes **OAuth 2.0 Protected Resource Metadata** (RFC 9728) at `/.well-known/oauth-protected-resource`, listing your AS.
  - On `401`, the RS sets `WWW-Authenticate` with a pointer to that metadata.
- **Token model**
  - **Access token**: short‑lived JWT (e.g., 10 minutes), `iss` = your AS URL, `aud` = your MCP canonical URI (e.g., `https://mcp.example.com/mcp`), plus optional claims (`scope`, `org`, `email`).
  - (Optional) **Refresh token** for convenience during demos; rotate if you include it.
- **Authorization policy**
  - During Google login, enforce **domain or allow‑list** (`@thenational.academy`), then embed `org: "thenational.academy"` (or roles/scopes) in your minted access token.
- **Transport rules (MCP)**
  - Clients **must** send `Authorization: Bearer <access_token>` on **every** HTTP request.
  - Tokens **must not** appear in query strings.
  - RS **must** validate audience binding (`aud` matches your canonical resource URI) and signature with your **AS JWKS**.

> You can keep everything in one Express app running on Vercel (Node runtime), exposed under two route groups: `/mcp/*` (RS) and `/oauth/*` + `/.well-known/*` (AS + metadata).

---

## 2) Endpoints & Files (minimal set)

### Resource Server (RS)

- `GET /.well-known/oauth-protected-resource`  
  Returns JSON with the **canonical resource URI** and an `authorization_servers` array pointing to your AS.

- `401` responses  
  Include a `WWW-Authenticate` header that references the **resource metadata URL** above. This lets MCP clients auto‑discover how to authenticate.

- Your MCP routes (`/mcp`, `/mcp/*`)  
  Protected by a **`requireBearer`** middleware that verifies **your** JWT access token (audience, issuer, exp, signature, scopes).

### Authorization Server (AS)

- `GET /.well-known/openid-configuration` (Authorization Server Metadata)  
  Lists your `authorization_endpoint`, `token_endpoint`, `jwks_uri`, supported grants (`authorization_code`), and supported client auth methods.

- `GET /oauth/authorize` (Authorization Code + PKCE)  
  Starts Google OIDC login and stores `state` + `code_verifier` server‑side.

- `GET /oauth/callback` (from Google)  
  Verifies Google ID token → authorizes the user (domain/allow‑list) → **mints your access token** → optional one‑time page that provides the MCP client with the token (or redirects the user back to the client UI).

- `POST /oauth/token`  
  Accepts **authorization code + PKCE** (from your `/oauth/authorize`) and returns `{ access_token, token_type, expires_in, refresh_token? }` for the MCP client. (For a demo you can return the token straight from `/oauth/callback` and skip refresh.)

- `GET /.well-known/jwks.json`  
  Publishes the public keys used to sign your access tokens.

> **Note:** For a demo, you can omit Dynamic Client Registration and just hardcode a public client (`client_id`) that uses PKCE.

---

## 3) Implementation Sketch (TypeScript, Express, `jose`, `openid-client`)

> **Scope:** illustrative code. You can co‑host RS and AS in the same app.

```ts
// pnpm add express cookie-session jose openid-client zod
import express from 'express';
import session from 'cookie-session';
import { z } from 'zod';
import { createRemoteJWKSet, jwtVerify, SignJWT, exportJWK, generateKeyPair } from 'jose';
import { Issuer, generators } from 'openid-client';

// -------------------- ENV --------------------
const Env = z
  .object({
    PORT: z.string().default('3000'),
    BASE_URL: z.string().url(), // e.g. https://mcp.thenational.academy
    MCP_CANONICAL_URI: z.string().url(), // e.g. https://mcp.thenational.academy/mcp
    // Google OIDC
    OIDC_ISSUER: z.string().url().default('https://accounts.google.com'),
    OIDC_CLIENT_ID: z.string(),
    OIDC_CLIENT_SECRET: z.string().optional(), // optional if using PKCE only
    OIDC_REDIRECT_URI: z.string().url(), // e.g. https://.../oauth/callback
    // Policy
    ALLOWED_DOMAIN: z.string().default('thenational.academy'),
    // Session
    SESSION_SECRET: z.string().min(16),
  })
  .parse(process.env);

const app = express();
app.use(
  session({
    name: 'sid',
    secret: Env.SESSION_SECRET,
    sameSite: 'lax',
    secure: true,
    httpOnly: true,
  }),
);

// -------------------- AUTHORIZATION SERVER (AS) --------------------
// 1) Key material (demo: ephemeral; production: persistent KMS/keystore)
const { publicKey, privateKey } = await generateKeyPair('RS256');
const publicJwk = await exportJWK(publicKey);
publicJwk.alg = 'RS256';
publicJwk.use = 'sig';

// 2) OIDC Discovery for Google (upstream IdP)
const google = await Issuer.discover(Env.OIDC_ISSUER);
const googleClient = new google.Client({
  client_id: Env.OIDC_CLIENT_ID,
  client_secret: Env.OIDC_CLIENT_SECRET,
  redirect_uris: [Env.OIDC_REDIRECT_URI],
  response_types: ['code'],
});

// 3) Authorization endpoint (Authorization Code + PKCE)
app.get('/oauth/authorize', (req, res) => {
  const state = generators.state();
  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);
  req.session.oauth = { state, code_verifier };
  // Kick off Google login; request email/profile scopes
  const url = googleClient.authorizationUrl({
    scope: 'openid email profile',
    state,
    code_challenge,
    code_challenge_method: 'S256',
    // optional UX optimization: hd=your domain (Google may still prompt)
    hd: Env.ALLOWED_DOMAIN,
  });
  res.redirect(url);
});

// 4) Callback from Google → mint our own access token
app.get('/oauth/callback', async (req, res, next) => {
  try {
    const { state, code_verifier } = req.session.oauth ?? {};
    if (!state || req.query.state !== state) return res.status(400).send('Bad state');
    const params = googleClient.callbackParams(req);
    const tokenSet = await googleClient.callback(Env.OIDC_REDIRECT_URI, params, {
      state,
      code_verifier,
    });

    // Verify Google ID token & pull identity
    const googleJWKS = createRemoteJWKSet(new URL(`${Env.OIDC_ISSUER}/.well-known/jwks.json`));
    const { payload: gp } = await jwtVerify(tokenSet.id_token!, googleJWKS, {
      issuer: Env.OIDC_ISSUER,
      audience: Env.OIDC_CLIENT_ID,
    });
    const email = gp.email as string | undefined;
    const email_verified = gp.email_verified === true;
    const hd = (gp.hd as string | undefined)?.toLowerCase();

    // Policy: restrict domain
    if (!email_verified || !email || hd !== Env.ALLOWED_DOMAIN) {
      return res.status(403).send('Forbidden');
    }

    // Mint our access token (JWT access token per RFC 9068)
    const now = Math.floor(Date.now() / 1000);
    const accessToken = await new SignJWT({
      sub: gp.sub,
      email,
      org: Env.ALLOWED_DOMAIN,
      scope: 'mcp:invoke mcp:read',
    })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(`${Env.BASE_URL}`) // AS issuer (your domain)
      .setAudience(Env.MCP_CANONICAL_URI) // Resource audience binding
      .setIssuedAt(now)
      .setExpirationTime(now + 10 * 60) // 10 minutes
      .sign(privateKey);

    // For a demo: display the token or instruct user to paste into client
    res.type('html').send(`
      <h1>Authorized</h1>
      <p>Your demo access token (valid ~10m):</p>
      <pre>${accessToken}</pre>
      <p>Use it in <code>Authorization: Bearer &lt;token&gt;</code> for MCP requests.</p>
    `);
  } catch (e) {
    next(e);
  }
});

// 5) Authorization Server Metadata & JWKS
app.get('/.well-known/openid-configuration', (_req, res) => {
  res.json({
    issuer: `${Env.BASE_URL}`,
    authorization_endpoint: `${Env.BASE_URL}/oauth/authorize`,
    token_endpoint: `${Env.BASE_URL}/oauth/token`, // (optional for demo)
    jwks_uri: `${Env.BASE_URL}/.well-known/jwks.json`,
    grant_types_supported: ['authorization_code'],
    response_types_supported: ['code'],
    token_endpoint_auth_methods_supported: ['none', 'client_secret_post'],
  });
});

app.get('/.well-known/jwks.json', (_req, res) => {
  res.json({ keys: [publicJwk] });
});

// (Optional for demo) Token endpoint stub if you implement code exchange explicitly.
app.post('/oauth/token', express.urlencoded({ extended: false }), async (req, res) => {
  // For a minimal demo you can omit this; otherwise, verify code + PKCE and mint as above.
  return res.status(501).json({ error: 'unsupported_for_demo' });
});

// -------------------- RESOURCE SERVER (RS) --------------------
function unauthorized(res: express.Response) {
  res.set(
    'WWW-Authenticate',
    `Bearer resource="${Env.MCP_CANONICAL_URI}", authorization_uri="${Env.BASE_URL}/.well-known/oauth-protected-resource"`,
  );
  return res.status(401).send('Unauthorized');
}

app.get('/.well-known/oauth-protected-resource', (_req, res) => {
  res.json({
    resource: Env.MCP_CANONICAL_URI,
    authorization_servers: [`${Env.BASE_URL}`],
    bearer_methods_supported: ['header'],
    scopes_supported: ['mcp:invoke', 'mcp:read'],
  });
});

// Bearer verifier for **your** access tokens
import type { Request, Response, NextFunction } from 'express';

async function requireBearer(req: Request, res: Response, next: NextFunction) {
  const h = req.header('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return unauthorized(res);
  try {
    const { payload } = await jwtVerify(m[1], async () => publicKey, {
      issuer: `${Env.BASE_URL}`,
      audience: Env.MCP_CANONICAL_URI,
      maxTokenAge: '10m',
      clockTolerance: '60s',
    });
    (req as any).actor = {
      sub: payload.sub,
      email: payload.email,
      org: payload.org,
      scope: payload.scope,
    };
    return next();
  } catch {
    return unauthorized(res);
  }
}

// Example MCP route protection (wire this to your SDK transport handler)
app.all('/mcp*', requireBearer, (_req, res) => {
  res.json({ ok: true, mcp: 'hello' });
});

app.listen(Number(Env.PORT), () => {
  console.log(`MCP demo auth running on ${Env.BASE_URL}`);
});
```

**Notes**

- For a demo, using an **ephemeral keypair** is fine; in production, store signing keys in KMS and rotate.
- If your MCP SDK exposes a transport handler (e.g., `StreamableHTTPServerTransport`), mount it under `/mcp` and apply `requireBearer` to that route.

---

## 4) Comparison — Recommended vs. Original Plan

| Topic                                                   | Original plan (verifying **Google ID tokens** at RS)                    | Recommended plan (your **own access tokens**)                              |
| ------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Bearer presented to RS                                  | **Google ID token** (`iss=accounts.google.com`, `aud=GOOGLE_CLIENT_ID`) | **Your JWT access token** (`iss=your AS`, `aud=<MCP canonical URI>`)       |
| Audience binding                                        | **No** (aud = Google client, not your resource)                         | **Yes** (aud = your MCP resource)                                          |
| MCP compliance (Protected Resource Metadata, 401 hints) | **Missing**                                                             | **Present**: `/.well-known/oauth-protected-resource` + `WWW-Authenticate`  |
| Token type                                              | **ID token** (meant for authentication)                                 | **Access token** (meant for authorization)                                 |
| Resource Indicators (`resource` param)                  | **Not applicable**                                                      | **Required**: client requests tokens specifically for your MCP resource    |
| Confused‑deputy risk                                    | **Higher** (token issued for different audience)                        | **Low** (audience‑bound to RS, local validation)                           |
| Domain / group policy                                   | Checked on Google token                                                 | Checked **at login**, then stamped into your access token (`org`, `scope`) |
| Extra services                                          | None                                                                    | None (AS is embedded in your Node app)                                     |

---

## 5) What **not** to do

- ❌ **Do not** accept **Google ID tokens** as your bearer credential to the MCP server. They are not audience‑bound to your MCP resource and violate the MCP authorization model.
- ❌ **Do not** put tokens in URLs or query strings; always use the `Authorization` header.
- ❌ **Do not** skip **Protected Resource Metadata**. Without it, MCP clients can’t discover your AS cleanly.
- ❌ **Do not** pass through tokens you received from the client to upstream services. If your RS calls other APIs, obtain **separate** tokens for those APIs.
- ❌ **Do not** mint long‑lived access tokens. Use short TTL (e.g., 10 minutes) for demos; rotate refresh tokens if you use them.
- ❌ **Do not** rely solely on the `hd` **request** parameter. Always verify the **returned** token’s `hd` claim _and_ `email_verified` for Workspace restriction.

---

## 6) Vercel & Practicalities

- Prefer a **Node serverless** or **Node runtime** (not Edge) so `openid-client` and `jose` work reliably.
- Use **HTTPS** for all AS endpoints; your `BASE_URL` should be the final HTTPS URL.
- If you spin multiple preview deployments, keep the **canonical MCP URI** stable per environment (prod vs. preview) and mint tokens accordingly.

---

## 7) Example `.env` (validated with `zod`)

```shell
PORT=3000
BASE_URL=https://mcp.example.com
MCP_CANONICAL_URI=https://mcp.example.com/mcp

OIDC_ISSUER=https://accounts.google.com
OIDC_CLIENT_ID=...
OIDC_CLIENT_SECRET=...        # optional if using PKCE-only public client
OIDC_REDIRECT_URI=https://mcp.example.com/oauth/callback

ALLOWED_DOMAIN=thenational.academy
SESSION_SECRET=please-change-me
```

---

## 8) Testing the flow (manual)

1. Open `https://<BASE_URL>/.well-known/oauth-protected-resource` — confirm it lists your AS.
2. Call `GET https://<BASE_URL>/mcp` without a token — expect `401` + `WWW-Authenticate` pointing to the resource metadata.
3. Visit `https://<BASE_URL>/oauth/authorize` in a browser — complete Google login as an allowed user.
4. Copy the minted **access token** and call MCP again with  
   `Authorization: Bearer <token>` — expect success.

---

## 9) Future hardening (if you productize)

- Persistent key management + rotation (JWKS with kid, rolling deploys).
- Real `/oauth/token` implementation with **PKCE** and optional **refresh tokens**.
- **Dynamic Client Registration** for broader client compatibility.
- Group/role claims via your IdP (custom claims), not just domain checks.
- Structured `scope` and per‑tool authorization for the MCP server.

---

## 10) References

- MCP Authorization (HTTP, discovery, audience binding, error handling).
- OAuth 2.0 **Protected Resource Metadata** (expose `/.well-known/oauth-protected-resource`).
- OAuth 2.0 **Authorization Server Metadata** (your AS `/.well-known/openid-configuration`).
- **JWT Access Tokens** profile (claims and audience binding).
- **Resource Indicators** (`resource` parameter in auth & token requests).
- Google OIDC: verifying **ID tokens** and using **`hd`** + `email_verified` for Workspace restriction.
