#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

// Deterministic rubric configuration
const DENY_TOKENS = [
  'psycha',
  'psychon',
  'chorai',
  'chora',
  'aither',
  'stroma',
  'phaneron',
  'organa',
  'moria',
  'histoi',
  'histos',
  'eidola',
  'morphai',
  'krypton',
  'kanon',
  'kratos',
  'nomos',
  'systema',
];

// Allowed path-level exceptions (remain for historical context or archives)
// Match any archive segment anywhere: **/archive/**
const ALLOW_PATH_PATTERNS = [
  /(^|\/)archive\//,
  /(^|\/)\.agent\/experience\//,
  /(^|\/)\.agent\/plans\//,
  /(^|\/)\.agent\/refactor\//,
  /(^|\/)\.agent\/roles\//,
  /(^|\/)\.claude\//,
  /(^|\/)\.vscode\//,
  /^docs\/architecture\/greek-ecosystem-deprecation\.md$/,
  /^docs\/architecture\/architectural-decisions\//,
  /^scripts\/codemods\//,
  /^scripts\/identity-check\.mjs$/,
];

// File filters
const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.turbo', '.git']);

const EXCLUDE_FILES = new Set(['pnpm-lock.yaml', 'yarn.lock', 'package-lock.json']);

const INCLUDED_EXTS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.cjs',
  '.mjs',
  '.json',
  '.md',
  '.yml',
  '.yaml',
  '.tsconfig',
  '.toml',
  '.sh',
  '.txt',
]);

const MODE = process.argv.includes('--mode=enforce') ? 'enforce' : 'report';

function isAllowedPath(relPath) {
  return ALLOW_PATH_PATTERNS.some((re) => re.test(relPath));
}

function isSkippable(relPath) {
  const parts = relPath.split(path.sep);
  if (EXCLUDE_FILES.has(path.basename(relPath))) return true;
  if (parts.some((p) => EXCLUDE_DIRS.has(p))) return true;
  const ext = path.extname(relPath);
  // Consider config files without ext
  if (!ext) return false;
  return !INCLUDED_EXTS.has(ext);
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (EXCLUDE_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.isFile()) {
      const rel = path.relative(repoRoot, full).replaceAll('\\', '/');
      if (isSkippable(rel)) continue;
      yield rel;
    }
  }
}

const tokenRegex = new RegExp(`\\b(${DENY_TOKENS.join('|')})\\b`, 'i');

const results = [];
for await (const relFile of walk(repoRoot)) {
  if (isAllowedPath(relFile)) continue;
  const content = await fs.readFile(relFile, 'utf8');
  const lines = content.split(/\r?\n/);
  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx];
    if (!tokenRegex.test(line)) continue;
    const match = line.match(tokenRegex);
    results.push({
      file: relFile,
      line: idx + 1,
      token: match?.[1]?.toLowerCase() ?? 'unknown',
      text: line.trim().slice(0, 300),
    });
  }
}

const summary = {
  totalFindings: results.length,
  byToken: Object.fromEntries(
    Object.entries(
      results.reduce((acc, r) => {
        acc[r.token] = (acc[r.token] ?? 0) + 1;
        return acc;
      }, /** @type {Record<string, number>} */ ({})),
    ).sort((a, b) => b[1] - a[1]),
  ),
  byExtension: Object.fromEntries(
    Object.entries(
      results.reduce((acc, r) => {
        const ext = path.extname(r.file) || '(noext)';
        acc[ext] = (acc[ext] ?? 0) + 1;
        return acc;
      }, /** @type {Record<string, number>} */ ({})),
    ).sort((a, b) => b[1] - a[1]),
  ),
};

if (MODE === 'report') {
  console.log(JSON.stringify({ summary, samples: results.slice(0, 50) }, null, 2));
  process.exit(0);
}

if (MODE === 'enforce') {
  if (results.length > 0) {
    console.error(`Identity check failed: ${results.length} disallowed references found.`);
    for (const r of results.slice(0, 50)) {
      console.error(`${r.file}:${r.line}: [${r.token}] ${r.text}`);
    }
    process.exit(1);
  } else {
    console.log('Identity check passed: 0 disallowed references.');
    process.exit(0);
  }
}
