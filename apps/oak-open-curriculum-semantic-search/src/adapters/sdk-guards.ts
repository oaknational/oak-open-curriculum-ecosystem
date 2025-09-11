/**
 * SDK guard integration.
 * We import input guards/allowed-values from the SDK root,
 * and provide structural fallbacks for response shapes.
 */
import {
  isKeyStage as sdkIsKeyStage,
  isSubject as sdkIsSubject,
  KEY_STAGES as SDK_KEY_STAGES,
  SUBJECTS as SDK_SUBJECTS,
  isUnitsGrouped as sdkIsUnitsGrouped,
  isLessonGroups as sdkIsLessonGroups,
  isTranscriptResponse as sdkIsTranscriptResponse,
} from '@oaknational/oak-curriculum-sdk';

export const isKeyStage = sdkIsKeyStage;
export const isSubject = sdkIsSubject;
export const KEY_STAGES = SDK_KEY_STAGES;
export const SUBJECTS = SDK_SUBJECTS;

export const isUnitsGrouped = sdkIsUnitsGrouped;

export const isLessonGroups = sdkIsLessonGroups;

export const isTranscriptResponse = sdkIsTranscriptResponse;
