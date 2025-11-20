import { describe, expect, it } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { generateCompleteMcpTools } from './mcp-tool-generator.js';
import {
  schemaWithPathParams,
  buildSchemaWithEnumParam,
  schemaWithGetEndpoint,
} from '../../test-fixtures.js';
import { generateMcpToolName } from './name-generator.js';

describe('generateCompleteMcpTools (schema-first execution DAG)', () => {
  it('emits contract, data, aliases, and runtime executors with strict dependencies', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);

    const contractFile = output.contract['tool-descriptor.contract.ts'];
    expect(contractFile).toContain('export type StatusDiscriminant<T extends string>');
    expect(contractFile).toContain('export interface ToolDescriptor<');
    expect(contractFile).toContain('readonly documentedStatuses: readonly TDocumentedStatus[];');
    expect(output.data['definitions.ts']).toContain('export const MCP_TOOL_DESCRIPTORS');
    expect(output.data['definitions.ts']).toContain('export const MCP_TOOL_ENTRIES = [');
    expect(output.data['definitions.ts']).toContain(
      "export type ToolDescriptors = { readonly [E in ToolEntry as E['name']]: E['descriptor'] };",
    );
    const aliasesFile = output.aliases['types.ts'];
    expect(aliasesFile).toContain(
      "import type { ToolOperationId, ToolDescriptors as GeneratedToolDescriptors, ToolEntryForName, ToolName, ToolNameForOperationId, ToolOperationIdForName as GeneratedToolOperationIdForName } from '../data/definitions.js';",
    );
    expect(output.runtime['execute.ts']).toContain(
      "export function callTool(\n  name: 'get-lessons-transcript',",
    );
    expect(output.runtime['execute.ts']).toContain('switch (name) {');
    expect(output.runtime['execute.ts']).not.toContain('callToolEntry(');
    expect(output.runtime['lib.ts']).toContain(
      "import { getToolFromOperationId, isToolName, type ToolDescriptorForName, type ToolDescriptorForOperationId, type ToolName, type ToolOperationId } from '../data/definitions.js';",
    );
    expect(output.runtime['lib.ts']).toContain(
      "import { callTool, listAllToolDescriptors } from './execute.js';",
    );
    expect(output.runtime['lib.ts']).not.toContain('override');
    expect(output.index).toContain('generated/data/index.js');

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

  it('emits security types in generated contract', () => {
    const output = generateCompleteMcpTools(schemaWithPathParams);
    const contractFile = output.contract['tool-descriptor.contract.ts'];

    // Verify security types are present
    expect(contractFile).toContain('export type SecuritySchemeType');
    expect(contractFile).toContain('export interface NoAuthScheme');
    expect(contractFile).toContain('export interface OAuth2Scheme');
    expect(contractFile).toContain('export type SecurityScheme');

    // Verify field in ToolDescriptor
    expect(contractFile).toContain('readonly securitySchemes?:');
    expect(contractFile).toContain('readonly SecurityScheme[]');

    // Verify TSDoc is present
    expect(contractFile).toContain('MCP security scheme types');
    expect(contractFile).toContain('No authentication required');
    expect(contractFile).toContain('OAuth 2.1 authentication required');
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
    expect(getUsersToolFile).toContain("scopes: ['openid', 'email']");

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
