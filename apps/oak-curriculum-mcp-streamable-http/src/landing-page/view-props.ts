/**
 * The landing page's view-props contract — the complete, serialisable input
 * to the page render.
 *
 * @remarks
 * Everything the page shows arrives through this type: the tool and resource
 * listings (derived from the SDK registry at BUILD time — the lists are
 * build-time constants, so the baked page and the MCP server are the same
 * build and cannot diverge), the derived deployment URLs, and the build
 * identity. The components below this seam are presentational; the
 * derivation — including "where is this deployed", resolved ONCE — lives in
 * `derive-view-props.ts` on the build side only, which is what keeps the SDK
 * out of any future browser bundle and keeps environment-shaped values out
 * of the components.
 *
 * The type is deliberately JSON-serialisable (no functions, no dates, no
 * undefined-bearing collections): the render input can be embedded verbatim
 * wherever the page needs it, so "the exact props the page rendered with" is
 * a property of the type, not a convention.
 *
 * @packageDocumentation
 */

import type { UniversalToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/**
 * One tool row: the name plus its full (unsplit) description.
 *
 * @remarks
 * `name` keeps the SDK's closed union (a type-only import, erased at compile
 * time — the future browser bundle is unaffected): a baked payload naming a
 * tool the server does not serve is then a type error at the seam, not a
 * silently-valid string.
 */
export interface ToolEntry {
  readonly name: UniversalToolName;
  readonly description: string;
}

/** One resource row, as advertised to a connected client. */
export interface ResourceEntry {
  readonly uri: string;
  readonly title: string;
  readonly description: string;
}

/** The complete render input; see the module remarks for the contract. */
export interface LandingPageViewProps {
  /** Aggregated (value-add) tools, in the ratified presentation order. */
  readonly aggregatedTools: readonly ToolEntry[];
  /** Generated API pass-through tools, in inventory order. */
  readonly generatedTools: readonly ToolEntry[];
  /** Served resources, in inventory order. */
  readonly resources: readonly ResourceEntry[];
  /** Absolute origin the page is served from, no trailing slash. */
  readonly siteOrigin: string;
  /** The MCP endpoint URL — the one string the page exists to convey. */
  readonly mcpEndpointUrl: string;
  /**
   * Absolute, path-qualified protected-resource metadata URL (MCP-511).
   *
   * Derived at the seam rather than in a component: it is another
   * "where is this deployed" value, and the path-qualified form is this
   * resource's own metadata URL (RFC 9728 §3.1) — the one that survives a
   * path-scoped edge, unlike the unqualified form the page used to link to.
   */
  readonly protectedResourceMetadataUrl: string;
  /** App build identity, emitted as HTML metadata when known. */
  readonly appVersion?: string;
}
