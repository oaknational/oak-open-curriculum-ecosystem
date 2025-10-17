import { describe, it, expect } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createFileMap, generatePathParametersContent } from './typegen-core';
import { writeMcpToolsDirectory } from './typegen-core-file-operations.js';
import type { GeneratedMcpToolFiles } from './typegen/mcp-tools/mcp-tool-generator.js';

describe('typegen-core', () => {
  describe('createFileMap', () => {
    it('should create a map of filenames to content', () => {
      const sourceSchema: OpenAPIObject = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
      };
      const tsTypesContent = 'export type Test = string;';
      const pathParameterContent = 'export const PATHS = {};';
      const pathUtilsContent = 'export const DUMMY = 1;';

      const result = createFileMap(
        sourceSchema,
        sourceSchema,
        tsTypesContent,
        pathParameterContent,
        pathUtilsContent,
        'export const RESPONSE_MAP = new Map();',
        'export const REQUEST_PARAMETER_SCHEMAS = {};',
      );

      expect(result).toHaveProperty('api-schema-original.json');
      expect(result).toHaveProperty('api-schema-sdk.json');
      expect(result).toHaveProperty('api-schema-base.ts');
      expect(result).toHaveProperty('api-paths-types.ts');
      expect(result).toHaveProperty('path-parameters.ts');

      expect(typeof result['api-schema-original.json']).toBe('string');
      expect(typeof result['api-schema-sdk.json']).toBe('string');
      expect(result['api-paths-types.ts']).toBe(tsTypesContent);
      expect(result['path-parameters.ts']).toBe(pathParameterContent);
    });

    it('should generate TypeScript schema content for api-schema-base.ts', () => {
      const sourceSchema: OpenAPIObject = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
      };
      // Not used now that createFileMap accepts both base and sdk schemas directly
      const tsTypesContent = 'types';
      const pathParameterContent = 'parameters';
      const pathUtilsContent = 'utils';

      const result = createFileMap(
        sourceSchema,
        sourceSchema,
        tsTypesContent,
        pathParameterContent,
        pathUtilsContent,
        'export const RESPONSE_MAP = new Map();',
        'export const REQUEST_PARAMETER_SCHEMAS = {};',
      );

      expect(result['api-schema-base.ts']).toContain('export const schemaBase =');
      expect(result['api-schema-base.ts']).toContain('as const');
      expect(result['api-schema-base.ts']).toContain('export type SchemaBase = typeof schemaBase');
    });
  });

  describe('generatePathParametersContent', () => {
    it('should combine all sections into a single string', () => {
      const schema: OpenAPIObject = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {
          '/test': {},
        },
      };

      const parameters = {
        keyStage: ['ks1', 'ks2'],
        subject: ['maths'],
      };

      const validCombinations = {
        NO_PARAMS: {
          '/test': { path: '/test', paramsKey: 'NO_PARAMS' },
        },
      };

      const result = generatePathParametersContent(schema, parameters, validCombinations);

      // Check for key sections
      expect(result).toContain('GENERATED FILE - DO NOT EDIT');
      expect(result).toContain('export const PATHS =');
      expect(result).toContain('export function isValidPath');
      expect(result).toContain('export const KEY_STAGES');
      expect(result).toContain('export const PATH_PARAMETERS');
      expect(result).toContain('export const VALID_PATHS_BY_PARAMETERS');
    });

    it('should join sections with newlines', () => {
      const schema: OpenAPIObject = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
      };

      const result = generatePathParametersContent(schema, {}, {});

      // Should have multiple sections separated by newlines
      const sections = result.split('\n\n');
      expect(sections.length).toBeGreaterThan(1);
    });
  });

  describe('writeMcpToolsDirectory', () => {
    it('writes contract, data, aliases, and runtime artefacts into the expected structure', () => {
      const outDir = mkdtempSync(path.join(os.tmpdir(), 'mcp-tools-writer-test-'));
      const files: GeneratedMcpToolFiles = {
        index: 'root index content',
        contract: {
          'tool-descriptor.contract.ts': 'contract content',
        },
        data: {
          'definitions.ts': 'definitions content',
          'index.ts': 'data index content',
          tools: {
            'alpha.ts': 'alpha tool content',
          },
        },
        aliases: {
          'types.ts': 'types content',
        },
        runtime: {
          'lib.ts': 'lib content',
        },
      };

      try {
        writeMcpToolsDirectory(outDir, files);

        const rootIndexPath = path.join(outDir, 'mcp-tools', 'index.ts');
        const contractPath = path.join(
          outDir,
          'mcp-tools',
          'contract',
          'tool-descriptor.contract.ts',
        );
        const definitionsPath = path.join(
          outDir,
          'mcp-tools',
          'generated',
          'data',
          'definitions.ts',
        );
        const dataIndexPath = path.join(outDir, 'mcp-tools', 'generated', 'data', 'index.ts');
        const toolPath = path.join(outDir, 'mcp-tools', 'generated', 'data', 'tools', 'alpha.ts');
        const aliasesPath = path.join(outDir, 'mcp-tools', 'generated', 'aliases', 'types.ts');
        const runtimePath = path.join(outDir, 'mcp-tools', 'generated', 'runtime', 'lib.ts');

        expect(readFileSync(rootIndexPath, 'utf8')).toBe('root index content');
        expect(readFileSync(contractPath, 'utf8')).toBe('contract content');
        expect(readFileSync(definitionsPath, 'utf8')).toBe('definitions content');
        expect(readFileSync(dataIndexPath, 'utf8')).toBe('data index content');
        expect(readFileSync(toolPath, 'utf8')).toBe('alpha tool content');
        expect(readFileSync(aliasesPath, 'utf8')).toBe('types content');
        expect(readFileSync(runtimePath, 'utf8')).toBe('lib content');
      } finally {
        rmSync(outDir, { force: true, recursive: true });
      }
    });
  });
});
