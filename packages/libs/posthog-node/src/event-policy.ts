/**
 * Pure reconstruction policies for MCP product-analytics events.
 *
 * @remarks The first policy closes the official MCP instrumentation surface.
 * The second independently closes the PostHog Node client surface, including
 * Oak-authored resource-read events.
 */

import {
  type McpRequest,
  type PolicySnapshot,
  type PostHogEventPolicies,
  type PostHogEventPolicyConfig,
  type UnknownProperties,
  ACTOR_MARKER,
} from './event-policy-contract.js';
import { isUnknownProperties, normaliseOakClientFamily, readOwn } from './event-policy-helpers.js';
import { projectActiveActor } from './active-actor-projection.js';
import { applyFinalOakEventPolicy } from './final-event-policy.js';

function readInitializeClientName(request: McpRequest): unknown {
  if (request.method !== 'initialize' || !isUnknownProperties(request.params)) {
    return undefined;
  }

  const clientInfo = readOwn(request.params, 'clientInfo');
  return isUnknownProperties(clientInfo) ? readOwn(clientInfo, 'name') : undefined;
}

function readVerifiedActorId(extra?: unknown): string | null {
  if (!isUnknownProperties(extra)) {
    return null;
  }

  const authInfo = readOwn(extra, 'authInfo');
  if (!isUnknownProperties(authInfo)) {
    return null;
  }

  const authExtra = readOwn(authInfo, 'extra');
  if (!isUnknownProperties(authExtra)) {
    return null;
  }

  const userId = readOwn(authExtra, 'userId');
  return typeof userId === 'string' ? userId : null;
}

function projectVerifiedIdentityAndRelease(
  snapshot: PolicySnapshot,
  request: McpRequest,
  extra?: unknown,
): UnknownProperties | null {
  const actorId = readVerifiedActorId(extra);
  if (actorId === null) {
    return null;
  }

  const distinctId = projectActiveActor(snapshot, actorId);
  if (distinctId === null) {
    return null;
  }

  const projected: UnknownProperties = {
    [ACTOR_MARKER]: distinctId,
    oak_environment: snapshot.environment,
    oak_release: snapshot.release,
  };

  if (request.method === 'initialize') {
    projected.oak_client_family = normaliseOakClientFamily(readInitializeClientName(request));
  }
  return projected;
}

function snapshotPolicyConfig(config: PostHogEventPolicyConfig): PolicySnapshot {
  return {
    environment: config.release.environment,
    release: config.release.value,
    serverVersion: config.serverVersion,
    servedToolNames: new Set(config.servedToolNames),
    servedResourceNames: new Set(config.servedResourceNames),
    activeActorProjector: config.activeActorProjector,
    reportOperationalError: config.reportOperationalError,
  };
}

/**
 * Snapshots one immutable set of reconstruction policies for a runtime.
 */
export function createPostHogEventPolicies(config: PostHogEventPolicyConfig): PostHogEventPolicies {
  const snapshot = snapshotPolicyConfig(config);

  return {
    projectVerifiedIdentityAndRelease: (request, extra) =>
      projectVerifiedIdentityAndRelease(snapshot, request, extra),
    finalOakEventPolicy: (event) => applyFinalOakEventPolicy(snapshot, event),
  };
}

export type { PostHogEventPolicies, PostHogEventPolicyConfig } from './event-policy-contract.js';
