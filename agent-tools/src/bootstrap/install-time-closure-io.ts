/**
 * Read the workspace for the install-time closure: the `packages` patterns
 * `pnpm-workspace.yaml` declares, and every workspace package's manifest.
 *
 * Runs before any workspace package is built, so it uses `node:fs` and an
 * external dependency (`tinyglobby`) and nothing from the workspace. It reads
 * the filesystem, never git: an install can run where no repository exists (a
 * deploy's tarball) and must see a workspace package that is not yet
 * committed. The patterns are matched as pnpm matches them for `package.json`
 * manifests. Parsing the text, and refusing text that does not parse, is pure
 * in `install-time-manifest.ts`; this module reads, and names a file it cannot.
 *
 * @packageDocumentation
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { globSync } from 'tinyglobby';

import { byCodeUnit, type ClosureResult } from './install-time-closure-graph.js';
import {
  describeError,
  parseManifestText,
  parseWorkspacePatterns,
  type WorkspaceManifestInput,
} from './install-time-manifest.js';

/**
 * The `packages` patterns `pnpm-workspace.yaml` declares.
 *
 * @param repoRoot - Absolute path of the repository root.
 * @returns The patterns, or a refusal naming the file.
 */
export function readWorkspacePatterns(repoRoot: string): ClosureResult<readonly string[]> {
  const workspaceFile = path.join(repoRoot, 'pnpm-workspace.yaml');
  const text = readText(workspaceFile);
  return text.ok ? parseWorkspacePatterns(workspaceFile, text.value) : text;
}

/**
 * Every workspace package's directory, relative to the repository root with
 * `/` separators, paired with its parsed manifest, in code-unit path order.
 *
 * @param repoRoot - Absolute path of the repository root.
 * @param patterns - The `pnpm-workspace.yaml` patterns.
 * @returns The manifests, or a refusal naming a manifest.
 */
export function readWorkspaceManifests(
  repoRoot: string,
  patterns: readonly string[],
): ClosureResult<readonly WorkspaceManifestInput[]> {
  const manifestPaths = globSync(
    patterns.map((pattern) => `${pattern}/package.json`),
    { cwd: repoRoot, ignore: ['**/node_modules/**'] },
  ).sort(byCodeUnit);
  const inputs: WorkspaceManifestInput[] = [];
  for (const manifestPath of manifestPaths) {
    const text = readText(path.join(repoRoot, manifestPath));
    const input = text.ok ? parseManifestText(manifestPath, text.value) : text;
    if (!input.ok) {
      return input;
    }
    inputs.push(input.value);
  }
  return { ok: true, value: inputs };
}

/** A file's text, or a refusal naming the file when it cannot be read. */
function readText(filePath: string): ClosureResult<string> {
  try {
    return { ok: true, value: readFileSync(filePath, 'utf8') };
  } catch (error) {
    return { ok: false, error: `${filePath} cannot be read: ${describeError(error)}` };
  }
}
