import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { typeSafeEntries } from '@oaknational/type-helpers';

import { SCHEMA_FILENAMES } from '../../collaboration-state/collaboration-json-validation.js';
import { CLOSED_CLAIMS_SCHEMA_VERSION } from '../../collaboration-state/types.js';

/**
 * Real-IO temp-repo builder for practice-substrate integration tests
 * (the injected-seams rule: tests import this helper surface, never `node:fs/promises`
 * directly). Mirrors the live layout the substrate evaluators read: the
 * collaboration state root plus the package-relative schema directory.
 */

const SCHEMAS_DIR = fileURLToPath(new URL('../../collaboration-state/schemas/', import.meta.url));

/** What the temp repository holds. Every surface is absent unless named. */
export interface TempSubstrateRepoContents {
  /** The active-claims registry; when given, the closed-claims archive is written beside it. */
  readonly activeClaims?: unknown;
  /** Comms event files by name, written verbatim under `comms/`. */
  readonly commsEventFiles?: Readonly<Record<string, string>>;
  /** The shared-comms-log render, written verbatim. */
  readonly sharedCommsLog?: string;
}

export async function makeTempSubstrateRepo(
  contents: TempSubstrateRepoContents = {},
): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'live-json-characterisation-'));
  const collaborationRoot = join(root, '.agent/state/collaboration');
  const schemaRoot = join(root, 'agent-tools/src/collaboration-state/schemas');
  for (const dir of ['comms', 'conversations', 'escalations']) {
    await mkdir(join(collaborationRoot, dir), { recursive: true });
  }
  await mkdir(schemaRoot, { recursive: true });
  for (const schema of SCHEMA_FILENAMES) {
    await writeFile(join(schemaRoot, schema), await readFile(join(SCHEMAS_DIR, schema), 'utf8'));
  }
  for (const [filename, text] of typeSafeEntries(contents.commsEventFiles ?? {})) {
    await writeFile(join(collaborationRoot, 'comms', filename), text, 'utf8');
  }
  if (contents.sharedCommsLog !== undefined) {
    await writeFile(
      join(collaborationRoot, 'shared-comms-log.md'),
      contents.sharedCommsLog,
      'utf8',
    );
  }
  if (contents.activeClaims !== undefined) {
    await writeFile(
      join(collaborationRoot, 'active-claims.json'),
      JSON.stringify(contents.activeClaims, null, 2),
      'utf8',
    );
    await writeFile(
      join(collaborationRoot, 'closed-claims.archive.json'),
      JSON.stringify({ schema_version: CLOSED_CLAIMS_SCHEMA_VERSION, claims: [] }, null, 2),
      'utf8',
    );
  }

  return root;
}

export async function removeTempSubstrateRepo(root: string): Promise<void> {
  await rm(root, { recursive: true, force: true });
}
