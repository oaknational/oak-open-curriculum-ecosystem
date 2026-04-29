import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_RUNS_DIR = fileURLToPath(new URL('../.turbo/runs', import.meta.url));

/**
 * Parse a Turbo `--summarize` JSON payload into the reporter's internal shape.
 *
 * Pass/fail totals are derived from per-task exit codes rather than the
 * top-level execution counters because cached runs can leave
 * `execution.success` lower than the number of passing tasks.
 *
 * @param {unknown} summaryJson
 * @returns {{
 *   ok: true,
 *   value: {
 *     attemptedCount: number,
 *     passedCount: number,
 *     failedCount: number,
 *     cachedCount: number,
 *     totalTimeSavedMs: number,
 *     exitCode: number,
 *     tasks: Array<{
 *       taskId: string,
 *       taskName: string,
 *       packageName: string,
 *       exitCode: number,
 *       cacheStatus: string,
 *       timeSavedMs: number,
 *       logFile: string | null,
 *     }>,
 *   },
 * } | {
 *   ok: false,
 *   error: Error,
 * }}
 */
export function parseTurboSummary(summaryJson) {
  try {
    const summaryRecord = readRecord(summaryJson, 'Turbo summary');
    const executionRecord = readRecord(summaryRecord.execution, 'Turbo summary field "execution"');
    const tasks = readArray(summaryRecord.tasks, 'Turbo summary field "tasks"').map(
      (taskValue, index) => {
        const taskRecord = readRecord(taskValue, `Turbo summary task at index ${index}`);
        const taskIdLabel = `Turbo summary task ${index} field "taskId"`;
        const taskId = readString(taskRecord.taskId, taskIdLabel);
        const taskExecutionRecord = readRecord(
          taskRecord.execution,
          `Turbo summary task "${taskId}" field "execution"`,
        );
        const cacheRecord = readRecord(
          taskRecord.cache,
          `Turbo summary task "${taskId}" field "cache"`,
        );

        return {
          taskId,
          taskName: readString(taskRecord.task, `Turbo summary task ${index} field "task"`),
          packageName: readString(
            taskRecord.package,
            `Turbo summary task ${index} field "package"`,
          ),
          exitCode: readNumber(
            taskExecutionRecord.exitCode,
            `Turbo summary task ${index} field "execution.exitCode"`,
          ),
          cacheStatus: readString(
            cacheRecord.status,
            `Turbo summary task ${index} field "cache.status"`,
          ),
          timeSavedMs: readNumber(
            cacheRecord.timeSaved,
            `Turbo summary task ${index} field "cache.timeSaved"`,
          ),
          logFile: readNullableString(
            taskRecord.logFile,
            `Turbo summary task ${index} field "logFile"`,
          ),
        };
      },
    );

    const exitCode = readNumber(
      executionRecord.exitCode,
      'Turbo summary field "execution.exitCode"',
    );
    const passedCount = tasks.filter((task) => task.exitCode === 0).length;
    const failedCount = tasks.length - passedCount;
    const cachedCount = tasks.filter((task) => task.cacheStatus === 'HIT').length;
    const totalTimeSavedMs = tasks.reduce((total, task) => total + task.timeSavedMs, 0);

    return {
      ok: true,
      value: {
        attemptedCount: tasks.length,
        passedCount,
        failedCount,
        cachedCount,
        totalTimeSavedMs,
        exitCode,
        tasks,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error('Unknown Turbo summary parse failure.'),
    };
  }
}

/**
 * Format the parsed summary as a markdown table for the GitHub step summary.
 *
 * @param {{
 *   attemptedCount: number,
 *   passedCount: number,
 *   failedCount: number,
 *   cachedCount: number,
 *   totalTimeSavedMs: number,
 *   exitCode: number,
 *   tasks: Array<{
 *     taskId: string,
 *     taskName: string,
 *     packageName: string,
 *     exitCode: number,
 *     cacheStatus: string,
 *     timeSavedMs: number,
 *     logFile: string | null,
 *   }>,
 * }} summary
 * @returns {string}
 */
export function formatSummaryTable(summary) {
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
      lines.push(
        `| ${task.taskId} | ${task.exitCode === 0 ? 'PASS' : 'FAIL'} | ${task.cacheStatus} | ${formatDurationMs(task.timeSavedMs)} |`,
      );
    }
  }

  lines.push(
    `| **Totals** | **${summary.passedCount} passed / ${summary.failedCount} failed / ${summary.attemptedCount} attempted** | **${summary.cachedCount} cached** | **${formatDurationMs(summary.totalTimeSavedMs)}** |`,
  );

  return lines.join('\n');
}

/**
 * Format GitHub Actions error annotations for failed tasks only.
 *
 * @param {{
 *   tasks: Array<{
 *     taskId: string,
 *     taskName: string,
 *     packageName: string,
 *     exitCode: number,
 *     cacheStatus: string,
 *     timeSavedMs: number,
 *     logFile: string | null,
 *   }>,
 * }} summary
 * @returns {string}
 */
export function formatAnnotations(summary) {
  return summary.tasks
    .filter((task) => task.exitCode !== 0)
    .map((task) => formatErrorAnnotation(task))
    .join('\n');
}

/**
 * Find the newest Turbo summary JSON file in a runs directory.
 *
 * @param {string} runsDir
 * @returns {Promise<string>}
 */
export async function findLatestSummaryFile(runsDir) {
  const entries = await fs.readdir(runsDir, { withFileTypes: true });
  const jsonFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.json'));

  if (jsonFiles.length === 0) {
    throw new Error(`No Turbo summary JSON files were found in "${runsDir}".`);
  }

  const datedFiles = await Promise.all(
    jsonFiles.map(async (entry) => {
      const filePath = path.join(runsDir, entry.name);
      const stats = await fs.stat(filePath);

      return {
        filePath,
        mtimeMs: stats.mtimeMs,
      };
    }),
  );

  datedFiles.sort((left, right) => {
    if (right.mtimeMs !== left.mtimeMs) {
      return right.mtimeMs - left.mtimeMs;
    }

    return right.filePath.localeCompare(left.filePath);
  });

  return datedFiles[0].filePath;
}

/**
 * Run the Turbo summary reporter using the filesystem and stdio.
 *
 * The reporter is best-effort: on failure it emits a warning annotation rather
 * than failing the CI step.
 *
 * @param {{
 *   summaryFilePath?: string,
 *   runsDir?: string,
 *   stdout?: { write: (text: string) => void },
 *   stderr?: { write: (text: string) => void },
 * }} options
 * @returns {Promise<{ exitCode: number }>}
 */
export async function runCiTurboReport(options = {}) {
  const {
    summaryFilePath,
    runsDir = DEFAULT_RUNS_DIR,
    stdout = process.stdout,
    stderr = process.stderr,
  } = options;

  try {
    const resolvedSummaryFilePath =
      typeof summaryFilePath === 'string' && summaryFilePath.length > 0
        ? summaryFilePath
        : await findLatestSummaryFile(runsDir);
    const summaryText = await fs.readFile(resolvedSummaryFilePath, 'utf8');
    const parsedSummary = parseTurboSummary(JSON.parse(summaryText));

    if (!parsedSummary.ok) {
      throw parsedSummary.error;
    }

    stdout.write(`${formatSummaryTable(parsedSummary.value)}\n`);

    const annotations = formatAnnotations(parsedSummary.value);

    if (annotations !== '') {
      stderr.write(`${annotations}\n`);
    }

    return { exitCode: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Turbo reporter failure.';
    stderr.write(
      `::warning::Unable to generate Turbo summary: ${escapeAnnotationMessage(message)}\n`,
    );
    return { exitCode: 0 };
  }
}

/**
 * @param {unknown} value
 * @param {string} label
 * @returns {Record<string, unknown>}
 */
function readRecord(value, label) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return value;
  }

  throw new Error(`${label} must be an object.`);
}

/**
 * @param {unknown} value
 * @param {string} label
 * @returns {unknown[]}
 */
function readArray(value, label) {
  if (Array.isArray(value)) {
    return value;
  }

  throw new Error(`${label} must be an array.`);
}

/**
 * @param {unknown} value
 * @param {string} label
 * @returns {string}
 */
function readString(value, label) {
  if (typeof value === 'string') {
    return value;
  }

  throw new Error(`${label} must be a string.`);
}

/**
 * @param {unknown} value
 * @param {string} label
 * @returns {string | null}
 */
function readNullableString(value, label) {
  if (value === null || value === undefined) {
    return null;
  }

  return readString(value, label);
}

/**
 * @param {unknown} value
 * @param {string} label
 * @returns {number}
 */
function readNumber(value, label) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  throw new Error(`${label} must be a finite number.`);
}

/**
 * @param {number} durationMs
 * @returns {string}
 */
function formatDurationMs(durationMs) {
  if (durationMs < 1000) {
    return `${Math.round(durationMs)}ms`;
  }

  return `${(durationMs / 1000).toFixed(1)}s`;
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeAnnotationProperty(value) {
  return value
    .replaceAll('%', '%25')
    .replaceAll('\r', '%0D')
    .replaceAll('\n', '%0A')
    .replaceAll(':', '%3A')
    .replaceAll(',', '%2C');
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeAnnotationMessage(value) {
  return value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
}

/**
 * @param {{
 *   taskId: string,
 *   logFile: string | null,
 * }} task
 * @returns {string}
 */
function formatErrorAnnotation(task) {
  const message = escapeAnnotationMessage(`${task.taskId} failed`);

  if (task.logFile === null) {
    return `::error::${message}`;
  }

  return `::error file=${escapeAnnotationProperty(task.logFile)}::${message}`;
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const { exitCode } = await runCiTurboReport({
    summaryFilePath: process.argv[2],
  });
  process.exit(exitCode);
}
