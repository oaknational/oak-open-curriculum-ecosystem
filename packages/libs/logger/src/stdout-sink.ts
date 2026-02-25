/**
 * Stdout sink interface for writing log records to standard output
 *
 * This sink writes pre-formatted log strings directly to stdout
 * without any additional formatting or processing.
 *
 * For Node.js implementation, import createNodeStdoutSink from `@oaknational/logger/node`
 */

/**
 * Sink that writes to standard output
 */
export interface StdoutSink {
  /**
   * Write a pre-formatted log line to stdout
   *
   * @param line - Pre-formatted log string (should include newline if desired)
   */
  write(line: string): void;
}
