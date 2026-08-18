/**
 * Shared command context and context-shaped IO helpers. Split from
 * `commands.js` so the check command can consume the facts and render
 * modules (for recompute-and-compare parity) without an import cycle.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { readRowsArtefact, type RowsArtefact } from './artefact.js';
import { listMembers, listTrackedFiles } from './inputs.js';
import { deriveSubjects, type CensusSubject } from './subjects.js';

export interface CommandContext {
  readonly repoRoot: string;
  readonly rowsPath: string;
  readonly legacyPath: string;
  readonly json: boolean;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

export async function deriveLiveSubjects(
  repoRoot: string,
): Promise<Result<CensusSubject[], string>> {
  const [members, trackedFiles] = await Promise.all([
    listMembers(repoRoot),
    listTrackedFiles(repoRoot),
  ]);
  if (!members.ok) {
    return err(members.error);
  }
  if (!trackedFiles.ok) {
    return err(trackedFiles.error);
  }
  return ok(deriveSubjects({ members: members.value, trackedFiles: trackedFiles.value }));
}

export async function loadRowsArtefact(
  context: CommandContext,
): Promise<Result<RowsArtefact, string>> {
  const readResult = await readRowsArtefact(path.resolve(context.repoRoot, context.rowsPath));
  if (!readResult.ok) {
    return err(readResult.error);
  }
  if (readResult.value === null) {
    return err(`${context.rowsPath}: missing — run skeleton first`);
  }
  return ok(readResult.value);
}

export async function readLegacyMarkdown(context: CommandContext): Promise<Result<string, string>> {
  try {
    return ok(await fs.readFile(path.resolve(context.repoRoot, context.legacyPath), 'utf8'));
  } catch (error) {
    return err(`${context.legacyPath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
