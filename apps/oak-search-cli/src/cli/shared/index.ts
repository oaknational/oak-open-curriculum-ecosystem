/**
 * Shared CLI infrastructure — client construction, output formatting,
 * input validation, and pass-through command registration.
 *
 * Re-exports from shared helpers, output, validators, and pass-through modules.
 */
export { createEsClient } from './create-cli-sdk.js';
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
export { withEsClient } from './with-es-client.js';
export type { CloseableEsClient, WithEsClientDeps } from './with-es-client.js';
export { buildSearchSdkConfig } from './build-search-sdk-config.js';
export { resolveBulkDir, resolveBulkDirFromInputs } from './resolve-bulk-dir.js';
export type { BulkDirError, FsPredicates, ResolveBulkDirFromInputs } from './resolve-bulk-dir.js';
export { validateIngestEnv } from './validate-ingest-env.js';
export type { EnvError } from './validate-ingest-env.js';
