/**
 * Mode registry for the canonical smoke harness.
 *
 * @remarks
 * The registry maps mode-names (CLI dispatch keywords) to
 * {@link SmokeModeConfig} values. The registry is intentionally empty
 * during ARC A1; ARC A2 populates it as each existing mode
 * (`local-stub`, `local-stub-auth`, `local-live`, `local-live-auth`,
 * `remote`) migrates to the new harness, and ARC A3 adds
 * `local-no-observability`. Each mode lands as its own commit so the
 * registry's typed surface remains type-stable across the migration.
 *
 * Looking up an unknown mode is a fail-fast operational error — the
 * CLI exits non-zero with the available-modes list. There is no
 * "default" mode and no fallback resolution.
 *
 * @packageDocumentation
 */

import { typeSafeKeys } from '@oaknational/type-helpers';
import type { SmokeModeConfig } from './types.js';

/**
 * Registry of mode-name → config.
 *
 * @remarks
 * The registry is populated incrementally during ARC A2 + A3. ARC A1
 * intentionally lands an empty registry so the dispatch path
 * type-checks and the harness's RED tests can exercise the
 * unknown-mode path without requiring full mode wiring.
 */
const SMOKE_MODES: Readonly<Record<string, SmokeModeConfig>> = {};

/**
 * Looks up a mode by name; throws when not found.
 *
 * @remarks
 * The error message lists the currently-registered modes so the
 * operator can correct typos without re-reading the source. The error
 * is intentionally *fatal* — modes are a closed set, and asking for
 * one that doesn't exist is a configuration bug, not a runtime
 * recoverable condition.
 */
export function resolveSmokeMode(name: string): SmokeModeConfig {
  const mode = SMOKE_MODES[name];
  if (mode === undefined) {
    const available = listSmokeModes();
    const detail = available.length === 0 ? '(none registered yet)' : available.join(', ');
    throw new Error(`Unknown smoke mode: ${name}. Available modes: ${detail}`);
  }
  return mode;
}

/**
 * Returns the registered mode names, sorted alphabetically.
 *
 * @remarks
 * Used by the CLI's help output and the `unknown-mode` error message.
 */
export function listSmokeModes(): readonly string[] {
  return typeSafeKeys(SMOKE_MODES).sort();
}
