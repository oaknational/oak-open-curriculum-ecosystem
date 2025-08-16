/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-units-summary
 * Path: /units/{unit}/summary
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getUnits-getUnit' as const;
const name= 'oak-get-units-summary' as const;
const path= '/units/{unit}/summary' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/units/{unit}/summary']['GET'];


// Path parameters
const pathParams= {
"unit":{"typePrimitive":"string","valueConstraint":false,"required":true},
};
const queryParams= {
};

type ValidRequestParams= {params: {
path: {
unit: string, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Required
  const unit= requestParams.params.path?.unit;
  if(typeof unit !== 'string') {
    return false;
  }
  return true;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

      path: {

        unit: any string

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const unitPathParam = requestParams.params.path.unit;

  // The allowed value for unit is any string, so we don't need a type guard for it.
  
  return client['/units/{unit}/summary']['GET']({
    params: {

      path: {

        unit: unitPathParam,

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

export const oakGetUnitsSummary = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
