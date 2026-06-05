/**
 * Detect package-manager and build-orchestrator invocations in the repository
 * root's lifecycle scripts (`postinstall`, `prepare`, and the rest of the
 * install/publish/pack family).
 *
 * Install-time bootstrap must be smaller than the build graph and must never
 * re-enter the package manager or the build orchestrator: a lifecycle script
 * that runs `pnpm`/`turbo` pulls the full task graph, remote cache, and daemon
 * into every `pnpm install`, and risks re-entrant install behaviour. The
 * canonical bootstrap form runs workspace source directly
 * (`tsx agent-tools/src/bootstrap/bootstrap.ts`); `husky` is allowed for `prepare`.
 *
 * The helper is pure and operates on an in-memory `scripts` map; the runtime
 * that reads the root `package.json` is in `validate-lifecycle-scripts.ts`.
 *
 * @packageDocumentation
 */

/**
 * The package.json lifecycle hooks the package manager runs automatically.
 * Only these keys are scanned — ordinary scripts such as `build` or `test`
 * legitimately invoke turbo and are out of scope.
 */
export const SCANNED_LIFECYCLE_HOOKS: readonly string[] = [
  'preinstall',
  'install',
  'postinstall',
  'prepare',
  'prepublish',
  'prepublishOnly',
  'prepack',
  'postpack',
  'publish',
  'postpublish',
];

/**
 * Forbidden command tokens. Matched on word boundaries so `npm` does not match
 * inside `pnpm` and `turbo` does not match inside a longer identifier.
 */
const BLOCKED_TERMS: readonly string[] = ['pnpm', 'pnpx', 'npm', 'npx', 'yarn', 'turbo'];

/**
 * A single lifecycle-script violation: a forbidden term found in a scanned hook.
 */
export interface LifecycleScriptViolation {
  /** The lifecycle hook whose script contains the forbidden term. */
  readonly hook: string;
  /** The full script string for the hook. */
  readonly script: string;
  /** The forbidden term that matched (e.g. `turbo`). */
  readonly term: string;
}

function matchesTerm(script: string, term: string): boolean {
  return new RegExp(`\\b${term}\\b`, 'i').test(script);
}

/**
 * Find package-manager / orchestrator invocations in the root lifecycle scripts.
 *
 * @param scripts - The root `package.json` `scripts` map. Values are typed as
 *   optionally `undefined` so a hook absent from the map is handled without a
 *   type assertion at the call site.
 * @returns Violations in hook-then-term order. Empty when every scanned hook is
 *   free of forbidden terms.
 *
 * @example
 *
 * ```ts
 * findLifecycleScriptViolations({ postinstall: 'turbo run build' });
 * // [{ hook: 'postinstall', script: 'turbo run build', term: 'turbo' }]
 * ```
 */
export function findLifecycleScriptViolations(
  scripts: Readonly<Record<string, string | undefined>>,
): readonly LifecycleScriptViolation[] {
  const violations: LifecycleScriptViolation[] = [];

  for (const hook of SCANNED_LIFECYCLE_HOOKS) {
    const script = scripts[hook];
    if (typeof script !== 'string') {
      continue;
    }
    for (const term of BLOCKED_TERMS) {
      if (matchesTerm(script, term)) {
        violations.push({ hook, script, term });
      }
    }
  }

  return violations;
}
