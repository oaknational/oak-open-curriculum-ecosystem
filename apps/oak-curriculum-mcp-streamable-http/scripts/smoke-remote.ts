import { runSmokeSuite } from './smoke-suite.js';

const cliBaseUrl = process.argv[2];
const envBaseUrl = process.env.SMOKE_REMOTE_BASE_URL;
const legacyBaseUrl = process.env.BASE_URL;

let remoteBaseUrl = cliBaseUrl;
if (!remoteBaseUrl || remoteBaseUrl.length === 0) {
  remoteBaseUrl = envBaseUrl && envBaseUrl.length > 0 ? envBaseUrl : remoteBaseUrl;
}
if (!remoteBaseUrl || remoteBaseUrl.length === 0) {
  remoteBaseUrl = legacyBaseUrl && legacyBaseUrl.length > 0 ? legacyBaseUrl : remoteBaseUrl;
}

if (!remoteBaseUrl || remoteBaseUrl.length === 0) {
  console.error(
    'Remote smoke requires a base URL. Pass it as the first CLI argument or set SMOKE_REMOTE_BASE_URL.',
  );
  process.exit(1);
}

runSmokeSuite({ mode: 'remote', remoteBaseUrl }).catch((err: unknown) => {
  console.error('Remote smoke failed:', err);
  process.exit(1);
});
