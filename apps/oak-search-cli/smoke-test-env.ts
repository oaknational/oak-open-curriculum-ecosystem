import { resolveEnv } from '@oaknational/env-resolution';
import { err, type Result } from '@oaknational/result';
import { z } from 'zod';
import type { ConfigError, LoadRuntimeConfigOptions } from './src/runtime-config-support.js';

const SearchCliSmokeEnvSchema = z.object({
  ELASTICSEARCH_URL: z.url(),
  ELASTICSEARCH_API_KEY: z.string().min(10),
});

/** Minimal validated environment required by search CLI smoke tests. */
export type SearchCliSmokeEnv = z.infer<typeof SearchCliSmokeEnvSchema>;

/**
 * Loads the minimal smoke-test environment from the env resolution pipeline.
 *
 * The Vitest smoke config is the composition root and may read ambient env.
 * Test files and setup files consume this injected object instead.
 */
export function loadSmokeTestEnv(
  options: LoadRuntimeConfigOptions,
): Result<SearchCliSmokeEnv, ConfigError> {
  const envResult = resolveEnv({
    schema: SearchCliSmokeEnvSchema,
    processEnv: options.processEnv,
    startDir: options.startDir,
  });

  if (!envResult.ok) {
    return err({
      message: envResult.error.message,
      diagnostics: envResult.error.diagnostics,
    });
  }

  return envResult;
}
