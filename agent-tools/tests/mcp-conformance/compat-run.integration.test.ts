import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { composeCompatRunReport } from '../../src/mcp-conformance/compat-cli.js';
import { composeCompatArgs, type CompatIo } from '../../src/mcp-conformance/compat-evidence.js';
import { runCompat } from '../../src/mcp-conformance/compat-run.js';
import { loadFixtureRaw } from './test-helpers/fixture-loader.js';

/**
 * The compat operation's evidence gate — the module's whole reason for
 * existing separately from the suites'.
 *
 * The suites treat a non-zero exit as verdict-neutral DATA: a failing suite
 * still writes its full report to stdout. Compat inverts that. A failed run
 * writes NOTHING to stdout and describes itself on stderr, so a non-zero exit
 * means there is no report to judge. These tests pin that inversion, because
 * reusing the suites' gate here would read a failed run as a passing one.
 */

const OAK_REPORT = loadFixtureRaw('compat-local-oak-2026-08-15.json');
const UNAUTH_ENVELOPE = loadFixtureRaw('compat-unauth-alpha-2026-08-14.json');

interface FakeIoInput {
  readonly exitCode?: number;
  readonly stdout?: string;
  readonly stderr?: string;
  readonly launchError?: string;
  readonly retentionError?: string;
}

/** Branch-free fake: behaviour is the supplied record, never computed here. */
function fakeIo(input: FakeIoInput): { readonly io: CompatIo; readonly retained: string[] } {
  const retained: string[] = [];
  return {
    retained,
    io: {
      runMcpjam: () =>
        input.launchError === undefined
          ? ok({
              exitCode: input.exitCode ?? 0,
              stdout: input.stdout ?? '',
              stderr: input.stderr ?? '',
            })
          : err(new Error(input.launchError)),
      retainRawReport: (content) => {
        if (input.retentionError !== undefined) {
          return { ok: false, error: input.retentionError };
        }
        retained.push(content);
        return { ok: true, reportedPath: 'tmp/compat.json' };
      },
    },
  };
}

const TARGET = { target: 'https://example.test/mcp' };

/**
 * The target the committed Oak capture names. Pass-path tests request THIS
 * target, because a parsed report for a different target is (correctly) a
 * target-mismatch failure, exercised in its own describe below.
 */
const FIXTURE_TARGET = { target: 'http://localhost:3333/mcp' };

describe('composeCompatArgs — the invocation pins determinism and privacy', () => {
  it('pins the offline catalogue so only Oak’s own surface varies between runs', () => {
    expect(composeCompatArgs(TARGET)).toContain('--offline');
  });

  it('disables vendor telemetry rather than accepting its default', () => {
    expect(composeCompatArgs(TARGET)).toContain('--no-telemetry');
  });

  it('requests json explicitly rather than relying on the non-TTY default', () => {
    const args = composeCompatArgs(TARGET);

    expect(args).toContain('--format');
    expect(args[args.indexOf('--format') + 1]).toBe('json');
  });

  it('passes credentials when given, and omits the flag entirely when not', () => {
    expect(composeCompatArgs({ ...TARGET, credentialsFile: 'tmp/creds.json' })).toContain(
      '--credentials-file',
    );
    expect(composeCompatArgs(TARGET)).not.toContain('--credentials-file');
  });
});

describe('runCompat — a failed run can never read as a pass', () => {
  it('reads the observed unauthorised shape as a RUN failure, not a parse failure', () => {
    const { io } = fakeIo({ exitCode: 1, stdout: '', stderr: UNAUTH_ENVELOPE });

    const outcome = runCompat(io, TARGET);
    const reason = outcome.failureReasons.join(' ');

    // Asserting only `verdict === 'fail'` here would prove NOTHING: with the
    // exit-code gate removed, empty stdout still fails to parse, so the
    // verdict is `fail` either way. Caught by mutation check — the assertion
    // has to distinguish the two routes to the same verdict.
    expect(outcome.verdict).toBe('fail');
    expect(reason).toContain('operational failure');
    expect(reason).not.toContain('did not match the expected report shape');
  });

  it('preserves the vendor’s own code and message verbatim in the failure reason', () => {
    const { io } = fakeIo({ exitCode: 1, stdout: '', stderr: UNAUTH_ENVELOPE });

    const outcome = runCompat(io, TARGET);

    // The vendor classifies this 401 as INTERNAL_ERROR. Reporting our own
    // interpretation instead would put a guess where the evidence belongs.
    expect(outcome.failureReasons.join(' ')).toContain('INTERNAL_ERROR');
    expect(outcome.failureReasons.join(' ')).toContain('HTTP 401');
    // Containment alone cannot tell the parsed envelope from the raw-excerpt
    // fallback — the raw stderr contains the same strings. Caught by mutation
    // check: with the envelope parse deleted, only this assertion fails.
    expect(outcome.failureReasons.join(' ')).not.toContain('not a recognised error envelope');
  });

  it('redacts credentials the vendor reflects into a PARSED error message', () => {
    // The raw-stderr fallback redacts because it goes through boundedExcerpt.
    // The parsed path formats the vendor's own code and message, and for a
    // while did so unredacted — failure reasons reach stdout and summary.json,
    // outside the 0600 discipline that protects retained captures. A vendor
    // echoing the failing request puts a live bearer token there.
    const { io } = fakeIo({
      exitCode: 1,
      stdout: '',
      stderr: JSON.stringify({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'request failed: authorization: Bearer sk-live-SECRETVALUE123',
        },
      }),
    });

    const reason = runCompat(io, TARGET).failureReasons.join(' ');

    expect(reason).not.toContain('sk-live-SECRETVALUE123');
    expect(reason).toContain('[redacted]');
    // The diagnostic must survive its own redaction — a reason stripped of
    // the vendor's code would be safe and useless.
    expect(reason).toContain('INTERNAL_ERROR');
  });

  it('names a usage error distinctly, since exit 2 is our argv being wrong, not drift', () => {
    const { io } = fakeIo({
      exitCode: 2,
      stdout: '',
      stderr: '{"error":{"code":"USAGE_ERROR","message":"Unknown host id: nope"}}',
    });

    const outcome = runCompat(io, TARGET);

    expect(outcome.verdict).toBe('fail');
    expect(outcome.failureReasons.join(' ')).toContain('usage');
  });

  it('survives a failure whose stderr is not a parseable envelope', () => {
    const { io } = fakeIo({ exitCode: 1, stdout: '', stderr: 'segmentation fault' });

    const outcome = runCompat(io, TARGET);

    expect(outcome.verdict).toBe('fail');
    // The raw stderr still reaches the operator: an unparseable failure is
    // the case where diagnostics matter most.
    expect(outcome.failureReasons.join(' ')).toContain('segmentation fault');
  });

  it('names an exit outside the vendor vocabulary as tool failure, not a fact about the target', () => {
    const { io } = fakeIo({ exitCode: 127, stdout: '', stderr: 'node: command not found' });

    const outcome = runCompat(io, TARGET);

    expect(outcome.verdict).toBe('fail');
    expect(outcome.failureReasons.join(' ')).toContain("outside the vendor's documented codes");
  });

  it('fails when the child could not be launched at all', () => {
    const { io } = fakeIo({ launchError: 'spawn ENOENT' });

    const outcome = runCompat(io, TARGET);

    expect(outcome.verdict).toBe('fail');
    expect(outcome.failureReasons.join(' ')).toContain('ENOENT');
  });

  it('fails when the run exits zero but writes something unparseable to stdout', () => {
    const { io } = fakeIo({ exitCode: 0, stdout: 'not json at all' });

    expect(runCompat(io, TARGET).verdict).toBe('fail');
  });
});

describe('runCompat — evidence is retained before it is judged', () => {
  it('retains the raw stdout verbatim, so a schema rejection never destroys the capture', () => {
    const { io, retained } = fakeIo({ exitCode: 0, stdout: 'not json at all' });

    runCompat(io, TARGET);

    expect(retained).toEqual(['not json at all']);
  });

  it('fails when the capture parsed but could not be retained', () => {
    const { io } = fakeIo({ exitCode: 0, stdout: OAK_REPORT, retentionError: 'disk full' });

    const outcome = runCompat(io, FIXTURE_TARGET);

    // A capture nobody can read later is not a successful capture.
    expect(outcome.verdict).toBe('fail');
    expect(outcome.failureReasons.join(' ')).toContain('disk full');
  });
});

describe('runCompat — a capture of a different deployment can never read as this one', () => {
  it('fails a parsed report whose target is not the requested target, and keeps no host summary', () => {
    // The suites' worst-answer class: the report is well-formed, but it
    // describes ANOTHER deployment — false assurance about a live surface.
    const { io, retained } = fakeIo({ exitCode: 0, stdout: OAK_REPORT });

    const outcome = runCompat(io, TARGET);
    const reason = outcome.failureReasons.join(' ');

    expect(outcome.verdict).toBe('fail');
    expect(reason).toContain('http://localhost:3333/mcp');
    expect(reason).toContain('https://example.test/mcp');
    expect(outcome.hosts).toBeUndefined();
    // Retention still happened — the mismatched capture is the evidence.
    expect(retained).toHaveLength(1);
  });

  it('treats a trailing slash as the same target, not a mismatch', () => {
    const { io } = fakeIo({ exitCode: 0, stdout: OAK_REPORT });

    expect(runCompat(io, { target: 'http://localhost:3333/mcp/' }).verdict).toBe('pass');
  });

  it('fails a capture evaluated against the LIVE catalogue — --offline requested is not --offline honoured', () => {
    // The argv asks for the bundled catalogue; this proves the wrapper checks
    // the report's own word for it. A live-catalogue capture's verdicts can
    // drift with upstream publishes — the exact drift pinning exists to stop.
    const liveStdout = OAK_REPORT.replace('"catalogSource": "bundled"', '"catalogSource": "live"');
    const { io, retained } = fakeIo({ exitCode: 0, stdout: liveStdout });

    const outcome = runCompat(io, FIXTURE_TARGET);

    expect(outcome.verdict).toBe('fail');
    expect(outcome.failureReasons.join(' ')).toContain('not the pinned bundled');
    expect(outcome.hosts).toBeUndefined();
    // Retention still happened — the mismatched capture is the evidence.
    expect(retained).toHaveLength(1);
  });

  it('redacts a credential the vendor reflected into its reported target', () => {
    // The reported `target` is arbitrary server-controlled text and the
    // mismatch reason rides onto stdout — a server echoing the request URL
    // with a query-param token must be masked, not printed. (Security review
    // 2026-08-19: every vendor string on this path is redacted first.)
    const poisonedStdout = OAK_REPORT.replace(
      '"target": "http://localhost:3333/mcp"',
      '"target": "http://localhost:3333/mcp?access_token=ya29.SECRET"',
    );
    const { io } = fakeIo({ exitCode: 0, stdout: poisonedStdout });

    const reason = runCompat(io, TARGET).failureReasons.join(' ');

    expect(reason).not.toContain('ya29.SECRET');
    expect(reason).toContain('access_token=[redacted]');
  });
});

describe('runCompat — a good capture reports every host it saw', () => {
  it('passes and summarises the per-host verdicts', () => {
    const { io } = fakeIo({ exitCode: 0, stdout: OAK_REPORT });

    const outcome = runCompat(io, FIXTURE_TARGET);

    expect(outcome.verdict).toBe('pass');
    expect(outcome.hosts).toHaveLength(16);
    expect(outcome.hosts?.map((host) => host.hostId)).toContain('claude');
    // The vendor's named unknowns ride the summary: they are the caveat that
    // grades the verdicts beside them.
    expect(outcome.unknownDimensions).toBeDefined();
  });

  it('carries each host’s provenance, which grades how far its verdict can be trusted', () => {
    const { io } = fakeIo({ exitCode: 0, stdout: OAK_REPORT });

    const claude = runCompat(io, FIXTURE_TARGET).hosts?.find((host) => host.hostId === 'claude');

    expect(claude?.provenance).toBe('assumed');
  });
});

describe('composeCompatRunReport — the wrapper report redacts its target', () => {
  it('carries a clean target verbatim', () => {
    const { io } = fakeIo({ exitCode: 0, stdout: OAK_REPORT });
    const outcome = runCompat(io, FIXTURE_TARGET);

    expect(composeCompatRunReport(FIXTURE_TARGET.target, outcome).target).toBe(
      FIXTURE_TARGET.target,
    );
  });

  it('masks a credential in the target — the report rides to stdout and summary.json', () => {
    // The validator refuses every credential-bearing target, so this belt is
    // defence in depth against a future validation gap.
    const { io } = fakeIo({ exitCode: 0, stdout: OAK_REPORT });
    const outcome = runCompat(io, FIXTURE_TARGET);

    const report = composeCompatRunReport('ht!tp://user:s3cret@h/mcp', outcome);

    expect(report.target).not.toContain('s3cret');
    expect(report.target).toBe('ht!tp://[redacted]@h/mcp');
    expect(report.operation).toBe('compat');
  });
});
