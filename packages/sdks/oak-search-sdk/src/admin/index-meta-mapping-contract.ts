import type { Client, estypes } from '@elastic/elasticsearch';
import { errors } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';
import { OAK_META_MAPPING } from '@oaknational/sdk-codegen/search';
import type { AdminError } from '../types/admin-types.js';

function mappingType(property: unknown): string | undefined {
  if (typeof property !== 'object' || property === null || !('type' in property)) {
    return undefined;
  }
  return typeof property.type === 'string' ? property.type : undefined;
}

function mappingEnabled(property: unknown): boolean | undefined {
  if (typeof property !== 'object' || property === null || !('enabled' in property)) {
    return undefined;
  }
  return typeof property.enabled === 'boolean' ? property.enabled : undefined;
}

function mappingNormalizer(property: unknown): string | undefined {
  if (typeof property !== 'object' || property === null || !('normalizer' in property)) {
    return undefined;
  }
  return typeof property.normalizer === 'string' ? property.normalizer : undefined;
}

function hasExpectedTopLevel(mapping: estypes.MappingTypeMapping): boolean {
  const properties = mapping.properties;
  const checks = [
    mapping.dynamic === OAK_META_MAPPING.mappings.dynamic,
    properties !== undefined,
    properties?.version !== undefined,
    properties?.ingested_at !== undefined,
    properties?.subjects !== undefined,
    properties?.key_stages !== undefined,
    properties?.duration_ms !== undefined,
    properties?.doc_counts !== undefined,
    properties?.previous_version !== undefined,
  ];
  return checks.every((check) => check);
}

function hasExpectedPropertyContracts(mapping: estypes.MappingTypeMapping): boolean {
  const properties = mapping.properties;
  if (properties === undefined) {
    return false;
  }
  const expected = OAK_META_MAPPING.mappings.properties;
  const checks = [
    mappingType(properties.version) === expected.version.type,
    mappingType(properties.ingested_at) === expected.ingested_at.type,
    mappingType(properties.subjects) === expected.subjects.type,
    mappingType(properties.key_stages) === expected.key_stages.type,
    mappingType(properties.duration_ms) === expected.duration_ms.type,
    mappingType(properties.doc_counts) === expected.doc_counts.type,
    mappingEnabled(properties.doc_counts) === expected.doc_counts.enabled,
    mappingType(properties.previous_version) === expected.previous_version.type,
    mappingNormalizer(properties.previous_version) === expected.previous_version.normalizer,
  ];
  return checks.every((check) => check);
}

function mappingErrorFromException(error: unknown): AdminError {
  if (error instanceof errors.ResponseError && error.statusCode === 404) {
    return { type: 'not_found', message: 'Index metadata mapping index was not found.' };
  }
  if (error instanceof errors.ResponseError) {
    return {
      type: 'es_error',
      message: `Failed to read metadata mapping: ${error.message}`,
      statusCode: error.statusCode,
    };
  }
  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : String(error),
  };
}

export async function ensureIndexMetaMappingContract(
  client: Client,
  indexName: string,
  logger?: Logger,
): Promise<Result<void, AdminError>> {
  logger?.debug('Checking index metadata mapping contract', { indexName });
  try {
    const response = await client.indices.getMapping({ index: indexName });
    const mapping = response[indexName]?.mappings;
    if (
      mapping === undefined ||
      !hasExpectedTopLevel(mapping) ||
      !hasExpectedPropertyContracts(mapping)
    ) {
      return err({
        type: 'mapping_error',
        field: `${indexName}.mappings`,
        message:
          `${indexName} mapping contract does not match generated constraints. ` +
          'Expected strict dynamic mapping and generated metadata field contracts.',
      });
    }
    return ok(undefined);
  } catch (error: unknown) {
    return err(mappingErrorFromException(error));
  }
}
