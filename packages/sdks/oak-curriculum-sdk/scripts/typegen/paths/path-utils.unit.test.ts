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
    expect(code).toContain("path.replace(/{([^}]+)}/g, ':$1')");
    expect(code).toContain("path.replace(/:([A-Za-z0-9_]+)/g, '{$1}')");
  });
});
