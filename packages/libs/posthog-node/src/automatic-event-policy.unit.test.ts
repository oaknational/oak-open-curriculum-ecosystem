import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/sdk/types.js';
import { err } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { normaliseAutomaticProperties } from './automatic-event-policy.js';
import type { PolicySnapshot, UnknownProperties } from './event-policy-contract.js';

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

describe('normaliseAutomaticProperties', () => {
  it.each([
    ['missing', undefined],
    ['non-boolean', 'false'],
  ])('drops initialize when the success signal is %s', (_label, isError) => {
    const properties: UnknownProperties = {
      oak_client_family: 'chatgpt',
      $mcp_protocol_version: SUPPORTED_PROTOCOL_VERSIONS[0],
      ...(isError === undefined ? {} : { $mcp_is_error: isError }),
    };

    expect(normaliseAutomaticProperties('$mcp_initialize', properties, SNAPSHOT)).toBeNull();
  });
});
