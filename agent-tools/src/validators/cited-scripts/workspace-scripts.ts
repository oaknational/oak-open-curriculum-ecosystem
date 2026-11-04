import fs from 'node:fs/promises';
import path from 'node:path';

import { typeSafeKeys } from '@oaknational/type-helpers';
import { parse as parseYaml } from 'yaml';

import { isEnoent, readOptionalFile } from '../../core/authored-surfaces.js';
import { isPlainObject, nonBlankString } from '../../core/json-narrowing.js';

import { type WorkspaceScripts } from './validate-cited-scripts-helpers.js';

/**
 * Load the script tables the cited-scripts validator resolves against: the
 * root `package.json` scripts and, for every workspace `pnpm-workspace.yaml`
 * names, that package's scripts keyed by package name, with each workspace's
 * repo-relative directory keyed to its name.
 *
 * @packageDocumentation
 */

/** A decoded `package.json`, every field optional `unknown` until narrowed. */
interface PackageManifest {
  readonly name?: unknown;
  readonly scripts?: unknown;
}

/** A decoded `pnpm-workspace.yaml`, every field optional `unknown` until narrowed. */
interface WorkspaceManifest {
  readonly packages?: unknown;
}

function isPackageManifest(value: unknown): value is PackageManifest {
  return isPlainObject(value);
}

function isWorkspaceManifest(value: unknown): value is WorkspaceManifest {
  return isPlainObject(value);
}

/** The script names a decoded manifest declares; empty when it declares none. */
function scriptNames(manifest: PackageManifest): ReadonlySet<string> {
  return isPlainObject(manifest.scripts) ? new Set(typeSafeKeys(manifest.scripts)) : new Set();
}

async function readManifest(absoluteDir: string): Promise<PackageManifest | undefined> {
  const text = await readOptionalFile(path.join(absoluteDir, 'package.json'));
  if (text === undefined) {
    return undefined;
  }
  const parsed: unknown = JSON.parse(text);
  return isPackageManifest(parsed) ? parsed : undefined;
}

async function expandWorkspacePattern(
  repoRoot: string,
  pattern: string,
): Promise<readonly string[]> {
  if (!pattern.endsWith('/*')) {
    return [path.join(repoRoot, pattern)];
  }
  const parent = path.join(repoRoot, pattern.slice(0, -2));
  const entries = await fs.readdir(parent, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(parent, entry.name));
}

/** The absolute directory of every workspace `pnpm-workspace.yaml` names. */
export async function workspaceDirectories(repoRoot: string): Promise<readonly string[]> {
  const text = await fs.readFile(path.join(repoRoot, 'pnpm-workspace.yaml'), 'utf8');
  const parsed: unknown = parseYaml(text);
  const patterns = isWorkspaceManifest(parsed) ? parsed.packages : undefined;
  if (!Array.isArray(patterns)) {
    return [];
  }
  const directories: string[] = [];
  for (const pattern of patterns) {
    if (typeof pattern === 'string') {
      directories.push(...(await expandWorkspacePattern(repoRoot, pattern)));
    }
  }
  return directories;
}

/**
 * The executables installed at the root: `pnpm <bin>` runs one of these when
 * no script has that name (`pnpm turbo run build`, `pnpm tsx …`), from the
 * root or from a workspace directory. An unbuilt checkout has no `.bin`; that
 * is an empty set, never an error.
 */
async function rootBins(repoRoot: string): Promise<ReadonlySet<string>> {
  try {
    return new Set(await fs.readdir(path.join(repoRoot, 'node_modules', '.bin')));
  } catch (error) {
    if (isEnoent(error)) {
      return new Set();
    }
    throw error;
  }
}

/**
 * Load the root and workspace script tables and the root-installed
 * executables from the repository at `repoRoot`.
 */
export async function loadWorkspaceScripts(repoRoot: string): Promise<WorkspaceScripts> {
  const rootManifest = await readManifest(repoRoot);
  const workspaces = new Map<string, ReadonlySet<string>>();
  const directories = new Map<string, string>();
  for (const directory of await workspaceDirectories(repoRoot)) {
    const manifest = await readManifest(directory);
    const name = manifest === undefined ? undefined : nonBlankString(manifest.name);
    if (manifest !== undefined && name !== undefined) {
      workspaces.set(name, scriptNames(manifest));
      directories.set(path.relative(repoRoot, directory).split(path.sep).join('/'), name);
    }
  }
  const rootScripts = rootManifest === undefined ? new Set<string>() : scriptNames(rootManifest);
  return { root: rootScripts, bins: await rootBins(repoRoot), workspaces, directories };
}
