/**
 * The declarative served-surface definition — the single point of control
 * for what this app serves (ratified plan mcp-101-visible-surface-allowlist;
 * decisions register D11/D22).
 *
 * One structural, registration-time allowlist: enabling or disabling any
 * surface element is a reviewed change to this one definition, never a
 * runtime flag. The constant is module-level and evaluated once at process
 * start, so the served surface cannot drift between the per-request
 * `McpServer` instances (ADR-112) — every request registers from the same
 * definition object.
 *
 * `universalTools` is TOTAL over the SDK's generated tool registry: the
 * `satisfies` clause makes a codegen-added tool a compile error here (it
 * must be classified live or dormant deliberately), and the unit suite
 * recomputes totality against the live registry at test time.
 *
 * App-local surfaces (registered outside the universal enumeration) have
 * their own rows so the definition covers everything served, with no
 * special cases hiding outside it.
 *
 * One key is codegen-derived, not hand-frozen: the widget row is keyed by
 * the imported `WIDGET_URI` constant, whose cache-busting suffix derives
 * from the deployed build's identity — per-commit on git-connected
 * deploys, so it changes with every code change but holds across
 * same-commit redeploys (MCP-187 — a frozen copy of the URI here silently
 * stops matching the generated value on deployed builds, so the widget
 * would advertise but never register). The row's *state* remains a
 * reviewed classification; its *key* must never be re-frozen — the
 * `no-restricted-syntax` ban on `ui://widget/` literals in this app's
 * `eslint.config.ts` enforces this at the lint gate.
 */

import {
  WIDGET_URI,
  type UniversalToolName,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { typeSafeEntries } from '@oaknational/type-helpers';

/** A served-surface element is exactly live (registered) or dormant (retained, not registered). */
type ServedState = 'live' | 'dormant';

/** Tools this app registers outside the SDK's universal enumeration. */
export type AppLocalToolName = 'oak-under-the-hood';

/** The full served-surface classification. */
export interface ServedSurfaceDefinition {
  readonly universalTools: Readonly<Record<UniversalToolName, ServedState>>;
  readonly appLocalTools: Readonly<Record<AppLocalToolName, ServedState>>;
  /**
   * Resource classification, keyed by resource URI. Total over the full
   * inventory (the SDK resource catalogue, the agent guidance documents,
   * and the MCP App widget); totality is recomputed by the unit suite —
   * URIs have no closed compile-time union, so the test is the tripwire
   * a codegen-style growth would hit.
   */
  readonly resources: Readonly<Record<string, ServedState>>;
}

/**
 * The canonical served surface.
 *
 * Dormant rows: the two user-search MCP App tools — the MCP App
 * user-search experience is not built yet (previously gated by the
 * `OAK_CURRICULUM_MCP_USER_SEARCH_ENABLED` env flag, superseded by this
 * definition). Everything else on the tool surface is live.
 */
export const SERVED_SURFACE = {
  universalTools: {
    search: 'live',
    fetch: 'live',
    'get-curriculum-model': 'live',
    'get-thread-progressions': 'live',
    'get-prior-knowledge-graph': 'live',
    'get-misconception-graph': 'live',
    'get-keyword-graph': 'live',
    // Gated, not removed (owner card 2026-07-23): out of the v1 live set;
    // the row stays so re-enabling is a one-word reviewed change here.
    'get-eef-evidence': 'dormant',
    'browse-curriculum': 'live',
    'explore-topic': 'live',
    'download-asset': 'live',
    'user-search': 'dormant',
    'user-search-query': 'dormant',
    'get-key-stages': 'live',
    'get-key-stages-subject-assets': 'live',
    'get-key-stages-subject-lessons': 'live',
    'get-key-stages-subject-questions': 'live',
    'get-key-stages-subject-units': 'live',
    'get-keywords': 'live',
    'get-lessons-assets': 'live',
    'get-lessons-quiz': 'live',
    'get-lessons-summary': 'live',
    'get-lessons-transcript': 'live',
    'get-programmes': 'live',
    'get-programmes-assets': 'live',
    'get-programmes-questions': 'live',
    'get-programmes-units': 'live',
    'get-rate-limit': 'live',
    'get-sequences': 'live',
    'get-sequences-assets': 'live',
    'get-sequences-questions': 'live',
    'get-sequences-units': 'live',
    'get-subject-detail': 'live',
    'get-subjects': 'live',
    'get-subjects-key-stages': 'live',
    'get-subjects-programmes': 'live',
    'get-subjects-years': 'live',
    'get-threads': 'live',
    'get-threads-units': 'live',
    'get-units-summary': 'live',
  },
  appLocalTools: {
    'oak-under-the-hood': 'live',
  },
  resources: {
    'docs://oak/getting-started.md': 'live',
    'curriculum://model': 'live',
    // EEF interpretation: dormant with its tool (owner card 2026-07-23 —
    // out of the v1 live set; gated, not removed). Previously the
    // OAK_CURRICULUM_MCP_EEF_ENABLED kill-switch's resource leg, superseded
    // by this definition (re-enabling is a reviewed change here).
    'eef://interpretation': 'dormant',
    // Computed key, never a literal: tracks the generated per-build URI so
    // gate, registration, and tool advertisement stay one constant (MCP-187).
    [WIDGET_URI]: 'live',
    // Agent guidance documents (decisions register D11 as amended by the
    // owner 2026-07-23 — the lesson-planning placeholder deleted outright):
    // the navigation three live, the creation-oriented three retained dormant.
    'docs://oak/guidance/find-lessons.md': 'live',
    'docs://oak/guidance/explore-curriculum.md': 'live',
    'docs://oak/guidance/learning-progression.md': 'live',
    'docs://oak/guidance/curriculum-mapping.md': 'dormant',
    'docs://oak/guidance/adapt-lesson.md': 'dormant',
    'docs://oak/guidance/continue-progression.md': 'dormant',
  },
} as const satisfies ServedSurfaceDefinition;

/** Whether a universal tool is live under the given definition. */
export function isUniversalToolLive(
  definition: ServedSurfaceDefinition,
  name: UniversalToolName,
): boolean {
  return definition.universalTools[name] === 'live';
}

/** Whether an app-local tool is live under the given definition. */
export function isAppLocalToolLive(
  definition: ServedSurfaceDefinition,
  name: AppLocalToolName,
): boolean {
  return definition.appLocalTools[name] === 'live';
}

/**
 * Canonical live tool registration names under a definition — universal
 * tools first, then app-local tools, each in definition order. MCP-241
 * closes the product-analytics event labels to exactly this set; parity
 * with the real registration path is pinned by the registration-walk
 * integration test.
 */
export function liveToolNames(definition: ServedSurfaceDefinition): readonly string[] {
  return [
    ...typeSafeEntries(definition.universalTools),
    ...typeSafeEntries(definition.appLocalTools),
  ]
    .filter(([, state]) => state === 'live')
    .map(([name]) => name);
}

/** Whether a resource URI is live under the given definition. */
export function isResourceLive(definition: ServedSurfaceDefinition, uri: string): boolean {
  return definition.resources[uri] === 'live';
}
