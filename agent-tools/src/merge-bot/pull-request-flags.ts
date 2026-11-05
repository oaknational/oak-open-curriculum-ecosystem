import { err, ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import { isUrlSafeBranchName, readBranchArg, type BranchArgSeams } from './branch-arg.js';
import { VALUE_FLAGS, type PullRequestVerb } from './pull-request-request.js';
import { PULL_REQUEST_USAGE } from './pull-request-usage.js';

/**
 * The flag layer of `merge-bot pull-request`'s grammar: the walk over a
 * verb's argv, and the value grammars a flag's text is read against (a
 * positive integer, a non-blank text, a GraphQL node id, a branch name).
 * Split from `pull-request-args.ts`, which assembles each verb's request
 * from these, at the size gate. Every refusal names what was expected and
 * carries the usage text.
 */

/** The flags read so far: each value flag's value, and whether `--json` was given. */
export interface Collected {
  readonly values: ReadonlyMap<string, string>;
  readonly json: boolean;
}

/** A refusal with the usage text appended, so the grammar is in front of the reader. */
export function usageError(message: string): Error {
  return new Error(`${message}\n${PULL_REQUEST_USAGE}`);
}

/** A value that reads as a flag is a forgotten argument, never a value anyone meant. */
function readsAsFlag(value: string): boolean {
  return value.startsWith('-');
}

/** One value flag's reading: an unknown flag, a repeat and a missing value each refuse. */
function readValue(
  verb: PullRequestVerb,
  flag: string,
  next: string | undefined,
  values: ReadonlyMap<string, string>,
): Result<string, Error> {
  const flags: readonly string[] = VALUE_FLAGS[verb];
  if (!flags.includes(flag)) {
    return err(
      usageError(
        `unknown argument "${printable(flag)}" for ${verb}; its flags are ${flags.join(', ')} and --json`,
      ),
    );
  }
  if (values.has(flag)) {
    return err(usageError(`${flag} given more than once — pass it exactly once`));
  }
  return next === undefined || readsAsFlag(next)
    ? err(usageError(`${flag} needs a value, got "${printable(next ?? '')}"`))
    : ok(next);
}

/** Walk the verb's argv: each flag once, each value flag with a value that is not a flag. */
export function collectFlags(
  verb: PullRequestVerb,
  rest: readonly string[],
): Result<Collected, Error> {
  const values = new Map<string, string>();
  let json = false;
  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index] ?? '';
    if (flag === '--json') {
      if (json) {
        return err(usageError('--json given more than once — pass it exactly once'));
      }
      json = true;
      continue;
    }
    const value = readValue(verb, flag, rest[index + 1], values);
    if (!value.ok) {
      return value;
    }
    values.set(flag, value.value);
    index += 1;
  }
  return ok({ values, json });
}

/** The value a required flag was given, or the refusal naming it. */
function required(collected: Collected, flag: string): Result<string, Error> {
  const value = collected.values.get(flag);
  return value === undefined ? err(usageError(`${flag} is required`)) : ok(value);
}

const POSITIVE_INTEGER = /^[1-9]\d*$/;

/** A positive integer flag: a pull request number, a comment id, a limit. */
export function positiveInteger(collected: Collected, flag: string): Result<number, Error> {
  const value = required(collected, flag);
  if (!value.ok) {
    return value;
  }
  const parsed = Number(value.value);
  return POSITIVE_INTEGER.test(value.value) && Number.isSafeInteger(parsed)
    ? ok(parsed)
    : err(usageError(`${flag} needs a positive integer, got "${printable(value.value)}"`));
}

/** A flag whose value is text that must not be blank: a title, a file path, a workflow name. */
export function nonBlank(collected: Collected, flag: string): Result<string, Error> {
  const value = required(collected, flag);
  if (!value.ok) {
    return value;
  }
  return value.value.trim() === '' ? err(usageError(`${flag} must not be empty`)) : value;
}

/** A GraphQL node id: the characters GitHub's ids are made of, and nothing else. */
const NODE_ID = /^[A-Za-z0-9_=-]+$/;

export function nodeId(collected: Collected, flag: string): Result<string, Error> {
  const value = required(collected, flag);
  if (!value.ok) {
    return value;
  }
  return NODE_ID.test(value.value)
    ? value
    : err(usageError(`${flag} needs a GraphQL node id, got "${printable(value.value)}"`));
}

/**
 * The branch to open from: legal by git's own ref grammar (the oracle), and
 * URL-safe on top, since the name travels in a REST path and a query.
 */
export function branchName(collected: Collected, seams: BranchArgSeams): Result<string, Error> {
  const value = required(collected, '--branch');
  if (!value.ok) {
    return value;
  }
  const legal = readBranchArg(undefined, value.value, seams, PULL_REQUEST_USAGE);
  if (!legal.ok) {
    return legal;
  }
  return isUrlSafeBranchName(legal.value)
    ? legal
    : err(
        usageError(
          `--branch "${printable(legal.value)}" holds characters outside ASCII letters, digits and . _ / -`,
        ),
      );
}
