/**
 * The landing page's view-props contract — the complete, serialisable input
 * to the page render.
 *
 * @remarks
 * Everything the page shows arrives through this type: the tool and resource
 * listings (derived from the SDK registry at BUILD time — the lists are
 * build-time constants, so the baked page and the MCP server are the same
 * build and cannot diverge), the deployment host, the build identity, and the
 * theme-control flag. The components below this seam are presentational; the
 * derivation lives in `derive-view-props.ts` on the build side only, which is
 * what keeps the SDK out of the browser bundle.
 *
 * The type is deliberately JSON-serialisable (no functions, no dates, no
 * undefined-bearing collections): the same object is baked into the page as
 * the hydration payload and re-read by the client entry, so "the exact props
 * the server rendered with" is a property of the type, not a convention.
 *
 * `parseLandingPageViewProps` is the client-boundary guard. It is a
 * hand-rolled structural validator rather than a zod schema by deliberate
 * decision: the browser bundle is a public landing page and zod measures
 * ~320 KB minified, while the boundary rule demands strict validation, not a
 * particular library. Every field is narrowed, nothing is asserted.
 *
 * @packageDocumentation
 */

import { err, isErr, ok, type Result } from '@oaknational/result';

/** One tool row: the name plus its full (unsplit) description. */
export interface ToolEntry {
  readonly name: string;
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
  /** Deployment host for endpoint derivation; absent means localhost/dev. */
  readonly vercelHost?: string;
  /** App build identity, emitted as HTML metadata when known. */
  readonly appVersion?: string;
  /** Renders the masthead theme control (and ships its machinery) when true. */
  readonly themeSelectorEnabled: boolean;
}

/** Failure shape for {@link parseLandingPageViewProps}. */
export interface ViewPropsParseError {
  readonly kind: 'view_props_parse_error';
  /** Dot-path of the first field that failed narrowing. */
  readonly path: string;
}

/**
 * The candidate shape after the root check: a non-array object whose fields
 * are still unknown. Structural narrowing without assertions, the same
 * chained-guard pattern as `auth/mcp-body-parser.ts`.
 */
interface UnknownViewPropsFields {
  readonly aggregatedTools?: unknown;
  readonly generatedTools?: unknown;
  readonly resources?: unknown;
  readonly vercelHost?: unknown;
  readonly appVersion?: unknown;
  readonly themeSelectorEnabled?: unknown;
}

function isNonArrayObject(value: unknown): value is UnknownViewPropsFields {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isEntryObject(value: unknown): value is {
  readonly name?: unknown;
  readonly description?: unknown;
  readonly uri?: unknown;
  readonly title?: unknown;
} {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isToolEntry(value: unknown): value is ToolEntry {
  return (
    isEntryObject(value) && typeof value.name === 'string' && typeof value.description === 'string'
  );
}

function isResourceEntry(value: unknown): value is ResourceEntry {
  return (
    isEntryObject(value) &&
    typeof value.uri === 'string' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string'
  );
}

function everyEntry<T>(
  value: unknown,
  guard: (entry: unknown) => entry is T,
): value is readonly T[] {
  return Array.isArray(value) && value.every((entry) => guard(entry));
}

type ListFields = Pick<LandingPageViewProps, 'aggregatedTools' | 'generatedTools' | 'resources'>;
type ScalarFields = Pick<
  LandingPageViewProps,
  'vercelHost' | 'appVersion' | 'themeSelectorEnabled'
>;

function parseListFields(value: UnknownViewPropsFields): Result<ListFields, ViewPropsParseError> {
  if (!everyEntry(value.aggregatedTools, isToolEntry)) {
    return err({ kind: 'view_props_parse_error', path: 'aggregatedTools' });
  }
  if (!everyEntry(value.generatedTools, isToolEntry)) {
    return err({ kind: 'view_props_parse_error', path: 'generatedTools' });
  }
  if (!everyEntry(value.resources, isResourceEntry)) {
    return err({ kind: 'view_props_parse_error', path: 'resources' });
  }
  return ok({
    aggregatedTools: value.aggregatedTools,
    generatedTools: value.generatedTools,
    resources: value.resources,
  });
}

function parseScalarFields(
  value: UnknownViewPropsFields,
): Result<ScalarFields, ViewPropsParseError> {
  if (value.vercelHost !== undefined && typeof value.vercelHost !== 'string') {
    return err({ kind: 'view_props_parse_error', path: 'vercelHost' });
  }
  if (value.appVersion !== undefined && typeof value.appVersion !== 'string') {
    return err({ kind: 'view_props_parse_error', path: 'appVersion' });
  }
  if (typeof value.themeSelectorEnabled !== 'boolean') {
    return err({ kind: 'view_props_parse_error', path: 'themeSelectorEnabled' });
  }
  return ok({
    ...(value.vercelHost !== undefined ? { vercelHost: value.vercelHost } : {}),
    ...(value.appVersion !== undefined ? { appVersion: value.appVersion } : {}),
    themeSelectorEnabled: value.themeSelectorEnabled,
  });
}

/**
 * Narrows an unknown value (the parsed hydration payload) to
 * {@link LandingPageViewProps}.
 *
 * @param value - The `JSON.parse` result of the embedded payload
 * @returns The narrowed props, or the dot-path of the first failing field
 */
export function parseLandingPageViewProps(
  value: unknown,
): Result<LandingPageViewProps, ViewPropsParseError> {
  if (!isNonArrayObject(value)) {
    return err({ kind: 'view_props_parse_error', path: '(root)' });
  }
  const lists = parseListFields(value);
  if (isErr(lists)) {
    return lists;
  }
  const scalars = parseScalarFields(value);
  if (isErr(scalars)) {
    return scalars;
  }
  return ok({ ...lists.value, ...scalars.value });
}
