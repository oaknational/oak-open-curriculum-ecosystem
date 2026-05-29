/**
 * Execution for `eef-explore-evidence-for-context` (gate-1a t6a).
 *
 * Loads the freshness-gated EEF corpus, selects the strands relevant to the
 * teacher's lesson context (`selectEefSeedIds`), runs a `subgraph` traversal
 * from those seeds, builds the structural citation envelope from the full
 * strands, and emits the topology as tight projected nodes. Selection narrows
 * for relevance and projection caps raw size, so the whole `CallToolResult`
 * stays within the MCP-client output budget. Relevance *ordering* among the
 * selected strands remains a gate-1b ranking concern; the model selects
 * contextual fit from the returned topology.
 *
 * Telemetry: an {@link EvidenceCorpusSpanConfig} is constructed inline and
 * handed to the optional `recordSpan` sink. Per `../../telemetry.ts`, the
 * Sentry runtime call is the consuming app's responsibility — this layer
 * ships the typed config and the injection seam.
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import type { Logger } from '@oaknational/logger';
import type { SubgraphResult } from '@oaknational/graph-core/graph-view';
import {
  loadEefCorpus,
  selectEefSeedIds,
  type EefStrand,
  type LoadEefCorpusError,
} from '@oaknational/graph-corpus-sdk/eef-strands';

import {
  formatError,
  formatToolResponse,
  resolveUniversalToolLogger,
  type UniversalToolExecutorDependencies,
} from '../../../universal-tool-shared.js';
import { EEF_ATTRIBUTION } from '../../../source-attribution.js';
import { CitationsSchema, type Citations } from '../../citation-shape.js';
import type { EvidenceCorpusSpanConfig, ExploreSpanAttrs } from '../../telemetry.js';
import { type EefExploreArgs } from './tool-definition.js';
import { validateEefExploreArgs } from './validation.js';
import { buildCitations } from './citations.js';
import { projectExploreNode, type ProjectedEefStrand } from './projection.js';
import { capForBudget, MAX_RESPONSE_STRANDS } from './response-budget.js';

/** Runtime dependencies for the explore tool. */
export interface EefExploreToolDeps {
  /** Reference time for the freshness gate. Inject a literal in tests. */
  readonly now: Date;
  /**
   * Optional telemetry sink. The tool constructs the span config regardless;
   * the consuming app injects a Sentry-backed sink (see module docstring).
   */
  readonly recordSpan?: (config: EvidenceCorpusSpanConfig<ExploreSpanAttrs>) => void;
  /** Optional structured logger; falls back to a no-op. */
  readonly logger?: Logger;
}

/**
 * Map a free-text key stage to the canonical telemetry phase. EYFS →
 * early_years; KS1/KS2 → primary; KS3/KS4/KS5 (and anything unrecognised) →
 * secondary, matching the prompt's KS-to-phase table (EEF coverage is
 * primarily up to age 16). This shapes the recorded telemetry phase; seed
 * selection matches the key stage separately against each strand's
 * `most_relevant_key_stages`.
 */
function keyStageToPhase(keyStage: string): ExploreSpanAttrs['phase'] {
  const normalised = keyStage.toLowerCase().replace(/\s+/g, '');
  if (normalised.includes('eyfs') || normalised.includes('early')) {
    return 'early_years';
  }
  if (normalised === 'ks1' || normalised === 'ks2') {
    return 'primary';
  }
  return 'secondary';
}

/** Map a corpus-load failure to a teacher-honest tool error. */
function formatLoadError(error: LoadEefCorpusError): CallToolResult {
  if (error.kind === 'stale-data') {
    return formatError(
      `The EEF evidence corpus is out of date (last updated ${String(error.ageDays)} days ago) and has been withheld to avoid surfacing stale evidence.`,
    );
  }
  return formatError('The EEF evidence corpus could not be loaded.');
}

/** Build the typed telemetry span for one explore call. */
function buildExploreSpan(
  args: EefExploreArgs,
  resultCount: number,
  latencyMs: number,
): EvidenceCorpusSpanConfig<ExploreSpanAttrs> {
  return {
    name: 'evidence_corpus.explore',
    attrs: {
      phase: keyStageToPhase(args.keyStage),
      subject: args.subject,
      key_stage: args.keyStage,
      ...(args.focus === undefined ? {} : { focus: args.focus }),
      result_count: resultCount,
      latency_ms: latencyMs,
    },
  };
}

/** The one-line response summary, disclosing a budget cap when one applied. */
function buildSummary(args: EefExploreArgs, shown: number, totalMatched: number): string {
  const context = `${args.subject} ${args.keyStage}: "${args.topic}"`;
  const caveatNote = 'Each carries evidence-strength and implementation caveats to preserve.';
  if (totalMatched > shown) {
    return `Found ${String(totalMatched)} EEF Toolkit strands for ${context}; showing the first ${String(shown)} (output-budget bounded). ${caveatNote}`;
  }
  return `Found ${String(shown)} EEF Toolkit strands for ${context}. ${caveatNote}`;
}

/** Format the success envelope: projected topology + structural citations. */
function formatExploreResponse(
  args: EefExploreArgs,
  nodes: readonly ProjectedEefStrand[],
  edges: SubgraphResult<EefStrand>['edges'],
  citations: Citations,
  totalMatched: number,
  dataVersion: string,
  lastUpdated: string,
): CallToolResult {
  return formatToolResponse({
    summary: buildSummary(args, nodes.length, totalMatched),
    data: {
      // Source attribution once per response (not per citation), per the
      // citation-shape contract. Surfaced in `data` (model-visible) rather
      // than the response `_meta`: the shared `formatToolResponse` does not
      // carry attribution in `_meta`, and extending it for a single consumer
      // would violate consolidate-at-third-consumer. The tool DEFINITION's
      // `_meta.attribution` carries it at registration/listing time.
      attribution: EEF_ATTRIBUTION,
      citations,
      nodes,
      edges,
      // Structured truncation signal: `nodes.length` strands are shown out of
      // `total_matched` selected — lets a consumer detect the output-budget cap
      // without parsing the summary prose.
      total_matched: totalMatched,
      data_version: dataVersion,
      last_updated: lastUpdated,
    },
    status: 'ok',
    toolName: 'eef-explore-evidence-for-context',
    annotationsTitle: 'Explore EEF Evidence for Context',
  });
}

/**
 * Execute the explore tool.
 *
 * @param args - Validated explore arguments.
 * @param deps - Runtime dependencies (reference time, telemetry sink, logger).
 */
export function runEefExploreTool(args: EefExploreArgs, deps: EefExploreToolDeps): CallToolResult {
  const logger = resolveUniversalToolLogger(deps);
  const startedAt = Date.now();

  const corpus = loadEefCorpus({ now: deps.now });
  if (!corpus.ok) {
    logger.debug('mcp-tool.eef-explore-evidence-for-context.load-failed', {
      kind: corpus.error.kind,
    });
    return formatLoadError(corpus.error);
  }

  const manifest = corpus.value.view.manifest();
  // `EefExploreArgs` is a valid `EefSeedSelectionContext` — its fields are the
  // selection inputs (subject, keyStage, topic, optional focus).
  const seedIds = selectEefSeedIds(corpus.value.strands, args);
  const subgraph = corpus.value.view.subgraph({ rootIds: seedIds, depth: 1 });
  if (!subgraph.ok) {
    logger.debug('mcp-tool.eef-explore-evidence-for-context.subgraph-failed', {
      kind: subgraph.error.kind,
    });
    return formatError(`EEF subgraph traversal failed (${subgraph.error.kind}).`);
  }

  const capped = capForBudget(subgraph.value, MAX_RESPONSE_STRANDS);

  // Citations are built from the FULL (capped) strands — each caveat reads the
  // strand's full headline; the emitted nodes are projected to the tight shape.
  const validated = CitationsSchema.safeParse(
    buildCitations(capped.nodes, manifest.version, manifest.lastUpdated),
  );
  if (!validated.success) {
    // The non-empty-tuple contract: a response with no citable strand is an
    // error, never an empty-citation envelope.
    return formatError('No EEF evidence strands matched the requested context.');
  }

  const projectedNodes = capped.nodes.map(projectExploreNode);
  deps.recordSpan?.(buildExploreSpan(args, projectedNodes.length, Date.now() - startedAt));
  return formatExploreResponse(
    args,
    projectedNodes,
    capped.edges,
    validated.data,
    capped.totalMatched,
    manifest.version,
    manifest.lastUpdated,
  );
}

/**
 * MCP executor adapter: maps the shared dependency bundle to the tool's
 * runtime deps. Constructs the freshness reference time (`new Date()`) here
 * so the execution fn stays deterministically testable. The Sentry telemetry
 * sink is wired by the consuming app (follow-on per `../../telemetry.ts`), so
 * `recordSpan` is omitted at gate-1a.
 */
export function handleEefExploreTool(
  input: unknown,
  deps: UniversalToolExecutorDependencies,
): Promise<CallToolResult> {
  const validation = validateEefExploreArgs(input);
  if (!validation.ok) {
    return Promise.resolve(formatError(validation.message));
  }
  return Promise.resolve(
    runEefExploreTool(validation.value, { now: new Date(), logger: deps.logger }),
  );
}
