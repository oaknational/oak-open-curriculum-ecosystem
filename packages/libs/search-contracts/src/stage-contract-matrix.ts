import { SEARCH_FIELD_INVENTORY, type FieldInventoryEntry } from './field-inventory.js';

/**
 * Ingest stages represented in the shared field-integrity matrix.
 */
export const INGEST_STAGES = [
  'source_extraction',
  'document_builder_mapping',
  'bulk_operation_assembly',
  'ingest_dispatch_readback',
] as const;

/**
 * Retrieval stages represented in the shared field-integrity matrix.
 */
export const RETRIEVAL_STAGES = ['retrieval_query_usage'] as const;

export interface StageContractEntry {
  readonly indexFamily: FieldInventoryEntry['indexFamily'];
  readonly fieldName: string;
  readonly fieldGroup: FieldInventoryEntry['fieldGroup'];
  readonly semantics: FieldInventoryEntry['semantics'];
  readonly stage: (typeof INGEST_STAGES)[number] | (typeof RETRIEVAL_STAGES)[number];
  readonly producerOwner: string;
  readonly consumerOwner: string;
}

function createIngestStageEntries(field: FieldInventoryEntry): readonly StageContractEntry[] {
  return [
    {
      indexFamily: field.indexFamily,
      fieldName: field.fieldName,
      fieldGroup: field.fieldGroup,
      semantics: field.semantics,
      stage: 'source_extraction',
      producerOwner: 'apps/oak-search-cli/src/adapters/oak-adapter*',
      consumerOwner: 'apps/oak-search-cli/src/lib/indexing/*',
    },
    {
      indexFamily: field.indexFamily,
      fieldName: field.fieldName,
      fieldGroup: field.fieldGroup,
      semantics: field.semantics,
      stage: 'document_builder_mapping',
      producerOwner: 'apps/oak-search-cli/src/lib/indexing/*document*',
      consumerOwner: 'apps/oak-search-cli/src/lib/indexing/*',
    },
    {
      indexFamily: field.indexFamily,
      fieldName: field.fieldName,
      fieldGroup: field.fieldGroup,
      semantics: field.semantics,
      stage: 'bulk_operation_assembly',
      producerOwner: 'apps/oak-search-cli/src/adapters/bulk-*-transformer*',
      consumerOwner: 'apps/oak-search-cli/src/lib/indexing/index-batch-*',
    },
    {
      indexFamily: field.indexFamily,
      fieldName: field.fieldName,
      fieldGroup: field.fieldGroup,
      semantics: field.semantics,
      stage: 'ingest_dispatch_readback',
      producerOwner: 'apps/oak-search-cli/src/lib/indexing/ingest-harness-*',
      consumerOwner: 'apps/oak-search-cli/operations/ingestion/*',
    },
  ];
}

function createRetrievalStageEntries(field: FieldInventoryEntry): readonly StageContractEntry[] {
  return [
    {
      indexFamily: field.indexFamily,
      fieldName: field.fieldName,
      fieldGroup: field.fieldGroup,
      semantics: field.semantics,
      stage: 'retrieval_query_usage',
      producerOwner: 'packages/sdks/oak-search-sdk/src/retrieval/*',
      consumerOwner: 'packages/sdks/oak-search-sdk/src/retrieval/*',
    },
  ];
}

function createStageContractMatrixEntries(): readonly StageContractEntry[] {
  const entries: StageContractEntry[] = [];
  for (const field of SEARCH_FIELD_INVENTORY) {
    entries.push(...createIngestStageEntries(field));
    entries.push(...createRetrievalStageEntries(field));
  }
  return entries;
}

export const STAGE_CONTRACT_MATRIX = createStageContractMatrixEntries();
