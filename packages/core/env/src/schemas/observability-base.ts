/**
 * Internal pre-`superRefine` base shape for `observability.ts`'s
 * `ObservabilityEnvSchema`. Holds the orthogonal-axes fields plus the
 * legacy keys we accept only so the cross-field refinements in
 * `observability-refinements.ts` can reject them with rename messages.
 *
 * @remarks Once the legacy values are gone (post-WS3) the legacy keys
 * can be dropped from this shape entirely. Not exported from the package
 * barrel — implementation detail of `observability.ts`.
 *
 * @see ../../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 *
 * @packageDocumentation
 */

import { z } from 'zod';
import { OBSERVABILITY_FIXTURES_SCHEMA, OBSERVABILITY_SINKS_SCHEMA } from './observability-axes.js';

/** Zod literal union of Vercel deployment-environment names. */
const VERCEL_ENV_LITERAL = z.enum(['production', 'preview', 'development']);

/** Pre-`superRefine` base shape for `ObservabilityEnvSchema`. */
export const ObservabilityEnvBaseSchema = z.object({
  OBSERVABILITY_SINKS: OBSERVABILITY_SINKS_SCHEMA,
  OBSERVABILITY_FIXTURES: OBSERVABILITY_FIXTURES_SCHEMA,
  OBSERVABILITY_FILE_PATH: z.string().min(1).optional(),
  SENTRY_DSN: z.string().min(1).optional(),
  VERCEL_ENV: VERCEL_ENV_LITERAL.optional(),
  SENTRY_MODE: z.string().optional(),
  MCP_LOGGER_FILE_PATH: z.string().optional(),
  MCP_LOGGER_FILE_APPEND: z.string().optional(),
  MCP_LOGGER_STDOUT: z.string().optional(),
});
