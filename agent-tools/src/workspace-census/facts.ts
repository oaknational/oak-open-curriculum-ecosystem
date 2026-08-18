/**
 * Detector-fact assembly (census todo 2). Facts are MECHANICAL
 * observations banked per subject — manifest summaries, consumer
 * topology at workspace grain (manifest-declared internal dependencies
 * AND the depcruise source-level graph), the turbo task graph,
 * tracked-file profiles, and Oak-marker grep counts. Facts carry no
 * judgement: the judged pass reads them as evidence, and the
 * detector-facts / judged-readings separation the plan names starts
 * here.
 */
import { compareStrings } from './compare.js';
import { CODE_EXTENSIONS } from './vocabulary.js';
import type { CensusSubject } from './subjects.js';

/** One workspace manifest, summarised to the fields the census reads. */
export interface ManifestSummaryInput {
  readonly dirPath: string;
  readonly name: string;
  readonly isPrivate: boolean;
  readonly licence: string | null;
  readonly hasExports: boolean;
  readonly internalDependencies: readonly string[];
}

/** Mechanical Oak-marker counts for one subject's tracked files. */
export interface SubjectGrepCounts {
  readonly oakInDocs: number;
  readonly oakInSource: number;
  readonly cssOakVariables: number;
  readonly dottedOakNamespaces: number;
  readonly oakEnvKeys: number;
}

export interface SubjectFacts {
  readonly dirPath: string;
  readonly publishedName: string | null;
  readonly manifest: Omit<ManifestSummaryInput, 'dirPath'> | null;
  readonly internalDependents: readonly string[];
  /** Subject dirPaths this subject's modules import (depcruise, source-level). */
  readonly sourceDependencies: readonly string[];
  /** Task names the turbo graph resolves for this subject's package. */
  readonly turboTasks: readonly string[];
  readonly fileProfile: { readonly trackedFiles: number; readonly codeFiles: number };
  readonly oakMarkers: SubjectGrepCounts;
}

export interface AssembleFactsInput {
  readonly subjects: readonly CensusSubject[];
  readonly manifests: readonly ManifestSummaryInput[];
  readonly trackedFilesBySubject: ReadonlyMap<string, readonly string[]>;
  readonly grepCountsBySubject: ReadonlyMap<string, SubjectGrepCounts>;
  readonly sourceDependenciesBySubject?: ReadonlyMap<string, readonly string[]>;
  readonly turboTasksByPackage?: ReadonlyMap<string, readonly string[]>;
}

const ZERO_COUNTS: SubjectGrepCounts = {
  oakInDocs: 0,
  oakInSource: 0,
  cssOakVariables: 0,
  dottedOakNamespaces: 0,
  oakEnvKeys: 0,
};

function dependentsOf(name: string | null, manifests: readonly ManifestSummaryInput[]): string[] {
  if (name === null) {
    return [];
  }
  return manifests
    .filter((manifest) => manifest.internalDependencies.includes(name))
    .map((manifest) => manifest.name)
    .sort(compareStrings);
}

function profileFiles(files: readonly string[]): { trackedFiles: number; codeFiles: number } {
  const codeFiles = files.filter((file) =>
    CODE_EXTENSIONS.some((extension) => file.endsWith(extension)),
  ).length;
  return { trackedFiles: files.length, codeFiles };
}

function manifestFactsOf(
  manifest: ManifestSummaryInput | null,
): Omit<ManifestSummaryInput, 'dirPath'> | null {
  if (manifest === null) {
    return null;
  }
  return {
    name: manifest.name,
    isPrivate: manifest.isPrivate,
    licence: manifest.licence,
    hasExports: manifest.hasExports,
    internalDependencies: manifest.internalDependencies,
  };
}

function turboTasksOf(subject: CensusSubject, input: AssembleFactsInput): readonly string[] {
  if (subject.publishedName === null) {
    return [];
  }
  return input.turboTasksByPackage?.get(subject.publishedName) ?? [];
}

function factsForSubject(
  subject: CensusSubject,
  input: AssembleFactsInput,
  manifestByDir: ReadonlyMap<string, ManifestSummaryInput>,
): SubjectFacts {
  return {
    dirPath: subject.dirPath,
    publishedName: subject.publishedName,
    manifest: manifestFactsOf(manifestByDir.get(subject.dirPath) ?? null),
    internalDependents: dependentsOf(subject.publishedName, input.manifests),
    sourceDependencies: input.sourceDependenciesBySubject?.get(subject.dirPath) ?? [],
    turboTasks: turboTasksOf(subject, input),
    fileProfile: profileFiles(input.trackedFilesBySubject.get(subject.dirPath) ?? []),
    oakMarkers: input.grepCountsBySubject.get(subject.dirPath) ?? ZERO_COUNTS,
  };
}

/** Assemble one facts entry per subject, keyed and ordered on dirPath. */
export function assembleFacts(input: AssembleFactsInput): SubjectFacts[] {
  const manifestByDir = new Map(input.manifests.map((manifest) => [manifest.dirPath, manifest]));
  return [...input.subjects]
    .sort((a, b) => compareStrings(a.dirPath, b.dirPath))
    .map((subject) => factsForSubject(subject, input, manifestByDir));
}
