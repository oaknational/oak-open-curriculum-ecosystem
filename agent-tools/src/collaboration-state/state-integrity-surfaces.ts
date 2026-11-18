/**
 * The collaboration-state surface REGISTRY: which JSON files the integrity
 * validator checks, which root each resolves against, which schema each
 * carries, and which may legitimately be absent. Split from
 * `state-integrity.ts` — which owns how a surface is CHECKED — because this
 * is the half that grows as new surfaces land.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { type CollaborationSchemaId } from './collaboration-json-validation.js';
import { isErrnoCode } from './errno.js';

const COLLABORATION_ROOT = '.agent/state/collaboration';

export interface JsonSurface {
  // The absolute root this surface's path resolves against. Machine-local
  // surfaces (claims, comms, commit-queue — ADR-199/QUEUE-LOCAL) root at
  // the ADR-197 coordination home: in a linked worktree the repo-local
  // copies are decoys (absent, or stale pre-split residue), and validating
  // them lets `check` pass while the canonical store is corrupt.
  readonly root: string;
  // One schemaId, one vocabulary: the shared check owns the parser dispatch
  // (no injectable parser seam), and isContractSchemaId decides which
  // surfaces carry a runtime contract — no second field for drift to split.
  readonly path: string;
  readonly schemaId: CollaborationSchemaId;
  // Untracked-by-design surfaces (ADR-199 Phase-3 untrack) are absent in a fresh
  // checkout (e.g. CI) and present-on-disk on a working instance. An absent such
  // surface is the expected clean state, not an integrity fault.
  readonly optionalWhenAbsent?: boolean;
}

export async function jsonSurfaces(
  repoRoot: string,
  coordinationHome: string,
): Promise<readonly JsonSurface[]> {
  return [
    {
      root: coordinationHome,
      path: `${COLLABORATION_ROOT}/active-claims.json`,
      schemaId: 'active-claims.schema.json',
      optionalWhenAbsent: true,
    },
    {
      root: coordinationHome,
      path: `${COLLABORATION_ROOT}/closed-claims.archive.json`,
      schemaId: 'closed-claims.schema.json',
      optionalWhenAbsent: true,
    },
    ...(await directorySurfaces({
      root: coordinationHome,
      directory: `${COLLABORATION_ROOT}/comms`,
      schemaId: 'comms-event.schema.json',
      // comms/ is untracked-by-design (ADR-199 Phase-3 untrack): absent in a
      // fresh checkout (e.g. CI), present-on-disk on a working instance. An
      // absent comms/ is the expected clean state, not an integrity fault.
      optionalWhenAbsent: true,
    })),
    ...(await directorySurfaces({
      root: coordinationHome,
      directory: `${COLLABORATION_ROOT}/commit-queue`,
      schemaId: 'commit-queue-intent.schema.json',
      // Machine-local ephemera (QUEUE-LOCAL, 2026-08-17): untracked by
      // design and absent until the first enqueue; absence is the expected
      // clean state, not an integrity fault.
      optionalWhenAbsent: true,
    })),
    ...(await directorySurfaces({
      root: repoRoot,
      directory: `${COLLABORATION_ROOT}/conversations`,
      schemaId: 'conversation.schema.json',
      excludeExamples: true,
    })),
    ...(await directorySurfaces({
      root: repoRoot,
      directory: `${COLLABORATION_ROOT}/escalations`,
      schemaId: 'escalation.schema.json',
      excludeExamples: true,
    })),
  ];
}

/** Read a surface's text; an absent optional-when-absent surface reads as undefined. */
export async function readSurfaceText(surface: JsonSurface): Promise<string | undefined> {
  try {
    return await readFile(join(surface.root, surface.path), 'utf8');
  } catch (error) {
    if (surface.optionalWhenAbsent === true && isErrnoCode(error, 'ENOENT')) {
      return undefined;
    }
    throw new Error(`failed to read ${join(surface.root, surface.path)}`, { cause: error });
  }
}

async function directorySurfaces(input: {
  readonly root: string;
  readonly directory: string;
  readonly schemaId: CollaborationSchemaId;
  readonly excludeExamples?: boolean;
  readonly optionalWhenAbsent?: boolean;
}): Promise<readonly JsonSurface[]> {
  const entries = await readDirOrEmpty(
    join(input.root, input.directory),
    input.optionalWhenAbsent === true,
  );
  return (
    entries
      .filter((entry) => entry.endsWith('.json'))
      .filter((entry) => input.excludeExamples !== true || !entry.endsWith('.example.json'))
      .toSorted((left, right) => left.localeCompare(right))
      // The directory's optionality carries to each file: a machine-local
      // ephemeron (a queue intent completed or swept between the listing and
      // the read) vanishing is the store's ordinary absence, not a fault.
      .map((entry) => ({
        root: input.root,
        path: `${input.directory}/${entry}`,
        schemaId: input.schemaId,
        ...(input.optionalWhenAbsent === true ? { optionalWhenAbsent: true } : {}),
      }))
  );
}

async function readDirOrEmpty(
  directory: string,
  optionalWhenAbsent: boolean,
): Promise<readonly string[]> {
  try {
    return await readdir(directory);
  } catch (error) {
    if (optionalWhenAbsent && isErrnoCode(error, 'ENOENT')) {
      return [];
    }
    throw error;
  }
}
