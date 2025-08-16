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
  code.push('const executor= (client: OakApiPathBasedClient) => {');
  code.push('  return async (params: ValidRequestParams): Promise<unknown> => {');
  code.push('    if (!isValidRequestParams(params)) {');
  code.push('      throw new TypeError(getValidRequestParamsDescription());');
  code.push('    }');
  code.push(`    const ep = (client as Record<string, unknown>)[${JSON.stringify(path)}];`);
  code.push(
    `    const call = ep && typeof ep === "object" ? (ep as Record<string, (p: ValidRequestParams) => Promise<unknown>>)[${JSON.stringify(
      method.toUpperCase(),
    )}] : undefined;`,
  );
  code.push('    if (typeof call !== "function") {');
  code.push(
    `      throw new TypeError('Invalid method on endpoint: ${method.toUpperCase()} for ${path}');`,
  );
  code.push('    }');
  code.push('    return call(params);');
  code.push('  };');
  code.push('};');
  code.push('');
  code.push(
    'const getExecutorFromGenericRequestParams = async (client: OakApiPathBasedClient, _params: ValidRequestParams) => {',
  );
  code.push('  return executor(client)(_params);');
  code.push('};');
  code.push('');
  return code.join('\n');
}

function buildExportBlock(safeName: string): string {
  return [
    `export const ${safeName} = {`,
    '  executor,',
    '  getExecutorFromGenericRequestParams,',
    '  pathParams,',
    '  queryParams,',
    '  operationId,',
    '  name,',
    '  path,',
    '  method,',
    '};',
    '',
  ].join('\n');
}

export function emitIndex(
  toolName: string,
  path: string,
  method: string,
  _operation: OperationObject,
  _pathParams: readonly string[],
  _queryParams: readonly string[],
): string {
  void [_operation, _pathParams, _queryParams];
  const lines: string[] = [];
  lines.push(buildPreamble());
  lines.push(buildExecutorBlock(path, method));
  lines.push(buildExportBlock(buildSafeName(toolName)));
  return lines.join('\n');
}
