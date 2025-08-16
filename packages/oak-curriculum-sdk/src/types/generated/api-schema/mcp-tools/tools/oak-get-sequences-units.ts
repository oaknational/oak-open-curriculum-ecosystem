/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-sequences-units
 * Path: /sequences/{sequence}/units
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getSequences-getSequenceUnits' as const;
const name= 'oak-get-sequences-units' as const;
const path= '/sequences/{sequence}/units' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/sequences/{sequence}/units']['GET'];


// Path parameters
// Query parameters

// Year value is optional, not all query parameters are.
const allowedYearValues= ["1","2","3","4","5","6","7","8","9","10","11","all-years"] as const;
type YearValue = typeof allowedYearValues[number] | undefined;
function isYearValue(value: string | undefined): value is YearValue {
  if (value === undefined) {
    return true;
  }
  const stringYearValue: readonly string[] = allowedYearValues;
  return stringYearValue.includes(value);
}

const pathParams= {
"sequence":{"typePrimitive":"string","valueConstraint":false,"required":true},
};
const queryParams= {
"year":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedYearValues, typeguard: isYearValue},
};

type ValidRequestParams= {params: {
path: {
sequence: string, 
}
, query?: {
year?: string, 
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
  if(year !== undefined && year !== null && typeof year === 'string' && !isYearValue(year)) {
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

        year: one of ${allowedYearValues.join(', ')}

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const sequencePathParam = requestParams.params.path.sequence;
  const yearQueryParam = requestParams.params.query?.year;

  // The allowed value for sequence is any string, so we don't need a type guard for it.
  if (!isYearValue(yearQueryParam)) {
    throw new TypeError(`Invalid year: ${yearQueryParam}. Must be one of: ${allowedYearValues.join(', ')}`);
  }
  
  return client['/sequences/{sequence}/units']['GET']({
    params: {

      path: {

        sequence: sequencePathParam,

      },

      query: {

        year: yearQueryParam,

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

export const oakGetSequencesUnits = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
