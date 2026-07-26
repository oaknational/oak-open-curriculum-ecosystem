import type { ResolvedRelease } from '@oaknational/build-metadata';
import type { BeforeSendFn, McpCaptureCommon } from '@posthog/mcp';
import type { EventMessage } from 'posthog-node';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import type { PostHogOperationalErrorKind } from './product-analytics-runtime-contract.js';

export const POSTHOG_MCP_SOURCE = 'posthog_mcp_analytics';
export const OAK_MCP_SERVER_NAME = 'oak-curriculum-http';
export const ACTOR_MARKER = '__oak_posthog_distinct_id';

export const AUTOMATIC_EVENT_NAMES = {
  initialize: '$mcp_initialize',
  toolsList: '$mcp_tools_list',
  toolCall: '$mcp_tool_call',
} as const;

export const RESOURCE_READ_EVENT_NAME = '$mcp_resource_read';

export type AutomaticEventName = (typeof AUTOMATIC_EVENT_NAMES)[keyof typeof AUTOMATIC_EVENT_NAMES];
type AcceptedEventName = AutomaticEventName | typeof RESOURCE_READ_EVENT_NAME;
export type McpBeforeSendEvent = Parameters<BeforeSendFn>[0];
export type OakClientFamily = 'chatgpt' | 'claude' | 'other';
export type UnknownProperties = NonNullable<McpCaptureCommon['properties']>;

export interface McpRequest {
  readonly method?: string;
  readonly params?: UnknownProperties;
}

export type McpRequestExtra = unknown;

export interface PostHogEventPolicyConfig {
  readonly release: ResolvedRelease;
  readonly serverVersion: string;
  readonly servedToolNames: readonly string[];
  readonly servedResourceNames: readonly string[];
  readonly activeActorProjector: ActivePostHogActorProjector;
  readonly reportOperationalError: (kind: PostHogOperationalErrorKind) => void;
}

export interface PostHogEventPolicies {
  readonly projectVerifiedIdentityAndRelease: (
    request: McpRequest,
    extra?: McpRequestExtra,
  ) => UnknownProperties | null;
  readonly synchronousMcpEventPolicy: (event: McpBeforeSendEvent) => McpBeforeSendEvent | null;
  readonly finalOakEventPolicy: (event: EventMessage | null) => EventMessage | null;
}

export interface PolicySnapshot {
  readonly environment: ResolvedRelease['environment'];
  readonly release: string;
  readonly serverVersion: string;
  readonly servedToolNames: ReadonlySet<string>;
  readonly servedResourceNames: ReadonlySet<string>;
  readonly activeActorProjector: ActivePostHogActorProjector;
  readonly reportOperationalError: (kind: PostHogOperationalErrorKind) => void;
}

export interface NormalisedEvent {
  readonly event: AcceptedEventName;
  readonly properties: UnknownProperties;
}
