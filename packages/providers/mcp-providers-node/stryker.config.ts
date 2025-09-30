import baseConfig from '../../../stryker.config.base';

export default {
  ...baseConfig,
  mutate: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.spec.ts'],
  vitest: {
    configFile: './vitest.config.ts',
    project: undefined,
  },
  tempDirName: '../../.stryker-tmp/providers-node',
  checkers: ['typescript'],
  tsconfigFile: './tsconfig.json',
  ignoreStatic: true,
};
