# Clerk Testing & Automation Strategy (Express + MCP)

> Target libs: `@clerk/express`, `@clerk/mcp-tools`  
> Goals: Validate wiring **once** with a real browser flow; keep day-to-day tests **fast** by bypassing Clerk safely.

---

## 0) Integrate Clerk in Express (baseline)

Use the official Express SDK to protect routes and read auth:

```ts
// app.ts
import express from 'express';
import { clerkMiddleware, requireAuth, getAuth, clerkClient } from '@clerk/express';

const app = express();

// Apply Clerk to all routes
app.use(clerkMiddleware());

// Example: protected API
app.get('/api/protected', requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const user = await clerkClient.users.getUser(userId!);
  res.json({ ok: true, user: { id: user.id, email: user.emailAddresses[0]?.emailAddress } });
});

export default app;
```

---

## 1) One real OAuth **smoke test** (prove wiring, don’t repeat)

- Drive the full provider flow **in a browser** once (e.g., in Playwright/Cypress).
- Use **Clerk Testing Tokens** to bypass bot-protection heuristics during the run.
- Assert:
  - Callback/redirect works.
  - A session exists and protected route loads.
  - Logout clears session.

> Run this **nightly** and **on auth config changes** (redirect URIs, provider setup), not on every PR.

**Playwright sketch:**

```ts
// auth.smoke.spec.ts
import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

test('OAuth wiring works end-to-end', async ({ page }) => {
  await setupClerkTestingToken({ page }); // bypass automation detection
  await page.goto('/sign-in');
  await page.getByRole('button', { name: /continue with google/i }).click();

  // Fill provider’s test credentials...
  await page.getByLabel(/Email/i).fill(process.env.GOOGLE_TEST_EMAIL!);
  await page.getByRole('button', { name: /Next/i }).click();
  await page.getByLabel(/Password/i).fill(process.env.GOOGLE_TEST_PASSWORD!);
  await page.getByRole('button', { name: /Next/i }).click();

  await page.waitForURL(/\/dashboard/);
  await expect(page.getByText(/Signed in/i)).toBeVisible();
});
```

---

## 2) Day-to-day **browser** tests: reuse session state

Do **one** real login in a setup file, save storage state, reuse it for all specs:

```ts
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('login once & save state', async ({ page }) => {
  await page.goto('/sign-in');
  // do a real login (can also use a password path, or @clerk/testing helpers)
  await page.context().storageState({ path: 'storage/auth.json' });
});

// playwright.config.ts
export default defineConfig({
  use: { storageState: 'storage/auth.json' },
});
```

This keeps E2E realistic without redoing OAuth each time.

---

## 3) API/integration tests (no browser): get a **valid session token** via Backend API

For automation that needs a _real_ session (server-side calls to your app), follow Clerk’s test-only Backend API flow:

1. **Create a test user** (Backend API)
2. **Create a session** for that user (Backend API; test/dev instances)
3. **Create a session token** (short-lived, ~60s)
4. Call your protected endpoints with `Authorization: Bearer <session_token>`

> Because tokens are short-lived, fetch one **per test** or refresh on an interval.

**Example (Node test helper):**

```ts
// test/utils/clerkSession.ts
import fetch from 'node-fetch';

const CLERK_API = process.env.CLERK_API_URL ?? 'https://api.clerk.com';
const SECRET = process.env.CLERK_SECRET_KEY!;

export async function getSessionTokenFor(email: string) {
  // 1) Ensure user exists (idempotent)
  let userId = await findUserIdByEmail(email);
  if (!userId) userId = await createUser(email);

  // 2) Create session
  const session = await req(`/v1/sessions`, {
    method: 'POST',
    body: { user_id: userId },
  });

  // 3) Create short-lived session token (~60s)
  const token = await req(`/v1/sessions/${session.id}/tokens`, { method: 'POST' });
  return token.token; // use as Bearer below

  async function req(path: string, init: any) {
    const res = await fetch(`${CLERK_API}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET}`,
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
    });
    if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} -> ${res.status}`);
    return res.json();
  }

  async function findUserIdByEmail(email: string) {
    const data = await req(`/v1/users?email_address=${encodeURIComponent(email)}`, {});
    return data?.data?.[0]?.id;
  }

  async function createUser(email: string) {
    const user = await req(`/v1/users`, {
      method: 'POST',
      body: { email_address: [email] },
    });
    return user.id;
  }
}
```

**Use it in an integration test:**

```ts
// tests/api.spec.ts
import { expect } from 'vitest';
import { getSessionTokenFor } from './utils/clerkSession';

it('hits a protected API with a valid Clerk session', async () => {
  const token = await getSessionTokenFor('dev+test@example.com');
  const res = await fetch('http://localhost:3000/api/protected', {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.status).toBe(200);
});
```

> If you don’t need a “real” session, prefer a **dev-only mock token** path (below) for maximum speed.

---

## 4) (Alternative) Dev-only mock tokens for pure logic tests

When `NODE_ENV=test`, let your verifier _also_ accept a short-lived RS256 token from a local test issuer.  
**Never** enable this in production.

```ts
// auth/verify.ts
import jwt from 'jsonwebtoken';

const TEST_ISSUER = 'http://localhost/test-issuer';

export async function verifyAuthorization(header: string, env: string) {
  const token = header?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');

  try {
    return await verifyClerkToken(token); // your normal Clerk verification
  } catch (e) {
    if (env !== 'test') throw e;
    return jwt.verify(token, process.env.TEST_SIGNING_PUBLIC_KEY!, {
      algorithms: ['RS256'],
      issuer: TEST_ISSUER,
      audience: 'mcp-server',
    });
  }
}
```

```ts
// test/utils/mintTestToken.ts
import jwt from 'jsonwebtoken';

export function mintTestToken(claims: Record<string, unknown> = {}) {
  return jwt.sign(
    {
      iss: 'http://localhost/test-issuer',
      aud: 'mcp-server',
      sub: 'user_test_123',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 300,
      ...claims,
    },
    process.env.TEST_SIGNING_PRIVATE_KEY!,
    { algorithm: 'RS256' },
  );
}
```

---

## 5) MCP server auth checks

If your MCP handlers sit alongside Express, validate _either_ the Clerk-verified user or your test issuer (in test env).  
With `@clerk/mcp-tools`, you can also use its verification helpers where available; otherwise call your normal verifier.

```ts
// mcp/handlers.ts
import type { IncomingMessage } from 'http';
import { verifyAuthorization } from '../auth/verify'; // from section 4
// (If you use @clerk/mcp-tools helpers, call them here instead)

export async function handleMcp(req: IncomingMessage) {
  const authz = req.headers['authorization'] as string | undefined;
  const claims = await verifyAuthorization(authz ?? '', process.env.NODE_ENV ?? 'prod');

  // Authorize by claims/roles as needed
  if (!claims?.sub) throw new Error('Unauthorized');

  // ... proceed with MCP tool routing
}
```

---

## 6) Test policy (when to run what)

| Suite           | Auth mode                                      | When to run                     |
| --------------- | ---------------------------------------------- | ------------------------------- |
| `@auth-smoke`   | Real browser OAuth + Testing Token             | Nightly; on auth config changes |
| E2E (feature)   | Reused browser storage state                   | Every PR                        |
| Integration/API | Backend API session token **or** dev-only mock | Every PR                        |
| Unit            | Injected fake context                          | Every PR / local                |

---

## Notes & limits

- Clerk **session tokens are short-lived (~60s)** → refresh each test or run a refresh helper on an interval.
- Testing Tokens now work in **production** too (with limits); use them to bypass bot-protection in E2E.
- If you prefer **not** to mint session tokens, use the **dev-only mock issuer** for speed, but keep it fenced to `NODE_ENV=test`.

---
