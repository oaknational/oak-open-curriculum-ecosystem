#!/usr/bin/env node
/**
 * Fix alias prefix produced by aliasify-notion-imports
 * Replace @oaknational/oak-notion-mcp/src/ → @oaknational/oak-notion-mcp/
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const serverSrc = path.join(repoRoot, 'apps/oak-notion-mcp/src');

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx'))) {
      yield full;
    }
  }
}

async function main() {
  let changed = 0;
  for await (const file of walk(serverSrc)) {
    const content = await fs.readFile(file, 'utf8');
    let next = content;
    if (next.includes('@oaknational/oak-notion-mcp/src/')) {
      next = next.replaceAll('@oaknational/oak-notion-mcp/src/', '@workspace/apps/oak-notion-mcp/');
    }
    if (next.includes('@oaknational/oak-notion-mcp/')) {
      next = next.replaceAll('@oaknational/oak-notion-mcp/', '@workspace/apps/oak-notion-mcp/');
    }
    if (next !== content) {
      await fs.writeFile(file, next, 'utf8');
      changed += 1;
      // eslint-disable-next-line no-console
      console.log(`[fix-alias] Updated ${path.relative(repoRoot, file)}`);
    }
  }
  // eslint-disable-next-line no-console
  console.log(`[fix-alias] Done. Files changed: ${changed}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
