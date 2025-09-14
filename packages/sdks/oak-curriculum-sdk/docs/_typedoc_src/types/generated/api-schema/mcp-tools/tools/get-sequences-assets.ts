/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-sequences-assets
 * Path: /sequences/{sequence}/assets
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getAssets-getSequenceAssets' as const;
const name= 'get-sequences-assets' as const;
const path= '/sequences/{sequence}/assets' as const;
const method= 'GET' as const;


// Path parameters
// Query parameters
// Type value is optional, not all query parameters are.
const allowedTypeValues= ["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"] as const;
type TypeValue = typeof allowedTypeValues[number] | undefined;
function isTypeValue(value: string | undefined): value is TypeValue {
  if (value === undefined) { return true; }
  const stringTypeValue: readonly string[] = allowedTypeValues;
  return stringTypeValue.includes(value);
}

const pathParams= {
"sequence":{"typePrimitive":"string","valueConstraint":false,"required":true,"description":"The sequence slug identifier, including the key stage 4 option where relevant."},
};

const queryParams= {
"year":{"typePrimitive":"number","valueConstraint":false,"required":false,"description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},
"type":{"typePrimitive":"string","valueConstraint":true,"required":false,"allowedValues":allowedTypeValues, typeguard: isTypeValue},
};

void pathParams;
void queryParams;
type PathParamsShape = {
  sequence: string;
};
type QueryParamsShape = {
  year?: number;
  type?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
};
type ValidRequestParams= {params: {
  path: PathParamsShape;
  query?: QueryParamsShape;
}}

const inputSchema = {"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."},"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},"type":{"type":"string","description":"Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false,"required":["sequence"]} as const;
function isValidRequestParams(value: unknown): value is ValidRequestParams {
  if (value === null || typeof value !== "object") return false;
  const paramsDesc = Object.getOwnPropertyDescriptor(value, "params");
  const params = paramsDesc?.value;
  if (params !== undefined && (params === null || typeof params !== "object")) return false;
  const path = params?.path;
  const query = params?.query;
  if (path !== undefined && (path === null || typeof path !== "object" || Array.isArray(path))) return false;
  if (query !== undefined && (query === null || typeof query !== "object" || Array.isArray(query))) return false;
  for (const [name, meta] of Object.entries(pathParams)) {
    if (meta && (meta as { required?: boolean }).required === true) {
      const has = Boolean(path && Object.prototype.hasOwnProperty.call(path, name));
      if (!has) return false;
    }
  }
  for (const [name, meta] of Object.entries(queryParams)) {
    if (meta && (meta as { required?: boolean }).required === true) {
      const has = Boolean(query && Object.prototype.hasOwnProperty.call(query, name));
      if (!has) return false;
    }
  }
  const hasTypeguardAndValidate = (container: unknown, key: string, value: unknown): boolean => {
    if (container === null || typeof container !== 'object') return true;
    const metaDesc = Object.getOwnPropertyDescriptor(container, key);
    const metaVal = metaDesc?.value;
    if (metaVal && typeof metaVal === 'object') {
      const tgDesc = Object.getOwnPropertyDescriptor(metaVal, 'typeguard');
      const vcDesc = Object.getOwnPropertyDescriptor(metaVal, 'valueConstraint');
      const typeguard = tgDesc?.value;
      const hasConstraint = vcDesc?.value === true;
      if (hasConstraint && typeof typeguard === "function") {
        return typeguard(value);
      }
    }
    return true;
  };
  if (path) {
    for (const [k, v] of Object.entries(path)) {
      if (!hasTypeguardAndValidate(pathParams, k, v)) return false;
    }
  }
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (!hasTypeguardAndValidate(queryParams, k, v)) return false;
    }
  }
  return true;
}

const getValidRequestParamsDescription= () => {
  return 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."},"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},"type":{"type":"string","description":"Optional asset type specifier\\n\\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false,"required":["sequence"]}\nRequired: sequence';
};
void [operationId, name, path, method];
void [pathParams, queryParams];
void [isValidRequestParams, getValidRequestParamsDescription];
const executor= (client: OakApiPathBasedClient) => {
  return async (params: ValidRequestParams): Promise<unknown> => {
    if (!isValidRequestParams(params)) {
      throw new TypeError(getValidRequestParamsDescription());
    }
    const ep = client["/sequences/{sequence}/assets"];
    const call = ep ? ep["GET"] : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /sequences/{sequence}/assets');
    }
    return call(params);
  };
};

const getExecutorFromGenericRequestParams = async (client: OakApiPathBasedClient, _params: ValidRequestParams) => {
  return executor(client)(_params);
};

const invoke = async (client: OakApiPathBasedClient, _params: unknown) => {
  if (!isValidRequestParams(_params)) {
    throw new TypeError(getValidRequestParamsDescription());
  }
  return executor(client)(_params);
};

export const getSequencesAssets = {
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
