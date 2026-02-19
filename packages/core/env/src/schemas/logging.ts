import { z } from 'zod';

/**
 * Valid log levels supported across the MCP ecosystem.
 *
 * Exported as a tuple constant for use in both Zod schemas and
 * runtime type guards.
 */
export const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const;

/**
 * Valid NODE_ENV values.
 */
export const NODE_ENVS = ['development', 'production', 'test'] as const;

/**
 * Contract schema for logging and environment identification.
 *
 * All fields are optional. Import and merge this schema when your app
 * uses structured logging or needs NODE_ENV awareness.
 *
 * @example
 * ```typescript
 * const AppEnv = OakApiKeyEnvSchema.extend(LoggingEnvSchema.shape);
 * ```
 */
export const LoggingEnvSchema = z.object({
  LOG_LEVEL: z.enum(LOG_LEVELS).optional(),
  NODE_ENV: z.enum(NODE_ENVS).optional(),
  ENVIRONMENT_OVERRIDE: z.string().optional(),
});

export type LoggingEnv = z.infer<typeof LoggingEnvSchema>;
