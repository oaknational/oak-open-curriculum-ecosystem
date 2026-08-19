/**
 * Aggregation for `agent-tools mcp-conformance` (MCP-189). Two named
 * operations, dispatched by `McpConformanceRunInput.operation`:
 *
 * VERDICT (default): every suite's baseline is resolved UP FRONT — a
 * missing or unusable baseline fails the whole run in milliseconds with no
 * network contact (fail-fast entry validation; the failure names the
 * `--seed` path). With baselines validated, each suite runs through the
 * spawn seam, retains its raw stdout VERBATIM before any parsing (a schema
 * rejection must never destroy the evidence), parses at the strict
 * boundary, and compares against its baseline.
 *
 * SEED (`--seed`): capture-only. Each suite runs and retains its raw
 * report — the observation seed for authoring baselines — with no
 * comparison; the operation passes iff every capture succeeded.
 *
 * Failure reasons are a LIST (never joined), so simultaneous problems all
 * surface. A failing, unlaunchable, or unparseable suite does not abort
 * the remaining suites, and the aggregate exit code is 0 iff every suite
 * verdict is `pass`. The per-suite pipelines live in `run-suite.ts`; the
 * IO ports in `io-port.ts`; outcome composition in `suite-outcome.ts`.
 */
import { redactCredentials } from './bounded-excerpt.js';
import { type McpConformanceIo, type McpConformanceRunInput } from './io-port.js';
import { runSeedSuites, runVerdictSuites } from './run-suite.js';
import { type ConformanceRunReport } from './types.js';

/** Run every requested suite under the input's operation and aggregate. */
export function runMcpConformance(
  io: McpConformanceIo,
  input: McpConformanceRunInput,
): { readonly report: ConformanceRunReport; readonly exitCode: 0 | 1 } {
  const suites =
    input.operation === 'seed' ? runSeedSuites(io, input) : runVerdictSuites(io, input);
  // `every` over an empty plan is vacuously true: a run that launched nothing
  // would report pass and exit 0. This is the same vacuous-success bar the
  // module already applies to zero-case reports and empty expectation sets.
  const verdict =
    suites.length > 0 && suites.every((outcome) => outcome.verdict === 'pass') ? 'pass' : 'fail';
  return {
    report: {
      schema_version: '1.0.0',
      operation: input.operation,
      // Redacted on the way out, like every target an operation emits: a no-op
      // for a validated target, the belt for one that did not parse and so
      // escaped the validator's inspection. This report rides to stdout and
      // into CI job logs.
      target: redactCredentials(input.target),
      mode: input.mode,
      suites,
      verdict,
    },
    exitCode: verdict === 'pass' ? 0 : 1,
  };
}
