import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { OakClient } from '../../adapters/oak-adapter-sdk';
import { buildIndexBulkOps } from '../index-oak';
import {
  currentSearchIndexTarget,
  rewriteBulkOperations,
  type SearchIndexKind,
  type SearchIndexTarget,
} from '../search-index-target';
import { sandboxLogger } from '../logger';
import { esClient } from '../es-client';
import { createFixtureOakClient } from './sandbox-fixture';
import { dispatchBulk, logPreview, logSummary, summariseOperations } from './sandbox-harness-ops';

interface SandboxHarnessOptions {
  readonly fixtureRoot?: string;
  readonly client?: OakClient;
  readonly keyStages?: readonly KeyStage[];
  readonly subjects?: readonly SearchSubjectSlug[];
  readonly target?: SearchIndexTarget;
  readonly es?: Pick<Client, 'transport'>;
  readonly logger?: Logger;
}

interface HarnessContext {
  readonly client: OakClient;
  readonly keyStages: readonly KeyStage[];
  readonly subjects: readonly SearchSubjectSlug[];
  readonly target: SearchIndexTarget;
  readonly es: Pick<Client, 'transport'>;
  readonly logger: Logger;
}

interface SandboxBulkSummary {
  readonly target: SearchIndexTarget;
  readonly totalDocs: number;
  readonly counts: Record<SearchIndexKind, number>;
}

interface SandboxBulkResult {
  readonly operations: unknown[];
  readonly summary: SandboxBulkSummary;
}

interface IngestOptions {
  readonly dryRun?: boolean;
  readonly verbose?: boolean;
}

export interface SandboxHarness {
  prepareBulkOperations(): Promise<SandboxBulkResult>;
  ingest(options?: IngestOptions): Promise<SandboxBulkResult>;
}

/**
 * Builds a sandbox ingestion harness configured for the desired search index target.
 */
export async function createSandboxHarness(
  options: SandboxHarnessOptions,
): Promise<SandboxHarness> {
  const target = options.target ?? currentSearchIndexTarget();
  const logger = options.logger ?? sandboxLogger;
  const { client, keyStages, subjects } = await resolveHarnessInputs(options);
  const es = resolveTransport(options.es);
  const context: HarnessContext = { client, keyStages, subjects, target, es, logger };

  const prepare = () => prepareOperations(context);
  const ingest = (ingestOptions?: IngestOptions) =>
    ingestOperations(context, prepare, ingestOptions);

  return {
    prepareBulkOperations: prepare,
    ingest,
  };
}

async function resolveHarnessInputs(options: SandboxHarnessOptions): Promise<{
  client: OakClient;
  keyStages: readonly KeyStage[];
  subjects: readonly SearchSubjectSlug[];
}> {
  if (options.client) {
    return resolveProvidedClient(options);
  }
  return resolveFixtureBackedClient(options);
}

function resolveProvidedClient(options: SandboxHarnessOptions): {
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

async function resolveFixtureBackedClient(options: SandboxHarnessOptions): Promise<{
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
    'Sandbox fixtures must provide at least one key stage.',
  );
  const subjects = ensureNonEmptyList(
    options.subjects ?? fixture.data.subjects,
    'Sandbox fixtures must provide at least one subject.',
  );
  return { client: fixture.client, keyStages, subjects };
}

function ensureNonEmptyList<T>(value: readonly T[] | undefined, message: string): readonly T[] {
  if (!value || value.length === 0) {
    throw new Error(message);
  }
  return value;
}

function resolveTransport(es?: Pick<Client, 'transport'>): Pick<Client, 'transport'> {
  if (es) {
    return es;
  }
  const client = esClient();
  return { transport: client.transport };
}

async function prepareOperations(context: HarnessContext): Promise<SandboxBulkResult> {
  const bulkOps = await buildIndexBulkOps(context.client, context.keyStages, context.subjects);
  const targetedOps = rewriteBulkOperations(bulkOps, context.target);
  const summary = summariseOperations(targetedOps, context.target);
  return { operations: targetedOps, summary };
}

async function ingestOperations(
  context: HarnessContext,
  prepare: () => Promise<SandboxBulkResult>,
  options: IngestOptions = {},
): Promise<SandboxBulkResult> {
  const result = await prepare();
  const dryRun = options.dryRun ?? false;
  const verbose = options.verbose ?? false;

  logSummary(context.logger, 'sandbox.ingest.prepared', context.target, result.summary, dryRun);

  if (result.operations.length === 0 || dryRun) {
    if (verbose) {
      logPreview(context.logger, context.target, result.operations);
    }
    return result;
  }

  await dispatchBulk(context.es, result.operations);

  logSummary(context.logger, 'sandbox.ingest.completed', context.target, result.summary, false);

  if (verbose) {
    logPreview(context.logger, context.target, result.operations);
  }

  return result;
}
