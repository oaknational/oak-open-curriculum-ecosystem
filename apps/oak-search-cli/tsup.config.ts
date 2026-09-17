import { createAppConfig } from '@oaknational/workspace-config/tsup';

export default createAppConfig(
  { 'bin/oaksearch': 'bin/oaksearch.ts' },
  { banner: { js: '#!/usr/bin/env node' }, target: 'node22' },
);
