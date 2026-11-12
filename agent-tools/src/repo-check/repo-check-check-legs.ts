import { err, ok, type Result } from '@oaknational/result';

import { parseCheckLegs } from '../validators/check-ci-parity/check-ci-parity-helpers.js';

/**
 * The root `check` script read as ordered legs, and what captured
 * `pnpm check` output says about how far the chain got.
 *
 * `pnpm check` first echoes its own script body, and that body names every
 * leg, so a substring match on a leg's name is true of every captured run.
 * What discriminates is the line pnpm prints when a leg's own script starts:
 * `$ ` followed by that script's body, on a line of its own. The legs are
 * joined by `&&`, so in a failed run the last leg whose start line appears is
 * the leg the chain stopped in. Pure: scripts and output in, legs out.
 *
 * @packageDocumentation
 */

/** One leg of the root `check` chain. */
export interface CheckLeg {
  /** The root script the chain runs as `pnpm <name>`. */
  readonly name: string;
  /** The whole line pnpm prints when the leg's script starts. */
  readonly startLine: string;
  /** The turbo tasks the leg reaches, following root scripts it runs; empty for a non-turbo leg. */
  readonly turboTasks: readonly string[];
}

/**
 * An SGR escape sequence (colour, dim, reset): a control character, `[`, the
 * parameters and `m`. The property class names the ESC byte without putting a
 * control character in the source.
 */
const SGR_SEQUENCE = /\p{Cc}\[[0-9;]*m/gu;

/**
 * The turbo tasks a root script reaches: those it runs itself, and those of
 * the root scripts it runs as `pnpm <name>`, followed until a script repeats.
 */
function turboTasksReached(
  name: string,
  scripts: Readonly<Record<string, string>>,
  visited: ReadonlySet<string>,
): readonly string[] {
  const body = scripts[name];
  if (body === undefined || visited.has(name)) {
    return [];
  }
  const parsed = parseCheckLegs(body);
  const seen = new Set([...visited, name]);
  return [
    ...parsed.turboTasks,
    ...parsed.scripts.flatMap((nested) => turboTasksReached(nested, scripts, seen)),
  ];
}

/** Read one `&&` segment of `check` as a leg, refusing any segment that is not `pnpm <script>`. */
function readLeg(
  segment: string,
  scripts: Readonly<Record<string, string>>,
): Result<CheckLeg, Error> {
  const parsed = parseCheckLegs(segment);
  const name = parsed.scripts.length === 1 ? parsed.scripts[0] : undefined;
  if (parsed.turboTasks.length > 0 || name === undefined) {
    return err(
      new Error(
        `the check segment "${segment.trim()}" is not a pnpm <script> leg, so no start line marks it`,
      ),
    );
  }
  const body = scripts[name];
  if (body === undefined) {
    return err(
      new Error(`the check script runs pnpm ${name}, which the root manifest does not define`),
    );
  }
  return ok({
    name,
    startLine: `$ ${body}`,
    turboTasks: turboTasksReached(name, scripts, new Set()),
  });
}

/**
 * Read the `check` script's legs from the root manifest's scripts.
 *
 * @param scripts - The root `package.json` scripts.
 * @returns The legs in chain order, or an error when `check` is missing, or a
 *   segment of it is not `pnpm <script>` (a direct turbo or node call prints no
 *   leg start line, and dropping it would blame its failure on the leg before),
 *   or names a script the manifest does not define.
 */
export function readCheckLegs(
  scripts: Readonly<Record<string, string>>,
): Result<readonly CheckLeg[], Error> {
  const check = scripts.check;
  if (check === undefined) {
    return err(new Error('the root manifest has no check script'));
  }
  const legs: CheckLeg[] = [];
  for (const segment of check.split('&&')) {
    const leg = readLeg(segment, scripts);
    if (!leg.ok) {
      return leg;
    }
    legs.push(leg.value);
  }
  return ok(legs);
}

/**
 * The legs whose start line appears as a whole line of the output, in chain
 * order. Colour sequences are stripped first, since forced colour dims each
 * start line. Line order is not relied on, so a transcript whose streams were
 * captured separately reads the same.
 */
export function startedLegs(output: string, legs: readonly CheckLeg[]): readonly CheckLeg[] {
  const lines = new Set(output.replaceAll(SGR_SEQUENCE, '').split(/\r?\n/u));
  return legs.filter((leg) => lines.has(leg.startLine));
}

/** The last leg in chain order that started, or `undefined` when none did. */
export function lastStartedLeg(output: string, legs: readonly CheckLeg[]): CheckLeg | undefined {
  return startedLegs(output, legs).at(-1);
}
