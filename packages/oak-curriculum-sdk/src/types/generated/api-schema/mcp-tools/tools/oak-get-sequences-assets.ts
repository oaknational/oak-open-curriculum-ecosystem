/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-sequences-assets
 * Path: /sequences/{sequence}/assets
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getAssets-getSequenceAssets' as const;
const name= 'oak-get-sequences-assets' as const;
const path= '/sequences/{sequence}/assets' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/sequences/{sequence}/assets']['GET'];


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
"sequence":{"typePrimitive":"string","valueConstraint":false,"required":true},
};
const queryParams= {
"year":{"typePrimitive":"number","valueConstraint":false,"required":false},
"type":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedTypeValues, typeguard: isTypeValue},
};

type ValidRequestParams= {params: {
path: {
sequence: string, 
}
, query?: {
year?: number, 
type?: string, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Required
  const sequence= requestParams.params.path?.sequence;
  if(typeof sequence !== 'string') {
    return false;
  }
  // Optional
  const year= requestParams.params.query?.year;
  const type= requestParams.params.query?.type;
  if(year !== undefined && typeof year !== 'number') {
    return false;
  }
  if(type !== undefined && type !== null && typeof type === 'string' && !isTypeValue(type)) {
    return false;
  }
  return true;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

      path: {

        sequence: any string

      },

      query: {

        year: any number,

        type: one of ${allowedTypeValues.join(', ')}

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const sequencePathParam = requestParams.params.path.sequence;
  const yearQueryParam = requestParams.params.query?.year;
  const typeQueryParam = requestParams.params.query?.type;

  // The allowed value for sequence is any string, so we don't need a type guard for it.
  // The allowed value for year is any number, so we don't need a type guard for it.
  if (!isTypeValue(typeQueryParam)) {
    throw new TypeError(`Invalid type: ${typeQueryParam}. Must be one of: ${allowedTypeValues.join(', ')}`);
  }
  
  return client['/sequences/{sequence}/assets']['GET']({
    params: {

      path: {

        sequence: sequencePathParam,

      },

      query: {

        year: yearQueryParam,

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

export const oakGetSequencesAssets = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
