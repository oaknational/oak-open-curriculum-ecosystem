import { describe, it, expect, vi } from 'vitest';
import { createAssetDownloadUrlFactory } from './asset-download-route.js';

describe('createAssetDownloadUrlFactory', () => {
  it('generates a URL with sig and exp query parameters', () => {
    const createSignature = vi.fn().mockReturnValue('deadbeef');
    const factory = createAssetDownloadUrlFactory(
      'https://mcp.example.com',
      createSignature,
      'secret',
      300_000,
    );

    const url = factory('my-lesson', 'worksheet');

    expect(url).toContain('https://mcp.example.com/assets/download/my-lesson/worksheet');
    expect(url).toContain('sig=deadbeef');
    expect(url).toContain('exp=');
  });

  it('URL-encodes lesson slugs with special characters', () => {
    const createSignature = vi.fn().mockReturnValue('abc');
    const factory = createAssetDownloadUrlFactory(
      'https://mcp.example.com',
      createSignature,
      'secret',
    );

    const url = factory('lesson/with spaces', 'worksheet');

    expect(url).toContain('lesson%2Fwith%20spaces');
  });

  it('uses injected clock for expiry calculation', () => {
    const createSignature = vi.fn().mockReturnValue('abc');
    const fixedNow = 1_000_000;
    const ttl = 60_000;
    const factory = createAssetDownloadUrlFactory(
      'https://mcp.example.com',
      createSignature,
      'secret',
      ttl,
      () => fixedNow,
    );

    factory('lesson', 'worksheet');

    expect(createSignature).toHaveBeenCalledWith('lesson', 'worksheet', fixedNow + ttl, 'secret');
  });
});
