import { err, ok, type Result } from '@oaknational/result';

import type { SuiteSelection } from './args.js';
import type { LoadedSuite } from './plugin.js';
import { projectedCaseNames } from './project.js';
import type { SuiteName } from './suite.js';

/**
 * Which suites a run invokes and which cases each is asked for.
 *
 * @remarks
 * A `--case` glob narrows within each suite; a suite it leaves empty is not
 * invoked; a selection that reaches nothing is a refusal, never a silent
 * success.
 *
 * @packageDocumentation
 */

/** One suite to invoke and the cases it is asked for. */
export interface PlannedSuite {
  readonly suite: SuiteName;
  readonly cases: readonly string[];
}

/** What planning needs. */
export interface PlanInput {
  readonly skill: string;
  readonly suite: SuiteSelection;
  readonly caseGlob: string | undefined;
}

/** The regex for one character of the runner's case glob: `*` any run of characters, `?` one, anything else itself. */
function globCharToRegex(char: string): string {
  if (char === '*') {
    return '.*';
  }
  if (char === '?') {
    return '.';
  }
  return char.replaceAll(/[.+^${}()|[\]\\]/gu, String.raw`\$&`);
}

/** The runner's case glob: `*` any run of characters, `?` one; nothing else is special. */
function matchesGlob(name: string, glob: string): boolean {
  const pattern = [...glob].map(globCharToRegex).join('');
  return new RegExp(`^${pattern}$`, 'u').test(name);
}

/** The suites to invoke and the cases each is asked for, or the refusal when nothing would run. */
export function planSuites(
  input: PlanInput,
  loaded: LoadedSuite,
): Result<readonly PlannedSuite[], Error> {
  if (input.suite === 'triggers' && loaded.projection.triggers.length === 0) {
    return err(
      new Error(`${input.skill} declares no trigger examples; --suite triggers has nothing to run`),
    );
  }
  const wanted: readonly SuiteName[] =
    input.suite === 'all' ? ['cases', 'triggers'] : [input.suite];
  const names = projectedCaseNames(loaded.projection);
  const planned = wanted
    .map((suite) => ({
      suite,
      cases: names.filter(
        (name) =>
          name.startsWith(suite === 'cases' ? 'case-' : 'trigger-') &&
          (input.caseGlob === undefined || matchesGlob(name, input.caseGlob)),
      ),
    }))
    .filter((plan) => plan.cases.length > 0);
  if (planned.length === 0) {
    return err(new Error(`no case of ${input.skill} matches --case '${input.caseGlob ?? ''}'`));
  }
  return ok(planned);
}
