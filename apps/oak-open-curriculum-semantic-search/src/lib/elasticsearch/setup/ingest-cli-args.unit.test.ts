import { describe, it, expect } from 'vitest';
import { parseArgs } from './ingest-cli-args.js';

describe('parseArgs', () => {
  it('parses --index flag with valid kind', () => {
    const result = parseArgs(['--index', 'lessons']);
    expect(result.indexes).toEqual(['lessons']);
  });

  it('accepts multiple --index flags', () => {
    const result = parseArgs(['--index', 'lessons', '--index', 'units']);
    expect(result.indexes).toEqual(['lessons', 'units']);
  });

  it('defaults to empty array when --index not specified', () => {
    const result = parseArgs([]);
    expect(result.indexes).toEqual([]);
  });

  it('throws for invalid index kind', () => {
    expect(() => parseArgs(['--index', 'invalid'])).toThrow('Invalid index kind');
  });

  it('preserves other flags when --index is used', () => {
    const result = parseArgs(['--index', 'lessons', '--subject', 'maths', '--dry-run']);
    expect(result.indexes).toEqual(['lessons']);
    expect(result.subjects).toEqual(['maths']);
    expect(result.dryRun).toBe(true);
  });
});
