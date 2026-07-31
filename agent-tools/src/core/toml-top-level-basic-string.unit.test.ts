import { describe, expect, it } from 'vitest';

import {
  createTopLevelTomlBasicStringReader,
  readOptionalTopLevelTomlBasicString,
  readRequiredTopLevelTomlBasicString,
} from './toml-top-level-basic-string.js';

describe('createTopLevelTomlBasicStringReader', () => {
  it('distinguishes omitted, string, and present non-string values', () => {
    const readValue = createTopLevelTomlBasicStringReader(`model = "gpt-5.6-sol"
invalid_model = 42
`);

    expect(
      readOptionalTopLevelTomlBasicString(readValue, 'omitted_model', 'adapter.toml'),
    ).toBeNull();
    expect(readOptionalTopLevelTomlBasicString(readValue, 'model', 'adapter.toml')).toBe(
      'gpt-5.6-sol',
    );
    expect(() =>
      readOptionalTopLevelTomlBasicString(readValue, 'invalid_model', 'adapter.toml'),
    ).toThrow("adapter.toml TOML key 'invalid_model' must be a string when present.");
  });
});

describe('readRequiredTopLevelTomlBasicString', () => {
  it('returns a present top-level string', () => {
    const readValue = createTopLevelTomlBasicStringReader('model_reasoning_effort = "high"');

    expect(
      readRequiredTopLevelTomlBasicString(readValue, 'model_reasoning_effort', 'adapter.toml'),
    ).toBe('high');
  });

  it('reports an absent required string as missing', () => {
    const readValue = createTopLevelTomlBasicStringReader('');

    expect(() =>
      readRequiredTopLevelTomlBasicString(readValue, 'model_reasoning_effort', 'adapter.toml'),
    ).toThrow("adapter.toml is missing required TOML key 'model_reasoning_effort'.");
  });

  it('reports a present non-string required value as a type error', () => {
    const readValue = createTopLevelTomlBasicStringReader('model_reasoning_effort = 42');

    expect(() =>
      readRequiredTopLevelTomlBasicString(readValue, 'model_reasoning_effort', 'adapter.toml'),
    ).toThrow("adapter.toml TOML key 'model_reasoning_effort' must be a string when present.");
  });
});
