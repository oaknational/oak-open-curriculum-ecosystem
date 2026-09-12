/**
 * The official MCP Registry entry for this app — composed, never stored.
 *
 * @remarks
 * The registry (`registry.modelcontextprotocol.io`) answers *"which servers
 * exist?"* for clients that browse rather than clients handed a URL. Its
 * publication artefact is a `server.json` document, and the one field that
 * matters most in it is the endpoint: a registry entry advertising a stale
 * address is worse than no entry, because a browsing client has no other way
 * to find us and no reason to doubt what it read.
 *
 * So the document is **not committed**. The endpoint it carries is not a
 * repository fact — it comes from `CANONICAL_HOST`, deployment configuration
 * this app reads at boot (see `canonical-origin.ts`, which records why the
 * canonical address can never be a request header). A checked-in copy would
 * have to restate that host, and `served-origin.ts` holds the invariant this
 * app has kept since MCP-351: nothing but the served-origin derivations
 * computes "where is this deployed", because two places computing it are two
 * places to disagree.
 *
 * The document is therefore built at publication time by
 * {@link buildServerJsonDocument} from `resolveServedMcpUrl` — the same
 * function that composes the RFC 9728 `resource` the app publishes — and
 * `scripts/generate-server-json.ts` proves the result against the live
 * deployment with {@link assertRemoteMatchesServedResource} before writing
 * anything. The registry entry and the served self-description agree by
 * shared code and by a measurement, not by convention.
 *
 * Field provenance, each from the single home that already owns it:
 *
 * | `server.json` field | Source |
 * | -- | -- |
 * | `name` namespace segment | the publishing decision (MCP-637), supplied |
 * | `name` server segment | `MCP_SERVER_NAME` — permanent once published |
 * | `title` | `OAK_SERVER_BRANDING.title` |
 * | `description` | the supplied catalogue line (100-character cap) |
 * | `version` | `resolveApplicationVersion` — what `x-app-version` serves |
 * | `websiteUrl` | `OAK_SERVER_BRANDING.websiteUrl` |
 * | `remotes[0].url` | `resolveServedMcpUrl` |
 *
 * `icons` is deliberately absent: the schema requires each `src` to be an
 * HTTPS URL of at most 255 characters, and this app's icons are ~3.3 KB
 * `data:` URIs (`server-branding.ts`). Publishing them would need a hosted
 * icon URL, which is a separate decision with its own permanence problem.
 *
 * The registry's constraints live in `server-json-constraints.ts` and the
 * shapes in `server-json-types.ts`; the publication procedure and the
 * namespace decision are in `docs/mcp-registry-publication.md`.
 *
 * @see {@link https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json} the schema every constraint is read from
 */

import { err, ok, type Result } from '@oaknational/result';

import { composeRegistryName, firstConstraintFailure } from './server-json-constraints.js';
import type { ServerJsonDocument, ServerJsonInputs } from './server-json-types.js';

export type { ServerJsonDocument, ServerJsonInputs } from './server-json-types.js';

/**
 * The dated `server.json` schema this document is written against.
 *
 * @remarks
 * Pinned, not floating: the registry publishes dated schema URLs and the
 * document carries the one it was authored for, so a schema revision shows up
 * as a deliberate change here rather than as a silent reinterpretation of a
 * published entry. Verified 2026-09-09 as the version the registry's own
 * `/v0.1/servers` responses carry, against registry build `1.8.1`.
 *
 * The field is emitted unconditionally even though the schema's own
 * `required` list omits it: the publish API rejects a document without it
 * (*"expected required property $schema to be present"*), so that list is not
 * the operative contract.
 */
export const SERVER_JSON_SCHEMA_URL =
  'https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json';

/**
 * Where the generator writes the composed document, workspace-relative.
 *
 * @remarks
 * Under the gitignored `.generated/` directory, alongside the baked landing
 * page, because the document is a build product and not a repository fact —
 * see the module remarks. `mcp-publisher publish --file` takes this path.
 */
export const SERVER_JSON_ARTEFACT_RELATIVE_PATH = '.generated/server.json';

/**
 * Composes the `server.json` document, or names the first registry constraint
 * the inputs fail.
 *
 * @param inputs - Values resolved from their owning homes.
 * @returns The document, or a message naming the failed constraint.
 *
 * @example
 * ```typescript
 * const built = buildServerJsonDocument({
 *   namespace: 'io.github.oaknational',
 *   serverName: 'oak-curriculum-http',
 *   servedMcpUrl: 'https://mcp.thenational.academy/mcp',
 *   version: '1.179.0',
 *   title: 'Oak National Academy',
 *   description: 'Search, explore and download curriculum resources',
 *   websiteUrl: 'https://www.thenational.academy',
 *   repositoryUrl: 'https://github.com/oaknational/oak-open-curriculum-ecosystem',
 *   repositorySource: 'github',
 * });
 * ```
 */
export function buildServerJsonDocument(
  inputs: ServerJsonInputs,
): Result<ServerJsonDocument, string> {
  const failure = firstConstraintFailure(inputs);
  if (failure !== undefined) {
    return err(failure);
  }

  return ok({
    $schema: SERVER_JSON_SCHEMA_URL,
    name: composeRegistryName(inputs),
    description: inputs.description,
    title: inputs.title,
    version: inputs.version,
    websiteUrl: inputs.websiteUrl,
    repository: { url: inputs.repositoryUrl, source: inputs.repositorySource },
    remotes: [{ type: 'streamable-http', url: inputs.servedMcpUrl }],
  });
}

/**
 * Proves the document's advertised endpoint is the endpoint the deployment
 * actually serves.
 *
 * @remarks
 * The comparison is against the RFC 9728 protected-resource metadata
 * `resource` value, because that is the endpoint the app itself tells clients
 * it is — the same string an MCP client binds its token audience to.
 * Composing both from `resolveServedMcpUrl` makes them agree in code; this
 * check makes them agree in the deployment, which is the claim a registry
 * entry actually makes. Equality is exact, for the same reason an RFC 8707
 * audience comparison is exact: a trailing slash or a scheme disagreement is
 * a different resource.
 *
 * @param document - The document about to be published.
 * @param servedResource - `resource` read from the deployment's
 *   `/.well-known/oauth-protected-resource/mcp`.
 * @returns The document when they agree, or a message showing both values.
 */
export function assertRemoteMatchesServedResource(
  document: ServerJsonDocument,
  servedResource: string,
): Result<ServerJsonDocument, string> {
  const advertised = document.remotes[0]?.url;
  if (advertised === undefined) {
    return err('document carries no remotes entry to check');
  }

  if (advertised !== servedResource) {
    return err(
      `the document advertises ${JSON.stringify(advertised)} but the deployment serves ` +
        `${JSON.stringify(servedResource)} as its protected resource — publishing this ` +
        'would point browsing clients at an address this app does not claim',
    );
  }

  return ok(document);
}
