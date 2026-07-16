import { join } from 'node:path';

import { err, ok } from '@oaknational/result';
import { afterEach, describe, expect, it } from 'vitest';

import {
  CODEX_REVIEW_BENCHMARK_VERSION,
  type CodexReviewBenchmarkReport,
} from '../../src/codex-hook-review/benchmark.js';
import { type LiveBenchmarkContext } from '../../src/codex-hook-review/benchmark-live.js';
import {
  CODEX_REVIEW_FEASIBILITY_PROBE_VERSION,
  type CodexReviewFeasibilityProbeReport,
} from '../../src/codex-hook-review/feasibility-probe.js';
import {
  LOCAL_ACTIVATION_MANIFEST,
  LOCAL_BENCHMARK_REPORT,
} from '../../src/codex-hook-review/local-state.js';
import {
  runBenchmarkCommand,
  TOURNAMENT_CORPUS_LABEL_AUDIT_STATUS,
  type BenchmarkCommandDependencies,
} from '../../src/codex-hook-review/operator-benchmark.js';
import { deactivateHookReviewState } from '../../src/codex-hook-review/operator-deactivation.js';
import { CODEX_HOOK_MARKER } from '../../src/codex-hook-review/settings.js';
import { CLAUDE_LOCAL_SETTINGS } from '../../src/codex-hook-review/settings-file.js';
import { TOURNAMENT_CELLS } from '../../src/codex-hook-review/tournament-types.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => fileSystem.cleanup());

const unrelatedHook = {
  matcher: 'Read',
  hooks: [{ type: 'command', command: '/private/unrelated' }],
};

const activeSettings = {
  retained: true,
  hooks: {
    PostToolBatch: [
      unrelatedHook,
      {
        hooks: [
          {
            type: 'command',
            command: '/private/node',
            args: ['/private/hook.mjs', CODEX_HOOK_MARKER],
            timeout: 6,
            async: true,
          },
        ],
      },
    ],
  },
};

const deactivatedSettings = {
  retained: true,
  hooks: { PostToolBatch: [unrelatedHook] },
};

const context: LiveBenchmarkContext = {
  projectRoot: '/unused',
  userHome: '/unused',
  sourceEnvironment: {},
  executables: {
    node: '/private/node',
    claude: '/private/claude',
    codex: '/private/codex',
    gitleaks: '/private/gitleaks',
  },
};

function coldProbeFailureReport(): CodexReviewBenchmarkReport {
  return {
    schemaVersion: 1,
    benchmarkVersion: CODEX_REVIEW_BENCHMARK_VERSION,
    completedAt: '2026-07-16T00:00:00.000Z',
    coldProbes: TOURNAMENT_CELLS.map((cell) => ({
      cellId: cell.id,
      outcome: 'process-failure',
      durationMs: 1,
    })),
    calibration: { evidence: [] },
    finalistCellIds: [],
    heldOut: { evidence: [] },
    qualified: false,
    failure: 'cold-probe-failed',
  };
}

function feasibilityReport(viable = true): CodexReviewFeasibilityProbeReport {
  return {
    schemaVersion: 1,
    probeVersion: CODEX_REVIEW_FEASIBILITY_PROBE_VERSION,
    completedAt: '2026-07-16T00:00:00.000Z',
    samples: [],
    viableCellIds: viable ? ['spark-low:inline'] : [],
    viable,
    ...(viable ? {} : { failure: 'no-viable-inline-lane' }),
  };
}

function dependencies(
  overrides: Partial<BenchmarkCommandDependencies> = {},
): BenchmarkCommandDependencies {
  return {
    validateClaude: async () => ok(undefined),
    ensureAuthentication: async () => ok(true),
    deactivate: (projectRoot) => deactivateHookReviewState(projectRoot, 'clear'),
    runFeasibility: async () => feasibilityReport(),
    runTournament: async () => coldProbeFailureReport(),
    ...overrides,
  };
}

async function activeProject(): Promise<string> {
  const root = await fileSystem.temporaryRoot('codex-hook-review-operator-');
  await fileSystem.createDirectory(join(root, '.claude'), { recursive: true });
  await fileSystem.writeText(
    join(root, CLAUDE_LOCAL_SETTINGS),
    `${JSON.stringify(activeSettings)}\n`,
  );
  await fileSystem.writeText(
    join(root, LOCAL_ACTIVATION_MANIFEST),
    '{"enabled":true,"stale":"private"}\n',
  );
  return root;
}

function commandInput(projectRoot: string, lines: string[] = []) {
  return {
    projectRoot,
    output: { writeLine: (line: string) => lines.push(line), writeErrorLine: () => undefined },
  };
}

describe('runBenchmarkCommand lifecycle', () => {
  it('authenticates and fully deactivates before feasibility, then enforces the corpus-audit stop', async () => {
    const projectRoot = await activeProject();
    const lines: string[] = [];
    let tournamentCalls = 0;
    const order: string[] = [];

    const result = await runBenchmarkCommand(
      commandInput(projectRoot, lines),
      { ...context, projectRoot },
      dependencies({
        ensureAuthentication: async () => {
          order.push('authentication');
          return ok(true);
        },
        deactivate: async (root) => {
          order.push('deactivate');
          return deactivateHookReviewState(root, 'clear');
        },
        runFeasibility: async () => {
          order.push('feasibility');
          expect(
            JSON.parse(await fileSystem.readText(join(projectRoot, CLAUDE_LOCAL_SETTINGS))),
          ).toStrictEqual(deactivatedSettings);
          return feasibilityReport();
        },
        runTournament: async () => {
          order.push('tournament');
          tournamentCalls += 1;
          return coldProbeFailureReport();
        },
      }),
    );

    expect(result).toStrictEqual(ok(2));
    expect(TOURNAMENT_CORPUS_LABEL_AUDIT_STATUS).toBe('pending');
    expect(tournamentCalls).toBe(0);
    expect(order).toStrictEqual(['authentication', 'deactivate', 'feasibility']);
    expect(lines.at(-1)).toBe(
      'Tournament blocked pending independent corpus-label agreement; local activation remains disabled.',
    );
    expect(
      JSON.parse(await fileSystem.readText(join(projectRoot, CLAUDE_LOCAL_SETTINGS))),
    ).toStrictEqual(deactivatedSettings);
    await expect(
      fileSystem.readText(join(projectRoot, LOCAL_ACTIVATION_MANIFEST)),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(
      fileSystem.readText(join(projectRoot, LOCAL_BENCHMARK_REPORT)),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('emits the content-free feasibility report and stops before tournament when no lane is viable', async () => {
    const projectRoot = await activeProject();
    const lines: string[] = [];
    let tournamentCalls = 0;

    const result = await runBenchmarkCommand(
      commandInput(projectRoot, lines),
      { ...context, projectRoot },
      dependencies({
        runFeasibility: async () => feasibilityReport(false),
        runTournament: async () => {
          tournamentCalls += 1;
          return coldProbeFailureReport();
        },
      }),
    );

    expect(result).toStrictEqual(ok(2));
    expect(tournamentCalls).toBe(0);
    expect(lines[0]).toBe('Running 6 non-qualifying inline feasibility calls.');
    expect(JSON.parse(lines[1] ?? '{}')).toStrictEqual(feasibilityReport(false));
    expect(lines.at(-1)).toBe(
      'No inline lane demonstrated basic feasibility; tournament skipped and local activation remains disabled.',
    );
    await expect(
      fileSystem.readText(join(projectRoot, LOCAL_BENCHMARK_REPORT)),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('aborts before the first tournament call when deactivation fails', async () => {
    let tournamentCalls = 0;

    const result = await runBenchmarkCommand(
      commandInput('/unused'),
      context,
      dependencies({
        deactivate: async () =>
          err({ kind: 'manifest-write-failed', message: 'private failure detail' }),
        runTournament: async () => {
          tournamentCalls += 1;
          return coldProbeFailureReport();
        },
      }),
    );

    expect(result).toStrictEqual(
      err({
        kind: 'benchmark-deactivation-failed',
        message: 'Unable to deactivate the previous hook before benchmarking',
      }),
    );
    expect(tournamentCalls).toBe(0);
  });

  it('does not reach a dormant tournament implementation while its corpus audit is pending', async () => {
    const projectRoot = await activeProject();
    let tournamentCalls = 0;

    const result = await runBenchmarkCommand(
      commandInput(projectRoot),
      { ...context, projectRoot },
      dependencies({
        runTournament: async () => {
          tournamentCalls += 1;
          return coldProbeFailureReport();
        },
      }),
    );

    expect(result).toStrictEqual(ok(2));
    expect(tournamentCalls).toBe(0);
    expect(
      JSON.parse(await fileSystem.readText(join(projectRoot, CLAUDE_LOCAL_SETTINGS))),
    ).toStrictEqual(deactivatedSettings);
    await expect(
      fileSystem.readText(join(projectRoot, LOCAL_ACTIVATION_MANIFEST)),
    ).rejects.toMatchObject({ code: 'ENOENT' });
  });
});
