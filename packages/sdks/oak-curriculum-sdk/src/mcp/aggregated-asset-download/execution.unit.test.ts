import { describe, it, expect } from 'vitest';
import { validateDownloadAssetArgs, runDownloadAssetTool } from './execution.js';

describe('validateDownloadAssetArgs', () => {
  it('accepts valid lesson and type', () => {
    const result = validateDownloadAssetArgs({ lesson: 'my-lesson', type: 'worksheet' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ lesson: 'my-lesson', type: 'worksheet' });
    }
  });

  it('rejects missing lesson', () => {
    const result = validateDownloadAssetArgs({ type: 'worksheet' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain('lesson');
    }
  });

  it('rejects missing type', () => {
    const result = validateDownloadAssetArgs({ lesson: 'my-lesson' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain('type');
    }
  });

  it('rejects invalid asset type', () => {
    const result = validateDownloadAssetArgs({ lesson: 'my-lesson', type: 'notAType' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain('type');
    }
  });

  it('rejects empty lesson string', () => {
    const result = validateDownloadAssetArgs({ lesson: '', type: 'worksheet' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain('lesson');
    }
  });

  it('rejects non-object input', () => {
    const result = validateDownloadAssetArgs('not-an-object');

    expect(result.ok).toBe(false);
  });

  it('rejects null input', () => {
    const result = validateDownloadAssetArgs(null);

    expect(result.ok).toBe(false);
  });
});

describe('runDownloadAssetTool', () => {
  const stubUrlFactory = (lesson: string, type: string): string =>
    `https://example.com/assets/download/${lesson}/${type}?sig=abc&exp=999`;

  it('returns a formatted tool response with the download URL', () => {
    const result = runDownloadAssetTool(
      { lesson: 'my-lesson', type: 'worksheet' },
      { createAssetDownloadUrl: stubUrlFactory },
    );

    expect(result.isError).toBeUndefined();

    const text = result.content[0];
    expect(text).toBeDefined();
    if (text && 'text' in text) {
      expect(text.text).toContain('https://example.com/assets/download/my-lesson/worksheet');
    }
  });

  it('includes lesson and type in the structured data', () => {
    const result = runDownloadAssetTool(
      { lesson: 'my-lesson', type: 'slideDeck' },
      { createAssetDownloadUrl: stubUrlFactory },
    );

    expect(result.structuredContent).toBeDefined();
    if (result.structuredContent) {
      expect(result.structuredContent).toHaveProperty('downloadUrl');
      expect(result.structuredContent).toHaveProperty('lesson', 'my-lesson');
      expect(result.structuredContent).toHaveProperty('type', 'slideDeck');
    }
  });
});
