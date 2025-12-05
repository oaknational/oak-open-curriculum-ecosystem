/** Creates synonyms set and search indexes from SDK ontology. Mappings in ../definitions/. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildElasticsearchSynonyms } from '@oaknational/oak-curriculum-sdk/public/mcp-tools';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFINITIONS_DIR = join(CURRENT_DIR, '..', 'definitions');

/** Index names and their corresponding mapping file names */
const INDEX_MAPPINGS = [
  { indexName: 'oak_lessons', mappingFile: 'oak-lessons.json' },
  { indexName: 'oak_unit_rollup', mappingFile: 'oak-unit-rollup.json' },
  { indexName: 'oak_units', mappingFile: 'oak-units.json' },
  { indexName: 'oak_sequences', mappingFile: 'oak-sequences.json' },
  { indexName: 'oak_sequence_facets', mappingFile: 'oak-sequence-facets.json' },
  { indexName: 'oak_meta', mappingFile: 'oak-meta.json' },
] as const;

const SYNONYM_SET_NAME = 'oak-syns';

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
  return {
    Authorization: `ApiKey ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Generate Elasticsearch synonym set from SDK ontology data.
 */
export function generateSynonymsPayload(): string {
  const synonymSet = buildElasticsearchSynonyms();
  return JSON.stringify(synonymSet);
}

/**
 * Create or update the oak-syns synonym set.
 */
async function upsertSynonyms(config: SetupConfig): Promise<{ created: boolean; count: number }> {
  const synonymPayload = generateSynonymsPayload();
  const synonymData = JSON.parse(synonymPayload) as { synonyms_set: unknown[] };

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

  return { created: true, count: synonymData.synonyms_set.length };
}

/**
 * Read index mapping from JSON file.
 */
function readMappingFile(mappingFile: string): string {
  const path = join(DEFINITIONS_DIR, mappingFile);
  return readFileSync(path, 'utf-8');
}

/**
 * Create a single Elasticsearch index.
 */
async function createIndex(
  config: SetupConfig,
  indexName: string,
  mappingFile: string,
): Promise<IndexResult> {
  const url = `${config.elasticsearchUrl}/${indexName}`;
  const body = readMappingFile(mappingFile);

  const response = await fetch(url, {
    method: 'PUT',
    headers: makeHeaders(config.elasticsearchApiKey),
    body,
  });

  const responseText = await response.text();

  if (response.status === 200) {
    return { indexName, status: 'created', httpStatus: 200 };
  }

  // Check if index already exists (400 with resource_already_exists_exception)
  if (response.status === 400) {
    try {
      const errorBody = JSON.parse(responseText) as {
        error?: { type?: string };
      };
      if (errorBody.error?.type === 'resource_already_exists_exception') {
        return { indexName, status: 'exists', httpStatus: 400 };
      }
    } catch {
      // Not JSON, fall through to error
    }
  }

  return {
    indexName,
    status: 'error',
    httpStatus: response.status,
    error: responseText,
  };
}

/**
 * Run full Elasticsearch setup: synonyms + all indexes.
 */
export async function runSetup(config: SetupConfig): Promise<SetupResult> {
  if (config.verbose) {
    console.log('Generating synonyms from SDK ontology...');
  }

  const { created: synonymsCreated, count: synonymCount } = await upsertSynonyms(config);

  if (config.verbose) {
    console.log(`Synonyms: ${synonymCount} entries upserted to ${SYNONYM_SET_NAME}`);
    console.log('Creating indexes...');
  }

  const indexResults: IndexResult[] = [];

  for (const { indexName, mappingFile } of INDEX_MAPPINGS) {
    const result = await createIndex(config, indexName, mappingFile);
    indexResults.push(result);

    if (config.verbose) {
      const statusStr =
        result.status === 'created'
          ? '✓ created'
          : result.status === 'exists'
            ? '○ exists'
            : `✗ error: ${result.error}`;
      console.log(`  ${indexName}: ${statusStr}`);
    }
  }

  if (config.verbose) {
    console.log('Setup complete.');
  }

  return { synonymsCreated, synonymCount, indexResults };
}

/**
 * Verify Elasticsearch connection by fetching cluster info.
 */
export async function verifyConnection(config: SetupConfig): Promise<{
  connected: boolean;
  clusterName?: string;
  version?: string;
  error?: string;
}> {
  const url = config.elasticsearchUrl;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: makeHeaders(config.elasticsearchApiKey),
    });

    if (!response.ok) {
      const text = await response.text();
      return { connected: false, error: `${response.status}: ${text}` };
    }

    const data = (await response.json()) as {
      cluster_name?: string;
      version?: { number?: string };
    };

    return {
      connected: true,
      clusterName: data.cluster_name,
      version: data.version?.number,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * List current indexes and their document counts.
 */
export async function listIndexes(config: SetupConfig): Promise<
  readonly {
    readonly index: string;
    readonly health: string;
    readonly docsCount: number;
  }[]
> {
  const url = `${config.elasticsearchUrl}/_cat/indices?format=json`;

  const response = await fetch(url, {
    method: 'GET',
    headers: makeHeaders(config.elasticsearchApiKey),
  });

  if (!response.ok) {
    throw new Error(`Failed to list indexes: ${response.status}`);
  }

  const data = (await response.json()) as readonly {
    readonly index: string;
    readonly health: string;
    readonly 'docs.count': string;
  }[];

  return data.map((idx) => ({
    index: idx.index,
    health: idx.health,
    docsCount: parseInt(idx['docs.count'], 10) || 0,
  }));
}
