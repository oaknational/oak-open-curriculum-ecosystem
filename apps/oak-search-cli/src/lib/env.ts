/**
 * Legacy environment validation for the Search CLI.
 *
 * The canonical schemas live in `src/env.ts` (`SearchCliEnvSchema`) and
 * environment loading uses `resolveEnv` via `src/runtime-config.ts`.
 *
 * This file retains:
 * - `parseEnv()` — pure validation function used in tests
 * - Schema exports for backward compatibility with existing test fixtures,
 *   re-exported from the canonical schema module
 */

import { err, ok, type Result } from '@oaknational/result';
import { SearchCliBaseEnvSchema, SearchCliEnvSchema } from '../env.js';
import type { SearchCliEnv } from '../env.js';

/** Backward-compatible base schema alias (canonical source: `src/env.ts`). */
export const BaseEnvSchema = SearchCliBaseEnvSchema;
/** Backward-compatible full schema alias (canonical source: `src/env.ts`). */
export const EnvSchema = SearchCliEnvSchema;

export type Env = SearchCliEnv;

type EnvResult = Env & { OAK_EFFECTIVE_KEY: string };
/**
 * Parse-env failure details for explicit caller handling.
 */
export interface ParseEnvError {
  readonly message: string;
}

/** Validate a raw env record against the schema. Exported for direct unit testing. */
export function parseEnv(
  raw: Record<string, string | undefined>,
): Result<EnvResult, ParseEnvError> {
  const parsed = EnvSchema.safeParse(raw);
  if (!parsed.success) {
    return err({ message: parsed.error.message });
  }
  const key = parsed.data.OAK_API_KEY;
  if (typeof key !== 'string' || key.length === 0) {
    return err({ message: 'Set OAK_API_KEY.' });
  }
  return ok({ ...parsed.data, OAK_EFFECTIVE_KEY: key });
}
