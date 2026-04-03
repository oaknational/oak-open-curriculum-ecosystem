import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { describe, it, expect } from 'vitest';
import {
  generateJsonContent,
  generateTsSchemaContent,
  generatePathParametersHeader,
  generatePathsConstant,
  generateRuntimeSchemaChecks,
  generateParameterConstant,
  generateValidPathsByParameters,
} from './typegen/index.js';
import { generatePathGroupingsSection } from './typegen-writers';
import { minimalSchema, parseAsOpenAPIObject } from './test-fixtures';

describe('generateJsonContent', () => {
  it('should generate formatted JSON string from schema', () => {
    const schema: OpenAPIObject = minimalSchema;

    const result = generateJsonContent(schema);
    const parsed: OpenAPIObject = parseAsOpenAPIObject(result);

    expect(parsed).toEqual(schema);
    expect(result).toContain('"openapi": "3.0.0"');
  });
});

describe('generateTsSchemaContent', () => {
  it('should generate TypeScript schema export', () => {
    const jsonSchema = '{"test": "value"}';
    const result = generateTsSchemaContent(jsonSchema);

    expect(result).toContain('export const schema = {"test": "value"} as const;');
    expect(result).toContain('export type Schema = typeof schema;');
    expect(result).toContain('API schema');
  });
});

describe('generatePathParametersHeader', () => {
  it('should generate proper header with imports', () => {
    const result = generatePathParametersHeader();

    expect(result).toContain('GENERATED FILE - DO NOT EDIT');
    expect(result).toContain('import type { paths as Paths }');
    expect(result).toContain('import type { SchemaBase as Schema }');
    expect(result).toContain('import { schemaBase as schema }');
  });
});

describe('generatePathsConstant', () => {
  it('should generate PATHS object from schema', () => {
    const schema = {
      paths: {
        '/api/users': {},
        '/api/items/{id}': {},
        '/api/data': {},
      },
    };

    const result = generatePathsConstant(schema);

    expect(result).toContain('export const PATHS = {');
    expect(result).toContain("'/api/data': '/api/data'");
    expect(result).toContain("'/api/items/{id}': '/api/items/{id}'");
    expect(result).toContain("'/api/users': '/api/users'");
    expect(result).toContain('type ValidPath = keyof Paths;');
  });

  it('should sort paths alphabetically', () => {
    const schema = {
      paths: {
        '/zebra': {},
        '/apple': {},
        '/banana': {},
      },
    };

    const result = generatePathsConstant(schema);
    const lines = result.split('\n');
    const pathLines = lines.filter((l) => l.includes("': '"));

    expect(pathLines[0]).toContain("'/apple': '/apple'");
    expect(pathLines[1]).toContain("'/banana': '/banana'");
    expect(pathLines[2]).toContain("'/zebra': '/zebra'");
  });
});

describe('generatePathGroupingsSection', () => {
  it('should generate path groupings object', () => {
    const pathGroupings = {
      NO_PARAMS: {
        '/api/users': { path: '/api/users', paramsKey: 'NO_PARAMS' },
      },
      id: {
        '/api/items/{id}': {
          path: '/api/items/{id}',
          paramsKey: 'id',
          params: 'id',
        },
      },
    };

    const result = generatePathGroupingsSection(pathGroupings);

    expect(result).toContain('export const PATH_GROUPINGS');
    expect(result).toContain('"NO_PARAMS"');
    expect(result).toContain('"/api/users"');
    expect(result).toContain('"/api/items/{id}"');
  });

  it('should sort groupings alphabetically', () => {
    const pathGroupings = {
      zebra: {
        '/z': { path: '/z', paramsKey: 'zebra' },
      },
      apple: {
        '/a': { path: '/a', paramsKey: 'apple' },
      },
    };

    const result = generatePathGroupingsSection(pathGroupings);

    // Check that apple comes before zebra in the output
    const appleIndex = result.indexOf('"apple"');
    const zebraIndex = result.indexOf('"zebra"');

    expect(appleIndex).toBeLessThan(zebraIndex);
  });
});

describe('generateRuntimeSchemaChecks', () => {
  it('should generate runtime schema check functions', () => {
    const result = generateRuntimeSchemaChecks();

    expect(result).toContain('type RawPaths = Schema["paths"]');
    expect(result).toContain('export function isValidPath(value: string): value is ValidPath');
    expect(result).toContain('export const apiPaths: RawPaths = schema.paths');
    expect(result).toContain('type AllowedMethods = keyof (RawPaths[keyof RawPaths])');
    expect(result).toContain('export const allowedMethods: AllowedMethods[]');
    expect(result).toContain('export function isAllowedMethod');
    expect(result).toContain('export type JsonBody200');
  });

  it('should include type guards', () => {
    const result = generateRuntimeSchemaChecks();

    expect(result).toContain('return paths.includes(value)');
    expect(result).toContain('return methods.includes(maybeMethod)');
  });
});

describe('generateParameterConstant', () => {
  it('should generate parameter constant with type guard', () => {
    const values = ['ks1', 'ks2', 'ks3', 'ks4'];
    const result = generateParameterConstant('keyStage', 'keyStages', values);

    expect(result).toContain('export const KEY_STAGES = [');
    expect(result).toContain('"ks1"');
    expect(result).toContain('"ks2"');
    expect(result).toContain('type KeyStages = typeof KEY_STAGES');
    expect(result).toContain('export type KeyStage = KeyStages[number]');
    expect(result).toContain('export function isKeyStage(value: string): value is KeyStage');
    expect(result).toContain('return keyStages.includes(value)');
  });

  it('should omit emission for empty arrays (no useless constants/guards)', () => {
    const result = generateParameterConstant('emptyParam', 'emptyParams', []);
    expect(result).toBe('');
  });

  it('should capitalize names correctly', () => {
    const result = generateParameterConstant('threadSlug', 'threadSlugs', ['slug1', 'slug2']);

    expect(result).toContain('export const THREAD_SLUGS');
    expect(result).toContain('type ThreadSlugs = typeof THREAD_SLUGS');
    expect(result).toContain('export type ThreadSlug = ThreadSlugs[number]');
    expect(result).toContain('export function isThreadSlug');
  });

  it('should handle type parameter specially as AssetType', () => {
    const values = ['slideDeck', 'video', 'worksheet'];
    const result = generateParameterConstant('type', 'assetTypes', values);

    expect(result).toContain('export const ASSET_TYPES = [');
    expect(result).toContain('"slideDeck"');
    expect(result).toContain('"video"');
    expect(result).toContain('type AssetTypes = typeof ASSET_TYPES');
    expect(result).toContain('export type AssetType = AssetTypes[number]');
    expect(result).toContain('export function isAssetType(value: string): value is AssetType');
    expect(result).toContain('return assetTypes.includes(value)');
  });
});

describe('generateValidPathsByParameters', () => {
  it('should generate valid paths by parameters section', () => {
    const validCombinations = {
      NO_PARAMS: {
        '/api/users': { path: '/api/users', paramsKey: 'NO_PARAMS' },
      },
      id: {
        '/api/items/{id}': { path: '/api/items/{id}', paramsKey: 'id', params: 'id' },
      },
      id_type: {
        '/api/items/{id}/{type}': {
          path: '/api/items/{id}/{type}',
          paramsKey: 'id_type',
          params: 'id,type',
        },
      },
    };

    const result = generateValidPathsByParameters(validCombinations);

    expect(result).toContain('type PathGroupingKeys = "NO_PARAMS" | "id" | "id_type";');
    expect(result).toContain('interface ValidParameterCombination<');
    expect(result).toContain('type ValidPathAndParameters<K extends PathGroupingKeys>');
    expect(result).toContain('type ValidPathGroupings');
    expect(result).toContain('export const VALID_PATHS_BY_PARAMETERS: ValidPathGroupings');
    expect(result).toContain('"NO_PARAMS"');
    expect(result).toContain('"/api/users"');
    expect(result).toContain('"/api/items/{id}"');
    expect(result).toContain('"/api/items/{id}/{type}"');
  });

  it('should sort path groupings alphabetically', () => {
    const validCombinations = {
      zebra: {
        '/z': { path: '/z', paramsKey: 'zebra' },
      },
      apple: {
        '/a': { path: '/a', paramsKey: 'apple' },
      },
      NO_PARAMS: {
        '/none': { path: '/none', paramsKey: 'NO_PARAMS' },
      },
    };

    const result = generateValidPathsByParameters(validCombinations);

    // Check that path grouping keys are sorted (excluding NO_PARAMS from the union)
    expect(result).toContain('type PathGroupingKeys = "NO_PARAMS" | "apple" | "zebra";');

    // Check that the entries in VALID_PATHS_BY_PARAMETERS are sorted alphabetically
    const noParamsIndex = result.indexOf('"NO_PARAMS":');
    const appleIndex = result.indexOf('"apple":');
    const zebraIndex = result.indexOf('"zebra":');

    // Alphabetically: apple < NO_PARAMS < zebra
    expect(appleIndex).toBeLessThan(noParamsIndex);
    expect(noParamsIndex).toBeLessThan(zebraIndex);
  });
});
