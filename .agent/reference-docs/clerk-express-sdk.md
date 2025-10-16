<!-- markdownlint-disable -->
<!-- original: https://clerk.com/docs/reference/express/overview -->

---

title: Clerk Express SDK
description: The Clerk Express SDK provides a powerful set of tools and
utilities to seamlessly integrate authentication, user management, and
organization management into your Express application.
sdk: expressjs
sdkScoped: "true"
canonical: /docs/reference/express/overview
lastUpdated: 2025-10-14T19:40:44.000Z
availableSdks: expressjs
notAvailableSdks: nextjs,react,js-frontend,chrome-extension,expo,android,ios,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: expressjs

---

The Clerk Express SDK provides a powerful set of tools and utilities to seamlessly integrate authentication, user management, and organization management into your Express application. Refer to the [quickstart](/docs/expressjs/getting-started/quickstart) to get started.

> \[!IMPORTANT]
> If you are upgrading from the Node SDK, see the [upgrade guide](/docs/guides/development/upgrading/upgrade-guides/node-to-express) for more information.

## `clerkMiddleware()`

The `clerkMiddleware()` middleware checks the request's cookies and headers for a session JWT and if found, attaches the <SDKLink href="/docs/reference/backend/types/auth-object" sdks={["js-backend"]} code={true}>Auth</SDKLink> object to the `request` object under the `auth` key. See the [reference doc](/docs/reference/express/clerk-middleware) for more information.

## `requireAuth()`

The `requireAuth()` middleware acts similarly to [`clerkMiddleware()`](#clerk-middleware), but also protects your routes by redirecting unauthenticated users to the homepage. See the [reference doc](/docs/reference/express/require-auth) for more information.

## `getAuth()`

The `getAuth()` helper retrieves authentication state from the `request` object. It returns the <SDKLink href="/docs/reference/backend/types/auth-object" sdks={["js-backend"]} code={true}>Auth object</SDKLink>{{ target: '_blank' }}, which includes helpful authentication information like the user's ID, session ID, and organization ID. It's also useful for protecting routes. See the [reference doc](/docs/reference/express/get-auth) for more information.

## `clerkClient`

<SDKLink href="/docs/js-backend/getting-started/quickstart" sdks={["js-backend"]}>Clerk's JS Backend SDK</SDKLink> provides access to Backend API resources and low-level authentication utilities for JavaScript environments. For example, to retrieve a list of all users in your application, you can use the `users.getUserList()` method from the JS Backend SDK instead of manually making a fetch request to the `https://api.clerk.com/v1/users` endpoint.

All resource operations are mounted as sub-APIs on the `clerkClient` object. See the <SDKLink href="/docs/js-backend/getting-started/quickstart#usage" sdks={["js-backend"]}>reference documentation</SDKLink>{{ target: '_blank' }} for more information.

### Example: Use `clerkClient` to get a user's information

The following example uses `clerkClient` to get information about the currently signed-in user. If the user is authenticated, their `userId` is passed to <SDKLink href="/docs/reference/backend/user/get-user" sdks={["js-backend"]} code={true}>clerkClient.users.getUser()</SDKLink>{{ target: '_blank' }} to get the current user's <SDKLink href="/docs/reference/javascript/user" sdks={["js-frontend"]} code={true}>User</SDKLink>{{ target: '_blank' }} object. If not authenticated, the request is rejected with a `401` status code.

```js
import { clerkClient, clerkMiddleware, getAuth } from '@clerk/express';
import express from 'express';

const app = express();
const PORT = 3000;

// Apply `clerkMiddleware()` to all routes
app.use(clerkMiddleware());

app.get('/user', async (req, res) => {
  // Use `getAuth()` to access `isAuthenticated` and the user's ID
  const { isAuthenticated, userId } = getAuth(req);

  // If user isn't authenticated, return a 401 error
  if (!isAuthenticated) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Use `clerkClient` to access Clerk's JS Backend SDK methods
  // and get the user's User object
  const user = await clerkClient.users.getUser(userId);

  res.json(user);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```
