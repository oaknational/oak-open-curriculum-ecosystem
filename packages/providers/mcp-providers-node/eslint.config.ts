import { defineConfig } from 'eslint/config';
import { baseConfig } from '../../../eslint.config.base';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

export default defineConfig(
  ...baseConfig,
  {
    ignores: [
      'dist/**',
      '*.log',
      '.turbo/**',
      '.logs/**',
      '.stryker-tmp/**',
      'tsup.config.*',
      '**/*.bundled_*.mjs',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: wsTsProject,
        tsconfigRootDir: thisDir,
      },
    },
  },
);
