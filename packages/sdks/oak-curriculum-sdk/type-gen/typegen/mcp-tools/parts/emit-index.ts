import type { OperationObject } from 'openapi3-ts/oas31';
import { getSecuritySchemeForTool } from '../apply-security-policy.js';

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
  toolName,
  descriptorName,
  description,
  path,
  method,
  operationId,
  operation,
}: {
  readonly toolName: string;
  readonly descriptorName: string;
  readonly description: string | undefined;
  readonly path: string;
  readonly method: string;
  readonly operationId: string;
  readonly operation: OperationObject;
}): string {
  // Apply security policy to determine tool's authentication requirements
  //
  // SECURITY METADATA GENERATION:
  // This embeds security requirements directly into each tool descriptor.
  // The security policy is defined in: type-gen/mcp-security-policy.ts
  //
  // CURRENT APPROACH (Simple):
  // All OAuth-protected tools share the same scopes: ['openid', 'email']
  // Tools in PUBLIC_TOOLS get { type: 'noauth' }
  // All other tools get { type: 'oauth2', scopes: ['openid', 'email'] }
  //
  // WHY THIS IS SIMPLE:
  // We don't need per-tool scope variation yet. If you're looking at this
  // because you need different scopes for different tools (e.g., read vs write),
  // you'll need to:
  // 1. Update mcp-security-policy.ts to support per-tool scopes
  // 2. Update apply-security-policy.ts to use tool-specific logic
  // 3. The generation here will automatically pick up the changes
  //
  // PROTECTED RESOURCE METADATA:
  // To get the list of all supported scopes for RFC 9728 metadata,
  // use getScopesSupported() from mcp-security-policy.ts
  const securitySchemes = getSecuritySchemeForTool(toolName);
  const securitySchemesLiteral = `[${securitySchemes
    .map((scheme) => {
      if (scheme.type === 'noauth') {
        return "{ type: 'noauth' }";
      }
      const scopesArray = scheme.scopes
        ? `[${scheme.scopes.map((s) => `'${s}'`).join(', ')}]`
        : '[]';
      return `{ type: 'oauth2', scopes: ${scopesArray} }`;
    })
    .join(', ')}]`;

  const documentedStatuses = collectDocumentedStatuses(operation);
  const documentedStatusLiterals = `[${documentedStatuses
    .map((status) => `'${status}'`)
    .join(', ')}] as const`;
  const primaryStatus = documentedStatuses[0] ?? '200';
  const documentedStatusesMessage = documentedStatuses.join(', ');
  const lines: string[] = [];
  lines.push('const responseDescriptors = getResponseDescriptorsByOperationId(operationId);');
  lines.push(`const documentedStatuses = ${documentedStatusLiterals};`);
  lines.push('type DocumentedStatus = typeof documentedStatuses[number];');
  lines.push('type DocumentedStatusDiscriminant = StatusDiscriminant<DocumentedStatus>;');
  lines.push('const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];');
  lines.push('if (!primaryResponseDescriptor) {');
  lines.push(
    `  throw new TypeError('Missing response descriptor for documented status ${primaryStatus} on ${operationId}.');`,
  );
  lines.push('}');
  lines.push('const resolveDescriptorForStatus = (status: number) => {');
  lines.push('  const directKey = String(status);');
  lines.push(
    '  const direct = responseDescriptors[directKey as keyof typeof responseDescriptors];',
  );
  lines.push('  if (direct) {');
  lines.push('    return direct;');
  lines.push('  }');
  lines.push(
    '  const rangeKey = `${String(Math.trunc(status / 100))}XX` as keyof typeof responseDescriptors;',
  );
  lines.push('  const range = responseDescriptors[rangeKey];');
  lines.push('  if (range) {');
  lines.push('    return range;');
  lines.push('  }');
  lines.push('  return responseDescriptors["default" as keyof typeof responseDescriptors];');
  lines.push('};');
  lines.push('const toStatusDiscriminant = (status: string) => {');
  lines.push('  const numeric = Number(status);');
  lines.push('  return Number.isNaN(numeric) ? status : numeric;');
  lines.push('};');
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
  lines.push('    const response = await call(validation.data);');
  lines.push('    const status = response.response.status;');
  lines.push('    const descriptorForStatus = resolveDescriptorForStatus(status);');
  lines.push('    if (!descriptorForStatus) {');
  lines.push(
    `      throw new TypeError(\`Undocumented response status \${String(status)} for ${operationId}. Documented statuses: ${documentedStatusesMessage}\`);`,
  );
  lines.push('    }');
  lines.push('    const payload = status >= 200 && status < 300 ? response.data : response.error;');
  lines.push('    return payload as z.infer<typeof descriptorForStatus.zod>;');
  lines.push('  },');
  lines.push('  toolZodSchema,');
  lines.push('  toolInputJsonSchema,');
  lines.push('  toolMcpFlatInputSchema,');
  lines.push('  transformFlatToNestedArgs,');
  lines.push('  toolOutputJsonSchema: primaryResponseDescriptor.json,');
  lines.push('  zodOutputSchema: primaryResponseDescriptor.zod,');
  lines.push('  describeToolArgs,');
  lines.push('  inputSchema: toolInputJsonSchema,');
  lines.push('  operationId,');
  lines.push('  name,');
  if (description) {
    lines.push(`  description: ${JSON.stringify(description)},`);
  }
  lines.push('  path,');
  lines.push('  method,');
  lines.push('  documentedStatuses,');
  lines.push(`  securitySchemes: ${securitySchemesLiteral},`);
  lines.push('  validateOutput: (data: unknown) => {');
  lines.push(
    '    const attemptedStatuses: { status: DocumentedStatusDiscriminant; issues: unknown[] }[] = [];',
  );
  lines.push('    for (const statusKey of documentedStatuses) {');
  lines.push(
    '      const descriptor = responseDescriptors[statusKey as keyof typeof responseDescriptors];',
  );
  lines.push('      if (!descriptor) {');
  lines.push('        continue;');
  lines.push('      }');
  lines.push('      const result = descriptor.zod.safeParse(data);');
  lines.push('      if (result.success) {');
  lines.push(
    '        return { ok: true, data: result.data, status: toStatusDiscriminant(statusKey) as DocumentedStatusDiscriminant };',
  );
  lines.push('      }');
  lines.push(
    '      attemptedStatuses.push({ status: toStatusDiscriminant(statusKey) as DocumentedStatusDiscriminant, issues: result.error.issues });',
  );
  lines.push('    }');
  lines.push('    return {');
  lines.push(
    `      ok: false, message: 'Response does not match any documented schema for statuses: ${documentedStatusesMessage}' ,`,
  );
  lines.push('      issues: attemptedStatuses.flatMap((entry) => entry.issues),');
  lines.push('      attemptedStatuses,');
  lines.push('    };');
  lines.push('  },');
  lines.push(
    '} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;',
  );
  lines.push('');
  return lines.join('\n');
}

function collectDocumentedStatuses(operation: OperationObject): readonly string[] {
  const responses = operation.responses ?? {};
  const keys = Object.keys(responses);
  if (keys.length === 0) {
    return ['200'];
  }
  return keys.sort(compareStatuses);
}

function compareStatuses(left: string, right: string): number {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  const leftIsNumber = Number.isFinite(leftNumber);
  const rightIsNumber = Number.isFinite(rightNumber);
  if (leftIsNumber && rightIsNumber) {
    return leftNumber - rightNumber;
  }
  if (leftIsNumber) {
    return -1;
  }
  if (rightIsNumber) {
    return 1;
  }
  return left.localeCompare(right);
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
  operationId: string,
  operation: OperationObject,
): string {
  return buildExports({
    toolName,
    descriptorName: literalName(toolName),
    description: toToolDescription(operation),
    path,
    method,
    operationId,
    operation,
  });
}
