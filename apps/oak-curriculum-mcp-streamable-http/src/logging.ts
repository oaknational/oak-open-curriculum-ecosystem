import type { Logger } from '@oaknational/mcp-logger';

import { createHttpLogger } from './logging/index.js';
import { loadRuntimeConfig } from './runtime-config.js';

const runtimeConfig = loadRuntimeConfig();

export const logger: Logger = createHttpLogger(runtimeConfig, {
  name: 'streamable-http:legacy-adapter',
});

export { createHttpLogger };
export type { Logger };
