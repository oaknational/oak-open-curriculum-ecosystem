import { describe, expect, it } from 'vitest';

import { renameRootTypes } from './rename-root-types.js';

const EMITTED = [
  'export interface paths {',
  '    "/lessons/{lesson}": {',
  '        get: operations["getLessons"];',
  '        /** The paths a client may follow; see components["schemas"]. */',
  '        paths: string;',
  '    };',
  '}',
  'export type webhooks = Record<string, never>;',
  'export interface components {',
  '    schemas: {',
  '        Lesson: {',
  '            next: components["schemas"]["Lesson"][];',
  '            label: "paths" | "operations";',
  '        };',
  '    };',
  '}',
  'export type $defs = Record<string, never>;',
  'export interface operations {',
  '    getLessons: {',
  '        responses: {',
  '            200: components["schemas"]["Lesson"];',
  '        };',
  '    };',
  '}',
].join('\n');

describe('renameRootTypes', () => {
  it('renames the five root declarations to PascalCase', () => {
    const output = renameRootTypes(EMITTED);

    expect(output).toContain('export interface Paths {');
    expect(output).toContain('export type Webhooks = Record<string, never>;');
    expect(output).toContain('export interface Components {');
    expect(output).toContain('export type $Defs = Record<string, never>;');
    expect(output).toContain('export interface Operations {');
    expect(output).not.toMatch(/^export (?:interface|type) (?:paths|webhooks|components|\$defs|operations)\b/m);
  });

  it('renames every type reference to a root type, nested indexed accesses included', () => {
    const output = renameRootTypes(EMITTED);

    expect(output).toContain('get: Operations["getLessons"];');
    expect(output).toContain('next: Components["schemas"]["Lesson"][];');
    expect(output).toContain('200: Components["schemas"]["Lesson"];');
  });

  it('leaves property names, string literals and comments as emitted', () => {
    const output = renameRootTypes(EMITTED);

    expect(output).toContain('        paths: string;');
    expect(output).toContain('label: "paths" | "operations";');
    expect(output).toContain('/** The paths a client may follow; see components["schemas"]. */');
  });

  it('returns a source without root types unchanged', () => {
    const source = 'export interface Other {\n    value: string;\n}\n';

    expect(renameRootTypes(source)).toBe(source);
  });
});
