import { z } from 'zod';

import type { StatusDiscriminant, ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getResponseDescriptorsByOperationId } from '../../../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-sequences-units
 * Path: /sequences/{sequence}/units
 * Method: GET
 */

const operationId = 'getSequences-getSequenceUnits' as const;
const name = 'get-sequences-units' as const;
const path = '/sequences/{sequence}/units' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** The sequence slug identifier, including the key stage 4 option where relevant. */
  readonly sequence: string;
}
/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
  /** The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used. Allowed values: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, all-years */
  readonly year?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | 'all-years';
}
export interface ToolParams {
  readonly path: ToolPathParams;
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."},"year":{"type":"string","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","enum":["1","2","3","4","5","6","7","8","9","10","11","all-years"]}} as const, additionalProperties: false as const, required: ["sequence"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string() }), query: z.object({ year: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.literal("5"), z.literal("6"), z.literal("7"), z.literal("8"), z.literal("9"), z.literal("10"), z.literal("11"), z.literal("all-years")]).optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.object({ sequence: z.string(), year: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.literal("5"), z.literal("6"), z.literal("7"), z.literal("8"), z.literal("9"), z.literal("10"), z.literal("11"), z.literal("all-years")]).optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."},"year":{"type":"string","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","enum":["1","2","3","4","5","6","7","8","9","10","11","all-years"]}},"additionalProperties":false,"required":["sequence"]}\nRequired: sequence';
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
      sequence: flatArgs.sequence,
    },
    query: {
      year: flatArgs.year,
    },
  };
  return { params };
}
const responseDescriptors = getResponseDescriptorsByOperationId(operationId);
const documentedStatuses = ['200'] as const;
type DocumentedStatus = typeof documentedStatuses[number];
type DocumentedStatusDiscriminant = StatusDiscriminant<DocumentedStatus>;
const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];
if (!primaryResponseDescriptor) {
  throw new TypeError('Missing response descriptor for documented status 200 on getSequences-getSequenceUnits.');
}
const resolveDescriptorForStatus = (status: number) => {
  const directKey = String(status);
  const direct = responseDescriptors[directKey as keyof typeof responseDescriptors];
  if (direct) {
    return direct;
  }
  const rangeKey = `${String(Math.trunc(status / 100))}XX` as keyof typeof responseDescriptors;
  const range = responseDescriptors[rangeKey];
  if (range) {
    return range;
  }
  return responseDescriptors["default" as keyof typeof responseDescriptors];
};
const toStatusDiscriminant = (status: string) => {
  const numeric = Number(status);
  return Number.isNaN(numeric) ? status : numeric;
};
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getSequencesUnits = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/sequences/{sequence}/units"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /sequences/{sequence}/units');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      throw new TypeError(`Undocumented response status ${String(status)} for getSequences-getSequenceUnits. Documented statuses: 200`);
    }
    const payload = status >= 200 && status < 300 ? response.data : response.error;
    return payload as z.infer<typeof descriptorForStatus.zod>;
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
  description: "This tool returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.",
  path,
  method,
  documentedStatuses,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
  validateOutput: (data: unknown) => {
    const attemptedStatuses: { status: DocumentedStatusDiscriminant; issues: unknown[] }[] = [];
    for (const statusKey of documentedStatuses) {
      const descriptor = responseDescriptors[statusKey as keyof typeof responseDescriptors];
      if (!descriptor) {
        continue;
      }
      const result = descriptor.zod.safeParse(data);
      if (result.success) {
        return { ok: true, data: result.data, status: toStatusDiscriminant(statusKey) as DocumentedStatusDiscriminant };
      }
      attemptedStatuses.push({ status: toStatusDiscriminant(statusKey) as DocumentedStatusDiscriminant, issues: result.error.issues });
    }
    return {
      ok: false, message: 'Response does not match any documented schema for statuses: 200' ,
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
