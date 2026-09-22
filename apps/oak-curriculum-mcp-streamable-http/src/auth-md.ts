/**
 * `/auth.md` agent-registration guidance for the MCP host (MCP-759).
 *
 * ## What this is, and what it deliberately is not
 *
 * The published shape (https://github.com/workos/auth.md) is a bootstrap
 * profile for services that run a dedicated agent-identity ceremony —
 * `identity_endpoint`, `claim_endpoint`, `events_endpoint`, an
 * `identity_assertion`/`service_auth`/`anonymous` registration choice, and a
 * claim ceremony that binds an agent's context to a human's authenticated
 * session. This server runs none of that. It runs the OAuth 2.1 flow
 * `auth-routes.ts` and `oauth-proxy/` already implement: RFC 8414/RFC 9728
 * discovery, open RFC 7591 dynamic client registration, and a standard
 * Authorization Code + PKCE grant proxied to Clerk (ADR-052, ADR-115,
 * ADR-142). This document tells an agent how to use THAT flow, and says so
 * plainly rather than describing a ceremony this server would 404 on.
 *
 * The `agent_auth` block this document is linked from (see
 * `oauth-proxy/oauth-proxy-upstream.ts`) carries only `skill`, for the same
 * reason: `identity_endpoint`/`claim_endpoint`/`events_endpoint` name
 * capabilities that do not exist here, and a field naming a dead endpoint is
 * worse than an absent field — the same principle
 * `agent-discovery-link-header.ts` states for `api-catalog`.
 *
 * ## Why the body carries no absolute URLs for another origin
 *
 * `robots-txt.ts` names no origin at all, because its directives are
 * relative paths that are identical on every host this app answers on. This
 * document cannot avoid naming the upstream identity provider's endpoints
 * (revocation, device authorization, JWKS) — but those differ between this
 * server's environments (local, preview, production each pair with a
 * different Clerk instance; ADR-115 §Context), so the body sends the reader
 * to THIS host's own `/.well-known/oauth-authorization-server` response
 * rather than hard-coding a hostname that would be correct on one
 * environment and false on the others.
 *
 * ## Why this is a route, not a static file
 *
 * Same reason as `robots-txt.ts`: a static file under the served root would
 * sit behind `clerkMiddleware`, and an unauthenticated agent reading its own
 * registration instructions cannot present a token it does not have yet.
 *
 * ## `DANGEROUSLY_DISABLE_AUTH` mode
 *
 * This route is registered outside the auth-enabled branch (same as
 * `robots-txt.ts`), so it is also served when auth is disabled — but unlike
 * `robots-txt.ts`'s body, this one is NOT mode-independent: in that mode
 * `oauth-and-caching-setup.ts` never registers `/oauth/*` or
 * `/.well-known/oauth-authorization-server`, so the flow this document
 * describes 404s and `POST /mcp` never returns the `401` Step 5 promises.
 * `env.ts` hard-refuses the flag outside a local run, so production cannot
 * reach this state (pinned by `auth-md.integration.test.ts`'s
 * `dangerouslyDisableAuth` case, which asserts only that the route still
 * answers, not that the flow it describes is live there).
 *
 * ## `js/missing-rate-limiting` (ADR-219)
 *
 * This route carries no in-process rate limiter, by the same disposition as
 * `auth-routes.ts` and `oauth-proxy-routes.ts`: volumetric control is an edge
 * concern (ADR-219), and a fresh CodeQL finding on this `app.get` is
 * dispositioned against that ADR rather than re-argued here.
 */
import type { Express } from 'express';
import type { Logger } from '@oaknational/logger';

/**
 * The path this document is served at. Fixed at the service root by the
 * `auth.md` convention this document itself follows — not nested under
 * `/.well-known/`, unlike the RFC 8414/9728 discovery documents it points to.
 *
 * The canonical owner of the path: `clerk-skip-surfaces.ts` and
 * `oauth-proxy-upstream.ts`'s `agent_auth.skill` both consume this constant,
 * so the served route, the auth exemption, and the advertised pointer cannot
 * drift apart.
 */
export const AUTH_MD_PATH = '/auth.md';

/**
 * The served body.
 *
 * @remarks
 * Not exported: `auth-md.integration.test.ts` pins this text verbatim rather
 * than importing it, so an edit to the served body has to be restated in the
 * test and cannot be ratified silently (same discipline as
 * `ROBOTS_TXT_BODY`).
 *
 * Every endpoint path named here is this app's own route, verified against
 * `auth-routes.ts` and `oauth-proxy/oauth-proxy-routes.ts` — none is a
 * placeholder. Endpoints belonging to the upstream identity provider
 * (revocation, device authorization, JWKS) are deliberately NOT spelled
 * here; the document sends the reader to this host's own AS metadata
 * response for those, because that response is the only place they are
 * guaranteed current across environments (see module docblock).
 */
const AUTH_MD_BODY = `# auth.md — Oak National Academy Curriculum MCP Server

This document is what \`agent_auth.skill\` in this server's
\`/.well-known/oauth-authorization-server\` response points to. Read
[Why no identity/claim ceremony](#why-no-identityclaim-ceremony) first if you
arrived expecting the full shape at <https://github.com/workos/auth.md> —
this server implements a narrower, standard OAuth 2.1 flow instead, and the
steps below are that flow.

## Step 1 — Discover

- \`GET /.well-known/oauth-protected-resource\` (RFC 9728) — names this
  resource (\`resource\`), its authorization server(s), and its supported
  scopes.
- \`GET /.well-known/oauth-authorization-server\` (RFC 8414) — this host's
  own authorization-server metadata. \`authorization_endpoint\`,
  \`token_endpoint\`, and \`registration_endpoint\` are on THIS origin (a
  same-origin proxy in front of the upstream identity provider, kept for
  client compatibility). Every other endpoint field — \`revocation_endpoint\`,
  \`device_authorization_endpoint\`, \`jwks_uri\`, and any others the response
  carries — passes through from the upstream provider unchanged, where
  present: read them from the response rather than assuming a hostname; they
  differ between this server's local, preview, and production environments.

## Step 2 — Register a client (RFC 7591)

\`POST /oauth/register\` accepts an open, unauthenticated Dynamic Client
Registration request and forwards it to the upstream identity provider.
There is no separate agent-identity registration step and no
anonymous/service_auth/identity_assertion choice: registering an OAuth
client is the only registration this server has.

## Step 3 — Authorize a real user (Authorization Code + PKCE)

Direct the user's own browser to \`GET /oauth/authorize\` with the standard
\`response_type=code\`, \`client_id\`, \`redirect_uri\`, \`code_challenge\`, and
\`code_challenge_method=S256\` parameters. The user authenticates at the
upstream identity provider and is redirected back to your \`redirect_uri\`
with an authorization code. This server issues no access token itself: it
proxies whichever grants the Step 1 response's \`grant_types_supported\`
names, and today every one of them runs through this step or Step 4's
refresh.

## Step 4 — Exchange the code

\`POST /oauth/token\` with the standard \`authorization_code\` grant, and later
\`refresh_token\` once you hold one (see \`grant_types_supported\` in the Step 1
response).

## Step 5 — Call the MCP endpoint

\`POST /mcp\` with \`Authorization: Bearer <access_token>\`. A missing or
invalid token gets \`401\` with a \`WWW-Authenticate\` header carrying the Step
1 discovery URL, so a client that skips discovery still finds its way back
here.

## Revoke

POST to the Step 1 response's \`revocation_endpoint\` (RFC 7009) — it is the
upstream identity provider's own endpoint, not this origin.

## Access is the upstream provider's decision

Whether the upstream identity provider accepts sign-in from a given account
is that provider's own configuration, not a property of Steps 1–5, and it
may narrow or widen independently of this document. A registration or
authorization request that this flow describes correctly can still be
refused there; that is the provider's access policy operating as intended,
not a defect in the flow above.

## Why no identity/claim ceremony

This server's authorization-server metadata carries an \`agent_auth\` block
whose only field is \`skill\`, pointing at this document. It deliberately
omits \`identity_endpoint\`, \`claim_endpoint\`, \`events_endpoint\`,
\`identity_types_supported\`, and \`identity_assertion\` from the shape
described at <https://github.com/workos/auth.md>: this server runs no
agent-identity registration, no claim ceremony, and issues no ID-JAG-backed
assertions. Registering a field that names an endpoint this server would
404 on is worse than an absent field. The standard flow in Steps 1–5 is the
whole of what this server offers an autonomous agent today.
`;

/**
 * Registers the `/auth.md` route. Mount BEFORE clerkMiddleware, in every
 * auth mode: an agent reading its own registration instructions cannot yet
 * hold the token that middleware would demand (MCP-759).
 */
export function registerAuthMd(app: Express, log: Logger): void {
  log.debug('Registering /auth.md agent-registration guidance (public, MCP-759)');
  app.get(AUTH_MD_PATH, (_req, res) => {
    res.type('text/markdown').send(AUTH_MD_BODY);
  });
}
