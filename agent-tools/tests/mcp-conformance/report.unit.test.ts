import { err, ok, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  type BaselineLoadOutcome,
  type McpConformanceIo,
  type RetentionOutcome,
} from '../../src/mcp-conformance/io-port.js';
import { runMcpConformance } from '../../src/mcp-conformance/report.js';
import {
  composeSuiteArgs,
  UNATTENDED_SUITES,
  type McpjamSpawnResult,
} from '../../src/mcp-conformance/runner.js';
import { type Baseline } from '../../src/mcp-conformance/baseline-schema.js';
import { type SuiteOutcome } from '../../src/mcp-conformance/types.js';
import {
  loadBaseline,
  loadFixtureRaw,
  rawWithSchemaVersion,
} from './test-helpers/fixture-loader.js';

const PROTOCOL_RAW = loadFixtureRaw('protocol-unauth-alpha-2026-07-26.json');
const OAUTH_RAW = loadFixtureRaw('oauth-dcr-headless-alpha-2026-07-26.json');

function loaded(baseline: Baseline): BaselineLoadOutcome {
  return { kind: 'loaded', baseline };
}

const UNATTENDED_BASELINES = {
  protocol: loaded(loadBaseline('protocol-unattended.json')),
  oauth: loaded(loadBaseline('oauth-dcr-unattended.json')),
};

/**
 * The fixtures are real captures against the deployed alpha, and the parse
 * boundary now verifies the report's `groups[].target` against the REQUESTED
 * target. The tests therefore have to request the endpoint the fixtures were
 * captured from — a synthetic target here would make every fixture-based case
 * a provenance mismatch, which is exactly the check working.
 */
const TARGET = 'https://curriculum-mcp-alpha.oaknational.dev/mcp';

const DEFAULT_RUN_RESULTS: Readonly<Record<string, Result<McpjamSpawnResult, Error>>> = {
  protocol: ok({ exitCode: 1, stdout: PROTOCOL_RAW, stderr: '' }),
  oauth: ok({ exitCode: 1, stdout: OAUTH_RAW, stderr: '' }),
};

const DEFAULT_RETENTION: Readonly<Record<string, RetentionOutcome>> = {
  protocol: { ok: true, reportedPath: 'tmp/mcp-conformance/test/protocol.json' },
  oauth: { ok: true, reportedPath: 'tmp/mcp-conformance/test/oauth.json' },
};

/**
 * Fake IO in the sibling's branch-free shape: behaviour is data — object
 * literals keyed by suite, spread over defaults — and every seam method is
 * a single lookup expression. Retained content is recorded for the
 * verbatim-retention assertions.
 */
function fakeIo(overrides?: {
  readonly runResults?: Readonly<Record<string, Result<McpjamSpawnResult, Error>>>;
  readonly retention?: Readonly<Record<string, RetentionOutcome>>;
}): McpConformanceIo & { readonly retained: Map<string, string> } {
  const retained = new Map<string, string>();
  const runResults = { ...DEFAULT_RUN_RESULTS, ...overrides?.runResults };
  const retention = { ...DEFAULT_RETENTION, ...overrides?.retention };
  return {
    retained,
    runMcpjam: (args) =>
      runResults[args[0] ?? ''] ?? err(new Error(`no canned result for suite "${args[0] ?? ''}"`)),
    retainRawReport: (suite, content) => {
      retained.set(suite, content);
      return retention[suite] ?? { ok: false, error: `no canned retention for "${suite}"` };
    },
  };
}

/** Flatten an outcome's failure reasons for fragment assertions. */
function reasonsOf(outcome: SuiteOutcome | undefined): string {
  return (outcome?.failureReasons ?? []).join('\n');
}

describe('composeSuiteArgs — reproducible lockfile-run invocations', () => {
  it('protocol suite composes url + json-summary reporter', () => {
    expect(composeSuiteArgs({ suite: 'protocol', mode: 'unattended', target: TARGET })).toEqual([
      'protocol',
      'conformance',
      '--url',
      TARGET,
      '--reporter',
      'json-summary',
    ]);
  });

  it('unattended oauth pins headless DCR at spec 2025-11-25 and omits --conformance-checks (attended-gated upstream)', () => {
    expect(composeSuiteArgs({ suite: 'oauth', mode: 'unattended', target: TARGET })).toEqual([
      'oauth',
      'conformance',
      '--url',
      TARGET,
      '--protocol-version',
      '2025-11-25',
      '--registration',
      'dcr',
      '--auth-mode',
      'headless',
      '--reporter',
      'json-summary',
    ]);
  });

  it('attended oauth is interactive and requests the negative probes', () => {
    const args = composeSuiteArgs({ suite: 'oauth', mode: 'attended', target: TARGET });
    expect(args).toContain('--conformance-checks');
    expect(args).toContain('interactive');
  });

  it('credentialed suites pass the credentials file through', () => {
    expect(
      composeSuiteArgs({
        suite: 'apps',
        mode: 'attended',
        target: TARGET,
        credentialsFile: 'tmp/creds.json',
      }),
    ).toEqual([
      'apps',
      'conformance',
      '--url',
      TARGET,
      '--credentials-file',
      'tmp/creds.json',
      '--reporter',
      'json-summary',
    ]);
  });
});

describe('runMcpConformance — verdict operation', () => {
  const verdictInput = {
    target: TARGET,
    operation: 'verdict' as const,
    mode: 'unattended' as const,
    suites: UNATTENDED_SUITES,
    baselines: UNATTENDED_BASELINES,
  };

  it('the unattended plan against the observed alpha shapes verdicts pass with exit 0', () => {
    const { report, exitCode } = runMcpConformance(fakeIo(), verdictInput);
    expect(report.operation).toBe('verdict');
    expect(report.verdict).toBe('pass');
    expect(exitCode).toBe(0);
    expect(report.suites.map((s) => [s.suite, s.verdict])).toEqual([
      ['protocol', 'pass'],
      ['oauth', 'pass'],
    ]);
    expect(report.suites.every((s) => s.failureReasons.length === 0)).toBe(true);
    // The oauth baseline's named residual masking window rides the outcome.
    expect(report.suites[1]?.baselineResidualMasking).toContain('attended');
  });

  it('raw stdout is retained verbatim for every suite before any parsing', () => {
    const io = fakeIo();
    runMcpConformance(io, verdictInput);
    expect(io.retained.get('protocol')).toBe(PROTOCOL_RAW);
    expect(io.retained.get('oauth')).toBe(OAUTH_RAW);
  });

  it('an exit code outside {0, 1} is an operational failure naming the code, never a verdict', () => {
    const io = fakeIo({
      runResults: {
        protocol: ok({ exitCode: 2, stdout: PROTOCOL_RAW, stderr: 'usage: mcpjam …' }),
      },
    });
    const { report, exitCode } = runMcpConformance(io, verdictInput);
    expect(exitCode).toBe(1);
    const protocol = report.suites.find((s) => s.suite === 'protocol');
    expect(protocol?.verdict).toBe('fail');
    expect(reasonsOf(protocol)).toContain('exited operationally (exit 2)');
    // Retention ran before the operational verdict: the raw stdout survives.
    expect(io.retained.get('protocol')).toBe(PROTOCOL_RAW);
  });

  it('a launch failure fails that suite by name without aborting the rest', () => {
    const io = fakeIo({
      runResults: {
        protocol: err(new Error('spawn ENOENT')),
        oauth: err(new Error('spawn ENOENT')),
      },
    });
    const { report, exitCode } = runMcpConformance(io, verdictInput);
    expect(exitCode).toBe(1);
    expect(report.suites).toHaveLength(2);
    for (const suite of report.suites) {
      expect(suite.verdict).toBe('fail');
      expect(reasonsOf(suite)).toContain('spawn ENOENT');
    }
  });

  it('unparseable stdout is a loud failure naming the suite, the syntax cause, and the retained path', () => {
    const io = fakeIo({
      runResults: { protocol: ok({ exitCode: 1, stdout: 'not json at all', stderr: '' }) },
    });
    const { report, exitCode } = runMcpConformance(io, verdictInput);
    expect(exitCode).toBe(1);
    const protocol = report.suites.find((s) => s.suite === 'protocol');
    expect(protocol?.verdict).toBe('fail');
    expect(reasonsOf(protocol)).toContain('"protocol" suite was not JSON');
    expect(reasonsOf(protocol)).toContain('tmp/mcp-conformance/test/protocol.json');
    // Retention happened even though parsing failed — the evidence survives.
    expect(io.retained.get('protocol')).toBe('not json at all');
    // The other suite still ran and passed.
    expect(report.suites.find((s) => s.suite === 'oauth')?.verdict).toBe('pass');
  });

  it('a report whose groups carry zero cases fails at the parse boundary — no vacuous pass', () => {
    const emptyRun = JSON.stringify({
      schemaVersion: 1,
      kind: 'suite',
      name: 'protocol',
      passed: true,
      durationMs: 1,
      groups: [{ id: 'g', title: 't', passed: true, durationMs: 1, cases: [] }],
    });
    const io = fakeIo({
      runResults: { protocol: ok({ exitCode: 0, stdout: emptyRun, stderr: '' }) },
    });
    const { report } = runMcpConformance(io, verdictInput);
    expect(reasonsOf(report.suites.find((s) => s.suite === 'protocol'))).toContain(
      'at least one check case',
    );
  });

  it('a reporter schemaVersion bump fails at the parse boundary, never half-matches', () => {
    const io = fakeIo({
      runResults: {
        protocol: ok({ exitCode: 1, stdout: rawWithSchemaVersion(PROTOCOL_RAW, 2), stderr: '' }),
      },
    });
    const { report } = runMcpConformance(io, verdictInput);
    expect(reasonsOf(report.suites.find((s) => s.suite === 'protocol'))).toContain('schemaVersion');
  });

  it('a parse failure preserves the mcpjam stderr diagnostic as a bounded excerpt', () => {
    const io = fakeIo({
      runResults: {
        protocol: ok({ exitCode: 2, stdout: 'usage: mcpjam', stderr: 'unknown flag --reporter' }),
      },
    });
    const { report } = runMcpConformance(io, verdictInput);
    expect(reasonsOf(report.suites.find((s) => s.suite === 'protocol'))).toContain(
      'mcpjam stderr: unknown flag --reporter',
    );
  });

  it('an over-long stderr diagnostic is truncated EXPLICITLY, never silently', () => {
    const io = fakeIo({
      runResults: {
        protocol: ok({ exitCode: 1, stdout: 'not json', stderr: 'x'.repeat(5000) }),
      },
    });
    const { report } = runMcpConformance(io, verdictInput);
    expect(reasonsOf(report.suites.find((s) => s.suite === 'protocol'))).toContain(
      '(truncated from 5000 trimmed chars)',
    );
  });

  it('simultaneous failures compose — unparseable stdout and failed retention are both reported', () => {
    const io = fakeIo({
      runResults: { protocol: ok({ exitCode: 1, stdout: 'not json', stderr: '' }) },
      retention: { protocol: { ok: false, error: 'disk full' } },
    });
    const { report } = runMcpConformance(io, { ...verdictInput, suites: ['protocol'] });
    const protocol = report.suites[0];
    expect(protocol?.verdict).toBe('fail');
    expect(reasonsOf(protocol)).toContain('was not JSON');
    expect(reasonsOf(protocol)).toContain('raw-report retention failed: disk full');
  });

  it('retention failure is loud even when the comparison itself passes', () => {
    const io = fakeIo({ retention: { protocol: { ok: false, error: 'disk full' } } });
    const { report, exitCode } = runMcpConformance(io, {
      ...verdictInput,
      suites: ['protocol'],
    });
    expect(exitCode).toBe(1);
    expect(report.suites[0]?.verdict).toBe('fail');
    expect(reasonsOf(report.suites[0])).toContain('disk full');
  });

  it('a missing baseline fails the run FAST — nothing launches, and the failure names --seed', () => {
    const io = fakeIo();
    const { report, exitCode } = runMcpConformance(io, {
      ...verdictInput,
      baselines: { protocol: UNATTENDED_BASELINES.protocol },
    });
    expect(exitCode).toBe(1);
    // Entry validation: no suite ran, no network, no retention.
    expect(io.retained.size).toBe(0);
    const oauth = report.suites.find((s) => s.suite === 'oauth');
    expect(oauth?.verdict).toBe('fail');
    expect(reasonsOf(oauth)).toContain('no unattended baseline');
    expect(reasonsOf(oauth)).toContain('--seed');
    // The suite whose baseline was fine reports the entry-validation abort.
    const protocol = report.suites.find((s) => s.suite === 'protocol');
    expect(protocol?.verdict).toBe('fail');
    expect(reasonsOf(protocol)).toContain('not run: entry validation failed');
  });

  it('an invalid baseline fails fast with its true cause, never masquerading as absent', () => {
    const io = fakeIo();
    const { report, exitCode } = runMcpConformance(io, {
      ...verdictInput,
      baselines: {
        protocol: UNATTENDED_BASELINES.protocol,
        oauth: { kind: 'invalid', reason: 'oauth-dcr-unattended.json is not valid JSON: boom' },
      },
    });
    expect(exitCode).toBe(1);
    expect(io.retained.size).toBe(0);
    const oauth = report.suites.find((s) => s.suite === 'oauth');
    expect(oauth?.verdict).toBe('fail');
    expect(reasonsOf(oauth)).toContain('unusable');
    expect(reasonsOf(oauth)).toContain('not valid JSON: boom');
  });
});

describe('runMcpConformance — seed operation (capture-only)', () => {
  const seedInput = {
    target: TARGET,
    operation: 'seed' as const,
    mode: 'unattended' as const,
    suites: UNATTENDED_SUITES,
    baselines: {},
  };

  it('captures and passes with NO baselines at all — the authoring path', () => {
    const io = fakeIo();
    const { report, exitCode } = runMcpConformance(io, seedInput);
    expect(report.operation).toBe('seed');
    expect(report.verdict).toBe('pass');
    expect(exitCode).toBe(0);
    expect(io.retained.get('protocol')).toBe(PROTOCOL_RAW);
    expect(io.retained.get('oauth')).toBe(OAUTH_RAW);
    for (const suite of report.suites) {
      expect(suite.verdict).toBe('pass');
      expect(suite.rawReportPath).toBeDefined();
      expect(suite.divergences).toEqual([]);
    }
  });

  it('an unparseable capture fails the seed run with the syntax cause and stderr diagnostic', () => {
    // exitCode 1 is the vendor's verdict-neutral normal: the run reaches the
    // parse boundary. An exit OUTSIDE {0, 1} now fails earlier as
    // operational-exit — that path has its own test in the verdict describe.
    const io = fakeIo({
      runResults: { protocol: ok({ exitCode: 1, stdout: 'not json', stderr: 'boom detail' }) },
    });
    const { report, exitCode } = runMcpConformance(io, seedInput);
    expect(exitCode).toBe(1);
    const protocol = report.suites.find((s) => s.suite === 'protocol');
    expect(protocol?.verdict).toBe('fail');
    expect(reasonsOf(protocol)).toContain('was not JSON');
    expect(reasonsOf(protocol)).toContain('mcpjam stderr: boom detail');
  });

  it('a retention failure fails the seed run — capture IS the operation', () => {
    const io = fakeIo({ retention: { oauth: { ok: false, error: 'disk full' } } });
    const { report, exitCode } = runMcpConformance(io, seedInput);
    expect(exitCode).toBe(1);
    expect(reasonsOf(report.suites.find((s) => s.suite === 'oauth'))).toContain('disk full');
  });
});

describe('round-3 review cures — vendor-dispatch identity and warning preservation', () => {
  const verdictInput = {
    target: TARGET,
    operation: 'verdict' as const,
    mode: 'unattended' as const,
    suites: UNATTENDED_SUITES,
    baselines: UNATTENDED_BASELINES,
  };

  it('a report from a different subcommand fails the suite rather than being verdicted as it', () => {
    // The realistic path is an in-range mcpjam update re-pointing a
    // subcommand: structurally valid JSON, wrong suite. Verdicting it would
    // label another suite's capture with this suite's name.
    const io = fakeIo({
      runResults: { protocol: ok({ exitCode: 1, stdout: OAUTH_RAW, stderr: '' }) },
    });

    const { report, exitCode } = runMcpConformance(io, verdictInput);

    const protocol = report.suites.find((suite) => suite.suite === 'protocol');
    expect(exitCode).toBe(1);
    expect(protocol?.verdict).toBe('fail');
    expect(reasonsOf(protocol)).toContain('oauth-conformance');
    expect(reasonsOf(protocol)).toContain('do not author a baseline from this capture');
  });

  it('a vendor warning on a PASSING run is preserved as a diagnostic, never dropped', () => {
    // The run parses, matches its baseline and passes; without this the
    // deprecation warning exists only in a stream nobody reads.
    const io = fakeIo({
      runResults: {
        protocol: ok({
          exitCode: 1,
          stdout: PROTOCOL_RAW,
          stderr: 'DeprecationWarning: --reporter json-summary will be renamed',
        }),
      },
    });

    const { report } = runMcpConformance(io, verdictInput);

    const protocol = report.suites.find((suite) => suite.suite === 'protocol');
    expect(protocol?.verdict).toBe('pass');
    expect(protocol?.mcpjamStderr).toContain('DeprecationWarning');
  });

  it('a silent stderr adds no diagnostic field', () => {
    const { report } = runMcpConformance(fakeIo(), verdictInput);

    expect(report.suites.find((suite) => suite.suite === 'protocol')?.mcpjamStderr).toBeUndefined();
  });
});

describe('round-8 review cures — report provenance is verified against the request', () => {
  const verdictInput = {
    target: TARGET,
    operation: 'verdict' as const,
    mode: 'unattended' as const,
    suites: ['protocol' as const],
    baselines: UNATTENDED_BASELINES,
  };

  it('a capture of a DIFFERENT deployment fails rather than being verdicted as the requested one', () => {
    // The realistic path: an in-range mcpjam misroutes or reinterprets --url.
    // Baselines are deliberately target-agnostic, so comparison alone would
    // pass and the aggregate would label another deployment's result with the
    // requested target — false assurance about a live surface.
    const otherDeployment = PROTOCOL_RAW.replaceAll(
      'https://curriculum-mcp-alpha.oaknational.dev/mcp',
      'https://curriculum-mcp-staging.oaknational.dev/mcp',
    );
    const io = fakeIo({
      runResults: { protocol: ok({ exitCode: 1, stdout: otherDeployment, stderr: '' }) },
    });

    const { report, exitCode } = runMcpConformance(io, verdictInput);

    expect(exitCode).toBe(1);
    const protocol = report.suites.find((s) => s.suite === 'protocol');
    expect(protocol?.verdict).toBe('fail');
    expect(reasonsOf(protocol)).toContain('staging');
    expect(reasonsOf(protocol)).toContain('different deployment');
  });

  it('redacts a credential the server reflected into its reported target', () => {
    // The mismatch reason is emitted to stdout, and the suites run unattended
    // in CI — a server echoing a query-param token into its reported target
    // must be masked there, not printed. (Security review 2026-08-19.)
    const poisoned = PROTOCOL_RAW.replaceAll(
      'https://curriculum-mcp-alpha.oaknational.dev/mcp',
      'https://curriculum-mcp-staging.oaknational.dev/mcp?access_token=ya29.SECRET',
    );
    const io = fakeIo({
      runResults: { protocol: ok({ exitCode: 1, stdout: poisoned, stderr: '' }) },
    });

    const { report } = runMcpConformance(io, verdictInput);
    const protocol = report.suites.find((s) => s.suite === 'protocol');

    expect(reasonsOf(protocol)).not.toContain('ya29.SECRET');
    expect(reasonsOf(protocol)).toContain('access_token=[redacted]');
  });

  it('a trailing slash is not a provenance mismatch', () => {
    // URL-normalised comparison: the request and the report may spell the same
    // endpoint differently without that being tool drift.
    const { report } = runMcpConformance(fakeIo(), { ...verdictInput, target: `${TARGET}/` });

    expect(report.suites.find((s) => s.suite === 'protocol')?.verdict).toBe('pass');
  });

  it('the aggregate report redacts a credential in the requested target', () => {
    // The validator refuses every credential-bearing target, so this belt is
    // defence in depth against a future validation gap — `report.target`
    // rides to stdout and into CI job logs.
    const { report } = runMcpConformance(fakeIo(), {
      ...verdictInput,
      target: 'ht!tp://user:s3cret@h/mcp',
    });

    expect(report.target).not.toContain('s3cret');
    expect(report.target).toBe('ht!tp://[redacted]@h/mcp');
  });
});

describe('round-5 review cures — an empty group cannot hide behind a populated one', () => {
  it('a group that emitted zero cases fails at the parse boundary, even beside a populated group', () => {
    // The realistic path: an in-range mcpjam adds a group that fails during
    // setup and so emits no cases. Comparison flattens groups into a case map
    // and never reads `group.passed`, so the empty group contributes nothing
    // and the run would verdict `pass` — while the SAME group emitting even
    // one case would fire `novel-check`. The drift tripwire must not have a
    // hole exactly where the vendor fails hardest.
    const withEmptyFailedGroup = JSON.stringify({
      schemaVersion: 1,
      kind: 'protocol-conformance',
      name: 'protocol',
      passed: false,
      durationMs: 2,
      groups: [
        {
          id: 'populated',
          title: 'populated',
          passed: true,
          durationMs: 1,
          cases: [
            { id: 'check_one', title: 'one', category: 'posture', status: 'passed', durationMs: 1 },
          ],
        },
        { id: 'setup-failed', title: 'setup', passed: false, durationMs: 1, cases: [] },
      ],
    });
    const io = fakeIo({
      runResults: { protocol: ok({ exitCode: 1, stdout: withEmptyFailedGroup, stderr: '' }) },
    });

    const { report, exitCode } = runMcpConformance(io, {
      target: TARGET,
      operation: 'verdict' as const,
      mode: 'unattended' as const,
      suites: ['protocol'],
      baselines: UNATTENDED_BASELINES,
    });

    expect(exitCode).toBe(1);
    expect(reasonsOf(report.suites.find((s) => s.suite === 'protocol'))).toContain(
      'every json-summary group must contain at least one check case',
    );
  });
});

describe('round-4 review cures — vacuous-plan and whitespace failure fragments', () => {
  it('an empty suite plan fails rather than passing vacuously', () => {
    // `every` over an empty array is true: a run that launched nothing would
    // otherwise report pass and exit 0.
    const { report, exitCode } = runMcpConformance(fakeIo(), {
      target: TARGET,
      operation: 'verdict' as const,
      mode: 'unattended' as const,
      suites: [],
      baselines: UNATTENDED_BASELINES,
    });

    expect(exitCode).toBe(1);
    expect(report.verdict).toBe('fail');
    expect(report.suites).toEqual([]);
  });
});
