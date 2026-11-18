import { posix } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { getJsonValue, isJsonObject, parseJsonTextResult } from '../core/json.js';
import { parseSkillEvalsArgs, USAGE, type SkillEvalsArgs } from './args.js';
import { projectSkillEvals, runSkillEvals, type ProjectOptions, type RunSummary } from './run.js';
import type { SkillEvalsSeams } from './seams.js';

/**
 * `skill-evals` — run a canonical skill's declared evals through the host
 * runner and retain the evidence, or write the projection for inspection.
 * Exit 0 done; exit 1 a named operational refusal; exit 2 usage. The seams
 * are bound by the composition root (the CLI topic), never here.
 *
 * @packageDocumentation
 */

/** What the CLI runs with. */
export interface SkillEvalsCliInput {
  readonly args: readonly string[];
  /** The invoking worktree's root: the skill under evaluation is the checked-out one. */
  readonly repoRoot: string;
  readonly stdout: Pick<NodeJS.WritableStream, 'write'>;
  readonly stderr: Pick<NodeJS.WritableStream, 'write'>;
  readonly seams: SkillEvalsSeams;
}

type Writer = Pick<NodeJS.WritableStream, 'write'>;
type Named = SkillEvalsArgs & { readonly skill: string; readonly hostSkill: string };

/** The agent-tools package version, a label beside the repository head the manifest records. */
function packageVersion(repoRoot: string, seams: SkillEvalsSeams): Result<string, Error> {
  const path = posix.join(repoRoot, 'agent-tools', 'package.json');
  const text = seams.readText(path);
  if (!text.ok) {
    return text;
  }
  const parsed = parseJsonTextResult(text.value ?? '', 'agent-tools/package.json');
  if (!parsed.ok) {
    return parsed;
  }
  const version = isJsonObject(parsed.value) ? getJsonValue(parsed.value, 'version') : undefined;
  return typeof version === 'string'
    ? ok(version)
    : err(new Error(`${path} carries no version string`));
}

function report(summary: RunSummary, json: boolean, stdout: Writer): number {
  if (json) {
    stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    return 0;
  }
  for (const suite of summary.suites) {
    const partial = suite.partial ? ', PARTIAL' : '';
    stdout.write(
      `${suite.suite}: ${suite.cases.length} cases, ablation ${suite.ablation}, USD ${suite.costUsd.toFixed(2)}${partial}\n`,
    );
  }
  stdout.write(`evidence: ${summary.outDir}\n`);
  return 0;
}

function project(parsed: Named, input: SkillEvalsCliInput): number {
  if (parsed.out === undefined) {
    input.stderr.write('project needs --out <dir>\n');
    return 2;
  }
  const projectOptions: ProjectOptions = { ...parsed, repoRoot: input.repoRoot, out: parsed.out };
  const projected = projectSkillEvals(projectOptions, input.seams);
  if (!projected.ok) {
    input.stderr.write(`${projected.error.message}\n`);
    return 1;
  }
  input.stdout.write(`projected ${projected.value.files} files to ${parsed.out}\n`);
  return 0;
}

function run(parsed: Named, input: SkillEvalsCliInput): number {
  const version = packageVersion(input.repoRoot, input.seams);
  if (!version.ok) {
    input.stderr.write(`${version.error.message}\n`);
    return 1;
  }
  const ran = runSkillEvals(
    { ...parsed, repoRoot: input.repoRoot, agentToolsVersion: version.value },
    input.seams,
  );
  if (!ran.ok) {
    input.stderr.write(`${ran.error.message}\n`);
    return 1;
  }
  return report(ran.value, parsed.json, input.stdout);
}

/** Run the topic; the exit code is returned, never applied. */
export function runSkillEvalsCli(input: SkillEvalsCliInput): number {
  const parsed = parseSkillEvalsArgs(input.args);
  if (parsed.help) {
    input.stdout.write(`${USAGE}\n`);
    return 0;
  }
  if (parsed.error !== undefined || parsed.skill === undefined || parsed.hostSkill === undefined) {
    input.stderr.write(`${parsed.error ?? 'usage error'}\n`);
    return 2;
  }
  const named: Named = { ...parsed, skill: parsed.skill, hostSkill: parsed.hostSkill };
  return parsed.command === 'project' ? project(named, input) : run(named, input);
}
