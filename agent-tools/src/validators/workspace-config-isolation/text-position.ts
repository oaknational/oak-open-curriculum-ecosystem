/**
 * Shared text-position helper for the workspace-config-isolation legs.
 *
 * @packageDocumentation
 */

/** 1-based line number of a character index within `content`. */
export function lineOf(content: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < content.length; i += 1) {
    if (content.codePointAt(i) === 10) {
      line += 1;
    }
  }
  return line;
}
