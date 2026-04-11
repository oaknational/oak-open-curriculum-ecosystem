/**
 * Unit tests for generate-tool-descriptor-file
 * Following TDD approach - tests written FIRST before implementation
 */

import { describe, it, expect } from 'vitest';
import { generateToolDescriptorFile } from './generate-tool-descriptor-file.js';

describe('generateToolDescriptorFile', () => {
  it('generates contract with securitySchemes field', () => {
    const generated = generateToolDescriptorFile();

    // Verify SecurityScheme types are exported
    expect(generated).toContain('export type SecuritySchemeType');
    expect(generated).toContain('export interface NoAuthScheme');
    expect(generated).toContain('export interface OAuth2Scheme');
    expect(generated).toContain('export type SecurityScheme');

    // Verify securitySchemes field is in ToolDescriptor interface
    expect(generated).toContain('readonly securitySchemes?:');
    expect(generated).toContain('readonly SecurityScheme[]');
  });

  it('generates contract with security type documentation', () => {
    const generated = generateToolDescriptorFile();

    // Verify TSDoc is present
    expect(generated).toContain('MCP security scheme types');
    expect(generated).toContain('No authentication required');
    expect(generated).toContain('OAuth 2.1 authentication required');
  });

  it('maintains readonly modifiers on security types', () => {
    const generated = generateToolDescriptorFile();

    // Verify readonly in NoAuthScheme
    expect(generated).toContain("readonly type: 'noauth'");

    // Verify readonly in OAuth2Scheme
    expect(generated).toContain("readonly type: 'oauth2'");
    expect(generated).toContain('readonly scopes?:');
  });

  it('places securitySchemes field in correct position', () => {
    const generated = generateToolDescriptorFile();

    // Should be after documentedStatuses and before validateOutput
    const documentedStatusesPos = generated.indexOf('readonly documentedStatuses');
    const securitySchemesPos = generated.indexOf('readonly securitySchemes');
    const validateOutputPos = generated.indexOf('readonly validateOutput');

    expect(securitySchemesPos).toBeGreaterThan(documentedStatusesPos);
    expect(validateOutputPos).toBeGreaterThan(securitySchemesPos);
  });

  it('exports InvokeResult interface with httpStatus and payload', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).toContain('export interface InvokeResult');
    expect(generated).toContain('readonly httpStatus: number');
    expect(generated).toContain('readonly payload: unknown');
  });

  it('exports DOCUMENTED_ERROR_PREFIX constant', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).toContain(
      "export const DOCUMENTED_ERROR_PREFIX = 'Documented error response: '",
    );
  });

  it('uses InvokeResult as invoke return type', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).toContain(
      'readonly invoke: (client: TClient, args: TArgs) => InvokeResult | Promise<InvokeResult>',
    );
  });

  it('uses Node ESM-compatible MCP SDK specifiers in the contract import', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).toContain("import type { Tool } from '@modelcontextprotocol/sdk/types.js';");
  });
});
