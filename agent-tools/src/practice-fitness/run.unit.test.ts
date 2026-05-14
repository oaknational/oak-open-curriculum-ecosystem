import { describe, expect, it } from 'vitest';

import {
  FITNESS_MODE_INFORMATIONAL,
  FITNESS_MODE_STRICT,
  FITNESS_MODE_STRICT_HARD,
  getExitCode,
} from './model.js';
import { getMode } from './run.js';

describe('getMode', () => {
  it('parses informational and strict-hard flags', () => {
    expect(getMode(['--informational'])).toBe(FITNESS_MODE_INFORMATIONAL);
    expect(getMode(['--strict-hard'])).toBe(FITNESS_MODE_STRICT_HARD);
    expect(getMode([])).toBe(FITNESS_MODE_STRICT);
  });
});

describe('getExitCode', () => {
  it('always exits 0 in informational mode regardless of zones', () => {
    expect(getExitCode('informational', ['healthy'])).toBe(0);
    expect(getExitCode('informational', ['soft', 'hard', 'critical'])).toBe(0);
    expect(getExitCode('informational', [])).toBe(0);
  });

  it('exits 0 in strict mode for healthy, soft, hard, and empty inputs', () => {
    expect(getExitCode('strict', ['healthy'])).toBe(0);
    expect(getExitCode('strict', ['soft'])).toBe(0);
    expect(getExitCode('strict', ['hard'])).toBe(0);
    expect(getExitCode('strict', ['healthy', 'soft', 'hard'])).toBe(0);
    expect(getExitCode('strict', [])).toBe(0);
  });

  it('exits 1 in strict mode only when any file reaches critical', () => {
    expect(getExitCode('strict', ['critical'])).toBe(1);
    expect(getExitCode('strict', ['healthy', 'soft', 'critical'])).toBe(1);
  });

  it('exits 1 in strict-hard mode when any file reaches hard or critical', () => {
    expect(getExitCode('strict-hard', ['hard'])).toBe(1);
    expect(getExitCode('strict-hard', ['critical'])).toBe(1);
    expect(getExitCode('strict-hard', ['healthy', 'soft'])).toBe(0);
    expect(getExitCode('strict-hard', [])).toBe(0);
  });
});
