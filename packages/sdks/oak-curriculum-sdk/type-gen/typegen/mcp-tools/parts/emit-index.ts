import type { OperationObject } from 'openapi3-ts/oas31';

function literalName(toolName: string): string {
  const parts = toolName.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (parts.length === 0) {
    return toolName;
  }
  return parts
    .map((segment, index) => {
      const lower = segment.toLowerCase();
      if (index === 0) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

function buildExports({
  descriptorName,
  description,
  path,
  method,
}: {
  readonly descriptorName: string;
  readonly description: string | undefined;
  readonly path: string;
  readonly method: string;
}): string {
  const lines: string[] = [];
  lines.push(
    `const responseDescriptor = getDescriptorSchemaForEndpoint('${method.toLowerCase()}', '${path}');`,
  );
  lines.push('/**');
  lines.push(' * Tool descriptor consumed by MCP_TOOLS.');
  lines.push(' *');
  lines.push(' * @see MCP_TOOLS');
  lines.push(
    ' * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.',
  );
  lines.push(' */');
  lines.push(`export const ${descriptorName} = {`);
  lines.push('  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {');
  lines.push('    const validation = toolZodSchema.safeParse(args);');
  lines.push('    if (!validation.success) {');
  lines.push('      throw new TypeError(describeToolArgs());');
  lines.push('    }');
  lines.push(`    const endpoint = client[${JSON.stringify(path)}];`);
  lines.push(`    const call = endpoint ? endpoint.${method.toUpperCase()} : undefined;`);
  lines.push('    if (typeof call !== "function") {');
  lines.push(
    `      throw new TypeError('Invalid method on endpoint: ${method.toUpperCase()} for ${path}');`,
  );
  lines.push('    }');
  lines.push('    return call(validation.data);');
  lines.push('  },');
  lines.push('  toolZodSchema,');
  lines.push('  toolInputJsonSchema,');
  lines.push('  toolOutputJsonSchema: responseDescriptor.json,');
  lines.push('  zodOutputSchema: responseDescriptor.zod,');
  lines.push('  describeToolArgs,');
  lines.push('  inputSchema: toolInputJsonSchema,');
  lines.push('  operationId,');
  lines.push('  name,');
  if (description) {
    lines.push(`  description: ${JSON.stringify(description)},`);
  }
  lines.push('  path,');
  lines.push('  method,');
  lines.push('  validateOutput: (data: unknown) => {');
  lines.push('    const result = responseDescriptor.zod.safeParse(data);');
  lines.push('    if (result.success) {');
  lines.push('      return { ok: true, data: result.data };');
  lines.push('    }');
  lines.push(
    "    return { ok: false, message: 'Invalid response payload. Please match the generated output schema.' };",
  );
  lines.push('  },');
  lines.push(
    '} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof responseDescriptor.zod>>;',
  );
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
): string {
  return buildExports({
    descriptorName: literalName(toolName),
    description: toToolDescription(operation),
    path,
    method,
  });
}
