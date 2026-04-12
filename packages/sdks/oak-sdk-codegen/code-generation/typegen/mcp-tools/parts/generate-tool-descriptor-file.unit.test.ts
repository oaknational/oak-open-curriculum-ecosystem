/**
 * Unit tests for generate-tool-descriptor-file
 *
 * Verifies the generator emits a contract that imports non-API-derived
 * types from the hand-authored mcp-protocol-types module and only
 * defines the ToolDescriptor interface itself.
 */

import { describe, it, expect } from 'vitest';
import { generateToolDescriptorFile } from './generate-tool-descriptor-file.js';

describe('generateToolDescriptorFile', () => {
  it('imports type-only non-API-derived types from mcp-protocol-types', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).toContain(
      "import type {\n  SecurityScheme,\n  SourceAttribution,\n  ToolAnnotations,\n  ToolMeta,\n  StatusDiscriminant,\n  InvokeResult,\n} from '../../../../mcp-protocol-types.js';",
    );
  });

  it('imports DOCUMENTED_ERROR_PREFIX value from mcp-protocol-types', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).toContain(
      "import { DOCUMENTED_ERROR_PREFIX } from '../../../../mcp-protocol-types.js';",
    );
  });

  it('re-exports all imported non-API-derived types', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).toContain('export { DOCUMENTED_ERROR_PREFIX };');
    expect(generated).toContain(
      'export type { SecurityScheme, SourceAttribution, ToolAnnotations, ToolMeta, StatusDiscriminant, InvokeResult };',
    );
  });

  it('does not define SecurityScheme types inline', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).not.toContain('export type SecuritySchemeType');
    expect(generated).not.toContain('export interface NoAuthScheme');
    expect(generated).not.toContain('export interface OAuth2Scheme');
    expect(generated).not.toMatch(/export type SecurityScheme\s*=/);
  });

  it('does not define SourceAttribution inline', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).not.toContain('export interface SourceAttribution');
  });

  it('does not define InvokeResult or StatusDiscriminant inline', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).not.toContain('export interface InvokeResult');
    expect(generated).not.toMatch(/export type StatusDiscriminant/);
  });

  it('does not define DOCUMENTED_ERROR_PREFIX value inline', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).not.toContain(
      "export const DOCUMENTED_ERROR_PREFIX = 'Documented error response: '",
    );
  });

  it('references imported types in ToolDescriptor', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).toContain('readonly securitySchemes?: readonly SecurityScheme[]');
    expect(generated).toContain('readonly annotations?: ToolAnnotations');
    expect(generated).toContain('readonly _meta: ToolMeta');
    expect(generated).toContain(
      'readonly invoke: (client: TClient, args: TArgs) => InvokeResult | Promise<InvokeResult>',
    );
  });

  it('uses Node ESM-compatible MCP SDK specifiers in the contract import', () => {
    const generated = generateToolDescriptorFile();

    expect(generated).toContain("import type { Tool } from '@modelcontextprotocol/sdk/types.js';");
  });

  it('emits only ToolDescriptor as a locally defined export', () => {
    const generated = generateToolDescriptorFile();

    const interfaceMatches = generated.match(/export interface \w+/g) ?? [];
    expect(interfaceMatches).toEqual(['export interface ToolDescriptor']);
  });
});
