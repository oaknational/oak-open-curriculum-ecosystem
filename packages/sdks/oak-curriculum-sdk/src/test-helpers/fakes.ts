/**
 * Minimal typed fakes for SDK tests.
 * Used to avoid type assertions in tests; each fake is documented where a cast is unavoidable.
 */

import type { OakApiPathBasedClient } from '../client/index.js';

/**
 * Type guard that asserts the given value is an `OakApiPathBasedClient`.
 *
 * Performs a minimal runtime check (must be a non-null object) and narrows
 * the type. Full structural validation is unnecessary in tests — the test
 * itself will fail if the shape is wrong.
 */
function isPartialClient(value: unknown): value is OakApiPathBasedClient {
  return typeof value === 'object' && value !== null;
}

/**
 * Creates a minimal fake OakApiPathBasedClient for unit tests.
 * The real type is generated from OpenAPI and has many path/method keys;
 * tests only need a subset. Uses a type guard instead of a type assertion.
 */
export function createFakeOakApiPathBasedClient(partial: unknown): OakApiPathBasedClient {
  if (!isPartialClient(partial)) {
    throw new TypeError('createFakeOakApiPathBasedClient requires a non-null object');
  }
  return partial;
}
