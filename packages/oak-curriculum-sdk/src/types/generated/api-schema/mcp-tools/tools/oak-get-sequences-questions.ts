/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-sequences-questions
 * Path: /sequences/{sequence}/questions
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getQuestions-getQuestionsForSequence' as const;
const name= 'oak-get-sequences-questions' as const;
const path= '/sequences/{sequence}/questions' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/sequences/{sequence}/questions']['GET'];


// Path parameters
// Query parameters
const pathParams= {
"sequence":{"typePrimitive":"string","valueConstraint":false,"required":true},
};
const queryParams= {
"year":{"typePrimitive":"number","valueConstraint":false,"required":false},
"offset":{"typePrimitive":"number","valueConstraint":false,"required":false},
"limit":{"typePrimitive":"number","valueConstraint":false,"required":false},
};

type ValidRequestParams= {params: {
path: {
sequence: string, 
}
, query?: {
year?: number, 
offset?: number, 
limit?: number, 
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
  const offset= requestParams.params.query?.offset;
  const limit= requestParams.params.query?.limit;
  if(year !== undefined && typeof year !== 'number') {
    return false;
  }
  if(offset !== undefined && typeof offset !== 'number') {
    return false;
  }
  if(limit !== undefined && typeof limit !== 'number') {
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

        offset: any number,

        limit: any number,

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const sequencePathParam = requestParams.params.path.sequence;
  const yearQueryParam = requestParams.params.query?.year;
  const offsetQueryParam = requestParams.params.query?.offset;
  const limitQueryParam = requestParams.params.query?.limit;

  // The allowed value for sequence is any string, so we don't need a type guard for it.
  // The allowed value for year is any number, so we don't need a type guard for it.
  // The allowed value for offset is any number, so we don't need a type guard for it.
  // The allowed value for limit is any number, so we don't need a type guard for it.
  
  return client['/sequences/{sequence}/questions']['GET']({
    params: {

      path: {

        sequence: sequencePathParam,

      },

      query: {

        year: yearQueryParam,

        offset: offsetQueryParam,

        limit: limitQueryParam,

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

export const oakGetSequencesQuestions = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
