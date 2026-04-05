/**
 * Download-asset aggregated tool — secure, clickable download links.
 *
 * Generates HMAC-signed, short-lived URLs for lesson asset downloads.
 * HTTP-only: not registered for stdio transport since the download
 * proxy route only exists on the streamable-http server.
 *
 * @example
 * ```typescript
 * import {
 *   DOWNLOAD_ASSET_TOOL_DEF,
 *   DOWNLOAD_ASSET_FLAT_ZOD_SCHEMA,
 *   validateDownloadAssetArgs,
 *   runDownloadAssetTool,
 * } from './aggregated-asset-download/index.js';
 * ```
 */

export { DOWNLOAD_ASSET_TOOL_DEF, DOWNLOAD_ASSET_FLAT_ZOD_SCHEMA } from './definition.js';

export { validateDownloadAssetArgs, runDownloadAssetTool } from './execution.js';

export type { DownloadAssetArgs, DownloadAssetDeps } from './execution.js';

export {
  createDownloadSignature,
  validateDownloadSignature,
  deriveSigningSecret,
} from './download-token.js';
