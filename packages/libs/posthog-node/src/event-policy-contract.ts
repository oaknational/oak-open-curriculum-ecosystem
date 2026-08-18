import type { ResolvedRelease } from '@oaknational/build-metadata';
import type { McpCaptureCommon } from '@posthog/mcp';
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
export type OakClientFamily = 'chatgpt' | 'claude' | 'other';
export type OakClientSurface = 'cli' | 'sdk' | 'vscode' | 'web' | 'other';

/**
 * Which MCP client *product* is calling, at vendor-product granularity.
 *
 * @remarks A third, orthogonal axis to the other two client categories, and the
 * only one that answers "is this tool's error rate one misbehaving client, or a
 * defect every teacher hits?" (MCP-594). `OakClientFamily` is vendor-grained and
 * reachable only from the `initialize` handshake, which ADR-112's per-request
 * transport cannot carry onto a later `tools/call`. `OakClientSurface` is *form
 * factor*, so it merges Claude Code and Codex into `cli` — collapsing exactly
 * the distinction the error-rate question needs. This axis derives per request
 * from the self-declaring client header, so it is present on every event.
 *
 * Deliberately NOT PostHog's `$mcp_client_name` / `$mcp_client_user_agent` /
 * `$mcp_vendor_client`, which its own `harness` column resolves from. Those
 * carry raw client-controlled strings, which ADR-218 §3 excludes from the
 * envelope. Live traffic contains opaque per-installation identifiers arriving
 * as `clientInfo.name`, so forwarding the raw value would place a stable
 * per-installation identifier in the analytics envelope. Only the closed
 * category below is ever emitted; the raw string never leaves this process.
 *
 * `other` and `unavailable` are separate members on purpose, and the line between
 * them is **container readability, not value presence**:
 *
 * - `other` — the header container was readable and named no product we
 *   recognise, including when it carried no client header at all. Any client may
 *   choose that, so this is a measurement and its share is expected to be
 *   non-zero.
 * - `unavailable` — the header container was missing or opaque to an
 *   own-property read, so the derivation could not run. Only a transport-shape
 *   change produces it, which is why it can be read as a defect signal.
 *
 * Drawing the line at value presence instead would let any client raise
 * `unavailable` by omitting its User-Agent, making a supposed transport alarm
 * client-influenceable — the same false-green, one layer up, that this axis
 * exists to remove.
 *
 * The value is an **unauthenticated self-declaration**: any client can send
 * `user-agent: claude-code/…`. It is sound for analytics aggregates and must
 * never gate access, quota, rate limiting, or entitlement.
 */
export type OakClientProduct = 'claude_ai' | 'claude_code' | 'codex' | 'other' | 'unavailable';
export type UnknownProperties = NonNullable<McpCaptureCommon['properties']>;

/**
 * The client-identity header values, carrying whether the container they came
 * from could be read at all.
 *
 * @remarks The discrimination is the point. Returning a bare value list conflates
 * "we could not look" with "we looked and there was nothing", and those are a
 * transport condition and a client condition respectively. See
 * {@link OakClientProduct}.
 */
export type ClientIdentityHeaders =
  { readonly readable: false } | { readonly readable: true; readonly values: readonly unknown[] };

export interface McpRequest {
  readonly method?: string;
  readonly params?: UnknownProperties;
}

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
    extra?: unknown,
  ) => UnknownProperties | null;
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
