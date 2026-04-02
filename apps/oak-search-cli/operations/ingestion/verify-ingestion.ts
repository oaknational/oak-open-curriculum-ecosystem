#!/usr/bin/env -S pnpm exec tsx
/** Ingestion verification CLI — compares bulk download vs Elasticsearch. */
import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@elastic/elasticsearch';
import { loadRuntimeConfig } from '../../src/runtime-config.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
import {
  extractLessonsFromBulkDownload,
  findMissingLessons,
  generateVerificationReport,
  isBulkDownloadData,
  resolveBulkDownloadPath,
  type BulkDownloadData,
} from './verify-ingestion-lib';

interface CliArgs {
  subject: string;
  keystage: string;
  bulkDownload: string;
  esUrlOverride: string;
  help: boolean;
}

type ValueOption = '--subject' | '--key-stage' | '--bulk-download' | '--es-url';
const VALUE_OPTIONS = new Set<ValueOption>([
  '--subject',
  '--key-stage',
  '--bulk-download',
  '--es-url',
]);

function isValueOption(arg: string): arg is ValueOption {
  switch (arg) {
    case '--subject':
    case '--key-stage':
    case '--bulk-download':
    case '--es-url':
      return VALUE_OPTIONS.has(arg);
    default:
      return false;
  }
}

function applyValueOption(
  option: ValueOption,
  nextArg: string | undefined,
  result: CliArgs,
): boolean {
  if (!nextArg) {
    return false;
  }

  switch (option) {
    case '--subject':
      result.subject = nextArg;
      return true;
    case '--key-stage':
      result.keystage = nextArg;
      return true;
    case '--bulk-download':
      result.bulkDownload = nextArg;
      return true;
    case '--es-url':
      result.esUrlOverride = nextArg;
      return true;
  }

  return false;
}

function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {
    subject: 'maths',
    keystage: 'ks4',
    bulkDownload: '',
    esUrlOverride: '',
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }

    if (isValueOption(arg) && applyValueOption(arg, nextArg, result)) {
      i++;
    }
  }

  return result;
}

function printHelp(): void {
  process.stdout.write(
    'Usage: pnpm ingest:verify [options]\n' +
      '  --subject <slug>       (default: maths)\n' +
      '  --key-stage <ks>       (default: ks4)\n' +
      '  --bulk-download <path> (optional when BULK_DOWNLOAD_DIR is set)\n' +
      '  --es-url <url>\n' +
      '  --help, -h\n',
  );
}

async function loadBulkDownload(filePath: string): Promise<BulkDownloadData> {
  process.stdout.write(`Loading bulk download from: ${filePath}\n`);
  const parsed: unknown = JSON.parse(await readFile(filePath, 'utf8'));
  if (!isBulkDownloadData(parsed)) {
    throw new Error('Invalid bulk download data structure');
  }
  return parsed;
}

async function getIndexedLessons(client: Client, keystage: string): Promise<string[]> {
  process.stdout.write('Querying Elasticsearch...\n');
  const response = await client.search({
    index: 'oak_lessons',
    size: 10000, // Get all lessons
    _source: ['lesson_slug'],
    query: {
      term: { key_stage: keystage },
    },
  });

  const lessons: string[] = [];
  for (const hit of response.hits.hits) {
    const source = hit._source;
    if (source && typeof source === 'object' && 'lesson_slug' in source) {
      const lessonSlug = source.lesson_slug;
      if (typeof lessonSlug === 'string') {
        lessons.push(lessonSlug);
      }
    }
  }

  return lessons;
}

/** Run the verification comparison and print results. */
async function runVerification(
  args: CliArgs,
  client: Client,
  bulkDownloadPath: string,
): Promise<boolean> {
  const bulkData = await loadBulkDownload(bulkDownloadPath);
  const expected = extractLessonsFromBulkDownload(bulkData, args.keystage);
  process.stdout.write(`Found ${expected.length} lessons in bulk download for ${args.keystage}\n`);

  const indexed = await getIndexedLessons(client, args.keystage);
  process.stdout.write(`Found ${indexed.length} lessons in Elasticsearch for ${args.keystage}\n`);

  const missing = findMissingLessons(expected, indexed);
  const report = generateVerificationReport({
    subject: args.subject,
    keyStage: args.keystage,
    expectedCount: expected.length,
    indexedCount: indexed.length,
    missingLessons: missing,
  });
  process.stdout.write(report + '\n');
  return missing.length === 0;
}

/**
 * Resolve runtime inputs needed to execute verification.
 */
function resolveRuntimeInputs(args: CliArgs): {
  esUrl: string;
  apiKey: string;
  bulkDownloadPath: string;
} {
  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: CURRENT_DIR,
  });
  if (!configResult.ok) {
    process.stderr.write(`Environment validation failed: ${configResult.error.message}\n`);
    process.exit(1);
  }

  const config = configResult.value.env;
  const pathResolution = resolveBulkDownloadPath({
    bulkDownloadPathArg: args.bulkDownload,
    bulkDownloadDirFromEnv: config.BULK_DOWNLOAD_DIR,
    subject: args.subject,
    keyStage: args.keystage,
  });
  if (!pathResolution.ok) {
    process.stderr.write(`${pathResolution.error}\n`);
    process.exit(1);
  }

  return {
    esUrl: args.esUrlOverride || config.ELASTICSEARCH_URL,
    apiKey: config.ELASTICSEARCH_API_KEY,
    bulkDownloadPath: pathResolution.value,
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const runtimeInputs = resolveRuntimeInputs(args);

  process.stdout.write(`\nVerifying ingestion for ${args.subject} ${args.keystage}...\n\n`);

  const client = new Client({
    node: runtimeInputs.esUrl,
    auth: { apiKey: runtimeInputs.apiKey },
  });

  try {
    const ok = await runVerification(args, client, runtimeInputs.bulkDownloadPath);
    if (!ok) {
      process.exitCode = 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`\nVerification failed: ${message}\n`);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Fatal error: ${message}\n`);
  process.exitCode = 1;
});
