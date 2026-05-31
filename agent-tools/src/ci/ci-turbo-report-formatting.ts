/**
 * Formatting functions that render a parsed Turbo summary into human- and
 * machine-readable output strings.
 *
 * @remarks
 * This module is intentionally side-effect-free: every function accepts
 * data and returns a string. I/O concerns live in the entry module.
 *
 * The two public functions — `formatSummaryTable` and `formatAnnotations` —
 * are re-exported by the entry module so existing importers keep working
 * without any path changes.
 *
 * @packageDocumentation
 */

import type { TurboSummary, TurboTask } from './ci-turbo-report-types.js';

// ---------------------------------------------------------------------------
// Duration formatting
// ---------------------------------------------------------------------------

/**
 * Format a duration in milliseconds as a compact human-readable string.
 *
 * @remarks
 * Durations under one second are expressed as `Nms` (rounded to the nearest
 * millisecond). Durations of one second or longer are expressed as `N.Ns`
 * (one decimal place).
 *
 * @param ms - The duration to format, in milliseconds.
 * @returns A string such as `"150ms"` or `"1.2s"`.
 */
function formatDurationMs(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
}

// ---------------------------------------------------------------------------
// GitHub Actions annotation escaping
// ---------------------------------------------------------------------------

/**
 * Escape a string for use as a GitHub Actions annotation message body.
 *
 * @remarks
 * GitHub Actions parses `%`, `\r`, and `\n` as special characters inside
 * annotation messages. This function percent-encodes them so the raw text
 * is preserved in the annotation.
 *
 * @param value - The raw message text to escape.
 * @returns The escaped string safe for use after `::error::`.
 */
export function escapeAnnotationMessage(value: string): string {
  return value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
}

/**
 * Escape a string for use as a GitHub Actions annotation property value.
 *
 * @remarks
 * In addition to message-level escaping, annotation property values (e.g.
 * `file=...`) must not contain unescaped `:` or `,` because those are
 * property-list delimiters in the workflow command syntax.
 *
 * @param value - The raw property value to escape.
 * @returns The escaped string safe for use in `::error file=<value>::`.
 */
function escapeAnnotationProperty(value: string): string {
  return escapeAnnotationMessage(value).replaceAll(':', '%3A').replaceAll(',', '%2C');
}

// ---------------------------------------------------------------------------
// Per-task annotation formatting
// ---------------------------------------------------------------------------

/**
 * Format a single GitHub Actions `::error` annotation line for a failed task.
 *
 * @remarks
 * When the task has a log file, the annotation includes a `file=` property so
 * GitHub can surface the annotation alongside the log. When `logFile` is
 * `null`, the annotation is emitted without a file reference.
 *
 * @param task - The failed {@link TurboTask} to annotate.
 * @returns A single annotation line without a trailing newline.
 */
function formatErrorAnnotation(task: TurboTask): string {
  const message = escapeAnnotationMessage(`${task.taskId} failed`);

  if (task.logFile === null) {
    return `::error::${message}`;
  }

  return `::error file=${escapeAnnotationProperty(task.logFile)}::${message}`;
}

// ---------------------------------------------------------------------------
// Markdown table formatting
// ---------------------------------------------------------------------------

/**
 * Format the parsed summary as a GitHub step-summary markdown table.
 *
 * @remarks
 * The table includes one row per task plus a totals row. When there are no
 * tasks a placeholder `_No tasks_` row is emitted instead.
 *
 * @param summary - A fully parsed {@link TurboSummary}.
 * @returns A multi-line markdown string (no trailing newline).
 */
export function formatSummaryTable(summary: TurboSummary): string {
  const lines = [
    '## Turbo Task Summary',
    '',
    '| Task | Status | Cache | Time Saved |',
    '| --- | --- | --- | --- |',
  ];

  if (summary.tasks.length === 0) {
    lines.push('| _No tasks_ | - | - | 0ms |');
  } else {
    for (const task of summary.tasks) {
      const status = task.exitCode === 0 ? 'PASS' : 'FAIL';
      lines.push(
        `| ${task.taskId} | ${status} | ${task.cacheStatus} | ${formatDurationMs(task.timeSavedMs)} |`,
      );
    }
  }

  lines.push(
    `| **Totals** | **${summary.passedCount} passed / ${summary.failedCount} failed / ${summary.attemptedCount} attempted** | **${summary.cachedCount} cached** | **${formatDurationMs(summary.totalTimeSavedMs)}** |`,
  );

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Annotations block formatting
// ---------------------------------------------------------------------------

/**
 * Format GitHub Actions error annotations for every failed task in the summary.
 *
 * @remarks
 * Only tasks with a non-zero exit code produce an annotation. When all tasks
 * passed the function returns an empty string so callers can skip writing to
 * stderr entirely.
 *
 * @param summary - A fully parsed {@link TurboSummary}.
 * @returns A newline-joined string of GitHub Actions annotation lines, or an
 *   empty string when there are no failures.
 */
export function formatAnnotations(summary: TurboSummary): string {
  return summary.tasks
    .filter((task) => task.exitCode !== 0)
    .map(formatErrorAnnotation)
    .join('\n');
}
