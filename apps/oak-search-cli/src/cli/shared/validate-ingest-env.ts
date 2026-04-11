/**
 * Precondition check for lifecycle ingest environment.
 *
 * Validates that required environment values for ingestion are
 * present BEFORE any resource creation (ES client, OakClient).
 * Returns a Result so callers can fail fast with a helpful message.
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import { ok, err, type Result } from '@oaknational/result';

/** Error from ingest environment validation. */
interface EnvError {
  readonly type: 'missing_env';
  readonly message: string;
}

/**
 * Validate that the ingest environment has required values.
 *
 * @param env - Object containing the Oak API key (may be undefined)
 * @returns `ok(undefined)` if valid, or `err(EnvError)` with actionable message
 */
export function validateIngestEnv(env: { oakApiKey: string | undefined }): Result<void, EnvError> {
  if (!env.oakApiKey) {
    return err({
      type: 'missing_env',
      message:
        'OAK_API_KEY is required for ingestion commands. ' +
        'Set it in .env or pass it as an environment variable.',
    });
  }
  return ok(undefined);
}
