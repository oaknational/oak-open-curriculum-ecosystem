/**
 * SDK guard integration.
 * Core path parameter guards from main SDK, search guards from search entry point.
 */
import {
  isKeyStage as sdkIsKeyStage,
  isSubject as sdkIsSubject,
  KEY_STAGES as SDK_KEY_STAGES,
  SUBJECTS as SDK_SUBJECTS,
} from '@oaknational/oak-curriculum-sdk';
import {
  isUnitsGrouped as sdkIsUnitsGrouped,
  isTranscriptResponse as sdkIsTranscriptResponse,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

export const isKeyStage = sdkIsKeyStage;
export const isSubject = sdkIsSubject;
export const KEY_STAGES = SDK_KEY_STAGES;
export const SUBJECTS = SDK_SUBJECTS;

export const isUnitsGrouped = sdkIsUnitsGrouped;

export const isTranscriptResponse = sdkIsTranscriptResponse;
