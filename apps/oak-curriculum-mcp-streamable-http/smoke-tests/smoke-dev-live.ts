import { runSmokeSuite } from './smoke-suite.js';

runSmokeSuite({ mode: 'local-live' }).catch((err: unknown) => {
  console.error('Live smoke failed:', err);
  process.exit(1);
});
