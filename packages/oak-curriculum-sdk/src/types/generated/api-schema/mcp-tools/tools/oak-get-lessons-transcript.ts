/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-lessons-transcript
 * Path: /lessons/{lesson}/transcript
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getLessonTranscript-getLessonTranscript' as const;
const name= 'oak-get-lessons-transcript' as const;
const path= '/lessons/{lesson}/transcript' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/lessons/{lesson}/transcript']['GET'];


// Path parameters
const pathParams= {
"lesson":{"typePrimitive":"string","valueConstraint":false,"required":true},
};
const queryParams= {
};

type ValidRequestParams= {params: {
path: {
lesson: string, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Required
  const lesson= requestParams.params.path?.lesson;
  if(typeof lesson !== 'string') {
    return false;
  }
  return true;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

      path: {

        lesson: any string

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const lessonPathParam = requestParams.params.path.lesson;

  // The allowed value for lesson is any string, so we don't need a type guard for it.
  
  return client['/lessons/{lesson}/transcript']['GET']({
    params: {

      path: {

        lesson: lessonPathParam,

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

export const oakGetLessonsTranscript = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
