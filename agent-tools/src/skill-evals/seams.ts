import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { resolveTrustedGit } from '../core/trusted-git.js';

import { blobIdsFromHashObject } from './manifest.js';

/**
 * The seams the skill-evals orchestration runs through: the filesystem, the
 * runner subprocess, git and the clock. Tests inject fakes; the CLI topic
 * binds the real ones here, once, at the composition root.
 *
 * @packageDocumentation
 */

/** A finished subprocess. */
export interface CommandOutput {
  readonly exitCode: number;
}

/** The repository's state the manifest records. */
export interface GitState {
  readonly head: string;
  /** Whether the worktree had no uncommitted change; blob ids identify the evaluated bytes either way. */
  readonly clean: boolean;
}

/** Every effect the orchestration performs. */
export interface SkillEvalsSeams {
  /** The file's text, `undefined` iff absent. */
  readonly readText: (path: string) => Result<string | undefined, Error>;
  /** Regular files below `dir`, as POSIX paths relative to it, in no promised order; a symlink at the root or anywhere below it is a refusal. */
  readonly listFiles: (dir: string) => Result<readonly string[], Error>;
  readonly writeText: (path: string, content: string, executable: boolean) => Result<void, Error>;
  /** A fresh directory whose path is real (every symlink resolved), so the runner's own record of it scrubs. */
  readonly makeTempDir: (prefix: string) => Result<string, Error>;
  /** Make `path`, its parents as needed; a refusal when `path` already exists, so no run writes into another's. */
  readonly makeFreshDir: (path: string) => Result<void, Error>;
  /** Remove a directory tree this tool or the runner made, including one the runner sealed read-only. */
  readonly removeDir: (path: string) => Result<void, Error>;
  /** Run `command` with `args` from `cwd`, its output inherited by the operator's terminal. */
  readonly run: (
    command: string,
    args: readonly string[],
    cwd: string,
  ) => Result<CommandOutput, Error>;
  /** The blob id git gives each file below `dir` (paths relative to it), in order; `--no-filters`, so the id is of the bytes as they stand. */
  readonly blobIds: (dir: string, paths: readonly string[]) => Result<readonly string[], Error>;
  readonly gitState: (repoRoot: string) => Result<GitState, Error>;
  readonly now: () => Date;
}

/** Any thrown value as an Error. */
function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

/** Whether a thrown value is the filesystem's absence code. */
function isAbsence(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}

function readText(path: string): Result<string | undefined, Error> {
  try {
    return ok(readFileSync(path, 'utf8'));
  } catch (error) {
    return isAbsence(error) ? ok(undefined) : err(asError(error));
  }
}

/** Walk `dir` below `root`, collecting regular files; a symlink anywhere is the refusal returned. */
function walk(root: string, dir: string, into: string[]): Error | undefined {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stats = lstatSync(path);
    if (stats.isSymbolicLink()) {
      return new Error(`symlink refused under ${root}: ${relative(root, path)}`);
    }
    const failure = stats.isDirectory() ? walk(root, path, into) : undefined;
    if (failure !== undefined) {
      return failure;
    }
    if (stats.isFile()) {
      into.push(relative(root, path).replaceAll('\\', '/'));
    }
  }
  return undefined;
}

function listFiles(dir: string): Result<readonly string[], Error> {
  try {
    if (lstatSync(dir).isSymbolicLink()) {
      return err(new Error(`symlink refused: ${dir} is itself a link`));
    }
    const files: string[] = [];
    const failure = walk(dir, dir, files);
    return failure === undefined ? ok(files) : err(failure);
  } catch (error) {
    return err(asError(error));
  }
}

function writeText(path: string, content: string, executable: boolean): Result<void, Error> {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, { encoding: 'utf8', mode: executable ? 0o755 : 0o644 });
    return ok(undefined);
  } catch (error) {
    return err(asError(error));
  }
}

function makeTempDir(prefix: string): Result<string, Error> {
  try {
    return ok(realpathSync(mkdtempSync(join(realpathSync(tmpdir()), prefix))));
  } catch (error) {
    return err(asError(error));
  }
}

function makeFreshDir(path: string): Result<void, Error> {
  try {
    mkdirSync(dirname(path), { recursive: true });
    mkdirSync(path);
    return ok(undefined);
  } catch (error) {
    return err(asError(error));
  }
}

/** The runner seals `home/` and `tmp/` under a kept scaffold at mode 000; they open before removal. */
function removeDir(path: string): Result<void, Error> {
  const opened = [
    path,
    join(path, 'sealed'),
    join(path, 'sealed', 'home'),
    join(path, 'sealed', 'tmp'),
  ]
    .map(openForRemoval)
    .find((failure) => failure !== undefined);
  if (opened !== undefined) {
    return err(opened);
  }
  try {
    rmSync(path, { recursive: true, force: true });
    return ok(undefined);
  } catch (error) {
    return err(asError(error));
  }
}

/** Open one sealed entry for removal; absence is not a failure. */
function openForRemoval(sealed: string): Error | undefined {
  try {
    chmodSync(sealed, 0o700);
    return undefined;
  } catch (error) {
    return isAbsence(error) ? undefined : asError(error);
  }
}

function run(command: string, args: readonly string[], cwd: string): Result<CommandOutput, Error> {
  const child = spawnSync(command, args, { cwd, stdio: ['ignore', 'inherit', 'inherit'] });
  if (child.error !== undefined) {
    return err(child.error);
  }
  return ok({ exitCode: child.status ?? 1 });
}

/** One git query under the trusted binary, its trimmed stdout. */
function gitQuery(git: string, repoRoot: string, args: readonly string[]): Result<string, Error> {
  const child = spawnSync(git, args, { cwd: repoRoot, encoding: 'utf8' });
  if (child.error !== undefined) {
    return err(child.error);
  }
  if (child.status !== 0) {
    return err(
      new Error(`git ${args.join(' ')} failed in ${repoRoot}: ${(child.stderr ?? '').trim()}`),
    );
  }
  return ok((child.stdout ?? '').trim());
}

function blobIds(dir: string, paths: readonly string[]): Result<readonly string[], Error> {
  if (paths.length === 0) {
    return ok([]);
  }
  try {
    const hashed = gitQuery(resolveTrustedGit(), dir, [
      'hash-object',
      '--no-filters',
      '--',
      ...paths,
    ]);
    return hashed.ok ? blobIdsFromHashObject(hashed.value, paths, dir) : hashed;
  } catch (error) {
    return err(asError(error));
  }
}

function gitState(repoRoot: string): Result<GitState, Error> {
  try {
    const git = resolveTrustedGit();
    const head = gitQuery(git, repoRoot, ['rev-parse', 'HEAD']);
    if (!head.ok) {
      return head;
    }
    const status = gitQuery(git, repoRoot, ['status', '--porcelain']);
    return status.ok ? ok({ head: head.value, clean: status.value.length === 0 }) : status;
  } catch (error) {
    return err(asError(error));
  }
}

/** The seams bound to this machine. */
export function realSkillEvalsSeams(): SkillEvalsSeams {
  return {
    readText,
    listFiles,
    writeText,
    makeTempDir,
    makeFreshDir,
    removeDir,
    run,
    blobIds,
    gitState,
    now: () => new Date(),
  };
}
