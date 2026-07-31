#!/usr/bin/env node

/**
 * App-owned registration proof for MCP-103's current-source projection.
 *
 * Runs the real HTTP composition root over an in-memory MCP transport and
 * emits JSON for the repository validator. No host-delivery claim is made.
 */

import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { typeSafeEntries } from '@oaknational/type-helpers';
import {
  AGENT_GUIDANCE_RESOURCES,
  getAgentGuidanceContent,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { SERVED_SURFACE } from '../served-surface/served-surface.js';
import { createConnectedClient } from './connected-client.js';
import {
  buildGuidanceRegistrationEvidenceByUri,
  type ServedState,
} from './current-source-guidance-registration-evidence.js';
import { requireGuidanceListParity } from './guidance-list-parity.js';
import { requireGuidanceReadResultParity } from './guidance-read-parity.js';
import { requireMcpErrorCode } from './require-mcp-error-code.js';

type PolicyEntry = readonly [string, ServedState];
const alphabetical = (left: string, right: string) => left.localeCompare(right);

function selectors(
  entries: readonly (readonly [string, ServedState])[],
  state: ServedState,
): readonly string[] {
  return entries
    .filter((entry) => entry[1] === state)
    .map((entry) => entry[0])
    .sort(alphabetical);
}

function requireSameMembers(
  label: string,
  expected: readonly string[],
  actual: readonly string[],
): void {
  const expectedSorted = [...expected].sort(alphabetical);
  const actualSorted = [...actual].sort(alphabetical);
  if (JSON.stringify(expectedSorted) !== JSON.stringify(actualSorted)) {
    throw new Error(`${label} differs from served-surface policy`);
  }
}

function expectedGuidanceListings() {
  return AGENT_GUIDANCE_RESOURCES.map(
    ({ name, uri, title, description, mimeType, annotations }) => ({
      name,
      uri,
      title,
      description,
      mimeType,
      annotations,
    }),
  );
}

async function requirePromptMethodUnavailable(client: Client): Promise<void> {
  try {
    await client.listPrompts();
  } catch (error: unknown) {
    requireMcpErrorCode(error, ErrorCode.MethodNotFound, 'prompts/list');
    return;
  }
  throw new Error('prompts/list unexpectedly succeeded');
}

async function requireGuidanceReadParity(
  client: Client,
  liveResourceUris: ReadonlySet<string>,
): Promise<void> {
  for (const resource of AGENT_GUIDANCE_RESOURCES) {
    const expected = getAgentGuidanceContent(resource.uri);
    if (expected === undefined) {
      throw new Error(`Guidance has no canonical body: ${resource.uri}`);
    }
    if (!liveResourceUris.has(resource.uri)) {
      try {
        await client.readResource({ uri: resource.uri });
      } catch (error: unknown) {
        requireMcpErrorCode(error, ErrorCode.InvalidParams, `resources/read ${resource.uri}`);
        continue;
      }
      throw new Error(`Dormant guidance is readable: ${resource.uri}`);
    }
    const readResult = await client.readResource({ uri: resource.uri });
    requireGuidanceReadResultParity(
      {
        contents: [
          {
            uri: resource.uri,
            mimeType: resource.mimeType,
            text: expected,
            _meta: { lastModified: resource.lastModified },
          },
        ],
      },
      readResult,
    );
  }
}

interface ObservedSurface {
  readonly toolPolicy: readonly PolicyEntry[];
  readonly resourcePolicy: Readonly<Record<string, ServedState>>;
  readonly resourceEntries: readonly PolicyEntry[];
  readonly liveTools: readonly string[];
  readonly liveResources: readonly string[];
}

async function observeSurface(client: Client): Promise<ObservedSurface> {
  const toolPolicy: readonly PolicyEntry[] = [
    ...typeSafeEntries(SERVED_SURFACE.universalTools),
    ...typeSafeEntries(SERVED_SURFACE.appLocalTools),
  ];
  const resourcePolicy: Readonly<Record<string, ServedState>> = SERVED_SURFACE.resources;
  const resourceEntries: readonly PolicyEntry[] = typeSafeEntries(resourcePolicy);
  const liveTools = (await client.listTools()).tools.map((tool) => tool.name).sort(alphabetical);
  const listedResources = (await client.listResources()).resources;
  const liveResources = listedResources.map((resource) => resource.uri).sort(alphabetical);
  requireSameMembers('tools/list', selectors(toolPolicy, 'live'), liveTools);
  requireSameMembers('resources/list', selectors(resourceEntries, 'live'), liveResources);
  requireGuidanceListParity(
    expectedGuidanceListings(),
    listedResources,
    new Set(selectors(resourceEntries, 'live')),
  );
  await requirePromptMethodUnavailable(client);
  if (client.getServerCapabilities()?.prompts !== undefined) {
    throw new Error('Initialize capabilities unexpectedly advertise prompts');
  }
  const instructions = client.getInstructions();
  if (instructions === undefined || instructions.trim() === '') {
    throw new Error('Initialize result has no server instructions');
  }
  await requireGuidanceReadParity(client, new Set(liveResources));
  return { toolPolicy, resourcePolicy, resourceEntries, liveTools, liveResources };
}

function buildProof(observed: ObservedSurface) {
  return {
    root: {
      id: 'oak-curriculum-http',
      rootRef: 'apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts',
      transport: 'streamable-http',
      registrationRef: 'apps/oak-curriculum-mcp-streamable-http/src/handlers.ts',
      proof:
        'In-memory MCP initialize, tools/list, resources/list, guidance resources/read, and prompts/list walk',
      observation: {
        initialize: { instructions: 'present' },
        tools: {
          live: observed.liveTools,
          dormant: selectors(observed.toolPolicy, 'dormant'),
        },
        resources: {
          live: observed.liveResources,
          dormant: selectors(observed.resourceEntries, 'dormant'),
        },
        prompts: { capability: 'absent', list: 'method-not-found' },
      },
    },
    guidanceRegistrationsByUri: buildGuidanceRegistrationEvidenceByUri(observed.resourcePolicy),
  };
}

async function collectRegistrationProof() {
  const client = await createConnectedClient();
  try {
    return buildProof(await observeSurface(client));
  } finally {
    await client.close();
  }
}

process.stdout.write(`${JSON.stringify(await collectRegistrationProof())}\n`);
