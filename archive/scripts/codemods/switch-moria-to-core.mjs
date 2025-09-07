#!/usr/bin/env node
/**
 * Codemod to replace '@oaknational/mcp-moria' imports with '@oaknational/mcp-core'
 *
 * [ARCHIVED] This codemod is retained for historical reference only.
 * See docs/architecture/greek-ecosystem-deprecation.md for context.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const targets = ['apps', 'packages'];

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name.startsWith('.turbo')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx'))) {
      yield full;
    }
  }
}

let changed = 0;
for (const t of targets) {
  const root = path.join(repoRoot, t);
  try {
    for await (const file of walk(root)) {
      const src = await fs.readFile(file, 'utf8');
      if (src.includes("'@oaknational/mcp-moria'")) {
        const next = src.replaceAll("'@oaknational/mcp-moria'", "'@oaknational/mcp-core'");
        if (next !== src) {
          await fs.writeFile(file, next, 'utf8');
          changed += 1;
          console.log(`[moria→core] ${path.relative(repoRoot, file)}`);
        }
      }
    }
  } catch {}
}

console.log(`moria→core replacements: ${changed}`);
