import {
  AUTOMATIC_EVENT_NAMES,
  type AutomaticEventName,
  type PolicySnapshot,
  type UnknownProperties,
} from './event-policy-contract.js';
import {
  commonProperties,
  isOakClientFamily,
  isOakClientSurface,
  isSupportedProtocolVersion,
  isValidDuration,
  readOwn,
  sortedCanonicalToolIntersection,
} from './event-policy-helpers.js';

function normaliseInitializeProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
): UnknownProperties | null {
  const clientFamily = readOwn(properties, 'oak_client_family');
  const clientSurface = readOwn(properties, 'oak_client_surface');
  const protocolVersion = readOwn(properties, '$mcp_protocol_version');
  const isError = readOwn(properties, '$mcp_is_error');
  if (
    isError !== false ||
    !isOakClientFamily(clientFamily) ||
    !isOakClientSurface(clientSurface) ||
    !isSupportedProtocolVersion(protocolVersion)
  ) {
    return null;
  }

  return {
    ...commonProperties(snapshot),
    $mcp_is_error: false,
    oak_client_family: clientFamily,
    oak_client_surface: clientSurface,
    $mcp_protocol_version: protocolVersion,
  };
}

function normaliseToolsListProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
  duration: number,
  isError: boolean,
): UnknownProperties | null {
  const clientSurface = readOwn(properties, 'oak_client_surface');
  if (!isOakClientSurface(clientSurface)) {
    return null;
  }

  if (isError) {
    return {
      ...commonProperties(snapshot),
      $mcp_duration_ms: duration,
      $mcp_is_error: true,
      oak_client_surface: clientSurface,
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
    oak_client_surface: clientSurface,
  };
}

function normaliseToolCallProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
  duration: number,
  isError: boolean,
): UnknownProperties | null {
  const clientSurface = readOwn(properties, 'oak_client_surface');
  if (!isOakClientSurface(clientSurface)) {
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
    oak_client_surface: clientSurface,
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
