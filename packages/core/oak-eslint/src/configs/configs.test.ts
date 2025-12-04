import { describe, it, expect } from 'vitest';
import { recommended } from './recommended.js';
import { strict } from './strict.js';
import { react } from './react.js';
import { next } from './next.js';

describe('ESLint Configs', () => {
  it('should export recommended config', () => {
    expect(recommended).toBeDefined();
    expect(Array.isArray(recommended)).toBe(true);
    expect(recommended.length).toBeGreaterThan(0);
  });

  it('should export strict config', () => {
    expect(strict).toBeDefined();
    expect(Array.isArray(strict)).toBe(true);
    expect(strict.length).toBeGreaterThan(0);
  });

  it('should export react config', () => {
    expect(react).toBeDefined();
    expect(Array.isArray(react)).toBe(true);
    expect(react.length).toBeGreaterThan(0);
  });

  it('should export next config', () => {
    expect(next).toBeDefined();
    expect(Array.isArray(next)).toBe(true);
    expect(next.length).toBeGreaterThan(0);
  });
});
