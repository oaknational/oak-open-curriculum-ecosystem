import { describe, it, expect } from 'vitest';
import { setRequestContext, getRequestContext } from './request-context.js';
import type { Request } from 'express';

describe('request-context', () => {
  it('should store and retrieve request context', async () => {
    const mockRequest = { path: '/test' } as Request;
    let retrieved: Request | undefined;

    await setRequestContext(mockRequest, () => {
      retrieved = getRequestContext();
      return Promise.resolve();
    });

    expect(retrieved).toBe(mockRequest);
  });

  it('should return undefined outside context', () => {
    const result = getRequestContext();
    expect(result).toBeUndefined();
  });

  it('should isolate contexts in concurrent executions', async () => {
    const req1 = { path: '/req1' } as Request;
    const req2 = { path: '/req2' } as Request;
    const results: (Request | undefined)[] = [];

    await Promise.all([
      setRequestContext(req1, async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        results.push(getRequestContext());
      }),
      setRequestContext(req2, () => {
        results.push(getRequestContext());
        return Promise.resolve();
      }),
    ]);

    expect(results).toContain(req1);
    expect(results).toContain(req2);
  });
});
