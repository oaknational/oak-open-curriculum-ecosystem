/**
 * CLI output formatting functions.
 *
 * Handles help text and summary output for the Elasticsearch setup CLI.
 */

import { ingestLogger } from '../../logger';

/**
 * Prints CLI help text.
 */
export function printHelp(): void {
  process.stdout.write(`
Elasticsearch Setup CLI

Usage:
  pnpm exec tsx src/lib/elasticsearch/setup/cli.ts [command] [options]

Commands:
  setup     Create synonyms and indexes (default)
  reset     Delete and recreate all indexes (for mapping changes)
  synonyms  Update synonyms only (no reindexing required)
  status    Show cluster info and index counts
  help      Show this help message

Options:
  -v, --verbose   Show detailed output

Environment:
  Reads ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY from .env.local
  in the app directory (apps/oak-search-cli/).

Note:
  The 'synonyms' command uses the Elasticsearch Synonyms API to update
  synonyms without reindexing. Search analyzers reload automatically.
`);
}

/**
 * Prints setup summary statistics.
 *
 * @param result - Setup or reset operation result
 * @returns Exit code (0 for success, 1 if errors occurred)
 */
export function printSetupSummary(result: {
  synonymCount: number;
  indexResults: readonly { status: string }[];
}): number {
  const created = result.indexResults.filter((r) => r.status === 'created').length;
  const exists = result.indexResults.filter((r) => r.status === 'exists').length;
  const errors = result.indexResults.filter((r) => r.status === 'error').length;

  ingestLogger.info('Setup complete', {
    synonyms: result.synonymCount,
    indexes: { created, exists, errors },
  });

  return errors > 0 ? 1 : 0;
}
