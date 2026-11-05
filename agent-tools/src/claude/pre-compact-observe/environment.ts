/**
 * The environment snapshot: which variables the observation records, and how.
 *
 * @remarks
 * Values are recorded by allowlist. Only the named identifier and
 * session-shape variables keep their values. Every other `CLAUDE_*` or
 * `PRACTICE_*` variable is recorded by name alone, so a variable the harness
 * adds tomorrow is withheld by default. The credential and transport
 * variables are never recorded at all. Variables outside the two namespaces
 * are ignored.
 *
 * @packageDocumentation
 */

import { typeSafeEntries } from '@oaknational/type-helpers';

import { compareUtf16 } from '../../typescript-estate/utf16-order.js';

/** The variables recorded with their values: identifiers and session-shape flags. */
const RECORDED_WITH_VALUES: ReadonlySet<string> = new Set([
  'CLAUDE_PROJECT_DIR',
  'CLAUDE_CODE_SESSION_ID',
  'CLAUDE_CODE_ENTRYPOINT',
  'CLAUDE_CODE_CHILD_SESSION',
  'CLAUDE_CODE_SESSION_ATTENDED',
  'CLAUDE_EFFORT',
  'CLAUDE_PID',
  'PRACTICE_AGENT_SESSION_ID_CLAUDE',
]);

/**
 * The credential and transport variables, never recorded, not even by name.
 * They reach no log, so no log can leak them.
 */
const NEVER_RECORDED: ReadonlySet<string> = new Set([
  'CLAUDE_CODE_MESSAGING_TOKEN',
  'CLAUDE_CODE_MESSAGING_SOCKET',
  'CLAUDE_CODE_SSE_PORT',
]);

/** The namespaces the snapshot looks at; every other name is ignored. */
const OBSERVED_NAMESPACE = /^(?:CLAUDE|PRACTICE)_/;

/** The environment as one observation records it, each part sorted by name. */
export interface EnvironmentSnapshot {
  /** The allowlisted variables and their values. */
  readonly recorded: Readonly<Record<string, string>>;
  /** The names of every other variable in the two namespaces, without their values. */
  readonly withheld: readonly string[];
}

/**
 * Snapshot the environment for one observation.
 *
 * @param environment - The hook process's environment.
 * @returns The allowlisted variables with their values, and the names of the
 *   rest of the two namespaces; each sorted by name, so the serialised
 *   snapshot is deterministic.
 */
export function snapshotEnvironment(
  environment: Readonly<Record<string, string | undefined>>,
): EnvironmentSnapshot {
  const recorded: [string, string][] = [];
  const withheld: string[] = [];
  for (const [name, value] of typeSafeEntries(environment).toSorted(byName)) {
    if (value === undefined || !OBSERVED_NAMESPACE.test(name) || NEVER_RECORDED.has(name)) {
      continue;
    }
    if (RECORDED_WITH_VALUES.has(name)) {
      recorded.push([name, value]);
    } else {
      withheld.push(name);
    }
  }
  return { recorded: Object.fromEntries(recorded), withheld };
}

/** Order variables by name, in UTF-16 code-unit order so the result is locale-free. */
function byName(left: readonly [string, unknown], right: readonly [string, unknown]): number {
  return compareUtf16(left[0], right[0]);
}
