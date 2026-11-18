/**
 * @packageDocumentation
 *
 * The seat-rollout command-record reader: what a Codex seat's rollout says
 * about the commands its harness ran, as an admissible summary that never
 * carries the command history. The IO edge is the `codex-exec` command line.
 */
export { readCommandRecords } from './read-command-records.js';
export { renderSummary } from './summary.js';
export type { CommandRecordsSummary } from './summary.js';
