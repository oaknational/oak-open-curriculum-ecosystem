/**
 * The `node:fs`-backed {@link ArchiveMoveExecuteIo} for the WS7 archive-move.
 *
 * @remarks
 * The one boundary where throwing libraries (`node:fs`, `JSON.parse`, the
 * schema-first {@link parseCommsEvent}) are translated into the repository
 * {@link Result} pattern (ADR-088): each fallible operation catches and
 * re-expresses the failure as `err(message)`, keeping the orchestrators IO-free
 * and unit-testable against an in-memory seam. Reads reuse `parseCommsEvent`; the
 * counts reuse {@link isEventFile} so byte-preservation covers event files only
 * (never `manifest.jsonl` / `.gitkeep`); the move is a same-filesystem rename.
 *
 * @packageDocumentation
 */

import { appendFileSync, existsSync, readdirSync, readFileSync, renameSync } from 'node:fs';

import { err, ok, type Result } from '@oaknational/result';

import { parseCommsEvent } from '../state-parsers.js';
import { isEventFile } from './archive-move.js';
import type { ArchiveMoveExecuteIo } from './archive-move-types.js';
import type { ClassifiableEvent } from './event-classification.js';
import { toClassifiableEvent } from './event-projection.js';
import { manifestRowEventId } from './manifest.js';

function errorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

function listEventFilenames(commsDir: string): Result<readonly string[], string> {
  try {
    return ok(readdirSync(commsDir));
  } catch (cause) {
    return err(errorMessage(cause));
  }
}

function readEvent(path: string): Result<ClassifiableEvent, string> {
  try {
    return ok(toClassifiableEvent(parseCommsEvent(readFileSync(path, 'utf8'))));
  } catch (cause) {
    return err(errorMessage(cause));
  }
}

function countEventFiles(dir: string): Result<number, string> {
  try {
    return ok(readdirSync(dir).filter(isEventFile).length);
  } catch (cause) {
    return err(errorMessage(cause));
  }
}

function readManifestEventIds(manifestPath: string): Result<ReadonlySet<string>, string> {
  if (!existsSync(manifestPath)) {
    return ok(new Set());
  }
  try {
    const ids = new Set<string>();
    for (const line of readFileSync(manifestPath, 'utf8').split('\n')) {
      const id = manifestRowEventId(line);
      if (id !== null) {
        ids.add(id);
      }
    }
    return ok(ids);
  } catch (cause) {
    return err(errorMessage(cause));
  }
}

function appendManifestRow(manifestPath: string, jsonLine: string): Result<void, string> {
  try {
    appendFileSync(manifestPath, `${jsonLine}\n`);
    return ok(undefined);
  } catch (cause) {
    return err(errorMessage(cause));
  }
}

/**
 * Move an event file via a same-filesystem rename. `comms/` and `comms-archive/`
 * are siblings under `.agent/state/collaboration/`, so `renameSync` is atomic; a
 * cross-device move (`EXDEV`) surfaces as a `move-failed` err — fail-closed, no
 * data loss (the source is untouched when rename throws).
 */
function moveEventFile(fromPath: string, toPath: string): Result<void, string> {
  try {
    renameSync(fromPath, toPath);
    return ok(undefined);
  } catch (cause) {
    return err(errorMessage(cause));
  }
}

/** Build the `node:fs`-backed {@link ArchiveMoveExecuteIo}. */
export function createNodeArchiveMoveIo(): ArchiveMoveExecuteIo {
  return {
    listEventFilenames,
    readEvent,
    countEventFiles,
    readManifestEventIds,
    appendManifestRow,
    moveEventFile,
  };
}
