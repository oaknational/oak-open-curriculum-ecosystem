import type { Result } from '@oaknational/result';
import { typeSafeKeys } from '@oaknational/type-helpers';
import { z } from 'zod';

import { getJsonValue, isJsonObject, parseJsonTextResult } from '../core/json.js';
import { parseWithSchema } from '../core/schema-parse.js';

/**
 * The evidence a suite run leaves in the repository: the runner's result
 * and every run's trace and final answer, with the machine-local paths
 * scrubbed; the manifest beside them is composed in the manifest module.
 *
 * @remarks
 * Appendix E of the specification framework note asks for retained evidence
 * of the actual skill versions delivered: versions, runtime configuration,
 * prompts, outputs and assertion-level results, in a form fit for
 * publication. The runner keeps its traces in machine-temporary directories
 * and its result names them by absolute path, so this module plans the
 * copies and scrubs every machine-local path from what is copied
 * (`principles.md` §No machine-local paths). Pure: the copies are a plan
 * the orchestrator executes.
 *
 * The runner's result is a vendor document copied verbatim into the
 * evidence; the schema below types the fields this module reads and lets
 * the rest through (`z.looseObject`), which is the boundary's exact
 * expectation: the read fields are strict, the carried fields are opaque.
 *
 * @packageDocumentation
 */

const graderSchema = z.looseObject({ name: z.string(), passed: z.boolean().nullable().optional() });

const runSchema = z.looseObject({
  passed: z.boolean().nullable().optional(),
  score: z.number().nullable().optional(),
  turns: z.number().optional(),
  costUsd: z.number().optional(),
  error: z.string().nullable().optional(),
  tracePath: z.string().optional(),
  graders: z.array(graderSchema).optional(),
});

const caseSchema = z.looseObject({
  name: z.string(),
  arms: z.record(z.string(), z.array(runSchema)),
});

const runnerResultSchema = z.looseObject({
  claudeVersion: z.string().optional(),
  costUsd: z.number(),
  durationSeconds: z.number().optional(),
  startedAt: z.string().optional(),
  partial: z.boolean().optional(),
  cases: z.array(caseSchema),
});

/** The runner's `--json` result, the fields this module reads typed and the rest carried. */
export type RunnerResult = z.infer<typeof runnerResultSchema>;

/** Parse the text the runner wrote with `--json <path>`. */
export function parseRunnerResult(text: string): Result<RunnerResult, Error> {
  const json = parseJsonTextResult(text, 'runner result');
  if (!json.ok) {
    return json;
  }
  return parseWithSchema({ label: 'runner result', schema: runnerResultSchema, value: json.value });
}

/** One machine-local path and the placeholder that replaces it in published text. */
export interface PathReplacement {
  readonly from: string;
  readonly to: string;
}

const RUNNER_WORKSPACES = /\/(?:private\/)?tmp\/e-[A-Za-z0-9]+\/home\/cwd/gu;
const RUNNER_SCAFFOLDS = /\/(?:private\/)?tmp\/e-[A-Za-z0-9]+/gu;
const HOME_DIRS = [
  /\/Users\/[^/\s"'\\]+?(?=[\s"'\\/.,;:)\]]|$)/gu,
  /\/home\/[^/\s"'\\]+?(?=[\s"'\\/.,;:)\]]|$)/gu,
];
const HYPHENATED_HOMES = [/-Users-[^/\s"'\\-]+-/gu, /-home-[^/\s"'\\-]+-/gu];

/**
 * Replace every machine-local path in `text`: the explicit replacements
 * (longest first, so a root never masks a path below it), then the runner's
 * workspaces and scaffold directories, then any user home directory, with or
 * without a trailing separator, in its path form and in the hyphenated form
 * the host uses for project keys.
 */
export function scrubMachinePaths(text: string, replacements: readonly PathReplacement[]): string {
  const ordered = replacements.toSorted((a, b) => b.from.length - a.from.length);
  let scrubbed = text;
  for (const replacement of ordered) {
    scrubbed = scrubbed.replaceAll(replacement.from, replacement.to);
  }
  scrubbed = scrubbed
    .replaceAll(RUNNER_WORKSPACES, '<workspace>')
    .replaceAll(RUNNER_SCAFFOLDS, '<scaffold>');
  for (const home of HOME_DIRS) {
    scrubbed = scrubbed.replaceAll(
      home,
      (match) => `${match.slice(0, match.indexOf('/', 1) + 1)}<user>`,
    );
  }
  for (const home of HYPHENATED_HOMES) {
    scrubbed = scrubbed.replaceAll(
      home,
      (match) => `${match.slice(0, match.indexOf('-', 1) + 1)}<user>-`,
    );
  }
  return scrubbed;
}

function resultTextOf(line: string): string | undefined {
  const parsed = parseJsonTextResult(line, 'trace line');
  if (
    !parsed.ok ||
    !isJsonObject(parsed.value) ||
    getJsonValue(parsed.value, 'type') !== 'result'
  ) {
    return undefined;
  }
  const answer = getJsonValue(parsed.value, 'result');
  return typeof answer === 'string' ? answer : '';
}

/** The agent's final message in a runner trace (the `result` event), or empty when absent. */
export function finalAnswerOf(traceJsonl: string): string {
  for (const line of traceJsonl.split('\n').toReversed()) {
    const text = line.trim().length === 0 ? undefined : resultTextOf(line);
    if (text !== undefined) {
      return text;
    }
  }
  return '';
}

/** One run's trace and answer, and where each is retained. */
export interface EvidenceCopy {
  readonly caseName: string;
  readonly arm: string;
  readonly run: number;
  readonly tracePath: string;
  readonly traceTarget: string;
  readonly answerTarget: string;
}

const byName = (a: string, b: string): number => a.localeCompare(b, 'en');

/** Every run with a trace, in case, arm and run order, with its retention targets. */
export function planEvidenceCopies(result: RunnerResult): readonly EvidenceCopy[] {
  const copies: EvidenceCopy[] = [];
  for (const evalCase of result.cases) {
    for (const arm of typeSafeKeys(evalCase.arms).toSorted(byName)) {
      (evalCase.arms[arm] ?? []).forEach((run, index) => {
        if (run.tracePath === undefined || run.tracePath.length === 0) {
          return;
        }
        const stem = `${evalCase.name}.${arm}.${index + 1}`;
        copies.push({
          caseName: evalCase.name,
          arm,
          run: index + 1,
          tracePath: run.tracePath,
          traceTarget: `traces/${stem}.jsonl`,
          answerTarget: `answers/${stem}.md`,
        });
      });
    }
  }
  return copies;
}
