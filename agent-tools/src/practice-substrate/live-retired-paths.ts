import { lstat, readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

import {
  ACTIVE_CLAIMS_PATH,
  CANONICAL_COMMS_ROOT,
  CLOSED_CLAIMS_PATH,
  LEGACY_COMMS_ROOTS,
  MANIFEST_PATH,
  SHARED_COMMS_LOG,
  absolutePath,
  isJsonFieldMap,
  isString,
  readOptionalString,
  type ManifestDocument,
} from './live-types.js';
import { evaluateRetiredPathReferences } from './path-evaluators.js';
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

function retiredPathLifecycle(
  manifest: ManifestDocument,
  path: string,
  text: string,
): 'live' | 'archived' | 'historical' {
  if (isKnownHistoricalPath(path, text)) {
    return path === CLOSED_CLAIMS_PATH ? 'archived' : 'historical';
  }
  if (matchesAnyRoot(path, manifest.discovery?.historical_roots ?? [])) {
    return 'archived';
  }
  if (isHistoricalDiscussion(text)) {
    return 'historical';
  }

  return 'live';
}

function isKnownHistoricalPath(path: string, text: string): boolean {
  return (
    path === CLOSED_CLAIMS_PATH ||
    path.includes('/archive/') ||
    LEGACY_COMMS_ROOTS.some((root) => path.startsWith(root)) ||
    (path === ACTIVE_CLAIMS_PATH && activeClaimMentionsAreAbandonedEvidence(text))
  );
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

function matchesAnyRoot(path: string, roots: readonly string[]): boolean {
  return roots.some((root) => path === root || path.startsWith(root));
}

function slashTerminated(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

function normalisePath(path: string): string {
  return path.split('\\').join('/');
}

function orEmpty(values: readonly string[] | undefined): readonly string[] {
  return values ?? [];
}

function activeClaimMentionsAreAbandonedEvidence(text: string): boolean {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonFieldMap(parsed)) {
    return false;
  }

  const claims = parsed.claims;
  if (containsRetiredPath(claims)) {
    return false;
  }

  const matchingQueueEntries = Array.isArray(parsed.commit_queue)
    ? parsed.commit_queue.filter(containsRetiredPath)
    : [];
  return (
    matchingQueueEntries.length > 0 &&
    matchingQueueEntries.every((entry) => isJsonFieldMap(entry) && entry.phase === 'abandoned')
  );
}

function isHistoricalDiscussion(text: string): boolean {
  const contexts = retiredPathContexts(text);
  return contexts.length > 0 && contexts.every(isHistoricalContext);
}

const HISTORICAL_CONTEXT_PATTERN =
  /historical|legacy|migration|migrated|source evidence|provenance/;

function isHistoricalContext(context: string): boolean {
  return !context.includes('.gitkeep') && HISTORICAL_CONTEXT_PATTERN.test(context);
}

function retiredPathContexts(text: string): readonly string[] {
  const contexts: string[] = [];
  for (const root of LEGACY_COMMS_ROOTS) {
    let index = text.indexOf(root);
    while (index >= 0) {
      contexts.push(text.slice(Math.max(0, index - 1000), index + root.length + 1000));
      index = text.indexOf(root, index + root.length);
    }
  }

  return contexts;
}

function containsRetiredPath(value: unknown): boolean {
  if (typeof value === 'string') {
    return LEGACY_COMMS_ROOTS.some((root) => value.includes(root));
  }
  if (Array.isArray(value)) {
    return value.some(containsRetiredPath);
  }
  if (isJsonFieldMap(value)) {
    for (const key in value) {
      if (containsRetiredPath(value[key])) {
        return true;
      }
    }
  }

  return false;
}
