/**
 * Message generators for MCP prompt responses.
 *
 * Each generator produces an array of messages that guide the model
 * to use the appropriate tools in the correct order for a workflow.
 *
 * @remarks Barrel over the per-prompt modules in `./prompt-messages/`.
 * One module per prompt keeps every generator file within the ESLint
 * max-lines budget as the prompt estate grows (this file previously
 * held all generators and outgrew the budget at the seventh prompt).
 * All content is static and added at SDK compile time, complying with
 * schema-first principles.
 */

export { getFindLessonsMessages } from './prompt-messages/find-lessons.js';
export { getLessonPlanningMessages } from './prompt-messages/lesson-planning.js';
export { getExploreCurriculumMessages } from './prompt-messages/explore-curriculum.js';
export { getLearningProgressionMessages } from './prompt-messages/learning-progression.js';
export { getCurriculumMappingMessages } from './prompt-messages/curriculum-mapping.js';
export { getAdaptLessonMessages } from './prompt-messages/adapt-lesson.js';
export { getContinueProgressionMessages } from './prompt-messages/continue-progression.js';
