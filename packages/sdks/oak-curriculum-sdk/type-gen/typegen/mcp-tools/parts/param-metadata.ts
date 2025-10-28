/** Shared parameter metadata definitions for MCP tool emitters */

import type { PrimitiveType } from './param-utils.js';

export interface ParamMetadata {
  readonly typePrimitive: PrimitiveType;
  readonly valueConstraint: boolean;
  readonly required: boolean;
  readonly allowedValues?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

export type ParamMetadataMap = Record<string, ParamMetadata>;

export function createMutableParamMetadata(metadata: ParamMetadata): ParamMetadata {
  return {
    typePrimitive: metadata.typePrimitive,
    valueConstraint: metadata.valueConstraint,
    required: metadata.required,
    allowedValues: metadata.allowedValues,
    description: metadata.description,
    default: metadata.default,
  };
}
