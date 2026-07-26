/**
 * Build-side derivation of the landing page's view-props.
 *
 * @remarks
 * The one place the page meets the SDK. Tool and resource membership comes
 * from the served-surface filter over the SDK registries (the page advertises
 * exactly what a connected client sees, never dormant inventory — ratified
 * plan mcp-101); aggregated ordering comes from {@link AGGREGATED_TOOL_ORDER},
 * whose completeness over the definitions map is enforced by the unit suite.
 *
 * This module runs at BUILD time (and under Vitest). It must never be
 * imported by the presentational components or the client entry — that import
 * direction is what keeps the SDK registries (and their Node-only transitive
 * imports) out of the browser bundle. The derived lists are build-time
 * constants: the server's own tool registry is fixed at the same build, so
 * the baked page and the MCP app are guaranteed in sync by construction.
 *
 * @packageDocumentation
 */

import {
  ALL_MCP_RESOURCES,
  generatedToolRegistry,
  isAggregatedToolName,
  listUniversalTools,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type {
  AGGREGATED_TOOL_DEFS,
  UniversalToolListEntry,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import {
  isResourceLive,
  isUniversalToolLive,
  SERVED_SURFACE,
} from '../served-surface/served-surface.js';
import type { LandingPageViewProps, ResourceEntry, ToolEntry } from './view-props.js';

/** All aggregated tool names, derived from the SDK's definitions map. */
type AggregatedToolName = keyof typeof AGGREGATED_TOOL_DEFS;

/**
 * Preferred order for aggregated tools (value-add first, utilities last).
 *
 * Completeness invariant: every aggregated tool has an explicit position
 * here, enforced by the unit test against `AGGREGATED_TOOL_DEFS` — a new
 * aggregated tool cannot silently fall to the incidental tail order.
 */
export const AGGREGATED_TOOL_ORDER: readonly AggregatedToolName[] = [
  'get-curriculum-model',
  'browse-curriculum',
  'explore-topic',
  'search',
  'fetch',
  'get-thread-progressions',
  'get-prior-knowledge-graph',
  'get-misconception-graph',
  'get-keyword-graph',
  'get-eef-evidence',
  'user-search',
  'user-search-query',
  'download-asset',
];

/** Sorts aggregated tools into the preferred order; unlisted tools go last. */
function sortAggregatedTools(tools: UniversalToolListEntry[]): UniversalToolListEntry[] {
  const orderMap = new Map<string, number>(AGGREGATED_TOOL_ORDER.map((name, i) => [name, i]));
  return [...tools].sort((a, b) => {
    const aIdx = orderMap.get(a.name) ?? Number.POSITIVE_INFINITY;
    const bIdx = orderMap.get(b.name) ?? Number.POSITIVE_INFINITY;
    return aIdx - bIdx;
  });
}

function toToolEntry(tool: UniversalToolListEntry): ToolEntry {
  return { name: tool.name, description: tool.description };
}

/** The live resource rows, in inventory order. */
function servedResources(): readonly ResourceEntry[] {
  return ALL_MCP_RESOURCES.filter((resource) => isResourceLive(SERVED_SURFACE, resource.uri)).map(
    (resource) => ({
      uri: resource.uri,
      title: resource.title,
      description: resource.description,
    }),
  );
}

/** Runtime-independent inputs; the lists are derived, everything else passes through. */
export interface DeriveLandingPageOptions {
  readonly vercelHost?: string;
  readonly appVersion?: string;
  readonly themeSelectorEnabled?: boolean;
}

/** Derives the complete, serialisable view-props for one page bake. */
export function deriveLandingPageViewProps(
  options: DeriveLandingPageOptions = {},
): LandingPageViewProps {
  const served = listUniversalTools(generatedToolRegistry).filter((tool) =>
    isUniversalToolLive(SERVED_SURFACE, tool.name),
  );
  const aggregated = sortAggregatedTools(served.filter((tool) => isAggregatedToolName(tool.name)));
  const generated = served.filter((tool) => !isAggregatedToolName(tool.name));

  return {
    aggregatedTools: aggregated.map(toToolEntry),
    generatedTools: generated.map(toToolEntry),
    resources: servedResources(),
    ...(options.vercelHost !== undefined ? { vercelHost: options.vercelHost } : {}),
    ...(options.appVersion !== undefined ? { appVersion: options.appVersion } : {}),
    themeSelectorEnabled: options.themeSelectorEnabled ?? false,
  };
}
