import { execFile } from 'node:child_process';
import { lstat, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { LEGACY_EVENTS_ROOT, absolutePath } from './live-types.js';
import { evaluateLegacyEventRoot } from './path-evaluators.js';
import { evaluateMergeTopology } from './topology-evaluators.js';
import { type SubstrateFinding } from './types.js';

const execFileAsync = promisify(execFile);

export async function evaluateLegacyEventsRoot(
  repoRoot: string,
): Promise<readonly SubstrateFinding[]> {
  const rootPath = absolutePath(repoRoot, LEGACY_EVENTS_ROOT);
  const stats = await lstat(rootPath).catch(() => undefined);
  const entries =
    stats?.isDirectory() === true ? await listLegacyRootEntries(repoRoot, LEGACY_EVENTS_ROOT) : [];

  return evaluateLegacyEventRoot({
    surface: 'collaboration-comms-events-legacy',
    legacyRoot: LEGACY_EVENTS_ROOT,
    rootExists: stats !== undefined,
    entries: entries.toSorted((left, right) => left.path.localeCompare(right.path)),
  });
}

async function listLegacyRootEntries(
  repoRoot: string,
  root: string,
): Promise<
  readonly {
    readonly path: string;
    readonly kind: 'gitkeep' | 'json' | 'other';
  }[]
> {
  const entries = await readdir(absolutePath(repoRoot, root), { withFileTypes: true });
  const snapshots = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(root, entry.name).split('\\').join('/');
      if (entry.isDirectory()) {
        const childRoot = entryPath.endsWith('/') ? entryPath : `${entryPath}/`;
        return listLegacyRootEntries(repoRoot, childRoot);
      }

      return [
        {
          path: entryPath,
          kind: legacyEntryKind(entry.name),
        },
      ];
    }),
  );

  return snapshots.flat();
}

function legacyEntryKind(name: string): 'gitkeep' | 'json' | 'other' {
  if (name === '.gitkeep') {
    return 'gitkeep';
  }

  return name.endsWith('.json') ? 'json' : 'other';
}

export async function evaluateOptionalGitTopology(
  repoRoot: string,
  targetRef: string,
): Promise<readonly SubstrateFinding[]> {
  const candidateCommit = (await git(repoRoot, ['rev-parse', 'HEAD'])).trim();
  const parentText = await git(repoRoot, ['show', '--no-patch', '--pretty=%P', 'HEAD']);
  const parents = parentText.trim().split(/\s+/).filter(hasText);
  const targetRefReachable = await gitExitCode(repoRoot, [
    'merge-base',
    '--is-ancestor',
    targetRef,
    'HEAD',
  ]);
  const touchedMemoryStatePaths = await touchedMemoryStateFiles(repoRoot);

  return evaluateMergeTopology({
    surface: 'git-topology',
    candidateCommit,
    targetRef,
    parentCount: parents.length,
    targetRefReachable: targetRefReachable === 0,
    touchedMemoryStatePaths,
    claim:
      touchedMemoryStatePaths.length > 0 ? 'completed-memory-state-merge' : 'ordinary-snapshot',
    workflow: parents.length >= 2 ? 'merge' : 'squash',
    nonMergeTreatment: 'report-only',
  });
}

async function touchedMemoryStateFiles(repoRoot: string): Promise<readonly string[]> {
  return (await git(repoRoot, ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD']))
    .split('\n')
    .filter((entry) => entry.startsWith('.agent/memory/') || entry.startsWith('.agent/state/'));
}

async function git(repoRoot: string, args: readonly string[]): Promise<string> {
  return (await execFileAsync('git', args, { cwd: repoRoot })).stdout;
}

async function gitExitCode(repoRoot: string, args: readonly string[]): Promise<number> {
  try {
    await execFileAsync('git', args, { cwd: repoRoot });
    return 0;
  } catch (error) {
    return typeof error === 'object' && error !== null && 'code' in error ? Number(error.code) : 1;
  }
}

function hasText(value: string): boolean {
  return value.length > 0;
}
