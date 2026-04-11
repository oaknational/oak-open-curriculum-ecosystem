/**
 * Generic JSON dataset writer.
 *
 * @remarks
 * Produces a three-file output for any dataset:
 * - `data.json` — raw data serialised with `JSON.stringify`
 * - `types.ts` — TypeScript interface definitions (caller-provided)
 * - `index.ts` — typed loader module (caller-provided)
 *
 * Each dataset provides its own types and loader content via a
 * {@link JsonDatasetDescriptor}. This writer owns only the mechanical
 * concern: create the directory and write the three files.
 *
 * @see write-json-graph-file.ts for the prior-knowledge-graph-specific
 * descriptor that proved this pattern.
 */
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Descriptor for a JSON dataset's three-file output.
 *
 * @remarks
 * The writer treats `typesModuleContent` and `indexModuleContent` as
 * opaque strings — it writes them verbatim. Content generation,
 * validation logic, and type definitions are the caller's
 * responsibility.
 */
export interface JsonDatasetDescriptor {
  /** Subdirectory name within the output directory. */
  readonly directoryName: string;
  /** TypeScript source for `types.ts`. */
  readonly typesModuleContent: string;
  /** TypeScript source for `index.ts`. */
  readonly indexModuleContent: string;
}

/**
 * Serialises data to formatted JSON.
 *
 * @param data - Data to serialise (any JSON-serialisable value)
 * @returns Pretty-printed JSON string with 2-space indentation
 */
export function serializeDatasetToJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Writes a dataset as three files into a named subdirectory.
 *
 * @param descriptor - Dataset descriptor with directory name and module content
 * @param data - Data to serialise as `data.json`
 * @param outputDir - Parent output directory
 * @returns Path to the created subdirectory
 */
export async function writeJsonDataset(
  descriptor: JsonDatasetDescriptor,
  data: unknown,
  outputDir: string,
): Promise<string> {
  const dirPath = join(outputDir, descriptor.directoryName);
  await mkdir(dirPath, { recursive: true });

  await Promise.all([
    writeFile(join(dirPath, 'data.json'), serializeDatasetToJson(data), 'utf-8'),
    writeFile(join(dirPath, 'types.ts'), descriptor.typesModuleContent, 'utf-8'),
    writeFile(join(dirPath, 'index.ts'), descriptor.indexModuleContent, 'utf-8'),
  ]);

  return dirPath;
}
