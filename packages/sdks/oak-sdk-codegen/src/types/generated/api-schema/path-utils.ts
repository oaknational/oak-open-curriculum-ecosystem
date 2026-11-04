/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Path style utilities for colon ":name" and curly "\{name\}" parameter placeholders.
 */

/** Convert OpenAPI-style curly params to colon params. */
export function toColon(path: string): string {
  return path.replaceAll(/{([^{}]+)}/g, ':$1');
}

/** Convert colon params to OpenAPI-style curly params. */
export function toCurly(path: string): string {
  return path.replaceAll(/:(\w+)/g, '{$1}');
}

/** Detect if a path uses colon parameter style. */
export function isColon(path: string): boolean {
  return /:\w+/.test(path);
}

/** Detect if a path uses curly parameter style. */
export function isCurly(path: string): boolean {
  return /{[^{}]+}/.test(path);
}
