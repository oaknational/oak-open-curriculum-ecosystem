/**
 * Graph-corpus JSON dataset descriptor and writer (G1a + G2).
 *
 * @remarks
 * Defines the graph-corpus-specific content for the three-file JSON dataset
 * pattern (`data.json`, `types.ts`, `index.ts`) and delegates the mechanical
 * write to {@link writeJsonDataset}.
 *
 * Unlike the older per-dataset descriptors, the emitted `types.ts` does NOT
 * duplicate the corpus interfaces: the types are defined once in
 * {@link generateGraphCorpusData}'s module (the single source of truth) and the
 * emitted `types.ts` re-exports them, so no hand-maintained type runs parallel
 * to the generated corpus (Decision A / ADR-031).
 */
import type { Logger } from '@oaknational/logger';

import { graphCorpusIndexModuleLines } from './graph-corpus-emitted-index-lines.js';
import { graphCorpusTypesModuleLines } from './graph-corpus-emitted-types-lines.js';
import type { GraphCorpus } from './graph-corpus-generator.js';
import { writeJsonDataset, type JsonDatasetDescriptor } from './write-json-dataset.js';

/**
 * Graph-corpus dataset descriptor.
 *
 * @remarks
 * Provides the graph-corpus-specific (re-exporting) types and typed loader
 * content for the generic JSON dataset writer.
 */
export const graphCorpusDescriptor: JsonDatasetDescriptor = {
  directoryName: 'graph-corpus',
  typesModuleContent: graphCorpusTypesModuleLines.join('\n'),
  indexModuleContent: graphCorpusIndexModuleLines.join('\n'),
};

/**
 * Writes the graph corpus output as JSON plus typed TypeScript modules.
 *
 * @param corpus - Graph corpus to write
 * @param outputDir - Parent output directory
 * @returns Path to the created `graph-corpus` directory
 */
export async function writeGraphCorpusAsJson(
  corpus: GraphCorpus,
  outputDir: string,
  logger?: Logger,
): Promise<string> {
  logger?.info('bulk.writer.write_graph_corpus_json', {
    outputDir,
    sourceVersion: corpus.sourceVersion,
  });
  return writeJsonDataset(graphCorpusDescriptor, corpus, outputDir, logger);
}
