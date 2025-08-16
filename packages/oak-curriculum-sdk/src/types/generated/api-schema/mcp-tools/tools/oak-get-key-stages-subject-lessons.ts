/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-key-stages-subject-lessons
 * Path: /key-stages/{keyStage}/subject/{subject}/lessons
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getKeyStageSubjectLessons-getKeyStageSubjectLessons' as const;
const name= 'oak-get-key-stages-subject-lessons' as const;
const path= '/key-stages/{keyStage}/subject/{subject}/lessons' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/key-stages/{keyStage}/subject/{subject}/lessons']['GET'];


// Path parameters
const allowedKeyStageValues= ["ks1","ks2","ks3","ks4"] as const;
type KeyStageValue = typeof allowedKeyStageValues[number];
function isKeyStageValue(value: string): value is KeyStageValue {
  const stringKeyStageValue: readonly string[] = allowedKeyStageValues;
  return stringKeyStageValue.includes(value);
}

const allowedSubjectValues= ["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"] as const;
type SubjectValue = typeof allowedSubjectValues[number];
function isSubjectValue(value: string): value is SubjectValue {
  const stringSubjectValue: readonly string[] = allowedSubjectValues;
  return stringSubjectValue.includes(value);
}

// Query parameters
const pathParams= {
"keyStage":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedKeyStageValues, typeguard: isKeyStageValue},
"subject":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedSubjectValues, typeguard: isSubjectValue},
};
const queryParams= {
"unit":{"typePrimitive":"string","valueConstraint":false,"required":false},
"offset":{"typePrimitive":"number","valueConstraint":false,"required":false},
"limit":{"typePrimitive":"number","valueConstraint":false,"required":false},
};

type ValidRequestParams= {params: {
path: {
keyStage: string, 
subject: string, 
}
, query?: {
unit?: string, 
offset?: number, 
limit?: number, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Required
  const keyStage= requestParams.params.path?.keyStage;
  const subject= requestParams.params.path?.subject;
  if(typeof keyStage !== 'string' || typeof subject !== 'string') {
    return false;
  }
  if(!isKeyStageValue(keyStage) || !isSubjectValue(subject)) {
    return false;
  }
  // Optional
  const unit= requestParams.params.query?.unit;
  const offset= requestParams.params.query?.offset;
  const limit= requestParams.params.query?.limit;
  if(unit !== undefined && typeof unit !== 'string') {
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

        keyStage: one of ${allowedKeyStageValues.join(', ')}

        subject: one of ${allowedSubjectValues.join(', ')}

      },

      query: {

        unit: any string,

        offset: any number,

        limit: any number,

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const keyStagePathParam = requestParams.params.path.keyStage;
  const subjectPathParam = requestParams.params.path.subject;
  const unitQueryParam = requestParams.params.query?.unit;
  const offsetQueryParam = requestParams.params.query?.offset;
  const limitQueryParam = requestParams.params.query?.limit;

  if (!isKeyStageValue(keyStagePathParam)) {
    throw new TypeError(`Invalid keyStage: ${keyStagePathParam}. Must be one of: ${allowedKeyStageValues.join(', ')}`);
  }
  if (!isSubjectValue(subjectPathParam)) {
    throw new TypeError(`Invalid subject: ${subjectPathParam}. Must be one of: ${allowedSubjectValues.join(', ')}`);
  }
  // The allowed value for unit is any string, so we don't need a type guard for it.
  // The allowed value for offset is any number, so we don't need a type guard for it.
  // The allowed value for limit is any number, so we don't need a type guard for it.
  
  return client['/key-stages/{keyStage}/subject/{subject}/lessons']['GET']({
    params: {

      path: {

        keyStage: keyStagePathParam,

        subject: subjectPathParam,

      },

      query: {

        unit: unitQueryParam,

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

export const oakGetKeyStagesSubjectLessons = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
