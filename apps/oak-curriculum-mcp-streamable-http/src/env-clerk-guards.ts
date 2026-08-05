import type { z } from 'zod';
import { RELEASE_ENVIRONMENTS } from '@oaknational/build-metadata';

/**
 * Clerk / deployment production-promotion guards (MCP-143 Stage 1).
 *
 * The env schema composes these refinements the same way it composes the
 * product-analytics rules from `env-product-analytics.ts`: the field shape
 * stays in the base schema, the conditional rules live here, and `env.ts`
 * calls them from its `superRefine`. This module is the home of the "is this
 * a deployment / a production deployment?" trust-boundary classification: the
 * four env-safety guards (Clerk key locality, canonical-host requirement, the
 * auth-disable valve, and the test-error-secret ban) all key on the helpers
 * below rather than re-deriving `VERCEL_ENV` semantics, so the classification
 * cannot drift between them (a divergence of exactly that kind was the item-1
 * gap). The product-analytics production rule in `env-product-analytics.ts`
 * still derives production independently — a tracked hardening follow-up.
 */

interface DeploymentSignals {
  readonly VERCEL?: string;
  readonly VERCEL_ENV?: string;
}

/**
 * Whether the env is a DEPLOYED (non-local) Vercel environment — preview or
 * production. Used by the auth-disable valve, which must be usable only on a
 * local machine.
 *
 * `VERCEL_ENV` set to anything other than `development` is a deployment. The
 * second clause is the fail-closed misconfiguration catch: a Vercel deployment
 * (`VERCEL === '1'`) that is somehow missing `VERCEL_ENV` is still a
 * deployment — Vercel always sets `VERCEL_ENV`, so its absence on a Vercel
 * build is anomalous and must never downgrade a guard to the local path. A
 * local, non-Vercel run never sets `VERCEL === '1'`, so it is never caught.
 */
export function isDeployedEnvironment(data: DeploymentSignals): boolean {
  if (data.VERCEL_ENV !== undefined && data.VERCEL_ENV !== RELEASE_ENVIRONMENTS.development) {
    return true;
  }
  return data.VERCEL === '1' && data.VERCEL_ENV === undefined;
}

/**
 * Whether the env is a PRODUCTION deployment. Used by the guards that must
 * bind on production specifically (Clerk key locality, canonical-host
 * requirement, and the test-error-secret ban).
 *
 * The primary signal is `VERCEL_ENV === 'production'`. The second clause is
 * the same fail-closed misconfiguration catch as `isDeployedEnvironment`: a
 * Vercel deployment missing `VERCEL_ENV` is treated as production (the
 * strictest classification) rather than silently no-opping the production
 * guards. It does NOT consult `CANONICAL_HOST` — local is already excluded by
 * `VERCEL !== '1'` and preview by `VERCEL_ENV !== undefined`, so gating on the
 * canonical host would protect no workflow and only re-open a silent-pass
 * residual when the host is also absent.
 */
export function isDeployedProduction(data: DeploymentSignals): boolean {
  if (data.VERCEL_ENV === RELEASE_ENVIRONMENTS.production) {
    return true;
  }
  return data.VERCEL === '1' && data.VERCEL_ENV === undefined;
}

interface ClerkKeyLocalityData extends DeploymentSignals {
  readonly CLERK_PUBLISHABLE_KEY?: string;
  readonly CLERK_SECRET_KEY?: string;
}

/**
 * Production key-locality guard (MCP-143 Guard 1a).
 *
 * Clerk key prefixes are canonical: `pk_test_`/`pk_live_`,
 * `sk_test_`/`sk_live_`. In production, keys MUST be live-realm keys — a
 * `pk_test_`/`sk_test_` key points the app at the Clerk *development* realm,
 * the confirmed live gap (prod `/oauth/authorize` 307-ing to
 * `native-hippo-15.clerk.accounts.dev`). Reject at startup so a dev-realm key
 * on production is a hard boot failure rather than a silent cross-realm auth
 * path. Issues land on the respective key path.
 */
export function refineClerkKeyLocality(data: ClerkKeyLocalityData, ctx: z.RefinementCtx): void {
  if (!isDeployedProduction(data)) {
    return;
  }

  if (data.CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_')) {
    ctx.addIssue({
      code: 'custom',
      path: ['CLERK_PUBLISHABLE_KEY'],
      message:
        'CLERK_PUBLISHABLE_KEY must be a live key (pk_live_) in production. ' +
        'A pk_test_ key points at the Clerk development realm.',
    });
  }

  if (data.CLERK_SECRET_KEY?.startsWith('sk_test_')) {
    ctx.addIssue({
      code: 'custom',
      path: ['CLERK_SECRET_KEY'],
      message:
        'CLERK_SECRET_KEY must be a live key (sk_live_) in production. ' +
        'An sk_test_ key points at the Clerk development realm.',
    });
  }
}

interface CanonicalHostData extends DeploymentSignals {
  readonly CANONICAL_HOST?: string;
}

/**
 * Canonical-host requirement in production (MCP-143 Guard 3).
 *
 * In production `CANONICAL_HOST` is mandatory. Without it the self-description
 * surfaces (RFC 9728 protected-resource metadata, RFC 8414
 * authorization-server metadata, the RFC 8707 resource URL, and the
 * `WWW-Authenticate` `resource_metadata` pointer) derive per request from the
 * incoming Host, so every Vercel alias or preview URL that can reach the
 * origin mints its own OAuth resource identifier — a client then holds a token
 * bound to one identifier and is challenged for another. Requiring it makes
 * the canonical origin a single configured value. Callers gate on auth being
 * enabled before invoking this — with the middleware absent there is no
 * resource identifier to pin.
 *
 * Because production is `isDeployedProduction` (no longer `CANONICAL_HOST`-
 * gated), a Vercel deployment that lost `VERCEL_ENV` and is missing the
 * canonical host fails closed here rather than passing silently.
 */
export function refineCanonicalHostRequired(data: CanonicalHostData, ctx: z.RefinementCtx): void {
  if (!isDeployedProduction(data)) {
    return;
  }

  if (!data.CANONICAL_HOST) {
    ctx.addIssue({
      code: 'custom',
      path: ['CANONICAL_HOST'],
      message:
        'CANONICAL_HOST is required in production. Without it every deployment ' +
        'alias would mint its own OAuth resource identifier; set it to the ' +
        'canonical production host.',
    });
  }
}

/**
 * Whether `value` is EXACTLY a canonical HTTP(S) origin — `scheme://host[:port]`
 * with no path, query, fragment, userinfo, or trailing slash.
 *
 * Clerk matches each `authorizedParties` entry against a session token's `azp`
 * claim by literal `Array.includes` with no normalisation (`@clerk/backend`
 * `assertAuthorizedPartiesClaim`), so an entry that is not already the exact
 * origin — a trailing slash, a path, a bare host — can never match, and the
 * control would silently never fire. `URL.origin` is the canonical form; the
 * raw value must equal it, which rejects a trailing slash (`https://h/` has
 * origin `https://h`) and any path.
 */
function isCanonicalHttpOrigin(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  return (url.protocol === 'https:' || url.protocol === 'http:') && url.origin === value;
}

/**
 * Validates the raw `CLERK_AUTHORIZED_PARTIES` env value (MCP-143 Guard 1c): a
 * comma-separated list of canonical HTTP(S) origins. Rejects an empty string
 * and any entry (after trimming surrounding whitespace) that is not an exact
 * origin. The runtime parser trims the same way, so a value that validates here
 * parses to the identical origin list at the Clerk boundary.
 */
export function isValidAuthorizedPartiesCsv(value: string): boolean {
  const entries = value.split(',').map((entry) => entry.trim());
  if (entries.some((entry) => entry.length === 0)) {
    return false;
  }
  return entries.every(isCanonicalHttpOrigin);
}
