/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-subjects-key-stages
 * Path: /subjects/{subject}/key-stages
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";
import { getOwnValue } from "../../../../helpers.js";
import { getResponseSchemaForEndpoint } from "../types.js";
import type { OakMcpToolBase, ToolDescriptor } from "../types.js";

const operationId= 'getSubjects-getSubjectKeyStages' as const;
const name= 'get-subjects-key-stages' as const;
const path= '/subjects/{subject}/key-stages' as const;
const method= 'GET' as const;


// Path parameters

const pathParams= {
"subject":{"typePrimitive":"string","valueConstraint":false,"required":true,"description":"The subject slug identifier"},
};

const queryParams= {
};

const pathValueValidators: Readonly<Record<string, (value: unknown) => boolean>> = {
};

const queryValueValidators: Readonly<Record<string, (value: unknown) => boolean>> = {
};

void pathParams;
void queryParams;
interface PathParamsShape {
  subject: string;
}
interface ValidRequestParams {
  [key: string]: unknown;
  params: {
    path: PathParamsShape;
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

const inputSchema = { type: 'object' as const, properties: {"subject":{"type":"string","description":"The subject slug identifier"}} as const, additionalProperties: false as const, required: ["subject"] };
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
  return 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"subject":{"type":"string","description":"The subject slug identifier"}},"additionalProperties":false,"required":["subject"]}\nRequired: subject';
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
    const ep = client["/subjects/{subject}/key-stages"];
    const call = ep ? ep.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /subjects/{subject}/key-stages');
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
export const getSubjectsKeyStages: ToolDescriptor = {
  executor,
  getExecutorFromGenericRequestParams,
  invoke,
  pathParams,
  queryParams,
  inputSchema,
  operationId,
  name,
  description: "This tool returns a list of key stages that are currently available for a given subject.",
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
export const getSubjectsKeyStagesTool: OakMcpToolBase<unknown, unknown> = {
  name: 'get-subjects-key-stages',
  description: 'This endpoint returns a list of key stages that are currently available for a given subject.',
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  outputSchema: { type: "object", properties: {}, additionalProperties: false },
  zodInputSchema: z.object({ path: z.object({ subject: z.string() }) }),
  zodOutputSchema: z.any(), // Response schema will be resolved at runtime
  validateInput: (input: unknown) => {
    const result = z.object({ path: z.object({ subject: z.string() }) }).safeParse(input);
    if (result.success) {
      return { ok: true, data: result.data };
    } else {
      return { ok: false, message: result.error.message };
    }
  },
  validateOutput: (data: unknown) => {
    const schema: ZodSchema = getResponseSchemaForEndpoint('get', '/subjects/{subject}/key-stages');
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