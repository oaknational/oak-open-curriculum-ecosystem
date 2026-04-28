import { createLibConfig } from '../../../tsup.config.base.js';

export default createLibConfig({ external: ['@opentelemetry/api'] });
