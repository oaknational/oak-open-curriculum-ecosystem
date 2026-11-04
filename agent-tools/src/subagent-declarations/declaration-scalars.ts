/**
 * The scalars every declaration field is built from: the platform enum, the one-line string
 * a field carries (no line break, no control character YAML forbids, since the renderers
 * write a line field raw or quoted and never escaped), and the prose an adapter body carries
 * beyond the standard shape.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

/** The platforms an adapter can be projected to, in the order the surfaces are listed. */
export const SUBAGENT_PLATFORMS = ['cursor', 'claude', 'codex', 'gemini'] as const;

/** A member of {@link SUBAGENT_PLATFORMS}. */
export type SubagentPlatform = (typeof SUBAGENT_PLATFORMS)[number];

export const platform = z.enum(SUBAGENT_PLATFORMS);
// YAML forbids the C0 controls other than tab and the line breaks (which a line never
// carries), and the DEL and C1 controls; the renderers write a line field raw or quoted,
// never escaped, so one is refused here.
const CONTROL = /[^\P{Cc}\t\n\r]/u;

export const line = z
  .string()
  .min(1)
  .refine((value) => !/[\n\r]/u.test(value), 'one line')
  .refine((value) => !CONTROL.test(value), 'no control characters');

/**
 * Prose an adapter body carries beyond the standard shape, verbatim: what follows the
 * template path inside the pointer paragraph, and the closing paragraphs after it. A role
 * declares them only where they deviate from the platform's standard closing; a variant
 * declares every note it carries.
 */
export const prose = {
  pointerTail: z.string().min(1).optional(),
  note: z.string().min(1).optional(),
};
