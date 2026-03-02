/**
 * Generate path utility helpers for colon/curly conversions.
 * Pure function returning a TypeScript module string.
 */
export function generatePathUtilsFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Path style utilities for colon ":name" and curly "\\{name\\}" parameter placeholders.
 */

/** Convert OpenAPI-style curly params to colon params. */
export function toColon(path: string): string {
  return path.replace(/{([^}]+)}/g, ':$1');
}

/** Convert colon params to OpenAPI-style curly params. */
export function toCurly(path: string): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

/** Detect if a path uses colon parameter style. */
export function isColon(path: string): boolean {
  return /:[A-Za-z0-9_]+/.test(path);
}

/** Detect if a path uses curly parameter style. */
export function isCurly(path: string): boolean {
  return /{[^}]+}/.test(path);
}
`;
}
