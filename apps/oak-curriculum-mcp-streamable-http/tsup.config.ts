import { createAppConfig } from '../../tsup.config.base.js';

export default createAppConfig({
  index: 'src/index.ts',
  application: 'src/application.ts',
});
