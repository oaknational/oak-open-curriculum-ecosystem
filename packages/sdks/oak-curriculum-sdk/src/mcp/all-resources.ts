/**
 * Canonical catalogue of every MCP resource the Oak Curriculum server exposes.
 *
 * This is the single source of truth for the registration drift guard.
 * `registerAllResources` registers resources explicitly (it does not iterate
 * this list); an integration test asserts the registered set matches this
 * catalogue, so a resource registered without being listed here — or listed
 * without being registered — fails the guard rather than drifting silently.
 *
 * Listing is intentionally the full static INVENTORY, not the served set:
 * live-vs-dormant classification is the consuming app's served-surface
 * definition (the agent guidance documents ship here in full; the app
 * serves its ratified live subset and advertises only what it serves).
 *
 * The `ui://` widget (`WIDGET_URI`) is a string constant used for MCP-Apps tool
 * output rendering, not a `resources/read` data resource, so it is deliberately
 * excluded from this catalogue.
 *
 */

import { CURRICULUM_MODEL_RESOURCE } from './curriculum-model-resource.js';
import { DOCUMENTATION_RESOURCES } from './documentation-resources.js';
import { EEF_INTERPRETATION_RESOURCE } from './eef-interpretation-resource.js';
import { AGENT_GUIDANCE_RESOURCES } from './guidance-resources/agent-guidance-resources.js';

export type { McpResource } from './mcp-resource-types.js';
import type { McpResource } from './mcp-resource-types.js';

/**
 * Every MCP resource the server exposes, in listing order: the documentation
 * resources first, then the curriculum model and the EEF interpretation
 * guide. The EEF resource is registered behind
 * `OAK_CURRICULUM_MCP_EEF_ENABLED` (default ON); like the tool and prompt
 * catalogues, this listing catalogue is the full static set, not flag-filtered.
 *
 * Prior knowledge, misconceptions, and thread progressions have no
 * whole-corpus resource form: they are served by the anchored
 * `get-prior-knowledge-graph` (G1b), `get-misconception-graph` (G2), and
 * `get-thread-progressions` (G3) tools.
 */
export const ALL_MCP_RESOURCES: readonly McpResource[] = [
  ...DOCUMENTATION_RESOURCES,
  CURRICULUM_MODEL_RESOURCE,
  EEF_INTERPRETATION_RESOURCE,
  ...AGENT_GUIDANCE_RESOURCES,
];
