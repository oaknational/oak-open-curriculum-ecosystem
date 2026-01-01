/**
 * Help text generation for the ingestion CLI.
 *
 * @module ingest-cli-help
 */

import { SUBJECTS } from '@oaknational/oak-curriculum-sdk';

/** All subjects from schema. */
const ALL_SUBJECTS = SUBJECTS;

/** Generate intro and usage section. */
function generateIntro(): string {
  return `
Live Data Ingestion CLI

Usage: npx tsx src/lib/elasticsearch/setup/ingest-live.ts [options]

Subject Selection (REQUIRED for API mode):
  --subject <slug>    Subject to ingest (can repeat for multiple subjects)
  --all               Ingest ALL subjects (${ALL_SUBJECTS.length} total)

Bulk Mode (alternative to subject selection):
  --bulk              Use bulk download files instead of API
  --bulk-dir <path>   Directory containing bulk download JSON files (required with --bulk)`;
}

/** Generate options section. */
function generateOptionsSection(): string {
  return `
Options:
  --keystage <ks>     Key stage to ingest (can repeat, defaults to all: ks1-ks4)
  --index <kind>      Index to ingest (can repeat, defaults to all)
  --dry-run           Preview without writing to ES
  --force, -f         Force overwrite existing documents (default: skip existing)
  --clear-cache       Clear SDK response cache before ingestion
  --bypass-cache      Continue without Redis cache (default: fail if cache unavailable)
  --ignore-cached-404 Ignore cached 404 responses (re-fetch transcripts that were missing)
  --verbose, -v       Show detailed output
  --help, -h          Show this help message

Retry Configuration:
  --max-retries <n>   Maximum document-level retry attempts (default: 3)
  --retry-delay <ms>  Base delay for retry exponential backoff in ms (default: 5000)
  --no-retry          Disable document-level retry for transient failures`;
}

/** Generate explanation sections. */
function generateExplanations(): string {
  const subjectList = ALL_SUBJECTS.join(', ');
  return `
Available Subjects: ${subjectList}

Ingestion Modes:
  - API (default): Fetches data from Oak API. Use --subject or --all to specify subjects.
  - Bulk (--bulk): Uses pre-downloaded bulk JSON files. Faster and includes all data.
    Bulk mode extracts lessons, units, and threads from downloaded curriculum files.

Incremental vs Force:
  - Incremental (default): Only creates new documents. Safe for resuming.
  - Force (--force): Overwrites all documents. Use after schema changes.

Retry Strategy:
  Document-level retry handles transient ELSER queue overflow errors (HTTP 429).
  After all chunks are uploaded, failed documents are retried with exponential backoff.
  Use --no-retry to disable this behavior and fail fast on transient errors.`;
}

/** Generate examples section. */
function generateExamples(): string {
  return `
Examples:
  --subject history --keystage ks2    # Single subject via API
  --all --force                       # Full refresh via API
  --bulk --bulk-dir ./bulk-downloads  # Bulk ingestion from downloaded files
  --bulk --bulk-dir ./bulk --dry-run  # Preview bulk ingestion
  --bulk --bulk-dir ./bulk --max-retries 5 --retry-delay 10000  # Custom retry config

Environment: ELASTICSEARCH_URL, ELASTICSEARCH_API_KEY, OAK_API_KEY in .env.local
`;
}

/** Generate CLI help text. */
export function generateHelpText(): string {
  return [
    generateIntro(),
    generateOptionsSection(),
    generateExplanations(),
    generateExamples(),
  ].join('');
}

/** Print CLI help text to console. Uses console.log as this is program output, not logging. */
export function printHelp(): void {
  console.log(generateHelpText());
}
