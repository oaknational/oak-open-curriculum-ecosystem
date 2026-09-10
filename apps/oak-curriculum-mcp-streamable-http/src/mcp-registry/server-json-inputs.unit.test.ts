import { describe, expect, it } from 'vitest';
import { unwrap, unwrapErr } from '@oaknational/result';
import { OAK_SERVER_BRANDING } from '../server-branding.js';
import {
  MCP_SERVER_NAME,
  resolveServedOriginInputs,
  resolveServerJsonInputs,
} from './server-json-inputs.js';

/**
 * Every case passes `APP_VERSION_OVERRIDE`, which is the branch
 * `resolveApplicationVersion` takes without reading the repository's
 * `package.json` — so these stay pure, as the tier requires.
 */
const VERSION = '1.179.0';

const NAMESPACE = 'academy.thenational';

/** The catalogue line a publisher supplies; see REGISTRY_DESCRIPTION_ENV. */
const DESCRIPTION = 'Search, explore and download Oak curriculum resources for KS1 to KS4.';

/** The two values a publication must supply, in every passing case. */
const SUPPLIED = {
  MCP_REGISTRY_NAMESPACE: NAMESPACE,
  MCP_REGISTRY_DESCRIPTION: DESCRIPTION,
  APP_VERSION_OVERRIDE: VERSION,
} as const;

describe('resolveServerJsonInputs', () => {
  it('names both candidate namespaces when the decision has not been made', () => {
    const failure = unwrapErr(
      resolveServerJsonInputs({
        MCP_REGISTRY_DESCRIPTION: DESCRIPTION,
        CANONICAL_HOST: 'mcp.thenational.academy',
      }),
    );

    expect(failure).toContain('io.github.oaknational');
    expect(failure).toContain('academy.thenational');
    expect(failure).toContain('MCP_REGISTRY_NAMESPACE');
  });

  it.each([{ namespace: '' }, { namespace: '   ' }])(
    'treats a blank namespace ($namespace) as undecided',
    ({ namespace }) => {
      expect(
        unwrapErr(
          resolveServerJsonInputs({
            MCP_REGISTRY_NAMESPACE: namespace,
            MCP_REGISTRY_DESCRIPTION: DESCRIPTION,
          }),
        ),
      ).toContain('MCP_REGISTRY_NAMESPACE');
    },
  );

  it('says why the catalogue description is supplied when it is missing', () => {
    const failure = unwrapErr(
      resolveServerJsonInputs({
        MCP_REGISTRY_NAMESPACE: NAMESPACE,
        CANONICAL_HOST: 'mcp.thenational.academy',
      }),
    );

    expect(failure).toContain('MCP_REGISTRY_DESCRIPTION');
    expect(failure).toContain('100');
    expect(failure).toContain('113');
  });

  it('takes the endpoint from the configured canonical host', () => {
    const inputs = unwrap(
      resolveServerJsonInputs({
        ...SUPPLIED,
        CANONICAL_HOST: 'mcp.thenational.academy',
      }),
    );

    expect(inputs.servedMcpUrl).toBe('https://mcp.thenational.academy/mcp');
  });

  it('prefers the canonical host over the Vercel hostname the edge presents', () => {
    // Behind the edge the Host header names the Vercel project, so the
    // canonical host must win or the entry advertises the origin.
    const inputs = unwrap(
      resolveServerJsonInputs({
        ...SUPPLIED,
        CANONICAL_HOST: 'mcp.thenational.academy',
        VERCEL_ENV: 'production',
        VERCEL_PROJECT_PRODUCTION_URL: 'poc-oak-mcp.vercel.app',
      }),
    );

    expect(inputs.servedMcpUrl).toBe('https://mcp.thenational.academy/mcp');
  });

  it('falls back to the Vercel production hostname when no canonical host is configured', () => {
    const inputs = unwrap(
      resolveServerJsonInputs({
        ...SUPPLIED,
        VERCEL_ENV: 'production',
        VERCEL_PROJECT_PRODUCTION_URL: 'poc-oak-mcp.vercel.app',
      }),
    );

    expect(inputs.servedMcpUrl).toBe('https://poc-oak-mcp.vercel.app/mcp');
  });

  it('resolves a local development origin, which the builder then refuses', () => {
    const inputs = unwrap(
      resolveServerJsonInputs({
        ...SUPPLIED,
        PORT: '4000',
      }),
    );

    expect(inputs.servedMcpUrl).toBe('http://localhost:4000/mcp');
  });

  it('takes the identity and branding from the homes the server already publishes them from', () => {
    const inputs = unwrap(
      resolveServerJsonInputs({
        ...SUPPLIED,
        CANONICAL_HOST: 'mcp.thenational.academy',
      }),
    );

    expect(inputs.serverName).toBe(MCP_SERVER_NAME);
    expect(inputs.title).toBe(OAK_SERVER_BRANDING.title);
    expect(inputs.description).toBe(DESCRIPTION);
    expect(inputs.websiteUrl).toBe(OAK_SERVER_BRANDING.websiteUrl);
    expect(inputs.version).toBe(VERSION);
    expect(inputs.repositorySource).toBe('github');
  });

  it('trims the namespace, so a copied-in value with whitespace still publishes correctly', () => {
    const inputs = unwrap(
      resolveServerJsonInputs({
        ...SUPPLIED,
        MCP_REGISTRY_NAMESPACE: ` ${NAMESPACE} `,
        CANONICAL_HOST: 'mcp.thenational.academy',
      }),
    );

    expect(inputs.namespace).toBe(NAMESPACE);
  });
});

describe('resolveServedOriginInputs', () => {
  it('reads one environment into the inputs both the endpoint and the probe use', () => {
    expect(
      resolveServedOriginInputs({ CANONICAL_HOST: 'mcp.thenational.academy', PORT: '3333' }),
    ).toEqual({ canonicalOrigin: 'https://mcp.thenational.academy', portEnv: '3333' });
  });

  it('omits what the environment did not say, rather than inventing a default', () => {
    expect(resolveServedOriginInputs({})).toEqual({});
  });
});
