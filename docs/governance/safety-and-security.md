# Safety and Security

## Overview

The Oak MCP Servers are designed with security and privacy as core principles. This document outlines the security measures, safety controls, and privacy protections implemented throughout the system.

## Core Security Principles

1. **Principle of Least Privilege**: Read-only access by default
2. **Defence in Depth**: Multiple layers of security controls
3. **Privacy by Design**: Automatic PII protection
4. **Fail Secure**: Safe defaults when errors occur
5. **No Trust Assumptions**: Validate all inputs

## API Key Security

### Storage and Management

- **Environment Variables Only**: API keys must be stored in environment variables or `.env` files
- **Never in Code**: Keys are never hardcoded or committed to version control
- **Validation on Startup**: Keys are validated using Zod schemas before use
- **No Logging**: API keys are never logged, even at debug level
- **Local Env Files**: Use `.env` and `.env.local` for local credentials. Keep these files untracked.

### Line-Specific Exceptions

The repo is scanned with `gitleaks` in CI and pre-push. Broad allowlisting is not
permitted. If a token-like placeholder must remain in tracked docs, use a
line-specific allowlist comment:

```text
OAK_API_KEY=oak_example_token # gitleaks:allow
```

Use path-level allowlisting only for `.agent/reference/**`, which contains
third-party examples.

Escalation path:

- `pnpm secrets:scan:all` for local commit/branch checks
- `pnpm secrets:scan:all-refs` for repository forensics

### Configuration Examples

```bash
# .env file (gitignored)
OAK_API_KEY=your_oak_api_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

### Key Rotation

- Keys can be rotated by updating environment variables
- No application code changes required
- Server restart required for new keys to take effect

## Privacy Protection

### PII Scrubbing

The system automatically scrubs Personally Identifiable Information (PII) to protect user privacy:

- **Email Addresses**: Automatically redacted to show only first 3 characters
  - Example: `john.doe@example.com` → `joh...@example.com`
- **Consistent Application**: Applied to all user data across all outputs
- **Pure Function Implementation**: Testable and reliable

### Implementation

```typescript
// Located in src/utils/scrubbing.ts
export function scrubEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!domain || localPart.length <= 3) return email;
  return `${localPart.slice(0, 3)}...@${domain}`;
}
```

## Access Control

### Read-Only Operations (Phase 2)

- All MCP tool operations that call the Oak Curriculum API are read-only
- The system cannot modify upstream curriculum data

All external inputs are validated using strict Zod schemas where appropriate:

- **Request Parameters**: Validated before processing
- **Environment Variables**: Validated on startup
- **API Responses**: Validated before use

### Example Validation

```typescript
const SearchArgsSchema = z.object({
  query: z.string().min(1).max(1000),
  scope: z.enum(['all', 'lessons', 'units', 'threads', 'sequences']).default('all'),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
});
```

## Error Handling Security

### Information Disclosure Prevention

- **Sanitized Error Messages**: Internal details never exposed to users
- **Stack Traces**: Only shown in development mode
- **API Errors**: Mapped to generic user-friendly messages
- **Logging**: Sensitive data scrubbed from logs

### Error Classification

Errors are classified and handled appropriately:

- **Validation Errors**: Return specific field errors without internal details
- **Not Found**: Generic "resource not found" without revealing structure
- **Permission Errors**: No indication of what permissions are needed
- **Rate Limits**: Clear message without exposing limits
- **Internal Errors**: Generic message, details logged internally only

## Multi-Layer Security Architecture

The HTTP MCP server operates behind multiple defence layers. Each layer
catches threats the others miss. No single layer is sufficient alone.

### Layer Stack

| Layer                        | Protection                                                                                                                               | Failure Mode                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **DNS**                      | DNS rebinding guard rejects requests with unrecognised `Host` headers. Applied selectively (landing page); MCP routes use OAuth instead. | Bypassed if attacker controls DNS for an allowed host                     |
| **CDN/Edge**                 | Volumetric DDoS, geographic blocking, bot detection, TLS termination (Vercel edge)                                                       | Bypassed by direct origin access or low-rate attacks below CDN thresholds |
| **Application — auth**       | OAuth 2.1 via Clerk (`mcpAuth` middleware), CORS, security headers (CSP, HSTS, X-Frame-Options)                                          | Bypassed if OAuth token compromised or auth disabled                      |
| **Application — rate limit** | Per-IP rate limiting on auth-protected routes (`express-rate-limit`). Probabilistic on Vercel serverless (per-instance in-memory store). | Distributed attacks across IPs; counter reset on cold start               |
| **Upstream API**             | Oak API per-key rate limiting and quota management                                                                                       | Exhaustible via amplification from our server                             |

### Trust Boundaries

- **Client → CDN**: untrusted; CDN applies edge protection
- **CDN → app origin**: semi-trusted; `trust proxy` must be configured
  for `req.ip` to reflect the real client IP
- **App → upstream API**: authenticated via `OAK_API_KEY`; our server is
  the trust principal, not the end user
- **Iframe sandbox → host**: OpenAI Apps SDK widget runs in a sandboxed
  iframe; CSP `connect_domains` and `resource_domains` control outbound
  requests

### Amplification Vectors

Two patterns allow a single inbound request to produce upstream load:

1. **OAuth authorise redirect**: `GET /oauth/authorize` produces a 302 to
   Clerk's authorisation server. Each hit creates a pending session at
   Clerk, consuming per-application quota. The attacker needs no auth —
   the redirect is public.

2. **HMAC-signed asset replay**: Asset download URLs are HMAC-signed with
   a 5-minute TTL but no single-use constraint. Within the window, a
   valid URL can be replayed to generate unlimited upstream Oak API
   requests, all authenticated with the server's `OAK_API_KEY`.

Both are mitigated by application-layer rate limiting (see the rate
limiting plan in `.agent/plans/architecture-and-infrastructure/current/`).

## Network Security

### HTTPS Only

- All Oak API and Elasticsearch calls use HTTPS
- No option to disable SSL/TLS
- Certificate validation enabled

## Secure Development Practices

### Type Safety

- **No `any` Types**: Strict TypeScript throughout
- **No Type Assertions**: No `as` casting
- **Runtime Validation**: Zod schemas at boundaries

### Testing

- **Security Test Cases**: PII scrubbing tested
- **Error Message Tests**: Verify no information leakage
- **Input Validation Tests**: Edge cases and injection attempts

### Code Review

- All code reviewed before merge
- Security considerations in PR template
- Automated security checks in CI/CD

## Deployment Security

### Package Security

- **Minimal Dependencies**: Only essential packages
- **Regular Updates**: Dependencies kept current
- **Vulnerability Scanning**: npm audit in CI/CD
- **Lock Files**: Exact versions via pnpm-lock.yaml

### Runtime Security

- **Node.js 24.x**: Latest security patches
- **ESM Only**: Modern module system
- **No Eval**: No dynamic code execution
- **Strict Mode**: JavaScript strict mode enabled

## Compliance Considerations

### GDPR/Privacy

- PII automatically scrubbed
- No data persistence
- No tracking or analytics
- User data not stored

## Security Incident Response

### Vulnerability Reporting

Report security issues by following the instructions in the
[SECURITY.md](../../SECURITY.md) file at the repository root, which
points to Oak's canonical security disclosure process at
[www.thenational.academy/.well-known/security.txt](https://www.thenational.academy/.well-known/security.txt).

Do not report security issues via public GitHub issues.

### Update Process

1. Security patches released as soon as possible
2. Users notified via GitHub security advisories
3. Semantic versioning for clear update paths

## Security Checklist for Developers

Before committing code:

- [ ] No hardcoded secrets or API keys
- [ ] All inputs validated with Zod
- [ ] Error messages don't leak internal details
- [ ] PII properly scrubbed in outputs
- [ ] No use of `any` or type assertions
- [ ] Security implications documented
- [ ] Tests cover security edge cases
