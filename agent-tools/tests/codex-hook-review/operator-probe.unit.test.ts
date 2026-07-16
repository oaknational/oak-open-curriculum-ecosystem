import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  CODEX_REVIEW_FEASIBILITY_PROBE_VERSION,
  type CodexReviewFeasibilityProbeReport,
} from '../../src/codex-hook-review/feasibility-probe.js';
import {
  runProbeCommand,
  type ProbeCommandDependencies,
} from '../../src/codex-hook-review/operator-probe.js';

const context = {
  projectRoot: '/project',
  userHome: '/home',
  sourceEnvironment: {},
  executables: {
    node: '/bin/node',
    claude: '/bin/claude',
    codex: '/bin/codex',
    gitleaks: '/bin/gitleaks',
  },
};

function report(viable: boolean): CodexReviewFeasibilityProbeReport {
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

function dependencies(overrides: Partial<ProbeCommandDependencies> = {}): ProbeCommandDependencies {
  return {
    ensureAuthentication: async () => true,
    deactivate: async () => ok(undefined),
    runProbe: async () => report(true),
    ...overrides,
  };
}

function input(lines: string[]) {
  return { projectRoot: '/project', output: { writeLine: (line: string) => lines.push(line) } };
}

describe('runProbeCommand', () => {
  it('deactivates before the first probe call and emits a content-free report', async () => {
    const order: string[] = [];
    const lines: string[] = [];

    const result = await runProbeCommand(
      input(lines),
      context,
      dependencies({
        ensureAuthentication: async () => {
          order.push('authentication');
          return true;
        },
        deactivate: async () => {
          order.push('deactivate');
          return ok(undefined);
        },
        runProbe: async () => {
          order.push('probe');
          return report(true);
        },
      }),
    );

    expect(result).toStrictEqual(ok(0));
    expect(order).toStrictEqual(['authentication', 'deactivate', 'probe']);
    expect(JSON.parse(lines[1] ?? '{}')).toMatchObject({ viable: true, samples: [] });
    expect(lines.at(-1)).toBe('Viable inline lanes: spark-low:inline');
  });

  it('returns two and explicitly stops before benchmark when no lane is viable', async () => {
    const lines: string[] = [];

    const result = await runProbeCommand(
      input(lines),
      context,
      dependencies({ runProbe: async () => report(false) }),
    );

    expect(result).toStrictEqual(ok(2));
    expect(lines.at(-1)).toBe(
      'No inline lane demonstrated basic feasibility; stop before benchmark.',
    );
  });

  it('does not alter state or call a model when authentication is unavailable', async () => {
    let deactivationCalls = 0;
    let probeCalls = 0;

    const result = await runProbeCommand(
      input([]),
      context,
      dependencies({
        ensureAuthentication: async () => false,
        deactivate: async () => {
          deactivationCalls += 1;
          return ok(undefined);
        },
        runProbe: async () => {
          probeCalls += 1;
          return report(true);
        },
      }),
    );

    expect(result).toStrictEqual(
      err({
        kind: 'probe-authentication-unavailable',
        message: 'Dedicated Codex hook authentication is unavailable',
      }),
    );
    expect(deactivationCalls).toBe(0);
    expect(probeCalls).toBe(0);
  });

  it('does not call a model when deactivation fails', async () => {
    let probeCalls = 0;

    const result = await runProbeCommand(
      input([]),
      context,
      dependencies({
        deactivate: async () => err({ kind: 'manifest-write-failed', message: 'private detail' }),
        runProbe: async () => {
          probeCalls += 1;
          return report(true);
        },
      }),
    );

    expect(result).toStrictEqual(
      err({
        kind: 'probe-deactivation-failed',
        message: 'Unable to deactivate the previous hook before probing',
      }),
    );
    expect(probeCalls).toBe(0);
  });
});
