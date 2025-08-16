/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: oak-get-key-stages-subject-assets
 * Path: /key-stages/{keyStage}/subject/{subject}/assets
 * Method: GET
 */

import type { OakApiPathBasedClient } from "../../../../../client/index.js";

const operationId= 'getAssets-getSubjectAssets' as const;
const name= 'oak-get-key-stages-subject-assets' as const;
const path= '/key-stages/{keyStage}/subject/{subject}/assets' as const;
const method= 'GET' as const;

type Client = OakApiPathBasedClient['/key-stages/{keyStage}/subject/{subject}/assets']['GET'];


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

// Type value is optional, not all query parameters are.
const allowedTypeValues= ["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"] as const;
type TypeValue = typeof allowedTypeValues[number] | undefined;
function isTypeValue(value: string | undefined): value is TypeValue {
  if (value === undefined) {
    return true;
  }
  const stringTypeValue: readonly string[] = allowedTypeValues;
  return stringTypeValue.includes(value);
}

const pathParams= {
"keyStage":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedKeyStageValues, typeguard: isKeyStageValue},
"subject":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedSubjectValues, typeguard: isSubjectValue},
};
const queryParams= {
"type":{"typePrimitive":"string","valueConstraint":true,"allowedValues":allowedTypeValues, typeguard: isTypeValue},
"unit":{"typePrimitive":"string","valueConstraint":false,"required":false},
};

type ValidRequestParams= {params: {
path: {
keyStage: string, 
subject: string, 
}
, query?: {
type?: string, 
unit?: string, 
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
  const type= requestParams.params.query?.type;
  const unit= requestParams.params.query?.unit;
  if(type !== undefined && type !== null && typeof type === 'string' && !isTypeValue(type)) {
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

      path: {

        keyStage: one of ${allowedKeyStageValues.join(', ')}

        subject: one of ${allowedSubjectValues.join(', ')}

      },

      query: {

        type: one of ${allowedTypeValues.join(', ')}

        unit: any string,

      },

    },
  }`;
}


const executor= (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => {
  const keyStagePathParam = requestParams.params.path.keyStage;
  const subjectPathParam = requestParams.params.path.subject;
  const typeQueryParam = requestParams.params.query?.type;
  const unitQueryParam = requestParams.params.query?.unit;

  if (!isKeyStageValue(keyStagePathParam)) {
    throw new TypeError(`Invalid keyStage: ${keyStagePathParam}. Must be one of: ${allowedKeyStageValues.join(', ')}`);
  }
  if (!isSubjectValue(subjectPathParam)) {
    throw new TypeError(`Invalid subject: ${subjectPathParam}. Must be one of: ${allowedSubjectValues.join(', ')}`);
  }
  if (!isTypeValue(typeQueryParam)) {
    throw new TypeError(`Invalid type: ${typeQueryParam}. Must be one of: ${allowedTypeValues.join(', ')}`);
  }
  // The allowed value for unit is any string, so we don't need a type guard for it.
  
  return client['/key-stages/{keyStage}/subject/{subject}/assets']['GET']({
    params: {

      path: {

        keyStage: keyStagePathParam,

        subject: subjectPathParam,

      },

      query: {

        type: typeQueryParam,

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

export const oakGetKeyStagesSubjectAssets = {
  name,
  path,
  method,
  operationId,
  pathParams,
  queryParams,
  getExecutorFromGenericRequestParams,
  executor,
} as const;
