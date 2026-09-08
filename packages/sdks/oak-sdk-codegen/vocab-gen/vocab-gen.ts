/**
 * Vocabulary mining pipeline orchestrator.
 *
 * @remarks
 * This module provides the pipeline entry point for extracting vocabulary
 * data from Oak National Academy bulk download files and generating
 * static graph data files for the SDK.
 *
 * @example
 * ```bash
 * # Run from repo root
 * pnpm vocab-gen
 *
 * # Dry run (no files written)
 * pnpm vocab-gen --dry-run
 * ```
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for the pipeline specification
 */
import { readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Logger } from '@oaknational/logger';
import {
  generateAnalysisReport,
  generateMinedSynonyms,
  generateNCCoverageGraphData,
  generateVocabularyGraphData,
  writeAnalysisReportFile,
  writeMinedSynonymsFile,
  writeNCCoverageGraphAsJson,
  writeVocabularyGraphAsJson,
  generateGraphCorpusData,
  writeGraphCorpusAsJson,
} from '../src/bulk.js';
import { readAllBulkFiles } from './lib/index.js';
import { processBulkData, type ProcessingResult } from './vocab-gen-core.js';
import { type PipelineConfig, type PipelineResult } from './vocab-gen-config.js';
import { toBulkDataInputs } from './vocab-gen-inputs.js';
import { enforceRestrictedInclusionCorpusBoundary } from './vocab-gen-restricted-boundary.js';

// Re-export core types and functions
export {
  type BulkDataInput,
  type ExtractedData,
  type ExtractionStats,
  processBulkData,
} from './vocab-gen-core.js';

// Re-export configuration types and factory
export {
  createPipelineConfig,
  type PipelineConfig,
  type PipelineConfigInput,
  type PipelineResult,
} from './vocab-gen-config.js';

// Re-export formatting function
export { formatPipelineResult } from './vocab-gen-format.js';

/**
 * Type guard for objects with a string `downloadedAt` property.
 */
function hasDownloadedAt(value: unknown): value is { downloadedAt: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    'downloadedAt' in value &&
    typeof value.downloadedAt === 'string'
  );
}

/**
 * Reads the source version from the bulk data manifest.
 *
 * The manifest file (`manifest.json`) in the bulk download directory
 * contains a `downloadedAt` ISO timestamp identifying when the data
 * was fetched from the Oak API.
 *
 * @param bulkDataPath - Path to bulk download directory
 * @returns ISO timestamp from the manifest's `downloadedAt` field
 *
 * @example
 * ```ts
 * await readSourceVersion('/path/to/bulk-downloads');
 * // Returns: '2026-01-15T15:39:50.310Z'
 * ```
 */
async function readSourceVersion(bulkDataPath: string): Promise<string> {
  const manifestPath = join(bulkDataPath, 'manifest.json');
  const content = await readFile(manifestPath, 'utf-8').catch((error: unknown) => {
    throw new Error(
      `No manifest.json found at ${manifestPath}. ` +
        `Bulk download directory must contain a manifest.json with a downloadedAt field. ` +
        `(${error instanceof Error ? error.message : String(error)})`,
    );
  });
  const parsed: unknown = JSON.parse(content);
  if (!hasDownloadedAt(parsed)) {
    throw new Error(`manifest.json missing downloadedAt field at ${manifestPath}`);
  }
  return parsed.downloadedAt;
}

async function generateOutputFiles(
  result: ProcessingResult,
  config: PipelineConfig,
  logger?: Logger,
): Promise<string[]> {
  const outputFiles: string[] = [];
  const sourceVersion = await readSourceVersion(config.bulkDataPath);

  // Generate the graph corpus (one-graph foundation + G2 chain + G3 sequences
  // + G4b keywords: unit/thread/lesson/misconception/keyword nodes,
  // prerequisiteFor + chain edges, and the two ordered sections: per-subject
  // curriculum-ordered thread→unit sequences, and authored-order unit→lesson
  // runs)
  const graphCorpus = generateGraphCorpusData({
    priorKnowledge: result.extractedData.priorKnowledge,
    threads: result.extractedData.threads,
    lessons: result.extractedData.lessons,
    unitLessons: result.extractedData.unitLessons,
    misconceptions: result.extractedData.misconceptions,
    keywords: result.extractedData.keywords,
    sourceVersion,
  });
  const graphCorpusDirPath = await writeGraphCorpusAsJson(graphCorpus, config.outputPath, logger);
  outputFiles.push(basename(graphCorpusDirPath));

  // Generate analysis report (written to vocab-gen/reports in the SDK)
  const analysisReport = generateAnalysisReport(result.extractedData);
  const vocabGenDir = dirname(fileURLToPath(import.meta.url));
  const analysisFilePath = await writeAnalysisReportFile(analysisReport, vocabGenDir, logger);
  outputFiles.push(`reports/${basename(analysisFilePath)}`);

  const minedSynonyms = generateMinedSynonyms(result.extractedData.keywords);
  const synonymsDir = join(config.outputPath, 'synonyms');
  const synonymsFilePath = await writeMinedSynonymsFile(minedSynonyms, synonymsDir, logger);
  outputFiles.push(`synonyms/${basename(synonymsFilePath)}`);

  // Generate vocabulary graph (JSON + typed loader)
  const vocabularyGraph = generateVocabularyGraphData(result.extractedData.keywords, sourceVersion);
  const vocabularyDirPath = await writeVocabularyGraphAsJson(
    vocabularyGraph,
    config.outputPath,
    logger,
  );
  outputFiles.push(basename(vocabularyDirPath));

  // Generate NC coverage graph (JSON + typed loader)
  const ncCoverageGraph = generateNCCoverageGraphData(
    result.extractedData.ncStatements,
    sourceVersion,
  );
  const ncCoverageDirPath = await writeNCCoverageGraphAsJson(
    ncCoverageGraph,
    config.outputPath,
    logger,
  );
  outputFiles.push(basename(ncCoverageDirPath));

  return outputFiles;
}

/** Injectable dependencies for {@link runPipeline} (ADR-078 testability). */
export interface RunPipelineDeps {
  /** Bulk-file reader; defaults to the disk-backed {@link readAllBulkFiles}. */
  readonly readAllBulkFiles?: typeof readAllBulkFiles;
}

/**
 * Runs the vocabulary mining pipeline.
 *
 * @param config - Pipeline configuration
 * @param logger - Optional logger for progress reporting
 * @param deps - Injectable dependencies (ADR-078)
 * @returns Pipeline result with statistics and output files
 */
export async function runPipeline(
  config: PipelineConfig,
  logger?: Logger,
  deps: RunPipelineDeps = {},
): Promise<PipelineResult> {
  const corpusBoundaryRejection = enforceRestrictedInclusionCorpusBoundary(config);
  if (corpusBoundaryRejection) {
    return corpusBoundaryRejection;
  }

  const startTime = Date.now();

  // Read all bulk download files
  const readFiles = deps.readAllBulkFiles ?? readAllBulkFiles;
  const allFiles = await readFiles(config.bulkDataPath, logger);

  const { inputs: bulkData, restrictedLessonsExcluded } = toBulkDataInputs(allFiles, {
    includeRestricted: config.includeRestricted,
  });

  // Process the data (extraction)
  const result = processBulkData(bulkData);

  let outputFiles: string[] = [];
  if (!config.dryRun) {
    outputFiles = await generateOutputFiles(result, config, logger);
  }

  const durationMs = Date.now() - startTime;

  return {
    ...result.stats,
    success: true,
    filesProcessed: result.filesProcessed,
    totalLessons: result.totalLessons,
    totalUnits: result.totalUnits,
    restrictedLessonsExcluded,
    outputFiles,
    durationMs,
    dryRun: config.dryRun,
  };
}
