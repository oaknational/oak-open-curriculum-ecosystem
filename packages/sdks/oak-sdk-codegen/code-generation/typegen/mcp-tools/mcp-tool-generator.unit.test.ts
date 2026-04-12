import { describe, expect, it } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { generateCompleteMcpTools } from './mcp-tool-generator.js';
import {
  schemaWithPathParams,
  buildSchemaWithEnumParam,
  schemaWithGetEndpoint,
  buildSchemaWithParamLevelDescription,
  buildSchemaWithSchemaLevelDescription,
  buildSchemaWithBothDescriptionLevels,
  buildSchemaWithNoDescription,
  buildSchemaWithParamLevelExample,
  buildSchemaWithSchemaLevelExample,
  buildSchemaWithBothExampleLevels,
  buildSchemaWithNoExample,
} from '../../test-fixtures.js';
import { generateMcpToolName } from './name-generator.js';

describe('generateCompleteMcpTools (schema-first execution DAG)', () => {
  it('emits contract, data, aliases, and runtime executors with strict dependencies', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);

    const contractFile = output.contract['tool-descriptor.contract.ts'];
    expect(contractFile).toContain('StatusDiscriminant');
    expect(contractFile).toContain('export interface ToolDescriptor<');
    expect(contractFile).toContain('readonly documentedStatuses: readonly TDocumentedStatus[];');
    expect(output.data['definitions.ts']).toContain('export const MCP_TOOL_DESCRIPTORS');
    expect(output.data['definitions.ts']).toContain('export const MCP_TOOL_ENTRIES = [');
    expect(output.data['definitions.ts']).toContain(
      "export type ToolDescriptors = { readonly [E in ToolEntry as E['name']]: E['descriptor'] };",
    );
    const aliasesFile = output.aliases['types.ts'];
    expect(aliasesFile).toContain(
      "import type { ToolOperationId, ToolDescriptors as GeneratedToolDescriptors, ToolEntryForName, ToolName, ToolNameForOperationId, ToolOperationIdForName as GeneratedToolOperationIdForName } from '../definitions.js';",
    );
    expect(output.runtime['execute.ts']).toContain(
      "export function callTool(\n  name: 'get-lessons-transcript',",
    );
    expect(output.runtime['execute.ts']).toContain('switch (name) {');
    expect(output.runtime['execute.ts']).not.toContain('callToolEntry(');
    // Runtime index exports listAllToolDescriptors for public API
    expect(output.runtime['index.ts']).toContain(
      "export { callTool, listAllToolDescriptors } from './execute.js';",
    );
    expect(output.index).toContain('./definitions.js');

    expect(output.stubs['index.ts']).toContain('createStubToolExecutor');
    expect(output.stubs['tools/index.ts']).toContain('stubbedToolResponses');
  });

  it('captures enum parameter metadata when schema provides enum', () => {
    const schema = buildSchemaWithEnumParam();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/courses', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    expect(toolFile).toContain("'CourseA' | 'CourseB'");
    expect(toolFile).toContain('Allowed values: CourseA, CourseB');
  });

  it('emits UndocumentedResponseError contract file', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);
    const errorFile = output.contract['undocumented-response-error.ts'];
    expect(errorFile).toBeDefined();
    expect(errorFile).toContain('export class UndocumentedResponseError extends Error');
    expect(errorFile).toContain('readonly status: number');
    expect(errorFile).toContain('readonly operationId: string');
    expect(errorFile).toContain('readonly responseBody: unknown');
    expect(errorFile).toContain('readonly upstreamMessage: string | undefined');
  });

  it('imports UndocumentedResponseError in generated tool files', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);
    const toolFile = output.data.tools['get-lessons-transcript.ts'];
    expect(toolFile).toBeDefined();
    expect(toolFile).toContain(
      "import { UndocumentedResponseError } from '../contract/undocumented-response-error.js';",
    );
  });

  it('exports UndocumentedResponseError from root index', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);
    expect(output.index).toContain('UndocumentedResponseError');
    expect(output.index).toContain('undocumented-response-error');
  });

  it('imports and re-exports security types from hand-authored module', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);
    const contractFile = output.contract['tool-descriptor.contract.ts'];

    expect(contractFile).toContain("from '../../../../mcp-protocol-types.js'");
    expect(contractFile).toContain('SecurityScheme');
    expect(contractFile).toContain('SourceAttribution');
    expect(contractFile).toContain('ToolAnnotations');
    expect(contractFile).toContain('ToolMeta');

    expect(contractFile).toContain('readonly securitySchemes?:');
    expect(contractFile).toContain('readonly SecurityScheme[]');
  });

  it('emits security metadata in generated tool files', () => {
    const output = generateCompleteMcpTools(schemaWithGetEndpoint);

    // Test PUBLIC tool (get-users should NOT be in PUBLIC_TOOLS)
    const getUsersToolFile = output.data.tools['get-users.ts'];
    expect(getUsersToolFile).toBeDefined();

    // Verify securitySchemes field is emitted
    expect(getUsersToolFile).toContain('securitySchemes:');

    // Verify OAuth2 scheme for protected tools (default)
    expect(getUsersToolFile).toContain("type: 'oauth2'");
    expect(getUsersToolFile).toContain("scopes: ['email']");

    // Verify field position (after documentedStatuses, before validateOutput)
    const documentedStatusesIndex = getUsersToolFile.indexOf('documentedStatuses,');
    const securitySchemesIndex = getUsersToolFile.indexOf('securitySchemes:');
    const validateOutputIndex = getUsersToolFile.indexOf('validateOutput:');

    expect(documentedStatusesIndex).toBeGreaterThan(-1);
    expect(securitySchemesIndex).toBeGreaterThan(documentedStatusesIndex);
    expect(validateOutputIndex).toBeGreaterThan(securitySchemesIndex);
  });

  it('emits noauth scheme for tools in PUBLIC_TOOLS', () => {
    // Create schema with a tool that will generate 'get-changelog' name
    const schemaWithPublicTool: OpenAPIObject = {
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0.0' },
      paths: {
        '/changelog': {
          get: {
            operationId: 'getChangelog',
            responses: { '200': { description: 'Success' } },
          },
        },
      },
    };

    const output = generateCompleteMcpTools(schemaWithPublicTool);
    const changelogToolFile = output.data.tools['get-changelog.ts'];

    expect(changelogToolFile).toBeDefined();
    expect(changelogToolFile).toContain('securitySchemes:');
    expect(changelogToolFile).toContain("type: 'noauth'");
    expect(changelogToolFile).not.toContain("type: 'oauth2'");
  });
});

/**
 * Tests specifying parameter description extraction behaviour.
 *
 * OpenAPI spec allows descriptions at two levels:
 * 1. param.description (parameter-level)
 * 2. param.schema.description (schema-level)
 *
 * These tests ensure:
 * - Both levels are supported
 * - Parameter-level takes precedence
 * - No description results in no .describe() call
 */
describe('parameter description extraction behaviour', () => {
  it('extracts description from parameter level (param.description)', () => {
    const schema = buildSchemaWithParamLevelDescription();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/assets', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    // Verify .describe() is present with the parameter-level description
    expect(toolFile).toContain('.describe("Asset type filter from parameter level")');
  });

  it('extracts description from schema level (param.schema.description)', () => {
    const schema = buildSchemaWithSchemaLevelDescription();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/units', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    // Verify .describe() is present with the schema-level description
    expect(toolFile).toContain('.describe("Key stage filter from schema level")');
  });

  it('prefers parameter-level description when both levels exist', () => {
    const schema = buildSchemaWithBothDescriptionLevels();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/search', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    // Parameter-level takes precedence
    expect(toolFile).toContain('.describe("Parameter-level description takes precedence")');
    // Schema-level should NOT appear
    expect(toolFile).not.toContain('Schema-level description is fallback');
  });

  it('omits .describe() when no description at any level', () => {
    const schema = buildSchemaWithNoDescription();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/items', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    // The 'limit' parameter should NOT have a .describe() call
    // It should just be z.number().optional() without describe
    expect(toolFile).toContain('limit: z.number()');
    expect(toolFile).not.toContain('limit: z.number().describe');
  });
});

/**
 * Tests specifying parameter example extraction behaviour.
 *
 * OpenAPI spec allows examples at two levels:
 * 1. param.example (parameter-level)
 * 2. param.schema.example (schema-level)
 *
 * JSON Schema uses `examples` (array) not `example` (singular).
 *
 * These tests ensure:
 * - Both levels are supported
 * - Parameter-level takes precedence
 * - No example results in no examples field in JSON Schema
 * - Examples are emitted as arrays per JSON Schema spec
 */
describe('parameter example extraction behaviour', () => {
  it('extracts example from parameter level and emits in JSON Schema', () => {
    const schema = buildSchemaWithParamLevelExample();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/sequences/{sequence}/units', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    // Verify examples array is present in toolInputJsonSchema
    expect(toolFile).toContain('"examples":["english-primary"]');
  });

  it('extracts example from schema level when param-level absent', () => {
    const schema = buildSchemaWithSchemaLevelExample();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/lessons/{lesson}/transcript', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    // Verify examples array is present from schema-level example
    expect(toolFile).toContain('"examples":["checking-understanding-of-basic-transformations"]');
  });

  it('prefers parameter-level example when both levels exist', () => {
    const schema = buildSchemaWithBothExampleLevels();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/units/{unit}', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    // Parameter-level takes precedence
    expect(toolFile).toContain('"examples":["param-level-example"]');
    // Schema-level should NOT appear
    expect(toolFile).not.toContain('schema-level-example');
  });

  it('omits examples field when no example at any level', () => {
    const schema = buildSchemaWithNoExample();
    const files = generateCompleteMcpTools(schema);
    const toolName = generateMcpToolName('/subjects', 'get');
    const toolFile = files.data.tools[`${toolName}.ts`];

    expect(toolFile).toBeDefined();
    // The toolInputJsonSchema should NOT contain examples field
    expect(toolFile).not.toContain('"examples":');
  });
});

describe('SKIPPED_PATHS excludes superseded search endpoints', () => {
  const schemaWithSearchPaths: OpenAPIObject = {
    openapi: '3.0.0',
    info: { title: 'Test', version: '1.0.0' },
    paths: {
      '/search/lessons': {
        get: {
          operationId: 'getLessons-searchByTextSimilarity',
          parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }],
          responses: { '200': { description: 'Success' } },
        },
      },
      '/search/transcripts': {
        get: {
          operationId: 'searchTranscripts-searchTranscripts',
          parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }],
          responses: { '200': { description: 'Success' } },
        },
      },
      '/lessons/{lesson}/transcript': {
        get: {
          operationId: 'getTranscript',
          parameters: [{ name: 'lesson', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Success' } },
        },
      },
    },
  };

  it('does not generate tool files for /search/lessons or /search/transcripts', () => {
    const files = generateCompleteMcpTools(schemaWithSearchPaths);
    const toolFileNames = Object.keys(files.data.tools);

    expect(toolFileNames).not.toContain('get-search-lessons.ts');
    expect(toolFileNames).not.toContain('get-search-transcripts.ts');
  });

  it('still generates tools for non-skipped endpoints', () => {
    const files = generateCompleteMcpTools(schemaWithSearchPaths);
    const toolFileNames = Object.keys(files.data.tools);

    expect(toolFileNames).toContain('get-lessons-transcript.ts');
  });

  it('excludes skipped tools from definitions and runtime', () => {
    const files = generateCompleteMcpTools(schemaWithSearchPaths);

    expect(files.data['definitions.ts']).not.toContain('get-search-lessons');
    expect(files.data['definitions.ts']).not.toContain('get-search-transcripts');
    expect(files.runtime['execute.ts']).not.toContain('get-search-lessons');
    expect(files.runtime['execute.ts']).not.toContain('get-search-transcripts');
  });
});
