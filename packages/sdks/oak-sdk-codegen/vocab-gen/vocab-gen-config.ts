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
  /**
   * If true, retain restricted lessons instead of excluding them. Default
   * false (exclude) — the documented, configurable restricted-exclusion switch
   * (owner ruling 2026-08-12). See the SDK filter's
   * `RestrictedLessonExclusionOptions`. `runPipeline` rejects `true` by
   * returning a failed `PipelineResult` (`success: false`; `error` names
   * ADR-224) — it does not throw — until restricted lessons are labelled in
   * serving surfaces: the generated corpus is committed and MCP-consumed, so
   * the exclusion policy binds the corpus-producing boundary as it binds
   * index-producing runs.
   */
  readonly includeRestricted: boolean;
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
  /**
   * If true, retain restricted lessons instead of excluding them (default
   * false — exclude). `runPipeline` rejects `true` with a failed
   * `PipelineResult` — not a throw — until the labelled-serving follow-on
   * (ADR-224).
   */
  readonly includeRestricted?: boolean;
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
  /** Restricted lessons excluded before extraction (MCP-204 filter decision) */
  readonly restrictedLessonsExcluded: number;
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
    includeRestricted: input.includeRestricted ?? false,
  };
}
