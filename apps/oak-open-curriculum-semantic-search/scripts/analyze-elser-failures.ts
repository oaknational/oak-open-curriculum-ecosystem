#!/usr/bin/env npx tsx
/**
 * Analyze ELSER failure diagnostic reports.
 *
 * Usage:
 *   pnpm analyze:elser <report-file>
 *
 * @see .agent/research/elasticsearch/methods/elser-ingestion-scaling.md
 */

import { config } from 'dotenv';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { readAllBulkFiles } from '@oaknational/oak-curriculum-sdk/public/bulk';
import { typeSafeEntries } from '@oaknational/oak-curriculum-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '..', '.env.local') });

/** Schema for failures in diagnostic report. */
const FailureSchema = z.object({
  documentId: z.string().optional().nullable(),
  index: z.string(),
  errorType: z.string(),
  chunkIndex: z.number(),
  positionInChunk: z.number(),
});

/** Schema for diagnostic report. */
const ReportSchema = z.object({
  runId: z.string(),
  summary: z.object({
    totalDocuments: z.number(),
    totalFailures: z.number(),
    successRate: z.number(),
  }),
  errorDistribution: z.record(z.string(), z.number()),
  failures: z.array(FailureSchema),
  chunkStats: z.array(
    z.object({ chunkIndex: z.number(), documentCount: z.number(), failureCount: z.number() }),
  ),
});

/** Document characteristics from bulk data. */
interface DocChars {
  id: string;
  subject: string;
  keyStage: string;
  hasTranscript: boolean;
  transcriptLength: number;
  contentSize: number;
}

/** Build document characteristics lookup from bulk files. */
async function buildLookup(bulkDir: string): Promise<Map<string, DocChars>> {
  const lookup = new Map<string, DocChars>();
  const files = await readAllBulkFiles(bulkDir);
  for (const file of files) {
    const subject = file.data.sequenceSlug.split('-')[0] ?? 'unknown';
    for (const lesson of file.data.lessons) {
      const raw = lesson.transcript_sentences ?? '';
      const len = raw.length;
      lookup.set(lesson.lessonSlug, {
        id: lesson.lessonSlug,
        subject,
        keyStage: lesson.keyStageSlug,
        hasTranscript: len > 0,
        transcriptLength: len,
        contentSize: JSON.stringify(lesson).length,
      });
    }
  }
  return lookup;
}

/** Analyze chunk position distribution. */
function analyzePositions(
  failures: z.infer<typeof FailureSchema>[],
  chunkStats: { chunkIndex: number; documentCount: number }[],
) {
  let early = 0,
    middle = 0,
    late = 0;
  for (const f of failures) {
    const stats = chunkStats.find((c) => c.chunkIndex === f.chunkIndex);
    if (!stats) {
      continue;
    }
    const rel = f.positionInChunk / stats.documentCount;
    if (rel < 0.25) {
      early++;
    } else if (rel < 0.75) {
      middle++;
    } else {
      late++;
    }
  }
  return { early, middle, late };
}

/** Print error distribution. */
function printErrorDist(errorDist: Record<string, number>): void {
  console.log('\nError Distribution:');
  for (const [type, count] of typeSafeEntries(errorDist)) {
    console.log(`  ${type}: ${count}`);
  }
}

/** Analysis result type. */
interface AnalysisResult {
  sourceReport: string;
  analysisTime: string;
  summary: { failuresAnalyzed: number; matchedWithChars: number };
  errorDistribution: Record<string, number>;
  positionDistribution: { early: number; middle: number; late: number };
}

/** Save analysis to file. */
function saveAnalysis(analysis: AnalysisResult, outputDir: string): string {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  const outputFile = join(outputDir, `analysis-${Date.now()}.json`);
  writeFileSync(outputFile, JSON.stringify(analysis, null, 2));
  return outputFile;
}

/** Build and save analysis result. */
function buildAndSaveAnalysis(
  reportPath: string,
  report: z.infer<typeof ReportSchema>,
  withCharsCount: number,
  positions: { early: number; middle: number; late: number },
): string {
  const analysis: AnalysisResult = {
    sourceReport: basename(reportPath),
    analysisTime: new Date().toISOString(),
    summary: { failuresAnalyzed: report.failures.length, matchedWithChars: withCharsCount },
    errorDistribution: report.errorDistribution,
    positionDistribution: positions,
  };
  return saveAnalysis(analysis, join(__dirname, '..', 'diagnostics'));
}

/** Validate inputs. */
function validateInputs(reportPath: string | undefined, bulkDir: string): void {
  if (!reportPath || !existsSync(reportPath)) {
    console.error('Usage: pnpm analyze:elser <report-file>');
    process.exit(1);
  }
  if (!existsSync(bulkDir)) {
    console.error('Bulk download directory not found. Run: pnpm bulk:download');
    process.exit(1);
  }
}

/** Main analysis function. */
async function main(): Promise<void> {
  const reportPath = process.argv[2] ?? '';
  const bulkDir = join(__dirname, '..', 'bulk-downloads');
  validateInputs(reportPath, bulkDir);

  console.log(`ELSER Failure Analysis\nReport: ${reportPath}`);
  const report = ReportSchema.parse(JSON.parse(readFileSync(reportPath, 'utf-8')));
  console.log(
    `\nSummary: ${report.summary.totalFailures}/${report.summary.totalDocuments} failures`,
  );
  printErrorDist(report.errorDistribution);

  console.log('\nBuilding document characteristics lookup...');
  const lookup = await buildLookup(bulkDir);
  console.log(`Loaded ${lookup.size} documents`);

  const withChars = report.failures.filter((f) => f.documentId && lookup.has(f.documentId));
  console.log(
    `\nMatched ${withChars.length}/${report.failures.length} failures with characteristics`,
  );

  const positions = analyzePositions(report.failures, report.chunkStats);
  console.log(
    `\nPosition Distribution: early=${positions.early} middle=${positions.middle} late=${positions.late}`,
  );

  const outputFile = buildAndSaveAnalysis(reportPath, report, withChars.length, positions);
  console.log(`\nAnalysis saved to: ${outputFile}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
