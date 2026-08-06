#!/usr/bin/env node

/**
 * Builds the model-behaviour content workspace; `--check` fails when the
 * committed pages have drifted from the registry.
 *
 * @remarks
 * The workspace is generated, never hand-authored — the same doctrine the
 * patterns index and the current-source projection follow. A reviewer's trust
 * in these pages rests on them being a mechanical rendering of the registry, so
 * a hand-edit is a defect and `--check` is what makes that enforceable.
 *
 * @packageDocumentation
 */

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { WORKSPACE_INDEX, WORKSPACE_ROOT } from './content-workspace-config.js';
import { loadWorkspaceInputs } from './load-workspace-inputs.js';
import { orphanedPages, renderWorkspace, stalePages } from './render-workspace.js';
import type { WorkspacePage } from './content-workspace-model.js';

const repoRoot = resolveRepoRoot(import.meta.url);
const CHECK_ONLY = process.argv.includes('--check');

async function readCommitted(pagePath: string): Promise<string | null> {
  return readFile(path.join(repoRoot, pagePath), 'utf8').catch(() => null);
}

/** Repo-relative paths of the Markdown files currently in the workspace. */
async function committedPagePaths(): Promise<readonly string[]> {
  const entries = await readdir(path.join(repoRoot, WORKSPACE_ROOT), {
    recursive: true,
  }).catch(() => []);
  return entries
    .map((entry) => entry.split(path.sep).join('/'))
    .filter((entry) => entry.endsWith('.md'))
    .map((entry) => `${WORKSPACE_ROOT}/${entry}`);
}

async function writePages(pages: readonly WorkspacePage[]): Promise<void> {
  for (const page of pages) {
    const absolute = path.join(repoRoot, page.path);
    await mkdir(path.dirname(absolute), { recursive: true });
    await writeFile(absolute, page.content, 'utf8');
  }
}

function reportDrift(stale: readonly string[], orphans: readonly string[]): void {
  writeErrorLine(
    'build-mcp-content-workspace: the content workspace is stale against the content registry.',
  );
  for (const pagePath of stale) {
    writeErrorLine(`  out of date: ${pagePath}`);
  }
  for (const pagePath of orphans) {
    writeErrorLine(`  no longer generated: ${pagePath}`);
  }
  writeErrorLine(
    '  Rebuild with `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`.',
  );
}

async function main(): Promise<void> {
  const inputs = await loadWorkspaceInputs(repoRoot);
  const pages = renderWorkspace(inputs);

  if (!CHECK_ONLY) {
    await writePages(pages);
    writeLine(
      `build-mcp-content-workspace: wrote ${String(pages.length)} pages covering ` +
        `${String(inputs.current.items.length)} items. Entry point: ${WORKSPACE_INDEX}`,
    );
    return;
  }

  const committed = new Map(
    await Promise.all(
      pages.map(async (page) => [page.path, await readCommitted(page.path)] as const),
    ),
  );
  const stale = stalePages(pages, committed);
  const orphans = orphanedPages(pages, await committedPagePaths());
  if (stale.length === 0 && orphans.length === 0) {
    writeLine(
      `build-mcp-content-workspace: OK (${String(pages.length)} pages in sync with the registry).`,
    );
    return;
  }
  reportDrift(stale, orphans);
  process.exitCode = 1;
}

await main();
