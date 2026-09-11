/**
 * The evidence phase for `agent-tools mcp-conformance` (MCP-189): spawn →
 * retain verbatim → operational-exit gate → parse. Baseline-independent;
 * `run-suite.ts` consumes the terminal states this module produces.
 *
 * Vocabulary: EVIDENCE means retained artefacts (the verbatim raw
 * reports); bounded stream excerpts riding failure reasons are
 * DIAGNOSTICS, not evidence. "Launch failure" includes signal/timeout
 * death (see `node-io.ts`) — retention cannot run on that path, so only
 * bounded diagnostics of both streams survive it.
 */
import { err, isErr, type Result } from '@oaknational/result';

import { parseWithSchema } from '../core/schema-parse.js';
import { boundedExcerpt, redactCredentials } from './bounded-excerpt.js';
import { type McpConformanceIo, type McpConformanceRunInput } from './io-port.js';
import { composeSuiteArgs, findTargetMismatch, SUITE_REPORT_KIND } from './runner.js';
import { composeEvidence, type EvidenceFields } from './suite-outcome.js';
import { mcpjamReportSchema, type ConformanceSuite, type McpjamReport } from './types.js';

/**
 * The evidence phase's terminal states: launch failed, exited outside the
 * vendor's verdict codes, ran-but-unparseable, or parsed.
 */
export type SuiteEvidence =
  | { readonly kind: 'launch-failure'; readonly reason: string }
  | {
      readonly kind: 'operational-exit';
      readonly reason: string;
      readonly retentionReasons: readonly string[];
      readonly evidence: EvidenceFields;
    }
  | {
      readonly kind: 'unparseable';
      readonly reason: string;
      readonly retentionReasons: readonly string[];
      readonly evidence: EvidenceFields;
    }
  | {
      readonly kind: 'parsed';
      readonly report: McpjamReport;
      readonly retentionReasons: readonly string[];
      readonly evidence: EvidenceFields;
    };

function parseRawReport(
  suite: ConformanceSuite,
  stdout: string,
  requestedTarget: string,
): Result<McpjamReport, Error> {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(stdout);
  } catch (error) {
    // The syntax error is the operator-facing cause; the raw is already retained.
    return err(
      new Error(
        `mcpjam stdout for the "${suite}" suite was not JSON: ${
          error instanceof Error ? error.message : String(error)
        }`,
      ),
    );
  }
  const parsed = parseWithSchema({
    label: `mcpjam json-summary report ("${suite}" suite)`,
    schema: mcpjamReportSchema,
    value: parsedJson,
  });
  if (isErr(parsed)) {
    return parsed;
  }
  // Identity check at the parse boundary: a structurally valid report from a
  // DIFFERENT subcommand would otherwise be retained and verdicted under the
  // requested suite's name.
  const expectedKind = SUITE_REPORT_KIND[suite];
  if (parsed.value.kind !== expectedKind) {
    return err(
      new Error(
        `mcpjam returned a "${parsed.value.kind}" report for the "${suite}" suite (expected "${expectedKind}") — the vendor dispatched a different subcommand; do not author a baseline from this capture`,
      ),
    );
  }
  // Provenance, the identity check's sibling: a capture of a DIFFERENT
  // deployment would otherwise match the (target-agnostic) baseline and be
  // emitted under the requested target — false assurance about a live surface.
  const targetMismatch = findTargetMismatch(parsed.value, requestedTarget);
  if (targetMismatch !== undefined) {
    return err(new Error(`the "${suite}" suite: ${targetMismatch}`));
  }
  return parsed;
}

/**
 * Exit codes 0 and 1 are the vendor's verdict-neutral operational normal
 * (verified first-hand: a failing suite exits 1 while still writing the
 * full report). Anything else — usage error, crash, missing subcommand —
 * is the TOOL failing, and treating it as verdict-neutral would let a
 * broken invocation read as a conformance run. Retention has already run
 * by the time this gate fires, so whatever the child wrote survives as
 * evidence. Returns undefined for the verdict-neutral codes.
 */
function operationalExit(
  suite: ConformanceSuite,
  exitCode: number | undefined,
  stderr: string,
  retentionReasons: readonly string[],
  evidence: EvidenceFields,
): SuiteEvidence | undefined {
  if (exitCode === 0 || exitCode === 1) {
    return undefined;
  }
  return {
    kind: 'operational-exit',
    reason:
      `mcpjam exited operationally (exit ${exitCode === undefined ? 'unknown' : String(exitCode)}) ` +
      `for the "${suite}" suite — outside the vendor's verdict codes 0 and 1, so this is a tool ` +
      `failure, not a conformance verdict${boundedExcerpt('mcpjam stderr', stderr)}`,
    retentionReasons,
    evidence,
  };
}

/** Spawn, retain verbatim, gate on exit code, parse — baseline-independent. */
export function gatherSuiteEvidence(
  io: McpConformanceIo,
  input: McpConformanceRunInput,
  suite: ConformanceSuite,
): SuiteEvidence {
  const spawn = io.runMcpjam(
    composeSuiteArgs({
      suite,
      mode: input.mode,
      target: input.target,
      ...(input.credentialsFile === undefined ? {} : { credentialsFile: input.credentialsFile }),
    }),
  );
  if (isErr(spawn)) {
    return {
      kind: 'launch-failure',
      reason: `mcpjam could not be launched for the "${suite}" suite: ${spawn.error.message}`,
    };
  }
  const retention = io.retainRawReport(suite, spawn.value.stdout);
  const retentionReasons = retention.ok ? [] : [`raw-report retention failed: ${retention.error}`];
  const evidence = composeEvidence(retention, spawn.value);
  const operational = operationalExit(
    suite,
    spawn.value.exitCode,
    spawn.value.stderr,
    retentionReasons,
    evidence,
  );
  if (operational !== undefined) {
    return operational;
  }
  const parsed = parseRawReport(suite, spawn.value.stdout, input.target);
  if (isErr(parsed)) {
    const retainedNote = retention.ok ? ` — raw output retained at ${retention.reportedPath}` : '';
    return {
      kind: 'unparseable',
      // The parse error embeds vendor stdout: a JSON.parse SyntaxError quotes
      // the snippet it choked on, and a Zod unrecognized-keys issue echoes the
      // offending key. Vendor text, so redacted like every other string
      // reaching a reason — this one rides to stdout and CI job logs.
      reason: `${redactCredentials(parsed.error.message)}${retainedNote}${boundedExcerpt('mcpjam stderr', spawn.value.stderr)}`,
      retentionReasons,
      evidence,
    };
  }
  return { kind: 'parsed', report: parsed.value, retentionReasons, evidence };
}
