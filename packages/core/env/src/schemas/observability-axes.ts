/**
 * Per-axis env-var schemas for `observability.ts`'s composed
 * `ObservabilityEnvSchema`. Each axis (sinks, fixtures) has its own Zod
 * schema with input-coercion concerns isolated from the cross-field
 * `superRefine` rules. The two exports are part of the public
 * `@oaknational/env` surface; they live in this file to keep
 * `observability.ts` focused on the cross-field composition narrative.
 *
 * @remarks Re-exported from `observability.ts` (the public schema
 * surface) so consumers see a single import site. Addresses
 * docs-adr-expert 2026-05-02 finding 2 (drop the misleading "internal"
 * framing on a public-symbol file).
 *
 * @see ../../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 *
 * @packageDocumentation
 */

import { OBSERVABILITY_SINK_KINDS, type ObservabilitySinkKind } from '@oaknational/observability';
import { z } from 'zod';

/** Zod literal union of the observability sink kinds (`'sentry' | 'file'`). */
const OBSERVABILITY_SINK_KIND_LITERAL = z.enum(OBSERVABILITY_SINK_KINDS);

/** Zod array of {@link OBSERVABILITY_SINK_KIND_LITERAL}; the parsed shape of `OBSERVABILITY_SINKS`. */
const OBSERVABILITY_SINK_ARRAY = z.array(OBSERVABILITY_SINK_KIND_LITERAL);

/**
 * Schema for the `OBSERVABILITY_SINKS` env var.
 *
 * @remarks Accepts a JSON-array string literal (e.g. `'["sentry"]'`,
 * `'["sentry","file"]'`, `'[]'`) and parses to a typed readonly array
 * of {@link ObservabilitySinkKind} values. Default is the empty array
 * (stdout-only baseline, no external sinks). The JSON-array format keeps
 * a single env-var slot extensible to N sinks without inventing a
 * comma-separated mini-language; operators pick the shape from the
 * {@link OBSERVABILITY_SINK_KINDS} union.
 *
 * @example
 * ```ts
 * OBSERVABILITY_SINKS_SCHEMA.parse('["sentry"]'); // ['sentry']
 * OBSERVABILITY_SINKS_SCHEMA.parse('[]');         // []
 * OBSERVABILITY_SINKS_SCHEMA.parse(undefined);    // [] (default)
 * ```
 */
export const OBSERVABILITY_SINKS_SCHEMA = z
  .string()
  .default('[]')
  .transform((raw, ctx): readonly ObservabilitySinkKind[] => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      ctx.addIssue({
        code: 'custom',
        message:
          `OBSERVABILITY_SINKS must be a JSON array literal ` +
          `(e.g. '["sentry"]' or '[]'). Received non-JSON value: ${raw}`,
      });
      return z.NEVER;
    }
    const validation = OBSERVABILITY_SINK_ARRAY.safeParse(parsed);
    if (!validation.success) {
      ctx.addIssue({
        code: 'custom',
        message:
          `OBSERVABILITY_SINKS must be a JSON array of ` +
          `[${OBSERVABILITY_SINK_KINDS.join(', ')}]. Received: ${raw}`,
      });
      return z.NEVER;
    }
    return validation.data;
  });

/**
 * Schema for the `OBSERVABILITY_FIXTURES` env var.
 *
 * @remarks Orthogonal boolean controlling whether the fixture store
 * tees the same events the external sinks see. Default `false`. Encoded
 * as a string literal (`'true'` / `'false'`) on the env surface because
 * env values arrive as strings; the `.transform` narrows to `boolean`
 * for downstream consumers.
 */
export const OBSERVABILITY_FIXTURES_SCHEMA = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');
