import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { FoldClockReading } from './fold-clock.js';
import {
  runFoldClockCli,
  type FoldClockCliInput,
  type FoldClockReadInput,
} from './fold-clock-cli.js';

/**
 * CLI behaviour for `coordination fold-clock` with an injected reader — no
 * gh, no network. Success prints exactly one line; every failure leaves
 * stdout empty so a seat can paste the output into a ledger row verbatim.
 */

const HEAD = '6c340d864683792c36e12fb43f71cddafac58bbb';

const reading: FoldClockReading = {
  prNumber: 326,
  headSha: HEAD,
  createdAt: '2026-10-09T13:34:15Z',
  readyMarks: ['2026-10-10T11:18:20Z'],
  mergedAt: '2026-10-10T11:33:09Z',
  requests: [{ at: '2026-10-10T11:18:35Z', login: 'Copilot' }],
  reviews: [{ at: '2026-10-10T11:22:45Z', login: 'Copilot' }],
  requiredChecks: ['CodeQL'],
  headCheckRuns: [
    {
      name: 'CodeQL',
      conclusion: 'success',
      startedAt: '2026-10-10T11:29:33Z',
      completedAt: '2026-10-10T11:29:35Z',
    },
  ],
  successor: undefined,
};

class Sink {
  public text = '';
  public write(chunk: string): boolean {
    this.text += chunk;
    return true;
  }
}

function run(
  args: readonly string[],
  overrides: Partial<FoldClockCliInput> = {},
): { exit: number; stdout: Sink; stderr: Sink; reads: FoldClockReadInput[] } {
  const stdout = new Sink();
  const stderr = new Sink();
  const reads: FoldClockReadInput[] = [];
  const exit = runFoldClockCli({
    args,
    stdout,
    stderr,
    readReading: (input) => {
      reads.push(input);
      return ok(reading);
    },
    ...overrides,
  });
  return { exit, stdout, stderr, reads };
}

describe('runFoldClockCli', () => {
  it('prints the one clock line for --pr and nothing on stderr', () => {
    const { exit, stdout, stderr, reads } = run(['--pr', '326']);

    expect(exit).toBe(0);
    expect(stdout.text).toBe(
      'fold-clock PR 326 tip 6c340d86: ready 2026-10-10T11:18:20Z; checks green +11.3 min; ' +
        'rounds 1 (Copilot 4.2 min); merged +14.8 min\n',
    );
    expect(stderr.text).toBe('');
    expect(reads).toStrictEqual([{ target: { number: 326, repo: undefined } }]);
  });

  it('passes --repo, --successor and --gh through to the reader', () => {
    const { exit, reads } = run([
      '--pr',
      '326',
      '--repo',
      'acme/widgets',
      '--successor',
      'fa74b727',
      '--gh',
      '/custom/bin/gh',
    ]);

    expect(exit).toBe(0);
    expect(reads).toStrictEqual([
      {
        target: { number: 326, repo: 'acme/widgets' },
        successorSha: 'fa74b727',
        ghPath: '/custom/bin/gh',
      },
    ]);
  });

  it('prints the clock as JSON with --json', () => {
    const { exit, stdout } = run(['--pr', '326', '--json']);

    expect(exit).toBe(0);
    const parsed: unknown = JSON.parse(stdout.text);
    expect(parsed).toMatchObject({
      prNumber: 326,
      readyToMergeMinutes: 14.8,
      checksGreenAt: '2026-10-10T11:29:35Z',
    });
  });

  it('prints usage on --help and -h without reading anything', () => {
    const help = run(['--help']);
    const alias = run(['-h', '--pr', '326']);

    expect(help.exit).toBe(0);
    expect(help.stdout.text).toContain('fold-clock --pr <n>');
    expect(help.reads).toHaveLength(0);
    expect(alias.stdout.text).toBe(help.stdout.text);
    expect(alias.reads).toHaveLength(0);
  });

  it('requires --pr, with usage on stderr, exit 2 and an empty stdout', () => {
    const { exit, stdout, stderr, reads } = run([]);

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain('--pr <n> is required');
    expect(reads).toHaveLength(0);
  });

  it('refuses a bad pull request identifier, repository, successor, option, value or positional', () => {
    const cases: readonly [readonly string[], string][] = [
      [['--pr', 'abc'], 'Invalid PR identifier'],
      [['--pr', '326', '--repo', 'acme'], 'Invalid --repo'],
      [['--pr', '326', '--successor', 'coordination/x'], '--successor must be a commit sha'],
      [['--pr', '326', '--base', 'main'], 'unknown option: --base'],
      [['--pr'], '--pr requires a value'],
      [['--pr', '326', 'extra'], 'unexpected argument: extra'],
    ];
    for (const [args, message] of cases) {
      const { exit, stdout, stderr, reads } = run(args);
      expect(exit, args.join(' ')).toBe(2);
      expect(stdout.text, args.join(' ')).toBe('');
      expect(stderr.text, args.join(' ')).toContain(message);
      expect(reads, args.join(' ')).toHaveLength(0);
    }
  });

  it('reports a reading failure by its message with exit 2 and an empty stdout', () => {
    const { exit, stdout, stderr } = run(['--pr', '326'], {
      readReading: () => err(new Error('fold-clock: gh issue timeline failed: non-JSON output')),
    });

    expect(exit).toBe(2);
    expect(stdout.text).toBe('');
    expect(stderr.text).toContain('gh issue timeline failed');
  });
});
