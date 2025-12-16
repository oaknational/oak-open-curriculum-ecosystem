/**
 * Utility functions for generating ES mapping TypeScript code.
 */

import {
  ES_ANALYZER_CONFIG,
  ES_NORMALIZER_CONFIG,
  ES_FILTER_CONFIG,
  type EsFieldMapping,
} from './es-field-config.js';

export const HEADER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Elasticsearch index mapping generated from SDK schema.
 * Regenerate with: pnpm type-gen
 */

`;

/**
 * Quotes field names that are not valid JavaScript identifiers.
 *
 * Valid JavaScript identifiers match: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
 *
 * Examples:
 * - `subject` → `subject` (valid identifier, no quotes needed)
 * - `@timestamp` → `'@timestamp'` (invalid identifier, quotes added)
 * - `key_stage` → `key_stage` (valid identifier, no quotes needed)
 *
 * @param name - Field name to potentially quote
 * @returns Field name, quoted if necessary for valid JavaScript
 */
function maybeQuoteFieldName(name: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name) ? name : `'${name}'`;
}

/**
 * Serialises an ES field mapping to TypeScript object literal.
 */
export function serialiseFieldMapping(mapping: EsFieldMapping, indent: number): string {
  const pad = ' '.repeat(indent);
  const lines: string[] = ['{'];

  lines.push(`${pad}  type: '${mapping.type}',`);

  if (mapping.normalizer) {
    lines.push(`${pad}  normalizer: '${mapping.normalizer}',`);
  }
  if (mapping.analyzer) {
    lines.push(`${pad}  analyzer: '${mapping.analyzer}',`);
  }
  if (mapping.search_analyzer) {
    lines.push(`${pad}  search_analyzer: '${mapping.search_analyzer}',`);
  }
  if (mapping.ignore_above !== undefined) {
    lines.push(`${pad}  ignore_above: ${String(mapping.ignore_above)},`);
  }
  if (mapping.term_vector) {
    lines.push(`${pad}  term_vector: '${mapping.term_vector}',`);
  }
  if (mapping.contexts) {
    lines.push(`${pad}  contexts: [`);
    for (const ctx of mapping.contexts) {
      lines.push(`${pad}    { name: '${ctx.name}', type: '${ctx.type}' },`);
    }
    lines.push(`${pad}  ],`);
  }
  if (mapping.fields) {
    lines.push(`${pad}  fields: {`);
    for (const [name, subField] of Object.entries(mapping.fields)) {
      lines.push(`${pad}    ${name}: ${serialiseFieldMapping(subField, indent + 4)},`);
    }
    lines.push(`${pad}  },`);
  }
  if (mapping.enabled !== undefined) {
    lines.push(`${pad}  enabled: ${String(mapping.enabled)},`);
  }

  lines.push(`${pad}}`);
  return lines.join('\n');
}

/**
 * Generates the ES settings block as TypeScript code.
 */
export function generateSettingsBlock(): string {
  const lines: string[] = ['  settings: {'];
  lines.push('    analysis: {');

  // Normalizers
  lines.push('      normalizer: {');
  for (const [name, config] of Object.entries(ES_NORMALIZER_CONFIG)) {
    lines.push(`        ${name}: {`);
    lines.push(`          type: '${config.type}',`);
    lines.push(`          filter: [${config.filter.map((f) => `'${f}'`).join(', ')}],`);
    lines.push('        },');
  }
  lines.push('      },');

  // Filters
  lines.push('      filter: {');
  for (const [name, config] of Object.entries(ES_FILTER_CONFIG)) {
    lines.push(`        ${name}: {`);
    lines.push(`          type: '${config.type}',`);
    lines.push(`          synonyms_set: '${config.synonyms_set}',`);
    lines.push(`          updateable: ${String(config.updateable)},`);
    lines.push('        },');
  }
  lines.push('      },');

  // Analyzers
  lines.push('      analyzer: {');
  for (const [name, config] of Object.entries(ES_ANALYZER_CONFIG)) {
    lines.push(`        ${name}: {`);
    lines.push(`          type: '${config.type}',`);
    lines.push(`          tokenizer: '${config.tokenizer}',`);
    lines.push(`          filter: [${config.filter.map((f) => `'${f}'`).join(', ')}],`);
    lines.push('        },');
  }
  lines.push('      },');

  lines.push('    },');
  lines.push('  },');

  return lines.join('\n');
}

/**
 * Generates a minimal settings block (no analyzers).
 */
export function generateMinimalSettingsBlock(): string {
  const lines: string[] = ['  settings: {'];
  lines.push('    analysis: {');

  // Only normalizers
  lines.push('      normalizer: {');
  for (const [name, config] of Object.entries(ES_NORMALIZER_CONFIG)) {
    lines.push(`        ${name}: {`);
    lines.push(`          type: '${config.type}',`);
    lines.push(`          filter: [${config.filter.map((f) => `'${f}'`).join(', ')}],`);
    lines.push('        },');
  }
  lines.push('      },');

  lines.push('    },');
  lines.push('  },');

  return lines.join('\n');
}

/**
 * Generates a properties block from field definitions.
 */
export function generatePropertiesBlock(
  fields: readonly [string, EsFieldMapping][],
  indent: number,
): string {
  const pad = ' '.repeat(indent);
  const lines: string[] = [`${pad}properties: {`];

  for (const [name, mapping] of fields) {
    lines.push(
      `${pad}  ${maybeQuoteFieldName(name)}: ${serialiseFieldMapping(mapping, indent + 2)},`,
    );
  }

  lines.push(`${pad}},`);
  return lines.join('\n');
}
