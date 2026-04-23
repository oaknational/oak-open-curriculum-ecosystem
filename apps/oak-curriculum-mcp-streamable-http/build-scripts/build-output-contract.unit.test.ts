import { describe, expect, it } from 'vitest';
import {
  assertNoEsbuildWarnings,
  assertVercelDefaultExportFunction,
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

describe('assertVercelDefaultExportFunction', () => {
  it('accepts a module whose default export is a function', () => {
    expect(() => {
      assertVercelDefaultExportFunction({
        default: () => undefined,
      });
    }).not.toThrow();
  });

  it('rejects a module with no default export', () => {
    expect(() => {
      assertVercelDefaultExportFunction({});
    }).toThrow(
      'dist/server.js must default-export a function that satisfies the verified @vercel/node import contract.',
    );
  });

  it('rejects a module whose default export is not a function', () => {
    expect(() => {
      assertVercelDefaultExportFunction({ default: { listen: () => undefined } });
    }).toThrow(
      'dist/server.js must default-export a function that satisfies the verified @vercel/node import contract.',
    );
  });
});
