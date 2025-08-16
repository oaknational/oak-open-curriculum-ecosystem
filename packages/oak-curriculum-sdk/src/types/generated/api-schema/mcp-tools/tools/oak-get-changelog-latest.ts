/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-changelog-latest
 * Path: /changelog/latest
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'changelog-latest' as const;
const name= 'oak-get-changelog-latest' as const;
const path= '/changelog/latest' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/changelog/latest']['GET'];


const pathParams= {
};
const queryParams= {
};

type ValidRequestParams= {params: {}}
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  if (typeof requestParams !== 'object' || requestParams === null) {
    return false;
  }
  // Check if params property exists and is an empty object
  const params = requestParams.params;
  if (!params || typeof params !== 'object' || params === null) {
    return false;
  }
  return Object.keys(params).length === 0;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, _requestParams: ValidRequestParams): ReturnType<Client> => {

  
  return client['/changelog/latest']['GET']({
    params: {

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

export const oakGetChangelogLatest = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
