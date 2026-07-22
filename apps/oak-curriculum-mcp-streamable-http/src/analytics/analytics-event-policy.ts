/**
 * The D3 analytics boundary policy — the single gate every event passes
 * through before leaving the process for PostHog.
 *
 * Implements the owner-ratified Phase-1 analytics posture (release decisions
 * register D3, 2026-07-21) as an ALLOW-LIST: event names and properties are
 * prohibited by default and pass only by being named here. This is the
 * "enforced by validation at the emitting boundary" mechanism the posture
 * requires — a vendor upgrade that introduces a new content-bearing property
 * fails closed instead of leaking.
 *
 * Wired as the vendor `beforeSend` hook (`@posthog/mcp`), which runs once per
 * emitted event including any custom captures a later slice adds — so the
 * boundary is built once and every future event class inherits it.
 *
 * @see analytics-event-policy.unit.test.ts — the red-first adversarial suite
 *   named by MCP-63's definition of done.
 */
import { typeSafeEntries } from '@oaknational/type-helpers';
import type { BeforeSendFn } from '@posthog/mcp';

/**
 * The capture payload the vendor hands to `beforeSend` — derived from the
 * exported hook type so a vendor contract change is a compile error here.
 */
export type PostHogCaptureEvent = Parameters<BeforeSendFn>[0];

/**
 * Protocol event names the integration serves. Everything else — including the
 * vendor's `$exception` sibling (Sentry owns errors), `$identify` (Phase 1
 * creates no person profiles), `$mcp_missing_capability` (virtual tool
 * disabled), and `$mcp_custom` — is dropped.
 */
export const ALLOWED_ANALYTICS_EVENT_NAMES: readonly string[] = [
  '$mcp_initialize',
  '$mcp_tools_list',
  '$mcp_tool_call',
  '$mcp_resources_list',
  '$mcp_resource_read',
  '$mcp_prompts_list',
  '$mcp_prompt_get',
];

/**
 * Properties allowed to leave the process. Three groups: vendor protocol
 * metadata that carries no user or curriculum content; PostHog runtime
 * markers; and this app's operational correlation properties. The prohibited
 * classes (`$mcp_parameters`, `$mcp_response`, `$mcp_intent`,
 * `$mcp_error_message`, and anything unknown) are absent by construction —
 * prohibited-by-default means they are never listed, not stripped by name.
 * `$mcp_protocol_version` is included ahead of the vendor version that emits
 * it so the upgrade needs no policy change.
 */
const ALLOWED_PROPERTY_NAMES: ReadonlySet<string> = new Set([
  // Vendor protocol metadata (non-content).
  '$mcp_client_name',
  '$mcp_client_version',
  '$mcp_duration_ms',
  '$mcp_error_type',
  '$mcp_is_error',
  '$mcp_listed_tool_names',
  '$mcp_protocol_version',
  '$mcp_resource_name',
  '$mcp_server_name',
  '$mcp_server_version',
  '$mcp_source',
  '$mcp_tool_category',
  '$mcp_tool_name',
  '$session_id',
  // PostHog runtime markers.
  '$lib',
  '$lib_version',
  '$process_person_profile',
  // App operational correlation properties (set via `eventProperties`).
  'environment',
  'deployment_sha',
  'server_version',
  'request_id',
  'trace_id',
]);

/**
 * Applies the D3 boundary to one capture event. Pure: the input is never
 * mutated. Returns `null` to drop an event whose name is not allow-listed;
 * otherwise returns a new event carrying only allow-listed properties, with
 * the no-person-profile invariant recomputed (`$process_person_profile` is
 * always `false`, never trusted from the input).
 */
export function enforceAnalyticsEventPolicy(
  event: PostHogCaptureEvent,
): PostHogCaptureEvent | null {
  if (!ALLOWED_ANALYTICS_EVENT_NAMES.includes(event.event)) {
    return null;
  }
  const properties: PostHogCaptureEvent['properties'] = {};
  for (const [key, value] of typeSafeEntries(event.properties)) {
    if (ALLOWED_PROPERTY_NAMES.has(key)) {
      properties[key] = value;
    }
  }
  properties.$process_person_profile = false;
  return { ...event, properties };
}
