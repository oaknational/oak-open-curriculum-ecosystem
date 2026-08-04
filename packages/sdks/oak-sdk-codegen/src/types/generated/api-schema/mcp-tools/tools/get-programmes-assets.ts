import { z } from 'zod';

import type { ToolDescriptor } from '../contract/tool-descriptor.contract.js';
import { UndocumentedResponseError } from '../contract/undocumented-response-error.js';
import { getResponseDescriptorsByOperationId } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../client-types.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-programmes-assets
 * Path: /programmes/\{programme\}/assets
 * Method: GET
 */

const operationId = 'getAssets-getProgrammeAssets' as const;
const name = 'get-programmes-assets' as const;
const path = '/programmes/{programme}/assets' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** The programme slug identifier */
  readonly programme: string;
}
/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
  /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point Default: 0 */
  readonly offset?: number;
  /** Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20 */
  readonly limit?: number;
  /** Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint Allowed values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers */
  readonly type?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
}
export interface ToolParams {
  readonly path: ToolPathParams;
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"programme":{"type":"string","description":"The programme slug identifier","examples":["computing-secondary-year-7"]},"offset":{"type":"number","description":"If limiting results returned, this allows you to return the next set of results, starting at the given offset point","default":0,"examples":[0]},"limit":{"type":"number","description":"Limit the number of lessons, e.g. return a maximum of 300 lessons","default":20,"examples":[20],"maximum":300},"type":{"type":"string","description":"Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}} as const, additionalProperties: false as const, required: ["programme"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ programme: z.string().describe("The programme slug identifier") }), query: z.object({ offset: z.number().describe("If limiting results returned, this allows you to return the next set of results, starting at the given offset point").optional(), limit: z.number().lte(300).describe("Limit the number of lessons, e.g. return a maximum of 300 lessons").optional(), type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.strictObject({ programme: z.string().describe("The programme slug identifier").meta({ examples: ["computing-secondary-year-7"] }), offset: z.preprocess((val) => typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val, z.number()).describe("If limiting results returned, this allows you to return the next set of results, starting at the given offset point").meta({ examples: [0] }).optional(), limit: z.preprocess((val) => typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val, z.number().lte(300)).describe("Limit the number of lessons, e.g. return a maximum of 300 lessons").meta({ examples: [20] }).optional(), type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint").meta({ examples: ["slideDeck"] }).optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"programme":{"type":"string","description":"The programme slug identifier","examples":["computing-secondary-year-7"]},"offset":{"type":"number","description":"If limiting results returned, this allows you to return the next set of results, starting at the given offset point","default":0,"examples":[0]},"limit":{"type":"number","description":"Limit the number of lessons, e.g. return a maximum of 300 lessons","default":20,"examples":[20],"maximum":300},"type":{"type":"string","description":"Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/assets/{type} endpoint","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false,"required":["programme"]}\nRequired: programme';
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
      programme: flatArgs.programme,
    },
    query: {
      offset: flatArgs.offset,
      limit: flatArgs.limit,
      type: flatArgs.type,
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
  throw new TypeError('Missing response descriptor for documented status 200 on getAssets-getProgrammeAssets.');
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
export const getProgrammesAssets = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/programmes/{programme}/assets"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /programmes/{programme}/assets');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      const responseBody = status >= 200 && status < 300 ? response.data : response.error;
      throw new UndocumentedResponseError(status, 'getAssets-getProgrammeAssets', documentedStatuses, responseBody);
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
  description: "Downloadable assets in a programme\n\nUse when you need every downloadable asset for a single programme (year group) within a subject. Returns assets grouped by lesson with signed download URLs, asset type, lesson title and slug, and attribution. Supports offset/limit pagination; Link: rel=\"next\" header signals more pages. Optionally narrow by asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms. Not for: assets across a whole sequence (GET /sequences/{sequence}/assets); assets for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}).\n\nNOTE: The asset `url` fields returned by this tool are authenticated API endpoints and cannot be used as direct browser download links. To generate a clickable download link for the user, call the `download-asset` tool with the lesson slug and asset type. If `download-asset` is not available (e.g. stdio transport), direct users to the lesson page on the Oak website — use the lesson's `oakUrl` (e.g. `https://www.thenational.academy/teachers/lessons/{lessonSlug}`).",
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
    title: "Get Programmes Assets",
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
      ok: false, message: 'Response does not match any documented schema for statuses: 200, 400, 401, 404',
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
