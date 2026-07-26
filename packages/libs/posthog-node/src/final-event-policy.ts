import type { EventMessage } from 'posthog-node';

import {
  RESOURCE_READ_EVENT_NAME,
  type NormalisedEvent,
  type PolicySnapshot,
  type UnknownProperties,
} from './event-policy-contract.js';
import { isAutomaticEventName, normaliseAutomaticProperties } from './automatic-event-policy.js';
import {
  commonProperties,
  hasExpectedCommonProperties,
  isActorPseudonym,
  isUnknownProperties,
  isValidDuration,
  isValidOptionalUuid,
  isValidTimestamp,
  readOwn,
  reportSafely,
} from './event-policy-helpers.js';

type ValidFinalEnvelope = EventMessage & {
  readonly distinctId: string;
  readonly properties: UnknownProperties;
  readonly timestamp: Date;
};

function normaliseResourceReadProperties(
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
): UnknownProperties | null {
  const resourceName = readOwn(properties, '$mcp_resource_name');
  const duration = readOwn(properties, '$mcp_duration_ms');
  const isError = readOwn(properties, '$mcp_is_error');

  if (
    typeof resourceName !== 'string' ||
    !snapshot.servedResourceNames.has(resourceName) ||
    !isValidDuration(duration) ||
    typeof isError !== 'boolean'
  ) {
    return null;
  }

  return {
    ...commonProperties(snapshot),
    $mcp_resource_name: resourceName,
    $mcp_duration_ms: duration,
    $mcp_is_error: isError,
  };
}

function normaliseFinalEvent(
  event: string,
  properties: UnknownProperties,
  snapshot: PolicySnapshot,
): NormalisedEvent | null {
  if (!hasExpectedCommonProperties(properties, snapshot)) {
    return null;
  }

  if (isAutomaticEventName(event)) {
    const automatic = normaliseAutomaticProperties(event, properties, snapshot);
    return automatic === null ? null : { event, properties: automatic };
  }

  if (event !== RESOURCE_READ_EVENT_NAME) {
    return null;
  }

  const resource = normaliseResourceReadProperties(properties, snapshot);
  return resource === null ? null : { event, properties: resource };
}

function hasValidFinalEnvelope(event: EventMessage | null): event is ValidFinalEnvelope {
  return (
    isUnknownProperties(event) &&
    isActorPseudonym(event.distinctId) &&
    isValidTimestamp(event.timestamp) &&
    isValidOptionalUuid(event.uuid) &&
    isUnknownProperties(event.properties)
  );
}

export function applyFinalOakEventPolicy(
  snapshot: PolicySnapshot,
  event: EventMessage | null,
): EventMessage | null {
  try {
    if (!hasValidFinalEnvelope(event)) {
      return null;
    }

    const normalised = normaliseFinalEvent(event.event, event.properties, snapshot);
    if (normalised === null) {
      return null;
    }

    return {
      distinctId: event.distinctId,
      event: normalised.event,
      properties: normalised.properties,
      timestamp: new Date(event.timestamp),
      ...(event.uuid === undefined ? {} : { uuid: event.uuid }),
    };
  } catch {
    reportSafely(snapshot.reportOperationalError, 'posthog_event_policy_failed');
    return null;
  }
}
