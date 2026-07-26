import {
  ACTOR_MARKER,
  AUTOMATIC_EVENT_NAMES,
  type AutomaticEventName,
  type McpBeforeSendEvent,
  type PolicySnapshot,
  type UnknownProperties,
} from './event-policy-contract.js';
import {
  commonProperties,
  hasExpectedProjection,
  isActorPseudonym,
  isOakClientFamily,
  isSupportedProtocolVersion,
  isUnknownProperties,
  isValidDuration,
  isValidTimestampString,
  readOwn,
  reportSafely,
  sortedCanonicalToolIntersection,
} from './event-policy-helpers.js';

function normaliseInitializeProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
  requireExplicitSuccess: boolean,
): UnknownProperties | null {
  const clientFamily = readOwn(properties, 'oak_client_family');
  const protocolVersion = readOwn(properties, '$mcp_protocol_version');
  const isError = readOwn(properties, '$mcp_is_error');
  const hasValidSuccess = requireExplicitSuccess ? isError === false : isError !== true;
  if (
    !hasValidSuccess ||
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
  requireExplicitInitializeSuccess = false,
): UnknownProperties | null {
  if (event === AUTOMATIC_EVENT_NAMES.initialize) {
    return normaliseInitializeProperties(properties, snapshot, requireExplicitInitializeSuccess);
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

function hasValidMcpEnvelope(event: McpBeforeSendEvent): boolean {
  return (
    isUnknownProperties(event) &&
    event.type === 'capture' &&
    isValidTimestampString(event.timestamp) &&
    isUnknownProperties(event.properties)
  );
}

export function applySynchronousMcpEventPolicy(
  snapshot: PolicySnapshot,
  event: McpBeforeSendEvent,
): McpBeforeSendEvent | null {
  try {
    if (!hasValidMcpEnvelope(event) || !isAutomaticEventName(event.event)) {
      return null;
    }

    const marker = readOwn(event.properties, ACTOR_MARKER);
    if (!isActorPseudonym(marker) || !hasExpectedProjection(event.properties, snapshot)) {
      return null;
    }

    const properties = normaliseAutomaticProperties(event.event, event.properties, snapshot);
    if (properties === null) {
      return null;
    }

    return {
      distinct_id: marker,
      event: event.event,
      properties,
      timestamp: event.timestamp,
      type: 'capture',
    };
  } catch {
    reportSafely(snapshot.reportOperationalError, 'posthog_event_policy_failed');
    return null;
  }
}
