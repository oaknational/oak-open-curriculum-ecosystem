import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import { react } from './react.js';

/**
 * Next.js ESLint configuration.
 *
 * Uses @next/eslint-plugin-next directly (not eslint-config-next) to avoid
 * plugin conflicts with our custom react config. The eslint-config-next package
 * bundles its own react/react-hooks plugins which conflict with ours.
 */
export const next = tseslint.config(react, {
  plugins: {
    '@next/next': nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
  },
});
