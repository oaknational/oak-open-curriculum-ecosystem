/**
 * Operator profile — sync state as findings. Pure.
 *
 * A profile root may not exist, may exist without being a repository, or may
 * be a repository with or without a remote (the operator-profile PDR,
 * decisions 13 to 16). Only a repository with a remote has a sync state to
 * report; everything else is information, never a finding.
 */

import { INDEX_FILE_NAME, MACHINES_DIR_NAME, SCOPES_DIR_NAME } from './operator-profile-schema.js';

export interface SyncStateInput {
  /** The root has a `.git` entry. */
  readonly isRepository: boolean;
  /** `git remote` lists at least one remote. */
  readonly hasRemote: boolean;
  /** The current branch tracks an upstream. */
  readonly hasUpstream: boolean;
  /** `git status --porcelain -z`, verbatim: NUL-delimited records. */
  readonly porcelain: string;
  /** Commits on the branch the upstream lacks. */
  readonly ahead: number;
  /** Commits on the upstream the branch lacks. */
  readonly behind: number;
}

export interface SyncAssessment {
  /** Failures, each with the one command that cures it. */
  readonly findings: readonly string[];
  /** Facts that are not failures. */
  readonly info: readonly string[];
}

/** The push as an operator runs it: `push` takes a message, so every cure that prescribes it names one. */
export const PUSH_COMMAND = 'pnpm profile:sync push --message "<seat>: <the fact>"';

const PUSH_CURE = `cure: ${PUSH_COMMAND}`;
const FURNITURE_CURE =
  'cure: commit or ignore them in the profile repository yourself (profile:sync push stages only index.md, repos and machines)';

/** Whether a path is one of the three document kinds a push can stage. */
export function isProfileDocumentPath(relPath: string): boolean {
  return (
    relPath === INDEX_FILE_NAME ||
    relPath.startsWith(`${SCOPES_DIR_NAME}/`) ||
    relPath.startsWith(`${MACHINES_DIR_NAME}/`)
  );
}

/** A rename or copy record (`R` or `C` in either status column) is followed by its source path. */
function isTwoPathRecord(record: string): boolean {
  const status = record.slice(0, 2);
  return status.includes('R') || status.includes('C');
}

/**
 * The dirty paths of NUL-delimited porcelain. Each record is `XY path`; a
 * rename or copy record is followed by a second record holding the source
 * path, and both paths are dirty. Paths are exact: `-z` neither quotes nor
 * escapes them.
 *
 * @param porcelain - `git status --porcelain -z`, verbatim
 * @returns every dirty path, in git's order
 */
export function dirtyPaths(porcelain: string): readonly string[] {
  const records = porcelain.split('\0').filter((record) => record.length > 0);
  const paths: string[] = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index] ?? '';
    paths.push(record.slice(3));
    if (isTwoPathRecord(record)) {
      index += 1;
      const source = records[index];
      if (source !== undefined) {
        paths.push(source);
      }
    }
  }
  return paths;
}

function count(value: number, noun: string): string {
  return `${value} ${noun}${value === 1 ? '' : 's'}`;
}

/** Information for the two states that have nothing to sync; undefined otherwise. */
function nothingToSync(input: SyncStateInput): string | undefined {
  if (!input.isRepository) {
    return 'the profile is not a git repository (first-class; nothing to sync)';
  }
  if (!input.hasRemote) {
    return 'the profile is a git repository with no remote (first-class; nothing to sync)';
  }
  return undefined;
}

/** Dirty documents take the push cure; dirty git furniture cannot, and says so. */
function dirtyFindings(porcelain: string): readonly string[] {
  const dirty = dirtyPaths(porcelain);
  const documents = dirty.filter((relPath) => isProfileDocumentPath(relPath));
  const others = dirty.filter((relPath) => !isProfileDocumentPath(relPath));
  const findings: string[] = [];
  if (documents.length > 0) {
    findings.push(
      `${count(documents.length, 'uncommitted change')} (${documents.join(', ')}) — ${PUSH_CURE}`,
    );
  }
  if (others.length > 0) {
    findings.push(
      `${count(others.length, 'uncommitted change')} outside the profile documents (${others.join(', ')}) — ${FURNITURE_CURE}`,
    );
  }
  return findings;
}

function upstreamFindings(input: SyncStateInput): readonly string[] {
  if (!input.hasUpstream) {
    return [
      `the current branch tracks no upstream — ${PUSH_CURE} (it sets the upstream on first push)`,
    ];
  }
  const findings: string[] = [];
  if (input.ahead > 0) {
    findings.push(`${count(input.ahead, 'unpushed commit')} — ${PUSH_CURE}`);
  }
  if (input.behind > 0) {
    findings.push(
      `${count(input.behind, 'commit')} behind the remote — cure: pnpm profile:sync pull`,
    );
  }
  return findings;
}

/**
 * Assess a profile root's sync state.
 *
 * @param input - the facts the git layer read
 * @returns findings with cures, and information
 */
export function assessSyncState(input: SyncStateInput): SyncAssessment {
  const info = nothingToSync(input);
  if (info !== undefined) {
    return { findings: [], info: [info] };
  }
  return { findings: [...dirtyFindings(input.porcelain), ...upstreamFindings(input)], info: [] };
}
