/**
 * Resolve `pnpm <script>` citations in authored surfaces against the scripts
 * `package.json` files actually define.
 *
 * A transplanted or hand-copied gate list drifts from the scripts that exist:
 * on 2026-09-12 twelve of the nineteen `pnpm` invocations in the shared
 * start-right workflow named scripts this repository does not have, and
 * nothing refused the citations. This helper is the recur-proof half of the
 * cure. Extraction lives in `extract-script-citations.ts`; this module
 * resolves each citation against the root and workspace script tables.
 *
 * The helper is pure and operates on in-memory files and script tables; the
 * runtime that walks the file system is in `validate-cited-scripts.ts`.
 *
 * @packageDocumentation
 */

import { extractScriptCitations, type ScriptCitation } from './extract-script-citations.js';

export { extractScriptCitations, type ScriptCitation };

/** The script tables the citations resolve against. */
export interface WorkspaceScripts {
  /** Root `package.json` script names. */
  readonly root: ReadonlySet<string>;
  /**
   * Root-installed executables: `pnpm <bin>` runs one from the root or from
   * any workspace directory when no script has that name.
   */
  readonly bins: ReadonlySet<string>;
  /** Workspace package name → its script names. */
  readonly workspaces: ReadonlyMap<string, ReadonlySet<string>>;
  /** Workspace directory (repo-relative, POSIX, no trailing slash) → its package name. */
  readonly directories: ReadonlyMap<string, string>;
}

/** A citation that resolves to no script. */
export interface MissingScriptFinding {
  /** Repo-relative path to the file containing the finding. */
  readonly path: string;
  /** 1-based line number of the finding. */
  readonly line: number;
  /** The cited command text. */
  readonly match: string;
  /** The script name that did not resolve. */
  readonly scriptName: string;
  /** Where the name was looked up: `root` or the workspace package name. */
  readonly scope: string;
  /** Why it did not resolve. */
  readonly reason: 'missing-script' | 'unknown-workspace';
}

/**
 * Resolve every citation in the given files against the script tables.
 *
 * @param files - In-memory files with repo-relative paths.
 * @param scripts - The root and workspace script tables.
 * @returns Findings in file then line order; empty when every citation
 * resolves.
 *
 * @example
 * ```ts
 * findMissingScriptCitations(
 *   [{ path: 'docs/guide.md', content: 'Run `pnpm sdk-codegen` first.' }],
 *   { root: new Set(['build']), workspaces: new Map() },
 * );
 * // [{ path: 'docs/guide.md', line: 1, match: 'pnpm sdk-codegen', scriptName: 'sdk-codegen', scope: 'root', reason: 'missing-script' }]
 * ```
 */
export function findMissingScriptCitations(
  files: readonly { readonly path: string; readonly content: string }[],
  scripts: WorkspaceScripts,
): readonly MissingScriptFinding[] {
  const findings: MissingScriptFinding[] = [];
  for (const file of files) {
    for (const citation of extractScriptCitations(file.content)) {
      const finding = resolveCitation(file.path, citation, scripts);
      if (finding !== undefined) {
        findings.push(finding);
      }
    }
  }
  return findings;
}

/**
 * Resolve one citation found in the file at `path`: filtered against the
 * named workspace's table; unfiltered against the table of the workspace
 * whose directory contains the citation's working directory, as pnpm runs
 * the nearest `package.json`, otherwise against the root table, and in both
 * cases against the root-installed executables.
 */
export function resolveCitation(
  path: string,
  citation: ScriptCitation,
  scripts: WorkspaceScripts,
): MissingScriptFinding | undefined {
  return citation.workspaceFilter === undefined
    ? resolveUnfiltered(path, citation, scripts)
    : resolveFiltered(path, citation, citation.workspaceFilter, scripts);
}

const NO_SCRIPTS: ReadonlySet<string> = new Set();

function resolveUnfiltered(
  path: string,
  citation: ScriptCitation,
  scripts: WorkspaceScripts,
): MissingScriptFinding | undefined {
  const name = workspaceContaining(citation.workingDirectory, scripts);
  const table = name === undefined ? scripts.root : (scripts.workspaces.get(name) ?? NO_SCRIPTS);
  return table.has(citation.scriptName) || scripts.bins.has(citation.scriptName)
    ? undefined
    : finding(path, citation, name ?? 'root', 'missing-script');
}

function resolveFiltered(
  path: string,
  citation: ScriptCitation,
  filter: string,
  scripts: WorkspaceScripts,
): MissingScriptFinding | undefined {
  const workspace = scripts.workspaces.get(filter);
  if (workspace === undefined) {
    return finding(path, citation, filter, 'unknown-workspace');
  }
  return citation.builtin === true || workspace.has(citation.scriptName)
    ? undefined
    : finding(path, citation, filter, 'missing-script');
}

/**
 * The package name of the deepest workspace whose directory is `directory`
 * or an ancestor of it; `undefined` at the root or under no workspace.
 */
function workspaceContaining(
  directory: string | undefined,
  scripts: WorkspaceScripts,
): string | undefined {
  if (directory === undefined) {
    return undefined;
  }
  let nearest: { readonly depth: number; readonly name: string } | undefined;
  for (const [workspaceDirectory, name] of scripts.directories) {
    const contains =
      directory === workspaceDirectory || directory.startsWith(`${workspaceDirectory}/`);
    if (contains && (nearest === undefined || workspaceDirectory.length > nearest.depth)) {
      nearest = { depth: workspaceDirectory.length, name };
    }
  }
  return nearest?.name;
}

function finding(
  path: string,
  citation: ScriptCitation,
  scope: string,
  reason: MissingScriptFinding['reason'],
): MissingScriptFinding {
  return {
    path,
    line: citation.line,
    match: citation.match,
    scriptName: citation.scriptName,
    scope,
    reason,
  };
}
