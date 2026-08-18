import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/sdk/types.js';
import { err } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { normaliseAutomaticProperties } from './automatic-event-policy.js';
import {
  AUTOMATIC_EVENT_NAMES,
  type PolicySnapshot,
  type UnknownProperties,
} from './event-policy-contract.js';

const SNAPSHOT = {
  environment: 'production',
  release: 'release-2026-07-26',
  serverVersion: '1.2.3',
  servedToolNames: new Set<string>(),
  servedResourceNames: new Set<string>(),
  activeActorProjector: {
    project: () => err({ kind: 'posthog_identity_projection_failed' }),
  },
  reportOperationalError: () => undefined,
} satisfies PolicySnapshot;

const AUTOMATIC_EVENT_SHAPES = [
  [
    'initialize',
    AUTOMATIC_EVENT_NAMES.initialize,
    {
      oak_client_family: 'chatgpt',
      $mcp_protocol_version: SUPPORTED_PROTOCOL_VERSIONS[0],
      $mcp_is_error: false,
    },
  ],
  [
    'tools-list error',
    AUTOMATIC_EVENT_NAMES.toolsList,
    { $mcp_duration_ms: 5, $mcp_is_error: true },
  ],
  [
    'tools-list success',
    AUTOMATIC_EVENT_NAMES.toolsList,
    { $mcp_duration_ms: 5, $mcp_is_error: false, $mcp_listed_tool_names: [] },
  ],
  [
    'tool-call',
    AUTOMATIC_EVENT_NAMES.toolCall,
    { $mcp_duration_ms: 5, $mcp_is_error: false, $mcp_tool_name: 'unserved' },
  ],
] as const;

describe('normaliseAutomaticProperties', () => {
  it.each([
    ['missing', undefined],
    ['non-boolean', 'false'],
  ])('drops initialize when the success signal is %s', (_label, isError) => {
    const properties: UnknownProperties = {
      oak_client_family: 'chatgpt',
      oak_client_product: 'other',
      oak_client_surface: 'other',
      $mcp_protocol_version: SUPPORTED_PROTOCOL_VERSIONS[0],
      ...(isError === undefined ? {} : { $mcp_is_error: isError }),
    };

    expect(normaliseAutomaticProperties('$mcp_initialize', properties, SNAPSHOT)).toBeNull();
  });

  it.each(AUTOMATIC_EVENT_SHAPES)(
    'strips the @posthog/mcp 0.11.x auto-captured client-identity properties from %s',
    (_label, event, base) => {
      const properties: UnknownProperties = {
        ...base,
        oak_client_product: 'other',
        oak_client_surface: 'other',
        $mcp_client_user_agent: 'claude-ai/1.0',
        $mcp_vendor_client: 'anthropic',
      };

      const normalised = normaliseAutomaticProperties(event, properties, SNAPSHOT);

      expect(normalised, 'a valid automatic event must survive normalisation').not.toBeNull();
      expect(
        normalised,
        'an undeclared upstream property must never reach the sink; declaring it is a reviewed policy edit',
      ).not.toHaveProperty('$mcp_client_user_agent');
      expect(
        normalised,
        'an undeclared upstream property must never reach the sink; declaring it is a reviewed policy edit',
      ).not.toHaveProperty('$mcp_vendor_client');
    },
  );

  it.each(AUTOMATIC_EVENT_SHAPES)(
    'carries the declared oak_client_surface category on %s',
    (_label, event, base) => {
      const normalised = normaliseAutomaticProperties(
        event,
        { ...base, oak_client_product: 'other', oak_client_surface: 'cli' },
        SNAPSHOT,
      );

      expect(normalised).not.toBeNull();
      expect(normalised).toHaveProperty('oak_client_surface', 'cli');
    },
  );

  it.each(AUTOMATIC_EVENT_SHAPES)(
    'drops %s when the required oak_client_surface is missing',
    (_label, event, base) => {
      expect(
        normaliseAutomaticProperties(event, { ...base, oak_client_product: 'other' }, SNAPSHOT),
      ).toBeNull();
    },
  );

  it.each(AUTOMATIC_EVENT_SHAPES)(
    'drops %s when oak_client_surface is outside the closed category set',
    (_label, event, base) => {
      const properties: UnknownProperties = {
        ...base,
        oak_client_product: 'other',
        oak_client_surface: 'browser',
      };

      expect(normaliseAutomaticProperties(event, properties, SNAPSHOT)).toBeNull();
    },
  );

  it.each(AUTOMATIC_EVENT_SHAPES)(
    'carries the declared oak_client_product category on %s',
    (_label, event, base) => {
      const normalised = normaliseAutomaticProperties(
        event,
        { ...base, oak_client_product: 'claude_code', oak_client_surface: 'other' },
        SNAPSHOT,
      );

      expect(normalised).not.toBeNull();
      expect(normalised).toHaveProperty('oak_client_product', 'claude_code');
    },
  );

  // A missing category must DROP the event, never default to 'other'. Defaulting
  // is what made `harness = other` unreadable: it cannot be told apart from a
  // derivation that ran and recognised nothing (MCP-594).
  it.each(AUTOMATIC_EVENT_SHAPES)(
    'drops %s when the required oak_client_product is missing',
    (_label, event, base) => {
      expect(
        normaliseAutomaticProperties(event, { ...base, oak_client_surface: 'other' }, SNAPSHOT),
      ).toBeNull();
    },
  );

  it.each(AUTOMATIC_EVENT_SHAPES)(
    'drops %s when oak_client_product is outside the closed category set',
    (_label, event, base) => {
      const properties: UnknownProperties = {
        ...base,
        oak_client_product: 'claude-code/2.1.226 (cli)',
        oak_client_surface: 'other',
      };

      expect(normaliseAutomaticProperties(event, properties, SNAPSHOT)).toBeNull();
    },
  );
});
