/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-threads-units
 * Path: /threads/{threadSlug}/units
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getThreads-getThreadUnits' as const;
const name= 'oak-get-threads-units' as const;
const path= '/threads/{threadSlug}/units' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/threads/{threadSlug}/units']['GET'];


// Path parameters
const pathParams= {
"threadSlug":{"typePrimitive":"string","valueConstraint":false,"required":true},
};
const queryParams= {
};

type ValidRequestParams= {params: {
path: {
threadSlug: string, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Required
  const threadSlug= requestParams.params.path?.threadSlug;
  if(typeof threadSlug !== 'string') {
    return false;
  }
  return true;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

      path: {

        threadSlug: any string

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const threadSlugPathParam = requestParams.params.path.threadSlug;

  // The allowed value for threadSlug is any string, so we don't need a type guard for it.
  
  return client['/threads/{threadSlug}/units']['GET']({
    params: {

      path: {

        threadSlug: threadSlugPathParam,

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

export const oakGetThreadsUnits = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
