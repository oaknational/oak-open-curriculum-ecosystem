# ADR-015: Node.js 22+ Requirement

## Status

Accepted

## Context

We need to decide on the minimum Node.js version to support. This affects:

- Available language features
- API availability
- ESM support quality
- Performance characteristics
- Security updates

## Decision

Require Node.js version 22 or higher.

## Rationale

- **ESM Maturity**: Node.js 22 has excellent ESM support
- **Modern Features**: Access to latest JavaScript features
- **Performance**: Significant performance improvements
- **Security**: Latest security fixes and updates
- **API Stability**: Stable APIs for our use cases
- **No Legacy Burden**: Can use modern patterns without polyfills

## Consequences

### Positive

- Can use latest JavaScript/TypeScript features
- Better ESM support out of the box
- Improved performance and security
- Cleaner code without compatibility workarounds
- Access to newer Node.js APIs

### Negative

- Limits adoption by users on older Node versions
- May not work in some enterprise environments
- Requires developers to update Node.js
- Some CI/CD systems may need updates

## Implementation

- Set "engines" field in package.json
- Document requirement in README
- Configure TypeScript target appropriately
- Use Node.js 22+ features freely
- Test against Node.js 22 in CI
- Provide clear error message for older versions
