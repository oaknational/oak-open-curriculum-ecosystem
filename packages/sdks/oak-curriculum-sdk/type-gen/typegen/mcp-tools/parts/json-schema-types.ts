export interface JsonSchemaPropertyString {
  readonly type: 'string';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

export interface JsonSchemaPropertyNumber {
  readonly type: 'number';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

export interface JsonSchemaPropertyBoolean {
  readonly type: 'boolean';
  readonly enum?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

export interface JsonSchemaPropertyArray<TItem extends 'string' | 'number' | 'boolean'> {
  readonly type: 'array';
  readonly items: { readonly type: TItem };
  readonly description?: string;
  readonly default?: unknown;
}

export interface JsonSchemaObject {
  readonly type: 'object';
  readonly properties: Readonly<Record<string, JsonSchemaProperty>>;
  readonly required?: readonly string[];
  readonly additionalProperties: false;
}

export type JsonSchemaProperty =
  | JsonSchemaPropertyString
  | JsonSchemaPropertyNumber
  | JsonSchemaPropertyBoolean
  | JsonSchemaPropertyArray<'string' | 'number' | 'boolean'>
  | JsonSchemaObject;
