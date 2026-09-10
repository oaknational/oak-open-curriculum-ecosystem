import { describe, expect, it } from 'vitest';
import { unwrap, unwrapErr } from '@oaknational/result';
import { OAK_SERVER_BRANDING } from '../server-branding.js';
import { REGISTRY_DESCRIPTION_MAX_LENGTH } from './server-json-constraints.js';
import { MCP_SERVER_NAME } from './server-json-inputs.js';
import {
  assertRemoteMatchesServedResource,
  buildServerJsonDocument,
  SERVER_JSON_SCHEMA_URL,
  type ServerJsonInputs,
} from './server-json.js';

const CANONICAL_MCP_URL = 'https://mcp.thenational.academy/mcp';

/** A catalogue line of the shape a publisher supplies, inside the cap. */
const CATALOGUE_DESCRIPTION =
  'Search, explore and download Oak curriculum resources for KS1 to KS4.';

/**
 * The inputs a real publication supplies, with the namespace left as the
 * GitHub-organisation candidate. Cases override one field each, so a failure
 * names exactly the constraint under test.
 */
function publicationInputs(overrides: Partial<ServerJsonInputs> = {}): ServerJsonInputs {
  return {
    namespace: 'io.github.oaknational',
    serverName: MCP_SERVER_NAME,
    servedMcpUrl: CANONICAL_MCP_URL,
    version: '1.179.0',
    title: OAK_SERVER_BRANDING.title,
    description: CATALOGUE_DESCRIPTION,
    websiteUrl: OAK_SERVER_BRANDING.websiteUrl,
    repositoryUrl: 'https://github.com/oaknational/oak-open-curriculum-ecosystem',
    repositorySource: 'github',
    ...overrides,
  };
}

describe('buildServerJsonDocument', () => {
  it('publishes a remote-only entry naming the served endpoint as a streamable-http remote', () => {
    const document = unwrap(buildServerJsonDocument(publicationInputs()));

    expect(document.remotes).toEqual([{ type: 'streamable-http', url: CANONICAL_MCP_URL }]);
    expect(document).not.toHaveProperty('packages');
  });

  it('joins the namespace and the served server name into one reverse-DNS registry name', () => {
    const document = unwrap(buildServerJsonDocument(publicationInputs()));

    expect(document.name).toBe(`io.github.oaknational/${MCP_SERVER_NAME}`);
  });

  it('carries the dated schema URL the registry serves entries against', () => {
    const document = unwrap(buildServerJsonDocument(publicationInputs()));

    expect(document.$schema).toBe(SERVER_JSON_SCHEMA_URL);
  });

  it('carries the repository, so the source can be inspected', () => {
    const document = unwrap(buildServerJsonDocument(publicationInputs()));

    expect(document.repository).toEqual({
      url: 'https://github.com/oaknational/oak-open-curriculum-ecosystem',
      source: 'github',
    });
  });

  it('carries the branding title and website the server already publishes', () => {
    const document = unwrap(buildServerJsonDocument(publicationInputs()));

    expect(document.title).toBe(OAK_SERVER_BRANDING.title);
    expect(document.websiteUrl).toBe(OAK_SERVER_BRANDING.websiteUrl);
  });

  it('composes the Oak-domain namespace as readily as the GitHub one', () => {
    const document = unwrap(
      buildServerJsonDocument(publicationInputs({ namespace: 'academy.thenational' })),
    );

    expect(document.name).toBe(`academy.thenational/${MCP_SERVER_NAME}`);
  });

  it('accepts a description exactly at the registry cap', () => {
    const description = 'x'.repeat(REGISTRY_DESCRIPTION_MAX_LENGTH);
    const document = unwrap(buildServerJsonDocument(publicationInputs({ description })));

    expect(document.description).toBe(description);
  });

  it.each([
    {
      constraint: 'a namespace carrying its own slash, which would make two separators',
      overrides: { namespace: 'io.github.oaknational/' },
      expected: 'is not a registry namespace',
    },
    {
      constraint: 'a namespace with an underscore, which the registry allows only after the slash',
      overrides: { namespace: 'io.github.oak_national' },
      expected: 'is not a registry namespace',
    },
    {
      // The published JSON Schema pattern would accept this; the registry's
      // own semantic validator does not, so neither does the builder.
      constraint: 'a namespace that does not end alphanumeric, as the registry does',
      overrides: { namespace: 'academy.thenational.' },
      expected: 'is not a registry namespace',
    },
    {
      constraint: 'a server name that is not a name segment',
      overrides: { serverName: '-oak-curriculum-http' },
      expected: 'is not a registry name segment',
    },
    {
      constraint: 'a description over the cap, rather than truncating it',
      overrides: { description: 'x'.repeat(REGISTRY_DESCRIPTION_MAX_LENGTH + 1) },
      expected: `1 to ${String(REGISTRY_DESCRIPTION_MAX_LENGTH)}`,
    },
    {
      constraint: 'an empty description',
      overrides: { description: '' },
      expected: 'description is 0 characters',
    },
    {
      constraint: 'a title over the cap',
      overrides: { title: 'x'.repeat(REGISTRY_DESCRIPTION_MAX_LENGTH + 1) },
      expected: 'title is',
    },
    {
      constraint: 'a version range, which the registry rejects',
      overrides: { version: '^1.179.0' },
      expected: 'is not semantic',
    },
    {
      // No laptop can publish an endpoint no client could reach.
      constraint: 'a local development origin',
      overrides: { servedMcpUrl: 'http://localhost:3333/mcp' },
      expected: 'CANONICAL_HOST',
    },
    {
      constraint: 'a plain-http public endpoint',
      overrides: { servedMcpUrl: 'http://mcp.thenational.academy/mcp' },
      expected: 'not a publishable https URL',
    },
    {
      // https clears the scheme rule, so only the host rule catches this one.
      // Measured 2026-09-10: the registry answers valid:false, "invalid
      // remote URL", for exactly this URL.
      constraint: 'an https loopback endpoint',
      overrides: { servedMcpUrl: 'https://localhost:3000/mcp' },
      expected: 'names a loopback host',
    },
    {
      constraint: 'an https endpoint on the loopback address',
      overrides: { servedMcpUrl: 'https://127.0.0.1/mcp' },
      expected: 'names a loopback host',
    },
    {
      constraint: 'an https endpoint under the .localhost suffix',
      overrides: { servedMcpUrl: 'https://oak.localhost/mcp' },
      expected: 'names a loopback host',
    },
  ])('refuses $constraint', ({ overrides, expected }) => {
    expect(unwrapErr(buildServerJsonDocument(publicationInputs(overrides)))).toContain(expected);
  });
});

describe('assertRemoteMatchesServedResource', () => {
  it('passes the document through when the deployment serves that exact resource', () => {
    const document = unwrap(buildServerJsonDocument(publicationInputs()));

    expect(unwrap(assertRemoteMatchesServedResource(document, CANONICAL_MCP_URL))).toBe(document);
  });

  it('refuses a document whose endpoint the deployment does not claim, showing both', () => {
    const document = unwrap(buildServerJsonDocument(publicationInputs()));

    const failure = unwrapErr(
      assertRemoteMatchesServedResource(document, 'https://www.thenational.academy/mcp'),
    );

    expect(failure).toContain('https://www.thenational.academy/mcp');
    expect(failure).toContain(CANONICAL_MCP_URL);
  });

  it('refuses a trailing-slash disagreement, because a resource comparison is exact', () => {
    const document = unwrap(buildServerJsonDocument(publicationInputs()));

    expect(
      unwrapErr(assertRemoteMatchesServedResource(document, `${CANONICAL_MCP_URL}/`)),
    ).toContain('does not claim');
  });
});
