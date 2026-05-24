import path from 'node:path';

import type { ContextCostFileSystem } from './file-system.js';
import { tokenizeFile, type TokenizedRow } from './per-file.js';
import type { Tokenizer } from './tokenizer.js';

export interface TokenizeGlobsResult {
  readonly rows: readonly TokenizedRow[];
  readonly aggregate: {
    readonly files: number;
    readonly chars: number;
    readonly tokens: number;
  };
  readonly warnings: readonly { readonly glob: string; readonly reason: 'no-matches' }[];
}

export async function tokenizeGlobs(
  globs: readonly string[],
  cwd: string,
  fs: ContextCostFileSystem,
  tokenizer: Tokenizer,
): Promise<TokenizeGlobsResult> {
  const warnings: { glob: string; reason: 'no-matches' }[] = [];
  const absolutePaths = new Set<string>();

  for (const glob of globs) {
    const matches = await fs.expandGlob(cwd, glob);
    if (matches.length === 0) {
      warnings.push({ glob, reason: 'no-matches' });
      continue;
    }

    for (const match of matches) {
      absolutePaths.add(match);
    }
  }

  const rows = await Promise.all(
    [...absolutePaths].map((absolutePath) =>
      tokenizeFile(displayPath(cwd, absolutePath), absolutePath, fs, tokenizer),
    ),
  );
  const sortedRows = rows.toSorted((left, right) => left.path.localeCompare(right.path));

  return {
    rows: sortedRows,
    aggregate: {
      files: sortedRows.length,
      chars: sortedRows.reduce((total, row) => total + row.chars, 0),
      tokens: sortedRows.reduce((total, row) => total + row.tokens, 0),
    },
    warnings,
  };
}

function displayPath(cwd: string, absolutePath: string): string {
  const normalisedCwd = normalisePathSeparators(cwd).replace(/\/$/, '');
  const normalisedAbsolutePath = normalisePathSeparators(absolutePath);
  const cwdPrefix = `${normalisedCwd}/`;

  if (normalisedAbsolutePath.startsWith(cwdPrefix)) {
    return normalisedAbsolutePath.slice(cwdPrefix.length);
  }

  return normalisePathSeparators(path.relative(cwd, absolutePath));
}

function normalisePathSeparators(value: string): string {
  return value.split(path.sep).join('/').replaceAll('\\', '/');
}
