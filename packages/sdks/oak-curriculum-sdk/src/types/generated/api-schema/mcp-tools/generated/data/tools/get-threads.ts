import { z } from 'zod';

import type { ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getResponseDescriptorsByOperationId } from '../../../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-threads
 * Path: /threads
 * Method: GET
 */

const operationId = 'getThreads-getAllThreads' as const;
const name = 'get-threads' as const;
const path = '/threads' as const;
const method = 'GET' as const;


export interface ToolParams { readonly __noParams?: never; }

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"params":{"type":"object","properties":{},"additionalProperties":false}} as const, additionalProperties: false as const, required: ["params"] };
export const toolZodSchema = z.object({ params: z.object({}) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"params":{"type":"object","properties":{},"additionalProperties":false}},"required":["params"],"additionalProperties":false}\nRequired: params';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptors = getResponseDescriptorsByOperationId(operationId);
const documentedStatuses = ['200'] as const;
const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];
if (!primaryResponseDescriptor) {
  throw new TypeError('Missing response descriptor for documented status 200 on getThreads-getAllThreads.');
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
export const getThreads = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/threads"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /threads');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      throw new TypeError(`Undocumented response status ${String(status)} for getThreads-getAllThreads. Documented statuses: 200`);
    }
    const payload = status >= 200 && status < 300 ? response.data : response.error;
    return payload as z.infer<typeof descriptorForStatus.zod>;
  },
  toolZodSchema,
  toolInputJsonSchema,
  toolOutputJsonSchema: primaryResponseDescriptor.json,
  zodOutputSchema: primaryResponseDescriptor.zod,
  describeToolArgs,
  inputSchema: toolInputJsonSchema,
  operationId,
  name,
  description: "This tool returns an array of all threads, across all subjects. Threads signpost groups of units that link to one another, building a common body of knowledge over time. They are an important component of how Oak’s curricula are sequenced.",
  path,
  method,
  validateOutput: (data: unknown) => {
    const attemptedStatuses: { status: number | string; issues: unknown[] }[] = [];
    for (const statusKey of documentedStatuses) {
      const descriptor = responseDescriptors[statusKey as keyof typeof responseDescriptors];
      if (!descriptor) {
        continue;
      }
      const result = descriptor.zod.safeParse(data);
      if (result.success) {
        return { ok: true, data: result.data, status: toStatusDiscriminant(statusKey) };
      }
      attemptedStatuses.push({ status: toStatusDiscriminant(statusKey), issues: result.error.issues });
    }
    return {
      ok: false, message: 'Response does not match any documented schema for statuses: 200' ,
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof primaryResponseDescriptor.zod>>;
