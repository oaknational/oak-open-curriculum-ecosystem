/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-sequences-units
 * Path: /sequences/{sequence}/units
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";
import { getOwnValue } from "../../../../helpers.js";

const operationId= 'getSequences-getSequenceUnits' as const;
const name= 'get-sequences-units' as const;
const path= '/sequences/{sequence}/units' as const;
const method= 'GET' as const;


// Path parameters
// Query parameters
// Year value is optional, not all query parameters are.
const allowedYearValues= ["1","2","3","4","5","6","7","8","9","10","11","all-years"] as const;
const allowedYearSet = new Set<string | number | boolean>([...allowedYearValues]);

const pathParams= {
"sequence":{"typePrimitive":"string","valueConstraint":false,"required":true,"description":"The sequence slug identifier, including the key stage 4 option where relevant."},
};

const queryParams= {
"year":{"typePrimitive":"string","valueConstraint":true,"required":false,"allowedValues":allowedYearValues},
};

const pathValueValidators: Readonly<Record<string, (value: unknown) => boolean>> = {
};

const queryValueValidators: Readonly<Record<string, (value: unknown) => boolean>> = {
  "year": (value: unknown) => {
    if (value === undefined) return true;
    if (typeof value !== "string") return false;
    const allowed = allowedYearSet;
    return allowed.has(value);
  },
};

void pathParams;
void queryParams;
type PathParamsShape = {
  sequence: string;
}
type QueryParamsShape = {
  year?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | 'all-years';
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

const inputSchema = { type: 'object' as const, properties: {"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."},"year":{"type":"string","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","enum":["1","2","3","4","5","6","7","8","9","10","11","all-years"]}} as const, additionalProperties: false as const, required: ["sequence"] };
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
  return 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."},"year":{"type":"string","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","enum":["1","2","3","4","5","6","7","8","9","10","11","all-years"]}},"additionalProperties":false,"required":["sequence"]}\nRequired: sequence';
};
void [operationId, name, path, method];
void [pathParams, queryParams];
void [isValidRequestParams, getValidRequestParamsDescription];
const executor= (client: OakApiPathBasedClient) => {
  return async (params: ValidRequestParams): Promise<unknown> => {
    if (!isValidRequestParams(params)) {
      throw new TypeError(getValidRequestParamsDescription());
    }
    const ep = client["/sequences/{sequence}/units"];
    const call = ep ? ep.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /sequences/{sequence}/units');
    }
    return call(params);
  };
};

const getExecutorFromGenericRequestParams = async (client: OakApiPathBasedClient, _params: ValidRequestParams): Promise<unknown> => {
  return executor(client)(_params);
};

const invoke = async (client: OakApiPathBasedClient, _params: unknown): Promise<unknown> => {
  if (!isValidRequestParams(_params)) {
    throw new TypeError(getValidRequestParamsDescription());
  }
  return executor(client)(_params);
};

export const getSequencesUnits = {
  executor,
  getExecutorFromGenericRequestParams,
  invoke,
  pathParams,
  queryParams,
  inputSchema,
  operationId,
  name,
  path,
  method,
};

// DEBUG: OakMcpTool generation started
import { z } from 'zod';
import type { ZodSchema } from 'zod';
import { getResponseSchemaForEndpoint } from '../types.js';
import type { OakMcpToolBase } from '../types.js';

export const getSequencesUnitsTool: OakMcpToolBase<unknown, unknown> = {
  name: 'get-sequences-units',
  description: 'This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.',
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  outputSchema: { type: "object", properties: {}, additionalProperties: false },
  zodInputSchema: z.object({ path: z.object({ sequence: z.string() }), query: z.object({ year: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.literal("5"), z.literal("6"), z.literal("7"), z.literal("8"), z.literal("9"), z.literal("10"), z.literal("11"), z.literal("all-years")]).optional() }).optional() }),
  zodOutputSchema: z.any(), // Response schema will be resolved at runtime
  validateInput: (input: unknown) => {
    const result = z.object({ path: z.object({ sequence: z.string() }), query: z.object({ year: z.union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.literal("5"), z.literal("6"), z.literal("7"), z.literal("8"), z.literal("9"), z.literal("10"), z.literal("11"), z.literal("all-years")]).optional() }).optional() }).safeParse(input);
    if (result.success) {
      return { ok: true, data: result.data };
    } else {
      return { ok: false, message: result.error.message };
    }
  },
  validateOutput: (data: unknown) => {
    const schema: ZodSchema = getResponseSchemaForEndpoint('get', '/sequences/{sequence}/units');
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