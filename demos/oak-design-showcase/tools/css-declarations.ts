/**
 * Declaration tests the skill eval graders apply to authored CSS, in forms
 * that answer in linear time: a property name directly before its colon, and
 * a custom property (`--name:`) whose name starts at a boundary rather than
 * inside a longer name.
 *
 * @packageDocumentation
 */

/** A property-name character directly before optional whitespace and a colon. */
const DECLARATION = /[a-z-]\s*:/i;

/**
 * Two hyphens that start a name (no name character before them), at least
 * one name character, optional whitespace, a colon. Starting only at a name's
 * first character keeps the test linear on a long run of hyphens, and reads
 * `x--a:` as the ordinary property it is, not a custom one.
 */
const CUSTOM_PROPERTY_DECLARATION = /(?<![a-z0-9-])--[a-z0-9-]+\s*:/i;

/** Whether `part` (one `;`-separated piece of CSS) holds a declaration. */
export function hasCssDeclaration(part: string): boolean {
  return DECLARATION.test(part);
}

/** Whether `body` (one rule's declarations) declares a custom property. */
export function hasCustomPropertyDeclaration(body: string): boolean {
  return CUSTOM_PROPERTY_DECLARATION.test(body);
}
