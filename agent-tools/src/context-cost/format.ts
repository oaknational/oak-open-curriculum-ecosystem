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
      rows: result.rows,
      aggregate: result.aggregate,
      warnings: result.warnings,
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
