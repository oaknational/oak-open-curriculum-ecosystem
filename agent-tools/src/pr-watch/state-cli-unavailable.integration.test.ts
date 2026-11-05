import { describe, expect, it } from 'vitest';

import { NO_CONTENT } from './content-binding.js';
import { composeReading } from './state-compose.js';
import { runPrStateCli, type ReadReadingInput } from './state-cli.js';
import { parseStateView } from './state-fields.js';
import { stateViewFixture } from './state-view-fixture.js';

/**
 * `pr state --unavailable <login>=<comment-url>`: the declaration reaches the
 * reading with the bot's login and the verdict's clock, and the verdict reads
 * the stand-in, or refuses the declaration by name. The reading is composed
 * by the real composition over fixed harvests; only gh is absent.
 */

const HEAD = 'f'.repeat(40);
const COPILOT = 'copilot-pull-request-reviewer';
const URL = 'https://github.com/acme/widgets/pull/461#issuecomment-1';
const NOW = '2026-07-21T13:00:00Z';
const COPILOT_ERROR =
  'Copilot encountered an error and was unable to review this pull request. You can try again by re-requesting a review.';

function composed(readInput: ReadReadingInput) {
  return composeReading({
    view: parseStateView(stateViewFixture()),
    comments: [
      {
        id: 'IC_1',
        url: URL,
        author: 'el-graphael',
        body: `**${COPILOT} leg unavailable on head SHA:${HEAD}.**\n\nCopilot errored on this head.`,
        createdAt: '2026-07-21T12:00:00Z',
        lastEdit: null,
      },
    ],
    commits: [HEAD],
    reviewConfiguration: { kind: 'unread', reason: 'the test reading declares none' },
    requests: [],
    reviewThreads: { total: 0, unresolved: 0 },
    reviews: [
      {
        author: COPILOT,
        state: 'COMMENTED',
        body: COPILOT_ERROR,
        commitOid: HEAD,
        submittedAt: '2026-07-21T11:50:00Z',
      },
    ],
    reviewRuns: { kind: 'read', runs: [] },
    declared: readInput.expectedReviewers ?? null,
    unavailable: readInput.unavailable,
    readContent: () => NO_CONTENT,
  });
}

class Sink {
  public text = '';
  public write(chunk: string): boolean {
    this.text += chunk;
    return true;
  }
}

function run(args: readonly string[], poster: () => string) {
  const stdout = new Sink();
  const stderr = new Sink();
  const exit = runPrStateCli({
    args: ['state', '461', '--expect', COPILOT, ...args],
    stdout,
    stderr,
    now: () => NOW,
    readReading: composed,
    poster,
  });
  return { exit, stdout: stdout.text, stderr: stderr.text };
}

function noConfig(): string {
  throw new Error('merge-bot config not readable at .github/merge-bot.json');
}

describe('pr state --unavailable', () => {
  it("settles on the bot's declaration after the vendor's error review, naming the stand-in", () => {
    const { exit, stdout } = run(['--unavailable', `${COPILOT}=${URL}`], () => 'el-graphael');

    expect(exit).toBe(0);
    expect(stdout).toContain('PR #461 SETTLE-READY');
    expect(stdout).toContain(
      `${COPILOT}: declared unavailable at 2026-07-21T12:00:00Z by ${URL} (proof: error-review at 2026-07-21T11:50:00Z) read as a review of the tip (transport: declared-stand-in)`,
    );
  });

  it('refuses at once a declaration another account posted', () => {
    const { exit, stdout } = run(['--unavailable', `${COPILOT}=${URL}`], () => 'another-bot');

    expect(exit).toBe(0);
    expect(stdout).toContain('PR #461 UNCLASSIFIED-EVIDENCE');
    expect(stdout).toContain(
      `${COPILOT}: unavailability declaration ${URL} refused — was posted by an account other than the bot`,
    );
  });

  it('reads no declaration, and asks for no bot login, without the flag', () => {
    const { exit, stdout } = run([], noConfig);

    expect(exit).toBe(0);
    // With no stand-in, the error review leaves the Copilot leg waiting.
    expect(stdout).toContain('PR #461 SILENT-WAIT-NO-REVIEWER');
  });

  it("exits 2 naming the cause when the bot's login cannot be read", () => {
    const { exit, stderr } = run(['--unavailable', `${COPILOT}=${URL}`], noConfig);

    expect(exit).toBe(2);
    expect(stderr).toContain('merge-bot config not readable at .github/merge-bot.json');
  });
});
