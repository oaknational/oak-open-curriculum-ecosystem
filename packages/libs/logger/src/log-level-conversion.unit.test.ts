import { describe, it, expect } from 'vitest';
import { convertLogLevel, toConsolaLevel } from './log-level-conversion';

describe('convertLogLevel', () => {
  it('should pass through numeric values unchanged', () => {
    expect(convertLogLevel(42)).toBe(42);
  });

  it('should convert TRACE to 0', () => {
    expect(convertLogLevel('TRACE')).toBe(0);
  });

  it('should convert DEBUG to 10', () => {
    expect(convertLogLevel('DEBUG')).toBe(10);
  });

  it('should convert INFO to 20', () => {
    expect(convertLogLevel('INFO')).toBe(20);
  });

  it('should convert WARN to 30', () => {
    expect(convertLogLevel('WARN')).toBe(30);
  });

  it('should convert ERROR to 40', () => {
    expect(convertLogLevel('ERROR')).toBe(40);
  });

  it('should convert FATAL to 50', () => {
    expect(convertLogLevel('FATAL')).toBe(50);
  });
});

describe('toConsolaLevel', () => {
  it('should convert 0 to 0', () => {
    expect(toConsolaLevel(0)).toBe(0);
  });

  it('should convert 10 to 1', () => {
    expect(toConsolaLevel(10)).toBe(1);
  });

  it('should convert 20 to 2', () => {
    expect(toConsolaLevel(20)).toBe(2);
  });

  it('should convert 30 to 3', () => {
    expect(toConsolaLevel(30)).toBe(3);
  });

  it('should convert 40 to 4', () => {
    expect(toConsolaLevel(40)).toBe(4);
  });

  it('should convert 50 to 5', () => {
    expect(toConsolaLevel(50)).toBe(5);
  });

  it('should floor intermediate values', () => {
    expect(toConsolaLevel(25)).toBe(2);
    expect(toConsolaLevel(35)).toBe(3);
  });
});
