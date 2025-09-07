#!/usr/bin/env node
/**
 * Codemod: Replace parent-relative imports in the Notion server with the workspace alias
 * - Target: ecosystem/psycha/oak-notion-mcp/src/**
 * - Rule: Disallow ../ parent imports; replace with @oaknational/oak-notion-mcp/src/*
 * - Idempotent: Only transforms specifiers starting with ../
 *
 * [ARCHIVED] This codemod is retained for historical reference only.
 * See docs/architecture/greek-ecosystem-deprecation.md for context.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const serverSrc = path.join(repoRoot, 'apps/oak-notion-mcp/src');
const aliasPrefix = '@workspace/apps/oak-notion-mcp/';

/** @param {string} p */
function isCodeFile(p) {
  return p.endsWith('.ts') || p.endsWith('.tsx');
}

/** @param {string} spec */
function isParentRelative(spec) {
  return spec.startsWith('../');
}

/**
 * Convert a parent-relative specifier to an alias path based on the file location
 * @param {string} filePath absolute path of the file containing the import
 * @param {string} spec original import specifier (e.g. ../../types/foo)
 */
function toAliasSpecifier(filePath, spec) {
  const fileDir = path.dirname(filePath);
  const absolute = path.resolve(fileDir, spec);
  if (!absolute.startsWith(serverSrc)) {
    // If it resolves outside the package src, leave unchanged (not expected)
    return spec;
  }
  const relativeFromServer = path.relative(serverSrc, absolute).split(path.sep).join('/');
  return aliasPrefix + relativeFromServer;
}

/** @param {string} content @param {string} filePath */
function transformImports(content, filePath) {
  let changed = false;

  // Static imports: import ... from 'spec'
  content = content.replace(
    /(import\s+[^'"\n]+?from\s*['"])([^'"\n]+)(['"];?)/g,
    (m, pre, spec, post) => {
      if (!isParentRelative(spec)) return m;
      const alias = toAliasSpecifier(filePath, spec);
      changed = true;
      return pre + alias + post;
    },
  );

  // Re-exports: export ... from 'spec'
  content = content.replace(
    /(export\s+[^'"\n]+?from\s*['"])([^'"\n]+)(['"];?)/g,
    (m, pre, spec, post) => {
      if (!isParentRelative(spec)) return m;
      const alias = toAliasSpecifier(filePath, spec);
      changed = true;
      return pre + alias + post;
    },
  );

  // Dynamic imports: import('spec') with optional with { type: 'json' }
  content = content.replace(
    /(import\(\s*['"])([^'"\n]+)(['"])\s*(with\s*\{[^\}]*\})?\s*\)/g,
    (m, pre, spec, post, attrs = '') => {
      if (!isParentRelative(spec)) return m;
      const alias = toAliasSpecifier(filePath, spec);
      changed = true;
      return `${pre}${alias}${post}${attrs ? ' ' + attrs : ''})`;
    },
  );

  return { content, changed };
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

async function main() {
  let filesChanged = 0;
  for await (const file of walk(serverSrc)) {
    if (!isCodeFile(file)) continue;
    const original = await fs.readFile(file, 'utf8');
    const { content, changed } = transformImports(original, file);
    if (changed) {
      await fs.writeFile(file, content, 'utf8');
      filesChanged += 1;
      // eslint-disable-next-line no-console
      console.log(`[aliasify] Updated imports in ${path.relative(repoRoot, file)}`);
    }
  }
  // eslint-disable-next-line no-console
  console.log(`[aliasify] Completed. Files changed: ${filesChanged}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
