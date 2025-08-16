/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-subjects
 * Path: /subjects
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getSubjects-getAllSubjects' as const;
const name= 'oak-get-subjects' as const;
const path= '/subjects' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/subjects']['GET'];


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

  
  return client['/subjects']['GET']({
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

export const oakGetSubjects = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
