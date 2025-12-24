/**
 * API helper functions for ground truth validation.
 *
 * @packageDocumentation
 */

/** Base URL for Oak Open Curriculum API. */
export const API_BASE = 'https://open-api.thenational.academy/api/v0';

/**
 * Gets the API key from environment, failing fast if not set.
 * @returns The OAK_API_KEY value
 * @throws Never - exits process with code 1 if key is missing
 */
export function getApiKey(): string {
  const apiKey = process.env['OAK_API_KEY'];
  if (!apiKey) {
    console.error('❌ FATAL: OAK_API_KEY environment variable is required');
    console.error('');
    console.error('Set it in your shell or in .env file:');
    console.error('  export OAK_API_KEY=your_api_key');
    console.error('  # or');
    console.error('  echo "OAK_API_KEY=your_api_key" >> .env');
    console.error('');
    console.error('This script validates ground truth against the live API.');
    console.error('It cannot run without an API key.');
    process.exit(1);
  }
  return apiKey;
}
