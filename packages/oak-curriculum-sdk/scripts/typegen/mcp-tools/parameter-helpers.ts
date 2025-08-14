/**
 * MCP Tool Parameter Helper Functions
 *
 * Type guards and helper functions for parameter type generation.
 * After schema validation, we have complete type information.
 */

import type { SchemaObject } from 'openapi-typescript';

/**
 * Sanitize parameter names to avoid reserved words
 * @param name - Original parameter name
 * @returns Sanitized parameter name
 */
export function sanitizeParameterName(name: string): string {
  // Map of reserved words to safe alternatives
  const reservedWordMap: Record<string, string> = {
    type: 'assetType',
    class: 'className',
    function: 'functionName',
    const: 'constValue',
    let: 'letValue',
    var: 'varValue',
    return: 'returnValue',
    interface: 'interfaceName',
    enum: 'enumValue',
    export: 'exportValue',
    import: 'importValue',
    package: 'packageName',
    private: 'privateValue',
    public: 'publicValue',
    static: 'staticValue',
    extends: 'extendsValue',
    implements: 'implementsValue',
  };

  return reservedWordMap[name] ?? name;
}

/**
 * Type predicate to check if a schema has an enum property
 */
export function hasEnumSchema(
  schema: SchemaObject,
): schema is SchemaObject & { enum: (string | number)[] } {
  return 'enum' in schema && Array.isArray(schema.enum);
}

/**
 * Format an enum value for TypeScript literal type
 */
export function formatEnumValue(value: string | number): string {
  return `'${String(value)}'`;
}
