import { describe, expect, it } from 'vitest';

import {
  EXIT_FAILURE,
  EXIT_OK,
  EXIT_REFUSED,
  EXIT_USAGE,
  runPushShape,
  VERDICT_DELETIONS_ONLY,
  VERDICT_RUN_GATES,
} from './push-shape.js';

const ZERO = '0'.repeat(40);
const LOCAL = 'a'.repeat(40);
const REMOTE = 'b'.repeat(40);
const DELETION = `(delete) ${ZERO} refs/heads/gone ${REMOTE}`;
const UPDATE = `refs/heads/lane ${LOCAL} refs/heads/lane ${REMOTE}`;

interface Outcome {
  readonly exitCode: number;
  /** Every verdict word written to stdout, in order. */
  readonly verdicts: readonly string[];
  /** Everything written for a person. */
  readonly explained: string;
}

/** Run the command with the given argv and file reader, collecting what it writes. */
function run(argv: readonly string[], readFile: (path: string) => string): Outcome {
  const verdicts: string[] = [];
  const explained: string[] = [];
  const exitCode = runPushShape(argv, readFile, {
    verdict: (word) => verdicts.push(word),
    explain: (text) => explained.push(text),
  });
  return { exitCode, verdicts, explained: explained.join('') };
}

/** Run the command over one refs file's text. */
const runOver = (refsText: string): Outcome => run(['--refs-file', '/refs'], () => refsText);

describe('runPushShape', () => {
  it('tells the hook to run its gates for a push that sends commits', () => {
    expect(runOver(UPDATE)).toStrictEqual({
      exitCode: EXIT_OK,
      verdicts: [VERDICT_RUN_GATES],
      explained: '',
    });
  });

  it('tells the hook to run its gates when git supplied no ref lines', () => {
    expect(runOver('')).toStrictEqual({
      exitCode: EXIT_OK,
      verdicts: [VERDICT_RUN_GATES],
      explained: '',
    });
  });

  it('tells the hook a deletions-only push has nothing to check, and says why', () => {
    const outcome = runOver(`${DELETION}\n`);
    expect(outcome.exitCode).toBe(EXIT_OK);
    expect(outcome.verdicts).toStrictEqual([VERDICT_DELETIONS_ONLY]);
    expect(outcome.explained).toContain('deletes refs and sends no commits');
  });

  it('refuses a push that mixes a deletion with commits, naming the rule and the cure', () => {
    const outcome = runOver(`${DELETION}\n${UPDATE}\n`);
    expect(outcome.exitCode).toBe(EXIT_REFUSED);
    expect(outcome.verdicts).toStrictEqual([]);
    expect(outcome.explained).toContain('deletions-never-ride-a-push');
    expect(outcome.explained).toContain('two pushes');
  });

  // The hook waives its gates on the deletions-only verdict alone, so a run
  // that cannot read the refs must stop the push and write no verdict.
  it('stops the push, with no verdict, when the refs file cannot be read', () => {
    const outcome = run(['--refs-file', '/missing'], () => {
      throw new Error('ENOENT');
    });
    expect(outcome.exitCode).toBe(EXIT_FAILURE);
    expect(outcome.verdicts).toStrictEqual([]);
    expect(outcome.explained).toContain('/missing');
  });

  it('refuses a call that names no refs file, with no verdict', () => {
    const outcome = run([], () => DELETION);
    expect(outcome.exitCode).toBe(EXIT_USAGE);
    expect(outcome.verdicts).toStrictEqual([]);
    expect(outcome.explained).toContain('--refs-file');
  });

  it('keeps the exit map of the estate: 0 ok, 1 failure, 2 usage, 3 refusal', () => {
    expect([EXIT_OK, EXIT_FAILURE, EXIT_USAGE, EXIT_REFUSED]).toStrictEqual([0, 1, 2, 3]);
  });
});
