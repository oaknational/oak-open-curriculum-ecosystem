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
 * @see {@link https://github.com/oaknationalacademy/oak-notion-mcp/blob/main/docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md | ADR-086} for the pipeline specification
 */
import { basename } from 'path';

import {
  generatePrerequisiteGraphData,
  generateThreadProgressionData,
  writePrerequisiteGraphFile,
  writeThreadProgressionFile,
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
 * Extracts a version identifier from the bulk data path.
 *
 * @param bulkDataPath - Path to bulk download directory
 * @returns Version string derived from directory name
 *
 * @example
 * ```ts
 * extractSourceVersion('/path/to/oak-bulk-download-2025-12-07T09_37_04.693Z');
 * // Returns: '2025-12-07T09:37:04.693Z'
 * ```
 */
function extractSourceVersion(bulkDataPath: string): string {
  const dirName = basename(bulkDataPath);
  // Extract timestamp from directory name like 'oak-bulk-download-2025-12-07T09_37_04.693Z'
  const match = /(\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2}\.\d{3}Z)/.exec(dirName);
  if (match?.[1]) {
    // Convert underscores back to colons for ISO format
    return match[1].replace(/_/g, ':');
  }
  return dirName;
}

async function generateOutputFiles(
  result: ProcessingResult,
  config: PipelineConfig,
): Promise<string[]> {
  const outputFiles: string[] = [];
  const sourceVersion = extractSourceVersion(config.bulkDataPath);

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
