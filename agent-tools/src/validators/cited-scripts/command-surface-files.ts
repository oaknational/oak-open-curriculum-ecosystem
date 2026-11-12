import fs from 'node:fs/promises';
import path from 'node:path';

import { readOptionalFile } from '../../core/authored-surfaces.js';

import {
  linesOfCommandFile,
  scriptLinesOfManifest,
  type CommandSurface,
} from './command-surfaces.js';
import { workspaceDirectories } from './workspace-scripts.js';
import { workflowSurface } from './workflow-surface.js';

/**
 * Read the repository's command surfaces from disk: the tracked git hooks,
 * line by line, the run steps of the CI workflows, and the scripts of the
 * root and every workspace `package.json`.
 *
 * @packageDocumentation
 */

/** A tracked git hook or CI workflow file. */
function isCommandFile(trackedPath: string): boolean {
  return (
    trackedPath.startsWith('.husky/') || /^\.github\/workflows\/[^/]+\.ya?ml$/u.test(trackedPath)
  );
}

async function hookOrWorkflow(repoRoot: string, file: string): Promise<CommandSurface> {
  const content = await fs.readFile(path.join(repoRoot, file), 'utf8');
  return file.startsWith('.husky/')
    ? { path: file, lines: linesOfCommandFile(content) }
    : workflowSurface(file, content);
}

async function manifestScripts(
  repoRoot: string,
  directory: string,
): Promise<CommandSurface | undefined> {
  const manifestPath = path.join(directory, 'package.json');
  const text = await readOptionalFile(manifestPath);
  return text === undefined
    ? undefined
    : { path: path.relative(repoRoot, manifestPath), lines: scriptLinesOfManifest(text) };
}

/**
 * The command surfaces of the repository at `repoRoot`, from the tracked
 * paths given.
 */
export async function loadCommandSurfaces(
  repoRoot: string,
  trackedPaths: ReadonlySet<string>,
): Promise<readonly CommandSurface[]> {
  const commandFiles = [...trackedPaths]
    .filter(isCommandFile)
    .sort((left, right) => left.localeCompare(right));
  const directories = [repoRoot, ...(await workspaceDirectories(repoRoot))];
  const [files, manifests] = await Promise.all([
    Promise.all(commandFiles.map(async (file) => hookOrWorkflow(repoRoot, file))),
    Promise.all(directories.map(async (directory) => manifestScripts(repoRoot, directory))),
  ]);
  return [...files, ...manifests.filter((manifest) => manifest !== undefined)];
}
