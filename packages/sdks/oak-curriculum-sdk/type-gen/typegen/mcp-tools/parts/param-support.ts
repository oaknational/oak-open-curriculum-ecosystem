/** Shared tiny helpers for emitters */

import type { ParamMetadataMap } from './param-metadata.js';

export function capitaliseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function paramNames(meta: ParamMetadataMap): readonly string[] {
  return Object.keys(meta);
}
