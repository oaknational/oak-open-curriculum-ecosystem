import type { ResponseMapEntry } from './build-response-map.js';

function sanitizeIdentifier(name: string): string {
  // Replace invalid characters for member access; keep underscores and alphanumerics
  return name.replace(/[^A-Za-z0-9_]/g, '_');
}

export function emitResponseValidators(entries: readonly ResponseMapEntry[]): string {
  const header = `/**\n * GENERATED FILE - DO NOT EDIT\n *\n * Response validator map built from OpenAPI schema at compile-time.\n */\n\nimport type { z } from 'zod';\nimport { schemas } from '../zod/schemas.js';\n\nconst responseSchemaMap = new Map<string, z.ZodSchema>();`;

  const lines = entries.map((e) => {
    const id = `${e.operationId}:${e.status}`;
    const member = sanitizeIdentifier(e.componentName);
    return `responseSchemaMap.set('${id}', schemas.${member});`;
  });

  const footer = `\nexport { responseSchemaMap };`;
  return [header, ...lines, footer].join('\n');
}
