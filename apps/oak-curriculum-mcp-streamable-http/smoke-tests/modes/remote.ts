import type { PrepareEnvironmentOptions, PreparedEnvironment, LoadedEnvResult } from '../types.js';

type RemoteSource = 'cli' | 'smokeRemoteBaseUrl' | 'oakMcpUrl';

export function prepareRemoteEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: LoadedEnvResult,
): PreparedEnvironment {
  delete process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS;
  delete process.env.PORT;

  const remoteSelection = resolveRemoteBaseUrl(
    options.remoteBaseUrl,
    process.env.SMOKE_REMOTE_BASE_URL,
  );
  if (!remoteSelection) {
    throw new Error(
      `Remote smoke tests require a base URL. Provide a CLI argument, set SMOKE_REMOTE_BASE_URL, or define OAK_MCP_URL in process env or the repo .env (root: ${envLoad.repoRoot}).`,
    );
  }

  // Remote servers use OAuth (no dev token)
  // Tests work without auth headers for pre-OAuth deployments
  return {
    baseUrl: remoteSelection.baseUrl,
    devToken: undefined, // No dev token - remote uses OAuth or no auth
    envLoad,
    remoteUrlSource: remoteSelection.source,
    devTokenSource: 'not-applicable-remote-uses-oauth',
  };
}

function resolveRemoteBaseUrl(
  cliCandidate?: string,
  envCandidate?: string,
  oakCandidate?: string,
): { readonly baseUrl: string; readonly source: RemoteSource } | undefined {
  const candidates: [RemoteSource, string | undefined][] = [
    ['cli', cliCandidate?.trim()],
    ['smokeRemoteBaseUrl', envCandidate?.trim()],
    ['oakMcpUrl', oakCandidate?.trim()],
  ];

  for (const [source, value] of candidates) {
    if (value && value.length > 0) {
      return { baseUrl: normaliseBaseUrl(value), source };
    }
  }
  return undefined;
}

function normaliseBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim();
  const withProtocol = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  const formatted = new URL(withProtocol).toString();
  return formatted.endsWith('/') ? formatted.slice(0, -1) : formatted;
}
