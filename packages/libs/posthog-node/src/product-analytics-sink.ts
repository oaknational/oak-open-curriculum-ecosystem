import type { ResolvedRelease } from '@oaknational/build-metadata';
import type {
  ProductAnalyticsCaptureContext,
  ProductAnalyticsEvent,
  ProductAnalyticsSink,
} from '@oaknational/observability';
import type { EventMessage } from 'posthog-node';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import { projectActiveActor } from './active-actor-projection.js';
import {
  OAK_MCP_SERVER_NAME,
  POSTHOG_MCP_SOURCE,
  RESOURCE_READ_EVENT_NAME,
} from './event-policy-contract.js';
import {
  isUnknownProperties,
  isValidDuration,
  isValidTimestamp,
  readOwn,
  reportSafely,
} from './event-policy-helpers.js';
import type { PostHogOperationalErrorKind } from './product-analytics-runtime-contract.js';

interface ProductAnalyticsCaptureClient {
  capture(event: EventMessage): void;
}

export interface PostHogProductAnalyticsSinkConfig {
  readonly release: ResolvedRelease;
  readonly serverVersion: string;
  readonly servedResourceNames: readonly string[];
  readonly activeActorProjector: ActivePostHogActorProjector;
  readonly reportOperationalError: (kind: PostHogOperationalErrorKind) => void;
}

interface SinkSnapshot {
  readonly environment: ResolvedRelease['environment'];
  readonly release: string;
  readonly serverVersion: string;
  readonly servedResourceNames: ReadonlySet<string>;
  readonly activeActorProjector: ActivePostHogActorProjector;
  readonly reportOperationalError: (kind: PostHogOperationalErrorKind) => void;
}

function isValidResourceRead(
  value: unknown,
  servedResourceNames: ReadonlySet<string>,
): value is ProductAnalyticsEvent {
  if (!isUnknownProperties(value)) {
    return false;
  }

  const resourceName = readOwn(value, 'resourceName');
  return (
    readOwn(value, 'kind') === 'mcp_resource_read' &&
    typeof resourceName === 'string' &&
    servedResourceNames.has(resourceName) &&
    isValidTimestamp(readOwn(value, 'startedAt')) &&
    isValidDuration(readOwn(value, 'durationMs')) &&
    typeof readOwn(value, 'isError') === 'boolean'
  );
}

function readVerifiedActorId(value: unknown): string | null {
  if (!isUnknownProperties(value)) {
    return null;
  }
  const actorId = readOwn(value, 'verifiedActorId');
  return typeof actorId === 'string' && actorId.length > 0 ? actorId : null;
}

function buildResourceReadMessage(
  snapshot: SinkSnapshot,
  event: ProductAnalyticsEvent,
  distinctId: string,
): EventMessage {
  return {
    distinctId,
    event: RESOURCE_READ_EVENT_NAME,
    timestamp: new Date(event.startedAt.getTime()),
    properties: {
      $mcp_source: POSTHOG_MCP_SOURCE,
      $mcp_server_name: OAK_MCP_SERVER_NAME,
      $mcp_server_version: snapshot.serverVersion,
      oak_environment: snapshot.environment,
      oak_release: snapshot.release,
      $mcp_resource_name: event.resourceName,
      $mcp_duration_ms: event.durationMs,
      $mcp_is_error: event.isError,
    },
  };
}

function captureResourceRead(
  client: ProductAnalyticsCaptureClient,
  snapshot: SinkSnapshot,
  event: ProductAnalyticsEvent,
  context: ProductAnalyticsCaptureContext,
): void {
  if (!isValidResourceRead(event, snapshot.servedResourceNames)) {
    return;
  }

  const actorId = readVerifiedActorId(context);
  if (actorId === null) {
    return;
  }

  const distinctId = projectActiveActor(snapshot, actorId);
  if (distinctId === null) {
    return;
  }

  try {
    client.capture(buildResourceReadMessage(snapshot, event, distinctId));
  } catch {
    reportSafely(snapshot.reportOperationalError, 'posthog_client_delivery_failed');
  }
}

function snapshotSinkConfig(config: PostHogProductAnalyticsSinkConfig): SinkSnapshot {
  return {
    environment: config.release.environment,
    release: config.release.value,
    serverVersion: config.serverVersion,
    servedResourceNames: new Set(config.servedResourceNames),
    activeActorProjector: config.activeActorProjector,
    reportOperationalError: config.reportOperationalError,
  };
}

export function createPostHogProductAnalyticsSink(
  client: ProductAnalyticsCaptureClient,
  config: PostHogProductAnalyticsSinkConfig,
): ProductAnalyticsSink {
  const snapshot = snapshotSinkConfig(config);
  return {
    capture: (event, context) => captureResourceRead(client, snapshot, event, context),
  };
}
