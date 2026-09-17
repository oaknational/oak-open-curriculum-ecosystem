import { createLibConfig } from '@oaknational/workspace-config/tsup';

export default createLibConfig({ external: ['node:fs', 'node:path'] });
