import { runSmokeSuite } from './smoke-suite.js';

const cliBaseUrl = process.argv[2];

runSmokeSuite({ mode: 'remote', remoteBaseUrl: cliBaseUrl }).catch((err: unknown) => {
  console.error('Remote smoke failed:', err);
  process.exit(1);
});
