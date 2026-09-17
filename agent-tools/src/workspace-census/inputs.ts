/**
 * Side-effectful input gatherers for the census instrument. Everything
 * here recomputes from the live repository at run time
 * (`validators-must-recompute`): members from the real pnpm resolver,
 * the tracked file list from git. Pure logic stays in the sibling
 * modules; failures come back as Result values (ADR-088), translated at
 * this boundary.
 */
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

import { err, ok, type Result } from '@oaknational/result';

import { getJsonValue, isJsonObject, parseJsonTextResult } from '../core/json.js';
import { compareStrings } from './compare.js';

const execFileAsync = promisify(execFile);

const TEN_MEGABYTES = 10 * 1024 * 1024;

export interface WorkspaceMember {
  readonly name: string;
  readonly path: string;
}

function toWorkspaceMember(entry: unknown, repoRoot: string): WorkspaceMember | 'root' | null {
  if (!isJsonObject(entry)) {
    return null;
  }
  const name = getJsonValue(entry, 'name');
  const entryPath = getJsonValue(entry, 'path');
  if (typeof name !== 'string' || typeof entryPath !== 'string') {
    return null;
  }
  const relative = path.relative(repoRoot, entryPath);
  if (relative === '') {
    return 'root';
  }
  return { name, path: relative.split(path.sep).join('/') };
}

/**
 * Workspace members from the real resolver (the recursive pnpm listing,
 * depth -1, JSON output). The root project is excluded: the census's
 * source (i) is the workspace-manifest member list, which never contains
 * the root — the root surface enters the subject set through the
 * package-json and code-root arms instead.
 */
export async function listMembers(repoRoot: string): Promise<Result<WorkspaceMember[], string>> {
  let stdout: string;
  try {
    ({ stdout } = await execFileAsync('pnpm', ['-r', 'ls', '--depth', '-1', '--json'], {
      cwd: repoRoot,
      maxBuffer: TEN_MEGABYTES,
    }));
  } catch (error) {
    return err(`pnpm -r ls failed: ${error instanceof Error ? error.message : String(error)}`);
  }
  return parseMemberList(stdout, repoRoot);
}

/** Parse resolver output; pure, so malformed output is a testable Result error. */
export function parseMemberList(
  stdout: string,
  repoRoot: string,
): Result<WorkspaceMember[], string> {
  const parsed = parseJsonTextResult(stdout, 'pnpm -r ls --json');
  if (!parsed.ok) {
    return err(parsed.error.message);
  }
  if (!Array.isArray(parsed.value)) {
    return err('pnpm -r ls --json did not return an array — refusing to guess the member set');
  }
  const members: WorkspaceMember[] = [];
  for (const entry of parsed.value) {
    const member = toWorkspaceMember(entry, repoRoot);
    if (member === null) {
      return err('pnpm -r ls --json returned an entry without name/path — refusing to guess');
    }
    if (member === 'root') {
      continue;
    }
    members.push(member);
  }
  return ok(members.toSorted((a, b) => compareStrings(a.path, b.path)));
}

/** Tracked files from git, NUL-delimited so no filename shape can split wrongly. */
export async function listTrackedFiles(repoRoot: string): Promise<Result<string[], string>> {
  try {
    const { stdout } = await execFileAsync('git', ['ls-files', '-z'], {
      cwd: repoRoot,
      maxBuffer: 8 * TEN_MEGABYTES,
    });
    return ok(stdout.split('\0').filter((line) => line.length > 0));
  } catch (error) {
    return err(`git ls-files failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
