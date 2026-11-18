/**
 * Filesystem seam for the `arc-metrics` topic.
 *
 * @remarks
 * Two ports, both read-only, so the composition root reads real transcripts
 * while unit and integration tests inject fakes; only the production adapter
 * (`file-system-node.ts`) touches `node:fs`.
 *
 * The line port streams rather than returning a string: an arc's transcripts
 * run to a hundred megabytes each, and the whole-file read the session-metadata
 * seam uses (one file, its tail) would hold a whole transcript in memory here,
 * one session at a time.
 *
 * @packageDocumentation
 */

/** Read-only filesystem seam for reading a project's session transcripts. */
export interface ArcMetricsFileSystem {
  /**
   * List the transcript files directly inside a project directory.
   *
   * @param directory - Absolute path of the vendor's project directory.
   * @returns Absolute paths of its `.jsonl` files, in any order, or `undefined`
   *   when the directory does not exist. Absence is an answer, not an error:
   *   whether it is ordinary (the launch directory has never held a session)
   *   or a mistake (a directory the caller named) is the caller's to decide.
   *   Transcripts the vendor nests deeper, a session's sub-agents among them,
   *   are not listed.
   */
  readonly listTranscripts: (directory: string) => Promise<readonly string[] | undefined>;

  /**
   * Stream one transcript's lines.
   *
   * @param absolutePath - Absolute path of a transcript file.
   * @returns Its lines, without terminators; may reject with any IO error.
   */
  readonly readLines: (absolutePath: string) => AsyncIterable<string>;
}
