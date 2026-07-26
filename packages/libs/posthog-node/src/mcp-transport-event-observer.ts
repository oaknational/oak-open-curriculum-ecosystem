import type {
  JSONRPCMessage,
  JSONRPCRequest,
  MessageExtraInfo,
  RequestId,
} from '@modelcontextprotocol/sdk/types.js';

import {
  ACTOR_MARKER,
  OAK_MCP_SERVER_NAME,
  POSTHOG_MCP_SOURCE,
  type PostHogEventPolicyConfig,
} from './event-policy-contract.js';
import { isActorPseudonym, isUnknownProperties, readOwn } from './event-policy-helpers.js';
import { createPostHogEventPolicies } from './event-policy.js';
import {
  canonicalToolName,
  normaliseDuration,
  readClientFamily,
  readListedToolNames,
  readObservedRequest,
  readParams,
  readProtocolVersion,
  readResponseId,
  responseIsError,
  type ObservedMcpMethod,
} from './mcp-transport-event-reader.js';
import type {
  McpObserverSnapshot,
  McpObserverClock,
  PendingInitialize,
  PendingMcpRequest,
  PendingToolsList,
  PostHogMcpCaptureClient,
  ProjectedMcpRequest,
} from './mcp-transport-observer-contract.js';

export interface McpTransportEventObserver {
  observeRequest(message: JSONRPCMessage, extra?: MessageExtraInfo): void;
  observeResponse(message: JSONRPCMessage): void;
}

class PostHogMcpTransportEventObserver implements McpTransportEventObserver {
  private readonly client: PostHogMcpCaptureClient;
  private readonly snapshot: McpObserverSnapshot;
  private readonly projectRequest: ReturnType<
    typeof createPostHogEventPolicies
  >['projectVerifiedIdentityAndRelease'];
  private readonly now: McpObserverClock;
  private readonly pending = new Map<RequestId, PendingMcpRequest>();

  constructor(
    client: PostHogMcpCaptureClient,
    config: PostHogEventPolicyConfig,
    now: McpObserverClock,
  ) {
    this.client = client;
    this.now = now;
    this.snapshot = {
      serverVersion: config.serverVersion,
      environment: config.release.environment,
      release: config.release.value,
      servedToolNames: new Set(config.servedToolNames),
    };
    this.projectRequest = createPostHogEventPolicies(config).projectVerifiedIdentityAndRelease;
  }

  observeRequest(message: JSONRPCMessage, extra?: MessageExtraInfo): void {
    const observed = readObservedRequest(message);
    if (observed === null) {
      return;
    }
    const projected = this.project(observed.request, extra);
    if (projected === null) {
      return;
    }
    this.pending.set(
      observed.request.id,
      this.createPending(observed.method, observed.request, projected),
    );
  }

  observeResponse(message: JSONRPCMessage): void {
    const responseId = readResponseId(message);
    if (responseId === undefined) {
      return;
    }
    const pending = this.pending.get(responseId);
    if (pending === undefined) {
      return;
    }
    this.pending.delete(responseId);
    this.captureResponse(pending, message, normaliseDuration(pending.startedAt, this.now()));
  }

  private project(request: JSONRPCRequest, extra?: MessageExtraInfo): ProjectedMcpRequest | null {
    const projected = this.projectRequest(request, extra);
    if (projected === null) {
      return null;
    }
    const distinctId = readOwn(projected, ACTOR_MARKER);
    if (!isActorPseudonym(distinctId)) {
      return null;
    }
    const clientFamily = readClientFamily(readOwn(projected, 'oak_client_family'));
    return {
      distinctId,
      properties: {
        $mcp_source: POSTHOG_MCP_SOURCE,
        $mcp_server_name: OAK_MCP_SERVER_NAME,
        $mcp_server_version: this.snapshot.serverVersion,
        oak_environment: this.snapshot.environment,
        oak_release: this.snapshot.release,
      },
      ...(clientFamily === undefined ? {} : { clientFamily }),
    };
  }

  private createPending(
    method: ObservedMcpMethod,
    request: JSONRPCRequest,
    projected: ProjectedMcpRequest,
  ): PendingMcpRequest {
    const startedAt = this.now();
    const params = readParams(request);
    if (method === 'initialize') {
      return {
        ...projected,
        kind: 'initialize',
        clientFamily: projected.clientFamily ?? 'other',
        requestedProtocolVersion: readProtocolVersion(readOwn(params, 'protocolVersion')),
        startedAt,
      };
    }
    if (method === 'tools/list') {
      return { ...projected, kind: 'tools_list', startedAt };
    }
    return {
      ...projected,
      kind: 'tool_call',
      startedAt,
      toolName: canonicalToolName(readOwn(params, 'name'), this.snapshot.servedToolNames),
    };
  }

  private captureResponse(
    pending: PendingMcpRequest,
    message: JSONRPCMessage,
    durationMs: number,
  ): void {
    if (pending.kind === 'initialize') {
      this.captureInitialize(pending, message);
      return;
    }
    if (pending.kind === 'tools_list') {
      this.captureToolsList(pending, message, durationMs);
      return;
    }
    this.client.captureToolCall({
      distinctId: pending.distinctId,
      durationMs,
      isError: responseIsError(message),
      properties: { ...pending.properties },
      toolName: pending.toolName,
    });
  }

  private captureInitialize(pending: PendingInitialize, message: JSONRPCMessage): void {
    if (!('result' in message) || !isUnknownProperties(message.result)) {
      return;
    }
    const responseProtocolVersion = readOwn(message.result, 'protocolVersion');
    const protocolVersion =
      responseProtocolVersion === undefined
        ? pending.requestedProtocolVersion
        : readProtocolVersion(responseProtocolVersion);
    if (protocolVersion === undefined) {
      return;
    }
    this.client.captureInitialize({
      distinctId: pending.distinctId,
      properties: {
        ...pending.properties,
        $mcp_is_error: false,
        oak_client_family: pending.clientFamily,
      },
      protocolVersion,
    });
  }

  private captureToolsList(
    pending: PendingToolsList,
    message: JSONRPCMessage,
    durationMs: number,
  ): void {
    const isError = responseIsError(message);
    const toolNames = isError
      ? undefined
      : readListedToolNames(message, this.snapshot.servedToolNames);
    if (toolNames === null) {
      return;
    }
    this.client.captureToolsList({
      distinctId: pending.distinctId,
      durationMs,
      isError,
      ...(toolNames === undefined ? {} : { toolNames }),
      properties: {
        ...pending.properties,
        ...(toolNames === undefined ? {} : { $mcp_listed_tool_names: toolNames }),
      },
    });
  }
}

export function createMcpTransportEventObserver(
  client: PostHogMcpCaptureClient,
  config: PostHogEventPolicyConfig,
  now: McpObserverClock,
): McpTransportEventObserver {
  return new PostHogMcpTransportEventObserver(client, config, now);
}
