import { type ReviewRuntimeLayout } from './review-assets.js';

const PASSTHROUGH_ENVIRONMENT_KEYS = [
  'TMPDIR',
  'LANG',
  'LC_ALL',
  'SSL_CERT_FILE',
  'SSL_CERT_DIR',
] as const;

export function createReviewChildEnvironment(
  source: Readonly<NodeJS.ProcessEnv>,
  layout: ReviewRuntimeLayout,
): NodeJS.ProcessEnv {
  const environment: NodeJS.ProcessEnv = {
    HOME: layout.homeDirectory,
    CODEX_HOME: layout.codexHome,
    NO_COLOR: '1',
    TERM: 'dumb',
    RUST_LOG: 'error',
  };
  for (const key of PASSTHROUGH_ENVIRONMENT_KEYS) {
    if (source[key] !== undefined) {
      environment[key] = source[key];
    }
  }
  return environment;
}
