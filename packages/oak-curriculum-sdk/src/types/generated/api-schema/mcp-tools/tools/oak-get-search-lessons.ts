/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-search-lessons
 * Path: /search/lessons
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getLessons-searchByTextSimilarity' as const;
const name= 'oak-get-search-lessons' as const;
const path= '/search/lessons' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/search/lessons']['GET'];


// Query parameters

// KeyStage value is optional, not all query parameters are.
const allowedKeyStageValues= ["ks1","ks2","ks3","ks4"] as const;
type KeyStageValue = typeof allowedKeyStageValues[number] | undefined;
function isKeyStageValue(value: string | undefined): value is KeyStageValue {
  if (value === undefined) {
    return true;
  }
  const stringKeyStageValue: readonly string[] = allowedKeyStageValues;
  return stringKeyStageValue.includes(value);
}


// Subject value is optional, not all query parameters are.
const allowedSubjectValues= ["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"] as const;
type SubjectValue = typeof allowedSubjectValues[number] | undefined;
function isSubjectValue(value: string | undefined): value is SubjectValue {
  if (value === undefined) {
    return true;
  }
  const stringSubjectValue: readonly string[] = allowedSubjectValues;
  return stringSubjectValue.includes(value);
}

const pathParams= {
};
const queryParams= {
"q":{"typePrimitive":"string","valueConstraint":false,"required":true},
"keyStage":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedKeyStageValues, typeguard: isKeyStageValue},
"subject":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedSubjectValues, typeguard: isSubjectValue},
"unit":{"typePrimitive":"string","valueConstraint":false,"required":false},
};

type ValidRequestParams= {params: {
query: {
q: string, 
keyStage?: string, 
subject?: string, 
unit?: string, 
}
}};
function isValidRequestParams(requestParams: {params: {path?: Record<string, unknown>, query?: Record<string, unknown>}}): requestParams is ValidRequestParams {
  // Optional
  const q= requestParams.params.query?.q;
  const keyStage= requestParams.params.query?.keyStage;
  const subject= requestParams.params.query?.subject;
  const unit= requestParams.params.query?.unit;
  if(q === undefined || typeof q !== 'string') {
    return false;
  }
  if(keyStage !== undefined && keyStage !== null && typeof keyStage === 'string' && !isKeyStageValue(keyStage)) {
    return false;
  }
  if(subject !== undefined && subject !== null && typeof subject === 'string' && !isSubjectValue(subject)) {
    return false;
  }
  if(unit !== undefined && typeof unit !== 'string') {
    return false;
  }
  return true;
}
const getValidRequestParamsDescription= () => {
  return `{
    params: {

      query: {

        q: any string,

        keyStage: one of ${allowedKeyStageValues.join(', ')}

        subject: one of ${allowedSubjectValues.join(', ')}

        unit: any string,

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const qQueryParam = requestParams.params.query?.q;
  const keyStageQueryParam = requestParams.params.query?.keyStage;
  const subjectQueryParam = requestParams.params.query?.subject;
  const unitQueryParam = requestParams.params.query?.unit;

  // The allowed value for q is any string, so we don't need a type guard for it.
  if (!isKeyStageValue(keyStageQueryParam)) {
    throw new TypeError(`Invalid keyStage: ${keyStageQueryParam}. Must be one of: ${allowedKeyStageValues.join(', ')}`);
  }
  if (!isSubjectValue(subjectQueryParam)) {
    throw new TypeError(`Invalid subject: ${subjectQueryParam}. Must be one of: ${allowedSubjectValues.join(', ')}`);
  }
  // The allowed value for unit is any string, so we don't need a type guard for it.
  
  return client['/search/lessons']['GET']({
    params: {

      query: {

        q: qQueryParam,

        keyStage: keyStageQueryParam,

        subject: subjectQueryParam,

        unit: unitQueryParam,

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

export const oakGetSearchLessons = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
