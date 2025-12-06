/**
 * @module index-doc-code-gen
 * @description Pure code generation functions for search index document schemas.
 *
 * These functions produce TypeScript code strings for Zod schemas and type guards.
 * They are consumed by generate-search-index-docs.ts to produce the final module.
 */

import type { IndexFieldDefinitions } from './field-definitions/types.js';
import { ZOD_ENUM_EXPRESSIONS } from './zod-schema-generator.js';

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
 * Generates a completion payload schema that uses a specific contexts schema.
 *
 * @param schemaName - Name for the payload schema
 * @param contextsSchemaName - Name of the contexts schema to reference
 * @returns TypeScript code for the completion payload schema
 */
export function generateCompletionPayloadSchema(
  schemaName: string,
  contextsSchemaName: string,
): string {
  return (
    `export const ${schemaName} = z\n` +
    `  .object({\n` +
    `    input: z.array(z.string().min(1)).min(1),\n` +
    `    weight: z.number().int().nonnegative().optional(),\n` +
    `    contexts: ${contextsSchemaName}.optional(),\n` +
    `  })\n` +
    `  .strict();`
  );
}

/**
 * Generates a document schema that uses a per-index completion payload schema.
 *
 * @param schemaName - Name for the document schema
 * @param fields - Field definitions for the index
 * @param completionPayloadSchemaName - Name of the completion payload schema to use
 * @returns TypeScript code for the document schema
 */
export function generateDocSchemaWithTypedCompletion(
  schemaName: string,
  fields: IndexFieldDefinitions,
  completionPayloadSchemaName: string,
): string {
  const fieldLines = fields.map((field) => {
    if (field.name === 'title_suggest') {
      return `    title_suggest: ${completionPayloadSchemaName}.optional(),`;
    }

    let zodExpression: string;
    switch (field.zodType) {
      case 'string':
        if (field.enumRef) {
          const enumExpr = ZOD_ENUM_EXPRESSIONS[field.enumRef] ?? field.enumRef;
          zodExpression = `z.enum(${enumExpr})`;
        } else {
          zodExpression = 'z.string().min(1)';
        }
        break;
      case 'number':
        zodExpression = 'z.number().int().nonnegative()';
        break;
      case 'boolean':
        zodExpression = 'z.boolean()';
        break;
      case 'array-string':
        zodExpression = 'z.array(z.string().min(1))';
        break;
      case 'array-number':
        zodExpression = 'z.array(z.number())';
        break;
      case 'object':
        zodExpression = 'SearchCompletionSuggestPayloadSchema';
        break;
      default: {
        const exhaustive: never = field.zodType;
        throw new Error(`Unhandled zodType: ${String(exhaustive)}`);
      }
    }

    if (field.optional) {
      zodExpression += '.optional()';
    }

    return `    ${maybeQuoteFieldName(field.name)}: ${zodExpression},`;
  });

  return [
    `export const ${schemaName} = z`,
    '  .object({',
    ...fieldLines,
    '  })',
    '  .strict();',
  ].join('\n');
}

/**
 * Generates a simple document schema without completion contexts.
 * Used for indexes that don't have title_suggest fields.
 *
 * @param schemaName - Name for the document schema
 * @param fields - Field definitions for the index
 * @returns TypeScript code for the document schema
 */
export function generateSimpleDocSchema(schemaName: string, fields: IndexFieldDefinitions): string {
  const fieldLines = fields.map((field) => {
    let zodExpression: string;
    switch (field.zodType) {
      case 'string':
        if (field.enumRef) {
          const enumExpr = ZOD_ENUM_EXPRESSIONS[field.enumRef] ?? field.enumRef;
          zodExpression = `z.enum(${enumExpr})`;
        } else {
          zodExpression = 'z.string().min(1)';
        }
        break;
      case 'number':
        zodExpression = 'z.number().int().nonnegative()';
        break;
      case 'boolean':
        zodExpression = 'z.boolean()';
        break;
      case 'array-string':
        zodExpression = 'z.array(z.string().min(1))';
        break;
      case 'array-number':
        zodExpression = 'z.array(z.number())';
        break;
      case 'object':
        zodExpression = 'z.record(z.string(), z.unknown())';
        break;
      default: {
        const exhaustive: never = field.zodType;
        throw new Error(`Unhandled zodType: ${String(exhaustive)}`);
      }
    }

    if (field.optional) {
      zodExpression += '.optional()';
    }

    return `    ${maybeQuoteFieldName(field.name)}: ${zodExpression},`;
  });

  return [
    `export const ${schemaName} = z`,
    '  .object({',
    ...fieldLines,
    '  })',
    '  .strict();',
  ].join('\n');
}

/**
 * Generates a type guard function for a schema.
 *
 * @param fnName - Name of the guard function
 * @param schemaName - Name of the Zod schema to use
 * @param typeName - Name of the TypeScript type
 * @returns TypeScript code for the type guard
 */
export function generateTypeGuard(fnName: string, schemaName: string, typeName: string): string {
  return (
    `export function ${fnName}(value: unknown): value is ${typeName} {\n` +
    `  return ${schemaName}.safeParse(value).success;\n` +
    `}`
  );
}
