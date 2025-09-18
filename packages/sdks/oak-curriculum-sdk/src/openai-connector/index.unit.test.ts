import { describe, it, expect, vi } from 'vitest';
import type { createOakPathBasedClient } from '../client/index.js';
import { executeOpenAiToolCall, isOpenAiToolName } from '..';

// Simple smoke tests with a real client require API key; here we stub the client shape minimally
const fakeClient = {
  ['/search/lessons']: { GET: vi.fn(() => Promise.resolve({ results: [] })) },
  ['/search/transcripts']: { GET: vi.fn(() => Promise.resolve({ results: [] })) },
  ['/lessons/{lesson}/summary']: { GET: vi.fn(() => Promise.resolve({ lesson: {} })) },
  ['/units/{unit}/summary']: { GET: vi.fn(() => Promise.resolve({ unit: {} })) },
  ['/subjects/{subject}']: { GET: vi.fn(() => Promise.resolve({ subject: {} })) },
  ['/sequences/{sequence}/units']: { GET: vi.fn(() => Promise.resolve({ units: [] })) },
  ['/threads/{threadSlug}/units']: { GET: vi.fn(() => Promise.resolve({ units: [] })) },
} as unknown as ReturnType<typeof createOakPathBasedClient>;

describe('OpenAI connector helpers', () => {
  it('isOpenAiToolName guards', () => {
    expect(isOpenAiToolName('search')).toBe(true);
    expect(isOpenAiToolName('fetch')).toBe(true);
    expect(isOpenAiToolName('other')).toBe(false);
  });

  it('executes search with string arg', async () => {
    const result = await executeOpenAiToolCall('search', 'fractions', fakeClient);
    expect(result).toHaveProperty('q', 'fractions');
    expect(result).toHaveProperty('lessons');
    expect(result).toHaveProperty('transcripts');
  });

  it('executes fetch for lesson id', async () => {
    const result = await executeOpenAiToolCall(
      'fetch',
      { id: 'lesson:add-two-numbers' },
      fakeClient,
    );
    expect(result).toHaveProperty('id', 'lesson:add-two-numbers');
    expect(result).toHaveProperty('type', 'lesson');
    expect(result).toHaveProperty('canonicalUrl');
  });
});
