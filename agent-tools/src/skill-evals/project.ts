import { err, ok, type Result } from '@oaknational/result';

import type { EvalCase, SkillEvalsFixture, TriggerExample } from './fixture.js';
import {
  assertionsGrader,
  skillFilesReadableGrader,
  skillFiredGrader,
  skillSilentGrader,
} from './graders.js';

/**
 * The deterministic projection of a skill's declared evals into the case
 * layout the host eval runner executes.
 *
 * @remarks
 * The runner (`claude plugin eval`) reads `evals/<case>/prompt.md` (a
 * frontmatter of run limits and the prompt), `case.yaml` and
 * `graders/*.md`. The agent under test runs in an empty temporary workspace
 * and may read nothing outside it except the plugin's own files (read
 * first-hand from the runner's traces on 2026-09-27), so the method reaches
 * it through the plugin's skill file alone, which the plugin module builds
 * from the canonical body; nothing is placed in the workspace, and the
 * without-arm, which has no plugin, has no route to the method. The graders
 * are paired by construction in the graders module.
 *
 * Pure: the same inputs project the same files in the same order.
 *
 * @packageDocumentation
 */

/** One skill the plugin carries, as the projection names it. */
export interface PluginSkill {
  /** The canonical name, the directory's basename, as a fixture's `skills_expected` names it. */
  readonly name: string;
  /** The host skill name the Skill tool sees, e.g. `oak-user-value`. */
  readonly hostSkill: string;
  /** The canonical skill directory relative to the repository root, normalised: no leading `./`, no trailing `/`. */
  readonly canonicalRelativeDir: string;
}

/** What the projection needs; every path is POSIX-separated. */
export interface ProjectionInput {
  readonly fixture: SkillEvalsFixture;
  readonly triggers: readonly TriggerExample[];
  /** The skill under evaluation. */
  readonly skill: PluginSkill;
  /** Skills carried beside it, so a case can exercise a handoff to them. */
  readonly carried: readonly PluginSkill[];
  readonly maxTurns: number;
  readonly timeoutSeconds: number;
  readonly triggerMaxTurns: number;
}

/** One file of the projected suite, relative to the plugin root. */
export interface ProjectedFile {
  readonly path: string;
  readonly content: string;
  readonly executable: boolean;
}

const HOST_SKILL = /^[a-z0-9][a-z0-9-]*$/u;

const file = (path: string, content: string): ProjectedFile => ({
  path,
  content,
  executable: false,
});

/** A case name for an eval id. */
function caseName(id: number): string {
  return `case-${String(id).padStart(2, '0')}`;
}

/** A case name for a trigger example by its position and polarity. */
function triggerName(index: number, shouldTrigger: boolean): string {
  return `trigger-${String(index + 1).padStart(2, '0')}-${shouldTrigger ? 'fires' : 'silent'}`;
}

/** Every skill the plugin carries, the one under evaluation first. */
function allSkills(input: ProjectionInput): readonly PluginSkill[] {
  return [input.skill, ...input.carried];
}

/** The runner's prompt file: run limits in the frontmatter, the prompt as the body. */
function promptFile(name: string, maxTurns: number, timeoutSeconds: number, body: string): string {
  return [
    '---',
    `name: ${name}`,
    `max_turns: ${maxTurns}`,
    `timeout_seconds: ${timeoutSeconds}`,
    'allowed_tools: [Read, Glob, Grep, Skill]',
    '---',
    '',
    body,
    '',
  ].join('\n');
}

/** The runner's case context: nothing beyond the name; the workspace stays empty. */
function caseYaml(name: string): string {
  return ['schema_version: "1.1"', `name: ${name}`, ''].join('\n');
}

/** The files every case carries: its context and the check that the plugin's skill files were readable. */
function commonFiles(dir: string, name: string, input: ProjectionInput): readonly ProjectedFile[] {
  const hosts = allSkills(input).map((skill) => skill.hostSkill);
  return [
    file(`${dir}/case.yaml`, caseYaml(name)),
    file(`${dir}/graders/skill-files-readable.md`, skillFilesReadableGrader(hosts)),
  ];
}

/** The fired indicator for each carried skill a case expects to reach. */
function expectedSkillGraders(
  dir: string,
  input: ProjectionInput,
  evalCase: EvalCase,
): readonly ProjectedFile[] {
  return (evalCase.skills_expected ?? []).flatMap((name) => {
    const carried = input.carried.find((skill) => skill.name === name);
    return carried === undefined
      ? []
      : [
          file(
            `${dir}/graders/skill-fired-${carried.hostSkill}.md`,
            skillFiredGrader(carried.hostSkill),
          ),
        ];
  });
}

/** One eval case's files. */
function projectCase(input: ProjectionInput, evalCase: EvalCase): readonly ProjectedFile[] {
  const name = caseName(evalCase.id);
  const dir = `evals/${name}`;
  return [
    file(
      `${dir}/prompt.md`,
      promptFile(name, input.maxTurns, input.timeoutSeconds, evalCase.prompt),
    ),
    ...commonFiles(dir, name, input),
    file(`${dir}/graders/skill-fired.md`, skillFiredGrader(input.skill.hostSkill)),
    ...expectedSkillGraders(dir, input, evalCase),
    file(
      `${dir}/graders/assertions.md`,
      assertionsGrader(evalCase.expected_output, evalCase.assertions),
    ),
  ];
}

/** One trigger example's files. */
function projectTrigger(
  input: ProjectionInput,
  example: TriggerExample,
  index: number,
): readonly ProjectedFile[] {
  const name = triggerName(index, example.should_trigger);
  const dir = `evals/${name}`;
  const grader = example.should_trigger
    ? file(`${dir}/graders/skill-fired.md`, skillFiredGrader(input.skill.hostSkill))
    : file(`${dir}/graders/skill-silent.md`, skillSilentGrader(input.skill.hostSkill));
  return [
    file(
      `${dir}/prompt.md`,
      promptFile(name, input.triggerMaxTurns, input.timeoutSeconds, example.query),
    ),
    ...commonFiles(dir, name, input),
    grader,
  ];
}

/** Whether `dir` is a normalised path relative to the repository root: no leading `/` or `./`, no trailing `/`, no `..`. */
function isNormalisedRelative(dir: string): boolean {
  const segments = dir.split('/');
  return (
    dir.length > 0 &&
    segments.every((segment) => segment.length > 0 && segment !== '.' && segment !== '..')
  );
}

/** Why one carried skill cannot be projected, or undefined when it can. */
export function skillRefusal(skill: PluginSkill): string | undefined {
  if (!HOST_SKILL.test(skill.hostSkill)) {
    return `host skill name '${skill.hostSkill}' is not lower-case letters, digits and hyphens`;
  }
  if (!isNormalisedRelative(skill.canonicalRelativeDir)) {
    return `canonical directory '${skill.canonicalRelativeDir}' must be a normalised path relative to the repository root`;
  }
  return undefined;
}

/** The first expected skill no plugin skill answers to, as a refusal naming the case. */
function unknownExpectedSkill(input: ProjectionInput): string | undefined {
  const names = new Set(allSkills(input).map((skill) => skill.name));
  for (const evalCase of input.fixture.evals) {
    const unknown = (evalCase.skills_expected ?? []).find((name) => !names.has(name));
    if (unknown !== undefined) {
      return `case ${evalCase.id} expects skill '${unknown}', which is neither the skill under evaluation nor carried with --also`;
    }
  }
  return undefined;
}

/** Why an input cannot be projected, or undefined when it can. */
function refusal(input: ProjectionInput): string | undefined {
  const skills = allSkills(input);
  const perSkill = skills.map(skillRefusal).find((reason) => reason !== undefined);
  if (perSkill !== undefined) {
    return perSkill;
  }
  const hosts = new Set(skills.map((skill) => skill.hostSkill));
  const names = new Set(skills.map((skill) => skill.name));
  if (hosts.size !== skills.length || names.size !== skills.length) {
    return 'the skill under evaluation and the skills carried with --also must have distinct names';
  }
  return unknownExpectedSkill(input);
}

const byPath = (a: ProjectedFile, b: ProjectedFile): number =>
  a.path.localeCompare(b.path, 'en', { numeric: true });
const byNumericName = (a: string, b: string): number => a.localeCompare(b, 'en', { numeric: true });

/**
 * Project the eval cases and trigger examples into the runner's case files.
 *
 * @returns The files in path order, or the refusal that stops the projection.
 */
export function projectSuite(input: ProjectionInput): Result<readonly ProjectedFile[], Error> {
  const reason = refusal(input);
  if (reason !== undefined) {
    return err(new Error(`skill-evals projection refused: ${reason}`));
  }
  const cases = input.fixture.evals.flatMap((evalCase) => projectCase(input, evalCase));
  const triggers = input.triggers.flatMap((example, index) =>
    projectTrigger(input, example, index),
  );
  return ok([...cases, ...triggers].toSorted(byPath));
}

/** The case names a suite projects, in the order the runner lists them. */
export function projectedCaseNames(input: ProjectionInput): readonly string[] {
  const cases = input.fixture.evals.map((evalCase) => caseName(evalCase.id));
  const triggers = input.triggers.map((example, index) =>
    triggerName(index, example.should_trigger),
  );
  return [...cases, ...triggers].toSorted(byNumericName);
}
