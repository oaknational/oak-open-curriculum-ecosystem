import { createAppConfig } from '../../tsup.config.base.js';

export default createAppConfig(
  { 'bin/oaksearch': 'bin/oaksearch.ts' },
  { banner: { js: '#!/usr/bin/env node' }, target: 'node22' },
);
