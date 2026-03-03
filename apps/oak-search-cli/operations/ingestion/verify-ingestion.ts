#!/usr/bin/env npx tsx
/** Ingestion verification CLI — compares bulk download vs Elasticsearch. */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@elastic/elasticsearch';
import { loadRuntimeConfig } from '../../src/runtime-config.js';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
import {
  extractLessonsFromBulkDownload,
  findMissingLessons,
  generateVerificationReport,
  type BulkDownloadData,
} from './verify-ingestion-lib';

interface CliArgs {
  subject: string;
  keystage: string;
  bulkDownload: string;
  esUrlOverride: string;
  help: boolean;
}

const DEFAULT_BULK_DOWNLOAD_PATH =
  '../../../reference/bulk_download_data/' + 'oak-bulk-download-2025-12-07T09_37_04.693Z';

// eslint-disable-next-line complexity -- CLI arg parsing
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

    switch (arg) {
      case '--subject':
        if (nextArg) {
          result.subject = nextArg;
          i++;
        }
        break;
      case '--key-stage':
        if (nextArg) {
          result.keystage = nextArg;
          i++;
        }
        break;
      case '--bulk-download':
        if (nextArg) {
          result.bulkDownload = nextArg;
          i++;
        }
        break;
      case '--es-url':
        if (nextArg) {
          result.esUrlOverride = nextArg;
          i++;
        }
        break;
      case '--help':
      case '-h':
        result.help = true;
        break;
    }
  }

  return result;
}

function printHelp(): void {
  process.stdout.write(
    'Usage: pnpm ingest:verify [options]\n' +
      '  --subject <slug>       (default: maths)\n' +
      '  --key-stage <ks>       (default: ks4)\n' +
      '  --bulk-download <path>\n' +
      '  --es-url <url>\n' +
      '  --help, -h\n',
  );
}

function isBulkDownloadData(data: unknown): data is BulkDownloadData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  if (!('lessons' in data)) {
    return false;
  }
  const lessons = data.lessons;
  if (!Array.isArray(lessons)) {
    return false;
  }
  return lessons.every(
    (l): l is { lessonSlug: string; keyStageSlug: string } =>
      typeof l === 'object' && l !== null && 'lessonSlug' in l && 'keyStageSlug' in l,
  );
}

async function loadBulkDownload(args: CliArgs): Promise<BulkDownloadData> {
  const filePath =
    args.bulkDownload ||
    join(
      CURRENT_DIR,
      DEFAULT_BULK_DOWNLOAD_PATH,
      args.subject === 'maths' ? 'maths-secondary.json' : `${args.subject}.json`,
    );
  process.stdout.write(`Loading bulk download from: ${filePath}\n`);
  const parsed: unknown = JSON.parse(await readFile(filePath, 'utf8'));
  if (!isBulkDownloadData(parsed)) {
    throw new Error('Invalid bulk download data structure');
  }
  return parsed;
}

async function getIndexedLessons(
  esUrl: string,
  apiKey: string,
  keystage: string,
): Promise<string[]> {
  const client = new Client({
    node: esUrl,
    auth: { apiKey },
  });

  process.stdout.write(`Querying Elasticsearch at: ${esUrl}\n`);
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
async function runVerification(args: CliArgs, esUrl: string, apiKey: string): Promise<boolean> {
  const bulkData = await loadBulkDownload(args);
  const expected = extractLessonsFromBulkDownload(bulkData, args.keystage);
  process.stdout.write(`Found ${expected.length} lessons in bulk download for ${args.keystage}\n`);

  const indexed = await getIndexedLessons(esUrl, apiKey, args.keystage);
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

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const configResult = loadRuntimeConfig({
    processEnv: process.env,
    startDir: CURRENT_DIR,
  });
  if (!configResult.ok) {
    process.stderr.write(`Environment validation failed: ${configResult.error.message}\n`);
    process.exit(1);
  }
  const config = configResult.value.env;
  const esUrl = args.esUrlOverride || config.ELASTICSEARCH_URL;

  process.stdout.write(`\nVerifying ingestion for ${args.subject} ${args.keystage}...\n\n`);

  try {
    const ok = await runVerification(args, esUrl, config.ELASTICSEARCH_API_KEY);
    if (!ok) {
      process.exitCode = 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`\nVerification failed: ${message}\n`);
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Fatal error: ${message}\n`);
  process.exitCode = 1;
});
