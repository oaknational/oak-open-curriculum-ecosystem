#!/usr/bin/env node

/**
 * Regenerates the reviewer-facing served tool table (served-tool-table.md)
 * from the live in-memory `tools/list` of the real composition root, so the
 * table IS the served surface rather than a hand-kept copy (MCP-439). The
 * artefact integration test pins the committed file to the canonical
 * registration walk; run this after any served-surface or description change.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createConnectedClient } from '../src/registration-proof/connected-client.js';
import {
  renderServedToolTable,
  type ServedToolRow,
} from '../src/registration-proof/served-tool-table.js';

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
  if (rendered.ok) {
    const target = fileURLToPath(new URL('../served-tool-table.md', import.meta.url));
    writeFileSync(target, rendered.value);
    process.stdout.write(`wrote served-tool-table.md (${String(rows.length)} tools)\n`);
  } else {
    process.stderr.write(`${rendered.error}\n`);
    process.exitCode = 1;
  }
} finally {
  await client.close();
}
