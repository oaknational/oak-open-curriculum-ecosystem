import { createSign } from 'node:crypto';

import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { err, ok, type Result } from '@oaknational/result';
import type { TokenPermissions } from './token-scopes.js';

/**
 * GitHub App installation-token minting for the oak merge bot (AIP-158).
 *
 * The merge bot is deliberately NOT a ruleset bypass actor: merges executed
 * with its installation token physically bind to required checks and thread
 * resolution, which is the whole point (owner rulings 2026-07-21: `--admin`
 * always banned; direct `--merge` banned on bypass-capable accounts).
 *
 * Flow: RS256 app JWT (iss = app id, ≤10-minute lifetime) → resolve the
 * repo's installation id → POST for a short-lived installation token.
 *
 * `@octokit/auth-app` implements this same flow; hand-rolling here is a
 * deliberate choice — ~25 lines against node:crypto with a
 * verifiable-signature test, zero new dependencies in a credential path.
 */

const JWT_BACKDATE_SECONDS = 60;
const JWT_LIFETIME_SECONDS = 540;

const INSTALLATION_SCHEMA = z.object({ id: z.number().int().positive() });

const INSTALLATION_TOKEN_SCHEMA = z.object({
  token: z.string().min(1),
  expires_at: z.string().min(1),
});

/**
 * GitHub's error-body shape. Only `message` is relied on, and only to enrich
 * a failure that has already been detected from the status code. The schema
 * REQUIRES a non-empty `message`: a message-less or otherwise non-conforming
 * body fails this parse and the detail is simply omitted from the failure
 * text — enrichment is best-effort, and the original status-derived failure
 * is never masked either way.
 */
const GITHUB_ERROR_BODY_SCHEMA = z.object({ message: z.string().min(1) });

export type GithubApiFetch = (
  url: string,
  init: {
    readonly method: string;
    readonly headers: Readonly<Record<string, string>>;
    readonly body?: string;
  },
) => Promise<{
  readonly status: number;
  readonly json: () => Promise<unknown>;
}>;

function base64Url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

/**
 * Sign a GitHub App JWT (RS256). `nowEpochSeconds` is injected so callers
 * control time; the token is backdated 60s against clock skew and lives
 * 9 minutes (GitHub's ceiling is 10).
 */
export function signAppJwt(input: {
  readonly appId: string;
  readonly privateKeyPem: string;
  readonly nowEpochSeconds: number;
}): string {
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iat: input.nowEpochSeconds - JWT_BACKDATE_SECONDS,
      exp: input.nowEpochSeconds + JWT_LIFETIME_SECONDS,
      iss: input.appId,
    }),
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${payload}`);
  const signature = signer.sign(input.privateKeyPem).toString('base64url');
  return `${header}.${payload}.${signature}`;
}

/**
 * Result-translating request SEND — the one boundary where a rejected fetch
 * CALL becomes a value. A DNS failure, connection reset, or TLS refusal never
 * answers a status: it rejects the promise, and an escaping throw is
 * invisible to the type system and lands on the CLI's usage-error exit path,
 * telling an operator they typed something wrong when the network broke.
 */
export async function sendGithubRequest(
  fetchImpl: GithubApiFetch,
  url: string,
  init: Parameters<GithubApiFetch>[1],
  label: string,
): Promise<Result<Awaited<ReturnType<GithubApiFetch>>, Error>> {
  try {
    return ok(await fetchImpl(url, init));
  } catch (cause) {
    return err(
      new Error(
        `${label} request failed: ${cause instanceof Error ? cause.message : String(cause)}`,
      ),
    );
  }
}

/** Result-translating body read — the one boundary where a response body's rejection becomes a value. */
export async function readJsonBody(
  response: { readonly json: () => Promise<unknown> },
  label: string,
): Promise<Result<unknown, Error>> {
  try {
    return ok(await response.json());
  } catch (cause) {
    return err(
      new Error(
        `${label} returned a non-JSON body: ${cause instanceof Error ? cause.message : String(cause)}`,
      ),
    );
  }
}

/**
 * GitHub's own explanation of a failed request, or an empty string when the
 * body is absent, non-JSON, or not the documented error shape. Never throws
 * and never masks the caller's status-derived failure — it only enriches it.
 *
 * This matters most for `422` on a token mint: GitHub answers "the
 * permissions requested are not granted to this installation", which names
 * the whole fix, while a bare status code sends the reader hunting.
 */
async function githubErrorDetail(response: {
  readonly json: () => Promise<unknown>;
}): Promise<string> {
  const body = await readJsonBody(response, 'error body');
  if (!body.ok) {
    return '';
  }
  const parsed = GITHUB_ERROR_BODY_SCHEMA.safeParse(body.value);
  return parsed.success ? ` — ${parsed.data.message}` : '';
}

function githubHeaders(bearer: string): Readonly<Record<string, string>> {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${bearer}`,
    'user-agent': 'oak-merge-bot',
    'x-github-api-version': '2022-11-28',
  };
}

/** Resolve the app's installation id on a repository. */
export async function resolveInstallationId(input: {
  readonly appJwt: string;
  readonly owner: string;
  readonly repo: string;
  readonly apiBaseUrl?: string;
  readonly fetchImpl: GithubApiFetch;
}): Promise<Result<number, Error>> {
  const base = input.apiBaseUrl ?? 'https://api.github.com';
  const sent = await sendGithubRequest(
    input.fetchImpl,
    `${base}/repos/${input.owner}/${input.repo}/installation`,
    { method: 'GET', headers: githubHeaders(input.appJwt) },
    'GET /repos/{owner}/{repo}/installation',
  );
  if (!sent.ok) {
    return sent;
  }
  const response = sent.value;
  if (response.status !== 200) {
    return err(
      new Error(
        `installation lookup failed for ${input.owner}/${input.repo}: HTTP ${String(response.status)} (is the app installed on the repo?)`,
      ),
    );
  }
  const body = await readJsonBody(response, 'GET /repos/{owner}/{repo}/installation');
  if (!body.ok) {
    return body;
  }
  const parsed = parseWithSchema({
    label: 'GET /repos/{owner}/{repo}/installation',
    schema: INSTALLATION_SCHEMA,
    value: body.value,
  });
  return parsed.ok ? ok(parsed.value.id) : parsed;
}

/**
 * Mint a short-lived installation access token, SCOPED to one repository and
 * to exactly the permissions the caller asks for — least-privilege by
 * construction, not by installation topology (security review 2026-07-21: an
 * unscoped mint carries the app's full installation grant, so a second
 * installed repo would silently widen every token).
 *
 * The REPOSITORY dimension is owned here and is not parameterised:
 * `repositories: [input.repoName]` is the 2026-07-21 decision above, and it
 * stays fixed. The PERMISSION dimension is the caller's, chosen from the
 * reviewable policy table in `token-scopes.ts` — which is also where the
 * evidence for each scope's members lives, beside the decision it justifies.
 */
export async function mintInstallationToken(input: {
  readonly appJwt: string;
  readonly installationId: number;
  readonly repoName: string;
  readonly permissions: TokenPermissions;
  readonly apiBaseUrl?: string;
  readonly fetchImpl: GithubApiFetch;
}): Promise<Result<{ token: string; expiresAt: string }, Error>> {
  const base = input.apiBaseUrl ?? 'https://api.github.com';
  const sent = await sendGithubRequest(
    input.fetchImpl,
    `${base}/app/installations/${String(input.installationId)}/access_tokens`,
    {
      method: 'POST',
      headers: githubHeaders(input.appJwt),
      body: JSON.stringify({
        repositories: [input.repoName],
        permissions: input.permissions,
      }),
    },
    'POST /app/installations/{id}/access_tokens',
  );
  if (!sent.ok) {
    return sent;
  }
  const response = sent.value;
  if (response.status !== 201) {
    const detail = await githubErrorDetail(response);
    return err(
      new Error(`installation token mint failed: HTTP ${String(response.status)}${detail}`),
    );
  }
  const body = await readJsonBody(response, 'POST /app/installations/{id}/access_tokens');
  if (!body.ok) {
    return body;
  }
  const parsed = parseWithSchema({
    label: 'POST /app/installations/{id}/access_tokens',
    schema: INSTALLATION_TOKEN_SCHEMA,
    value: body.value,
  });
  return parsed.ok ? ok({ token: parsed.value.token, expiresAt: parsed.value.expires_at }) : parsed;
}
