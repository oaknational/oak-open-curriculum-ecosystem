import { describe, it, expect } from 'vitest';
import { generateScopesSupportedFile } from './generate-scopes-supported-file.js';
import { SCOPES_SUPPORTED } from '../../../../src/types/generated/api-schema/mcp-tools/scopes-supported.js';

describe('generateScopesSupportedFile', () => {
  it('returns a string containing the SCOPES_SUPPORTED constant', () => {
    const result = generateScopesSupportedFile();
    expect(result).toContain('export const SCOPES_SUPPORTED');
  });

  it('includes the correct scopes from security policy', () => {
    const result = generateScopesSupportedFile();
    const quotedScopes = [...SCOPES_SUPPORTED].map((scope) => `'${scope}'`).join(', ');
    const expectedScopesLiteral = `[${quotedScopes}]`;
    expect(result).toContain(expectedScopesLiteral);
  });

  it('has as const assertion for type narrowing', () => {
    const result = generateScopesSupportedFile();
    expect(result).toContain('as const');
  });

  it('includes DO NOT EDIT warning in banner', () => {
    const result = generateScopesSupportedFile();
    expect(result).toContain('DO NOT EDIT');
    expect(result).toContain('GENERATED FILE');
  });

  it('includes link to mcp-security-policy.ts for documentation', () => {
    const result = generateScopesSupportedFile();
    expect(result).toContain('mcp-security-policy.ts');
  });

  it('exports ScopesSupported type', () => {
    const result = generateScopesSupportedFile();
    expect(result).toContain('export type ScopesSupported');
    expect(result).toContain('typeof SCOPES_SUPPORTED');
  });

  it('includes RFC 9728 reference in documentation', () => {
    const result = generateScopesSupportedFile();
    expect(result).toContain('RFC 9728');
  });

  it('includes instructions to run pnpm sdk-codegen', () => {
    const result = generateScopesSupportedFile();
    expect(result).toContain('pnpm sdk-codegen');
  });
});
