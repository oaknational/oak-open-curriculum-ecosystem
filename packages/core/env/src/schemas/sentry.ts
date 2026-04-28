import { z } from 'zod';

/**
 * Supported shared Sentry operating modes.
 */
export const SENTRY_MODES = ['off', 'fixture', 'sentry'] as const;

const SENTRY_BOOLEAN_FLAGS = z.union([z.literal('true'), z.literal('false')]);

/**
 * Shared environment contract for Oak's Sentry configuration surface.
 *
 * Cross-field validation belongs in the shared config builder; this schema only
 * defines the raw environment-variable contract shared across runtimes.
 */
export const SentryEnvSchema = z.object({
  SENTRY_MODE: z.enum(SENTRY_MODES).default('off'),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT_OVERRIDE: z.string().optional(),
  SENTRY_RELEASE_OVERRIDE: z.string().optional(),
  SENTRY_TRACES_SAMPLE_RATE: z.string().optional(),
  SENTRY_ENABLE_LOGS: SENTRY_BOOLEAN_FLAGS.optional(),
  SENTRY_SEND_DEFAULT_PII: SENTRY_BOOLEAN_FLAGS.optional(),
  SENTRY_DEBUG: SENTRY_BOOLEAN_FLAGS.optional(),
});

export type SentryEnv = z.infer<typeof SentryEnvSchema>;
