import type { Config } from 'prettier';

/**
 * Root formatting convention for the Practice tooling and docs
 * (`agent-tools`, the tooling and shared packages, `.agent/`, `docs/`, root
 * files): the TypeScript family's one formatter configuration. A product
 * workspace that keeps its own convention carries its own `prettier.config.ts`.
 */
const config: Config = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  useTabs: false,
};

export default config;
