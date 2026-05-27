/**
 * Execution for `eef-explore-evidence-for-context` (gate-1a t6a).
 *
 * Loads the freshness-gated EEF corpus, runs a whole-graph `subgraph`
 * traversal (seeded from every strand id — the gate-1a `GraphView` exposes
 * `manifest()` + `subgraph()` only, so relevance narrowing is deferred to
 * the gate-1b ranking engine and the model selects contextual fit from the
 * returned topology), and builds the structural citation envelope.
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
 * primarily up to age 16). Selection is whole-graph, so this only shapes the
 * recorded span, never the response.
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
  return formatError(`The EEF evidence corpus could not be loaded (${error.kind}).`);
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
      ...(args.focus !== undefined ? { focus: args.focus } : {}),
      result_count: resultCount,
      latency_ms: latencyMs,
    },
  };
}

/** Format the success envelope: subgraph topology + structural citations. */
function formatExploreResponse(
  args: EefExploreArgs,
  subgraph: SubgraphResult<EefStrand>,
  citations: Citations,
  dataVersion: string,
  lastUpdated: string,
): CallToolResult {
  return formatToolResponse({
    summary: `Found ${String(subgraph.nodes.length)} EEF Toolkit strands for ${args.subject} ${args.keyStage}: "${args.topic}". Each carries evidence-strength and implementation caveats to preserve.`,
    data: {
      // Source attribution once per response (not per citation), per the
      // citation-shape contract. Surfaced in `data` (model-visible) rather
      // than the response `_meta`: the shared `formatToolResponse` does not
      // carry attribution in `_meta`, and extending it for a single consumer
      // would violate consolidate-at-third-consumer. The tool DEFINITION's
      // `_meta.attribution` carries it at registration/listing time.
      attribution: EEF_ATTRIBUTION,
      citations,
      nodes: subgraph.nodes,
      edges: subgraph.edges,
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
  const subgraph = corpus.value.view.subgraph({ rootIds: corpus.value.strandIds, depth: 1 });
  if (!subgraph.ok) {
    return formatError(`EEF subgraph traversal failed (${subgraph.error.kind}).`);
  }

  const validated = CitationsSchema.safeParse(
    buildCitations(subgraph.value.nodes, manifest.version, manifest.lastUpdated),
  );
  if (!validated.success) {
    // The non-empty-tuple contract: a response with no citable strand is an
    // error, never an empty-citation envelope.
    return formatError('No EEF evidence strands matched the requested context.');
  }

  deps.recordSpan?.(buildExploreSpan(args, subgraph.value.nodes.length, Date.now() - startedAt));
  return formatExploreResponse(
    args,
    subgraph.value,
    validated.data,
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
