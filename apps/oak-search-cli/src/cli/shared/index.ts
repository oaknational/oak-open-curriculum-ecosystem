/**
 * Shared CLI infrastructure — SDK factory, output formatting,
 * input validation, and pass-through command registration.
 */

export { createCliSdk } from './create-cli-sdk.js';
export type { CliSdkEnv } from './create-cli-sdk.js';
export {
  printSuccess,
  printError,
  printInfo,
  printWarning,
  printJson,
  printHeader,
} from './output.js';
export { validateSubject, validateKeyStage, validateScope } from './validators.js';
export { APP_ROOT, registerPassThrough, registerBashPassThrough } from './pass-through.js';
