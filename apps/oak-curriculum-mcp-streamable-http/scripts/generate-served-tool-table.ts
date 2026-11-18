#!/usr/bin/env node

/**
 * Renders the reviewer-facing served tool table (served-tool-table.md) from the
 * live in-memory `tools/list` of the real composition root, so the table IS the
 * served surface rather than a hand-kept copy (MCP-439).
 *
 * - `generate:tool-table` (no flag) writes the rendering to the tracked file;
 *   run it after any served-surface or description change.
 * - `validate-served-tool-table` (`--check`) renders and compares against the
 *   tracked file without writing: the generator check that turns the check
 *   chain red when the tracked table has drifted from the served surface. A
 *   check that reads a tracked artefact is a validator's work, never an
 *   in-process test's (testing-strategy §Philosophy).
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { err, ok, type Result } from '@oaknational/result';
import { createConnectedClient } from '../src/registration-proof/connected-client.js';
import {
  renderServedToolTable,
  type ServedToolRow,
} from '../src/registration-proof/served-tool-table.js';

const TRACKED_TABLE_PATH = fileURLToPath(new URL('../served-tool-table.md', import.meta.url));
const REGENERATE_COMMAND =
  'pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http generate:tool-table';

/** The table rendered from the served surface, with the row count for the report line. */
interface RenderedTable {
  readonly markdown: string;
  readonly toolCount: number;
}

/** Renders the table from the composition root's live `tools/list`, or returns the renderer's refusal. */
async function renderServedTable(): Promise<Result<RenderedTable, string>> {
  const client = await createConnectedClient();
  try {
    const { tools } = await client.listTools();
    const rows: ServedToolRow[] = tools.map((tool) => ({
      name: tool.name,
      title: tool.title ?? tool.annotations?.title,
      description: tool.description,
      annotations: tool.annotations,
    }));
    const rendered = renderServedToolTable(rows);
    return rendered.ok
      ? ok({ markdown: rendered.value, toolCount: rows.length })
      : err(rendered.error);
  } finally {
    await client.close();
  }
}

function writeTrackedTable(table: RenderedTable): void {
  writeFileSync(TRACKED_TABLE_PATH, table.markdown);
  process.stdout.write(`wrote served-tool-table.md (${String(table.toolCount)} tools)\n`);
}

/** Fails (exit 1) when the tracked file is not the fresh rendering, naming the regeneration command. */
function checkTrackedTable(table: RenderedTable): void {
  const tracked = readFileSync(TRACKED_TABLE_PATH, 'utf8');
  if (tracked === table.markdown) {
    process.stdout.write(
      `served-tool-table.md matches the served surface (${String(table.toolCount)} tools)\n`,
    );
    return;
  }
  process.stderr.write(
    `served-tool-table.md has drifted from the served surface; run \`${REGENERATE_COMMAND}\` and commit the result.\n`,
  );
  process.exitCode = 1;
}

const table = await renderServedTable();
if (!table.ok) {
  process.stderr.write(`${table.error}\n`);
  process.exitCode = 1;
} else if (process.argv.includes('--check')) {
  checkTrackedTable(table.value);
} else {
  writeTrackedTable(table.value);
}
