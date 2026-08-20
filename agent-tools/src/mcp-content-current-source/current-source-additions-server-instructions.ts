/**
 * Reviewed additions to the generated MCP server-instructions string.
 *
 * Split from `current-source-addition-definitions.ts` when the MCP-421
 * addition took that file over the file-size gate — the same cure, and for
 * the same reason, as `current-source-addition-anchor-helpers.ts`: these are
 * the paragraph entries for one served surface, the definitions file carries
 * the rest.
 *
 * The entries are ordered as the paragraphs are served, and the brand
 * paragraph is last on that surface by requirement, not by accident: its
 * `endsWith` test in `agent-support-tool-metadata.unit.test.ts` is what holds
 * the ordering. Any further paragraph on this surface belongs above it.
 */
import {
  structuralAnchor,
  type CurrentSourceAdditionDefinition,
} from './current-source-addition-anchor-helpers.js';

const AGENT_SUPPORT_METADATA =
  'packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts';

export const SERVER_INSTRUCTIONS_ADDITIONS: readonly CurrentSourceAdditionDefinition[] = [
  {
    id: 'A011',
    title: 'Server instructions brand ownership and non-endorsement paragraph',
    reviewDomain: 'owner-signed-copy',
    impactTier: 'high-impact',
    behaviouralIntent:
      'Close the generated server instructions with the owner-signed brand-provenance ' +
      'guidance (MCP-365): the OGL v3.0 attribution statement from LICENCE-DATA.md for ' +
      'reused curriculum content, no Oak branding on derived content, no implied Oak ' +
      'creation or endorsement. The expert-authored Brand Usage guidance document ' +
      '(MCP-102 pipeline) is the full form that later deepens or supersedes this ' +
      'paragraph — evolve the two together, never separately.',
    workspaceScope: 'in',
    sourceLocus: 'this-repo',
    file: AGENT_SUPPORT_METADATA,
    reviewedAnchors: [
      structuralAnchor(
        'Oak brand and content provenance: Oak National Academy owns the Oak brand and brand elements. When you reuse Oak\'s curriculum content, attribute it ("Contains public sector information licensed under the Open Government Licence v3.0."). When you create content derived from Oak\'s resources, we request that it adheres to the same high design standards as Oak — but it must not use the Oak branding, and it must never present itself as Oak-created or Oak-endorsed.',
      ),
    ],
  },
  {
    id: 'A012',
    title: "Server instructions pointer to Oak's other agent-facing surfaces",
    reviewDomain: 'agent-facing-routing-copy',
    impactTier: 'high-impact',
    behaviouralIntent:
      'Route an arriving agent to the Oak surfaces this server does not cover (MCP-421): ' +
      "whole-catalogue bulk export via the Oak Open API's RFC 9727 catalogue, and Oak's " +
      'site index for agents. Stated as a capability boundary rather than as a parallel ' +
      'route, so the paragraph does not read as an invitation to leave the ' +
      'authorisation-bound MCP surface for equivalent data.',
    workspaceScope: 'in',
    sourceLocus: 'this-repo',
    file: AGENT_SUPPORT_METADATA,
    reviewedAnchors: [
      structuralAnchor(
        "For whole-catalogue bulk export, which this server does not offer, use the Oak Open API: https://open-api.thenational.academy/.well-known/api-catalog. Oak's index for agents is https://www.thenational.academy/llms.txt.",
      ),
    ],
  },
];
