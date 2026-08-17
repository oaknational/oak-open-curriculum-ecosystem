/**
 * The compat operation: capture a per-host compatibility report for a running
 * MCP surface.
 *
 * CAPTURE ONLY, deliberately. This route exists to prove what a DEPLOYED
 * surface actually serves, which is why it needs credentials and cannot run
 * unattended. The per-commit gate is a separate, cheaper thing: an in-repo
 * test that evaluates the served tool surface directly, with no server (see
 * the app's `served-surface/` tests). Making this route a second gate would
 * mean a committed snapshot to maintain, a re-seed decision every time it
 * moved, and adjudicating false reds from the vendor's widget scan — for a
 * question the per-commit test already answers.
 *
 * So this reads, retains and reports. A human reads the report.
 *
 * `compat-evidence.ts` owns spawn → exit-code gate → retain → parse, and
 * documents why that gate is inverted relative to the suites'.
 */
import { gatherCompatEvidence, type CompatArgsInput, type CompatIo } from './compat-evidence.js';
import { type CompatReport } from './compat-types.js';

/** One input concept: the capture's argv IS the run's input, so the alias. */
export type CompatRunInput = CompatArgsInput;

type CompatHost = CompatReport['hosts'][number];

export interface CompatOutcome {
  readonly verdict: 'pass' | 'fail';
  readonly failureReasons: readonly string[];
  /** Per-host verdicts, present only when the run produced a usable report. */
  readonly hosts?: readonly {
    readonly hostId: string;
    readonly verdict: CompatHost['verdict'];
    readonly provenance: CompatHost['provenance'];
    readonly findingCount: number;
  }[];
  /**
   * The vendor's named unknowns (a capped tool list, an unreadable widget) —
   * carried into the summary because they are the caveat that grades the
   * per-host verdicts beside them; a reader must not need the raw capture to
   * learn the verdicts were qualified.
   */
  readonly unknownDimensions?: readonly string[];
  readonly rawReportPath?: string;
  readonly mcpjamExitCode?: number;
}

/**
 * The report-data fields every ran-at-all outcome carries. Absent keys are
 * omitted rather than set undefined, so the emitted JSON never asserts a path
 * or an exit code the run did not produce.
 */
function retainedFields(evidence: {
  readonly exitCode?: number;
  readonly rawReportPath?: string;
}): Pick<CompatOutcome, 'mcpjamExitCode' | 'rawReportPath'> {
  return {
    ...(evidence.exitCode === undefined ? {} : { mcpjamExitCode: evidence.exitCode }),
    ...(evidence.rawReportPath === undefined ? {} : { rawReportPath: evidence.rawReportPath }),
  };
}

/**
 * Capture a compat report.
 *
 * Passes when the run produced a parseable report AND that report was
 * retained. A failed run can never read as a pass: the evidence gate returns
 * no report on a non-zero exit, and every non-parsed state fails here.
 *
 * Failure reasons are a LIST, never joined, so simultaneous problems all
 * surface — a run can fail its parse AND its retention, and an operator
 * should see both at once rather than discovering the second after fixing
 * the first.
 */
export function runCompat(io: CompatIo, input: CompatRunInput): CompatOutcome {
  const evidence = gatherCompatEvidence(io, input);
  switch (evidence.kind) {
    case 'launch-failure':
      return { verdict: 'fail', failureReasons: [evidence.reason] };
    case 'run-failure':
      return {
        verdict: 'fail',
        failureReasons: [evidence.reason],
        ...retainedFields(evidence),
      };
    // A mismatched capture fails identically to an unparseable one: it is
    // retained for diagnosis, but its verdicts describe a DIFFERENT
    // deployment, so no host summary may flow from it.
    case 'unparseable':
    case 'target-mismatch':
      return {
        verdict: 'fail',
        failureReasons: [evidence.reason, ...evidence.retentionReasons],
        ...retainedFields(evidence),
      };
    case 'parsed':
      return {
        verdict: evidence.retentionReasons.length === 0 ? 'pass' : 'fail',
        failureReasons: evidence.retentionReasons,
        hosts: evidence.report.hosts.map((host) => ({
          hostId: host.hostId,
          verdict: host.verdict,
          provenance: host.provenance,
          findingCount: host.findings.length,
        })),
        unknownDimensions: evidence.report.unknownDimensions,
        ...retainedFields(evidence),
      };
    default: {
      // Compile-time exhaustiveness over the gate's terminal states.
      const exhaustive: never = evidence;
      return exhaustive;
    }
  }
}
