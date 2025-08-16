/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-lessons-assets
 * Path: /lessons/{lesson}/assets
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getAssets-getLessonAssets' as const;
const name= 'oak-get-lessons-assets' as const;
const path= '/lessons/{lesson}/assets' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/lessons/{lesson}/assets']['GET'];


// Path parameters
// Query parameters

// Type value is optional, not all query parameters are.
const allowedTypeValues= ["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"] as const;
type TypeValue = typeof allowedTypeValues[number] | undefined;
function isTypeValue(value: string | undefined): value is TypeValue {
  if (value === undefined) {
    return true;
  }
  const stringTypeValue: readonly string[] = allowedTypeValues;
  return stringTypeValue.includes(value);
}

const pathParams= {
"lesson":{"typePrimitive":"string","valueConstraint":false,"required":true},
};
const queryParams= {
"type":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedTypeValues, typeguard: isTypeValue},
};

type ValidRequestParams= {params: {
path: {
lesson: string, 
}
, query?: {
type?: string, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Required
  const lesson= requestParams.params.path?.lesson;
  if(typeof lesson !== 'string') {
    return false;
  }
  // Optional
  const type= requestParams.params.query?.type;
  if(type !== undefined && type !== null && typeof type === 'string' && !isTypeValue(type)) {
    return false;
  }
  return true;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

      path: {

        lesson: any string

      },

      query: {

        type: one of ${allowedTypeValues.join(', ')}

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const lessonPathParam = requestParams.params.path.lesson;
  const typeQueryParam = requestParams.params.query?.type;

  // The allowed value for lesson is any string, so we don't need a type guard for it.
  if (!isTypeValue(typeQueryParam)) {
    throw new TypeError(`Invalid type: ${typeQueryParam}. Must be one of: ${allowedTypeValues.join(', ')}`);
  }
  
  return client['/lessons/{lesson}/assets']['GET']({
    params: {

      path: {

        lesson: lessonPathParam,

      },

      query: {

        type: typeQueryParam,

      },

    },
  });
}

const getExecutorFromGenericRequestParams = (client: OakApiPathBasedClient, requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}) => {

  // The checks are specific to the tool
  if(!isValidRequestParams(requestParams)) {
    const validRequestParamsDescription = getValidRequestParamsDescription();
    throw new TypeError(`Invalid request parameters. Please match the following schema: ${validRequestParamsDescription}`);
  }
  
  return executor(client, requestParams);
}

export const oakGetLessonsAssets = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
