import type { SchemaObject } from 'openapi3-ts/oas31';

export type ResponseMapMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'head'
  | 'options'
  | '*';

export interface ResponseMapEntry {
  readonly operationId: string;
  readonly status: string;
  readonly componentName: string;
  readonly zodIdentifier?: string;
  readonly jsonSchema?: SchemaObject;
  readonly path: string;
  readonly colonPath: string;
  readonly method: ResponseMapMethod;
  readonly source: 'component' | 'inline' | 'void';
}
