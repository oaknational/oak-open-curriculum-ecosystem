/**
 * Clerk key-pairing check: the secret key must belong to the instance the
 * publishable key names.
 *
 * The publishable key decides which Clerk instance issues every OAuth access
 * token (the Frontend API host is derived from it, and the PRM sends every
 * client there); the secret key decides which instance the app asks to verify
 * those tokens. When the two name different instances every sign-in completes
 * and every token is then refused as "OAuth token not found" — a failure that
 * no metadata probe can see and that hid on preview deployments for four
 * weeks (MCP-655). Each instance publishes its signing keys as a JWKS whose
 * `kid` is the instance id, so a `kid` shared between the publishable key's
 * public JWKS and the secret key's Backend API JWKS proves the pairing at
 * bootstrap, without a token and without the secret leaving the process.
 */

import { z } from 'zod';
import { ok, err, type Result } from '@oaknational/result';
import type { HttpObservability, HttpSpanHandle } from '../observability/http-observability.js';

/**
 * Minimal subset of the Fetch API needed by {@link verifyClerkKeyPairing}.
 * Accepting it as a parameter enables unit testing without global mocks.
 */
export type JwksFetchFn = (
  url: string,
  init?: { headers?: Record<string, string>; signal?: AbortSignal },
) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

export type KeyPairingError =
  | { readonly type: 'unpaired_keys'; readonly message: string }
  | { readonly type: 'jwks_fetch_failed'; readonly message: string }
  | { readonly type: 'invalid_shape'; readonly message: string };

export interface KeyPairingInput {
  /** Public JWKS URL of the instance the publishable key names (from the AS metadata). */
  readonly publicJwksUrl: string;
  /** The secret key under test; sent only as a bearer credential to the Backend API. */
  readonly secretKey: string;
  /** Clerk Backend API base URL. Defaults to Clerk's public API. */
  readonly backendApiUrl?: string;
  /** Per-request timeout in milliseconds. Defaults to 10 000 (10 s). */
  readonly timeoutMs?: number;
}

const DEFAULT_BACKEND_API_URL = 'https://api.clerk.com';
const DEFAULT_TIMEOUT_MS = 10_000;

const jwksSchema = z.object({
  keys: z.array(z.object({ kid: z.string().min(1) })),
});

async function fetchKids(
  url: string,
  fetchFn: JwksFetchFn,
  timeoutMs: number,
  headers?: Record<string, string>,
): Promise<Result<readonly string[], KeyPairingError>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchFn(url, { headers, signal: controller.signal });
    if (!response.ok) {
      return err({
        type: 'jwks_fetch_failed',
        message: `JWKS fetch failed: ${url} returned HTTP ${String(response.status)}`,
      });
    }
    const parsed = jwksSchema.safeParse(await response.json());
    if (!parsed.success) {
      return err({
        type: 'invalid_shape',
        message: `JWKS at ${url} does not match expected shape: ${parsed.error.message}`,
      });
    }
    return ok(parsed.data.keys.map((key) => key.kid));
  } catch (caught) {
    const reason = caught instanceof Error ? caught.message : String(caught);
    return err({ type: 'jwks_fetch_failed', message: `JWKS fetch failed: ${url}: ${reason}` });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Proves that `secretKey` belongs to the Clerk instance whose public JWKS is
 * served at `publicJwksUrl`, by requiring a `kid` common to that document and
 * the Backend API's JWKS for the secret key.
 *
 * Called once at bootstrap; a failure names both instances' key ids (never the
 * secret) so a mispaired deployment fails loudly instead of refusing every
 * token after a successful sign-in.
 *
 * @example
 * ```typescript
 * const pairing = await verifyClerkKeyPairing(
 *   { publicJwksUrl: metadata.jwks_uri, secretKey: env.CLERK_SECRET_KEY },
 *   fetch,
 * );
 * if (!pairing.ok) {
 *   // pairing.error.type: 'unpaired_keys' | 'jwks_fetch_failed' | 'invalid_shape'
 * }
 * ```
 */
export async function verifyClerkKeyPairing(
  input: KeyPairingInput,
  fetchFn: JwksFetchFn,
  observability: Pick<HttpObservability, 'withSpan'>,
): Promise<Result<{ readonly instanceId: string }, KeyPairingError>> {
  const backendApiUrl = input.backendApiUrl ?? DEFAULT_BACKEND_API_URL;
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const runCheck = async (
    span: HttpSpanHandle,
  ): Promise<Result<{ readonly instanceId: string }, KeyPairingError>> => {
    const publicKids = await fetchKids(input.publicJwksUrl, fetchFn, timeoutMs);
    if (!publicKids.ok) {
      span.setAttribute('oak.clerk.pairing_error', publicKids.error.type);
      return err(publicKids.error);
    }
    const backendKids = await fetchKids(`${backendApiUrl}/v1/jwks`, fetchFn, timeoutMs, {
      Authorization: `Bearer ${input.secretKey}`,
    });
    if (!backendKids.ok) {
      span.setAttribute('oak.clerk.pairing_error', backendKids.error.type);
      return err(backendKids.error);
    }

    const shared = publicKids.value.find((kid) => backendKids.value.includes(kid));
    if (shared === undefined) {
      span.setAttribute('oak.clerk.pairing_error', 'unpaired_keys');
      return err({
        type: 'unpaired_keys',
        message:
          `CLERK_SECRET_KEY does not belong to the instance CLERK_PUBLISHABLE_KEY names: ` +
          `the publishable key's JWKS at ${input.publicJwksUrl} carries [${publicKids.value.join(', ')}] ` +
          `while the secret key's Backend API JWKS carries [${backendKids.value.join(', ')}]`,
      });
    }
    span.setAttribute('oak.clerk.instance_id', shared);
    return ok({ instanceId: shared });
  };

  return await observability.withSpan({
    name: 'oak.http.bootstrap.clerk-key-pairing',
    attributes: {
      'oak.bootstrap.phase': 'verifyClerkKeyPairing',
      'oak.upstream.host': new URL(input.publicJwksUrl).host,
    },
    run: runCheck,
  });
}
