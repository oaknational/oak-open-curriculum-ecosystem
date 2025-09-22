/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-sequences-assets
 * Path: /sequences/{sequence}/assets
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";
import { getOwnValue } from "../../../../helpers.js";
import { getResponseSchemaForEndpoint } from "../types.js";
import type { OakMcpToolBase, ToolDescriptor } from "../types.js";

const operationId= 'getAssets-getSequenceAssets' as const;
const name= 'get-sequences-assets' as const;
const path= '/sequences/{sequence}/assets' as const;
const method= 'GET' as const;


// Path parameters
// Query parameters
// Type value is optional, not all query parameters are.
const allowedTypeValues= ["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"] as const;
const allowedTypeSet = new Set<string | number | boolean>([...allowedTypeValues]);

const pathParams= {
"sequence":{"typePrimitive":"string","valueConstraint":false,"required":true,"description":"The sequence slug identifier, including the key stage 4 option where relevant."},
};

const queryParams= {
"year":{"typePrimitive":"number","valueConstraint":false,"required":false,"description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},
"type":{"typePrimitive":"string","valueConstraint":true,"required":false,"allowedValues":allowedTypeValues},
};

const pathValueValidators: Readonly<Record<string, (value: unknown) => boolean>> = {
};

const queryValueValidators: Readonly<Record<string, (value: unknown) => boolean>> = {
  "type": (value: unknown) => {
    if (value === undefined) return true;
    if (typeof value !== "string") return false;
    const allowed = allowedTypeSet;
    return allowed.has(value);
  },
};

void pathParams;
void queryParams;
interface PathParamsShape {
  sequence: string;
}
interface QueryParamsShape {
  year?: number;
  type?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
}
interface ValidRequestParams {
  [key: string]: unknown;
  params: {
    path: PathParamsShape;
    query?: QueryParamsShape;
  };
}

function hasRequired(meta: object, container: unknown): boolean {
  if (container === null) return false;
  if (container !== undefined && typeof container !== 'object') return false;
  const obj = typeof container === "object" && container !== null ? container : undefined;
  for (const name in meta) {
    if (!(name in meta)) continue;
    const m = getOwnValue(meta, name);
    const isReq = Boolean(getOwnValue(m, "required"));
    if (isReq) {
      if (!obj || !(name in obj)) return false;
    }
  }
  return true;
}

function validateKnown(validators: Readonly<Record<string, (value: unknown) => boolean>> | undefined, container: unknown): boolean {
  if (!validators) return true;
  for (const k in validators) {
    if (!(k in validators)) continue;
    const fn = validators[k];
    const isObj = typeof container === "object" && container !== null;
    if (typeof fn === "function" && isObj && (k in container)) {
      const v = getOwnValue(container, k);
      if (!fn(v)) return false;
    }
  }
  return true;
}

const inputSchema = { type: 'object' as const, properties: {"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."},"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},"type":{"type":"string","description":"Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}} as const, additionalProperties: false as const, required: ["sequence"] };
function isValidRequestParams(value: unknown): value is ValidRequestParams {
  if (value === null || typeof value !== "object") return false;
  const params = getOwnValue(value, "params");
  if (params === null) return false;
  if (params !== undefined && typeof params !== "object") return false;
  const path = getOwnValue(params, "path");
  const query = getOwnValue(params, "query");
  if (path === null) return false;
  if (path !== undefined && (typeof path !== "object" || Array.isArray(path))) return false;
  if (query === null) return false;
  if (query !== undefined && (typeof query !== "object" || Array.isArray(query))) return false;
  if (!hasRequired(pathParams, path)) return false;
  if (!hasRequired(queryParams, query)) return false;
  if (typeof path === "object" && path !== null) {
    if (!validateKnown(pathValueValidators, path)) return false;
  }
  if (typeof query === "object" && query !== null) {
    if (!validateKnown(queryValueValidators, query)) return false;
  }
  return true;
}

const getValidRequestParamsDescription= (): string => {
  return 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."},"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},"type":{"type":"string","description":"Optional asset type specifier\\n\\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false,"required":["sequence"]}\nRequired: sequence';
};
void [operationId, name, path, method];
void [pathParams, queryParams];
void [isValidRequestParams, getValidRequestParamsDescription];
/**
 * Execute the underlying Open Curriculum API endpoint.
 *
 * @param client - Preconfigured Oak API client with authentication and telemetry.
 * @returns Handler that accepts validated MCP parameters and resolves with the raw API payload.
 */
const executor= (client: OakApiPathBasedClient) => {
  return async (params: ValidRequestParams): Promise<unknown> => {
    if (!isValidRequestParams(params)) {
      throw new TypeError(getValidRequestParamsDescription());
    }
    const ep = client["/sequences/{sequence}/assets"];
    const call = ep ? ep.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /sequences/{sequence}/assets');
    }
    return call(params);
  };
};

/**
 * Retains compatibility with internal call sites that still compose request envelopes manually.
 *
 * @param client - Oak API client instance.
 * @param _params - Schema-validated request parameters.
 */
const getExecutorFromGenericRequestParams = async (client: OakApiPathBasedClient, _params: ValidRequestParams): Promise<unknown> => {
  return executor(client)(_params);
};

/**
 * Convenience wrapper that mirrors the SDK executor signature used by MCP transports.
 *
 * @param client - Oak API client configured for the current transport.
 * @param _params - Arbitrary request payload received from the MCP runtime.
 * @returns Raw API payload once the call succeeds.
 * @throws TypeError when validation fails before reaching the API.
 */
const invoke = async (client: OakApiPathBasedClient, _params: unknown): Promise<unknown> => {
  if (!isValidRequestParams(_params)) {
    throw new TypeError(getValidRequestParamsDescription());
  }
  return executor(client)(_params);
};

/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getSequencesAssets: ToolDescriptor = {
  executor,
  getExecutorFromGenericRequestParams,
  invoke,
  pathParams,
  queryParams,
  inputSchema,
  operationId,
  name,
  description: "This tool returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson. This tool contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.",
  path,
  method,
};

// DEBUG: OakMcpTool generation started
import { z } from 'zod';
import type { ZodSchema } from 'zod';

/**
 * @internal Generated Oak MCP tool stub kept for documentation and regression tests.
 * @remarks Runtime execution flows through the ToolDescriptor entry; this stub will be replaced when tool handlers adopt schema-derived types.
 */
export const getSequencesAssetsTool: OakMcpToolBase<unknown, unknown> = {
  name: 'get-sequences-assets',
  description: 'This endpoint returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson.\nThis endpoint contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.',
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  outputSchema: { type: "object", properties: {}, additionalProperties: false },
  zodInputSchema: z.object({ path: z.object({ sequence: z.string() }), query: z.object({ year: z.number().optional(), type: z.union([z.literal("slideDeck"), z.literal("exitQuiz"), z.literal("exitQuizAnswers"), z.literal("starterQuiz"), z.literal("starterQuizAnswers"), z.literal("supplementaryResource"), z.literal("video"), z.literal("worksheet"), z.literal("worksheetAnswers")]).optional() }).optional() }),
  zodOutputSchema: z.any(), // Response schema will be resolved at runtime
  validateInput: (input: unknown) => {
    const result = z.object({ path: z.object({ sequence: z.string() }), query: z.object({ year: z.number().optional(), type: z.union([z.literal("slideDeck"), z.literal("exitQuiz"), z.literal("exitQuizAnswers"), z.literal("starterQuiz"), z.literal("starterQuizAnswers"), z.literal("supplementaryResource"), z.literal("video"), z.literal("worksheet"), z.literal("worksheetAnswers")]).optional() }).optional() }).safeParse(input);
    if (result.success) {
      return { ok: true, data: result.data };
    } else {
      return { ok: false, message: result.error.message };
    }
  },
  validateOutput: (data: unknown) => {
    const schema: ZodSchema = getResponseSchemaForEndpoint('get', '/sequences/{sequence}/assets');
    const result = schema.safeParse(data);
    if (result.success) {
      return { ok: true, data: result.data };
    } else {
      return { ok: false, message: result.error.message };
    }
  },
  handle: async (input: unknown) => {
    // This will be implemented by the actual tool implementation
    // For now, just return the input to avoid unused parameter warning
    await Promise.resolve(); // Satisfy ESLint require-await rule
    return input;
  }
};