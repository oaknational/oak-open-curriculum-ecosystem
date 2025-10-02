import { describe, expect, it, vi } from 'vitest';

const redirectMock = vi.fn<(url: string) => never>();

vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

describe('/search route', () => {
  it('redirects to the landing page', async () => {
    redirectMock.mockImplementation(() => {
      throw new Error('redirected');
    });

    const { default: searchRedirect } = await import('./page');

    expect(() => searchRedirect()).toThrow('redirected');
    expect(redirectMock).toHaveBeenCalledWith('/');
  });
});
