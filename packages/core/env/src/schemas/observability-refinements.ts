/**
 * Internal cross-field `superRefine` helpers for `observability.ts`'s
 * `ObservabilityEnvSchema`. Each branch is encoded as a small focused
 * function so the composed schema reads as five named rules and so each
 * helper stays under the package complexity / line-count budgets.
 *
 * @remarks Not exported from the package barrel — these helpers are
 * implementation detail of `observability.ts`. The cross-field rules
 * themselves are described in the observability multi-sink + fixtures
 * shape plan body §WS1 (locality enforcement, sink-config conditional
 * requirements, legacy-rename rejection). The dedicated ADR is authored
 * at WS8.6 of that plan; until then the plan body is the canonical source.
 *
 * @see ../../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 *
 * @packageDocumentation
 */

import type { z } from 'zod';
import type { ObservabilityEnvBaseSchema } from './observability-base.js';

/**
 * Tuple of legacy `MCP_LOGGER_*` env-var keys still rejected at boot.
 *
 * @remarks Each key has a distinct rename in the orthogonal-axes shape;
 * see {@link LEGACY_LOGGER_RENAME_MESSAGES} for the per-key text.
 */
const LEGACY_LOGGER_KEYS = [
  'MCP_LOGGER_FILE_PATH',
  'MCP_LOGGER_FILE_APPEND',
  'MCP_LOGGER_STDOUT',
] as const;

/**
 * Per-key operator-facing rename message for each legacy `MCP_LOGGER_*`
 * env var. Each message is self-contained and names the orthogonal-axes
 * replacement (or explains there isn't one) without requiring the
 * operator to consult another doc — addresses onboarding-reviewer
 * 2026-05-02 finding 1.
 */
const LEGACY_LOGGER_RENAME_MESSAGES = {
  MCP_LOGGER_FILE_PATH:
    'MCP_LOGGER_FILE_PATH has been replaced. File-sink configuration ' +
    'now lives in the observability registry: set ' +
    'OBSERVABILITY_SINKS=["file"] with OBSERVABILITY_FILE_PATH=<path>. ' +
    'See the observability multi-sink + fixtures plan.',
  MCP_LOGGER_FILE_APPEND:
    'MCP_LOGGER_FILE_APPEND has been replaced. The file sink now appends ' +
    'unconditionally; there is no longer a knob for truncate-vs-append ' +
    '(if you need truncation, rotate the file out-of-process). Remove ' +
    'this env var. See the observability multi-sink + fixtures plan.',
  MCP_LOGGER_STDOUT:
    'MCP_LOGGER_STDOUT has been replaced. Stdout is now the always-on ' +
    'baseline (per ADR-162 §The Vendor-Independence Clause); there is no ' +
    'longer a knob to disable it. Remove this env var. See the ' +
    'observability multi-sink + fixtures plan.',
} as const satisfies Record<(typeof LEGACY_LOGGER_KEYS)[number], string>;

/** Post-base-parse, pre-`superRefine` shape used by the helper functions below. */
type ObservabilityEnvBase = z.output<typeof ObservabilityEnvBaseSchema>;

/**
 * Type-narrowing predicate for "non-empty string" — used to distinguish
 * `undefined` and the empty string from an actually-set legacy env var.
 */
function isPresentString(value: string | undefined): value is string {
  return value !== undefined && value !== '';
}

/**
 * `superRefine` branch 1 — rejects any non-empty `SENTRY_MODE` with the
 * canonical rename-replacement message that names every legacy value's
 * orthogonal-axes equivalent inline.
 *
 * @remarks The message is operator-facing copy at the boot boundary. It
 * must be self-contained enough to migrate without consulting other
 * documentation (per the onboarding first-contact rule).
 */
export function refineLegacySentryMode(data: ObservabilityEnvBase, ctx: z.RefinementCtx): void {
  if (!isPresentString(data.SENTRY_MODE)) {
    return;
  }
  ctx.addIssue({
    code: 'custom',
    path: ['SENTRY_MODE'],
    message:
      'SENTRY_MODE has been replaced by orthogonal axes. Migration: ' +
      'SENTRY_MODE=off => OBSERVABILITY_SINKS=[] OBSERVABILITY_FIXTURES=false; ' +
      'SENTRY_MODE=fixture => OBSERVABILITY_SINKS=[] OBSERVABILITY_FIXTURES=true; ' +
      'SENTRY_MODE=sentry => OBSERVABILITY_SINKS=["sentry"] ' +
      'OBSERVABILITY_FIXTURES=false (and set SENTRY_DSN). See the ' +
      'observability multi-sink + fixtures plan.',
  });
}

/**
 * `superRefine` branch 2 — rejects any non-empty legacy `MCP_LOGGER_*`
 * key with a per-key message that names the orthogonal-axes replacement
 * (or explains there is none).
 *
 * @remarks File-sink configuration now lives inside the registry (D8 in
 * the plan body); stdout is the always-on baseline (ADR-162 §The
 * Vendor-Independence Clause); the file-append knob is removed. Each
 * legacy key gets a key-specific migration message via
 * {@link LEGACY_LOGGER_RENAME_MESSAGES} — the operator does not need to
 * look up another doc.
 */
export function refineLegacyLoggerKeys(data: ObservabilityEnvBase, ctx: z.RefinementCtx): void {
  for (const legacyKey of LEGACY_LOGGER_KEYS) {
    if (!isPresentString(data[legacyKey])) {
      continue;
    }
    ctx.addIssue({
      code: 'custom',
      path: [legacyKey],
      message: LEGACY_LOGGER_RENAME_MESSAGES[legacyKey],
    });
  }
}

/**
 * `superRefine` branches 3 and 4 — encodes the per-sink conditional
 * requirements: `'sentry'` ⇒ `SENTRY_DSN` required, `'file'` ⇒
 * `OBSERVABILITY_FILE_PATH` required.
 *
 * @remarks Each missing-config message names both the missing key and
 * the alternative remediation (remove the sink) so the operator has a
 * choice without consulting other docs.
 */
export function refineSinkConditionalRequirements(
  data: ObservabilityEnvBase,
  ctx: z.RefinementCtx,
): void {
  const sinks = data.OBSERVABILITY_SINKS;
  if (sinks.includes('sentry') && !isPresentString(data.SENTRY_DSN)) {
    ctx.addIssue({
      code: 'custom',
      path: ['SENTRY_DSN'],
      message:
        'SENTRY_DSN is required when OBSERVABILITY_SINKS includes "sentry". ' +
        'Either set SENTRY_DSN, or remove "sentry" from OBSERVABILITY_SINKS.',
    });
  }
  if (sinks.includes('file') && !isPresentString(data.OBSERVABILITY_FILE_PATH)) {
    ctx.addIssue({
      code: 'custom',
      path: ['OBSERVABILITY_FILE_PATH'],
      message:
        'OBSERVABILITY_FILE_PATH is required when OBSERVABILITY_SINKS includes "file". ' +
        'Either set OBSERVABILITY_FILE_PATH, or remove "file" from OBSERVABILITY_SINKS.',
    });
  }
}

/**
 * `superRefine` branch 5 — fails closed when production has no external
 * sink registered.
 *
 * @remarks Production observability cannot rely on stdout alone (ADR-162
 * §The Vendor-Independence Clause names stdout as the always-on baseline,
 * but the plan body's locality-enforcement rule mandates at least one
 * remote sink in production). Preview-with-empty-sinks is a warning, not
 * an error — handled in the warnings channel rather than here.
 */
export function refineProductionLocality(data: ObservabilityEnvBase, ctx: z.RefinementCtx): void {
  if (data.VERCEL_ENV !== 'production') {
    return;
  }
  if (data.OBSERVABILITY_SINKS.length > 0) {
    return;
  }
  ctx.addIssue({
    code: 'custom',
    path: ['OBSERVABILITY_SINKS'],
    message:
      'OBSERVABILITY_SINKS must include at least one external sink in ' +
      'production. Empty list is fail-closed per the observability ' +
      'multi-sink + fixtures plan; production observability cannot ' +
      'rely on stdout alone. Inline fix examples: ' +
      'OBSERVABILITY_SINKS=["sentry"] (with SENTRY_DSN); or ' +
      'OBSERVABILITY_SINKS=["file"] (with OBSERVABILITY_FILE_PATH=<path>); ' +
      'or OBSERVABILITY_SINKS=["sentry","file"] (with both).',
  });
}
