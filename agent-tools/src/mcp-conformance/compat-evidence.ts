/**
 * The compat operation's evidence phase: invocation, the exit-code gate,
 * retention, and the parse. Sits beside `compat-run.ts` (which judges what
 * this yields) exactly as `suite-evidence.ts` sits beside `run-suite.ts`.
 *
 * THE GATE IS INVERTED relative to the suites', which is why it lives here
 * rather than reusing theirs. For a suite, a non-zero exit is verdict-neutral
 * data — the full report is on stdout either way — so that gate ignores the
 * exit code and always parses stdout. For compat, verified first-hand against
 * the pinned CLI (2026-08-14, unauthenticated run against the deployed
 * alpha): a failed run writes ZERO BYTES to stdout and puts a structured
 * envelope on stderr. Exit 1 therefore means "there is no report", and
 * running the suites' gate here would read a failed run as a passing one.
 *
 * Exit codes come from the vendor's own error constructors: 1 for an
 * operational error, 2 for a usage error. The distinction is worth keeping —
 * an operational failure is a fact about the target, a usage failure is a
 * fact about OUR argv, and the second is a bug in this wrapper.
 */
import { isErr, type Result } from '@oaknational/result';

import { boundedExcerpt, redactCredentials } from './bounded-excerpt.js';
import {
  compatErrorEnvelopeSchema,
  compatReportSchema,
  type CompatReport,
} from './compat-types.js';
import { type RetentionOutcome } from './io-port.js';
import { canonicalTarget, type McpjamSpawnResult } from './runner.js';

/** IO seam for the compat operation: spawn plus single-artefact retention. */
export interface CompatIo {
  readonly runMcpjam: (args: readonly string[]) => Result<McpjamSpawnResult, Error>;
  readonly retainRawReport: (content: string) => RetentionOutcome;
}

export interface CompatArgsInput {
  readonly target: string;
  readonly credentialsFile?: string;
}

/**
 * Compose the compat invocation.
 *
 * Three flags are load-bearing rather than stylistic. `--offline` pins the
 * host catalogue to the snapshot bundled with the resolved SDK, so the only
 * varying input between runs is Oak's own served surface — an upstream
 * catalogue publish cannot move a verdict underneath us. `--no-telemetry`
 * declines the vendor's default of sending anonymous usage data, which is a
 * choice this repo should make explicitly rather than inherit. The json
 * output format is requested rather than relied upon: it IS the non-TTY
 * default, but a default is not a contract, and a vendor changing it would
 * otherwise turn the parse boundary red for a reason nobody could see in our
 * argv.
 */
export function composeCompatArgs(input: CompatArgsInput): readonly string[] {
  return [
    'compat',
    '--url',
    input.target,
    '--offline',
    '--no-telemetry',
    ...(input.credentialsFile === undefined ? [] : ['--credentials-file', input.credentialsFile]),
    '--format',
    'json',
  ];
}

/** The gate's terminal states — what the run yielded, before any judgement. */
export type CompatEvidence =
  | { readonly kind: 'launch-failure'; readonly reason: string }
  | {
      readonly kind: 'run-failure';
      readonly reason: string;
      readonly exitCode: number | undefined;
    }
  | {
      readonly kind: 'unparseable';
      readonly reason: string;
      readonly exitCode: number | undefined;
      readonly retentionReasons: readonly string[];
      readonly rawReportPath?: string;
    }
  | {
      // The report parsed but describes a DIFFERENT deployment than the one
      // requested — the suites' worst-answer class ("false assurance about a
      // live surface"). Retained for diagnosis, never summarised as if it
      // were the requested target's verdict.
      readonly kind: 'target-mismatch';
      readonly reason: string;
      readonly exitCode: number | undefined;
      readonly retentionReasons: readonly string[];
      readonly rawReportPath?: string;
    }
  | {
      readonly kind: 'parsed';
      readonly report: CompatReport;
      readonly exitCode: number | undefined;
      readonly retentionReasons: readonly string[];
      readonly rawReportPath?: string;
    };

/** JSON.parse without the throw — an unparseable stream is a state, not an event. */
function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/**
 * The vendor's documented exit vocabulary is 1 for operational and 2 for
 * usage. Any other exit (127, a signal surviving as an odd code) is outside
 * that vocabulary, and
 * asserting vendor semantics there would be a guess — the suites' gate names
 * the same class "tool failure".
 */
function describeExitKind(exitCode: number | undefined): string {
  if (exitCode === 2) {
    return 'usage error (our invocation is wrong)';
  }
  if (exitCode === 1) {
    return 'operational failure';
  }
  return "exit outside the vendor's documented codes (tool failure)";
}

/**
 * Read the vendor's failure envelope, preserving its own words.
 *
 * The vendor classifies an authorisation failure as `INTERNAL_ERROR` rather
 * than `UNAUTHORIZED` (observed 2026-08-14). Reporting our interpretation
 * instead of theirs would put a guess where the evidence belongs, and would
 * silently drift the day their classification improves. An unparseable stderr
 * falls back to a bounded excerpt of the raw stream — the case where
 * diagnostics matter most is exactly the one where the shape is unexpected.
 *
 * Every vendor string here is redacted first: a parsed envelope is not safer
 * than a raw stream just because it parsed.
 */
function describeRunFailure(exitCode: number | undefined, stderr: string): string {
  const kind = describeExitKind(exitCode);
  const parsed = compatErrorEnvelopeSchema.safeParse(safeJsonParse(stderr));
  if (parsed.success) {
    // Redacted like any other vendor text reaching a failure reason: a parsed
    // envelope is not safer than a raw stream just because it parsed. A vendor
    // echoing the failing request puts a live token in `message`.
    const code = redactCredentials(parsed.data.error.code);
    const message = redactCredentials(parsed.data.error.message);
    return `mcpjam compat ${kind}, exit ${String(exitCode ?? 'unknown')}: ${code} — ${message}`;
  }
  return `mcpjam compat ${kind}, exit ${String(exitCode ?? 'unknown')}, and its stderr was not a recognised error envelope${boundedExcerpt('stderr', stderr)}`;
}

/**
 * Retention precedes parsing, so a schema rejection never destroys the
 * capture that would explain it — and parsing precedes the target-identity
 * check, because only a parsed report names the target it describes.
 */
function retainThenParse(
  io: CompatIo,
  stdout: string,
  exitCode: number | undefined,
  requestedTarget: string,
): CompatEvidence {
  const retained = io.retainRawReport(stdout);
  const retentionReasons = retained.ok
    ? []
    : [`the compat report could not be retained: ${retained.error}`];
  const retainedPath = retained.ok ? { rawReportPath: retained.reportedPath } : {};
  const parsed = compatReportSchema.safeParse(safeJsonParse(stdout));
  if (!parsed.success) {
    return {
      kind: 'unparseable',
      // The Zod message embeds vendor stdout in one narrow way: an
      // unrecognized-keys issue on this .strict() schema echoes the offending
      // KEY names (values are never echoed — verified against the pinned Zod
      // 4, 2026-08-19). A key name is vendor text, so it is redacted like
      // every other vendor string reaching a reason.
      reason: `mcpjam compat exited 0 but its stdout did not match the expected report shape: ${redactCredentials(parsed.error.message)}`,
      exitCode,
      retentionReasons,
      ...retainedPath,
    };
  }
  // The suites' worst-answer guard, applied to compat's single target field:
  // a capture of a DIFFERENT deployment is false assurance about a live
  // surface, so it must never flow into per-host verdicts.
  if (canonicalTarget(parsed.data.target) !== canonicalTarget(requestedTarget)) {
    return {
      kind: 'target-mismatch',
      // Both targets are redacted before the reason is composed: the vendor's
      // is arbitrary server-controlled text; the requested one has already
      // been validated credential-free, so its redaction is pure defence in
      // depth against a future validation gap.
      reason: `mcpjam reported target ${JSON.stringify(redactCredentials(parsed.data.target))} but the run requested ${JSON.stringify(redactCredentials(requestedTarget))} — this capture is of a different deployment; do not read its verdicts as the requested surface's`,
      exitCode,
      retentionReasons,
      ...retainedPath,
    };
  }
  return { kind: 'parsed', report: parsed.data, exitCode, retentionReasons, ...retainedPath };
}

/** Spawn, gate on the exit code, then retain and parse. */
export function gatherCompatEvidence(io: CompatIo, input: CompatArgsInput): CompatEvidence {
  const spawned = io.runMcpjam(composeCompatArgs(input));
  if (isErr(spawned)) {
    return {
      kind: 'launch-failure',
      reason: `mcpjam compat could not run: ${spawned.error.message}`,
    };
  }
  const { exitCode, stdout, stderr } = spawned.value;
  // THE INVERSION. A non-zero exit means no report exists, so there is
  // nothing to retain and nothing to parse — the failure IS the evidence.
  // Accepted loss on this path: the envelope's `details` payload (admitted by
  // the schema, never read) is not retained anywhere; the vendor's code and
  // message ride the reason verbatim, and retaining vendor-internal
  // diagnostics from an authed run would grow the credential-bearing surface
  // for a field nobody consumes.
  return exitCode === 0
    ? retainThenParse(io, stdout, exitCode, input.target)
    : { kind: 'run-failure', reason: describeRunFailure(exitCode, stderr), exitCode };
}
