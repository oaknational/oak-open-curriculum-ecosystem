# Oak OpenAPI - Authentication & Rate Limiting Deep Dive

## Authentication System

### Architecture Overview

```
Request
  ↓
Next.js API Route
  ↓
createContext() [src/lib/context.ts]
  ↓
withUser(req)
  ↓
Extract Authorization header
  ↓
Parse Bearer token
  ↓
findUserByKey(token) [Redis lookup]
  ↓
Context with user object
  ↓
protectedProcedure middleware
  ↓
protect() checks authentication
  ↓
getRateLimiter() based on user.rateLimit
  ↓
rateLimiter.check(user)
  ↓
Handler executes if auth + rate limit pass
```

### Implementation Details

#### 1. Request Context Creation

**File:** `src/lib/context.ts`

```typescript
export const createContext = async ({ req, resHeaders }: FetchCreateContextFnOptions) => {
  // Set CORS headers (wide open)
  resHeaders.set('access-control-allow-origin', '*');
  resHeaders.set('access-control-allow-methods', 'GET, POST, OPTIONS');
  resHeaders.set('access-control-allow-headers', 'Content-Type, Authorization');

  // Extract user from Authorization header
  const user = await withUser(req);

  // Log request (forwarded to Datadog)
  console.info(
    JSON.stringify({
      userId: user?.id,
      url: req.url,
      query: info.url?.searchParams.toString(),
    }),
  );

  return {
    req,
    resHeaders,
    rateLimit: undefined,
    user,
  };
};
```

#### 2. User Extraction

**File:** `src/lib/context.ts`

```typescript
export const withUser = async (req: Request) => {
  let user: User | null = null;

  const authorization = req.headers.get('authorization');

  if (authorization) {
    const token = authorization?.split(' ')[1]; // Bearer {token}
    if (token) {
      user = await findUserByKey(token);
    }
  }

  return user;
};
```

**Notes:**

- Authorization header format: `Authorization: Bearer {api-key}`
- No other authentication schemes supported
- Invalid tokens return `null` user (fails in protect middleware)

#### 3. User Lookup (Redis)

**File:** `src/lib/apikeys.ts`

```typescript
export async function findUserByKey(key: string, log: boolean = true): Promise<User | null> {
  const user: User | null = await redis.hgetall(`user:${key}`);

  if (user) {
    // Track request count
    if (log) {
      await redis.hincrby(`user:${key}`, 'requests', 1);
      await redis.hset(`user:${key}`, { lastRequest: new Date().toJSON() });
    }

    // Set default rate limit if not specified
    if (user.rateLimit === undefined || user.rateLimit === null) {
      user.rateLimit = defaultRateLimit;
    }

    return user;
  }

  return null;
}
```

**Redis Data Structure:**

```
Key: user:{api-key}
Type: Hash
Fields:
  - id: number (auto-increment)
  - key: string (the API key itself)
  - email: string | null
  - name: string | null
  - company: string | null
  - rateLimit: number (requests per hour)
  - requests: number (lifetime total)
  - lastRequest: ISO timestamp string
```

**Secondary Index:**

```
Key: user:email:{email}
Type: String
Value: {api-key}
```

#### 4. Protected Procedure Middleware

**File:** `src/lib/protect.ts`

```typescript
const protectLogic = async (ctx: Context, meta?: OpenApiMeta): Promise<void> => {
  const { user, resHeaders } = ctx;
  const noCost: boolean = (meta?.noCost as boolean) || false;

  // 1. Check authentication
  if (!user) {
    throw new TRPCError({
      message: 'API token not provided or invalid',
      code: 'UNAUTHORIZED',
    });
  }

  // 2. Get appropriate rate limiter for user
  const rateLimit = getRateLimiter(user.rateLimit);

  // 3. Check rate limit
  const limit = await rateLimit.check(user, noCost);

  // 4. Set rate limit headers
  if (limit.isSubjectToRateLimiting) {
    resHeaders.set('X-RateLimit-Limit', limit.limit.toString());
    resHeaders.set('X-RateLimit-Remaining', limit.remaining.toString());
    resHeaders.set('X-RateLimit-Reset', limit.reset.toString());

    // 5. Reject if over limit
    if (limit.remaining <= 0 && !noCost) {
      resHeaders.set('X-Retry-After', limit.reset.toString());
      console.log('Rate limit exceeded for user %s', user.key);

      throw new TRPCError({
        message: 'Rate limited exceeded',
        code: 'TOO_MANY_REQUESTS',
      });
    }
  }
};

export const protectedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next, meta }) => {
    await protectLogic(ctx, meta);
    return next({ ctx });
  }),
);
```

**Error Responses:**

Unauthorized:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "API token not provided or invalid"
  }
}
```

Status: 401

Rate Limited:

```json
{
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Rate limited exceeded"
  }
}
```

Status: 429

---

## Rate Limiting System

### Configuration

**File:** `src/lib/rateLimit.ts`

```typescript
export const defaultRateLimit = 1000; // requests per hour

export const rateLimits = {
  // Standard rate limit (for most users)
  standard: new RateLimit({
    redis,
    prefix: 'rateLimit:standard',
    analytics: true,
    limiter: RateLimit.slidingWindow(defaultRateLimit, '1 h'),
  }),

  // Custom rate limit (per-user configured)
  custom: (limit: number) =>
    new RateLimit({
      redis,
      prefix: `rateLimit:${limit}-`,
      analytics: true,
      limiter: RateLimit.slidingWindow(limit, '1 h'),
    }),
};
```

### Rate Limiter Selection

**File:** `src/lib/protect.ts`

```typescript
export const getRateLimiter = (userLimit: number | undefined | null) => {
  if (userLimit !== defaultRateLimit && typeof userLimit === 'number') {
    return rateLimiter(rateLimits.custom(userLimit));
  } else {
    // Use standard rate limit
    return rateLimiter(rateLimits.standard);
  }
};
```

**Logic:**

1. If user has custom `rateLimit` set (not 1000), create custom limiter
2. Otherwise use shared standard limiter
3. Each custom limit gets its own Redis prefix

### Unlimited Access

**File:** `src/lib/rateLimit.ts`

```typescript
function isUnlimited(user: User): boolean {
  // 1. Explicit unlimited flag
  if (user.rateLimit === 0) {
    return true;
  }

  // 2. Master API key check
  const oakAuthToken = process.env.OAK_API_AUTH_TOKEN;
  if (!oakAuthToken) {
    return false;
  }

  return user.key === oakAuthToken;
}
```

**Unlimited Triggers:**

- `rateLimit: 0` in user record
- API key matches `OAK_API_AUTH_TOKEN` environment variable

**When unlimited:**

```json
{
  "isSubjectToRateLimiting": false
}
```

No rate limit headers sent, no Redis checks performed.

### Rate Limit Check Implementation

**File:** `src/lib/rateLimit.ts`

```typescript
export const rateLimiter = (rateLimit: RateLimit): RateLimiter => {
  return {
    check: async (user: User, noCost = false) => {
      const apiKey = user.key;

      // 1. Check if unlimited
      if (isUnlimited(user)) {
        return { isSubjectToRateLimiting: false };
      }

      // 2. No-cost check (just get current state)
      if (noCost === false) {
        const { pending, ...rest } = await rateLimit.limit(apiKey);
        await pending; // Wait for analytics to be written

        return {
          isSubjectToRateLimiting: true,
          ...rest, // limit, remaining, reset
        };
      } else {
        // Get remaining without incrementing
        const res = await rateLimit.getRemaining(apiKey);

        return {
          isSubjectToRateLimiting: true,
          limit: user.rateLimit ?? defaultRateLimit,
          remaining: res.remaining,
          reset: res.reset,
        };
      }
    },
  };
};
```

### Rate Limit Algorithm: Sliding Window

**Provider:** Upstash Rate Limit library (`@upstash/ratelimit`)

**Algorithm:** Sliding Window Counter

**How it works:**

1. Time divided into 1-hour windows
2. Each request increments counter for current window
3. Counter includes fractional amount from previous window
4. Example: 30 minutes into new hour, 50% of previous hour's requests count

**Formula:**

```
current_usage = current_window_count + (previous_window_count * (1 - elapsed_fraction))
```

**Advantages:**

- Prevents burst at window boundaries (vs fixed window)
- More lenient than fixed window
- Efficient storage (only 2 counters needed)

**Redis Keys:**

```
rateLimit:standard:{api-key}:current
rateLimit:standard:{api-key}:previous
```

### Rate Limit Response Headers

**Always Sent (when rate limited):**

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1702123456
```

**On Rate Limit Exceeded:**

```http
X-Retry-After: 1702123456
```

**Header Meanings:**

- `X-RateLimit-Limit`: Total requests allowed per window
- `X-RateLimit-Remaining`: Requests left in current window
- `X-RateLimit-Reset`: Unix timestamp when window resets
- `X-Retry-After`: When to retry (same as Reset)

### No-Cost Endpoints

Some endpoints don't consume rate limit quota:

**File:** Handler metadata

```typescript
.meta({
  openapi: {
    // ... other fields
  },
  noCost: true, // This endpoint doesn't count against quota
})
```

**Current No-Cost Endpoints:**

- `GET /rate-limit` - Check your current rate limit status

**Implementation:**
When `noCost: true`, the rate limiter calls `getRemaining()` instead of `limit()`, which doesn't increment the counter.

---

## User Management

### API Key Generation

**UI:** `/admin` page (web interface)  
**API:** `POST /api/admin/create-api-key`

**Process:**

1. User submits form with name, email, company
2. Backend calls `addUser()` function
3. UUID generated for API key
4. User record created in Redis
5. API key returned (shown once)

**File:** `src/lib/apikeys.ts`

```typescript
export async function addUser(opts: UserUpdate = {}) {
  return manageUser(opts);
}

async function manageUser({
  email = null,
  name = null,
  company = null,
  rateLimit = defaultRateLimit,
  requests = 0,
  key = uuid(), // Auto-generate UUID
}: UserUpdate = {}): Promise<string> {
  const userExists = await redis.exists(`user:${key}`);

  if (!userExists) {
    const id = await redis.incr('next_user_id');

    const user = {
      id,
      key,
      email,
      name,
      company,
      rateLimit,
      requests,
    };

    // Store user
    await redis.hset(`user:${key}`, user);

    // Create email index
    if (email) {
      await redis.set(`user:email:${email}`, key);
    }
  }

  return key; // Return the API key
}
```

**Security Notes:**

- Admin panel has NO authentication
- Relies on deployment-level protection (Vercel password protection)
- API keys are UUIDs (v4), not cryptographically signed
- Keys stored in plaintext in Redis (not hashed)

### CLI User Management

**Script:** `bin/find-api-user.ts`

**Usage:**

Find user by email:

```bash
pnpm with-env tsx bin/find-api-user.ts user:email:user@example.com
```

Update rate limit:

```bash
pnpm with-env tsx bin/find-api-user.ts user:email:user@example.com 5000
```

Set unlimited:

```bash
pnpm with-env tsx bin/find-api-user.ts user:email:user@example.com 0
```

Search for users:

```bash
pnpm with-env tsx bin/find-api-user.ts example
```

**Implementation:**

```typescript
// Find by email
if (str.startsWith('user:email:')) {
  const email = str.replace('user:email:', '');
  data = await findUserByEmail(email);

  // Update rate limit if provided
  if (data && process.argv[3]) {
    const rate = parseInt(process.argv[3], 10);
    const update = { ...data, rateLimit: rate } as UserUpdateWithKey;
    await updateUser(update);
    data = await findUserByEmail(email);
  }
} else {
  // Search by partial match
  data = await findUsers(str);
}
```

### Update User

**File:** `src/lib/apikeys.ts`

```typescript
export async function updateUser(opts: UserUpdateWithKey): Promise<string> {
  if (!opts.key) {
    throw new Error('opts.key is required');
  }

  const userExists = await redis.exists(`user:${opts.key}`);

  if (!userExists) {
    throw new Error('User does not exist');
  }

  return manageUser(opts);
}
```

**Updatable Fields:**

- `email`
- `name`
- `company`
- `rateLimit`

**Non-updatable Fields:**

- `key` (immutable)
- `id` (immutable)
- `requests` (only incremented automatically)

---

## Redis Instance Details

**Provider:** Upstash (Serverless Redis)  
**Instance:** `https://dominant-hippo-43403.upstash.io`  
**Access:** REST API (not direct Redis protocol)

**Configuration:**

```typescript
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
```

**Why REST API:**

- Compatible with serverless/edge functions
- No persistent connections needed
- Works in Vercel's constrained environment

**Performance:**

- Typical latency: 10-50ms (depending on region)
- Global replication available
- Persistent storage (not in-memory only)

---

## Security Analysis

### Strengths

✅ Rate limiting prevents abuse  
✅ All endpoints require authentication  
✅ User activity tracked (request counts, timestamps)  
✅ Sliding window prevents burst attacks  
✅ Per-user rate limit customization

### Weaknesses

❌ Admin panel has no authentication  
❌ API keys not hashed (stored plaintext in Redis)  
❌ No key rotation mechanism  
❌ No key expiration support  
❌ No IP-based rate limiting (only per-key)  
❌ No request signing or HMAC validation  
❌ CORS wide open (any origin can call API)

### Recommendations

1. **Admin Panel Authentication**
   - Add proper auth (e.g., NextAuth.js)
   - Or remove UI, use CLI only
   - Or restrict to VPN/IP allowlist

2. **API Key Hashing**
   - Hash keys before storing (bcrypt/argon2)
   - Generate separate lookup token + secret
   - Prevents key theft if Redis compromised

3. **Key Rotation**
   - Support multiple active keys per user
   - Allow key invalidation without deleting user
   - Track key creation/last used timestamps

4. **Enhanced Rate Limiting**
   - Add IP-based rate limiting (defense in depth)
   - Different limits per endpoint type
   - Burst allowance separate from sustained rate

5. **Request Signing**
   - HMAC signatures for request integrity
   - Timestamp validation to prevent replay
   - Similar to AWS Signature v4

6. **Audit Logging**
   - Log all API key creation/deletion
   - Log rate limit modifications
   - Alert on suspicious patterns

---

## Testing Authentication & Rate Limiting

**File:** `__tests__/auth.test.ts`

Test helper:

```typescript
export function authedCaller(user: User) {
  const createMockContext = () => ({
    req: {} as Request,
    resHeaders: new Headers(),
    user,
    rateLimit: undefined,
  });

  return {
    caller: createCallerFactory(router)(createMockContext),
    ctx: createMockContext(),
  };
}
```

Example test:

```typescript
test('rate limit reduces', async () => {
  const user: User = {
    id: 1,
    key: 'test-normal-rate',
  };
  const { caller } = authedCaller(user);

  const beforeRequest = await caller.getRateLimit.getRateLimit();
  await caller.getSubjects.getAllSubjects();
  const afterRequest = await caller.getRateLimit.getRateLimit();

  expect(afterRequest.remaining).toBe(beforeRequest.remaining - 1);
});
```

**Mock Strategy:**
Tests mock the rate limiter to avoid actual Redis calls:

```typescript
vi.mock('@/lib/rateLimit', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    rateLimiter: () => ({
      check: vi.fn(() => ({
        isSubjectToRateLimiting: false,
      })),
    }),
  };
});
```

---

## Analytics & Observability

### Request Tracking

**Per Request:**

```typescript
console.info(
  JSON.stringify({
    userId: user?.id,
    url: req.url,
    query: info.url?.searchParams.toString(),
  }),
);
```

Forwarded to Datadog for analysis.

### Per User (in Redis):

- `requests` - Lifetime total request count
- `lastRequest` - ISO timestamp of most recent request

**Query User Activity:**

```bash
redis-cli hgetall user:{api-key}
```

### Rate Limit Analytics

Upstash Rate Limit library tracks:

- Request patterns over time
- Rate limit hits
- Available via Upstash dashboard

---

## Future Enhancements

### Considered Features

1. **OAuth 2.0** - Replace API keys with OAuth tokens
2. **API Key Scopes** - Limit keys to specific endpoints/resources
3. **Webhook Callbacks** - Notify users when nearing rate limit
4. **Usage Dashboard** - Per-user analytics portal
5. **Team Accounts** - Multiple users sharing quota
6. **Pay-as-you-go** - Dynamic rate limits based on payment

### Implementation Complexity

- OAuth: High (requires auth server, token refresh)
- Scopes: Medium (middleware enhancement)
- Webhooks: Low (background job)
- Dashboard: Medium (new UI + API)
- Teams: High (data model changes)
- Paid tiers: High (payment integration, billing)

