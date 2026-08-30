/**
 * MCPJam invocation surface for `mcp-conformance` (MCP-189): the spawn seam
 * type and the pure per-suite argv composition.
 *
 * The child is always the lockfile-installed `@mcpjam/cli` bin run under the
 * current Node executable — never `npx`, never a PATH lookup — so every run
 * is reproducible from the lockfile (works for any user, any machine).
 *
 * Exit-code contract (vendor shape verified first-hand 2026-07-26 on 3.15.2):
 * a failing suite exits 1 while writing the full json-summary document to
 * stdout, so a non-zero child exit is DATA, not an error. The seam returns
 * `err` only when the child could not be launched or died without producing
 * a result (spawn error, signal, timeout); the wrapper's own verdict derives
 * solely from parse + baseline comparison.
 */
import { type Result } from '@oaknational/result';

import { redactCredentials } from './bounded-excerpt.js';
import { type ConformanceMode, type ConformanceSuite } from './types.js';

/** What a completed child run yields, whatever its exit code. */
export interface McpjamSpawnResult {
  readonly exitCode: number | undefined;
  readonly stdout: string;
  readonly stderr: string;
}

/**
 * The spawn seam: run the lockfile-installed mcpjam bin with `args`.
 * `err` means launch failure (ENOENT, signal, timeout) — never a failing
 * suite, which completes with `exitCode: 1` and full stdout.
 */
export type McpjamRunner = (args: readonly string[]) => Result<McpjamSpawnResult, Error>;

/** The MCP protocol revision the conformance runs pin (spec 2025-11-25). */
const MCP_PROTOCOL_VERSION = '2025-11-25';

/** The suites the unattended (headless, credential-free) plan runs. */
export const UNATTENDED_SUITES: readonly ConformanceSuite[] = ['protocol', 'oauth'];

/**
 * The `kind` each suite's json-summary report declares, observed first-hand
 * from MCPJam 3.15.2 captures against the deployed surface.
 *
 * Lives beside `composeSuiteArgs` because both express the same concern: how
 * a requested suite maps onto a vendor subcommand and what that subcommand is
 * expected to answer with. A mismatch means the vendor dispatched elsewhere —
 * an in-range CLI update re-pointing a subcommand is the realistic path.
 * Unchecked, a `--seed` capture of the wrong suite is retained under the
 * requested suite's name and becomes the baseline an operator authors from.
 */
export const SUITE_REPORT_KIND: Readonly<Record<ConformanceSuite, string>> = {
  protocol: 'protocol-conformance',
  apps: 'apps-conformance',
  oauth: 'oauth-conformance',
};

/**
 * Report-vs-REQUEST target identity — the sibling of {@link SUITE_REPORT_KIND},
 * living here for the same reason: what the dispatched subcommand is expected
 * to answer with.
 *
 * Baselines stay target-agnostic. This compares the report against what the
 * CALLER asked for, never against the baseline, so one baseline still verdicts
 * alpha and production alike.
 *
 * An ABSENT `target` is unverifiable, not a mismatch: the vendor types the
 * field optional, and refusing a report it is entitled to emit would be a
 * self-inflicted outage. A PRESENT value naming a different endpoint is the
 * loud case — baseline comparison would otherwise pass and the aggregate would
 * label another deployment's result with the requested target. That is false
 * assurance about a live surface, the worst answer this tool can give.
 */
export function findTargetMismatch(
  report: { readonly groups: readonly { readonly target?: string }[] },
  requestedTarget: string,
): string | undefined {
  const wanted = canonicalTarget(requestedTarget);
  const mismatched = report.groups
    .map((group) => group.target)
    .filter((target): target is string => target !== undefined)
    .find((target) => canonicalTarget(target) !== wanted);
  if (mismatched === undefined) {
    return undefined;
  }
  // Vendor-reported and requested targets both redacted before the reason is
  // composed — this reason rides onto stdout and into CI job logs (the suites
  // run unattended in CI), where a server reflecting a credential into its
  // reported target would otherwise land unmasked.
  return `mcpjam reported target ${JSON.stringify(redactCredentials(mismatched))} but the run requested ${JSON.stringify(redactCredentials(requestedTarget))} — this capture is of a different deployment; do not verdict it or author a baseline from it`;
}

/**
 * URL-normalised comparison: scheme/host case and a trailing slash are not
 * differences. An unparseable value falls back to a trimmed literal compare
 * rather than throwing — a malformed target must surface as a mismatch, never
 * as a crash inside the parse boundary.
 *
 * Exported at its second consumer: the compat operation's evidence gate runs
 * the same identity check over its report's single `target` field.
 */
export function canonicalTarget(value: string): string {
  const parsed = URL.parse(value);
  return parsed === null ? value.trim() : parsed.href.replace(/\/$/u, '');
}

/** Inputs to one suite's argv composition. */
export interface SuiteArgsInput {
  readonly suite: ConformanceSuite;
  readonly mode: ConformanceMode;
  readonly target: string;
  readonly credentialsFile?: string;
}

const SUITE_ARG_BUILDERS: Readonly<
  Record<ConformanceSuite, (input: SuiteArgsInput) => readonly string[]>
> = {
  protocol: (input) => [
    'protocol',
    'conformance',
    '--url',
    input.target,
    ...credentialArgs(input),
    '--reporter',
    'json-summary',
  ],
  apps: (input) => [
    'apps',
    'conformance',
    '--url',
    input.target,
    ...credentialArgs(input),
    '--reporter',
    'json-summary',
  ],
  oauth: (input) => [
    'oauth',
    'conformance',
    '--url',
    input.target,
    '--protocol-version',
    MCP_PROTOCOL_VERSION,
    '--registration',
    'dcr',
    '--auth-mode',
    input.mode === 'unattended' ? 'headless' : 'interactive',
    ...(input.mode === 'attended' ? ['--conformance-checks'] : []),
    '--reporter',
    'json-summary',
  ],
};

function credentialArgs(input: SuiteArgsInput): readonly string[] {
  return input.credentialsFile === undefined ? [] : ['--credentials-file', input.credentialsFile];
}

/**
 * Compose the mcpjam argv for one suite run.
 *
 * Unattended oauth pins `--auth-mode headless` and omits
 * `--conformance-checks`: the negative probes are gated upstream on a
 * fully-successful attended flow (verified in the resolved SDK source,
 * 2026-07-26), so requesting them headless is dead weight that misstates
 * intent. Attended oauth requests them (`--auth-mode interactive`).
 */
export function composeSuiteArgs(input: SuiteArgsInput): readonly string[] {
  return SUITE_ARG_BUILDERS[input.suite](input);
}
