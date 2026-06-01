/**
 * Shared type declarations for the Turbo CI report pipeline.
 *
 * @remarks
 * All interfaces in this module are pure data shapes — no implementation.
 * They are re-exported from the entry module `ci-turbo-report` so callers
 * never need to import directly from here.
 *
 * @packageDocumentation
 */

/**
 * Filesystem contract used by {@link findLatestSummaryFile} and
 * {@link runCiTurboReport} for dependency injection in tests.
 *
 * @remarks
 * Providing this interface as the only I/O seam means the reporter can be
 * exercised with an in-memory fake without touching the real filesystem.
 */
export interface CiFileSystem {
  /** List plain-file names directly under a directory. */
  readdir(dir: string): Promise<string[]>;

  /** Read stat information for a file path. */
  stat(filePath: string): Promise<{ mtimeMs: number }>;

  /** Read a UTF-8 file and return its contents as a string. */
  readFile(filePath: string, encoding: 'utf8'): Promise<string>;
}

/**
 * A single parsed task extracted from a Turbo run-summary JSON file.
 *
 * @remarks
 * Fields are the minimal subset the reporter uses. Raw Turbo summary objects
 * contain additional keys that are intentionally ignored.
 */
export interface TurboTask {
  /** The fully-qualified Turbo task identifier, e.g. `@oak/pkg-a#build`. */
  taskId: string;

  /** The bare task name without the package prefix, e.g. `build`. */
  taskName: string;

  /** The package that owns this task, e.g. `@oak/pkg-a`. */
  packageName: string;

  /** The process exit code reported by Turbo for this task. */
  exitCode: number;

  /** Turbo cache status for this task run, e.g. `"HIT"` or `"MISS"`. */
  cacheStatus: string;

  /**
   * Time saved by a cache hit, in milliseconds.
   * `0` when the cache was missed.
   */
  timeSavedMs: number;

  /**
   * Absolute or workspace-relative path to the task log file.
   * `null` when Turbo did not emit a log for this task.
   */
  logFile: string | null;
}

/**
 * The parsed and derived Turbo run summary produced by `parseTurboSummary`.
 *
 * @remarks
 * `passedCount`, `failedCount`, and `cachedCount` are derived from per-task
 * data rather than the top-level `execution` counters, because cached runs
 * can leave `execution.success` lower than the true number of passing tasks.
 */
export interface TurboSummary {
  /** Total number of tasks Turbo attempted. */
  attemptedCount: number;

  /** Number of tasks that exited with code `0`. */
  passedCount: number;

  /** Number of tasks that exited with a non-zero code. */
  failedCount: number;

  /** Number of tasks that were satisfied by a cache hit. */
  cachedCount: number;

  /** Sum of `timeSavedMs` across all tasks, in milliseconds. */
  totalTimeSavedMs: number;

  /** Overall pipeline exit code from the Turbo `execution` block. */
  exitCode: number;

  /** Parsed detail for every task in the run. */
  tasks: TurboTask[];
}

/**
 * Discriminated union returned by `parseTurboSummary`.
 *
 * @remarks
 * Use the `ok` discriminant before accessing `value` or `error`:
 *
 * ```ts
 * const result = parseTurboSummary(json);
 * if (!result.ok) {
 *   console.error(result.error.message);
 * } else {
 *   console.log(result.value.passedCount);
 * }
 * ```
 */
export type ParseResult = { ok: true; value: TurboSummary } | { ok: false; error: Error };

/**
 * Options accepted by `runCiTurboReport`.
 *
 * @remarks
 * All fields are optional. Omitting them selects production defaults:
 * the real Node.js filesystem, `process.stdout`/`process.stderr`, and the
 * repository-local `.turbo/runs` directory as the search path.
 */
export interface RunCiTurboReportOptions {
  /**
   * Explicit path to a Turbo summary JSON file.
   * When omitted the reporter scans `runsDir` for the newest file.
   */
  summaryFilePath?: string;

  /**
   * Directory to search for Turbo run-summary JSON files when
   * `summaryFilePath` is not provided.
   * Defaults to `<repo-root>/.turbo/runs`.
   */
  runsDir?: string;

  /** Output stream for the markdown step summary. Defaults to `process.stdout`. */
  stdout?: { write: (text: string) => void };

  /** Output stream for GitHub Actions annotations. Defaults to `process.stderr`. */
  stderr?: { write: (text: string) => void };

  /**
   * Injectable filesystem seam.
   * Defaults to the real Node.js `fs/promises` implementation.
   */
  fs?: CiFileSystem;
}
