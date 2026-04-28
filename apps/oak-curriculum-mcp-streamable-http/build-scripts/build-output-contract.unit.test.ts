import { describe, expect, it } from 'vitest';
import {
  assertBuiltServerDefaultExport,
  assertNoEsbuildWarnings,
} from './build-output-contract.js';

describe('assertNoEsbuildWarnings', () => {
  it('accepts a clean esbuild result', () => {
    expect(() => {
      assertNoEsbuildWarnings([]);
    }).not.toThrow();
  });

  it('throws with the warning text when esbuild emits warnings', () => {
    expect(() => {
      assertNoEsbuildWarnings([
        { text: 'Import "default" will always be undefined' },
        { text: 'Another warning' },
      ]);
    }).toThrow(
      [
        'Esbuild emitted warnings:',
        '- Import "default" will always be undefined',
        '- Another warning',
      ].join('\n'),
    );
  });
});

describe('assertBuiltServerDefaultExport', () => {
  it('accepts an esbuild re-exported default binding inside a multi-export list', () => {
    expect(() => {
      assertBuiltServerDefaultExport(
        [
          'function handler() { return undefined; }',
          'var server_default = handler;',
          'export { server_default as default, handler };',
        ].join('\n'),
      );
    }).not.toThrow();
  });

  it('accepts a direct default export binding when it resolves to a function', () => {
    expect(() => {
      assertBuiltServerDefaultExport('const handler = () => undefined;\nexport default handler;');
    }).not.toThrow();
  });

  it('accepts an inline default function export', () => {
    expect(() => {
      assertBuiltServerDefaultExport('export default async function serverHandler() {}');
    }).not.toThrow();
  });

  it('rejects bundle output with no default export', () => {
    expect(() => {
      assertBuiltServerDefaultExport('export { handler as namedExport };');
    }).toThrow(
      'dist/server.js must default-export a function that satisfies the verified @vercel/node import contract.',
    );
  });

  it('rejects a default export binding that resolves to a non-function value', () => {
    expect(() => {
      assertBuiltServerDefaultExport('const handler = 123;\nexport default handler;');
    }).toThrow(
      'dist/server.js must default-export a function that satisfies the verified @vercel/node import contract.',
    );
  });
});
