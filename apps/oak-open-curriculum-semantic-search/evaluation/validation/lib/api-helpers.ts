/**
 * API helper functions for ground truth validation.
 *
 * @packageDocumentation
 */

/** Base URL for Oak Open Curriculum API. */
export const API_BASE = 'https://open-api.thenational.academy/api/v0';

/**
 * Validates that an API key was provided.
 *
 * Callers must read the key from the environment at their
 * entry point (via `env()`) and pass it down.
 *
 * @param apiKey - The API key to validate
 * @returns The validated API key
 * @throws When the API key is missing or empty
 */
export function requireApiKey(apiKey: string | undefined): string {
  if (!apiKey || apiKey.length === 0) {
    throw new Error('OAK_API_KEY is required. ' + 'Set it in .env.local or pass via env().');
  }
  return apiKey;
}
