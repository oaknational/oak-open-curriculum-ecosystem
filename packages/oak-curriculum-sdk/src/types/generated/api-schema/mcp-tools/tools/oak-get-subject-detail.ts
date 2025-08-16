/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-subject-detail
 * Path: /subjects/{subject}
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getSubjects-getSubject' as const;
const name= 'oak-get-subject-detail' as const;
const path= '/subjects/{subject}' as const;
const method= 'GET' as const;


// Path parameters

const pathParams= {
"subject":{"typePrimitive":"string","valueConstraint":false,"required":true},
};

const queryParams= {
};

void pathParams;
void queryParams;
type ValidRequestParams= {params: {
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
}}

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
  const validateValue = (meta: unknown, value: unknown): boolean => {
    if (!meta || typeof meta !== "object") return true;
    const m = meta as {
      valueConstraint?: boolean;
      typeguard?: (v: unknown) => boolean
    };
    if (m.valueConstraint && typeof m.typeguard === "function") {
      return m.typeguard(value);
    }
    return true;
  };
  if (path) {
    for (const [k, v] of Object.entries(path)) {
      if (!validateValue((pathParams as Record<string, unknown>)[k], v)) return false;
    }
  }
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (!validateValue((queryParams as Record<string, unknown>)[k], v)) return false;
    }
  }
  return true;
}

const getValidRequestParamsDescription= () => {
  return 'Invalid request parameters. Please match the following schema:';
};
void [operationId, name, path, method];
void [pathParams, queryParams];
void [isValidRequestParams, getValidRequestParamsDescription];
const executor= (client: OakApiPathBasedClient) => {
  return async (params: ValidRequestParams): Promise<unknown> => {
    if (!isValidRequestParams(params)) {
      throw new TypeError(getValidRequestParamsDescription());
    }
    const ep = (client as Record<string, unknown>)["/subjects/{subject}"];
    const call = ep && typeof ep === "object" ? (ep as Record<string, (p: ValidRequestParams) => Promise<unknown>>)["GET"] : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /subjects/{subject}');
    }
    return call(params);
  };
};

const getExecutorFromGenericRequestParams = async (client: OakApiPathBasedClient, _params: ValidRequestParams) => {
  return executor(client)(_params);
};

export const oakGetSubjectDetail = {
  executor,
  getExecutorFromGenericRequestParams,
  pathParams,
  queryParams,
  operationId,
  name,
  path,
  method,
};
