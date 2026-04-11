/**
 * Teacher-oriented guidance for misconception graph data.
 *
 * Provides the constant guidance text included in the misconception graph
 * tool description, helping AI agents use misconception data effectively
 * in educational contexts.
 *
 * @remarks
 * This guidance is appended to the tool description (not injected by the
 * factory) to help agents frame misconception data pedagogically —
 * identifying common errors, suggesting diagnostic questions, and
 * planning targeted remediation.
 */

/**
 * Guidance for how AI agents should use misconception data with teachers.
 *
 * Frames misconceptions as diagnostic tools, not labels — emphasising
 * that misconceptions reveal how students are thinking, not that students
 * are "wrong."
 */
export const MISCONCEPTION_GUIDANCE = `How to use this data:
- Misconceptions reveal how students are thinking — use them as diagnostic tools, not labels
- Each misconception includes the teacher's recommended response
- Filter by subject and key stage to find misconceptions relevant to your lesson
- Use misconceptions to plan diagnostic questions that surface common errors
- Pair with prerequisite graph data to understand where in the learning path misconceptions typically arise` as const;
