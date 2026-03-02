/* eslint-disable max-lines -- pipeline orchestrator requires all generator imports */

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
import { readFile } from 'fs/promises';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';

import {
  generateAnalysisReport,
  generateMinedSynonyms,
  generateMisconceptionGraphData,
  generateNCCoverageGraphData,
  generatePrerequisiteGraphData,
  generateThreadProgressionData,
  generateVocabularyGraphData,
  writeAnalysisReportFile,
  writeMinedSynonymsFile,
  writeMisconceptionGraphFile,
  writeNCCoverageGraphFile,
  writePrerequisiteGraphFile,
  writeThreadProgressionFile,
  writeVocabularyGraphFile,
} from './generators/index.js';
import { readAllBulkFiles } from './lib/index.js';
import { type BulkDataInput, processBulkData, type ProcessingResult } from './vocab-gen-core.js';

// Re-export core types and functions
export {
  type BulkDataInput,
  type ExtractedData,
  type ExtractionStats,
  processBulkData,
} from './vocab-gen-core.js';

// Re-export formatting function
export { formatPipelineResult } from './vocab-gen-format.js';

/**
 * Configuration options for the vocabulary mining pipeline.
 */
export interface PipelineConfig {
  /** Path to the bulk download data directory */
  readonly bulkDataPath: string;
  /** Path to output generated files */
  readonly outputPath: string;
  /** If true, don't write any files (preview mode) */
  readonly dryRun: boolean;
  /** If true, log verbose output */
  readonly verbose: boolean;
}

/**
 * Input options for creating pipeline configuration.
 */
export interface PipelineConfigInput {
  /** Path to the bulk download data directory */
  readonly bulkDataPath: string;
  /** Path to output generated files */
  readonly outputPath: string;
  /** If true, don't write any files (preview mode) */
  readonly dryRun?: boolean;
  /** If true, log verbose output */
  readonly verbose?: boolean;
}

/**
 * Result of running the vocabulary mining pipeline.
 */
export interface PipelineResult {
  /** Whether the pipeline completed successfully */
  readonly success: boolean;
  /** Number of bulk download files processed */
  readonly filesProcessed: number;
  /** Total number of lessons across all files */
  readonly totalLessons: number;
  /** Total number of units across all files */
  readonly totalUnits: number;
  /** Number of unique keywords extracted (deduplicated) */
  readonly uniqueKeywords: number;
  /** Total misconceptions extracted (not deduplicated) */
  readonly totalMisconceptions: number;
  /** Total learning points extracted */
  readonly totalLearningPoints: number;
  /** Total teacher tips extracted (empty filtered) */
  readonly totalTeacherTips: number;
  /** Total prior knowledge requirements extracted */
  readonly totalPriorKnowledge: number;
  /** Total NC statements extracted */
  readonly totalNCStatements: number;
  /** Number of unique threads extracted */
  readonly uniqueThreads: number;
  /** List of output files generated */
  readonly outputFiles: readonly string[];
  /** Duration of the pipeline run in milliseconds */
  readonly durationMs: number;
  /** If true, this was a dry run */
  readonly dryRun?: boolean;
  /** Error message if success is false */
  readonly error?: string;
}

/**
 * Creates a pipeline configuration with defaults.
 *
 * @param input - Configuration input with required and optional fields
 * @returns Complete configuration with defaults applied
 */
export function createPipelineConfig(input: PipelineConfigInput): PipelineConfig {
  return {
    bulkDataPath: input.bulkDataPath,
    outputPath: input.outputPath,
    dryRun: input.dryRun ?? false,
    verbose: input.verbose ?? false,
  };
}

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
): Promise<string[]> {
  const outputFiles: string[] = [];
  const sourceVersion = await readSourceVersion(config.bulkDataPath);

  // Generate thread progression graph
  const threadGraph = generateThreadProgressionData(result.extractedData.threads, sourceVersion);
  const threadFilePath = await writeThreadProgressionFile(threadGraph, config.outputPath);
  outputFiles.push(basename(threadFilePath));

  // Generate prerequisite graph
  const prerequisiteGraph = generatePrerequisiteGraphData(
    result.extractedData.priorKnowledge,
    result.extractedData.threads,
    sourceVersion,
  );
  const prerequisiteFilePath = await writePrerequisiteGraphFile(
    prerequisiteGraph,
    config.outputPath,
  );
  outputFiles.push(basename(prerequisiteFilePath));

  // Generate analysis report (written to vocab-gen/reports in the SDK)
  const analysisReport = generateAnalysisReport(result.extractedData);
  const vocabGenDir = dirname(fileURLToPath(import.meta.url));
  const analysisFilePath = await writeAnalysisReportFile(analysisReport, vocabGenDir);
  outputFiles.push(`reports/${basename(analysisFilePath)}`);

  const minedSynonyms = generateMinedSynonyms(result.extractedData.keywords);
  const synonymsDir = join(config.outputPath, 'synonyms');
  const synonymsFilePath = await writeMinedSynonymsFile(minedSynonyms, synonymsDir);
  outputFiles.push(`synonyms/${basename(synonymsFilePath)}`);

  // Generate misconception graph
  const misconceptionGraph = generateMisconceptionGraphData(
    result.extractedData.misconceptions,
    sourceVersion,
  );
  const misconceptionFilePath = await writeMisconceptionGraphFile(
    misconceptionGraph,
    config.outputPath,
  );
  outputFiles.push(basename(misconceptionFilePath));

  // Generate vocabulary graph
  const vocabularyGraph = generateVocabularyGraphData(result.extractedData.keywords, sourceVersion);
  const vocabularyFilePath = await writeVocabularyGraphFile(vocabularyGraph, config.outputPath);
  outputFiles.push(basename(vocabularyFilePath));

  // Generate NC coverage graph
  const ncCoverageGraph = generateNCCoverageGraphData(
    result.extractedData.ncStatements,
    sourceVersion,
  );
  const ncCoverageFilePath = await writeNCCoverageGraphFile(ncCoverageGraph, config.outputPath);
  outputFiles.push(basename(ncCoverageFilePath));

  return outputFiles;
}

/**
 * Runs the vocabulary mining pipeline.
 *
 * @param config - Pipeline configuration
 * @returns Pipeline result with statistics and output files
 */
export async function runPipeline(config: PipelineConfig): Promise<PipelineResult> {
  const startTime = Date.now();

  // Read all bulk download files
  const allFiles = await readAllBulkFiles(config.bulkDataPath);

  // Transform file data to BulkDataInput format
  const bulkData: BulkDataInput[] = allFiles.map((file) => ({
    sequenceSlug: file.data.sequenceSlug,
    lessons: file.data.lessons,
    units: file.data.sequence,
  }));

  // Process the data (extraction)
  const result = processBulkData(bulkData);

  let outputFiles: string[] = [];
  if (!config.dryRun) {
    outputFiles = await generateOutputFiles(result, config);
  }

  const durationMs = Date.now() - startTime;

  return {
    success: true,
    filesProcessed: result.filesProcessed,
    totalLessons: result.totalLessons,
    totalUnits: result.totalUnits,
    ...result.stats,
    outputFiles,
    durationMs,
    dryRun: config.dryRun,
  };
}
