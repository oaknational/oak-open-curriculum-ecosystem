/**
 * Wildcard response-map consolidation helpers.
 *
 * Shared error schemas that appear under every operation for the same status
 * get an additional wildcard entry so downstream generators can avoid
 * duplicating equivalent validators.
 */

import type { SchemaObject } from 'openapi3-ts/oas31';
import { cloneSchema } from './shared.js';
import type { ResponseMapEntry } from './response-map-entry.js';

export function createWildcardResponseMapEntries(
  entries: readonly ResponseMapEntry[],
  componentSchemas: ReadonlyMap<string, SchemaObject>,
): readonly ResponseMapEntry[] {
  const wildcardEntries: ResponseMapEntry[] = [];

  for (const [status, componentSet] of groupComponentNamesByStatus(entries)) {
    if (componentSet.size !== 1) {
      continue;
    }
    const [componentName] = componentSet;
    const schemaForComponent = componentSchemas.get(componentName);
    if (!schemaForComponent) {
      continue;
    }
    wildcardEntries.push({
      operationId: '*',
      status,
      componentName,
      jsonSchema: cloneSchema(schemaForComponent),
      path: '*',
      colonPath: '*',
      method: '*',
      source: 'component',
    });
  }

  return wildcardEntries;
}

function groupComponentNamesByStatus(
  entries: readonly ResponseMapEntry[],
): ReadonlyMap<string, ReadonlySet<string>> {
  const byStatus = new Map<string, Set<string>>();

  for (const entry of entries) {
    if (entry.source !== 'component' || entry.componentName === '__VOID__') {
      continue;
    }
    const set = byStatus.get(entry.status) ?? new Set<string>();
    set.add(entry.componentName);
    byStatus.set(entry.status, set);
  }

  return byStatus;
}
