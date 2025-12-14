/**
 * @module setup
 * @description Creates synonyms set and search indexes from SDK.
 * Mappings are generated at SDK type-gen time and imported here.
 */
import { z } from 'zod';
import { buildElasticsearchSynonyms } from '@oaknational/oak-curriculum-sdk/public/mcp-tools';
import {
  OAK_LESSONS_MAPPING,
  OAK_UNITS_MAPPING,
  OAK_UNIT_ROLLUP_MAPPING,
  OAK_SEQUENCES_MAPPING,
  OAK_SEQUENCE_FACETS_MAPPING,
  OAK_META_MAPPING,
} from '@oaknational/oak-curriculum-sdk/elasticsearch.js';
import { sandboxLogger } from '../../logger';

/** Index names and their corresponding SDK-generated mappings. */
const INDEX_MAPPINGS = [
  { indexName: 'oak_lessons', mapping: OAK_LESSONS_MAPPING },
  { indexName: 'oak_unit_rollup', mapping: OAK_UNIT_ROLLUP_MAPPING },
  { indexName: 'oak_units', mapping: OAK_UNITS_MAPPING },
  { indexName: 'oak_sequences', mapping: OAK_SEQUENCES_MAPPING },
  { indexName: 'oak_sequence_facets', mapping: OAK_SEQUENCE_FACETS_MAPPING },
  { indexName: 'oak_meta', mapping: OAK_META_MAPPING },
] as const;

const SYNONYM_SET_NAME = 'oak-syns';

type IndexMapping = (typeof INDEX_MAPPINGS)[number]['mapping'];

export interface SetupConfig {
  readonly elasticsearchUrl: string;
  readonly elasticsearchApiKey: string;
  readonly verbose?: boolean;
}

export interface SetupResult {
  readonly synonymsCreated: boolean;
  readonly synonymCount: number;
  readonly indexResults: readonly IndexResult[];
}

export interface IndexResult {
  readonly indexName: string;
  readonly status: 'created' | 'exists' | 'error';
  readonly httpStatus?: number;
  readonly error?: string;
}

function makeHeaders(apiKey: string): Record<string, string> {
  return { Authorization: `ApiKey ${apiKey}`, 'Content-Type': 'application/json' };
}

/** Generate Elasticsearch synonym set from SDK ontology data. */
export function generateSynonymsPayload(): { payload: string; count: number } {
  const synonyms = buildElasticsearchSynonyms();
  return { payload: JSON.stringify(synonyms), count: synonyms.synonyms_set.length };
}

/** Create or update the oak-syns synonym set. */
async function upsertSynonyms(config: SetupConfig): Promise<{ created: boolean; count: number }> {
  const { payload: synonymPayload, count } = generateSynonymsPayload();
  const url = `${config.elasticsearchUrl}/_synonyms/${SYNONYM_SET_NAME}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: makeHeaders(config.elasticsearchApiKey),
    body: synonymPayload,
  });

  if (!response.ok && response.status !== 200) {
    const text = await response.text();
    throw new Error(`Failed to upsert synonyms: ${response.status} ${text}`);
  }
  return { created: true, count };
}

/** Delete an Elasticsearch index. */
async function deleteIndex(config: SetupConfig, indexName: string): Promise<boolean> {
  const url = `${config.elasticsearchUrl}/${indexName}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: makeHeaders(config.elasticsearchApiKey),
  });
  return response.ok || response.status === 404;
}

/** Parse create index response to determine status. */
function parseCreateIndexResponse(
  indexName: string,
  status: number,
  responseText: string,
): IndexResult {
  if (status === 200) {
    return { indexName, status: 'created', httpStatus: 200 };
  }
  if (status === 400) {
    const parsed = safeJsonParse(responseText);
    const errorBody = CreateIndexErrorSchema.safeParse(parsed);
    if (errorBody.success && errorBody.data.error?.type === 'resource_already_exists_exception') {
      return { indexName, status: 'exists', httpStatus: 400 };
    }
  }
  return { indexName, status: 'error', httpStatus: status, error: responseText };
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const CreateIndexErrorSchema = z.object({
  error: z
    .object({
      type: z.string().optional(),
    })
    .optional(),
});

/** Create a single Elasticsearch index. */
async function createIndex(
  config: SetupConfig,
  indexName: string,
  mapping: IndexMapping,
): Promise<IndexResult> {
  const url = `${config.elasticsearchUrl}/${indexName}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: makeHeaders(config.elasticsearchApiKey),
    body: JSON.stringify(mapping),
  });
  const responseText = await response.text();
  return parseCreateIndexResponse(indexName, response.status, responseText);
}

/** Run full Elasticsearch setup: synonyms + all indexes. */
export async function runSetup(config: SetupConfig): Promise<SetupResult> {
  if (config.verbose) {
    sandboxLogger.debug('Generating synonyms from SDK ontology');
  }
  const { created: synonymsCreated, count: synonymCount } = await upsertSynonyms(config);
  if (config.verbose) {
    sandboxLogger.debug('Synonyms upserted', { count: synonymCount, set: SYNONYM_SET_NAME });
  }

  const indexResults: IndexResult[] = [];
  for (const { indexName, mapping } of INDEX_MAPPINGS) {
    const result = await createIndex(config, indexName, mapping);
    indexResults.push(result);
    if (config.verbose) {
      sandboxLogger.debug('Index operation', { index: indexName, status: result.status });
    }
  }
  return { synonymsCreated, synonymCount, indexResults };
}

/** Delete all indexes and recreate them with fresh mappings. */
export async function runReset(config: SetupConfig): Promise<SetupResult> {
  if (config.verbose) {
    sandboxLogger.debug('Deleting existing indexes');
  }
  for (const { indexName } of INDEX_MAPPINGS) {
    const deleted = await deleteIndex(config, indexName);
    if (config.verbose) {
      sandboxLogger.debug('Index deleted', { index: indexName, deleted });
    }
  }
  return runSetup(config);
}

/** Verify Elasticsearch connection by fetching cluster info. */
export async function verifyConnection(config: SetupConfig): Promise<{
  connected: boolean;
  clusterName?: string;
  version?: string;
  error?: string;
}> {
  try {
    const response = await fetch(config.elasticsearchUrl, {
      method: 'GET',
      headers: makeHeaders(config.elasticsearchApiKey),
    });
    if (!response.ok) {
      const text = await response.text();
      return { connected: false, error: `${response.status}: ${text}` };
    }
    const raw: unknown = await response.json();
    const data = ClusterInfoSchema.parse(raw);
    return { connected: true, clusterName: data.cluster_name, version: data.version?.number };
  } catch (error) {
    return { connected: false, error: error instanceof Error ? error.message : String(error) };
  }
}

const ClusterInfoSchema = z.object({
  cluster_name: z.string().optional(),
  version: z
    .object({
      number: z.string().optional(),
    })
    .optional(),
});

/** List current indexes and their document counts. */
export async function listIndexes(
  config: SetupConfig,
): Promise<
  readonly { readonly index: string; readonly health: string; readonly docsCount: number }[]
> {
  const url = `${config.elasticsearchUrl}/_cat/indices?format=json`;
  const response = await fetch(url, {
    method: 'GET',
    headers: makeHeaders(config.elasticsearchApiKey),
  });
  if (!response.ok) {
    throw new Error(`Failed to list indexes: ${response.status}`);
  }
  const raw: unknown = await response.json();
  const data = CatIndicesSchema.parse(raw);
  return data.map((idx) => ({
    index: idx.index,
    health: idx.health,
    docsCount: parseInt(idx['docs.count'], 10) || 0,
  }));
}

const CatIndicesSchema = z.array(
  z.object({
    index: z.string(),
    health: z.string(),
    'docs.count': z.string(),
  }),
);
