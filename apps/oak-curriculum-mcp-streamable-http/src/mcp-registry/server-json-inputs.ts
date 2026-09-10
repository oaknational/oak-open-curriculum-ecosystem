/**
 * Environment-to-inputs resolution for the MCP Registry entry.
 *
 * @remarks
 * The one place that decides where each `server.json` value comes from, kept
 * apart from `server-json.ts` so the composition is describable by tests
 * without a filesystem or a network: `scripts/generate-server-json.ts` is
 * then a thin shell (read `process.env`, build, probe the deployment, write),
 * and the integration suite composes the very same inputs the publish will.
 *
 * The endpoint precedence is not restated here — it is
 * {@link resolveServedMcpUrl}, the same derivation the request path and the
 * landing-page bake use. That is the whole point: a change to how this app
 * decides its own address reaches the registry entry without anyone
 * remembering that the registry entry exists.
 */

import { getDisplayHostname, resolveApplicationVersion } from '@oaknational/build-metadata';
import { err, ok, type Result } from '@oaknational/result';

import { resolveCanonicalOrigin } from '../canonical-origin.js';
import { OAK_SERVER_BRANDING } from '../server-branding.js';
import { resolveServedMcpUrl, type ServedOriginInputs } from '../served-origin.js';
import type { ServerJsonInputs } from './server-json-types.js';

/**
 * The environment variable carrying the owner's namespace decision.
 *
 * @remarks
 * A variable rather than a constant in this repository because the namespace
 * is an identity choice with a verification cost attached, not an
 * implementation detail — see
 * `docs/mcp-registry-publication.md`. Deliberately un-defaulted: guessing a
 * namespace would publish Oak's curriculum under a name nobody chose, and the
 * two candidates are not interchangeable.
 */
const REGISTRY_NAMESPACE_ENV = 'MCP_REGISTRY_NAMESPACE';

/**
 * The environment variable carrying the catalogue description.
 *
 * @remarks
 * Supplied rather than authored here, because the registry caps
 * `description` at 100 characters and the description this server already
 * publishes in its `initialize` handshake
 * (`OAK_SERVER_BRANDING.description`) is 113. The two honest ways to close
 * that gap are to shorten the served copy — a change to reviewed
 * agent-facing content, with consequences for every MCP host that renders
 * it — or to write a shorter line for the catalogue. Both are editorial
 * decisions, so neither is taken by this module; the recommended line is in
 * `docs/mcp-registry-publication.md` for the publisher to accept or replace.
 * Truncating the served copy is not an option: it would publish a sentence
 * nobody wrote.
 */
const REGISTRY_DESCRIPTION_ENV = 'MCP_REGISTRY_DESCRIPTION';

/**
 * The server-name segment of Oak's registry name.
 *
 * @remarks
 * It reads the same as the name the `initialize` handshake returns
 * (`oak-curriculum-http`, set at the composition root) so a client that
 * finds Oak in the registry and a client that connects see one identifier —
 * but it is deliberately its own constant, because the two have opposite
 * lifetimes. A registry name cannot be edited in place: the registry's edit
 * endpoint answers a changed name with *"Cannot rename server"*, and it needs
 * an `edit` permission which neither the GitHub nor the DNS ownership route
 * grants at all.
 *
 * Renaming therefore means withdrawing the old entry and publishing the new
 * one — reversible, and not a fork. `validateNoDuplicateRemoteURLs` refuses a
 * publish whose remote URL a *differently named* server already holds, but it
 * queries without asking for deleted rows, and the store then excludes them,
 * so a withdrawn row releases the endpoint. A publish-scoped token is enough
 * to withdraw, since the status endpoint accepts `publish` or `edit`.
 *
 * What stays true is that a rename is a deliberate act with a migration
 * behind it. Deriving this constant from the served name would let an
 * ordinary rename move Oak's registry identity silently, without anyone
 * choosing to withdraw and republish.
 *
 * @see {@link https://github.com/modelcontextprotocol/registry/blob/main/internal/service/registry_service.go} `validateNoDuplicateRemoteURLs`
 * @see {@link https://github.com/modelcontextprotocol/registry/blob/main/internal/api/handlers/v0/status.go} the withdraw path's permission check
 */
export const MCP_SERVER_NAME = 'oak-curriculum-http';

/**
 * Oak's source repository, for the schema's `repository` block.
 *
 * @remarks
 * Stated rather than derived: unlike the endpoint, this is a fact about the
 * repository the document is built in, not about the deployment it describes,
 * so it cannot drift away from a value configured elsewhere.
 */
const REPOSITORY_URL = 'https://github.com/oaknational/oak-open-curriculum-ecosystem';

/** The forge identifier the registry validates `repository.url` against. */
const REPOSITORY_SOURCE = 'github';

/** Exactly the environment this composition reads — the honest contract. */
export interface ServerJsonEnvironment {
  /** The owner's namespace decision. Required; see {@link REGISTRY_NAMESPACE_ENV}. */
  readonly MCP_REGISTRY_NAMESPACE?: string;
  /** The catalogue description. Required; see {@link REGISTRY_DESCRIPTION_ENV}. */
  readonly MCP_REGISTRY_DESCRIPTION?: string;
  /** The configured canonical host, as the app itself reads it. */
  readonly CANONICAL_HOST?: string;
  /** Vercel's production hostname, used when no canonical host is configured. */
  readonly VERCEL_PROJECT_PRODUCTION_URL?: string;
  /** Vercel's per-deployment hostname. */
  readonly VERCEL_URL?: string;
  /** Vercel's environment name. */
  readonly VERCEL_ENV?: string;
  /** Version override, honoured exactly as the runtime honours it. */
  readonly APP_VERSION_OVERRIDE?: string;
  /** Local listen port, so a local composition names a coherent origin. */
  readonly PORT?: string;
}

/**
 * Resolves the served-origin inputs from a publication environment.
 *
 * @remarks
 * Shared by the registry entry and by the pre-publication probe, so the
 * document's endpoint and the metadata URL the generator measures against it
 * are resolved from one environment reading. Two readings would let the
 * document describe one host while the proof interrogated another — which is
 * the failure the proof exists to catch.
 *
 * @param env - The publication environment.
 * @returns Inputs for `resolveServedMcpUrl` and `resolveServedPrmUrl`.
 */
export function resolveServedOriginInputs(env: ServerJsonEnvironment): ServedOriginInputs {
  const canonicalOrigin = resolveCanonicalOrigin(env.CANONICAL_HOST);
  const displayHostname = getDisplayHostname(env);
  return {
    ...(canonicalOrigin === undefined ? {} : { canonicalOrigin }),
    ...(displayHostname === undefined ? {} : { displayHostname }),
    ...(env.PORT === undefined ? {} : { portEnv: env.PORT }),
  };
}

/**
 * Reads one un-defaulted publication decision from the environment.
 *
 * @remarks
 * Whitespace-trimmed and blank-rejected together, so a variable set to an
 * empty string reads as undecided rather than as a decision to publish
 * nothing.
 *
 * @param value - The raw environment value.
 * @param undecided - The message explaining what the decision is and where
 *   the reasoning lives.
 * @returns The trimmed value, or the undecided message.
 */
function requiredDecision(value: string | undefined, undecided: string): Result<string, string> {
  const trimmed = value?.trim();
  return trimmed === undefined || trimmed.length === 0 ? err(undecided) : ok(trimmed);
}

/**
 * Resolves every `server.json` input from a publication environment.
 *
 * @param env - The publication environment; `process.env` satisfies it
 *   structurally at the composition root, which is the only place that reads
 *   it.
 * @returns The inputs, or a message naming what the environment did not say.
 *
 * @example
 * ```typescript
 * const inputs = resolveServerJsonInputs({
 *   MCP_REGISTRY_NAMESPACE: 'io.github.oaknational',
 *   MCP_REGISTRY_DESCRIPTION: 'Search and download Oak curriculum resources',
 *   CANONICAL_HOST: 'mcp.thenational.academy',
 * });
 * ```
 */
export function resolveServerJsonInputs(
  env: ServerJsonEnvironment,
): Result<ServerJsonInputs, string> {
  const namespace = requiredDecision(
    env.MCP_REGISTRY_NAMESPACE,
    `${REGISTRY_NAMESPACE_ENV} is not set. The namespace is the owner's decision — ` +
      '`io.github.oaknational` (GitHub authentication only) or `academy.thenational` ' +
      '(Oak identity, needs a DNS or HTTP proof on the zone). See ' +
      'docs/mcp-registry-publication.md.',
  );
  if (!namespace.ok) {
    return namespace;
  }

  const description = requiredDecision(
    env.MCP_REGISTRY_DESCRIPTION,
    `${REGISTRY_DESCRIPTION_ENV} is not set. The registry caps a description at 100 ` +
      "characters and this server's served description is 113, so the catalogue line is " +
      'supplied rather than derived. The recommended text is in ' +
      'docs/mcp-registry-publication.md.',
  );
  if (!description.ok) {
    return description;
  }

  const version = resolveApplicationVersion({
    ...(env.APP_VERSION_OVERRIDE === undefined
      ? {}
      : { APP_VERSION_OVERRIDE: env.APP_VERSION_OVERRIDE }),
  });
  if (!version.ok) {
    return err(`could not resolve the application version: ${JSON.stringify(version.error)}`);
  }

  return ok({
    namespace: namespace.value,
    serverName: MCP_SERVER_NAME,
    servedMcpUrl: resolveServedMcpUrl(resolveServedOriginInputs(env)),
    version: version.value.value,
    title: OAK_SERVER_BRANDING.title,
    description: description.value,
    websiteUrl: OAK_SERVER_BRANDING.websiteUrl,
    repositoryUrl: REPOSITORY_URL,
    repositorySource: REPOSITORY_SOURCE,
  });
}
