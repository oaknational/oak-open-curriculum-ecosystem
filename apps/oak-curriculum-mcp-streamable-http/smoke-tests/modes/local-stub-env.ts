/**
 * Inputs for local stub process-environment preparation.
 */
export interface LocalStubProcessEnvInput {
  readonly parentEnv: NodeJS.ProcessEnv;
  readonly port: number;
}

/**
 * Create the child-process environment for local stub smoke startup.
 *
 * @remarks Local smoke gates must not inherit deploy release metadata because
 * they are not proving Sentry release registration.
 */
export function createLocalStubProcessEnv({
  parentEnv,
  port,
}: LocalStubProcessEnvInput): NodeJS.ProcessEnv {
  const localEnv = { ...parentEnv };
  delete localEnv.VERCEL_GIT_COMMIT_SHA;
  delete localEnv.VERCEL_BRANCH_URL;
  delete localEnv.SENTRY_RELEASE_OVERRIDE;

  return {
    ...localEnv,
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
    DANGEROUSLY_DISABLE_AUTH: 'true',
    PORT: String(port),
    SENTRY_MODE: 'off',
  };
}
