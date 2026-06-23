/**
 * Canonical catalogue of every MCP resource the Oak Curriculum server exposes.
 *
 * This is the single source of truth for resource *listing* surfaces (the
 * landing page's Resources section) and for the registration drift guard.
 * `registerAllResources` registers resources explicitly (it does not iterate
 * this list); an integration test asserts the registered set matches this
 * catalogue, so a resource registered without being listed here — or listed
 * without being registered — fails the guard rather than drifting silently.
 *
 * Listing is intentionally the full static set, not the runtime-registered set:
 * the EEF resource is registered behind `OAK_CURRICULUM_MCP_EEF_ENABLED`
 * (default ON), but the catalogue and the landing page always advertise it, so
 * the listed capability surface is stable regardless of the flag.
 *
 * The `ui://` widget (`WIDGET_URI`) is a string constant used for MCP-Apps tool
 * output rendering, not a `resources/read` data resource, so it is deliberately
 * excluded from this catalogue.
 *
 * @see ./mcp-prompts.ts for the sibling prompt catalogue (`MCP_PROMPTS`).
 */

import { CURRICULUM_MODEL_RESOURCE } from './curriculum-model-resource.js';
import { DOCUMENTATION_RESOURCES } from './documentation-resources.js';
import { EEF_INTERPRETATION_RESOURCE } from './eef-interpretation-resource.js';

/**
 * The common shape every MCP resource definition shares. Concrete resources may
 * carry extra fields (for example `_meta.attribution` on the graph and model
 * resources); this interface captures only the fields listing surfaces read.
 */
export interface McpResource {
  /** Unique resource identifier used at registration. */
  readonly name: string;
  /** Resource URI (e.g. `docs://oak/getting-started.md`, `eef://interpretation`). */
  readonly uri: string;
  /** Human-readable title shown in listings. */
  readonly title: string;
  /** Description shown in resource listings. */
  readonly description: string;
  /** MIME type — `text/markdown` for docs/EEF, `application/json` for the graphs/model. */
  readonly mimeType: string;
  /** MCP resource annotations for priority and audience targeting. */
  readonly annotations: {
    readonly priority: number;
    readonly audience: ('user' | 'assistant')[];
  };
}

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
];
