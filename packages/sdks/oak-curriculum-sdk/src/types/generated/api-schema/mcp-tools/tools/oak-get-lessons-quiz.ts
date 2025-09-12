/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-lessons-quiz
 * Path: /lessons/{lesson}/quiz
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getQuestions-getQuestionsForLessons' as const;
const name= 'oak-get-lessons-quiz' as const;
const path= '/lessons/{lesson}/quiz' as const;
const method= 'GET' as const;


// Path parameters

const pathParams= {
"lesson":{"typePrimitive":"string","valueConstraint":false,"required":true,"description":"The lesson slug identifier"},
};

const queryParams= {
};

void pathParams;
void queryParams;
type PathParamsShape = {
  lesson: string;
};
type ValidRequestParams= {params: {
  path: PathParamsShape;
}}

const inputSchema = {"type":"object","properties":{"lesson":{"type":"string","description":"The lesson slug identifier"}},"additionalProperties":false,"required":["lesson"]} as const;
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
  return 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"lesson":{"type":"string","description":"The lesson slug identifier"}},"additionalProperties":false,"required":["lesson"]}\nRequired: lesson';
};
void [operationId, name, path, method];
void [pathParams, queryParams];
void [isValidRequestParams, getValidRequestParamsDescription];
const executor= (client: OakApiPathBasedClient) => {
  return async (params: ValidRequestParams): Promise<unknown> => {
    if (!isValidRequestParams(params)) {
      throw new TypeError(getValidRequestParamsDescription());
    }
    const ep = client["/lessons/{lesson}/quiz"];
    const call = ep ? ep["GET"] : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /lessons/{lesson}/quiz');
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

export const oakGetLessonsQuiz = {
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
