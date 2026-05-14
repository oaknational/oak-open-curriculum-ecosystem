import { readFile } from 'node:fs/promises';

import { glob } from 'tinyglobby';

import type { ContextCostFileSystem } from './file-system.js';

export const nodeContextCostFileSystem: ContextCostFileSystem = {
  readFileUtf8: (absolutePath) => readFile(absolutePath, 'utf8'),
  expandGlob: (cwd, pattern) =>
    glob([pattern], {
      cwd,
      onlyFiles: true,
      absolute: true,
      followSymbolicLinks: false,
    }),
};
