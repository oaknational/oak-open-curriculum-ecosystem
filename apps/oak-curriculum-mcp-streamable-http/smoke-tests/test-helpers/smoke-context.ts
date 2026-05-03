/**
 * Smoke test context helper — exposes the harness-bound base URL to
 * `*.smoke.test.ts` files.
 *
 * @remarks
 * The canonical smoke harness boots a local server on an ephemeral
 * port and injects the resulting base URL via the smoke vitest
 * config's `provide` mechanism (vitest's typed value-injection
 * surface). Smoke test files MUST NOT read `process.env`; they call
 * {@link getSmokeBaseUrl} which uses vitest's `inject` to read the
 * value the config provided.
 *
 * This module is the only permitted indirection between
 * `*.smoke.test.ts` files and the harness's bound URL. It carries no
 * env reads, no I/O, and no side effects.
 *
 * @packageDocumentation
 */

import { inject } from 'vitest';

/**
 * Type augmentation for vitest's `provide`/`inject` mechanism.
 *
 * @remarks
 * Vitest's `ProvidedContext` interface is the canonical extension
 * point for typed test-context injection. The smoke harness provides
 * `smokeBaseUrl: string` from `vitest.smoke.config.ts`; this
 * declaration teaches the compiler that `inject('smokeBaseUrl')`
 * returns a `string`.
 */
declare module 'vitest' {
  interface ProvidedContext {
    smokeBaseUrl: string;
  }
}

/**
 * Returns the locally-bound base URL of the smoke server for the
 * current vitest run.
 *
 * @remarks
 * Throws when invoked outside a vitest run that received
 * `smokeBaseUrl` via `provide` — this is a fail-fast contract
 * violation, not a silent fallback. Smoke tests MUST run under the
 * canonical harness, which always provides the value.
 */
export function getSmokeBaseUrl(): string {
  const baseUrl = inject('smokeBaseUrl');
  if (typeof baseUrl !== 'string' || baseUrl.length === 0) {
    throw new Error(
      'getSmokeBaseUrl invoked without harness-provided smokeBaseUrl; ' +
        'smoke tests must be run via smoke-tests/harness/cli.ts',
    );
  }
  return baseUrl;
}
