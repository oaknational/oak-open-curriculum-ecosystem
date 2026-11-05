import type { IAvailableTranspiler, ICruiseOptions, ISummary } from 'dependency-cruiser';

/**
 * The dependency-cruiser gate's verdict, read from the cruise's own summary
 * rather than from an exit code.
 *
 * dependency-cruiser's command line exits with its count of error-severity
 * violations and nothing else. A cruise that finds no supported TypeScript
 * compiler (it supports `typescript` below 7.0, so a plain TypeScript 7 bump
 * is enough) scans none of this TypeScript estate, reports no violations over
 * the JavaScript modules left, prints an environment warning, and exits 0.
 * The summary records what that exit code drops: the transpilers the cruise
 * found, the environment issues it raised, and its violation count at every
 * severity. Each is a gate failure here. Pure: summary or options in, failure
 * lines out.
 *
 * @packageDocumentation
 */

/** The parts of a cruise summary the verdict reads. */
export interface DepcruiseSummaryEvidence {
  readonly error: ISummary['error'];
  readonly warn: ISummary['warn'];
  readonly info: ISummary['info'];
  readonly ignore: ISummary['ignore'];
  readonly environment: Pick<ISummary['environment'], 'transpilersFound' | 'issues'>;
}

/** The failure line for a cruise that ran without a supported TypeScript compiler. */
function missingTypeScriptCompiler(typescript: IAvailableTranspiler | undefined): string {
  const supported = typescript?.version ?? 'an unrecorded range';
  return (
    `no supported TypeScript compiler (dependency-cruiser supports typescript ${supported}), ` +
    'so the cruise parsed none of the TypeScript estate'
  );
}

/** One failure line per severity with a non-zero violation count. */
function violationCountFailures(summary: DepcruiseSummaryEvidence): readonly string[] {
  const counts = [
    { count: summary.error, line: 'error-severity violations' },
    { count: summary.warn, line: 'warn-severity violations: warnings are fatal' },
    { count: summary.info, line: 'info-severity violations: the report lists them, so they fail' },
    {
      count: summary.ignore,
      line: 'ignored violations (an ignore-severity rule or a known-violations baseline): nothing is grandfathered',
    },
  ];
  return counts
    .filter(({ count }) => count > 0)
    .map(({ count, line }) => `${String(count)} ${line}`);
}

/**
 * Every reason the cruise cannot pass.
 *
 * The violation counts are the cruise's own, which group a cycle into one
 * violation; the report text can list the same cycle edge by edge.
 *
 * @param summary - The cruise result's summary.
 * @returns One line per failure; empty when the cruise passes.
 */
export function depcruiseSummaryFailures(summary: DepcruiseSummaryEvidence): readonly string[] {
  const typescript = summary.environment.transpilersFound.find(
    (transpiler) => transpiler.name === 'typescript',
  );
  const compilerFailures =
    typescript?.available === true ? [] : [missingTypeScriptCompiler(typescript)];
  const issueFailures = (summary.environment.issues ?? []).map(
    (issue) =>
      `dependency-cruiser raised the environment issue ${issue.name} (described in the report)`,
  );
  return [...compilerFailures, ...issueFailures, ...violationCountFailures(summary)];
}

/**
 * The configuration keys the dependency-cruiser command line loads from their
 * own files before cruising, and the gate does not.
 */
const OPTIONS_THE_GATE_DOES_NOT_LOAD = ['webpackConfig', 'babelConfig'] as const;

/**
 * Configuration the gate would otherwise ignore. The command line reads a
 * webpack or babel configuration into the cruise; the gate passes neither, so
 * naming one fails instead of cruising with less than the configuration says.
 *
 * @param options - The cruise options read from the configuration file.
 * @returns One line per configured key the gate does not load; empty when there is none.
 */
export function unloadedCruiseOptionFailures(
  options: Pick<ICruiseOptions, (typeof OPTIONS_THE_GATE_DOES_NOT_LOAD)[number]>,
): readonly string[] {
  return OPTIONS_THE_GATE_DOES_NOT_LOAD.filter((key) => options[key] !== undefined).map(
    (key) =>
      `the configuration names ${key}, which the command line loads and this gate does not; ` +
      'load it in repo-check-depcruise.ts before configuring it',
  );
}
