/**
 * Operator profile — reading a profile root. The IO layer shared by the
 * check CLI and the sync tool: root resolution, presence, listing, document
 * validation and the sync leg. Absence is a first-class outcome, never an
 * error; an unreadable root is an error, never absence; a symlinked root is
 * refused, never followed.
 */

import path from 'node:path';

import { collect, err, ok, type Result } from '@oaknational/result';

import {
  parseOperatorProfileDocument,
  type ProfileDocumentExpectation,
} from './operator-profile-document.js';
import {
  presence,
  type PresenceProbe,
  type ProfileFileSystem,
  REAL_PROFILE_FILE_SYSTEM,
} from './operator-profile-fs.js';
import {
  classifyProfileEntries,
  type ProfileEntry,
  type ProfileLayout,
} from './operator-profile-layout.js';
import { INDEX_FILE_NAME, MACHINES_DIR_NAME, SCOPES_DIR_NAME } from './operator-profile-schema.js';
import { syncReport } from './operator-profile-sync-report.js';

export interface DocumentFailure {
  readonly relPath: string;
  readonly messages: readonly string[];
}

/** A document that conformed, with the text the check read: the one read the emit mode prints from. */
export interface ConformingDocument {
  readonly relPath: string;
  readonly content: string;
}

/** What a present root reports: its documents, failures and information. */
export interface ProfileReport {
  readonly documentCount: number;
  /** Every conforming document, in layout order, with the text as read. */
  readonly documents: readonly ConformingDocument[];
  readonly failures: readonly DocumentFailure[];
  readonly info: readonly string[];
}

/**
 * Resolve the profile root: `--root <dir>` wins, then `$PRACTICE_HOME/profile`,
 * then `~/.practice/profile`. An empty or blank `--root` value is a missing
 * argument, never the current directory: `--root "$UNSET"` must not act on
 * whatever checkout the shell happens to be in.
 *
 * @param rootArg - the `--root` value the CLI's grammar parsed, or undefined when the
 *   environment decides (the grammar has already refused a blank or missing value)
 * @param env - the process environment
 * @param home - the user's home directory
 * @returns the absolute profile root
 */
export function resolveProfileRoot(
  rootArg: string | undefined,
  env: Readonly<Record<string, string | undefined>>,
  home: string,
): string {
  if (rootArg !== undefined) {
    return path.resolve(rootArg);
  }
  const practiceHome = env['PRACTICE_HOME'];
  const base =
    practiceHome === undefined || practiceHome === '' ? path.join(home, '.practice') : practiceHome;
  return path.join(base, 'profile');
}

async function listProfileEntries(
  root: string,
  fs: ProfileFileSystem,
): Promise<Result<readonly ProfileEntry[], string>> {
  const levels = await Promise.all(
    [undefined, SCOPES_DIR_NAME, MACHINES_DIR_NAME].map((dirName) => fs.listEntries(root, dirName)),
  );
  const collected = collect(levels);
  return collected.ok ? ok(collected.value.flat()) : collected;
}

/** The root's entries, or `absent`, or the operational failure to report. */
async function readRoot(
  root: string,
  fs: ProfileFileSystem,
): Promise<Result<readonly ProfileEntry[] | 'absent', string>> {
  const there = await fs.presence(root);
  if (!there.ok) {
    return err(`${there.error} — an unreadable profile root is a failure, never absence`);
  }
  switch (there.value) {
    case 'absent':
      return ok('absent');
    case 'symlink':
      return err(`${root} is a symlink — the profile root is never followed`);
    case 'not-a-directory':
      return err(`${root} exists but is not a directory`);
    default:
      return listProfileEntries(root, fs);
  }
}

/** The findings the layout makes before any document is read. */
function layoutFailures(layout: ProfileLayout): DocumentFailure[] {
  return [
    ...layout.notRegular.map((relPath) => ({
      relPath,
      messages: [
        `${relPath} is not a regular file or directory (a symlink or a special entry) — never read as part of the profile`,
      ],
    })),
    ...layout.unexpected.map((relPath) => ({
      relPath,
      messages: [
        'not part of the profile layout (index.md, repos/<scope-key>.md, machines/<machine-key>.md and git furniture only)',
      ],
    })),
  ];
}

type DocumentOutcome =
  | { readonly kind: 'conforming'; readonly document: ConformingDocument }
  | { readonly kind: 'failed'; readonly failure: DocumentFailure };

async function documentOutcome(
  root: string,
  expectation: ProfileDocumentExpectation,
  fs: ProfileFileSystem,
): Promise<DocumentOutcome> {
  const { relPath } = expectation;
  const content = await fs.readDocument(path.join(root, relPath));
  if (!content.ok) {
    return { kind: 'failed', failure: { relPath, messages: [content.error] } };
  }
  const parsed = parseOperatorProfileDocument(expectation, content.value);
  if (!parsed.ok) {
    return { kind: 'failed', failure: { relPath, messages: parsed.error } };
  }
  return { kind: 'conforming', document: { relPath, content: content.value } };
}

/**
 * The document paths a push can stage that exist in the root; an unreadable
 * one is an error, never treated as absent, and a symlink is refused.
 *
 * @param root - the profile root
 * @param probe - what is at a path (the filesystem by default)
 * @returns the existing document paths, in the layout's order
 */
export async function existingProfilePaths(
  root: string,
  probe: PresenceProbe = presence,
): Promise<Result<readonly string[], string>> {
  const present = await Promise.all(
    [INDEX_FILE_NAME, SCOPES_DIR_NAME, MACHINES_DIR_NAME].map(async (relPath) => {
      const there = await probe(path.join(root, relPath));
      if (!there.ok) {
        return there;
      }
      if (there.value === 'symlink') {
        return err(`${relPath} at ${root} is a symlink — never staged as part of the profile`);
      }
      return ok(there.value === 'absent' ? [] : [relPath]);
    }),
  );
  const collected = collect(present);
  return collected.ok ? ok(collected.value.flat()) : collected;
}

/**
 * Read a profile root in full: layout, documents and sync state.
 *
 * @param root - the profile root
 * @param fs - the filesystem to read through (the real one by default)
 * @returns `absent`, or the report, or the operational error that stopped the read
 */
export async function readProfileReport(
  root: string,
  fs: ProfileFileSystem = REAL_PROFILE_FILE_SYSTEM,
): Promise<Result<ProfileReport | 'absent', string>> {
  const entries = await readRoot(root, fs);
  if (!entries.ok) {
    return entries;
  }
  if (entries.value === 'absent') {
    return ok('absent');
  }
  const layout = classifyProfileEntries(entries.value);
  const failures = layoutFailures(layout);
  const documents: ConformingDocument[] = [];
  for (const expectation of layout.documents) {
    const outcome = await documentOutcome(root, expectation, fs);
    if (outcome.kind === 'conforming') {
      documents.push(outcome.document);
    } else {
      failures.push(outcome.failure);
    }
  }
  const sync = await syncReport(root, fs);
  if (!sync.ok) {
    return sync;
  }
  return ok({
    documentCount: layout.documents.length,
    documents,
    failures: [...failures, ...sync.value.failures],
    info: sync.value.info,
  });
}
