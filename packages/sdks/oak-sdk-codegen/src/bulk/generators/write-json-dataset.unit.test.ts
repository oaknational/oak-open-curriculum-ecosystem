/**
 * Unit tests for the generic JSON dataset writer.
 *
 * @remarks
 * Tests the mechanical three-file output (data.json, types.ts, index.ts)
 * without coupling to any specific dataset shape.
 */
import { describe, expect, it } from 'vitest';

import { serializeDatasetToJson } from './write-json-dataset.js';

const sampleData = {
  version: '1.0.0',
  nodes: [{ id: 'a' }, { id: 'b' }],
};

describe('serializeDatasetToJson', () => {
  it('produces valid JSON from unknown data', () => {
    const json = serializeDatasetToJson(sampleData);
    const parsed: unknown = JSON.parse(json);

    expect(parsed).toStrictEqual(sampleData);
  });

  it('produces formatted JSON with 2-space indentation', () => {
    const json = serializeDatasetToJson(sampleData);

    expect(json).toContain('\n');
    expect(json).toContain('  "version"');
  });

  it('omits undefined fields so loaders can restore them explicitly', () => {
    const dataWithUndefined = { value: undefined, present: 'yes' };
    const json = serializeDatasetToJson(dataWithUndefined);
    const parsed: unknown = JSON.parse(json);

    expect(parsed).toStrictEqual({ present: 'yes' });
    expect(json).not.toContain('value');
  });
});
