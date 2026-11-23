import type { NodeOptions } from '@sentry/node';

/**
 * Substrings of header, cookie and query-parameter names that identify a
 * person or their network position. The Sentry SDK applies exactly these
 * when its legacy `sendDefaultPii` option is `false`. Sentry does not export
 * the list, so it is restated here; `data-collection.integration.test.ts`
 * proves the SDK resolves it unchanged.
 */
const IDENTIFYING_KEY_SNIPPETS = ['forwarded', '-ip', 'remote-', 'via', '-user'] as const;

/**
 * What this package allows the Sentry SDK to collect by itself.
 *
 * ADR-143 pins default PII collection off. This type is that pin for user
 * information, bodies, AI payloads and database values: each is a literal
 * `false` or an empty list, so a value that switches one on does not
 * type-check. The deny lists for cookies, headers and query parameters are
 * ordinary string arrays; the integration test pins their contents.
 */
interface SentryDataCollection {
  readonly userInfo: false;
  readonly cookies: { deny: string[] };
  readonly httpHeaders: {
    readonly request: { deny: string[] };
    readonly response: { deny: string[] };
  };
  readonly httpBodies: [];
  readonly urlQueryParams: { deny: string[] };
  readonly graphQL: { readonly document: true; readonly variables: true };
  readonly genAI: { readonly inputs: false; readonly outputs: false };
  readonly databaseQueryData: false;
  readonly stackFrameVariables: true;
  readonly frameContextLines: 7;
}

function denyIdentifyingKeys(): { deny: string[] } {
  return { deny: [...IDENTIFYING_KEY_SNIPPETS] };
}

/**
 * Build the SDK's `dataCollection` option.
 *
 * Every category is stated. The SDK treats a `dataCollection` object as an
 * opt-in to its permissive defaults for any category left out, so an omitted
 * key would switch that category on. The values are the ones the SDK resolved
 * from `sendDefaultPii: false`, which this option replaces: the redaction
 * barrier (ADR-160) still runs on everything that is collected.
 *
 * It takes no argument on purpose: no configuration value can reach it.
 *
 * @returns A fresh object for each call, because the SDK's type for a deny
 *   list is a mutable array.
 */
export function createSentryDataCollection(): SentryDataCollection &
  NonNullable<NodeOptions['dataCollection']> {
  return {
    userInfo: false,
    cookies: denyIdentifyingKeys(),
    httpHeaders: { request: denyIdentifyingKeys(), response: denyIdentifyingKeys() },
    httpBodies: [],
    urlQueryParams: denyIdentifyingKeys(),
    // The SDK redacts literal values in a GraphQL document as it collects it
    // and attached it whatever `sendDefaultPii` said. Neither app uses GraphQL.
    graphQL: { document: true, variables: true },
    // Keeps MCP tool arguments and results out of the SDK's MCP server spans.
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    // Read only when `includeLocalVariables` is set, which this package never
    // sets.
    stackFrameVariables: true,
    // The SDK's context-lines integration has always used seven.
    frameContextLines: 7,
  };
}
