/**
 * The shapes of the MCP Registry entry and its inputs.
 *
 * @remarks
 * Separated from the composition so the constraint module can name the input
 * type without importing the composer that calls it. Every field maps to the
 * published `server.json` schema; the composition and provenance are in
 * `server-json.ts`.
 *
 * @see {@link https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json} the schema
 */

/** Repository metadata, as the schema's `Repository` requires it. */
interface ServerJsonRepository {
  /** Browsable, clonable repository URL. */
  readonly url: string;
  /** Forge identifier the registry validates against (e.g. `github`). */
  readonly source: string;
}

/** One `remotes` entry: the schema's `StreamableHttpTransport`. */
interface ServerJsonRemote {
  /** The only transport this app serves. */
  readonly type: 'streamable-http';
  /** The absolute endpoint URL. */
  readonly url: string;
}

/** The `server.json` document this app publishes. */
export interface ServerJsonDocument {
  /** The dated schema this document is written against. */
  readonly $schema: string;
  /** `<namespace>/<server-name>` in reverse-DNS form. */
  readonly name: string;
  /** Capability summary, within the registry's 100-character cap. */
  readonly description: string;
  /** Display name for registry and client user interfaces. */
  readonly title: string;
  /** The deployed application version. */
  readonly version: string;
  /** Homepage for people who want to know more. */
  readonly websiteUrl: string;
  /** Source repository, for transparency and security inspection. */
  readonly repository: ServerJsonRepository;
  /** The remote endpoints; exactly one for this app. */
  readonly remotes: readonly ServerJsonRemote[];
}

/**
 * Everything the document needs, each value resolved by the caller from the
 * home that already owns it. Nothing here is defaulted: a missing input is a
 * caller that has not decided, and the caller is the only place that can.
 */
export interface ServerJsonInputs {
  /**
   * The reverse-DNS namespace, without the trailing slash — the owner's
   * publishing decision (`io.github.oaknational` or `academy.thenational`).
   */
  readonly namespace: string;
  /** The server-name segment; `MCP_SERVER_NAME` in `server-json-inputs.ts`. */
  readonly serverName: string;
  /** The served MCP endpoint, from `resolveServedMcpUrl`. */
  readonly servedMcpUrl: string;
  /** The application version, from `resolveApplicationVersion`. */
  readonly version: string;
  /** Display title, from `OAK_SERVER_BRANDING.title`. */
  readonly title: string;
  /** Catalogue description, supplied via `MCP_REGISTRY_DESCRIPTION`. */
  readonly description: string;
  /** Homepage, from `OAK_SERVER_BRANDING.websiteUrl`. */
  readonly websiteUrl: string;
  /** Source repository, for the schema's `repository.url`. */
  readonly repositoryUrl: string;
  /** Forge identifier, for the schema's `repository.source`. */
  readonly repositorySource: string;
}
