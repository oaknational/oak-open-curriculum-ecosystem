import type { TokenizeGlobsResult } from './tokenize-globs.js';

export function formatText(result: TokenizeGlobsResult): string {
  return [
    'path\tchars\ttokens',
    ...result.rows.map((row) => `${row.path}\t${row.chars}\t${row.tokens}`),
    '---',
    `total: ${result.aggregate.files} files, ${result.aggregate.chars} chars, ${result.aggregate.tokens} tokens`,
    '',
  ].join('\n');
}

export function formatJson(result: TokenizeGlobsResult): string {
  return `${JSON.stringify(
    {
      rows: result.rows.map((row) => ({
        path: row.path,
        chars: row.chars,
        tokens: row.tokens,
      })),
      aggregate: {
        files: result.aggregate.files,
        chars: result.aggregate.chars,
        tokens: result.aggregate.tokens,
      },
      warnings: result.warnings.map((warning) => ({
        glob: warning.glob,
        reason: warning.reason,
      })),
    },
    null,
    2,
  )}\n`;
}

export function formatWarnings(result: TokenizeGlobsResult): string {
  return result.warnings
    .map((warning) => `warning: glob '${warning.glob}' matched no files\n`)
    .join('');
}
