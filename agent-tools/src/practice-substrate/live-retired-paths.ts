import { lstat, readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import {
  CANONICAL_COMMS_ROOT,
  LEGACY_COMMS_ROOTS,
  MANIFEST_PATH,
  SHARED_COMMS_LOG,
  absolutePath,
  isString,
  readOptionalString,
  type ManifestDocument,
} from './live-types.js';
import { evaluateRetiredPathReferences } from './path-evaluators.js';
import { retiredPathLifecycle } from './live-retired-path-lifecycle.js';
import { type SubstrateFinding } from './types.js';

const TEXT_EXTENSIONS = new Set(['.json', '.md', '.txt']);

export async function evaluateRetiredPathScan(
  repoRoot: string,
  manifest: ManifestDocument,
): Promise<readonly SubstrateFinding[]> {
  const paths = await listTextFilesFromRoots(
    repoRoot,
    retiredPathRoots(manifest),
    retiredPathExclusions(manifest),
  );
  const textSnapshots = await Promise.all(
    paths.map(async (path) => {
      const text = await readFile(absolutePath(repoRoot, path), 'utf8');
      return {
        surface: surfaceForPath(manifest, path),
        path,
        lifecycle: retiredPathLifecycle(manifest, path, text),
        text,
      };
    }),
  );
  const snapshots = textSnapshots.flatMap((snapshot) =>
    LEGACY_COMMS_ROOTS.map((retiredPath) => ({
      ...snapshot,
      retiredPath,
      canonicalPath: CANONICAL_COMMS_ROOT,
    })),
  );

  return evaluateRetiredPathReferences(snapshots);
}

function retiredPathRoots(manifest: ManifestDocument): readonly string[] {
  const discovery = manifest.discovery ?? {};
  return [
    ...orEmpty(discovery.live_roots),
    ...orEmpty(discovery.doctrine_roots),
    ...orEmpty(discovery.plan_roots),
    ...orEmpty(discovery.historical_roots),
  ];
}

function retiredPathExclusions(manifest: ManifestDocument): readonly string[] {
  return [
    ...(manifest.discovery?.fixture_roots ?? []),
    ...(manifest.discovery?.exclusions?.map((entry) => entry.pattern).filter(isString) ?? []),
    MANIFEST_PATH,
    SHARED_COMMS_LOG,
    CANONICAL_COMMS_ROOT,
  ];
}

async function listTextFilesFromRoots(
  repoRoot: string,
  roots: readonly string[],
  exclusions: readonly string[],
): Promise<readonly string[]> {
  const files = new Set<string>();
  for (const root of roots) {
    for (const path of await listFiles(repoRoot, root)) {
      if (isTextFile(path) && !isExcluded(path, exclusions)) {
        files.add(path);
      }
    }
  }

  return [...files].toSorted((left, right) => left.localeCompare(right));
}

async function listFiles(repoRoot: string, root: string): Promise<readonly string[]> {
  const absoluteRoot = absolutePath(repoRoot, root);
  const stats = await lstat(absoluteRoot).catch(() => undefined);
  if (stats === undefined) {
    return [];
  }
  if (stats.isFile()) {
    return [normalisePath(relative(repoRoot, absoluteRoot))];
  }

  return listDirectoryFiles(repoRoot, root);
}

async function listDirectoryFiles(repoRoot: string, root: string): Promise<readonly string[]> {
  const files: string[] = [];
  for (const entry of await readdir(absolutePath(repoRoot, root), { withFileTypes: true })) {
    const entryPath = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(repoRoot, slashTerminated(entryPath))));
    } else if (entry.isFile()) {
      files.push(normalisePath(entryPath));
    }
  }

  return files;
}

function surfaceForPath(manifest: ManifestDocument, path: string): string {
  const surface = (manifest.surfaces ?? []).find((entry) => {
    const surfacePath = readOptionalString(entry, 'path');
    return surfacePath !== undefined && (path === surfacePath || path.startsWith(surfacePath));
  });

  return readOptionalString(surface ?? {}, 'id') ?? path;
}

function isTextFile(path: string): boolean {
  return path.endsWith('.schema.json') || TEXT_EXTENSIONS.has(path.slice(path.lastIndexOf('.')));
}

function isExcluded(path: string, exclusions: readonly string[]): boolean {
  return exclusions.some((exclusion) => {
    if (exclusion.endsWith('/**')) {
      return path.startsWith(exclusion.slice(0, -'**'.length));
    }
    if (exclusion.endsWith('/')) {
      return path.startsWith(exclusion);
    }
    if (exclusion.includes('*.example.json')) {
      return path.endsWith('.example.json');
    }

    return path === exclusion;
  });
}

function slashTerminated(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

function normalisePath(path: string): string {
  return path.replaceAll('\\', '/');
}

function orEmpty(values: readonly string[] | undefined): readonly string[] {
  return values ?? [];
}
