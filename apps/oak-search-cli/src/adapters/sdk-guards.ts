/**
 * SDK guard integration.
 * Core path parameter guards from main SDK, search guards from search entry point.
 */

export { isKeyStage, isSubject } from '@oaknational/curriculum-sdk';
export {
  isUnitsGrouped,
  isTranscriptResponse,
  isLessonGroups,
  isSubjectAssets,
} from '@oaknational/curriculum-sdk/public/search.js';
