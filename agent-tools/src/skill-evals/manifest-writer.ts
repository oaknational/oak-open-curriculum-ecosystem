import { posix } from 'node:path';

import { collect, ok, type Result } from '@oaknational/result';

import {
  manifestText,
  type ManifestInput,
  type ManifestSkill,
  type SuiteRecord,
} from './manifest.js';
import { hashDirectory, hashPaths, RESULTS_PREFIX } from './plugin.js';
import { adapterDir } from './plugin-skill.js';
import type { PluginSkill } from './project.js';
import type { GitState, SkillEvalsSeams } from './seams.js';
import { RUNNER_COMMAND } from './suite.js';

/**
 * The manifest a run writes beside its evidence: the evaluated versions by
 * blob id, the repository state and the suites that ran.
 *
 * @packageDocumentation
 */

/**
 * The evaluated versions: every carried skill's files by blob id and the
 * repository state, read once the plugin is staged and before any suite runs,
 * so an edit made while a suite runs never reaches the manifest.
 */
export interface EvaluatedVersions {
  readonly skill: ManifestSkill;
  readonly carried: readonly ManifestSkill[];
  readonly git: GitState;
}

/** What the manifest is composed from. */
export interface ManifestContext {
  readonly agentToolsVersion: string;
  readonly model: string | undefined;
  readonly judgeModel: string | undefined;
  readonly seams: SkillEvalsSeams;
  readonly versions: EvaluatedVersions;
  readonly outDir: string;
  readonly startedAt: Date;
  readonly suites: readonly SuiteRecord[];
}

/** One carried skill's canonical and adapter files by blob id, earlier runs' evidence left out, and the sibling references projected under it. */
function hashSkill(
  repoRoot: string,
  skill: PluginSkill,
  shared: readonly string[],
  seams: SkillEvalsSeams,
): Result<ManifestSkill, Error> {
  const canonicalDir = posix.join(repoRoot, skill.canonicalRelativeDir);
  const canonicalFiles = hashDirectory(canonicalDir, seams, RESULTS_PREFIX);
  if (!canonicalFiles.ok) {
    return canonicalFiles;
  }
  const adapterFiles = hashDirectory(
    posix.join(repoRoot, adapterDir(skill.hostSkill)),
    seams,
    RESULTS_PREFIX,
  );
  if (!adapterFiles.ok) {
    return adapterFiles;
  }
  const sharedReferenceFiles = hashPaths(repoRoot, shared, seams);
  if (!sharedReferenceFiles.ok) {
    return sharedReferenceFiles;
  }
  return ok({
    hostSkill: skill.hostSkill,
    canonicalRelativeDir: skill.canonicalRelativeDir,
    canonicalFiles: canonicalFiles.value,
    adapterFiles: adapterFiles.value,
    sharedReferenceFiles: sharedReferenceFiles.value,
  });
}

/** One skill to hash: the skill and, by canonical path, the sibling references the projector placed under it. */
export interface SkillToHash {
  readonly skill: PluginSkill;
  readonly sharedReferences: readonly string[];
}

/** Hash the staged versions and read the repository state, before any suite runs. */
export function captureVersions(
  repoRoot: string,
  evaluated: SkillToHash,
  carried: readonly SkillToHash[],
  seams: SkillEvalsSeams,
): Result<EvaluatedVersions, Error> {
  const hashed = hashSkill(repoRoot, evaluated.skill, evaluated.sharedReferences, seams);
  if (!hashed.ok) {
    return hashed;
  }
  const carriedHashed = collect(
    carried.map((each) => hashSkill(repoRoot, each.skill, each.sharedReferences, seams)),
  );
  if (!carriedHashed.ok) {
    return carriedHashed;
  }
  const git = seams.gitState(repoRoot);
  return git.ok ? ok({ skill: hashed.value, carried: carriedHashed.value, git: git.value }) : git;
}

/** Write the manifest from the versions captured at staging and the suites that ran. */
export function writeManifest(context: ManifestContext): Result<void, Error> {
  const { seams, versions } = context;
  const manifest: ManifestInput = {
    startedAt: context.startedAt.toISOString(),
    repoHead: versions.git.head,
    worktreeClean: versions.git.clean,
    agentToolsVersion: context.agentToolsVersion,
    skill: versions.skill,
    carried: versions.carried,
    runner: RUNNER_COMMAND,
    model: context.model,
    judgeModel: context.judgeModel,
    suites: context.suites,
  };
  return seams.writeText(
    posix.join(context.outDir, 'manifest.json'),
    manifestText(manifest),
    false,
  );
}
