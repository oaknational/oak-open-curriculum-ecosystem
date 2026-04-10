import { z } from 'zod';

import type { ToolDescriptor } from '../contract/tool-descriptor.contract.js';
import { UndocumentedResponseError } from '../contract/undocumented-response-error.js';
import { getResponseDescriptorsByOperationId } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../client-types.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-subjects-key-stages
 * Path: /subjects/\{subject\}/key-stages
 * Method: GET
 */

const operationId = 'getSubjects-getSubjectKeyStages' as const;
const name = 'get-subjects-key-stages' as const;
const path = '/subjects/{subject}/key-stages' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** The subject slug identifier */
  readonly subject: string;
}
export interface ToolParams {
  readonly path: ToolPathParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"subject":{"type":"string","description":"The subject slug identifier","examples":["art"]}} as const, additionalProperties: false as const, required: ["subject"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ subject: z.string().describe("The subject slug identifier") }) }) });
export const toolMcpFlatInputSchema = z.object({ subject: z.string().describe("The subject slug identifier").meta({ examples: ["art"] }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"subject":{"type":"string","description":"The subject slug identifier","examples":["art"]}},"additionalProperties":false,"required":["subject"]}\nRequired: subject';
export const describeToolArgs = () => toolArgsDescription;
/**
 * Transform flat MCP arguments to nested SDK format.
 *
 * Converts flat parameter structure from MCP client to nested params.path/params.query
 * structure expected by SDK invoke function.
 *
 * @param flatArgs - Flat arguments from MCP client (validated against toolMcpFlatInputSchema)
 * @returns Nested arguments for SDK invoke function (ToolArgs format)
 */
export function transformFlatToNestedArgs(flatArgs: z.infer<typeof toolMcpFlatInputSchema>): ToolArgs {
  const params: ToolParams = {
    path: {
      subject: flatArgs.subject,
    },
  };
  return { params };
}
const responseDescriptors = getResponseDescriptorsByOperationId(operationId);
const documentedStatuses = ['200', '400', '401', '404'] as const;
type DocumentedStatus = typeof documentedStatuses[number];
const STATUS_DISCRIMINANTS = { '200': 200, '400': 400, '401': 401, '404': 404 } as const;
type DocumentedStatusDiscriminant = typeof STATUS_DISCRIMINANTS[DocumentedStatus];
const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];
if (!primaryResponseDescriptor) {
  throw new TypeError('Missing response descriptor for documented status 200 on getSubjects-getSubjectKeyStages.');
}
const resolveDescriptorForStatus = (status: number) => {
  const directKey = String(status);
  const direct = responseDescriptors[directKey];
  if (direct) {
    return direct;
  }
  const rangeKey = `${String(Math.trunc(status / 100))}XX`;
  const range = responseDescriptors[rangeKey];
  if (range) {
    return range;
  }
  return responseDescriptors["default"];
};
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getSubjectsKeyStages = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/subjects/{subject}/key-stages"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /subjects/{subject}/key-stages');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      const responseBody = status >= 200 && status < 300 ? response.data : response.error;
      throw new UndocumentedResponseError(status, 'getSubjects-getSubjectKeyStages', documentedStatuses, responseBody);
    }
    const payload = status >= 200 && status < 300 ? response.data : response.error;
    return { httpStatus: status, payload };
  },
  toolZodSchema,
  toolInputJsonSchema,
  toolMcpFlatInputSchema,
  transformFlatToNestedArgs,
  toolOutputJsonSchema: primaryResponseDescriptor.json,
  zodOutputSchema: primaryResponseDescriptor.zod,
  describeToolArgs,
  inputSchema: toolInputJsonSchema,
  operationId,
  name,
  description: "Key stages within a subject\n\nThis tool returns a list of key stages that are currently available for a given subject.\n\nPREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.",
  path,
  method,
  documentedStatuses,
  securitySchemes: [{ type: 'oauth2', scopes: ['email'] }],
  requiresDomainContext: true,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Subjects Key Stages",
  },
  _meta: {
    securitySchemes: [{ type: 'oauth2', scopes: ['email'] }],
  },
  validateOutput: (data: unknown) => {
    const attemptedStatuses: { status: DocumentedStatusDiscriminant; issues: z.ZodError["issues"] }[] = [];
    for (const statusKey of documentedStatuses) {
      const descriptor = responseDescriptors[statusKey];
      if (!descriptor) {
        continue;
      }
      const result = descriptor.zod.safeParse(data);
      if (result.success) {
        return { ok: true, data: result.data, status: STATUS_DISCRIMINANTS[statusKey] };
      }
      attemptedStatuses.push({ status: STATUS_DISCRIMINANTS[statusKey], issues: result.error.issues });
    }
    return {
      ok: false, message: 'Response does not match any documented schema for statuses: 200, 400, 401, 404' ,
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
