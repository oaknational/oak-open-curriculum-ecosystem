import { describe, expect, it } from 'vitest';

import type { BranchArgSeams } from './branch-arg.js';
import { parsePullRequestArgs } from './pull-request-args.js';
import { failureMessage } from './test-helpers/result-failure.js';

/**
 * The `merge-bot pull-request` argv contract: a closed grammar of seven verbs,
 * each with its own closed flag set. Pure parsing over an injected ref-format
 * oracle (a constant answer), so no git binary is asked. What is proven: each
 * verb's full flag line parses to its typed request; every other shape — an
 * unknown verb or flag, a missing or repeated flag, a value outside its
 * grammar — is a refusal that names what was expected.
 */

const everyNameLegal: BranchArgSeams = { refFormatOracle: () => true };

function parse(argv: readonly string[]): ReturnType<typeof parsePullRequestArgs> {
  return parsePullRequestArgs(argv, everyNameLegal);
}

function refusal(argv: readonly string[]): string {
  const result = parse(argv);
  expect(result.ok).toBe(false);
  return failureMessage(result);
}

describe('parsePullRequestArgs', () => {
  it.each([
    {
      argv: [
        'open',
        '--branch',
        'feat/x',
        '--title',
        'feat: x',
        '--body-file',
        '/srv/repo/.agent/state/body.md',
        '--wip-limit',
        '4',
      ],
      request: {
        verb: 'open',
        branch: 'feat/x',
        title: 'feat: x',
        bodyFile: '/srv/repo/.agent/state/body.md',
        wipLimit: 4,
        json: false,
      },
    },
    {
      argv: ['comment', '--pr', '42', '--body-file', 'b.md', '--json'],
      request: { verb: 'comment', pr: 42, bodyFile: 'b.md', json: true },
    },
    {
      argv: ['reply', '--pr', '42', '--comment', '9001', '--body-file', 'b.md'],
      request: { verb: 'reply', pr: 42, comment: 9001, bodyFile: 'b.md', json: false },
    },
    {
      argv: ['resolve', '--pr', '42', '--thread', 'PRRT_kwDOAbc123-_='],
      request: { verb: 'resolve', pr: 42, thread: 'PRRT_kwDOAbc123-_=', json: false },
    },
    {
      argv: ['ready', '--json', '--pr', '42'],
      request: { verb: 'ready', pr: 42, json: true },
    },
    {
      argv: ['close', '--pr', '42', '--reason-file', 'why.md'],
      request: { verb: 'close', pr: 42, reasonFile: 'why.md', json: false },
    },
    {
      argv: ['dispatch-workflow', '--workflow', 'upstream-carrier.yml', '--json'],
      request: { verb: 'dispatch-workflow', workflow: 'upstream-carrier.yml', json: true },
    },
  ])('parses the $request.verb verb to its typed request', ({ argv, request }) => {
    expect(parse(argv)).toEqual({ ok: true, value: request });
  });

  it('refuses no verb and an unknown verb, naming the verbs', () => {
    for (const argv of [[], ['merge'], ['--pr', '42']]) {
      const message = refusal(argv);
      expect(message).toContain('open');
      expect(message).toContain('close');
      expect(message).toContain('verb');
    }
    expect(refusal(['merge'])).toContain('"merge"');
  });

  it("refuses a flag the verb does not take, naming the flag and the verb's own flags", () => {
    const message = refusal(['ready', '--pr', '42', '--body-file', 'b.md']);

    expect(message).toContain('--body-file');
    expect(message).toContain('ready');
    expect(message).toContain('--pr');

    const dispatch = refusal(['dispatch-workflow', '--workflow', 'ci.yml', '--pr', '1']);
    expect(dispatch).toContain('--pr');
    expect(dispatch).toContain('--workflow');
  });

  it("admits any non-blank --workflow at the grammar: its shape is the verb's own refusal", () => {
    expect(parse(['dispatch-workflow', '--workflow', 'ci/x.yml']).ok).toBe(true);
    expect(refusal(['dispatch-workflow', '--workflow', ' '])).toContain('--workflow');
  });

  it('refuses a bare positional argument', () => {
    expect(refusal(['comment', '42', '--body-file', 'b.md'])).toContain('"42"');
  });

  it.each([
    { argv: ['open', '--title', 't', '--body-file', 'b', '--wip-limit', '2'], flag: '--branch' },
    { argv: ['open', '--branch', 'x', '--body-file', 'b', '--wip-limit', '2'], flag: '--title' },
    { argv: ['open', '--branch', 'x', '--title', 't', '--wip-limit', '2'], flag: '--body-file' },
    { argv: ['open', '--branch', 'x', '--title', 't', '--body-file', 'b'], flag: '--wip-limit' },
    { argv: ['comment', '--body-file', 'b'], flag: '--pr' },
    { argv: ['comment', '--pr', '1'], flag: '--body-file' },
    { argv: ['reply', '--pr', '1', '--body-file', 'b'], flag: '--comment' },
    { argv: ['resolve', '--pr', '1'], flag: '--thread' },
    { argv: ['ready'], flag: '--pr' },
    { argv: ['close', '--pr', '1'], flag: '--reason-file' },
    { argv: ['dispatch-workflow'], flag: '--workflow' },
  ])('refuses $argv.0 without $flag, naming it as required', ({ argv, flag }) => {
    const message = refusal(argv);

    expect(message).toContain(flag);
    expect(message).toContain('required');
  });

  it('refuses a repeated flag rather than letting argv order pick the value', () => {
    expect(refusal(['ready', '--pr', '1', '--pr', '2'])).toContain('more than once');
    expect(refusal(['ready', '--pr', '1', '--json', '--json'])).toContain('more than once');
  });

  it('refuses a value flag with no value, or whose value reads as a flag', () => {
    expect(refusal(['ready', '--pr'])).toContain('--pr');
    expect(refusal(['comment', '--pr', '1', '--body-file', '--json'])).toContain('--body-file');
  });

  it.each(['0', '-1', '1.5', '42x', 'abc', '', '100000000000000000000000'])(
    'refuses --pr "%s": a pull request number is a positive integer',
    (value) => {
      const message = refusal(['ready', '--pr', value]);

      expect(message).toContain('--pr');
      expect(message).toContain('positive integer');
    },
  );

  it.each(['0', '7.0', 'latest'])('refuses --comment "%s" as not a positive integer', (value) => {
    const message = refusal(['reply', '--pr', '1', '--comment', value, '--body-file', 'b']);

    expect(message).toContain('--comment');
    expect(message).toContain('positive integer');
  });

  it.each(['0', '-3', 'none'])('refuses --wip-limit "%s" as not a positive integer', (value) => {
    const message = refusal([
      'open',
      '--branch',
      'x',
      '--title',
      't',
      '--body-file',
      'b',
      '--wip-limit',
      value,
    ]);

    expect(message).toContain('--wip-limit');
    expect(message).toContain('positive integer');
  });

  it("refuses a --branch git's ref grammar rejects, asking the oracle", () => {
    const result = parsePullRequestArgs(
      ['open', '--branch', 'feat/x', '--title', 't', '--body-file', 'b', '--wip-limit', '1'],
      { refFormatOracle: () => false },
    );

    expect(result.ok).toBe(false);
    expect(failureMessage(result)).toContain('--branch');
  });

  it('refuses a --branch outside ASCII letters, digits and . _ / -, which a URL would misread', () => {
    for (const branch of ['feat#1', 'feat%20x', 'feat?x', 'féat']) {
      const message = refusal([
        'open',
        '--branch',
        branch,
        '--title',
        't',
        '--body-file',
        'b',
        '--wip-limit',
        '1',
      ]);
      expect(message).toContain('--branch');
      expect(message).toContain('ASCII');
    }
  });

  it('refuses a --thread that is not a GraphQL node id', () => {
    for (const thread of ['', '-x', 'PRRT kwDO', 'id;drop', 'ünïcode']) {
      const message = refusal(['resolve', '--pr', '1', '--thread', thread]);
      expect(message).toContain('--thread');
      expect(message).toContain('node id');
    }
  });

  it('refuses an empty --title', () => {
    const message = refusal([
      'open',
      '--branch',
      'x',
      '--title',
      '  ',
      '--body-file',
      'b',
      '--wip-limit',
      '1',
    ]);

    expect(message).toContain('--title');
    expect(message).toContain('empty');
  });

  it('refuses an empty file path', () => {
    expect(refusal(['comment', '--pr', '1', '--body-file', ''])).toContain('--body-file');
    expect(refusal(['close', '--pr', '1', '--reason-file', ' '])).toContain('--reason-file');
  });

  it('echoes a refused value without its control and format characters', () => {
    const [line = ''] = refusal(['ready', '--pr', '4\u{1b}[2J\u{202e}2']).split('\n');

    expect(line).toContain('"4[2J2"');
    expect(line).not.toMatch(/[\p{Cc}\p{Cf}]/u);
  });

  it('appends the usage text to every refusal, so the grammar is in front of the reader', () => {
    for (const argv of [['wat'], ['ready', '--pr', 'x'], ['open', '--branch', 'feat/x']]) {
      const message = refusal(argv);
      expect(message).toContain('merge-bot pull-request <verb>');
      expect(message).toContain('Exit map');
    }
  });
});
