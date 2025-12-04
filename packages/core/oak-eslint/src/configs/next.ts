import nextPlugin from '@next/eslint-plugin-next';
import type { Linter } from 'eslint';
import { react } from './react.js';

export const next: Linter.Config[] = [
  ...react,
  {
    plugins: {
      '@next/next': nextPlugin as any,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    } as any,
  },
];
