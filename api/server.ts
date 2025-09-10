import { createApp } from '../apps/oak-curriculum-mcp-streamable-http/src/index';
import { loadRootEnv } from '@oaknational/mcp-env';

// Ensure local runs can read repo-root .env if needed
loadRootEnv({ startDir: process.cwd(), requiredKeys: [], env: process.env });

const app = createApp();
export default app;
