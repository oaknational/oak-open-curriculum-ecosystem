/**
 * Shared CLI infrastructure — SDK factory, output formatting,
 * input validation, and pass-through command registration.
 *
 * Re-exports from create-cli-sdk, output, validators, and pass-through modules.
 */
export { createCliSdk, createEsClient } from './create-cli-sdk.js';
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
export { APP_ROOT, registerPassThrough } from './pass-through.js';
