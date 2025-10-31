import { chromium, type BrowserContext, type Page } from 'playwright';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { URL, URLSearchParams } from 'node:url';

import { createClerkClient } from '@clerk/backend';
import { loadRootEnv } from '@oaknational/mcp-env';

import { HandshakeSnapshotSchema, type HandshakeSnapshot } from './snapshot.js';

interface NetworkRequest {
  readonly url: string;
  readonly method: string;
  readonly timestamp: number;
  readonly status?: number;
  readonly headers?: Record<string, string>;
  readonly redirectChain?: readonly string[];
  readonly failure?: string;
}

interface RedirectHop {
  readonly from: string;
  readonly to: string;
  readonly timestamp: number;
  readonly statusCode: number;
  readonly headers: Record<string, string>;
}

interface TraceSummary {
  readonly snapshotPath: string;
  readonly harPath: string;
  readonly tracePath: string;
  readonly callbackUrl?: string;
  readonly authorizationCode?: string;
  readonly state?: string;
  readonly redirectHops: readonly RedirectHop[];
  readonly timeline: readonly NetworkRequest[];
  readonly createdAt: string;
  readonly verificationStatus: {
    readonly stateMatches: boolean;
    readonly callbackReceived: boolean;
    readonly callbackStatusCode?: number;
  };
}

const REDIRECT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes for manual sign-in
const DEFAULT_CHROME_PORT = 9222;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Get callback URI from environment or use default
function getCallbackUri(): string {
  const envCallback = process.env.OAUTH_CALLBACK_URI;
  if (envCallback) {
    return envCallback;
  }
  // Default to localhost for local testing (Clerk will redirect here but it may not exist)
  // The script will capture the redirect URL parameters before the page loads
  return 'http://localhost:3333/oauth/callback';
}

function parseArgs(): {
  useExistingChrome: boolean;
  chromePort: number;
  noCleanup: boolean;
  fresh: boolean;
} {
  const args = process.argv.slice(2);
  const useExistingChrome = args.includes('--connect-chrome') || args.includes('--use-existing');
  const noCleanup = args.includes('--no-cleanup');
  const fresh = args.includes('--fresh') || args.includes('--recreate');

  let chromePort = DEFAULT_CHROME_PORT;
  const portIndex = args.findIndex((arg) => arg === '--chrome-port' || arg === '--port');
  if (portIndex >= 0 && args[portIndex + 1]) {
    const port = Number.parseInt(args[portIndex + 1]!, 10);
    if (!Number.isNaN(port) && port > 0 && port < 65536) {
      chromePort = port;
    }
  }

  return { useExistingChrome, chromePort, noCleanup, fresh };
}

async function captureBrowserTrace(): Promise<void> {
  loadRootEnv({ startDir: process.cwd(), env: process.env });

  const { secretKey, publishableKey } = requireClerkKeys(process.env);
  const snapshotPath = resolve('.tmp/clerk-handshake.json');

  // Parse command line arguments first
  const { useExistingChrome, chromePort, noCleanup, fresh } = parseArgs();

  // Step 1: Prepare handshake snapshot if it doesn't exist or is invalid
  let snapshot: HandshakeSnapshot;

  if (fresh) {
    console.log('🔄 Fresh snapshot requested - creating new handshake snapshot...');
    try {
      unlinkSync(snapshotPath);
    } catch {
      // Ignore if file doesn't exist
    }
    snapshot = await prepareHandshakeSnapshot(secretKey, publishableKey, snapshotPath);
    console.log('✅ Created new handshake snapshot\n');
  } else {
    try {
      snapshot = parseSnapshot(readFileSync(snapshotPath, 'utf-8'));
      console.log('Found existing handshake snapshot');
      console.log(`   OAuth App ID: ${snapshot.oauthApplication.id}`);
      console.log(`   Client ID: ${snapshot.oauthApplication.clientId}`);
      console.log('   (If you see "invalid_client" errors, use --fresh to recreate)\n');
    } catch {
      console.log('No existing handshake snapshot found. Creating new one...\n');
      snapshot = await prepareHandshakeSnapshot(secretKey, publishableKey, snapshotPath);
      console.log('✅ Created new handshake snapshot\n');
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const artifactsDir = resolve('temp-secrets');
  mkdirSync(artifactsDir, { recursive: true });

  const harPath = resolve(artifactsDir, `clerk-oauth-trace-${timestamp}.har`);
  const tracePath = resolve(artifactsDir, `clerk-oauth-trace-${timestamp}-trace.zip`);
  const snapshotCopyPath = resolve(artifactsDir, `clerk-handshake-${timestamp}.json`);

  // Step 2: Launch or connect to browser with tracing
  let browser:
    | Awaited<ReturnType<typeof chromium.launch>>
    | Awaited<ReturnType<typeof chromium.connectOverCDP>>;
  let shouldCloseBrowser = true;

  if (useExistingChrome) {
    // Connect to existing Chrome instance
    console.log(`🔗 Connecting to existing Chrome browser on port ${chromePort}...`);
    console.log(
      '   Make sure Chrome is running with: --remote-debugging-port=' + String(chromePort),
    );
    console.log(
      '   Example: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=' +
        String(chromePort) +
        ' --user-data-dir=/tmp/chrome-debug\n',
    );

    try {
      browser = await chromium.connectOverCDP(`http://localhost:${String(chromePort)}`);
      shouldCloseBrowser = false; // Don't close the user's browser
      console.log('✅ Connected to existing Chrome browser');

      // Get the default context (first one available)
      const contexts = browser.contexts();
      if (contexts.length === 0) {
        throw new Error('No browser contexts found. Chrome may not have any windows open.');
      }
      console.log(`   Found ${contexts.length} browser context(s)\n`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to connect to Chrome on port ${chromePort}: ${message}`);
      console.error('\n💡 To use existing Chrome, launch it with:');
      console.error(
        `   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=${String(chromePort)}`,
      );
      console.error(
        '   (On Linux: google-chrome --remote-debugging-port=' + String(chromePort) + ')',
      );
      console.error(
        '   (On Windows: start chrome.exe --remote-debugging-port=' + String(chromePort) + ')\n',
      );
      throw error;
    }
  } else {
    // Launch new Chrome instance
    console.log('Launching Chrome browser with network tracing enabled...');
    console.log('⚠️  Browser configured with anti-detection measures for CAPTCHA compatibility');

    browser = await chromium.launch({
      headless: false,
      channel: 'chrome', // Use installed Chrome instead of Chromium for Google sign-in support
      args: [
        '--disable-blink-features=AutomationControlled', // Remove automation flags
        '--disable-dev-shm-usage',
        '--no-sandbox',
      ],
    });
  }

  // Get or create browser context
  let context: Awaited<ReturnType<typeof browser.newContext>>;

  if (useExistingChrome) {
    // Use the default context from existing Chrome
    const contexts = browser.contexts();
    if (contexts.length === 0) {
      throw new Error('No browser contexts available in connected Chrome instance');
    }
    context = contexts[0]!;
    console.log('   Using existing browser context (your logged-in session)\n');

    // Enable HAR recording on existing context (may require creating a new page)
    // Note: HAR recording on existing contexts may be limited
  } else {
    // Create new context with anti-detection measures
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordHar: { path: harPath, mode: 'minimal' },
      // Remove automation indicators
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      // Add permissions to allow CAPTCHA to load
      permissions: ['geolocation'],
      locale: 'en-US',
      timezoneId: 'America/Los_Angeles',
      // Disable automation detection
      javaScriptEnabled: true,
      hasTouch: false,
      isMobile: false,
      // Realistic screen settings
      colorScheme: 'light' as const,
      reducedMotion: 'no-preference' as const,
    });

    // Add script to remove webdriver property that CAPTCHA checks
    await context.addInitScript(() => {
      // Remove automation indicators
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });

      // Override plugins to look like a real browser
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Override languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });

      // Override permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission } as PermissionStatus)
          : originalQuery(parameters);
    });
  }

  // Note: HAR recording may not work on existing contexts, but we can still capture via tracing
  if (!useExistingChrome) {
    // HAR is already configured in newContext above
  } else {
    console.log('⚠️  Note: HAR recording may be limited when connecting to existing Chrome.');
    console.log('   Network activity will still be captured via Playwright tracing.\n');
  }

  // Start Playwright tracing
  await context.tracing.start({ screenshots: true, snapshots: true });

  const networkRequests: Map<string, NetworkRequest> = new Map();
  const redirectHops: RedirectHop[] = [];
  const responseBodies = new Map<string, string>(); // Store response bodies for error detection
  const trackedContexts = new Set<BrowserContext>();
  const trackedPages = new Set<Page>();

  // Track network requests - use request object's identity for uniqueness
  const requestMap = new WeakMap<unknown, string>();

  const registerPage = (candidatePage: Page): void => {
    if (trackedPages.has(candidatePage)) {
      return;
    }

    trackedPages.add(candidatePage);

    candidatePage.on('close', () => {
      trackedPages.delete(candidatePage);
    });
  };

  const registerContext = (ctx: BrowserContext): void => {
    if (trackedContexts.has(ctx)) {
      return;
    }

    trackedContexts.add(ctx);

    ctx.on('close', () => {
      trackedContexts.delete(ctx);
    });

    for (const existingPage of ctx.pages()) {
      registerPage(existingPage);
    }

    ctx.on('page', (newPage) => {
      registerPage(newPage);
    });

    ctx.on('request', (request) => {
      const requestId = `${request.method()}:${request.url()}:${Date.now()}`;
      requestMap.set(request, requestId);
      networkRequests.set(requestId, {
        url: request.url(),
        method: request.method(),
        timestamp: Date.now(),
        headers: request.headers(),
      });
    });

    ctx.on('requestfailed', (request) => {
      const requestId = requestMap.get(request);
      if (!requestId) {
        return;
      }

      const existing = networkRequests.get(requestId);
      if (!existing) {
        return;
      }

      networkRequests.set(requestId, {
        ...existing,
        failure: request.failure()?.errorText,
      });
    });

    ctx.on('response', async (response) => {
      const request = response.request();
      const requestId = requestMap.get(request);

      if (!requestId) {
        return;
      }

      const existing = networkRequests.get(requestId);
      if (!existing) {
        return;
      }

      try {
        const body = await response.text();
        responseBodies.set(requestId, body);
      } catch {
        // Ignore if body can't be read (already consumed or streaming)
      }

      networkRequests.set(requestId, {
        ...existing,
        status: response.status(),
        headers: response.headers(),
      });

      if (response.status() >= 300 && response.status() < 400) {
        const location = response.headers()['location'];
        if (location) {
          redirectHops.push({
            from: request.url(),
            to: location,
            timestamp: Date.now(),
            statusCode: response.status(),
            headers: response.headers(),
          });
        }
      }
    });
  };

  registerContext(context);

  browser.on('contextcreated', (newContext) => {
    console.log('   Detected new browser context (popup/tab)');
    registerContext(newContext);
  });

  browser.on('contextclosed', (closedContext) => {
    if (trackedContexts.has(closedContext)) {
      trackedContexts.delete(closedContext);
    }
  });

  // Get or create a page
  let page: Awaited<ReturnType<typeof context.newPage>>;
  if (useExistingChrome) {
    // Use an existing page if available, otherwise create a new one
    const pages = context.pages();
    if (pages.length > 0) {
      page = pages[0]!;
      // Check if page is still valid
      try {
        await page.evaluate(() => true);
        console.log(`   Using existing page\n`);
      } catch {
        console.log(`   Existing page was closed, creating new page\n`);
        page = await context.newPage();
      }
    } else {
      console.log(`   Creating new page\n`);
      page = await context.newPage();
    }
  } else {
    page = await context.newPage();
  }

  // Step 3: Navigate to authorize URL
  console.log(`\n📍 Navigating to authorize URL...`);
  console.log(`   ${snapshot.authorizeRequestUrl}\n`);
  console.log('⏸️  Browser will pause for manual sign-in...');
  console.log('   Please complete the provider sign-in in the browser window.');
  console.log('   Note: CAPTCHA may take a few seconds to load - please wait for it to appear.\n');

  // Helper function to check for invalid_client errors
  async function checkForInvalidClientError(): Promise<boolean> {
    // Check page content
    try {
      const pageContent = await page.content();
      if (
        pageContent.includes('invalid_client') ||
        pageContent.includes('Client authentication failed')
      ) {
        return true;
      }
    } catch {
      // Ignore content read errors
    }

    // Check network response bodies
    for (const [requestId, body] of responseBodies.entries()) {
      if (
        body.includes('"error":"invalid_client"') ||
        body.includes('Client authentication failed')
      ) {
        console.error(`   Error found in response from: ${networkRequests.get(requestId)?.url}`);
        return true;
      }
    }

    return false;
  }

  try {
    await page.goto(snapshot.authorizeRequestUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // After navigation, check for errors (wait a bit for responses to arrive)
    await page.waitForTimeout(1000);
    const hasError = await checkForInvalidClientError();

    if (hasError) {
      throw new Error('invalid_client');
    }
  } catch (error) {
    const isInvalidClient =
      (error instanceof Error && error.message.includes('invalid_client')) ||
      (await checkForInvalidClientError());

    if (isInvalidClient) {
      console.error('❌ OAuth application not found (invalid_client error).');
      console.error('   The snapshot contains a deleted OAuth application.');
      console.error('   Recreating snapshot with a new OAuth application...\n');

      // Clean up the stale snapshot
      try {
        unlinkSync(snapshotPath);
      } catch {
        // Ignore if file doesn't exist
      }

      // Create a new snapshot
      snapshot = await prepareHandshakeSnapshot(secretKey, publishableKey, snapshotPath);
      console.log('✅ Created new handshake snapshot with fresh OAuth application');
      console.log(`\n📍 Retrying with new authorize URL...`);
      console.log(`   ${snapshot.authorizeRequestUrl}\n`);

      // Clear response bodies for fresh check
      responseBodies.clear();

      // Retry navigation
      await page.goto(snapshot.authorizeRequestUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      await page.waitForTimeout(1000);

      // Check again after retry
      if (await checkForInvalidClientError()) {
        throw new Error(
          'Failed to create valid OAuth application. Please check your Clerk credentials.',
        );
      }
    } else {
      throw error;
    }
  }

  // Wait a moment for CAPTCHA/widgets to initialize
  await page.waitForTimeout(2000);

  console.log('✅ Page loaded. You can now interact with the sign-in form.\n');

  // Get the callback URI from snapshot (it's configured there)
  const callbackUri = snapshot.oauthApplication.redirectUri;
  const callbackBase = callbackUri.split('?')[0]!;

  // Step 4: Wait for callback redirect (manual sign-in happens here)
  console.log('⏳ Waiting for OAuth callback redirect (max 5 minutes)...');
  console.log(`   Expected callback: ${callbackUri}`);
  console.log(
    "   Note: The callback URL doesn't need to exist - we just capture the redirect parameters.\n",
  );

  // Wait for URL to change to callback (even if the page fails to load)
  let callbackUrl: string;
  let callbackParams: URLSearchParams;

  try {
    // Poll for callback URL change across all open pages (popup-friendly)
    const startTime = Date.now();
    const lastCheckedUrls = new WeakMap<Awaited<ReturnType<typeof context.newPage>>, string>();
    let callbackPage: Awaited<ReturnType<typeof context.newPage>> | undefined;

    while (Date.now() - startTime < REDIRECT_TIMEOUT_MS) {
      const pagesToInspect = Array.from(trackedPages).filter((candidate) => !candidate.isClosed());

      // Inspect every open page (the provider may open new windows/tabs)
      for (const candidatePage of pagesToInspect) {
        const currentUrl = candidatePage.url();
        const previousUrl = lastCheckedUrls.get(candidatePage);

        if (currentUrl !== previousUrl) {
          const origin = candidatePage === page ? '   Checking URL' : '   Checking URL (popup/tab)';
          console.log(
            `${origin}: ${currentUrl.substring(0, 80)}${currentUrl.length > 80 ? '...' : ''}`,
          );
          lastCheckedUrls.set(candidatePage, currentUrl);
        }

        if (!currentUrl) {
          continue;
        }

        if (
          currentUrl.includes('/oauth/callback') ||
          currentUrl === callbackUri ||
          currentUrl.startsWith(callbackBase)
        ) {
          let parsedParams: URLSearchParams;

          try {
            parsedParams = new URLSearchParams(new URL(currentUrl).search);
          } catch (parseError) {
            console.error(
              `   Warning: Failed to parse URL: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
            );
            await delay(500);
            continue;
          }

          if (parsedParams.has('code') || parsedParams.has('error')) {
            callbackUrl = currentUrl;
            callbackParams = parsedParams;
            callbackPage = candidatePage;
            console.log('✅ Callback redirect detected!');
            console.log(`   URL: ${callbackUrl}`);
            if (callbackParams.has('code')) {
              console.log(
                `   Authorization code: ${callbackParams.get('code')?.substring(0, 20)}...`,
              );
            }
            if (callbackParams.has('error')) {
              console.log(`   Error: ${callbackParams.get('error')}`);
            }
            console.log("   (It's OK if the page shows an error - we captured the redirect!)\n");
            break;
          }

          console.log('   Found callback URL but no code/error params yet...');
        }
      }

      if (callbackUrl && callbackParams) {
        if (callbackPage && callbackPage !== page) {
          page = callbackPage;
        }
        break;
      }

      // Also check for callback in network requests (in case URL hasn't updated yet)
      const callbackRequest = Array.from(networkRequests.values()).find(
        (r) =>
          r.url.includes('/oauth/callback') &&
          (r.url.includes('code=') || r.url.includes('error=')),
      );

      if (callbackRequest) {
        callbackUrl = callbackRequest.url;
        let parsedParams: URLSearchParams;

        try {
          parsedParams = new URLSearchParams(new URL(callbackUrl).search);
        } catch (parseError) {
          console.error(
            `   Warning: Failed to parse network callback URL: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
          );
          await delay(500);
          continue;
        }

        callbackParams = parsedParams;
        console.log('✅ Callback detected in network traffic!');
        console.log(`   URL: ${callbackUrl}`);
        console.log("   (It's OK if the page shows an error - we captured the redirect!)\n");
        break;
      }

      await delay(500);
    }

    if (!callbackUrl || !callbackParams) {
      throw new Error('Timeout waiting for callback redirect');
    }
  } catch (error) {
    // Try to get URL even if error occurred
    try {
      const fallbackPage = page ?? context.pages()[0];
      if (!fallbackPage) {
        throw error;
      }

      callbackUrl = fallbackPage.url();
      if (callbackUrl.includes('/oauth/callback')) {
        callbackParams = new URLSearchParams(new URL(callbackUrl).search);
        console.log('⚠️  Captured callback URL despite error\n');
      } else {
        throw error;
      }
    } catch {
      console.error('❌ Timeout waiting for callback redirect.');
      console.error('   Please ensure you completed the sign-in process.\n');
      await context.tracing.stop({ path: tracePath });
      if (shouldCloseBrowser) {
        await context.close();
        await browser.close();
      }
      throw error;
    }
  }

  // Ensure we have the URL and params
  if (!callbackUrl || !callbackParams) {
    throw new Error('Failed to capture callback URL');
  }

  // Step 5: Stop tracing (HAR is automatically saved via recordHar option)
  console.log('💾 Saving trace and HAR files...');
  await context.tracing.stop({ path: tracePath });

  // Only close browser if we launched it (not if we connected to existing)
  if (shouldCloseBrowser) {
    await context.close();
    await browser.close();
  } else {
    console.log('   Browser left open (you can continue using your Chrome)\n');
    // Don't close the page or context when using existing Chrome
  }

  // Step 6: Verify callback
  const authorizationCode = callbackParams.get('code') ?? undefined;
  const returnedState = callbackParams.get('state') ?? undefined;
  const stateMatches = returnedState === snapshot.state;

  let callbackStatusCode: number | undefined;
  try {
    // Verify the callback was handled by checking the response
    const callbackRequest = Array.from(networkRequests.values()).find((r) =>
      r.url.includes('/oauth/callback'),
    );
    callbackStatusCode = callbackRequest?.status;
  } catch {
    // Ignore errors
  }

  // Copy snapshot to artifacts
  copyFileSync(snapshotPath, snapshotCopyPath);

  // Step 7: Generate summary
  const summary: TraceSummary = {
    snapshotPath: snapshotCopyPath,
    harPath,
    tracePath,
    callbackUrl,
    authorizationCode,
    state: returnedState,
    redirectHops,
    timeline: Array.from(networkRequests.values()).filter((r) => r.status !== undefined),
    createdAt: new Date().toISOString(),
    verificationStatus: {
      stateMatches,
      callbackReceived: callbackUrl.includes('/oauth/callback'),
      callbackStatusCode,
    },
  };

  const summaryPath = resolve(artifactsDir, `clerk-oauth-trace-${timestamp}-summary.md`);
  writeFileSync(summaryPath, generateSummaryMarkdown(summary, snapshot), 'utf-8');

  console.log('📦 Artifacts saved:');
  console.log(`   HAR: ${harPath}`);
  console.log(`   Trace: ${tracePath}`);
  console.log(`   Snapshot: ${snapshotCopyPath}`);
  console.log(`   Summary: ${summaryPath}\n`);

  // Step 8: Cleanup (unless --no-cleanup flag)
  const shouldCleanup = !noCleanup;
  if (shouldCleanup) {
    console.log('🧹 Cleaning up Clerk resources...');
    await cleanupHandshake(secretKey, publishableKey, snapshot);
    console.log('✅ Cleanup complete.\n');
  } else {
    console.log('⏭️  Skipping cleanup (--no-cleanup flag set).\n');
  }

  // Print verification results
  console.log('📊 Verification Results:');
  console.log(
    `   State match: ${stateMatches ? '✅' : '❌'} ${stateMatches ? 'Matches' : `Expected: ${snapshot.state}, Got: ${returnedState ?? 'missing'}`}`,
  );
  console.log(`   Callback received: ${summary.verificationStatus.callbackReceived ? '✅' : '❌'}`);
  if (callbackStatusCode) {
    console.log(`   Callback status: ${callbackStatusCode}`);
  }
  console.log(`   Redirect hops: ${redirectHops.length}`);
}

function requireClerkKeys(env: NodeJS.ProcessEnv): { secretKey: string; publishableKey: string } {
  const secretKey = env.CLERK_SECRET_KEY;
  const publishableKey = env.CLERK_PUBLISHABLE_KEY;
  if (!secretKey || !publishableKey) {
    throw new Error('CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY must be set.');
  }
  return { secretKey, publishableKey };
}

function parseSnapshot(contents: string): HandshakeSnapshot {
  return HandshakeSnapshotSchema.parse(JSON.parse(contents));
}

async function prepareHandshakeSnapshot(
  secretKey: string,
  publishableKey: string,
  snapshotPath: string,
): Promise<HandshakeSnapshot> {
  // Reuse logic from prepare-browser-handshake.ts
  const { randomBytes } = await import('node:crypto');
  const { createAutomationIdentifier, createPkcePair, toBase64Url } = await import('./utils.js');

  const clerk = createClerkClient({ secretKey, publishableKey });

  const email = `${createAutomationIdentifier('mcp-handshake', 4)}@example.com`;
  const user = await clerk.users.createUser({
    emailAddress: [email],
    firstName: 'MCP',
    lastName: 'Handshake',
    skipPasswordRequirement: true,
  });

  const session = await clerk.sessions.createSession({ userId: user.id });
  const [sessionToken, testingToken] = await Promise.all([
    clerk.sessions.getToken(session.id),
    clerk.testingTokens.createTestingToken(),
  ]);

  const redirectUri = getCallbackUri();
  const app = await clerk.oauthApplications.create({
    name: createAutomationIdentifier('mcp-handshake-app'),
    redirectUris: [redirectUri],
    scopes: 'email profile',
    public: true,
  });

  const pkce = createPkcePair();
  const state = toBase64Url(randomBytes(16));

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: app.clientId,
    redirect_uri: redirectUri,
    scope: app.scopes,
    code_challenge: pkce.challenge,
    code_challenge_method: 'S256',
    state,
  });

  const authorizeRequestUrl = `${app.authorizeUrl}?${params.toString()}`;

  const snapshot: HandshakeSnapshot = {
    userId: user.id,
    sessionId: session.id,
    sessionJwt: sessionToken.jwt,
    clientId: session.clientId,
    devBrowserToken: testingToken.token,
    oauthApplication: {
      id: app.id,
      clientId: app.clientId,
      authorizeUrl: app.authorizeUrl,
      tokenFetchUrl: app.tokenFetchUrl,
      redirectUri,
      scopes: app.scopes,
    },
    pkce,
    state,
    authorizeRequestUrl,
    createdAt: new Date().toISOString(),
  };

  mkdirSync(dirname(snapshotPath), { recursive: true });
  writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, { encoding: 'utf-8' });

  return snapshot;
}

async function cleanupHandshake(
  secretKey: string,
  publishableKey: string,
  snapshot: HandshakeSnapshot,
): Promise<void> {
  const clerk = createClerkClient({ secretKey, publishableKey });

  await Promise.allSettled([
    clerk.sessions.revokeSession(snapshot.sessionId),
    clerk.users.deleteUser(snapshot.userId),
    clerk.oauthApplications.delete(snapshot.oauthApplication.id),
  ]);
}

function generateSummaryMarkdown(summary: TraceSummary, snapshot: HandshakeSnapshot): string {
  const redirectTable = summary.redirectHops
    .map((hop, index) => {
      const time = new Date(hop.timestamp).toISOString();
      return `| ${index + 1} | ${time} | ${hop.statusCode} | ${hop.from} | ${hop.to} |`;
    })
    .join('\n');

  const timelineTable = summary.timeline
    .slice(0, 50) // Limit to first 50 requests
    .map((req, index) => {
      const time = new Date(req.timestamp).toISOString();
      return `| ${index + 1} | ${time} | ${req.method} | ${req.status ?? 'N/A'} | ${req.url} |`;
    })
    .join('\n');

  return `# Clerk OAuth Browser Trace Summary

**Captured:** ${summary.createdAt}

## Artifacts

- **HAR File:** \`${summary.harPath}\`
- **Playwright Trace:** \`${summary.tracePath}\`
- **Handshake Snapshot:** \`${summary.snapshotPath}\`

## Callback Information

- **Callback URL:** ${summary.callbackUrl ?? 'Not captured'}
- **Authorization Code:** ${summary.authorizationCode ? 'Present' : 'Missing'}
- **State Parameter:** ${summary.state ?? 'Missing'}

## Verification Status

- **State Match:** ${summary.verificationStatus.stateMatches ? '✅ PASS' : '❌ FAIL'}
  - Expected: \`${snapshot.state}\`
  - Received: \`${summary.state ?? 'missing'}\`
- **Callback Received:** ${summary.verificationStatus.callbackReceived ? '✅ YES' : '❌ NO'}
- **Callback Status Code:** ${summary.verificationStatus.callbackStatusCode ?? 'Unknown'}

## Redirect Hops

| # | Timestamp | Status | From | To |
|---|-----------|--------|------|-----|
${redirectTable || '| No redirects captured | | | | |'}

## Network Timeline (First 50 Requests)

| # | Timestamp | Method | Status | URL |
|---|-----------|--------|--------|-----|
${timelineTable || '| No requests captured | | | | |'}

## Handshake Details

- **User ID:** \`${snapshot.userId}\`
- **Session ID:** \`${snapshot.sessionId}\`
- **OAuth Application ID:** \`${snapshot.oauthApplication.id}\`
- **Client ID:** \`${snapshot.oauthApplication.clientId}\`
- **Authorize URL:** \`${snapshot.oauthApplication.authorizeUrl}\`
- **Redirect URI:** \`${snapshot.oauthApplication.redirectUri}\`
- **Scopes:** \`${snapshot.oauthApplication.scopes}\`

## Notes

- Total redirect hops: ${summary.redirectHops.length}
- Total network requests captured: ${summary.timeline.length}
- Playwright trace file can be viewed with: \`npx playwright show-trace ${summary.tracePath}\`
`;
}

captureBrowserTrace().catch((error: unknown) => {
  console.error('Failed to capture browser trace:', error);
  process.exitCode = 1;
});
