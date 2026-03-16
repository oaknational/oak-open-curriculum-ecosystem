import type { Client } from '@elastic/elasticsearch';
import { typeSafeKeys } from '@oaknational/type-helpers';
import { withTransientRetry } from './field-readback-audit-retry.js';
import type { MappingProperties, ReadbackAuditDependencies } from './field-readback-audit-types.js';

const TRANSIENT_READ_RETRY_ATTEMPTS = 3;
const TRANSIENT_READ_RETRY_INTERVAL_MS = 1000;

async function sleep(ms: number): Promise<void> {
  await new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
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
 * @returns Dependency implementation used by `runFieldReadbackAudit`.
 */
export function createElasticsearchDeps(client: Client): ReadbackAuditDependencies {
  return {
    async resolveAlias(alias: string): Promise<string> {
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
