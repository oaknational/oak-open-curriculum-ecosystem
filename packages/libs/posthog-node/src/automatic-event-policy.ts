import {
  AUTOMATIC_EVENT_NAMES,
  type AutomaticEventName,
  type OakClientProduct,
  type OakClientSurface,
  type PolicySnapshot,
  type UnknownProperties,
} from './event-policy-contract.js';
import { isOakClientFamily, isOakClientProduct, isOakClientSurface } from './client-categories.js';
import {
  commonProperties,
  isSupportedProtocolVersion,
  isValidDuration,
  readOwn,
  sortedCanonicalToolIntersection,
} from './event-policy-helpers.js';

interface ClientCategories {
  readonly product: OakClientProduct;
  readonly surface: OakClientSurface;
}

/**
 * Reads the two per-request client categories every automatic event carries.
 *
 * @remarks Both are required, and a missing or non-canonical value drops the
 * event rather than defaulting it. A default here would silently reintroduce the
 * ambiguity MCP-594 was filed for: an unread property looking identical to a
 * derivation that ran and recognised nothing.
 *
 * This barrier alone is not what makes `other` unambiguous — a dropped event is
 * itself silent, so a systemic break would show only as lost volume. The axis
 * carries a distinct `unavailable` member for the case where the header container
 * could not be read at all, so that failure is visible in the data rather than
 * inferred from an absence. `unavailable` reports an unreadable container, never
 * a client that merely sent no header; see `normaliseOakClientProduct`.
 */
function readClientCategories(properties: UnknownProperties): ClientCategories | null {
  const product = readOwn(properties, 'oak_client_product');
  const surface = readOwn(properties, 'oak_client_surface');
  if (!isOakClientProduct(product) || !isOakClientSurface(surface)) {
    return null;
  }
  return { product, surface };
}

function normaliseInitializeProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
): UnknownProperties | null {
  const clientFamily = readOwn(properties, 'oak_client_family');
  const categories = readClientCategories(properties);
  const protocolVersion = readOwn(properties, '$mcp_protocol_version');
  const isError = readOwn(properties, '$mcp_is_error');
  if (
    isError !== false ||
    !isOakClientFamily(clientFamily) ||
    categories === null ||
    !isSupportedProtocolVersion(protocolVersion)
  ) {
    return null;
  }

  return {
    ...commonProperties(snapshot),
    $mcp_is_error: false,
    oak_client_family: clientFamily,
    oak_client_product: categories.product,
    oak_client_surface: categories.surface,
    $mcp_protocol_version: protocolVersion,
  };
}

function normaliseToolsListProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
  duration: number,
  isError: boolean,
): UnknownProperties | null {
  const categories = readClientCategories(properties);
  if (categories === null) {
    return null;
  }

  if (isError) {
    return {
      ...commonProperties(snapshot),
      $mcp_duration_ms: duration,
      $mcp_is_error: true,
      oak_client_product: categories.product,
      oak_client_surface: categories.surface,
    };
  }

  const listedToolNames = sortedCanonicalToolIntersection(
    readOwn(properties, '$mcp_listed_tool_names'),
    snapshot.servedToolNames,
  );
  if (listedToolNames === null) {
    return null;
  }

  return {
    ...commonProperties(snapshot),
    $mcp_duration_ms: duration,
    $mcp_is_error: false,
    $mcp_listed_tool_names: listedToolNames,
    oak_client_product: categories.product,
    oak_client_surface: categories.surface,
  };
}

function normaliseToolCallProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
  duration: number,
  isError: boolean,
): UnknownProperties | null {
  const categories = readClientCategories(properties);
  if (categories === null) {
    return null;
  }

  const requestedToolName = readOwn(properties, '$mcp_tool_name');
  const toolName =
    typeof requestedToolName === 'string' && snapshot.servedToolNames.has(requestedToolName)
      ? requestedToolName
      : 'unknown';

  return {
    ...commonProperties(snapshot),
    $mcp_tool_name: toolName,
    $mcp_duration_ms: duration,
    $mcp_is_error: isError,
    oak_client_product: categories.product,
    oak_client_surface: categories.surface,
  };
}

export function normaliseAutomaticProperties(
  event: AutomaticEventName,
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
): UnknownProperties | null {
  if (event === AUTOMATIC_EVENT_NAMES.initialize) {
    return normaliseInitializeProperties(properties, snapshot);
  }

  const duration = readOwn(properties, '$mcp_duration_ms');
  const isError = readOwn(properties, '$mcp_is_error');
  if (!isValidDuration(duration) || typeof isError !== 'boolean') {
    return null;
  }

  if (event === AUTOMATIC_EVENT_NAMES.toolsList) {
    return normaliseToolsListProperties(properties, snapshot, duration, isError);
  }
  return normaliseToolCallProperties(properties, snapshot, duration, isError);
}

export function isAutomaticEventName(value: unknown): value is AutomaticEventName {
  return (
    value === AUTOMATIC_EVENT_NAMES.initialize ||
    value === AUTOMATIC_EVENT_NAMES.toolsList ||
    value === AUTOMATIC_EVENT_NAMES.toolCall
  );
}
