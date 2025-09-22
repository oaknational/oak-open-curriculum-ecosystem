import type { OperationObject } from 'openapi-typescript';

function buildSafeName(toolName: string): string {
  const segments = toolName.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return (
    (segments[0] ?? '') +
    segments
      .slice(1)
      .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ''))
      .join('')
  );
}

function buildPreamble(): string {
  return [
    'void [operationId, name, path, method];',
    'void [pathParams, queryParams];',
    'void [isValidRequestParams, getValidRequestParamsDescription];',
  ].join('\n');
}

function buildExecutorBlock(path: string, method: string): string {
  const code: string[] = [];
  code.push('/**');
  code.push(' * Execute the underlying Open Curriculum API endpoint.');
  code.push(' *');
  code.push(' * @param client - Preconfigured Oak API client with authentication and telemetry.');
  code.push(
    ' * @returns Handler that accepts validated MCP parameters and resolves with the raw API payload.',
  );
  code.push(' */');
  code.push('const executor= (client: OakApiPathBasedClient) => {');
  code.push('  return async (params: ValidRequestParams): Promise<unknown> => {');
  code.push('    if (!isValidRequestParams(params)) {');
  code.push('      throw new TypeError(getValidRequestParamsDescription());');
  code.push('    }');
  code.push(`    const ep = client[${JSON.stringify(path)}];`);
  code.push(`    const call = ep ? ep.${method.toUpperCase()} : undefined;`);
  code.push('    if (typeof call !== "function") {');
  code.push(
    `      throw new TypeError('Invalid method on endpoint: ${method.toUpperCase()} for ${path}');`,
  );
  code.push('    }');
  code.push('    return call(params);');
  code.push('  };');
  code.push('};');
  code.push('');
  code.push('/**');
  code.push(
    ' * Retains compatibility with internal call sites that still compose request envelopes manually.',
  );
  code.push(' *');
  code.push(' * @param client - Oak API client instance.');
  code.push(' * @param _params - Schema-validated request parameters.');
  code.push(' */');
  code.push(
    'const getExecutorFromGenericRequestParams = async (client: OakApiPathBasedClient, _params: ValidRequestParams): Promise<unknown> => {',
  );
  code.push('  return executor(client)(_params);');
  code.push('};');
  code.push('');
  code.push('/**');
  code.push(
    ' * Convenience wrapper that mirrors the SDK executor signature used by MCP transports.',
  );
  code.push(' *');
  code.push(' * @param client - Oak API client configured for the current transport.');
  code.push(' * @param _params - Arbitrary request payload received from the MCP runtime.');
  code.push(' * @returns Raw API payload once the call succeeds.');
  code.push(' * @throws TypeError when validation fails before reaching the API.');
  code.push(' */');
  code.push(
    'const invoke = async (client: OakApiPathBasedClient, _params: unknown): Promise<unknown> => {',
  );
  code.push('  if (!isValidRequestParams(_params)) {');
  code.push('    throw new TypeError(getValidRequestParamsDescription());');
  code.push('  }');
  code.push('  return executor(client)(_params);');
  code.push('};');
  code.push('');
  return code.join('\n');
}

function buildExportBlock(safeName: string, description: string | undefined): string {
  const lines: string[] = [];
  lines.push('/**');
  lines.push(' * Tool descriptor consumed by MCP_TOOLS.');
  lines.push(' *');
  lines.push(' * @see MCP_TOOLS');
  lines.push(
    ' * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.',
  );
  lines.push(' */');
  lines.push(`export const ${safeName}: ToolDescriptor = {`);
  lines.push('  executor,');
  lines.push('  getExecutorFromGenericRequestParams,');
  lines.push('  invoke,');
  lines.push('  pathParams,');
  lines.push('  queryParams,');
  lines.push('  inputSchema,');
  lines.push('  operationId,');
  lines.push('  name,');
  if (description) {
    lines.push(`  description: ${JSON.stringify(description)},`);
  }
  lines.push('  path,');
  lines.push('  method,');
  lines.push('};');
  lines.push('');
  return lines.join('\n');
}

function toToolDescription(operation: OperationObject): string | undefined {
  const raw = typeof operation.description === 'string' ? operation.description : '';
  if (!raw.trim()) {
    return undefined;
  }
  const updated = raw
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    .replace(/\bThis endpoint\b/gi, (match) => (match[0] === 'T' ? 'This tool' : 'this tool'))
    .replace(/\s+/g, ' ')
    .trim();
  return updated.length > 0 ? updated : undefined;
}

export function emitIndex(
  toolName: string,
  path: string,
  method: string,
  operation: OperationObject,
  _pathParams: readonly string[],
  _queryParams: readonly string[],
): string {
  void [_pathParams, _queryParams];
  const lines: string[] = [];
  lines.push(buildPreamble());
  lines.push(buildExecutorBlock(path, method));
  lines.push(buildExportBlock(buildSafeName(toolName), toToolDescription(operation)));
  return lines.join('\n');
}
