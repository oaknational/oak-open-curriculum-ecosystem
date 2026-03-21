import type { Client } from '@elastic/elasticsearch';
import {
  BASE_INDEX_NAMES,
  SEARCH_INDEX_TARGETS,
  resolveAliasName,
  resolveVersionedIndexName,
} from '@oaknational/oak-search-sdk/admin';
import { typeSafeKeys } from '@oaknational/type-helpers';
import { withTransientRetry } from './field-readback-audit-retry.js';
import type { MappingProperties, ReadbackAuditDependencies } from './field-readback-audit-types.js';

const TRANSIENT_READ_RETRY_ATTEMPTS = 3;
const TRANSIENT_READ_RETRY_INTERVAL_MS = 1000;

async function sleep(ms: number): Promise<void> {
  await new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function resolveVersionedReadbackIndex(alias: string, targetVersion: string): string {
  for (const kind of typeSafeKeys(BASE_INDEX_NAMES)) {
    const base = BASE_INDEX_NAMES[kind];
    for (const target of SEARCH_INDEX_TARGETS) {
      if (resolveAliasName(base, target) === alias) {
        return resolveVersionedIndexName(base, target, targetVersion);
      }
    }
  }

  throw new Error(`Unknown readback alias: ${alias}`);
}

/**
 * Resolve the concrete index name to audit.
 *
 * When `targetVersion` is supplied, read directly from the staged physical
 * index rather than the live alias target.
 */
export function resolveReadbackIndexName(alias: string, targetVersion?: string): string {
  if (targetVersion === undefined) {
    return alias;
  }
  return resolveVersionedReadbackIndex(alias, targetVersion);
}

async function resolveAliasWithRetry(client: Client, alias: string): Promise<string> {
  const aliasResult = await withTransientRetry(
    async () => client.indices.getAlias({ name: alias }),
    TRANSIENT_READ_RETRY_ATTEMPTS,
    TRANSIENT_READ_RETRY_INTERVAL_MS,
    sleep,
  );
  const indexNames = typeSafeKeys(aliasResult);
  if (indexNames.length !== 1) {
    throw new Error(
      `Alias must resolve to exactly one index: ${alias} -> [${indexNames.join(', ')}]`,
    );
  }
  const resolvedIndex = indexNames[0];
  if (resolvedIndex === undefined) {
    throw new Error(`Alias did not resolve to any index: ${alias}`);
  }
  return resolvedIndex;
}

async function getMappingPropertiesWithRetry(
  client: Client,
  resolvedIndex: string,
): Promise<MappingProperties> {
  const mappingResult = await withTransientRetry(
    async () => client.indices.getMapping({ index: resolvedIndex }),
    TRANSIENT_READ_RETRY_ATTEMPTS,
    TRANSIENT_READ_RETRY_INTERVAL_MS,
    sleep,
  );
  const mappingRoot = mappingResult[resolvedIndex];
  if (!mappingRoot) {
    throw new Error(`Missing mapping root for index: ${resolvedIndex}`);
  }
  const properties = mappingRoot.mappings?.properties;
  if (!properties || typeof properties !== 'object') {
    throw new Error(`Missing mapping properties for index: ${resolvedIndex}`);
  }
  return properties;
}

/**
 * Creates Elasticsearch-backed dependencies for the field readback audit.
 *
 * @param client - Elasticsearch client for alias, mapping, and count queries.
 * @param targetVersion - Optional staged version to read directly instead of resolving aliases.
 * @returns Dependency implementation used by `runFieldReadbackAudit`.
 */
export function createElasticsearchDeps(
  client: Client,
  targetVersion?: string,
): ReadbackAuditDependencies {
  return {
    async resolveAlias(alias: string): Promise<string> {
      const resolvedIndex = resolveReadbackIndexName(alias, targetVersion);
      if (resolvedIndex !== alias) {
        return resolvedIndex;
      }
      return resolveAliasWithRetry(client, alias);
    },
    async getMappingProperties(resolvedIndex: string): Promise<MappingProperties> {
      return getMappingPropertiesWithRetry(client, resolvedIndex);
    },
    async getExistsCount(indexName: string, fieldName: string): Promise<number> {
      const result = await client.count({
        index: indexName,
        query: { exists: { field: fieldName } },
      });
      return result.count;
    },
    async getMissingCount(indexName: string, fieldName: string): Promise<number> {
      const result = await client.count({
        index: indexName,
        query: { bool: { must_not: [{ exists: { field: fieldName } }] } },
      });
      return result.count;
    },
    sleep,
  };
}
