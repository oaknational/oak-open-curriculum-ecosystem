import { errors, type Client, type estypes } from '@elastic/elasticsearch';
import type { Result } from '@oaknational/result';
import { ok, err } from '@oaknational/result';
import type { IndexMetaError } from './index-meta-types.js';
import { OAK_META_MAPPING } from '@oaknational/sdk-codegen/search';
import { adminLogger } from '../logger';

function hasRequiredMappingProperties(
  properties: estypes.MappingTypeMapping['properties'] | undefined,
): boolean {
  if (properties === undefined) {
    return false;
  }
  return (
    properties.version !== undefined &&
    properties.ingested_at !== undefined &&
    properties.subjects !== undefined &&
    properties.key_stages !== undefined &&
    properties.duration_ms !== undefined &&
    properties.doc_counts !== undefined &&
    properties.previous_version !== undefined
  );
}

function mappingType(property: unknown): string | undefined {
  if (typeof property !== 'object' || property === null) {
    return undefined;
  }
  if (!('type' in property) || typeof property.type !== 'string') {
    return undefined;
  }
  return property.type;
}

function propertyEnabled(property: unknown): boolean | undefined {
  if (typeof property !== 'object' || property === null) {
    return undefined;
  }
  if (!('enabled' in property) || typeof property.enabled !== 'boolean') {
    return undefined;
  }
  return property.enabled;
}

function propertyNormalizer(property: unknown): string | undefined {
  if (typeof property !== 'object' || property === null) {
    return undefined;
  }
  if (!('normalizer' in property) || typeof property.normalizer !== 'string') {
    return undefined;
  }
  return property.normalizer;
}

function hasExpectedTopLevel(mapping: estypes.MappingTypeMapping): boolean {
  if (mapping.dynamic !== OAK_META_MAPPING.mappings.dynamic) {
    return false;
  }
  return hasRequiredMappingProperties(mapping.properties);
}

function hasExpectedTypeContracts(
  properties: NonNullable<estypes.MappingTypeMapping['properties']>,
): boolean {
  const expected = OAK_META_MAPPING.mappings.properties;
  const checks = [
    mappingType(properties.version) === expected.version.type,
    mappingType(properties.ingested_at) === expected.ingested_at.type,
    mappingType(properties.subjects) === expected.subjects.type,
    mappingType(properties.key_stages) === expected.key_stages.type,
    mappingType(properties.duration_ms) === expected.duration_ms.type,
    mappingType(properties.doc_counts) === expected.doc_counts.type,
    propertyEnabled(properties.doc_counts) === expected.doc_counts.enabled,
    mappingType(properties.previous_version) === expected.previous_version.type,
    propertyNormalizer(properties.previous_version) === expected.previous_version.normalizer,
  ];
  return checks.every((check) => check);
}

function hasStrictMappingContract(mapping: estypes.MappingTypeMapping | undefined): boolean {
  if (mapping === undefined) {
    return false;
  }
  if (!hasExpectedTopLevel(mapping)) {
    return false;
  }
  const properties = mapping.properties;
  if (properties === undefined) {
    return false;
  }
  return hasExpectedTypeContracts(properties);
}

function toIndexMetaError(error: unknown): IndexMetaError {
  if (error instanceof errors.ResponseError && error.statusCode === 404) {
    return {
      type: 'not_found',
      message: 'Index metadata mapping index was not found.',
    };
  }
  if (
    error instanceof errors.ResponseError &&
    error.statusCode !== undefined &&
    error.statusCode >= 500
  ) {
    return {
      type: 'network_error',
      message: `Elasticsearch network error (${error.statusCode}): ${error.message}`,
    };
  }
  return { type: 'unknown', message: error instanceof Error ? error.message : String(error) };
}

/**
 * Verify that the index metadata mapping includes all required contract fields.
 *
 * @param client - Elasticsearch client
 * @param indexName - Metadata index to validate
 * @returns `ok(void)` when mapping satisfies the contract; otherwise an `IndexMetaError`
 */
export async function ensureIndexMetaMappingContract(
  client: Client,
  indexName: string,
): Promise<Result<void, IndexMetaError>> {
  adminLogger.debug('Validating index metadata mapping contract', { indexName });
  try {
    const mappingResponse = await client.indices.getMapping({ index: indexName });
    const mapping = mappingResponse[indexName]?.mappings;
    if (!hasStrictMappingContract(mapping)) {
      return err({
        type: 'mapping_error',
        field: `${indexName}.mappings`,
        message:
          `${indexName} mapping contract does not match required generated constraints. ` +
          'Expected strict dynamic mapping plus generated field types for metadata.',
      });
    }
    return ok(undefined);
  } catch (error: unknown) {
    return err(toIndexMetaError(error));
  }
}
