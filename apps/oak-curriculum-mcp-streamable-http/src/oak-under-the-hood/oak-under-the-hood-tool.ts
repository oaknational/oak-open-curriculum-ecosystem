/**
 * The Oak: Under the Hood orientation tool (pointer shape).
 *
 * A model-controlled tool that fires on repo / effort orientation triggers —
 * "tell me about this project", "how does Oak build and deliver its curriculum",
 * "how do I engage or contribute" — and hands the connected assistant a POINTER:
 * a minimal trigger instruction plus a `resource_link` to the canonical
 * orientation method (the under-the-hood skill, fetched from the public
 * repo) and Oak's public framing sources. The assistant fetches the canonical
 * and orients.
 *
 * It carries NO orientation body. The canonical sources are ALWAYS reachable
 * (the repo skill on public GitHub; Oak's mission/strategy on the public Oak
 * site), so the capability is the behaviour plus pointers, never a baked or
 * generated copy. There is no fallback/degradation branch: a client that never
 * follows the pointer simply gets the trigger — that is by design, not an
 * invented-degradation path (principles.md §Strict and Complete).
 *
 * Effort-domain ONLY (owner separation principle). Two construction-held
 * firewalls, never tests:
 *
 * 1. The `tools/list` description is the separation lever: it scopes the tool to
 *    the effort domain and excludes curriculum in user-domain terms, so a
 *    curriculum query routes to the curriculum tools, not here.
 * 2. The result carries NO curriculum context hint. This file never imports the
 *    SDK's curriculum-coupled `formatToolResponse` / `OAK_CONTEXT_HINT` (ADR-041),
 *    so the curriculum nudge cannot leak into the result — the firewall is
 *    STRUCTURAL.
 *
 * Registered via a SEPARATE, additive `server.registerTool` call (outside the
 * SDK universal-tools loop): the oak-under-the-hood tool is app-local, not in the
 * generated registry. It declares an explicit empty CLOSED `inputSchema` (zero-arg;
 * accepts only the empty object, per MCP 2025-11-25) and NO `outputSchema` — the
 * result body is a free-form pointer, with no object contract worth declaring. The
 * dual shape is ADR-058 (content + structuredContent), mirroring the agent-support
 * tools.
 */

import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult, ResourceLink, TextContent } from '@modelcontextprotocol/sdk/types.js';

/**
 * Tool name — the wire identifier for the Oak: Under the Hood orientation tool.
 * One concept, one name: it matches the `/oak-under-the-hood` skill command and
 * the `Skill(oak-under-the-hood)` allowlist entry.
 */
export const OAK_UNDER_THE_HOOD_TOOL_NAME = 'oak-under-the-hood';

/**
 * Public URL of the canonical orientation method (the under-the-hood skill), read
 * live from `main`. W2 and W3 ride the same PR (#243, DRAFT until the reframe
 * lands), so the `main` URL resolves once the PR merges. Reachability is a
 * pre-merge check, never a network-coupled test. The canonical dir is the bare
 * concept name `under-the-hood`; the `oak-` prefix is adapter-only and never
 * appears on the canonical path.
 */
export const CANONICAL_SKILL_URL =
  'https://raw.githubusercontent.com/oaknational/oak-open-curriculum-ecosystem/main/.agent/skills/under-the-hood/SKILL-CANONICAL.md';

/** Oak's official positioning and pillars — public-site framing context. */
const OAK_WHO_WE_ARE_URL = 'https://www.thenational.academy/about-us/who-we-are';

/** Oak's official strategy, annual plan, and impact evaluations — public-site, on-interest depth. */
const OAK_STRATEGY_DOCS_URL = 'https://www.thenational.academy/about-us/meet-the-team#documents';

/**
 * `tools/list` description — the separation lever. Trigger-optimised for
 * effort/ecosystem orientation and explicitly scoped away from curriculum in
 * user-domain terms (never internal tool identifiers, per mcp-expert), so a
 * curriculum query routes to the curriculum tools rather than here. Internal: the
 * tests assert the advertised description over the wire, never import this constant
 * (an identity pin on it would be content-pinning by the back door).
 */
const OAK_UNDER_THE_HOOD_TOOL_DESCRIPTION =
  'Use when a user asks to understand the Oak project, effort, or ecosystem — this repository, ' +
  "how Oak builds and delivers its curriculum, the project's purpose and machinery, or how to " +
  'engage or contribute. Not for curriculum content questions (subjects, units, lessons, key ' +
  'stages, sequencing) — those are served by the curriculum tools.';

/**
 * The pointer-trigger instruction the assistant follows. It names the method and
 * points at the canonical; it does NOT restate the method (that lives in the
 * canonical the assistant fetches). It carries the no-personal-data invariant so
 * a connected assistant honours it even before reading the canonical.
 */
const OAK_UNDER_THE_HOOD_TOOL_TRIGGER =
  'Orient the user to this repository (the Oak Open Curriculum Ecosystem) using the Oak Under the ' +
  'Hood method. Fetch the canonical skill at the linked URL and follow it: discern the person’s ' +
  'angle, the facet they want (the repo’s impact, intent, mechanisms, or value) and their ' +
  'altitude, then explore THIS repository through that lens, framed by Oak’s public mission and ' +
  'strategy. The canonical lists the repo source documents; Oak’s official positioning and ' +
  'strategy are at the two public Oak URLs provided. Relay Oak’s official wording; never surface ' +
  'a person’s name.';

const OAK_UNDER_THE_HOOD_TOOL_SUMMARY =
  'Oak: Under the Hood — fetch the linked canonical method and orient the user to this repository. ' +
  'The method and sources are at the resource link below.';

/**
 * The structured pointer payload: the trigger instruction, the canonical method
 * URL, and Oak's public framing sources. No carried orientation body; no
 * `oakContextHint` (curriculum firewall, held structurally).
 */
interface OakUnderTheHoodPointer {
  readonly trigger: string;
  readonly canonicalUrl: string;
  readonly oakSources: readonly string[];
}

/**
 * Builds the Oak: Under the Hood tool result: the ADR-058 dual shape — a `content`
 * array (human-readable summary, the JSON pointer for backwards-compatible readers,
 * and a `resource_link` to the canonical) plus `structuredContent` carrying the
 * same pointer. The canonical URL appears in BOTH the `resource_link` and
 * `structuredContent` so it is model-visible regardless of how a client renders
 * content blocks. No `oakContextHint` (separation firewall, held structurally).
 */
export function buildOakUnderTheHoodToolResult(): CallToolResult {
  const pointer: OakUnderTheHoodPointer = {
    trigger: OAK_UNDER_THE_HOOD_TOOL_TRIGGER,
    canonicalUrl: CANONICAL_SKILL_URL,
    oakSources: [OAK_WHO_WE_ARE_URL, OAK_STRATEGY_DOCS_URL],
  };
  const summary: TextContent = { type: 'text', text: OAK_UNDER_THE_HOOD_TOOL_SUMMARY };
  const jsonBody: TextContent = { type: 'text', text: JSON.stringify(pointer) };
  const canonicalLink: ResourceLink = {
    type: 'resource_link',
    uri: CANONICAL_SKILL_URL,
    name: 'oak-under-the-hood',
    title: 'Oak: Under the Hood — orientation method',
    description:
      'Canonical orientation method and source list; fetch and follow it to orient the user.',
    mimeType: 'text/markdown',
    annotations: { audience: ['assistant'], priority: 0.9 },
  };
  return {
    content: [summary, jsonBody, canonicalLink],
    structuredContent: { ...pointer, summary: OAK_UNDER_THE_HOOD_TOOL_SUMMARY },
  };
}

/**
 * Registers the Oak: Under the Hood orientation tool with the MCP server.
 *
 * A separate, additive registration — not part of the universal-tools loop. It
 * declares an explicit empty CLOSED `inputSchema` (`z.object({}).strict()`, which
 * the SDK serialises to `{type:'object', additionalProperties:false}` — a strict
 * raw shape `{}` alone does NOT emit `additionalProperties:false`) and no
 * `outputSchema`. `openWorldHint: true` — the tool points OUT to a fetched
 * external canonical.
 *
 * @param server - the MCP server (narrowed to the `registerTool` capability)
 */
export function registerOakUnderTheHoodTool(server: Pick<McpServer, 'registerTool'>): void {
  server.registerTool(
    OAK_UNDER_THE_HOOD_TOOL_NAME,
    {
      title: 'Oak: Under the Hood',
      description: OAK_UNDER_THE_HOOD_TOOL_DESCRIPTION,
      inputSchema: z.object({}).strict(),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    () => buildOakUnderTheHoodToolResult(),
  );
}
