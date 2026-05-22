import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join as pathJoin } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildCheckProfileArtifact,
  classifyCheckFailurePhase,
  profilePostTurboGateStatus,
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

describe('repo-check profile artifact helpers', () => {
  // Fixture path strings — never touched on disk, but computed via tmpdir() +
  // randomUUID() so they avoid hard-coded publicly-writable directory literals
  // (SonarCloud S5443).
  const environment = {
    nodeVersion: 'v24.15.0',
    platform: 'darwin',
    arch: 'arm64',
    pnpmStorePath: pathJoin(tmpdir(), `pnpm-store-${randomUUID()}`),
    playwrightBrowserCachePath: pathJoin(tmpdir(), `ms-playwright-${randomUUID()}`),
    playwrightBrowserCacheExists: true,
    sandboxNote: 'sandbox evidence note',
  } as const;

  it('classifies macOS Chromium launch failures as environment failures', () => {
    expect(
      classifyCheckFailurePhase({
        exitCode: 1,
        output: 'browserType.launch failed: MachPortRendezvous permission denied',
      }),
    ).toBe('environment');
  });

  it('classifies Turbo task failures separately from post-Turbo gate failures', () => {
    expect(
      classifyCheckFailurePhase({
        exitCode: 1,
        output: 'Tasks: 87 successful, 88 total\nFailed: @oaknational/app#test:e2e',
      }),
    ).toBe('turbo-task');

    expect(
      classifyCheckFailurePhase({
        exitCode: 4,
        output: '> pnpm markdownlint-check:root\nError: ENOENT',
      }),
    ).toBe('post-turbo-gate');
  });

  it('records output log pointers, environment evidence, and post-Turbo status', () => {
    const artifact = buildCheckProfileArtifact({
      startedAt: '2026-05-12T07:31:30.160Z',
      finishedAt: '2026-05-12T07:33:57.773Z',
      durationMs: 147_613,
      exitCode: 0,
      turboDryGraph: '.logs/check-profiles/check-turbo-graph.json',
      environment,
      outputLog: '.logs/check-profiles/check-output.log',
      output: '> pnpm markdownlint-check:root\n> pnpm format-check:root\n',
    });

    expect(artifact).toStrictEqual({
      command: 'pnpm check',
      startedAt: '2026-05-12T07:31:30.160Z',
      finishedAt: '2026-05-12T07:33:57.773Z',
      durationMs: 147_613,
      exitCode: 0,
      turboDryGraph: '.logs/check-profiles/check-turbo-graph.json',
      environment,
      outputLog: '.logs/check-profiles/check-output.log',
      failurePhase: 'passed',
      postTurboGateStatus: 'ran',
    });
  });

  it('marks post-Turbo gates skipped when a captured Turbo failure exits first', () => {
    expect(
      profilePostTurboGateStatus({
        outputCaptured: true,
        failurePhase: 'turbo-task',
        output: 'Tasks: 87 successful, 88 total\nFailed: @oaknational/app#test:e2e',
      }),
    ).toBe('skipped-after-turbo-failure');
  });
});
