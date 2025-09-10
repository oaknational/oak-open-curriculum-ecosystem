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

### Configuration Examples

```bash
# .env file (gitignored)
NOTION_API_KEY=secret_your_actual_key_here

# System environment
export NOTION_API_KEY="secret_your_actual_key_here"
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

- All operations are read-only by default
- No modifications to Notion data are possible
- The system cannot:
  - Create pages or databases
  - Update existing content
  - Delete any data
  - Modify permissions

All external inputs are validated using strict Zod schemas where appropriate:

- **Request Parameters**: Validated before processing
- **Environment Variables**: Validated on startup
- **API Responses**: Validated before use

### Example Validation

```typescript
const SearchArgsSchema = z.object({
  query: z.string().min(1).max(1000),
  filter: z
    .object({
      type: z.enum(['page', 'database']).optional(),
    })
    .optional(),
  sort: z
    .object({
      direction: z.enum(['ascending', 'descending']).optional(),
      timestamp: z.enum(['last_edited_time']).optional(),
    })
    .optional(),
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

## Network Security

### HTTPS Only

- All Notion API calls use HTTPS
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

- **Node.js 22+**: Latest security patches
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

Report security issues to: [security contact to be added]

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
