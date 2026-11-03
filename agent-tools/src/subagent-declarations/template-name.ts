/**
 * The name boundary of the sub-agent adapter leg. A template is addressed by its basename
 * without `.md`, and every path the leg builds (`.agent/sub-agents/templates/<name>.md`, the
 * adapter under each surface) interpolates that name, so any other shape (a separator
 * anywhere; a dot segment; an empty name; a suffix) would address a file outside those
 * directories or the wrong file inside them. The shape is the adapter-name shape a
 * declaration carries (`ADAPTER_NAME`), checked before any path is built, so a refused name
 * is never read and never written (the #77 round-three finding, 2026-09-14; the rule leg's
 * `rule-name.ts` is the same boundary for rules). The reason quotes the name so an empty or
 * whitespace name stays visible in a report.
 *
 * @packageDocumentation
 */

import { ADAPTER_NAME } from './subagent-declaration.js';

const NOT_A_BASENAME =
  'lowercase letters and digits in single-hyphen groups: one path segment, no dot segment, no suffix';

/** The refusal reason when a name is not a template basename; `undefined` when it may be interpolated. */
export function templateNameRefusal(name: string): string | undefined {
  return ADAPTER_NAME.test(name)
    ? undefined
    : `${JSON.stringify(name)}: not a template basename (${NOT_A_BASENAME})`;
}
