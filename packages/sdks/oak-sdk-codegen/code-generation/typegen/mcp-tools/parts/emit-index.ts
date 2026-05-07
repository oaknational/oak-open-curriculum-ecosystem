import type { OperationObject } from 'openapi3-ts/oas31';
import { getSecuritySchemeForTool } from '../apply-security-policy.js';
import { NOAUTH_SCHEME_TYPE } from '../security-types.js';
import { literalName, collectDocumentedStatuses } from './emit-index-helpers.js';
import { kebabToTitleCase } from './kebab-to-title-case.js';
import {
  toToolDescription,
  appendPrerequisiteGuidance,
  appendToolEnhancements,
} from './tool-description.js';
import { BASE_WIDGET_URI, WIDGET_TOOL_NAMES } from '../../cross-domain-constants.js';

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

  // Determine if tool benefits from domain context (get-curriculum-model)
  // Utility tools (noauth) like get-rate-limit don't need domain context
  const requiresDomainContext = securitySchemes[0]?.type !== NOAUTH_SCHEME_TYPE;

  const documentedStatuses = collectDocumentedStatuses(operation);
  const documentedStatusLiterals = `[${documentedStatuses
    .map((status) => `'${status}'`)
    .join(', ')}] as const`;
  const primaryStatus = documentedStatuses[0] ?? '200';
  const documentedStatusesMessage = documentedStatuses.join(', ');
  const lines: string[] = [];
  lines.push(
    'const responseDescriptors = getResponseDescriptorsByOperationId(operationId);',
    `const documentedStatuses = ${documentedStatusLiterals};`,
    'type DocumentedStatus = typeof documentedStatuses[number];',
  );

  const statusDiscriminantEntries = documentedStatuses
    .map((status) => {
      const numeric = Number(status);
      return Number.isNaN(numeric) ? `'${status}': '${status}'` : `'${status}': ${numeric}`;
    })
    .join(', ');
  lines.push(
    `const STATUS_DISCRIMINANTS = { ${statusDiscriminantEntries} } as const;`,
    'type DocumentedStatusDiscriminant = typeof STATUS_DISCRIMINANTS[DocumentedStatus];',
    'const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];',
    'if (!primaryResponseDescriptor) {',
    `  throw new TypeError('Missing response descriptor for documented status ${primaryStatus} on ${operationId}.');`,
    '}',
    'const resolveDescriptorForStatus = (status: number) => {',
    '  const directKey = String(status);',
    '  const direct = responseDescriptors[directKey];',
    '  if (direct) {',
    '    return direct;',
    '  }',
    '  const rangeKey = `${String(Math.trunc(status / 100))}XX`;',
    '  const range = responseDescriptors[rangeKey];',
    '  if (range) {',
    '    return range;',
    '  }',
    '  return responseDescriptors["default"];',
    '};',
    '/**',
    ' * Tool descriptor consumed by MCP_TOOLS.',
    ' *',
    ' * @see MCP_TOOLS',
    ' * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.',
    ' */',
    `export const ${descriptorName} = {`,
    '  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {',
    '    const validation = toolZodSchema.safeParse(args);',
    '    if (!validation.success) {',
    '      throw new TypeError(describeToolArgs());',
    '    }',
    `    const endpoint = client[${JSON.stringify(path)}];`,
    `    const call = endpoint ? endpoint.${method.toUpperCase()} : undefined;`,
    '    if (typeof call !== "function") {',
    `      throw new TypeError('Invalid method on endpoint: ${method.toUpperCase()} for ${path}');`,
    '    }',
    '    const response = await call(validation.data);',
    '    const status = response.response.status;',
    '    const descriptorForStatus = resolveDescriptorForStatus(status);',
    '    if (!descriptorForStatus) {',
    '      const responseBody = status >= 200 && status < 300 ? response.data : response.error;',
    `      throw new UndocumentedResponseError(status, '${operationId}', documentedStatuses, responseBody);`,
    '    }',
    '    const payload = status >= 200 && status < 300 ? response.data : response.error;',
    '    return { httpStatus: status, payload };',
    '  },',
    '  toolZodSchema,',
    '  toolInputJsonSchema,',
    '  toolMcpFlatInputSchema,',
    '  transformFlatToNestedArgs,',

    '  toolOutputJsonSchema: primaryResponseDescriptor.json,',
    '  zodOutputSchema: primaryResponseDescriptor.zod,',
    '  describeToolArgs,',
    '  inputSchema: toolInputJsonSchema,',
    '  operationId,',
    '  name,',
  );
  if (description) {
    lines.push(`  description: ${JSON.stringify(description)},`);
  }
  lines.push(
    '  path,',
    '  method,',
    '  documentedStatuses,',
    `  securitySchemes: ${securitySchemesLiteral},`,
    `  requiresDomainContext: ${requiresDomainContext ? 'true' : 'false'},`,
  );
  // MCP annotations: all Oak tools are read-only, non-destructive, idempotent GET operations
  const humanReadableTitle = kebabToTitleCase(toolName);
  lines.push(
    '  annotations: {',
    '    readOnlyHint: true,',
    '    destructiveHint: false,',
    '    idempotentHint: true,',
    '    openWorldHint: false,',
    `    title: ${JSON.stringify(humanReadableTitle)},`,
    '  },',
  );
  // MCP Apps standard _meta fields (ADR-141).
  // Only tools in WIDGET_TOOL_NAMES get ui.resourceUri — all others have
  // _meta with securitySchemes only (no widget UI).
  const isWidgetTool = WIDGET_TOOL_NAMES.has(toolName);
  if (isWidgetTool) {
    lines.push(
      '  _meta: {',
      `    ui: { resourceUri: ${JSON.stringify(BASE_WIDGET_URI)} },`,
      `    securitySchemes: ${securitySchemesLiteral},`,
      '  },',
    );
  } else {
    lines.push('  _meta: {', `    securitySchemes: ${securitySchemesLiteral},`, '  },');
  }
  lines.push(
    '  validateOutput: (data: unknown) => {',
    '    const attemptedStatuses: { status: DocumentedStatusDiscriminant; issues: z.ZodError["issues"] }[] = [];',
    '    for (const statusKey of documentedStatuses) {',
    '      const descriptor = responseDescriptors[statusKey];',
    '      if (!descriptor) {',
    '        continue;',
    '      }',
    '      const result = descriptor.zod.safeParse(data);',
    '      if (result.success) {',
    '        return { ok: true, data: result.data, status: STATUS_DISCRIMINANTS[statusKey] };',
    '      }',
    '      attemptedStatuses.push({ status: STATUS_DISCRIMINANTS[statusKey], issues: result.error.issues });',
    '    }',
    '    return {',
    `      ok: false, message: 'Response does not match any documented schema for statuses: ${documentedStatusesMessage}' ,`,
    '      issues: attemptedStatuses.flatMap((entry) => entry.issues),',

    '      attemptedStatuses,',
    '    };',
    '  },',
    '} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;',
    '',
  );
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
  const descriptionWithPrerequisites = appendPrerequisiteGuidance(baseDescription, requiresAuth);
  const description = appendToolEnhancements(descriptionWithPrerequisites, toolName);

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
