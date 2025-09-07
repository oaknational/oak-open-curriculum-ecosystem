#!/usr/bin/env node
/**
 * Codemod: Replace @workspace/apps/oak-notion-mcp/* imports with relative paths within the package
 * - Target: ecosystem/psycha/oak-notion-mcp/src/**
 * - Rule: Convert alias to ./ or ../; drop trailing .js in specifier for TS sources
 * - Idempotent: Only transforms specifiers starting with the alias prefix
 *
 * [ARCHIVED] This codemod is retained for historical reference only.
 * See docs/architecture/greek-ecosystem-deprecation.md for context.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const serverSrc = path.join(repoRoot, 'apps/oak-notion-mcp/src');
const aliasPrefix = '@workspace/apps/oak-notion-mcp/';

function dropJsExtension(spec) {
  return spec.endsWith('.js') ? spec.slice(0, -3) : spec;
}

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

function toRelative(fromFile, aliasSpec) {
  const rest = aliasSpec.slice(aliasPrefix.length); // path under src/
  const absolute = path.join(serverSrc, rest);
  const fromDir = path.dirname(fromFile);
  let rel = path.relative(fromDir, absolute);
  if (!rel.startsWith('.')) rel = './' + rel;
  // normalise to posix-style for ESM imports
  rel = rel.split(path.sep).join('/');
  // drop .js suffix for TS source imports
  rel = dropJsExtension(rel);
  return rel;
}

function transformContent(filePath, content) {
  let changed = false;

  const replaceStatic = (match, pre, spec, post) => {
    if (!spec.startsWith(aliasPrefix)) return match;
    const rel = toRelative(filePath, spec);
    changed = true;
    return pre + rel + post;
  };

  // import ... from 'spec'
  content = content.replace(/(import\s+[^'"\n]+?from\s*['"])([^'"\n]+)(['"];?)/g, replaceStatic);

  // export ... from 'spec'
  content = content.replace(/(export\s+[^'"\n]+?from\s*['"])([^'"\n]+)(['"];?)/g, replaceStatic);

  // dynamic import('spec' [with { type: 'json' }])
  content = content.replace(
    /(import\(\s*['"])([^'"\n]+)(['"])\s*(with\s*\{[^}]*\})?\s*\)/g,
    (m, pre, spec, post, attrs = '') => {
      if (!spec.startsWith(aliasPrefix)) return m;
      const rel = toRelative(filePath, spec);
      changed = true;
      return `${pre}${rel}${post}${attrs ? ' ' + attrs : ''})`;
    },
  );

  return { content, changed };
}

(async () => {
  let changedCount = 0;
  for await (const file of walk(serverSrc)) {
    const content = await fs.readFile(file, 'utf8');
    if (!content.includes(aliasPrefix)) continue;
    const { content: next, changed } = transformContent(file, content);
    if (changed) {
      await fs.writeFile(file, next, 'utf8');
      changedCount += 1;
      // eslint-disable-next-line no-console
      console.log(`[un-aliasify] Updated ${path.relative(repoRoot, file)}`);
    }
  }
  // eslint-disable-next-line no-console
  console.log(`[un-aliasify] Completed. Files changed: ${changedCount}`);
})().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
