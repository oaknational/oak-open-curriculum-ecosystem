/**
 * Bulk ingestion — reads JSON files and indexes documents to Elasticsearch.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import type { IngestOptions, IngestResult } from '../types/admin-types.js';
import type { IndexResolverFn, SearchIndexKind } from '../internal/index-resolver.js';

/** Map from curriculum doc_type to Elasticsearch index kind. */
const DOC_TYPE_TO_KIND: Readonly<Record<string, SearchIndexKind>> = {
  lesson: 'lessons',
  unit: 'units',
  unit_rollup: 'unit_rollup',
  thread: 'threads',
  sequence: 'sequences',
  sequence_facet: 'sequence_facets',
};

/** Counts for each document type ingested during bulk load. */
interface IngestCounts {
  lessons: number;
  units: number;
  rollupsIndexed: number;
  threads: number;
  sequences: number;
  sequenceFacets: number;
}

/**
 * Run bulk ingestion from a directory of JSON files.
 *
 * @param client - Elasticsearch client
 * @param resolveIndex - Index name resolver for each doc type
 * @param logger - Optional logger for progress
 * @param options - Ingest options (bulkDir, dryRun, subjectFilter)
 * @returns IngestResult with counts per document type
 *
 * @example
 * ```typescript
 * const result = await runIngest(client, resolveIndex, logger, {
 *   bulkDir: '/path/to/bulk',
 *   dryRun: false,
 *   subjectFilter: ['maths'],
 * });
 * ```
 */
export async function runIngest(
  client: Client,
  resolveIndex: IndexResolverFn,
  logger: Logger | undefined,
  options: IngestOptions,
): Promise<IngestResult> {
  const { existsSync } = await import('node:fs');
  if (!existsSync(options.bulkDir)) {
    logger?.info('Bulk data directory not found', { bulkDir: options.bulkDir });
    return emptyResult();
  }

  const files = await listJsonFiles(options.bulkDir, options.subjectFilter);
  const counts = newCounts();
  let filesProcessed = 0;

  for (const filePath of files) {
    filesProcessed++;
    if (!options.dryRun) {
      const docs = await readJsonFile(filePath);
      await ingestDocs(docs, client, resolveIndex, counts);
    }
  }

  return toResult(filesProcessed, counts);
}

/**
 * List JSON files in a directory, optionally filtered by subject.
 *
 * @param dir - Directory path
 * @param subjectFilter - Optional list of subject slugs to include
 * @returns Array of absolute file paths
 */
async function listJsonFiles(dir: string, subjectFilter?: readonly string[]): Promise<string[]> {
  const { readdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const all = readdirSync(dir).filter((f) => f.endsWith('.json'));
  const filtered = subjectFilter?.length
    ? all.filter((f) => subjectFilter.some((s) => f.includes(s)))
    : all;
  return filtered.map((f) => join(dir, f));
}

/**
 * Read and parse a JSON file as an array of documents.
 *
 * @param path - File path
 * @returns Array of documents (empty if invalid)
 */
async function readJsonFile(path: string): Promise<readonly unknown[]> {
  const { readFileSync } = await import('node:fs');
  const data = readFileSync(path, 'utf-8');
  const parsed: unknown = JSON.parse(data);
  if (!Array.isArray(parsed)) {
    return [];
  }
  const items: unknown[] = parsed;
  return items;
}

/**
 * Classify documents, build bulk operations, and index to Elasticsearch.
 *
 * @param docs - Documents to ingest
 * @param client - Elasticsearch client
 * @param resolveIndex - Index name resolver
 * @param counts - Mutable counts object to update
 */
async function ingestDocs(
  docs: readonly unknown[],
  client: Client,
  resolveIndex: IndexResolverFn,
  counts: IngestCounts,
): Promise<void> {
  const operations: unknown[] = [];
  for (const doc of docs) {
    const entry = classifyDoc(doc, resolveIndex);
    if (!entry) {
      continue;
    }
    operations.push({ index: { _index: entry.index } });
    operations.push(doc);
    incrementCount(counts, entry.docType);
  }

  if (operations.length > 0) {
    const ndjson = operations.map((o) => JSON.stringify(o)).join('\n') + '\n';
    await client.transport.request(
      { method: 'POST', path: '/_bulk', body: ndjson },
      { headers: { 'content-type': 'application/x-ndjson' } },
    );
  }
}

/**
 * Classify a document by doc_type and resolve its target index.
 *
 * @param doc - Unknown document
 * @param resolveIndex - Index name resolver
 * @returns Index name and doc type, or undefined if unrecognised
 */
function classifyDoc(
  doc: unknown,
  resolveIndex: IndexResolverFn,
): { index: string; docType: string } | undefined {
  if (!isDocWithType(doc)) {
    return undefined;
  }
  const kind = DOC_TYPE_TO_KIND[doc.doc_type];
  if (!kind) {
    return undefined;
  }
  return { index: resolveIndex(kind), docType: doc.doc_type };
}

/**
 * Type guard: value has a doc_type string property.
 *
 * @param value - Value to check
 * @returns True if value is object with string doc_type
 */
function isDocWithType(value: unknown): value is { doc_type: string } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'doc_type' in value && typeof value.doc_type === 'string';
}

/** Return a fresh IngestCounts object with all zeros. */
function newCounts(): IngestCounts {
  return { lessons: 0, units: 0, rollupsIndexed: 0, threads: 0, sequences: 0, sequenceFacets: 0 };
}

/**
 * Increment the appropriate count for the given doc type.
 *
 * @param counts - Mutable counts object
 * @param docType - Document type (lesson, unit, etc.)
 */
function incrementCount(counts: IngestCounts, docType: string): void {
  if (docType === 'lesson') {
    counts.lessons++;
  } else if (docType === 'unit') {
    counts.units++;
  } else if (docType === 'unit_rollup') {
    counts.rollupsIndexed++;
  } else if (docType === 'thread') {
    counts.threads++;
  } else if (docType === 'sequence') {
    counts.sequences++;
  } else if (docType === 'sequence_facet') {
    counts.sequenceFacets++;
  }
}

/** Return an IngestResult with all zeros. */
function emptyResult(): IngestResult {
  return {
    filesProcessed: 0,
    lessonsIndexed: 0,
    unitsIndexed: 0,
    rollupsIndexed: 0,
    threadsIndexed: 0,
    sequencesIndexed: 0,
    sequenceFacetsIndexed: 0,
  };
}

/**
 * Build IngestResult from processed count and per-type counts.
 *
 * @param filesProcessed - Number of files processed
 * @param counts - Per-doc-type counts
 * @returns IngestResult
 */
function toResult(filesProcessed: number, counts: IngestCounts): IngestResult {
  return {
    filesProcessed,
    lessonsIndexed: counts.lessons,
    unitsIndexed: counts.units,
    rollupsIndexed: counts.rollupsIndexed,
    threadsIndexed: counts.threads,
    sequencesIndexed: counts.sequences,
    sequenceFacetsIndexed: counts.sequenceFacets,
  };
}
