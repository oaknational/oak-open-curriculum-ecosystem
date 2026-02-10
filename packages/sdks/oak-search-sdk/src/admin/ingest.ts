/**
 * Bulk ingestion — reads JSON files and indexes documents to Elasticsearch.
 *
 * @packageDocumentation
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import type { IngestOptions, IngestResult } from '../types/admin-types.js';
import type { IndexResolverFn, SearchIndexKind } from '../internal/index-resolver.js';

/** Map from doc_type to search index kind. */
const DOC_TYPE_TO_KIND: Readonly<Record<string, SearchIndexKind>> = {
  lesson: 'lessons',
  unit: 'units',
  unit_rollup: 'unit_rollup',
  thread: 'threads',
  sequence: 'sequences',
  sequence_facet: 'sequence_facets',
};

/** Counts for each document type ingested. */
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

async function listJsonFiles(dir: string, subjectFilter?: readonly string[]): Promise<string[]> {
  const { readdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const all = readdirSync(dir).filter((f) => f.endsWith('.json'));
  const filtered = subjectFilter?.length
    ? all.filter((f) => subjectFilter.some((s) => f.includes(s)))
    : all;
  return filtered.map((f) => join(dir, f));
}

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

function isDocWithType(value: unknown): value is { doc_type: string } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'doc_type' in value && typeof value.doc_type === 'string';
}

function newCounts(): IngestCounts {
  return { lessons: 0, units: 0, rollupsIndexed: 0, threads: 0, sequences: 0, sequenceFacets: 0 };
}

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
