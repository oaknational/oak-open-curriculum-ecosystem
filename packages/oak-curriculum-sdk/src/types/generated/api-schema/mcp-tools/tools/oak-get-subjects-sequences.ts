/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-subjects-sequences
 * Path: /subjects/{subject}/sequences
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getSubjects-getSubjectSequence' as const;
const name= 'oak-get-subjects-sequences' as const;
const path= '/subjects/{subject}/sequences' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/subjects/{subject}/sequences']['GET'];


// Path parameters
const pathParams= {
"subject":{"typePrimitive":"string","valueConstraint":false,"required":true},
};
const queryParams= {
};

type ValidRequestParams= {params: {
path: {
subject: string, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Required
  const subject= requestParams.params.path?.subject;
  if(typeof subject !== 'string') {
    return false;
  }
  return true;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

      path: {

        subject: any string

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const subjectPathParam = requestParams.params.path.subject;

  // The allowed value for subject is any string, so we don't need a type guard for it.
  
  return client['/subjects/{subject}/sequences']['GET']({
    params: {

      path: {

        subject: subjectPathParam,

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

export const oakGetSubjectsSequences = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
