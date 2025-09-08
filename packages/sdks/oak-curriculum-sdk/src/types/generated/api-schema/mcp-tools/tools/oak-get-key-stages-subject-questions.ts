/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-key-stages-subject-questions
 * Path: /key-stages/{keyStage}/subject/{subject}/questions
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getQuestions-getQuestionsForKeyStageAndSubject' as const;
const name= 'oak-get-key-stages-subject-questions' as const;
const path= '/key-stages/{keyStage}/subject/{subject}/questions' as const;
const method= 'GET' as const;


// Path parameters
const allowedKeyStageValues= ["ks1","ks2","ks3","ks4"] as const;
type KeyStageValue = typeof allowedKeyStageValues[number];
function isKeyStageValue(value: string): value is KeyStageValue {
  const stringKeyStageValue: readonly string[] = allowedKeyStageValues;
  return stringKeyStageValue.includes(value);
}

const allowedSubjectValues= ["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"] as const;
type SubjectValue = typeof allowedSubjectValues[number];
function isSubjectValue(value: string): value is SubjectValue {
  const stringSubjectValue: readonly string[] = allowedSubjectValues;
  return stringSubjectValue.includes(value);
}

// Query parameters
const pathParams= {
"keyStage":{"typePrimitive":"string","valueConstraint":true,"required":true,"allowedValues":allowedKeyStageValues, typeguard: isKeyStageValue},
"subject":{"typePrimitive":"string","valueConstraint":true,"required":true,"allowedValues":allowedSubjectValues, typeguard: isSubjectValue},
};

const queryParams= {
"offset":{"typePrimitive":"number","valueConstraint":false,"required":false},
"limit":{"typePrimitive":"number","valueConstraint":false,"required":false},
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
    const ep = (client as Record<string, unknown>)["/key-stages/{keyStage}/subject/{subject}/questions"];
    const call = ep && typeof ep === "object" ? (ep as Record<string, (p: ValidRequestParams) => Promise<unknown>>)["GET"] : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /key-stages/{keyStage}/subject/{subject}/questions');
    }
    return call(params);
  };
};

const getExecutorFromGenericRequestParams = async (client: OakApiPathBasedClient, _params: ValidRequestParams) => {
  return executor(client)(_params);
};

export const oakGetKeyStagesSubjectQuestions = {
  executor,
  getExecutorFromGenericRequestParams,
  pathParams,
  queryParams,
  operationId,
  name,
  path,
  method,
};
