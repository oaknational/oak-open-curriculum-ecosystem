/**
 * Pipeline configuration types and defaults for the vocabulary mining pipeline.
 *
 * @remarks
 * Separated from the pipeline orchestrator to avoid coupling callers that
 * only need configuration or result types to the heavy generator imports.
 */

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
