import {
  AUTOMATIC_EVENT_NAMES,
  type AutomaticEventName,
  type PolicySnapshot,
  type UnknownProperties,
} from './event-policy-contract.js';
import {
  commonProperties,
  isOakClientFamily,
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
  const protocolVersion = readOwn(properties, '$mcp_protocol_version');
  const isError = readOwn(properties, '$mcp_is_error');
  if (
    isError !== false ||
    !isOakClientFamily(clientFamily) ||
    !isSupportedProtocolVersion(protocolVersion)
  ) {
    return null;
  }

  return {
    ...commonProperties(snapshot),
    $mcp_is_error: false,
    oak_client_family: clientFamily,
    $mcp_protocol_version: protocolVersion,
  };
}

function normaliseToolsListProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
  duration: number,
  isError: boolean,
): UnknownProperties | null {
  if (isError) {
    return {
      ...commonProperties(snapshot),
      $mcp_duration_ms: duration,
      $mcp_is_error: true,
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
  };
}

function normaliseToolCallProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
  duration: number,
  isError: boolean,
): UnknownProperties {
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
