/**
 * Ingestion harness for Elasticsearch.
 *
 * Provides a unified interface for preparing and dispatching bulk operations
 * to Elasticsearch, with support for batch-atomic commits and observable progress.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter';
import {
  currentSearchIndexTarget,
  rewriteBulkOperations,
  type SearchIndexKind,
  type SearchIndexTarget,
} from '../search-index-target';
import { ingestLogger } from '../logger';
import { esClient } from '../es-client';
import { createFixtureOakClient } from './sandbox-fixture';
import { summariseOperations, type EsTransport } from './ingest-harness-ops';
import { createDataIntegrityCollector, type DataIntegrityReport } from './data-integrity-report';
import { filterOperationsByIndex } from './ingest-harness-filtering';
import {
  createSequenceFacetMetricsCollector,
  type IngestBulkMetrics,
} from './ingest-harness-metrics';
import type { BulkOperations } from './bulk-operation-types';
import { generateIndexBatches, type BatchGranularity } from '../index-batch-generator';
import {
  runBatchIngestion,
  mergeDataIntegrityReport,
  type BatchIngestionContext,
} from './ingest-harness-batch';

// ============================================================================
// Types
// ============================================================================

/** Options for creating an ingestion harness. */
interface IngestHarnessOptions {
  readonly fixtureRoot?: string;
  readonly client?: OakClient;
  readonly keyStages?: readonly KeyStage[];
  readonly subjects?: readonly SearchSubjectSlug[];
  readonly indexes?: readonly SearchIndexKind[];
  readonly target?: SearchIndexTarget;
  readonly es?: EsTransport;
  readonly esClient?: Client;
  readonly logger?: Logger;
  /** Batch granularity. Defaults to `{ kind: 'subject-keystage' }`. */
  readonly granularity?: BatchGranularity;
}

/** Summary of bulk operations by index. */
interface IngestBulkSummary {
  readonly target: SearchIndexTarget;
  readonly totalDocs: number;
  readonly counts: Record<SearchIndexKind, number>;
}

/** Result of bulk operation preparation or ingestion. */
interface IngestBulkResult {
  readonly operations: BulkOperations;
  readonly summary: IngestBulkSummary;
  readonly metrics?: IngestBulkMetrics;
  readonly dataIntegrityReport?: DataIntegrityReport;
}

/** Options for the ingest method. */
interface IngestOptions {
  readonly dryRun?: boolean;
  readonly verbose?: boolean;
}

/** Ingestion harness interface. */
export interface IngestHarness {
  prepareBulkOperations(): Promise<IngestBulkResult>;
  ingest(options?: IngestOptions): Promise<IngestBulkResult>;
}

// ============================================================================
// Harness Factory
// ============================================================================

/** Builds an ingestion harness configured for the desired search index target. */
export async function createIngestHarness(options: IngestHarnessOptions): Promise<IngestHarness> {
  const target = options.target ?? currentSearchIndexTarget();
  const logger = options.logger ?? ingestLogger;
  const { client, keyStages, subjects } = await resolveHarnessInputs(options);
  const indexes = options.indexes ?? [];
  const es = resolveEsTransport(options.es, options.esClient);
  const granularity = options.granularity ?? { kind: 'subject-keystage' };

  const context: BatchIngestionContext = {
    client,
    keyStages,
    subjects,
    indexes,
    target,
    es,
    logger,
    granularity,
  };

  const prepare = () => prepareOperations(context);
  const ingest = (ingestOptions?: IngestOptions) => runBatchIngestion(context, ingestOptions);

  return { prepareBulkOperations: prepare, ingest };
}

// ============================================================================
// Input Resolution
// ============================================================================

async function resolveHarnessInputs(options: IngestHarnessOptions): Promise<{
  client: OakClient;
  keyStages: readonly KeyStage[];
  subjects: readonly SearchSubjectSlug[];
}> {
  if (options.client) {
    return resolveProvidedClient(options);
  }
  return resolveFixtureBackedClient(options);
}

function resolveProvidedClient(options: IngestHarnessOptions): {
  client: OakClient;
  keyStages: readonly KeyStage[];
  subjects: readonly SearchSubjectSlug[];
} {
  const keyStages = ensureNonEmptyList(
    options.keyStages,
    'Provide key stages when supplying a custom Oak client.',
  );
  const subjects = ensureNonEmptyList(
    options.subjects,
    'Provide subjects when supplying a custom Oak client.',
  );
  const client = options.client;
  if (!client) {
    throw new Error('Custom Oak client is required when key stages/subjects are provided.');
  }
  return { client, keyStages, subjects };
}

async function resolveFixtureBackedClient(options: IngestHarnessOptions): Promise<{
  client: OakClient;
  keyStages: readonly KeyStage[];
  subjects: readonly SearchSubjectSlug[];
}> {
  if (!options.fixtureRoot) {
    throw new Error('fixtureRoot is required when client is not provided.');
  }
  const fixture = await createFixtureOakClient(options.fixtureRoot);
  const keyStages = ensureNonEmptyList(
    options.keyStages ?? fixture.data.keyStages,
    'Fixtures must provide at least one key stage.',
  );
  const subjects = ensureNonEmptyList(
    options.subjects ?? fixture.data.subjects,
    'Fixtures must provide at least one subject.',
  );
  return { client: fixture.client, keyStages, subjects };
}

function ensureNonEmptyList<T>(value: readonly T[] | undefined, message: string): readonly T[] {
  if (!value || value.length === 0) {
    throw new Error(message);
  }
  return value;
}

function resolveEsTransport(es?: EsTransport, providedClient?: Client): EsTransport {
  if (es) {
    return es;
  }
  const client = providedClient ?? esClient();
  return { transport: client.transport };
}

// ============================================================================
// Prepare Operations (collect all batches without dispatch)
// ============================================================================

async function prepareOperations(context: BatchIngestionContext): Promise<IngestBulkResult> {
  const metricsCollector = createSequenceFacetMetricsCollector();
  const allOps: BulkOperations = [];
  const dataIntegrityReport = createDataIntegrityCollector();

  for await (const batch of generateIndexBatches({
    client: context.client,
    subjects: context.subjects,
    keyStages: context.keyStages,
    indexes: context.indexes,
    granularity: context.granularity,
    onSequenceFacetProcessed: metricsCollector.record,
  })) {
    allOps.push(...batch.operations);
    if (batch.kind === 'curriculum') {
      mergeDataIntegrityReport(dataIntegrityReport, batch.dataIntegrityReport);
    }
  }

  const targetedOps = rewriteBulkOperations(allOps, context.target);
  const filteredOps = filterOperationsByIndex(targetedOps, context.indexes);
  const summary = summariseOperations(filteredOps, context.target);

  return {
    operations: filteredOps,
    summary,
    metrics: metricsCollector.snapshot(),
    dataIntegrityReport,
  };
}
