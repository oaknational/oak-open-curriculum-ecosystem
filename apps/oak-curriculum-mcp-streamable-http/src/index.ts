import http from 'node:http';

import { createApp } from './application.js';
import { bootstrapApp } from './bootstrap-app.js';
import {
  createHttpObservability,
  describeHttpObservabilityError,
} from './observability/http-observability.js';
import { loadRuntimeConfig } from './runtime-config.js';
import { startConfiguredHttpServer } from './server-runtime.js';

const result = loadRuntimeConfig({
  processEnv: process.env,
  startDir: process.cwd(),
});

if (!result.ok) {
  process.stderr.write(result.error.message + '\n');
  process.exit(1);
}

const config = result.value;
const observabilityResult = createHttpObservability(config);

if (!observabilityResult.ok) {
  process.stderr.write(describeHttpObservabilityError(observabilityResult.error) + '\n');
  process.exit(1);
}

const observability = observabilityResult.value;
await startConfiguredHttpServer({
  runtimeConfig: config,
  observability,
  createApp,
  bootstrapApp,
  createServer: (app) => {
    /**
     * Express 5's app.listen() wraps the callback with once() and registers it
     * for both 'listening' and 'error' events. This means EADDRINUSE fires the
     * callback without the error argument, the server never binds, and the
     * process exits silently. Using http.createServer directly lets us handle
     * startup errors explicitly.
     */
    return http.createServer(app);
  },
  onSignal: (signal, handler) => {
    process.once(signal, handler);
  },
  exit: (code) => process.exit(code),
});
