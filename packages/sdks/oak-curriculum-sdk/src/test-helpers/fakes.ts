/**
 * Minimal typed fakes for SDK tests.
 * Used to avoid type assertions in tests; each fake is documented where a cast is unavoidable.
 */

import type { OakApiPathBasedClient } from '../client/index.js';

/**
 * Creates a minimal fake OakApiPathBasedClient for unit tests.
 * The real type is generated from OpenAPI and has many path/method keys; tests only need a subset.
 * Accepts a minimal shape (e.g. one path with one method handler); cast is necessary because
 * OpenAPI-generated handler types are incompatible with vi.fn() in tests.
 */
export function createFakeOakApiPathBasedClient(partial: unknown): OakApiPathBasedClient {
  return partial as OakApiPathBasedClient;
}
