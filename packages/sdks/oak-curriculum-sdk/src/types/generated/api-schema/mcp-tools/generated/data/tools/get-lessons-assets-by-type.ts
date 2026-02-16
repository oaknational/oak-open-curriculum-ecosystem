import { z } from 'zod';

import type { StatusDiscriminant, ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getResponseDescriptorsByOperationId } from '../../../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-lessons-assets-by-type
 * Path: /lessons/\{lesson\}/assets/\{type\}
 * Method: GET
 */

const operationId = 'getAssets-getLessonAsset' as const;
const name = 'get-lessons-assets-by-type' as const;
const path = '/lessons/{lesson}/assets/{type}' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** The lesson slug */
  readonly lesson: string;
  /** Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/asset/\{type\} endpoint Allowed values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers */
  readonly type: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
}
export interface ToolParams {
  readonly path: ToolPathParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"lesson":{"type":"string","description":"The lesson slug","examples":["child-workers-in-the-victorian-era"]},"type":{"type":"string","description":"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}} as const, additionalProperties: false as const, required: ["lesson","type"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ lesson: z.string().describe("The lesson slug"), type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint") }) }) });
export const toolMcpFlatInputSchema = z.object({ lesson: z.string().describe("The lesson slug"), type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint") });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"lesson":{"type":"string","description":"The lesson slug","examples":["child-workers-in-the-victorian-era"]},"type":{"type":"string","description":"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false,"required":["lesson","type"]}\nRequired: lesson, type';
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
      lesson: flatArgs.lesson,
      type: flatArgs.type,
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
  throw new TypeError('Missing response descriptor for documented status 200 on getAssets-getLessonAsset.');
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
function toStatusDiscriminant<T extends string>(status: T): StatusDiscriminant<T> {
  const numeric = Number(status);
  return (Number.isNaN(numeric) ? status : numeric) as StatusDiscriminant<T>;
}
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getLessonsAssetsByType = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/lessons/{lesson}/assets/{type}"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /lessons/{lesson}/assets/{type}');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      throw new TypeError(`Undocumented response status ${String(status)} for getAssets-getLessonAsset. Documented statuses: 200`);
    }
    const payload = status >= 200 && status < 300 ? response.data : response.error;
    // Structural limitation: descriptor is dynamically resolved at runtime, so
    // TypeScript cannot statically infer the output type. This single cast
    // bridges the gap between the runtime-selected schema and the static type.
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
  description: "Lesson asset by type\n\nThis tool will stream the downloadable asset for the given lesson and type. There is no response returned for this tool as it returns a content attachment.\n\nPREREQUISITE: If unfamiliar with Oak's curriculum structure, call `get-ontology` first to understand key stages, subjects, entity hierarchy, and ID formats.",
  path,
  method,
  documentedStatuses,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
  requiresDomainContext: true,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Lessons Assets By Type",
  },
  _meta: {
    'openai/outputTemplate': "ui://widget/oak-json-viewer-local.html",
    'openai/toolInvocation/invoking': "Fetching Get Lessons Assets By Type…",
    'openai/toolInvocation/invoked': "Get Lessons Assets By Type loaded",
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
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
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
