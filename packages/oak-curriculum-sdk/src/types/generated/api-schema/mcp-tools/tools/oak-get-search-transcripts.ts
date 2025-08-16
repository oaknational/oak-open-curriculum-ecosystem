/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-search-transcripts
 * Path: /search/transcripts
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'searchTranscripts-searchTranscripts' as const;
const name= 'oak-get-search-transcripts' as const;
const path= '/search/transcripts' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/search/transcripts']['GET'];


// Query parameters
const pathParams= {
};
const queryParams= {
"q":{"typePrimitive":"string","valueConstraint":false,"required":true},
};

type ValidRequestParams= {params: {
query: {
q: string, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Optional
  const q= requestParams.params.query?.q;
  if(q === undefined || typeof q !== 'string') {
    return false;
  }
  return true;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

      query: {

        q: any string,

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const qQueryParam = requestParams.params.query?.q;

  // The allowed value for q is any string, so we don't need a type guard for it.
  
  return client['/search/transcripts']['GET']({
    params: {

      query: {

        q: qQueryParam,

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

export const oakGetSearchTranscripts = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
