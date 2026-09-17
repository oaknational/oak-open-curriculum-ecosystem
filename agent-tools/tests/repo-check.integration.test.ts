import { randomUUID } from 'node:crypto';
import { join as pathJoin } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildCheckProfileArtifact,
  classifyCheckFailurePhase,
  profilePostTurboGateStatus,
  runKnipGate,
  runMarkdownlintStaged,
  runPrettierStaged,
  type RepoCheckRuntime,
} from '../src/repo-check/repo-check';
import { normaliseSpawnResult } from '../src/repo-check/repo-check-runtime';

interface CommandCall {
  readonly command: string;
  readonly args: readonly string[];
}

function stagedRuntime(input: {
  readonly stagedStdout: string;
  readonly lsFilesStdout?: string;
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
        const stdout = args[0] === 'ls-files' ? (input.lsFilesStdout ?? '') : input.stagedStdout;
        return { status: 0, signal: null, stdout, stderr: '' };
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
      stagedStdout: 'docs/staged-clean.md\nagent-tools/src/repo-check/repo-check.ts\n',
    });

    await expect(runPrettierStaged(runtime)).resolves.toBe(0);

    expect(capturedCalls).toStrictEqual([
      {
        command: 'git',
        args: ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
      },
      {
        command: 'git',
        args: ['ls-files', '--cached', '-s'],
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
          'agent-tools/src/repo-check/repo-check.ts',
        ],
      },
    ]);
    expect(inheritedCalls[0]?.args).not.toContain(ambientDirtyFile);
  });

  it('excludes staged symlink index entries from the Prettier run', async () => {
    const { inheritedCalls, runtime } = stagedRuntime({
      stagedStdout: 'docs/staged-clean.md\n.claude/skills/clerk\n',
      lsFilesStdout: '100644 aaaa 0\tdocs/staged-clean.md\n120000 bbbb 0\t.claude/skills/clerk\n',
    });

    await expect(runPrettierStaged(runtime)).resolves.toBe(0);

    expect(inheritedCalls[0]?.args).toContain('docs/staged-clean.md');
    expect(inheritedCalls[0]?.args).not.toContain('.claude/skills/clerk');
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
      stagedStdout: 'docs/staged-clean.md\nagent-tools/src/repo-check/repo-check.ts\n',
    });

    await expect(runMarkdownlintStaged(runtime)).resolves.toBe(0);

    expect(capturedCalls).toStrictEqual([
      {
        command: 'git',
        args: ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
      },
      {
        command: 'git',
        args: ['ls-files', '--cached', '-s'],
      },
    ]);
    expect(inheritedCalls).toStrictEqual([
      {
        command: 'pnpm',
        args: ['exec', 'markdownlint-cli2', '--no-globs', 'docs/staged-clean.md'],
      },
    ]);
    expect(inheritedCalls[0]?.args).not.toContain(ambientDirtyFile);
  });

  it('does not run Markdownlint when only non-Markdown files are staged', async () => {
    const { inheritedCalls, runtime } = stagedRuntime({
      stagedStdout: 'agent-tools/src/repo-check/repo-check.ts\n',
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
        args: ['exec', 'markdownlint-cli2', '--no-globs', 'docs/staged-bad.md'],
      },
    ]);
    expect(inheritedCalls[0]?.args).not.toContain(ambientDirtyFile);
  });
});

describe('repo-check knip gate', () => {
  function knipRuntime(input: {
    readonly status: number | null;
    readonly signal?: NodeJS.Signals | null;
    readonly stdout?: string;
    readonly stderr?: string;
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
          return {
            status: input.status,
            signal: input.signal ?? null,
            stdout: input.stdout ?? '',
            stderr: input.stderr ?? '',
          };
        },
        runInherited(command, args) {
          inheritedCalls.push({ command, args });
          return Promise.resolve(0);
        },
      },
    };
  }

  it('runs knip captured (never inherited) so crash signatures stay inspectable, passing a clean run through with exit 0', async () => {
    const { capturedCalls, inheritedCalls, runtime } = knipRuntime({
      status: 0,
      stdout: '✂️  Excellent!\n',
    });

    await expect(runKnipGate(runtime)).resolves.toBe(0);

    expect(capturedCalls).toStrictEqual([{ command: 'pnpm', args: ['exec', 'knip'] }]);
    expect(inheritedCalls).toStrictEqual([]);
  });

  it('propagates knip findings as the blocking exit code knip chose', async () => {
    const { runtime } = knipRuntime({ status: 1, stdout: 'Unused exports (2)\n' });

    await expect(runKnipGate(runtime)).resolves.toBe(1);
  });

  it('names a signal-killed knip child as a crash class, on the injected diagnostic channel', async () => {
    // The F-112 push-path instance (2026-08-07): the knip child died with a
    // null status and empty streams, and diagnosis written to stderr was
    // itself eaten by the poisoned chain. The crash-class line is therefore
    // injectable (assertable without global spies) and stdout-bound by
    // default — the stream that survived.
    const lines: string[] = [];
    const { runtime } = knipRuntime({ status: null, signal: 'SIGTERM' });

    await expect(runKnipGate(runtime, (line) => lines.push(line))).resolves.toBe(1);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('died without a verdict');
    expect(lines[0]).toContain('status=null');
    expect(lines[0]).toContain('signal=SIGTERM');
  });

  it('names a signal-killed knip child even when it spoke first — a partial verdict is not a verdict', async () => {
    // The realistic kill: knip prints a progress line, then the poisoned
    // chain (or the OOM killer) takes it. The null status alone must fire
    // the crash line; this is the test the `status !== null` conjunct bites.
    const lines: string[] = [];
    const { runtime } = knipRuntime({
      status: null,
      signal: 'SIGKILL',
      stdout: 'partial verdict\n',
    });

    await expect(runKnipGate(runtime, (line) => lines.push(line))).resolves.toBe(1);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('signal=SIGKILL');
  });

  it('names an empty-output non-zero run as a crash class — knip always prints a verdict', async () => {
    const lines: string[] = [];
    const { runtime } = knipRuntime({ status: 1 });

    await expect(runKnipGate(runtime, (line) => lines.push(line))).resolves.toBe(1);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('died without a verdict');
  });

  it('keeps real findings off the crash-class channel — a spoken verdict is not a crash', async () => {
    const lines: string[] = [];
    const { runtime } = knipRuntime({ status: 1, stdout: 'Unused exports (2)\n' });

    await expect(runKnipGate(runtime, (line) => lines.push(line))).resolves.toBe(1);

    expect(lines).toStrictEqual([]);
  });

  it('fails loudly when knip exits 0 after swallowing a config-load crash (F-147)', async () => {
    const { runtime } = knipRuntime({
      status: 0,
      stderr:
        'ERROR: Error loading apps/oak-search-cli/vitest.smoke.config.ts ' +
        '(No "exports" main defined in apps/oak-search-cli/node_modules/@oaknational/env-resolution/package.json)\n',
    });

    await expect(runKnipGate(runtime)).resolves.toBe(1);
  });

  it('detects the swallowed-crash signature through ANSI colour codes', async () => {
    const { runtime } = knipRuntime({
      status: 0,
      stderr: '\u001b[31mERROR\u001b[39m: Error loading packages/foo/vitest.config.ts (boom)\n',
    });

    await expect(runKnipGate(runtime)).resolves.toBe(1);
  });

  it('surfaces a spawn launch failure as a diagnosable non-zero result, never null streams', () => {
    // spawnSync sets `error` with null status and null streams when the
    // resolved binary cannot launch; downstream stream reads must see
    // strings and the failure message, not a TypeError.
    const result = normaliseSpawnResult('pnpm', {
      pid: 0,
      output: [],
      stdout: null,
      stderr: null,
      status: null,
      signal: null,
      error: new Error('spawn EACCES'),
    });

    expect(result.status).toBe(1);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('pnpm: spawn EACCES');
  });

  it('passes an unrelated ERROR line on a zero exit — only the load-crash signature reds the gate', async () => {
    // A successfully loaded config or dependency may emit its own
    // ERROR-prefixed output; that is not the F-147 swallowed crash and must
    // stay a clean pass, never a false-red gate.
    const { runtime } = knipRuntime({
      status: 0,
      stderr: 'ERROR: deprecation notice from a loaded plugin\n',
    });

    await expect(runKnipGate(runtime)).resolves.toBe(0);
  });
});

describe('repo-check profile artifact helpers', () => {
  // Fixture path strings — never touched on disk, but computed with a synthetic
  // namespace so Sonar does not classify them as publicly writable paths.
  const environment = {
    nodeVersion: 'v24.15.0',
    platform: 'darwin',
    arch: 'arm64',
    pnpmStorePath: pathJoin('__profile-fixtures__', `pnpm-store-${randomUUID()}`),
    playwrightBrowserCachePath: pathJoin('__profile-fixtures__', `ms-playwright-${randomUUID()}`),
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
