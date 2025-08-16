/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-lessons-assets-by-type
 * Path: /lessons/{lesson}/assets/{type}
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getAssets-getLessonAsset' as const;
const name= 'oak-get-lessons-assets-by-type' as const;
const path= '/lessons/{lesson}/assets/{type}' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/lessons/{lesson}/assets/{type}']['GET'];


// Path parameters
const allowedTypeValues= ["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"] as const;
type TypeValue = typeof allowedTypeValues[number];
function isTypeValue(value: string): value is TypeValue {
  const stringTypeValue: readonly string[] = allowedTypeValues;
  return stringTypeValue.includes(value);
}

const pathParams= {
"lesson":{"typePrimitive":"string","valueConstraint":false,"required":true},
"type":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedTypeValues, typeguard: isTypeValue},
};
const queryParams= {
};

type ValidRequestParams= {params: {
path: {
lesson: string, 
type: string, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Required
  const lesson= requestParams.params.path?.lesson;
  const type= requestParams.params.path?.type;
  if(typeof lesson !== 'string' || typeof type !== 'string') {
    return false;
  }
  if(!isTypeValue(type)) {
    return false;
  }
  return true;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

      path: {

        lesson: any string

        type: one of ${allowedTypeValues.join(', ')}

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const lessonPathParam = requestParams.params.path.lesson;
  const typePathParam = requestParams.params.path.type;

  // The allowed value for lesson is any string, so we don't need a type guard for it.
  if (!isTypeValue(typePathParam)) {
    throw new TypeError(`Invalid type: ${typePathParam}. Must be one of: ${allowedTypeValues.join(', ')}`);
  }
  
  return client['/lessons/{lesson}/assets/{type}']['GET']({
    params: {

      path: {

        lesson: lessonPathParam,

        type: typePathParam,

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

export const oakGetLessonsAssetsByType = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
