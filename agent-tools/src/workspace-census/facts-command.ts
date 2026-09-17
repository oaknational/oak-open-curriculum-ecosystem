/**
 * The `facts` subcommand (census todo 2): gathers the mechanical
 * detector facts for every subject and writes the facts artefact.
 * Split from commands.js on size; shares the CommandContext shape.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { deriveLiveSubjects, type CommandContext } from './context.js';
import { renderFactsArtefact } from './facts-artefact.js';
import {
  assembleFacts,
  type ManifestSummaryInput,
  type SubjectFacts,
  type SubjectGrepCounts,
} from './facts.js';
import { bucketTrackedFiles, grepSubjectCounts, readManifestSummary } from './facts-inputs.js';
import {
  aggregateSourceDependencies,
  parseDepcruiseModules,
  parseTurboTasks,
  runDepcruiseJson,
  runTurboDryJson,
} from './graph-inputs.js';
import { listTrackedFiles } from './inputs.js';
import type { CensusSubject } from './subjects.js';

export const FACTS_PATH = '.agent/reports/workspace-classification-census/facts.json';

async function gatherGrepCounts(
  repoRoot: string,
  buckets: ReadonlyMap<string, readonly string[]>,
): Promise<Result<Map<string, SubjectGrepCounts>, string>> {
  const grepCounts = new Map<string, SubjectGrepCounts>();
  for (const [dirPath, files] of buckets) {
    const counts = await grepSubjectCounts(repoRoot, files);
    if (!counts.ok) {
      return err(counts.error);
    }
    grepCounts.set(dirPath, counts.value);
  }
  return ok(grepCounts);
}

async function gatherSourceDependencies(
  repoRoot: string,
  subjects: readonly CensusSubject[],
): Promise<Result<Map<string, string[]>, string>> {
  const raw = await runDepcruiseJson(repoRoot);
  if (!raw.ok) {
    return err(raw.error);
  }
  const modules = parseDepcruiseModules(raw.value);
  if (!modules.ok) {
    return err(modules.error);
  }
  return ok(aggregateSourceDependencies(subjects, modules.value));
}

async function gatherTurboTasks(repoRoot: string): Promise<Result<Map<string, string[]>, string>> {
  const raw = await runTurboDryJson(repoRoot);
  if (!raw.ok) {
    return err(raw.error);
  }
  return parseTurboTasks(raw.value);
}

async function gatherManifests(
  repoRoot: string,
  subjects: readonly CensusSubject[],
): Promise<Result<ManifestSummaryInput[], string>> {
  const manifests: ManifestSummaryInput[] = [];
  for (const subject of subjects) {
    const summary = await readManifestSummary(repoRoot, subject.dirPath);
    if (!summary.ok) {
      return err(summary.error);
    }
    if (summary.value !== null) {
      manifests.push(summary.value);
    }
  }
  return ok(manifests);
}

/** Assemble the live detector facts — exported so `check` can recompute them. */
export async function gatherLiveFacts(
  context: CommandContext,
): Promise<Result<SubjectFacts[], string>> {
  const subjects = await deriveLiveSubjects(context.repoRoot);
  if (!subjects.ok) {
    return err(subjects.error);
  }
  const trackedFiles = await listTrackedFiles(context.repoRoot);
  if (!trackedFiles.ok) {
    return err(trackedFiles.error);
  }
  const manifests = await gatherManifests(context.repoRoot, subjects.value);
  if (!manifests.ok) {
    return err(manifests.error);
  }
  const buckets = bucketTrackedFiles(subjects.value, trackedFiles.value);
  const grepCounts = await gatherGrepCounts(context.repoRoot, buckets);
  if (!grepCounts.ok) {
    return err(grepCounts.error);
  }
  const sourceDependencies = await gatherSourceDependencies(context.repoRoot, subjects.value);
  if (!sourceDependencies.ok) {
    return err(sourceDependencies.error);
  }
  const turboTasks = await gatherTurboTasks(context.repoRoot);
  if (!turboTasks.ok) {
    return err(turboTasks.error);
  }
  return ok(
    assembleFacts({
      subjects: subjects.value,
      manifests: manifests.value,
      trackedFilesBySubject: buckets,
      grepCountsBySubject: grepCounts.value,
      sourceDependenciesBySubject: sourceDependencies.value,
      turboTasksByPackage: turboTasks.value,
    }),
  );
}

export async function runFacts(context: CommandContext): Promise<number> {
  const facts = await gatherLiveFacts(context);
  if (!facts.ok) {
    context.stderr.write(`workspace-census: ${facts.error}\n`);
    return 1;
  }
  const outPath = path.resolve(context.repoRoot, FACTS_PATH);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, renderFactsArtefact(facts.value), 'utf8');
  context.stdout.write(
    `facts: ${String(facts.value.length)} subject entries written (${FACTS_PATH})\n`,
  );
  return 0;
}
