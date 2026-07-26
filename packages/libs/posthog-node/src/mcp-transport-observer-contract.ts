import type {
  OakClientFamily,
  PostHogEventPolicyConfig,
  UnknownProperties,
} from './event-policy-contract.js';

export interface PostHogMcpCaptureProperties extends UnknownProperties {
  readonly $mcp_is_error?: false;
  readonly $mcp_listed_tool_names?: readonly string[];
  readonly $mcp_server_name: string;
  readonly $mcp_server_version: string;
  readonly $mcp_source: string;
  readonly oak_client_family?: OakClientFamily;
  readonly oak_environment: PostHogEventPolicyConfig['release']['environment'];
  readonly oak_release: string;
}

interface PostHogMcpCommonCapture {
  readonly distinctId: string;
  readonly properties: PostHogMcpCaptureProperties;
}

interface PostHogMcpInitializeCapture extends PostHogMcpCommonCapture {
  readonly protocolVersion: string;
}

interface PostHogMcpToolsListCapture extends PostHogMcpCommonCapture {
  readonly durationMs: number;
  readonly isError: boolean;
  readonly toolNames?: string[];
}

interface PostHogMcpToolCallCapture extends PostHogMcpCommonCapture {
  readonly durationMs: number;
  readonly isError: boolean;
  readonly toolName: string;
}

/**
 * Narrow official-manual PostHog MCP capture surface used by the observer.
 *
 * @remarks The capture records intentionally omit session identifiers, request
 * parameters, response bodies, errors, client versions, person properties, and
 * groups. `PostHogMCP` satisfies this surface without exposing the vendor
 * client through the Oak runtime.
 */
export interface PostHogMcpCaptureClient {
  captureInitialize(data: PostHogMcpInitializeCapture): void;
  captureToolsList(data: PostHogMcpToolsListCapture): void;
  captureToolCall(data: PostHogMcpToolCallCapture): void;
}

export interface ProjectedMcpRequest {
  readonly distinctId: string;
  readonly properties: PostHogMcpCaptureProperties;
  readonly clientFamily?: OakClientFamily;
}

interface PendingBase extends ProjectedMcpRequest {
  readonly startedAt: number;
}

export interface PendingInitialize extends PendingBase {
  readonly kind: 'initialize';
  readonly clientFamily: OakClientFamily;
  readonly requestedProtocolVersion: string | undefined;
}

export interface PendingToolsList extends PendingBase {
  readonly kind: 'tools_list';
}

export interface PendingToolCall extends PendingBase {
  readonly kind: 'tool_call';
  readonly toolName: string;
}

export type PendingMcpRequest = PendingInitialize | PendingToolsList | PendingToolCall;

export interface McpObserverSnapshot {
  readonly serverVersion: string;
  readonly environment: PostHogEventPolicyConfig['release']['environment'];
  readonly release: string;
  readonly servedToolNames: ReadonlySet<string>;
}

export type McpObserverClock = () => number;
