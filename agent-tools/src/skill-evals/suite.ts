import { basename, dirname, posix } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import type { Ablation } from './args.js';
import {
  finalAnswerOf,
  parseRunnerResult,
  planEvidenceCopies,
  scrubMachinePaths,
  type EvidenceCopy,
  type PathReplacement,
  type RunnerResult,
} from './evidence.js';
import type { SuiteRecord } from './manifest.js';
import type { SkillEvalsSeams } from './seams.js';

/**
 * One suite invocation of the runner and the evidence it leaves.
 *
 * @remarks
 * The runner is asked for `--threshold 0`, so its exit code carries
 * operational meaning only: 0 ran, 2 the cost ceiling, anything else a
 * failure. Whether a case passed is read from the result, never from the
 * exit code; a run whose cases fall short is exactly the run this module
 * exists to record.
 *
 * @packageDocumentation
 */

/**
 * The binary the runner is, resolved by name on the operator's PATH.
 *
 * @remarks
 * The estate resolves git and gh by fixed absolute paths (SonarCloud S4036).
 * The host runner is a per-user install under the operator's home, which the
 * estate's allow-lists exclude by doctrine, and the run already loads the
 * repository's own skills into an agent under `--trust-plugin`: PATH
 * resolution adds no trust boundary the run does not already cross. A
 * Sonar finding on this line is dispositioned with this text.
 */
export const RUNNER_COMMAND = 'claude';

/** The two declared suites: the cases, and the trigger examples. */
export type SuiteName = 'cases' | 'triggers';

/** What one suite invocation needs. */
export interface SuiteOptions {
  readonly ablation: Ablation;
  readonly runs: number;
  readonly maxCostUsd: number | undefined;
  readonly judgeModel: string | undefined;
  readonly model: string | undefined;
  readonly caseGlob: string | undefined;
}

/** The ablation a suite runs under: the cases as asked; the triggers never, since under an ablation a `tool: Skill` grader is an unscored indicator. */
function ablationFor(options: SuiteOptions, suite: SuiteName): Ablation {
  return suite === 'cases' ? options.ablation : 'none';
}

/** The runner's argv for one suite. */
function runnerArgs(
  options: SuiteOptions,
  pluginDir: string,
  suite: SuiteName,
  resultPath: string,
): readonly string[] {
  const ceiling =
    options.maxCostUsd === undefined ? [] : ['--max-cost-usd', String(options.maxCostUsd)];
  const judge = options.judgeModel === undefined ? [] : ['--judge-model', options.judgeModel];
  const model = options.model === undefined ? [] : ['--model', options.model];
  return [
    'plugin',
    'eval',
    pluginDir,
    '--keep-temp',
    '--no-publish',
    '--trust-plugin',
    '--threshold',
    '0',
    '--ablation',
    ablationFor(options, suite),
    '--runs',
    String(options.runs),
    '--case',
    options.caseGlob ?? (suite === 'cases' ? 'case-*' : 'trigger-*'),
    '--json',
    resultPath,
    ...ceiling,
    ...judge,
    ...model,
  ];
}

/** The runner's scaffold root for a trace at `<root>/out/trace.jsonl`, or undefined when the path is not that shape. */
function scaffoldRootOf(tracePath: string): string | undefined {
  const root = dirname(dirname(tracePath));
  return basename(root).startsWith('e-') && basename(dirname(tracePath)) === 'out'
    ? root
    : undefined;
}

function retainOne(
  copy: EvidenceCopy,
  outDir: string,
  replacements: readonly PathReplacement[],
  seams: SkillEvalsSeams,
): Result<void, Error> {
  const trace = seams.readText(copy.tracePath);
  if (!trace.ok) {
    return trace;
  }
  if (trace.value === undefined) {
    return err(new Error(`the runner named a trace that is absent: ${copy.tracePath}`));
  }
  const written = seams.writeText(
    posix.join(outDir, copy.traceTarget),
    scrubMachinePaths(trace.value, replacements),
    false,
  );
  if (!written.ok) {
    return written;
  }
  const answer = `${scrubMachinePaths(finalAnswerOf(trace.value), replacements)}\n`;
  const answerWritten = seams.writeText(posix.join(outDir, copy.answerTarget), answer, false);
  if (!answerWritten.ok) {
    return answerWritten;
  }
  const root = scaffoldRootOf(copy.tracePath);
  return root === undefined ? ok(undefined) : seams.removeDir(root);
}

/** Retain every run's trace and answer, removing each runner scaffold once its trace is copied. */
function retainEvidence(
  result: RunnerResult,
  outDir: string,
  replacements: readonly PathReplacement[],
  seams: SkillEvalsSeams,
): Result<void, Error> {
  for (const copy of planEvidenceCopies(result)) {
    const retained = retainOne(copy, outDir, replacements, seams);
    if (!retained.ok) {
      return retained;
    }
  }
  return ok(undefined);
}

/** What executing one suite needs. */
export interface SuiteRun {
  readonly options: SuiteOptions;
  readonly seams: SkillEvalsSeams;
  readonly pluginDir: string;
  readonly outDir: string;
  readonly suite: SuiteName;
  readonly cases: readonly string[];
  readonly replacements: readonly PathReplacement[];
}

function invokeRunner(input: SuiteRun, args: readonly string[]): Result<number, Error> {
  const ran = input.seams.run(RUNNER_COMMAND, args, input.pluginDir);
  if (!ran.ok) {
    return ran;
  }
  if (ran.value.exitCode !== 0 && ran.value.exitCode !== 2) {
    return err(
      new Error(
        `the ${input.suite} suite: ${RUNNER_COMMAND} exited ${ran.value.exitCode}; the plugin is kept at ${input.pluginDir}`,
      ),
    );
  }
  return ok(ran.value.exitCode);
}

function readResult(
  path: string,
  seams: SkillEvalsSeams,
): Result<{ readonly text: string; readonly parsed: RunnerResult }, Error> {
  const text = seams.readText(path);
  if (!text.ok) {
    return text;
  }
  if (text.value === undefined) {
    return err(new Error(`the runner wrote no result at ${path}`));
  }
  const parsed = parseRunnerResult(text.value);
  return parsed.ok ? ok({ text: text.value, parsed: parsed.value }) : parsed;
}

/** Run one suite, retain its evidence under `outDir`, and describe it for the manifest. */
export function executeSuite(input: SuiteRun): Result<SuiteRecord, Error> {
  const resultFile = `result-${input.suite}.json`;
  const args = runnerArgs(
    input.options,
    input.pluginDir,
    input.suite,
    posix.join(input.pluginDir, resultFile),
  );
  const exitCode = invokeRunner(input, args);
  if (!exitCode.ok) {
    return exitCode;
  }
  const result = readResult(posix.join(input.pluginDir, resultFile), input.seams);
  if (!result.ok) {
    return result;
  }
  const resultWritten = input.seams.writeText(
    posix.join(input.outDir, resultFile),
    scrubMachinePaths(result.value.text, input.replacements),
    false,
  );
  if (!resultWritten.ok) {
    return resultWritten;
  }
  const retained = retainEvidence(
    result.value.parsed,
    input.outDir,
    input.replacements,
    input.seams,
  );
  if (!retained.ok) {
    return retained;
  }
  return ok({
    suite: input.suite,
    ablation: ablationFor(input.options, input.suite),
    runs: input.options.runs,
    cases: input.cases,
    ran: result.value.parsed.cases.map((evalCase) => evalCase.name),
    command: [RUNNER_COMMAND, ...args].map((arg) => arg.replaceAll(input.pluginDir, '<plugin>')),
    resultFile,
    costUsd: result.value.parsed.costUsd,
    claudeVersion: result.value.parsed.claudeVersion,
    partial: result.value.parsed.partial === true || exitCode.value === 2,
  });
}
