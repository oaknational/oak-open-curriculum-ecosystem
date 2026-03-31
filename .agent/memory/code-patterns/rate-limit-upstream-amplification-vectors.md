---
name: "Rate-Limit Upstream Amplification Vectors"
use_this_when: "A route produces an upstream request (API call, redirect, proxy fetch) as a side effect of handling an inbound request"
category: architecture
proven_in: "apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-handlers.ts, apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.ts"
proven_date: 2026-03-31
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Unprotected routes that amplify inbound requests into upstream API load, exhausting per-key quotas or third-party rate limits"
  stable: true
---

# Rate-Limit Upstream Amplification Vectors

## Pattern

When a route produces an upstream side effect (API call, redirect to a
third-party auth server, proxy fetch), the inbound route must be
rate-limited even if the CDN already provides volumetric protection.

The CDN catches DDoS. Application-layer rate limiting catches targeted
abuse below CDN thresholds — an attacker sending 100 requests/minute
from varied IPs won't trigger CDN limits but will exhaust your upstream
API quota.

## Anti-Pattern

```typescript
// ❌ No rate limit — each GET produces an upstream Clerk session
router.get('/oauth/authorize', (req, res) => {
  res.redirect(buildAuthorizeUrl(req.query));
});

// ❌ No rate limit — each GET with a valid HMAC produces an upstream
// API fetch using the server's API key
router.get('/assets/:id', hmacValidated, (req, res) => {
  proxyUpstream(req, res, serverApiKey);
});
```

## Correct Pattern

```typescript
// ✅ Rate-limited — attacker cannot exhaust upstream quota
router.get('/oauth/authorize', oauthLimiter, (req, res) => {
  res.redirect(buildAuthorizeUrl(req.query));
});

router.get('/assets/:id', assetLimiter, hmacValidated, (req, res) => {
  proxyUpstream(req, res, serverApiKey);
});
```

## Two Amplification Shapes

1. **Redirect amplification**: the inbound request causes the client's
   browser to follow a redirect to a third party. The third party
   allocates state (an OAuth session, a CAPTCHA challenge). Cheap for
   the attacker, expensive for the third party.

2. **Proxy amplification**: the inbound request triggers a server-side
   fetch to an upstream API using a shared credential (API key, service
   account). The upstream rate limit is per-credential, not per-user —
   one attacker can exhaust quota for all users.

## When Not to Apply

- Static, cacheable, read-only routes with no upstream side effects
  (landing pages, health checks) — CDN caching is sufficient
- Routes already behind strong per-user authentication where the auth
  layer itself provides rate limiting (e.g., Clerk's built-in limits)
