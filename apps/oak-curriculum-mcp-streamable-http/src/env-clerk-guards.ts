import type { z } from 'zod';
import { RELEASE_ENVIRONMENTS } from '@oaknational/build-metadata';

/**
 * Clerk production-promotion guards (MCP-143 Stage 1).
 *
 * The env schema composes these refinements the same way it composes the
 * product-analytics rules from `env-product-analytics.ts`: the field
 * shape stays in the base schema, the conditional production rules live
 * here, and `env.ts` calls them from its `superRefine`. Keeping the
 * Clerk-specific safety rules in one module keeps `env.ts` an index of
 * the boundary rather than the home of every rule body.
 */

interface ClerkKeyLocalityData {
  readonly CLERK_PUBLISHABLE_KEY?: string;
  readonly CLERK_SECRET_KEY?: string;
  readonly VERCEL_ENV?: string;
}

/**
 * Production key-locality guard (MCP-143 Guard 1a).
 *
 * Clerk key prefixes are canonical: `pk_test_`/`pk_live_`,
 * `sk_test_`/`sk_live_`. In production, keys MUST be live-realm keys — a
 * `pk_test_`/`sk_test_` key points the app at the Clerk *development*
 * realm, the confirmed live gap (prod `/oauth/authorize` 307-ing to
 * `native-hippo-15.clerk.accounts.dev`). Reject at startup so a dev-realm
 * key on production is a hard boot failure rather than a silent
 * cross-realm auth path. Issues land on the respective key path.
 */
export function refineClerkKeyLocality(data: ClerkKeyLocalityData, ctx: z.RefinementCtx): void {
  if (data.VERCEL_ENV !== RELEASE_ENVIRONMENTS.production) {
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

interface CanonicalHostData {
  readonly CANONICAL_HOST?: string;
  readonly VERCEL_ENV?: string;
}

/**
 * Canonical-host requirement in production (MCP-143 Guard 3).
 *
 * In production `CANONICAL_HOST` is mandatory. Without it the
 * self-description surfaces (RFC 9728 protected-resource metadata, RFC 8414
 * authorization-server metadata, the RFC 8707 resource URL, and the
 * `WWW-Authenticate` `resource_metadata` pointer) derive per request from the
 * incoming Host, so every Vercel alias or preview URL that can reach the
 * origin mints its own OAuth resource identifier — a client then holds a token
 * bound to one identifier and is challenged for another. Requiring it makes
 * the canonical origin a single configured value. Callers gate on auth being
 * enabled before invoking this — with the middleware absent there is no
 * resource identifier to pin.
 */
export function refineCanonicalHostRequired(data: CanonicalHostData, ctx: z.RefinementCtx): void {
  if (data.VERCEL_ENV !== RELEASE_ENVIRONMENTS.production) {
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
