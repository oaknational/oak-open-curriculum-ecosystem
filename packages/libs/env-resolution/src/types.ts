/**
 * Public types for the env-resolution pipeline: per-key diagnostics,
 * structured errors, the discriminated-union warnings, and the extended
 * Result shape that carries them.
 *
 * @remarks Extracted from `resolve-env.ts` to keep that module focused
 * on the pipeline mechanics. The warnings channel is the additive sibling
 * to the success Result described by the observability multi-sink + fixtures
 * shape plan §D10 (warnings channel addition); the carrier is reserved
 * in WS1 and populated by the schema layer in WS3. The dedicated ADR is
 * authored at WS8.6 of that plan; until then the plan body is the
 * canonical source.
 *
 * `EnvWarning` is a discriminated union — never a `Record<string, unknown>`
 * — so consumers can fan-out by `kind` without losing type information at
 * the boundary between schema-level cross-field rules (e.g. preview-with-
 * empty-sinks) and the operator-facing surface that displays the warnings.
 *
 * @see ../../../../.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
 *
 * @packageDocumentation
 */

import type { z } from 'zod';

/**
 * Diagnostic information for a single environment variable key.
 *
 * @remarks Reports whether the key was present in the merged environment
 * (across all sources: `.env`, `.env.local`, `processEnv`).
 */
export interface EnvKeyDiagnostic {
  readonly key: string;
  readonly present: boolean;
}

/**
 * Structured error returned when environment resolution fails.
 *
 * @remarks Contains a human-readable message, per-key diagnostics
 * showing which keys were present or absent, and the raw Zod validation
 * issues.
 */
export interface EnvResolutionError {
  readonly message: string;
  readonly diagnostics: readonly EnvKeyDiagnostic[];
  readonly zodIssues: readonly z.core.$ZodIssue[];
}

/**
 * Warning emitted when `VERCEL_ENV=preview` AND `OBSERVABILITY_SINKS=[]`.
 *
 * @remarks Variant `'observability_sinks_empty_in_preview'` of the
 * {@link EnvWarning} discriminated union. In a Vercel preview environment
 * with no external sinks the boot succeeds (preview is a deliberate
 * dev-mode shape per the plan body's locality-enforcement rule), but the
 * operator is told the configuration is unusual. Production with empty
 * sinks is a hard error, not a warning.
 */
export interface ObservabilitySinksEmptyInPreviewWarning {
  readonly kind: 'observability_sinks_empty_in_preview';
  readonly message: string;
}

/**
 * Structured warning surfaced by the env-resolution pipeline on the success
 * branch.
 *
 * @remarks Discriminated union of every warning kind. New kinds extend
 * this union by adding a sibling interface and `|`-ing it on — the union
 * shape is the contract; consumers narrow on `kind` and the switch is
 * exhaustive at the type level.
 */
export type EnvWarning = ObservabilitySinksEmptyInPreviewWarning;

/**
 * Successful env-resolution variant carrying the validated env and any
 * warnings emitted by the pipeline.
 *
 * @remarks Structurally a superset of `@oaknational/result`'s `Ok<T>` —
 * `result.value` is unchanged for callers that ignore warnings, so the
 * channel is additive on the success path (plan body §D10).
 *
 * @typeParam TEnv - The validated env shape (Zod schema output).
 */
export interface EnvResolveOk<TEnv> {
  readonly ok: true;
  readonly value: TEnv;
  readonly warnings: readonly EnvWarning[];
}

/**
 * Failed env-resolution variant, identical to `@oaknational/result`'s
 * `Err<EnvResolutionError>`.
 *
 * @remarks No warnings on the error branch — the pipeline either emits a
 * structured error or a successful Result with warnings. The branches are
 * mutually exclusive.
 */
export interface EnvResolveErr {
  readonly ok: false;
  readonly error: EnvResolutionError;
}

/**
 * Result type returned by `resolveEnv` — `EnvResolveOk<TEnv>` on success
 * (with warnings), `EnvResolveErr` on failure.
 *
 * @remarks Compatible with the `Result<TEnv, EnvResolutionError>` shape
 * from `@oaknational/result` for the property-access patterns currently
 * in use across the codebase (`result.ok`, `result.value`, `result.error`).
 * Callers that need warnings narrow on `result.ok` and read
 * `result.warnings`.
 *
 * @typeParam TEnv - The validated env shape (Zod schema output).
 */
export type EnvResolveResult<TEnv> = EnvResolveOk<TEnv> | EnvResolveErr;
