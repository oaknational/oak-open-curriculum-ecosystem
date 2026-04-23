import { describe, expect, it } from 'vitest';
import { createDeployEntryHandler } from './deploy-entry-handler.js';

interface TestRequest {
  readonly path: string;
}

interface TestResponse {
  readonly writes: string[];
}

describe('createDeployEntryHandler', () => {
  it('loads the deployed handler once and reuses it across requests', async () => {
    let loads = 0;

    const handler = createDeployEntryHandler<TestRequest, TestResponse>({
      loadHandler: async () => {
        loads += 1;
        return (request, response) => {
          response.writes.push(request.path);
        };
      },
    });

    const firstResponse: TestResponse = { writes: [] };
    const secondResponse: TestResponse = { writes: [] };

    await handler({ path: '/healthz' }, firstResponse);
    await handler({ path: '/mcp' }, secondResponse);

    expect(loads).toBe(1);
    expect(firstResponse.writes).toEqual(['/healthz']);
    expect(secondResponse.writes).toEqual(['/mcp']);
  });

  it('shares the in-flight load across concurrent requests', async () => {
    let loads = 0;
    let resolveHandler:
      | ((value: (request: TestRequest, response: TestResponse) => void) => void)
      | undefined;

    const handler = createDeployEntryHandler<TestRequest, TestResponse>({
      loadHandler: async () => {
        loads += 1;
        return await new Promise((resolve) => {
          resolveHandler = resolve;
        });
      },
    });

    const firstResponse: TestResponse = { writes: [] };
    const secondResponse: TestResponse = { writes: [] };

    const firstRequest = handler({ path: '/first' }, firstResponse);
    const secondRequest = handler({ path: '/second' }, secondResponse);

    expect(loads).toBe(1);

    resolveHandler?.((request, response) => {
      response.writes.push(request.path);
    });

    await Promise.all([firstRequest, secondRequest]);

    expect(firstResponse.writes).toEqual(['/first']);
    expect(secondResponse.writes).toEqual(['/second']);
  });

  it('clears a failed load so the next request can retry', async () => {
    let attempts = 0;

    const handler = createDeployEntryHandler<TestRequest, TestResponse>({
      loadHandler: async () => {
        attempts += 1;

        if (attempts === 1) {
          throw new Error('bootstrap failed');
        }

        return (request, response) => {
          response.writes.push(request.path);
        };
      },
    });

    await expect(handler({ path: '/first' }, { writes: [] })).rejects.toThrow('bootstrap failed');

    const retryResponse: TestResponse = { writes: [] };
    await handler({ path: '/second' }, retryResponse);

    expect(attempts).toBe(2);
    expect(retryResponse.writes).toEqual(['/second']);
  });
});
