/**
 * Integration tests for the tracked gates' process edge, through a literal
 * runtime: git's answers are stubbed by the read asked for, the tool runs
 * answer with scripted exit statuses, and each test asserts the gate's own
 * exit status only (never which calls were made).
 */
import { describe, expect, it } from 'vitest';

import { runMarkdownlintTracked, runPrettierTracked } from './repo-check-gates.js';
import type { RepoCheckCommandResult, RepoCheckRuntime } from './repo-check-types.js';

const passed = (stdout: string): RepoCheckCommandResult => ({
  status: 0,
  signal: null,
  stdout,
  stderr: '',
});

/**
 * A runtime whose git reads answer from the listings (`gone` is the unstaged
 * deletions, `stage` the index modes) and whose tool runs exit with `statuses`
 * in turn, or through `host` when given.
 */
function runtimeOver(input: {
  readonly tracked: RepoCheckCommandResult;
  readonly gone?: string;
  readonly stage?: string;
  readonly statuses?: readonly number[];
  readonly host?: (args: readonly string[]) => number;
}): RepoCheckRuntime {
  const statuses = [...(input.statuses ?? [])];
  return {
    runCaptured: (_command, args) => {
      if (args.includes('-s')) {
        return passed(input.stage ?? '');
      }
      return args[0] === 'diff-files' ? passed(input.gone ?? '') : input.tracked;
    },
    runInherited: (_command, args) => Promise.resolve(input.host?.(args) ?? statuses.shift() ?? 0),
  };
}

/** A NUL-separated listing of `count` Markdown paths of about a hundred bytes each. */
function largeListing(count: number): string {
  return Array.from(
    { length: count },
    (_, index) => `docs/${String(index).padStart(90, '0')}.md\u0000`,
  ).join('');
}

/**
 * A Windows host: a command line holds 32,767 UTF-16 units, Node quotes an
 * argument holding a space, and 1,024 units stand for the Node binary and the
 * pnpm entry ahead of the arguments. A run over the limit fails to launch.
 */
function windowsHost(args: readonly string[]): number {
  const units = args.reduce((sum, arg) => sum + arg.length + 1 + (/\s/u.test(arg) ? 2 : 0), 1024);
  return units > 32_767 ? 1 : 0;
}

describe('the tracked gates', () => {
  it('fail when git cannot list the tracked tree, whatever the tools would say', async () => {
    const broken = runtimeOver({
      tracked: { status: 128, signal: null, stdout: '', stderr: 'fatal: not a git repository' },
    });
    await expect(runPrettierTracked('check', broken)).resolves.toBe(1);
    await expect(runMarkdownlintTracked('check', broken)).resolves.toBe(1);
  });

  it('fail when git lists no tracked file, rather than pass having checked nothing', async () => {
    const empty = runtimeOver({ tracked: passed('') });
    await expect(runPrettierTracked('check', empty)).resolves.toBe(1);
  });

  it('fail when any chunk of a large tree fails, and pass when every chunk passes', async () => {
    // Six thousand hundred-byte paths overflow a POSIX host's budget into three runs.
    const listing = passed(largeListing(6000));
    await expect(
      runMarkdownlintTracked(
        'check',
        runtimeOver({ tracked: listing, statuses: [0, 1, 0] }),
        'linux',
      ),
    ).resolves.toBe(1);
    await expect(
      runMarkdownlintTracked(
        'check',
        runtimeOver({ tracked: listing, statuses: [0, 0, 0] }),
        'linux',
      ),
    ).resolves.toBe(0);
  });

  it('fit every run to the command line of a Windows host, so a large tree still passes there', async () => {
    const spaced = Array.from({ length: 3000 }, (_, index) => `docs/${index} a name.md\u0000`);
    const listing = passed(spaced.join(''));
    await expect(
      runPrettierTracked('check', runtimeOver({ tracked: listing, host: windowsHost }), 'win32'),
    ).resolves.toBe(0);
    await expect(
      runMarkdownlintTracked(
        'check',
        runtimeOver({ tracked: listing, host: windowsHost }),
        'win32',
      ),
    ).resolves.toBe(0);
  });

  it('refuse a check over a tracked file gone from the working tree with the change unstaged', async () => {
    // `git add bad.md; rm bad.md`: the index, and so a commit and CI, still carry bad.md.
    const lost = (): RepoCheckRuntime =>
      runtimeOver({ tracked: passed('a.md\u0000bad.md\u0000'), gone: 'bad.md\u0000' });
    await expect(runPrettierTracked('check', lost())).resolves.toBe(1);
    await expect(runMarkdownlintTracked('check', lost())).resolves.toBe(1);
    await expect(runPrettierTracked('write', lost())).resolves.toBe(0);
    await expect(runMarkdownlintTracked('fix', lost())).resolves.toBe(0);
  });

  it('check on past a lost file the gate never reads: a symlink entry, or a non-Markdown file for markdownlint', async () => {
    const lostLink = runtimeOver({
      tracked: passed('a.md\u0000link.md\u0000'),
      gone: 'link.md\u0000',
      stage: '100644 aaaa 0\ta.md\u0000120000 bbbb 0\tlink.md\u0000',
    });
    await expect(runPrettierTracked('check', lostLink)).resolves.toBe(0);
    const lostCode = runtimeOver({ tracked: passed('a.md\u0000b.ts\u0000'), gone: 'b.ts\u0000' });
    await expect(runMarkdownlintTracked('check', lostCode)).resolves.toBe(0);
  });

  it('refuse a tracked Markdown path a glob reader would skip, rather than pass it unlinted', async () => {
    const globbed = runtimeOver({ tracked: passed('docs/a.md\u0000docs/[draft].md\u0000') });
    await expect(runMarkdownlintTracked('check', globbed)).resolves.toBe(1);
  });

  it('pass with nothing to run when the tree holds no file the gate reads', async () => {
    const noMarkdown = runtimeOver({ tracked: passed('src/a.ts\u0000') });
    await expect(runMarkdownlintTracked('check', noMarkdown)).resolves.toBe(0);
  });
});
