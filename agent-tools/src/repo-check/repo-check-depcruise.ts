import { readFileSync } from 'node:fs';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { cruise, format, type ICruiseOptions, type ITranspileOptions } from 'dependency-cruiser';
import extractDepcruiseOptions from 'dependency-cruiser/config-utl/extract-depcruise-options';
import extractTSConfig from 'dependency-cruiser/config-utl/extract-ts-config';

import { writeErrorLine } from '../core/terminal-output.js';

import { cruiseRootsFromWorkspaceManifest } from './repo-check-depcruise-roots.js';
import {
  depcruiseSummaryFailures,
  unloadedCruiseOptionFailures,
} from './repo-check-depcruise-verdict.js';

/**
 * The dependency-cruiser gate: the cruise run in-process through the
 * dependency-cruiser API, so the verdict reads the cruise result and not only
 * the exit code the command line would return.
 *
 * For the options this repository's configuration uses, the cruise is the
 * command line's: the root `.dependency-cruiser.mjs` read as cruise options,
 * the `tsConfig` it names parsed with dependency-cruiser's own extractor, and
 * the workspace directories `pnpm-workspace.yaml` declares, computed from the
 * manifest (`repo-check-depcruise-roots.ts`) so no host's list is pinned here.
 * The command line also loads a
 * `webpackConfig` or `babelConfig`; the gate does not, so it refuses a
 * configuration that names either. The report text is the `err` reporter's,
 * produced by `format`, which re-summarises without the rule set and so lists a
 * cycle edge by edge where the command line prints the cycle path. The verdict
 * comes from the cruise's own summary (`repo-check-depcruise-verdict.ts`),
 * whose counts group each cycle once. Paths are relative to the working
 * directory, which agent-tools' `repo-check` script sets to the repository root
 * (`cd ..`).
 *
 * @packageDocumentation
 */

/**
 * The configuration file, relative to the repository root. The `./` prefix is
 * load-bearing: dependency-cruiser resolves the name like a module specifier,
 * so a bare `.dependency-cruiser.mjs` fails to resolve.
 */
const CONFIG_FILE = './.dependency-cruiser.mjs';

/** The workspace manifest the cruise roots are computed from, relative to the repository root. */
const WORKSPACE_MANIFEST = 'pnpm-workspace.yaml';

/**
 * The dependency-cruiser calls and the output streams the gate composes,
 * injected so the composition is testable without reading the configuration
 * or cruising the repository.
 */
export interface DepcruiseGateRuntime {
  /** Read the workspace manifest's text. */
  readonly readWorkspaceManifest: () => string;
  /** Read the configuration file as cruise options. */
  readonly extractDepcruiseOptions: typeof extractDepcruiseOptions;
  /** Parse the tsconfig the options name. */
  readonly extractTSConfig: typeof extractTSConfig;
  /** Cruise the given roots. */
  readonly cruise: typeof cruise;
  /** Format a cruise result with a reporter. */
  readonly format: typeof format;
  /** Write the report text as the reporter produced it. */
  readonly writeReport: (text: string) => void;
  /** Write one failure line. */
  readonly writeFailure: (line: string) => void;
}

/** The real dependency-cruiser API, the report on stdout and the failure lines on stderr. */
const defaultDepcruiseGateRuntime: DepcruiseGateRuntime = {
  readWorkspaceManifest: () => readFileSync(WORKSPACE_MANIFEST, 'utf8'),
  extractDepcruiseOptions,
  extractTSConfig,
  cruise,
  format,
  writeReport: (text) => {
    process.stdout.write(text);
  },
  writeFailure: writeErrorLine,
};

/** Write each failure line under the gate's name (on stderr, by default). */
function reportFailures(runtime: DepcruiseGateRuntime, failures: readonly string[]): void {
  for (const failure of failures) {
    runtime.writeFailure(`repo-check depcruise-gate: ${failure}`);
  }
}

/** What a cruise needs, read before it runs: the roots, the options and the transpile options. */
interface CruiseInputs {
  readonly roots: readonly string[];
  readonly options: ICruiseOptions;
  readonly transpileOptions: ITranspileOptions;
}

/** Read the cruise inputs from the manifest and the configuration, or the failure lines that stop the gate. */
async function readCruiseInputs(
  runtime: DepcruiseGateRuntime,
): Promise<Result<CruiseInputs, readonly string[]>> {
  const roots = cruiseRootsFromWorkspaceManifest(runtime.readWorkspaceManifest());
  if (isErr(roots)) {
    return err([roots.error]);
  }
  const options = await runtime.extractDepcruiseOptions(CONFIG_FILE);
  const optionFailures = unloadedCruiseOptionFailures(options);
  if (optionFailures.length > 0) {
    return err(optionFailures);
  }
  const tsConfigFileName = options.tsConfig?.fileName;
  const transpileOptions =
    tsConfigFileName === undefined ? {} : { tsConfig: runtime.extractTSConfig(tsConfigFileName) };
  return ok({ roots: roots.value, options, transpileOptions });
}

/** Cruise the workspaces, print the `err` report, and fail on any violation, warning or partial cruise. */
export async function runDepcruiseGate(
  runtime: DepcruiseGateRuntime = defaultDepcruiseGateRuntime,
): Promise<number> {
  const inputs = await readCruiseInputs(runtime);
  if (isErr(inputs)) {
    reportFailures(runtime, inputs.error);
    return 1;
  }
  const { roots, options, transpileOptions } = inputs.value;
  const cruised = await runtime.cruise([...roots], options, {}, transpileOptions);
  if (typeof cruised.output === 'string') {
    // No outputType was requested, so the API returns the result object; a
    // string here means the options named a reporter, and there is no summary
    // to read.
    reportFailures(runtime, ['the cruise returned reporter text, not a result to read']);
    return 1;
  }

  const report = await runtime.format(cruised.output, { outputType: 'err' });
  if (typeof report.output !== 'string') {
    reportFailures(runtime, ['the err reporter returned no report text']);
    return 1;
  }
  runtime.writeReport(report.output);

  const failures = depcruiseSummaryFailures(cruised.output.summary);
  reportFailures(runtime, failures);
  return failures.length === 0 ? 0 : 1;
}
