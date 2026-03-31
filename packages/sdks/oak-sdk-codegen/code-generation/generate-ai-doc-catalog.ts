interface RenderableParamInfo {
  readonly loc: string;
  readonly name: string;
  readonly typeName: string;
  readonly required: boolean;
  readonly enumCount?: number;
}

export function renderEndpointCatalog(ops: unknown): string {
  const lines: string[] = ['## Endpoint Catalog'];
  const sorted = normalizeAndSortOps(ops);

  for (const op of sorted) {
    renderSingleEndpoint(lines, op);
  }

  return lines.join('\n');
}

export function renderToolCatalog<T extends string>(
  names: readonly T[],
  lookupTool: (name: T) => unknown,
): string {
  const lines: string[] = ['## MCP Tool Catalog'];
  const entries = [...names].sort((a, b) => a.localeCompare(b));

  for (const name of entries) {
    const descriptor = lookupTool(name);
    const operationId = getOwnString(descriptor, 'operationId');
    lines.push(`### ${name}`);
    lines.push(`- path: ${getOwnString(descriptor, 'path') ?? ''}`);
    lines.push(`- method: ${getOwnString(descriptor, 'method') ?? ''}`);
    if (operationId) {
      lines.push(`- operationId: ${operationId}`);
    }
    lines.push(`- path params: ${listParamObjectKeys(getOwnValue(descriptor, 'pathParams'))}`);
    lines.push(`- query params: ${listParamObjectKeys(getOwnValue(descriptor, 'queryParams'))}`);
    lines.push('');
  }

  return lines.join('\n');
}

function isPlainObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isArrayOfObjects(value: unknown): value is object[] {
  return Array.isArray(value) && value.every((entry) => isPlainObject(entry));
}

function getDescriptor(value: unknown, key: PropertyKey): PropertyDescriptor | undefined {
  if (!isPlainObject(value)) {
    return undefined;
  }

  return Object.getOwnPropertyDescriptor(value, key);
}

function getOwnString(value: unknown, key: PropertyKey): string | undefined {
  const descriptor = getDescriptor(value, key);
  return typeof descriptor?.value === 'string' ? descriptor.value : undefined;
}

function getOwnBoolean(value: unknown, key: PropertyKey): boolean | undefined {
  const descriptor = getDescriptor(value, key);
  return typeof descriptor?.value === 'boolean' ? descriptor.value : undefined;
}

function getOwnArrayLength(value: unknown, key: PropertyKey): number | undefined {
  const descriptor = getDescriptor(value, key);
  return Array.isArray(descriptor?.value) ? descriptor.value.length : undefined;
}

function getOwnValue(value: unknown, key: PropertyKey): unknown {
  const descriptor = getDescriptor(value, key);
  return descriptor?.value;
}

function normalizeAndSortOps(ops: unknown): unknown[] {
  const list = Array.isArray(ops) ? Array.from(ops, (entry: unknown) => entry) : [];
  return [...list].sort((left, right) => {
    const leftPath = getOwnString(left, 'path') ?? '';
    const leftMethod = getOwnString(left, 'method') ?? '';
    const rightPath = getOwnString(right, 'path') ?? '';
    const rightMethod = getOwnString(right, 'method') ?? '';
    return (leftPath + leftMethod).localeCompare(rightPath + rightMethod);
  });
}

function renderSingleEndpoint(lines: string[], op: unknown): void {
  const method = getOwnString(op, 'method') ?? '';
  const path = getOwnString(op, 'path') ?? '';
  lines.push(`### ${method.toUpperCase()} ${path}`);
  maybePush(lines, 'operationId', getOwnString(op, 'operationId'));
  maybePush(lines, 'summary', getOwnString(op, 'summary'));
  maybePush(lines, 'description', getOwnString(op, 'description'));
  lines.push('Parameters:');
  lines.push(renderParamSummary(getOwnValue(op, 'parameters')));
  lines.push('');
}

function maybePush(lines: string[], label: string, value: string | undefined): void {
  if (value) {
    lines.push(`- ${label}: ${value}`);
  }
}

function renderParamSummary(params: unknown): string {
  if (!isArrayOfObjects(params) || params.length === 0) {
    return '_No parameters_';
  }

  return params.map(extractParamInfo).map(renderParamLine).join('\n');
}

function extractParamInfo(param: unknown): RenderableParamInfo {
  const loc = getOwnString(param, 'in') ?? 'query';
  const name = getOwnString(param, 'name') ?? '?';
  const required = getOwnBoolean(param, 'required') === true;
  const schema = getOwnValue(param, 'schema');
  const typeName = schema ? (getOwnString(schema, 'type') ?? 'string') : 'string';
  const enumCount = schema ? getOwnArrayLength(schema, 'enum') : undefined;
  return { loc, name, typeName, required, enumCount };
}

function renderParamLine(info: RenderableParamInfo): string {
  const enumText = typeof info.enumCount === 'number' ? ` enum:${String(info.enumCount)}` : '';
  const requiredText = info.required ? ' - required' : '';
  return `- ${info.loc} ${info.name} (${info.typeName}${enumText})${requiredText}`;
}

function listParamObjectKeys(value: unknown): string {
  if (!isPlainObject(value)) {
    return '_None_';
  }

  const keys = Object.keys(value);
  return keys.length === 0 ? '_None_' : keys.join(', ');
}
