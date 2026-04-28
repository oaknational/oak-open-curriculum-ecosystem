## Install

Add the Sentry Node SDK as a dependency:

```bash
pnpm add @sentry/node @sentry/profiling-node
```

## Configure SDK

Initialize Sentry as early as possible in your application's lifecycle.

To initialize the SDK before everything else, create an external file called `instrument.js/mjs`.

```javascript
// instrument.(js|mjs)
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://9d7511fa9baacdbc789dd136bc1fe26e@o4507089578754048.ingest.de.sentry.io/4511206384795728",integrations: [
    nodeProfilingIntegration(),
  ],

  // Send structured logs to Sentry
  enableLogs: true,
      // Tracing
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is evaluated only once per SDK.init call
    profileSessionSampleRate: 1.0,
    // Trace lifecycle automatically enables profiling during active traces
    profileLifecycle: 'trace',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  });

// Profiling happens automatically after setting it up with `Sentry.init()`.
// All spans (unless those discarded by sampling) will have profiling data attached to them.
Sentry.startSpan({
  name: "My Span",
}, () => {
  // The code executed here will be profiled
});
```

Make sure to import `instrument.js/mjs` at the top of your file. Set up the error handler after all controllers and before any other error middleware. This setup is typically done in your application's entry point file, which is usually `index.(js|ts)`. If you're running your application in ESM mode, or looking for alternative ways to set up Sentry, read about [installation methods in our docs](https://docs.sentry.io/platforms/javascript/guides/express/install/).

```javascript
// index.(js|mjs)

// IMPORTANT: Make sure to import `instrument.js` at the top of your file.
// If you're using ECMAScript Modules (ESM) syntax, use `import "./instrument.js";`
require("./instrument.js");

// All other imports below
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const express = require("express");

const app = express();

// All your controllers should live here

app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(3000);

```

## Upload Source Maps (Optional)

Automatically upload your source maps to enable readable stack traces for Errors. If you prefer to manually set up source maps, please follow [this guide](https://docs.sentry.io/platforms/javascript/guides/express/sourcemaps/).

npx @sentry/wizard@latest -i sourcemaps --saas --org oak-national-academy --project oak-open-curriculum-mcp

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript

app.get("/debug-sentry", function mainHandler(req, res) {
  // Send a log before throwing the error
  Sentry.logger.info('User triggered test error', {
    action: 'test_error_endpoint',
  });
  // Send a test metric before throwing the error
  Sentry.metrics.count('test_counter', 1);
  throw new Error("My first Sentry error!");
});
          
```
