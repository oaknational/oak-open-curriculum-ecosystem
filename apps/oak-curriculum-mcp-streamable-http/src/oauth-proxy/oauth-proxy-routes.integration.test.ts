import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import type { LogContextInput } from '@oaknational/logger';

import { createOAuthProxyRoutes, type OAuthProxyConfig } from './oauth-proxy-routes.js';
import type { HttpObservability } from '../observability/http-observability.js';

/** Stub logger that satisfies the ProxyLogger interface without producing output. */
const stubLogger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
  debug: () => undefined,
} as const;

const UPSTREAM_BASE = 'https://fake-clerk.example.com';

/**
 * Creates a proxy Express app with an injected fake `fetch`.
 * No real HTTP calls are made — the fake fetch returns canned responses.
 */
interface ObservabilitySpy extends Pick<HttpObservability, 'captureHandledError' | 'withSpan'> {
  readonly handledErrors: readonly {
    readonly error: unknown;
    readonly context?: LogContextInput;
  }[];
  readonly setAttribute: ReturnType<typeof vi.fn>;
  readonly spanCalls: readonly {
    readonly name: string;
    readonly attributes?: Record<string, unknown>;
  }[];
}

function createObservabilitySpy(): ObservabilitySpy {
  const handledErrors: { readonly error: unknown; readonly context?: LogContextInput }[] = [];
  const setAttribute = vi.fn<(name: string, value: unknown) => void>();
  const spanCalls: {
    readonly name: string;
    readonly attributes?: Record<string, unknown>;
  }[] = [];
  const withSpan: HttpObservability['withSpan'] = async ({ name, attributes, run }) => {
    spanCalls.push({ name, attributes });

    return await run({
      setAttribute,
      setAttributes(): void {
        // No-op in integration test.
      },
    });
  };
  const captureHandledError: HttpObservability['captureHandledError'] = (error, context) => {
    handledErrors.push({ error, context });
  };

  return {
    captureHandledError,
    handledErrors,
    setAttribute,
    spanCalls,
    withSpan,
  };
}

function createProxyApp(
  fakeFetch: OAuthProxyConfig['fetch'],
  timeoutMs?: number,
  observability?: OAuthProxyConfig['observability'],
): express.Express {
  const app = express();
  app.use(express.json());

  const config: OAuthProxyConfig = {
    upstreamBaseUrl: UPSTREAM_BASE,
    logger: stubLogger,
    fetch: fakeFetch,
    timeoutMs: timeoutMs ?? 2000,
    observability,
  };

  app.use(createOAuthProxyRoutes(config));
  return app;
}

/**
 * Creates a fake fetch that returns a JSON response for all requests.
 * Captures the most recent request URL, method, headers, and body for assertion.
 */
function createSimpleFakeFetch(
  status: number,
  responseBody: unknown,
): {
  fetch: NonNullable<OAuthProxyConfig['fetch']>;
  captured: { url?: string; method?: string; body?: string };
} {
  const captured: { url?: string; method?: string; body?: string } = {};
  const fakeFetch: NonNullable<OAuthProxyConfig['fetch']> = async (input, init) => {
    captured.url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : String(input);
    captured.method = init?.method;
    captured.body = typeof init?.body === 'string' ? init.body : undefined;

    return new Response(JSON.stringify(responseBody), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return { fetch: fakeFetch, captured };
}

describe('POST /oauth/register', () => {
  it('forwards DCR request body to upstream and returns response', async () => {
    const { fetch: fakeFetch, captured } = createSimpleFakeFetch(200, {
      client_id: 'registered-client-id',
      client_secret: 'registered-secret',
      client_name: 'Cursor',
    });

    const app = createProxyApp(fakeFetch);

    const res = await request(app)
      .post('/oauth/register')
      .send({
        client_name: 'Cursor',
        redirect_uris: ['cursor://callback'],
        token_endpoint_auth_method: 'none',
      })
      .expect(200);

    expect(res.body.client_id).toBe('registered-client-id');
    expect(res.body.client_name).toBe('Cursor');
    expect(captured.url).toBe(`${UPSTREAM_BASE}/oauth/register`);
    expect(captured.method).toBe('POST');
  });

  it('creates a safe manual span for the upstream register call', async () => {
    const observability = createObservabilitySpy();
    const { fetch: fakeFetch } = createSimpleFakeFetch(200, {
      client_id: 'registered-client-id',
    });

    const app = createProxyApp(fakeFetch, undefined, observability);

    await request(app).post('/oauth/register').send({ client_name: 'Cursor' }).expect(200);

    const expectedRegisterAttrs: unknown = expect.objectContaining({
      'http.route': '/oauth/register',
      'oak.upstream.host': 'fake-clerk.example.com',
    });
    expect(observability.spanCalls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'oak.http.oauth-proxy.register',
          attributes: expectedRegisterAttrs,
        }),
      ]),
    );
    expect(observability.setAttribute).toHaveBeenCalledWith('oak.upstream.status', 200);
  });
});

describe('GET /oauth/authorize', () => {
  it('redirects to upstream with all query parameters preserved', async () => {
    const { fetch: fakeFetch } = createSimpleFakeFetch(200, {});
    const app = createProxyApp(fakeFetch);

    const res = await request(app)
      .get('/oauth/authorize')
      .query({
        client_id: 'test-client',
        redirect_uri: 'http://localhost/callback',
        response_type: 'code',
        state: 'random-state',
        code_challenge: 'challenge-value',
        code_challenge_method: 'S256',
        scope: 'openid email',
      })
      .expect(302);

    const location: unknown = res.headers.location;
    expect(typeof location).toBe('string');
    if (typeof location === 'string') {
      expect(location).toContain(`${UPSTREAM_BASE}/oauth/authorize`);
      expect(location).toContain('client_id=test-client');
      expect(location).toContain('response_type=code');
      expect(location).toContain('state=random-state');
      expect(location).toContain('code_challenge=challenge-value');
      expect(location).toContain('scope=openid');
    }
  });
});

describe('POST /oauth/token', () => {
  it('forwards authorization_code grant to upstream', async () => {
    const { fetch: fakeFetch, captured } = createSimpleFakeFetch(200, {
      access_token: 'oat_test_access_token',
      token_type: 'Bearer',
      expires_in: 3600,
    });

    const app = createProxyApp(fakeFetch);

    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send(
        'grant_type=authorization_code&code=auth-code-123&code_verifier=verifier-456&redirect_uri=http%3A%2F%2Flocalhost%2Fcallback&client_id=test-client',
      )
      .expect(200);

    expect(res.body.access_token).toBe('oat_test_access_token');
    expect(res.body.token_type).toBe('Bearer');
    expect(captured.url).toBe(`${UPSTREAM_BASE}/oauth/token`);
    expect(captured.method).toBe('POST');
    expect(captured.body).toContain('grant_type=authorization_code');
  });

  it('forwards refresh_token grant to upstream', async () => {
    const { fetch: fakeFetch, captured } = createSimpleFakeFetch(200, {
      access_token: 'oat_test_access_token',
      token_type: 'Bearer',
      expires_in: 3600,
    });

    const app = createProxyApp(fakeFetch);

    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send('grant_type=refresh_token&refresh_token=rt_test_refresh&client_id=test-client')
      .expect(200);

    expect(res.body.access_token).toBe('oat_test_access_token');
    expect(captured.body).toContain('grant_type=refresh_token');
  });

  it('transparently forwards unknown parameters to upstream', async () => {
    const { fetch: fakeFetch, captured } = createSimpleFakeFetch(200, {
      access_token: 'oat_test_access_token',
      token_type: 'Bearer',
    });

    const app = createProxyApp(fakeFetch);

    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send(
        'grant_type=authorization_code&code=auth-code-123&code_verifier=verifier-456&client_id=test-client&resource=https%3A%2F%2Fexample.com%2Fmcp',
      )
      .expect(200);

    expect(res.body.access_token).toBe('oat_test_access_token');
    expect(captured.body).toContain('resource=');
  });

  it('forwards any grant type without filtering', async () => {
    const { fetch: fakeFetch, captured } = createSimpleFakeFetch(200, {
      access_token: 'oat_test_access_token',
      token_type: 'Bearer',
    });

    const app = createProxyApp(fakeFetch);

    await request(app)
      .post('/oauth/token')
      .type('form')
      .send('grant_type=client_credentials&client_id=test-client&client_secret=test-secret')
      .expect(200);

    expect(captured.body).toContain('grant_type=client_credentials');
  });

  it('creates a safe manual span for the upstream token call', async () => {
    const observability = createObservabilitySpy();
    const { fetch: fakeFetch } = createSimpleFakeFetch(200, {
      access_token: 'oat_test_access_token',
      token_type: 'Bearer',
    });

    const app = createProxyApp(fakeFetch, undefined, observability);

    await request(app)
      .post('/oauth/token')
      .type('form')
      .send('grant_type=client_credentials&client_id=test-client&client_secret=test-secret')
      .expect(200);

    const expectedTokenAttrs: unknown = expect.objectContaining({
      'http.route': '/oauth/token',
      'oak.upstream.host': 'fake-clerk.example.com',
    });
    expect(observability.spanCalls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'oak.http.oauth-proxy.token',
          attributes: expectedTokenAttrs,
        }),
      ]),
    );
    expect(observability.setAttribute).toHaveBeenCalledWith('oak.upstream.status', 200);
  });
});

describe('upstream error passthrough', () => {
  it('passes through upstream 4xx response verbatim', async () => {
    const { fetch: fakeFetch } = createSimpleFakeFetch(401, {
      error: 'invalid_client',
      error_description: 'Client authentication failed',
    });

    const app = createProxyApp(fakeFetch);

    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send(
        'grant_type=authorization_code&code=bad-code&code_verifier=verifier&client_id=test-client',
      );

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('invalid_client');
  });

  it('passes through upstream 5xx response verbatim', async () => {
    const { fetch: fakeFetch } = createSimpleFakeFetch(500, {
      error: 'server_error',
      error_description: 'Internal server error',
    });

    const app = createProxyApp(fakeFetch);

    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send(
        'grant_type=authorization_code&code=some-code&code_verifier=verifier&client_id=test-client',
      );

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('server_error');
  });

  it('does not capture handled errors for expected upstream status responses', async () => {
    const observability = createObservabilitySpy();
    const { fetch: fakeFetch } = createSimpleFakeFetch(401, {
      error: 'invalid_client',
    });

    const app = createProxyApp(fakeFetch, undefined, observability);

    await request(app)
      .post('/oauth/token')
      .type('form')
      .send(
        'grant_type=authorization_code&code=bad-code&code_verifier=verifier&client_id=test-client',
      )
      .expect(401);

    expect(observability.handledErrors).toHaveLength(0);
  });
});

describe('upstream timeout and unreachability', () => {
  it('returns 504 when upstream does not respond within timeout', async () => {
    const observability = createObservabilitySpy();
    const neverResolveFetch: NonNullable<OAuthProxyConfig['fetch']> = async (...args) => {
      const init = args[1];
      return new Promise<Response>((...promiseArgs) => {
        const reject = promiseArgs[1];
        const signal = init?.signal;
        if (signal) {
          signal.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'));
          });
        }
      });
    };

    const app = createProxyApp(neverResolveFetch, 100, observability);

    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send(
        'grant_type=authorization_code&code=some-code&code_verifier=verifier&client_id=test-client',
      );

    expect(res.status).toBe(504);
    expect(res.body.error).toBe('temporarily_unavailable');
    const expectedTimeoutError: unknown = expect.any(Error);
    const expectedTimeoutContext: unknown = expect.objectContaining({
      boundary: 'oauth_proxy_upstream',
      route: '/oauth/token',
      status: 504,
      errorKind: 'timeout',
    });
    expect(observability.handledErrors).toEqual([
      expect.objectContaining({
        error: expectedTimeoutError,
        context: expectedTimeoutContext,
      }),
    ]);
  });

  it('returns 502 when upstream is unreachable', async () => {
    const observability = createObservabilitySpy();
    const networkErrorFetch: NonNullable<OAuthProxyConfig['fetch']> = async () => {
      throw new TypeError('fetch failed');
    };

    const app = createProxyApp(networkErrorFetch, undefined, observability);

    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send(
        'grant_type=authorization_code&code=some-code&code_verifier=verifier&client_id=test-client',
      );

    expect(res.status).toBe(502);
    expect(res.body.error).toBe('temporarily_unavailable');
    const expectedNetworkError: unknown = expect.any(TypeError);
    const expectedNetworkContext: unknown = expect.objectContaining({
      boundary: 'oauth_proxy_upstream',
      route: '/oauth/token',
      status: 502,
      errorKind: 'network',
    });
    expect(observability.handledErrors).toEqual([
      expect.objectContaining({
        error: expectedNetworkError,
        context: expectedNetworkContext,
      }),
    ]);
  });
});
