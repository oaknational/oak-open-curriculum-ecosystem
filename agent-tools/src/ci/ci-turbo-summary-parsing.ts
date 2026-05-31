/**
 * Parse and validate a raw Turbo `--summarize` JSON payload.
 *
 * @remarks
 * This module contains boundary-narrowing helpers that turn `unknown` values
 * into typed primitives, the per-task parser, and the top-level
 * `parseTurboSummary` function. All functions throw on unexpected shapes and
 * are caught by the public entry point, which converts errors to the
 * `ParseResult` discriminated union.
 *
 * @packageDocumentation
 */

import { type JsonObject, isJsonObject } from '../collaboration-state/json.js';

import type { ParseResult, TurboSummary, TurboTask } from './ci-turbo-report-types.js';

// ---------------------------------------------------------------------------
// Boundary-narrowing primitives
// ---------------------------------------------------------------------------

/**
 * Whether the value is a JavaScript array.
 *
 * @remarks
 * Kept as a named predicate so callers can use it without reaching for
 * `Array.isArray` directly — consistent with the other narrowing helpers.
 *
 * @param value - The value to test.
 * @returns `true` when `value` is an array.
 */
function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Narrow an unknown value to a `JsonObject`, throwing a descriptive error if
 * the shape does not match.
 *
 * @param value - The value to narrow.
 * @param label - Human-readable label used in the error message.
 * @returns The value cast to {@link JsonObject}.
 * @throws `Error` when `value` is not a plain object.
 */
function readRecord(value: unknown, label: string): JsonObject {
  if (isJsonObject(value)) {
    return value;
  }
  throw new Error(`${label} must be an object.`);
}

/**
 * Narrow an unknown value to an array, throwing a descriptive error if the
 * shape does not match.
 *
 * @param value - The value to narrow.
 * @param label - Human-readable label used in the error message.
 * @returns The value as `unknown[]`.
 * @throws `Error` when `value` is not an array.
 */
function readArray(value: unknown, label: string): unknown[] {
  if (isUnknownArray(value)) {
    return value;
  }
  throw new Error(`${label} must be an array.`);
}

/**
 * Narrow an unknown value to a `string`, throwing a descriptive error if the
 * shape does not match.
 *
 * @param value - The value to narrow.
 * @param label - Human-readable label used in the error message.
 * @returns The string value.
 * @throws `Error` when `value` is not a string.
 */
function readString(value: unknown, label: string): string {
  if (typeof value === 'string') {
    return value;
  }
  throw new Error(`${label} must be a string.`);
}

/**
 * Narrow an unknown value to a `string | null`.
 *
 * Returns `null` when `value` is `null` or `undefined`, otherwise delegates
 * to {@link readString} and throws if the value is not a string.
 *
 * @param value - The value to narrow.
 * @param label - Human-readable label used in the error message.
 * @returns The string value, or `null` for absent fields.
 * @throws `Error` when `value` is present but not a string.
 */
function readNullableString(value: unknown, label: string): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return readString(value, label);
}

/**
 * Narrow an unknown value to a finite `number`, throwing a descriptive error
 * if the shape does not match.
 *
 * @param value - The value to narrow.
 * @param label - Human-readable label used in the error message.
 * @returns The finite number value.
 * @throws `Error` when `value` is not a finite number.
 */
function readNumber(value: unknown, label: string): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  throw new Error(`${label} must be a finite number.`);
}

// ---------------------------------------------------------------------------
// Task parser
// ---------------------------------------------------------------------------

/**
 * Parse a single task entry from the Turbo summary `tasks` array.
 *
 * @param taskValue - The raw `unknown` element at `tasks[index]`.
 * @param index - Zero-based position in the tasks array, used in error messages.
 * @returns A fully typed {@link TurboTask}.
 * @throws `Error` when any required field is missing or has the wrong type.
 */
function parseTask(taskValue: unknown, index: number): TurboTask {
  const t = readRecord(taskValue, `Turbo summary task at index ${index}`);
  const taskId = readString(t['taskId'], `Turbo summary task ${index} field "taskId"`);
  const exec = readRecord(t['execution'], `Turbo summary task "${taskId}" field "execution"`);
  const cache = readRecord(t['cache'], `Turbo summary task "${taskId}" field "cache"`);

  return {
    taskId,
    taskName: readString(t['task'], `Turbo summary task ${index} field "task"`),
    packageName: readString(t['package'], `Turbo summary task ${index} field "package"`),
    exitCode: readNumber(
      exec['exitCode'],
      `Turbo summary task ${index} field "execution.exitCode"`,
    ),
    cacheStatus: readString(cache['status'], `Turbo summary task ${index} field "cache.status"`),
    timeSavedMs: readNumber(
      cache['timeSaved'],
      `Turbo summary task ${index} field "cache.timeSaved"`,
    ),
    logFile: readNullableString(t['logFile'], `Turbo summary task ${index} field "logFile"`),
  };
}

// ---------------------------------------------------------------------------
// Top-level summary parser
// ---------------------------------------------------------------------------

/**
 * Parse a Turbo `--summarize` JSON payload into the reporter's internal shape.
 *
 * @remarks
 * Pass/fail totals are derived from per-task exit codes rather than the
 * top-level `execution` counters because cached runs can leave
 * `execution.success` lower than the number of passing tasks.
 *
 * @param summaryJson - Raw JSON value produced by `JSON.parse` on a Turbo summary file.
 * @returns `{ ok: true, value }` on success, or `{ ok: false, error }` on any
 *   parse or validation failure.
 */
export function parseTurboSummary(summaryJson: unknown): ParseResult {
  try {
    const summary = readRecord(summaryJson, 'Turbo summary');
    const execution = readRecord(summary['execution'], 'Turbo summary field "execution"');
    const tasks = readArray(summary['tasks'], 'Turbo summary field "tasks"').map(parseTask);
    const exitCode = readNumber(execution['exitCode'], 'Turbo summary field "execution.exitCode"');

    const passedCount = tasks.filter((task) => task.exitCode === 0).length;
    const cachedCount = tasks.filter((task) => task.cacheStatus === 'HIT').length;
    const totalTimeSavedMs = tasks.reduce((total, task) => total + task.timeSavedMs, 0);

    const value: TurboSummary = {
      attemptedCount: tasks.length,
      passedCount,
      failedCount: tasks.length - passedCount,
      cachedCount,
      totalTimeSavedMs,
      exitCode,
      tasks,
    };

    return { ok: true, value };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Unknown Turbo summary parse failure.'),
    };
  }
}
