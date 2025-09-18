/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-key-stages-subject-assets
 * Path: /key-stages/{keyStage}/subject/{subject}/assets
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";
import { getOwnValue } from "../../../../helpers.js";

const operationId= 'getAssets-getSubjectAssets' as const;
const name= 'get-key-stages-subject-assets' as const;
const path= '/key-stages/{keyStage}/subject/{subject}/assets' as const;
const method= 'GET' as const;


// Path parameters
const allowedKeyStageValues= ["ks1","ks2","ks3","ks4"] as const;
const allowedKeyStageSet = new Set<string | number | boolean>([...allowedKeyStageValues]);

const allowedSubjectValues= ["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"] as const;
const allowedSubjectSet = new Set<string | number | boolean>([...allowedSubjectValues]);

// Query parameters
// Type value is optional, not all query parameters are.
const allowedTypeValues= ["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"] as const;
const allowedTypeSet = new Set<string | number | boolean>([...allowedTypeValues]);

const pathParams= {
"keyStage":{"typePrimitive":"string","valueConstraint":true,"required":true,"allowedValues":allowedKeyStageValues},
"subject":{"typePrimitive":"string","valueConstraint":true,"required":true,"allowedValues":allowedSubjectValues},
};

const queryParams= {
"type":{"typePrimitive":"string","valueConstraint":true,"required":false,"allowedValues":allowedTypeValues},
"unit":{"typePrimitive":"string","valueConstraint":false,"required":false,"description":"Optional unit slug to additionally filter by"},
};

const pathValueValidators: Readonly<Record<string, (value: unknown) => boolean>> = {
  "keyStage": (value: unknown) => {
    if (typeof value !== "string") return false;
    const allowed = allowedKeyStageSet;
    return allowed.has(value);
  },
  "subject": (value: unknown) => {
    if (typeof value !== "string") return false;
    const allowed = allowedSubjectSet;
    return allowed.has(value);
  },
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
  keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
  subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
}
interface QueryParamsShape {
  type?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
  unit?: string;
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

const inputSchema = { type: 'object' as const, properties: {"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase","enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)","enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"type":{"type":"string","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by"}} as const, additionalProperties: false as const, required: ["keyStage","subject"] };
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
  return 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. \'ks2\' - note that casing is important here, and should be lowercase","enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to search by, e.g. \'science\' - note that casing is important here (always lowercase)","enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"type":{"type":"string","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by"}},"additionalProperties":false,"required":["keyStage","subject"]}\nRequired: keyStage, subject';
};
void [operationId, name, path, method];
void [pathParams, queryParams];
void [isValidRequestParams, getValidRequestParamsDescription];
const executor= (client: OakApiPathBasedClient) => {
  return async (params: ValidRequestParams): Promise<unknown> => {
    if (!isValidRequestParams(params)) {
      throw new TypeError(getValidRequestParamsDescription());
    }
    const ep = client["/key-stages/{keyStage}/subject/{subject}/assets"];
    const call = ep ? ep.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /key-stages/{keyStage}/subject/{subject}/assets');
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

export const getKeyStagesSubjectAssets = {
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

export const getKeyStagesSubjectAssetsTool: OakMcpToolBase<unknown, unknown> = {
  name: 'get-key-stages-subject-assets',
  description: 'This endpoint returns signed download URLs and types for available assets for a given key stage and subject, grouped by lesson. You can also optionally filter by type and unit.',
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  outputSchema: { type: "object", properties: {}, additionalProperties: false },
  zodInputSchema: z.object({ path: z.object({ keyStage: z.union([z.literal("ks1"), z.literal("ks2"), z.literal("ks3"), z.literal("ks4")]), subject: z.union([z.literal("art"), z.literal("citizenship"), z.literal("computing"), z.literal("cooking-nutrition"), z.literal("design-technology"), z.literal("english"), z.literal("french"), z.literal("geography"), z.literal("german"), z.literal("history"), z.literal("maths"), z.literal("music"), z.literal("physical-education"), z.literal("religious-education"), z.literal("rshe-pshe"), z.literal("science"), z.literal("spanish")]) }), query: z.object({ type: z.union([z.literal("slideDeck"), z.literal("exitQuiz"), z.literal("exitQuizAnswers"), z.literal("starterQuiz"), z.literal("starterQuizAnswers"), z.literal("supplementaryResource"), z.literal("video"), z.literal("worksheet"), z.literal("worksheetAnswers")]).optional(), unit: z.string().optional() }).optional() }),
  zodOutputSchema: z.any(), // Response schema will be resolved at runtime
  validateInput: (input: unknown) => {
    const result = z.object({ path: z.object({ keyStage: z.union([z.literal("ks1"), z.literal("ks2"), z.literal("ks3"), z.literal("ks4")]), subject: z.union([z.literal("art"), z.literal("citizenship"), z.literal("computing"), z.literal("cooking-nutrition"), z.literal("design-technology"), z.literal("english"), z.literal("french"), z.literal("geography"), z.literal("german"), z.literal("history"), z.literal("maths"), z.literal("music"), z.literal("physical-education"), z.literal("religious-education"), z.literal("rshe-pshe"), z.literal("science"), z.literal("spanish")]) }), query: z.object({ type: z.union([z.literal("slideDeck"), z.literal("exitQuiz"), z.literal("exitQuizAnswers"), z.literal("starterQuiz"), z.literal("starterQuizAnswers"), z.literal("supplementaryResource"), z.literal("video"), z.literal("worksheet"), z.literal("worksheetAnswers")]).optional(), unit: z.string().optional() }).optional() }).safeParse(input);
    if (result.success) {
      return { ok: true, data: result.data };
    } else {
      return { ok: false, message: result.error.message };
    }
  },
  validateOutput: (data: unknown) => {
    const schema: ZodSchema = getResponseSchemaForEndpoint('get', '/key-stages/{keyStage}/subject/{subject}/assets');
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