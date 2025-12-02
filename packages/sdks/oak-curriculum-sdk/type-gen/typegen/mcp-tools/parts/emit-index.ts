import type { OperationObject } from 'openapi3-ts/oas31';
import { getSecuritySchemeForTool } from '../apply-security-policy.js';
import { NOAUTH_SCHEME_TYPE } from '../security-types.js';
import { literalName, collectDocumentedStatuses } from './emit-index-helpers.js';
import { kebabToTitleCase } from './kebab-to-title-case.js';
import { toToolDescription, appendPrerequisiteGuidance } from './tool-description.js';

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
  // Security metadata from mcp-security-policy.ts (see apply-security-policy.ts for details)
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
  // MCP annotations: all Oak tools are read-only, non-destructive, idempotent GET operations
  const humanReadableTitle = kebabToTitleCase(toolName);
  lines.push('  annotations: {');
  lines.push('    readOnlyHint: true,');
  lines.push('    destructiveHint: false,');
  lines.push('    idempotentHint: true,');
  lines.push('    openWorldHint: false,');
  lines.push(`    title: ${JSON.stringify(humanReadableTitle)},`);
  lines.push('  },');
  // OpenAI Apps SDK _meta fields for widget integration
  lines.push('  _meta: {');
  lines.push(`    'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',`);
  lines.push(
    `    'openai/toolInvocation/invoking': ${JSON.stringify(`Fetching ${humanReadableTitle}…`)},`,
  );
  lines.push(
    `    'openai/toolInvocation/invoked': ${JSON.stringify(`${humanReadableTitle} loaded`)},`,
  );
  lines.push(`    'openai/widgetAccessible': true,`);
  lines.push(`    'openai/visibility': 'public',`);
  lines.push(`    securitySchemes: ${securitySchemesLiteral},`);
  lines.push('  },');
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

export function emitIndex(
  toolName: string,
  path: string,
  method: string,
  operationId: string,
  operation: OperationObject,
): string {
  // Get base description from OpenAPI spec
  const baseDescription = toToolDescription(operation);

  // Determine if tool requires authentication (not noauth)
  const securitySchemes = getSecuritySchemeForTool(toolName);
  const requiresAuth = securitySchemes[0]?.type !== NOAUTH_SCHEME_TYPE;

  // Conditionally append domain prerequisite guidance
  const description = appendPrerequisiteGuidance(baseDescription, requiresAuth);

  return buildExports({
    toolName,
    descriptorName: literalName(toolName),
    description,
    path,
    method,
    operationId,
    operation,
  });
}
