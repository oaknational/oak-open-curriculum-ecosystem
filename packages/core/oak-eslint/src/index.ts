import { oakPlugin } from './plugin.js';

/**
 * Re-exports boundary rules and helpers from the boundary module.
 *
 * @remarks
 * This package still exports the raw boundary-rule factories used by existing
 * consumers while the bundled configs provide the primary ESLint entry points.
 */
export {
  coreBoundaryRules,
  createDesignBoundaryRules,
  createLibBoundaryRules,
  createSdkBoundaryRules,
  appBoundaryRules,
  appArchitectureRules,
} from './rules/boundary.js';

export type { NoRealIoInTestsOptions } from './rules/no-real-io-in-tests.js';
export { oakRuleModules as rules } from './plugin.js';

import { recommended } from './configs/recommended.js';
import { strict } from './configs/strict.js';
import { react } from './configs/react.js';
import { next } from './configs/next.js';

export { createGraphBaseConfig } from './configs/base.js';
export type { CreateGraphBaseConfigOptions } from './configs/base.js';

export {
  defineConfigArray,
  createImportResolverSettings,
  commonSettings,
  ignores,
  testRules,
} from './shared.js';
export type { ImportResolverSettingsOptions } from './shared.js';

export const configs = {
  recommended,
  strict,
  react,
  next,
};

/**
 * ESLint plugin for Oak National Academy standards.
 *
 * Exported as a plain object so the shared rule inventory and bundled
 * config arrays preserve their native inferred shapes.
 */
const plugin = {
  ...oakPlugin,
  configs: configs,
};

export default plugin;
