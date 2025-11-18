# Clerk OAuth Browser Trace – Automated Capture

> Purpose: produce a reproducible set of artefacts that describes the Clerk OAuth PKCE flow end to end.  
> Output: captured network trace (HAR), Playwright trace, `.tmp/clerk-handshake.json` snapshot, and automated summary document covering each redirect hop.
>
> **Note**: This tool is for one-off Clerk configuration validation. Regular authentication behaviour testing uses mocked Clerk responses in automated tests. See `TESTING.md` for details.

## Prerequisites

- Real Clerk environment (test or production) with the MCP application configured.
- Valid provider credentials (e.g. Google test account) that can complete the OAuth flow.
- Local repo with `pnpm` installed and environment variables populated (`CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`).
- Playwright installed (automatically installed via dependencies).

## Automated Capture

Run the automated script to capture the full OAuth flow:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth
```

The script will:

1. **Prepare handshake snapshot** (if one doesn't exist)
   - Generates `.tmp/clerk-handshake.json` containing:
     - Synthetic user + session identifiers
     - OAuth application metadata (authorize/token endpoints, redirect URI, scopes)
     - PKCE verifier/challenge pair and `state`
     - Fully qualified authorize URL (`authorizeRequestUrl`) that embeds the challenge/state

2. **Launch browser with tracing**
   - Opens a Chromium browser window (visible, not headless)
   - Enables Playwright tracing (screenshots, snapshots, network)
   - Enables HAR recording for network traffic

3. **Navigate to authorize URL**
   - Automatically navigates to the `authorizeRequestUrl` from the snapshot
   - Displays console instructions for manual sign-in

4. **Wait for manual provider sign-in**
   - **You must complete the OAuth sign-in manually in the browser window**
   - Enter your test account credentials (Google/Microsoft/etc.)
   - Approve any consent prompts
   - The script waits up to 5 minutes for the callback redirect

5. **Capture callback**
   - Automatically detects when the browser redirects to the MCP callback URI
   - Extracts authorization code and state parameters
   - Records all network requests and redirects with timestamps

6. **Save artifacts** (to `temp-secrets/` directory):
   - **HAR file**: `clerk-oauth-trace-[timestamp].har` - Complete network trace in HAR format
   - **Playwright trace**: `clerk-oauth-trace-[timestamp]-trace.zip` - Full Playwright trace (view with `npx playwright show-trace <path>`)
   - **Handshake snapshot**: `clerk-handshake-[timestamp].json` - Copy of the handshake snapshot
   - **Summary document**: `clerk-oauth-trace-[timestamp]-summary.md` - Automated analysis with:
     - Timeline of redirect hops
     - Verification status (state match, callback received)
     - Network request timeline
     - Handshake details

7. **Verify callback handling**
   - Validates that the `state` parameter matches the snapshot
   - Checks that callback was received (HTTP status)
   - Reports verification results in console and summary

8. **Clean up resources** (unless `--no-cleanup` flag is used)
   - Revokes the synthetic session
   - Removes the OAuth application
   - Optionally deletes `.tmp/clerk-handshake.json` (kept if `--no-cleanup`)

## Options

### Connect to Existing Chrome Browser

To use your existing Chrome browser (where you're already logged in), use the `--connect-chrome` flag. This avoids CAPTCHA issues and allows you to use your existing login session:

1. **First, launch Chrome with remote debugging enabled:**

   **macOS:**

   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
   ```

   **Linux:**

   ```bash
   google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
   ```

   **Windows:**

   ```cmd
   start chrome.exe --remote-debugging-port=9222 --user-data-dir=%TEMP%\chrome-debug
   ```

   > **Note:** You can specify a different port with `--chrome-port <port>` if 9222 is already in use.

2. **Then run the script with the connection flag:**

   ```bash
   pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth -- --connect-chrome
   ```

   Or with a custom port:

   ```bash
   pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth -- --connect-chrome --chrome-port 9223
   ```

   The script will connect to your existing Chrome instance and use your logged-in session. This means:
   - ✅ No CAPTCHA issues (using your real browser)
   - ✅ Already logged in to Google/other providers
   - ✅ Uses your existing cookies and session state
   - ⚠️ HAR recording may be limited (but Playwright tracing still works)

### Other Options

- **Skip cleanup**: Use `--no-cleanup` flag to preserve Clerk resources for investigation:

  ```bash
  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth -- --no-cleanup
  ```

## Manual Steps

The only manual step required is:

- **Complete provider sign-in**: When the browser window opens, manually sign in with your test account credentials. The script will automatically detect when the OAuth flow completes and the callback redirect occurs.

  > **Tip**: If you use `--connect-chrome` with your existing browser, you may already be logged in and can skip this step!

## Viewing Traces

- **HAR files**: Can be opened in Chrome DevTools (Network tab → Import HAR), or HAR viewers like [HAR Analyser](https://toolbox.googleapps.com/apps/har_analyzer/)
- **Playwright traces**: View interactively with:

  ```bash
  npx playwright show-trace temp-secrets/clerk-oauth-trace-[timestamp]-trace.zip
  ```

## Legacy Manual Process

If you need to capture traces manually (e.g., for debugging the automation script), you can still use the individual scripts:

1. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http exec tsx smoke-tests/auth/prepare-browser-handshake.ts`
2. Manually open browser with DevTools and navigate to authorize URL
3. Complete sign-in
4. Save HAR manually
5. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http exec tsx smoke-tests/auth/cleanup-browser-handshake.ts`

## Follow-up

- The captured artefacts inform automation work (Playwright flow or device-code implementation).
- Update the automation plan (`.agent/plans/mcp-oauth-implementation-plan.md`) if the provider flow changes (e.g. new consent screen, extra redirect).
- Artifacts are stored in `temp-secrets/` which is git-ignored for security.
