import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { useStream } from './useStream';

const okResponse = new Response('Completed', {
  status: 200,
  headers: { 'content-type': 'text/plain' },
});

const errorResponse = new Response('Missing required environment variables: ELASTICSEARCH_URL', {
  status: 400,
  headers: { 'content-type': 'text/plain' },
});

describe('useStream', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports success outcome when the request completes without errors', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(okResponse.clone());
    const { result } = renderHook(() => useStream('/api/admin/example'));

    await act(async () => {
      await result.current.run();
    });

    expect(result.current.state).toBe('success');
    expect(result.current.outcome?.status).toBe('success');
    expect(result.current.outcome?.message).toContain('status 200');
  });

  it('reports error outcome when the request fails', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(errorResponse.clone());
    const { result } = renderHook(() => useStream('/api/admin/example'));

    await act(async () => {
      await result.current.run();
    });

    expect(result.current.state).toBe('error');
    expect(result.current.outcome?.status).toBe('error');
    expect(result.current.text).toContain('Missing required environment variables');
    expect(result.current.outcome?.message).toContain('Missing required environment variables');
  });
});
