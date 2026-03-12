#!/usr/bin/env -S pnpm exec tsx
/**
 * CLI for ELSER ingestion failure diagnostics.
 *
 * Usage:
 *   pnpm diagnose:elser [--limit N] [--subject SUBJECT]
 *
 * @see .agent/research/elasticsearch/methods/elser-ingestion-scaling.md
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@elastic/elasticsearch';
import { loadConfigOrExit } from '../src/runtime-config.js';
import { readAllBulkFiles } from '@oaknational/sdk-codegen/bulk';
import { deriveSubjectSlugFromSequence } from '@oaknational/curriculum-sdk';
import { createOakClient, type OakClientEnv } from '../src/adapters/oak-adapter';
import { createHybridDataSource } from '../src/adapters/hybrid-data-source';
import {
  chunkOperations,
  MAX_CHUNK_SIZE_BYTES,
  DEFAULT_CHUNK_DELAY_MS,
} from '../src/lib/indexing/bulk-chunk-utils';
import { processChunk, computeErrorDistribution } from '../src/lib/diagnostics';
import type {
  DiagnosticReport,
  ChunkStats,
  DocumentFailure,
  DocumentSuccess,
} from '../src/lib/diagnostics';
import type { BulkOperationEntry } from '../src/lib/indexing/bulk-operation-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LESSONS_INDEX = 'oak_lessons';
const UNITS_INDEX = 'oak_units';
const UNIT_ROLLUP_INDEX = 'oak_unit_rollup';

/** Sleep for a specified duration. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Parse command line arguments. */
function parseArgs(): { limit: number | undefined; subject: string | undefined } {
  const args = process.argv.slice(2);
  let limit: number | undefined;
  let subject: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1] ?? '', 10);
      i++;
    } else if (args[i] === '--subject' && args[i + 1]) {
      subject = args[i + 1];
      i++;
    }
  }
  return { limit, subject };
}

/** Read validated environment config. */
function getEsCredentials(config: { ELASTICSEARCH_URL: string; ELASTICSEARCH_API_KEY: string }): {
  esUrl: string;
  esApiKey: string;
} {
  return {
    esUrl: config.ELASTICSEARCH_URL,
    esApiKey: config.ELASTICSEARCH_API_KEY,
  };
}

/** Load and filter bulk files. */
async function loadBulkFiles(bulkDir: string, subjectFilter?: string) {
  const allFiles = await readAllBulkFiles(bulkDir);
  if (!subjectFilter) {
    return allFiles;
  }
  return allFiles.filter(
    (f) => deriveSubjectSlugFromSequence(f.data.sequenceSlug) === subjectFilter,
  );
}

/** Process bulk files and create operations. Returns ops and the client for cleanup. */
async function prepareBulkOperations(
  files: Awaited<ReturnType<typeof readAllBulkFiles>>,
  config: OakClientEnv,
  limit?: number,
): Promise<{ ops: BulkOperationEntry[]; oakClient: Awaited<ReturnType<typeof createOakClient>> }> {
  const oakClient = await createOakClient({ env: config });
  const ops: BulkOperationEntry[] = [];
  for (const fileResult of files) {
    const sourceResult = await createHybridDataSource(fileResult.data, oakClient);
    if (!sourceResult.ok) {
      console.error(`Skipping ${fileResult.data.sequenceSlug}: ${sourceResult.error.message}`);
      continue;
    }
    const source = sourceResult.value;
    ops.push(...source.toBulkOperations(LESSONS_INDEX, UNITS_INDEX, UNIT_ROLLUP_INDEX));
    if (limit && ops.length / 2 >= limit) {
      return { ops: ops.slice(0, limit * 2), oakClient };
    }
  }
  return { ops, oakClient };
}

/** Build the diagnostic report. */
function buildReport(
  runId: string,
  startTime: Date,
  endTime: Date,
  limit: number | undefined,
  subject: string | undefined,
  totalDocs: number,
  chunks: number,
  failures: DocumentFailure[],
  successes: DocumentSuccess[],
  chunkStats: ChunkStats[],
): DiagnosticReport {
  return {
    runId,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    configuration: {
      maxChunkSizeBytes: MAX_CHUNK_SIZE_BYTES,
      chunkDelayMs: DEFAULT_CHUNK_DELAY_MS,
      documentLimit: limit,
      subjectFilter: subject,
    },
    summary: {
      totalDocuments: totalDocs,
      totalSuccess: successes.length,
      totalFailures: failures.length,
      successRate: totalDocs > 0 ? successes.length / totalDocs : 0,
      chunksProcessed: chunks,
      totalDurationMs: endTime.getTime() - startTime.getTime(),
    },
    errorDistribution: computeErrorDistribution(failures),
    chunkStats,
    failures,
    sampleSuccesses: successes.slice(0, 100),
  };
}

/** Process all chunks and collect results. */
async function processAllChunks(esClient: Client, chunks: BulkOperationEntry[][]) {
  const allFailures: DocumentFailure[] = [];
  const allSuccesses: DocumentSuccess[] = [];
  const allChunkStats: ChunkStats[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (!chunk) {
      continue;
    }
    process.stdout.write(`Chunk ${i + 1}/${chunks.length}... `);
    const result = await processChunk(esClient, chunk, i);
    allChunkStats.push(result.stats);
    allFailures.push(...result.failures);
    allSuccesses.push(...result.successes);
    console.log(
      `${result.stats.successCount}/${result.stats.documentCount} in ${result.stats.durationMs}ms`,
    );
    if (i < chunks.length - 1) {
      await sleep(DEFAULT_CHUNK_DELAY_MS);
    }
  }

  return { allFailures, allSuccesses, allChunkStats };
}

/** Save report to file. */
function saveReport(report: DiagnosticReport, outputDir: string): string {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  const outputFile = join(outputDir, `${report.runId}.json`);
  writeFileSync(outputFile, JSON.stringify(report, null, 2));
  return outputFile;
}

/** Print and save the report, returns the output file path. */
function printAndSaveReport(report: DiagnosticReport, outputDir: string): void {
  console.log(
    `\nSummary: ${report.summary.totalSuccess}/${report.summary.totalDocuments} (${(report.summary.successRate * 100).toFixed(1)}%)`,
  );
  const outputFile = saveReport(report, outputDir);
  console.log(`Report: ${outputFile}`);
}

/** Main diagnostic function. */
async function main(): Promise<void> {
  const config = loadConfigOrExit({
    processEnv: process.env,
    startDir: __dirname,
  }).env;

  const { limit, subject } = parseArgs();
  const esCredentials = getEsCredentials(config);
  const esClient = new Client({
    node: esCredentials.esUrl,
    auth: { apiKey: esCredentials.esApiKey },
  });
  const bulkDir = join(__dirname, '..', 'bulk-downloads');
  const startTime = new Date();
  const runId = `elser-diagnostic-${startTime.getTime()}`;
  console.log(`ELSER Diagnostics [${runId}] limit=${limit ?? 'none'} subject=${subject ?? 'all'}`);

  const files = await loadBulkFiles(bulkDir, subject);
  const { ops: operations, oakClient } = await prepareBulkOperations(files, config, limit);
  const totalDocuments = Math.floor(operations.length / 2);
  const chunks = chunkOperations(operations, MAX_CHUNK_SIZE_BYTES);
  console.log(`Loaded ${files.length} files, ${totalDocuments} documents, ${chunks.length} chunks`);

  try {
    const { allFailures, allSuccesses, allChunkStats } = await processAllChunks(esClient, chunks);
    const report = buildReport(
      runId,
      startTime,
      new Date(),
      limit,
      subject,
      totalDocuments,
      chunks.length,
      allFailures,
      allSuccesses,
      allChunkStats,
    );
    printAndSaveReport(report, join(__dirname, '..', 'diagnostics'));
  } finally {
    await oakClient.disconnect();
    await esClient.close();
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
