#!/usr/bin/env npx tsx
/**
 * Ingestion verification CLI.
 *
 * Compares lessons from Oak bulk download against lessons indexed in Elasticsearch,
 * identifying any gaps in ingestion coverage.
 *
 * @example
 * ```bash
 * # Verify Maths KS4 ingestion
 * npx tsx scripts/verify-ingestion.ts --subject maths --keystage ks4
 *
 * # With custom bulk download path
 * npx tsx scripts/verify-ingestion.ts --subject maths --keystage ks4 --bulk-download ./data/maths.json
 * ```
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { Client } from '@elastic/elasticsearch';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

// Load environment from .env.local
config({ path: join(CURRENT_DIR, '..', '.env.local') });
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
  esUrl: string;
  help: boolean;
}

const DEFAULT_BULK_DOWNLOAD_PATH =
  '../../../reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z';

// eslint-disable-next-line complexity -- CLI arg parsing requires handling each flag
function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {
    subject: 'maths',
    keystage: 'ks4',
    bulkDownload: '',
    esUrl: process.env.ELASTICSEARCH_URL ?? 'http://localhost:9200',
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
      case '--keystage':
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
          result.esUrl = nextArg;
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
  console.log(`
Ingestion Verification CLI

Usage:
  npx tsx scripts/verify-ingestion.ts [options]

Options:
  --subject <subject>      Subject to verify (default: maths)
  --keystage <ks>          Key stage to verify (default: ks4)
  --bulk-download <path>   Path to bulk download JSON file
  --es-url <url>           Elasticsearch URL (default: http://localhost:9200)
  --help, -h               Show this help message

Examples:
  npx tsx scripts/verify-ingestion.ts --subject maths --keystage ks4
  npx tsx scripts/verify-ingestion.ts --subject history --keystage ks3
`);
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
  let filePath = args.bulkDownload;

  if (!filePath) {
    // Construct default path based on subject
    const subjectFile = args.subject === 'maths' ? 'maths-secondary.json' : `${args.subject}.json`;
    filePath = join(CURRENT_DIR, DEFAULT_BULK_DOWNLOAD_PATH, subjectFile);
  }

  console.log(`Loading bulk download from: ${filePath}`);

  const raw = await readFile(filePath, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (!isBulkDownloadData(parsed)) {
    throw new Error('Invalid bulk download data structure');
  }
  return parsed;
}

async function getIndexedLessons(esUrl: string, keystage: string): Promise<string[]> {
  const apiKey = process.env.ELASTICSEARCH_API_KEY;
  if (!apiKey) {
    throw new Error('ELASTICSEARCH_API_KEY environment variable not set');
  }

  const client = new Client({
    node: esUrl,
    auth: { apiKey },
  });

  console.log(`Querying Elasticsearch at: ${esUrl}`);

  // Query all lesson slugs from the lessons index
  // Note: field names in ES use snake_case (key_stage, lesson_slug)
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

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  console.log(`\nVerifying ingestion for ${args.subject} ${args.keystage}...\n`);

  try {
    // Load bulk download data
    const bulkData = await loadBulkDownload(args);
    const expectedLessons = extractLessonsFromBulkDownload(bulkData, args.keystage);
    console.log(`Found ${expectedLessons.length} lessons in bulk download for ${args.keystage}`);

    // Get indexed lessons from Elasticsearch
    const indexedLessons = await getIndexedLessons(args.esUrl, args.keystage);
    console.log(`Found ${indexedLessons.length} lessons in Elasticsearch for ${args.keystage}`);

    // Find missing lessons
    const missingLessons = findMissingLessons(expectedLessons, indexedLessons);

    // Generate and print report
    const report = generateVerificationReport({
      subject: args.subject,
      keyStage: args.keystage,
      expectedCount: expectedLessons.length,
      indexedCount: indexedLessons.length,
      missingLessons,
    });

    console.log(report);

    // Exit with error code if verification failed
    if (missingLessons.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`\nVerification failed: ${message}`);
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
