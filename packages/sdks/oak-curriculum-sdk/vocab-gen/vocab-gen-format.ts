/**
 * Formatting utilities for vocabulary mining pipeline output.
 *
 * @module vocab-gen/vocab-gen-format
 */
import type { PipelineResult } from './vocab-gen.js';

/**
 * Formats source data statistics.
 */
function formatSourceData(result: PipelineResult): readonly string[] {
  return [
    'Source data:',
    `  ${result.totalLessons.toLocaleString()} lessons`,
    `  ${result.totalUnits.toLocaleString()} units`,
  ];
}

/**
 * Formats extracted vocabulary statistics.
 */
function formatVocabularyStats(result: PipelineResult): readonly string[] {
  return [
    'Extracted vocabulary:',
    `  ${result.uniqueKeywords.toLocaleString()} unique keywords`,
    `  ${result.totalMisconceptions.toLocaleString()} misconceptions`,
    `  ${result.totalLearningPoints.toLocaleString()} learning points`,
    `  ${result.totalTeacherTips.toLocaleString()} teacher tips`,
    `  ${result.totalPriorKnowledge.toLocaleString()} prior knowledge requirements`,
    `  ${result.totalNCStatements.toLocaleString()} NC statements`,
    `  ${result.uniqueThreads.toLocaleString()} unique threads`,
  ];
}

/**
 * Formats output files section.
 */
function formatOutputFiles(result: PipelineResult): readonly string[] {
  if (result.outputFiles.length > 0) {
    return ['', 'Output files:', ...result.outputFiles.map((f) => `  - ${f}`)];
  }
  if (result.dryRun) {
    return ['', 'No files written (dry run)'];
  }
  return [];
}

/**
 * Formats a pipeline result for display.
 *
 * @param result - The pipeline result to format
 * @returns Formatted string for console output
 */
export function formatPipelineResult(result: PipelineResult): string {
  const lines: string[] = [];

  if (result.dryRun) {
    lines.push('=== DRY RUN - No files written ===', '');
  }

  lines.push(`Files processed: ${result.filesProcessed}`, '');
  lines.push(...formatSourceData(result), '');
  lines.push(...formatVocabularyStats(result));
  lines.push(...formatOutputFiles(result));
  lines.push('', `Duration: ${(result.durationMs / 1000).toFixed(2)}s`);

  return lines.join('\n');
}
