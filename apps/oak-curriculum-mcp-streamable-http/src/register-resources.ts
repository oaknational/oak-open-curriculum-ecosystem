/**
 * MCP Resource Registration
 *
 * Registers static resources with the MCP server, including:
 * - Documentation resources for the "start here" experience
 * - Curriculum model and the EEF interpretation guide
 * - MCP App widget resource (interactive React curriculum app)
 *
 * The graph corpora have no whole-corpus resource form: prior knowledge,
 * misconceptions, and thread progressions are served by their anchored tools
 * (`get-prior-knowledge-graph`, `get-misconception-graph`,
 * `get-thread-progressions`).
 */

import {
  DOCUMENTATION_RESOURCES,
  getDocumentationContent,
  CURRICULUM_MODEL_RESOURCE,
  getCurriculumModelJson,
  EEF_INTERPRETATION_RESOURCE,
  getEefInterpretationMarkdown,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import {
  type ResourceRegistrar,
  type ResourceRegistrationOptions,
} from './register-resource-helpers.js';
import { registerWidgetResource } from './register-widget-resource.js';

/**
 * Registers documentation resources for the "start here" experience.
 *
 * The getting-started guide is the documentation resource exposed via
 * resources/list and resources/read. Tool categories, workflows, and tips are
 * single-sourced through the canonical `curriculum://model` resource (and the
 * `get-curriculum-model` tool), not duplicated as separate doc resources.
 *
 * @param server - MCP server instance
 */
export function registerDocumentationResources(server: ResourceRegistrar): void {
  for (const resource of DOCUMENTATION_RESOURCES) {
    const { name, uri, ...metadata } = resource;
    server.registerResource(name, uri, metadata, () => {
      const content = getDocumentationContent(uri);
      return {
        contents: [
          {
            uri,
            mimeType: resource.mimeType,
            text: content ?? `# ${resource.title}\n\nContent not found.`,
          },
        ],
      };
    });
  }
}

/** Registers the curriculum model as an MCP resource, complementing `get-curriculum-model`. */
export function registerCurriculumModelResource(server: ResourceRegistrar): void {
  const { name, uri, ...metadata } = CURRICULUM_MODEL_RESOURCE;
  server.registerResource(name, uri, metadata, () => ({
    contents: [
      {
        uri,
        mimeType: CURRICULUM_MODEL_RESOURCE.mimeType,
        text: getCurriculumModelJson(),
      },
    ],
  }));
}

/**
 * Registers the EEF interpretation resource (`eef://interpretation`).
 *
 * A static `text/markdown` reasoning scaffold for the EEF Toolkit evidence
 * (content built SDK-side; ADR-179). Registered only when the EEF flag is on —
 * see `registerAllResources`.
 */
function registerEefInterpretationResource(server: ResourceRegistrar): void {
  const { name, uri, ...metadata } = EEF_INTERPRETATION_RESOURCE;
  server.registerResource(name, uri, metadata, () => ({
    contents: [
      {
        uri,
        mimeType: EEF_INTERPRETATION_RESOURCE.mimeType,
        text: getEefInterpretationMarkdown(),
      },
    ],
  }));
}

/**
 * Registers all static resources with the MCP server.
 *
 * Combines documentation, curriculum model, EEF interpretation, and widget
 * resource registration into a single call.
 *
 * @param server - MCP server instance
 * @param options - Resource registration options including observability
 */
export function registerAllResources(
  server: ResourceRegistrar,
  options: ResourceRegistrationOptions,
): void {
  registerDocumentationResources(server);
  registerCurriculumModelResource(server);
  // EEF is co-gated at registration (OAK_CURRICULUM_MCP_EEF_ENABLED, kill-switch,
  // default ON): register the resource unless an explicit `=false` disables it. The
  // tool and prompt are gated by the same flag (D6 c6).
  if (options.eefEnabled) {
    registerEefInterpretationResource(server);
  }
  registerWidgetResource(server, options.getWidgetHtml);
}

export { registerPrompts } from './register-prompts.js';
export type { ResourceRegistrationOptions } from './register-resource-helpers.js';
