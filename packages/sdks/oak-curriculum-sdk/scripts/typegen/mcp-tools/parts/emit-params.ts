import type { OperationObject } from 'openapi-typescript';
import type { PrimitiveType } from './param-utils.js';
import { buildParamDetailsMap, type ParamDetails } from './param-introspection.js';
import { capitaliseFirst } from './param-support.js';
import { typeSafeKeys } from '../../../../src/types/helpers.js';

interface Meta {
  typePrimitive: PrimitiveType;
  valueConstraint: boolean;
  required: boolean;
  allowedValues?: readonly unknown[];
}

function emitEnumGuardBlock(
  cap: string,
  vt: PrimitiveType,
  values: readonly unknown[],
  optional: boolean,
): string {
  const lines: string[] = [];
  if (optional) lines.push(`// ${cap} value is optional, not all query parameters are.`);
  lines.push(`const allowed${cap}Values= ${JSON.stringify(values)} as const;`);
  const typeSuffix = optional ? ' | undefined' : '';
  lines.push(`type ${cap}Value = typeof allowed${cap}Values[number]${typeSuffix};`);
  lines.push(`function is${cap}Value(value: ${vt}${typeSuffix}): value is ${cap}Value {`);
  if (optional) lines.push('  if (value === undefined) { return true; }');
  lines.push(`  const string${cap}Value: readonly ${vt}[] = allowed${cap}Values;`);
  lines.push(`  return string${cap}Value.includes(value);`);
  lines.push('}');
  lines.push('');
  return lines.join('\n');
}

function emitPathEnumGuards(
  pathParams: readonly string[],
  detailsMap: Map<string, ParamDetails>,
): string {
  const lines: string[] = [];
  if (pathParams.length > 0) lines.push('// Path parameters');
  for (const name of pathParams) {
    const d = detailsMap.get(name);
    if (!d?.enumValues) continue;
    const cap = capitaliseFirst(name);
    const vt = d.primitiveType;
    lines.push(`const allowed${cap}Values= ${JSON.stringify(d.enumValues)} as const;`);
    lines.push(`type ${cap}Value = typeof allowed${cap}Values[number];`);
    lines.push(`function is${cap}Value(value: ${vt}): value is ${cap}Value {`);
    lines.push(`  const string${cap}Value: readonly ${vt}[] = allowed${cap}Values;`);
    lines.push(`  return string${cap}Value.includes(value);`);
    lines.push('}');
    lines.push('');
  }
  return lines.join('\n');
}

function emitQueryEnumGuards(
  queryParams: readonly string[],
  detailsMap: Map<string, ParamDetails>,
): string {
  const lines: string[] = [];
  if (queryParams.length > 0) lines.push('// Query parameters');
  for (const name of queryParams) {
    const d = detailsMap.get(name);
    if (!d?.enumValues) continue;
    const cap = capitaliseFirst(name);
    const vt = d.primitiveType;
    const opt = !d.required;
    lines.push(emitEnumGuardBlock(cap, vt, d.enumValues, opt));
  }
  return lines.join('\n');
}

function emitParamMaps(
  pathParams: readonly string[],
  queryParams: readonly string[],
  detailsMap: Map<string, ParamDetails>,
  pathMeta: Record<string, Meta>,
  queryMeta: Record<string, Meta>,
): string {
  const buildMapBlock = (
    label: 'pathParams' | 'queryParams',
    names: readonly string[],
    meta: Record<string, Meta>,
  ): string => {
    const out: string[] = [];
    out.push(`const ${label}= {`);
    for (const name of names) {
      const m = meta[name];
      const hasEnum = Boolean(detailsMap.get(name)?.enumValues);
      const cap = capitaliseFirst(name);
      if (hasEnum) {
        out.push(
          `"${name}":{"typePrimitive":"${m.typePrimitive}","valueConstraint":${String(
            m.valueConstraint,
          )},"required":${String(m.required)},"allowedValues":allowed${cap}Values, typeguard: is${cap}Value},`,
        );
      } else {
        out.push(`"${name}":${JSON.stringify(m)},`);
      }
    }
    out.push('};');
    out.push('');
    return out.join('\n');
  };
  const blocks = [
    buildMapBlock('pathParams', pathParams, pathMeta),
    buildMapBlock('queryParams', queryParams, queryMeta),
    'void pathParams;',
    'void queryParams;',
  ];
  return blocks.join('\n');
}

export function emitParams(
  operation: OperationObject,
  pathParamMetadata: Record<string, Meta>,
  queryParamMetadata: Record<string, Meta>,
): string {
  const detailsMap = buildParamDetailsMap(operation);
  const pathParams = typeSafeKeys(pathParamMetadata);
  const queryParams = typeSafeKeys(queryParamMetadata);
  const out: string[] = [];
  out.push(emitPathEnumGuards(pathParams, detailsMap));
  out.push(emitQueryEnumGuards(queryParams, detailsMap));
  out.push(
    emitParamMaps(pathParams, queryParams, detailsMap, pathParamMetadata, queryParamMetadata),
  );
  return out.join('\n');
}
