/**
 * Bulk download file reader for Oak curriculum data.
 *
 * @remarks
 * Provides pure functions for discovering and parsing bulk download files.
 * All file system operations use Node.js fs/promises for async I/O.
 *
 * Pure filename-parsing utilities live in \`reader-utils.ts\` to avoid
 * coupling callers that only need string parsing to generated types.
 *
 * @example
 * ```ts
 * const files = await discoverBulkFiles('bulk-downloads/');
 * for (const file of files) {
 *   const data = await parseBulkFile(basePath, file);
 *   // Process data...
 * }
 * ```

 */
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

import { bulkDownloadFileSchema, type BulkDownloadFile } from '../types/generated/bulk/index.js';
import { extractSubjectPhase, type SubjectPhase } from './reader-utils.js';

export { extractSubjectPhase, type SubjectPhase } from './reader-utils.js';

/**
 * Discovers all bulk download JSON files in a directory.
 *
 * @param basePath - Path to the bulk download directory
 * @returns Array of JSON filenames (not full paths)
 *
 * @throws Error if directory doesn't exist or can't be read
 *
 * @example
 * ```ts
 * const files = await discoverBulkFiles('bulk-downloads/');
 * // Returns: ['maths-primary.json', 'maths-secondary.json', ...]
 * ```
 */
export async function discoverBulkFiles(basePath: string): Promise<readonly string[]> {
  const entries = await readdir(basePath);
  return entries.filter((entry) => entry.endsWith('.json'));
}

/**
 * Parses a single bulk download file with Zod validation.
 *
 * @param basePath - Path to the bulk download directory
 * @param filename - Name of the JSON file to parse
 * @returns Validated and typed bulk download data
 *
 * @throws ZodError if file doesn't match expected schema
 * @throws Error if file can't be read or isn't valid JSON
 *
 * @example
 * ```ts
 * const data = await parseBulkFile('bulk-downloads/', 'maths-primary.json');
 * console.log(data.sequenceSlug); // 'maths-primary'
 * console.log(data.lessons.length); // 1072
 * ```
 */
export async function parseBulkFile(basePath: string, filename: string): Promise<BulkDownloadFile> {
  const filePath = join(basePath, filename);
  const content = await readFile(filePath, 'utf-8');
  const json: unknown = JSON.parse(content);
  return bulkDownloadFileSchema.parse(json);
}

/**
 * Result of reading a bulk file with metadata.
 */
export interface BulkFileResult {
  /** Original filename */
  readonly filename: string;
  /** Extracted subject and phase */
  readonly subjectPhase: SubjectPhase;
  /** Parsed and validated bulk download data */
  readonly data: BulkDownloadFile;
}

/**
 * Reads all bulk download files from a directory.
 *
 * @param basePath - Path to the bulk download directory
 * @returns Array of parsed bulk download files with metadata
 *
 * @example
 * ```ts
 * const allData = await readAllBulkFiles('bulk-downloads/');
 * console.log(allData.length); // 30
 * ```
 */
export async function readAllBulkFiles(basePath: string): Promise<readonly BulkFileResult[]> {
  const files = await discoverBulkFiles(basePath);
  const results: BulkFileResult[] = [];

  for (const filename of files) {
    const subjectPhase = extractSubjectPhase(filename);
    if (!subjectPhase) {
      continue;
    }
    const data = await parseBulkFile(basePath, filename);
    results.push({ filename, subjectPhase, data });
  }

  return results;
}
