import { describe, expect, it } from 'vitest';

import {
  exitCodeFor,
  renderPullRequestOutcome,
  type PullRequestOutcome,
} from './pull-request-report.js';

/**
 * The pull-request outcome as the two streams carry it. Pure: an outcome in,
 * the text for stdout and stderr out. `--json` puts exactly the outcome
 * object on stdout; a refusal always reaches stderr.
 */

/** Each write that landed, with the value its line must name. */
const DONE: readonly { readonly outcome: PullRequestOutcome; readonly names: string }[] = [
  {
    outcome: { kind: 'opened', number: 42, url: 'https://github.com/acme/widgets/pull/42' },
    names: '#42',
  },
  {
    outcome: { kind: 'commented', pr: 42, commentId: 9001, url: 'https://x/pull/42#i' },
    names: '9001',
  },
  {
    outcome: { kind: 'replied', pr: 42, commentId: 9002, url: 'https://x/pull/42#r' },
    names: '9002',
  },
  { outcome: { kind: 'resolved', pr: 42, thread: 'PRRT_kwDOAbc' }, names: 'PRRT_kwDOAbc' },
  { outcome: { kind: 'ready', pr: 42 }, names: '#42' },
  { outcome: { kind: 'closed', pr: 42, commentId: 9003 }, names: '9003' },
  {
    outcome: { kind: 'dispatched', workflow: 'upstream-carrier.yml', ref: 'trunk' },
    names: 'upstream-carrier.yml on trunk',
  },
];

const REFUSED: PullRequestOutcome = { kind: 'refused', reason: '#42 is not a draft' };

describe('renderPullRequestOutcome', () => {
  it.each(DONE)(
    'renders exactly the $outcome.kind object on stdout under --json',
    ({ outcome }) => {
      const rendered = renderPullRequestOutcome(outcome, true);

      expect(JSON.parse(rendered.stdout)).toEqual(outcome);
      expect(rendered.stderr).toBe('');
    },
  );

  it.each(DONE)(
    'renders a $outcome.kind line on stdout alone, naming what landed',
    ({ outcome, names }) => {
      const rendered = renderPullRequestOutcome(outcome, false);

      expect(rendered.stdout).toContain(`${outcome.kind}:`);
      expect(rendered.stdout).toContain(names);
      expect(rendered.stderr).toBe('');
    },
  );

  it('renders a refusal on stderr, and under --json the object on stdout too', () => {
    const plain = renderPullRequestOutcome(REFUSED, false);
    const json = renderPullRequestOutcome(REFUSED, true);

    expect(plain.stdout).toBe('');
    expect(plain.stderr).toContain('refused: #42 is not a draft');
    expect(JSON.parse(json.stdout)).toEqual(REFUSED);
    expect(json.stderr).toContain('refused');
  });
});

describe('exitCodeFor', () => {
  it.each(DONE)('maps $outcome.kind to 0', ({ outcome }) => {
    expect(exitCodeFor(outcome)).toBe(0);
  });

  it('maps a refusal to 3', () => {
    expect(exitCodeFor(REFUSED)).toBe(3);
  });
});
