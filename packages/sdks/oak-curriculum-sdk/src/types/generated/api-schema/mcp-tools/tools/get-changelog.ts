/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-changelog
 * Path: /changelog
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";
import { getOwnValue } from "../../../../helpers.js";

const operationId= 'changelog-changelog' as const;
const name= 'get-changelog' as const;
const path= '/changelog' as const;
const method= 'GET' as const;




const pathParams= {
};

const queryParams= {
};

const pathValueValidators: Readonly<Record<string, (value: unknown) => boolean>> = {
};

const queryValueValidators: Readonly<Record<string, (value: unknown) => boolean>> = {
};

void pathParams;
void queryParams;
interface ValidRequestParams {
  [key: string]: unknown;
  params?: object
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

const inputSchema = { type: 'object' as const, properties: {} as const, additionalProperties: false as const };
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
  return 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{},"additionalProperties":false}\nRequired: (none)';
};
void [operationId, name, path, method];
void [pathParams, queryParams];
void [isValidRequestParams, getValidRequestParamsDescription];
const executor= (client: OakApiPathBasedClient) => {
  return async (params: ValidRequestParams): Promise<unknown> => {
    if (!isValidRequestParams(params)) {
      throw new TypeError(getValidRequestParamsDescription());
    }
    const ep = client["/changelog"];
    const call = ep ? ep.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /changelog');
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

export const getChangelog = {
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

export const getChangelogTool: OakMcpToolBase<unknown, unknown> = {
  name: 'get-changelog',
  description: 'History of significant changes to the API with associated dates and versions',
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  outputSchema: { type: "object", properties: {}, additionalProperties: false },
  zodInputSchema: z.object({}),
  zodOutputSchema: z.any(), // Response schema will be resolved at runtime
  validateInput: (input: unknown) => {
    const result = z.object({}).safeParse(input);
    if (result.success) {
      return { ok: true, data: result.data };
    } else {
      return { ok: false, message: result.error.message };
    }
  },
  validateOutput: (data: unknown) => {
    const schema: ZodSchema = getResponseSchemaForEndpoint('get', '/changelog');
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