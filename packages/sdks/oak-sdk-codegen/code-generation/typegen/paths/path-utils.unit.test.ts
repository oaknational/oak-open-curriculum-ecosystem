import { describe, it, expect } from 'vitest';
import { generatePathUtilsFile } from './generate-path-utils.js';

describe('generatePathUtilsFile', () => {
  it('emits function names and docs', () => {
    const code = generatePathUtilsFile();
    expect(code).toContain('GENERATED FILE - DO NOT EDIT');
    expect(code).toContain('export function toColon');
    expect(code).toContain('export function toCurly');
    expect(code).toContain('export function isColon');
    expect(code).toContain('export function isCurly');
  });

  it('includes correct regex replacements for conversions', () => {
    const code = generatePathUtilsFile();
    // Inner class excludes `{` as well as `}` to keep the scan linear:
    // `{([^}]+)}` is polynomial (js/polynomial-redos) on `{`-flooded input.
    expect(code).toContain("path.replaceAll(/{([^{}]+)}/g, ':$1')");
    expect(code).toContain("path.replaceAll(/:([A-Za-z0-9_]+)/g, '{$1}')");
  });
});
