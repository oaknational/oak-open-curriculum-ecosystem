import { posix } from 'node:path';

import { collect, err, ok, type Result } from '@oaknational/result';

import type { SuiteSelection } from './args.js';
import type { PathReplacement } from './evidence.js';
import type { SuiteRecord } from './manifest.js';
import {
  captureVersions,
  writeManifest,
  type EvaluatedVersions,
  type SkillToHash,
} from './manifest-writer.js';
import { planSuites, type PlannedSuite } from './plan.js';
import {
  loadProjection,
  pluginManifest,
  writeAll,
  type LoadOptions,
  type LoadedSuite,
} from './plugin.js';
import { pluginSkillFiles, type PluginSkillFiles } from './plugin-skill.js';
import type { PluginSkill, ProjectedFile } from './project.js';
import type { SkillEvalsSeams } from './seams.js';
import { executeSuite, type SuiteOptions, type SuiteRun } from './suite.js';

/**
 * The orchestration: project a skill's declared evals into a temporary
 * plugin, run them through `claude plugin eval`, and retain the evidence
 * under the skill's `evals/results/`.
 *
 * @remarks
 * Every effect goes through {@link SkillEvalsSeams}, so the whole sequence
 * is provable from literal inputs. The suites run in order and the first
 * failure stops the spend; the manifest names exactly the cases the runner
 * was asked for beside the cases its result names.
 *
 * @packageDocumentation
 */

/** What a run needs. */
export interface RunOptions extends LoadOptions, SuiteOptions {
  readonly suite: SuiteSelection;
  readonly keepPlugin: boolean;
  readonly agentToolsVersion: string;
}

/** Where a run left its evidence. */
export interface RunSummary {
  readonly outDir: string;
  readonly pluginDir: string;
  readonly suites: readonly SuiteRecord[];
}

interface Prepared {
  readonly loaded: LoadedSuite;
  readonly pluginFiles: readonly ProjectedFile[];
  /** The evaluated skill and the carried skills, each with the sibling references projected under it, as the manifest must name them. */
  readonly evaluated: SkillToHash;
  readonly carried: readonly SkillToHash[];
}

/** One skill with its files in the plugin. */
interface ProjectedSkill {
  readonly skill: PluginSkill;
  readonly projected: PluginSkillFiles;
}

/** A skill's files in the plugin, kept with the skill they belong to. */
function projectSkill(
  repoRoot: string,
  skill: PluginSkill,
  seams: SkillEvalsSeams,
): Result<ProjectedSkill, Error> {
  const projected = pluginSkillFiles(repoRoot, skill, seams);
  return projected.ok ? ok({ skill, projected: projected.value }) : projected;
}

/** What the manifest hashes for one projected skill. */
function toHash(each: ProjectedSkill): SkillToHash {
  return { skill: each.skill, sharedReferences: each.projected.sharedReferences };
}

/** The projection and every skill the plugin carries, or the first refusal. */
function prepare(options: LoadOptions, seams: SkillEvalsSeams): Result<Prepared, Error> {
  const loaded = loadProjection(options, seams);
  if (!loaded.ok) {
    return loaded;
  }
  const { skill, carried } = loaded.value.projection;
  const evaluated = projectSkill(options.repoRoot, skill, seams);
  if (!evaluated.ok) {
    return evaluated;
  }
  const carriedProjected = collect(
    carried.map((each) => projectSkill(options.repoRoot, each, seams)),
  );
  if (!carriedProjected.ok) {
    return carriedProjected;
  }
  const pluginFiles = [
    pluginManifest(skill.hostSkill),
    ...evaluated.value.projected.files,
    ...carriedProjected.value.flatMap((each) => each.projected.files),
    ...loaded.value.files,
  ];
  return ok({
    loaded: loaded.value,
    pluginFiles,
    evaluated: toHash(evaluated.value),
    carried: carriedProjected.value.map(toHash),
  });
}

/** A filesystem-safe form of the clock. */
function stamp(now: Date): string {
  return `${now.toISOString().slice(0, 19).replaceAll(':', '-')}Z`;
}

/** Run the planned suites in order; the first failure stops the spend. */
function executeSuites(
  options: RunOptions,
  seams: SkillEvalsSeams,
  planned: readonly PlannedSuite[],
  pluginDir: string,
  outDir: string,
): Result<readonly SuiteRecord[], Error> {
  const replacements: readonly PathReplacement[] = [
    { from: pluginDir, to: '<plugin>' },
    { from: options.repoRoot, to: '<repo>' },
  ];
  const records: SuiteRecord[] = [];
  for (const plan of planned) {
    const suiteRun: SuiteRun = {
      options,
      seams,
      pluginDir,
      outDir,
      suite: plan.suite,
      cases: plan.cases,
      replacements,
    };
    const record = executeSuite(suiteRun);
    if (!record.ok) {
      return record;
    }
    records.push(record.value);
  }
  return ok(records);
}

interface Staged {
  readonly pluginDir: string;
  readonly outDir: string;
  readonly startedAt: Date;
  readonly versions: EvaluatedVersions;
}

/**
 * Make the evidence directory, named by the clock, fresh: a run that starts in
 * the same second as another refuses rather than write into its evidence. Then
 * write the plugin to a fresh temporary directory and capture the versions it
 * carries, before any suite runs.
 */
function stage(
  options: RunOptions,
  seams: SkillEvalsSeams,
  prepared: Prepared,
): Result<Staged, Error> {
  const startedAt = seams.now();
  const canonicalDir = prepared.loaded.projection.skill.canonicalRelativeDir;
  const outDir = posix.join(options.repoRoot, canonicalDir, 'evals', 'results', stamp(startedAt));
  const fresh = seams.makeFreshDir(outDir);
  if (!fresh.ok) {
    return err(
      new Error(`the evidence directory ${outDir} cannot be made fresh: ${fresh.error.message}`),
    );
  }
  const pluginDir = seams.makeTempDir('oce-skill-evals-');
  if (!pluginDir.ok) {
    return pluginDir;
  }
  const written = writeAll(pluginDir.value, prepared.pluginFiles, seams);
  if (!written.ok) {
    return written;
  }
  const versions = captureVersions(options.repoRoot, prepared.evaluated, prepared.carried, seams);
  return versions.ok
    ? ok({ pluginDir: pluginDir.value, outDir, startedAt, versions: versions.value })
    : versions;
}

/** Project, run and retain. The temporary plugin is removed unless `keepPlugin`. */
export function runSkillEvals(
  options: RunOptions,
  seams: SkillEvalsSeams,
): Result<RunSummary, Error> {
  const prepared = prepare(options, seams);
  if (!prepared.ok) {
    return prepared;
  }
  const planned = planSuites(options, prepared.value.loaded);
  if (!planned.ok) {
    return planned;
  }
  const staged = stage(options, seams, prepared.value);
  if (!staged.ok) {
    return staged;
  }
  const { pluginDir, outDir, startedAt, versions } = staged.value;
  const suites = executeSuites(options, seams, planned.value, pluginDir, outDir);
  if (!suites.ok) {
    return suites;
  }
  const manifest = writeManifest({
    ...options,
    seams,
    versions,
    outDir,
    startedAt,
    suites: suites.value,
  });
  if (!manifest.ok) {
    return manifest;
  }
  const removed = options.keepPlugin ? ok(undefined) : seams.removeDir(pluginDir);
  return removed.ok ? ok({ outDir, pluginDir, suites: suites.value }) : removed;
}

/** What a projection-only invocation needs. */
export interface ProjectOptions extends LoadOptions {
  readonly out: string;
}

/** Write the projected plugin to `out` for inspection; nothing runs. */
export function projectSkillEvals(
  options: ProjectOptions,
  seams: SkillEvalsSeams,
): Result<{ readonly files: number }, Error> {
  const prepared = prepare(options, seams);
  if (!prepared.ok) {
    return prepared;
  }
  const written = writeAll(options.out, prepared.value.pluginFiles, seams);
  return written.ok ? ok({ files: prepared.value.pluginFiles.length }) : written;
}
