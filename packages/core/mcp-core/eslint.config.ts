import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../../eslint.config.base';
import { fileURLToPath } from 'node:url';

const rootTsProject = fileURLToPath(new URL('../../../tsconfig.lint.root.json', import.meta.url));
const repoRootDir = fileURLToPath(new URL('../../../', import.meta.url));

export default tsEslintConfig(...baseConfig, {
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: {
      projectService: false,
      project: rootTsProject,
      tsconfigRootDir: repoRootDir,
    },
  },
});
