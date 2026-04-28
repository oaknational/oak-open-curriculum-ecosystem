import { createLibConfig } from '../../../tsup.config.base.js';

export default createLibConfig({ external: ['@sentry/node'] });
