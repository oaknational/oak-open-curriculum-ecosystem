import { runSmokeSuite } from './smoke-suite.js';

runSmokeSuite({ mode: 'local-stub' }).catch((err: unknown) => {
  console.error('Stub smoke failed:', err);
  process.exit(1);
});
