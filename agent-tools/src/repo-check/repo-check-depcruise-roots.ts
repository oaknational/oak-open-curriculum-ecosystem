import { err, isErr, ok, type Result } from '@oaknational/result';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

/**
 * The directories the dependency-cruiser gate cruises, computed from the
 * workspace manifest (`pnpm-workspace.yaml`) rather than listed: every
 * workspace the manifest declares owes a cruise, and a root list kept by hand
 * drifts from the manifest in silence (a workspace added to the manifest and
 * not to the list is a partial cruise that exits clean). The roots are the
 * first path segment of each `packages` entry (`tooling/*` cruises `tooling`,
 * `packages/core/result` cruises `packages`), each once, in the manifest's
 * order; negated entries (`!`) narrow pnpm's resolution and name no root; an
 * entry whose first segment leaves the repository (`../outside`) is refused,
 * since the gate cruises only directories inside it.
 *
 * @packageDocumentation
 */

/** The one shape of the manifest this module reads. */
const WorkspaceManifest = z.object({ packages: z.array(z.string()).min(1) });

/** The first path segment of a workspace entry, or undefined when the entry names no directory. */
function rootSegment(entry: string): string | undefined {
  const trimmed = entry.trim().replace(/^\.\//u, '');
  const [segment] = trimmed.split('/');
  if (segment === undefined || segment === '' || segment === '.' || segment.includes('*')) {
    return undefined;
  }
  return segment;
}

/** The `packages` entries the manifest text declares, or the reason the text is not a workspace manifest. */
function workspaceEntries(manifestText: string): Result<readonly string[], string> {
  let parsed: unknown;
  try {
    parsed = parseYaml(manifestText);
  } catch (error: unknown) {
    return err(
      `pnpm-workspace.yaml is not YAML: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  const manifest = WorkspaceManifest.safeParse(parsed);
  if (!manifest.success) {
    return err('pnpm-workspace.yaml declares no packages list to cruise');
  }
  return ok(manifest.data.packages);
}

/** The first segment of each entry, once, in order; negated entries skipped; an entry naming no directory refused. */
function rootsOfEntries(entries: readonly string[]): Result<readonly string[], string> {
  const roots: string[] = [];
  for (const entry of entries) {
    if (entry.trim().startsWith('!')) {
      continue;
    }
    const segment = rootSegment(entry);
    if (segment === undefined) {
      return err(`pnpm-workspace.yaml entry '${entry}' names no directory to cruise`);
    }
    if (segment === '..') {
      return err(
        `pnpm-workspace.yaml entry '${entry}' leaves the repository; the gate cruises only directories inside it`,
      );
    }
    if (!roots.includes(segment)) {
      roots.push(segment);
    }
  }
  return roots.length === 0
    ? err('pnpm-workspace.yaml declares no directory to cruise')
    : ok(roots);
}

/**
 * The cruise roots the manifest text declares, each once in manifest order;
 * an error names the reason when the text is not a workspace manifest or an
 * entry names no directory (a glob at the first segment cruises nothing the
 * gate can name).
 */
export function cruiseRootsFromWorkspaceManifest(
  manifestText: string,
): Result<readonly string[], string> {
  const entries = workspaceEntries(manifestText);
  return isErr(entries) ? entries : rootsOfEntries(entries.value);
}
