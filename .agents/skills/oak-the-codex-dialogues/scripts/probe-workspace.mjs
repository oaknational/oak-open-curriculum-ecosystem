/**
 * Workspace isolation and sentinel evidence for the codex mcp-server
 * probe. The write-request leg's mechanical evidence lives here: the
 * sentinel's presence/absence on disk, with absence proven ONLY by
 * ENOENT, and an isolation guard that fails closed when it cannot
 * positively establish the temp root is outside every git worktree.
 */
import { execFile } from 'node:child_process';
import { lstat, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/**
 * The probe workspace must sit outside every git worktree: os.tmpdir()
 * honours caller-controlled TMPDIR, which could point inside a checkout
 * and void the isolation guarantee if sandbox behaviour ever regresses.
 * Checked on tmpdir() itself, BEFORE any directory is created, so a
 * refusal leaves nothing behind. Only a positive "not a git repository"
 * result passes; any other git failure fails closed.
 */
export async function assertOutsideGitWorktree(directory) {
  // Discovery must depend on the DIRECTORY alone: inherited GIT_*
  // variables (GIT_DIR, GIT_WORK_TREE, GIT_CEILING_DIRECTORIES, ...)
  // can redirect or stop repository discovery and make git emit the
  // exact "not a git repository" text this guard treats as success —
  // a caller-controlled bypass of the isolation guarantee. LC_ALL=C
  // pins the child's message locale (above LANG/LC_MESSAGES): git
  // localises its diagnostics, so on a localised machine the same
  // safe result would arrive translated, miss the English match
  // below, and fail closed on a machine where the probe should run.
  const env = {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')),
    ),
    LC_ALL: 'C',
  };
  let failure;
  try {
    await execFileAsync('git', ['-C', directory, 'rev-parse', '--show-toplevel'], { env });
  } catch (error) {
    failure = error;
  }
  if (failure === undefined) {
    throw new Error(
      `temp root ${directory} is inside a git worktree (TMPDIR override?) — ` +
        'refusing to run the write-request leg there',
    );
  }
  const detail = `${failure instanceof Error ? failure.message : String(failure)}`;
  if (detail.includes('not a git repository')) {
    return;
  }
  throw new Error(
    `could not establish isolation for ${directory} (failing closed, not open): ${detail}`,
  );
}

export async function assertSentinelAbsent(workspace, sentinelName) {
  const sentinelPath = join(workspace, sentinelName);
  if (await sentinelExists(sentinelPath)) {
    throw new Error(
      `no-write leg FAILED: sentinel EXISTS at ${sentinelPath} — a write occurred on a ` +
        'disciplined call. The workspace is left in place as evidence. Stop and surface.',
    );
  }
}

/**
 * Absence is proven ONLY by ENOENT, on the directory entry ITSELF:
 * lstat, never stat — stat follows symlinks, so a dangling symlink
 * created at the sentinel path would read as ENOENT and pass as
 * absence even though a write occurred. Any other failure (EACCES,
 * EIO, ...) is an inspection failure and must fail the probe rather
 * than pass as absence.
 */
async function sentinelExists(sentinelPath) {
  try {
    await lstat(sentinelPath);
    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return false;
    }
    throw new Error(
      `could not inspect sentinel path ${sentinelPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function removeWorkspaceIfClean(workspace, sentinelName) {
  try {
    if (!(await sentinelExists(join(workspace, sentinelName)))) {
      await rm(workspace, { recursive: true, force: true });
    }
  } catch {
    process.stdout.write(`workspace left in place (could not verify it is clean): ${workspace}\n`);
  }
}
