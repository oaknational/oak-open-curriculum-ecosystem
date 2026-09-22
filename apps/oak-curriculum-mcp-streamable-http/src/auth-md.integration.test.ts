/**
 * Integration tests for the MCP host's `/auth.md` agent-registration
 * document (MCP-759).
 *
 * Mirrors `robots-txt.integration.test.ts`'s discipline: the served text is
 * pinned verbatim in one case (so an edit to it has to be restated here
 * rather than ratified silently), and the Clerk-spy case proves the request
 * never reaches the auth vendor — an agent reading its own registration
 * instructions cannot yet hold the token that middleware would demand.
 */
import { describe, it, expect, vi } from 'vitest';
import type { RequestHandler } from 'express';
import { request } from './test-helpers/loopback-request.js';
import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { TEST_UPSTREAM_METADATA } from './test-helpers/upstream-metadata-fixture.js';
import { getScratchStaticRoot } from './test-helpers/static-root-fixture.js';

const AUTH_MD_PATH = '/auth.md';

/** The body an agent receives, as reviewed on MCP-759. */
const EXPECTED_BODY = `# auth.md — Oak National Academy Curriculum MCP Server

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
  client compatibility) — **read the RFC 9207 note in Step 3 before using
  \`authorization_endpoint\`/\`token_endpoint\` from this document if you
  validate the authorization response's \`iss\`.** Every other endpoint
  field — \`revocation_endpoint\`, \`device_authorization_endpoint\`,
  \`jwks_uri\`, and any others the response carries — passes through from
  the upstream provider unchanged, where present: read them from the
  response rather than assuming a hostname; they differ between this
  server's local, preview, and production environments.
- \`authorization_servers[0]\` in the \`/.well-known/oauth-protected-resource\`
  response above names the upstream identity provider's own issuer.
  Fetching \`<that issuer>/.well-known/oauth-authorization-server\` gets you
  the upstream's own AS metadata directly — the document a client that
  validates \`iss\` should use for Step 3 and Step 4, per the note there.

## Step 2 — Register a client (RFC 7591)

\`POST /oauth/register\` accepts an open, unauthenticated Dynamic Client
Registration request and forwards it to the upstream identity provider.
There is no separate agent-identity registration step and no
anonymous/service_auth/identity_assertion choice: registering an OAuth
client is the only registration this server has.

## Step 3 — Authorize a real user (Authorization Code + PKCE)

**RFC 9207 note, read before you pick an authorize endpoint.** This
origin's own AS metadata (Step 1) names \`issuer\` as this origin, but the
authorization response this origin's \`/oauth/authorize\` proxy relays
actually carries the upstream identity provider's own \`iss\` — a real,
already-documented mismatch (not introduced or fixed by this document; see
ADR-115 "Negative 8"). If you validate the authorization response's \`iss\`
against the issuer you recorded (RFC 9207 §2.4), do **not** record this
origin as that issuer and do not use this origin's \`/oauth/authorize\` /
\`/oauth/token\` for this step or Step 4: use the upstream's own AS metadata
and endpoints instead — the ones named by \`authorization_servers[0]\` in
Step 1's protected-resource response. The \`client_id\` from Step 2 works
against either origin, since \`/oauth/register\` forwards to the same
upstream registration. If you do not validate \`iss\` (or cannot reach the
upstream directly), this origin's \`/oauth/authorize\` below works as a
same-origin compatibility path.

Direct the user's own browser to \`GET /oauth/authorize\` (on whichever
origin Step 1 above led you to) with the standard \`response_type=code\`,
\`client_id\`, \`redirect_uri\`, \`code_challenge\`, and
\`code_challenge_method=S256\` parameters. The user authenticates at the
upstream identity provider and is redirected back to your \`redirect_uri\`
with an authorization code. This server issues no access token itself: it
proxies whichever grants the Step 1 response's \`grant_types_supported\`
names, and today every one of them runs through this step or Step 4's
refresh.

## Step 4 — Exchange the code

\`POST /oauth/token\` (same origin choice as Step 3 — see its RFC 9207 note)
with the standard \`authorization_code\` grant, and later \`refresh_token\`
once you hold one (see \`grant_types_supported\` in the Step 1 response).

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

interface HarnessOptions {
  readonly dangerouslyDisableAuth?: boolean;
  readonly clerkMiddlewareFactory?: () => RequestHandler;
}

const createTestApp = async (options: HarnessOptions = {}) =>
  await createApp({
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig:
      options.dangerouslyDisableAuth === true
        ? createMockRuntimeConfig({ dangerouslyDisableAuth: true })
        : createMockRuntimeConfig(),
    observability: createFakeHttpObservability(),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    upstreamMetadata: TEST_UPSTREAM_METADATA,
    ...(options.clerkMiddlewareFactory === undefined
      ? {}
      : { clerkMiddlewareFactory: options.clerkMiddlewareFactory }),
  });

describe('/auth.md (Integration)', () => {
  it('answers an unauthenticated GET with the reviewed body as text/markdown', async () => {
    const app = await createTestApp();

    const res = await request(app).get(AUTH_MD_PATH);

    expect(res.status).toBe(200);
    expect(res.type).toBe('text/markdown');
    expect(
      res.text,
      'the agent-facing body is reviewed text (MCP-759): an edit to it must be restated here, so it is read again rather than ratified silently',
    ).toBe(EXPECTED_BODY);
  });

  it('documents the real, live routes — never a placeholder', async () => {
    const app = await createTestApp();

    const res = await request(app).get(AUTH_MD_PATH);

    // Every path named must be one this app actually registers elsewhere
    // (auth-routes.ts, oauth-proxy-routes.ts) — asserted by path literal so a
    // renamed route fails this test rather than silently going stale.
    expect(res.text).toContain('/.well-known/oauth-protected-resource');
    expect(res.text).toContain('/.well-known/oauth-authorization-server');
    expect(res.text).toContain('/oauth/register');
    expect(res.text).toContain('/oauth/authorize');
    expect(res.text).toContain('/oauth/token');
    expect(res.text).toContain('POST /mcp');
  });

  it('states plainly why the WorkOS identity/claim ceremony is absent', async () => {
    const app = await createTestApp();

    const res = await request(app).get(AUTH_MD_PATH);

    expect(res.text).toContain('identity_endpoint');
    expect(res.text).toContain('claim_endpoint');
    expect(res.text).toContain('events_endpoint');
    expect(res.text).toContain('https://github.com/workos/auth.md');
  });

  it('discloses that this origin fails RFC 9207 and names the correct path for a validating client (Copilot round 2, MCP-759)', async () => {
    const app = await createTestApp();

    const res = await request(app).get(AUTH_MD_PATH);

    // The mismatch itself, and the ADR that already documents it — never
    // silently routing a validating client through a leg known to fail.
    expect(res.text).toContain('RFC 9207');
    expect(res.text).toContain('Negative 8');
    expect(res.text).toContain("validate the authorization response's `iss`");
    // The escape hatch: the PRM's authorization_servers[0] leads to the
    // upstream's own AS metadata and endpoints, bypassing this origin's proxy.
    expect(res.text).toContain('authorization_servers[0]');
    expect(res.text).toContain('do **not** record this');
  });

  it('names no hostname belonging to the upstream identity provider', async () => {
    const app = await createTestApp();

    const res = await request(app).get(AUTH_MD_PATH);

    // The upstream's revocation/device-authorization/JWKS hostnames differ
    // between this server's environments (ADR-115 Context); the document
    // must send the reader to this host's own discovery response instead of
    // naming one that would be wrong on another environment.
    expect(res.text).not.toContain('clerk.accounts.dev');
    expect(res.text).not.toContain('clerk.thenational.academy');
  });

  it('serves the file when auth is disabled, since it is not an OAuth surface', async () => {
    const app = await createTestApp({ dangerouslyDisableAuth: true });

    const res = await request(app).get(AUTH_MD_PATH);

    expect(res.status).toBe(200);
    expect(res.type).toBe('text/markdown');
  });

  it('answers without the request ever reaching the auth vendor', async () => {
    const reachedClerk = vi.fn<(label: string) => void>();
    const app = await createTestApp({
      clerkMiddlewareFactory: (): RequestHandler => (req, _res, next) => {
        reachedClerk(`${req.method} ${req.path}`);
        next();
      },
    });

    const res = await request(app).get(AUTH_MD_PATH);

    expect(res.status).toBe(200);
    expect(
      reachedClerk,
      'an agent reading its own registration instructions cannot yet hold the token this middleware would demand',
    ).not.toHaveBeenCalled();

    // Control probe: the spy must be capable of firing, or the assertion
    // above would prove nothing about this path specifically.
    await request(app).get('/not-an-exempt-path');
    expect(reachedClerk).toHaveBeenCalledWith('GET /not-an-exempt-path');
  });
});
