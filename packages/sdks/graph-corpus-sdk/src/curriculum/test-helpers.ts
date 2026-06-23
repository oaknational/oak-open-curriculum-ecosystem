/**
 * Shared fixture helpers for the curriculum view integration tests.
 *
 * @remarks
 * Consolidated at the fourth consumer (keyword view, G4b c2 review) from the
 * byte-identical copies the four view integration tests each carried —
 * `consolidate-at-third-consumer`. Test-only: imported exclusively by
 * `*.integration.test.ts` files; never exported from the package barrels
 * (the `src/**` build compiles it, following the repo's in-`src`
 * test-helpers convention, e.g. `oak-search-sdk/src/admin/lifecycle-test-helpers.ts`).
 */

import type { Result } from '@oaknational/result';

/** Narrows a deterministic fixture pick, failing loudly if the corpus cannot supply it. */
export function required<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

/** Strips the kind qualifier from a kind-qualified corpus id (`unit:slug` → `slug`). */
export const bareSlug = (id: string): string => id.slice(id.indexOf(':') + 1);

/**
 * Unwraps an ok `Result`, throwing (an unconditional failure signal — never a
 * silent early return) when the result is an error. Keeps test bodies linear:
 * no conditional narrowing branches inside a test (`no-conditional-tests`).
 */
export function unwrapOk<T, E>(result: Result<T, E>): T {
  if (!result.ok) {
    throw new Error(`expected ok result, got error: ${JSON.stringify(result.error)}`);
  }
  return result.value;
}

/** Unwraps an err `Result`, throwing when the result is ok (the failure case under test must occur). */
export function unwrapErr<T, E>(result: Result<T, E>): E {
  if (result.ok) {
    throw new Error('expected error result, got ok');
  }
  return result.error;
}
