/**
 * Behaviour of the D3 analytics boundary policy: every event leaving the
 * process for PostHog passes through `enforceAnalyticsEventPolicy`, which
 * implements the owner-ratified Phase-1 posture (decisions register D3) as an
 * allow-list — prohibited-by-default, not strip-known-bad. These tests are the
 * red-first proof the MCP-63 definition of done names.
 */
import { describe, expect, it } from 'vitest';

import {
  ALLOWED_ANALYTICS_EVENT_NAMES,
  enforceAnalyticsEventPolicy,
} from './analytics-event-policy.js';

/** A minimal conformant capture event, as the vendor's `beforeSend` delivers it. */
function conformantEvent(): {
  distinct_id: string;
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  type: 'capture';
} {
  return {
    distinct_id: 'session-abc123',
    event: '$mcp_tool_call',
    properties: {
      $mcp_client_name: 'claude-ai',
      $mcp_client_version: '1.2.3',
      $mcp_tool_name: 'search',
      $mcp_duration_ms: 42,
      $mcp_is_error: false,
      $session_id: 'sess-1',
      environment: 'production',
      deployment_sha: 'abc1234',
      server_version: '1.0.0',
      request_id: 'req-1',
      trace_id: 'trace-1',
    },
    timestamp: '2026-07-22T14:00:00.000Z',
    type: 'capture',
  };
}

describe('enforceAnalyticsEventPolicy', () => {
  it('passes a conformant protocol event through with its allow-listed properties intact', () => {
    const input = conformantEvent();
    const result = enforceAnalyticsEventPolicy(input);

    expect(result).not.toBeNull();
    expect(result?.event).toBe('$mcp_tool_call');
    expect(result?.properties).toMatchObject({
      $mcp_tool_name: 'search',
      $mcp_duration_ms: 42,
      $mcp_is_error: false,
      environment: 'production',
      deployment_sha: 'abc1234',
      request_id: 'req-1',
      trace_id: 'trace-1',
    });
  });

  it('removes every prohibited content-bearing property, whatever it carries', () => {
    const input = conformantEvent();
    input.properties.$mcp_parameters = { query: 'year 4 fractions, class notes: Alfie struggles' };
    input.properties.$mcp_response = 'Lesson 12: full transcript text …';
    input.properties.$mcp_intent = 'Teacher wants lessons for jane.doe@school.example';
    input.properties.$mcp_intent_source = 'context-parameter';
    input.properties.$mcp_error_message = 'no results for "asthma care plan for Priya"';
    input.properties.$mcp_conversation_id = 'conv-777';

    const result = enforceAnalyticsEventPolicy(input);

    expect(result).not.toBeNull();
    const keys = Object.keys(result?.properties ?? {});
    expect(keys).not.toContain('$mcp_parameters');
    expect(keys).not.toContain('$mcp_response');
    expect(keys).not.toContain('$mcp_intent');
    expect(keys).not.toContain('$mcp_intent_source');
    expect(keys).not.toContain('$mcp_error_message');
    expect(keys).not.toContain('$mcp_conversation_id');
  });

  it('fails closed on properties it has never seen — unknown keys do not pass', () => {
    const input = conformantEvent();
    input.properties.$mcp_future_content_prop = 'raw user text a future SDK version adds';
    input.properties.completely_novel = 'anything';

    const result = enforceAnalyticsEventPolicy(input);

    expect(Object.keys(result?.properties ?? {})).not.toContain('$mcp_future_content_prop');
    expect(Object.keys(result?.properties ?? {})).not.toContain('completely_novel');
  });

  it('enforces the no-person-profile invariant on every event', () => {
    const input = conformantEvent();
    input.properties.$process_person_profile = true;
    input.properties.$set = { email: 'teacher@school.example' };
    input.properties.$set_once = { first_seen: 'today' };

    const result = enforceAnalyticsEventPolicy(input);

    expect(result?.properties.$process_person_profile).toBe(false);
    expect(Object.keys(result?.properties ?? {})).not.toContain('$set');
    expect(Object.keys(result?.properties ?? {})).not.toContain('$set_once');
  });

  it('drops events whose name is not on the allow-list', () => {
    for (const event of [
      '$exception',
      '$identify',
      '$mcp_missing_capability',
      '$mcp_custom',
      'made_up_event',
    ]) {
      const input = { ...conformantEvent(), event };
      expect(enforceAnalyticsEventPolicy(input)).toBeNull();
    }
  });

  it('accepts exactly the protocol event names the integration serves', () => {
    for (const event of ALLOWED_ANALYTICS_EVENT_NAMES) {
      const input = { ...conformantEvent(), event };
      expect(enforceAnalyticsEventPolicy(input)?.event).toBe(event);
    }
  });

  it('never mutates its input', () => {
    const input = conformantEvent();
    input.properties.$mcp_parameters = 'raw';
    const snapshot = structuredClone(input);

    enforceAnalyticsEventPolicy(input);

    expect(input).toEqual(snapshot);
  });
});
