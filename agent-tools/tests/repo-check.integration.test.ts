import { randomUUID } from 'node:crypto';
import { join as pathJoin } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildCheckProfileArtifact,
  classifyCheckFailurePhase,
  profilePostTurboGateStatus,
  runKnipGate,
  runMarkdownlintStaged,
  runMarkdownlintTracked,
  runPrettierStaged,
  runPrettierTracked,
  type RepoCheckRuntime,
} from '../src/repo-check/repo-check';
import { readCheckLegs } from '../src/repo-check/repo-check-check-legs';
import { normaliseSpawnResult } from '../src/repo-check/repo-check-runtime';
import { readTrackedTree } from '../src/repo-check/repo-check-universe';

interface CommandCall {
  readonly command: string;
  readonly args: readonly string[];
}

/**
 * git's `-z` record separator, built without a string escape: a `\\0` directly
 * before a digit would read as an octal escape, which the language forbids.
 */
const NUL = String.fromCharCode(0);

/** A captured git answer: what the fake returns for one exact argv. */
interface GitAnswer {
  readonly stdout?: string;
  readonly status?: number;
  readonly stderr?: string;
}

/**
 * A fake runtime whose git answers are a literal table keyed by the exact
 * argv the gates issue: the staged set, the tracked tree, and the index
 * entries with modes, all in git's `-z` (NUL-separated) form. A query the
 * table does not name answers nothing, so a mis-built argv is decided by the
 * `capturedCalls` assertion, never by the fake.
 */
function gateRuntime(input: {
  readonly staged?: GitAnswer;
  readonly tracked?: GitAnswer;
  readonly goneFromWorkingTree?: GitAnswer;
  readonly lsFiles?: GitAnswer;
  readonly inheritedExitCode?: number;
}): {
  readonly capturedCalls: readonly CommandCall[];
  readonly inheritedCalls: readonly CommandCall[];
  readonly runtime: RepoCheckRuntime;
} {
  const capturedCalls: CommandCall[] = [];
  const inheritedCalls: CommandCall[] = [];
  const answers: ReadonlyMap<string, GitAnswer> = new Map([
    ['diff --cached --name-only --diff-filter=ACMR -z', input.staged ?? {}],
    ['ls-files -z --deduplicate', input.tracked ?? {}],
    ['diff-files --name-only --diff-filter=DT -z', input.goneFromWorkingTree ?? {}],
    ['ls-files --cached -s -z', input.lsFiles ?? {}],
  ]);

  return {
    capturedCalls,
    inheritedCalls,
    runtime: {
      runCaptured(command, args) {
        capturedCalls.push({ command, args });
        const answer = answers.get(args.join(' ')) ?? {};
        return {
          status: answer.status ?? 0,
          signal: null,
          stdout: answer.stdout ?? '',
          stderr: answer.stderr ?? '',
        };
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
    const { capturedCalls, inheritedCalls, runtime } = gateRuntime({
      staged: { stdout: 'docs/staged-clean.md\0agent-tools/src/repo-check/repo-check.ts\0' },
    });

    await expect(runPrettierStaged(runtime)).resolves.toBe(0);

    expect(capturedCalls).toStrictEqual([
      {
        command: 'git',
        args: ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'],
      },
      {
        command: 'git',
        args: ['ls-files', '--cached', '-s', '-z'],
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
          '--',
          'docs/staged-clean.md',
          'agent-tools/src/repo-check/repo-check.ts',
        ],
      },
    ]);
  });

  it('excludes staged symlink index entries from the Prettier run', async () => {
    const { inheritedCalls, runtime } = gateRuntime({
      staged: { stdout: 'docs/staged-clean.md\0.claude/skills/clerk\0' },
      lsFiles: {
        stdout: [
          '100644 aaaa 0\tdocs/staged-clean.md',
          '120000 bbbb 0\t.claude/skills/clerk',
          '',
        ].join(NUL),
      },
    });

    await expect(runPrettierStaged(runtime)).resolves.toBe(0);

    expect(inheritedCalls[0]?.args).toContain('docs/staged-clean.md');
    expect(inheritedCalls[0]?.args).not.toContain('.claude/skills/clerk');
  });

  it('does not run Prettier when no files are staged', async () => {
    const { inheritedCalls, runtime } = gateRuntime({});

    await expect(runPrettierStaged(runtime)).resolves.toBe(0);

    expect(inheritedCalls).toStrictEqual([]);
  });

  it('propagates Prettier failures only for staged formatting violations', async () => {
    const { inheritedCalls, runtime } = gateRuntime({
      staged: { stdout: 'docs/staged-bad.md\0' },
      inheritedExitCode: 1,
    });

    await expect(runPrettierStaged(runtime)).resolves.toBe(1);

    expect(inheritedCalls).toStrictEqual([
      {
        command: 'pnpm',
        args: ['exec', 'prettier', '--check', '--ignore-unknown', '--', 'docs/staged-bad.md'],
      },
    ]);
  });

  it('runs Markdownlint only on cached staged Markdown paths', async () => {
    const { capturedCalls, inheritedCalls, runtime } = gateRuntime({
      staged: { stdout: 'docs/staged-clean.md\0agent-tools/src/repo-check/repo-check.ts\0' },
    });

    await expect(runMarkdownlintStaged(runtime)).resolves.toBe(0);

    expect(capturedCalls).toStrictEqual([
      {
        command: 'git',
        args: ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'],
      },
      {
        command: 'git',
        args: ['ls-files', '--cached', '-s', '-z'],
      },
    ]);
    expect(inheritedCalls).toStrictEqual([
      {
        command: 'pnpm',
        args: ['exec', 'markdownlint-cli2', '--no-globs', '--', 'docs/staged-clean.md'],
      },
    ]);
  });

  it('does not run Markdownlint when only non-Markdown files are staged', async () => {
    const { inheritedCalls, runtime } = gateRuntime({
      staged: { stdout: 'agent-tools/src/repo-check/repo-check.ts\0' },
    });

    await expect(runMarkdownlintStaged(runtime)).resolves.toBe(0);

    expect(inheritedCalls).toStrictEqual([]);
  });

  it('propagates Markdownlint failures only for staged Markdown violations', async () => {
    const { inheritedCalls, runtime } = gateRuntime({
      staged: { stdout: 'docs/staged-bad.md\0' },
      inheritedExitCode: 1,
    });

    await expect(runMarkdownlintStaged(runtime)).resolves.toBe(1);

    expect(inheritedCalls).toStrictEqual([
      {
        command: 'pnpm',
        args: ['exec', 'markdownlint-cli2', '--no-globs', '--', 'docs/staged-bad.md'],
      },
    ]);
  });
});

describe('repo-check tracked tree', () => {
  // The gates' behaviour over the tracked tree is proven by exit status in
  // src/repo-check/repo-check-gates.integration.test.ts, which fails only the
  // tracked listing; these prove each of the three reads fails closed, in the
  // words the gates report.
  it("fails in git's own words when listing the tracked files fails", () => {
    const { runtime } = gateRuntime({
      tracked: { status: 128, stderr: 'fatal: not a git repository' },
    });
    expect(() => readTrackedTree(runtime)).toThrow('fatal: not a git repository');
  });

  it('refuses a listing that names no tracked file, naming the remedy', () => {
    const { runtime } = gateRuntime({ tracked: { stdout: '' } });
    expect(() => readTrackedTree(runtime)).toThrow(
      'git listed no tracked file; run the gate from the repository root',
    );
  });

  it("fails in git's own words when reading the working tree's unstaged deletions fails", () => {
    const { runtime } = gateRuntime({
      tracked: { stdout: `docs/a.md${NUL}` },
      goneFromWorkingTree: { status: 129, stderr: 'error: unknown option' },
    });
    expect(() => readTrackedTree(runtime)).toThrow('error: unknown option');
  });

  it("fails in git's own words when reading the index modes fails, and the gates check nothing", async () => {
    const { runtime } = gateRuntime({
      tracked: { stdout: `docs/a.md${NUL}` },
      lsFiles: { status: 128, stderr: 'fatal: index file corrupt' },
    });
    expect(() => readTrackedTree(runtime)).toThrow('fatal: index file corrupt');
    await expect(runPrettierTracked('check', runtime)).resolves.toBe(1);
    await expect(runMarkdownlintTracked('check', runtime)).resolves.toBe(1);
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
    // default, the stream that survived.
    const lines: string[] = [];
    const { runtime } = knipRuntime({ status: null, signal: 'SIGTERM' });

    await expect(runKnipGate(runtime, (line) => lines.push(line))).resolves.toBe(1);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('died without a verdict');
    expect(lines[0]).toContain('status=null');
    expect(lines[0]).toContain('signal=SIGTERM');
  });

  it('names a signal-killed knip child even when it spoke first: a partial verdict is not a verdict', async () => {
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

  it('names an empty-output non-zero run as a crash class: knip always prints a verdict', async () => {
    const lines: string[] = [];
    const { runtime } = knipRuntime({ status: 1 });

    await expect(runKnipGate(runtime, (line) => lines.push(line))).resolves.toBe(1);

    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain('died without a verdict');
  });

  it('keeps real findings off the crash-class channel: a spoken verdict is not a crash', async () => {
    const lines: string[] = [];
    const { runtime } = knipRuntime({ status: 1, stdout: 'Unused exports (2)\n' });

    await expect(runKnipGate(runtime, (line) => lines.push(line))).resolves.toBe(1);

    expect(lines).toStrictEqual([]);
  });

  it('fails loudly when knip exits 0 after swallowing a config-load crash (F-147)', async () => {
    const { runtime } = knipRuntime({
      status: 0,
      stderr:
        'ERROR: Error loading packages/site/vitest.smoke.config.ts ' +
        '(No "exports" main defined in packages/site/node_modules/@oaknational/env-resolution/package.json)\n',
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

  it('passes an unrelated ERROR line on a zero exit: only the load-crash signature reds the gate', async () => {
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

describe('repo-check runtime', () => {
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

  // A check chain shaped like the root one: a leg before turbo, a turbo leg,
  // and two legs after it.
  const scripts = {
    check: 'pnpm format-check:root && pnpm lint && pnpm knip && pnpm depcruise',
    'format-check:root': 'pnpm agent-tools:repo-check prettier-tracked',
    lint: 'turbo run lint',
    knip: 'knip',
    depcruise: 'depcruise agent-tools tooling jcdotnet',
  };
  function legsOf(manifestScripts: Readonly<Record<string, string>>) {
    const result = readCheckLegs(manifestScripts);
    if (!result.ok) {
      throw result.error;
    }
    return result.value;
  }
  const legs = legsOf(scripts);
  const checkEcho = `$ ${scripts.check}`;
  const formatStart = '$ pnpm agent-tools:repo-check prettier-tracked';
  const lintStart = '$ turbo run lint';
  const knipStart = '$ knip';
  const depcruiseStart = '$ depcruise agent-tools tooling jcdotnet';

  it('reads the fixture legs', () => {
    expect(legs.map((leg) => leg.name)).toStrictEqual([
      'format-check:root',
      'lint',
      'knip',
      'depcruise',
    ]);
  });

  it('classifies macOS Chromium launch failures as environment failures', () => {
    expect(
      classifyCheckFailurePhase({
        exitCode: 1,
        output: 'browserType.launch failed: MachPortRendezvous permission denied',
        legs,
      }),
    ).toBe('environment');
  });

  it('classifies a failure in a turbo leg as a turbo-task failure', () => {
    const output = [
      checkEcho,
      formatStart,
      lintStart,
      'Failed: @oaknational/agent-tools#lint',
    ].join('\n');

    expect(classifyCheckFailurePhase({ exitCode: 1, output, legs })).toBe('turbo-task');
    expect(
      profilePostTurboGateStatus({
        outputCaptured: true,
        failurePhase: 'turbo-task',
        output,
        legs,
      }),
    ).toBe('skipped-after-turbo-failure');
  });

  it('classifies a failure in a leg after the last turbo leg as a post-turbo gate failure', () => {
    const output = [checkEcho, formatStart, lintStart, knipStart, depcruiseStart, 'error'].join(
      '\n',
    );

    expect(classifyCheckFailurePhase({ exitCode: 1, output, legs })).toBe('post-turbo-gate');
    expect(
      profilePostTurboGateStatus({
        outputCaptured: true,
        failurePhase: 'post-turbo-gate',
        output,
        legs,
      }),
    ).toBe('ran');
  });

  it('does not read post-turbo legs as run because the check echo names them', () => {
    // The echo of the check script contains `pnpm knip` and `pnpm depcruise`
    // on every run; only their own start lines show they ran.
    const output = [checkEcho, formatStart, 'Code style issues found'].join('\n');

    expect(classifyCheckFailurePhase({ exitCode: 1, output, legs })).toBe('check-command');
    expect(
      profilePostTurboGateStatus({
        outputCaptured: true,
        failurePhase: 'check-command',
        output,
        legs,
      }),
    ).toBe('not-observed');
  });

  it('reads no leg as post-turbo in a chain that runs no turbo leg', () => {
    const noTurboLegs = legsOf({
      check: 'pnpm knip && pnpm depcruise',
      knip: 'knip',
      depcruise: 'depcruise agent-tools',
    });
    const output = ['$ knip', '$ depcruise agent-tools', 'error'].join('\n');

    expect(classifyCheckFailurePhase({ exitCode: 1, output, legs: noTurboLegs })).toBe(
      'check-command',
    );
    expect(
      profilePostTurboGateStatus({
        outputCaptured: true,
        failurePhase: 'check-command',
        output,
        legs: noTurboLegs,
      }),
    ).toBe('not-observed');
  });

  it('names the leg a failed run stopped in', () => {
    const artifact = buildCheckProfileArtifact({
      startedAt: '2026-05-12T07:31:30.160Z',
      finishedAt: '2026-05-12T07:33:57.773Z',
      durationMs: 1_000,
      exitCode: 1,
      turboDryGraph: '.logs/check-profiles/check-turbo-graph.json',
      environment,
      output: [checkEcho, formatStart, 'Code style issues found'].join('\n'),
      legs,
    });

    expect(artifact.failurePhase).toBe('check-command');
    expect(artifact.failedLeg).toBe('format-check:root');
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
      output: [checkEcho, formatStart, lintStart, knipStart, depcruiseStart].join('\n'),
      legs,
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
});
