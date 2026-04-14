import { createSdkConfig } from '../../../tsup.config.base.js';

export default createSdkConfig(['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.spec.ts']);
