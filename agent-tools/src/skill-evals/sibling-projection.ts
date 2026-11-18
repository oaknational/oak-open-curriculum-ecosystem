import { posix } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import type { PluginSkill, ProjectedFile } from './project.js';
import type { SkillEvalsSeams } from './seams.js';
import {
  rewriteSiblingLinks,
  type SiblingReference,
  type SourcedFile,
} from './sibling-references.js';

/**
 * The projection of a skill's files with the sibling references they link
 * carried under the skill, transitively, each read once from its canonical
 * source; the sibling set is reported so the manifest names its versions.
 *
 * @packageDocumentation
 */

/** One skill's files in the plugin and, by canonical path in order, the sibling references among them, so the manifest can name their versions and be compared across runs. */
export interface PluginSkillFiles {
  readonly files: readonly ProjectedFile[];
  readonly sharedReferences: readonly string[];
}

/** A file that must exist; one that reads as absent is an error naming it. */
export function readRequired(
  path: string,
  label: string,
  seams: SkillEvalsSeams,
): Result<string, Error> {
  const text = seams.readText(path);
  if (!text.ok) {
    return text;
  }
  return text.value === undefined ? err(new Error(`${label} reads as absent`)) : ok(text.value);
}

/** One sibling reference read from its canonical source, or the refusal naming the link that needs it. */
function siblingFile(
  repoRoot: string,
  needed: SiblingReference,
  seams: SkillEvalsSeams,
): Result<SourcedFile, Error> {
  const label = `${needed.linkedFrom} links ${needed.target}, which resolves to ${needed.sourcePath}, and that file`;
  const text = readRequired(posix.join(repoRoot, needed.sourcePath), label, seams);
  return text.ok
    ? ok({
        file: { path: needed.projectedPath, content: text.value, executable: false },
        sourcePath: needed.sourcePath,
      })
    : text;
}

/** Whether `needed` is already projected from the same source; a different source at its path is the refusal. */
function alreadyHeld(
  needed: SiblingReference,
  sources: ReadonlyMap<string, string>,
): Result<boolean, Error> {
  const held = sources.get(needed.projectedPath);
  if (held === undefined) {
    return ok(false);
  }
  return held === needed.sourcePath
    ? ok(true)
    : err(
        new Error(
          `${needed.linkedFrom} links ${needed.target}, which would project ${needed.sourcePath} at ${needed.projectedPath}, where ${held} already sits`,
        ),
      );
}

/** The files placed so far, the canonical source each came from, the sibling references among them, and the ones still to read. */
interface Projection {
  readonly projected: Map<string, ProjectedFile>;
  readonly sources: Map<string, string>;
  readonly shared: string[];
  readonly queue: SiblingReference[];
}

/** Place one file with its sibling links rewritten, queueing the sibling references it needs. */
function placeFile(projection: Projection, sourced: SourcedFile, skill: PluginSkill): void {
  const rewritten = sourced.file.path.endsWith('.md')
    ? rewriteSiblingLinks(sourced, skill)
    : { file: sourced.file, needed: [] };
  projection.projected.set(rewritten.file.path, rewritten.file);
  projection.sources.set(rewritten.file.path, sourced.sourcePath);
  projection.queue.push(...rewritten.needed);
}

/** Read and place one needed sibling reference, unless the same source already sits at its path. */
function projectNeeded(
  repoRoot: string,
  projection: Projection,
  needed: SiblingReference,
  skill: PluginSkill,
  seams: SkillEvalsSeams,
): Result<void, Error> {
  const held = alreadyHeld(needed, projection.sources);
  if (!held.ok) {
    return held;
  }
  if (held.value) {
    return ok(undefined);
  }
  const read = siblingFile(repoRoot, needed, seams);
  if (!read.ok) {
    return read;
  }
  placeFile(projection, read.value, skill);
  projection.shared.push(needed.sourcePath);
  return ok(undefined);
}

/** The skill's own files with their sibling links rewritten, then every sibling reference they need, transitively, each projected once. */
export function withSiblingReferences(
  repoRoot: string,
  skill: PluginSkill,
  own: readonly SourcedFile[],
  seams: SkillEvalsSeams,
): Result<PluginSkillFiles, Error> {
  const projection: Projection = {
    projected: new Map(),
    sources: new Map(),
    shared: [],
    queue: [],
  };
  for (const sourced of own) {
    placeFile(projection, sourced, skill);
  }
  while (projection.queue.length > 0) {
    const needed = projection.queue.shift();
    if (needed === undefined) {
      break;
    }
    const step = projectNeeded(repoRoot, projection, needed, skill, seams);
    if (!step.ok) {
      return step;
    }
  }
  return ok({
    files: [...projection.projected.values()],
    sharedReferences: projection.shared.toSorted((a, b) => a.localeCompare(b, 'en')),
  });
}
