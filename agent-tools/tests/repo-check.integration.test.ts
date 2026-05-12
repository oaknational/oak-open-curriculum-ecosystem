import { describe, expect, it } from 'vitest';

import {
  runMarkdownlintStaged,
  runPrettierStaged,
  type RepoCheckRuntime,
} from '../scripts/repo-check';

interface CommandCall {
  readonly command: string;
  readonly args: readonly string[];
}

function stagedRuntime(input: {
  readonly stagedStdout: string;
  readonly inheritedExitCode?: number;
}): {
  readonly capturedCalls: readonly CommandCall[];
  readonly inheritedCalls: readonly CommandCall[];
  readonly runtime: RepoCheckRuntime;
} {
  const capturedCalls: CommandCall[] = [];
  const inheritedCalls: CommandCall[] = [];

  return {
    capturedCalls,
    inheritedCalls,
    runtime: {
      runCaptured(command, args) {
        capturedCalls.push({ command, args });
        return { status: 0, stdout: input.stagedStdout, stderr: '' };
      },
      runInherited(command, args) {
        inheritedCalls.push({ command, args });
        return Promise.resolve(input.inheritedExitCode ?? 0);
      },
    },
  };
}

describe('repo-check staged scanners', () => {
  it('runs Prettier only on cached staged paths so unrelated ambient files are ignored', async () => {
    const ambientDirtyFile = 'docs/ambient-dirty.md';
    const { capturedCalls, inheritedCalls, runtime } = stagedRuntime({
      stagedStdout: 'docs/staged-clean.md\nagent-tools/scripts/repo-check.ts\n',
    });

    await expect(runPrettierStaged(runtime)).resolves.toBe(0);

    expect(capturedCalls).toStrictEqual([
      {
        command: 'git',
        args: ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
      },
    ]);
    expect(inheritedCalls).toStrictEqual([
      {
        command: 'pnpm',
        args: [
          'exec',
          'prettier',
          '--check',
          '--ignore-unknown',
          'docs/staged-clean.md',
          'agent-tools/scripts/repo-check.ts',
        ],
      },
    ]);
    expect(inheritedCalls[0]?.args).not.toContain(ambientDirtyFile);
  });

  it('does not run Prettier when no files are staged', async () => {
    const { inheritedCalls, runtime } = stagedRuntime({ stagedStdout: '' });

    await expect(runPrettierStaged(runtime)).resolves.toBe(0);

    expect(inheritedCalls).toStrictEqual([]);
  });

  it('propagates Prettier failures only for staged formatting violations', async () => {
    const ambientDirtyFile = 'docs/ambient-dirty.md';
    const { inheritedCalls, runtime } = stagedRuntime({
      stagedStdout: 'docs/staged-bad.md\n',
      inheritedExitCode: 1,
    });

    await expect(runPrettierStaged(runtime)).resolves.toBe(1);

    expect(inheritedCalls).toStrictEqual([
      {
        command: 'pnpm',
        args: ['exec', 'prettier', '--check', '--ignore-unknown', 'docs/staged-bad.md'],
      },
    ]);
    expect(inheritedCalls[0]?.args).not.toContain(ambientDirtyFile);
  });

  it('runs Markdownlint only on cached staged Markdown paths', async () => {
    const ambientDirtyFile = 'docs/ambient-dirty.md';
    const { capturedCalls, inheritedCalls, runtime } = stagedRuntime({
      stagedStdout: 'docs/staged-clean.md\nagent-tools/scripts/repo-check.ts\n',
    });

    await expect(runMarkdownlintStaged(runtime)).resolves.toBe(0);

    expect(capturedCalls).toStrictEqual([
      {
        command: 'git',
        args: ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
      },
    ]);
    expect(inheritedCalls).toStrictEqual([
      {
        command: 'pnpm',
        args: ['exec', 'markdownlint', '--dot', 'docs/staged-clean.md'],
      },
    ]);
    expect(inheritedCalls[0]?.args).not.toContain(ambientDirtyFile);
  });

  it('does not run Markdownlint when only non-Markdown files are staged', async () => {
    const { inheritedCalls, runtime } = stagedRuntime({
      stagedStdout: 'agent-tools/scripts/repo-check.ts\n',
    });

    await expect(runMarkdownlintStaged(runtime)).resolves.toBe(0);

    expect(inheritedCalls).toStrictEqual([]);
  });

  it('propagates Markdownlint failures only for staged Markdown violations', async () => {
    const ambientDirtyFile = 'docs/ambient-dirty.md';
    const { inheritedCalls, runtime } = stagedRuntime({
      stagedStdout: 'docs/staged-bad.md\n',
      inheritedExitCode: 1,
    });

    await expect(runMarkdownlintStaged(runtime)).resolves.toBe(1);

    expect(inheritedCalls).toStrictEqual([
      {
        command: 'pnpm',
        args: ['exec', 'markdownlint', '--dot', 'docs/staged-bad.md'],
      },
    ]);
    expect(inheritedCalls[0]?.args).not.toContain(ambientDirtyFile);
  });
});
