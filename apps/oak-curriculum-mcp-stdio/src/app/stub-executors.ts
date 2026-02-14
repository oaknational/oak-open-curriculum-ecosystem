import type { UniversalToolExecutors } from '../tools/index.js';
import {
  createStubToolExecutionAdapter,
  assertStubAvailable,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

export function resolveToolExecutors(): UniversalToolExecutors {
  if (process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS !== 'true') {
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
