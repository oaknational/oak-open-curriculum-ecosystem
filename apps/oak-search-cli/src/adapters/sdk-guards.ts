/**
 * SDK guard integration.
 * Core path parameter guards from main SDK, search guards from search entry point.
 */
import {
  isKeyStage as sdkIsKeyStage,
  isSubject as sdkIsSubject,
} from '@oaknational/curriculum-sdk';
import {
  isUnitsGrouped as sdkIsUnitsGrouped,
  isTranscriptResponse as sdkIsTranscriptResponse,
  isLessonGroups as sdkIsLessonGroups,
  isSubjectAssets as sdkIsSubjectAssets,
} from '@oaknational/curriculum-sdk/public/search.js';

export const isKeyStage = sdkIsKeyStage;
export const isSubject = sdkIsSubject;

export const isUnitsGrouped = sdkIsUnitsGrouped;
export const isTranscriptResponse = sdkIsTranscriptResponse;
export const isLessonGroups = sdkIsLessonGroups;
export const isSubjectAssets = sdkIsSubjectAssets;
