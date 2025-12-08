/**
 * @module cli-output
 * @description CLI output formatting functions.
 *
 * Handles help text and summary output for the Elasticsearch setup CLI.
 */

import { sandboxLogger } from '../../logger';

/**
 * Prints CLI help text.
 *
 * Uses console.log as this is program output, not logging.
 */
export function printHelp(): void {
  console.log(`
Elasticsearch Setup CLI

Usage:
  npx tsx src/lib/elasticsearch/setup/cli.ts [command] [options]

Commands:
  setup     Create synonyms and indexes (default)
  reset     Delete and recreate all indexes (for mapping changes)
  status    Show cluster info and index counts
  help      Show this help message

Options:
  -v, --verbose   Show detailed output

Environment:
  Reads ELASTICSEARCH_URL and ELASTICSEARCH_API_KEY from .env.local
  in the app directory (apps/oak-open-curriculum-semantic-search/).
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

  sandboxLogger.info('Setup complete', {
    synonyms: result.synonymCount,
    indexes: { created, exists, errors },
  });

  return errors > 0 ? 1 : 0;
}
