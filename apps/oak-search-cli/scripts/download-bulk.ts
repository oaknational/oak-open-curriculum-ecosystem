#!/usr/bin/env npx tsx
/**
 * Download Oak curriculum bulk data files.
 *
 * Source: https://open-api.thenational.academy/bulk-download
 * API: POST /api/bulk with `{ subjects: [...] }` returns ZIP
 *
 * Usage:
 *   pnpm bulk:download
 *
 * Reads OAK_API_KEY from .env.local (via dotenv).
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 */

import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { readdir, stat, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Extract } from 'unzipper';
import { loadConfigOrExit } from '../src/runtime-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BULK_API_URL = 'https://open-api.thenational.academy/api/bulk';

const BULK_DOWNLOAD_FILES = [
  'art-primary',
  'art-secondary',
  'citizenship-secondary',
  'computing-primary',
  'computing-secondary',
  'cooking-nutrition-primary',
  'cooking-nutrition-secondary',
  'design-technology-primary',
  'design-technology-secondary',
  'english-primary',
  'english-secondary',
  'french-primary',
  'french-secondary',
  'geography-primary',
  'geography-secondary',
  'german-secondary',
  'history-primary',
  'history-secondary',
  'maths-primary',
  'maths-secondary',
  'music-primary',
  'music-secondary',
  'physical-education-primary',
  'physical-education-secondary',
  'religious-education-primary',
  'religious-education-secondary',
  'rshe-pshe-primary',
  'rshe-pshe-secondary',
  'science-primary',
  'science-secondary',
  'spanish-primary',
  'spanish-secondary',
] as const;

async function fetchBulkZip(apiKey: string, subjects: readonly string[]): Promise<Response> {
  const response = await fetch(BULK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ subjects }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }
  return response;
}

async function saveResponseToFile(response: Response, filePath: string): Promise<void> {
  if (!response.body) {
    throw new Error('No response body');
  }
  const writer = createWriteStream(filePath);
  const reader = response.body.getReader();
  let chunk = await reader.read();
  while (!chunk.done) {
    writer.write(chunk.value);
    chunk = await reader.read();
  }
  writer.end();
  await new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function extractZip(zipPath: string, outputDir: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    createReadStream(zipPath)
      .pipe(Extract({ path: outputDir }))
      .on('close', resolve)
      .on('error', reject);
  });
}

async function getJsonFileStats(outputDir: string): Promise<{ count: number; totalBytes: number }> {
  const files = await readdir(outputDir);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));
  let totalBytes = 0;
  for (const file of jsonFiles) {
    const s = await stat(join(outputDir, file));
    totalBytes += s.size;
  }
  return { count: jsonFiles.length, totalBytes };
}

async function writeManifest(outputDir: string): Promise<void> {
  const files = await readdir(outputDir);
  const jsonFiles = files.filter((f) => f.endsWith('.json'));
  const fileEntries = await Promise.all(
    jsonFiles.map(async (file) => ({ file, sizeBytes: (await stat(join(outputDir, file))).size })),
  );
  const manifest = {
    downloadedAt: new Date().toISOString(),
    source: BULK_API_URL,
    files: fileEntries,
  };
  await writeFile(join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
}

async function main(): Promise<void> {
  const env = loadConfigOrExit({
    processEnv: process.env,
    startDir: __dirname,
  }).env;
  const apiKey = env.OAK_API_KEY;
  if (!apiKey) {
    throw new Error('OAK_API_KEY is required — set it in .env or as an environment variable');
  }
  const outputDir = join(__dirname, '..', 'bulk-downloads');
  const zipPath = join(outputDir, '_temp.zip');

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  console.log(
    `Oak Bulk Download\n=================\nSource: ${BULK_API_URL}\nFiles: ${BULK_DOWNLOAD_FILES.length}\n`,
  );

  const startTime = Date.now();

  console.log('Fetching ZIP from Oak API...');
  const response = await fetchBulkZip(apiKey, BULK_DOWNLOAD_FILES);
  await saveResponseToFile(response, zipPath);

  console.log('Extracting...');
  await extractZip(zipPath, outputDir);
  await unlink(zipPath);

  const stats = await getJsonFileStats(outputDir);
  console.log(
    `✓ Extracted ${stats.count} files (${(stats.totalBytes / 1024 / 1024).toFixed(2)} MB)`,
  );

  await writeManifest(outputDir);
  console.log(`✓ Complete in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
}

main().catch((error: unknown) => {
  console.error('Fatal:', error);
  process.exit(1);
});
