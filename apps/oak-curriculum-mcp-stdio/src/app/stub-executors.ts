import type { ToolExecutorOverrides } from '../tools/index.js';
import {
  createStubToolExecutionAdapter,
  assertStubAvailable,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/**
 * Resolves tool executor overrides based on configuration.
 *
 * When `useStubTools` is `true`, returns stub executors that return
 * canned data without making real API calls. Otherwise returns an
 * empty overrides object (real executors are used).
 *
 * @param useStubTools - Whether stub tools should be used (from validated RuntimeConfig)
 */
export function resolveToolExecutors(useStubTools: boolean): ToolExecutorOverrides {
  if (!useStubTools) {
    return {};
  }
  const executeStubTool = createStubToolExecutionAdapter();
  return {
    executeMcpTool: async (name, args) => {
      assertStubAvailable(name);
      return executeStubTool(name, args ?? {});
    },
  };
}
