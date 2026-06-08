/**
 * Feature-flag resolution engine.
 *
 * The env layer (`env.ts`) validates each flag to `'true' | 'false' | undefined`.
 * These pure functions apply the flag's *posture* — how an unset value resolves:
 *
 * - **opt-in** (default OFF): enabled only on an explicit `'true'`. The posture
 *   for a feature that must be deliberately switched on (e.g. stub tools).
 * - **kill-switch** (default ON): enabled unless an explicit `'false'` disables
 *   it. The release-pre-proof posture for a shipped, reversible feature — merging
 *   makes it live with no separate env step, and `'false'` is the kill-switch.
 *
 * This module is the flag engine: the resolution mechanism is tested here once.
 * Which flag uses which posture, and a flag's default, are configuration — set at
 * the call site (`runtime-config-from-validated-env.ts`), not re-tested per flag.
 */

/** Opt-in posture: enabled only on an explicit `'true'` (default OFF). */
export function resolveOptInFlag(value: string | undefined): boolean {
  return value === 'true';
}

/** Kill-switch posture: enabled unless an explicit `'false'` disables it (default ON). */
export function resolveKillSwitchFlag(value: string | undefined): boolean {
  return value !== 'false';
}
